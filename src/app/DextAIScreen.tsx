import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {UserNavBar} from "@/components/UserNavBar";
import {router} from "expo-router";

export default function DextAIScreen() {
    return(
        <SafeAreaView className="flex-1 bg-[#F6F9F4] p-1">
            <View className="flex-1 justify-center items-center flex-col">

                <View className="flex-row">
                    <Text>Placeholder</Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/SurveyFormScreen")}>
                    <View className="flex-row">
                        <Text className="text-gray-400 underline">Click here to access the Survey Form</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <UserNavBar activeRoute="/DextAIScreen" />
        </SafeAreaView>
    );
};
