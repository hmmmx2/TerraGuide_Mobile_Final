import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { processDuitNowPayment, processPayPalPayment, PaymentResult } from '../lib/payment/dummyPayment';

// Registration fee amount
const REGISTRATION_FEE = 50; // RM 50

type PaymentMethod = 'duitnow' | 'paypal' | null;

export default function PaymentScreen() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');

    const handleSelectPaymentMethod = (method: PaymentMethod) => {
        setSelectedMethod(method);
    };

    const processPayment = async () => {
        if (!selectedMethod) {
            Alert.alert('Please select a payment method');
            return;
        }

        setIsProcessing(true);

        // Common payment parameters
        const paymentParams = {
            amount: REGISTRATION_FEE,
            currency: selectedMethod === 'paypal' ? 'USD' : 'MYR', // PayPal uses USD
            description: 'Park Guide Registration Fee',
        };

        try {
            // Show appropriate processing message
            setProcessingStatus(`Processing your ${selectedMethod === 'duitnow' ? 'DuitNow' : 'PayPal'} payment...`);

            // Process payment based on selected method
            const result: PaymentResult = selectedMethod === 'duitnow'
                ? await processDuitNowPayment(paymentParams)
                : await processPayPalPayment({
                    ...paymentParams,
                    // Convert to USD for PayPal (simplified conversion)
                    amount: selectedMethod === 'paypal' ? Math.round(REGISTRATION_FEE / 4.5 * 100) / 100 : REGISTRATION_FEE,
                });

            if (result.success) {
                // Payment successful, navigate to success screen
                console.log(`Payment successful: ${result.transactionId}`);
                router.push('/PaymentSuccessScreen');
            } else {
                // Payment failed, show error message
                Alert.alert('Payment Failed', result.error || 'Please try again');
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            Alert.alert(
                'Payment Error',
                'An unexpected error occurred while processing your payment. Please try again.'
            );
        } finally {
            setIsProcessing(false);
            setProcessingStatus('');
        }
    };

    const goBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <View className="p-6 flex-1">
                {/* Back button */}
                <TouchableOpacity
                    onPress={goBack}
                    className="mt-6 mb-10"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                {/* Payment header */}
                <Text className="text-gray-800 font-bold text-xl text-center mb-2">
                    Please Make Payment First, Before You Can Access.
                </Text>

                <View className="h-px bg-gray-300 w-full my-4" />

                {/* Payment amount */}
                <View className="mb-6 bg-gray-100 p-4 rounded-lg">
                    <Text className="text-gray-700 font-medium mb-1">Registration Fee</Text>
                    <Text className="text-gray-900 font-bold text-xl">RM {REGISTRATION_FEE.toFixed(2)}</Text>
                </View>

                {/* Payment methods section */}
                <Text className="text-gray-700 mb-2">Payment methods</Text>

                {/* DuitNow Option */}
                <TouchableOpacity
                    className={`flex-row items-center mb-3 p-4 border rounded-full ${
                        selectedMethod === 'duitnow' ? 'border-[#6D7E5E] bg-[#F0F5ED]' : 'border-gray-300'
                    }`}
                    onPress={() => handleSelectPaymentMethod('duitnow')}
                    disabled={isProcessing}
                >
                    {/* DuitNow Logo - Larger squared with rounded corners */}
                    <View className="w-12 h-12 justify-center items-center p-1.5">
                        <Image
                            source={require('@assets/images/duitnow-logo.png')}
                            className="w-full h-full rounded-lg"
                            resizeMode="contain"
                        />
                    </View>
                    <View className="flex-1 ml-4">
                        <Text className="text-gray-800 font-medium">Online Banking</Text>
                        <Text className="text-gray-500 text-xs">Takes minute</Text>
                    </View>
                    {selectedMethod === 'duitnow' && (
                        <Ionicons name="checkmark-circle" size={24} color="#6D7E5E" />
                    )}
                </TouchableOpacity>

                {/* PayPal Option */}
                <TouchableOpacity
                    className={`flex-row items-center mb-8 p-4 border rounded-full ${
                        selectedMethod === 'paypal' ? 'border-[#6D7E5E] bg-[#F0F5ED]' : 'border-gray-300'
                    }`}
                    onPress={() => handleSelectPaymentMethod('paypal')}
                    disabled={isProcessing}
                >
                    {/* PayPal Logo - Larger squared with rounded corners */}
                    <View className="w-12 h-12 justify-center items-center p-1.5">
                        <Image
                            source={require('@assets/images/paypal-logo.png')}
                            className="w-full h-full rounded-lg"
                            resizeMode="contain"
                        />
                    </View>
                    <View className="flex-1 ml-4">
                        <Text className="text-gray-800 font-medium">PayPal</Text>
                        <Text className="text-gray-500 text-xs">Takes minute</Text>
                    </View>
                    {selectedMethod === 'paypal' && (
                        <Ionicons name="checkmark-circle" size={24} color="#6D7E5E" />
                    )}
                </TouchableOpacity>

                {/* Processing status */}
                {isProcessing && processingStatus ? (
                    <Text className="text-center text-gray-600 mb-2">
                        {processingStatus}
                    </Text>
                ) : null}

                {/* Proceed Button */}
                <TouchableOpacity
                    onPress={processPayment}
                    disabled={isProcessing || !selectedMethod}
                    className={`bg-[#6D7E5E] py-4 rounded-full items-center ${
                        isProcessing || !selectedMethod ? 'opacity-70' : ''
                    }`}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-medium">Proceed</Text>
                    )}
                </TouchableOpacity>

                {/* Security note */}
                <View className="mt-6 flex-row items-center justify-center">
                    <Ionicons name="lock-closed" size={14} color="#6D7E5E" />
                    <Text className="text-gray-500 text-xs ml-1">
                        Secure payment processing
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}