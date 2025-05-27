import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminNavBar } from '@/components/AdminNavBar';
import { Container } from '@/components/Container';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Course } from '@/types/course';
import { MentorProgram } from '@/types/mentorProgram';

// Recommended Course Interface
interface RecommendedCourse {
    id: number;
    course_name: string;
    accuracy_score: number;
    created_at: string;
}

export default function ContentManagementScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [userName, setUserName] = useState('Admin');
    const [userRole, setUserRole] = useState<string>('admin');

    // Loading States
    const [courseLoading, setCourseLoading] = useState(true);
    const [mentorLoading, setMentorLoading] = useState(true);
    const [recommendedLoading, setRecommendedLoading] = useState(true);

    // Course Management State
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [courseSearchQuery, setCourseSearchQuery] = useState('');

    // Mentor Programme State
    const [mentorPrograms, setMentorPrograms] = useState<MentorProgram[]>([]);
    const [filteredMentorPrograms, setFilteredMentorPrograms] = useState<MentorProgram[]>([]);
    const [mentorSearchQuery, setMentorSearchQuery] = useState('');

    // Recommended Course State
    const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
    const [filteredRecommendedCourses, setFilteredRecommendedCourses] = useState<RecommendedCourse[]>([]);
    const [recommendedSearchQuery, setRecommendedSearchQuery] = useState('');

    // Fetch Courses
    useEffect(() => {
        async function fetchCourses() {
            try {
                setCourseLoading(true);
                const { data, error } = await supabase
                    .from('courses')
                    .select(`
                        *,
                        instructors:instructor_id (
                            id,
                            name,
                            image_url
                        )
                    `)
                    .order('id');

                if (error) throw error;

                const transformedData = data?.map(course => ({
                    ...course,
                    instructor_name: course.instructors?.name || 'Unknown Instructor',
                    instructor_image_url: course.instructors?.image_url || null
                })) || [];

                setCourses(transformedData);
                setFilteredCourses(transformedData);
            } catch (error) {
                console.error('Error fetching courses:', error);
                Alert.alert('Error', 'Failed to load courses');
            } finally {
                setCourseLoading(false);
            }
        }

        fetchCourses();
    }, []);

    // Fetch Mentor Programs
    useEffect(() => {
        async function fetchMentorPrograms() {
            try {
                setMentorLoading(true);
                const { data, error } = await supabase
                    .from('mentor_programs')
                    .select(`
                        *,
                        instructors:instructor_id (
                            id,
                            name,
                            image_url
                        )
                    `)
                    .order('id');

                if (error) throw error;

                const transformedData = data?.map(program => ({
                    ...program,
                    instructor_name: program.instructors?.name || 'Unknown Instructor',
                    instructor_image_url: program.instructors?.image_url || null
                })) || [];

                setMentorPrograms(transformedData);
                setFilteredMentorPrograms(transformedData);
            } catch (error) {
                console.error('Error fetching mentor programs:', error);
                Alert.alert('Error', 'Failed to load mentor programs');
            } finally {
                setMentorLoading(false);
            }
        }

        fetchMentorPrograms();
    }, []);

    // Fetch Recommended Courses (Mock data for now)
    useEffect(() => {
        async function fetchRecommendedCourses() {
            try {
                setRecommendedLoading(true);
                // Mock recommended courses data
                const mockRecommendedCourses: RecommendedCourse[] = [
                    { id: 1, course_name: 'Wildlife Photography Basics', accuracy_score: 95.5, created_at: '2025-05-20T10:30:00Z' },
                    { id: 2, course_name: 'Bird Watching Fundamentals', accuracy_score: 88.2, created_at: '2025-05-19T14:15:00Z' },
                    { id: 3, course_name: 'Trail Safety and First Aid', accuracy_score: 92.8, created_at: '2025-05-18T09:45:00Z' },
                    { id: 4, course_name: 'Sustainable Tourism Practices', accuracy_score: 87.3, created_at: '2025-05-17T16:20:00Z' },
                ];

                setRecommendedCourses(mockRecommendedCourses);
                setFilteredRecommendedCourses(mockRecommendedCourses);
            } catch (error) {
                console.error('Error fetching recommended courses:', error);
            } finally {
                setRecommendedLoading(false);
            }
        }

        setTimeout(fetchRecommendedCourses, 500); // Simulate API delay
    }, []);

    // Filter Effects
    useEffect(() => {
        if (courseSearchQuery.trim() === '') {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter(course =>
                course.course_name.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                course.course_description.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                course.instructor_name.toLowerCase().includes(courseSearchQuery.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    }, [courseSearchQuery, courses]);

    useEffect(() => {
        if (mentorSearchQuery.trim() === '') {
            setFilteredMentorPrograms(mentorPrograms);
        } else {
            const filtered = mentorPrograms.filter(program =>
                program.program_name.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
                program.description.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
                program.instructor_name.toLowerCase().includes(mentorSearchQuery.toLowerCase())
            );
            setFilteredMentorPrograms(filtered);
        }
    }, [mentorSearchQuery, mentorPrograms]);

    useEffect(() => {
        if (recommendedSearchQuery.trim() === '') {
            setFilteredRecommendedCourses(recommendedCourses);
        } else {
            const filtered = recommendedCourses.filter(course =>
                course.course_name.toLowerCase().includes(recommendedSearchQuery.toLowerCase())
            );
            setFilteredRecommendedCourses(filtered);
        }
    }, [recommendedSearchQuery, recommendedCourses]);

    // Utility Functions
    const truncateText = (text: string, maxLength: number = 30) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const getCreatedDate = (item: any) => {
        return item.created_at ? formatDate(item.created_at) : 'N/A';
    };

    // Navigation Handlers
    const handleAdd = (type: 'course' | 'mentor' | 'recommended') => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can add items.');
            return;
        }

        if (type === 'course') {
            router.push('/AddCourseScreen');
        } else if (type === 'mentor') {
            router.push('/AddMentorProgrammeScreen');
        } else if (type === 'recommended') {
            router.push('/AddRecommendedCourseScreen');
        }
    };

    const handleViewAll = (type: 'course' | 'mentor' | 'recommended') => {
        if (type === 'course') {
            router.push('/CourseManagementScreen');
        } else if (type === 'mentor') {
            router.push('/MentorProgrammeManagementScreen');
        } else if (type === 'recommended') {
            router.push('/RecommendedCourseManagementScreen');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <Container className="pt-12 pb-6">
                    {/* Header */}
                    <AdminHeader
                        username={userName}
                        onDextAIPress={() => console.log('DextAI pressed')}
                        onNotificationPress={() => console.log('Notification pressed')}
                        onMenuPress={() => console.log('Menu pressed')}
                    />

                    {/* Course Management Section */}
                    <View className="mt-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold text-gray-800">Course Management</Text>
                            <TouchableOpacity onPress={() => handleViewAll('course')}>
                                <Text className="text-[#4E6E4E] text-sm font-medium">
                                    View all
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar and Add Button */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center bg-white rounded-full px-4 py-2 flex-1 mr-3 shadow-sm">
                                <Ionicons name="search" size={16} color="#868795" />
                                <TextInput
                                    placeholder="Search"
                                    value={courseSearchQuery}
                                    onChangeText={setCourseSearchQuery}
                                    className="ml-2 flex-1 text-sm"
                                    placeholderTextColor="#868795"
                                />
                                {courseSearchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setCourseSearchQuery('')}>
                                        <Ionicons name="close" size={16} color="#868795" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => handleAdd('course')}
                                className="bg-[#6D7E5E] px-4 py-2 rounded-full shadow-sm flex-row items-center"
                            >
                                <Ionicons name="add" size={16} color="white" />
                                <Text className="text-white text-sm font-medium ml-1">Add</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Course Table */}
                        <View className="bg-white rounded-lg shadow-sm">
                            {/* Table Header */}
                            <View className="bg-[#E6ECD6] p-3 rounded-t-lg">
                                <View className="flex-row items-center">
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Course Name</Text>
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Description</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Fees</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Students</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Rating</Text>
                                    <Text className="w-20 font-semibold text-xs text-gray-700">Created</Text>
                                </View>
                            </View>

                            {/* Table Body - Preview only (first 3 items) */}
                            {courseLoading ? (
                                <View className="p-6 items-center">
                                    <ActivityIndicator color="#4E6E4E" />
                                </View>
                            ) : (
                                <View className="rounded-b-lg">
                                    {filteredCourses.slice(0, 3).map((course, index) => (
                                        <View
                                            key={course.id}
                                            className={`p-3 ${index !== Math.min(filteredCourses.length, 3) - 1 ? 'border-b border-gray-100' : ''}`}
                                        >
                                            <View className="flex-row items-center">
                                                <Text className="flex-1 text-xs text-gray-800">{truncateText(course.course_name, 20)}</Text>
                                                <Text className="flex-1 text-xs text-gray-600">{truncateText(course.course_description, 25)}</Text>
                                                <Text className="w-16 text-xs text-gray-600">RM{course.fees}</Text>
                                                <Text className="w-16 text-xs text-gray-600">{course.student_count}</Text>
                                                <Text className="w-16 text-xs text-gray-600">{course.average_rating.toFixed(1)}</Text>
                                                <Text className="w-20 text-xs text-gray-600">{getCreatedDate(course)}</Text>
                                            </View>
                                        </View>
                                    ))}
                                    {filteredCourses.length > 3 && (
                                        <View className="p-3 bg-gray-50">
                                            <Text className="text-xs text-gray-500 text-center">
                                                +{filteredCourses.length - 3} more courses. Click "View all" to see all.
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Mentor Programme Management Section */}
                    <View className="mt-8">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold text-gray-800">Mentor Programme Management</Text>
                            <TouchableOpacity onPress={() => handleViewAll('mentor')}>
                                <Text className="text-[#4E6E4E] text-sm font-medium">
                                    View all
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar and Add Button */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center bg-white rounded-full px-4 py-2 flex-1 mr-3 shadow-sm">
                                <Ionicons name="search" size={16} color="#868795" />
                                <TextInput
                                    placeholder="Search"
                                    value={mentorSearchQuery}
                                    onChangeText={setMentorSearchQuery}
                                    className="ml-2 flex-1 text-sm"
                                    placeholderTextColor="#868795"
                                />
                                {mentorSearchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setMentorSearchQuery('')}>
                                        <Ionicons name="close" size={16} color="#868795" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => handleAdd('mentor')}
                                className="bg-[#6D7E5E] px-4 py-2 rounded-full shadow-sm flex-row items-center"
                            >
                                <Ionicons name="add" size={16} color="white" />
                                <Text className="text-white text-sm font-medium ml-1">Add</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Mentor Programme Table */}
                        <View className="bg-white rounded-lg shadow-sm">
                            {/* Table Header */}
                            <View className="bg-[#E6ECD6] p-3 rounded-t-lg">
                                <View className="flex-row items-center">
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Course Name</Text>
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Description</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Fees</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Students</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Rating</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Duration</Text>
                                    <Text className="w-20 font-semibold text-xs text-gray-700">Created</Text>
                                </View>
                            </View>

                            {/* Table Body - Preview only (first 3 items) */}
                            {mentorLoading ? (
                                <View className="p-6 items-center">
                                    <ActivityIndicator color="#4E6E4E" />
                                </View>
                            ) : (
                                <View className="rounded-b-lg">
                                    {filteredMentorPrograms.slice(0, 3).map((program, index) => (
                                        <View
                                            key={program.id}
                                            className={`p-3 ${index !== Math.min(filteredMentorPrograms.length, 3) - 1 ? 'border-b border-gray-100' : ''}`}
                                        >
                                            <View className="flex-row items-center">
                                                <Text className="flex-1 text-xs text-gray-800">{truncateText(program.program_name, 20)}</Text>
                                                <Text className="flex-1 text-xs text-gray-600">{truncateText(program.description, 25)}</Text>
                                                <Text className="w-16 text-xs text-gray-600">RM{program.fees}</Text>
                                                <Text className="w-16 text-xs text-gray-600">{program.student_count}</Text>
                                                <Text className="w-16 text-xs text-gray-600">{program.average_rating.toFixed(1)}</Text>
                                                <Text className="w-16 text-xs text-gray-600">{program.duration_hours}h</Text>
                                                <Text className="w-20 text-xs text-gray-600">{formatDate(program.created_at)}</Text>
                                            </View>
                                        </View>
                                    ))}
                                    {filteredMentorPrograms.length > 3 && (
                                        <View className="p-3 bg-gray-50">
                                            <Text className="text-xs text-gray-500 text-center">
                                                +{filteredMentorPrograms.length - 3} more programs. Click "View all" to see all.
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Recommended Course Management Section */}
                    <View className="mt-8">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 mr-4">
                                <Text className="text-xl font-bold text-gray-800 flex-wrap">
                                    Recommended Course Management
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => handleViewAll('recommended')}>
                                <Text className="text-[#4E6E4E] text-sm font-medium">
                                    View all
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar and Add Button */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center bg-white rounded-full px-4 py-2 flex-1 mr-3 shadow-sm">
                                <Ionicons name="search" size={16} color="#868795" />
                                <TextInput
                                    placeholder="Search"
                                    value={recommendedSearchQuery}
                                    onChangeText={setRecommendedSearchQuery}
                                    className="ml-2 flex-1 text-sm"
                                    placeholderTextColor="#868795"
                                />
                                {recommendedSearchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setRecommendedSearchQuery('')}>
                                        <Ionicons name="close" size={16} color="#868795" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => handleAdd('recommended')}
                                className="bg-[#6D7E5E] px-4 py-2 rounded-full shadow-sm flex-row items-center"
                            >
                                <Ionicons name="add" size={16} color="white" />
                                <Text className="text-white text-sm font-medium ml-1">Add</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Recommended Course Table */}
                        <View className="bg-white rounded-lg shadow-sm">
                            {/* Table Header */}
                            <View className="bg-[#E6ECD6] p-3 rounded-t-lg">
                                <View className="flex-row items-center">
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Course Name</Text>
                                    <Text className="w-24 font-semibold text-xs text-gray-700">Accuracy Score</Text>
                                    <Text className="w-24 font-semibold text-xs text-gray-700">Create At</Text>
                                </View>
                            </View>

                            {/* Table Body - Preview only (first 3 items) */}
                            {recommendedLoading ? (
                                <View className="p-6 items-center">
                                    <ActivityIndicator color="#4E6E4E" />
                                </View>
                            ) : (
                                <View className="rounded-b-lg">
                                    {filteredRecommendedCourses.slice(0, 3).map((course, index) => (
                                        <View
                                            key={course.id}
                                            className={`p-3 ${index !== Math.min(filteredRecommendedCourses.length, 3) - 1 ? 'border-b border-gray-100' : ''}`}
                                        >
                                            <View className="flex-row items-center">
                                                <Text className="flex-1 text-xs text-gray-800">{truncateText(course.course_name, 30)}</Text>
                                                <Text className="w-24 text-xs text-gray-600">{course.accuracy_score.toFixed(1)}%</Text>
                                                <Text className="w-24 text-xs text-gray-600">{formatDateTime(course.created_at)}</Text>
                                            </View>
                                        </View>
                                    ))}
                                    {filteredRecommendedCourses.length > 3 && (
                                        <View className="p-3 bg-gray-50">
                                            <Text className="text-xs text-gray-500 text-center">
                                                +{filteredRecommendedCourses.length - 3} more courses. Click "View all" to see all.
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </Container>
            </ScrollView>

            <AdminNavBar activeRoute="/ContentManagementScreen" />
        </SafeAreaView>
    );
}