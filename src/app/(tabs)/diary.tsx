import { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import { KeyboardLayout } from '../../components/KeyboardLayout';
import { DiaryForm } from '../../features/diary/DiaryForm';
import { moodLabels } from '../../features/diary/model';
import type { DiaryEntry } from '../../features/diary/model';
import { disciplineLabels } from '../../features/courses/labels';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { diaryEntryRemoved } from '../../store/diarySlice';
import { styles as shared } from '../../styles';

export default function DiaryScreen() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.diary.entries);
  const sorted = [...entries].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const list = useRef<FlatList<DiaryEntry>>(null);
  const editing = entries.find((entry) => entry.id === editingId);

  return (
    <KeyboardLayout>
      <FlatList
        ref={list}
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        data={sorted}
        keyExtractor={(entry) => entry.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text accessibilityRole="header" style={shared.title}>
              Training diary
            </Text>
            {Boolean(message) && (
              <Text accessibilityLiveRegion="polite" style={shared.text}>
                {message}
              </Text>
            )}
            <DiaryForm
              key={editing?.id ?? 'new'}
              entry={editing}
              onCancel={() => setEditingId(null)}
              onSaved={() => {
                setEditingId(null);
                setMessage('Training saved.');
              }}
            />
            <Text accessibilityRole="header" style={shared.subtitle}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={shared.text}>No training entries yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={shared.panel}>
            <Text accessibilityRole="header" style={shared.subtitle}>
              {item.date} · {disciplineLabels[item.discipline]}
            </Text>
            <Text style={shared.text}>
              {item.durationMinutes} min · {moodLabels[item.mood]}
            </Text>
            <Text style={shared.text}>{item.notes}</Text>
            {deletingId === item.id ? (
              <>
                <Text style={shared.text}>Delete this training entry?</Text>
                <ActionButton
                  label="Yes, delete entry"
                  onPress={() => {
                    dispatch(diaryEntryRemoved(item.id));
                    setDeletingId(null);
                    if (editingId === item.id) setEditingId(null);
                    setMessage('Training deleted.');
                  }}
                />
                <ActionButton
                  label="Keep entry"
                  onPress={() => setDeletingId(null)}
                />
              </>
            ) : (
              <>
                <ActionButton
                  label="Edit entry"
                  onPress={() => {
                    setEditingId(item.id);
                    setDeletingId(null);
                    setMessage('');
                    list.current?.scrollToOffset({ offset: 0, animated: true });
                  }}
                />
                <ActionButton
                  label="Delete entry"
                  onPress={() => setDeletingId(item.id)}
                />
              </>
            )}
          </View>
        )}
      />
    </KeyboardLayout>
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
  header: { gap: 20 },
});
