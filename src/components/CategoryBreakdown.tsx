import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CATEGORIES, categoryAccent } from '../categories';
import { useTheme } from '../themeStore';
import type { Category } from '../types';

type Props = {
  byCategory: Record<Category, number>;
  /** Hides the text line when the entries themselves already name the categories. */
  showLegend?: boolean;
};

/** A thin stacked bar showing what a period was made of. Composition only, no target. */
export function CategoryBreakdown({ byCategory, showLegend = true }: Props) {
  const theme = useTheme();
  const present = CATEGORIES.filter((category) => byCategory[category.id] > 0);
  if (present.length === 0) return null;

  return (
    <View>
      <View style={[styles.bar, { backgroundColor: theme.fill }]}>
        {present.map((category) => (
          <View
            key={category.id}
            style={{
              flex: byCategory[category.id],
              backgroundColor: categoryAccent(category.id, theme.dark),
            }}
          />
        ))}
      </View>

      {showLegend ? (
        <View style={styles.legend}>
          {present.map((category, index) => (
            <View key={category.id} style={styles.legendItem}>
              {index > 0 ? <Text style={[styles.separator, { color: theme.border }]}>·</Text> : null}
              <Text style={[styles.legendText, { color: categoryAccent(category.id, theme.dark) }]}>
                {category.label} {byCategory[category.id]}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    fontSize: 12,
    marginHorizontal: 7,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
