import React, { useState, useRef } from 'react';
import { ScrollView, View, Dimensions, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type Slide = {
    id: string;
    title: string;
    description: string;
    subtext: string;
    buttonText: string;
    image: any;
};

type ViewPagerProps = {
    slides: Slide[];
    onButtonPress?: (slideId: string) => void;
};

export function ViewPager({ slides, onButtonPress = () => {} }: ViewPagerProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    const handleDotPress = (index: number) => {
        scrollViewRef.current?.scrollTo({
            x: index * width,
            animated: true,
        });
        setActiveIndex(index);
    };

    return (
        <View className="mt-6 mb-6">
            <View className="rounded-3xl overflow-hidden">
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {slides.map((slide, index) => (
                        <View
                            key={slide.id}
                            className="bg-[#4D6046] flex-row"
                            style={{ width: width - (width * 0.10) }} // 5% on each side = 10% total
                        >
                            {/* Left Side Content */}
                            <View className="flex-1 p-6">
                                <Text className="text-white text-2xl font-bold mb-4">{slide.title}</Text>
                                <Text className="text-white mb-2">{slide.description}</Text>
                                <Text className="text-white opacity-80 mb-6">{slide.subtext}</Text>
                            </View>

                            {/* Right Side Image and Button */}
                            <View className="flex-1 items-center justify-center p-4">
                                <Image
                                    source={slide.image}
                                    className="h-40 w-40 mb-4"
                                    resizeMode="contain"
                                />
                                <TouchableOpacity
                                    onPress={() => onButtonPress(slide.id)}
                                    className="bg-[#8C9A84] py-3 px-6 rounded-full"
                                >
                                    <Text className="text-white font-medium">{slide.buttonText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Pagination Dots */}
            <View className="flex-row justify-center items-center mt-4">
                {slides.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleDotPress(index)}
                        className={`h-2 rounded-full mx-1 ${
                            activeIndex === index ? 'w-8 bg-[#4D6046]' : 'w-2 bg-gray-300'
                        }`}
                    />
                ))}
            </View>
        </View>
    );
}