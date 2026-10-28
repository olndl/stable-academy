import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppLink } from '../../components/AppLink';
import { RequestNotice } from '../../components/RequestNotice';
import { CourseCard } from '../../features/courses/CourseCard';
import { coursesQueryOptions } from '../../queries/courses';
import { useAppSelector } from '../../store/hooks';
import { statusLabels } from '../../store/learningSlice';
import type { CourseStatus } from '../../store/learningSlice';
import { styles as shared } from '../../styles';

export default function LearningScreen() {
  const [list, setList] = useState<CourseStatus>('watchlist');
  const statuses = useAppSelector((state) => state.learning.statuses);
  const query = useQuery(coursesQueryOptions);
  if (query.isPending)
    return <RequestNotice loading message="Loading your courses…" />;
  if (!query.data)
    return (
      <RequestNotice
        message="Could not load your courses."
        onRetry={() => void query.refetch()}
      />
    );
  const courses = query.data.filter((course) => statuses[course.id] === list);

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={courses}
      keyExtractor={(course) => course.id}
      renderItem={({ item }) => <CourseCard course={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={shared.title}>
            My learning
          </Text>
          <View style={styles.choices}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                aria-pressed={list === value}
                onPress={() => setList(value as CourseStatus)}
                style={[styles.button, list === value && styles.selected]}
              >
                <Text
                  style={[styles.label, list === value && styles.selectedLabel]}
                >
                  {label} (
                  {
                    query.data.filter((course) => statuses[course.id] === value)
                      .length
                  }
                  )
                </Text>
              </Pressable>
            ))}
          </View>
          {query.isRefetchError && (
            <Text accessibilityRole="alert" style={shared.text}>
              Could not refresh. Showing previous results.
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.header}>
          <Text style={shared.text}>No courses in this list yet.</Text>
          <AppLink href="/courses" label="Browse courses" />
        </View>
      }
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
  header: { gap: 16 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: {
    minHeight: 44,
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  selected: { backgroundColor: '#286440' },
  label: { fontSize: 14, color: '#333333' },
  selectedLabel: { color: '#ffffff' },
});
