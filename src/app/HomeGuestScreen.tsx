import React from 'react';
import { View, ScrollView, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Container } from '@/components/Container';
import { UserProfileHeader } from '@/components/UserProfileHeader';
import { Button } from '@/components/Button';
import { ViewPager } from '@/components/ViewPager';
import { UserNavBar } from '@/components/UserNavBar';
import { ParkGuide } from '@/components/ParkGuide';
import { useRouter } from 'expo-router';
import { FeaturedBlogs } from '@/components/FeaturedBlogs';
import { BlogPost } from '@/components/BlogCard';
import { blogs } from '@/data/blogs';
import { timetables } from '@/data/timetables';
import { parkGuides } from '@/data/parkguides';

const SLIDES = [
    {
        id: 'guide',
        title: 'BOOK A PARK GUIDE',
        description: 'Park Guide can help you explore the entire Semenggoh Nature Reserve.',
        subtext: 'Book it now!',
        buttonText: 'BOOK NOW',
        image: require('@assets/images/park-guide.png'),
    },
];

export default function HomeGuestScreen() {
    const router = useRouter();

    const handleSlideButtonPress = (slideId: string) => {
        if (slideId === 'guide') {
            router.push('/OtherParkGuideScreen'); // Navigate to OtherParkGuideScreen
        }
    };

    const navigateToBlogs = () => {
        router.push('/BlogsScreen');
    };

    const handleBlogPress = (blog: BlogPost) => {
        router.push({
            pathname: '/BlogDetailScreen',
            params: { id: blog.id.toString() } // Convert id to string for navigation params
        });
    };

    const navigateToTimetable = () => {
        router.push('/TimetableScreen');
    };

    const navigateToOtherParkGuides = () => {
        router.push('/OtherParkGuideScreen');
    };

    const navigateToInteractiveMap = () => {
        router.push('/InteractiveMap');
    };

    // Map parkGuides to match the expected structure for ParkGuide component, limit to 3 items
    const formattedParkGuides = parkGuides.slice(0, 3).map(guide => ({
        id: guide.id.toString(),
        name: guide.name,
        description: guide.description || guide.specialties.join(', ') || 'No description available', // Convert specialties array to string
        imageUri: guide.imageUri,
    }));

    // Map timetables to match the expected structure for ParkGuide component, limit to 3 items
    const formattedTimetables = timetables.slice(0, 3).map(timetable => ({
        id: timetable.id.toString(),
        name: timetable.title,
        description: timetable.description || '',
        imageUri: timetable.imageUri,
    }));

    // Map blogs to match the expected BlogPost type with id as string, and ensure description and imageUri are provided
    const formattedBlogs = blogs.map(blog => ({
        ...blog,
        id: blog.id.toString(),
        description: blog.description || blog.title || 'No description available', // Fallback for description
        imageUri: blog.imageUri
    }));

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="py-6">
                    <Container>
                        <UserProfileHeader
                            username="Guest"
                            isLoggedIn={false}
                            onNotificationPress={() => console.log('Notification pressed')}
                        />

                        {/* ViewPager Section */}
                        <ViewPager
                            slides={SLIDES}
                            onButtonPress={handleSlideButtonPress}
                        />

                        {/* Park Area Map Section with heading and paragraph */}
                        <View className="mt-6">
                            <Text className="text-gray-800 font-bold text-2xl mb-2">Discover</Text>
                            <View className="h-px bg-gray-300 w-full mb-3" />
                            <Text className="text-gray-600 mb-5">
                                Explore beautiful parks around the Semenggoh National Reservation
                            </Text>

                            {/* Button - Updated with navigation to InteractiveMap */}
                            <Button
                                title="FIND A PARK AREA"
                                onPress={navigateToInteractiveMap}
                                className="bg-[#6D7E5E] py-4 rounded-full"
                            />
                        </View>

                        {/* Featured Blogs Section */}
                        <FeaturedBlogs
                            blogs={formattedBlogs.filter(blog => !blog.isPlaceholder)}
                            onSeeAllPress={navigateToBlogs}
                            onBlogPress={handleBlogPress}
                        />

                        {/* Timetable Section */}
                        <View className="mt-6">
                            <ParkGuide
                                title="Timetable"
                                see_all="All activities"
                                guides={formattedTimetables}
                                onViewAllPress={navigateToTimetable}
                                onGuidePress={(guide) => console.log('Timetable pressed:', guide.name)}
                            />
                        </View>

                        {/* Other Park Guides Section */}
                        <View className="mt-6 mb-16">
                            <ParkGuide
                                title="Book Park Guide"
                                see_all="View all"
                                guides={formattedParkGuides}
                                onViewAllPress={navigateToOtherParkGuides}
                                onGuidePress={(guide) => router.push(`/GuideDetailScreen?id=${guide.id}`)}
                            />
                        </View>
                    </Container>
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <UserNavBar activeRoute="/HomeParkGuideScreen" />
        </SafeAreaView>
    );
}