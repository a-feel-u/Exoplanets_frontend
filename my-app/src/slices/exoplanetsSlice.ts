import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Exoplanet } from '../types/exoplanet';

interface ExoplanetsState {
  items: Exoplanet[];
  drafts: Exoplanet[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExoplanetsState = {
  items: [],
  drafts: [],
  isLoading: false,
  error: null,
};

const exoplanetsSlice = createSlice({
  name: 'exoplanets',
  initialState,

  reducers: {
    // Сохранение опубликованных экзопланет
    setExoplanets(state, action: PayloadAction<Exoplanet[]>) {
      state.items = action.payload;
    },

    // Сохранение черновиков
    setDrafts(state, action: PayloadAction<Exoplanet[]>) {
      state.drafts = action.payload;
    },

    // Очистка данных
    clearExoplanets(state) {
      state.items = [];
      state.drafts = [];
      state.error = null;
    },
  },
});

export const {
  setExoplanets,
  setDrafts,
  clearExoplanets,
} = exoplanetsSlice.actions;

export default exoplanetsSlice.reducer;