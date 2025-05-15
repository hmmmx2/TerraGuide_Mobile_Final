import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { CourseCard } from '@/components/CourseCard';
import { router } from "expo-router";
import { UserNavBar } from '@/components/UserNavBar';
import { supabase } from "@/lib/supabase";
import { LicenseType, LicenseData } from "@/types/license";
import { Course } from "@/types/course";
import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';

// Remove the internal Course interface
export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState("currentCourse");
    const [courses, setCourses] = useState<Course[]>([]);
    const [licenses, setLicenses] = useState<LicenseData[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingLicenses, setLoadingLicenses] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace('/LoginScreen');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch courses
                const { data: coursesData, error: coursesError } = await supabase
                    .from('courses')
                    .select(`
                        *,
                        instructors:instructor_id (
                            id,
                            name,
                            image_url
                        )
                    `)
                    .limit(2);

                if (coursesError) throw coursesError;

                // Transform the data to include instructor name
                const transformedCoursesData = coursesData?.map(course => ({
                    ...course,
                    instructor_name: course.instructors?.name || 'Unknown Instructor',
                    instructor_image_url: course.instructors?.image_url || null
                })) || [];

                setCourses(transformedCoursesData);
                setLoadingCourses(false);

                // Fetch licenses
                const { data: licensesData, error: licensesError } = await supabase
                    .from('license_type')
                    .select('*')
                    .limit(2);

                if (licensesError) throw licensesError;

                // Transform the data to match the LicenseData interface
                const transformedLicensesData = licensesData?.map(license => ({
                    id: license.id,
                    title: license.name,
                    organization: license.organizer,
                    duration: `${license.duration_hours} hours`,
                    validity: "5 years", // Default value
                    exam_duration: 60, // Default value
                    image_url: license.image_url,
                    requirements: [
                        { id: 1, title: "Complete Introduction to Park Guide", completed: true, type: "course" as const },
                        { id: 2, title: "Complete Mentoring Program", completed: false, type: "mentoring" as const },
                    ]
                })) || [];

                setLicenses(transformedLicensesData);
                setLoadingLicenses(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
                setLoadingCourses(false);
                setLoadingLicenses(false);
            }
        }

        fetchData();
    }, []);

    return (
        <View className="flex-1 bg-[#F6F9F4]">
            <ScrollView>
                {/* Header */}
                <View className="w-full p-4">
                    <View className="items-center mt-4">
                        {/* Profile Image */}
                        <Image
                            source={require(
                                '../../assets/images/profile_pic.jpg'
                            )}
                            className="w-24 h-24 rounded-full mb-2"
                            resizeMode="cover"
                        />
                        {/* Username */}
                        <Text className="text-lg font-semibold text-[#3F3D56]">
                            Mr. Bean
                        </Text>
                        {/* Edit Profile */}
                        <TouchableOpacity
                            onPress={() => router.push('../EditProfileScreen')}
                            className="mt-2"
                        >
                            <Text className="text-[#4E6E4E] text-sm font-medium">
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                        
                        {/* Logout Button */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="mt-4 flex-row items-center"
                        >
                            <Ionicons name="log-out-outline" size={18} color="#E74C3C" />
                            <Text className="text-[#E74C3C] text-sm font-medium ml-1">
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Current Course & License Section */}
                {/* Tabs Navigation */}
                <View className="px-4 pt-4">
                    <View className="flex-row border-b border-gray-300">
                        <TouchableOpacity
                            onPress={() => setActiveTab('currentCourse')}
                            className={`flex-1 p-2 ${activeTab === 'currentCourse' ? 'border-b-2 border-[#4E6E4E]' : ''}`}
                        >
                            <Text className={`text-center ${activeTab === 'currentCourse' ? 'font-bold text-[#4E6E4E]' : 'text-gray-600'}`}>
                                Current Course
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('license')}
                            className={`flex-1 p-2 ${activeTab === 'license' ? 'border-b-2 border-[#4E6E4E]' : ''}`}
                        >
                            <Text className={`text-center ${activeTab === 'license' ? 'font-bold text-[#4E6E4E]' : 'text-gray-600'}`}>
                                License
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tab Content */}
                <View className="px-4 py-4">
                    {/* Loading State */}
                    {((activeTab === 'currentCourse' && loadingCourses) || (activeTab === 'license' && loadingLicenses)) && (
                        <View className="py-10 items-center">
                            <ActivityIndicator size="small" color="#4E6E4E" />
                            <Text className="mt-2 text-gray-600">Loading {activeTab === 'currentCourse' ? 'courses' : 'licenses'}...</Text>
                        </View>
                    )}

                    {/* Error State */}
                    {error && (
                        <View className="py-6 items-center">
                            <Text className="text-red-500">{error}</Text>
                        </View>
                    )}

                    {/* Current Course Section */}
                    {activeTab === 'currentCourse' && !loadingCourses && !error && (
                        <View className="flex-row flex-wrap justify-between">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <View key={course.id} className="mb-4" style={{ width: "48%" }}>
                                        <CourseCard
                                            image={{ uri: course.course_image_url }}
                                            title={course.course_name}
                                            author={`${course.instructor_name} | Park Ranger`}
                                            rating={course.average_rating}
                                            numberOfStudents={course.student_count}
                                            onPress={() => router.push({
                                                pathname: '/CourseDetailsScreen',
                                                params: {
                                                    courseData: encodeURIComponent(JSON.stringify(course)),
                                                },
                                            })}
                                        />
                                    </View>
                                ))
                            ) : (
                                <Text className="text-gray-500 text-center w-full py-4">No courses found</Text>
                            )}
                        </View>
                    )}

                    {/* License Section */}
                    {activeTab === 'license' && !loadingLicenses && !error && (
                        <View className="flex-row flex-wrap justify-between">
                            {licenses.length > 0 ? (
                                licenses.map((license) => (
                                    <View key={license.id} className="mb-4" style={{ width: "48%" }}>
                                        <CourseCard
                                            image={license.image_url ? { uri: license.image_url } : require("../../assets/images/SFC-pic.png")}
                                            title={license.title}
                                            author={`Mr Bean | Park Guide`}
                                            organizer={license.organization}
                                            onPress={() => router.push({
                                                pathname: '/LicenseDetailsScreen',
                                                params: {
                                                    licenseData: encodeURIComponent(JSON.stringify(license)),
                                                },
                                            })}
                                        />
                                    </View>
                                ))
                            ) : (
                                <Text className="text-gray-500 text-center w-full py-4">No licenses found</Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
            <UserNavBar activeRoute="/ProfileScreen" />
        </View>
    );
}
