import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  removeCourse,
  setCourseStatus,
  statusLabels,
} from '../../store/learningSlice';
import type { CourseStatus } from '../../store/learningSlice';

export function CourseStatusControls({ courseId }: { courseId: string }) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.learning.statuses[courseId]);
  return (
    <View style={styles.group}>
      <Text style={styles.heading}>My learning</Text>
      <View style={styles.choices}>
        {Object.entries(statusLabels).map(([value, label]) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            aria-pressed={selected === value}
            onPress={() =>
              dispatch(
                setCourseStatus({ courseId, status: value as CourseStatus }),
              )
            }
            style={[styles.button, selected === value && styles.selected]}
          >
            <Text
              style={[styles.label, selected === value && styles.selectedLabel]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      {selected && (
        <Pressable
          accessibilityRole="button"
          onPress={() => dispatch(removeCourse(courseId))}
          style={styles.remove}
        >
          <Text style={styles.removeLabel}>Remove from my learning</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 10 },
  heading: { fontSize: 20, fontWeight: '600', color: '#222222' },
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
  selected: { backgroundColor: '#286440', borderColor: '#286440' },
  label: { fontSize: 14, color: '#333333' },
  selectedLabel: { color: '#ffffff' },
  remove: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  removeLabel: {
    fontSize: 16,
    color: '#555555',
    textDecorationLine: 'underline',
  },
});
