export interface Course {
  id: number;
  course_name: string;
  course_description: string;
  course_image_url: string;
  fees: number;
  student_count: number;
  average_rating: number;
  instructor_id: number;
  instructor_name: string;
  instructor_image_url?: string;
  duration_hours: number;
  reviews_count?: number;
}

export interface Instructor {
  id: number;
  name: string;
  title: string;
  image_url?: string;
}

export interface LessonItem {
  id: number;
  title: string;
  duration: number;
  type: 'video' | 'exercise' | 'quiz' | 'survey';
  completed: boolean;
}