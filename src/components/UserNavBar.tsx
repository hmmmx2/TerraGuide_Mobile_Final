import React, { SVGProps } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { toast } from '@/components/CustomToast';

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
  { label: 'Home', icon: HomeIcon, activeIcon: HomeIconFilled, route: '/HomeParkGuideScreen' },
  { label: 'Courses', icon: CourseIcon, activeIcon: CourseIconFilled, route: '/CourseScreen' },
  { label: 'Dext AI', icon: DextAIIcon, activeIcon: DextAIIconFilled, route: '/DextAIScreen' },
  { label: 'Profile', icon: ProfileIcon, activeIcon: ProfileIconFilled, route: '/ProfileScreen' },
];

export const UserNavBar = ({ activeRoute }: { activeRoute: string }) => {
  const router = useRouter();
  const { session } = useAuth();

  // Determine user role (guest if no session)
  const userRole = session?.user?.user_metadata?.role?.toString().trim().toLowerCase() || 'guest';
  const isGuest = !session?.user; // Guest is defined as no session

  console.log('File: UserNavBar, Function: render, User Role:', userRole, 'IsGuest:', isGuest);

  const handleNavigation = (route: string) => {
    console.log('File: UserNavBar, Function: handleNavigation, Attempting to navigate to:', route, 'User Role:', userRole);

    // Restrict guests from accessing Courses or Dext AI
    if (isGuest && (route === '/CourseScreen' || route === '/DextAIScreen')) {
      console.log('File: UserNavBar, Function: handleNavigation, Blocked: Guest access to restricted screen');
      toast.info('This feature is only available for Park Guides.');
      return;
    }

    // For profile navigation, direct guests to GuestProfileScreen
    if (route === '/ProfileScreen' && isGuest) {
      console.log('File: UserNavBar, Function: handleNavigation, Navigating to: GuestProfileScreen (guest user)');
      router.push('/GuestProfileScreen');
      console.log('File: UserNavBar, Function: handleNavigation, Navigation to GuestProfileScreen executed');
      return;
    }

    // For home navigation, ensure guests go to HomeGuestScreen
    if (route === '/HomeParkGuideScreen' && isGuest) {
      console.log('File: UserNavBar, Function: handleNavigation, Navigating to: HomeGuestScreen (guest user)');
      router.push('/HomeGuestScreen');
      console.log('File: UserNavBar, Function: handleNavigation, Navigation to HomeGuestScreen executed');
      return;
    }

    // Navigate to the selected route
    console.log('File: UserNavBar, Function: handleNavigation, Navigating to:', route);
    router.push(route);
    console.log('File: UserNavBar, Function: handleNavigation, Navigation to', route, 'executed');
  };

  return (
      <View className="flex-row justify-around items-center h-16 bg-[#F6F9F4] border-t border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeRoute === tab.route;
          const IconComponent = isActive ? tab.activeIcon : tab.icon;

          return (
              <TouchableOpacity
                  key={tab.route}
                  className="flex-1 items-center"
                  onPress={() => handleNavigation(tab.route)}
              >
                <IconComponent width={22} height={22} />
                <Text
                    className={`text-xs mt-1 ${isActive ? 'text-[#6D7E5E] font-bold' : 'text-gray-400'}`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
          );
        })}
      </View>
  );
};