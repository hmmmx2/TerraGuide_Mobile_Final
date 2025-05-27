import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session first
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          console.log('File: index, Function: checkSession, Found existing session');
          
          // Navigate based on user role
          const userRole = session.user?.user_metadata?.role?.toString().trim().toLowerCase();
          
          if (userRole === 'parkguide') {
            console.log('File: index, Function: checkSession, Navigating to: HomeParkGuideScreen');
            router.replace('/HomeParkGuideScreen');
          } else if (userRole === 'admin' || userRole === 'controller') {
            console.log('File: index, Function: checkSession, Navigating to: DashboardScreen');
            router.replace('/DashboardScreen');
          } else {
            console.log('File: index, Function: checkSession, Navigating to: HomeGuestScreen');
            router.replace('/HomeGuestScreen');
          }
        } else {
          // No session, proceed with normal flow
          console.log('File: index, Function: checkSession, No session found, showing onboarding');
          router.replace('/OnboardingScreen');
        }
      } catch (error) {
        console.error('File: index, Function: checkSession, Error:', error);
        // On error, default to onboarding
        router.replace('/OnboardingScreen');
      } finally {
        setIsLoading(false);
      }
    };

    // Start session check after a short delay to allow splash screen to be visible
    const timer = setTimeout(() => {
      checkSession();
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 justify-center items-center bg-[#4E6E4E]">
      <Image
        source={require('@assets/images/TerraGuideLogo_White.png')}
        className="w-64 h-24"
        resizeMode="contain"
      />
      <ActivityIndicator size="small" color="white" className="mt-8" />
    </View>
  );
}