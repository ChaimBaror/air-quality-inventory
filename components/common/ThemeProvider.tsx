'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  effectiveMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Load saved theme preference
  useEffect(() => {
    const saved = localStorage.getItem('theme-mode') as ThemeMode;
    if (saved) {
      setModeState(saved);
    }
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const toggleMode = () => {
    const newMode = effectiveMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const effectiveMode: 'light' | 'dark' = mode === 'system' ? systemPreference : mode;

  const theme = createTheme({
    palette: {
      mode: effectiveMode,
      primary: {
        main: effectiveMode === 'dark' ? '#818cf8' : '#6366f1',
      },
      secondary: {
        main: effectiveMode === 'dark' ? '#a78bfa' : '#8b5cf6',
      },
      background: {
        default: effectiveMode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: effectiveMode === 'dark' ? '#1e293b' : '#ffffff',
      },
      success: {
        main: effectiveMode === 'dark' ? '#34d399' : '#10b981',
      },
      warning: {
        main: effectiveMode === 'dark' ? '#fbbf24' : '#f59e0b',
      },
      error: {
        main: effectiveMode === 'dark' ? '#f87171' : '#ef4444',
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: effectiveMode === 'dark'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, effectiveMode, setMode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

