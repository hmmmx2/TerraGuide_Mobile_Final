import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '@/components/UserNavBar';

const BLOG_DETAILS = {
    '1': {
        title: 'The History of Semenggoh Nature Reserve',
        imageUri: require('@assets/images/semenggoh-history.jpg'),
        paragraphs: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ]
    },
    '2': {
        title: 'Species of Orang Utan',
        imageUri: require('@assets/images/orang-utan.jpg'),
        paragraphs: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ]
    },
    '3': {
        title: 'Conservation Efforts at Semenggoh',
        imageUri: require('@assets/images/ExploreAndLead.png'),
        paragraphs: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ]
    }
};

export default function BlogDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const blogDetails = BLOG_DETAILS[id as keyof typeof BLOG_DETAILS] || {
        title: 'Blog not found',
        imageUri: null,
        paragraphs: ['This blog article does not exist.']
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleBackToHome = () => {
        router.push('/HomeParkGuideScreen');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 pt-12 pb-4 flex-row items-center">
                <TouchableOpacity onPress={handleGoBack} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4">
                <Image
                    source={blogDetails.imageUri}
                    className="w-full h-48 rounded-xl mb-4"
                    resizeMode="cover"
                />

                <Text className="text-xl font-bold text-gray-800 mb-4">
                    {blogDetails.title}
                </Text>

                {blogDetails.paragraphs.map((paragraph, index) => (
                    <Text
                        key={index}
                        className="text-gray-600 mb-4 leading-6"
                    >
                        {paragraph}
                    </Text>
                ))}

                {/* Back to home button */}
                <TouchableOpacity
                    onPress={handleBackToHome}
                    className="bg-[#6D7E5E] rounded-full py-4 items-center my-8"
                >
                    <Text className="text-white font-medium">Back to home</Text>
                </TouchableOpacity>

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>

            <UserNavBar activeRoute="/HomeParkGuideScreen" />
        </SafeAreaView>
    );
}