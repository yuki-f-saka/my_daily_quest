import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import type { CategoryMeta } from '../categories';
import { useSound } from '../soundStore';
import { useTheme } from '../themeStore';
import { Panel } from './Panel';
import { PixelButton } from './PixelButton';

const XP_OPTIONS = [1, 2];

type Props = {
  category: CategoryMeta;
  totalXP: number;
  onAddXP: (xp: number) => void;
};

export function CategoryCard({ category, totalXP, onAddXP }: Props) {
  const theme = useTheme();
  const { playXP } = useSound();
  const accent = theme.dark ? category.accent.dark : category.accent.light;

  const [pop] = useState(() => new Animated.Value(0));
  const [lastDelta, setLastDelta] = useState(0);

  const handleAdd = (xp: number) => {
    setLastDelta(xp);
    onAddXP(xp);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playXP(xp);

    pop.setValue(0);
    Animated.timing(pop, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const numberScale = pop.interpolate({ inputRange: [0, 0.3, 1], outputRange: [1, 1.12, 1] });
  const deltaOpacity = pop.interpolate({ inputRange: [0, 0.12, 0.6, 1], outputRange: [0, 1, 1, 0] });
  const deltaTranslateY = pop.interpolate({ inputRange: [0, 1], outputRange: [0, -26] });

  return (
    <Panel style={styles.card} contentStyle={styles.content}>
      <View style={styles.labelRow}>
        <View style={[styles.marker, { backgroundColor: accent }]} />
        <Text style={[styles.label, { color: theme.muted }]}>{category.label.toUpperCase()}</Text>
      </View>

      <View style={styles.amountRow}>
        <Animated.View style={{ transform: [{ scale: numberScale }] }}>
          <Text style={[styles.amount, { color: theme.text }]}>
            {totalXP}
            <Text style={[styles.amountUnit, { color: theme.muted }]}> XP</Text>
          </Text>
        </Animated.View>

        <Animated.Text
          style={[
            styles.delta,
            { color: accent, opacity: deltaOpacity, transform: [{ translateY: deltaTranslateY }] },
          ]}>
          +{lastDelta}
        </Animated.Text>
      </View>

      <View style={styles.buttonRow}>
        {XP_OPTIONS.map((xp) => (
          <PixelButton
            key={xp}
            label={`+${xp} XP`}
            tint={accent}
            style={styles.button}
            accessibilityLabel={`Add ${xp} XP to ${category.label}`}
            onPress={() => handleAdd(xp)}
          />
        ))}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marker: {
    width: 8,
    height: 8,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  amount: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  amountUnit: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  delta: {
    marginLeft: 10,
    marginBottom: 6,
    fontSize: 17,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
