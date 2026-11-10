import { Routes, Route } from 'react-router-dom';

import AppLayout from './components/AppLayout/AppLayout';

import FeedPage from './pages/FeedPage/FeedPage';
import GridPage from './pages/GridPage/GridPage';
import AddPage from './pages/AddPage/AddPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        <Route path="/" element={<FeedPage />} />

        <Route path="/feed/:id" element={<FeedPage />} />

        <Route path="/grid" element={<GridPage />} />

        <Route path="/add" element={<AddPage />} />

      </Route>
    </Routes>
  );
}

export default App;