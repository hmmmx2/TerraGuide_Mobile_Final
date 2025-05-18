import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserNavBar } from '@/components/UserNavBar';
import { FontAwesome5 } from '@expo/vector-icons';

// Recommended courses data
const RECOMMENDED_COURSES = [
    {
        id: '1',
        title: 'Eco-Guide Training: Field & Forest',
        rating: 4.7,
        students: 5983,
        instructor: 'Jason Lee',
        role: 'Park Ranger',
        imageUri: require('@assets/images/EcoGuideTraining.png')
    },
    {
        id: '2',
        title: 'Master Park Guide Certificate',
        rating: 4.7,
        students: 5983,
        instructor: 'Jason Lee',
        role: 'Park Ranger',
        imageUri: require('@assets/images/MasterParkGuide.png')
    }
];

export default function RecommendationScreen() {
    const router = useRouter();
    const [requiredCourseCompleted, setRequiredCourseCompleted] = useState(true);

    const handleGoBack = () => {
        router.back();
    };

    const toggleRequiredCourse = () => {
        setRequiredCourseCompleted(!requiredCourseCompleted);
    };

    const handleTryNow = () => {
        if (requiredCourseCompleted) {
            console.log('Proceeding with course recommendations');
            // Future implementation: Additional recommendation logic
            alert('Recommendations ready! You can enroll in these courses.');
        } else {
            alert('Please complete the required course first.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="px-4 pt-12 pb-4">
                    {/* Back button */}
                    <TouchableOpacity onPress={handleGoBack} className="mb-4">
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

                    {/* Title */}
                    <Text className="text-2xl font-bold text-gray-800 mb-2">
                        Course Recommendation System
                    </Text>

                    {/* Description */}
                    <Text className="text-gray-600 mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Text>

                    {/* Required Course Section */}
                    <View className="bg-[#F0F4E8] rounded-xl p-4 mb-6">
                        <Text className="text-[#6D7E5E] font-bold mb-3">
                            Required Course
                        </Text>

                        <TouchableOpacity
                            onPress={toggleRequiredCourse}
                            className="flex-row items-center"
                        >
                            <View className={`h-5 w-5 border border-[#6D7E5E] rounded mr-2 ${requiredCourseCompleted ? 'bg-[#6D7E5E]' : 'bg-transparent'}`}>
                                {requiredCourseCompleted && (
                                    <Ionicons name="checkmark" size={18} color="white" />
                                )}
                            </View>
                            <Text className="text-gray-800">Introduction to Park Guide</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Recommended Courses */}
                    <View className="bg-[#6D7E5E] rounded-xl p-4 mb-6">
                        <Text className="text-white font-bold mb-3">
                            Recommended Course
                        </Text>

                        {RECOMMENDED_COURSES.map((course, index) => (
                            <View key={course.id} className="mb-4">
                                <View className="flex-row">
                                    {/* Course Image */}
                                    <Image
                                        source={course.imageUri}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />

                                    {/* Course Info */}
                                    <View className="flex-1">
                                        <Text className="text-white font-semibold" numberOfLines={1}>
                                            {course.title}
                                        </Text>

                                        {/* Rating & Students */}
                                        <View className="flex-row items-center mt-1">
                                            <FontAwesome5 name="star" size={12} color="#FACC15" solid />
                                            <Text className="text-yellow-500 text-xs ml-1">
                                                {course.rating.toFixed(1)}
                                            </Text>
                                            <Text className="text-white text-xs ml-2">
                                                | {course.students.toLocaleString()} Students
                                            </Text>
                                        </View>

                                        {/* Instructor */}
                                        <Text className="text-white text-xs">
                                            {course.instructor} | {course.role}
                                        </Text>
                                    </View>
                                </View>

                                {/* Divider (except after last item) */}
                                {index < RECOMMENDED_COURSES.length - 1 && (
                                    <View className="h-px bg-white opacity-30 w-full mt-4" />
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Try Now Button */}
                    <TouchableOpacity
                        onPress={handleTryNow}
                        className="bg-[#6D7E5E] rounded-full py-4 items-center mb-10"
                    >
                        <Text className="text-white font-medium">Try Now!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <UserNavBar activeRoute="/DextAIScreen" />
        </SafeAreaView>
    );
}