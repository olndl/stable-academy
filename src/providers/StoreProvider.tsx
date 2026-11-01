import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { AppState, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { ActionButton } from '../components/ActionButton';
import { RequestNotice } from '../components/RequestNotice';
import { Screen } from '../components/Screen';
import { createAppStore } from '../store';
import type { AppStore } from '../store';
import { loadAppData, startPersistence } from '../store/persistence';
import { styles } from '../styles';

export function StoreProvider({ children }: PropsWithChildren) {
  const [store, setStore] = useState<AppStore | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [sessionOnly, setSessionOnly] = useState(false);
  const persistence = useRef<ReturnType<typeof startPersistence> | null>(null);

  useEffect(() => {
    let active = true;
    void loadAppData(AsyncStorage)
      .then((data) => {
        if (active) setStore(createAppStore(data));
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  useEffect(() => {
    if (!store || sessionOnly) return;
    const controller = startPersistence(store, AsyncStorage, setSaveError);
    persistence.current = controller;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') void controller.flush();
    });
    return () => {
      subscription.remove();
      controller.stop();
      persistence.current = null;
    };
  }, [store, sessionOnly]);

  if (!store) {
    if (loadError)
      return (
        <Screen>
          <Text accessibilityRole="alert" style={styles.text}>
            Could not load your saved data.
          </Text>
          <ActionButton
            label="Retry loading"
            onPress={() => {
              setLoadError(false);
              setAttempt((value) => value + 1);
            }}
          />
          <ActionButton
            label="Use without saving"
            onPress={() => {
              setSessionOnly(true);
              setStore(createAppStore());
            }}
          />
          <Text style={styles.text}>
            Using a temporary session will leave your saved data untouched.
          </Text>
        </Screen>
      );
    return <RequestNotice loading message="Loading saved data…" />;
  }

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        {sessionOnly && (
          <View style={styles.panel}>
            <Text accessibilityRole="alert" style={styles.text}>
              Temporary session. Changes will not be saved.
            </Text>
          </View>
        )}
        {saveError && (
          <View style={styles.panel}>
            <Text accessibilityRole="alert" style={styles.text}>
              Changes could not be saved. Keep the app open and try again.
            </Text>
            <ActionButton
              label="Retry saving"
              onPress={() => {
                void persistence.current?.flush();
              }}
            />
          </View>
        )}
        {children}
      </View>
    </Provider>
  );
}
