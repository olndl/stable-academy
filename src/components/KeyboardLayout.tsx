import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export function KeyboardLayout({ children }: PropsWithChildren) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
