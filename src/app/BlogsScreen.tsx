import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '@/components/UserNavBar';
import { blogs } from '@/data/blogs';

export default function BlogsScreen() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const navigateToBlogDetail = (blogId: number) => {
        router.push({
            pathname: '/BlogDetailScreen',
            params: { id: blogId }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <View className="px-4 pt-12 pb-4 flex-row items-center">
                <TouchableOpacity onPress={handleGoBack} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold">Blogs</Text>
            </View>

            <View className="px-4 pb-2">
                <View className="h-px bg-gray-300 w-full" />
            </View>

            <ScrollView className="flex-1 px-4">
                <View className="flex-row flex-wrap justify-between">
                    {blogs.map((blog) => (
                        <TouchableOpacity
                            key={blog.id}
                            className="w-[48%] bg-[#F0F4E8] rounded-xl overflow-hidden mb-4 shadow-sm"
                            onPress={() => blog.isPlaceholder ? null : navigateToBlogDetail(blog.id)}
                        >
                            {blog.isPlaceholder ? (
                                <View className="h-32 bg-[#6D7E5E] justify-center items-center">
                                    <Text className="text-white text-lg font-semibold">Coming Soon</Text>
                                </View>
                            ) : (
                                <Image
                                    source={blog.imageUri}
                                    className="w-full h-32"
                                    resizeMode="cover"
                                />
                            )}

                            <View className="p-3">
                                <Text className="text-[#333] font-bold mb-1" numberOfLines={2}>
                                    {blog.title}
                                </Text>
                                <Text className="text-gray-600 text-sm" numberOfLines={2}>
                                    {blog.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>

            <UserNavBar activeRoute="/HomeParkGuideScreen" />
        </SafeAreaView>
    );
}