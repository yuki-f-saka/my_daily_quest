import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';

import { BADGE_ART, badgePalette } from '../badges';
import { useSound } from '../soundStore';
import { useTheme } from '../themeStore';
import type { Achievement } from '../types';
import { Panel } from './Panel';
import { PixelArt } from './PixelArt';
import { PixelButton } from './PixelButton';

const BADGE_PIXEL = 7;

type Props = {
  achievement: Achievement | null;
  onDismiss: () => void;
};

/** The same message window as the guide, handing over a badge. */
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
      // The badge lands a beat after the window, so it reads as being handed over.
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
          style={[styles.wrapper, { opacity: entrance, transform: [{ scale }] }]}>
          <Panel double contentStyle={styles.content}>
            {achievement ? (
              <Animated.View
                style={[
                  styles.badgeBox,
                  { borderColor: theme.frame, backgroundColor: theme.fill },
                  { opacity: badgePop, transform: [{ scale: badgeScale }] },
                ]}>
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
            <Text style={[styles.description, { color: theme.muted }]}>
              {achievement?.description}
            </Text>

            <PixelButton label="Nice" onPress={onDismiss} style={styles.button} />
          </Panel>
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
  wrapper: {
    width: '100%',
    maxWidth: 320,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
  },
  badgeBox: {
    borderWidth: 2,
    borderRadius: 0,
    padding: 10,
    marginBottom: 18,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 10,
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
    marginTop: 20,
    alignSelf: 'stretch',
  },
});
