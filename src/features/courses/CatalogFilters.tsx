import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { CourseFilters } from './filters';
import { disciplineLabels, levelLabels } from './labels';

interface ChoiceProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function Choice({ label, selected, onPress }: ChoiceProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={selected}
      onPress={onPress}
      style={[styles.choice, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function CatalogFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: CourseFilters;
  onChange: (filters: CourseFilters) => void;
  onReset: () => void;
}) {
  const active = Boolean(filters.q || filters.discipline || filters.level);
  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Search</Text>
      <TextInput
        accessibilityLabel="Search courses"
        placeholder="Course or trainer"
        placeholderTextColor="#666666"
        value={filters.q}
        onChangeText={(q) => onChange({ ...filters, q })}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
        style={styles.input}
      />
      <Text style={styles.heading}>Discipline</Text>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Discipline"
        style={styles.choices}
      >
        <Choice
          label="All disciplines"
          selected={!filters.discipline}
          onPress={() => onChange({ ...filters, discipline: '' })}
        />
        {Object.entries(disciplineLabels).map(([value, label]) => (
          <Choice
            key={value}
            label={label}
            selected={filters.discipline === value}
            onPress={() =>
              onChange({
                ...filters,
                discipline: value as CourseFilters['discipline'],
              })
            }
          />
        ))}
      </View>
      <Text style={styles.heading}>Level</Text>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Level"
        style={styles.choices}
      >
        <Choice
          label="All levels"
          selected={!filters.level}
          onPress={() => onChange({ ...filters, level: '' })}
        />
        {Object.entries(levelLabels).map(([value, label]) => (
          <Choice
            key={value}
            label={label}
            selected={filters.level === value}
            onPress={() =>
              onChange({ ...filters, level: value as CourseFilters['level'] })
            }
          />
        ))}
      </View>
      {active && (
        <Pressable
          accessibilityRole="button"
          onPress={onReset}
          style={styles.reset}
        >
          <Text style={styles.resetLabel}>Reset filters</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 10 },
  heading: { fontSize: 16, fontWeight: '600', color: '#222222' },
  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 4,
    fontSize: 16,
    color: '#222222',
    backgroundColor: '#ffffff',
  },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  selected: { backgroundColor: '#286440', borderColor: '#286440' },
  label: { fontSize: 14, color: '#333333' },
  selectedLabel: { color: '#ffffff', fontWeight: '600' },
  reset: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  resetLabel: {
    fontSize: 16,
    color: '#286440',
    textDecorationLine: 'underline',
  },
});
