import * as Haptics from 'expo-haptics';
import React from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';

import { useSound } from '../soundStore';
import { useXPStore } from '../store';
import { useTheme } from '../themeStore';
import { AppearanceControl } from './AppearanceControl';
import { Panel } from './Panel';
import { PixelButton } from './PixelButton';

/** The knobs this app has. Kept small, at the bottom of Home, below the cards. */
export function HomeSettings() {
  const theme = useTheme();
  const { enabled, setEnabled } = useSound();
  const { stats, resetXP } = useXPStore();

  const toggleSound = (next: boolean) => {
    setEnabled(next);
    void Haptics.selectionAsync();
  };

  const confirmReset = () => {
    Alert.alert(
      'Start over?',
      `This clears all ${stats.totalXP} XP and every unlocked achievement. It cannot be undone.`,
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetXP();
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ],
    );
  };

  return (
    <Panel style={styles.panel} contentStyle={styles.content}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.muted }]}>APPEARANCE</Text>
        <AppearanceControl />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.muted }]}>SOUND</Text>
        <Switch
          value={enabled}
          onValueChange={toggleSound}
          trackColor={{ false: theme.fill, true: theme.accent }}
          ios_backgroundColor={theme.fill}
        />
      </View>

      {/*
        Development only, and only while there is something to clear. A release
        build has no reset: in an app whose whole claim is that the pile only
        grows, one mistaken tap should not be able to empty it.
      */}
      {__DEV__ && stats.entryCount > 0 ? (
        <>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.muted }]}>XP LOG</Text>
            <PixelButton
              label="Reset"
              tint={theme.danger}
              style={styles.reset}
              accessibilityLabel="Reset all XP"
              onPress={confirmReset}
            />
          </View>
        </>
      ) : null}
    </Panel>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 14,
  },
  content: {
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  divider: {
    height: 1,
  },
  reset: {
    minWidth: 96,
  },
});
