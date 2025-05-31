import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Text, 
  View, 
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  position?: ToastPosition;
  description?: string;
}

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  description?: string;
}

// Toast component that will be rendered
const ToastComponent = ({ 
  message, 
  description,
  type = 'info', 
  duration = 3000, 
  onClose,
  position = 'top',
  visible 
}: ToastProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -50 : 50)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -50 : 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  // Get icon based on toast type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />;
      case 'error':
        return <Ionicons name="close-circle" size={20} color="#F44336" />;
      default:
        return <Ionicons name="information-circle" size={20} color="#2196F3" />;
    }
  };

  // Get position style
  const getPositionStyle = () => {
    return {
      [position]: 50,
    };
  };

  return (
    <Animated.View 
      className="absolute self-center bg-white rounded-[50px] py-2 px-4 flex-row items-center justify-center shadow-sm z-50"
      style={[
        { 
          opacity,
          transform: [{ translateY }],
          maxWidth: Dimensions.get('window').width - 80, // More compact width
          minWidth: 220, // Slightly smaller minimum width
          ...getPositionStyle(),
        }
      ]}
    >
      <TouchableWithoutFeedback onPress={hideToast}>
        <View className="flex-row items-center justify-center flex-1 relative pl-[18px] pr-[18px]">
          <View className="absolute left-0">
            {getIcon()}
          </View>
          <View className="items-center">
            <Text className="text-sm font-medium text-gray-800 text-center">{message}</Text>
            {description ? <Text className="text-xs text-gray-600 mt-0.5 text-center">{description}</Text> : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

// Toast manager to handle showing and hiding toasts
class ToastManager {
  static toastRef: React.RefObject<any> = React.createRef();

  static show(options: ToastOptions) {
    if (this.toastRef.current) {
      this.toastRef.current.show(options);
    }
  }

  static success(message: string, description?: string, duration?: number) {
    this.show({ message, description, type: 'success', duration });
  }

  static error(message: string, description?: string, duration?: number) {
    this.show({ message, description, type: 'error', duration });
  }

  static info(message: string, description?: string, duration?: number) {
    this.show({ message, description, type: 'info', duration });
  }

  static hide() {
    if (this.toastRef.current) {
      this.toastRef.current.hide();
    }
  }
}

// Toast container component to be rendered at the root of the app
export const ToastContainer = () => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);

  // Expose methods through ref
  React.useImperativeHandle(ToastManager.toastRef, () => ({
    show: (options: ToastOptions) => {
      setToast(options);
      setVisible(true);
    },
    hide: () => {
      setVisible(false);
    },
  }));

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible || !toast) return null;

  return (
    <ToastComponent
      visible={visible}
      message={toast.message}
      description={toast.description}
      type={toast.type}
      duration={toast.duration}
      position={toast.position}
      onClose={handleClose}
    />
  );
};

// Export the toast manager for use throughout the app
export const toast = ToastManager;