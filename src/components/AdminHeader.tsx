import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NotificationIcon } from './icons/NotificationIcon';
import DextAIIcon from '../../assets/icons/artificial-intelligence-dark.svg';

type AdminHeaderProps = {
    username?: string;
    avatarImg?: any;
    onDextAIPress?: () => void;
    onNotificationPress?: () => void;
    onMenuPress?: () => void;
};

export function AdminHeader({
    username = 'Admin',
    avatarImg = require('@assets/images/profile_pic.jpg'),
    onDextAIPress = () => console.log('DextAI pressed'),
    onNotificationPress = () => console.log('Notification pressed'),
    onMenuPress = () => console.log('Menu pressed'),
}: AdminHeaderProps) {
    const router = useRouter();
    
    return (
        <View className="flex-row justify-between items-center w-full mt-10">
            <View className="flex-row items-center">
                <Image
                    source={typeof avatarImg === 'string' ? { uri: avatarImg } : avatarImg}
                    className="w-12 h-12 rounded-full"
                />
                <View className="ml-3">
                    <Text className="text-xs text-[#4E6E4E]">Welcome Back</Text>
                    <Text className="text-base font-bold">{username}</Text>
                </View>
            </View>

            <View className="flex-row gap-3">
                <TouchableOpacity 
                    onPress={onDextAIPress}
                    className="mr-1 w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                >
                    <DextAIIcon width={18} height={18}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onNotificationPress}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                >
                    <NotificationIcon size={18} color="#868795" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onMenuPress}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                >
                    <Ionicons name="menu" size={18} color="#868795" />
                </TouchableOpacity>
            </View>
        </View>
    );
}