// app/TimetableScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '../components/UserNavBar';

const FULL_TIMETABLE = [
    {
        id: '1',
        time: '8:00am',
        title: 'Morning Briefing & Preparation',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.'
    },
    {
        id: '2',
        time: '8:30am',
        title: 'Morning Guided Nature Walk',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.'
    },
    {
        id: '3',
        time: '9:00am',
        title: 'Break & Rest',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.'
    },
    {
        id: '4',
        time: '9:30am',
        title: 'Morning Guided Nature Walk',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.'
    },
    {
        id: '5',
        time: '10:00am',
        title: 'Break & Rest',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.'
    },
    {
        id: '6',
        time: '10:30am',
        title: 'Morning Guided Nature Walk',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.'
    },
    {
        id: '7',
        time: '11:00am',
        title: 'Break & Rest',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.'
    }
];

export default function TimetableScreen() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            {/* Header with back button */}
            <View className="px-4 pt-12 pb-2 flex-row items-center">
                <TouchableOpacity onPress={handleGoBack} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold">Timetable</Text>
            </View>

            {/* Divider line */}
            <View className="px-4 pb-2">
                <View className="h-px bg-gray-300 w-full" />
            </View>

            {/* Timetable items */}
            <ScrollView className="flex-1 px-4">
                {FULL_TIMETABLE.map((item, index) => (
                    <View key={item.id}>
                        <View className="py-3 flex-row">
                            {/* Time column */}
                            <View className="w-16">
                                <Text className="text-gray-800 font-medium">{item.time}</Text>
                            </View>

                            {/* Content column */}
                            <View className="flex-1">
                                <Text className="text-gray-800 font-medium mb-1">{item.title}</Text>
                                <Text className="text-gray-600 text-sm" numberOfLines={3}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>

                        {/* Divider line (except after last item) */}
                        {index < FULL_TIMETABLE.length - 1 && (
                            <View className="h-px bg-gray-200 w-full" />
                        )}
                    </View>
                ))}

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <UserNavBar activeRoute="/HomeParkGuideScreen" />
        </SafeAreaView>
    );
}