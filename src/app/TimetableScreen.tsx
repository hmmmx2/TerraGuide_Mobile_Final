// app/TimetableScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '@/components/UserNavBar';
import { timetables } from '@/data/timetables';

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
                {timetables.map((item, index) => (
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
                        {index < timetables.length - 1 && (
                            <View className="h-px bg-gray-200 w-full" />
                        )}
                    </View>
                ))}

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>

            <UserNavBar activeRoute="/HomeParkGuideScreen" />
        </SafeAreaView>
    );
}