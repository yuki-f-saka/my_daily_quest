import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { findAchievement } from '../achievements';
import { BADGE_ART, badgePalette } from '../badges';
import { Panel } from '../components/Panel';
import { PixelArt } from '../components/PixelArt';
import { Screen, SCREEN_PADDING, ScreenHeader } from '../components/Screen';
import { useXPStore } from '../store';
import { useTheme } from '../themeStore';
import { formatDate } from '../xp';

const BADGE_PIXEL = 4;

export function AchievementsScreen() {
  const theme = useTheme();
  const { unlocked } = useXPStore();

  /** Newest unlock first. Locked achievements stay hidden — they are not targets. */
  const items = useMemo(
    () =>
      [...unlocked].reverse().flatMap((entry) => {
        const achievement = findAchievement(entry.id);
        return achievement ? [{ ...entry, achievement }] : [];
      }),
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
          <Panel style={styles.card} contentStyle={styles.cardContent}>
            {/* The badge sits in its own box, like an item in a slot. */}
            <View style={[styles.badgeBox, { borderColor: theme.frame, backgroundColor: theme.fill }]}>
              <PixelArt
                rows={BADGE_ART[item.id].rows}
                palette={badgePalette(item.id, theme.dark)}
                pixel={BADGE_PIXEL}
                accessibilityLabel={`${item.achievement.title} badge`}
              />
            </View>

            <View style={styles.body}>
              <Text style={[styles.title, { color: theme.text }]}>{item.achievement.title}</Text>
              <Text style={[styles.description, { color: theme.muted }]}>
                {item.achievement.description}
              </Text>
              <Text style={[styles.date, { color: theme.muted }]}>
                Unlocked {formatDate(item.unlockedAt)}
              </Text>
            </View>
          </Panel>
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
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  badgeBox: {
    borderWidth: 2,
    borderRadius: 0,
    padding: 6,
  },
  body: {
    flex: 1,
    marginLeft: 14,
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
