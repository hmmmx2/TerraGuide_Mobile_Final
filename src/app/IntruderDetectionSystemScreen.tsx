import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';
import { Container } from '@/components/Container';
import { supabase } from '@/lib/supabase';
import {AdminNavBar} from "@/components/AdminNavBar";

// Define the interface for an intruder detection event
interface IntruderDetectionEvent {
    id: string;
    title: string;
    detection_time: string;
    area: string;
    distance_cm: number;
    image_url: string | null;
}

// Custom Modal Component for Image Display
const ImageModal = ({ visible, imageUrl, onClose }: { visible: boolean; imageUrl: string | null; onClose: () => void }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white rounded-lg p-4 w-4/5 max-w-md">
                    <View className="flex-row justify-end mb-2">
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </Pressable>
                    </View>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            className="w-full h-64 rounded-lg"
                            resizeMode="contain"
                            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                        />
                    ) : (
                        <Text className="text-gray-600 text-center">No image available</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default function IntruderDetectionScreen() {
    const router = useRouter();
    const [events, setEvents] = useState<IntruderDetectionEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [showAll, setShowAll] = useState<boolean>(false);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('intruder_detection_events')
                    .select('*')
                    .order('detection_time', { ascending: false }); // Order by detection time, newest first

                if (error) {
                    throw error;
                }

                // Add a hardcoded "area" field to each event since it's not in the table
                const updatedData = (data || []).map(event => ({
                    ...event,
                    area: 'Park 1',
                }));

                setEvents(updatedData);
                console.log('Fetched events:', updatedData); // Debug log to check data
            } catch (err) {
                console.error('Error fetching intruder detection events:', err);
                setError('Failed to load intruder detection events.');
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const formatDetectionTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).replace(',', '').toLowerCase().replace(/\//g, '\/');
    };

    const handleItemPress = (imageUrl: string | null) => {
        setSelectedImageUrl(imageUrl);
        setModalVisible(true);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <Container className="py-6">
                    {/* Back Button with Sufficient Margin */}
                    <View className="mt-8 mb-4">
                        <BackButton color="#333" size={24} />
                    </View>

                    {/* Header Image Card */}
                    <View className="bg-[#6D7E5E] rounded-xl p-6 mb-4 items-center">
                        <Image
                            source={require('@assets/images/IntrusionDetectionSystem.png')}
                            className="w-32 h-32"
                            resizeMode="contain"
                        />
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-[#6D7E5E] mb-2">
                        Intrusion Detection System
                    </Text>

                    {/* Description */}
                    <View className="mb-6">
                        <Text className="text-sm text-gray-600 leading-relaxed">
                            This system enhances the protection of endangered plant species through constant surveillance and timely interventions, ensuring the preservation of biodiversity in protected areas.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-relaxed mt-2">
                            • Utilizes IoT sensors to monitor endangered species and trigger alerts for unauthorized activity, providing real-time updates for administrators.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-relaxed">
                            • Features an alarm system that detects unauthorized activities, such as flora and fauna poaching, and integrates with a mobile app or web platform for real-time monitoring.
                        </Text>
                    </View>

                    {/* Alert Section */}
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-lg font-semibold">Alert</Text>
                            <TouchableOpacity onPress={toggleShowAll}>
                                <Text className="text-[#4E6E4E]">{showAll ? 'See less' : 'See all'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="h-px bg-gray-300 mb-3" />
                        {!loading && !error && events.length === 0 && (
                            <Text className="text-gray-600 text-center py-4">No alerts found.</Text>
                        )}
                        {loading && (
                            <View className="flex-1 items-center justify-center py-4">
                                <ActivityIndicator size="large" color="#6D7E5E" />
                            </View>
                        )}
                        {error && <Text className="text-red-500 text-center py-4">{error}</Text>}
                        {!loading && !error && (showAll ? events : events.slice(0, 4)).map((event, index) => (
                            <View key={event.id}>
                                <TouchableOpacity
                                    onPress={() => handleItemPress(event.image_url)}
                                    className="rounded-lg p-3 flex-row items-center"
                                >
                                    <View className="bg-red-100 p-2 rounded-full mr-3">
                                        <FontAwesome5 name="exclamation-triangle" size={16} color="red" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-medium">{event.title}</Text>
                                        <Text className="text-xs text-gray-500">Date: {formatDetectionTime(event.detection_time)}</Text>
                                        <Text className="text-xs text-gray-500">
                                            Area: {event.area} | Distance: {event.distance_cm} cm
                                        </Text>
                                        <Text className="text-xs text-gray-400 italic mt-1">Tap to view intrusion image</Text>
                                    </View>
                                </TouchableOpacity>
                                {index < (showAll ? events.length : 4) - 1 && (
                                    <View className="h-px bg-gray-200 mx-3 my-1" />
                                )}
                            </View>
                        ))}
                    </View>
                </Container>
            </ScrollView>

            {/* Image Modal */}
            <ImageModal
                visible={modalVisible}
                imageUrl={selectedImageUrl}
                onClose={() => setModalVisible(false)}
            />

            {/* Bottom Navigation Bar */}
            <AdminNavBar activeRoute="/DashboardScreen" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
});