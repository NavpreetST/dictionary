'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, themes } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: string;
  theme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState('ocean');

  useEffect(() => {
    const saved = localStorage.getItem('deutsche-words-theme');
    if (saved && themes[saved]) {
      setCurrentTheme(saved);
    }
  }, []);

  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem('deutsche-words-theme', themeName);
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    setTheme,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
