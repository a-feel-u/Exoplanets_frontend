import { Outlet } from 'react-router-dom';
import BottomNavbar from '../BottomNavbar/BottomNavbar';
import { useAppSelector } from '../../app/hooks';
import { selectExoplanetsLoading } from '../../slices/exoplanetsSlice';

function AppLayout() {
  const loadingExoplanets = useAppSelector(selectExoplanetsLoading);
  const user = useAppSelector((state) => state.user);
  const error = useAppSelector((state) => state.exoplanets.error) ?? user.error;
  const busy = loadingExoplanets || user.isLoading;

  return (
    <div className="app-shell">
      {error && <div className="alert alert-danger rounded-0 mb-0" role="alert">{error}</div>}
      <main className="app-content" inert={busy} aria-busy={busy}>
        <Outlet />
      </main>
      <div inert={busy}>
        <BottomNavbar />
      </div>
      {busy && (
        <div className="request-overlay" role="status">
          <span className="spinner-border text-light" aria-hidden="true" />
          <span className="visually-hidden">Выполняется запрос</span>
        </div>
      )}
    </div>
  );
}

export default AppLayout;
