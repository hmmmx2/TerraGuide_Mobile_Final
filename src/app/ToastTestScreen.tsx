import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { toast } from '@/components/CustomToast';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminNavBar } from '@/components/AdminNavBar';

export default function ToastTestScreen() {
  const showSuccessToast = () => {
    toast.success('Payment processed.', 'Please see your orders.');
  };

  const showErrorToast = () => {
    toast.error('Login', 'Please login');
  };

  const showInfoToast = () => {
    toast.info('Toast info', 'Extra toast config');
  };

  const showCustomDurationToast = () => {
    toast.success('DONE', '100%', 5000);
  };

  const showBottomToast = () => {
    toast.show({
      message: 'BOTTOM',
      description: 'position="bottom"',
      type: 'info',
      position: 'bottom'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <View className="flex-1 p-4">
        <AdminHeader
          username="Admin"
          onDextAIPress={() => console.log('DextAI pressed')}
          onNotificationPress={() => console.log('Notification pressed')}
          onMenuPress={() => console.log('Menu pressed')}
        />

        <Text className="text-2xl font-bold mt-6 mb-2 text-gray-800">Toast Test Screen</Text>
        <Text className="text-base text-gray-600 mb-6">
          Tap the buttons below to test different toast notifications
        </Text>

        <View className="space-y-4">
          <TouchableOpacity 
            className="py-3 px-6 rounded-lg bg-[#4CAF50] items-center justify-center"
            onPress={showSuccessToast}
          >
            <Text className="text-white text-base font-medium">Show Success Toast</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-3 px-6 rounded-lg bg-[#F44336] items-center justify-center"
            onPress={showErrorToast}
          >
            <Text className="text-white text-base font-medium">Show Error Toast</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-3 px-6 rounded-lg bg-[#2196F3] items-center justify-center"
            onPress={showInfoToast}
          >
            <Text className="text-white text-base font-medium">Show Info Toast</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-3 px-6 rounded-lg bg-[#9C27B0] items-center justify-center"
            onPress={showCustomDurationToast}
          >
            <Text className="text-white text-base font-medium">Show 5-Second Toast</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 px-6 rounded-lg bg-[#FF9800] items-center justify-center"
            onPress={showBottomToast}
          >
            <Text className="text-white text-base font-medium">Show Bottom Toast</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AdminNavBar activeRoute="/ToastTestScreen" />
    </SafeAreaView>
  );
}