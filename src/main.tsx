import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { loadSettings } from './utils/storage';

// Применяем тему до рендера
const settings = loadSettings();
if (settings.theme === 'dark') document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
