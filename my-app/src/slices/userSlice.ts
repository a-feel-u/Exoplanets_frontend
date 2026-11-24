import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userId: number | null;
  login: string | null;
}

interface AuthenticatedUser {
  userId: number;
  login: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userId: null,
  login: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    startAuthRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    finishAuthRequest(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.error = action.payload;
    },
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
  startAuthRequest,
  finishAuthRequest,
  setAuthenticatedUser,
  clearAuthenticatedUser,
} = userSlice.actions;

export default userSlice.reducer;