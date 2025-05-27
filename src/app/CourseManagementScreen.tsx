import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    Pressable,
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

export default function CourseManagementScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [userName, setUserName] = useState('Admin');
    const [userRole, setUserRole] = useState<string>('admin');

    // State
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Fetch Courses
    useEffect(() => {
        async function fetchCourses() {
            try {
                setLoading(true);
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
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    // Filter courses
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter(course =>
                course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.course_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    }, [searchQuery, courses]);

    // Utility Functions
    const truncateText = (text: string, maxLength: number = 25) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const getCreatedDate = (item: any) => {
        if (item.created_at) {
            const date = new Date(item.created_at);
            return date.toLocaleDateString('en-GB');
        }
        return 'N/A';
    };

    // Handlers
    const handleAdd = () => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can add courses.');
            return;
        }
        router.push('/AddCourseScreen');
    };

    const handleEdit = () => {
        setEditing(!editing);
    };

    const handleDelete = (course: Course) => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can delete courses.');
            return;
        }
        setSelectedCourse(course);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedCourse) return;

        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete "${selectedCourse.course_name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setCourses(prev => prev.filter(course => course.id !== selectedCourse.id));
                        setShowDeleteModal(false);
                        setSelectedCourse(null);
                        Alert.alert('Success', 'Course deleted successfully!');
                    }
                }
            ]
        );
    };

    const handleSaveChanges = () => {
        Alert.alert('Success', 'All changes have been saved successfully!');
        setEditing(false);
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
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 mr-4">
                                <Text className="text-2xl font-bold text-gray-800 flex-wrap">
                                    Course Management
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleEdit}
                                className="px-4 py-2"
                            >
                                <Text className="text-[#4E6E4E] text-sm font-medium">
                                    {editing ? 'Done' : 'Edit'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar and Add Button */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center bg-white rounded-full px-4 py-2 flex-1 mr-3 shadow-sm">
                                <Ionicons name="search" size={16} color="#868795" />
                                <TextInput
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    className="ml-2 flex-1 text-sm"
                                    placeholderTextColor="#868795"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <Ionicons name="close" size={16} color="#868795" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={handleAdd}
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
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Course Description</Text>
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Course Image Url</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Fees</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Student Count</Text>
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Average Rating</Text>
                                    <Text className="w-20 font-semibold text-xs text-gray-700">Create At</Text>
                                    {editing && (
                                        <Text className="w-12 font-semibold text-xs text-gray-700 text-center">Action</Text>
                                    )}
                                </View>
                            </View>

                            {/* Table Body */}
                            {loading ? (
                                <View className="p-8 items-center">
                                    <ActivityIndicator color="#4E6E4E" />
                                    <Text className="mt-2 text-gray-600">Loading courses...</Text>
                                </View>
                            ) : (
                                <View className="rounded-b-lg">
                                    {filteredCourses.length > 0 ? (
                                        filteredCourses.map((course, index) => (
                                            <View
                                                key={course.id}
                                                className={`p-3 ${index !== filteredCourses.length - 1 ? 'border-b border-gray-100' : ''}`}
                                            >
                                                <View className="flex-row items-center">
                                                    <Text className="flex-1 text-xs text-gray-800">{truncateText(course.course_name, 20)}</Text>
                                                    <Text className="flex-1 text-xs text-gray-600">{truncateText(course.course_description, 25)}</Text>
                                                    <Text className="flex-1 text-xs text-gray-600">{truncateText(course.course_image_url, 30)}</Text>
                                                    <Text className="w-16 text-xs text-gray-600">RM{course.fees}</Text>
                                                    <Text className="w-16 text-xs text-gray-600">{course.student_count}</Text>
                                                    <Text className="w-16 text-xs text-gray-600">{course.average_rating.toFixed(1)}</Text>
                                                    <Text className="w-20 text-xs text-gray-600">{getCreatedDate(course)}</Text>
                                                    {editing && (
                                                        <View className="w-12 items-center">
                                                            <TouchableOpacity
                                                                onPress={() => handleDelete(course)}
                                                                className="p-1"
                                                            >
                                                                <Ionicons name="close" size={14} color="#ef4444" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        ))
                                    ) : (
                                        <View className="p-8 items-center">
                                            <Text className="text-gray-500">No courses found</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Save Changes Button */}
                    {editing && (
                        <View className="mt-8">
                            <TouchableOpacity
                                onPress={handleSaveChanges}
                                className="bg-[#6D7E5E] py-4 rounded-full shadow-sm"
                            >
                                <Text className="text-center text-white text-lg font-semibold">
                                    Save the changes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Container>
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <Pressable
                    className="flex-1 bg-black bg-opacity-50 justify-center items-center"
                    onPress={() => setShowDeleteModal(false)}
                >
                    <Pressable className="bg-white rounded-lg p-6 w-80 max-w-[90%]">
                        <Text className="text-lg font-bold text-center mb-4">Confirm Delete</Text>
                        <Text className="text-sm text-gray-600 text-center mb-6">
                            Are you sure you want to delete this course?
                        </Text>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(false)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg"
                            >
                                <Text className="text-center text-gray-600 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={confirmDelete}
                                className="flex-1 p-3 bg-red-500 rounded-lg"
                            >
                                <Text className="text-center text-white font-medium">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            <AdminNavBar activeRoute="/ContentManagementScreen" />
        </SafeAreaView>
    );
}