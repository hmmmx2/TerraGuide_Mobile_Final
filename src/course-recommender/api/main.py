from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import hashlib
from datetime import datetime
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="Course Recommender API",
    description="Database-driven recommender system for park guide courses",
    version="1.0.0"
)

# CORS for React Native - IMPORTANT: Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://wxvnjjxbvbevwmvqyack.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY",
                         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# Pydantic models for API
class RecommendationRequest(BaseModel):
    user_id: str
    user_name: str
    user_email: str
    num_recommendations: int = 5


class RecommendationResponse(BaseModel):
    course_id: str
    course_name: str
    score: float
    confidence: str
    reason: str
    skill_match: Optional[dict] = None


class UserInteraction(BaseModel):
    user_id: str
    user_name: str
    course_id: str
    interaction_type: str
    rating: Optional[float] = None


class UserProfile(BaseModel):
    user_id: str
    user_name: str
    guide_id: str
    recommended_course: str
    skill_scores: dict
    overall_average: float


def map_user_to_guide_id(user_name: str, user_id: str = None) -> str:
    """Map user name/id to guide ID for database lookup"""

    # Option 1: If user_id already matches guide format
    if user_id and user_id.startswith('GUIDE_'):
        return user_id

    # Option 2: Create consistent mapping based on user name
    # Hash the name to get consistent guide ID
    hash_object = hashlib.md5(user_name.encode())
    hash_hex = hash_object.hexdigest()
    guide_number = int(hash_hex[:8], 16) % 1323  # 1323 is total guides in training data
    guide_id = f"GUIDE_{guide_number:04d}"

    logger.info(f"Mapped user '{user_name}' to guide ID: {guide_id}")
    return guide_id


def get_confidence_level(overall_average: float) -> str:
    """Determine confidence level based on overall average score"""
    if overall_average >= 4.0:
        return "high"
    elif overall_average >= 3.0:
        return "medium"
    else:
        return "low"


def get_skill_analysis(guide_data: dict) -> dict:
    """Analyze user's skill strengths and weaknesses"""
    skills = {
        'Basic Skills': guide_data.get('basic_skills_avg', 0),
        'Nature Knowledge': guide_data.get('nature_knowledge_avg', 0),
        'Interpretation': guide_data.get('interpretation_avg', 0),
        'Leadership & Safety': guide_data.get('leadership_safety_avg', 0),
        'Cultural Expertise': guide_data.get('cultural_expertise_avg', 0)
    }

    # Find strongest and weakest skills
    strongest = max(skills, key=skills.get)
    weakest = min(skills, key=skills.get)

    return {
        'skills': skills,
        'strongest': strongest,
        'weakest': weakest,
        'skill_balance': max(skills.values()) - min(skills.values())
    }


# Updated startup event handler (removes deprecation warning)
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Database-driven Course Recommender API Starting...")

    # Check database connection
    try:
        # Test connection with a simple query
        result = supabase.table('guide_survey_data').select('guide_id').limit(1).execute()
        logger.info("✅ Database connection successful")
        logger.info(f"📊 Survey data table accessible")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        logger.info("Make sure the guide_survey_data table exists in Supabase")

    logger.info("🎯 API ready to serve database-driven recommendations!")
    logger.info("🌐 Available endpoints:")
    logger.info("  • Health: GET /health")
    logger.info("  • Recommendations: POST /recommendations")
    logger.info("  • User Profile: GET /users/{user_id}/profile")
    logger.info("  • Interactions: POST /interactions")


# Health check endpoint - Enhanced for debugging
@app.get("/health")
async def health_check():
    """Health check endpoint with detailed info"""

    # Test database connection
    db_status = "disconnected"
    db_error = None

    try:
        result = supabase.table('guide_survey_data').select('guide_id').limit(1).execute()
        db_status = "connected"
        record_count = len(result.data) if result.data else 0
    except Exception as e:
        db_error = str(e)
        record_count = 0

    health_info = {
        "status": "healthy",
        "database_status": db_status,
        "database_error": db_error,
        "database_records": record_count,
        "timestamp": datetime.now().isoformat(),
        "message": "Database-driven recommendations API is running",
        "endpoints": {
            "health": "GET /health",
            "recommendations": "POST /recommendations",
            "profile": "GET /users/{user_id}/profile",
            "interactions": "POST /interactions"
        }
    }

    logger.info(f"🏥 Health check requested - Status: {db_status}")
    return health_info


# Get recommendations for a user (database-driven)
@app.post("/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(request: RecommendationRequest):
    """Get course recommendations based on existing database data"""

    logger.info(f"📋 Getting database recommendations for: {request.user_name}")

    try:
        # Map user to guide ID
        guide_id = map_user_to_guide_id(request.user_name, request.user_id)

        # Query database for user's survey data
        result = supabase.table('guide_survey_data').select('*').eq('guide_id', guide_id).execute()

        if not result.data:
            logger.info(f"No survey data found for guide: {guide_id}, returning popular courses")
            return await get_popular_courses_fallback(request.num_recommendations)

        # Get the user's data
        guide_data = result.data[0]
        recommended_course = guide_data.get('recommended_course')
        overall_average = guide_data.get('overall_average', 0)

        # Get skill analysis
        skill_analysis = get_skill_analysis(guide_data)
        confidence = get_confidence_level(overall_average)

        # Create recommendation response
        recommendations = []

        # Primary recommendation from database
        if recommended_course:
            recommendations.append(RecommendationResponse(
                course_id=recommended_course,
                course_name=recommended_course,
                score=overall_average,
                confidence=confidence,
                reason=f"Recommended based on your survey profile. Strongest skill: {skill_analysis['strongest']}",
                skill_match=skill_analysis
            ))

        # Add complementary recommendations based on skill gaps
        if len(recommendations) < request.num_recommendations:
            complementary_courses = await get_complementary_courses(
                skill_analysis,
                recommended_course,
                request.num_recommendations - len(recommendations)
            )
            recommendations.extend(complementary_courses)

        logger.info(f"✅ Generated {len(recommendations)} database-driven recommendations for {request.user_name}")

        # Cache recommendations
        await cache_recommendations(request.user_id, recommendations)

        return recommendations

    except Exception as e:
        logger.error(f"Error getting database recommendations: {e}")
        logger.info("Returning fallback recommendations")
        return await get_popular_courses_fallback(request.num_recommendations)


# Get user profile with survey data
@app.get("/users/{user_id}/profile", response_model=UserProfile)
async def get_user_profile(user_id: str, user_name: str = "Unknown"):
    """Get user profile from database survey data"""

    try:
        # Map user to guide ID
        guide_id = map_user_to_guide_id(user_name, user_id)

        # Query database for user's survey data
        result = supabase.table('guide_survey_data').select('*').eq('guide_id', guide_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="User survey data not found")

        guide_data = result.data[0]
        skill_analysis = get_skill_analysis(guide_data)

        profile = UserProfile(
            user_id=user_id,
            user_name=user_name,
            guide_id=guide_id,
            recommended_course=guide_data.get('recommended_course', 'No recommendation available'),
            skill_scores=skill_analysis['skills'],
            overall_average=guide_data.get('overall_average', 0)
        )

        return profile

    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting user profile: {str(e)}")


# Record user interaction (same as before)
@app.post("/interactions")
async def record_interaction(interaction: UserInteraction):
    """Record a user interaction with a course"""

    try:
        # Insert interaction into Supabase
        result = supabase.table('user_interactions').insert({
            'user_id': interaction.user_id,
            'user_name': interaction.user_name,
            'course_id': interaction.course_id,
            'interaction_type': interaction.interaction_type,
            'rating': interaction.rating,
            'created_at': datetime.now().isoformat(),
            'metadata': {
                'source': 'mobile_app',
                'version': '1.0'
            }
        }).execute()

        logger.info(
            f"📝 Recorded interaction: {interaction.user_name} -> {interaction.course_id} ({interaction.interaction_type})")

        return {
            "status": "success",
            "message": "Interaction recorded successfully",
            "interaction_id": result.data[0]['id'] if result.data else None,
            "user_name": interaction.user_name
        }

    except Exception as e:
        logger.error(f"Error recording interaction: {e}")
        return {
            "status": "partial_success",
            "message": "Interaction noted but not saved to database",
            "error": str(e)
        }


# Helper functions
async def get_complementary_courses(skill_analysis: dict, primary_course: str, num_courses: int) -> List[
    RecommendationResponse]:
    """Get complementary courses based on skill gaps"""

    # Course recommendations based on skill weaknesses
    skill_course_mapping = {
        'Basic Skills': 'Introduction to Park Guiding',
        'Nature Knowledge': 'Nature Guide Fundamentals',
        'Interpretation': 'Eco-Guide Training: Field & Interpretation Skills',
        'Leadership & Safety': 'Advanced Park Guiding: Leadership and Safety',
        'Cultural Expertise': 'Cultural Heritage and Historical Site Interpretation'
    }

    complementary_courses = []
    weakest_skill = skill_analysis['weakest']

    # Recommend course for weakest skill (if not already recommended)
    if weakest_skill in skill_course_mapping:
        course_name = skill_course_mapping[weakest_skill]
        if course_name != primary_course:
            complementary_courses.append(RecommendationResponse(
                course_id=course_name,
                course_name=course_name,
                score=0.75,
                confidence="medium",
                reason=f"Recommended to strengthen your {weakest_skill} skills",
                skill_match={'target_skill': weakest_skill}
            ))

    # Add popular courses if needed
    if len(complementary_courses) < num_courses:
        popular_courses = await get_popular_courses_fallback(num_courses - len(complementary_courses))
        complementary_courses.extend(popular_courses)

    return complementary_courses[:num_courses]


async def cache_recommendations(user_id: str, recommendations: List[RecommendationResponse]):
    """Cache recommendations in Supabase"""
    try:
        # Clear existing cache for this user
        supabase.table('recommendations').delete().eq('user_id', user_id).execute()

        # Insert new recommendations
        cache_data = []
        for rec in recommendations:
            cache_data.append({
                'user_id': user_id,
                'course_id': rec.course_id,
                'score': rec.score,
                'mf_score': rec.score,  # Using same score for compatibility
                'knn_score': rec.score,
                'model_version': 'database_v1.0',
                'created_at': datetime.now().isoformat()
            })

        if cache_data:
            supabase.table('recommendations').insert(cache_data).execute()
            logger.info(f"💾 Cached {len(cache_data)} recommendations for user {user_id}")

    except Exception as e:
        logger.warning(f"Failed to cache recommendations: {e}")


async def get_popular_courses_fallback(num_recommendations: int) -> List[RecommendationResponse]:
    """Get popular courses as fallback when user data not found"""

    popular_courses = [
        {
            'course_id': 'Master Park Guide Certification Program',
            'score': 0.95,
            'reason': 'Most popular advanced certification'
        },
        {
            'course_id': 'Introduction to Park Guiding',
            'score': 0.90,
            'reason': 'Essential foundation course'
        },
        {
            'course_id': 'Nature Guide Fundamentals',
            'score': 0.85,
            'reason': 'Core knowledge for all guides'
        },
        {
            'course_id': 'Advanced Park Guiding: Leadership and Safety',
            'score': 0.80,
            'reason': 'Critical safety and leadership skills'
        },
        {
            'course_id': 'Eco-Guide Training: Field & Interpretation Skills',
            'score': 0.75,
            'reason': 'Specialized interpretation training'
        }
    ]

    fallback_recs = []
    for course in popular_courses[:num_recommendations]:
        fallback_recs.append(RecommendationResponse(
            course_id=course['course_id'],
            course_name=course['course_id'],
            score=course['score'],
            confidence="medium",
            reason=course['reason'],
            skill_match=None
        ))

    logger.info(f"📊 Returning {len(fallback_recs)} fallback recommendations")
    return fallback_recs


# Root endpoint for API info
@app.get("/")
async def root():
    """API information"""
    return {
        "name": "TerraGuide Course Recommender API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "recommendations": "/recommendations",
            "profile": "/users/{user_id}/profile",
            "interactions": "/interactions"
        },
        "message": "Database-driven course recommendation system"
    }


# Run the app
if __name__ == "__main__":
    import uvicorn

    logger.info("🚀 Starting Database-driven Course Recommender API...")
    logger.info("🌐 Server will be available at: http://localhost:8000")
    logger.info("📱 Android emulator URL: http://10.0.2.2:8000")

    # IMPORTANT: Bind to 0.0.0.0 to make it accessible from Android emulator
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # This allows external connections
        port=8000,
        reload=True,
        log_level="info"
    )