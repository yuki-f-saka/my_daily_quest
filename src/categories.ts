import type { Category } from './types';

export type CategoryMeta = {
  id: Category;
  label: string;
  /** Muted accent, one tone per color scheme. */
  accent: { light: string; dark: string };
};

export const CATEGORIES: CategoryMeta[] = [
  { id: 'applications', label: 'Applications', accent: { light: '#3F6FE0', dark: '#7FA0F0' } },
  { id: 'coding', label: 'Coding', accent: { light: '#2E8F6B', dark: '#5FC49B' } },
  { id: 'behavioral', label: 'Behavioral', accent: { light: '#B37430', dark: '#DDA55E' } },
  { id: 'system-design', label: 'System Design', accent: { light: '#6E5CC4', dark: '#A594EE' } },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && BY_ID.has(value as Category);
}

export function categoryLabel(id: Category): string {
  return BY_ID.get(id)?.label ?? id;
}

export function categoryAccent(id: Category, dark: boolean): string {
  const meta = BY_ID.get(id);
  if (!meta) return dark ? '#8B8D96' : '#71727A';
  return dark ? meta.accent.dark : meta.accent.light;
}
