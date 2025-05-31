import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';

export default function QRScannerScreen() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);

        // Debug: Log the scanned data to see what we're actually getting
        console.log('QR Code scanned data:', data);
        console.log('Data type:', typeof data);
        console.log('Data length:', data.length);

        // Check for various possible QR data formats
        const isSurveyQR = (
            data.includes('terraguide://survey') ||
            data.includes('survey') ||
            data.includes('terraguide') ||
            data.includes('Semenggoh') ||
            data.includes('park guide')
        );

        if (isSurveyQR) {
            // Valid survey QR code
            console.log('Valid survey QR detected, opening survey');
            Alert.alert(
                'Survey QR Code Detected!',
                `Scanned data: ${data.substring(0, 50)}...\n\nThis will open the park guide performance survey. Would you like to continue?`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => {
                            console.log('User cancelled survey');
                            setScanned(false);
                        },
                        style: 'cancel'
                    },
                    {
                        text: 'Take Survey',
                        onPress: () => {
                            console.log('User confirmed, navigating to survey');
                            router.push('/GuestSurveyFormScreen');
                        }
                    }
                ]
            );
        } else {
            // Not a survey QR code
            console.log('Invalid QR code detected:', data);
            Alert.alert(
                'QR Code Scanned',
                `Scanned data: ${data}\n\nThis doesn't appear to be a park guide survey QR code. Please scan the QR code provided by your park guide.`,
                [
                    {
                        text: 'Try Again',
                        onPress: () => setScanned(false)
                    },
                    {
                        text: 'Open Survey Anyway',
                        onPress: () => {
                            console.log('User chose to open survey anyway');
                            router.push('/GuestSurveyFormScreen');
                        }
                    }
                ]
            );
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (!permission) {
        // Camera permissions are still loading
        return (
            <SafeAreaView className="flex-1 bg-[#F8F9FA] justify-center items-center">
                <Text className="text-gray-600">Loading camera...</Text>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <SafeAreaView className="flex-1 bg-[#F8F9FA]">
                <View className="p-6 flex-1">
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={handleBack}
                        className="mt-4 mb-8"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <View className="flex-1 justify-center items-center px-8">
                        <Ionicons name="camera-outline" size={64} color="#6D7E5E" />
                        <Text className="text-xl font-bold text-gray-800 text-center mt-4 mb-4">
                            Camera Permission Required
                        </Text>
                        <Text className="text-gray-600 text-center mb-8">
                            To scan QR codes for park guide surveys, please allow camera access.
                        </Text>
                        <TouchableOpacity
                            onPress={requestPermission}
                            className="bg-[#6D7E5E] py-3 px-6 rounded-full"
                        >
                            <Text className="text-white font-medium">Grant Permission</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* Back Button */}
            <View className="absolute top-12 left-6 z-10">
                <TouchableOpacity
                    onPress={handleBack}
                    className="w-10 h-10 bg-black bg-opacity-50 rounded-full items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View className="absolute top-20 left-6 right-6 z-10">
                <View className="bg-black bg-opacity-70 p-4 rounded-xl">
                    <Text className="text-white font-bold text-lg text-center mb-2">
                        Scan Survey QR Code
                    </Text>
                    <Text className="text-white text-sm text-center">
                        Point your camera at the QR code shown by your park guide
                    </Text>
                </View>
            </View>

            {/* Camera View */}
            <CameraView
                style={{ flex: 1 }}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            >
                {/* Scanning Frame */}
                <View className="flex-1 justify-center items-center">
                    <View className="w-64 h-64 border-2 border-white rounded-2xl relative">
                        {/* Corner indicators */}
                        <View className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-[#6D7E5E] rounded-tl-lg" />
                        <View className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-[#6D7E5E] rounded-tr-lg" />
                        <View className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-[#6D7E5E] rounded-bl-lg" />
                        <View className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-[#6D7E5E] rounded-br-lg" />
                    </View>
                </View>
            </CameraView>

            {/* Bottom Instructions */}
            <View className="absolute bottom-20 left-6 right-6">
                <View className="bg-black bg-opacity-70 p-4 rounded-xl">
                    <Text className="text-white text-center text-sm">
                        Position the QR code within the frame above
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}