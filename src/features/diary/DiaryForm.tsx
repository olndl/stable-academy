import { nanoid } from '@reduxjs/toolkit';
import { useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import { ChoiceGroup, Field } from '../../components/FormFields';
import { disciplineLabels } from '../courses/labels';
import { useAppDispatch } from '../../store/hooks';
import { diaryEntrySaved } from '../../store/diarySlice';
import { styles } from '../../styles';
import { defaultDiaryInput, moodLabels, parseDiaryInput } from './model';
import type { DiaryEntry, DiaryErrors, DiaryInput } from './model';

const disciplines = Object.entries(disciplineLabels).map(([value, label]) => ({
  value,
  label,
}));
const moods = Object.entries(moodLabels).map(([value, label]) => ({
  value,
  label,
}));

export function DiaryForm({
  entry,
  onSaved,
  onCancel,
}: {
  entry?: DiaryEntry;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState<DiaryInput>(() =>
    entry
      ? {
          date: entry.date,
          durationMinutes: String(entry.durationMinutes),
          discipline: entry.discipline,
          mood: entry.mood,
          notes: entry.notes,
        }
      : defaultDiaryInput(),
  );
  const [errors, setErrors] = useState<DiaryErrors>({});

  function update(field: keyof DiaryInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function save() {
    const result = parseDiaryInput(input);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    const now = new Date().toISOString();
    dispatch(
      diaryEntrySaved({
        ...result.value,
        id: entry?.id ?? nanoid(),
        createdAt: entry?.createdAt ?? now,
        updatedAt: now,
      }),
    );
    Keyboard.dismiss();
    setErrors({});
    setInput(defaultDiaryInput());
    onSaved();
  }

  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.subtitle}>
        {entry ? 'Edit training' : 'Add training'}
      </Text>
      <Field
        label="Date (YYYY-MM-DD)"
        value={input.date}
        onChangeText={(value) => update('date', value)}
        error={errors.date}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={10}
      />
      <Field
        label="Duration (minutes)"
        value={input.durationMinutes}
        onChangeText={(value) => update('durationMinutes', value)}
        error={errors.durationMinutes}
        inputMode="numeric"
        placeholder="45"
        maxLength={4}
      />
      <ChoiceGroup
        label="Discipline"
        options={disciplines}
        value={input.discipline}
        onChange={(value) => update('discipline', value)}
        error={errors.discipline}
      />
      <ChoiceGroup
        label="Mood"
        options={moods}
        value={input.mood}
        onChange={(value) => update('mood', value)}
        error={errors.mood}
      />
      <Field
        label="Training notes"
        value={input.notes}
        onChangeText={(value) => update('notes', value)}
        error={errors.notes}
        multiline
        maxLength={1000}
        placeholder="What did you work on?"
      />
      <ActionButton
        label={entry ? 'Save changes' : 'Save training'}
        onPress={save}
      />
      {entry && (
        <ActionButton
          label="Cancel editing"
          onPress={() => {
            Keyboard.dismiss();
            onCancel();
          }}
        />
      )}
    </View>
  );
}
