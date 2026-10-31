import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CatalogFilters } from '../../features/courses/CatalogFilters';
import {
  courseFilterParams,
  filterCourses,
  readCourseFilters,
} from '../../features/courses/filters';
import type { CourseFilters } from '../../features/courses/filters';
import { CourseCard } from '../../features/courses/CourseCard';
import { coursesQueryOptions } from '../../queries/courses';
import { styles as shared } from '../../styles';

export default function CoursesScreen() {
  const query = useQuery(coursesQueryOptions);
  const params = useLocalSearchParams<{
    q?: string | string[];
    discipline?: string | string[];
    level?: string | string[];
  }>();
  const router = useRouter();
  const filters = readCourseFilters(params);
  const courses = filterCourses(query.data ?? [], filters);
  const activeFilters = Boolean(
    filters.q || filters.discipline || filters.level,
  );

  function updateFilters(next: CourseFilters) {
    router.setParams(courseFilterParams(next));
  }

  function resetFilters() {
    Keyboard.dismiss();
    updateFilters({ q: '', discipline: '', level: '' });
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      data={courses}
      keyExtractor={(course) => course.id}
      renderItem={({ item }) => <CourseCard course={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={shared.title}>
            Courses
          </Text>
          <Text style={shared.text}>
            Find something to work on with your horse.
          </Text>
          <CatalogFilters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
          />
          {query.data && (
            <Text accessibilityLiveRegion="polite" style={shared.text}>
              {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </Text>
          )}
          {query.isRefetchError && (
            <Text accessibilityRole="alert" style={shared.text}>
              Could not refresh courses. Showing previous results.
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          {query.isPending ? (
            <>
              <ActivityIndicator
                accessibilityLabel="Loading courses"
                color="#286440"
              />
              <Text style={shared.text}>Loading courses…</Text>
            </>
          ) : query.isLoadingError ? (
            <>
              <Text accessibilityRole="alert" style={shared.text}>
                Could not load courses. Please try again.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void query.refetch()}
                style={styles.button}
              >
                <Text style={styles.buttonLabel}>Try again</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={shared.text}>
                {activeFilters
                  ? 'No courses match your filters.'
                  : 'No courses yet.'}
              </Text>
              {activeFilters && (
                <Pressable
                  accessibilityRole="button"
                  onPress={resetFilters}
                  style={styles.button}
                >
                  <Text style={styles.buttonLabel}>Show all courses</Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      }
      refreshing={query.isRefetching}
      onRefresh={() => void query.refetch()}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  header: { gap: 12 },
  empty: { paddingVertical: 24, gap: 16, alignItems: 'center' },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#286440',
    borderRadius: 4,
  },
  buttonLabel: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
