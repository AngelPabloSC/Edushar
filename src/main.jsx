import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeeProvider } from './hooks/context/ThemeContext.jsx';
import { AuthProvider } from './hooks/context/LoginContext.jsx';
import { SidebarProvider } from './hooks/context/sidebardContext.jsx';
import GlobalSnackbarProvider from './hooks/context/SnackbarContext.jsx';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeeProvider>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <GlobalSnackbarProvider>
          <AuthProvider>
            <SidebarProvider>
              <App />
            </SidebarProvider>
          </AuthProvider>
        </GlobalSnackbarProvider>
      </SnackbarProvider>
    </ThemeeProvider>
  </BrowserRouter>
);
