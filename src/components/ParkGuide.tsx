import React from 'react';
import { View } from 'react-native';
import { GuideItem, GuideTitle } from './GuideItem';

type GuideData = {
    id: string;
    name: string;
    description: string;
    imageUri: any;
};

type ParkGuideProps = {
    title: string;
    see_all: string;
    guides: GuideData[];
    onViewAllPress?: () => void;
    onGuidePress?: (guide: GuideData) => void;
};

export function ParkGuide({
                              title,
                              see_all,
                              guides,
                              onViewAllPress = () => {},
                              onGuidePress = () => {}
                          }: ParkGuideProps) {
    return (
        <View className="bg-[#F8FBF9] rounded-lg p-1">
            <GuideTitle
                title={title}
                see_all={see_all}
                see_all_color="#6D7E5E"
                onViewAllPress={onViewAllPress}
            />

            <View className="h-px bg-gray-300 mx-2 my-2"/>

            {guides.map((guide) => (
                <View key={guide.id}>
                    <GuideItem
                        name={guide.name}
                        description={guide.description}
                        imageUri={guide.imageUri}
                        onPress={() => onGuidePress(guide)}
                    />
                    {guide.id !== guides[guides.length - 1].id ? <View className="h-px bg-gray-200" /> : null}
                </View>
            ))}
        </View>
    );
}