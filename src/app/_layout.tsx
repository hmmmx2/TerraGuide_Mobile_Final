import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from '@/context/AuthProvider';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="ProfileScreen" />
          <Stack.Screen name="EditProfileScreen" />
          <Stack.Screen name="SurveyFormScreen" />
          <Stack.Screen name="CourseScreen" />
          <Stack.Screen name="CourseDetails" />
          <Stack.Screen name="DextAIScreen" />
          <Stack.Screen name="LicenseScreen" />
          <Stack.Screen name="AssessmentDescription" />
          <Stack.Screen name="AssessmentQuestion" />
          <Stack.Screen name="AssessmentResultScreen" />
          <Stack.Screen name="InteractiveMap" />
          <Stack.Screen name="RegistrationScreen" />
          <Stack.Screen name="LoginScreen" />
          <Stack.Screen name="SearchScreen" />
          <Stack.Screen name="LicenseDetailsScreen" />
          <Stack.Screen name="CourseDetailsScreen" />
          <Stack.Screen name="OnlineCourseScreen" />
          <Stack.Screen name="MentorProgrammeScreen" />
        </Stack>
        <Toast />
      </AuthProvider>
  );
}
