import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { categoryAccent, categoryLabel } from '../categories';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { CategoryFilter, type CategoryFilterValue } from '../components/CategoryFilter';
import { Screen, SCREEN_PADDING, ScreenHeader } from '../components/Screen';
import { Segmented } from '../components/Segmented';
import { SubPeriodBars } from '../components/SubPeriodBars';
import { useXPStore } from '../store';
import { useTheme } from '../themeStore';
import type { XPEntry } from '../types';
import { formatTime, groupByPeriod, PERIOD_MODES, type PeriodMode } from '../xp';

const PERIOD_LABELS: Record<PeriodMode, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
  year: 'Year',
};

const PERIOD_OPTIONS = PERIOD_MODES.map((value) => ({ value, label: PERIOD_LABELS[value] }));

export function HistoryScreen() {
  const theme = useTheme();
  const { entries } = useXPStore();
  const [mode, setMode] = useState<PeriodMode>('day');
  const [filter, setFilter] = useState<CategoryFilterValue>('all');

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((entry) => entry.category === filter)),
    [entries, filter],
  );
  const buckets = useMemo(() => groupByPeriod(visible, mode), [visible, mode]);

  return (
    <Screen>
      <View style={styles.headerArea}>
        <ScreenHeader title="History" dense />
        <Segmented
          options={PERIOD_OPTIONS}
          value={mode}
          onChange={setMode}
          stretch
          accessibilityLabelPrefix="Period"
        />
      </View>

      <View style={styles.filterArea}>
        <CategoryFilter value={filter} onChange={setFilter} />
      </View>

      <FlatList
        data={buckets}
        keyExtractor={(bucket) => bucket.key}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        windowSize={9}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            {filter === 'all'
              ? 'Nothing here yet. Whatever you do next shows up right here.'
              : `Nothing in ${categoryLabel(filter)} yet. It will show up here once there is.`}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.bucket}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.total, { color: theme.text }]}>
                +{item.totalXP}
                <Text style={[styles.totalUnit, { color: theme.muted }]}> XP</Text>
              </Text>
            </View>

            <CategoryBreakdown byCategory={item.byCategory} />

            {mode === 'day' ? (
              <View style={styles.entries}>
                {item.entries.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </View>
            ) : (
              <SubPeriodBars parts={item.parts} />
            )}
          </View>
        )}
      />
    </Screen>
  );
}

function EntryRow({ entry }: { entry: XPEntry }) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.rowXP, { color: categoryAccent(entry.category, theme.dark) }]}>
        +{entry.xp}
      </Text>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{categoryLabel(entry.category)}</Text>
      <Text style={[styles.rowTime, { color: theme.muted }]}>{formatTime(entry.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    paddingHorizontal: SCREEN_PADDING,
  },
  filterArea: {
    paddingTop: 14,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 32,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
  },
  bucket: {
    marginBottom: 26,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalUnit: {
    fontSize: 13,
    fontWeight: '600',
  },
  entries: {
    marginTop: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  rowXP: {
    width: 34,
    fontSize: 16,
    fontWeight: '700',
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
  },
  rowTime: {
    fontSize: 13,
  },
});
