import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../themeStore';
import type { PeriodPart } from '../xp';

/**
 * Horizontal bars for the sub-periods of a week, month or year.
 *
 * Only sub-periods that hold XP are passed in, so this chart has no empty
 * slots and no zero bars: it shows what happened, never what did not.
 */
export function SubPeriodBars({ parts }: { parts: PeriodPart[] }) {
  const theme = useTheme();
  if (parts.length === 0) return null;

  const max = parts.reduce((highest, part) => Math.max(highest, part.totalXP), 0);

  return (
    <View style={styles.wrapper}>
      {parts.map((part) => (
        <View key={part.key} style={styles.row}>
          <Text style={[styles.label, { color: theme.muted }]} numberOfLines={1}>
            {part.label}
          </Text>
          <View style={[styles.track, { backgroundColor: theme.fill }]}>
            <View
              style={[
                styles.bar,
                { backgroundColor: theme.accent, width: `${(part.totalXP / max) * 100}%` },
              ]}
            />
          </View>
          <Text style={[styles.value, { color: theme.text }]}>+{part.totalXP}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 94,
    fontSize: 11.5,
    fontWeight: '600',
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: 8,
    minWidth: 6,
    borderRadius: 4,
  },
  value: {
    width: 40,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
  },
});
