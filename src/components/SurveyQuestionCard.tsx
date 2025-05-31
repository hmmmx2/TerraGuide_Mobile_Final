import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SurveyQuestionCardProps {
    index: number;
    question: string;
    selectedValue: number;
    onSelect: (value: number) => void;
}

export const SurveyQuestionCard: React.FC<SurveyQuestionCardProps> = ({
                                                              index,
                                                              question,
                                                              selectedValue,
                                                              onSelect,
                                                          }) => {
    return (
        <View className="bg-[#4E6E4E] rounded-2xl px-5 py-6 mb-4">
            <Text className="text-white text-base mb-4">Q{index + 1}. {question}</Text>
            <View className="flex-row justify-between">
                {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity
                        key={value}
                        onPress={() => onSelect(value)}
                        className={`w-10 h-10 rounded-md items-center justify-center ${
                            selectedValue === value
                                ? 'bg-[#E6ECD6]'
                                : 'bg-[#6D7E5E]'
                        }`}
                    >
                        <Text className={`font-semibold ${selectedValue === value ? 'text-[#4E6A46]' : 'text-[#DDE1D2]'}`}>{value}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
