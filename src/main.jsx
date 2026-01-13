import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeeProvider } from './hooks/context/ThemeContext.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeeProvider>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeeProvider>
);
