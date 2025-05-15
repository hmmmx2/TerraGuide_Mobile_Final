import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { CourseCard } from "@/components/CourseCard";
import BackButton from "@/components/BackButton";
import { UserNavBar } from "@/components/UserNavBar";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { MentorProgram } from "@/types/mentorProgram";

// Remove the internal interface definition since we're importing it

export default function MentorProgrammeScreen() {
  const [mentorPrograms, setMentorPrograms] = useState<MentorProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMentorPrograms() {
      try {
        const { data, error } = await supabase
          .from('mentor_programs')
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
        const transformedData = data?.map(program => ({
          ...program,
          instructor_name: program.instructors?.name || 'Unknown Instructor',
          instructor_image_url: program.instructors?.image_url || null
        })) || [];

        setMentorPrograms(transformedData);
      } catch (err) {
        console.error('Error fetching mentor programs:', err);
        setError('Failed to load mentor programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchMentorPrograms();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F4] p-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Back Button and Title */}
        <View className="flex-row items-center mt-6 mb-4 px-4">
          <BackButton />
        </View>
        <Text className="text-2xl font-bold px-4 mb-2">Mentor Programme</Text>
        <View className="border-b border-gray-300 mx-4 mb-4" />

        {/* Loading State */}
        {loading && (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#4E6E4E" />
            <Text className="mt-2 text-gray-600">Loading mentor programs...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className="px-4 py-6 items-center">
            <Text className="text-red-500">{error}</Text>
          </View>
        )}

        {/* Grid of Mentor Program Cards */}
        {!loading && !error && (
          <View className="flex-row flex-wrap justify-between px-4">
            {mentorPrograms.length > 0 ? (
              mentorPrograms.map((program) => (
                <View key={program.id} className="mb-4" style={{ width: "48%" }}>
                  <CourseCard
                    image={program.image_url ? { uri: program.image_url } : require("../../assets/images/ParkGuideInTraining.png")}
                    title={program.program_name}
                    rating={program.average_rating}
                    numberOfStudents={program.student_count}
                    author={`${program.instructor_name} | Park Guide`}
                    tag={program.fees === 0 ? "Free" : `RM${program.fees}`}
                    onPress={() => router.push({
                      pathname: '/CourseDetailsScreen',
                      params: {
                        courseData: encodeURIComponent(JSON.stringify(program)),
                      },
                    })}
                  />
                </View>
              ))
            ) : (
              <Text className="text-gray-500 text-center w-full py-4">No mentor programs found</Text>
            )}
            {/* Coming Soon Card */}
            <View className="mb-4" style={{ width: "48%" }}>
              <ComingSoonCard />
            </View>
          </View>
        )}
      </ScrollView>
      <UserNavBar activeRoute="/CourseScreen" />
    </SafeAreaView>
  );
}