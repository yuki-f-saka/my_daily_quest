import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { categoryAccent, categoryLabel } from '../categories';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { CategoryFilter, type CategoryFilterValue } from '../components/CategoryFilter';
import { Panel } from '../components/Panel';
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
          <Panel style={styles.bucket}>
            {/* Inverted title bar, like the header of a menu window. */}
            <View style={[styles.titleBar, { backgroundColor: theme.frame }]}>
              <Text style={[styles.title, { color: theme.card }]}>{item.title}</Text>
              <Text style={[styles.total, { color: theme.card }]}>+{item.totalXP} XP</Text>
            </View>

            <View style={styles.body}>
              <CategoryBreakdown byCategory={item.byCategory} />

              {mode === 'day' ? (
                <View style={styles.entries}>
                  {item.entries.map((entry, index) => (
                    <EntryRow key={entry.id} entry={entry} first={index === 0} />
                  ))}
                </View>
              ) : (
                <SubPeriodBars parts={item.parts} />
              )}
            </View>
          </Panel>
        )}
      />
    </Screen>
  );
}

function EntryRow({ entry, first }: { entry: XPEntry; first: boolean }) {
  const theme = useTheme();

  return (
    <View style={[styles.row, !first && { borderTopWidth: 1, borderTopColor: theme.border }]}>
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
    marginBottom: 16,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  total: {
    fontSize: 13,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  entries: {
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
  },
  rowXP: {
    width: 34,
    fontSize: 15,
    fontWeight: '700',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
  },
  rowTime: {
    fontSize: 12.5,
  },
});
