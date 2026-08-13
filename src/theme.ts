import { useColorScheme } from 'react-native';

export type Theme = {
  dark: boolean;
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  /** Subtle fill for tappable surfaces. */
  fill: string;
  accent: string;
  overlay: string;
};

const light: Theme = {
  dark: false,
  bg: '#F4F4F6',
  card: '#FFFFFF',
  text: '#15161A',
  muted: '#71727A',
  border: '#E4E4E8',
  fill: '#F1F1F4',
  accent: '#3F6FE0',
  overlay: 'rgba(0,0,0,0.35)',
};

const dark: Theme = {
  dark: true,
  bg: '#0C0D10',
  card: '#17181C',
  text: '#F2F3F5',
  muted: '#8B8D96',
  border: '#25272D',
  fill: '#212329',
  accent: '#7FA0F0',
  overlay: 'rgba(0,0,0,0.6)',
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
