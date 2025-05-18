import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '../components/UserNavBar';

const GUIDE_DETAILS = {
    '1': {
        id: '1',
        name: 'Timmy He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'Park 1',
        time: '9:00am - 11:00am',
        specialties: ['Bird Watching', 'Flora Identification', 'Wildlife Tracking']
    },
    '2': {
        id: '2',
        name: 'Jimmy He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'Park 2',
        time: '9:00am - 11:00am',
        specialties: ['Hiking', 'Conservation', 'Local History']
    },
    '3': {
        id: '3',
        name: 'James He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'Park 3',
        time: '9:00am - 11:00am',
        specialties: ['Photography', 'Wildlife Habitats', 'Eco-Tourism']
    },
    '4': {
        id: '4',
        name: 'Jason He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'Park 4',
        time: '9:00am - 11:00am',
        specialties: ['Cultural Heritage', 'Medicinal Plants', 'Conservation']
    }
};

export default function GuideDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const guideDetails = GUIDE_DETAILS[id as keyof typeof GUIDE_DETAILS] || {
        id: '0',
        name: 'Guide not found',
        description: 'This guide does not exist.',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'N/A',
        time: 'N/A',
        specialties: []
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleBookNow = () => {
        console.log(`Booking guide: ${guideDetails.name}`);
        alert(`Thank you for booking ${guideDetails.name}!`);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            {/* Header with back button */}
            <View className="px-4 pt-12 pb-4 flex-row items-center">
                <TouchableOpacity onPress={handleGoBack} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4">
                {/* Guide Profile Image */}
                <View className="items-center mb-6">
                    <Image
                        source={guideDetails.imageUri}
                        className="w-28 h-28 rounded-full"
                        resizeMode="cover"
                    />
                </View>

                {/* Guide Name */}
                <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
                    {guideDetails.name}
                </Text>

                {/* Description Section */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2">Description:</Text>
                    <Text className="text-gray-600 leading-5 mb-4">
                        {guideDetails.description}
                    </Text>
                </View>

                {/* Park Area and Time */}
                <View className="mb-8">
                    <Text className="text-gray-700">
                        <Text className="font-semibold">Park Area:</Text> {guideDetails.parkArea}
                    </Text>
                    <Text className="text-gray-700">
                        <Text className="font-semibold">Time:</Text> {guideDetails.time}
                    </Text>
                </View>

                {/* Book Now Button */}
                <TouchableOpacity
                    onPress={handleBookNow}
                    className="bg-[#6D7E5E] rounded-full py-4 items-center mb-10"
                >
                    <Text className="text-white font-medium">Book Now!</Text>
                </TouchableOpacity>

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>

            <UserNavBar activeRoute="/HomeParkGuideScreen" />
        </SafeAreaView>
    );
}