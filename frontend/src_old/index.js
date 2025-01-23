import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TareoProvider } from './context/TareoContext';

ReactDOM.render(
  <React.StrictMode>
    <TareoProvider>
      <App />
    </TareoProvider>
  </React.StrictMode>,
  document.getElementById('root')
);