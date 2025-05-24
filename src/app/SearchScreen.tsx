import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { SearchBar } from '@/components/SearchBar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Course } from '@/types/course';
import { useAuth } from '@/context/AuthProvider';
import { BlogPost, blogs } from '@/data/blogs';
import { ParkGuide, parkGuides } from '@/data/parkguides';
import { Timetable, timetables } from '@/data/timetables';

type FilterType = 'all' | 'courses' | 'blogs' | 'guides' | 'timetables';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogsResults, setBlogsResults] = useState<BlogPost[]>([]);
  const [guides, setGuides] = useState<ParkGuide[]>([]);
  const [timetablesResults, setTimetablesResults] = useState<Timetable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { session } = useAuth();

  // Check if user is a guest
  const isGuest = !session?.user || session.user.user_metadata?.role === 'guest';

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch();
    } else {
      setCourses([]);
      setBlogsResults([]);
      setGuides([]);
      setTimetablesResults([]);
    }
  }, [searchQuery, activeFilter]);

  const performSearch = async () => {
    setIsLoading(true);

    try {
      if (activeFilter === 'all' || activeFilter === 'courses') {
        const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select(`
            *,
            instructors:instructor_id (
              id,
              name,
              image_url
            )
          `)
            .ilike('course_name', `%${searchQuery}%`);

        if (!coursesError && coursesData) {
          const transformedCoursesData = coursesData.map(course => ({
            ...course,
            instructor_name: course.instructors?.name || 'Unknown Instructor',
            instructor_image_url: course.instructors?.image_url || null,
          }));
          setCourses(transformedCoursesData);
        }
      }

      if (activeFilter === 'all' || activeFilter === 'blogs') {
        const filteredBlogs = blogs.filter(
            blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (blog.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
        );
        setBlogsResults(filteredBlogs);
      }

      if (activeFilter === 'all' || activeFilter === 'guides') {
        const filteredGuides = parkGuides.filter(
            guide =>
                guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guide.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (guide.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
        );
        setGuides(filteredGuides);
      }

      if (activeFilter === 'all' || activeFilter === 'timetables') {
        const filteredTimetables = timetables.filter(
            timetable =>
                timetable.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (timetable.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
        );
        setTimetablesResults(filteredTimetables);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setCourses([]);
    setBlogsResults([]);
    setGuides([]);
    setTimetablesResults([]);
  };

  const navigateBack = () => {
    router.back();
  };

  const renderFilterButtons = () => {
    let filters: { label: string; value: FilterType }[];

    if (isGuest) {
      filters = [
        { label: 'All', value: 'all' },
        { label: 'Blogs', value: 'blogs' },
        { label: 'Park Guides', value: 'guides' },
        { label: 'Timetables', value: 'timetables' },
      ];
    } else {
      filters = [
        { label: 'All', value: 'all' },
        { label: 'Courses', value: 'courses' },
        { label: 'Blogs', value: 'blogs' },
        { label: 'Park Guides', value: 'guides' },
        { label: 'Timetables', value: 'timetables' },
      ];
    }

    return (
        <View className="px-3 py-2 h-14" style={{ flexShrink: 0 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {filters.map(filter => (
                <TouchableOpacity
                    key={filter.value}
                    className={`px-4 py-2 rounded-full mx-1 h-10 justify-center ${
                        activeFilter === filter.value ? 'bg-[#6D7E5E]' : 'bg-[#F0F0F0]'
                    }`}
                    onPress={() => setActiveFilter(filter.value)}
                >
                  <Text
                      className={`text-sm font-medium ${
                          activeFilter === filter.value ? 'text-white' : 'text-gray-700'
                      }`}
                      style={{ lineHeight: 18 }}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
    );
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return (
          <View className="h-[200px] flex justify-center items-center bg-[#F8F9FA]">
            <Text className="text-base text-gray-500 text-center">Searching...</Text>
          </View>
      );
    }

    if (searchQuery.length < 3) {
      return (
          <View className="h-[200px] flex justify-center items-center bg-[#F8F9FA]">
            <Text className="text-base text-gray-500 text-center">
              Enter at least 3 characters to search
            </Text>
          </View>
      );
    }

    const hasResults =
        (activeFilter === 'all' &&
            (courses.length > 0 ||
                blogsResults.length > 0 ||
                guides.length > 0 ||
                timetablesResults.length > 0)) ||
        (activeFilter === 'courses' && courses.length > 0) ||
        (activeFilter === 'blogs' && blogsResults.length > 0) ||
        (activeFilter === 'guides' && guides.length > 0) ||
        (activeFilter === 'timetables' && timetablesResults.length > 0);

    if (!hasResults) {
      return (
          <View className="h-[200px] flex justify-center items-center bg-[#F8F9FA]">
            <Text className="text-base text-gray-500 text-center">
              {`No results found for "${searchQuery}"`}
            </Text>
          </View>
      );
    }

    return (
        <ScrollView className="flex-1 px-4">
          <View className="pt-8 pb-4">
            {/* Courses Section - Only show for non-guest users */}
            {!isGuest && (activeFilter === 'all' || activeFilter === 'courses') && courses.length > 0 && (
                <View className="mb-6">
                  <Text className="text-lg font-bold mb-3 text-gray-800">Courses</Text>
                  {courses.map(course => (
                      <TouchableOpacity
                          key={`course-${course.id}`}
                          className="bg-white rounded-xl mb-3 p-4 shadow-sm"
                          onPress={() => {
                            if (isGuest) {
                              alert('This feature is only available for Park Guides.');
                            } else {
                              router.push(`/CourseDetails?id=${course.id}`);
                            }
                          }}
                      >
                        <View className="flex-1">
                          <Text className="text-base font-bold text-gray-800 mb-1">
                            {course.course_name || 'Untitled Course'}
                          </Text>
                          <Text className="text-sm text-gray-600 mb-1">
                            {`Instructor: ${course.instructor_name || 'Unknown'}`}
                          </Text>
                          <Text className="text-sm text-gray-600" numberOfLines={2}>
                            {course.course_description || 'No description available'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                  ))}
                </View>
            )}

            {/* Blogs Section */}
            {(activeFilter === 'all' || activeFilter === 'blogs') && blogsResults.length > 0 && (
                <View className="mb-6">
                  <Text className="text-lg font-bold mb-3 text-gray-800">Blogs</Text>
                  {blogsResults.map(blog => (
                      <TouchableOpacity
                          key={`blog-${blog.id}`}
                          className="bg-white rounded-xl mb-3 p-4 shadow-sm"
                          onPress={() => router.push(`/BlogDetailScreen?id=${blog.id}`)}
                      >
                        <View className="flex-1">
                          <Text className="text-base font-bold text-gray-800 mb-1">
                            {blog.title || 'Untitled Blog'}
                          </Text>
                          <Text className="text-sm text-gray-600 mb-1">
                            {blog.description || 'No description available'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                  ))}
                </View>
            )}

            {/* Park Guides Section */}
            {(activeFilter === 'all' || activeFilter === 'guides') && guides.length > 0 && (
                <View className="mb-6">
                  <Text className="text-lg font-bold mb-3 text-gray-800">Park Guides</Text>
                  {guides.map(guide => (
                      <TouchableOpacity
                          key={`guide-${guide.id}`}
                          className="bg-white rounded-xl mb-3 p-4 shadow-sm"
                          onPress={() => router.push(`/GuideDetailScreen?id=${guide.id}`)}
                      >
                        <View className="flex-1">
                          <Text className="text-base font-bold text-gray-800 mb-1">
                            {guide.name || 'Unnamed Guide'}
                          </Text>
                          <Text className="text-sm text-gray-600 mb-1">
                            {guide.specialties.length > 0 ? guide.specialties.join(', ') : 'No specialties listed'}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {guide.description || 'No description available'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                  ))}
                </View>
            )}

            {/* Timetables Section */}
            {(activeFilter === 'all' || activeFilter === 'timetables') &&
                timetablesResults.length > 0 && (
                    <View className="mb-6">
                      <Text className="text-lg font-bold mb-3 text-gray-800">Timetables</Text>
                      {timetablesResults.map(timetable => (
                          <TouchableOpacity
                              key={`timetable-${timetable.id}`}
                              className="bg-white rounded-xl mb-3 p-4 shadow-sm"
                              onPress={() => console.log(`Timetable "${timetable.title}" (ID: ${timetable.id}) has been pressed`)}
                          >
                            <View className="flex-1">
                              <Text className="text-base font-bold text-gray-800 mb-1">
                                {timetable.title || 'Untitled Timetable'}
                              </Text>
                              <Text className="text-sm text-gray-600 mb-1">
                                {timetable.time || 'No time specified'}
                              </Text>
                              <Text className="text-sm text-gray-600">
                                {timetable.description || 'No description available'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                      ))}
                    </View>
                )}
          </View>
        </ScrollView>
    );
  };

  return (
      <SafeAreaView className="flex-1 bg-[#F8F9FA]">
        <View className="flex-1">
          <View className="px-4 pt-10 pb-2">
            <View className="flex-row items-center mb-2">
              <TouchableOpacity onPress={navigateBack} className="p-2">
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text className="text-xl font-bold ml-4">Search</Text>
            </View>
            <SearchBar
                placeholder="Search for courses, blogs, guides..."
                onSearch={setSearchQuery}
                onClear={handleClear}
                value={searchQuery}
            />
          </View>
          {renderFilterButtons()}
          <View className="flex-1">
            {renderSearchResults()}
          </View>
        </View>
      </SafeAreaView>
  );
}