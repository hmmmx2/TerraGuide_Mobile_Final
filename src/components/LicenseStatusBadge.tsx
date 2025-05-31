import React from 'react';
import { View, Text } from 'react-native';
import { getLicenseStatusColor } from '@/utils/licenseManagementUtils';

interface LicenseStatusBadgeProps {
    status: string;
    size?: 'sm' | 'md' | 'lg';
}

export const LicenseStatusBadge: React.FC<LicenseStatusBadgeProps> = ({
                                                                          status,
                                                                          size = 'sm'
                                                                      }) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'lg':
                return 'px-3 py-2 text-sm';
            case 'md':
                return 'px-2 py-1 text-xs';
            case 'sm':
            default:
                return 'px-1 py-1 text-xs';
        }
    };

    return (
        <View className={`rounded-md border ${getLicenseStatusColor(status)} ${getSizeClasses()}`}>
            <Text className={`font-medium text-center ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
                {status}
            </Text>
        </View>
    );
};