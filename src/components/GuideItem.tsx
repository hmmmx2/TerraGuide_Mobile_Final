import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

type GuideItemProps = {
    name: string;
    description: string;
    imageUri: any;
    onPress?: () => void;
};

type GuideTitleProps = {
    title: string;
    see_all: string;
    see_all_color?: string; // Add this to the type definition
    onViewAllPress?: () => void;
};

export function GuideTitle({
                               title,
                               see_all,
                               see_all_color = "#6D7E5E",
                               onViewAllPress
                           }: GuideTitleProps) { // Add proper TypeScript typing
    return (
        <View className="flex-row justify-between items-center p-2">
            <Text className="font-bold text-lg text-gray-800">{title}</Text>
            <TouchableOpacity onPress={onViewAllPress}>
                {/* Explicitly ensure see_all is a string */}
                <Text style={{ color: see_all_color }}>
                    {typeof see_all === 'string' ? see_all : ''}
                </Text>
            </TouchableOpacity>
        </View>
    );
}


export function GuideItem({
                              name,
                              description,
                              imageUri,
                              onPress = () => {}
                          }: GuideItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4"
        >
            <Image
                source={typeof imageUri === 'string' ? { uri: imageUri } : imageUri}
                className="w-14 h-14 rounded-full"
            />
            <View className="ml-4 flex-1">
                <Text className="text-custom-darkgray font-semibold text-base">{name}</Text>
                <Text className="text-custom-lightgray text-sm" numberOfLines={1}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
}