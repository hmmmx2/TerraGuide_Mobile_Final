import { AssessmentData } from '@/app/types';

export const exercise: AssessmentData = {
    type: 'exercise',
    title: 'Exercise: Park Guide Techniques',
    duration: 900, // 15 minutes in seconds
    course: 'Park Guide Techniques',
    questions: [
        {
            question: 'Q1: What is the primary role of a park guide?',
            options: [
                { label: 'A) To patrol the park and issue fines', value: 'A' },
                { label: 'B) To educate visitors about the environment and wildlife', value: 'B' },
                { label: 'C) To sell tickets', value: 'C' },
                { label: 'D) To build new trails', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q2: What skill is most important for park guides?',
            options: [
                { label: 'A) Accounting', value: 'A' },
                { label: 'B) Programming', value: 'B' },
                { label: 'C) Communication', value: 'C' },
                { label: 'D) Carpentry', value: 'D' },
            ],
            correct: 'C',
        },
        {
            question: 'Q3: Which of these is a key responsibility of a park guide?',
            options: [
                { label: 'A) Enforcing federal laws', value: 'A' },
                { label: 'B) Organizing guided tours', value: 'B' },
                { label: 'C) Planting trees', value: 'C' },
                { label: 'D) Driving tourists', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q4: What kind of knowledge should a park guide possess?',
            options: [
                { label: 'A) Local ecology and history', value: 'A' },
                { label: 'B) Cryptocurrency trends', value: 'B' },
                { label: 'C) Airline regulations', value: 'C' },
                { label: 'D) City traffic rules', value: 'D' },
            ],
            correct: 'A',
        },
        {
            question: 'Q5: Which of the following would a park guide most likely use?',
            options: [
                { label: 'A) Microscope', value: 'A' },
                { label: 'B) Map and compass', value: 'B' },
                { label: 'C) Medical scanner', value: 'C' },
                { label: 'D) Radar gun', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q6: What should a park guide do if a visitor reports seeing a dangerous animal?',
            options: [
                { label: 'A) Ignore the report', value: 'A' },
                { label: 'B) Report it to a park ranger immediately', value: 'B' },
                { label: 'C) Tell the visitor to leave the park', value: 'C' },
                { label: 'D) Give the visitor advice on how to handle the animal', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q7: How should a park guide prepare for a guided tour?',
            options: [
                { label: 'A) Research the route and history of the area', value: 'A' },
                { label: 'B) Make sure they know the visitor’s dietary preferences', value: 'B' },
                { label: 'C) Check the weather forecast for the day', value: 'C' },
                { label: 'D) All of the above', value: 'D' },
            ],
            correct: 'D',
        },
        {
            question: 'Q8: What is a key safety measure park guides should take during hikes?',
            options: [
                { label: 'A) Carry a first aid kit', value: 'A' },
                { label: 'B) Encourage visitors to explore off the trail', value: 'B' },
                { label: 'C) Avoid carrying any extra weight', value: 'C' },
                { label: 'D) Only hike during the day', value: 'D' },
            ],
            correct: 'A',
        },
        {
            question: 'Q9: What is an important environmental guideline for park guides?',
            options: [
                { label: 'A) Use disposable plastic bottles', value: 'A' },
                { label: 'B) Leave no trace of your presence', value: 'B' },
                { label: 'C) Encourage visitors to bring non-recyclable items', value: 'C' },
                { label: 'D) Always start campfires', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q10: If a visitor asks about the history of the park, what should the park guide do?',
            options: [
                { label: 'A) Make up an interesting story', value: 'A' },
                { label: 'B) Provide accurate and researched information', value: 'B' },
                { label: 'C) Direct the visitor to a bookstore', value: 'C' },
                { label: 'D) Tell the visitor to check the internet', value: 'D' },
            ],
            correct: 'B',
        },
    ],
};
