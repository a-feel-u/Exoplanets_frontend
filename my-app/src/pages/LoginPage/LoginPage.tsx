import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { requestError, signIn } from '../../api/auth';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { finishAuthRequest, setAuthenticatedUser, startAuthRequest } from '../../slices/userSlice';
import '../AddPage/PlanetForm.css';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.user);
  const destination = location.state?.from === '/add' ? '/add' : '/grid';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    dispatch(startAuthRequest());
    try {
      const user = await signIn(login.trim(), password);
      dispatch(setAuthenticatedUser(user));
      dispatch(finishAuthRequest(null));
      navigate(destination, { replace: true });
    } catch (error) {
      dispatch(finishAuthRequest(requestError(error)));
    }
  }

  if (isAuthenticated) return <Navigate to={destination} replace />;

  return (
    <form className="planet-form" onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <label htmlFor="login">Логин</label>
      <input id="login" autoComplete="username" required value={login}
        onChange={(event) => setLogin(event.target.value)} />
      <label htmlFor="password">Пароль</label>
      <input id="password" type="password" autoComplete="current-password" required value={password}
        onChange={(event) => setPassword(event.target.value)} />
      <button type="submit" disabled={isLoading}>Войти</button>
    </form>
  );
}
