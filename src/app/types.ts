export interface Option {
    label: string;
    value: string;
}

export interface Question {
    question: string;
    options: Option[];
    correct: string;
}

export interface AssessmentData {
    type: 'quiz' | 'exam' | 'exercise';
    title: string;
    duration: number; // in seconds
    questions: {
        question: string;
        options: { label: string; value: string }[];
        correct: string;
    }[];
    courseData?: any; // Add this line to include the courseData property
    course?: string; // Optional, only if needed
}
