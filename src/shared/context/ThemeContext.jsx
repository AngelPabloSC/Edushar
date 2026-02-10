import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import darkTheme from "@core/theme/darkTheme";
import lightTheme from "@core/theme/lightTheme";

const ThemeContext = createContext();

export const useThemeProvider = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeProvider must be used within ThemeeProvider');
  }
  return context;
};

export const ThemeeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () => (themeMode === 'light' ? lightTheme : darkTheme),
    [themeMode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, themeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
