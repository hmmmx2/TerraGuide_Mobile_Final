import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '@/types/user';

interface RolePermissionBadgeProps {
    role: UserRole;
    showPermissions?: boolean;
}

export const RolePermissionBadge: React.FC<RolePermissionBadgeProps> = ({
                                                                            role,
                                                                            showPermissions = false
                                                                        }) => {
    const roleConfig = {
        admin: {
            color: 'text-red-800',
            bgColor: 'bg-red-100',
            borderColor: 'border-red-200',
            icon: 'shield-checkmark' as const,
            permissions: ['Full System Access', 'User Management', 'Content Management', 'System Settings']
        },
        controller: {
            color: 'text-blue-800',
            bgColor: 'bg-blue-100',
            borderColor: 'border-blue-200',
            icon: 'settings' as const,
            permissions: ['Dashboard Access', 'Database Management', 'Report Generation', 'User Monitoring']
        },
        user: {
            color: 'text-gray-800',
            bgColor: 'bg-gray-100',
            borderColor: 'border-gray-200',
            icon: 'person' as const,
            permissions: ['Course Access', 'Learning Materials', 'Profile Management', 'Basic Features']
        }
    };

    const config = roleConfig[role];

    return (
        <View>
            <View className={`px-3 py-2 rounded-lg border flex-row items-center ${config.bgColor} ${config.borderColor}`}>
                <Ionicons name={config.icon} size={14} color={config.color.replace('text-', '#')} />
                <Text className={`text-sm font-medium ml-2 capitalize ${config.color}`}>
                    {role}
                </Text>
            </View>

            {showPermissions && (
                <View className="mt-2">
                    <Text className="text-xs font-medium text-gray-600 mb-1">Permissions:</Text>
                    {config.permissions.map((permission, index) => (
                        <View key={index} className="flex-row items-center mb-1">
                            <View className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                            <Text className="text-xs text-gray-500">{permission}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};
