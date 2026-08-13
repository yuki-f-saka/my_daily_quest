import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../themeStore';

type Props<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Spreads the segments across the full width instead of hugging their labels. */
  stretch?: boolean;
  accessibilityLabelPrefix?: string;
};

/**
 * A menu strip. The chosen entry is inverted, the way a highlighted row looks in
 * an RPG menu, rather than being lifted like an iOS segment.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  stretch = false,
  accessibilityLabelPrefix,
}: Props<T>) {
  const theme = useTheme();

  const select = (next: T) => {
    if (next === value) return;
    onChange(next);
    void Haptics.selectionAsync();
  };

  return (
    <View style={[styles.track, { backgroundColor: theme.fill, borderColor: theme.frame }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={
              accessibilityLabelPrefix
                ? `${accessibilityLabelPrefix}: ${option.label}`
                : option.label
            }
            onPress={() => select(option.value)}
            style={({ pressed }) => [
              styles.segment,
              stretch && styles.stretched,
              selected && { backgroundColor: theme.frame },
              { opacity: pressed ? 0.6 : 1 },
            ]}>
            <Text
              style={[
                styles.segmentText,
                {
                  color: selected ? theme.card : theme.muted,
                  fontWeight: selected ? '700' : '500',
                },
              ]}>
              {option.label}
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
    borderWidth: 2,
    borderRadius: 0,
    padding: 2,
    gap: 2,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 0,
    alignItems: 'center',
  },
  stretched: {
    flex: 1,
  },
  segmentText: {
    fontSize: 12.5,
  },
});
