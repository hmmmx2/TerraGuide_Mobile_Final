import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AssessmentQuestionCardProps {
    index: number;
    question: string;
    options: {
        label: string;
        value: string;
    }[];
    selectedValue: string | null;
    correctAnswer: string;
    onSelect: (value: string) => void;
}

export const AssessmentQuestionCard: React.FC<AssessmentQuestionCardProps> = ({
                                                                                  index,
                                                                                  question,
                                                                                  options,
                                                                                  selectedValue,
                                                                                  correctAnswer,
                                                                                  onSelect,
                                                                              }) => {
    return (
        <View className="bg-[#4E6E4E] rounded-2xl px-5 py-6 mb-6 shadow-md">
            <Text className="text-white text-lg font-semibold mb-4">{question}</Text>
            <View className="space-y-3">
                {options.map((option) => {
                    const isSelected = selectedValue === option.value;
                    const isCorrect = option.value === correctAnswer;
                    const isWrongSelected = isSelected && !isCorrect;
                    const showCorrect = selectedValue !== null && isCorrect;

                    let bgColor = 'bg-[#E6ECD6]'; // default background
                    let textColor = 'text-[#4E6E4E]'; // default text color

                    // Styling for when an answer is selected
                    if (selectedValue !== null) {
                        if (isCorrect) {
                            bgColor = 'bg-green-200'; // soft green for correct answers
                            textColor = 'text-green-900'; // dark green for text when correct
                        } else if (isWrongSelected) {
                            bgColor = 'bg-red-200'; // soft red for wrong answers
                            textColor = 'text-red-900'; // dark red for text when wrong
                        } else if (isSelected) {
                            bgColor = 'bg-[#E6ECD6]'; // soft yellowish background for other selected option
                            textColor = 'text-[#4E6A46]'; // dark text for other selected option
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={option.value}
                            disabled={selectedValue !== null}
                            onPress={() => onSelect(option.value)}
                            className={`px-4 py-3 my-2 rounded-lg ${bgColor} `}
                        >
                            <Text className={`font-medium ${textColor}`}>{option.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
