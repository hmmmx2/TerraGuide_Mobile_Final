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
import { Container } from '@/components/Container';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';

// Instructor Interface
interface Instructor {
    id: number;
    name: string;
    title: string;
    image_url?: string;
}

export default function AddCourseScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [instructorsLoading, setInstructorsLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        courseName: '',
        courseDescription: '',
        courseImageUrl: '',
        instructorId: '',
        fees: '',
        duration: ''
    });

    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

    // Fetch instructors on component mount
    useEffect(() => {
        async function fetchInstructors() {
            try {
                setInstructorsLoading(true);
                const { data, error } = await supabase
                    .from('instructors')
                    .select('*')
                    .order('name');

                if (error) throw error;

                setInstructors(data || []);
            } catch (error) {
                console.error('Error fetching instructors:', error);
                Alert.alert('Error', 'Failed to load instructors');
            } finally {
                setInstructorsLoading(false);
            }
        }

        fetchInstructors();
    }, []);

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle instructor selection
    const handleInstructorSelect = (instructor: Instructor) => {
        setSelectedInstructor(instructor);
        setFormData(prev => ({
            ...prev,
            instructorId: instructor.id.toString()
        }));
        setShowInstructorDropdown(false);
    };

    // Validate form
    const validateForm = () => {
        const { courseName, courseDescription, courseImageUrl, instructorId, fees, duration } = formData;

        if (!courseName.trim()) {
            Alert.alert('Validation Error', 'Course name is required');
            return false;
        }

        if (!courseDescription.trim()) {
            Alert.alert('Validation Error', 'Course description is required');
            return false;
        }

        if (!courseImageUrl.trim()) {
            Alert.alert('Validation Error', 'Course image URL is required');
            return false;
        }

        if (!instructorId) {
            Alert.alert('Validation Error', 'Please select an instructor');
            return false;
        }

        if (!fees.trim() || isNaN(Number(fees)) || Number(fees) < 0) {
            Alert.alert('Validation Error', 'Please enter a valid fee amount');
            return false;
        }

        if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid duration in hours');
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const courseData = {
                course_name: formData.courseName.trim(),
                course_description: formData.courseDescription.trim(),
                course_image_url: formData.courseImageUrl.trim(),
                instructor_id: parseInt(formData.instructorId),
                fees: parseFloat(formData.fees),
                duration_hours: parseFloat(formData.duration),
                student_count: 0,
                average_rating: 0.0,
                reviews_count: 0,
                created_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('courses')
                .insert([courseData]);

            if (error) throw error;

            Alert.alert(
                'Success',
                'Course added successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );

        } catch (error) {
            console.error('Error adding course:', error);
            Alert.alert('Error', 'Failed to add course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <Container className="pt-12 pb-6">
                    {/* Header */}
                    <View className="flex-row items-center mb-8">
                        <BackButton />
                        <Text className="text-2xl font-bold text-gray-800 ml-4">Add New Course</Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-6">
                        {/* Course Name */}
                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Course Name <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={formData.courseName}
                                onChangeText={(value) => handleInputChange('courseName', value)}
                                placeholder="Enter course name"
                                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        {/* Course Description */}
                        <View className="mt-6">
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Course Description <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={formData.courseDescription}
                                onChangeText={(value) => handleInputChange('courseDescription', value)}
                                placeholder="Enter course description"
                                multiline
                                numberOfLines={4}
                                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                                placeholderTextColor="#9CA3AF"
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Course Image URL */}
                        <View className="mt-6">
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Course Image URL <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={formData.courseImageUrl}
                                onChangeText={(value) => handleInputChange('courseImageUrl', value)}
                                placeholder="https://example.com/image.jpg"
                                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="url"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Instructor Dropdown */}
                        <View className="mt-6">
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Instructor <Text className="text-red-500">*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowInstructorDropdown(!showInstructorDropdown)}
                                className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex-row justify-between items-center"
                                disabled={instructorsLoading}
                            >
                                <Text className={`text-base ${selectedInstructor ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {instructorsLoading
                                        ? 'Loading instructors...'
                                        : selectedInstructor
                                            ? selectedInstructor.name
                                            : 'Select an instructor'
                                    }
                                </Text>
                                <Ionicons
                                    name={showInstructorDropdown ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>

                            {/* Instructor Dropdown List */}
                            {showInstructorDropdown && !instructorsLoading && (
                                <View className="bg-white border border-gray-200 rounded-lg mt-1 shadow-lg">
                                    {instructors.map((instructor) => (
                                        <TouchableOpacity
                                            key={instructor.id}
                                            onPress={() => handleInstructorSelect(instructor)}
                                            className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                                        >
                                            <Text className="text-base text-gray-800">{instructor.name}</Text>
                                            {instructor.title && (
                                                <Text className="text-sm text-gray-500 mt-1">{instructor.title}</Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Fees and Duration Row */}
                        <View className="flex-row space-x-4 mt-6">
                            {/* Fees */}
                            <View className="flex-1">
                                <Text className="text-base font-medium text-gray-700 mb-2">
                                    Fees (RM) <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    value={formData.fees}
                                    onChangeText={(value) => handleInputChange('fees', value)}
                                    placeholder="0"
                                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Duration */}
                            <View className="flex-1">
                                <Text className="text-base font-medium text-gray-700 mb-2">
                                    Duration (hours) <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    value={formData.duration}
                                    onChangeText={(value) => handleInputChange('duration', value)}
                                    placeholder="0"
                                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Info Note */}
                        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex-row mt-6">
                            <Ionicons name="information-circle" size={20} color="#3B82F6" className="mr-3" />
                            <Text className="text-blue-800 text-sm flex-1 ml-3">
                                Student count and average rating will be automatically set to 0 for new courses.
                            </Text>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className={`mt-8 py-4 rounded-full shadow-sm ${
                                loading ? 'bg-gray-400' : 'bg-[#6D7E5E]'
                            }`}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text className="text-center text-white text-lg font-semibold">
                                    Add Course
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
}