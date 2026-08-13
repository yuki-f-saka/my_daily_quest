import AsyncStorage from '@react-native-async-storage/async-storage';

import { isAchievementId } from './achievements';
import { isCategory } from './categories';
import { isThemePreference, type ThemePreference } from './theme';
import type { UnlockedAchievement, XPEntry } from './types';

const ENTRIES_KEY = 'my-daily-quest/entries/v1';
const UNLOCKED_KEY = 'my-daily-quest/unlocked/v1';
const THEME_KEY = 'my-daily-quest/theme/v1';

export async function loadEntries(): Promise<XPEntry[]> {
  return readArray(ENTRIES_KEY, isXPEntry);
}

export async function saveEntries(entries: XPEntry[]): Promise<void> {
  await write(ENTRIES_KEY, entries);
}

export async function loadUnlocked(): Promise<UnlockedAchievement[]> {
  return readArray(UNLOCKED_KEY, isUnlockedAchievement);
}

export async function saveUnlocked(unlocked: UnlockedAchievement[]): Promise<void> {
  await write(UNLOCKED_KEY, unlocked);
}

/** Returns null when nothing has been chosen yet, so the caller can keep its default. */
export async function loadThemePreference(): Promise<ThemePreference | null> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    return isThemePreference(raw) ? raw : null;
  } catch (error) {
    console.warn(`[storage] could not read ${THEME_KEY}`, error);
    return null;
  }
}

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, preference);
  } catch (error) {
    console.warn(`[storage] could not write ${THEME_KEY}`, error);
  }
}

async function readArray<T>(key: string, isValid: (value: unknown) => value is T): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValid) : [];
  } catch (error) {
    console.warn(`[storage] could not read ${key}`, error);
    return [];
  }
}

async function write(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] could not write ${key}`, error);
  }
}

function isXPEntry(value: unknown): value is XPEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Partial<XPEntry>;
  return (
    typeof entry.id === 'string' &&
    isCategory(entry.category) &&
    typeof entry.xp === 'number' &&
    Number.isFinite(entry.xp) &&
    typeof entry.createdAt === 'string' &&
    !Number.isNaN(Date.parse(entry.createdAt))
  );
}

function isUnlockedAchievement(value: unknown): value is UnlockedAchievement {
  if (typeof value !== 'object' || value === null) return false;
  const unlocked = value as Partial<UnlockedAchievement>;
  return isAchievementId(unlocked.id) && typeof unlocked.unlockedAt === 'string';
}
