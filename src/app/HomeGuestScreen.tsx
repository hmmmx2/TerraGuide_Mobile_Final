import React, { useEffect } from 'react';
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
import { useAuth } from '@/context/AuthProvider';

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
    const { session } = useAuth();

    useEffect(() => {
        if (session?.user) {
            const userMetadata = session.user.user_metadata;
            if (userMetadata) {
                const userRole = userMetadata.role?.toString().trim().toLowerCase();
                console.log('File: HomeGuestScreen, Function: useEffect, User Role:', userRole);
                if (userRole === 'parkguide') {
                    console.log('File: HomeGuestScreen, Function: useEffect, Navigating to: HomeParkGuideScreen');
                    router.replace('/HomeParkGuideScreen');
                } else if (userRole === 'admin' || userRole === 'controller') {
                    console.log('File: HomeGuestScreen, Function: useEffect, Navigating to: DashboardScreen');
                    router.replace('/DashboardScreen');
                }
            }
        }
    }, [session, router]);

    const handleSlideButtonPress = (slideId: string) => {
        if (slideId === 'guide') {
            router.push('/OtherParkGuideScreen');
        }
    };

    const navigateToBlogs = () => {
        router.push('/BlogsScreen');
    };

    const handleBlogPress = (blog: BlogPost) => {
        router.push({
            pathname: '/BlogDetailScreen',
            params: { id: blog.id.toString() }
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

    const formattedParkGuides = parkGuides.slice(0, 3).map(guide => ({
        id: guide.id.toString(),
        name: guide.name,
        description: guide.description || guide.specialties.join(', ') || 'No description available',
        imageUri: guide.imageUri,
    }));

    const formattedTimetables = timetables.slice(0, 3).map(timetable => ({
        id: timetable.id.toString(),
        name: timetable.title,
        description: timetable.description || '',
        imageUri: timetable.imageUri,
    }));

    const formattedBlogs = blogs.map(blog => ({
        ...blog,
        id: blog.id.toString(),
        description: blog.description || blog.title || 'No description available',
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
                        />
                        <ViewPager
                            slides={SLIDES}
                            onButtonPress={handleSlideButtonPress}
                        />
                        <View className="mt-6">
                            <Text className="text-gray-800 font-bold text-2xl mb-2">Discover</Text>
                            <View className="h-px bg-gray-300 w-full mb-3" />
                            <Text className="text-gray-600 mb-5">
                                Explore beautiful parks around the Semenggoh National Reservation
                            </Text>
                            <Button
                                title="FIND A PARK AREA"
                                onPress={navigateToInteractiveMap}
                                className="bg-[#6D7E5E] py-4 rounded-full"
                            />
                        </View>
                        <FeaturedBlogs
                            blogs={formattedBlogs.filter(blog => !blog.isPlaceholder)}
                            onSeeAllPress={navigateToBlogs}
                            onBlogPress={handleBlogPress}
                        />
                        <View className="mt-6">
                            <ParkGuide
                                title="Timetable"
                                see_all="All activities"
                                guides={formattedTimetables}
                                onViewAllPress={navigateToTimetable}
                                onGuidePress={(guide) => console.log('Timetable pressed:', guide.name)}
                            />
                        </View>
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
            <UserNavBar activeRoute="/HomeGuestScreen" />
        </SafeAreaView>
    );
}