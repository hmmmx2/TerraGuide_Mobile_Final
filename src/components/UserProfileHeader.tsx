import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SearchIcon } from './icons/SearchIcon';
import { NotificationIcon } from './icons/NotificationIcon';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

type UserHeaderProps = {
    username?: string;
    avatarImg?: any;
    isLoggedIn?: boolean;
    onNotificationPress?: () => void;
};

export function UserProfileHeader({
    username,
    avatarImg,
    isLoggedIn = false,
    onNotificationPress = () => console.log('Notification pressed'),
}: UserHeaderProps) {
    const router = useRouter();
    
    // Default guest values
    const displayName = isLoggedIn && username ? username : "Guest";
    const displayAvatar = isLoggedIn && avatarImg 
        ? (typeof avatarImg === 'string' ? { uri: avatarImg } : avatarImg)
        : require('@assets/images/Guest-Profile.png');
    
    const handleSearchPress = () => {
        router.push('/SearchScreen');
    };
    
    const handleQRCodePress = () => {
        console.log('QR Code pressed');
        // You can implement QR code scanning functionality here
    };

    return (
        <View className="flex-row items-center justify-between w-full mt-10">
            <View className="flex-row items-center">
                <Image
                    source={displayAvatar}
                    className="w-12 h-12 rounded-full"
                />
                <View className="ml-3">
                    <Text className="text-custom-darkgreen text-xs">Welcome back</Text>
                    <Text className="text-custom-darkgray font-bold text-lg">{displayName}</Text>
                </View>
            </View>

            <View className="flex-row gap-3">
                {/* Show search button for all users */}
                <TouchableOpacity
                    onPress={handleSearchPress}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                >
                    <SearchIcon color="#868795" size={18} />
                </TouchableOpacity>
                
                {/* Show QR code button for guest users, notification for logged-in users */}
                {!isLoggedIn ? (
                    <TouchableOpacity
                        onPress={handleQRCodePress}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    >
                        <Ionicons name="qr-code-outline" size={18} color="#868795" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={onNotificationPress}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    >
                        <NotificationIcon size={18} color="#868795" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}