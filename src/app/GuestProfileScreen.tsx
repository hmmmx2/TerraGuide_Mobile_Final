import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from "expo-router";
import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '@/components/UserNavBar';

export default function GuestProfileScreen() {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace('/LoginScreen');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleRegister = () => {
        router.push('/RegisterScreen');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="py-8">
                    {/* Header */}
                    <View className="w-full p-4 mt-8">
                        <View className="items-center mt-4">
                            {/* Guest Profile Image */}
                            <Image
                                source={require('../../assets/images/Guest-Profile.png')}
                                className="w-24 h-24 rounded-full mb-2"
                                resizeMode="cover"
                            />
                            {/* Guest Label */}
                            <Text className="text-xl font-bold text-gray-800 mb-1">Guest User</Text>
                            <Text className="text-sm text-gray-500 mb-4">
                                Register to access all features
                            </Text>
                        </View>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        className="mx-4 bg-[#6D7E5E] py-3 rounded-lg mb-4"
                        onPress={handleRegister}
                    >
                        <Text className="text-white font-semibold text-center">
                            Register as Park Guide
                        </Text>
                    </TouchableOpacity>

                    {/* Information Section */}
                    <View className="bg-white mx-4 rounded-lg p-4 mb-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Guest Access Information
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            • Browse park information and guides
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            • View available courses and licenses
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            • Access basic park resources
                        </Text>
                    </View>

                    {/* Premium Features Section */}
                    <View className="bg-white mx-4 rounded-lg p-4 mb-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Premium Features (Park Guide Only)
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            • Enroll in courses and earn certificates
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            • Apply for licenses and certifications
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            • Access Dext AI assistant for park information
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            • Track your learning progress
                        </Text>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        className="mx-4 border border-red-500 py-3 rounded-lg mt-4"
                        onPress={handleLogout}
                    >
                        <View className="flex-row justify-center items-center">
                            <Ionicons name="log-out-outline" size={20} color="#F44336" />
                            <Text className="text-red-500 font-semibold ml-2">
                                Logout
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            {/* Bottom Navigation Bar */}
            <UserNavBar activeRoute="/ProfileScreen" />
        </SafeAreaView>
    );
}