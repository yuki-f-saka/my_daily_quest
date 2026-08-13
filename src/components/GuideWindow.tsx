import React, { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { MONO_FONT } from '../theme';
import { useTheme } from '../themeStore';
import { PixelHero } from './PixelHero';

/** Three verbs. That is the entire manual. */
const LINES = ['Tap what you did', 'Gain XP', 'Look at the pile'];

type Props = {
  visible: boolean;
  onClose: () => void;
};

/**
 * An RPG message window: double pixel frame, monospace type, the hero standing
 * at the left as if he were the one talking, and a blinking ▼ to move on.
 * Tapping anywhere closes it, the way those windows always worked.
 */
export function GuideWindow({ visible, onClose }: Props) {
  const theme = useTheme();
  const cursor = useCursorBlink(visible);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <View style={[styles.frame, { backgroundColor: theme.card, borderColor: theme.text }]}>
          <View style={[styles.inner, { borderColor: theme.text }]}>
            <View style={styles.row}>
              <PixelHero />

              <View style={styles.lines}>
                {LINES.map((line) => (
                  <Text key={line} style={[styles.line, { color: theme.text }]}>
                    {line}
                  </Text>
                ))}
              </View>
            </View>

            <Text style={[styles.signature, { color: theme.muted }]}>
              You never fail. You only gain XP.
            </Text>

            <Animated.Text style={[styles.cursor, { color: theme.text, opacity: cursor }]}>
              ▼
            </Animated.Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

/** The link that opens the window again later. */
export function GuideLink({ onPress }: { onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.link, { opacity: pressed ? 0.5 : 1 }]}>
      <Text style={[styles.linkText, { color: theme.muted }]}>[ how this works ]</Text>
    </Pressable>
  );
}

/** Hard on, hard off, like a cursor waiting for the A button. */
function useCursorBlink(visible: boolean) {
  const [blink] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!visible) return;

    blink.setValue(1);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(520),
        Animated.timing(blink, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(380),
        Animated.timing(blink, { toValue: 1, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [visible, blink]);

  return blink;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  frame: {
    width: '100%',
    maxWidth: 340,
    borderWidth: 4,
    // Square corners: this is a pixel window, not a card.
    borderRadius: 0,
    padding: 4,
  },
  inner: {
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lines: {
    flex: 1,
    marginLeft: 18,
  },
  line: {
    fontFamily: MONO_FONT,
    fontSize: 14.5,
    lineHeight: 25,
  },
  signature: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    marginTop: 16,
  },
  cursor: {
    position: 'absolute',
    right: 10,
    bottom: 6,
    fontFamily: MONO_FONT,
    fontSize: 13,
  },
  link: {
    marginTop: 22,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  linkText: {
    fontFamily: MONO_FONT,
    fontSize: 12.5,
    letterSpacing: 0.3,
  },
});
