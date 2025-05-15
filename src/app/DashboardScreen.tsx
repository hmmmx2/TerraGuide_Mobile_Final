import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationIcon from '../../assets/icons/notification.svg';
import MenuIcon from '../../assets/icons/hamburger-menu.svg';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { Dimensions } from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import DextAIIcon from '../../assets/icons/artificial-intelligence-dark.svg';
import { AdminNavBar } from '@/components/AdminNavBar';

const screenWidth = Dimensions.get('window').width;

// Mock data
const alerts = [
  { id: 1, title: 'Intruder Approaching To The Restricted Area', date: '10/11/2023, 3:30pm', area: 'Park 1' },
  { id: 2, title: 'Intruder Approaching To The Restricted Area', date: '10/11/2023, 2:30pm', area: 'Park 2' },
  { id: 3, title: 'Intruder Approaching To The Restricted Area', date: '10/11/2023, 1:30pm', area: 'Park 3' },
  { id: 4, title: 'Intruder Approaching To The Restricted Area', date: '10/11/2023, 12:30pm', area: 'Park 1' },
];

const roleManagementData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Manager', isActive: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', isActive: true },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', isActive: false },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const [userName, setUserName] = useState('Admin');

  // Chart Data
  const lineData = [
    {
      value: 500,
      label: 'Mar',
      labelComponent: () => (
          <Text className="text-xs text-gray-500 -mt-1">Mar</Text>
      )
    },
    { value: 650, label: 'Apr' },
    { value: 750, label: 'May' },
    { value: 500, label: 'Jun' },
    { value: 600, label: 'Jul' },
    { value: 800, label: 'Aug' },
    { value: 1000, label: 'Sep' },
  ];

  const donutData = [
    { value: 67, color: '#4CAF50', text: '67%' },
    { value: 23, color: '#FFC107', text: '23%' },
    { value: 10, color: '#2196F3', text: '10%' },
  ];

  useEffect(() => {
    if (session?.user) {
      const userMetadata = session.user.user_metadata;
      if (userMetadata) {
        setUserName(userMetadata.first_name || 'Admin');
        const userRole = userMetadata.user_role;
        if (userRole !== 'admin' && userRole !== 'controller') {
          router.replace('/CourseScreen');
        }
      }
    }
  }, [session, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('../LoginScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
      <SafeAreaView className="flex-1 bg-[#F6F9F4]">
        <ScrollView>
          {/* Header Section */}
          <View className="flex-row justify-between items-center px-4 py-3">
            <View className="flex-row items-center">
              <Image source={require('../../assets/images/profile_pic.jpg')} className="w-10 h-10 rounded-full mr-3" />
              <View>
                <Text className="text-xs text-[#4E6E4E]">Welcome Back</Text>
                <Text className="text-base font-bold">Admin</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-4">
                <DextAIIcon width={24} height={24}/>
              </TouchableOpacity>
              <TouchableOpacity className="mr-4">
                <NotificationIcon width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MenuIcon width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Key Metrics */}
          <View className="flex-row justify-between px-4 py-2">
            <View className="bg-[#4E6E4E] rounded-xl justify-center items-center p-4 w-[48%] h-[100px] shadow-md">
              <Text className="text-white text-2xl font-bold">1,357</Text>
              <Text className="text-white">Exam Takers</Text>
            </View>
            <View className="bg-[#4E6E4E] rounded-xl justify-center items-center p-4 w-[48%] h-[100px] shadow-md">
              <Text className="text-white text-2xl font-bold">357</Text>
              <Text className="text-white">Bookers</Text>
            </View>
          </View>

          {/* Alerts Section */}
          <View className="mt-4 px-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">Alert</Text>
              <TouchableOpacity>
                <Text className="text-[#4E6E4E]">All alerts</Text>
              </TouchableOpacity>
            </View>
            <View className="h-px bg-gray-300 mb-3" />
            {alerts.map((alert, index) => (
                <View key={alert.id}>
                  <View className="rounded-lg p-3 flex-row items-center">
                    <View className="bg-red-100 p-2 rounded-full mr-3">
                      <FontAwesome5 name="exclamation-triangle" size={16} color="red" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium">{alert.title}</Text>
                      <Text className="text-xs text-gray-500">Date: {alert.date}</Text>
                      <Text className="text-xs text-gray-500">Area: {alert.area}</Text>
                    </View>
                  </View>
                  {index < alerts.length - 1 && <View className="h-px bg-gray-200 mx-3 my-1" />}
                </View>
            ))}
          </View>

          {/* Performance Line Chart */}
          <View className="mt-4 px-4 mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">Performance Overview</Text>
            </View>
            <View className="h-px bg-gray-300 mb-3" />
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <LineChart
                  data={lineData}
                  secondaryData={[{ value: 300 }, { value: 450 }, { value: 550 },
                    { value: 400 }, { value: 500 }, { value: 400 }, { value: 700 }]}
                  width={screenWidth - 100}  // Further reduced width to prevent overflow
                  height={160}  // Reduced height to make chart smaller
                  color1="#4E6E4E"
                  color2="#3080BC"  // This color should be visible now
                  areaChart1
                  areaChart2
                  startOpacity1={0.2}
                  endOpacity1={0.1}
                  startOpacity2={0.2}
                  endOpacity2={0.1}
                  curved
                  spacing={(screenWidth - 140) / 6}  // Adjusted spacing for better alignment
                  initialSpacing={20}
                  noOfSections={4}
                  yAxisColor="#E5E7EB"
                  xAxisColor="#E5E7EB"
                  yAxisTextStyle={{
                    color: '#6B7280',
                    fontSize: 10
                  }}
                  xAxisLabelTextStyle={{
                    color: '#6B7280',
                    fontSize: 10,
                    marginTop: 4
                  }}
                  dashWidth={6}
                  adjustToWidth={false}  // Keep this false to prevent auto-adjustment
                  rulesColor="#E5E7EB"
                  rulesType="solid"
                  showReferenceLine1
                  referenceLine1Position={600}
                  referenceLine1Config={{
                    color: 'gray',
                    dashWidth: 2,
                    dashGap: 3,
                  }}
                  pointerConfig={{
                    radius: 4,
                  }}
                  hideDataPoints={false}  // Show data points to distinguish lines
                  dataPointsColor1="#4E6E4E"  // Match the first line color
                  dataPointsColor2="#3080BC"  // Match the second line color
                  dataPointsRadius={3}  // Small but visible data points
              />
              <View className="flex-row justify-center mt-4 space-x-6">
                <View className="flex-row items-center">
                  <View className="h-3 w-3 rounded-full bg-[#4E6E4E] mr-2" />
                  <Text className="text-xs text-gray-600">Engagement</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="h-3 w-3 rounded-full bg-[#3080BC] mr-2" />
                  <Text className="text-xs text-gray-600">Conversion</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Approval Donut Chart */}
          <View className="mt-4 px-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">Approval Statistics</Text>
            </View>
            <View className="h-px bg-gray-300 mb-3" />
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="items-center">
                <PieChart
                    data={donutData}
                    donut
                    radius={80}
                    innerRadius={50}
                    textColor="#333"
                    textSize={14}
                    focusOnPress
                    sectionAutoFocus
                    centerLabelComponent={() => (
                        <View className="items-center">
                          <Text className="text-2xl font-bold text-[#4E6E4E]">67%</Text>
                          <Text className="text-xs text-gray-500">Approved</Text>
                        </View>
                    )}
                />
              </View>
              <View className="flex-row flex-wrap justify-center mt-4 gap-4">
                {donutData.map((item, index) => (
                    <View key={index} className="flex-row items-center">
                      <View className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                      <Text className="text-xs font-medium text-gray-700">
                        {['Approved', 'Pending', 'Rejected'][index]}: {item.value}%
                      </Text>
                    </View>
                ))}
              </View>
            </View>
          </View>

          {/* Role Management Table */}
          <View className="mt-4 px-4 mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">Role Management Overview</Text>
              <TouchableOpacity>
                <Text className="text-[#4E6E4E]">View all</Text>
              </TouchableOpacity>
            </View>
            <View className="h-px bg-gray-300 mb-3" />
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row border-b border-gray-200 pb-2 mb-2">
                <Text className="flex-1 font-medium">Name</Text>
                <Text className="flex-1 font-medium">Email</Text>
                <Text className="w-20 font-medium">Role</Text>
                <Text className="w-16 font-medium">Status</Text>
              </View>
              {roleManagementData.map(user => (
                  <View key={user.id} className="flex-row py-2 border-b border-gray-100">
                    <Text className="flex-1 text-sm">{user.name}</Text>
                    <Text className="flex-1 text-sm">{user.email}</Text>
                    <Text className="w-20 text-sm">{user.role}</Text>
                    <View className="w-16">
                      <View className={`px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Text className={`text-xs text-center ${user.isActive ? 'text-green-800' : 'text-red-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>
                  </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <AdminNavBar activeRoute="/DashboardScreen" />
      </SafeAreaView>
  );
}