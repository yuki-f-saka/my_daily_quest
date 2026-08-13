import React, { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import { categoryAccent, categoryLabel } from '../categories';
import { Screen, SCREEN_PADDING, ScreenHeader } from '../components/Screen';
import { useXPStore } from '../store';
import { useTheme } from '../themeStore';
import { formatTime, groupByDay } from '../xp';

export function HistoryScreen() {
  const theme = useTheme();
  const { entries } = useXPStore();
  const sections = useMemo(() => groupByDay(entries), [entries]);

  return (
    <Screen>
      <SectionList
        sections={sections}
        keyExtractor={(entry) => entry.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ScreenHeader title="History" subtitle="Everything you actually did." />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            Nothing here yet. Whatever you do next shows up right here.
          </Text>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
            <Text style={[styles.sectionTotal, { color: theme.muted }]}>+{section.totalXP} XP</Text>
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
            <Text style={[styles.rowTime, { color: theme.muted }]}>{formatTime(item.createdAt)}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 32,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionTotal: {
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
