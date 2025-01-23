import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TareoProvider } from './context/TareoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TareoProvider>
      <App />
    </TareoProvider>
  </React.StrictMode>
); 