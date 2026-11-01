import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ApiError } from '../../../api/request';
import { Text } from 'react-native';
import { AppLink } from '../../../components/AppLink';
import { RequestNotice } from '../../../components/RequestNotice';
import { Screen } from '../../../components/Screen';
import { LessonPlayer } from '../../../features/learning/LessonPlayer';
import { CourseProgress } from '../../../features/learning/CourseProgress';
import { courseQueryOptions } from '../../../queries/courses';
import { styles } from '../../../styles';

export default function LessonScreen() {
  const params = useLocalSearchParams<{ courseId: string; lessonId: string }>();
  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;
  const lessonId = Array.isArray(params.lessonId)
    ? params.lessonId[0]
    : params.lessonId;
  const query = useQuery(courseQueryOptions(courseId ?? ''));
  if (query.isPending)
    return <RequestNotice loading message="Loading lesson…" />;
  if (
    !query.data &&
    !(query.error instanceof ApiError && query.error.status === 404)
  )
    return (
      <RequestNotice
        message="Could not load the lesson."
        onRetry={() => void query.refetch()}
      />
    );
  const course = query.data;
  const index =
    course?.lessons.findIndex((lesson) => lesson.id === lessonId) ?? -1;
  const lesson = course?.lessons[index];
  if (!course || !lesson)
    return (
      <Screen>
        <Text style={styles.title}>Lesson not found</Text>
        <AppLink href="/courses" label="Browse courses" />
      </Screen>
    );
  const next = course.lessons[index + 1];
  return (
    <Screen>
      <Stack.Screen options={{ title: lesson.title }} />
      <Text accessibilityRole="header" style={styles.title}>
        {lesson.title}
      </Text>
      <Text style={styles.text}>{lesson.description}</Text>
      {lesson.videoUrl ? (
        <LessonPlayer
          key={`${course.id}/${lesson.id}`}
          course={course}
          lesson={lesson}
        />
      ) : (
        <Text style={styles.text}>Video is not available yet.</Text>
      )}
      <CourseProgress course={course} />
      {next && (
        <AppLink
          href={{
            pathname: '/lessons/[courseId]/[lessonId]',
            params: { courseId: course.id, lessonId: next.id },
          }}
          label="Next lesson"
          replace
        />
      )}
      <AppLink
        href={{
          pathname: '/courses/[courseId]',
          params: { courseId: course.id },
        }}
        label="Back to course"
        dismissTo
      />
    </Screen>
  );
}
