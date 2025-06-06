import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: '',
    });

    // Prefill email from AsyncStorage
    useEffect(() => {
        AsyncStorage.getItem('pending_email').then((storedEmail) => {
            if (storedEmail) {
                setEmail(storedEmail);
                console.log('File: LoginScreen, Function: useEffect, Prefilled email:', storedEmail);
            }
        });
    }, []);

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { email: '', password: '', general: '' };

        if (!email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        const result = await signIn(email, password, router);
        if (!result.success) {
            setErrors({
                ...errors,
                general: result.error || 'Failed to sign in',
            });
        }
    };

    const handleGuestLogin = () => {
        console.log('File: LoginScreen, Function: handleGuestLogin, Navigating to: HomeGuestScreen');
        router.push('/HomeGuestScreen');
    };

    const handleForgotPassword = () => {
        console.log('File: LoginScreen, Function: handleForgotPassword, Navigating to: ForgotPasswordScreen');
        router.push('/ForgotPasswordScreen');
    };

    const handleSignUp = () => {
        console.log('File: LoginScreen, Function: handleSignUp, Navigating to: RegistrationScreen');
        router.push('/RegistrationScreen');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#F8F9FA]"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                className="px-6"
            >
                <View className="bg-white rounded-3xl py-12 px-6 mx-2">
                    {/* Header */}
                    <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
                        Welcome Back
                    </Text>
                    <Text className="text-gray-600 text-center mb-8">
                        Sign in to continue your journey as a park guide, access your courses, and track your certification progress.
                    </Text>

                    {/* Error message */}
                    {errors.general ? (
                        <View className="mb-4 p-3 bg-red-50 rounded-lg">
                            <Text className="text-red-500 text-center">{errors.general}</Text>
                        </View>
                    ) : null}

                    {/* Email input */}
                    <View className="flex-row items-center mb-5 border-b border-gray-300 pb-2">
                        <Ionicons name="mail-outline" size={20} color="#6D7E5E" className="mr-3" />
                        <TextInput
                            className="flex-1 text-gray-700 text-base pl-2"
                            placeholder="Email Address"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                        />
                    </View>
                    {errors.email ? <Text className="text-red-500 text-xs mb-2 -mt-4">{errors.email}</Text> : null}

                    {/* Password input */}
                    <View className="flex-row items-center mb-2 border-b border-gray-300 pb-2">
                        <Ionicons name="lock-closed-outline" size={20} color="#6D7E5E" className="mr-3" />
                        <TextInput
                            className="flex-1 text-gray-700 text-base pl-2"
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoComplete="password"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#6D7E5E"
                            />
                        </TouchableOpacity>
                    </View>
                    {errors.password ? <Text className="text-red-500 text-xs mb-2">{errors.password}</Text> : null}

                    {/* Forgot password */}
                    <TouchableOpacity onPress={handleForgotPassword} className="self-end mb-5">
                        <Text className="text-[#6D7E5E] text-sm">Forgot Password</Text>
                    </TouchableOpacity>

                    {/* Login button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-[#6D7E5E] py-4 rounded-full items-center mb-4"
                    >
                        <Text className="text-white font-medium">
                            {loading ? 'Signing in...' : 'Log In'}
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center justify-center mb-4">
                        <Text className="text-gray-500 text-sm">or</Text>
                    </View>

                    {/* Guest login button */}
                    <TouchableOpacity
                        onPress={handleGuestLogin}
                        className="border border-[#6D7E5E] py-4 rounded-full items-center mb-6"
                    >
                        <Text className="text-[#6D7E5E] font-medium">Sign in as guest</Text>
                    </TouchableOpacity>

                    {/* Sign up link */}
                    <View className="flex-row justify-center">
                        <Text className="text-gray-600 text-sm">Don't have an account? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text className="text-[#6D7E5E] font-medium text-sm">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}