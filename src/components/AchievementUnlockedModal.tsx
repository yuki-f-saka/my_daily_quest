import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { BADGE_ART, badgePalette } from '../badges';
import { useSound } from '../soundStore';
import { useTheme } from '../themeStore';
import type { Achievement } from '../types';
import { PixelArt } from './PixelArt';

const BADGE_PIXEL = 7;

type Props = {
  achievement: Achievement | null;
  onDismiss: () => void;
};

export function AchievementUnlockedModal({ achievement, onDismiss }: Props) {
  const theme = useTheme();
  const { playUnlock } = useSound();
  const [entrance] = useState(() => new Animated.Value(0));
  const [badgePop] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!achievement) return;

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playUnlock();

    entrance.setValue(0);
    badgePop.setValue(0);
    Animated.parallel([
      Animated.spring(entrance, {
        toValue: 1,
        friction: 9,
        tension: 80,
        useNativeDriver: true,
      }),
      // The badge lands a beat after the card, so it reads as being handed over.
      Animated.spring(badgePop, {
        toValue: 1,
        delay: 110,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [achievement, entrance, badgePop, playUnlock]);

  const scale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });
  const badgeScale = badgePop.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <Modal
      visible={achievement !== null}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}>
      <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <Animated.View
          style={[
            styles.card,
            theme.shadow,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: entrance,
              transform: [{ scale }],
            },
          ]}>
          {achievement ? (
            <Animated.View
              style={[styles.badge, { opacity: badgePop, transform: [{ scale: badgeScale }] }]}>
              <PixelArt
                rows={BADGE_ART[achievement.id].rows}
                palette={badgePalette(achievement.id, theme.dark)}
                pixel={BADGE_PIXEL}
                accessibilityLabel={`${achievement.title} badge`}
              />
            </Animated.View>
          ) : null}

          <Text style={[styles.kicker, { color: theme.accent }]}>ACHIEVEMENT UNLOCKED</Text>
          <Text style={[styles.title, { color: theme.text }]}>{achievement?.title}</Text>
          <Text style={[styles.description, { color: theme.muted }]}>{achievement?.description}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.fill, borderColor: theme.border, opacity: pressed ? 0.6 : 1 },
            ]}>
            <Text style={[styles.buttonText, { color: theme.text }]}>Nice</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 20,
    alignItems: 'center',
  },
  badge: {
    marginBottom: 18,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  button: {
    marginTop: 22,
    alignSelf: 'stretch',
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
