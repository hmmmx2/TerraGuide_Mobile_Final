import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SurveyQuestionCard } from '@/components/SurveyQuestionCard';
import BackButton from "@/components/BackButton";

const questions = [
    "The course provided clear and useful information about the role of a park guide.",
    "The learning materials (videos, slides, readings) were engaging and helpful.",
    "The topics covered in the course were relevant to real-world park guiding.",
    "I now have a better understanding of park safety, conservation, and visitor engagement.",
];

export default function SurveyFormScreen() {
    const [responses, setResponses] = useState<{ [key: number]: number }>({});

    const handleSelect = (index: number, value: number) => {
        setResponses((prev) => ({ ...prev, [index]: value }));
    };

    return (
        // change bg to F0F7F4
        <ScrollView className="flex-1 bg-[#eef3ee] px-5 py-6">
            <View className="mb-7">
                <BackButton/>
            </View>
            <Text className="text-xl font-semibold text-gray-800">
                Survey Form - Introduction to Park Guide
            </Text>
            <Text className="border-b border-gray-300 mb-2"/>
            <Text className="text-sm text-gray-600">
                Instructions: Please rate each statement based on your experience in the course. Use the following scale:
            </Text>
            <Text className="text-sm text-gray-600 mt-2 mb-4">
                1 - Strongly Disagree{'\n'}
                2 - Disagree{'\n'}
                3 - Neutral{'\n'}
                4 - Agree{'\n'}
                5 - Strongly Agree
            </Text>

            {questions.map((q, index) => (
                <SurveyQuestionCard
                    key={index}
                    index={index}
                    question={q}
                    selectedValue={responses[index] || 0}
                    onSelect={(value) => handleSelect(index, value)}
                />
            ))}

            <TouchableOpacity className="bg-[#6D7E5E] mt-6 mb-10 py-4 rounded-full items-center">
                <Text className="text-white font-semibold text-base">Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
