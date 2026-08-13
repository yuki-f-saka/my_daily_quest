import React from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES } from '../categories';
import { CategoryCard } from '../components/CategoryCard';
import { HomeSettings } from '../components/HomeSettings';
import { PixelHero } from '../components/PixelHero';
import { Screen, SCREEN_PADDING } from '../components/Screen';
import { useXPStore } from '../store';
import { useTheme } from '../themeStore';

export function HomeScreen() {
  const theme = useTheme();
  const { stats, addXP } = useXPStore();
  const totalScale = useTotalPulse(stats.totalXP);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.kicker, { color: theme.muted }]}>MY DAILY QUEST</Text>
            <Animated.View style={[styles.totalRow, { transform: [{ scale: totalScale }] }]}>
              <Text style={[styles.total, { color: theme.text }]}>
                {stats.totalXP}
                <Text style={[styles.totalUnit, { color: theme.muted }]}> XP</Text>
              </Text>
            </Animated.View>
            <Text style={[styles.tagline, { color: theme.muted }]}>
              You never fail. You only gain XP.
            </Text>
          </View>

          <PixelHero />
        </View>

        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            totalXP={stats.byCategory[category.id]}
            onAddXP={(xp) => addXP(category.id, xp)}
          />
        ))}

        <HomeSettings />
      </ScrollView>
    </Screen>
  );
}

/** A small nudge on the running total whenever it grows. */
function useTotalPulse(totalXP: number) {
  const [pulse] = React.useState(() => new Animated.Value(0));
  const previous = React.useRef(totalXP);

  React.useEffect(() => {
    if (totalXP === previous.current) return;
    previous.current = totalXP;

    pulse.setValue(0);
    Animated.timing(pulse, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [totalXP, pulse]);

  return pulse.interpolate({ inputRange: [0, 0.35, 1], outputRange: [1, 1.06, 1] });
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  totalRow: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  total: {
    fontSize: 46,
    fontWeight: '700',
    letterSpacing: -1.4,
  },
  totalUnit: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0,
  },
  tagline: {
    marginTop: 10,
    fontSize: 14,
  },
});
