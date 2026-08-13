import type { PixelPalette } from './components/PixelArt';

/**
 * A small RPG hero who idles in the corner of Home.
 *
 * 12x14 pixels, three frames: standing, breathing in, and a blink. Same
 * character-sheet idea as the achievement badges, drawn with plain Views.
 *
 * Characters: `.` transparent, `o` outline, `h` helmet, `s` skin, `e` eyes,
 * `t` tunic, `b` belt, `p` trousers, `f` boots.
 */
const STANDING = [
  '...oooooo...',
  '..ohhhhhho..',
  '..ohhhhhho..',
  '..osssssso..',
  '..osesseso..',
  '..osssssso..',
  '..otttttto..',
  '.osttttttso.',
  '.osttttttso.',
  '..obbbbbbo..',
  '..opp..ppo..',
  '..opp..ppo..',
  '..off..ffo..',
  '..oo....oo..',
];

const BLINKING = [
  '...oooooo...',
  '..ohhhhhho..',
  '..ohhhhhho..',
  '..osssssso..',
  '..osssssso..',
  '..osssssso..',
  '..otttttto..',
  '.osttttttso.',
  '.osttttttso.',
  '..obbbbbbo..',
  '..opp..ppo..',
  '..opp..ppo..',
  '..off..ffo..',
  '..oo....oo..',
];

/** Head and torso settle a pixel lower, so he looks like he is breathing. */
const BREATHING = [
  '............',
  '...oooooo...',
  '..ohhhhhho..',
  '..ohhhhhho..',
  '..osssssso..',
  '..osesseso..',
  '..osssssso..',
  '..otttttto..',
  '.osttttttso.',
  '..obbbbbbo..',
  '..opp..ppo..',
  '..opp..ppo..',
  '..off..ffo..',
  '..oo....oo..',
];

export type HeroFrame = { rows: string[]; ms: number };

/** Slow on purpose: he is idling, not performing. */
export const HERO_FRAMES: HeroFrame[] = [
  { rows: STANDING, ms: 1100 },
  { rows: BREATHING, ms: 800 },
  { rows: STANDING, ms: 1400 },
  { rows: BLINKING, ms: 150 },
];

const LIGHT: PixelPalette = {
  o: '#2F323A',
  h: '#3F6FE0',
  s: '#E8B48C',
  e: '#2F323A',
  t: '#2E8F6B',
  b: '#8A5822',
  p: '#3A4A6B',
  f: '#54443A',
};

const DARK: PixelPalette = {
  o: '#5C6270',
  h: '#7FA0F0',
  s: '#E8B48C',
  e: '#2F323A',
  t: '#5FC49B',
  b: '#B37430',
  p: '#5E739C',
  f: '#6E5A4C',
};

export function heroPalette(dark: boolean): PixelPalette {
  return dark ? DARK : LIGHT;
}
