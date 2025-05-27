import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SurveyQuestionCard } from '@/components/SurveyQuestionCard';
import BackButton from "@/components/BackButton";
import { useRouter } from 'expo-router';

// Survey categories and questions
const surveyData = [
    {
        category: "Basic Guiding Skills & Communication",
        subtitle: "(Aligns with: Introduction to Park Guiding)",
        questions: [
            "How well did your guide welcome and introduce themselves to the group?",
            "How clearly did your guide explain the tour itinerary and expectations?",
            "How effectively did your guide communicate in English/local language?",
            "How well did your guide manage the pace of the tour for all visitors?"
        ]
    },
    {
        category: "Wildlife & Nature Knowledge",
        subtitle: "(Aligns with: Nature Guide Fundamentals)",
        questions: [
            "How knowledgeable was your guide about orangutan behavior and characteristics?",
            "How well did your guide identify and explain other wildlife species encountered?",
            "How accurately did your guide explain the rainforest ecosystem and plant life?",
            "How well did your guide answer questions about wildlife and nature?"
        ]
    },
    {
        category: "Environmental Interpretation & Education",
        subtitle: "(Aligns with: Eco-Guide Training: Field & Interpretation Skills)",
        questions: [
            "How effectively did your guide explain conservation efforts at Semenggoh?",
            "How well did your guide connect wildlife observations to broader environmental issues?",
            "How engaging were your guide's storytelling and interpretation techniques?",
            "How well did your guide promote sustainable tourism practices?"
        ]
    },
    {
        category: "Group Management & Leadership",
        subtitle: "(Aligns with: Advanced Park Guiding: Leadership and Safety)",
        questions: [
            "How well did your guide manage group dynamics and keep everyone engaged?",
            "How effectively did your guide ensure everyone could see and hear clearly?",
            "How well did your guide handle disruptions or difficult situations?",
            "How confident and authoritative was your guide's leadership style?"
        ]
    },
    {
        category: "Safety & Professionalism",
        subtitle: "(Aligns with: Advanced Park Guiding: Leadership and Safety)",
        questions: [
            "How well did your guide prioritize visitor safety throughout the tour?",
            "How clearly did your guide communicate safety rules and guidelines?",
            "How professional was your guide's appearance and demeanor?",
            "How well did your guide respect wildlife welfare and park regulations?"
        ]
    },
    {
        category: "Cultural & Local Knowledge",
        subtitle: "(Aligns with: Master Park Guide Certification Program)",
        questions: [
            "How well did your guide share local customs and cultural sensitivity practices?",
            "How knowledgeable was your guide about Sarawak's history and geography?",
            "How well did your guide explain the significance of Semenggoh to local communities?"
        ]
    },
    {
        category: "Overall Experience & Expertise",
        subtitle: "(Aligns with: Master Park Guide Certification Program)",
        questions: [
            "How would you rate your guide's overall expertise and knowledge depth?",
            "How memorable and impactful was your guided experience?",
            "How likely are you to recommend this guide to other visitors?"
        ]
    }
];

export default function GuideSurveyFormScreen() {
    const router = useRouter();
    const [responses, setResponses] = useState<{ [key: number]: number }>({});

    const handleSelect = (index: number, value: number) => {
        setResponses((prev) => ({ ...prev, [index]: value }));
    };

    const handleSubmit = () => {
        // Calculate total questions
        const totalQuestions = surveyData.reduce((sum, category) => sum + category.questions.length, 0);
        const answeredQuestions = Object.keys(responses).length;

        if (answeredQuestions < totalQuestions) {
            Alert.alert(
                'Incomplete Survey',
                `Please answer all questions. You have answered ${answeredQuestions} out of ${totalQuestions} questions.`,
                [{ text: 'OK' }]
            );
            return;
        }

        // Calculate average rating
        const totalRating = Object.values(responses).reduce((sum, rating) => sum + rating, 0);
        const averageRating = (totalRating / totalQuestions).toFixed(1);

        Alert.alert(
            'Survey Submitted Successfully!',
            `Thank you for your feedback. Average rating: ${averageRating}/5.0`,
            [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]
        );
    };

    // Create a flat array of all questions with their indices
    let questionIndex = 0;
    const allQuestions = surveyData.map(category => ({
        ...category,
        questions: category.questions.map(question => ({
            question,
            index: questionIndex++
        }))
    }));

    return (
        <ScrollView className="flex-1 bg-[#eef3ee] px-5 py-6">
            <View className="flex-1 py-10">
                <View className="mb-7">
                    <BackButton/>
                </View>

                {/* Header */}
                <Text className="text-xl font-bold text-gray-800 mb-2">
                    Semenggoh Wildlife Centre Park Guide Performance Survey
                </Text>
                <Text className="text-base font-semibold text-gray-700 mb-4">
                    Help us improve our park guide services! Please rate your guide's performance during your visit today.
                </Text>

                <View className="border-b border-gray-300 mb-4"/>

                {/* Instructions */}
                <View className="bg-white p-4 rounded-lg mb-6 shadow-sm">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Rating Scale Instructions:
                    </Text>
                    <Text className="text-sm text-gray-600">
                        1 = Poor{'\n'}
                        2 = Fair{'\n'}
                        3 = Good{'\n'}
                        4 = Very Good{'\n'}
                        5 = Excellent
                    </Text>
                </View>

                {/* Survey Questions by Category */}
                {allQuestions.map((categoryData, categoryIndex) => (
                    <View key={categoryIndex} className="mb-6">
                        {/* Category Header */}
                        <View className="bg-[#6D7E5E] p-4 rounded-t-lg">
                            <Text className="text-white font-bold text-base">
                                {categoryData.category}
                            </Text>
                            <Text className="text-white text-sm opacity-90 mt-1">
                                {categoryData.subtitle}
                            </Text>
                        </View>

                        {/* Questions in this category */}
                        <View className="bg-white rounded-b-lg shadow-sm">
                            {categoryData.questions.map((questionData, questionIndex) => (
                                <View key={questionData.index}>
                    <SurveyQuestionCard
                                        index={questionData.index}
                                        question={`Q${questionData.index + 1}. ${questionData.question}`}
                                        selectedValue={responses[questionData.index] || 0}
                                        onSelect={(value) => handleSelect(questionData.index, value)}
                    />
                                    {questionIndex < categoryData.questions.length - 1 && (
                                        <View className="border-b border-gray-100 mx-4" />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Progress Indicator */}
                <View className="bg-white p-4 rounded-lg mb-6 shadow-sm">
                    <Text className="text-sm text-gray-600 text-center">
                        Progress: {Object.keys(responses).length} / 26 questions completed
                    </Text>
                    <View className="bg-gray-200 h-2 rounded-full mt-2">
                        <View
                            className="bg-[#6D7E5E] h-2 rounded-full"
                            style={{ width: `${(Object.keys(responses).length / 26) * 100}%` }}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className="bg-[#6D7E5E] mt-6 mb-10 py-4 rounded-full items-center shadow-sm"
                    onPress={handleSubmit}
                >
                    <Text className="text-white font-semibold text-base">Submit Survey</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
