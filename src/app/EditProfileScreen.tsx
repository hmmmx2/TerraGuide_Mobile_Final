import React from 'react';
import {ScrollView, View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import BackButton from "@/components/BackButton";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

async function requestGalleryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert("Sorry, we need camera roll permissions to make this work!");
        return false;
    }
    return true;
}

export default function EditProfileScreen() {
    const router = useRouter(); // Access the router object
    const [avatarUri, setAvatarUri] = React.useState<string | null>(null);
    const [firstName, setFirstName] = React.useState<string>('Mr');
    const [lastName, setLastName] = React.useState<string>('Bean');
    const [bio, setBio] = React.useState<string>('I\'m a park guide, para para para park guide');
    const [selectedPark, setSelectedPark] = React.useState<string>('Park 1');
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const [selectedDays, setSelectedDays] = React.useState<string[]>(['Mon', 'Tue']);
    const [showStartPicker, setShowStartPicker] = React.useState(false);
    const [showEndPicker, setShowEndPicker] = React.useState(false);
    const [startTimeDate, setStartTimeDate] = React.useState(new Date(0, 0, 0, 9, 0));
    const [endTimeDate, setEndTimeDate] = React.useState(new Date(0, 0, 0, 11, 0));
    const [startTime, setStartTime] = React.useState<string>('09:00');
    const [endTime, setEndTime] = React.useState<string>('11:00');

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const pickImageAsync = async () => {
        if (!(await requestGalleryPermission())) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],  // ← use literal(s), not ImagePicker.MediaType
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setAvatarUri(result.assets[0].uri);
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
                            <TextInput className="border-b border-[#91A088]" value={firstName} onChangeText={setFirstName} />
                        </View>
                    </View>

                    <View className="mt-3">
                        <View className="flex-row items-center ">
                            <Ionicons name="person-outline" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium ml-2">Last Name</Text>
                        </View>
                        <View className="w-80">
                            <TextInput className="border-b border-[#91A088]" value={lastName} onChangeText={setLastName} />
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
                        />
                    </View>

                    <View className="mt-3">
                        <View className="flex-row items-center">
                            <Ionicons name="location" size={18} color="#6D7E5E" />
                            <Text className="text-[#6A6E72] font-medium ml-2">Park Area</Text>
                        </View>
                        <View className="border-b border-[#91A088]">
                            <Picker selectedValue={selectedPark} onValueChange={(val) => setSelectedPark(val)}>
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

                    <TouchableOpacity className="bg-[#6D7E5E] mt-6 mb-10 py-4 rounded-full items-center">
                        <Text className="text-white font-semibold text-base">Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
