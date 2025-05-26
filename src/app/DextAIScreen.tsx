import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { UserProfileHeader } from '@/components/UserProfileHeader';
import { UserNavBar } from '@/components/UserNavBar';
import { Container } from '@/components/Container';
import { useAuth } from '@/context/AuthProvider';

const AI_FEATURES = [
    {
        id: 'flora-fauna',
        title: 'Flora & Fauna Identification',
        description: 'Our AI can identify any endanger animal and plants in the National Park',
        imageUri: require('@assets/images/flora-fauna.png'),
        screenPath: '/FloraFaunaScreen',
    },
    {
        id: 'recommendation',
        title: 'Recommendation System',
        description: 'Our AI can recommend any further course after taking the Introduction to Park Guide',
        imageUri: require('@assets/images/recommendation.png'),
        screenPath: '/RecommendationScreen',
    },
];

export default function DextAIScreen() {
    const router = useRouter();
    const { session } = useAuth();

    const isLoggedIn = !!session?.user;
    const userRole = isLoggedIn ? session?.user.user_metadata?.role?.toString().trim().toLowerCase() : 'guest';

    console.log('File: DextAIScreen, Function: render, User Role:', userRole, 'IsLoggedIn:', isLoggedIn);

    const handleFeaturePress = (featurePath: string) => {
        try {
            console.log('File: DextAIScreen, Function: handleFeaturePress, Navigating to:', featurePath, 'User Role:', userRole);
            router.push(featurePath);
            console.log('File: DextAIScreen, Function: handleFeaturePress, Navigation to', featurePath, 'executed');
        } catch (error) {
            console.error('File: DextAIScreen, Function: handleFeaturePress, Navigation error:', error);
            alert(`Failed to navigate to ${featurePath}. Please try again.`);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="py-6">
                    <Container>
                        <UserProfileHeader
                            isLoggedIn={isLoggedIn}
                            onNotificationPress={() => console.log('File: DextAIScreen, Function: onNotificationPress, Notification pressed')}
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
            <UserNavBar activeRoute="/DextAIScreen" />
        </SafeAreaView>
    );
}