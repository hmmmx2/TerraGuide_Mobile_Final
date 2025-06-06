import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminNavBar } from '@/components/AdminNavBar';

export default function DatabaseScreen() {
  const router = useRouter();
  const { session } = useAuth();

  // Define section titles
  const sectionTitles = [
    "Learner Enrollment & Progress",
    "Course Performance & Feedback",
    "Periodic Assessment Result",
    "Instructor Activity & Engagement",
    "Subscription & Payment History"
  ];

  useEffect(() => {
    console.log('File: DatabaseScreen, Function: useEffect, Session:', session?.user?.user_metadata);
    if (!session?.user || !session.user.user_metadata) {
      console.log('File: DatabaseScreen, Function: useEffect, No session, Navigating to: LoginScreen');
      router.replace('/LoginScreen');
      return;
    }
    const userRole = session.user.user_metadata.role?.toString().trim().toLowerCase();
    if (userRole !== 'admin' && userRole !== 'controller') {
      console.log('File: DatabaseScreen, Function: useEffect, Navigating to: CourseScreen, Role:', userRole || 'undefined');
      router.replace('/CourseScreen');
      return;
    }
  }, [session, router]);

  return (
      <SafeAreaView className="flex-1 bg-[#F8F9FA]">
        <ScrollView className="flex-1">
          <View className="py-6 px-4">
            {/* Header */}
            <AdminHeader
                username="Admin"
                onDextAIPress={() => console.log('File: DatabaseScreen, Function: onDextAIPress, DextAI pressed')}
                onNotificationPress={() => console.log('File: DatabaseScreen, Function: onNotificationPress, Notification pressed')}
            />

            {/* Search Sections with Data */}
            {sectionTitles.map((title, index) => (
                <View key={index} className="mt-6">
                  {/* Section Title and Enlarge Link */}
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xl font-bold text-gray-800">{title}</Text>
                    <TouchableOpacity>
                      <Text className="text-[#4E6E4E] text-sm">Enlarge</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-300 mb-3" />

                  {/* Search Bar and Action Button */}
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center bg-white rounded-full px-2 h-10 w-3/4 mr-2">
                      <Ionicons name="search" size={16} color="#868795" />
                      <TextInput
                          placeholder="Search"
                          className="ml-1 flex-1 text-sm h-full"
                          placeholderTextColor="#868795"
                      />
                      <TouchableOpacity>
                        <Ionicons name="close" size={16} color="#868795" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity className="bg-[#6D7E5E] px-3 py-1 rounded-full h-10 justify-center">
                      <Text className="text-white text-sm">Action</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Data Row */}
                  <View className="bg-[#6D7E5E] rounded-md p-3 mb-2">
                    {/* This would be replaced with actual data in a real implementation */}
                  </View>

                  {/* Empty Rows (placeholders) */}
                  {[1, 2, 3].map((row) => (
                      <View key={row} className="bg-[#F0F4E8] rounded-md p-3 mb-2 opacity-30">
                        {/* Empty placeholder rows */}
                      </View>
                  ))}
                </View>
            ))}
          </View>
        </ScrollView>

        <AdminNavBar activeRoute="/DatabaseScreen" />
      </SafeAreaView>
  );
}