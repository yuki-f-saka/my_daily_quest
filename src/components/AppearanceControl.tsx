import React from 'react';

import { THEME_PREFERENCES, type ThemePreference } from '../theme';
import { useThemeStore } from '../themeStore';
import { Segmented } from './Segmented';

const LABELS: Record<ThemePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

const OPTIONS = THEME_PREFERENCES.map((value) => ({ value, label: LABELS[value] }));

export function AppearanceControl() {
  const { preference, setPreference } = useThemeStore();

  return (
    <Segmented
      options={OPTIONS}
      value={preference}
      onChange={setPreference}
      accessibilityLabelPrefix="Appearance"
    />
  );
}
