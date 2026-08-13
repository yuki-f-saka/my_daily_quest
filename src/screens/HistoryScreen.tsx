import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import { categoryAccent, categoryLabel } from '../categories';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { CategoryFilter, type CategoryFilterValue } from '../components/CategoryFilter';
import { Screen, SCREEN_PADDING, ScreenHeader } from '../components/Screen';
import { useXPStore } from '../store';
import { useTheme } from '../themeStore';
import { formatTime, groupByDay } from '../xp';

export function HistoryScreen() {
  const theme = useTheme();
  const { entries } = useXPStore();
  const [filter, setFilter] = useState<CategoryFilterValue>('all');

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((entry) => entry.category === filter)),
    [entries, filter],
  );
  const sections = useMemo(() => groupByDay(visible), [visible]);

  return (
    <Screen>
      <View style={styles.headerArea}>
        <ScreenHeader title="History" subtitle="Everything you actually did." />
      </View>
      <CategoryFilter value={filter} onChange={setFilter} />

      <SectionList
        sections={sections}
        keyExtractor={(entry) => entry.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        initialNumToRender={12}
        windowSize={11}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            {filter === 'all'
              ? 'Nothing here yet. Whatever you do next shows up right here.'
              : `Nothing in ${categoryLabel(filter)} yet. It will show up here once there is.`}
          </Text>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
              <Text style={[styles.sectionTotal, { color: theme.text }]}>
                +{section.totalXP}
                <Text style={[styles.sectionTotalUnit, { color: theme.muted }]}> XP</Text>
              </Text>
            </View>
            <CategoryBreakdown byCategory={section.byCategory} />
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.rowXP, { color: categoryAccent(item.category, theme.dark) }]}>
              +{item.xp}
            </Text>
            <Text style={[styles.rowLabel, { color: theme.text }]}>
              {categoryLabel(item.category)}
            </Text>
            <Text style={[styles.rowTime, { color: theme.muted }]}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    paddingHorizontal: SCREEN_PADDING,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 32,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTotalUnit: {
    fontSize: 13,
    fontWeight: '600',
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
