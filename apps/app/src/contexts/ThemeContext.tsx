import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('vascode-theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      document.documentElement.classList.toggle('light', stored === 'light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const target: Theme = theme === 'dark' ? 'light' : 'dark';

    const apply = () => {
      setTheme(target);
      localStorage.setItem('vascode-theme', target);
      document.documentElement.classList.toggle('light', target === 'light');
    };

    // Disable View Transition API on mobile for better performance
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    if (document.startViewTransition && !isMobile) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
