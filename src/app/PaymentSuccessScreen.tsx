// app/PaymentSuccessScreen.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentSuccessScreen() {
    const router = useRouter();

    const handleNext = () => {
        // Navigate to home screen after successful payment
        router.replace('/HomeParkGuideScreen');
    };


    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <View className="p-6 flex-1">

                {/* Success content */}
                <View className="flex-1 justify-center items-center">
                    {/* Success icon */}
                    <View className="w-20 h-20 rounded-full bg-[#6D7E5E] justify-center items-center mb-4">
                        <Ionicons name="checkmark" size={40} color="white" />
                    </View>

                    {/* Success message */}
                    <Text className="text-gray-800 font-medium text-xl mb-3">
                        Payment Successfully!
                    </Text>

                    <Text className="text-gray-600 text-center mb-16 px-6">
                        Thank you for your payment. Your Park Guide account has been activated.
                    </Text>

                    {/* Next button */}
                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-[#6D7E5E] py-4 rounded-full items-center w-full"
                    >
                        <Text className="text-white font-medium">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}