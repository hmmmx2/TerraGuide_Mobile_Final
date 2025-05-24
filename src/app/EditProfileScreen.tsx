import React, { useEffect } from 'react';
import {ScrollView, View, Text, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import BackButton from "@/components/BackButton";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/CustomToast';

async function requestGalleryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert("Sorry, we need camera roll permissions to make this work!");
        return false;
    }
    return true;
}

export default function EditProfileScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [avatarUri, setAvatarUri] = React.useState<string | null>(null);
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [bio, setBio] = React.useState<string>('');
    const [selectedPark, setSelectedPark] = React.useState<string>('Not assigned');
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
    const [showStartPicker, setShowStartPicker] = React.useState(false);
    const [showEndPicker, setShowEndPicker] = React.useState(false);
    const [startTimeDate, setStartTimeDate] = React.useState(new Date(0, 0, 0, 9, 0));
    const [endTimeDate, setEndTimeDate] = React.useState(new Date(0, 0, 0, 11, 0));
    const [startTime, setStartTime] = React.useState<string>('09:00');
    const [endTime, setEndTime] = React.useState<string>('11:00');
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [userId, setUserId] = React.useState<string>('');

    useEffect(() => {
        if (session?.user) {
            setUserId(session.user.id);
            
            // Load user metadata from auth
            const userMetadata = session.user.user_metadata;
            if (userMetadata) {
                // Split username into first and last name if available
                const username = userMetadata.username || '';
                const nameParts = username.split(' ');
                setFirstName(nameParts[0] || '');
                setLastName(nameParts.slice(1).join(' ') || '');
            }
            
            // Fetch parkguide data from database
            fetchParkGuideData(session.user.id);
        }
    }, [session]);

    const fetchParkGuideData = async (userId: string) => {
        try {
            setIsLoading(true);
            
            const { data, error } = await supabase
                .from('parkguides')
                .select('*')
                .eq('user_id', userId)
                .single();
                
            if (error) {
                console.error('Error fetching parkguide data:', error);
                return;
            }
            
            if (data) {
                // Set bio if available
                if (data.bio) {
                    setBio(data.bio);
                }
                
                // Set park area if assigned
                if (data.park_area) {
                    setSelectedPark(data.park_area);
                }
                
                // Set working hours if specified
                if (data.working_hours) {
                    try {
                        const workingHours = JSON.parse(data.working_hours);
                        if (workingHours.days) {
                            setSelectedDays(workingHours.days);
                        }
                        if (workingHours.startTime) {
                            setStartTime(workingHours.startTime);
                            const [hours, minutes] = workingHours.startTime.split(':').map(Number);
                            setStartTimeDate(new Date(0, 0, 0, hours, minutes));
                        }
                        if (workingHours.endTime) {
                            setEndTime(workingHours.endTime);
                            const [hours, minutes] = workingHours.endTime.split(':').map(Number);
                            setEndTimeDate(new Date(0, 0, 0, hours, minutes));
                        }
                    } catch (e) {
                        console.error('Error parsing working hours:', e);
                    }
                }
                
                // Check for avatar URL
                if (data.avatar_url) {
                    setAvatarUri(data.avatar_url);
                }
            }
        } catch (error) {
            console.error('Error in fetchParkGuideData:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const pickImageAsync = async () => {
        if (!(await requestGalleryPermission())) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setAvatarUri(result.assets[0].uri);
    };

    const saveProfile = async () => {
        if (!session?.user) {
            toast.error('You must be logged in to update your profile');
            return;
        }
        
        try {
            setIsLoading(true);
            
            // Prepare working hours data
            const workingHours = {
                days: selectedDays,
                startTime: startTime,
                endTime: endTime
            };
            
            // Upload avatar if selected
            let avatarUrl = avatarUri;
            if (avatarUri && !avatarUri.startsWith('https://')) {
                // Upload new image to storage
                const fileExt = avatarUri.split('.').pop();
                const fileName = `${userId}_${Date.now()}.${fileExt}`;
                const filePath = `parkguides/${fileName}`;
                
                // Fetch the file data from the URI
                const response = await fetch(avatarUri);
                const blob = await response.blob();
                
                // Upload the blob to Supabase
                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('avatar-images')
                    .upload(filePath, blob);
                    
                if (uploadError) {
                    throw uploadError;
                }
                
                // Get the public URL
                const { data } = await supabase.storage
                    .from('avatar-images')
                    .getPublicUrl(filePath);
                    
                avatarUrl = data.publicUrl;
            }
            
            // Update user metadata (first name, last name)
            const fullName = `${firstName} ${lastName}`.trim();
            if (fullName) {
                await supabase.auth.updateUser({
                    data: {
                        username: fullName,
                        first_name: firstName,
                        last_name: lastName,
                        avatar_url: avatarUrl
                    }
                });
            }
            
            // Update parkguide record
            const { error: updateError } = await supabase
                .from('parkguides')
                .update({
                    bio: bio,
                    park_area: selectedPark,
                    working_hours: JSON.stringify(workingHours),
                    avatar_url: avatarUrl
                })
                .eq('user_id', userId);
                
            if (updateError) {
                throw updateError;
            }
            
            toast.success('Profile updated successfully');
            router.back();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F4] py-8">
            <ScrollView className="px-1">
                {/* Back Button */}
                <View className="mb-3 ml-3">
                    <BackButton/>
                </View>

                <View className="bg-[#E6ECD6] py-3 items-center justify-center mb-3">
                    <Text className="text-lg font-semibold text-[#4E6E4E]">Edit Profile</Text>
                </View>

                {/* Editable Avatar */}
                <View className="items-center">
                    <TouchableOpacity onPress={pickImageAsync}>
                        <Image
                            source={
                                avatarUri
                                    ? { uri: avatarUri }
                                    : require('@assets/images/profile_pic.jpg')
                            }
                            className="w-24 h-24 rounded-full mb-1 border border-[#4E6E4E]"
                            resizeMode="cover"
                        />
                        <Text className="text-sm text-[#4E6E4E] text-center">Tap to change</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Section */}
                <View className="px-6 py-3">
                    <View className="mt-3">
                        {/* First Name */}
                        <View className="flex-row items-center space-x-2">
                            <Ionicons name="person-outline" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium ml-2">First Name</Text>
                        </View>
                        <View className="w-80">
                            <TextInput 
                                className="border-b border-[#91A088]" 
                                value={firstName} 
                                onChangeText={setFirstName}
                                placeholder="Enter first name" 
                            />
                        </View>
                    </View>

                    <View className="mt-3">
                        <View className="flex-row items-center ">
                            <Ionicons name="person-outline" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium ml-2">Last Name</Text>
                        </View>
                        <View className="w-80">
                            <TextInput 
                                className="border-b border-[#91A088]" 
                                value={lastName} 
                                onChangeText={setLastName}
                                placeholder="Enter last name" 
                            />
                        </View>
                    </View>

                    <View className="mt-3">
                        <View className="flex-row items-center">
                            <Ionicons name="document-text" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium ml-2">Bio</Text>
                        </View>
                        <TextInput
                            className="mt-1 border-b border-[#91A088] py-1"
                            multiline
                            numberOfLines={2}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                        />
                    </View>

                    <View className="mt-3">
                        <View className="flex-row items-center">
                            <Ionicons name="location" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium ml-2">Park Area</Text>
                        </View>
                        <View className="border-b border-[#91A088]">
                            <Picker selectedValue={selectedPark} onValueChange={(val) => setSelectedPark(val)}>
                                <Picker.Item label="Not assigned" value="Not assigned"/>
                                <Picker.Item label="Park 1" value="Park 1"/>
                                <Picker.Item label="Park 2" value="Park 2"/>
                                <Picker.Item label="Park 3" value="Park 3"/>
                            </Picker>
                        </View>
                    </View>

                    <View className="mt-3">
                        <View className="flex-row items-center space-x-2">
                            <Ionicons name="calendar" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium ml-2">Working Hours</Text>
                        </View>

                        {/* Day checkboxes */}
                        <View className="flex-row flex-wrap mb-2 mt-3">
                            {daysOfWeek.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    className={`px-3 py-1 mr-2 mb-2 rounded-full border ${
                                        selectedDays.includes(day)
                                            ? 'bg-[#B0C4A9] border-[#4E6E4E]'
                                            : 'bg-white border-gray-400'
                                    }`}
                                    onPress={() => toggleDay(day)}
                                >
                                    <Text className="text-sm text-[#4E6E4E]">{day}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row items-center justify-between mt-2">
                            {/* Start Time */}
                            <TouchableOpacity
                                className="w-[40%] border-b border-gray-300 py-2"
                                onPress={() => setShowStartPicker(true)}
                            >
                                <Text className="text-[#4E6E4E] text-center">
                                    {startTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>

                            <Text className="text-gray-700">to</Text>

                            {/* End Time */}
                            <TouchableOpacity
                                className="w-[40%] border-b border-gray-300 py-2"
                                onPress={() => setShowEndPicker(true)}
                            >
                                <Text className="text-[#4E6E4E] text-center">
                                    {endTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Start Time Picker Modal */}
                        {showStartPicker && (
                            <DateTimePicker
                                value={startTimeDate}
                                mode="time"
                                display="spinner"
                                is24Hour={true}
                                onChange={(event, selectedDate) => {
                                    setShowStartPicker(false);
                                    if (selectedDate) {
                                        setStartTimeDate(selectedDate);
                                        const formatted = selectedDate.toTimeString().slice(0, 5);
                                        setStartTime(formatted);
                                    }
                                }}
                            />
                        )}

                        {/* End Time Picker Modal */}
                        {showEndPicker && (
                            <DateTimePicker
                                value={endTimeDate}
                                mode="time"
                                display="spinner"
                                is24Hour={true}
                                onChange={(event, selectedDate) => {
                                    setShowEndPicker(false);
                                    if (selectedDate) {
                                        setEndTimeDate(selectedDate);
                                        const formatted = selectedDate.toTimeString().slice(0, 5);
                                        setEndTime(formatted);
                                    }
                                }}
                            />
                        )}
                    </View>

                    <TouchableOpacity 
                        className="bg-[#6D7E5E] mt-6 mb-10 py-4 rounded-full items-center"
                        onPress={saveProfile}
                        disabled={isLoading}
                    >
                        <Text className="text-white font-semibold text-base">
                            {isLoading ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
