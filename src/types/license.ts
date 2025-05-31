export interface LicenseType {
  id: string; // uuid
  name: string;
  description: string;
  price: number;
  organizer: string;
  duration_hours: number;
  image_url: string;
}

// This interface extends LicenseType with additional fields needed for the UI
export interface LicenseData {
  id: string;
  title: string;
  organization: string;
  duration: string;
  validity: string;
  exam_duration: number;
  requirements: Array<{
    id: number;
    title: string;
    completed: boolean;
    type: 'course' | 'mentoring';
  }>;
  image_url?: string;
}