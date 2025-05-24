import { ImageSourcePropType } from 'react-native';

// Type definition matching SearchScreen.tsx
export type BlogPost = {
  id: number;
  title: string;
  imageUri?: ImageSourcePropType;
  description?: string;
  paragraphs?: string[];
  isPlaceholder?: boolean;
};

// Dummy data for blogs
export const blogs: BlogPost[] = [
  {
    id: 1,
    title: 'The History of Semenggoh Nature Reserve',
    imageUri: require('@assets/images/semenggoh-history.jpg'),
    description: 'Explore the rich history of Semenggoh Nature Reserve and how it became a sanctuary for orangutans.',
    paragraphs: [
      'Semenggoh Nature Reserve was established in 1975 as a center for wildlife rehabilitation, particularly focusing on displaced and injured orangutans. Initially, the reserve served as a home for rescued orangutans that could no longer survive in the wild.',
      'Over the decades, Semenggoh evolved into a sanctuary that balanced tourism and conservation. Many of the orangutans that were rehabilitated here have since reintegrated into the surrounding forest and live semi-wild lives.',
      'The reserve also became an educational platform, helping raise awareness among visitors and the local community about the importance of preserving endangered species.',
      'Today, Semenggoh is not just a popular eco-tourism spot but also a symbol of hope in conservation circles, demonstrating how dedicated efforts can successfully protect vulnerable wildlife.'
    ]
  },
  {
    id: 2,
    title: 'Species of Orang Utan',
    imageUri: require('@assets/images/orang-utan.jpg'),
    description: 'Learn about the different species of orangutans found in Borneo and their unique characteristics.',
    paragraphs: [
      'Orangutans are divided into three distinct species: the Bornean, Sumatran, and the more recently identified Tapanuli orangutan. Semenggoh is home to the Bornean species, known scientifically as *Pongo pygmaeus*.',
      'Bornean orangutans are larger and more robust than their Sumatran relatives, with males developing large cheek pads called flanges as they mature. Their fur is generally darker and coarser.',
      'Each species has unique behaviors and ecological roles. For instance, Bornean orangutans are more solitary and spend a greater portion of their lives in the trees.',
      'Conservation of all orangutan species is critical, as habitat destruction and illegal wildlife trade continue to threaten their survival. Understanding their differences helps shape more effective conservation strategies.'
    ]
  },
  {
    id: 3,
    title: 'Conservation Efforts at Semenggoh',
    imageUri: require('@assets/images/ExploreAndLead.png'),
    description: 'Discover the ongoing conservation efforts to protect orangutans and their habitat at Semenggoh.',
    paragraphs: [
      'Semenggoh Nature Reserve has been at the forefront of orangutan conservation in Malaysia. The reserve supports semi-wild orangutans that have been reintroduced after rehabilitation.',
      'Daily feeding sessions allow park staff to monitor the health and behavior of the orangutans, offering supplemental food when necessary while still encouraging natural foraging.',
      'Conservation here also extends to habitat management, with efforts to expand forest coverage and maintain biodiversity that supports a healthy ecosystem for orangutans.',
      'Educational outreach and responsible tourism are integral to the reserve’s success. Visitors are taught how their actions can impact the environment, fostering a greater appreciation for conservation efforts.'
    ]
  },
  {
    id: 4,
    title: 'Coming Soon',
    description: 'Coming Soon',
    isPlaceholder: true,
  },
];
