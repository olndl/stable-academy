import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { CourseStatusControls } from '../../features/learning/CourseStatusControls';
import { ApiError } from '../../api/request';
import { AppLink } from '../../components/AppLink';
import { RequestNotice } from '../../components/RequestNotice';
import { Screen } from '../../components/Screen';
import { disciplineLabels, levelLabels } from '../../features/courses/labels';
import { courseQueryOptions } from '../../queries/courses';
import { styles } from '../../styles';

export default function CourseScreen() {
  const params = useLocalSearchParams<{ courseId: string | string[] }>();
  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;
  const query = useQuery(courseQueryOptions(courseId ?? ''));

  if (query.isPending)
    return <RequestNotice loading message="Loading course…" />;
  if (!query.data) {
    if (query.error instanceof ApiError && query.error.status === 404) {
      return (
        <Screen>
          <Text style={styles.title}>Course not found</Text>
          <AppLink href="/courses" label="Browse courses" />
        </Screen>
      );
    }
    return (
      <RequestNotice
        message="Could not load this course."
        onRetry={() => void query.refetch()}
      />
    );
  }
  const course = query.data;

  return (
    <Screen>
      <Stack.Screen options={{ title: course.title }} />
      <Text accessibilityRole="header" style={styles.title}>
        {course.title}
      </Text>
      <Text style={styles.text}>
        {disciplineLabels[course.discipline]} · {levelLabels[course.level]}
      </Text>
      <Image
        source={{ uri: course.imageUrl }}
        accessible={false}
        resizeMode="contain"
        style={{ width: '100%', height: 200, backgroundColor: '#e5e5e5' }}
      />
      <Text style={styles.text}>{course.description}</Text>
      <CourseStatusControls courseId={course.id} />
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>
          Trainer: {course.trainer.name}
        </Text>
        <Text style={styles.text}>{course.trainer.bio}</Text>
      </View>
      {query.isRefetchError && (
        <Text accessibilityRole="alert" style={styles.text}>
          Could not refresh this course. Showing previous results.
        </Text>
      )}
      <Text accessibilityRole="header" style={styles.subtitle}>
        Lessons ({course.lessons.length})
      </Text>
      {course.lessons.map((lesson, index) => (
        <View key={lesson.id} style={styles.panel}>
          <Text accessibilityRole="header" style={styles.subtitle}>
            {index + 1}. {lesson.title}
          </Text>
          <Text style={styles.text}>{lesson.description}</Text>
          <Text style={styles.text}>
            {Math.ceil(lesson.durationSeconds / 60)} min
          </Text>
        </View>
      ))}
    </Screen>
  );
}
