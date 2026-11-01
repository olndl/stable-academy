import { KeyboardLayout } from './KeyboardLayout';
import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export function Screen({
  children,
  avoidKeyboard = false,
}: PropsWithChildren<{ avoidKeyboard?: boolean }>) {
  const content = (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
  return avoidKeyboard ? <KeyboardLayout>{content}</KeyboardLayout> : content;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 20,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
});
