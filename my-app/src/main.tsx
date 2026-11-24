import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './app/store';
import App from './App';
import { pagesMock, publicAsset } from './modules/runtime';

const Router = pagesMock ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
);

if (pagesMock && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(publicAsset('sw.js')).catch((error) => {
    console.error('Не удалось зарегистрировать Service Worker', error);
  });
}
