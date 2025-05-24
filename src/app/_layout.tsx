import { Stack } from 'expo-router';
import '../global.css';
import { AuthProvider } from '@/context/AuthProvider';
import { ToastContainer } from '@/components/CustomToast';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style='light' backgroundColor='#4E6E4E' />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    contentStyle: { backgroundColor: '#FFFFFF' },
                }}
            >
                <Stack.Screen name='index' options={{ animation: 'none' }} />
                <Stack.Screen name='OnboardingScreen' options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name='LoginScreen' />
                <Stack.Screen name='RegisterScreen' />
                <Stack.Screen name='ForgotPasswordScreen' />
                <Stack.Screen name='VerifyCodeScreen' />
                <Stack.Screen name='ChangePasswordScreen' />
                <Stack.Screen name='HomeGuestScreen' />
                <Stack.Screen name='HomeParkGuideScreen' />
                <Stack.Screen name='BlogsScreen' options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name='ProfileScreen' />
                <Stack.Screen name='GuestProfileScreen' />
                <Stack.Screen name='EditProfileScreen' />
                <Stack.Screen name='SurveyFormScreen' />
                <Stack.Screen name='BlogDetailScreen' />
                <Stack.Screen name='TimetableScreen' />
                <Stack.Screen name='CourseScreen' />
                <Stack.Screen name='CourseDetails' />
                <Stack.Screen name='GuideDetailScreen' />
                <Stack.Screen name='DextAIScreen' />
                <Stack.Screen name='RecommendationScreen' />
                <Stack.Screen name='FloraFaunaScreen' />
                <Stack.Screen name='LicenseScreen' />
                <Stack.Screen name='LessonVideoScreen' />
                <Stack.Screen name='AssessmentDescription' />
                <Stack.Screen name='AssessmentQuestion' />
                <Stack.Screen name='AssessmentResultScreen' />
                <Stack.Screen name='InteractiveMap' />
                <Stack.Screen name='PaymentScreen' options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name='PaymentSuccessScreen' options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name='DashboardScreen' />
            </Stack>
            <ToastContainer />
        </AuthProvider>
    );
}