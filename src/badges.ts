import type { PixelPalette } from './components/PixelArt';
import type { AchievementId } from './types';

/**
 * One 11x11 sprite per achievement, drawn as pixels so the badges need no image
 * assets and can be recoloured per theme.
 *
 * Characters: `.` transparent, `o` outline, `m` main, `l` highlight, `d` base.
 * The Explorer badge additionally uses `a` `c` `b` `s` for the four categories.
 */
type PaletteName = 'blue' | 'green' | 'amber' | 'purple' | 'multi';

type BadgeArt = { rows: string[]; palette: PaletteName };

export const BADGE_ART: Record<AchievementId, BadgeArt> = {
  // A spark: something happened for the first time.
  'first-step': {
    palette: 'blue',
    rows: [
      '...........',
      '.....m.....',
      '....mmm....',
      '..m.mmm.m..',
      '...mmmmm...',
      '.mmmmlmmmm.',
      '...mmmmm...',
      '..m.mmm.m..',
      '....mmm....',
      '.....m.....',
      '...........',
    ],
  },

  // A terminal with a prompt and a cursor.
  'back-to-coding': {
    palette: 'green',
    rows: [
      '...........',
      '.ooooooooo.',
      '.o.......o.',
      '.o.mm....o.',
      '.o..mm...o.',
      '.o.mm....o.',
      '.o.......o.',
      '.o..lll..o.',
      '.o.......o.',
      '.ooooooooo.',
      '...........',
    ],
  },

  // Bars that have piled up.
  'coding-10': {
    palette: 'green',
    rows: [
      '...........',
      '...........',
      '........ll.',
      '........ll.',
      '.....mm.ll.',
      '.....mm.ll.',
      '..mm.mm.ll.',
      '..mm.mm.ll.',
      '..mm.mm.ll.',
      '.ddddddddd.',
      '...........',
    ],
  },

  // A speech bubble with two lines in it.
  storyteller: {
    palette: 'amber',
    rows: [
      '...........',
      '.mmmmmmmmm.',
      '.m.......m.',
      '.m.lllll.m.',
      '.m.......m.',
      '.m.lllll.m.',
      '.m.......m.',
      '.mmmm.mmmm.',
      '...mm......',
      '..mm.......',
      '...........',
    ],
  },

  // Roof, columns, base.
  architect: {
    palette: 'purple',
    rows: [
      '...........',
      '.ooooooooo.',
      '..ooooooo..',
      '...........',
      '..m.m.m.m..',
      '..m.m.m.m..',
      '..m.m.m.m..',
      '..m.m.m.m..',
      '..m.m.m.m..',
      '.ooooooooo.',
      '...........',
    ],
  },

  // All four categories, one square each.
  explorer: {
    palette: 'multi',
    rows: [
      '...........',
      '.ooooooooo.',
      '.oaaa.ccco.',
      '.oaaa.ccco.',
      '.oaaa.ccco.',
      '.o.......o.',
      '.obbb.ssso.',
      '.obbb.ssso.',
      '.obbb.ssso.',
      '.ooooooooo.',
      '...........',
    ],
  },

  // A sunrise. Coming back is a new morning, not a broken streak.
  'welcome-back': {
    palette: 'amber',
    rows: [
      '.....l.....',
      '.l.......l.',
      '...mmmmm...',
      '..mmmmmmm..',
      '..mmmmmmm..',
      'l.mmmmmmm.l',
      '..mmmmmmm..',
      '..mmmmmmm..',
      '...mmmmm...',
      '.l.......l.',
      '.....l.....',
    ],
  },
};

const PALETTES: Record<PaletteName, { light: PixelPalette; dark: PixelPalette }> = {
  blue: {
    light: { m: '#3F6FE0', l: '#A9C0F7', o: '#2C55B8', d: '#2C55B8' },
    dark: { m: '#7FA0F0', l: '#D3DEFB', o: '#5A82E0', d: '#5A82E0' },
  },
  green: {
    light: { m: '#2E8F6B', l: '#7FD8B4', o: '#226B50', d: '#226B50' },
    dark: { m: '#5FC49B', l: '#C2EEDA', o: '#3FA37A', d: '#3FA37A' },
  },
  amber: {
    light: { m: '#B37430', l: '#EFC48F', o: '#8A5822', d: '#8A5822' },
    dark: { m: '#DDA55E', l: '#F6DDBA', o: '#B37430', d: '#B37430' },
  },
  purple: {
    light: { m: '#6E5CC4', l: '#C6BBF5', o: '#54449E', d: '#54449E' },
    dark: { m: '#A594EE', l: '#DCD5FA', o: '#6E5CC4', d: '#6E5CC4' },
  },
  multi: {
    light: {
      a: '#3F6FE0',
      c: '#2E8F6B',
      b: '#B37430',
      s: '#6E5CC4',
      o: '#C9C9CF',
      m: '#6E6E73',
      l: '#C9C9CF',
      d: '#6E6E73',
    },
    dark: {
      a: '#7FA0F0',
      c: '#5FC49B',
      b: '#DDA55E',
      s: '#A594EE',
      o: '#3A3C43',
      m: '#8B8D96',
      l: '#3A3C43',
      d: '#8B8D96',
    },
  },
};

export function badgePalette(id: AchievementId, dark: boolean): PixelPalette {
  const palette = PALETTES[BADGE_ART[id].palette];
  return dark ? palette.dark : palette.light;
}
