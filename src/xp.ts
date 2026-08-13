import type { Category, XPEntry, XPStats } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Cumulative XP is always derived from the entry log, never stored separately. */
export function computeStats(entries: XPEntry[]): XPStats {
  const byCategory: Record<Category, number> = {
    applications: 0,
    coding: 0,
    behavioral: 0,
    'system-design': 0,
  };

  let totalXP = 0;
  for (const entry of entries) {
    byCategory[entry.category] += entry.xp;
    totalXP += entry.xp;
  }

  return {
    totalXP,
    byCategory,
    entryCount: entries.length,
    longestGapDays: longestGapDays(entries),
  };
}

function longestGapDays(entries: XPEntry[]): number {
  if (entries.length < 2) return 0;

  const times = entries.map((e) => Date.parse(e.createdAt)).sort((a, b) => a - b);
  let longest = 0;
  for (let i = 1; i < times.length; i += 1) {
    longest = Math.max(longest, (times[i] - times[i - 1]) / DAY_MS);
  }
  return longest;
}

export type DaySection = {
  /** Local calendar day, YYYY-MM-DD. */
  key: string;
  title: string;
  totalXP: number;
  data: XPEntry[];
};

/** Groups entries (newest first) into local calendar days, newest day first. */
export function groupByDay(entries: XPEntry[], now: Date = new Date()): DaySection[] {
  const sections: DaySection[] = [];
  let current: DaySection | undefined;

  for (const entry of entries) {
    const key = dayKey(new Date(entry.createdAt));
    if (!current || current.key !== key) {
      current = { key, title: dayTitle(key, now), totalXP: 0, data: [] };
      sections.push(current);
    }
    current.data.push(entry);
    current.totalXP += entry.xp;
  }

  return sections;
}

function dayKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function dayTitle(key: string, now: Date): string {
  if (key === dayKey(now)) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (key === dayKey(yesterday)) return 'Yesterday';

  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
