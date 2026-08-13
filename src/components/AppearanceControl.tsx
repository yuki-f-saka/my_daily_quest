import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEME_PREFERENCES, type ThemePreference } from '../theme';
import { useThemeStore } from '../themeStore';

const LABELS: Record<ThemePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

/** Segmented control for System / Light / Dark. */
export function AppearanceControl() {
  const { theme, preference, setPreference } = useThemeStore();

  const select = (next: ThemePreference) => {
    if (next === preference) return;
    setPreference(next);
    void Haptics.selectionAsync();
  };

  return (
    <View style={[styles.track, { backgroundColor: theme.fill, borderColor: theme.border }]}>
      {THEME_PREFERENCES.map((option) => {
        const selected = option === preference;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Appearance: ${LABELS[option]}`}
            onPress={() => select(option)}
            style={({ pressed }) => [
              styles.segment,
              selected && { backgroundColor: theme.card, borderColor: theme.border },
              { opacity: pressed ? 0.6 : 1 },
            ]}>
            <Text
              style={[
                styles.segmentText,
                {
                  color: selected ? theme.text : theme.muted,
                  fontWeight: selected ? '600' : '500',
                },
              ]}>
              {LABELS[option]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  segmentText: {
    fontSize: 12.5,
  },
});
