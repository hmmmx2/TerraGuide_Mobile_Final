import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { CourseCard } from '@/components/CourseCard';
import { UserNavBar } from '@/components/UserNavBar';
import { useRouter } from 'expo-router';
import { ComingSoonCard } from '@/components/ComingSoonCard';
import { supabase } from '@/lib/supabase';
import { LicenseData } from '@/types/license';
import { Course } from '@/types/course';
import { MentorProgram } from '@/types/mentorProgram';
import { UserProfileHeader } from '@/components/UserProfileHeader';
import { Container } from '@/components/Container';
import { useAuth } from '@/context/AuthProvider';

type SectionHeaderProps = { title: string; onPress?: () => void };
const SectionHeader = ({ title, onPress }: SectionHeaderProps) => (
    <View className="flex-row justify-between items-center mt-6 mb-2">
        <Text className="text-2xl font-bold">{title}</Text>
        <TouchableOpacity onPress={onPress} disabled={!onPress}>
            <Text className={`text-base ${onPress ? 'text-[#6D7E5E]' : 'text-gray-400'}`}>View all</Text>
        </TouchableOpacity>
    </View>
);

export default function CourseScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [mentorPrograms, setMentorPrograms] = useState<MentorProgram[]>([]);
    const [licenses, setLicenses] = useState<LicenseData[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingMentors, setLoadingMentors] = useState(true);
    const [loadingLicenses, setLoadingLicenses] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isLoggedIn = !!session?.user;
    const userRole = isLoggedIn ? session?.user.user_metadata?.role?.toString().trim().toLowerCase() : 'guest';

    console.log('File: CourseScreen, Function: render, User Role:', userRole, 'IsLoggedIn:', isLoggedIn);

    useEffect(() => {
        async function fetchData() {
            try {
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

                const transformedCoursesData = coursesData?.map((course) => ({
                    ...course,
                    instructor_name: course.instructors?.name || 'Unknown Instructor',
                    instructor_image_url: course.instructors?.image_url || null,
                })) || [];

                setCourses(transformedCoursesData);
                setLoadingCourses(false);

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

                const transformedMentorsData = mentorsData?.map((program) => ({
                    ...program,
                    instructor_name: program.instructors?.name || 'Unknown Instructor',
                    instructor_image_url: program.instructors?.image_url || null,
                })) || [];

                setMentorPrograms(transformedMentorsData);
                setLoadingMentors(false);

                const { data: licensesData, error: licensesError } = await supabase
                    .from('license_type')
                    .select('*')
                    .order('id')
                    .limit(3);

                if (licensesError) throw licensesError;

                const transformedLicensesData = licensesData?.map((license) => ({
                    id: license.id,
                    title: license.name,
                    organization: license.organizer,
                    duration: `${license.duration_hours} hours`,
                    validity: '5 years',
                    exam_duration: 60,
                    image_url: license.image_url,
                    requirements: [
                        { id: 1, title: 'Complete Introduction to Park Guide', completed: true, type: 'course' as const },
                        { id: 2, title: 'Complete Mentoring Program', completed: false, type: 'mentoring' as const },
                    ],
                })) || [];

                setLicenses(transformedLicensesData);
                setLoadingLicenses(false);
            } catch (err) {
                console.error('File: CourseScreen, Function: fetchData, Error:', err);
                setError('Failed to load data. Please try again later.');
                setLoadingCourses(false);
                setLoadingMentors(false);
                setLoadingLicenses(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCourses(courses);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = courses.filter(
                (course) =>
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
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView showsVerticalScrollIndicator={false} className="px-0">
                <View className="py-6">
                    <Container>
                        <UserProfileHeader
                            isLoggedIn={isLoggedIn}
                        />
                        <View className="bg-[#4E6E4E] rounded-3xl py-8 px-5 mb-2 mt-6">
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
                        <SectionHeader title="Online Course" onPress={() => router.push('/OnlineCourseScreen')} />
                        <View className="h-px bg-gray-300 mb-4" />
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
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                                                        tag={course.fees === 0 ? 'Free' : `RM${course.fees}`}
                                                        onPress={() =>
                                                            router.push({
                                                                pathname: '/CourseDetailsScreen',
                                                                params: {
                                                                    courseData: encodeURIComponent(JSON.stringify(course)),
                                                                },
                                                            })
                                                        }
                                                    />
                                                </View>
                                            ))}
                                            {courses.length < 5 && (
                                                <View className="mr-4">
                                                    <ComingSoonCard />
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Text className="text-gray-500 py-4 mr-4">No courses found</Text>
                                            <View className="pr-4">
                                                <ComingSoonCard />
                                            </View>
                                        </>
                                    )}
                                </View>
                            </ScrollView>
                        )}
                        <SectionHeader title="License" onPress={() => router.push('/LicenseScreen')} />
                        <View className="h-px bg-gray-300 mb-4" />
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
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row">
                                    {licenses.length > 0 ? (
                                        <>
                                            {licenses.map((license) => (
                                                <View key={license.id} className="mr-4">
                                                    <CourseCard
                                                        image={
                                                            license.image_url
                                                                ? { uri: license.image_url }
                                                                : require('../../assets/images/SFC-pic.png')
                                                        }
                                                        title={license.title}
                                                        organizer={license.organization}
                                                        onPress={() =>
                                                            router.push({
                                                                pathname: '/LicenseDetailsScreen',
                                                                params: {
                                                                    licenseData: encodeURIComponent(JSON.stringify(license)),
                                                                },
                                                            })
                                                        }
                                                    />
                                                </View>
                                            ))}
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
                        <SectionHeader title="Mentor Programme" onPress={() => router.push('/MentorProgrammeScreen')} />
                        <View className="h-px bg-gray-300 mb-3" />
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
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
                                <View className="flex-row">
                                    {mentorPrograms.length > 0 ? (
                                        <>
                                            {mentorPrograms.map((program) => (
                                                <View key={program.id} className="mr-4">
                                                    <CourseCard
                                                        image={
                                                            program.image_url
                                                                ? { uri: program.image_url }
                                                                : require('../../assets/images/ParkGuideInTraining.png')
                                                        }
                                                        title={program.program_name}
                                                        rating={program.average_rating}
                                                        numberOfStudents={program.student_count}
                                                        author={`${program.instructor_name}`}
                                                        tag={program.fees === 0 ? 'Free' : `RM${program.fees}`}
                                                        onPress={() =>
                                                            router.push({
                                                                pathname: '/CourseDetailsScreen',
                                                                params: {
                                                                    courseData: encodeURIComponent(JSON.stringify(program)),
                                                                },
                                                            })
                                                        }
                                                    />
                                                </View>
                                            ))}
                                            {mentorPrograms.length < 5 && (
                                                <View className="mr-4">
                                                    <ComingSoonCard />
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Text className="text-gray-500 py-4 mr-4">No mentor programs found</Text>
                                            <View className="pr-4">
                                                <ComingSoonCard />
                                            </View>
                                        </>
                                    )}
                                </View>
                            </ScrollView>
                        )}
                    </Container>
                </View>
            </ScrollView>
            <UserNavBar activeRoute="/CourseScreen" />
        </SafeAreaView>
    );
}