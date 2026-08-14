import AsyncStorage from '@react-native-async-storage/async-storage';

import { isAchievementId } from './achievements';
import { isCategory } from './categories';
import { isThemePreference, type ThemePreference } from './theme';
import type { UnlockedAchievement, XPEntry } from './types';

const ENTRIES_KEY = 'my-daily-quest/entries/v1';
const UNLOCKED_KEY = 'my-daily-quest/unlocked/v1';
const THEME_KEY = 'my-daily-quest/theme/v1';
const SOUND_KEY = 'my-daily-quest/sound/v1';
const GUIDE_KEY = 'my-daily-quest/guide-seen/v1';

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

/** Wipes the XP log and the unlocked list. Preferences are left alone. */
export async function clearXPData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([ENTRIES_KEY, UNLOCKED_KEY]);
  } catch (error) {
    console.warn('[storage] could not clear XP data', error);
  }
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

/** Returns null when nothing has been chosen yet, so the caller can keep its default. */
export async function loadSoundEnabled(): Promise<boolean | null> {
  try {
    const raw = await AsyncStorage.getItem(SOUND_KEY);
    if (raw === 'on') return true;
    if (raw === 'off') return false;
    return null;
  } catch (error) {
    console.warn(`[storage] could not read ${SOUND_KEY}`, error);
    return null;
  }
}

export async function saveSoundEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off');
  } catch (error) {
    console.warn(`[storage] could not write ${SOUND_KEY}`, error);
  }
}

/** True once the guide has been dismissed, so it only opens itself once. */
export async function loadGuideSeen(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(GUIDE_KEY)) === 'seen';
  } catch (error) {
    console.warn(`[storage] could not read ${GUIDE_KEY}`, error);
    return true;
  }
}

export async function saveGuideSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(GUIDE_KEY, 'seen');
  } catch (error) {
    console.warn(`[storage] could not write ${GUIDE_KEY}`, error);
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
