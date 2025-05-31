// TouristHeader.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SearchIcon } from './icons/SearchIcon';

type UserHeaderProps = {
    username?: string;
    avatarImg?: any;
    onSearchPress?: () => void;
    onNotificationPress?: () => void;
};

export function TouristHeader({
                                  username = 'Tourist',
                                  avatarImg = require('@assets/images/Guest-Profile.png'),
                                  onSearchPress = () => console.log('Search pressed'),
                              }: UserHeaderProps) {
    return (
        <View className="flex-row items-center justify-between w-full mt-8">
            <View className="flex-row items-center">
                <Image
                    source={typeof avatarImg === 'string' ? { uri: avatarImg } : avatarImg}
                    className="w-12 h-12 rounded-full"
                />
                <View className="ml-3">
                    <Text className="text-custom-darkgreen text-xs">Welcome back</Text>
                    <Text className="text-custom-darkgray font-bold text-lg">{username}</Text>
                </View>
            </View>

            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={onSearchPress}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                >
                    <SearchIcon color="#868795" size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
}