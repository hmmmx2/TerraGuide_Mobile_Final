// FloraFaunaScreen.tsx - Modified to integrate plant identification while keeping original design

import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '../components/UserNavBar';
import * as ImagePicker from 'expo-image-picker';
import { plantAPI, PlantResult } from '@/lib/plantAPI';

export default function FloraIdentificationScreen() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isIdentifying, setIsIdentifying] = useState(false);
    const [plantResult, setPlantResult] = useState<PlantResult | null>(null);

    const handleGoBack = () => {
        router.back();
    };

    const handleImageUpload = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using working version
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8, // Reduced to help with file size
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setPlantResult(null); // Clear previous results
            console.log('Image selected:', result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Camera permission is required to take photos!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using working version
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setPlantResult(null); // Clear previous results
            console.log('Photo taken:', result.assets[0].uri);
        }
    };

    const handleTryNow = async () => {
        if (selectedImage) {
            setIsIdentifying(true);
            console.log('Processing image:', selectedImage);

            try {
                const response = await plantAPI.identifyPlant(selectedImage);

                if (response.success && response.result) {
                    setPlantResult(response.result);

                    // Show result in alert
                    Alert.alert(
                        'Plant Identification Result 🌿',
                        `Species: ${response.result.predicted_class}\nConfidence: ${(response.result.confidence * 100).toFixed(1)}%`,
                        [{ text: 'OK', style: 'default' }]
                    );
                } else {
                    Alert.alert(
                        'Identification Failed',
                        response.error || 'Could not identify the plant. Please try with a clearer image.',
                        [{ text: 'OK' }]
                    );
                }
            } catch (error) {
                console.error('Plant identification error:', error);
                Alert.alert(
                    'Error',
                    'An error occurred during plant identification. Please try again.',
                    [{ text: 'OK' }]
                );
            } finally {
                setIsIdentifying(false);
            }
        } else {
            Alert.alert('No Image Selected', 'Please select or take a photo of a plant first');
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setPlantResult(null);
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return '#22c55e'; // Green
        if (confidence >= 0.6) return '#eab308'; // Yellow
        return '#f97316'; // Orange
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="px-4 pt-12 pb-4">
                    {/* Back button */}
                    <TouchableOpacity onPress={handleGoBack} className="mb-4 mt-5">
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    {/* Header Card */}
                    <View className="bg-[#6D7E5E] rounded-xl p-4 mb-4 items-center">
                        <Image
                            source={require('@assets/images/flora-fauna.png')}
                            className="w-32 h-32"
                            resizeMode="contain"
                        />
                    </View>

                    {/* Title - Updated to Flora only */}
                    <Text className="text-2xl font-bold text-gray-800 mb-2">
                        🌿 Flora Identification
                    </Text>

                    {/* Description - Updated for plant identification */}
                    <Text className="text-gray-600 mb-4">
                        Identify plants and orchids using AI technology. Take or upload a photo of a plant to discover its species. Our system can recognize 15 different Southeast Asian orchid species.
                    </Text>

                    {/* Photo Upload Guidelines */}
                    <View className="mb-4">
                        <Text className="text-gray-800 font-bold mb-2">
                            Photo upload guidelines:
                        </Text>

                        <View className="ml-4">
                            <Text className="text-gray-600 mb-1">
                                <Text className="font-semibold">1. File format:</Text> Only PNG and JPG/JPEG image format are accepted.
                            </Text>
                            <Text className="text-gray-600 mb-1">
                                <Text className="font-semibold">2. Quality:</Text> The ideal images are high resolution and well-focused, because it may affect the accuracy.
                            </Text>
                            <Text className="text-gray-600 mb-1">
                                <Text className="font-semibold">3. Position:</Text> Center the plant in the frame for best results.
                            </Text>
                            <Text className="text-gray-600 mb-1">
                                <Text className="font-semibold">4. Size:</Text> Please ensure each photo size will not be larger than 1MB.
                            </Text>
                        </View>
                    </View>

                    {/* Upload Options */}
                    {!selectedImage ? (
                        <View className="mb-6">
                            {/* Camera Option */}
                            <TouchableOpacity
                                onPress={handleTakePhoto}
                                className="border-2 border-dashed border-[#6D7E5E] rounded-lg p-4 items-center bg-[#F0F4E8] mb-3"
                            >
                                <Ionicons name="camera" size={28} color="#6D7E5E" />
                                <Text className="text-[#6D7E5E] mt-2 font-medium">
                                    Take Photo
                                </Text>
                            </TouchableOpacity>

                            {/* Gallery Option */}
                            <TouchableOpacity
                                onPress={handleImageUpload}
                                className="border-2 border-dashed border-[#6D7E5E] rounded-lg p-4 items-center bg-[#F0F4E8]"
                            >
                                <Ionicons name="cloud-upload-outline" size={28} color="#6D7E5E" />
                                <Text className="text-[#6D7E5E] mt-2 font-medium">
                                    Select from Gallery
                                </Text>
                                <Text className="text-[#6D7E5E] text-sm">
                                    (Max 1MB per image)
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        /* Upload Area - Show selected image */
                        <View className="border-2 border-dashed border-[#6D7E5E] rounded-lg p-6 items-center bg-[#F0F4E8] mb-6">
                            <View className="w-full">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-gray-700 font-medium">Selected image:</Text>
                                    <TouchableOpacity onPress={handleReset}>
                                        <Ionicons name="close-circle" size={24} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                                <Image
                                    source={{ uri: selectedImage }}
                                    className="w-full h-48 rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                    )}

                    {/* Plant Identification Results */}
                    {plantResult && (
                        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
                            <Text className="text-lg font-bold text-gray-800 mb-3">
                                🔍 Identification Result
                            </Text>

                            <View className="bg-gray-50 rounded-lg p-3">
                                <Text className="text-gray-700 font-medium">
                                    Species: <Text className="text-green-600">{plantResult.predicted_class}</Text>
                                </Text>

                                <View className="flex-row items-center mt-2">
                                    <Text className="text-gray-700 font-medium mr-2">Confidence:</Text>
                                    <Text
                                        className="font-bold"
                                        style={{ color: getConfidenceColor(plantResult.confidence) }}
                                    >
                                        {(plantResult.confidence * 100).toFixed(1)}%
                                    </Text>
                                </View>

                                {/* Confidence Bar */}
                                <View className="bg-gray-200 rounded-full h-2 mt-2">
                                    <View
                                        className="h-2 rounded-full"
                                        style={{
                                            width: `${plantResult.confidence * 100}%`,
                                            backgroundColor: getConfidenceColor(plantResult.confidence)
                                        }}
                                    />
                                </View>

                                {plantResult.predicted_class === 'Unknown plant' && (
                                    <Text className="text-orange-600 text-sm mt-2">
                                        💡 Try taking a clearer photo with better lighting for improved accuracy.
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Try Now Button */}
                    <TouchableOpacity
                        onPress={handleTryNow}
                        disabled={!selectedImage || isIdentifying}
                        className={`rounded-full py-4 items-center mb-10 ${
                            !selectedImage || isIdentifying ? 'bg-gray-400' : 'bg-[#6D7E5E]'
                        }`}
                    >
                        {isIdentifying ? (
                            <View className="flex-row items-center">
                                <ActivityIndicator size="small" color="white" />
                                <Text className="text-white font-medium ml-2">Identifying Plant...</Text>
                            </View>
                        ) : (
                            <Text className="text-white font-medium">
                                {selectedImage ? '🔍 Identify Plant' : 'Select Image First'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <UserNavBar activeRoute="/DextAIScreen" />
        </SafeAreaView>
    );
}