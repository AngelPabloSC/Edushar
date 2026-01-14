import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeeProvider } from './hooks/context/ThemeContext.jsx';
import { AuthProvider } from './hooks/context/AuthContext.jsx';
import { SidebarProvider } from './hooks/context/sidebardContext.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeeProvider>
      <CssBaseline />
      <AuthProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </AuthProvider>
    </ThemeeProvider>
  </BrowserRouter>
);
