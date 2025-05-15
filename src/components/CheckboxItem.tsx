import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxItemProps {
  isChecked: boolean;
  onToggle: () => void;
  label?: string;
  size?: number;
  checkColor?: string;
  borderColor?: string;
  containerStyle?: any;
  labelStyle?: any;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({
  isChecked,
  onToggle,
  label,
  size = 24,
  checkColor = '#6D7E5E',
  borderColor = '#6D7E5E',
  containerStyle,
  labelStyle,
}) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', ...containerStyle }}>
      <TouchableOpacity
        onPress={onToggle}
        style={{
          width: size,
          height: size,
          borderWidth: 1,
          borderColor: borderColor,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked && (
          <Ionicons name="checkmark" size={size * 0.5} color={checkColor} />
        )}
      </TouchableOpacity>
      
      {label && (
        <Text style={{ marginLeft: 8, ...labelStyle }}>{label}</Text>
      )}
    </View>
  );
};