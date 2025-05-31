import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/BackButton';

const AssessmentResultScreen = () => {
    const router = useRouter();
    const { data } = useLocalSearchParams<{ data: string }>();

    const parsedData = JSON.parse(decodeURIComponent(data));
    const { title, duration, questions, answers } = parsedData;

    const correctCount = questions.reduce((acc: number, q: any, index: number) => {
        return acc + (q.correct === answers[index] ? 1 : 0);
    }, 0);

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const handleRedo = () => {
        router.push({
            pathname: '/AssessmentQuestion',
            params: {
                data: encodeURIComponent(JSON.stringify({ ...parsedData, answers: [] })),
            },
        });
    };

    const handleBackToCourse = () => {
        // Extract the original course data from the assessment data if available
        const courseData = parsedData.courseData;
        
        if (courseData) {
            // Modified check with explicit license flag
            if (parsedData.isLicenseExam || 
                (parsedData.type === 'exam' && 
                 courseData.organization && 
                 courseData.requirements)) {
            
                console.log("Detected license exam, navigating to LicenseDetailsScreen");
                router.push({
                    pathname: '/LicenseDetailsScreen',
                    params: {
                        licenseData: encodeURIComponent(JSON.stringify(courseData)),
                    },
                });
            } else {
                console.log("Detected course assessment, navigating to CourseDetailsScreen");
                // Navigate back to CourseDetailsScreen with the original course data
                router.push({
                    pathname: '/CourseDetailsScreen',
                    params: {
                        courseData: encodeURIComponent(JSON.stringify(courseData)),
                        activeTab: 'lessons' // Specify that we want the lessons tab to be active
                    },
                });
            }
        } else {
            // If no course data is available, navigate to CourseScreen
            console.log("No course data available, navigating to CourseScreen");
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
                    <Text className="bg-[#E6ECD6] text-gray-800 px-3 py-1 rounded-full text-xs font-medium w-[95px] mt-1 mb-5">
                        Period: {Math.floor(duration / 60)} mins
                    </Text>
                </View>

                {/* Result Card */}
                <View className="bg-[#4E6E4E] rounded-2xl shadow-md px-6 py-6 mb-6">
                    <Text className="self-center text-white mb-2">You scored {correctCount} out of {total} questions</Text>
                    <Text className="self-center text-lg font-semibold text-white mb-4 mt-2">
                        Percentage:
                    </Text>
                    <Text className="self-center text-6xl font-bold text-white mb-5">
                        {percentage}%
                    </Text>
                    <TouchableOpacity
                        onPress={handleRedo}
                        className="bg-[#6D7E5E] px-4 py-2 rounded-full mt-2 w-[100px] self-center items-center"
                    >
                        <Text className="text-white ">Redo</Text>
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

export default AssessmentResultScreen;
