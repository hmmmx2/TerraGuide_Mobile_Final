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
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import { Container } from '@/components/Container';

// Types
interface NewUser {
    name: string;
    email: string;
    designation: string;
    role: 'admin' | 'controller' | 'user';
}

type UserRole = 'admin' | 'controller' | 'user';

const roleOptions: { label: string; value: UserRole; description: string }[] = [
    {
        label: 'Admin',
        value: 'admin',
        description: 'Full access to all features and user management'
    },
    {
        label: 'Controller',
        value: 'controller',
        description: 'Access to dashboard and database management'
    },
    {
        label: 'User',
        value: 'user',
        description: 'Basic access to courses and learning materials'
    },
];

export default function AddNewUserScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [userRole, setUserRole] = useState<string>('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState<NewUser>({
        name: '',
        email: '',
        designation: '',
        role: 'user'
    });

    // Form validation errors
    const [errors, setErrors] = useState<Partial<NewUser>>({});

    useEffect(() => {
        // Check user permissions
        if (session?.user) {
            const userMetadata = session.user.user_metadata;
            if (userMetadata) {
                const role = userMetadata.role?.toString().trim().toLowerCase();
                setUserRole(role);

                if (role !== 'admin') {
                    Alert.alert('Access Denied', 'Only admins can add new users.');
                    router.back();
                    return;
                }
            }
        }
    }, [session, router]);

    const validateForm = (): boolean => {
        const newErrors: Partial<NewUser> = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Designation validation (optional for users)
        if (formData.role !== 'user' && !formData.designation.trim()) {
            newErrors.designation = 'Designation is required for admin and controller roles';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof NewUser, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleRoleSelect = (role: UserRole) => {
        setFormData(prev => ({ ...prev, role }));
        setShowRoleModal(false);

        // Clear designation if switching to user role
        if (role === 'user') {
            setFormData(prev => ({ ...prev, designation: '' }));
        }
    };

    const handleSaveUser = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please correct the errors and try again.');
            return;
        }

        setLoading(true);

        try {
            // In a real app, this would be an API call
            console.log('Saving new user:', formData);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            Alert.alert(
                'Success',
                'User has been added successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Error saving user:', error);
            Alert.alert('Error', 'Failed to add user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'controller':
                return 'bg-blue-100 text-blue-800';
            case 'user':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View className="flex-row items-center px-4 pt-12 pb-4 bg-white shadow-sm">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3"
                    >
                        <Ionicons name="arrow-back" size={20} color="#4E6E4E" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800 flex-1">Add New User</Text>
                </View>

                <ScrollView className="flex-1">
                    <Container className="py-6">
                        {/* User Information Form */}
                        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">User Information</Text>

                            {/* Name Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Full Name <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    value={formData.name}
                                    onChangeText={(value) => handleInputChange('name', value)}
                                    placeholder="Enter full name"
                                    className={`border rounded-lg px-3 py-3 text-sm ${
                                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                    }`}
                                    placeholderTextColor="#9CA3AF"
                                />
                                {errors.name && (
                                    <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
                                )}
                            </View>

                            {/* Email Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Email Address <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    placeholder="Enter email address"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className={`border rounded-lg px-3 py-3 text-sm ${
                                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                    }`}
                                    placeholderTextColor="#9CA3AF"
                                />
                                {errors.email && (
                                    <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
                                )}
                            </View>

                            {/* Designation Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Designation {formData.role !== 'user' && <Text className="text-red-500">*</Text>}
                                </Text>
                                <TextInput
                                    value={formData.designation}
                                    onChangeText={(value) => handleInputChange('designation', value)}
                                    placeholder={formData.role === 'user' ? 'Optional' : 'Enter designation'}
                                    className={`border rounded-lg px-3 py-3 text-sm ${
                                        errors.designation ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                    }`}
                                    placeholderTextColor="#9CA3AF"
                                />
                                {errors.designation && (
                                    <Text className="text-red-500 text-xs mt-1">{errors.designation}</Text>
                                )}
                            </View>

                            {/* Role Selection */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Role <Text className="text-red-500">*</Text>
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowRoleModal(true)}
                                    className="border border-gray-300 rounded-lg px-3 py-3 bg-gray-50 flex-row items-center justify-between"
                                >
                                    <View className="flex-row items-center">
                                        <View className={`px-2 py-1 rounded-md mr-3 ${getRoleColor(formData.role)}`}>
                                            <Text className="text-xs font-medium capitalize">{formData.role}</Text>
                                        </View>
                                        <Text className="text-sm text-gray-600">
                                            {roleOptions.find(option => option.value === formData.role)?.label}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>

                            {/* Role Description */}
                            <View className="bg-blue-50 p-3 rounded-lg">
                                <Text className="text-xs text-blue-800 font-medium mb-1">Role Description:</Text>
                                <Text className="text-xs text-blue-700">
                                    {roleOptions.find(option => option.value === formData.role)?.description}
                                </Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row space-x-3">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="flex-1 bg-gray-100 py-4 rounded-lg"
                            >
                                <Text className="text-center text-gray-700 font-medium">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSaveUser}
                                disabled={loading}
                                className="flex-1 bg-[#6D7E5E] py-4 rounded-lg"
                            >
                                <Text className="text-center text-white font-medium">
                                    {loading ? 'Saving...' : 'Save User'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Container>
                </ScrollView>

                {/* Role Selection Modal */}
                <Modal
                    visible={showRoleModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowRoleModal(false)}
                >
                    <Pressable
                        className="flex-1 bg-black bg-opacity-50 justify-center items-center"
                        onPress={() => setShowRoleModal(false)}
                    >
                        <Pressable className="bg-white rounded-lg p-6 w-80 max-w-[90%]">
                            <Text className="text-lg font-bold text-center mb-4">Select Role</Text>

                            {roleOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => handleRoleSelect(option.value)}
                                    className={`p-4 rounded-lg mb-3 border ${
                                        formData.role === option.value
                                            ? 'bg-[#6D7E5E] border-[#6D7E5E]'
                                            : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className={`font-medium ${
                                            formData.role === option.value
                                                ? 'text-white'
                                                : 'text-gray-800'
                                        }`}>
                                            {option.label}
                                        </Text>
                                        {formData.role === option.value && (
                                            <Ionicons name="checkmark" size={16} color="white" />
                                        )}
                                    </View>
                                    <Text className={`text-xs ${
                                        formData.role === option.value
                                            ? 'text-gray-200'
                                            : 'text-gray-600'
                                    }`}>
                                        {option.description}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                onPress={() => setShowRoleModal(false)}
                                className="mt-2 p-3 border border-gray-300 rounded-lg"
                            >
                                <Text className="text-center text-gray-600 font-medium">Cancel</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </Pressable>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}