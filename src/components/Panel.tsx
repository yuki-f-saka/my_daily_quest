import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../themeStore';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Applied to the innermost container, where the content actually sits. */
  contentStyle?: StyleProp<ViewStyle>;
  /** Solid drop shadow down the right and bottom edges. */
  shadow?: boolean;
  /** Thick outer frame with a thin inner line: reserved for dialogs. */
  double?: boolean;
};

const SHADOW_WIDTH = 4;

/**
 * The window every surface in this app is made of: square corners, a solid
 * frame, and an unblurred drop shadow — the way a menu box is drawn in a 2D RPG.
 *
 * The shadow is drawn as right and bottom borders on a wrapper rather than as an
 * offset layer, so it needs no absolute positioning and cannot drift.
 */
export function Panel({ children, style, contentStyle, shadow = true, double = false }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        shadow && {
          borderRightWidth: SHADOW_WIDTH,
          borderBottomWidth: SHADOW_WIDTH,
          borderRightColor: theme.frameShadow,
          borderBottomColor: theme.frameShadow,
        },
        style,
      ]}>
      <View
        style={[
          styles.frame,
          double ? styles.frameDouble : styles.frameSingle,
          { borderColor: theme.frame, backgroundColor: theme.card },
          double ? null : contentStyle,
        ]}>
        {double ? (
          <View style={[styles.innerFrame, { borderColor: theme.frame }, contentStyle]}>
            {children}
          </View>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    // Square. A rounded pixel window is not a pixel window.
    borderRadius: 0,
  },
  frameSingle: {
    borderWidth: 2,
  },
  frameDouble: {
    borderWidth: 4,
    padding: 3,
  },
  innerFrame: {
    borderWidth: 1,
  },
});
