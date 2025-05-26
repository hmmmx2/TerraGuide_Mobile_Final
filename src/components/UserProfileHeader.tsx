import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SearchIcon } from './icons/SearchIcon';
import { NotificationIcon } from './icons/NotificationIcon';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';

type UserHeaderProps = {
    isLoggedIn?: boolean;
    onNotificationPress?: () => void;
};

async function fetchAvatarFromStorage(userId: string): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .storage
            .from('avatar-images')
            .list(`parkguides/${userId}`);

        if (error) {
            console.error('File: UserProfileHeader, Function: fetchAvatarFromStorage, Error:', error.message);
            return null;
        }

        if (data && data.length > 0) {
            const avatarFile = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
            const { data: urlData } = supabase
                .storage
                .from('avatar-images')
                .getPublicUrl(`parkguides/${userId}/${avatarFile.name}`);
            const avatarUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
            console.log('Fetched avatar from storage:', avatarUrl);
            return avatarUrl;
        }
        console.log('No avatar files found in storage for user:', userId);
        return null;
    } catch (error: any) {
        console.error('File: UserProfileHeader, Function: fetchAvatarFromStorage, Unexpected error:', error.message);
        return null;
    }
}

export function UserProfileHeader({
                                      isLoggedIn: propIsLoggedIn = false,
                                      onNotificationPress = () => console.log('Notification pressed'),
                                  }: UserHeaderProps) {
    const router = useRouter();
    const { session } = useAuth();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isParkGuide, setIsParkGuide] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('Guest');

    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user) {
                const { data: guideData, error: guideError } = await supabase
                    .from('park_guides')
                    .select('avatar_url, username')
                    .eq('supabase_uid', session.user.id)
                    .single();

                if (guideError && guideError.code !== 'PGRST116') {
                    console.error('File: UserProfileHeader, Function: fetchUserData, Guide Error:', guideError.message);
                    return;
                }

                if (guideData) {
                    setIsParkGuide(true);
                    let username = guideData.username || session.user.user_metadata?.username || '';
                    if (username.includes('_')) {
                        username = username.replace(/_/g, ' ');
                    }
                    setDisplayName(username || session.user.id.slice(-4));
                    let avatar = guideData.avatar_url && guideData.avatar_url.startsWith('https://')
                        ? guideData.avatar_url
                        : await fetchAvatarFromStorage(session.user.id);
                    setAvatarUrl(avatar);
                } else {
                    setIsParkGuide(false);
                    let username = session.user.user_metadata?.username || '';
                    if (username.includes('_')) {
                        username = username.replace(/_/g, ' ');
                    }
                    setDisplayName(username || 'Guest');
                    setAvatarUrl(null);
                }
            } else {
                setIsParkGuide(false);
                setDisplayName('Guest');
                setAvatarUrl(null);
            }
        };

        fetchUserData();
    }, [session]);

    const finalIsLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : !!session?.user;
    const finalAvatar = avatarUrl ? { uri: avatarUrl } : require('@assets/images/Guest-Profile.png');

    const handleSearchPress = () => {
        router.push('/SearchScreen');
    };

    const handleQRCodePress = () => {
        console.log('QR Code pressed');
    };

    return (
        <View className="flex-row items-center justify-between w-full mt-10">
            <View className="flex-row items-center">
                <Image
                    source={finalAvatar}
                    className="w-12 h-12 rounded-full"
                />
                <View className="ml-3">
                    <Text className="text-custom-darkgreen text-xs">Welcome back</Text>
                    <Text className="text-custom-darkgray font-bold text-lg">{displayName}</Text>
                </View>
            </View>
            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={handleSearchPress}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                >
                    <SearchIcon color="#868795" size={18} />
                </TouchableOpacity>
                {!finalIsLoggedIn ? (
                    <TouchableOpacity
                        onPress={handleQRCodePress}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    >
                        <Ionicons name="qr-code-outline" size={18} color="#868795" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={onNotificationPress}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    >
                        <NotificationIcon size={18} color="#868795" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}