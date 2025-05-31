import { ImageSourcePropType } from 'react-native';

export type Timetable = {
  id: number;
  title: string;
  time: string;
  description?: string;
  imageUri?: ImageSourcePropType;
};

// Dummy data for timetables
export const timetables: Timetable[] = [
  {
    id: 1,
    title: 'Morning Briefing & Preparation',
    time: '8:00am',
    description:
        'Daily guide briefing covering safety protocols, weather updates, visitor schedules, and equipment checks to ensure smooth park operations.',
    imageUri: require('@assets/images/timetable-8am.png'),
  },
  {
    id: 2,
    title: 'Morning Guided Nature Walk',
    time: '8:30am',
    description:
        'A guided trail walk focusing on local flora, fauna, and conservation. Guides share insights and engage visitors through storytelling.',
    imageUri: require('@assets/images/timetable-830am.png'),
  },
  {
    id: 3,
    title: 'Break & Rest',
    time: '9:00am',
    description:
        'A short break for hydration and rest. Guides can collect feedback and prepare for upcoming sessions.',
    imageUri: require('@assets/images/timetable-9am.png'),
  },
  {
    id: 4,
    title: 'Morning Guided Nature Walk',
    time: '9:30am',
    description:
        'An alternate trail walk for new groups, showcasing different habitats and rare species within the reserve.',
  },
  {
    id: 5,
    title: 'Break & Rest',
    time: '10:00am',
    description:
        'Time to rest, sanitize gear, and prepare for midday activities. Also used as a buffer for session delays.',
  },
  {
    id: 6,
    title: 'Morning Guided Nature Walk',
    time: '10:30am',
    description:
        'A late-morning walk highlighting animal behavior and delicate forest ecosystems, with optional interactive elements.',
  },
  {
    id: 7,
    title: 'Break & Rest',
    time: '11:00am',
    description:
        'Final rest break before lunch. Visitors can chat with guides, explore materials, or relax in designated zones.',
  }
];
