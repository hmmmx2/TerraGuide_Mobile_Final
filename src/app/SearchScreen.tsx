import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { SearchBar } from '@/components/SearchBar';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: number;
  title: string;
  description: string;
  type: 'course' | 'license' | 'mentor' | 'guide';
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchContent(searchQuery);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const searchContent = async (query: string) => {
    setLoading(true);
    try {
      // Search courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, course_name, course_description')
        .ilike('course_name', `%${query}%`)
        .limit(5);

      if (coursesError) throw coursesError;

      // Transform courses data
      const courseResults: SearchResult[] = (coursesData || []).map(course => ({
        id: course.id,
        title: course.course_name,
        description: course.course_description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
        type: 'course'
      }));

      // For demo purposes, add some guide results
      const guideResults: SearchResult[] = query.toLowerCase().includes('park') ? [
        {
          id: 101,
          title: 'Certificate Park Guide',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
          type: 'guide'
        },
        {
          id: 102,
          title: 'Introduction to Park Guide',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
          type: 'guide'
        },
        {
          id: 103,
          title: 'Advanced Park Guiding',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
          type: 'guide'
        },
        {
          id: 104,
          title: 'How to be a Park Guider',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
          type: 'guide'
        }
      ] : [];

      setResults([...courseResults, ...guideResults]);
    } catch (error) {
      console.error('Error searching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultPress = async (result: SearchResult) => {
    if (result.type === 'course') {
      try {
        // Fetch the complete course data
        const { data: courseData, error } = await supabase
          .from('courses')
          .select(`
            *,
            instructors:instructor_id (
              id,
              name,
              image_url
            )
          `)
          .eq('id', result.id)
          .single();
          
        if (error) throw error;
        
        // Transform the data to include instructor name
        const transformedCourse = {
          ...courseData,
          instructor_name: courseData.instructors?.name || 'Unknown Instructor',
          instructor_image_url: courseData.instructors?.image_url || null
        };
        
        // Navigate to course details with complete data
        router.push({
          pathname: '/CourseDetailsScreen',
          params: {
            courseData: encodeURIComponent(JSON.stringify(transformedCourse)),
          },
        });
      } catch (err) {
        console.error('Error fetching course details:', err);
        // Fallback to basic navigation with limited data if fetch fails
        router.push({
          pathname: '/CourseDetailsScreen',
          params: {
            courseData: encodeURIComponent(JSON.stringify({
              id: result.id,
              course_name: result.title,
              course_description: result.description
            })),
          },
        });
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F4] mt-12">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <FontAwesome5 name="arrow-left" size={20} color="#4E6E4E" />
        </TouchableOpacity>
        <View className="flex-1">
          <SearchBar
            placeholder="Search..."
            value={searchQuery}
            onSearch={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {searchQuery.trim() === '' ? (
          <View className="p-4">
            <Text className="text-gray-500 text-center">Start typing to search</Text>
          </View>
        ) : loading ? (
          <View className="p-4">
            <Text className="text-gray-500 text-center">Searching...</Text>
          </View>
        ) : results.length === 0 ? (
          <View className="p-4">
            <Text className="text-gray-500 text-center">No results found</Text>
          </View>
        ) : (
          <View>
            {results.map((result) => (
              <TouchableOpacity
                key={`${result.type}-${result.id}`}
                className="border-b border-gray-200 p-4"
                onPress={() => handleResultPress(result)}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-[#E6ECD6] rounded-full items-center justify-center mr-3">
                    <FontAwesome5 
                      name={
                        result.type === 'course' ? 'book' : 
                        result.type === 'license' ? 'certificate' : 
                        result.type === 'mentor' ? 'user-tie' : 'map-signs'
                      } 
                      size={16} 
                      color="#4E6E4E" 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">{result.title}</Text>
                    <Text className="text-gray-500 text-sm" numberOfLines={1}>{result.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}