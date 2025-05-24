import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/OnboardingScreen");
    }, 3000);

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