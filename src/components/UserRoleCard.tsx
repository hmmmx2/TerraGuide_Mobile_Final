import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, UserRole } from '@/types/user';

interface UserRoleCardProps {
    user: User;
    isEditing: boolean;
    canEdit: boolean;
    onRolePress: (user: User) => void;
    onDeletePress: (userId: string) => void;
}

export const UserRoleCard: React.FC<UserRoleCardProps> = ({
                                                              user,
                                                              isEditing,
                                                              canEdit,
                                                              onRolePress,
                                                              onDeletePress
                                                          }) => {
    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'controller':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'user':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'shield-checkmark';
            case 'controller':
                return 'settings';
            case 'user':
                return 'person';
            default:
                return 'person';
        }
    };

    return (
        <View className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100">
            <View className="flex-row items-center justify-between">
                {/* User Info */}
                <View className="flex-1 mr-4">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-base font-semibold text-gray-800 mr-2">
                            {user.name}
                        </Text>
                        {user.isActive && (
                            <View className="w-2 h-2 bg-green-400 rounded-full" />
                        )}
                    </View>

                    <Text className="text-sm text-gray-600 mb-1">{user.email}</Text>

                    {user.designation && (
                        <Text className="text-xs text-gray-500 mb-2">{user.designation}</Text>
                    )}

                    {user.lastLogin && (
                        <Text className="text-xs text-gray-400">
                            Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        </Text>
                    )}
                </View>

                {/* Role and Actions */}
                <View className="items-end">
                    <TouchableOpacity
                        onPress={() => isEditing && canEdit && onRolePress(user)}
                        disabled={!isEditing || !canEdit}
                        className="mb-2"
                    >
                        <View className={`px-3 py-2 rounded-lg border flex-row items-center ${getRoleColor(user.role)}`}>
                            <Ionicons
                                name={getRoleIcon(user.role) as any}
                                size={12}
                                color={user.role === 'admin' ? '#dc2626' : user.role === 'controller' ? '#2563eb' : '#374151'}
                            />
                            <Text className="text-xs font-medium ml-1 capitalize">
                                {user.role}
                            </Text>
                            {isEditing && canEdit && (
                                <Ionicons name="chevron-down" size={12} color="#9CA3AF" className="ml-1" />
                            )}
                        </View>
                    </TouchableOpacity>

                    {isEditing && canEdit && (
                        <TouchableOpacity
                            onPress={() => onDeletePress(user.id)}
                            className="p-2 rounded-full bg-red-50"
                        >
                            <Ionicons name="trash-outline" size={14} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};