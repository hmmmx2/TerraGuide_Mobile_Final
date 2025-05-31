import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { CourseCard } from "@/components/CourseCard";
import BackButton from "@/components/BackButton";
import { UserNavBar } from "@/components/UserNavBar";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { supabase } from "@/lib/supabase";
import {router} from "expo-router";
import { Course } from "@/types/course";

export default function OnlineCourseScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            instructors:instructor_id (
              id,
              name,
              image_url
            )
          `)
          .order('id');

        if (error) {
          throw error;
        }

        // Transform the data to include instructor name
        const transformedData = data?.map(course => ({
          ...course,
          instructor_name: course.instructors?.name || 'Unknown Instructor',
          instructor_image_url: course.instructors?.image_url || null
        })) || [];

        setCourses(transformedData);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F4] p-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="py-10">
          {/* Back Button and Title */}
          <View className="flex-row items-center mt-6 mb-4 px-4">
            <BackButton />
          </View>
          <Text className="text-2xl font-bold px-4 mb-2">Online Course</Text>
          <View className="border-b border-gray-300 mx-4 mb-4" />

          {/* Loading State */}
          {loading && (
            <View className="flex-1 justify-center items-center py-10">
              <ActivityIndicator size="large" color="#4E6E4E" />
              <Text className="mt-2 text-gray-600">Loading courses...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View className="px-4 py-6 items-center">
              <Text className="text-red-500">{error}</Text>
            </View>
          )}

          {/* Grid of Course Cards */}
          {!loading && !error && (
            <View className="flex-row flex-wrap justify-between px-4">
              {courses.map((course) => (
                <View key={course.id} className="mb-4" style={{ width: "48%" }}>
                  <CourseCard
                    image={{ uri: course.course_image_url.trim() }}
                    title={course.course_name}
                    rating={course.average_rating}
                    numberOfStudents={course.student_count}
                    author={`${course.instructor_name} | Park Guide`}
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
              {/* Coming Soon Card */}
              <View className="mb-4" style={{ width: "48%" }}>
                <ComingSoonCard />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <UserNavBar activeRoute="/CourseScreen" />
    </SafeAreaView>
  );
}