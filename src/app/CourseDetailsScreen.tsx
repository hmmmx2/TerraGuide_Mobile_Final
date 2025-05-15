import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import BackButton from '@/components/BackButton';
import { UserNavBar } from '@/components/UserNavBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { exercise } from '@/data/exercise';
import { quiz } from '@/data/quiz';
import { AssessmentData } from './types';

import { Course, Instructor, LessonItem } from "@/types/course";
import { MentorProgram } from "@/types/mentorProgram";

// Remove the internal interface definitions for Instructor and LessonItem

import { CheckboxItem } from '@/components/CheckboxItem';

export default function CourseDetailsScreen() {
    const { courseData, activeTab: initialActiveTab } = useLocalSearchParams<{
        courseData: string,
        activeTab?: string
    }>();
    const data = JSON.parse(decodeURIComponent(courseData));
    const router = useRouter();

    // Determine if the data is a course or mentor program
    const isCourse = 'course_name' in data;
    const isMentorProgram = 'program_name' in data;

    // Create normalized course object
    const course = {
        id: data.id,
        name: isCourse ? data.course_name : data.program_name,
        description: isCourse ? data.course_description : data.description,
        image_url: isCourse ? data.course_image_url : data.image_url,
        fees: data.fees,
        student_count: data.student_count,
        average_rating: data.average_rating,
        instructor_id: data.instructor_id,
        instructor_name: data.instructor_name,
        instructor_image_url: data.instructor_image_url,
        duration_hours: data.duration_hours,
        reviews_count: data.reviews_count || 2678
    };

    const [activeTab, setActiveTab] = useState(initialActiveTab || 'about');
    const [lessons, setLessons] = useState<LessonItem[]>([
        { id: 1, title: 'Basics of Park Guiding', duration: 45, type: 'video', completed: false },
        { id: 2, title: 'Understanding the Environment', duration: 45, type: 'video', completed: false },
        { id: 3, title: 'Exercise', duration: 15, type: 'exercise', completed: false },
        { id: 4, title: 'Quiz', duration: 45, type: 'quiz', completed: false },
        { id: 5, title: 'Survey', duration: 45, type: 'survey', completed: false },
    ]);

    const instructor: Instructor = {
        id: course.instructor_id || 1,
        name: course.instructor_name || "Unknown Instructor",
        title: isMentorProgram ? "Mentor" : "Park Guide",
        image_url: course.instructor_image_url
    };

    const handleLessonPress = (lesson: LessonItem) => {
        if (lesson.type === 'video') {
            router.push({
                pathname: '/LessonVideoScreen',
                params: { lessonData: encodeURIComponent(JSON.stringify(lesson)) }
            });
        } else if (lesson.type === 'exercise' || lesson.type === 'quiz') {
            const assessmentData: AssessmentData = lesson.type === 'quiz'
                ? quiz as AssessmentData
                : exercise as AssessmentData;

            const dataToSend = {
                ...assessmentData,
                title: lesson.title,
                duration: lesson.duration * 60,
                type: lesson.type,
                courseData: data,
            };

            router.push({
                pathname: '/AssessmentDescription',
                params: { data: encodeURIComponent(JSON.stringify(dataToSend)) }
            });
        } else if (lesson.type === 'survey') {
            router.push('/SurveyFormScreen');
        }
    };

    const toggleLessonCompletion = (id: number) => {
        setLessons(lessons.map(lesson =>
            lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
        ));
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'video': return <FontAwesome5 name="play" size={16} color="white" />;
            case 'exercise': return <FontAwesome5 name="file-alt" size={16} color="white" />;
            case 'quiz': return <FontAwesome5 name="question" size={16} color="white" />;
            case 'survey': return <FontAwesome5 name="clipboard-list" size={16} color="white" />;
            default: return null;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return (
                    <View>
                        <View className="flex-row items-center mb-4">
                            <Image
                                source={instructor.image_url ? { uri: instructor.image_url } : require('../../assets/images/profile_pic.jpg')}
                                className="w-12 h-12 rounded-full mr-3"
                            />
                            <View>
                                <Text className="font-semibold">{instructor.name}</Text>
                                <Text className="text-sm text-gray-500">{instructor.title}</Text>
                            </View>
                        </View>

                        <Text className="text-lg font-bold mb-2">About {isMentorProgram ? 'Program' : 'Course'}</Text>
                        <Text className="text-sm text-gray-600">
                            {course.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam."}
                        </Text>
                    </View>
                );
            case 'lessons':
                return (
                    <View>
                        {lessons.map((lesson) => (
                            <TouchableOpacity
                                key={lesson.id}
                                onPress={() => handleLessonPress(lesson)}
                                className="flex-row items-center mb-4 border-b border-gray-200 pb-4"
                            >
                                <View className="mr-3 w-20 h-20 bg-[#4E6E4E] rounded-lg items-center justify-center overflow-hidden">
                                    {lesson.type === 'video' ? (
                                        <View className="w-full h-full relative">
                                            <View className="absolute inset-0 bg-black opacity-40 z-10" />
                                            <Image
                                                source={require('../../assets/images/park-guide2.png')}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                            <View className="absolute inset-0 flex items-center justify-center z-20">
                                                <View className="bg-white/30 w-8 h-8 rounded-full items-center justify-center">
                                                    <FontAwesome5 name="play" size={14} color="white" />
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                        <View className="w-full h-full items-center justify-center">
                                            {getLessonIcon(lesson.type)}
                                        </View>
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-gray-800">{lesson.title}</Text>
                                    <Text className="text-sm text-gray-500">{lesson.duration} mins</Text>
                                </View>
                                <CheckboxItem 
                                    isChecked={lesson.completed}
                                    onToggle={() => toggleLessonCompletion(lesson.id)}
                                    size={24}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 'reviews':
                return (
                    <View>
                        <View className="flex-row mb-6">
                            <View className="w-1/3 pr-4 items-center justify-center">
                                <Text className="text-4xl font-bold">{course.average_rating}</Text>
                                <View className="flex-row mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesome5
                                            key={star}
                                            name="star"
                                            size={16}
                                            color="#FACC15"
                                            solid
                                        />
                                    ))}
                                </View>
                                <Text className="text-sm text-gray-500">{course.reviews_count} reviews</Text>
                            </View>

                            <View className="w-2/3 pl-4">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <View key={rating} className="flex-row items-center mb-2 h-6">
                                        <View className="w-8 flex-row items-center">
                                            <Text className="text-sm mr-1">{rating}</Text>
                                            <FontAwesome5 name="star" size={12} color="#FACC15" solid />
                                        </View>
                                        <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                                            <View
                                                className="h-2 bg-[#6D7E5E] rounded-full"
                                                style={{ width: `${[10, 20, 42, 55, 70][rating-1]}%` }}
                                            />
                                        </View>
                                        <Text className="w-10 text-sm text-gray-500 text-right">
                                            {[10, 20, 42, 55, 70][rating-1]}%
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-medium">Reviews ({course.reviews_count})</Text>
                            <TouchableOpacity
                                className="bg-[#6D7E5E] px-4 py-2 rounded-full"
                                onPress={() => console.log('Write review')}
                            >
                                <Text className="text-white font-medium">Write Review</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-4">
                            {[1, 2].map((review) => (
                                <View key={review} className="border-b border-gray-200 p-4">
                                    <View className="flex-row items-center mb-2">
                                        <Image
                                            source={require('../../assets/images/profile_pic.jpg')}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <View className="flex-1">
                                            <Text className="font-medium">{review === 1 ? 'Jimmy He' : 'Timmy He'}</Text>
                                            <Text className="text-xs text-gray-500">1 hour ago</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Text className="mr-1 font-medium">4/5</Text>
                                            <FontAwesome5 name="star" size={12} color="#FACC15" solid />
                                        </View>
                                    </View>
                                    <Text className="text-gray-600">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F4]">
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="flex-row items-center mt-6 mb-4 px-4">
                    <BackButton />
                </View>

                <View className="w-full h-48 relative mb-4">
                    <Image
                        source={{ uri: course.image_url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute bottom-3 right-3 bg-[#6D7E5E] px-4 py-1 rounded-full">
                        <Text className="text-white font-medium">
                            {course.fees === 0 ? "Free" : `RM${course.fees}`}
                        </Text>
                    </View>
                </View>

                <View className="px-4">
                    <Text className="text-2xl font-bold mb-1">{course.name}</Text>
                    <View className="flex-row items-center mb-4">
                        <FontAwesome5 name="star" size={16} color="#FACC15" solid />
                        <Text className="ml-1 text-sm font-medium">
                            {course.average_rating} ({course.reviews_count} reviews)
                        </Text>
                        <Text className="mx-1 text-gray-500">|</Text>
                        <Text className="text-sm text-gray-500">
                            {isMentorProgram ? "Mentorship" : "Park Guide"}
                        </Text>
                    </View>

                    <View className="flex-row justify-between mb-6">
                        <View className="bg-[#E6ECD6] p-3 rounded-lg items-center" style={{ width: '31%' }}>
                            <FontAwesome5 name="users" size={20} color="#6D7E5E" solid />
                            <Text className="text-xs text-center mt-1">{course.student_count} students</Text>
                        </View>
                        <View className="bg-[#E6ECD6] p-3 rounded-lg items-center" style={{ width: '31%' }}>
                            <FontAwesome5 name="clock" size={20} color="#6D7E5E" solid />
                            <Text className="text-xs text-center mt-1">{course.duration_hours} hours</Text>
                        </View>
                        <View className="bg-[#E6ECD6] p-3 rounded-lg items-center" style={{ width: '31%' }}>
                            <FontAwesome5 name="handshake" size={20} color="#6D7E5E" solid />
                            <Text className="text-xs text-center mt-1">Sponsored</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row justify-around border-b border-gray-300">
                    {['about', 'lessons', 'reviews'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 p-2 ${activeTab === tab ? 'border-b-2 border-[#4E6E4E]' : ''}`}
                        >
                            <Text className={`text-center capitalize ${
                                activeTab === tab ? 'font-bold text-[#4E6E4E]' : 'text-gray-400'
                            }`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="px-4 py-4 mb-2">
                    {renderContent()}
                </View>

                <View className="px-4">
                    <TouchableOpacity className="bg-[#6D7E5E] mt-6 mb-10 py-4 rounded-full items-center">
                        <Text className="text-white font-semibold text-base">
                            {course.fees === 0 ? "Enroll For Free" : `Enroll For RM${course.fees}`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <UserNavBar activeRoute="/CourseScreen" />
        </SafeAreaView>
    );
}