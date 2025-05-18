import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/BackButton';
import { useVideoPlayer, VideoView } from 'expo-video';
import { supabase } from '@/lib/supabase';

const VideoLessonScreen = () => {
    const router = useRouter();
    const { lessonData } = useLocalSearchParams<{ lessonData: string }>();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const lesson = lessonData ? JSON.parse(decodeURIComponent(lessonData)) : null;

    useEffect(() => {
        async function fetchVideo() {
            if (!lesson) return;

            try {
                setLoading(true);

                // Determine which video to fetch based on lesson ID or other property
                const videoFileName = lesson.id === 1 ? 'placeholderVideo.mp4' : 'placeholderVideo2.mp4';

                // Get the public URL for the video
                const { data } = await supabase.storage.from('videos').getPublicUrl(videoFileName);

                if (data && data.publicUrl) {
                    setVideoUrl(data.publicUrl);
                } else {
                    setError('Video not found');
                }
            } catch (err) {
                console.error('Error fetching video:', err);
                setError('Failed to load video');
            } finally {
                setLoading(false);
            }
        }

        fetchVideo();
    }, [lesson]);

    // Initialize the video player
    const player = useVideoPlayer(videoUrl || '', (playerInstance) => {
        playerInstance.loop = false;
        playerInstance.timeUpdateEventInterval = 1; // Trigger timeUpdate every second
    });

    // Handle video playback status updates
    useEffect(() => {
        if (!player) return;

        const handleTimeUpdate = (payload: { currentTime: number }) => {
            // Get duration directly from the player instance
            const duration = player.duration;
            
            // Check if video has completed (currentTime is close to duration)
            if (duration > 0 && payload.currentTime >= duration - 0.5 && !isCompleted) {
                handleVideoCompletion();
            }
        };

        player.addListener('timeUpdate', handleTimeUpdate);

        return () => {
            player.removeListener('timeUpdate', handleTimeUpdate);
        };
    }, [player, isCompleted]);

    // Mark the lesson as completed when video finishes
    const handleVideoCompletion = async () => {
        setIsCompleted(true);

        // Here you would typically update your database to mark the lesson as completed
        // For now, we'll just show a completion message and navigate back after a delay
        setTimeout(() => {
            router.back();
        }, 1500);
    };

    if (!lesson) {
        return (
            <SafeAreaView className="flex-1 bg-[#F2F7F2] justify-center items-center">
                <Text>Lesson data not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-[#6D7E5E]">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F2F7F2]">
            <ScrollView className="flex-1">
                <View className="py-8">
                    <View className="mb-3 mt-7 px-4">
                        <BackButton />
                    </View>

                    {/* Video Player */}
                    <View className="w-full aspect-video relative mb-4">
                        {loading ? (
                            <View className="w-full h-full bg-gray-200 items-center justify-center">
                                <ActivityIndicator size="large" color="#6D7E5E" />
                            </View>
                        ) : error ? (
                            <View className="w-full h-full bg-gray-200 items-center justify-center">
                                <Text className="text-red-500">{error}</Text>
                            </View>
                        ) : videoUrl ? (
                            <VideoView
                                style={{ width: Dimensions.get('window').width, height: 200 }}
                                player={player}
                            />
                        ) : (
                            <View className="w-full h-full bg-gray-200 items-center justify-center">
                                <Text>No video available</Text>
                            </View>
                        )}
                    </View>

                    <View className="px-4">
                        <Text className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</Text>
                        <Text className="text-gray-600 mb-4">{lesson.duration} mins</Text>

                        <Text className="text-lg font-semibold mb-2">Description:</Text>
                        <Text className="text-gray-700 mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
                        </Text>

                        {isCompleted && (
                            <View className="bg-[#E6ECD6] p-4 rounded-lg mb-10">
                                <Text className="text-[#4E6E4E] text-center font-semibold">
                                    Lesson completed! Returning to course...
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default VideoLessonScreen;