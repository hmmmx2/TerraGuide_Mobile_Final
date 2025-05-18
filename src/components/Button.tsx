import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
    title: string;
    onPress: () => void;
    className?: string;
    textClassName?: string;
};

export function Button({
                           title,
                           onPress,
                           className = '',
                           textClassName = ''
                       }: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-[#6D7E5E] py-4 px-6 rounded-[2rem] items-center ${className}`}
        >
            <Text className={`text-white font-medium ${textClassName}`}>{title}</Text>
        </TouchableOpacity>
    );
}