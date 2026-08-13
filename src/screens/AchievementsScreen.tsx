import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { findAchievement } from '../achievements';
import { Screen, SCREEN_PADDING, ScreenHeader } from '../components/Screen';
import { useXPStore } from '../store';
import { useTheme } from '../themeStore';
import { formatDate } from '../xp';

export function AchievementsScreen() {
  const theme = useTheme();
  const { unlocked } = useXPStore();

  /** Newest unlock first. Locked achievements stay hidden — they are not targets. */
  const items = useMemo(
    () =>
      [...unlocked]
        .reverse()
        .map((u) => ({ ...u, achievement: findAchievement(u.id) }))
        .filter((item) => item.achievement !== undefined),
    [unlocked],
  );

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ScreenHeader title="Achievements" subtitle="Unlocked by things you already did." />
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            Nothing unlocked yet. These appear on their own, after the fact.
          </Text>
        }
        ListFooterComponent={
          items.length > 0 ? (
            <Text style={[styles.footer, { color: theme.muted }]}>
              The rest stay hidden until they unlock.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
              theme.shadow,
            ]}>
            <Text style={[styles.title, { color: theme.text }]}>{item.achievement?.title}</Text>
            <Text style={[styles.description, { color: theme.muted }]}>
              {item.achievement?.description}
            </Text>
            <Text style={[styles.date, { color: theme.muted }]}>
              Unlocked {formatDate(item.unlockedAt)}
            </Text>
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
  footer: {
    marginTop: 18,
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    marginTop: 10,
    fontSize: 12,
  },
});
