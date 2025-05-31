import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

export default function QRSurveyScreen() {
    const router = useRouter();

    // Simple deep link for QR code - when scanned, opens survey directly
    const qrData = 'terraguide://survey';

    const handleClose = () => {
        router.back();
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <View className="flex-1 px-6 py-4">
                {/* Back Button */}
                <TouchableOpacity
                    onPress={handleBack}
                    className="mt-4 mb-8"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                {/* Content Container */}
                <View className="flex-1 justify-center items-center">
                    {/* Title */}
                    <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
                        Scan QR Code
                    </Text>

                    {/* Subtitle */}
                    <Text className="text-base text-gray-600 text-center mb-12 px-8">
                        This survey form help us improve our service. Your feedback mean a lot to us.
                    </Text>

                    {/* QR Code Container */}
                    <View className="bg-white p-8 rounded-2xl shadow-sm border-2 border-[#6D7E5E]">
                        <QRCode
                            value={qrData}
                            size={200}
                            color="#000000"
                            backgroundColor="white"
                        />
                    </View>

                    {/* Spacer */}
                    <View className="flex-1" />

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={handleClose}
                        className="bg-[#6D7E5E] py-4 px-12 rounded-full w-full max-w-xs"
                    >
                        <Text className="text-white font-medium text-center text-base">
                            Close
                        </Text>
                    </TouchableOpacity>

                    {/* Bottom Spacer */}
                    <View className="h-8" />
                </View>
            </View>
        </SafeAreaView>
    );
}