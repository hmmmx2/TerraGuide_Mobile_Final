import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AssessmentQuestionCard } from '@/components/AssessmentQuestionCard';
import BackButton from "@/components/BackButton";

interface Question {
    question: string;
    options: { label: string; value: string }[];
    correct: string;
}

interface RouteParams {
    type: 'quiz' | 'exam' | 'exercise';
    title: string; // e.g., 'Exam: Intro to Park Guide'
    duration: number; // in minutes
    questions: Question[]; // Use the `Question` interface here
    data: string;
}

const AssessmentQuestionScreen = () => {
    const route = useRoute();
    const router = useRouter();

    const { data } = route.params as RouteParams; // Expect 'data' as a string

    // Decode the data
    const parsedData = JSON.parse(decodeURIComponent(data));

    // Ensure questions are part of the parsedData
    const { type, title, duration, questions } = parsedData;

    console.log('Received questions:', questions); // Check if questions are now correctly received

    // Ensure questions is defined, and if not, default it to an empty array
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(questions ? Array(questions.length).fill(null) : []);

    const totalQuestions = questions ? questions.length : 0;
    const currentQuestion = totalQuestions > 0 ? questions[currentIndex] : null;

    const handleSelect = (value: string) => {
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[currentIndex] = value;
        setSelectedAnswers(updatedAnswers);
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Submit logic: navigate to result screen
            router.push({
                pathname: '/AssessmentResultScreen',
                params: {
                    data: encodeURIComponent(JSON.stringify({
                        title,
                        duration,
                        questions,
                        answers: selectedAnswers,
                        courseData: parsedData.courseData, // Make sure to pass the course data
                        type: parsedData.type,
                        isLicenseExam: parsedData.isLicenseExam // Pass along the license exam flag
                    })),
                },
            });
        }
    };


    // Early return to show a loading state if questions are undefined or empty
    if (!questions || questions.length === 0) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Loading questions...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F2F7F2]">
            <ScrollView className="flex-1 px-4">
                <View className="mb-3 mt-7">
                    <BackButton/>
                </View>
                <View className="mt-4 w-auto">
                    <Text className="text-xl font-bold text-gray-800">{title}</Text>
                    <Text className="bg-[#E6ECD6] text-gray-800 px-3 py-1 rounded-full text-xs font-medium w-[95px] mt-1 mb-5">
                        Period: {Math.floor(parsedData.duration / 60)} mins
                    </Text>
                </View>


                <View className="my-4">
                    {currentQuestion && (
                        <AssessmentQuestionCard
                            index={currentIndex}
                            question={currentQuestion.question}
                            options={currentQuestion.options}
                            selectedValue={selectedAnswers[currentIndex]}
                            onSelect={handleSelect}
                            correctAnswer={currentQuestion.correct}
                        />
                    )}
                </View>

                <Text className="text-center mt-4 text-gray-700">
                    Question: {currentIndex + 1}/{totalQuestions}
                </Text>

                <TouchableOpacity
                    onPress={handleNext}
                    disabled={selectedAnswers[currentIndex] === null}
                    className={`mx-20 py-3 rounded-full mt-4 ${
                        selectedAnswers[currentIndex] === null
                            ? 'bg-gray-400'
                            : 'bg-[#6D7E5E]'
                    }`}
                >

                <Text className="text-white text-center font-semibold">
                        {currentIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};


export default AssessmentQuestionScreen;
