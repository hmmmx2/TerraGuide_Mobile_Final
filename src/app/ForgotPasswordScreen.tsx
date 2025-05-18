// app/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSendCode = () => {
        if (!email) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email');
            return;
        }

        // In a real app, you would send a request to your backend to send a verification code
        router.push({
            pathname: '/VerifyCodeScreen',
            params: { email }
        });
    };

    const goToLogin = () => {
        router.push('/LoginScreen');
    };

    const goBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA] mt-4">
            {/* Back button properly positioned */}
            <TouchableOpacity
                onPress={goBack}
                className="mt-12 ml-6"
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 24,
                        paddingTop: 20,
                        paddingBottom: 40
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* White card container */}
                    <View className="bg-white rounded-3xl py-10 px-6">
                        {/* Header - centered */}
                        <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
                            Forgot Password
                        </Text>
                        <Text className="text-gray-600 text-center mb-8">
                            Enter your email address and we'll send you a verification code to reset your password.
                        </Text>

                        {/* Error message */}
                        {error ? (
                            <View className="mb-4 p-3 bg-red-50 rounded-lg">
                                <Text className="text-red-500 text-center">{error}</Text>
                            </View>
                        ) : null}

                        {/* Email input - simplified to match design */}
                        <View className="flex-row items-center mb-6 border-b border-gray-300 pb-2">
                            <Ionicons name="mail-outline" size={20} color="#6D7E5E" className="mr-3" />
                            <TextInput
                                className="flex-1 text-gray-700 text-base"
                                placeholder="Email Address"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setError('');
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Send Code button */}
                        <TouchableOpacity
                            onPress={handleSendCode}
                            className="bg-[#6D7E5E] py-4 rounded-full items-center mb-8"
                        >
                            <Text className="text-white font-medium">Send Code</Text>
                        </TouchableOpacity>

                        {/* Login link - centered */}
                        <View className="flex-row justify-center">
                            <Text className="text-gray-600 text-sm">
                                Remember your password? {" "}
                            </Text>
                            <TouchableOpacity onPress={goToLogin}>
                                <Text className="text-[#6D7E5E] font-medium text-sm">Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}