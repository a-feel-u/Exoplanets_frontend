import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  userId: number | null;
  login: string | null;
}

interface AuthenticatedUser {
  userId: number;
  login: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: null,
  login: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    // Устанавливаем авторизованного пользователя
    setAuthenticatedUser(
      state,
      action: PayloadAction<AuthenticatedUser>
    ) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.login = action.payload.login;
    },

    // Возвращаем интерфейс в состояние гостя
    clearAuthenticatedUser(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.login = null;
    },
  },
});

export const {
  setAuthenticatedUser,
  clearAuthenticatedUser,
} = userSlice.actions;

export default userSlice.reducer;