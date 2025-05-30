// src/app/AddMentorProgrammeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Container } from '@/components/Container';
import BackButton from '@/components/BackButton';
import { supabase } from '@/lib/supabase';
// Assuming Instructor type is simple like this for the dropdown:
interface InstructorForDropdown {
    id: number;
    name: string;
    title?: string;
}

export default function AddMentorProgrammeScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [instructorsLoading, setInstructorsLoading] = useState(true);

    const [formData, setFormData] = useState({
        programName: '',
        description: '',
        imageUrl: '',
        instructorId: '', // Will be string from selection, parse to int
        fees: '',
        duration: '' // duration_hours
    });

    const [instructors, setInstructors] = useState<InstructorForDropdown[]>([]);
    const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<InstructorForDropdown | null>(null);

    const fetchInstructors = useCallback(async () => { /* ... same as your provided, good ... */
        setInstructorsLoading(true);
        try {
            const { data, error } = await supabase.from('instructors').select('id, name, title').order('name');
            if (error) throw error;
            setInstructors(data || []);
        } catch (error) { console.error('Error fetching instructors:', error); Alert.alert('Error', 'Failed to load instructors.'); }
        finally { setInstructorsLoading(false); }
    }, []);

    useEffect(() => { fetchInstructors(); }, [fetchInstructors]);

    const handleInputChange = (field: string, value: string) => { /* ... same ... */ };
    const handleInstructorSelect = (instructor: InstructorForDropdown) => { /* ... same ... */ };
    const validateForm = () => { /* ... same ... ensure validation is robust ... */ return true; };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            // Data to insert, aligning with MentorProgram type structure as much as possible for DB columns
            // instructor_name, instructor_image_url are derived/joined, not directly inserted here.
            // created_at is handled by DB.
            const programData = {
                program_name: formData.programName.trim(),
                description: formData.description.trim(),
                image_url: formData.imageUrl.trim() || null, // Ensure null if empty for string | null type
                instructor_id: parseInt(formData.instructorId, 10),
                fees: parseFloat(formData.fees),
                duration_hours: parseFloat(formData.duration),
                student_count: 0,      // Default
                average_rating: 0.0,   // Default
                // reviews_count: 0, // Not in MentorProgram type
            };

            const { error } = await supabase.from('mentor_programs').insert([programData]);
            if (error) throw error;

            Alert.alert('Success', 'Mentor programme added!', [{ text: 'OK', onPress: () => router.back() }]);
        } catch (error) {
            console.error('Error adding mentor program:', error);
            Alert.alert('Error', 'Failed to add. ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // ... JSX remains largely the same, ensure TextInput for fees/duration uses keyboardType="numeric" ...
    // ... The rest of your AddMentorProgrammeScreen.tsx JSX ...
    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                <Container className="pt-12 pb-6">
                    <View className="flex-row items-center mb-8">
                        <BackButton />
                        <Text className="text-2xl font-bold text-gray-800 ml-4">Add Mentor Programme</Text>
                    </View>
                    {/* ... Form JSX from your provided code, ensuring all fields are present ... */}
                    <View className="space-y-5">
                        {/* Program Name */}
                        <View><Text className="text-base font-medium text-gray-700 mb-1.5">Programme Name <Text className="text-red-500">*</Text></Text><TextInput value={formData.programName} onChangeText={(v) => handleInputChange('programName', v)} placeholder="e.g., Advanced Guide Training" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800" placeholderTextColor="#9CA3AF" /></View>
                        {/* Description */}
                        <View><Text className="text-base font-medium text-gray-700 mb-1.5">Description <Text className="text-red-500">*</Text></Text><TextInput value={formData.description} onChangeText={(v) => handleInputChange('description', v)} placeholder="Detailed description..." multiline numberOfLines={4} className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 h-28" placeholderTextColor="#9CA3AF" textAlignVertical="top" /></View>
                        {/* Image URL */}
                        <View><Text className="text-base font-medium text-gray-700 mb-1.5">Image URL</Text><TextInput value={formData.imageUrl} onChangeText={(v) => handleInputChange('imageUrl', v)} placeholder="https://example.com/image.png" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800" placeholderTextColor="#9CA3AF" keyboardType="url" autoCapitalize="none" /></View>
                        {/* Instructor Dropdown */}
                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-1.5">Instructor <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity onPress={() => setShowInstructorDropdown(!showInstructorDropdown)} className="bg-white border border-gray-300 rounded-lg px-4 py-3.5 flex-row justify-between items-center" disabled={instructorsLoading}>
                                <Text className={`text-base ${selectedInstructor ? 'text-gray-800' : 'text-gray-500'}`}>{instructorsLoading ? 'Loading...' : selectedInstructor ? selectedInstructor.name : 'Select instructor'}</Text>
                                <Ionicons name={showInstructorDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
                            </TouchableOpacity>
                            {showInstructorDropdown && !instructorsLoading && (
                                <View className="bg-white border border-gray-300 rounded-lg mt-1 max-h-48 shadow-lg z-10"><ScrollView nestedScrollEnabled>
                                    {instructors.length > 0 ? instructors.map((inst) => (
                                        <TouchableOpacity key={inst.id} onPress={() => handleInstructorSelect(inst)} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                                            <Text className="text-base text-gray-800">{inst.name}</Text>
                                            {inst.title && <Text className="text-sm text-gray-500 mt-0.5">{inst.title}</Text>}
                                        </TouchableOpacity>
                                    )) : <Text className="p-4 text-gray-500">No instructors.</Text>}
                                </ScrollView></View>
                            )}
                        </View>
                        {/* Fees and Duration */}
                        <View className="flex-row space-x-4">
                            <View className="flex-1"><Text className="text-base font-medium text-gray-700 mb-1.5">Fees (RM) <Text className="text-red-500">*</Text></Text><TextInput value={formData.fees} onChangeText={(v) => handleInputChange('fees', v)} placeholder="e.g., 150" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800" placeholderTextColor="#9CA3AF" keyboardType="numeric" /></View>
                            <View className="flex-1"><Text className="text-base font-medium text-gray-700 mb-1.5">Duration (hours) <Text className="text-red-500">*</Text></Text><TextInput value={formData.duration} onChangeText={(v) => handleInputChange('duration', v)} placeholder="e.g., 10" className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800" placeholderTextColor="#9CA3AF" keyboardType="numeric" /></View>
                        </View>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading || instructorsLoading} className={`mt-6 py-4 rounded-full shadow-md ${ (loading || instructorsLoading) ? 'bg-gray-400' : 'bg-[#6D7E5E] hover:bg-[#5a6a4e]'}`}>
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-center text-white text-lg font-semibold">Add Mentor Programme</Text>}
                        </TouchableOpacity>
                    </View>
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
}