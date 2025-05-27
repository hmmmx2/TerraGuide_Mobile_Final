import React from 'react';
import { View, ScrollView, Text, SafeAreaView } from 'react-native';
import { Container } from '@/components/Container';
import { UserProfileHeader } from '@/components/UserProfileHeader';
import { Button } from '@/components/Button';
import { ViewPager } from '@/components/ViewPager';
import { UserNavBar } from '@/components/UserNavBar';
import { ParkGuide } from '@/components/ParkGuide';
import { useRouter } from 'expo-router';
import { FeaturedBlogs } from '@/components/FeaturedBlogs';
import { BlogPost } from '@/components/BlogCard';
import { useAuth } from '@/context/AuthProvider';

const TIMETABLES = [
    {
        id: '1',
        name: 'Morning Briefing & Preparation',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/timetable-8am.png'),
    },
    {
        id: '2',
        name: 'Morning Guided Nature Walk',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/timetable-830am.png'),
    },
    {
        id: '3',
        name: 'Break & Rest',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/timetable-9am.png'),
    },
];

const GUIDES = [
    {
        id: '1',
        name: 'Timmy He',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/avatar.jpg'),
    },
    {
        id: '2',
        name: 'Jimmy Lee',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/avatar.jpg'),
    },
    {
        id: '3',
        name: 'Kimmy Lee',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        imageUri: require('@assets/images/avatar.jpg'),
    },
];

const SLIDES = [
    {
        id: 'recommendation',
        title: 'RECOMMENDATION SYSTEM',
        description: 'Our AI can recommend any further course after taking the Introduction to Park Guide',
        subtext: 'Give it a try now!',
        buttonText: 'GET STARTED',
        image: require('@assets/images/recommendation.png'),
    },
    {
        id: 'guide',
        title: 'BOOK A PARK GUIDE',
        description: 'Park Guide can help you explore the entire Semenggoh Nature Reserve.',
        subtext: 'Book it now!',
        buttonText: 'BOOK NOW',
        image: require('@assets/images/park-guide.png'),
    },
    {
        id: 'identification',
        title: 'FLORA & FAUNA IDENTIFICATION',
        description: 'Our AI can identify any endanger animal and plants in the National Park',
        subtext: 'Give it a try now!',
        buttonText: 'GET STARTED',
        image: require('@assets/images/flora-fauna.png'),
    },
];

const FEATURED_BLOGS: BlogPost[] = [
    {
        id: '1',
        title: 'The History of Semenggoh Nature Reserve',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        imageUri: require('@assets/images/semenggoh-history.jpg'),
    },
    {
        id: '2',
        title: 'Species of Orang Utan',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        imageUri: require('@assets/images/orang-utan.jpg'),
    },
    {
        id: '3',
        title: 'Conservation Efforts at Semenggoh',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        imageUri: require('@assets/images/ExploreAndLead.png'),
    },
];

export default function HomeParkGuideScreen() {
    const router = useRouter();
    const { session } = useAuth();

    const handleSlideButtonPress = (slideId: string) => {
        console.log(`Button pressed on slide: ${slideId}`);
    };

    const navigateToBlogs = () => {
        router.push('/BlogsScreen');
    };

    const handleBlogPress = (blog: BlogPost) => {
        router.push({
            pathname: '/BlogDetailScreen',
            params: { id: blog.id },
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

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="py-6">
                    <Container>
                        <UserProfileHeader
                            isLoggedIn={!!session?.user}
                        />
                        <ViewPager slides={SLIDES} onButtonPress={handleSlideButtonPress} />
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
                            blogs={FEATURED_BLOGS}
                            onSeeAllPress={navigateToBlogs}
                            onBlogPress={handleBlogPress}
                        />
                        <View className="mt-6">
                            <ParkGuide
                                title="Timetable"
                                see_all="All activities"
                                guides={TIMETABLES}
                                onViewAllPress={navigateToTimetable}
                                onGuidePress={(guide) => console.log('Timetable pressed:', guide.name)}
                            />
                        </View>
                        <View className="mt-6 mb-16">
                            <ParkGuide
                                title="Book Park Guide"
                                see_all="View all"
                                guides={GUIDES}
                                onViewAllPress={navigateToOtherParkGuides}
                                onGuidePress={(guide) => console.log('Guide pressed:', guide.name)}
                            />
                        </View>
                    </Container>
                </View>
            </ScrollView>
            <UserNavBar activeRoute="/HomeParkGuideScreen" />
        </SafeAreaView>
    );
}