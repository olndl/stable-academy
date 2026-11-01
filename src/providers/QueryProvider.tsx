import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';
import { createQueryClient } from '../queries/client';

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(createQueryClient);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    focusManager.setFocused(AppState.currentState === 'active');
    const subscription = AppState.addEventListener('change', (state) => {
      focusManager.setFocused(state === 'active');
    });
    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
