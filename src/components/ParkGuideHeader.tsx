// ParkGuideHeader.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SearchIcon } from './icons/SearchIcon';
import { NotificationIcon } from './icons/NotificationIcon';

type UserHeaderProps = {
    username?: string;
    avatarImg?: any;
    onSearchPress?: () => void;
    onNotificationPress?: () => void;
};

export function ParkGuideHeader({
                                    username = 'ParkGuide',
                                    avatarImg = require('src/assets/images/alwin-profile-image.jpg'), // Updated image path
                                    onSearchPress = () => console.log('Search pressed'),
                                    onNotificationPress = () => console.log('Notification pressed'),
                                }: UserHeaderProps) {
    return (
        <View className="flex-row items-center justify-between w-full mt-8"> {/* Added mt-8 for top margin */}
            <View className="flex-row items-center">
                <Image
                    source={typeof avatarImg === 'string' ? { uri: avatarImg } : avatarImg}
                    className="w-12 h-12 rounded-full"
                />
                <View className="ml-3">
                    <Text className="text-custom-darkgreen text-xs">Welcome back</Text> {/* Reduced font size */}
                    <Text className="text-custom-darkgray font-bold text-lg">{username}</Text>
                </View>
            </View>

            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={onNotificationPress}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                >
                    <NotificationIcon size={18} color="#868795" />
                </TouchableOpacity>

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