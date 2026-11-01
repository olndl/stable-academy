import { Text } from 'react-native';
import type { Course } from '../../types/course';
import { useAppSelector } from '../../store/hooks';
import { styles } from '../../styles';
import { getCourseProgress } from './progress';

export function CourseProgress({ course }: { course: Course }) {
  const ids = useAppSelector(
    (state) => state.learning.progress[course.id]?.completedLessonIds,
  );
  const progress = getCourseProgress(course, ids);
  return (
    <Text accessibilityLiveRegion="polite" style={styles.text}>
      {progress.completed} of {progress.total} lessons completed (
      {progress.percent}%)
    </Text>
  );
}
