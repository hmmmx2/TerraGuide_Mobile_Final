import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminNavBar } from '@/components/AdminNavBar';
import { Container } from '@/components/Container';
import { useAuth } from '@/context/AuthProvider';

// Define the features array with only one item
const AI_FEATURES = [
    {
        id: 'intrusion-detection',
        title: 'Intrusion Detection System',
        description: 'Our AI can identify any endangered animal and plants in the National Park',
        imageUri: require('@assets/images/IntrusionDetectionSystem.png'),
        screenPath: '/IntruderDetectionSystemScreen',
    },
];

export default function AdminDextAIScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [userName, setUserName] = useState('Admin');

    useEffect(() => {
        if (!session?.user) {
            router.replace('/LoginScreen');
            return;
        }

        const userMetadata = session.user.user_metadata;
        if (!userMetadata) {
            router.replace('/LoginScreen');
            return;
        }

        setUserName(userMetadata.first_name || 'Admin');
        const userRole = userMetadata.role?.toString().trim().toLowerCase();
        if (userRole !== 'admin' && userRole !== 'controller') {
            router.replace('/CourseScreen');
            return;
        }
    }, [session, router]);

    const handleFeaturePress = (featurePath: string) => {
        try {
            console.log('File: AdminDextAIScreen, Function: handleFeaturePress, Navigating to:', featurePath);
            router.push(featurePath);
            console.log('File: AdminDextAIScreen, Function: handleFeaturePress, Navigation to', featurePath, 'executed');
        } catch (error) {
            console.error('File: AdminDextAIScreen, Function: handleFeaturePress, Navigation error:', error);
            alert(`Failed to navigate to ${featurePath}. Please try again.`);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="py-6">
                    <Container>
                        <AdminHeader
                            username={userName}
                            onDextAIPress={() => console.log('File: AdminDextAIScreen, Function: onDextAIPress, DextAI pressed')}
                            onNotificationPress={() => console.log('File: AdminDextAIScreen, Function: onNotificationPress, Notification pressed')}
                        />
                        <View className="mt-6 mb-4 items-center justify-center">
                            <Text className="text-2xl font-bold text-[#6D7E5E]">Dext AI</Text>
                            <View className="h-px bg-gray-300 w-full mt-2" />
                        </View>
                        {AI_FEATURES.map((feature) => (
                            <TouchableOpacity
                                key={feature.id}
                                className="bg-white rounded-xl p-4 mb-4 flex-row items-center shadow-sm border border-gray-100"
                                onPress={() => handleFeaturePress(feature.screenPath)}
                                activeOpacity={0.7}
                            >
                                <View className="w-16 h-16 bg-[#6D7E5E] rounded-lg mr-4 overflow-hidden justify-center items-center">
                                    <Image source={feature.imageUri} className="w-10 h-10" resizeMode="contain" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-bold text-lg">{feature.title}</Text>
                                    <Text className="text-gray-600 text-sm">{feature.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <View className="h-20" />
                    </Container>
                </View>
            </ScrollView>
            <AdminNavBar activeRoute="/DashboardScreen" />
        </SafeAreaView>
    );
}