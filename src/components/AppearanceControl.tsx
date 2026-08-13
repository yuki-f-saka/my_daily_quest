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

/** Small segmented control. Lives at the bottom of Home so the header stays uncluttered. */
export function AppearanceControl() {
  const { theme, preference, setPreference } = useThemeStore();

  const select = (next: ThemePreference) => {
    if (next === preference) return;
    setPreference(next);
    void Haptics.selectionAsync();
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.caption, { color: theme.muted }]}>APPEARANCE</Text>
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
                selected && {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  ...theme.shadow,
                },
                { opacity: pressed ? 0.6 : 1 },
              ]}>
              <Text
                style={[
                  styles.segmentText,
                  { color: selected ? theme.text : theme.muted, fontWeight: selected ? '600' : '500' },
                ]}>
                {LABELS[option]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  caption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginBottom: 10,
  },
  track: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segment: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  segmentText: {
    fontSize: 13,
  },
});
