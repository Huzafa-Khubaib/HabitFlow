import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { useHabits } from '../store/HabitContext';
import { darkColors, lightColors, ThemeColors } from './colors';
import { radius, spacing, typography } from './index';

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  setThemePreference: (pref: 'light' | 'dark' | 'system') => void;
  themePreference: 'light' | 'dark' | 'system';
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const { profile, updateProfile, ready } = useHabits();
  const [pref, setPref] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    if (ready) setPref(profile.themePreference);
  }, [ready, profile.themePreference]);

  const isDark =
    pref === 'dark' || (pref === 'system' && system === 'dark');

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      spacing,
      radius,
      typography,
      themePreference: pref,
      setThemePreference: (next) => {
        setPref(next);
        updateProfile({ themePreference: next });
      },
    }),
    [isDark, pref, updateProfile],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
