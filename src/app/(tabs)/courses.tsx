import { useQuery } from '@tanstack/react-query';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CourseCard } from '../../features/courses/CourseCard';
import { coursesQueryOptions } from '../../queries/courses';
import { styles as shared } from '../../styles';

export default function CoursesScreen() {
  const query = useQuery(coursesQueryOptions);

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      data={query.data ?? []}
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
          ) : query.isError ? (
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
            <Text style={shared.text}>No courses yet.</Text>
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
