import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

export function Field({
  label,
  error,
  style,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        accessibilityHint={error}
        aria-invalid={Boolean(error)}
        placeholderTextColor="#666666"
        style={[styles.input, props.multiline && styles.multiline, style]}
      />
      {error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

export function ChoiceGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        style={styles.row}
      >
        {options.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            aria-checked={option.value === value}
            onPress={() => onChange(option.value)}
            style={[styles.choice, value === option.value && styles.selected]}
          >
            <Text
              style={[
                styles.choiceLabel,
                value === option.value && styles.selectedLabel,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 16, fontWeight: '600', color: '#222222' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    color: '#222222',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  error: { fontSize: 14, color: '#a32424' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  selected: { backgroundColor: '#286440', borderColor: '#286440' },
  choiceLabel: { fontSize: 16, color: '#333333' },
  selectedLabel: { color: '#ffffff' },
});
