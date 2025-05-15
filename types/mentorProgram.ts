export interface MentorProgram {
  id: number;
  program_name: string;
  description: string;
  image_url: string | null;
  fees: number;
  student_count: number;
  average_rating: number;
  instructor_id: number;
  instructor_name: string;
  instructor_image_url?: string;
  duration_hours: number;
  created_at: string;
}