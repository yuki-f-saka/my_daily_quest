import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSound } from '../soundStore';
import { useTheme } from '../themeStore';
import type { Achievement } from '../types';

type Props = {
  achievement: Achievement | null;
  onDismiss: () => void;
};

export function AchievementUnlockedModal({ achievement, onDismiss }: Props) {
  const theme = useTheme();
  const { playUnlock } = useSound();
  const [entrance] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!achievement) return;

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playUnlock();
    entrance.setValue(0);
    Animated.spring(entrance, {
      toValue: 1,
      friction: 9,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [achievement, entrance, playUnlock]);

  const scale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });

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
