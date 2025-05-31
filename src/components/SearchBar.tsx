import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import SearchIcon from '../../assets/icons/search.svg';
import { FontAwesome5 } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  value?: string;
  style?: object;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  onClear,
  value: externalValue,
  style,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = externalValue !== undefined ? externalValue : internalValue;

  const handleChangeText = (text: string) => {
    if (externalValue === undefined) {
      setInternalValue(text);
    }
    if (onSearch) {
      onSearch(text);
    }
  };

  const handleClear = () => {
    if (externalValue === undefined) {
      setInternalValue('');
    }
    if (onClear) {
      onClear();
    } else if (onSearch) {
      onSearch('');
    }
  };

  return (
    <View className="flex-row items-center bg-[#E6ECD6] rounded-full px-4 py-2" style={style}>
      <SearchIcon width={20} height={20} color="#6D7E5E" />
      <TextInput
        className="flex-1 ml-2 text-[#4E6E4E]"
        placeholder={placeholder}
        placeholderTextColor="#91A088"
        value={value}
        onChangeText={handleChangeText}
      />
      {value ? (
        <TouchableOpacity onPress={handleClear}>
          <FontAwesome5 name="times-circle" size={16} color="#6D7E5E" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};