import React, { useState, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '@/components/UserNavBar';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRecommendations, courseAPI, RecommendedCourse, useCurrentUser } from '@/lib/courseRecommender';
import { User } from '@/types/user';

const FALLBACK_COURSES: RecommendedCourse[] = [
    {
        id: 1,
        course_name: 'Eco-Guide Training: Field & Forest',
        course_description: 'Specialized training in ecological interpretation and field skills',
        course_image_url: '@assets/images/EcoGuideTraining.png',
        fees: 299,
        student_count: 5983,
        average_rating: 4.7,
        instructor_id: 1,
        instructor_name: 'Jason Lee',
        instructor_image_url: '@assets/images/instructors/jason-lee.png',
        duration_hours: 50,
        reviews_count: 1247,
        course_id: 'Eco-Guide Training: Field & Interpretation Skills'
    },
    {
        id: 2,
        course_name: 'Master Park Guide Certificate',
        course_description: 'Comprehensive certification program for master guides',
        course_image_url: '@assets/images/MasterParkGuide.png',
        fees: 599,
        student_count: 5983,
        average_rating: 4.7,
        instructor_id: 1,
        instructor_name: 'Jason Lee',
        instructor_image_url: '@assets/images/instructors/jason-lee.png',
        duration_hours: 120,
        reviews_count: 1089,
        course_id: 'Master Park Guide Certification Program'
    }
];

export default function RecommendationScreen() {
    const router = useRouter();
    const [showProfile, setShowProfile] = useState(false);

    const currentUser = useCurrentUser();
    const { recommendations, loading, error, refresh } = useRecommendations(currentUser, 5);

    const displayCourses = recommendations.length > 0 ? recommendations : FALLBACK_COURSES;

    const handleGoBack = () => {
        router.back();
    };

    const handleViewProfile = async () => {
        if (!currentUser) {
            Alert.alert('Authentication Error', 'Please log in to view your profile.');
            return;
        }

        try {
            const profile = await courseAPI.getUserProfile(currentUser.id, currentUser.name);
            if (profile.success && profile.data) {
                const profileData = profile.data;
                Alert.alert(
                    'Your Learning Profile',
                    `Guide ID: ${profileData.guide_id}\n` +
                    `Primary Recommendation: ${profileData.recommended_course}\n` +
                    `Overall Score: ${profileData.overall_average.toFixed(1)}/5.0\n\n` +
                    `Skill Strengths:\n${Object.entries(profileData.skill_scores)
                        .sort(([,a], [,b]) => b - a)
                        .map(([skill, score]) => `• ${skill}: ${score.toFixed(1)}`)
                        .join('\n')}`,
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert('Profile Info', 'Your recommendations are based on our database analysis of your skills and preferences.');
            }
        } catch (error) {
            console.error('Profile error:', error);
            Alert.alert('Profile Info', 'Your recommendations are based on our database analysis of your skills and preferences.');
        }
    };

    const handleRefreshRecommendations = () => {
        if (!currentUser) {
            Alert.alert('Authentication Error', 'Please log in to refresh recommendations.');
            return;
        }

        Alert.alert(
            'Refreshing Recommendations',
            'Getting your latest course recommendations based on your profile...',
            [{ text: 'OK' }]
        );
        refresh();
    };

    const handleEnrollCourse = async (course: RecommendedCourse) => {
        if (!currentUser) {
            Alert.alert('Authentication Error', 'Please log in to enroll in courses.');
            return;
        }

        try {
            const courseId = course.course_id || course.course_name;
            const result = await courseAPI.enrollInCourse(currentUser, courseId);

            if (result.success) {
                Alert.alert(
                    'Enrollment Successful!',
                    `${currentUser.name}, you have successfully enrolled in ${course.course_name}. Check your dashboard for course materials.`,
                    [{ text: 'OK' }]
                );
                refresh();
            } else {
                Alert.alert('Enrollment Failed', result.error || 'Please try again later');
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            Alert.alert('Error', 'Failed to enroll in course. Please try again.');
        }
    };

    const getRecommendationText = () => {
        if (!currentUser) return 'Get personalized course recommendations based on your profile.';

        return `Our system analyzes your survey responses and skills assessment to recommend courses tailored specifically for your development as a ${currentUser.designation}.`;
    };

    const getConfidenceColor = (course: RecommendedCourse) => {
        if (!course.score) return 'text-white';

        if (course.score > 0.8) return 'text-green-300';
        if (course.score > 0.6) return 'text-yellow-300';
        return 'text-blue-300';
    };

    const getSkillMatchInfo = (course: RecommendedCourse) => {
        if (course.reason) {
            if (course.reason.includes('Strongest skill')) {
                return '🎯 Builds on your strengths';
            } else if (course.reason.includes('strengthen')) {
                return '📈 Improves weak areas';
            } else if (course.reason.includes('survey profile')) {
                return '✅ Perfect match';
            }
        }
        return '⭐ Recommended for you';
    };

    if (!currentUser) {
        return (
            <SafeAreaView className="flex-1 bg-[#F8F9FA]">
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-lg text-gray-600 text-center mb-4">
                        Please log in to access personalized course recommendations.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/LoginScreen')}
                        className="bg-[#6D7E5E] px-6 py-3 rounded-full"
                    >
                        <Text className="text-white font-medium">Go to Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="px-4 pt-12 pb-4">
                    {/* Back button */}
                    <TouchableOpacity onPress={handleGoBack} className="mb-4 mt-5">
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    {/* Header Card */}
                    <View className="bg-[#6D7E5E] rounded-xl p-4 mb-4 flex-row justify-between items-center">
                        <View className="flex-1" />
                        <View className="flex-1">
                            <Image
                                source={require('@assets/images/recommendation.png')}
                                className="w-32 h-32"
                                resizeMode="contain"
                            />
                        </View>
                        <View className="flex-1 items-end justify-center">
                            <View className="bg-white rounded-md h-8 w-12 mb-2" />
                            <View className="bg-white rounded-md h-8 w-12 mb-2" />
                            <View className="bg-white rounded-md h-8 w-12" />
                        </View>
                    </View>

                    {/* Personalized Title */}
                    <Text className="text-2xl font-bold text-gray-800 mb-2">
                        Your Personalized Recommendations
                    </Text>

                    {/* User Info with Profile Button */}
                    <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className="text-blue-800 text-sm font-medium">
                                {currentUser.name} | {currentUser.designation}
                            </Text>
                            <Text className="text-blue-600 text-xs">
                                Recommendations based on your survey profile
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleViewProfile}
                            className="bg-blue-500 px-3 py-1 rounded-full"
                        >
                            <Text className="text-white text-xs font-medium">
                                View Profile
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Description */}
                    <Text className="text-gray-600 mb-6">
                        {getRecommendationText()}
                    </Text>

                    {/* API Status Indicator */}
                    {error && (
                        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <Text className="text-yellow-800 text-sm">
                                Using cached recommendations. {error}
                            </Text>
                        </View>
                    )}

                    {/* Recommended Courses */}
                    <View className="bg-[#6D7E5E] rounded-xl p-4 mb-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-white font-bold">
                                Your Course Recommendations
                            </Text>
                            <View className="flex-row">
                                {loading && (
                                    <ActivityIndicator size="small" color="white" />
                                )}
                                <TouchableOpacity
                                    onPress={handleRefreshRecommendations}
                                    className="ml-2"
                                >
                                    <Ionicons name="refresh" size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {displayCourses.map((course, index) => (
                            <View key={course.id} className="mb-4">
                                <View className="flex-row">
                                    {/* Course Image */}
                                    <Image
                                        source={{ uri: course.course_image_url }}
                                        className="w-10 h-10 rounded-full mr-3"
                                        defaultSource={require('assets/images/MasterParkGuide.png')}
                                    />

                                    {/* Course Info */}
                                    <View className="flex-1">
                                        <Text className="text-white font-semibold" numberOfLines={1}>
                                            {course.course_name}
                                        </Text>

                                        {/* Rating & Students */}
                                        <View className="flex-row items-center mt-1">
                                            <FontAwesome5 name="star" size={12} color="#FACC15" solid />
                                            <Text className="text-yellow-500 text-xs ml-1">
                                                {course.average_rating.toFixed(1)}
                                            </Text>
                                            <Text className="text-white text-xs ml-2">
                                                | {course.student_count.toLocaleString()} Students
                                            </Text>
                                            {course.score && (
                                                <Text className={`text-xs ml-2 ${getConfidenceColor(course)}`}>
                                                    {(course.score * 100).toFixed(0)}% Match
                                                </Text>
                                            )}
                                        </View>

                                        {/* Instructor */}
                                        <Text className="text-white text-xs">
                                            {course.instructor_name}
                                        </Text>

                                        {/* Skill Match Indicator */}
                                        <Text className="text-green-300 text-xs mt-1">
                                            {getSkillMatchInfo(course)}
                                        </Text>

                                        {/* Course details */}
                                        <Text className="text-gray-300 text-xs mt-1">
                                            {course.duration_hours}h • ${course.fees}
                                            {course.confidence && ` • ${course.confidence} confidence`}
                                        </Text>
                                    </View>

                                    {/* Enroll Button */}
                                    <TouchableOpacity
                                        onPress={() => handleEnrollCourse(course)}
                                        className="bg-white px-3 py-1 rounded-full self-center ml-2"
                                    >
                                        <Text className="text-[#6D7E5E] text-xs font-medium">
                                            Enroll
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Divider (except after last item) */}
                                {index < displayCourses.length - 1 && (
                                    <View className="h-px bg-white opacity-30 w-full mt-4" />
                                )}
                            </View>
                        ))}

                        {/* Refresh button if error */}
                        {error && (
                            <TouchableOpacity
                                onPress={refresh}
                                className="bg-white bg-opacity-20 rounded-lg p-2 mt-2"
                            >
                                <Text className="text-white text-center text-sm">
                                    Retry Connection
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row mb-10">
                        <TouchableOpacity
                            onPress={handleRefreshRecommendations}
                            className="flex-1 bg-gray-100 rounded-full py-3 items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#6D7E5E" />
                            ) : (
                                <Text className="text-[#6D7E5E] font-medium">
                                    Refresh Recommendations
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <UserNavBar activeRoute="/DextAIScreen" />
        </SafeAreaView>
    );
}