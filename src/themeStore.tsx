import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { loadThemePreference, saveThemePreference } from './storage';
import { darkTheme, lightTheme, type Theme, type ThemePreference } from './theme';

type ThemeStore = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeStore | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const stored = await loadThemePreference();
      if (cancelled) return;
      if (stored) setPreferenceState(stored);
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    void saveThemePreference(next);
  }, []);

  const resolved = preference === 'system' ? systemScheme ?? 'light' : preference;
  const theme = resolved === 'dark' ? darkTheme : lightTheme;

  const value = useMemo<ThemeStore>(
    () => ({ theme, preference, setPreference }),
    [theme, preference, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      {/* Waits one tick for the stored choice so the app never flashes the wrong theme. */}
      {loaded ? children : <View style={[styles.blank, { backgroundColor: theme.bg }]} />}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useThemeStore().theme;
}

export function useThemeStore(): ThemeStore {
  const store = useContext(ThemeContext);
  if (!store) throw new Error('useTheme must be used inside <ThemeProvider>');
  return store;
}

const styles = StyleSheet.create({
  blank: {
    flex: 1,
  },
});
