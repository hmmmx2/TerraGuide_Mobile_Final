import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
    color?: string;
    size?: number;
    style?: ViewStyle;
}

export default function BackButton({ color = 'black', size = 24, style }: BackButtonProps) {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.back()} style={style}>
            <Ionicons name="arrow-back" size={size} color={color} />
        </TouchableOpacity>
    );
}
