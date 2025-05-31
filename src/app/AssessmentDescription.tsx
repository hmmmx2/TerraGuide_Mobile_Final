import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AssessmentData } from './types';
import BackButton from "@/components/BackButton";

const AssessmentDescriptionScreen = () => {
    const router = useRouter();
    const { data } = useLocalSearchParams<{ data: string }>();

    const parsedData: AssessmentData = JSON.parse(decodeURIComponent(data));
    const isQuizOrExam = parsedData.type === 'quiz' || parsedData.type === 'exam';

    const handleStart = () => {
        const dataToSend = {
            title: parsedData.title,
            duration: parsedData.duration,
            questions: parsedData.questions,
            type: parsedData.type,
            courseData: parsedData.courseData, // Pass along the course data
        };

        // Log to check the data
        console.log("Data being passed to next screen:", dataToSend);

        router.push({
            pathname: '/AssessmentQuestion',
            params: {
                data: encodeURIComponent(JSON.stringify(dataToSend)),
            },
        });
    };


    return (
        <SafeAreaView className="flex-1 bg-[#F2F7F2]">
            <ScrollView className="px-4 py-6">
                <View className="py-10">
                    <View className="mb-7">
                        <BackButton/>
                    </View>
                    <Text className="text-xl px-3 font-bold text-gray-800 mb-2">{parsedData.title}</Text>
                    <Text className="text-gray-800 px-3 rounded-full text-xs font-medium w-fit mb-6">
                        Period: {Math.floor(parsedData.duration / 60)} minutes
                    </Text>

                    <View className="bg-[#E6ECD6] rounded-xl px-4 py-5 mb-4">
                        <Text className="font-semibold text-gray-800 mb-1">Description:</Text>
                        <Text className="text-sm text-gray-700 mb-4">
                            Lorem ipsum dolor sit amet...
                        </Text>
                        <Text className="font-semibold text-gray-800 mb-1">Submission Types:</Text>
                        <Text className="text-sm text-gray-700 mb-4">
                            {parsedData.type.charAt(0).toUpperCase() + parsedData.type.slice(1)}
                        </Text>
                        <Text className="font-semibold text-gray-800 mb-1">Settings:</Text>
                        <Text className="text-sm text-gray-700">
                            Question: {parsedData.questions.length}
                            {"\n"}Time Limits: {Math.floor(parsedData.duration / 60)} minutes
                            {"\n"}Allowed attempts: 1
                        </Text>
                    </View>

                    {isQuizOrExam && (
                        <View className="bg-[#4E6E4E] rounded-xl px-4 py-5 mb-4">
                            <Text className="font-semibold text-white mb-2 underline">Academic Misconduct:</Text>
                            <Text className="text-sm font-semibold text-white my-1">
                                CONTRACT CHEATING / THIRD PARTY OUTSOURCING:
                            </Text>
                            <Text className="text-sm text-[#E0E7DB] leading-relaxed">
                                A learner submits work as their own for assessment that has been fully or partially completed by a third party, either paid or unpaid.{"\n\n"}
                            </Text>
                            <Text className="font-semibold text-white">
                                This may include, but is not limited to:
                            </Text>
                            <View className="mt-2 space-y-1">
                                <Text className="text-sm text-[#E0E7DB]">• Work that is produced by artificial intelligence content producing tools (or other technologies) without permission or TerraGuide-approved acknowledgement</Text>
                                <Text className="text-sm text-[#E0E7DB]">• Work that is produced by a friend or family member</Text>
                                <Text className="text-sm text-[#E0E7DB]">• Work that is produced by a current or previous student of this or another university</Text>
                                <Text className="text-sm text-[#E0E7DB]">• Work that is produced by a current or previous staff member of this or another university</Text>
                                <Text className="text-sm text-[#E0E7DB]">• Work that is produced by a commercial third party (such as a tutor or editor)</Text>
                            </View>
                        </View>
                    )}


                    <TouchableOpacity
                        onPress={handleStart}
                        className="bg-[#6D7E5E] py-3 rounded-full mt-6 mb-10"
                    >
                        <Text className="text-white text-center font-semibold">Start</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AssessmentDescriptionScreen;
