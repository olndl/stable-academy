import { configureStore } from '@reduxjs/toolkit';
import { learningReducer } from './learningSlice.ts';

export function createAppStore() {
  return configureStore({ reducer: { learning: learningReducer } });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
