import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedSearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
}

const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search...' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const animatedWidth = useRef(new Animated.Value(40)).current;
  const inputRef = useRef<TextInput>(null);

  const toggleSearch = () => {
    if (isExpanded) {
      // Collapse the search bar
      Animated.timing(animatedWidth, {
        toValue: 40,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setSearchText('');
        setIsExpanded(false);
      });
    } else {
      // Expand the search bar
      setIsExpanded(true);
      Animated.timing(animatedWidth, {
        toValue: 250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        inputRef.current?.focus();
      });
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width: animatedWidth },
        isExpanded ? styles.expandedContainer : null,
      ]}
    >
      {isExpanded ? (
        <>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={placeholder}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
            <Ionicons name="close" size={22} color="#868896" />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
          <Ionicons name="search" size={22} color="#868896" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  expandedContainer: {
    backgroundColor: '#E6ECD6',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    color: '#4E6E4E',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedSearchBar;