import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [animating, setAnimating] = useState(false);
  const [overlayKey, setOverlayKey] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('vascode-theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      document.documentElement.classList.toggle('light', stored === 'light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setOverlayKey((k) => k + 1);

    const target: Theme = theme === 'dark' ? 'light' : 'dark';

    setTimeout(() => {
      setTheme(target);
      localStorage.setItem('vascode-theme', target);
      document.documentElement.classList.toggle('light', target === 'light');
      setTimeout(() => setAnimating(false), 100);
    }, 450);
  }, [theme, animating]);

  const overlayBg = theme === 'dark' ? '#f4f4f6' : '#242426';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <AnimatePresence>
        {animating && (
          <motion.div
            key={overlayKey}
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{ backgroundColor: overlayBg }}
          />
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
