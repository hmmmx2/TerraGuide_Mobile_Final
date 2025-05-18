import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '../components/UserNavBar';
import * as ImagePicker from 'expo-image-picker';

export default function FloraFaunaScreen() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleGoBack = () => {
        router.back();
    };

    const handleImageUpload = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            console.log('Image selected:', result.assets[0].uri);
        }
    };

    const handleTryNow = () => {
        if (selectedImage) {
            console.log('Processing image:', selectedImage);
            // Future implementation: Actual AI processing of the image
            alert('Image analysis started!');
        } else {
            alert('Please select an image first');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="px-4 pt-12 pb-4">
                    {/* Back button */}
                    <TouchableOpacity onPress={handleGoBack} className="mb-4">
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

                    {/* Title */}
                    <Text className="text-2xl font-bold text-gray-800 mb-2">
                        Flora & Fauna Identification
                    </Text>

                    {/* Description */}
                    <Text className="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                                <Text className="font-semibold">3. Position:</Text> The image's position should be clear.
                            </Text>
                            <Text className="text-gray-600 mb-1">
                                <Text className="font-semibold">4. Size:</Text> Please ensure the each photo size will not larger than 1MB.
                            </Text>
                        </View>
                    </View>

                    {/* Upload Area */}
                    <TouchableOpacity
                        onPress={handleImageUpload}
                        className="border-2 border-dashed border-[#6D7E5E] rounded-lg p-6 items-center bg-[#F0F4E8] mb-6"
                    >
                        <Ionicons name="cloud-upload-outline" size={36} color="#6D7E5E" />
                        <Text className="text-[#6D7E5E] mt-2 text-center">
                            Select photos to upload{"\n"}(Max 1MB per image)
                        </Text>

                        {selectedImage && (
                            <View className="mt-4 w-full">
                                <Text className="text-gray-700 text-center mb-2">Selected image:</Text>
                                <Image
                                    source={{ uri: selectedImage }}
                                    className="w-full h-48 rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Try Now Button */}
                    <TouchableOpacity
                        onPress={handleTryNow}
                        className="bg-[#6D7E5E] rounded-full py-4 items-center mb-10"
                    >
                        <Text className="text-white font-medium">Try Now!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <UserNavBar activeRoute="/DextAIScreen" />
        </SafeAreaView>
    );
}