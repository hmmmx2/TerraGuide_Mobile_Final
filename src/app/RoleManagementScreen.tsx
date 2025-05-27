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
    Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminNavBar } from '@/components/AdminNavBar';
import { Container } from '@/components/Container';
import { useAuth } from '@/context/AuthProvider';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    designation: string;
    role: 'admin' | 'controller' | 'user';
    createdAt: string;
    updatedAt: string;
}

type UserRole = 'admin' | 'controller' | 'user';

const roleOptions: { label: string; value: UserRole }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Controller', value: 'controller' },
    { label: 'User', value: 'user' },
];

// Mock data - Replace with actual API calls
const mockUsers: User[] = [
    {
        id: '1',
        name: 'Timmy He',
        email: 'timmyhe@gmail.com',
        designation: 'Senior Manager',
        role: 'controller',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
    },
    {
        id: '2',
        name: 'Jimmy He',
        email: 'jimmyhe@gmail.com',
        designation: 'Manager',
        role: 'controller',
        createdAt: '2024-01-16',
        updatedAt: '2024-01-16'
    },
    {
        id: '3',
        name: 'Gimmy He',
        email: 'gimmyhe@gmail.com',
        designation: 'Business Analyst',
        role: 'admin',
        createdAt: '2024-01-17',
        updatedAt: '2024-01-17'
    },
    {
        id: '4',
        name: 'Alvin He',
        email: 'alvinhe@gmail.com',
        designation: 'Regional Developer',
        role: 'admin',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18'
    },
    {
        id: '5',
        name: 'Aaron He',
        email: 'aaronhe@gmail.com',
        designation: 'Senior Park Guide',
        role: 'admin',
        createdAt: '2024-01-19',
        updatedAt: '2024-01-19'
    },
    {
        id: '6',
        name: 'Timmy He',
        email: 'timmyhe@gmail.com',
        designation: 'Senior Park Guide',
        role: 'admin',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
    },
    // Add more users with 'user' role
    {
        id: '7',
        name: 'Timmy He',
        email: 'timmyhe@gmail.com',
        designation: '',
        role: 'user',
        createdAt: '2024-01-21',
        updatedAt: '2024-01-21'
    },
    {
        id: '8',
        name: 'Timmy He',
        email: 'timmyhe@gmail.com',
        designation: '',
        role: 'user',
        createdAt: '2024-01-22',
        updatedAt: '2024-01-22'
    },
];

export default function RoleManagementScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [userName, setUserName] = useState('Admin');
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        // Check user permissions
        if (session?.user) {
            const userMetadata = session.user.user_metadata;
            if (userMetadata) {
                setUserName(userMetadata.first_name || 'Admin');
                const role = userMetadata.role?.toString().trim().toLowerCase();
                setUserRole(role);

                if (role !== 'admin' && role !== 'controller') {
                    Alert.alert('Access Denied', 'You do not have permission to access this page.');
                    router.replace('/CourseScreen');
                    return;
                }
            }
        }
    }, [session, router]);

    useEffect(() => {
        // Filter users based on search query
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        if (userRole !== 'admin') {
            Alert.alert('Permission Denied', 'Only admins can change user roles.');
            return;
        }

        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, role: newRole, updatedAt: new Date().toISOString().split('T')[0] }
                    : user
            )
        );

        Alert.alert('Success', 'User role updated successfully!');
        setShowRoleModal(false);
        setSelectedUser(null);
    };

    const handleAddUser = () => {
        router.push('/AddNewUserScreen');
    };

    const handleDeleteUser = (userId: string) => {
        if (userRole !== 'admin') {
            Alert.alert('Permission Denied', 'Only admins can delete users.');
            return;
        }

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                        Alert.alert('Success', 'User deleted successfully!');
                    }
                }
            ]
        );
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

    const openRoleModal = (user: User) => {
        setSelectedUser(user);
        setShowRoleModal(true);
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

                    {/* Role Management Title */}
                    <View className="flex-row justify-between items-center mt-6 mb-4">
                        <Text className="text-2xl font-bold text-gray-800">Role Management</Text>
                        <TouchableOpacity
                            onPress={() => setIsEditing(!isEditing)}
                            className="px-4 py-2"
                        >
                            <Text className="text-[#4E6E4E] text-sm font-medium">
                                {isEditing ? 'Done' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar and Add User Button */}
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

                        {userRole === 'admin' && (
                            <TouchableOpacity
                                onPress={handleAddUser}
                                className="bg-[#6D7E5E] px-4 py-2 rounded-full flex-row items-center shadow-sm"
                            >
                                <Ionicons name="add" size={16} color="white" />
                                <Text className="text-white text-sm ml-1 font-medium">Add User</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Table Header */}
                    <View className="bg-[#E6ECD6] p-4 rounded-t-lg">
                        <View className="flex-row items-center">
                            <Text className="flex-1 font-semibold text-sm text-gray-700">User Name</Text>
                            <Text className="flex-1 font-semibold text-sm text-gray-700">Email Address</Text>
                            <Text className="flex-1 font-semibold text-sm text-gray-700">Designation</Text>
                            <Text className="w-24 font-semibold text-sm text-gray-700 text-center">Role</Text>
                            {isEditing && (
                                <Text className="w-16 font-semibold text-sm text-gray-700 text-center">Action</Text>
                            )}
                        </View>
                    </View>

                    {/* User List */}
                    <View className="bg-white rounded-b-lg shadow-sm">
                        {filteredUsers.map((user, index) => (
                            <View
                                key={user.id}
                                className={`p-4 ${index !== filteredUsers.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <View className="flex-row items-center">
                                    <Text className="flex-1 text-sm text-gray-800">{user.name}</Text>
                                    <Text className="flex-1 text-sm text-gray-600">{user.email}</Text>
                                    <Text className="flex-1 text-sm text-gray-600">{user.designation}</Text>

                                    <View className="w-24 items-center">
                                        <TouchableOpacity
                                            onPress={() => isEditing && userRole === 'admin' && openRoleModal(user)}
                                            disabled={!isEditing || userRole !== 'admin'}
                                        >
                                            <View className={`px-2 py-1 rounded-md ${getRoleColor(user.role)}`}>
                                                <Text className="text-xs font-medium capitalize">{user.role}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    {isEditing && userRole === 'admin' && (
                                        <View className="w-16 items-center">
                                            <TouchableOpacity
                                                onPress={() => handleDeleteUser(user.id)}
                                                className="p-1"
                                            >
                                                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    {filteredUsers.length === 0 && (
                        <View className="bg-white p-8 rounded-lg shadow-sm items-center">
                            <Text className="text-gray-500 text-center">No users found</Text>
                        </View>
                    )}
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
                        <Text className="text-lg font-bold text-center mb-4">Change Role</Text>
                        <Text className="text-sm text-gray-600 text-center mb-6">
                            Select a new role for {selectedUser?.name}
                        </Text>

                        {roleOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => selectedUser && handleRoleChange(selectedUser.id, option.value)}
                                className={`p-3 rounded-lg mb-2 ${
                                    selectedUser?.role === option.value
                                        ? 'bg-[#6D7E5E]'
                                        : 'bg-gray-100'
                                }`}
                            >
                                <Text className={`text-center font-medium ${
                                    selectedUser?.role === option.value
                                        ? 'text-white'
                                        : 'text-gray-800'
                                }`}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={() => setShowRoleModal(false)}
                            className="mt-4 p-3 border border-gray-300 rounded-lg"
                        >
                            <Text className="text-center text-gray-600 font-medium">Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            <AdminNavBar activeRoute="/RoleManagementScreen" />
        </SafeAreaView>
    );
}