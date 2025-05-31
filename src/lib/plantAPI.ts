import * as FileSystem from 'expo-file-system';

export interface PlantResult {
  predicted_class: string;
  confidence: number;
  success: boolean;
}

class SimplePlantAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://192.168.3.153:8001';
    console.log('🌱 Plant API configured for:', this.baseUrl);
  }

  async identifyPlant(imageUri: string): Promise<{ success: boolean; result?: PlantResult; error?: string }> {
    try {
      console.log('🔍 Starting plant identification...');
      console.log('📱 Image URI:', imageUri);

      // Method 1: Use FileSystem.uploadAsync (React Native specific)
      console.log('📤 Using Expo FileSystem.uploadAsync...');

      const uploadResult = await FileSystem.uploadAsync(
        `${this.baseUrl}/`,
        imageUri,
        {
          fieldName: 'file',
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        }
      );

      console.log('📥 Upload result status:', uploadResult.status);
      console.log('📄 Upload result body:', uploadResult.body);

      if (uploadResult.status !== 200) {
        throw new Error(`Upload failed: HTTP ${uploadResult.status} - ${uploadResult.body}`);
      }

      const result: PlantResult = JSON.parse(uploadResult.body);
      console.log('🌿 Plant identification success:', result);

      return { success: true, result };

    } catch (error) {
      console.error('❌ FileSystem upload failed, trying FormData...', error);

      // Method 2: Fallback to corrected FormData approach
      return this.identifyPlantFormData(imageUri);
    }
  }

  // Backup method: Corrected FormData for React Native
  private async identifyPlantFormData(imageUri: string): Promise<{ success: boolean; result?: PlantResult; error?: string }> {
    try {
      console.log('🔄 Trying corrected FormData approach...');

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      console.log('📊 File info:', fileInfo);

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert to blob
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      console.log('📊 Blob size:', blob.size, 'bytes');

      // Create FormData with actual blob
      const formData = new FormData();
      formData.append('file', blob, 'plant_image.jpg');

      console.log('📡 Sending FormData with blob...');

      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        body: formData,
        // Let React Native set Content-Type automatically
      });

      console.log('📥 FormData response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ FormData server error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result: PlantResult = await response.json();
      console.log('🌿 FormData success:', result);

      return { success: true, result };

    } catch (error) {
      console.error('❌ FormData method also failed:', error);

      let errorMessage = 'Plant identification failed';
      if (error instanceof Error) {
        if (error.message.includes('422')) {
          errorMessage = 'File format not supported by server. Try a different image.';
        } else if (error.message.includes('413')) {
          errorMessage = 'Image too large. Please select a smaller image.';
        } else {
          errorMessage = error.message;
        }
      }

      return { success: false, error: errorMessage };
    }
  }

  async healthCheck(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/healthcheck`);
      const result = await response.json();
      return { success: result.status === 'healthy' };
    } catch (error) {
      return { success: false, error: 'Health check failed' };
    }
  }
}

export const plantAPI = new SimplePlantAPI();

// Test on startup
plantAPI.healthCheck().then(result => {
  if (result.success) {
    console.log('✅ Plant API ready for file uploads!');
  } else {
    console.warn('⚠️ Plant API not ready:', result.error);
  }
});