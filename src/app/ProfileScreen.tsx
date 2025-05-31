import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { CourseCard } from '@/components/CourseCard';
import { router, useRouter } from "expo-router";
import { UserNavBar } from '@/components/UserNavBar';
import { supabase } from "@/lib/supabase";
import { LicenseData } from "@/types/license";
import { Course } from "@/types/course";
import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { toast } from "@/components/CustomToast";

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState("currentCourse");
    const [courses, setCourses] = useState<Course[]>([]);
    const [licenses, setLicenses] = useState<LicenseData[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingLicenses, setLoadingLicenses] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { signOut, session } = useAuth();
    const [userName, setUserName] = useState('User');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadUserData() {
            if (!session?.user) {
                console.log('File: ProfileScreen, Function: loadUserData, No session');
                return;
            }

            try {
                const userMetadata = session.user.user_metadata;
                // Set username from metadata
                setUserName(userMetadata?.username || userMetadata?.first_name || 'User');

                // Check if user is a park guide
                const userRole = userMetadata?.role?.toString().trim().toLowerCase();
                console.log('File: ProfileScreen, Function: loadUserData, User Role:', userRole);

                if (userRole === 'parkguide') {
                    // Fetch avatar_url from park_guides table
                    const { data, error } = await supabase
                        .from('park_guides')
                        .select('avatar_url')
                        .eq('supabase_uid', session.user.id)
                        .single();

                    if (error) {
                        console.error('File: ProfileScreen, Function: loadUserData, Error fetching park_guides:', error.message);
                        // No park_guides entry or error; use default avatar
                        setAvatarUrl(null);
                    } else if (data?.avatar_url && data.avatar_url.trim() !== '') {
                        // Use avatar_url if non-empty
                        console.log('File: ProfileScreen, Function: loadUserData, Avatar URL:', data.avatar_url);
                        setAvatarUrl(data.avatar_url);
                    } else {
                        // Empty or null avatar_url; use default
                        console.log('File: ProfileScreen, Function: loadUserData, No valid avatar_url');
                        setAvatarUrl(null);
                    }
                } else {
                    // Guest or other role; use default avatar
                    console.log('File: ProfileScreen, Function: loadUserData, Using default avatar for role:', userRole);
                    setAvatarUrl(null);
                }
            } catch (err: any) {
                console.error('File: ProfileScreen, Function: loadUserData, Unexpected error:', err.message);
                setAvatarUrl(null); // Fallback to default avatar
            }
        }

        loadUserData();
    }, [session]);

    const handleLogout = async () => {
        try {
            await signOut(router);
        } catch (error: any) {
            console.error('File: ProfileScreen, Function: handleLogout, Error:', error.message);
            toast.error('Failed to log out. Please try again.');
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

                const transformedLicensesData = licensesData?.map(license => ({
                    id: license.id,
                    title: license.name,
                    organization: license.organizer,
                    duration: `${license.duration_hours} hours`,
                    validity: "5 years",
                    exam_duration: 60,
                    image_url: license.image_url,
                    requirements: [
                        { id: 1, title: "Complete Introduction to Park Guide", completed: true, type: "course" as const },
                        { id: 2, title: "Complete Mentoring Program", completed: false, type: "mentoring" as const },
                    ]
                })) || [];

                setLicenses(transformedLicensesData);
                setLoadingLicenses(false);
            } catch (err) {
                console.error('File: ProfileScreen, Function: fetchData, Error:', err);
                setError('Failed to load data. Please try again later.');
                setLoadingCourses(false);
                setLoadingLicenses(false);
            }
        }

        fetchData();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <View className="py-8">
                    {/* Header */}
                    <View className="w-full p-4 mt-8">
                        <View className="items-center mt-4">
                            <Image
                                source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/Guest-Profile.png')}
                                className="w-24 h-24 rounded-full mb-2"
                                resizeMode="cover"
                            />
                            <Text className="text-lg font-semibold text-[#3F3D56]">
                                {userName}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('../EditProfileScreen')}
                                className="mt-2"
                            >
                                <Text className="text-[#4E6E4E] text-sm font-medium">
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>
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

                    <View className="px-4 py-4">
                        {((activeTab === 'currentCourse' && loadingCourses) || (activeTab === 'license' && loadingLicenses)) && (
                            <View className="py-10 items-center">
                                <ActivityIndicator size="small" color="#4E6E4E" />
                                <Text className="mt-2 text-gray-600">Loading {activeTab === 'currentCourse' ? 'courses' : 'licenses'}...</Text>
                            </View>
                        )}

                        {error && (
                            <View className="py-6 items-center">
                                <Text className="text-red-500">{error}</Text>
                            </View>
                        )}

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
                </View>
            </ScrollView>
            <UserNavBar activeRoute="/ProfileScreen" />
        </SafeAreaView>
    );
}