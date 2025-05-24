import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '@/components/UserNavBar';
import { BlogPost, blogs } from '@/data/blogs';
import { useAuth } from '@/context/AuthProvider';

export default function BlogDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { session } = useAuth();

    // Check if user is a guest
    const isGuest = !session?.user || session.user.user_metadata?.role === 'guest';

    // Parse id to number and find blog
    const blogId = id ? parseInt(id, 10) : NaN;
    const blogDetails: BlogPost = blogs.find(blog => blog.id === blogId) || {
        id: blogId || 0,
        title: 'Blog not found',
        imageUri: null,
        paragraphs: ['This blog article does not exist.'],
    };

    // Handle placeholder blogs
    const displayDetails: BlogPost = blogDetails.isPlaceholder
        ? {
            ...blogDetails,
            imageUri: require('@assets/images/orang-utan.jpg'),
            paragraphs: [blogDetails.description || 'Coming soon...'],
        }
        : blogDetails;

    const handleGoBack = () => {
        router.back();
    };

    const handleBackToHome = () => {
        router.push(isGuest ? '/HomeGuestScreen' : '/HomeParkGuideScreen');
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