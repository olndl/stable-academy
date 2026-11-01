import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { isDiaryEntry } from '../features/diary/model.ts';
import type { DiaryEntry } from '../features/diary/model.ts';

export interface DiaryState {
  entries: DiaryEntry[];
}
const initialState: DiaryState = { entries: [] };
const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    diaryEntrySaved(state, action: PayloadAction<DiaryEntry>) {
      if (!isDiaryEntry(action.payload)) return;
      const index = state.entries.findIndex(
        (entry) => entry.id === action.payload.id,
      );
      const entry = { ...action.payload, notes: action.payload.notes.trim() };
      if (index === -1) state.entries.push(entry);
      else
        state.entries[index] = {
          ...entry,
          createdAt: state.entries[index].createdAt,
        };
    },
    diaryEntryRemoved(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter(
        (entry) => entry.id !== action.payload,
      );
    },
  },
});
export const { diaryEntrySaved, diaryEntryRemoved } = diarySlice.actions;
export const diaryReducer = diarySlice.reducer;
