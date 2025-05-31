import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import BackButton from '@/components/BackButton';
import { Container } from '@/components/Container';
import { supabase } from '@/lib/supabase';

// Define the notification interface based on Supabase table structure
interface Notification {
    id: string;
    parkguide_id: string;
    title: string;
    description: string;
    created_at: string;
    is_read: boolean;
    notification_type: string;
    related_id: string | null;
    supabase_uid: string | null;
    date: string; // Formatted date for UI grouping
}

// Define props for Container
interface ContainerProps {
    className?: string;
    children: React.ReactNode;
}

export default function NotificationScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const isLoggedIn: boolean = !!session?.user;
    const userRole: string = isLoggedIn ? session?.user.user_metadata?.role?.toString().trim().toLowerCase() : 'guest';
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch notifications and set up real-time subscription
    useEffect(() => {
        if (!isLoggedIn || userRole !== 'parkguide') {
            Alert.alert('Access Denied', 'Only park guides can view notifications.');
            router.replace('/CourseScreen');
            return;
        }

        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // Step 1: Get user_id from users table using supabase_uid
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('supabase_uid', session?.user.id)
                    .single();

                if (userError || !user) {
                    console.error('User fetch error:', userError);
                    throw new Error('Failed to fetch user data from users table.');
                }

                // Step 2: Get parkguide_id from park_guides using user_id
                const { data: parkGuide, error: parkGuideError } = await supabase
                    .from('park_guides')
                    .select('user_id')
                    .eq('user_id', user.id)
                    .single();

                if (parkGuideError || !parkGuide) {
                    console.error('Park guide fetch error:', parkGuideError);
                    throw new Error('Failed to fetch park guide data from park_guides table.');
                }

                // Step 3: Fetch notifications for parkguide_id
                const { data, error } = await supabase
                    .from('notifications')
                    .select(`
                        id,
                        parkguide_id,
                        title,
                        description,
                        created_at,
                        is_read,
                        notification_type,
                        related_id,
                        supabase_uid
                    `)
                    .eq('parkguide_id', parkGuide.user_id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Notifications fetch error:', error);
                    throw error;
                }

                const formattedNotifications: Notification[] = data.map(item => ({
                    id: item.id,
                    parkguide_id: item.parkguide_id,
                    title: item.title,
                    description: item.description,
                    created_at: item.created_at,
                    is_read: item.is_read,
                    notification_type: item.notification_type,
                    related_id: item.related_id,
                    supabase_uid: item.supabase_uid,
                    date: formatDate(item.created_at)
                }));

                setNotifications(formattedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error.message);
                Alert.alert('Error', error.message || 'Failed to load notifications.');
            } finally {
                setLoading(false);
            }
        };

        // Format date for grouping (e.g., "Today", "Yesterday", or specific date)
        const formatDate = (createdAt: string): string => {
            const date = new Date(createdAt);
            const today = new Date('2025-05-28T06:51:00+08:00'); // Use provided current date
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            if (isSameDay(date, today)) return 'Today';
            if (isSameDay(date, yesterday)) return 'Yesterday';
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        };

        const isSameDay = (date1: Date, date2: Date): boolean => {
            return (
                date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear()
            );
        };

        fetchNotifications();

        // Real-time subscription for new notifications
        const subscription = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `parkguide_id=eq.${session?.user.id}`
                },
                (payload) => {
                    console.log('New notification received:', payload);
                    const newNotification: Notification = {
                        id: payload.new.id,
                        parkguide_id: payload.new.parkguide_id,
                        title: payload.new.title,
                        description: payload.new.description,
                        created_at: payload.new.created_at,
                        is_read: payload.new.is_read,
                        notification_type: payload.new.notification_type,
                        related_id: payload.new.related_id,
                        supabase_uid: payload.new.supabase_uid,
                        date: formatDate(payload.new.created_at)
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [isLoggedIn, userRole, session, router]);

    // Group notifications by date
    const groupedNotifications = notifications.reduce((acc, notification) => {
        acc[notification.date] = acc[notification.date] || [];
        acc[notification.date].push(notification);
        return acc;
    }, {} as Record<string, Notification[]>);

    // Mark all notifications for a specific date as read
    const handleMarkAllAsRead = async (date: string) => {
        try {
            const notificationIds = groupedNotifications[date]
                .filter(n => !n.is_read)
                .map(n => n.id);

            if (notificationIds.length === 0) return;

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .in('id', notificationIds);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n =>
                    notificationIds.includes(n.id) ? { ...n, is_read: true } : n
                )
            );
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            Alert.alert('Error', 'Failed to mark notifications as read.');
        }
    };

    // Mark a single notification as read
    const handleMarkAsRead = async (notificationId: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, is_read: true } : n
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            Alert.alert('Error', 'Failed to mark notification as read.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#F8F9FA] justify-center items-center">
                <Text className="text-lg text-gray-700">Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <Container className="py-6">
                    <View className="mt-8 mb-4 flex-row items-center justify-between">
                        <BackButton
                            color="#6D7E5E"
                            size={24}
                            style={{ marginRight: 16 }}
                        />
                        <Text className="text-2xl font-bold text-[#6D7E5E] flex-1 text-center">
                            Notification
                        </Text>
                        <View style={{ width: 24, marginLeft: 16 }} />
                    </View>
                    <View className="h-px bg-gray-300 w-full mb-4" />
                    {Object.keys(groupedNotifications).length === 0 ? (
                        <Text className="text-center text-gray-600 mt-4">No notifications found.</Text>
                    ) : (
                        Object.keys(groupedNotifications).map((date) => (
                            <View key={date} className="mb-6">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-lg font-semibold text-gray-700">{date}</Text>
                                    <TouchableOpacity onPress={() => handleMarkAllAsRead(date)}>
                                        <Text className="text-sm text-blue-500">Mark all as read</Text>
                                    </TouchableOpacity>
                                </View>
                                {groupedNotifications[date].map((notification) => (
                                    <TouchableOpacity
                                        key={notification.id}
                                        onPress={() => !notification.is_read && handleMarkAsRead(notification.id)}
                                    >
                                        <View
                                            className={`flex-row items-start p-4 mb-2 bg-white rounded-lg shadow-sm border border-gray-100 ${
                                                !notification.is_read ? 'border-l-4 border-[#6D7E5E]' : ''
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
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))
                    )}
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
}