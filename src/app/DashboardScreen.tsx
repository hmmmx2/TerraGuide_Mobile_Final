import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { Dimensions } from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import { AdminNavBar } from '@/components/AdminNavBar';
import { AdminHeader } from '@/components/AdminHeader';

const screenWidth = Dimensions.get('window').width;

// Mock data
const alerts = [
  { id: 1, title: 'Intruder Approaching To The Restricted Area', date: '10/11/2023, 3:30pm', area: 'Park 1' },
  { id: 2, title: 'Intruder Approaching To The Restricted Area', date: '10/11/2023, 2:30pm', area: 'Park 2' },
  { id: 3, title: 'Intruder Approaching To The Restricted Area', date: '10/11/2023, 1:30pm', area: 'Park 3' },
  { id: 4, title: 'Intruder Approaching To The Restricted Area', date: '10/11/2023, 12:30pm', area: 'Park 1' },
];

const roleManagementData = [
  { id: 1, name: 'Timmy He', email: 'timmyhe@gmail.com', designation: 'Senior Manager', role: 'Controller' },
  { id: 2, name: 'Jimmy He', email: 'jimmyhe@gmail.com', designation: 'Manager', role: 'Controller' },
  { id: 3, name: 'Gimmy He', email: 'gimmyhe@gmail.com', designation: 'Business Analyst', role: 'Admin' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [userName, setUserName] = useState('Admin');

  // Chart Data
  const lineData = [
    { value: 500, label: 'Mar', labelComponent: () => <Text className="text-xs text-gray-500 -mt-1">Mar</Text> },
    { value: 650, label: 'Apr', labelComponent: () => <Text className="text-xs text-gray-500 -mt-1">Apr</Text> },
    { value: 750, label: 'May', labelComponent: () => <Text className="text-xs text-gray-500 -mt-1">May</Text> },
    { value: 500, label: 'Jun', labelComponent: () => <Text className="text-xs text-gray-500 -mt-1">Jun</Text> },
    { value: 600, label: 'Jul', labelComponent: () => <Text className="text-xs text-gray-500 -mt-1">Jul</Text> },
    { value: 800, label: 'Aug', labelComponent: () => <Text className="text-xs text-gray-500 -mt-1">Aug</Text> },
    { value: 1000, label: 'Sep', labelComponent: () => <Text className="text-xs text-gray-500 -mt-1">Sep</Text> },
  ];

  const donutData = [
    { value: 67, color: '#4CAF50', text: '67%' },
    { value: 23, color: '#FFC107', text: '23%' },
    { value: 10, color: '#2196F3', text: '10%' },
  ];

  useEffect(() => {
    console.log('File: DashboardScreen, Function: useEffect, Session:', session?.user?.user_metadata);
    if (!session?.user) {
      console.log('File: DashboardScreen, Function: useEffect, No session, Navigating to: LoginScreen');
      router.replace('/LoginScreen');
      return;
    }

    const userMetadata = session.user.user_metadata;
    if (!userMetadata) {
      console.log('File: DashboardScreen, Function: useEffect, No user_metadata, Navigating to: LoginScreen');
      router.replace('/LoginScreen');
      return;
    }

    setUserName(userMetadata.first_name || 'Admin');
    const userRole = userMetadata.role?.toString().trim().toLowerCase();
    console.log('File: DashboardScreen, Function: useEffect, User Role:', userRole);

    if (userRole !== 'admin' && userRole !== 'controller') {
      console.log('File: DashboardScreen, Function: useEffect, Navigating to: CourseScreen, Role:', userRole || 'undefined');
      router.replace('/CourseScreen');
      return;
    }

    console.log('File: DashboardScreen, Function: useEffect, Staying on DashboardScreen, Role:', userRole);
  }, [session, router]);

  // Handle hardware back button to exit app
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('File: DashboardScreen, Function: backHandler, Back button pressed');
      BackHandler.exitApp();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
      <SafeAreaView className="flex-1 bg-[#F8F9FA]">
        <ScrollView>
          <View className="py-6">
            {/* Header Section */}
            <View className="px-4">
              <AdminHeader
                  username={userName}
                  onDextAIPress={() => console.log('File: DashboardScreen, Function: onDextAIPress, DextAI pressed')}
                  onNotificationPress={() => console.log('File: DashboardScreen, Function: onNotificationPress, Notification pressed')}
              />
            </View>

            {/* Key Metrics */}
            <View className="mt-5">
              <View className="flex-row justify-between px-4 py-2">
                <View className="bg-[#4E6E4E] rounded-xl justify-center items-center p-4 w-[48%] h-[100px] shadow-lg">
                  <Text className="text-white text-2xl font-bold">1,357</Text>
                  <Text className="text-white">Exam Takers</Text>
                </View>
                <View className="bg-[#4E6E4E] rounded-xl justify-center items-center p-4 w-[48%] h-[100px] shadow-lg">
                  <Text className="text-white text-2xl font-bold">357</Text>
                  <Text className="text-white">Bookers</Text>
                </View>
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
              <View className="bg-white rounded-2xl p-4 shadow-lg">
                <LineChart
                    data={lineData}
                    secondaryData={[{ value: 300 }, { value: 450 }, { value: 550 }, { value: 400 }, { value: 500 }, { value: 400 }, { value: 700 }]}
                    width={screenWidth - 100}
                    height={160}
                    color1="#4E6E4E"
                    color2="#3080BC"
                    areaChart1
                    areaChart2
                    startOpacity1={0.2}
                    endOpacity1={0.1}
                    startOpacity2={0.2}
                    endOpacity2={0.1}
                    curved
                    spacing={(screenWidth - 140) / 6}
                    initialSpacing={20}
                    noOfSections={4}
                    yAxisColor="#E5E7EB"
                    xAxisColor="#E5E7EB"
                    yAxisTextStyle={{ color: '#6B7280', fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 10, marginTop: 4 }}
                    dashWidth={6}
                    adjustToWidth={false}
                    rulesColor="#E5E7EB"
                    rulesType="solid"
                    showReferenceLine1
                    referenceLine1Position={600}
                    referenceLine1Config={{ color: 'gray', dashWidth: 2, dashGap: 3 }}
                    pointerConfig={{ radius: 4 }}
                    hideDataPoints={false}
                    dataPointsColor1="#4E6E4E"
                    dataPointsColor2="#3080BC"
                    dataPointsRadius={3}
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
              <View className="bg-white rounded-2xl p-4 shadow-lg">
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

            {/* Role Management Section */}
            <View className="mt-4 px-4 mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">Role Management</Text>
                <TouchableOpacity>
                  <Text className="text-[#4E6E4E]">View all</Text>
                </TouchableOpacity>
              </View>
              <View className="h-px bg-gray-300 mb-3" />
              <View className="flex-row bg-[#E6ECD6] p-3 rounded-t-lg">
                <Text className="flex-1 font-medium text-sm">User Name</Text>
                <Text className="flex-1 font-medium text-sm">Email Address</Text>
                <Text className="flex-1 font-medium text-sm">Designation</Text>
                <Text className="w-24 font-medium text-sm text-center">Role</Text>
              </View>
              {roleManagementData.map((user, index) => (
                  <View
                      key={user.id}
                      className={`flex-row p-3 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F6F9F4]'} ${index === roleManagementData.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    <Text className="flex-1 text-sm">{user.name}</Text>
                    <Text className="flex-1 text-sm">{user.email}</Text>
                    <Text className="flex-1 text-sm">{user.designation}</Text>
                    <View className="w-24 items-center">
                      <View className="px-2 py-1 rounded-md bg-[#E6ECD6]">
                        <Text className="text-xs">{user.role}</Text>
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