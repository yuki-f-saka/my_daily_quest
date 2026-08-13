import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { HERO_FRAMES, heroPalette } from '../hero';
import { useTheme } from '../themeStore';
import { PixelArt } from './PixelArt';

/**
 * Cycles the hero's idle frames. He stands still whenever Home is not the
 * visible tab, so nothing animates off-screen.
 */
export function PixelHero({ pixel = 4 }: { pixel?: number }) {
  const theme = useTheme();
  const focused = useIsFocused();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!focused) return;

    const timer = setTimeout(() => {
      setIndex((current) => (current + 1) % HERO_FRAMES.length);
    }, HERO_FRAMES[index].ms);

    return () => clearTimeout(timer);
  }, [index, focused]);

  return (
    <PixelArt
      rows={HERO_FRAMES[index].rows}
      palette={heroPalette(theme.dark)}
      pixel={pixel}
      accessibilityLabel="A small hero, waiting around for your next XP"
    />
  );
}
