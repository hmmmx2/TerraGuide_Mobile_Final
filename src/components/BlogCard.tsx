// components/BlogCard.tsx
import React from 'react';
import { Image, Text, TouchableOpacity, View, ImageBackground, ImageSourcePropType } from 'react-native';

export interface BlogPost {
    id: string;
    title: string;
    description: string;
    imageUri: ImageSourcePropType;
}

interface BlogCardProps {
    blog: BlogPost;
    onPress?: () => void;
    fullWidth?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
                                                      blog,
                                                      onPress = () => {},
                                                      fullWidth = false
                                                  }) => {
    return (
        <TouchableOpacity
            className={`bg-white rounded-xl overflow-hidden shadow-sm mb-4 ${fullWidth ? 'w-full' : 'w-[48%]'}`}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <ImageBackground
                source={blog.imageUri}
                className="w-full h-44"
                resizeMode="cover"
            >
                <View className="flex-1 bg-black/30 justify-end p-3">
                    <Text className="text-white font-bold" numberOfLines={2}>
                        {blog.title}
                    </Text>
                    <Text className="text-white text-xs mt-1 opacity-90" numberOfLines={2}>
                        {blog.description}
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};