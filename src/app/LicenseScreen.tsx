import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { CourseCard } from "@/components/CourseCard";
import BackButton from "@/components/BackButton";
import { UserNavBar } from "@/components/UserNavBar";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { LicenseType, LicenseData } from "@/types/license";

export default function LicenseScreen() {
    const router = useRouter();
    const [licenses, setLicenses] = useState<LicenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLicenses() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('license_type')
                    .select('*')
                    .order('id');

                if (error) {
                    throw error;
                }

                // Transform the data to match the LicenseData interface
                const transformedData = data?.map(license => ({
                    id: license.id,
                    title: license.name,
                    organization: license.organizer,
                    duration: `${license.duration_hours} hours`,
                    validity: "5 years", // Default value or could be added to the database
                    exam_duration: 60, // Default value or could be added to the database
                    image_url: license.image_url,
                    requirements: [
                        { id: 1, title: "Complete Introduction to Park Guide", completed: true, type: "course" as const },
                        { id: 2, title: "Complete Mentoring Program", completed: false, type: "mentoring" as const },
                    ]
                })) || [];

                setLicenses(transformedData);
            } catch (err) {
                console.error('Error fetching licenses:', err);
                setError('Failed to load licenses. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchLicenses();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F4] p-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {/* Back Button and Title */}
                <View className="flex-row items-center mt-6 mb-4 px-4">
                    <BackButton />
                </View>
                <Text className="text-2xl font-bold px-4 mb-2">License</Text>
                <View className="border-b border-gray-300 mx-4 mb-4" />

                {/* Loading State */}
                {loading && (
                    <View className="flex-1 justify-center items-center py-10">
                        <ActivityIndicator size="large" color="#4E6E4E" />
                        <Text className="mt-2 text-gray-600">Loading licenses...</Text>
                    </View>
                )}

                {/* Error State */}
                {error && (
                    <View className="px-4 py-6 items-center">
                        <Text className="text-red-500">{error}</Text>
                    </View>
                )}

                {/* Grid of License Cards */}
                {!loading && !error && (
                    <View className="flex-row flex-wrap justify-between px-4">
                        {licenses.length > 0 ? (
                            licenses.map((license) => (
                                <View key={license.id} className="mb-4" style={{ width: "48%" }}>
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
                            ))
                        ) : (
                            <Text className="text-gray-500 text-center w-full py-4">No licenses found</Text>
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