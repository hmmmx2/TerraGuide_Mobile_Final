import React from 'react';
import {View, Text, TouchableOpacity, ViewStyle, Image} from 'react-native';

interface ComingSoonCardProps {
    onPress?: () => void;
}

export function ComingSoonCard({
                                   onPress,
                               }: ComingSoonCardProps) {

    return (
        <TouchableOpacity onPress={onPress}>
            <View className="w-[160px] h-[248px] bg-[#E6ECD6] p-4 rounded-2xl shadow-md">
                <View className="w-full max-h-[120px] rounded-lg overflow-hidden mb-3 relative">
                    <Image source={require('../../assets/images/ComingSoon.png')} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="flex-col">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-base font-semibold text-gray-900">Coming Soon</Text>
                    </View>
                    <View className="flex-row items-center space-x-2 mb-1">
                        <Text className="text-sm text-gray-500">Stay tuned for updates!</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
