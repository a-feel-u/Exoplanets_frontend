import { Outlet } from 'react-router-dom';
import BottomNavbar from '../BottomNavbar/BottomNavbar';

function AppLayout() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet />
      </main>

      <BottomNavbar />
    </div>
  );
}

export default AppLayout;
