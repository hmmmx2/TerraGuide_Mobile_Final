import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { FontAwesome5 } from '@expo/vector-icons';
import NotificationIcon from '../../assets/icons/notification.svg';
import SearchIcon from '../../assets/icons/search.svg';
import { CourseCard } from '@/components/CourseCard';
import { UserNavBar } from '@/components/UserNavBar';
import { useRouter } from "expo-router";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { supabase } from "@/lib/supabase";
import {LicenseData} from "@/types/license";
import { Course } from "@/types/course";
import { MentorProgram } from "@/types/mentorProgram";
// import { SearchBar } from '@/components/SearchBar';
// import AnimatedSearchBar from '@/components/AnimatedSearchBar';

type SectionHeaderProps = { title: string; onPress?: () => void }
const SectionHeader = ({ title, onPress }: SectionHeaderProps) => (
    <View className="flex-row justify-between items-center px-4 mt-6 mb-2">
        <Text className="text-2xl font-bold">{title}</Text>
        <TouchableOpacity onPress={onPress} disabled={!onPress}>
            <Text className={`text-base ${onPress ? "text-[#6D7E5E]" : "text-gray-400"}`}>View all</Text>
        </TouchableOpacity>
    </View>
);

export default function CourseScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [mentorPrograms, setMentorPrograms] = useState<MentorProgram[]>([]);
    const [licenses, setLicenses] = useState<LicenseData[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingMentors, setLoadingMentors] = useState(true);
    const [loadingLicenses, setLoadingLicenses] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch courses with instructor data
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
                    .order('id')
                    .limit(5);

                if (coursesError) throw coursesError;
                
                // Transform the data to include instructor name
                const transformedCoursesData = coursesData?.map(course => ({
                  ...course,
                  instructor_name: course.instructors?.name || 'Unknown Instructor',
                  instructor_image_url: course.instructors?.image_url || null
                })) || [];
                
                setCourses(transformedCoursesData);
                setLoadingCourses(false);

                // Fetch mentor programs with instructor data
                const { data: mentorsData, error: mentorsError } = await supabase
                    .from('mentor_programs')
                    .select(`
                      *,
                      instructors:instructor_id (
                        id,
                        name,
                        image_url
                      )
                    `)
                    .order('id')
                    .limit(5);

                if (mentorsError) throw mentorsError;
                
                // Transform the data to include instructor name
                const transformedMentorsData = mentorsData?.map(program => ({
                  ...program,
                  instructor_name: program.instructors?.name || 'Unknown Instructor',
                  instructor_image_url: program.instructors?.image_url || null
                })) || [];
                
                setMentorPrograms(transformedMentorsData);
                setLoadingMentors(false);

                // Fetch licenses
                const { data: licensesData, error: licensesError } = await supabase
                    .from('license_type')
                    .select('*')
                    .order('id')
                    .limit(3);

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
                setLoadingMentors(false);
                setLoadingLicenses(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        // Filter courses based on search query
        if (searchQuery.trim() === '') {
            setFilteredCourses(courses);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = courses.filter(course => 
                course.course_name.toLowerCase().includes(query) ||
                course.instructor_name.toLowerCase().includes(query)
            );
            setFilteredCourses(filtered);
        }
    }, [searchQuery, courses]);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    return (
        <View className="flex-1 bg-[#F6F9F4]">
            <ScrollView showsVerticalScrollIndicator={false} className="px-0">
                {/* Header */}
                <View className="flex-row justify-between items-center px-4 mb-4 mt-6">
                    <View className="flex-row items-center">
                        <Image source={require('../../assets/images/profile_pic.jpg')} className="w-10 h-10 rounded-full mr-3" />
                        <View>
                            <Text className="text-xs text-[#4E6E4E]">Welcome Back</Text>
                            <Text className="text-base font-bold">Mr Bean</Text>
                        </View>
                    </View>
                    <View className="flex-row space-x-4 items-center">
                        {/* <AnimatedSearchBar onSearch={handleSearch} placeholder="Search courses..." /> */}
                        {/* Replace AnimatedSearchBar with search icon */}
                        <TouchableOpacity 
                            onPress={() => router.push('/SearchScreen')}
                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        >
                            <SearchIcon width={20} height={20} color="#6D7E5E" />
                        </TouchableOpacity>
                        <TouchableOpacity className="mr-3">
                            <NotificationIcon width={23} height={23} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Comment out the old search bar section */}
                {/* <View className="px-4 mb-4">
                    <SearchBar 
                        placeholder="Search courses..." 
                        onSearch={handleSearch}
                        value={searchQuery}
                    />
                </View> */}

                {/* Progress Summary */}
                <View className="bg-[#4E6E4E] rounded-2xl mx-4 py-8 px-5 mb-2">
                    <View className="flex-row justify-between items-start">
                        <Text className="text-white font-bold text-xrl">PROGRESS SUMMARY</Text>
                        <Text className="text-white text-6xl font-bold">80%</Text>
                    </View>
                    <View className="flex-row items-center mt-3">
                        <View>
                            <Text className="text-white text-sm font-bold">
                                Current Course: <Text className="underline">Introduction to Park Gu...</Text>
                            </Text>
                            <Text className="text-white text-sm mt-1">Hurry up! Keep making progress.</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-[#6D7E5E] rounded-full px-6 py-2 self-end mt-3">
                        <Text className="text-white font-bold">CONTINUE</Text>
                    </TouchableOpacity>
                </View>


                {/* Online Course Section */}
                <SectionHeader
                    title="Online Course"
                    onPress={() => router.push("/OnlineCourseScreen")}
                />
                {/* Divider */}
                <View className="h-px bg-gray-300 mx-4 mb-4" />

                {/* Loading State for Courses */}
                {loadingCourses ? (
                    <View className="py-10 items-center">
                        <ActivityIndicator size="small" color="#4E6E4E" />
                        <Text className="mt-2 text-gray-600">Loading courses...</Text>
                    </View>
                ) : error ? (
                    <View className="py-6 items-center">
                        <Text className="text-red-500">{error}</Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
                        <View className="flex-row">
                            {courses.length > 0 ? (
                                <>
                                    {courses.map((course) => (
                                        <View key={course.id} className="mr-4">
                                            <CourseCard
                                                image={{ uri: course.course_image_url.trim() }}
                                                title={course.course_name}
                                                rating={course.average_rating}
                                                numberOfStudents={course.student_count}
                                                author={`${course.instructor_name}`}
                                                tag={course.fees === 0 ? "Free" : `RM${course.fees}`}
                                                onPress={() => router.push({
                                                    pathname: '/CourseDetailsScreen',
                                                    params: {
                                                        courseData: encodeURIComponent(JSON.stringify(course)),
                                                    },
                                                })}
                                            />
                                        </View>
                                    ))}
                                    {/* Add just one Coming Soon card if less than 5 courses */}
                                    {courses.length < 5 && (
                                        <View className="mr-4">
                                            <ComingSoonCard />
                                        </View>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Text className="text-gray-500 py-4 mr-4">No courses found</Text>
                                    {/* Add one Coming Soon card if no courses */}
                                    <View className="pr-4">
                                        <ComingSoonCard />
                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>
                )}


                {/* License Section */}
                <SectionHeader
                    title="License"
                    onPress={() => router.push("/LicenseScreen")}
                />
                {/* Divider */}
                <View className="h-px bg-gray-300 mx-4 mb-4" />

                {/* Loading State for Licenses */}
                {loadingLicenses ? (
                    <View className="py-10 items-center">
                        <ActivityIndicator size="small" color="#4E6E4E" />
                        <Text className="mt-2 text-gray-600">Loading licenses...</Text>
                    </View>
                ) : error ? (
                    <View className="py-6 items-center">
                        <Text className="text-red-500">{error}</Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
                        <View className="flex-row">
                            {licenses.length > 0 ? (
                                <>
                                    {licenses.map((license) => (
                                        <View key={license.id} className="mr-4">
                                            <CourseCard
                                                image={license.image_url ? { uri: license.image_url } : require("../../assets/images/SFC-pic.png")}
                                                title={license.title}
                                                organizer={license.organization}
                                                onPress={() => router.push({
                                                    pathname: '/LicenseDetailsScreen',
                                                    params: {
                                                        licenseData: encodeURIComponent(JSON.stringify(license)),
                                                    },
                                                })}
                                            />
                                        </View>
                                    ))}
                                    {/* Add just one Coming Soon card if less than 5 license */}
                                    {licenses.length < 5 && (
                                        <View className="mr-4">
                                            <ComingSoonCard />
                                        </View>
                                    )}
                                </>
                            ) : (
                                <Text className="text-gray-500 py-4 px-2">No licenses found</Text>
                            )}
                        </View>
                    </ScrollView>
                )}

                {/* Mentor Programme Section */}
                <SectionHeader
                    title="Mentor Programme"
                    onPress={() => router.push("/MentorProgrammeScreen")}
                />
                {/* Divider */}
                <View className="h-px bg-gray-300 mx-4 mb-3" />

                {/* Loading State for Mentor Programs */}
                {loadingMentors ? (
                    <View className="py-10 items-center">
                        <ActivityIndicator size="small" color="#4E6E4E" />
                        <Text className="mt-2 text-gray-600">Loading mentor programs...</Text>
                    </View>
                ) : error ? (
                    <View className="py-6 items-center">
                        <Text className="text-red-500">{error}</Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 mb-4">
                        <View className="flex-row">
                            {mentorPrograms.length > 0 ? (
                                <>
                                    {mentorPrograms.map((program) => (
                                        <View key={program.id} className="mr-4">
                                            <CourseCard
                                                image={program.image_url ? { uri: program.image_url } : require('../../assets/images/ParkGuideInTraining.png')}
                                                title={program.program_name}
                                                rating={program.average_rating}
                                                numberOfStudents={program.student_count}
                                                author={`${program.instructor_name}`}
                                                tag={program.fees === 0 ? "Free" : `RM${program.fees}`}
                                                onPress={() => router.push({
                                                    pathname: '/CourseDetailsScreen',
                                                    params: {
                                                        courseData: encodeURIComponent(JSON.stringify(program)),
                                                    },
                                                })}
                                            />
                                        </View>
                                    ))}
                                    {/* Add just one Coming Soon card if less than 5 mentor programs */}
                                    {mentorPrograms.length < 5 && (
                                        <View className="mr-4">
                                            <ComingSoonCard />
                                        </View>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Text className="text-gray-500 py-4 mr-4">No mentor programs found</Text>
                                    {/* Add one Coming Soon card if no mentor programs */}
                                    <View className="pr-4">
                                        <ComingSoonCard/>
                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>
                )}
            </ScrollView>
            <UserNavBar activeRoute="/CourseScreen" />
        </View>
    );
}
