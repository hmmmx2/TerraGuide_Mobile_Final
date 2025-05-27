import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SurveyQuestionCard } from '@/components/SurveyQuestionCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Survey data - same as before
const surveyData = [
    {
        category: "Basic Guiding Skills & Communication",
        questions: [
            "How well did your guide welcome and introduce themselves to the group?",
            "How clearly did your guide explain the tour itinerary and expectations?",
            "How effectively did your guide communicate in English/local language?",
            "How well did your guide manage the pace of the tour for all visitors?"
        ]
    },
    {
        category: "Wildlife & Nature Knowledge",
        questions: [
            "How knowledgeable was your guide about orangutan behavior and characteristics?",
            "How well did your guide identify and explain other wildlife species encountered?",
            "How accurately did your guide explain the rainforest ecosystem and plant life?",
            "How well did your guide answer questions about wildlife and nature?"
        ]
    },
    {
        category: "Environmental Interpretation & Education",
        questions: [
            "How effectively did your guide explain conservation efforts at Semenggoh?",
            "How well did your guide connect wildlife observations to broader environmental issues?",
            "How engaging were your guide's storytelling and interpretation techniques?",
            "How well did your guide promote sustainable tourism practices?"
        ]
    },
    {
        category: "Group Management & Leadership",
        questions: [
            "How well did your guide manage group dynamics and keep everyone engaged?",
            "How effectively did your guide ensure everyone could see and hear clearly?",
            "How well did your guide handle disruptions or difficult situations?",
            "How confident and authoritative was your guide's leadership style?"
        ]
    },
    {
        category: "Safety & Professionalism",
        questions: [
            "How well did your guide prioritize visitor safety throughout the tour?",
            "How clearly did your guide communicate safety rules and guidelines?",
            "How professional was your guide's appearance and demeanor?",
            "How well did your guide respect wildlife welfare and park regulations?"
        ]
    },
    {
        category: "Cultural & Local Knowledge",
        questions: [
            "How well did your guide share local customs and cultural sensitivity practices?",
            "How knowledgeable was your guide about Sarawak's history and geography?",
            "How well did your guide explain the significance of Semenggoh to local communities?"
        ]
    },
    {
        category: "Overall Experience & Expertise",
        questions: [
            "How would you rate your guide's overall expertise and knowledge depth?",
            "How memorable and impactful was your guided experience?",
            "How likely are you to recommend this guide to other visitors?"
        ]
    }
];

export default function GuestSurveyFormScreen() {
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

        // For now, just store locally (no backend integration)
        console.log('Survey Response:', {
            timestamp: new Date().toISOString(),
            responses,
            averageRating,
            totalQuestions
        });

        Alert.alert(
            '🌟 Thank You!',
            `Your feedback has been recorded!\n\nAverage Rating: ${averageRating}/5.0\n\nYour input helps us improve our guide services. We appreciate you taking the time to share your experience at Semenggoh Wildlife Centre.`,
            [
                {
                    text: 'Close',
                    onPress: () => {
                        // For mobile-only: just go back or close
                        router.back();
                    }
                }
            ]
        );
    };

    const handleClose = () => {
        const answeredQuestions = Object.keys(responses).length;
        if (answeredQuestions > 0) {
            Alert.alert(
                'Exit Survey?',
                'You have started the survey. Are you sure you want to exit? Your responses will not be saved.',
                [
                    { text: 'Continue Survey', style: 'cancel' },
                    { text: 'Exit', style: 'destructive', onPress: () => router.back() }
                ]
            );
        } else {
            router.back();
        }
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
                {/* Header with Close Button */}
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-gray-800">
                            📱 Tourist Survey
                        </Text>
                        <Text className="text-sm text-gray-600">
                            Rate your guided tour experience
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleClose}
                        className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Survey Title */}
                <View className="bg-white p-6 rounded-xl mb-6 shadow-sm">
                    <Text className="text-xl font-bold text-[#6D7E5E] text-center mb-2">
                        🦧 Semenggoh Wildlife Centre
                    </Text>
                    <Text className="text-base font-semibold text-gray-700 text-center">
                        Park Guide Performance Survey
                    </Text>
                </View>

                {/* Instructions */}
                <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        📝 Rating Instructions:
                    </Text>
                    <Text className="text-sm text-gray-600">
                        ⭐ 1 = Poor  ⭐⭐ 2 = Fair  ⭐⭐⭐ 3 = Good{'\n'}
                        ⭐⭐⭐⭐ 4 = Very Good  ⭐⭐⭐⭐⭐ 5 = Excellent
                    </Text>
                </View>

                {/* Survey Questions by Category */}
                {allQuestions.map((categoryData, categoryIndex) => (
                    <View key={categoryIndex} className="mb-6">
                        {/* Category Header */}
                        <View className="bg-[#6D7E5E] p-4 rounded-t-xl">
                            <Text className="text-white font-bold text-base">
                                {categoryData.category}
                            </Text>
                        </View>

                        {/* Questions in this category */}
                        <View className="bg-white rounded-b-xl shadow-sm">
                            {categoryData.questions.map((questionData, questionIndex) => (
                                <View key={questionData.index}>
                                    <SurveyQuestionCard
                                        index={questionData.index}
                                        question={`${questionData.index + 1}. ${questionData.question}`}
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
                <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
                    <Text className="text-sm text-gray-600 text-center mb-2">
                        Progress: {Object.keys(responses).length} / 26 questions completed
                    </Text>
                    <View className="bg-gray-200 h-3 rounded-full">
                        <View
                            className="bg-[#6D7E5E] h-3 rounded-full"
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

                {/* Footer */}
                <View className="items-center mb-6">
                    <Text className="text-xs text-gray-400 text-center">
                        🙏 Thank you for visiting Semenggoh Wildlife Centre{'\n'}
                        Your feedback helps us improve our services
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}