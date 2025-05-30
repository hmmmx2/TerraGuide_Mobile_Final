// RecommendedCourseManagementScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminNavBar } from '@/components/AdminNavBar';
import { Container } from '@/components/Container';
// import { useAuth } from '@/context/AuthProvider'; // session not used, add back if permission logic needs it
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Recommended Course Interface
interface RecommendedCourse {
    id: number;
    course_name: string;
    accuracy_score: number;
    created_at: string;
}

export default function RecommendedCourseManagementScreen() {
    const router = useRouter();
    // const { session } = useAuth(); // Assuming session might be used for userName/userRole later
    const [userName, setUserName] = useState('Admin'); // Placeholder
    const [userRole, setUserRole] = useState<string>('admin'); // Placeholder

    // State
    const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
    const [filteredRecommendedCourses, setFilteredRecommendedCourses] = useState<RecommendedCourse[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false); // For delete operation loader
    const [editing, setEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<RecommendedCourse | null>(null);

    // Base mock data - can be an empty array if all data comes from AsyncStorage after first run
    const baseMockCourses: RecommendedCourse[] = [
        { id: 1, course_name: 'Wildlife Photography Basics for Beginners', accuracy_score: 95.5, created_at: '2025-05-20T10:30:00Z' },
        { id: 2, course_name: 'Bird Watching Fundamentals and Species Identification', accuracy_score: 88.2, created_at: '2025-05-19T14:15:00Z' },
        { id: 3, course_name: 'Trail Safety and First Aid Emergency Response', accuracy_score: 92.8, created_at: '2025-05-18T09:45:00Z' },
        // Add more base courses if needed, or keep it minimal if AsyncStorage is primary
    ];

    const fetchAndCombineRecommendedCourses = useCallback(async (): Promise<RecommendedCourse[]> => {
        let combinedCourses = [...baseMockCourses];
        try {
            const storedCoursesJson = await AsyncStorage.getItem('additionalRecommendedCourses');
            if (storedCoursesJson) {
                const additionalCourses: RecommendedCourse[] = JSON.parse(storedCoursesJson);
                // Add additional courses, avoiding duplicates from baseMock by ID
                additionalCourses.forEach(ac => {
                    if (!combinedCourses.some(bc => bc.id === ac.id)) {
                        combinedCourses.push(ac);
                    }
                });
            }
        } catch (error) {
            console.error('Error reading additional recommended courses from AsyncStorage:', error);
            // Continue with base courses if AsyncStorage fails
        }
        return combinedCourses.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); // Sort by date
    }, []);


    const fetchRecommendedCourses = useCallback(async () => {
        setLoading(true);
        try {
            // Simulate API call delay if needed, otherwise remove
            // await new Promise(resolve => setTimeout(resolve, 300));
            const courses = await fetchAndCombineRecommendedCourses();
            setRecommendedCourses(courses);
            setFilteredRecommendedCourses(courses);
        } catch (error) {
            console.error('Error fetching recommended courses:', error);
            Alert.alert('Error', 'Failed to load recommended courses');
        } finally {
            setLoading(false);
        }
    }, [fetchAndCombineRecommendedCourses]);

    // Initial fetch and refetch on focus
    useFocusEffect(
        useCallback(() => {
            fetchRecommendedCourses();
        }, [fetchRecommendedCourses])
    );

    // Filter recommended courses
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredRecommendedCourses(recommendedCourses);
        } else {
            const filtered = recommendedCourses.filter(course =>
                course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRecommendedCourses(filtered);
        }
    }, [searchQuery, recommendedCourses]);

    // Utility Functions
    const truncateText = (text: string, maxLength: number = 35) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    };

    // Handlers
    const handleAdd = () => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can add recommended courses.');
            return;
        }
        router.push('/AddRecommendedCourseScreen');
    };

    const handleEdit = () => {
        setEditing(!editing);
    };

    const handleDelete = (course: RecommendedCourse) => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can delete recommended courses.');
            return;
        }
        setSelectedCourse(course);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedCourse) return;
        setDeleting(true);
        try {
            // Only delete from 'additionalRecommendedCourses' in AsyncStorage
            // Base mock courses are not deleted from AsyncStorage unless they were added there
            const storedCoursesJson = await AsyncStorage.getItem('additionalRecommendedCourses');
            let additionalCourses: RecommendedCourse[] = storedCoursesJson ? JSON.parse(storedCoursesJson) : [];

            const updatedAdditionalCourses = additionalCourses.filter(course => course.id !== selectedCourse.id);
            await AsyncStorage.setItem('additionalRecommendedCourses', JSON.stringify(updatedAdditionalCourses));

            // Refetch all courses to update the UI
            await fetchRecommendedCourses();

            Alert.alert('Success', 'Recommended course deleted successfully!');
        } catch (error) {
            console.error('Error deleting recommended course:', error);
            Alert.alert('Error', 'Failed to delete recommended course. Please try again.');
        } finally {
            setShowDeleteModal(false);
            setSelectedCourse(null);
            setDeleting(false);
        }
    };

    const handleSaveChanges = () => {
        // In this mock setup, "Save changes" might not do much if edits aren't implemented
        // If you implement inline editing, this is where you'd persist those changes
        Alert.alert('Info', 'Edit mode toggled. Implement save logic if inline editing is added.');
        setEditing(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1" refreshControl={
                <ActivityIndicator animating={loading && !deleting} color="#4E6E4E" />
            }>
                <Container className="pt-12 pb-6">
                    <AdminHeader
                        username={userName}
                        onDextAIPress={() => console.log('DextAI pressed')}
                        onNotificationPress={() => console.log('Notification pressed')}
                        onMenuPress={() => console.log('Menu pressed')}
                    />
                    <View className="mt-6">
                        <View className="flex-row justify-between items-start mb-4">
                            <Text className="text-2xl font-bold text-gray-800 flex-wrap flex-1 mr-4">
                                Recommended Course Management
                            </Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={fetchRecommendedCourses} // Direct refresh
                                    className="px-3 py-2 mr-2"
                                    disabled={loading || deleting}
                                >
                                    <Ionicons
                                        name="refresh"
                                        size={18}
                                        color={(loading || deleting) ? "#9CA3AF" : "#4E6E4E"}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleEdit}
                                    className="px-4 py-2"
                                >
                                    <Text className="text-[#4E6E4E] text-sm font-medium">
                                        {editing ? 'Done' : 'Edit'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center bg-white rounded-full px-4 py-2 flex-1 mr-3 shadow-sm">
                                <Ionicons name="search" size={16} color="#868795" />
                                <TextInput
                                    placeholder="Search courses"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    className="ml-2 flex-1 text-sm text-gray-800"
                                    placeholderTextColor="#868795"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <Ionicons name="close-circle" size={18} color="#868795" />
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

                        <View className="bg-white rounded-lg shadow-sm">
                            <View className="bg-[#E6ECD6] p-3 rounded-t-lg">
                                <View className="flex-row items-center">
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Course Name</Text>
                                    <Text className="w-24 font-semibold text-xs text-gray-700 text-center">Accuracy</Text>
                                    <Text className="w-28 font-semibold text-xs text-gray-700 text-center">Created At</Text>
                                    {editing && (
                                        <Text className="w-12 font-semibold text-xs text-gray-700 text-center">Action</Text>
                                    )}
                                </View>
                            </View>

                            {loading && !filteredRecommendedCourses.length ? (
                                <View className="p-8 items-center">
                                    <ActivityIndicator color="#4E6E4E" />
                                    <Text className="mt-2 text-gray-600">Loading recommended courses...</Text>
                                </View>
                            ) : (
                                <View className="rounded-b-lg">
                                    {filteredRecommendedCourses.length > 0 ? (
                                        filteredRecommendedCourses.map((course, index) => (
                                            <View
                                                key={course.id}
                                                className={`p-3 ${index !== filteredRecommendedCourses.length - 1 ? 'border-b border-gray-100' : ''}`}
                                            >
                                                <View className="flex-row items-center">
                                                    <Text className="flex-1 text-xs text-gray-800">{truncateText(course.course_name, 40)}</Text>
                                                    <Text className="w-24 text-xs text-gray-600 text-center">{course.accuracy_score.toFixed(1)}%</Text>
                                                    <Text className="w-28 text-xs text-gray-600 text-center">{formatDateTime(course.created_at)}</Text>
                                                    {editing && (
                                                        <View className="w-12 items-center">
                                                            <TouchableOpacity
                                                                onPress={() => handleDelete(course)}
                                                                className="p-1"
                                                                disabled={deleting}
                                                            >
                                                                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        ))
                                    ) : (
                                        <View className="p-8 items-center">
                                            <Text className="text-gray-500">No recommended courses found.</Text>
                                            <TouchableOpacity
                                                onPress={fetchRecommendedCourses}
                                                className="mt-2 px-4 py-2 bg-[#6D7E5E] rounded-full"
                                                disabled={loading || deleting}
                                            >
                                                <Text className="text-white text-sm">Refresh</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {editing && (
                        <View className="mt-8">
                            <TouchableOpacity
                                onPress={handleSaveChanges}
                                className="bg-[#6D7E5E] py-4 rounded-full shadow-sm"
                            >
                                <Text className="text-center text-white text-lg font-semibold">
                                    Save All Changes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Container>
            </ScrollView>

            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <Pressable
                    className="flex-1 bg-black bg-opacity-50 justify-center items-center"
                    onPress={() => setShowDeleteModal(false)} // Close on backdrop press
                >
                    <Pressable className="bg-white rounded-lg p-6 w-80 max-w-[90%]" onPress={() => {}}>
                        <Text className="text-lg font-bold text-gray-800 text-center mb-4">Confirm Delete</Text>
                        <Text className="text-sm text-gray-600 text-center mb-6">
                            Are you sure you want to delete "{selectedCourse?.course_name}"? This action cannot be undone.
                        </Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(false)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg"
                                disabled={deleting}
                            >
                                <Text className="text-center text-gray-700 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={confirmDelete}
                                className="flex-1 p-3 bg-red-600 rounded-lg items-center justify-center"
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text className="text-center text-white font-medium">Delete</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
            <AdminNavBar activeRoute="/ContentManagementScreen" />
        </SafeAreaView>
    );
}