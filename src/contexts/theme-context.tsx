'use client';

import * as React from 'react';

import { getStorageItem, setStorageItem } from '../utils/storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    const savedTheme = getStorageItem('theme');
    return savedTheme === 'dark';
  });

  const toggleTheme = React.useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    setStorageItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
