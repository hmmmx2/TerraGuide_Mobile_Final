import React, { ReactNode } from 'react';
import { View } from 'react-native';

type ContainerProps = {
    children: ReactNode;
    className?: string;
};

export function Container({ children, className = '' }: ContainerProps) {
    return (
        <View className={`mx-[5%] ${className}`}>
            {children}
        </View>
    );
}