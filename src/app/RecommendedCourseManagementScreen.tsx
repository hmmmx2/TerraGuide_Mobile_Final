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

// Recommended Course Interface
interface RecommendedCourse {
    id: number;
    course_name: string;
    accuracy_score: number;
    created_at: string;
}

export default function RecommendedCourseManagementScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [userName, setUserName] = useState('Admin');
    const [userRole, setUserRole] = useState<string>('admin');

    // State
    const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
    const [filteredRecommendedCourses, setFilteredRecommendedCourses] = useState<RecommendedCourse[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<RecommendedCourse | null>(null);

    // Fetch Recommended Courses (Mock data for now)
    useEffect(() => {
        async function fetchRecommendedCourses() {
            try {
                setLoading(true);
                // Mock recommended courses data - you can replace this with actual Supabase call
                const mockRecommendedCourses: RecommendedCourse[] = [
                    { id: 1, course_name: 'Wildlife Photography Basics for Beginners', accuracy_score: 95.5, created_at: '2025-05-20T10:30:00Z' },
                    { id: 2, course_name: 'Bird Watching Fundamentals and Species Identification', accuracy_score: 88.2, created_at: '2025-05-19T14:15:00Z' },
                    { id: 3, course_name: 'Trail Safety and First Aid Emergency Response', accuracy_score: 92.8, created_at: '2025-05-18T09:45:00Z' },
                    { id: 4, course_name: 'Sustainable Tourism Practices and Conservation', accuracy_score: 87.3, created_at: '2025-05-17T16:20:00Z' },
                    { id: 5, course_name: 'Nature Conservation and Environmental Awareness', accuracy_score: 91.7, created_at: '2025-05-16T11:10:00Z' },
                    { id: 6, course_name: 'Hiking Equipment and Gear Selection Guide', accuracy_score: 89.4, created_at: '2025-05-15T13:25:00Z' },
                    { id: 7, course_name: 'Weather Patterns and Outdoor Safety Protocols', accuracy_score: 93.1, created_at: '2025-05-14T08:55:00Z' },
                    { id: 8, course_name: 'Park Ecosystem and Biodiversity Understanding', accuracy_score: 85.9, created_at: '2025-05-13T17:40:00Z' },
                    { id: 9, course_name: 'Cultural Heritage and Historical Site Interpretation', accuracy_score: 90.2, created_at: '2025-05-12T12:15:00Z' },
                    { id: 10, course_name: 'Advanced Navigation and GPS Technology', accuracy_score: 86.8, created_at: '2025-05-11T15:30:00Z' },
                ];

                setRecommendedCourses(mockRecommendedCourses);
                setFilteredRecommendedCourses(mockRecommendedCourses);
            } catch (error) {
                console.error('Error fetching recommended courses:', error);
                Alert.alert('Error', 'Failed to load recommended courses');
            } finally {
                setLoading(false);
            }
        }

        setTimeout(fetchRecommendedCourses, 500); // Simulate API delay
    }, []);

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
                        setRecommendedCourses(prev => prev.filter(course => course.id !== selectedCourse.id));
                        setShowDeleteModal(false);
                        setSelectedCourse(null);
                        Alert.alert('Success', 'Recommended course deleted successfully!');
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

                    {/* Recommended Course Management Section */}
                    <View className="mt-6">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 mr-4">
                                <Text className="text-2xl font-bold text-gray-800 flex-wrap">
                                    Recommended Course Management
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

                        {/* Recommended Course Table */}
                        <View className="bg-white rounded-lg shadow-sm">
                            {/* Table Header */}
                            <View className="bg-[#E6ECD6] p-3 rounded-t-lg">
                                <View className="flex-row items-center">
                                    <Text className="flex-1 font-semibold text-xs text-gray-700">Course Name</Text>
                                    <Text className="w-24 font-semibold text-xs text-gray-700 text-center">Accuracy Score</Text>
                                    <Text className="w-28 font-semibold text-xs text-gray-700 text-center">Create At</Text>
                                    {editing && (
                                        <Text className="w-12 font-semibold text-xs text-gray-700 text-center">Action</Text>
                                    )}
                                </View>
                            </View>

                            {/* Table Body */}
                            {loading ? (
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
                                            <Text className="text-gray-500">No recommended courses found</Text>
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
                            Are you sure you want to delete this recommended course?
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