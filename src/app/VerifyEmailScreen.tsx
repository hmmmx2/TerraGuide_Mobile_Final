import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, BackHandler } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from '@/components/CustomToast';
import { supabase } from '@/lib/supabase';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // Disable back navigation
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                console.log('File: VerifyEmailScreen, Function: onBackPress, Back navigation blocked');
                toast.info('Please verify your email to continue.');
                return true; // Prevent default back navigation
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );

    // Load pending email from AsyncStorage
    useEffect(() => {
        AsyncStorage.getItem('pending_email').then((email) => {
            setPendingEmail(email);
            console.log('File: VerifyEmailScreen, Function: useEffect, Loaded pending_email:', email);
            if (!email) {
                toast.error('No email found. Please register again.');
                router.replace('/RegistrationScreen');
            }
        });
    }, []);

    // Auto-check verification status every 10 seconds (silent)
    useEffect(() => {
        if (!pendingEmail) return;

        const interval = setInterval(async () => {
            if (isChecking) return;
            setIsChecking(true);
            console.log('File: VerifyEmailScreen, Function: autoCheck, Checking verification for:', pendingEmail);

            try {
                const { data, error } = await supabase.rpc('check_email_verified', { p_email: pendingEmail });
                if (error) {
                    console.log('File: VerifyEmailScreen, Function: autoCheck, RPC error:', error.message);
                    setIsChecking(false);
                    return; // Silent error
                }

                if (data) {
                    console.log('File: VerifyEmailScreen, Function: autoCheck, Email verified:', pendingEmail);
                    toast.success('Email verified! Please log in.');
                    await AsyncStorage.removeItem('pending_email');
                    router.replace('/LoginScreen');
                    clearInterval(interval);
                } else {
                    console.log('File: VerifyEmailScreen, Function: autoCheck, Email not verified yet');
                }
            } catch (error: any) {
                console.log('File: VerifyEmailScreen, Function: autoCheck, Error:', error.message);
            } finally {
                setIsChecking(false);
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [pendingEmail, router]);

    const handleResendEmail = async () => {
        if (!pendingEmail) {
            toast.error('No email found. Please register again.');
            router.replace('/RegistrationScreen');
            return;
        }

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: pendingEmail,
                options: {
                    emailRedirectTo: 'terraguide://verify-email',
                },
            });
            if (error) throw error;
            console.log('File: VerifyEmailScreen, Function: handleResendEmail, Verification email resent to:', pendingEmail);
            toast.success('Verification email resent');
        } catch (error: any) {
            console.error('File: VerifyEmailScreen, Function: handleResendEmail, Error:', error.message);
            toast.error(error.message || 'Failed to resend verification email');
        }
    };

    const handleCheckVerification = async () => {
        if (!pendingEmail) {
            toast.error('No email found. Please register again.');
            router.replace('/RegistrationScreen');
            return;
        }

        setIsChecking(true);
        try {
            const { data, error } = await supabase.rpc('check_email_verified', { p_email: pendingEmail });
            if (error) {
                console.error('File: VerifyEmailScreen, Function: handleCheckVerification, RPC error:', error.message);
                toast.error('Failed to check verification status. Please try again.');
                return;
            }

            if (data) {
                console.log('File: VerifyEmailScreen, Function: handleCheckVerification, Email verified:', pendingEmail);
                toast.success('Email verified! Please log in.');
                await AsyncStorage.removeItem('pending_email');
                router.replace('/LoginScreen');
            } else {
                console.log('File: VerifyEmailScreen, Function: handleCheckVerification, Email not verified');
                toast.info('Email not verified yet. Please check your inbox.');
            }
        } catch (error: any) {
            console.error('File: VerifyEmailScreen, Function: handleCheckVerification, Error:', error.message);
            toast.error('Failed to check verification status. Please try again.');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <View className="px-6 py-10">
                <View className="items-center mt-10">
                    <Ionicons name="mail-outline" size={60} color="#6D7E5E" />
                    <Text className="text-2xl font-bold text-gray-900 mt-6">Verify Your Email</Text>
                    <Text className="text-gray-600 text-center mt-4">
                        We’ve sent a verification email to {pendingEmail || 'your inbox'}. Please check your email and click the link to activate your account.
                    </Text>
                    <TouchableOpacity
                        onPress={handleResendEmail}
                        className="bg-[#6D7E5E] py-4 px-6 rounded-full mt-6"
                        disabled={isChecking}
                    >
                        <Text className="text-white font-medium">Resend Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleCheckVerification}
                        className="bg-[#4E6E4E] py-4 px-6 rounded-full mt-4"
                        disabled={isChecking}
                    >
                        <Text className="text-white font-medium">{isChecking ? 'Checking...' : 'Check Verification'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}