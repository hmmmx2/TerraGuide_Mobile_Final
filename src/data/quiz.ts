import { AssessmentData } from '@/app/types';

export const quiz : AssessmentData = {
    type: 'quiz',
    title: 'Quiz: Intro to Park Guide',
    duration: 2700, // in seconds
    course: 'Intro to Park Guide',
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
            question: 'Q2: Which of these is a key responsibility of a park guide?',
            options: [
                { label: 'A) Enforcing federal laws', value: 'A' },
                { label: 'B) Organizing guided tours', value: 'B' },
                { label: 'C) Planting trees', value: 'C' },
                { label: 'D) Driving tourists', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q3: What skill is most important for park guides?',
            options: [
                { label: 'A) Accounting', value: 'A' },
                { label: 'B) Programming', value: 'B' },
                { label: 'C) Communication', value: 'C' },
                { label: 'D) Carpentry', value: 'D' },
            ],
            correct: 'C',
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
            question: 'Q6: What is a common method park guides use to engage visitors?',
            options: [
                { label: 'A) Giving out fines', value: 'A' },
                { label: 'B) Storytelling and interactive activities', value: 'B' },
                { label: 'C) Asking for donations', value: 'C' },
                { label: 'D) Playing loud music', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q7: Why is it important for park guides to follow Leave No Trace principles?',
            options: [
                { label: 'A) To avoid getting fired', value: 'A' },
                { label: 'B) To ensure a cleaner and more sustainable environment', value: 'B' },
                { label: 'C) To impress visitors', value: 'C' },
                { label: 'D) Because it’s a legal requirement', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q8: What should a park guide do if a visitor encounters a wild animal?',
            options: [
                { label: 'A) Encourage them to pet the animal', value: 'A' },
                { label: 'B) Instruct them to stay calm and keep a safe distance', value: 'B' },
                { label: 'C) Take a selfie with the animal', value: 'C' },
                { label: 'D) Throw food to distract it', value: 'D' },
            ],
            correct: 'B',
        },
        {
            question: 'Q9: When leading a hike, what should a park guide always carry?',
            options: [
                { label: 'A) A picnic basket', value: 'A' },
                { label: 'B) A drone', value: 'B' },
                { label: 'C) Emergency supplies and a first aid kit', value: 'C' },
                { label: 'D) A loudspeaker', value: 'D' },
            ],
            correct: 'C',
        },
        {
            question: 'Q10: How can park guides help protect endangered species?',
            options: [
                { label: 'A) By encouraging visitors to feed them', value: 'A' },
                { label: 'B) By limiting access to sensitive habitats and educating the public', value: 'B' },
                { label: 'C) By relocating them to zoos', value: 'C' },
                { label: 'D) By tagging them for hunting season', value: 'D' },
            ],
            correct: 'B',
        }

    ]
}
