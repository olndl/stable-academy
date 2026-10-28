import { useQuery } from '@tanstack/react-query';
import { Text, View } from 'react-native';
import { AppLink } from '../../components/AppLink';
import { coursesQueryOptions } from '../../queries/courses';
import { useAppSelector } from '../../store/hooks';
import { styles } from '../../styles';
import { CourseProgress } from './CourseProgress';
import { formatTime, getResumeLesson } from './progress';

export function ContinueWatching() {
  const last = useAppSelector((state) => state.learning.lastWatched);
  const progress = useAppSelector((state) =>
    last ? state.learning.progress[last.courseId] : undefined,
  );
  const query = useQuery(coursesQueryOptions);
  const course = query.data?.find((item) => item.id === last?.courseId);
  if (!course || !last) return null;
  const lesson = getResumeLesson(
    course,
    progress?.completedLessonIds ?? [],
    last.lessonId,
  );
  if (!lesson) return null;
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.subtitle}>
        Continue watching
      </Text>
      <Text style={styles.text}>{course.title}</Text>
      <Text style={styles.text}>
        {lesson.title} · {formatTime(progress?.positions[lesson.id] ?? 0)}
      </Text>
      <CourseProgress course={course} />
      <AppLink
        href={{
          pathname: '/lessons/[courseId]/[lessonId]',
          params: { courseId: course.id, lessonId: lesson.id },
        }}
        label="Continue watching"
      />
    </View>
  );
}
