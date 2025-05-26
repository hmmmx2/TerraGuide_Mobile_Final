import React, { useEffect } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import BackButton from '@/components/BackButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/CustomToast';

async function requestGalleryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        toast.error('Camera roll permissions are required');
        return false;
    }
    return true;
}

async function fetchAvatarFromStorage(userId: string): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .storage
            .from('avatar-images')
            .list(`parkguides/${userId}`);

        if (error) {
            console.error('File: EditProfileScreen, Function: fetchAvatarFromStorage, Error:', error.message);
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
        console.error('File: EditProfileScreen, Function: fetchAvatarFromStorage, Unexpected error:', error.message);
        return null;
    }
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
    const today = new Date();
    const [startTimeDate, setStartTimeDate] = React.useState(
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0)
    );
    const [endTimeDate, setEndTimeDate] = React.useState(
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0)
    );
    const [startTime, setStartTime] = React.useState<string>('09:00');
    const [endTime, setEndTime] = React.useState<string>('17:00');
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [userId, setUserId] = React.useState<string>(''); // auth.users.id
    const [appUserId, setAppUserId] = React.useState<string>(''); // users.id
    const [originalData, setOriginalData] = React.useState<{
        firstName: string;
        lastName: string;
        bio: string;
        park_area: string;
        working_hours: string;
        working_days: string | null;
        avatar_url: string | null;
        username: string;
    } | null>(null);

    useEffect(() => {
        if (session?.user) {
            setUserId(session.user.id);
            const userMetadata = session.user.user_metadata;
            let username = userMetadata?.username || '';
            if (username.includes('_')) {
                username = username.replace(/_/g, ' ');
            }
            const nameParts = username.trim().split(' ').filter(Boolean);
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            fetchParkGuideData(session.user.id);
        }
    }, [session]);

    const parseTime = (timeStr: string): Date => {
        const [time, period] = timeStr.trim().split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    };

    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const fetchParkGuideData = async (authUserId: string) => {
        try {
            setIsLoading(true);
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('supabase_uid', authUserId)
                .single();

            if (userError) {
                console.error('File: EditProfileScreen, Function: fetchParkGuideData, User Error:', userError.message);
                return;
            }

            if (userData) {
                setAppUserId(userData.id);
                const { data: guideData, error: guideError } = await supabase
                    .from('park_guides')
                    .select('bio, park_area, working_hours, working_days, avatar_url, username')
                    .eq('supabase_uid', authUserId)
                    .single();

                if (guideError && guideError.code !== 'PGRST116') {
                    console.error('File: EditProfileScreen, Function: fetchParkGuideData, Guide Error:', guideError.message);
                    return;
                }

                let avatarUrl: string | null = null;
                if (guideData?.avatar_url && guideData.avatar_url.trim() !== '' && guideData.avatar_url.startsWith('https://')) {
                    avatarUrl = guideData.avatar_url;
                    console.log('Using avatar_url from park_guides:', avatarUrl);
                } else {
                    avatarUrl = await fetchAvatarFromStorage(authUserId);
                }

                if (guideData) {
                    let username = guideData.username || '';
                    if (username.includes('_')) {
                        username = username.replace(/_/g, ' ');
                    }
                    const nameParts = username.trim().split(' ').filter(Boolean);
                    const fetchedFirstName = nameParts[0] || '';
                    const fetchedLastName = nameParts.slice(1).join(' ') || '';
                    setFirstName(fetchedFirstName);
                    setLastName(fetchedLastName);
                    setAvatarUri(avatarUrl);
                    if (guideData.bio) setBio(guideData.bio);
                    setSelectedPark(guideData.park_area || 'Not assigned');
                    const workingDays = guideData.working_days
                        ? guideData.working_days
                            .split(',')
                            .map((day: string) => day.trim())
                            .filter((day: string) => daysOfWeek.includes(day))
                        : [];
                    setSelectedDays(workingDays);
                    let workingHours = '09:00 AM - 05:00 PM';
                    if (
                        guideData.working_hours &&
                        guideData.working_hours !== 'Not specified' &&
                        guideData.working_hours.trim() !== ''
                    ) {
                        try {
                            const [start, end] = guideData.working_hours.split(' - ');
                            const startDate = parseTime(start);
                            const endDate = parseTime(end);
                            setStartTimeDate(startDate);
                            setEndTimeDate(endDate);
                            setStartTime(startDate.toTimeString().slice(0, 5));
                            setEndTime(endDate.toTimeString().slice(0, 5));
                            workingHours = guideData.working_hours;
                        } catch (e) {
                            console.error(
                                'File: EditProfileScreen, Function: fetchParkGuideData, Error parsing working_hours:',
                                e
                            );
                            setStartTime('09:00');
                            setEndTime('17:00');
                            setStartTimeDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0));
                            setEndTimeDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0));
                        }
                    } else {
                        setStartTime('09:00');
                        setEndTime('17:00');
                        setStartTimeDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0));
                        setEndTimeDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0));
                    }
                    setOriginalData({
                        firstName: fetchedFirstName,
                        lastName: fetchedLastName,
                        bio: guideData.bio || '',
                        park_area: guideData.park_area || 'Not assigned',
                        working_hours: workingHours,
                        working_days: workingDays.length > 0 ? workingDays.join(',') : null,
                        avatar_url: avatarUrl,
                        username: username,
                    });
                } else {
                    avatarUrl = await fetchAvatarFromStorage(authUserId);
                    setAvatarUri(avatarUrl);
                    setBio('');
                    setSelectedPark('Not assigned');
                    setSelectedDays([]);
                    setStartTime('09:00');
                    setEndTime('17:00');
                    setStartTimeDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0));
                    setEndTimeDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0));
                    setOriginalData({
                        firstName: '',
                        lastName: '',
                        bio: '',
                        park_area: 'Not assigned',
                        working_hours: '09:00 AM - 05:00 PM',
                        working_days: null,
                        avatar_url: avatarUrl,
                        username: '',
                    });
                }
            }
        } catch (error: any) {
            console.error(
                'File: EditProfileScreen, Function: fetchParkGuideData, Unexpected error:',
                error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDay = (day: string) => {
        setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    };

    const pickImageAsync = async () => {
        if (!(await requestGalleryPermission())) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            console.log('Selected image URI:', result.assets[0].uri);
            setAvatarUri(result.assets[0].uri);
        }
    };

    const saveProfile = async () => {
        if (!session?.user) {
            toast.error('You must be logged in to update your profile');
            return;
        }

        const currentFullName = `${firstName || ''} ${lastName || ''}`.trim();
        if (!currentFullName) {
            toast.error('At least one of first name or last name is required');
            return;
        }

        if (!appUserId) {
            toast.error('User not found in system');
            return;
        }

        try {
            setIsLoading(true);

            // Format working hours
            const workingHours = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            const workingDays = selectedDays.length > 0 ? selectedDays.join(',') : null;

            // Upload avatar if changed
            let avatarUrl = avatarUri;
            if (avatarUri && !avatarUri.startsWith('https://') && avatarUri !== originalData?.avatar_url) {
                const fileExt = avatarUri.split('.').pop()?.toLowerCase() || 'jpeg';
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `parkguides/${userId}/${fileName}`;

                console.log('Avatar URI:', avatarUri);
                console.log('Uploading avatar to:', filePath);

                // Validate URI
                const fileInfo = await FileSystem.getInfoAsync(avatarUri);
                console.log('File Info:', fileInfo);
                if (!fileInfo.exists) {
                    throw new Error('Image file does not exist or is inaccessible');
                }

                // Read file as base64 (without the data:image prefix)
                const fileContent = await FileSystem.readAsStringAsync(avatarUri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                console.log('File content length:', fileContent.length);

                // Convert base64 to Uint8Array
                const binary = atob(fileContent);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }

                // Upload to Supabase with retries
                let uploadError: any = null;
                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        const { error } = await supabase.storage
                            .from('avatar-images')
                            .upload(filePath, bytes, {
                                contentType: `image/${fileExt}`,
                                upsert: true,
                            });

                        if (error) {
                            console.error('Supabase upload error:', JSON.stringify(error));
                            throw new Error(`Supabase upload failed: ${error.message}`);
                        }

                        // Verify file exists
                        const { data: files, error: listError } = await supabase
                            .storage
                            .from('avatar-images')
                            .list(`parkguides/${userId}`);

                        if (listError) {
                            throw new Error(`Failed to list files: ${listError.message}`);
                        }

                        const uploadedFile = files.find((f) => f.name === fileName);
                        if (!uploadedFile) {
                            throw new Error('Uploaded file not found in storage');
                        }

                        const { data: urlData } = supabase.storage
                            .from('avatar-images')
                            .getPublicUrl(filePath);
                        avatarUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
                        console.log('Avatar uploaded:', avatarUrl);
                        uploadError = null;
                        break;
                    } catch (err: any) {
                        uploadError = err;
                        console.warn(`Upload attempt ${attempt} failed:`, err.message);
                        if (attempt === 3) {
                            console.error('Avatar upload failed after 3 attempts:', err.message);
                            toast.error('Failed to upload avatar, but profile updates will proceed.');
                            avatarUrl = originalData?.avatar_url || null;
                        }
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                    }
                }
                if (uploadError && avatarUrl === avatarUri) {
                    console.warn('Proceeding without avatar update.');
                }
            }

            // Prepare auth.users metadata updates
            const userMetadataUpdates: { [key: string]: any } = {};
            if (firstName !== originalData?.firstName) userMetadataUpdates.first_name = firstName;
            if (lastName !== originalData?.lastName) userMetadataUpdates.last_name = lastName;
            if (currentFullName !== originalData?.username) userMetadataUpdates.username = currentFullName;
            if (avatarUrl && avatarUrl !== originalData?.avatar_url) userMetadataUpdates.avatar_url = avatarUrl;

            // Update auth.users metadata
            if (Object.keys(userMetadataUpdates).length > 0) {
                const { error: authError } = await supabase.auth.updateUser({
                    data: userMetadataUpdates,
                });
                if (authError) {
                    throw new Error(`User metadata update failed: ${authError.message}`);
                }
                console.log('Updated auth.users metadata:', userMetadataUpdates);
            }

            // Prepare park_guides updates
            const parkGuideUpdates: { [key: string]: any } = {
                user_id: appUserId,
                supabase_uid: userId,
                username: currentFullName,
                designation: 'Junior Guide',
                updated_at: new Date().toISOString(),
            };
            if (bio !== originalData?.bio) parkGuideUpdates.bio = bio || null;
            if (selectedPark !== originalData?.park_area) parkGuideUpdates.park_area = selectedPark;
            if (workingHours !== originalData?.working_hours) parkGuideUpdates.working_hours = workingHours;
            if (workingDays !== originalData?.working_days) parkGuideUpdates.working_days = workingDays;
            if (avatarUrl && avatarUrl !== originalData?.avatar_url) parkGuideUpdates.avatar_url = avatarUrl || null;

            // Update park_guides
            if (Object.keys(parkGuideUpdates).length > 3) {
                console.log('Park Guide Updates:', parkGuideUpdates);
                const { error: upsertError } = await supabase
                    .from('park_guides')
                    .upsert(parkGuideUpdates, {
                        onConflict: 'supabase_uid',
                        ignoreDuplicates: false,
                    });
                if (upsertError) {
                    throw new Error(`Profile update failed: ${upsertError.message}`);
                }
            }

            toast.success('Profile updated successfully');
            router.back();
        } catch (error: any) {
            console.error('File: EditProfileScreen, Function: saveProfile, Error:', error.message);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F4]">
            <ScrollView className="px-4 pb-6">
                <View className="mb-4 ml-2">
                    <BackButton />
                </View>

                <View className="bg-[#E6ECD6] py-3 items-center justify-center mb-4">
                    <Text className="text-lg font-semibold text-[#4E6E4E]">Edit Profile</Text>
                </View>

                <View className="items-center mb-6">
                    <TouchableOpacity onPress={pickImageAsync}>
                        <Image
                            source={
                                avatarUri && avatarUri.trim() !== ''
                                    ? { uri: avatarUri }
                                    : require('@assets/images/Guest-Profile.png')
                            }
                            className="w-24 h-24 rounded-full mb-2 border border-[#4E6E4E]"
                            resizeMode="cover"
                        />
                        <Text className="text-sm text-[#4E6E4E] text-center">Tap to change</Text>
                    </TouchableOpacity>
                </View>

                <View className="px-6">
                    <View className="mb-4">
                        <View className="flex-row items-center space-x-2">
                            <Ionicons name="person-outline" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium">First Name</Text>
                        </View>
                        <TextInput
                            className="border-b border-[#91A088] mt-2 py-1 text-[#4E6E4E]"
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter first name"
                            placeholderTextColor="#A0A0A0"
                        />
                    </View>

                    <View className="mb-4">
                        <View className="flex-row items-center space-x-2">
                            <Ionicons name="person-outline" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium">Last Name</Text>
                        </View>
                        <TextInput
                            className="border-b border-[#91A088] mt-2 py-1 text-[#4E6E4E]"
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter last name"
                            placeholderTextColor="#A0A0A0"
                        />
                    </View>

                    <View className="mb-4">
                        <View className="flex-row items-center space-x-2">
                            <Ionicons name="document-text-outline" size={18} color="#6D7E5E" />
                                <Text className="text-[#6A6E72] font-medium">Bio</Text>
                                </View>
                                <TextInput
                                className="border-b border-[#91A088] mt-2 py-1 text-[#4E6E4E]"
                                multiline
                                numberOfLines={3}
                                      value={bio}
                                      onChangeText={setBio}
                                      placeholder="Tell us about yourself"
                                      placeholderTextColor="#A0A0A0"
                            />
                        </View>

                        <View className="mb-4">
                            <View className="flex-row items-center space-x-2">
                                <Ionicons name="location-outline" size={18} color="#6D7E5E" />
                                <Text className="text-[#6A6E72] font-medium">Park Area</Text>
                            </View>
                            <View className="border-b border-[#91A088] mt-2">
                                <Picker
                                    selectedValue={selectedPark}
                                    onValueChange={(val) => setSelectedPark(val)}
                                >
                                    <Picker.Item label="Not assigned" value="Not assigned" />
                                    <Picker.Item label="Park 1" value="Park 1" />
                                    <Picker.Item label="Park 2" value="Park 2" />
                                    <Picker.Item label="Park 3" value="Park 3" />
                                </Picker>
                            </View>
                        </View>

                        <View className="mb-6">
                            <View className="flex-row items-center space-x-2">
                                <Ionicons name="calendar-outline" size={18} color="#6D7E5E" />
                                <Text className="text-[#6A6E72] font-medium">Working Hours</Text>
                            </View>

                            <View className="flex-row flex-wrap mt-4 mb-2">
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
                                <TouchableOpacity
                                    className="w-[40%] border-b border-[#91A088] py-2"
                                    onPress={() => setShowStartPicker(true)}
                                >
                                    <Text className="text-[#4E6E4E] text-center">
                                        {startTimeDate.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </Text>
                                </TouchableOpacity>

                                <Text className="text-gray-600">to</Text>

                                <TouchableOpacity
                                    className="w-[40%] border-b border-[#91A088] py-2"
                                    onPress={() => setShowEndPicker(true)}
                                >
                                    <Text className="text-[#4E6E4E] text-center">
                                        {endTimeDate.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </Text>
                                </TouchableOpacity>
                            </View>

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
                            className="bg-[#4E6E4E] py-4 rounded-full items-center mb-6"
                            onPress={saveProfile}
                            disabled={isLoading}
                        >
                            <Text className="text-white font-semibold text-base">
                                {isLoading ? 'Saving...' : 'Save Profile'}
                            </Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
        </SafeAreaView>
    );
}