from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from torchvision import transforms
from PIL import Image
import torch
import io
import json
import logging
import os
import sys
from pathlib import Path
from typing import Optional
from identify_plant import load_model

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.absolute()
print(f"🔍 Script directory: {SCRIPT_DIR}")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="Plant Identification API",
    description="AI-powered plant identification service for Southeast Asian orchids",
    version="1.0.0"
)

# Configure CORS - Essential for React Native connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load class names from JSON file (with proper path resolution)
def load_class_names():
    """Load class names with proper path resolution"""
    possible_paths = [
        SCRIPT_DIR / "class_names.json",  # Same directory as script
        Path("class_names.json"),  # Current working directory
        Path("src/flora_identification/class_names.json"),  # From project root
    ]

    for path in possible_paths:
        if path.exists():
            logger.info(f"📁 Found class_names.json at: {path}")
            with open(path, "r") as f:
                return json.load(f)

    # If no file found, show all attempted paths
    logger.error("❌ class_names.json not found in any of these locations:")
    for path in possible_paths:
        logger.error(f"   - {path.absolute()}")

    raise FileNotFoundError("class_names.json not found")


def load_plant_model():
    """Load the plant identification model with proper path resolution"""
    possible_model_paths = [
        SCRIPT_DIR / "identify_plant.pth",  # Same directory as script
        Path("identify_plant.pth"),  # Current working directory
        Path("src/flora_identification/identify_plant.pth"),  # From project root
    ]

    for path in possible_model_paths:
        if path.exists():
            logger.info(f"🤖 Found model file at: {path}")
            return load_model(num_classes=NUM_CLASSES, path=str(path))

    # If no model found, show all attempted paths
    logger.error("❌ identify_plant.pth not found in any of these locations:")
    for path in possible_model_paths:
        logger.error(f"   - {path.absolute()}")

    raise FileNotFoundError("identify_plant.pth not found")


# Load class names
try:
    class_names = load_class_names()
    NUM_CLASSES = len(class_names)
    logger.info(f"✅ Loaded {NUM_CLASSES} plant class names")
    logger.info(f"📋 Species: {', '.join(class_names[:5])}{'...' if len(class_names) > 5 else ''}")
except Exception as e:
    logger.error(f"❌ Failed to load class names: {str(e)}")
    raise RuntimeError("Could not initialize the application: missing or invalid class_names.json")

# Load the trained model
try:
    model = load_plant_model()
    logger.info("✅ Plant identification model loaded successfully")
except Exception as e:
    logger.error(f"❌ Model loading failed: {str(e)}")
    raise RuntimeError("Could not initialize the model")

# Image transformation pipeline - matches training preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Match ViT input size
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])  # Normalize RGB channels
])


# Root endpoint for API info
@app.get("/")
async def root():
    """API information"""
    return {
        "name": "Plant Identification API",
        "version": "1.0.0",
        "description": "AI-powered identification of Southeast Asian orchid species",
        "model": "Vision Transformer (ViT) Tiny",
        "species_count": NUM_CLASSES,
        "script_directory": str(SCRIPT_DIR),
        "endpoints": {
            "identify": "POST / (with image file)",
            "health": "GET /healthcheck"
        },
        "supported_formats": ["PNG", "JPG", "JPEG"],
        "max_file_size": "1MB"
    }


# Main plant identification endpoint
@app.post("/")
async def identify_plant(
        file: UploadFile = File(...),
        confidence_threshold: Optional[float] = 0.4
):
    """
    Identify plant species from uploaded image

    Args:
        file: Image file (PNG, JPG, JPEG)
        confidence_threshold: Minimum confidence for positive identification (default: 0.4)

    Returns:
        JSON with predicted_class, confidence, and success status
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            logger.warning(f"Invalid file type: {file.content_type}")
            raise HTTPException(
                status_code=400,
                detail="File must be an image (PNG, JPG, or JPEG)"
            )

        # Check file size (rough estimate from content-length header)
        if hasattr(file, 'size') and file.size and file.size > 1048576:  # 1MB
            raise HTTPException(
                status_code=400,
                detail="File size must be less than 1MB"
            )

        logger.info(f"🔍 Processing image: {file.filename} ({file.content_type})")

        # Read and process image
        image_bytes = await file.read()
        logger.info(f"📊 Image size: {len(image_bytes)} bytes")

        # Open and convert image
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            logger.info(f"📐 Image dimensions: {image.size}")
        except Exception as e:
            logger.error(f"❌ Image processing failed: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail="Could not process image file. Please ensure it's a valid PNG, JPG, or JPEG image."
            )

        # Apply transformations
        try:
            input_tensor = transform(image).unsqueeze(0)
            logger.info(f"✅ Image preprocessed successfully")
        except Exception as e:
            logger.error(f"❌ Image transformation failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Image preprocessing failed"
            )

        # Run model inference
        try:
            with torch.no_grad():
                output = model(input_tensor)
                probs = torch.nn.functional.softmax(output, dim=1)
                confidence, predicted_class = probs.max(1)
                confidence = confidence.item()
                predicted_index = predicted_class.item()

            logger.info(f"🧠 Model inference completed - Index: {predicted_index}, Confidence: {confidence:.4f}")
        except Exception as e:
            logger.error(f"❌ Model inference failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Plant identification failed during model inference"
            )

        # Determine final prediction
        if confidence < confidence_threshold:
            label = "Unknown plant"
            logger.info(f"🤷 Low confidence prediction: {class_names[predicted_index]} ({confidence:.4f}) -> Unknown")
        else:
            label = class_names[predicted_index]
            logger.info(f"✅ High confidence prediction: {label} ({confidence:.4f})")

        # Prepare response
        response = {
            "predicted_class": label,
            "confidence": round(confidence, 4),
            "success": True,
            "threshold_used": confidence_threshold,
            "raw_prediction": class_names[predicted_index] if confidence >= confidence_threshold else None
        }

        logger.info(f"📤 Returning result: {label} with {confidence:.2%} confidence")
        return response

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error during plant identification: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during plant identification"
        )


# Health check endpoint
@app.get("/healthcheck")
async def healthcheck():
    """Health check endpoint for monitoring"""
    try:
        # Test model is loaded
        test_tensor = torch.randn(1, 3, 224, 224)
        with torch.no_grad():
            _ = model(test_tensor)

        return {
            "status": "healthy",
            "model_loaded": True,
            "species_count": NUM_CLASSES,
            "script_directory": str(SCRIPT_DIR),
            "working_directory": str(Path.cwd()),
            "message": "Plant identification service is ready"
        }
    except Exception as e:
        logger.error(f"❌ Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "model_loaded": False,
            "error": str(e)
        }


# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Plant Identification API Starting...")
    logger.info(f"📁 Script location: {SCRIPT_DIR}")
    logger.info(f"📁 Working directory: {Path.cwd()}")
    logger.info(f"🌿 Service: Southeast Asian Orchid Identification")
    logger.info(f"📊 Model: Vision Transformer (ViT)")
    logger.info(f"🏷️  Classes: {NUM_CLASSES} species")
    logger.info(f"🌐 CORS: Enabled for all origins")
    logger.info(f"📱 Ready for mobile app connections")
    logger.info("✅ Startup complete!")


if __name__ == "__main__":
    import uvicorn

    logger.info("🚀 Starting Plant Identification API Server...")
    logger.info("🌐 Server will be available at: http://localhost:8001")
    logger.info("📱 Mobile app URL: http://192.168.3.153:8001")
    logger.info("🔍 Endpoints:")
    logger.info("  • POST / - Plant identification")
    logger.info("  • GET /healthcheck - Health status")

    # FIXED: Use import string format when reload=True
    uvicorn.run(
        "main:app",  # ← Changed from 'app' to "main:app"
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )