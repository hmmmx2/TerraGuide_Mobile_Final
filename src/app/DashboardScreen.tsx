import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { Dimensions } from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import { AdminNavBar } from '@/components/AdminNavBar';
import { AdminHeader } from '@/components/AdminHeader';
import { Container } from '@/components/Container';
import { supabase } from '@/lib/supabase';

const screenWidth = Dimensions.get('window').width;

// Define the interface for an intruder detection event
interface IntruderDetectionEvent {
  id: string;
  title: string;
  detection_time: string;
  area: string;
  distance_cm: number;
  image_url: string | null;
}

const roleManagementData = [
  { id: 1, name: 'Timmy He', email: 'timmyhe@gmail.com', designation: 'Senior Manager', role: 'Controller' },
  { id: 2, name: 'Jimmy He', email: 'jimmyhe@gmail.com', designation: 'Manager', role: 'Controller' },
  { id: 3, name: 'Gimmy He', email: 'gimmyhe@gmail.com', designation: 'Business Analyst', role: 'Admin' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [userName, setUserName] = useState('Admin');
  const [events, setEvents] = useState<IntruderDetectionEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const getRoleColor = (role: string) => {
    const lowerRole = role.toLowerCase();
    switch (lowerRole) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'controller':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <SafeAreaView className="flex-1 bg-[#F8F9FA]">
        <ScrollView>
          <Container className="py-6">
            {/* Header Section */}
            <View className="relative">
              <AdminHeader
                  username={userName}
                  onDextAIPress={() => console.log('File: DashboardScreen, Function: onDextAIPress, DextAI pressed')}
                  onNotificationPress={() => console.log('File: DashboardScreen, Function: onNotificationPress, Notification pressed')}
              />
            </View>

            {/* Key Metrics */}
            <View className="mt-5">
              <View className="flex-row justify-between py-2">
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
            <View className="mt-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">Alert</Text>
                <TouchableOpacity onPress={() => router.push('/IntruderDetectionSystemScreen')}>
                  <Text className="text-[#4E6E4E]">All alerts</Text>
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
              {!loading && !error && events.slice(0, 4).map((event, index) => (
                  <View key={event.id}>
                    <View className="rounded-lg p-3 flex-row items-center">
                      <View className="bg-red-100 p-2 rounded-full mr-3">
                        <FontAwesome5 name="exclamation-triangle" size={16} color="red" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium">{event.title}</Text>
                        <Text className="text-xs text-gray-500">Date: {formatDetectionTime(event.detection_time)}</Text>
                        <Text className="text-xs text-gray-500">
                          Area: {event.area} | Distance: {event.distance_cm} cm
                        </Text>
                      </View>
                    </View>
                    {index < events.slice(0, 4).length - 1 && <View className="h-px bg-gray-200 mx-3 my-1" />}
                  </View>
              ))}
            </View>

            {/* Performance Line Chart */}
            <View className="mt-4 mb-3">
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
            <View className="mt-4">
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
            <View className="mt-4 mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">Role Management</Text>
                <TouchableOpacity onPress={() => router.push('/RoleManagementScreen')}>
                  <Text className="text-[#4E6E4E]">View all</Text>
                </TouchableOpacity>
              </View>
              <View className="h-px bg-gray-300 mb-3" />

              {/* Table Header */}
              <View className="bg-[#E6ECD6] p-4 rounded-t-lg">
                <View className="flex-row items-center">
                  <Text className="flex-1 font-semibold text-sm text-gray-700">User Name</Text>
                  <Text className="flex-1 font-semibold text-sm text-gray-700">Email Address</Text>
                  <Text className="flex-1 font-semibold text-sm text-gray-700">Designation</Text>
                  <Text className="w-24 font-semibold text-sm text-gray-700 text-center">Role</Text>
                </View>
              </View>

              {/* User List */}
              <View className="bg-white rounded-b-lg shadow-sm">
                {roleManagementData.map((user, index) => (
                    <View
                        key={user.id}
                        className={`p-4 ${index !== roleManagementData.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <View className="flex-row items-center">
                        <Text className="flex-1 text-sm text-gray-800">{user.name}</Text>
                        <Text className="flex-1 text-sm text-gray-600">{user.email}</Text>
                        <Text className="flex-1 text-sm text-gray-600">{user.designation}</Text>
                        <View className="w-24 items-center">
                          <View className={`px-2 py-1 rounded-md ${getRoleColor(user.role)}`}>
                            <Text className="text-xs font-medium capitalize">{user.role}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                ))}
              </View>
            </View>
          </Container>
        </ScrollView>
        <AdminNavBar activeRoute="/DashboardScreen" />
      </SafeAreaView>
  );
}