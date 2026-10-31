import { useAppSelector } from '../../store/hooks';
import { CourseProgress } from '../learning/CourseProgress';
import { AppLink } from '../../components/AppLink';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Course } from '../../types/course';
import { disciplineLabels, levelLabels } from './labels';

export function CourseCard({ course }: { course: Course }) {
  const review = useAppSelector((state) => state.reviews.byCourse[course.id]);
  const minutes = Math.ceil(
    course.lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0) /
      60,
  );

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: course.imageUrl }}
        style={styles.image}
        accessible={false}
        resizeMode="contain"
      />
      <View style={styles.body}>
        <Text style={styles.meta}>
          {disciplineLabels[course.discipline]} · {levelLabels[course.level]}
        </Text>
        <Text accessibilityRole="header" style={styles.title}>
          {course.title}
        </Text>
        <Text style={styles.description}>{course.description}</Text>
        <Text style={styles.meta}>Trainer: {course.trainer.name}</Text>
        <Text style={styles.meta}>
          {course.lessons.length} lessons · {minutes} min
        </Text>
        <CourseProgress course={course} />
        {review && (
          <Text style={styles.meta}>Your rating: {review.rating}/5</Text>
        )}
        <AppLink
          href={{
            pathname: '/courses/[courseId]',
            params: { courseId: course.id },
          }}
          label="View course"
          accessibilityLabel={`View course: ${course.title}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 160, backgroundColor: '#e5e5e5' },
  body: { padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: '600', color: '#222222' },
  description: { fontSize: 16, lineHeight: 24, color: '#444444' },
  meta: { fontSize: 14, lineHeight: 20, color: '#555555' },
});
