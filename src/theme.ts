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
  overlay: string;
  /** Cards float in light mode and sit flat in dark mode, like native iOS. */
  shadow: {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
  };
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
  overlay: 'rgba(0,0,0,0.28)',
  shadow: {
    shadowColor: '#0B1020',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
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
  overlay: 'rgba(0,0,0,0.6)',
  shadow: {
    shadowColor: '#000000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return THEME_PREFERENCES.includes(value as ThemePreference);
}
