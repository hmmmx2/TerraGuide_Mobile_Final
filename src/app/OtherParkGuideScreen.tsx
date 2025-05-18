import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '../components/UserNavBar';

const FULL_PARK_GUIDES = [
    {
        id: '1',
        name: 'Timmy He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'Park 1',
        time: '9:00am - 11:00am'
    },
    {
        id: '2',
        name: 'Jimmy He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'Park 2',
        time: '9:00am - 11:00am'
    },
    {
        id: '3',
        name: 'James He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'Park 3',
        time: '9:00am - 11:00am'
    },
    {
        id: '4',
        name: 'Jason He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/avatar.jpg'),
        parkArea: 'Park 4',
        time: '9:00am - 11:00am'
    }
];

export default function OtherParkGuideScreen() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleGuidePress = (guide: typeof FULL_PARK_GUIDES[0]) => {
        router.push({
            pathname: '/GuideDetailScreen',
            params: { id: guide.id }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            {/* Header with back button */}
            <View className="px-4 pt-12 pb-2 flex-row items-center">
                <TouchableOpacity onPress={handleGoBack} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold">Park Guide</Text>
            </View>

            {/* Divider line */}
            <View className="px-4 pb-2">
                <View className="h-px bg-gray-300 w-full" />
            </View>

            {/* Park Guide list */}
            <ScrollView className="flex-1 px-4">
                {FULL_PARK_GUIDES.map((guide, index) => (
                    <TouchableOpacity
                        key={guide.id}
                        onPress={() => handleGuidePress(guide)}
                        activeOpacity={0.7}
                    >
                        <View className="py-4 flex-row">
                            {/* Guide Avatar */}
                            <Image
                                source={guide.imageUri}
                                className="w-14 h-14 rounded-full mr-3"
                                resizeMode="cover"
                            />

                            {/* Guide Info */}
                            <View className="flex-1">
                                <Text className="text-gray-800 font-bold text-lg">{guide.name}</Text>
                                <Text className="text-gray-600 text-sm mb-1" numberOfLines={1}>
                                    {guide.description}
                                </Text>
                                <Text className="text-[#6D7E5E] text-xs">
                                    Park Area: {guide.parkArea}
                                </Text>
                                <Text className="text-[#6D7E5E] text-xs">
                                    Time: {guide.time}
                                </Text>
                            </View>
                        </View>

                        {/* Divider line (except after last item) */}
                        {index < FULL_PARK_GUIDES.length - 1 && (
                            <View className="h-px bg-gray-200 w-full" />
                        )}
                    </TouchableOpacity>
                ))}

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <UserNavBar activeRoute="/HomeParkGuideScreen" />
        </SafeAreaView>
    );
}