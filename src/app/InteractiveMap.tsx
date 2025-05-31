import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { BottomSheetModalProvider, BottomSheetModal, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Place {
    id: string;
    name: string;
    lat: number;
    lng: number;
    image: string;
    description: string;
}

const popularPlaces = [
    {
        id: '1',
        name: 'Park 1',
        lat: 1.4017,
        lng: 110.3145,
        image: require("../../assets/images/map-park1.png"),
        description: 'Orangutan sanctuary with jungle trails'
    },
    {
        id: '2',
        name: 'Park 2',
        lat: 1.6124,
        lng: 110.1776,
        image: require("../../assets/images/map-park2.png"),
        description: 'Rainforest park with waterfalls and rare flora'
    },
];

export default function InteractiveMapScreen() {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['30%', '75%'], []);

    useEffect(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    return (
        <GestureHandlerRootView className="flex-1">
            <BottomSheetModalProvider>
                <SafeAreaView className="flex-1 bg-white">
                    {/* Header */}
                    <View className="flex-row items-center px-4 py-2 bg-white border-b border-gray-200">
                        <TouchableOpacity onPress={() => router.back()}>
                            <FontAwesome5 name="arrow-left" size={24} color="black" solid />
                        </TouchableOpacity>

                        <View className="flex-1 flex-row items-center ml-4 bg-gray-100 rounded-full px-3 py-2">
                            <FontAwesome5 name="search" size={18} color="gray" solid />
                            <TextInput
                                placeholder="Search locations..."
                                className="ml-2 flex-1 text-base"
                                placeholderTextColor="#6b7280"
                            />
                        </View>
                    </View>

                    {/* Map View */}
                    <View className="flex-1">
                        <MapView
                            className="flex-1"
                            style={{flex: 1}} // double assurance
                            initialRegion={{
                                latitude: 1.4017,
                                longitude: 110.3145,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                            mapType="hybrid"
                        >
                            {popularPlaces.map((place) => (
                                <Marker
                                    key={place.id}
                                    coordinate={{ latitude: place.lat, longitude: place.lng }}
                                    title={place.name}
                                />
                            ))}
                        </MapView>
                    </View>

                </SafeAreaView>
                {/* Bottom Sheet */}
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    index={0}
                    enablePanDownToClose={false}
                    backdropComponent={null}
                    handleComponent={() => (
                        <View className="pt-2 pb-1">
                            <View className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
                        </View>
                    )}

                >
                    <BottomSheetScrollView className="px-6 pb-6">
                        {/* Sheet Header */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-semibold">Popular Tourist Spot</Text>
                            <TouchableOpacity>
                                <View className="flex-row items-center">
                                    <Text className="text-[#4E6E4E] mr-1">See All</Text>
                                    <FontAwesome5 name="chevron-right" size={16} color="#4E6E4E" solid />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View className="border-b border-gray-200 mb-4" />

                        {/* Park List */}
                        {popularPlaces.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                className="flex-row mb-4"
                            >
                                <Image
                                    source={ item.image }
                                    className="w-16 h-16 rounded-full mr-4"
                                />
                                <View className="flex-1">
                                    <Text className="text-lg font-medium mb-1">{item.name}</Text>
                                    <Text className="text-gray-500 text-sm">{item.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </BottomSheetScrollView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}