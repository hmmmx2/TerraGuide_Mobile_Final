import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '../components/UserNavBar';
import { parkGuides, ParkGuide } from '@/data/parkguides';

export default function GuideDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Convert string id to number and find the guide
    const guideId = parseInt(id as string);
    const guideDetails = parkGuides.find(guide => guide.id === guideId) || {
        id: 0,
        name: 'Guide not found',
        description: 'This guide does not exist.',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'N/A',
        time: 'N/A',
        specialties: [],
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
                        {guideDetails.description || 'No description available'}
                    </Text>
                </View>

                {/* Park Area and Time */}
                <View className="mb-8">
                    <Text className="text-gray-700">
                        <Text className="font-semibold">Park Area:</Text> {guideDetails.parkArea || 'N/A'}
                    </Text>
                    <Text className="text-gray-700">
                        <Text className="font-semibold">Time:</Text> {guideDetails.time || 'N/A'}
                    </Text>
                </View>

                {/* Specialties Section */}
                {guideDetails.specialties.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">Specialties:</Text>
                        {guideDetails.specialties.map((specialty, index) => (
                            <Text key={index} className="text-gray-600">• {specialty}</Text>
                        ))}
                    </View>
                )}

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