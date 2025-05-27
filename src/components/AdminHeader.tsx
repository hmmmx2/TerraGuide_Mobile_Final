import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import { NotificationIcon } from './icons/NotificationIcon';
import DextAIIcon from '../../assets/icons/artificial-intelligence-dark.svg';
import FilledDextAIIcon from '../../assets/icons/artificial-intelligence-filled-header.svg';

// Define the type for SVG components
type SvgComponent = React.FC<React.SVGProps<SVGSVGElement> & { width?: number | string; height?: number | string }>;

type AdminHeaderProps = {
    username?: string;
    avatarImg?: any;
    onDextAIPress?: () => void;
    onNotificationPress?: () => void;
    onMenuPress?: () => void;
};

export function AdminHeader({
                                username = 'Admin',
                                avatarImg = require('@assets/images/profile_pic.jpg'),
                                onDextAIPress = () => console.log('DextAI pressed'),
                                onNotificationPress = () => console.log('Notification pressed'),
                                onMenuPress,
                            }: AdminHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { signOut, session } = useAuth();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [buttonHeight, setButtonHeight] = useState(40); // Default height
    const buttonRef = useRef<View>(null);

    // Define the cycle of screens and their corresponding icons
    const screenCycle: { route: string; icon: SvgComponent }[] = [
        { route: '/DashboardScreen', icon: DextAIIcon },
        { route: '/AdminDextAIScreen', icon: FilledDextAIIcon },
    ];
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

    // Update currentScreenIndex based on the current pathname
    useEffect(() => {
        const currentIndex = screenCycle.findIndex(item => item.route === pathname);
        if (currentIndex !== -1) {
            setCurrentScreenIndex(currentIndex);
        }
    }, [pathname]);

    const toggleMenu = () => {
        console.log('File: AdminHeader, Function: toggleMenu, Menu visibility:', !isMenuVisible);
        setIsMenuVisible(!isMenuVisible);
        if (onMenuPress) {
            onMenuPress();
        }
    };

    const handleLogout = async () => {
        try {
            console.log('File: AdminHeader, Function: handleLogout, Initiating logout, Session:', !!session);
            await signOut(router);
            console.log('File: AdminHeader, Function: handleLogout, Logout completed');
        } catch (error: any) {
            console.error('File: AdminHeader, Function: handleLogout, Error:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
            });
            // Optionally show a toast here if AuthProvider's toast isn't sufficient
        }
    };

    const handleButtonLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        console.log('File: AdminHeader, Function: handleButtonLayout, Button height:', height);
        setButtonHeight(height);
    };

    const handleDextAIPress = () => {
        console.log('File: AdminHeader, Function: handleDextAIPress, DextAI pressed');
        const nextIndex = (currentScreenIndex + 1) % screenCycle.length; // Toggle between 0 and 1
        setCurrentScreenIndex(nextIndex);
        router.push(screenCycle[nextIndex].route); // Navigate to the next screen
        if (onDextAIPress) {
            onDextAIPress();
        }
    };

    const CurrentIcon = screenCycle[currentScreenIndex].icon;

    return (
        <View className="w-full mt-10">
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Image
                        source={typeof avatarImg === 'string' ? { uri: avatarImg } : avatarImg}
                        className="w-12 h-12 rounded-full"
                    />
                    <View className="ml-3">
                        <Text className="text-xs text-[#4E6E4E]">Welcome Back</Text>
                        <Text className="text-base font-bold">{username}</Text>
                    </View>
                </View>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={handleDextAIPress}
                        className="mr-1 w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    >
                        <CurrentIcon width={18} height={18} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onNotificationPress}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    >
                        <NotificationIcon size={18} color="#868795" />
                    </TouchableOpacity>
                    <View className="relative">
                        <TouchableOpacity
                            ref={buttonRef}
                            onPress={toggleMenu}
                            onLayout={handleButtonLayout}
                            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                        >
                            <Ionicons name="menu" size={18} color="#868795" />
                        </TouchableOpacity>
                        {isMenuVisible && (
                            <View
                                className="absolute right-0 bg-white rounded-lg shadow-lg p-2 w-40 z-10"
                                style={{ top: buttonHeight + 8 }}
                            >
                                <TouchableOpacity
                                    className="flex-row items-center p-2"
                                    onPress={() => {
                                        toggleMenu();
                                        handleLogout();
                                    }}
                                >
                                    <Ionicons name="log-out-outline" size={20} color="#4E6E4E" className="mr-2" />
                                    <Text className="text-[#4E6E4E] text-sm">Logout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}