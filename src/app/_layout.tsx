import { Stack } from 'expo-router';
import '../global.css';
import { AuthProvider } from '@/context/AuthProvider';
import { ToastContainer } from '@/components/CustomToast';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SessionExpiryWarning } from '@/components/SessionExpiryWarning';

export default function RootLayout() {
    const router = useRouter();

    useEffect(() => {
        const handleDeepLink = (url: string) => {
            console.log('Deep link received:', url);

            if (url.includes('terraguide://survey')) {
                console.log('Opening survey from QR code');
                router.push('/GuestSurveyFormScreen');
            }
        };

        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('App opened with URL:', url);
                handleDeepLink(url);
            }
        });

        const subscription = Linking.addEventListener('url', ({ url }) => {
            console.log('Deep link while app running:', url);
            handleDeepLink(url);
        });

        return () => subscription?.remove();
    }, [router]);

    return (
        <AuthProvider>
            <StatusBar style='light' backgroundColor='#4E6E4E' translucent={false}/>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    contentStyle: { backgroundColor: '#FFFFFF' },
                }}
            >
                {/* Initial & Auth Screens */}
                <Stack.Screen name='index' options={{ animation: 'none' }} />
                <Stack.Screen name='OnboardingScreen' options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name='LoginScreen' />
                <Stack.Screen name='RegistrationScreen' />
                <Stack.Screen name='ForgotPasswordScreen' />
                <Stack.Screen name='VerifyCodeScreen' />
                <Stack.Screen name='ChangePasswordScreen' />

                {/* Payment Screens */}
                <Stack.Screen name='PaymentScreen' />
                <Stack.Screen name='PaymentSuccessScreen' />

                {/* Main Dashboard Screens - prevent back navigation */}
                <Stack.Screen name='HomeGuestScreen' options={{ gestureEnabled: false }} />
                <Stack.Screen name='HomeParkGuideScreen' options={{ gestureEnabled: false }} />
                <Stack.Screen name='DashboardScreen' options={{ gestureEnabled: false }} />

                {/* Profile Screens */}
                <Stack.Screen name='ProfileScreen' />
                <Stack.Screen name='GuestProfileScreen' />
                <Stack.Screen name='EditProfileScreen' />
                
                {/* Content & Feature Screens */}
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
                <Stack.Screen name='LicenseDetailsScreen' />
                <Stack.Screen name='BlogsScreen' />
                <Stack.Screen name='InteractiveMap' />
                <Stack.Screen name='OtherParkGuideScreen' />
                <Stack.Screen name='NotificationScreen' />

                {/* QR & Survey Features */}
                <Stack.Screen
                    name='QRSurveyScreen'
                    options={{
                        animation: 'slide_from_right',
                        presentation: 'modal'
                    }}
                />
                <Stack.Screen
                    name='QRScannerScreen'
                    options={{
                        animation: 'slide_from_right',
                        presentation: 'fullScreenModal'
                    }}
                />
                <Stack.Screen
                    name='GuestSurveyFormScreen'
                    options={{
                        animation: 'slide_from_bottom',
                        gestureEnabled: true
                    }}
                />

                {/* Admin Management Screens */}
                <Stack.Screen
                    name="DatabaseScreen"
                    options={{
                        animation: 'slide_from_right',
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name="RoleManagementScreen"
                    options={{
                        animation: 'slide_from_right',
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name="LicenseManagementScreen"
                    options={{
                        animation: 'slide_from_right',
                        gestureEnabled: true
                    }}
                />

                {/* Content Management Screens */}
                <Stack.Screen
                    name="ContentManagementScreen"
                    options={{
                        animation: 'slide_from_right',
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name="CourseManagementScreen"
                    options={{
                        animation: 'slide_from_right',
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name="MentorProgrammeManagementScreen"
                    options={{
                        animation: 'slide_from_right',
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name="RecommendedCourseManagementScreen"
                    options={{
                        animation: 'slide_from_right',
                        gestureEnabled: true
                    }}
                />

                {/* Add/Create Screens */}
                <Stack.Screen
                    name="AddCourseScreen"
                    options={{
                        animation: 'slide_from_bottom',
                        presentation: 'modal',
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name="AddMentorProgrammeScreen"
                    options={{
                        animation: 'slide_from_bottom',
                        presentation: 'modal',
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name="AddRecommendedCourseScreen"
                    options={{
                        animation: 'slide_from_bottom',
                        presentation: 'modal',
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name="AddNewUserScreen"
                    options={{
                        animation: 'slide_from_bottom',
                        presentation: 'modal',
                        gestureEnabled: true
                    }}
                />

                {/* Test Screens */}
                <Stack.Screen name='ToastTestScreen' />
            </Stack>
            <SessionExpiryWarning />
            <ToastContainer />
        </AuthProvider>
    );
}