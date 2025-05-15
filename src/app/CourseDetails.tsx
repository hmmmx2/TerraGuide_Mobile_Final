import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { quiz } from '@/data/quiz';
import { exam } from '@/data/exam';
import { exercise } from '@/data/exercise';
import { AssessmentData } from './types';
import { UserNavBar } from '@/components/UserNavBar';

const AssessmentPlaceholderScreen = () => {
    const router = useRouter();

    const handleStart = (type: 'quiz' | 'exam' | 'exercise') => {
        // Explicitly assert that the data is of type `AssessmentData`
        const data: AssessmentData = (type === 'quiz' ? quiz : type === 'exam' ? exam : exercise) as AssessmentData;

        router.push({
            pathname: '/AssessmentDescription',
            params: {
                data: encodeURIComponent(JSON.stringify(data)),
            },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-4">
                <Text className="text-xl font-bold text-gray-800 mb-8">Choose an Assessment Type</Text>

                <TouchableOpacity
                    onPress={() => handleStart('quiz')}
                    className="bg-[#E6ECD6] px-6 py-4 rounded-full mb-4 w-full"
                >
                    <Text className="text-[#4E6E4E] text-center font-semibold text-base">Start Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleStart('exam')}
                    className="bg-[#6D7E5E] px-6 py-4 rounded-full mb-4 w-full"
                >
                    <Text className="text-white text-center font-semibold text-base">Start Exam</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleStart('exercise')}
                    className="bg-[#4E6E4E] px-6 py-4 rounded-full w-full"
                >
                    <Text className="text-white text-center font-semibold text-base">Start Exercise</Text>
                </TouchableOpacity>
            </View>
            <UserNavBar activeRoute="/CourseDetails" />
        </SafeAreaView>
    );
};

export default AssessmentPlaceholderScreen;
