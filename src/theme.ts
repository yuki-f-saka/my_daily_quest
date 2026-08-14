import { Platform } from 'react-native';

/**
 * A system monospace face, for the retro message window. Ships with the OS, so
 * no font file is added.
 */
export const MONO_FONT = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** What the user picked. `system` follows the iPhone's appearance setting. */
export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

export type Theme = {
  dark: boolean;
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  /** Subtle fill for tappable surfaces sitting on a card. */
  fill: string;
  accent: string;
  /** Only for the one destructive control in the app. */
  danger: string;
  overlay: string;
  /** Border colour of every window and panel. */
  frame: string;
  /** Hard, unblurred drop shadow behind a panel. No soft shadows in here. */
  frameShadow: string;
};

export const lightTheme: Theme = {
  dark: false,
  bg: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  muted: '#6E6E73',
  border: '#E5E5EA',
  fill: '#EFEFF4',
  accent: '#3F6FE0',
  danger: '#B23B3B',
  overlay: 'rgba(0,0,0,0.28)',
  frame: '#2B2D33',
  frameShadow: '#CFCFD6',
};

export const darkTheme: Theme = {
  dark: true,
  bg: '#0C0D10',
  card: '#17181C',
  text: '#F2F3F5',
  muted: '#8B8D96',
  border: '#25272D',
  fill: '#212329',
  accent: '#7FA0F0',
  danger: '#E08A8A',
  overlay: 'rgba(0,0,0,0.6)',
  frame: '#E4E6EB',
  frameShadow: '#31343C',
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return THEME_PREFERENCES.includes(value as ThemePreference);
}
