// app/VerifyCodeScreen.tsx
import React, { useState, useEffect } from 'react';
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

export default function VerifyCodeScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [code, setCode] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [error, setError] = useState('');

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = () => {
        const fullCode = code.join('');
        if (fullCode.length !== 4) {
            setError('Please enter the complete verification code');
            return;
        }

        router.push({
            pathname: '/ChangePasswordScreen',
            params: { email }
        });
    };

    const handleResendCode = () => {
        setTimer(30);
        setError('');
        setCode(['', '', '', '']);
    };

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 3) {
        }
    };

    const goToLogin = () => {
        router.push('/LoginScreen');
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
                            Verify Now
                        </Text>
                        <Text className="text-gray-600 text-center mb-8">
                            Enter the 4-digit code sent to your email address to verify your identity.
                        </Text>

                        {/* Error message */}
                        {error ? (
                            <View className="mb-4 p-3 bg-red-50 rounded-lg">
                                <Text className="text-red-500 text-center">{error}</Text>
                            </View>
                        ) : null}

                        {/* Verification code inputs - centered */}
                        <View className="flex-row justify-center space-x-4 mb-6">
                            {[0, 1, 2, 3].map((index) => (
                                <TextInput
                                    key={index}
                                    className="w-16 h-16 text-center text-2xl border-b border-gray-300"
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    value={code[index]}
                                    onChangeText={(text) => handleCodeChange(text, index)}
                                />
                            ))}
                        </View>

                        {/* Resend code timer */}
                        <TouchableOpacity
                            onPress={timer === 0 ? handleResendCode : undefined}
                            disabled={timer > 0}
                            className="items-center mb-8"
                        >
                            <Text className={`text-sm ${timer > 0 ? 'text-gray-400' : 'text-[#6D7E5E]'}`}>
                                {timer > 0
                                    ? `Re-send code in ${timer} sec`
                                    : 'Re-send code'}
                            </Text>
                        </TouchableOpacity>

                        {/* Confirm button */}
                        <TouchableOpacity
                            onPress={handleVerify}
                            className="bg-[#6D7E5E] py-4 rounded-full items-center mb-8"
                        >
                            <Text className="text-white font-medium">Confirm</Text>
                        </TouchableOpacity>

                        {/* Go back to login link - centered */}
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