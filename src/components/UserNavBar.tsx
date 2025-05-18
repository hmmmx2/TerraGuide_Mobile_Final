import React, {SVGProps} from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

// Import SVG components
import HomeIcon from '../../assets/icons/home.svg';
import HomeIconFilled from '../../assets/icons/home-filled.svg';
import CourseIcon from '../../assets/icons/ballot.svg';
import CourseIconFilled from '../../assets/icons/ballot-filled.svg';
import DextAIIcon from '../../assets/icons/artificial-intelligence.svg';
import DextAIIconFilled from '../../assets/icons/artificial-intelligence-filled.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import ProfileIconFilled from '../../assets/icons/profile-filled.svg';

type TabItem = {
  label: string;
  icon: React.FC<SVGProps<SVGSVGElement> & { width?: number | string; height?: number | string }>;
  activeIcon: React.FC<SVGProps<SVGSVGElement> & { width?: number | string; height?: number | string }>;
  route: string;
};

const tabs: TabItem[] = [
  {
    label: "Home",
    icon: HomeIcon,
    activeIcon: HomeIconFilled,
    route: "/HomeParkGuideScreen",
  },
  {
    label: "Courses",
    icon: CourseIcon,
    activeIcon: CourseIconFilled,
    route: "/CourseScreen",
  },
  {
    label: "Dext AI",
    icon: DextAIIcon,
    activeIcon: DextAIIconFilled,
    route: "/DextAIScreen",
  },
  {
    label: "Profile",
    icon: ProfileIcon,
    activeIcon: ProfileIconFilled,
    route: "/ProfileScreen",
  },
];

export const UserNavBar = ({ activeRoute }: { activeRoute: string }) => {
  const router = useRouter();

  return (
    <View className="flex-row justify-around items-center h-16 bg-[#F6F9F4] border-t border-gray-200">
      {tabs.map((tab) => {
        const isActive = activeRoute === tab.route;
        const IconComponent = isActive ? tab.activeIcon : tab.icon;

        return (
            <TouchableOpacity
                key={tab.route}
                className="flex-1 items-center"
                onPress={() => router.push(tab.route as any)}
            >
              <IconComponent width={22} height={22} />
              <Text
                  className={`text-xs mt-1 ${
                      isActive ? "text-[#6D7E5E] font-bold" : "text-gray-400"
                  }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
        );
      })}
    </View>
  );
};
