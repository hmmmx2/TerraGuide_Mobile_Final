import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import BackButton from '@/components/BackButton';
import { Container } from '@/components/Container';

// Define the notification interface
interface Notification {
    id: string;
    date: string;
    title: string;
    description: string;
    isRead?: boolean;
}

const NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        date: 'Today',
        title: 'Certified as Park Guide',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        isRead: false,
    },
    {
        id: '2',
        date: 'Today',
        title: 'Completed Introduction to Park Guide',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        isRead: false,
    },
    {
        id: '3',
        date: 'Today',
        title: 'Completed Advanced Park Guiding',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        isRead: false,
    },
    {
        id: '4',
        date: 'Today',
        title: 'Continue Introduction to Park Guide',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        isRead: false,
    },
    {
        id: '5',
        date: 'Yesterday',
        title: 'Certified',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        isRead: false,
    },
    {
        id: '6',
        date: 'Yesterday',
        title: 'Certified',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        isRead: false,
    },
    {
        id: '7',
        date: 'Yesterday',
        title: 'Certified',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        isRead: false,
    },
    {
        id: '8',
        date: 'Yesterday',
        title: 'Certified',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        isRead: false,
    },
];

// Define props for Container (if not already defined in @/components/Container)
interface ContainerProps {
    className?: string;
    children: React.ReactNode;
}

export default function NotificationScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const isLoggedIn: boolean = !!session?.user;
    const userRole: string = isLoggedIn ? session?.user.user_metadata?.role?.toString().trim().toLowerCase() : 'guest';

    // Group notifications by date
    const groupedNotifications = NOTIFICATIONS.reduce((acc, notification) => {
        acc[notification.date] = acc[notification.date] || [];
        acc[notification.date].push(notification);
        return acc;
    }, {} as Record<string, Notification[]>);

    console.log('Rendering NotificationScreen header with BackButton and spacer');

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <Container className="py-6">
                    <View className="mt-8 mb-4 flex-row items-center justify-between">
                        <BackButton
                            color="#6D7E5E"
                            size={24}
                            style={{ marginRight: 16 }} // Margin to space it from the title
                        />
                        <Text className="text-2xl font-bold text-[#6D7E5E] flex-1 text-center">
                            Notification
                        </Text>
                        <View style={{ width: 24, marginLeft: 16 }} /> {/* Balancing spacer */}
                    </View>
                    <View className="h-px bg-gray-300 w-full mb-4" />
                    {Object.keys(groupedNotifications).map((date) => (
                        <View key={date} className="mb-6">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-lg font-semibold text-gray-700">{date}</Text>
                                <TouchableOpacity>
                                    <Text className="text-sm text-blue-500">Mark all as read</Text>
                                </TouchableOpacity>
                            </View>
                            {groupedNotifications[date].map((notification) => (
                                <View
                                    key={notification.id}
                                    className={`flex-row items-start p-4 mb-2 bg-white rounded-lg shadow-sm border border-gray-100 ${
                                        !notification.isRead ? 'border-l-4 border-[#6D7E5E]' : ''
                                    }`}
                                >
                                    <View className="w-10 h-10 bg-[#DDE8D0] rounded-full flex items-center justify-center mr-3">
                                        <Text className="text-[#6D7E5E] text-xl">🔔</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-base font-medium text-gray-800">{notification.title}</Text>
                                        <Text className="text-sm text-gray-600">{notification.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
}