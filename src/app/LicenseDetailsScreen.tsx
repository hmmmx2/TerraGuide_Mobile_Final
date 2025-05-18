import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import BackButton from '@/components/BackButton';
import { UserNavBar } from '@/components/UserNavBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { exam } from '@/data/exam'; // Import the exam data
import { LicenseData } from '@/types/license';

export default function LicenseDetailsScreen() {
    const { licenseData } = useLocalSearchParams<{ licenseData: string }>();
    const data: LicenseData = JSON.parse(decodeURIComponent(licenseData));
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F4] ">
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="py-10">
                    {/* Header Section */}
                    <View className="flex-row items-center mt-6 mb-4 px-4">
                        <BackButton />
                    </View>

                    {/* License Image/Header */}
                    <View className="w-full h-48 relative mb-4">
                        <Image
                            source={data.image_url ? { uri: data.image_url } : require('../../assets/images/SFC-pic.png')}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        <View className="absolute bottom-3 right-3 bg-[#6D7E5E] px-4 py-1 rounded-full">
                            <Text className="text-white font-medium">License Exam</Text>
                        </View>
                    </View>

                    {/* License Details */}
                    <View className="px-4">
                        <Text className="text-2xl font-bold mb-2">{data.title}</Text>

                        {/* Organization and Duration */}
                        <View className="flex-row items-center mb-4">
                            <FontAwesome5 name="university" size={16} color="#4E6E4E" />
                            <Text className="ml-2 text-gray-600">{data.organization}</Text>
                        </View>

                        {/* Key Info Cards */}
                        <View className="flex-row justify-between mb-6">
                            <View className="bg-[#E6ECD6] p-3 rounded-lg items-center" style={{ width: '48%' }}>
                                <FontAwesome5 name="clock" size={20} color="#6D7E5E" />
                                <Text className="text-xs text-center mt-1">{data.duration}</Text>
                            </View>
                            <View className="bg-[#E6ECD6] p-3 rounded-lg items-center" style={{ width: '48%' }}>
                                <FontAwesome5 name="certificate" size={20} color="#6D7E5E" />
                                <Text className="text-xs text-center mt-1">Valid {data.validity}</Text>
                            </View>
                        </View>

                        {/* Prerequisites Section */}
                        <Text className="text-lg font-bold mb-3">Requirements</Text>
                        <View className="mb-6">
                            {data.requirements.map((requirement) => (
                                <View key={requirement.id} className="flex-row items-center mb-2">
                                    <FontAwesome5
                                        name={requirement.completed ? "check-circle" : "circle"}
                                        size={16}
                                        color={requirement.completed ? "#4E6E4E" : "#B0B0B0"}
                                    />
                                    <Text className="ml-2 text-gray-600">{requirement.title}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Exam Section */}
                        <TouchableOpacity
                            className="bg-[#6D7E5E] py-4 rounded-full items-center"
                            // When setting up the exam data in LicenseDetailsScreen.tsx
                            onPress={() => router.push({
                                pathname: '/AssessmentDescription',
                                params: {
                                    data: encodeURIComponent(JSON.stringify({
                                        title: `Exam: ${data.title}`,
                                        duration: data.exam_duration * 60, // Convert to seconds
                                        questions: exam.questions, // Use the questions from exam.ts
                                        type: 'exam',
                                        courseData: data,
                                        isLicenseExam: true  // Add this flag to explicitly mark it as a license exam
                                    }))
                                }
                            })}
                        >
                            <Text className="text-white font-semibold text-base">
                                Start Exam ({data.exam_duration} mins)
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <UserNavBar activeRoute="/CourseScreen" />
        </SafeAreaView>
    );
}