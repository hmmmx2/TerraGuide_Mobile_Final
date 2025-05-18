// components/FeaturedBlogs.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, FlatList, ViewToken } from 'react-native';
import { BlogPost } from './BlogCard';

interface FeaturedBlogsProps {
    blogs: BlogPost[];
    onSeeAllPress: () => void;
    onBlogPress?: (blog: BlogPost) => void;
}

export const FeaturedBlogs: React.FC<FeaturedBlogsProps> = ({
                                                                blogs,
                                                                onSeeAllPress,
                                                                onBlogPress = () => {}
                                                            }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { width } = Dimensions.get('window');

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0]) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    return (
        <View className="mt-6 mb-4">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-2xl font-semibold text-gray-800">Featured Blogs</Text>
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text className="text-[#6D7E5E]">All blogs</Text>
                </TouchableOpacity>
            </View>

            {/* Border line */}
            <View className="h-px bg-gray-300 w-full mb-4" />

            {/* Single blog slider for all blogs */}
            <FlatList
                data={blogs}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 32}
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => onBlogPress(item)}
                        style={{ width: width - 32 }}
                        className="mr-4"
                    >
                        <ImageBackground
                            source={item.imageUri}
                            className="w-full h-[220px] rounded-xl overflow-hidden"
                            resizeMode="cover"
                        >
                            <View className="flex-1 bg-black/30 justify-end p-5">
                                <Text className="text-white text-2xl font-bold" numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <Text className="text-white text-base mt-2" numberOfLines={3}>
                                    {item.description}
                                </Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingRight: 16 }}
            />

            {/* Pagination dots */}
            <View className="flex-row justify-center mt-4">
                {blogs.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 rounded-full mx-1 ${
                            index === activeIndex
                                ? 'w-8 bg-[#6D7E5E]'
                                : 'w-2 bg-gray-300'
                        }`}
                    />
                ))}
            </View>
        </View>
    );
};