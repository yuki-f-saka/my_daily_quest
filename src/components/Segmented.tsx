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

/** The one segmented control in the app: used for Appearance and for the History period. */
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
    <View style={[styles.track, { backgroundColor: theme.fill, borderColor: theme.border }]}>
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
    alignItems: 'center',
  },
  stretched: {
    flex: 1,
  },
  segmentText: {
    fontSize: 12.5,
  },
});
