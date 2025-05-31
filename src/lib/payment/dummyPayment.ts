// lib/payment/dummyPayment.ts
// Simple dummy payment implementation with no external dependencies

// Types for our payment system
export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    status?: string;
    statusMessage?: string;
    error?: string;
}

export interface PaymentParams {
    amount: number;
    currency: string;
    description: string;
}

// Simulate DuitNow payment processing
export const processDuitNowPayment = async (params: PaymentParams): Promise<PaymentResult> => {
    console.log('Processing DuitNow payment:', params);

    // Simulate network delay (1-3 seconds)
    const delay = 1000 + Math.random() * 2000;

    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate 90% success rate
            const isSuccess = Math.random() < 0.9;

            if (isSuccess) {
                resolve({
                    success: true,
                    transactionId: `DN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                    status: 'completed',
                    statusMessage: 'Payment processed successfully'
                });
            } else {
                resolve({
                    success: false,
                    status: 'failed',
                    error: 'Payment processing failed. Please try again.'
                });
            }
        }, delay);
    });
};

// Simulate PayPal payment processing
export const processPayPalPayment = async (params: PaymentParams): Promise<PaymentResult> => {
    console.log('Processing PayPal payment:', params);

    // Simulate network delay (1-3 seconds)
    const delay = 1000 + Math.random() * 2000;

    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate 90% success rate
            const isSuccess = Math.random() < 0.9;

            if (isSuccess) {
                resolve({
                    success: true,
                    transactionId: `PP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                    status: 'completed',
                    statusMessage: 'Payment processed successfully'
                });
            } else {
                resolve({
                    success: false,
                    status: 'failed',
                    error: 'Payment processing failed. Please try again.'
                });
            }
        }, delay);
    });
};