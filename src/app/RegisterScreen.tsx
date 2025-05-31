// app/RegisterScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    color?: string;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ value, onValueChange, color, className }) => {
    return (
        <TouchableOpacity
            onPress={() => onValueChange(!value)}
            className={`h-5 w-5 rounded border ${value ? 'bg-[#6D7E5E]' : 'border-gray-400'} ${className || ''}`}
        >
            {value && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>
    );
};

export default function RegisterScreen() {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        terms: '',
        general: ''
    });

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            terms: '',
            general: ''
        };

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

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
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!agreedToTerms) {
            newErrors.terms = 'You must agree to the terms & conditions';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = () => {
        if (!validateForm()) return;
        router.push('/PaymentScreen');
    }

    const handleGuestLogin = () => {
        router.push('/HomeGuestScreen');
    };

    const goToLogin = () => {
        router.push('/LoginScreen');
    };

    const goBack = () => {
        router.back();
    };

    // Rest of the component remains unchanged...

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#F8F9FA]"
        >
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
                className="px-6"
            >
                {/* Back button */}
                <TouchableOpacity
                    onPress={goBack}
                    className="mt-12 mb-6"
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <View className="bg-white rounded-3xl py-10 px-6 mx-2">
                    {/* Header */}
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        Create an account
                    </Text>
                    <Text className="text-gray-600 mb-8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
                    </Text>

                    {/* Error message */}
                    {errors.general ? (
                        <View className="mb-4 p-3 bg-red-50 rounded-lg">
                            <Text className="text-red-500 text-center">{errors.general}</Text>
                        </View>
                    ) : null}

                    {/* First Name input */}
                    <View className="flex-row items-center mb-5 border-b border-gray-300 pb-2">
                        <Ionicons name="person-outline" size={20} color="#6D7E5E" className="mr-3" />
                        <TextInput
                            className="flex-1 text-gray-700 text-base pl-2"
                            placeholder="First Name"
                            placeholderTextColor="#999"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCorrect={false}
                        />
                    </View>
                    {errors.firstName ? <Text className="text-red-500 text-xs mb-2 -mt-4">{errors.firstName}</Text> : null}

                    {/* Last Name input */}
                    <View className="flex-row items-center mb-5 border-b border-gray-300 pb-2">
                        <Ionicons name="person-outline" size={20} color="#6D7E5E" className="mr-3" />
                        <TextInput
                            className="flex-1 text-gray-700 text-base pl-2"
                            placeholder="Last Name"
                            placeholderTextColor="#999"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCorrect={false}
                        />
                    </View>
                    {errors.lastName ? <Text className="text-red-500 text-xs mb-2 -mt-4">{errors.lastName}</Text> : null}

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
                    <View className="flex-row items-center mb-5 border-b border-gray-300 pb-2">
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
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="#6D7E5E"
                            />
                        </TouchableOpacity>
                    </View>
                    {errors.password ? <Text className="text-red-500 text-xs mb-2 -mt-4">{errors.password}</Text> : null}

                    {/* Terms and conditions */}
                    <View className="flex-row items-start mb-6">
                        <Checkbox
                            value={agreedToTerms}
                            onValueChange={setAgreedToTerms}
                            color={agreedToTerms ? '#6D7E5E' : undefined}
                            className="mt-1"
                        />
                        <Text className="text-gray-700 ml-2 flex-1">
                            I agree to the <Text className="text-[#6D7E5E] font-medium">terms & conditions</Text>
                        </Text>
                    </View>
                    {errors.terms ? <Text className="text-red-500 text-xs mb-4 -mt-4">{errors.terms}</Text> : null}

                    {/* Sign Up button */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        className="bg-[#6D7E5E] py-4 rounded-full items-center mb-4"
                    >
                        <Text className="text-white font-medium">Sign Up</Text>
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

                    {/* Login link */}
                    <View className="flex-row justify-center">
                        <Text className="text-gray-600 text-sm">Already have an account? </Text>
                        <TouchableOpacity onPress={goToLogin}>
                            <Text className="text-[#6D7E5E] font-medium text-sm">Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}