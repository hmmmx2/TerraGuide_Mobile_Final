import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/BackButton';

const SurveyResultScreen = () => {
    const router = useRouter();
    const { data } = useLocalSearchParams<{ data: string }>();

    // Parse the incoming data
    const parsedData = JSON.parse(decodeURIComponent(data));
    const { title, courseData } = parsedData;

    const handleRedo = () => {
        // Navigate back to the survey form with cleared responses
        router.push({
            pathname: '/CourseSurveyFormScreen',
            params: {
                data: encodeURIComponent(JSON.stringify({ ...parsedData, responses: {} })),
            },
        });
    };

    const handleBackToCourse = () => {
        if (courseData) {
            // Navigate back to CourseDetailsScreen with the original course data
            router.push({
                pathname: '/CourseDetailsScreen',
                params: {
                    courseData: encodeURIComponent(JSON.stringify(courseData)),
                    activeTab: 'lessons', // Specify that we want the lessons tab to be active
                },
            });
        } else {
            // If no course data is available, navigate to CourseScreen
            router.push('/CourseScreen');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F2F7F2] py-10">
            <ScrollView className="flex-1 px-5">
                <View className="mb-3 mt-7">
                    <BackButton />
                </View>

                <View className="mt-4 w-auto">
                    <Text className="text-xl font-bold text-gray-800">{title}</Text>
                </View>

                {/* Result Card */}
                <View className="bg-[#4E6E4E] rounded-2xl shadow-md px-6 py-6 mb-6">
                    <Text className="self-center text-lg font-semibold text-white mb-4 mt-2">
                        You have submitted!
                    </Text>
                    <TouchableOpacity
                        onPress={handleRedo}
                        className="bg-[#6D7E5E] px-4 py-2 rounded-full mt-2 w-[100px] self-center items-center"
                    >
                        <Text className="text-white">Redo</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Button */}
                <TouchableOpacity
                    onPress={handleBackToCourse}
                    className="bg-[#6D7E5E] py-3 rounded-full mt-10"
                >
                    <Text className="text-white text-center font-semibold">Back to Course</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SurveyResultScreen;