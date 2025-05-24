import {ImageSourcePropType} from "react-native";

export type ParkGuide = {
  id: number;
  name: string;
  imageUri: ImageSourcePropType;
  description?: string;
  parkArea?: string;
  time?: string;
  specialties: string[];
};

// Dummy data for park guides
export const parkGuides: ParkGuide[] = [
  {
    id: 1,
    name: 'Timmy He',
    imageUri: require('@assets/images/avatar.jpg'),
    description:
        'Timmy He specializes in orangutan behavior and habitat conservation. With over a decade of experience, he has led numerous educational expeditions and conservation projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    parkArea: 'Park 1',
    time: '9:00am - 11:00am',
    specialties: ['Bird Watching', 'Flora Identification', 'Wildlife Tracking']
  },
  {
    id: 2,
    name: 'Jimmy He',
    imageUri: require('@assets/images/avatar.jpg'),
    description:
        'Jimmy He is an expert in rainforest ecosystems and plant identification. He frequently hosts guided treks and ecological workshops. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    parkArea: 'Park 2',
    time: '9:00am - 11:00am',
    specialties: ['Hiking', 'Conservation', 'Local History']
  },
  {
    id: 3,
    name: 'James He',
    imageUri: require('@assets/images/avatar.jpg'),
    description:
        'James He guides immersive photography tours, teaching visitors how to capture the beauty of wildlife in its natural habitat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    parkArea: 'Park 3',
    time: '9:00am - 11:00am',
    specialties: ['Photography', 'Wildlife Habitats', 'Eco-Tourism']
  },
  {
    id: 4,
    name: 'Jason He',
    imageUri: require('@assets/images/avatar.jpg'),
    description:
        'Jason He leads bird watching tours and specializes in the identification of rare and migratory species. He also educates guests on cultural and medicinal uses of native plants. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    parkArea: 'Park 4',
    time: '9:00am - 11:00am',
    specialties: ['Cultural Heritage', 'Medicinal Plants', 'Conservation']
  }
];
