import React, { SVGProps } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { toast } from '@/components/CustomToast';

import DashboardIcon from '../../assets/icons/dashboard.svg';
import DashboardIconFilled from '../../assets/icons/dashboard-filled.svg';
import DatabaseIcon from '../../assets/icons/database.svg';
import DatabaseIconFilled from '../../assets/icons/database-filled.svg';
import UserIcon from '../../assets/icons/user.svg';
import UserIconFilled from '../../assets/icons/user-filled.svg';
import LicenseIcon from '../../assets/icons/license.svg';
import LicenseIconFilled from '../../assets/icons/license-filled.svg';
import ContentIcon from '../../assets/icons/content.svg';
import ContentIconFilled from '../../assets/icons/content-filled.svg';

type TabItem = {
  label: string;
  icon: React.FC<SVGProps<SVGSVGElement> & { width?: number | string; height?: number | string }>;
  activeIcon: React.FC<SVGProps<SVGSVGElement> & { width?: number | string; height?: number | string }>;
  route: string;
};

const dashboardTabs: TabItem[] = [
  { label: 'Dashboard', icon: DashboardIcon, activeIcon: DashboardIconFilled, route: '/DashboardScreen' },
  { label: 'Database', icon: DatabaseIcon, activeIcon: DatabaseIconFilled, route: '/DatabaseScreen' },
  { label: 'User', icon: UserIcon, activeIcon: UserIconFilled, route: '/UserScreen' },
  { label: 'License', icon: LicenseIcon, activeIcon: LicenseIconFilled, route: '/LicenseScreen' },
  { label: 'Content', icon: ContentIcon, activeIcon: ContentIconFilled, route: '/ContentScreen' },
];

export const AdminNavBar = ({ activeRoute }: { activeRoute: string }) => {
  const router = useRouter();
  const { session } = useAuth();

  const handleNavigation = (route: string) => {
    console.log('File: AdminNavBar, Function: handleNavigation, Attempting to navigate to:', route);

    if (!session) {
      console.log('File: AdminNavBar, Function: handleNavigation, No session, Navigating to: LoginScreen');
      toast.info('Please log in to access this feature.');
      router.replace('/LoginScreen');
      return;
    }

    const userRole = session?.user?.user_metadata?.role?.toString().trim().toLowerCase();
    if (userRole !== 'admin' && userRole !== 'controller') {
      console.log('File: AdminNavBar, Function: handleNavigation, Blocked: Non-admin user, Role:', userRole || 'undefined');
      toast.info('This feature is only available for admins.');
      router.replace(userRole === 'parkguide' ? '/HomeParkGuideScreen' : '/HomeGuestScreen');
      return;
    }

    console.log('File: AdminNavBar, Function: handleNavigation, Navigating to:', route);
    router.replace(route);
    console.log('File: AdminNavBar, Function: handleNavigation, Navigation to', route, 'executed');
  };

  return (
      <View className="flex-row justify-around items-center h-16 bg-[#F6F9F4] border-t border-gray-200">
        {dashboardTabs.map((tab) => {
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