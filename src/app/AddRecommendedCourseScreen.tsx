// AddMentorProgrammeScreen.tsx (Review - No changes made based on the provided error)

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    StyleSheet // For potential dropdown styling
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Container } from '@/components/Container';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthProvider'; // Assuming session might be used for permissions
import { supabase } from '@/lib/supabase';

// Instructor Interface
interface Instructor {
    id: number;
    name: string;
    title?: string; // Made optional as it's checked
    image_url?: string;
}

export default function AddMentorProgrammeScreen() {
    const router = useRouter();
    // const { session } = useAuth(); // Add back if used for permission checks
    const [loading, setLoading] = useState(false);
    const [instructorsLoading, setInstructorsLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        programName: '',
        description: '',
        imageUrl: '',
        instructorId: '', // Store as string for TextInput, parse to int on submit
        fees: '',
        duration: ''
    });

    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

    // Fetch instructors
    const fetchInstructors = useCallback(async () => {
        setInstructorsLoading(true);
        try {
            const { data, error } = await supabase
                .from('instructors')
                .select('id, name, title, image_url') // Explicitly select columns
                .order('name');

            if (error) throw error;
            setInstructors(data || []);
        } catch (error) {
            console.error('Error fetching instructors:', error);
            Alert.alert('Error', 'Failed to load instructors. ' + (error as Error).message);
        } finally {
            setInstructorsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInstructors();
    }, [fetchInstructors]);

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
        const { programName, description, imageUrl, instructorId, fees, duration } = formData;
        if (!programName.trim()) { Alert.alert('Validation Error', 'Programme name is required.'); return false; }
        if (!description.trim()) { Alert.alert('Validation Error', 'Programme description is required.'); return false; }
        if (!imageUrl.trim()) { Alert.alert('Validation Error', 'Programme image URL is required.'); return false; }
        // Basic URL validation (optional enhancement)
        try { new URL(imageUrl.trim()); } catch (_) { Alert.alert('Validation Error', 'Please enter a valid image URL.'); return false; }
        if (!instructorId) { Alert.alert('Validation Error', 'Please select an instructor.'); return false; }
        if (!fees.trim() || isNaN(Number(fees)) || Number(fees) < 0) { Alert.alert('Validation Error', 'Please enter a valid non-negative fee amount.'); return false; }
        if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) { Alert.alert('Validation Error', 'Please enter a valid duration in hours (must be > 0).'); return false; }
        return true;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const programData = {
                program_name: formData.programName.trim(),
                description: formData.description.trim(),
                image_url: formData.imageUrl.trim(),
                instructor_id: parseInt(formData.instructorId, 10),
                fees: parseFloat(formData.fees),
                duration_hours: parseFloat(formData.duration),
                student_count: 0,      // Default value
                average_rating: 0.0,   // Default value
                reviews_count: 0,      // Default value - ensure 'mentor_programs' table has this column
                // created_at: new Date().toISOString() // Supabase handles this by default if column is timestamp with default NOW()
            };

            const { error } = await supabase
                .from('mentor_programs')
                .insert([programData]);

            if (error) throw error;

            Alert.alert(
                'Success',
                'Mentor programme added successfully!',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error adding mentor program:', error);
            Alert.alert('Error', 'Failed to add mentor programme. ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                <Container className="pt-12 pb-6">
                    <View className="flex-row items-center mb-8">
                        <BackButton />
                        <Text className="text-2xl font-bold text-gray-800 ml-4">Add Mentor Programme</Text>
                    </View>

                    <View className="space-y-5">
                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-1.5">Programme Name <Text className="text-red-500">*</Text></Text>
                            <TextInput value={formData.programName} onChangeText={(v) => handleInputChange('programName', v)} placeholder="e.g., Advanced Guide Training" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800" placeholderTextColor="#9CA3AF" />
                        </View>
                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-1.5">Description <Text className="text-red-500">*</Text></Text>
                            <TextInput value={formData.description} onChangeText={(v) => handleInputChange('description', v)} placeholder="Detailed description of the programme..." multiline numberOfLines={4} className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 h-28" placeholderTextColor="#9CA3AF" textAlignVertical="top" />
                        </View>
                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-1.5">Image URL <Text className="text-red-500">*</Text></Text>
                            <TextInput value={formData.imageUrl} onChangeText={(v) => handleInputChange('imageUrl', v)} placeholder="https://example.com/image.png" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800" placeholderTextColor="#9CA3AF" keyboardType="url" autoCapitalize="none" />
                        </View>
                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-1.5">Instructor <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity
                                onPress={() => setShowInstructorDropdown(!showInstructorDropdown)}
                                className="bg-white border border-gray-300 rounded-lg px-4 py-3.5 flex-row justify-between items-center"
                                disabled={instructorsLoading}
                            >
                                <Text className={`text-base ${selectedInstructor ? 'text-gray-800' : 'text-gray-500'}`}>
                                    {instructorsLoading ? 'Loading instructors...' : selectedInstructor ? selectedInstructor.name : 'Select an instructor'}
                                </Text>
                                <Ionicons name={showInstructorDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
                            </TouchableOpacity>
                            {showInstructorDropdown && !instructorsLoading && (
                                <View className="bg-white border border-gray-300 rounded-lg mt-1 max-h-48 shadow-lg z-10">
                                    <ScrollView nestedScrollEnabled>
                                        {instructors.length > 0 ? instructors.map((instructor) => (
                                            <TouchableOpacity key={instructor.id} onPress={() => handleInstructorSelect(instructor)} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                                                <Text className="text-base text-gray-800">{instructor.name}</Text>
                                                {instructor.title && <Text className="text-sm text-gray-500 mt-0.5">{instructor.title}</Text>}
                                            </TouchableOpacity>
                                        )) : <Text className="p-4 text-gray-500">No instructors available.</Text>}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                        <View className="flex-row space-x-4">
                            <View className="flex-1">
                                <Text className="text-base font-medium text-gray-700 mb-1.5">Fees (RM) <Text className="text-red-500">*</Text></Text>
                                <TextInput value={formData.fees} onChangeText={(v) => handleInputChange('fees', v)} placeholder="e.g., 150" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800" placeholderTextColor="#9CA3AF" keyboardType="numeric" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-base font-medium text-gray-700 mb-1.5">Duration (hours) <Text className="text-red-500">*</Text></Text>
                                <TextInput value={formData.duration} onChangeText={(v) => handleInputChange('duration', v)} placeholder="e.g., 10" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800" placeholderTextColor="#9CA3AF" keyboardType="numeric" />
                            </View>
                        </View>
                        <View className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 flex-row items-start mt-4">
                            <Ionicons name="information-circle-outline" size={24} color="#3B82F6" className="mr-3 mt-0.5" />
                            <Text className="text-blue-700 text-sm flex-1 leading-relaxed">
                                Student count and average rating will be initialized to 0 for new programmes.
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading || instructorsLoading}
                            className={`mt-6 py-4 rounded-full shadow-md ${ (loading || instructorsLoading) ? 'bg-gray-400' : 'bg-[#6D7E5E] hover:bg-[#5a6a4e]'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-center text-white text-lg font-semibold">Add Mentor Programme</Text>}
                        </TouchableOpacity>
                    </View>
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
}
