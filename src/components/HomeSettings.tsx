import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { useSound } from '../soundStore';
import { useTheme } from '../themeStore';
import { AppearanceControl } from './AppearanceControl';
import { Panel } from './Panel';

/** The two knobs this app has. Kept small, at the bottom of Home, below the cards. */
export function HomeSettings() {
  const theme = useTheme();
  const { enabled, setEnabled } = useSound();

  const toggleSound = (next: boolean) => {
    setEnabled(next);
    void Haptics.selectionAsync();
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
});
