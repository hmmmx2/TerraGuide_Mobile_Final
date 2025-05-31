import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


interface CourseCardProps {
    image: ImageSourcePropType;
    title: string;
    tag?: string;
    rating?: number;
    numberOfStudents?: number;
    author?: string;
    organizer?: string;
    onPress?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    image,
    title,
    tag,
    rating,
    numberOfStudents,
    author,
    organizer,
    onPress,
}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View className="w-[160px] h-[248px] bg-[#E6ECD6] p-4 rounded-2xl shadow-md">
                {/* Course Image */}
                <View className="w-full max-h-[120px] rounded-lg overflow-hidden mb-3 relative">
                    <Image source={image} className="w-full h-full" resizeMode="cover" />
                    {tag && (
                        <View className="absolute bottom-1 right-1 bg-[#6D7E5E] px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] text-white font-medium">{tag}</Text>
                        </View>
                    )}
                </View>


                {/* Course Info */}
                <View className="flex-col">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-base font-semibold text-gray-900" numberOfLines={2} ellipsizeMode="tail">{title}</Text>
                    </View>

                    {rating !== undefined && numberOfStudents !== undefined && (
                        <View className="flex-row items-center space-x-2 mb-1">
                            <View className="flex-row items-center">
                                <FontAwesome5
                                    name="star"
                                    size={16}
                                    color="#FACC15"
                                    solid
                                />
                                <Text className="text-sm font-semibold text-yellow-500 ml-1">
                                    {rating.toFixed(1)}
                                </Text>
                            </View>
                            <Text className="text-sm text-gray-500">
                                | {numberOfStudents.toLocaleString()} Students
                            </Text>
                        </View>
                    )}

                    {author && <Text className="text-sm text-gray-600 mb-1" numberOfLines={1} ellipsizeMode="tail">{author} | Park Ranger</Text>}

                    {organizer && (
                        <View className="mt-1">
                            <Text className="text-sm text-gray-500" numberOfLines={1} ellipsizeMode="tail">
                                Organized by {organizer}
                            </Text>
                            <Text className="text-sm text-gray-500">Exam based</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};