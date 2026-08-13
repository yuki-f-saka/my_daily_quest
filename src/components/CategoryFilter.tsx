import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES, categoryAccent } from '../categories';
import { SCREEN_PADDING } from '../components/Screen';
import { useTheme } from '../themeStore';
import type { Category } from '../types';

export type CategoryFilterValue = Category | 'all';

type Props = {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
};

/** Lets you look back at one category at a time. Nothing here hides or judges entries. */
export function CategoryFilter({ value, onChange }: Props) {
  const theme = useTheme();

  const select = (next: CategoryFilterValue) => {
    if (next === value) return;
    onChange(next);
    void Haptics.selectionAsync();
  };

  const chips: { key: CategoryFilterValue; label: string; accent: string | null }[] = [
    { key: 'all', label: 'All', accent: null },
    ...CATEGORIES.map((category) => ({
      key: category.id as CategoryFilterValue,
      label: category.label,
      accent: categoryAccent(category.id, theme.dark),
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {chips.map((chip) => {
        const selected = chip.key === value;
        const tint = chip.accent ?? theme.text;
        return (
          <Pressable
            key={chip.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => select(chip.key)}
            style={({ pressed }) => [
              styles.chip,
              selected
                ? { backgroundColor: theme.card, borderColor: tint }
                : { backgroundColor: theme.fill, borderColor: 'transparent' },
              { opacity: pressed ? 0.6 : 1 },
            ]}>
            {chip.accent ? (
              <View style={[styles.dot, { backgroundColor: chip.accent }]} />
            ) : null}
            <Text
              style={[
                styles.chipText,
                { color: selected ? tint : theme.muted, fontWeight: selected ? '700' : '500' },
              ]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 14,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
  },
});
