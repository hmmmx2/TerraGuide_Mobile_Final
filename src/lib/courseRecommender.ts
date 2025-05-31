import { useState, useEffect } from 'react';

export interface RecommendationRequest {
  user_id: string;
  user_name: string;
  user_email: string;
  num_recommendations?: number;
}

export interface RecommendationResponse {
  course_id: string;
  course_name: string;
  score: number;
  confidence: string;
  reason: string;
  skill_match?: {
    skills?: Record<string, number>;
    strongest?: string;
    weakest?: string;
    target_skill?: string;
  };
}

export interface UserInteraction {
  user_id: string;
  user_name: string;
  course_id: string;
  interaction_type: 'enrolled' | 'completed' | 'liked' | 'viewed';
  rating?: number;
}

export interface UserProfile {
  user_id: string;
  user_name: string;
  guide_id: string;
  recommended_course: string;
  skill_scores: Record<string, number>;
  overall_average: number;
}

export interface RecommendedCourse {
  id: number;
  course_name: string;
  course_description?: string;
  course_image_url?: string;
  fees?: number;
  student_count?: number;
  average_rating?: number;
  instructor_id?: number;
  instructor_name?: string;
  instructor_image_url?: string;
  duration_hours?: number;
  reviews_count?: number;
  course_id: string;
  score?: number;
  confidence?: string;
  reason?: string;
}

const API_CONFIG = {
  BASE_URL: 'http://192.168.3.153:8000',
  TIMEOUT: 30000,
};

class CourseRecommenderAPI {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeout = timeout;
    
    console.log('🔧 CourseRecommenderAPI initialized');
    console.log('   Base URL:', this.baseUrl);
    console.log('   Timeout:', this.timeout + 'ms');
  }

  private async apiCall<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    console.log(`🔗 API Call: ${method} ${fullUrl}`);
    
    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(body);
        console.log(`📤 Request body:`, body);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`⏰ Request timeout after ${this.timeout}ms for ${endpoint}`);
        controller.abort();
      }, this.timeout);
      
      config.signal = controller.signal;

      console.log(`🚀 Fetching: ${fullUrl}`);
      const startTime = Date.now();
      
      const response = await fetch(fullUrl, config);
      
      const endTime = Date.now();
      clearTimeout(timeoutId);

      console.log(`📥 Response received in ${endTime - startTime}ms`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Success:`, data);
      return { success: true, data };
      
    } catch (error) {
      console.error(`❌ API Error: ${method} ${endpoint}`, error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = `Request timeout after ${this.timeout/1000}s - check network connection`;
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = `Cannot connect to ${this.baseUrl} - is the API server running?`;
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Network error - check WiFi connection and API server';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async healthCheck() {
    console.log('🏥 Performing health check...');
    return this.apiCall('/health');
  }

  async getRecommendations(
    user: { id: string; name: string; email?: string },
    numRecommendations: number = 5
  ): Promise<{ success: boolean; data?: RecommendationResponse[]; error?: string }> {
    console.log(`📋 Getting recommendations for user:`, user);
    
    const request: RecommendationRequest = {
      user_id: user.id,
      user_name: user.name,
      user_email: user.email || '',
      num_recommendations: numRecommendations,
    };

    return this.apiCall('/recommendations', 'POST', request);
  }

  async getUserProfile(
    userId: string,
    userName: string
  ): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    console.log(`👤 Getting profile for user: ${userName}`);
    const endpoint = `/users/${userId}/profile?user_name=${encodeURIComponent(userName)}`;
    return this.apiCall(endpoint, 'GET');
  }

  async recordInteraction(interaction: UserInteraction) {
    console.log(`📝 Recording interaction:`, interaction);
    return this.apiCall('/interactions', 'POST', interaction);
  }

  async getCourses() {
    console.log('📚 Getting all courses...');
    return this.apiCall('/courses');
  }

  async enrollInCourse(user: { id: string; name: string }, courseId: string) {
    console.log(`📝 Enrolling user ${user.name} in course: ${courseId}`);
    return this.recordInteraction({
      user_id: user.id,
      user_name: user.name,
      course_id: courseId,
      interaction_type: 'enrolled',
    });
  }

  async completeCourse(user: { id: string; name: string }, courseId: string, rating?: number) {
    console.log(`✅ Completing course for user ${user.name}: ${courseId}`);
    return this.recordInteraction({
      user_id: user.id,
      user_name: user.name,
      course_id: courseId,
      interaction_type: 'completed',
      rating,
    });
  }

  async likeCourse(user: { id: string; name: string }, courseId: string) {
    console.log(`👍 Liking course for user ${user.name}: ${courseId}`);
    return this.recordInteraction({
      user_id: user.id,
      user_name: user.name,
      course_id: courseId,
      interaction_type: 'liked',
    });
  }
}

// ===== COURSE UI MAPPING =====
const COURSE_UI_MAPPING: Record<string, Partial<RecommendedCourse>> = {
  'Eco-Guide Training: Field & Interpretation Skills': {
    average_rating: 4.7,
    student_count: 5983,
    instructor_name: 'Jason Lee',
    course_image_url: '@assets/images/EcoGuideTraining.png',
    fees: 299,
    duration_hours: 50,
    reviews_count: 1247
  },
  'Master Park Guide Certification Program': {
    average_rating: 4.7,
    student_count: 5983,
    instructor_name: 'Jason Lee',
    course_image_url: '@assets/images/MasterParkGuide.png',
    fees: 599,
    duration_hours: 120,
    reviews_count: 1089
  },
  'Nature Guide Fundamentals': {
    average_rating: 4.5,
    student_count: 3245,
    instructor_name: 'Sarah Chen',
    course_image_url: '@assets/images/NatureGuide.png',
    fees: 199,
    duration_hours: 30,
    reviews_count: 892
  },
  'Advanced Park Guiding: Leadership and Safety': {
    average_rating: 4.8,
    student_count: 2156,
    instructor_name: 'Mike Johnson',
    course_image_url: '@assets/images/AdvancedGuiding.png',
    fees: 399,
    duration_hours: 60,
    reviews_count: 567
  },
  'Introduction to Park Guiding': {
    average_rating: 4.3,
    student_count: 8971,
    instructor_name: 'Emma Davis',
    course_image_url: '@assets/images/IntroGuiding.png',
    fees: 149,
    duration_hours: 20,
    reviews_count: 1823
  },
  'Cultural Heritage and Historical Site Interpretation': {
    average_rating: 4.6,
    student_count: 1845,
    instructor_name: 'Dr. Maria Santos',
    course_image_url: '@assets/images/CulturalHeritage.png',
    fees: 249,
    duration_hours: 40,
    reviews_count: 432
  },
  'Park Guide in Training: Learn from the Pros': {
    average_rating: 4.9,
    student_count: 892,
    instructor_name: 'Expert Panel',
    course_image_url: '@assets/images/TrainingPros.png',
    fees: 799,
    duration_hours: 100,
    reviews_count: 198
  },
  'Explore & Lead: Park Guide Mentorship Journey': {
    average_rating: 4.6,
    student_count: 1456,
    instructor_name: 'Leadership Team',
    course_image_url: '@assets/images/MentorshipJourney.png',
    fees: 449,
    duration_hours: 80,
    reviews_count: 324
  }
};

export function enhanceCourseWithUI(course: RecommendationResponse): RecommendedCourse {
  const uiData = COURSE_UI_MAPPING[course.course_id] || {};
  
  return {
    id: Math.floor(Math.random() * 1000000),
    course_id: course.course_id,
    course_name: course.course_name,
    course_description: `Professional development course: ${course.course_name}`,
    score: course.score,
    confidence: course.confidence,
    reason: course.reason,
    average_rating: uiData.average_rating || 4.0,
    student_count: uiData.student_count || 1000,
    instructor_name: uiData.instructor_name || 'Expert Instructor',
    course_image_url: uiData.course_image_url || '@assets/images/default-course.png',
    fees: uiData.fees || 299,
    duration_hours: uiData.duration_hours || 40,
    reviews_count: uiData.reviews_count || 500,
    ...uiData
  };
}

export const courseAPI = new CourseRecommenderAPI();

console.log('🚀 Testing API connection...');
courseAPI.healthCheck().then(result => {
  if (result.success) {
    console.log('✅ API connection successful!');
    console.log('📡 Connected to:', API_CONFIG.BASE_URL);
  } else {
    console.warn('⚠️ API connection failed:', result.error);
    console.log('🔧 API URL:', API_CONFIG.BASE_URL);
    console.log('💡 Troubleshooting steps:');
    console.log('   1. Make sure API server is running: python main.py');
    console.log('   2. Check your computer IP: ipconfig');
    console.log('   3. Test in phone browser: http://192.168.3.153:8000/health');
    console.log('   4. Check WiFi - both devices on same network');
  }
});

export function useRecommendations(
  user: { id: string; name: string; email?: string } | null,
  numRecommendations: number = 5
) {
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!user) {
      console.log('👤 No user provided, skipping recommendations fetch');
      return;
    }

    console.log(`📋 Fetching recommendations for user: ${user.name}`);
    setLoading(true);
    setError(null);

    try {
      const result = await courseAPI.getRecommendations(user, numRecommendations);
      
      if (result.success && result.data) {
        console.log(`✅ Successfully fetched ${result.data.length} recommendations`);
        const enhancedCourses = result.data.map(enhanceCourseWithUI);
        setRecommendations(enhancedCourses);
        setError(null);
      } else {
        console.error('❌ Failed to fetch recommendations:', result.error);
        setError(result.error || 'Failed to fetch recommendations');
        setRecommendations([]);
      }
    } catch (err) {
      console.error('❌ Unexpected error in fetchRecommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useRecommendations effect triggered');
    console.log('   User:', user);
    console.log('   Num recommendations:', numRecommendations);
    fetchRecommendations();
  }, [user?.id, user?.name, numRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refresh: fetchRecommendations,
  };
}

export function useCurrentUser() {
  console.log('👤 Using mock user - replace useCurrentUser with real auth');
  
  return {
    id: 'user_001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    designation: 'Park Guide Trainee',
    role: 'trainee'
  };
}

export const debugAPI = () => {
  console.log('🔧 API Debug Information:');
  console.log('   Base URL:', API_CONFIG.BASE_URL);
  console.log('   Timeout:', API_CONFIG.TIMEOUT + 'ms');
  console.log('   Current time:', new Date().toISOString());
  
  courseAPI.healthCheck().then(result => {
    console.log('   Health check result:', result);
  });
};

console.log('📱 Course Recommender API Client Loaded');
console.log('🔗 Configured for:', API_CONFIG.BASE_URL);