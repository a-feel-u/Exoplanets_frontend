import axios, { type AxiosRequestConfig } from 'axios';

export const TOKEN_KEY = 'exoplanets.access_token';

interface SignInResponse {
  user_id: number;
  login: string;
  access_token: string;
}

export function bearerConfig(): AxiosRequestConfig {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

export async function signIn(login: string, password: string) {
  const { data } = await axios.post<SignInResponse>(
    '/api/SignIn',
    new URLSearchParams({ login, password }),
    { timeout: 10_000 },
  );
  localStorage.setItem(TOKEN_KEY, data.access_token);
  return { userId: data.user_id, login: data.login };
}

export async function signOut() {
  try {
    await axios.post('/api/SignOut', undefined, { ...bearerConfig(), timeout: 10_000 });
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
  }
  localStorage.removeItem(TOKEN_KEY);
}

export function requestError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data;
    if (!error.response || [502, 503, 504].includes(error.response.status)) {
      return 'Сервис недоступен. Проверьте запуск бэкенда.';
    }
    return message?.error || message?.description || message?.message ||
      `Ошибка сервера (${error.response.status})`;
  }
  return error instanceof Error ? error.message : 'Не удалось выполнить запрос.';
}
