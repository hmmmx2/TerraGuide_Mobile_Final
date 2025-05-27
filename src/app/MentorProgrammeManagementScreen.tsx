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
import { MentorProgram } from '@/types/mentorProgram';

export default function MentorProgrammeManagementScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [userName, setUserName] = useState('Admin');
    const [userRole, setUserRole] = useState<string>('admin');

    // State
    const [mentorPrograms, setMentorPrograms] = useState<MentorProgram[]>([]);
    const [filteredMentorPrograms, setFilteredMentorPrograms] = useState<MentorProgram[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<MentorProgram | null>(null);

    // Fetch Mentor Programs
    useEffect(() => {
        async function fetchMentorPrograms() {
            try {
                setLoading(true);
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
                setLoading(false);
            }
        }

        fetchMentorPrograms();
    }, []);

    // Filter mentor programs
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMentorPrograms(mentorPrograms);
        } else {
            const filtered = mentorPrograms.filter(program =>
                program.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.instructor_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMentorPrograms(filtered);
        }
    }, [searchQuery, mentorPrograms]);

    // Utility Functions
    const truncateText = (text: string, maxLength: number = 25) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Handlers
    const handleAdd = () => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can add mentor programmes.');
            return;
        }
        router.push('/AddMentorProgrammeScreen');
    };

    const handleEdit = () => {
        setEditing(!editing);
    };

    const handleDelete = (program: MentorProgram) => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can delete mentor programmes.');
            return;
        }
        setSelectedProgram(program);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedProgram) return;

        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete "${selectedProgram.program_name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setMentorPrograms(prev => prev.filter(program => program.id !== selectedProgram.id));
                        setShowDeleteModal(false);
                        setSelectedProgram(null);
                        Alert.alert('Success', 'Mentor programme deleted successfully!');
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

                    {/* Mentor Programme Management Section */}
                    <View className="mt-6">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 mr-4">
                                <Text className="text-2xl font-bold text-gray-800 flex-wrap">
                                    Mentor Programme Management
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

                        {/* Mentor Programme Table */}
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
                                    <Text className="w-16 font-semibold text-xs text-gray-700">Duration Hour</Text>
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
                                    <Text className="mt-2 text-gray-600">Loading mentor programmes...</Text>
                                </View>
                            ) : (
                                <View className="rounded-b-lg">
                                    {filteredMentorPrograms.length > 0 ? (
                                        filteredMentorPrograms.map((program, index) => (
                                            <View
                                                key={program.id}
                                                className={`p-3 ${index !== filteredMentorPrograms.length - 1 ? 'border-b border-gray-100' : ''}`}
                                            >
                                                <View className="flex-row items-center">
                                                    <Text className="flex-1 text-xs text-gray-800">{truncateText(program.program_name, 20)}</Text>
                                                    <Text className="flex-1 text-xs text-gray-600">{truncateText(program.description, 25)}</Text>
                                                    <Text className="flex-1 text-xs text-gray-600">{truncateText(program.image_url || 'N/A', 30)}</Text>
                                                    <Text className="w-16 text-xs text-gray-600">RM{program.fees}</Text>
                                                    <Text className="w-16 text-xs text-gray-600">{program.student_count}</Text>
                                                    <Text className="w-16 text-xs text-gray-600">{program.average_rating.toFixed(1)}</Text>
                                                    <Text className="w-16 text-xs text-gray-600">{program.duration_hours}h</Text>
                                                    <Text className="w-20 text-xs text-gray-600">{formatDate(program.created_at)}</Text>
                                                    {editing && (
                                                        <View className="w-12 items-center">
                                                            <TouchableOpacity
                                                                onPress={() => handleDelete(program)}
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
                                            <Text className="text-gray-500">No mentor programmes found</Text>
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
                            Are you sure you want to delete this mentor programme?
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