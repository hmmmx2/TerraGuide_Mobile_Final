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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChangePassword = () => {
        // Validate passwords
        if (!newPassword) {
            setError('New password is required');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        router.replace('/LoginScreen');
    };

    const goBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
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
                        paddingBottom: 40
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* White card container */}
                    <View className="bg-white rounded-3xl py-10 px-6 mx-2">
                        {/* Header - centered */}
                        <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
                            Change Password
                        </Text>
                        <Text className="text-gray-600 text-center mb-8">
                            Create a new secure password for your account. Password must be at least 6 characters.
                        </Text>

                        {/* Error message */}
                        {error ? (
                            <View className="mb-4 p-3 bg-red-50 rounded-lg">
                                <Text className="text-red-500 text-center">{error}</Text>
                            </View>
                        ) : null}

                        {/* New Password input */}
                        <View className="flex-row items-center mb-5 border-b border-gray-300 pb-2">
                            <Ionicons name="lock-closed-outline" size={20} color="#6D7E5E" className="mr-3" />
                            <TextInput
                                className="flex-1 text-gray-700 text-base pl-2"
                                placeholder="New Password"
                                placeholderTextColor="#999"
                                value={newPassword}
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    setError('');
                                }}
                                secureTextEntry={!showNewPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                <Ionicons
                                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#6D7E5E"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm New Password input */}
                        <View className="flex-row items-center mb-5 border-b border-gray-300 pb-2">
                            <Ionicons name="lock-closed-outline" size={20} color="#6D7E5E" className="mr-3" />
                            <TextInput
                                className="flex-1 text-gray-700 text-base pl-2"
                                placeholder="Confirm New Password"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setError('');
                                }}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#6D7E5E"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm button */}
                        <TouchableOpacity
                            onPress={handleChangePassword}
                            className="bg-[#6D7E5E] py-4 rounded-full items-center mt-6"
                        >
                            <Text className="text-white font-medium">Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}