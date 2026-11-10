import { configureStore } from '@reduxjs/toolkit';

import filterReducer from '../slices/filterSlice';
import userReducer from '../slices/userSlice';
import exoplanetsReducer from '../slices/exoplanetsSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    user: userReducer,
    exoplanets: exoplanetsReducer,
  },

  devTools: true,
});

// Тип всего состояния Redux
export type RootState = ReturnType<typeof store.getState>;

// Тип dispatch
export type AppDispatch = typeof store.dispatch;