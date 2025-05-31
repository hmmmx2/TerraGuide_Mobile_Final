// app/OnboardingScreen.tsx
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    useWindowDimensions,
    StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const onboardingData = [
    {
        id: '1',
        title: 'Book a park guide to explore the Semenggoh',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        image: require('@assets/images/onboarding-guide.png')
    },
    {
        id: '2',
        title: 'Easy Interactive Map to see different parks',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        image: require('@assets/images/onboarding-map.png')
    },
    {
        id: '3',
        title: 'Start to explore our Semenggoh park fills with flora and fauna',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        image: require('@assets/images/onboarding-explore.png')
    }
];

type OnboardingItem = {
    id: string;
    title: string;
    description: string;
    image: any;
};

export default function Onboarding() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const { width } = useWindowDimensions();

    const flatListRef = useRef<FlatList<OnboardingItem>>(null);

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true
            });
        } else {
            router.replace('/LoginScreen');
        }
    };

    const handleSkip = () => {
        router.replace('/LoginScreen');
    };

    return (
        <View className="flex-1 bg-[#4E6E4E]">
            {/* Skip button */}
            <TouchableOpacity
                onPress={handleSkip}
                className="absolute top-12 right-5 z-10"
            >
                <Text className="text-white text-base font-medium">Skip</Text>
            </TouchableOpacity>

            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={({ item }) => (
                    <View style={{ width }} className="flex-1 justify-center items-center">
                        <Image
                            source={item.image}
                            className="w-full h-1/2"
                            resizeMode="contain"
                        />
                        <View className="bg-white w-full h-80 rounded-t-3xl p-6 absolute bottom-0">
                            <Text className="text-[#4E6E4E] text-2xl font-bold mb-2">
                                {item.title}
                            </Text>
                            <Text className="text-gray-500 mb-8">
                                {item.description}
                            </Text>

                            <View className="flex-row justify-between items-center mt-auto">
                                {/* Pagination dots */}
                                <View className="flex-row space-x-2">
                                    {onboardingData.map((_, index) => (
                                        <View
                                            key={index}
                                            className={`h-2 rounded-full ${
                                                index === currentIndex
                                                    ? 'w-8 bg-[#4E6E4E]'
                                                    : 'w-2 bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </View>

                                {/* Next button */}
                                <TouchableOpacity
                                    onPress={handleNext}
                                    className="w-12 h-12 rounded-full bg-[#4E6E4E] justify-center items-center"
                                >
                                    <Ionicons name="arrow-forward" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}