import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../themeStore';

type Props = {
  label: string;
  onPress: () => void;
  /** Frame and label colour. Defaults to the panel frame colour. */
  tint?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const PRESS_OFFSET = 3;

/**
 * A command button. Pressing it drops the face into its own shadow, which is how
 * these buttons have always felt.
 */
export function PixelButton({ label, onPress, tint, style, accessibilityLabel }: Props) {
  const theme = useTheme();
  const colour = tint ?? theme.frame;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        {
          // The shadow disappears as the face moves into its place.
          borderRightColor: pressed ? 'transparent' : theme.frameShadow,
          borderBottomColor: pressed ? 'transparent' : theme.frameShadow,
        },
        style,
      ]}>
      {({ pressed }) => (
        <View
          style={[
            styles.face,
            { borderColor: colour, backgroundColor: theme.fill },
            pressed && styles.facePressed,
          ]}>
          <Text style={[styles.label, { color: colour }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRightWidth: PRESS_OFFSET,
    borderBottomWidth: PRESS_OFFSET,
  },
  face: {
    borderWidth: 2,
    borderRadius: 0,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facePressed: {
    transform: [{ translateX: PRESS_OFFSET }, { translateY: PRESS_OFFSET }],
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
