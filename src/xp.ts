import type { Category, XPEntry, XPStats } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export function emptyByCategory(): Record<Category, number> {
  return { applications: 0, coding: 0, behavioral: 0, 'system-design': 0 };
}

export function sumByCategory(entries: XPEntry[]): Record<Category, number> {
  const byCategory = emptyByCategory();
  for (const entry of entries) byCategory[entry.category] += entry.xp;
  return byCategory;
}

export function sumXP(entries: XPEntry[]): number {
  return entries.reduce((total, entry) => total + entry.xp, 0);
}

/** Cumulative XP is always derived from the entry log, never stored separately. */
export function computeStats(entries: XPEntry[]): XPStats {
  return {
    totalXP: sumXP(entries),
    byCategory: sumByCategory(entries),
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

export type PeriodMode = 'day' | 'week' | 'month' | 'year';

export const PERIOD_MODES: PeriodMode[] = ['day', 'week', 'month', 'year'];

/** One sub-period that actually has XP in it. Empty sub-periods are never emitted. */
export type PeriodPart = {
  key: string;
  label: string;
  totalXP: number;
};

export type PeriodBucket = {
  key: string;
  title: string;
  totalXP: number;
  byCategory: Record<Category, number>;
  /** Newest first. Listed individually in day mode. */
  entries: XPEntry[];
  /** Chronological. Empty in day mode, where the entries themselves are the detail. */
  parts: PeriodPart[];
};

/**
 * Groups entries into calendar periods, newest period first.
 *
 * Only periods that contain XP are returned, and the same holds for `parts`:
 * a day with nothing in it simply does not exist here. That is deliberate —
 * this app never renders an absence.
 */
export function groupByPeriod(
  entries: XPEntry[],
  mode: PeriodMode,
  now: Date = new Date(),
): PeriodBucket[] {
  const buckets = new Map<string, PeriodBucket & { startsAt: number }>();

  for (const entry of entries) {
    const date = new Date(entry.createdAt);
    const start = startOfPeriod(date, mode);
    const key = periodKey(start, mode);

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = {
        key,
        title: periodTitle(start, mode, now),
        totalXP: 0,
        byCategory: emptyByCategory(),
        entries: [],
        parts: [],
        startsAt: start.getTime(),
      };
      buckets.set(key, bucket);
    }

    bucket.entries.push(entry);
    bucket.totalXP += entry.xp;
    bucket.byCategory[entry.category] += entry.xp;
  }

  const ordered = [...buckets.values()].sort((a, b) => b.startsAt - a.startsAt);
  for (const bucket of ordered) {
    bucket.entries.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    bucket.parts = subPeriodParts(bucket.entries, mode);
  }

  return ordered.map(({ startsAt: _startsAt, ...bucket }) => bucket);
}

/** Breaks a period into the next unit down: week into days, month into weeks, year into months. */
function subPeriodParts(entries: XPEntry[], mode: PeriodMode): PeriodPart[] {
  if (mode === 'day') return [];

  const childMode: PeriodMode = mode === 'week' ? 'day' : mode === 'month' ? 'week' : 'month';
  const parts = new Map<string, PeriodPart & { startsAt: number }>();

  for (const entry of entries) {
    const start = startOfPeriod(new Date(entry.createdAt), childMode);
    const key = periodKey(start, childMode);

    let part = parts.get(key);
    if (!part) {
      part = { key, label: partLabel(start, childMode), totalXP: 0, startsAt: start.getTime() };
      parts.set(key, part);
    }
    part.totalXP += entry.xp;
  }

  return [...parts.values()]
    .sort((a, b) => a.startsAt - b.startsAt)
    .map(({ startsAt: _startsAt, ...part }) => part);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfPeriod(date: Date, mode: PeriodMode): Date {
  switch (mode) {
    case 'day':
      return startOfDay(date);
    case 'week': {
      const start = startOfDay(date);
      const weekday = (start.getDay() + 6) % 7; // Monday = 0
      start.setDate(start.getDate() - weekday);
      return start;
    }
    case 'month':
      return new Date(date.getFullYear(), date.getMonth(), 1);
    case 'year':
      return new Date(date.getFullYear(), 0, 1);
  }
}

function periodKey(start: Date, mode: PeriodMode): string {
  const year = start.getFullYear();
  const month = `${start.getMonth() + 1}`.padStart(2, '0');
  const day = `${start.getDate()}`.padStart(2, '0');

  switch (mode) {
    case 'day':
      return `d:${year}-${month}-${day}`;
    case 'week':
      return `w:${year}-${month}-${day}`;
    case 'month':
      return `m:${year}-${month}`;
    case 'year':
      return `y:${year}`;
  }
}

function periodTitle(start: Date, mode: PeriodMode, now: Date): string {
  const current = startOfPeriod(now, mode);
  const isCurrent = start.getTime() === current.getTime();

  switch (mode) {
    case 'day': {
      if (isCurrent) return 'Today';
      const yesterday = startOfDay(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (start.getTime() === yesterday.getTime()) return 'Yesterday';
      return start.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
    case 'week': {
      if (isCurrent) return 'This week';
      const lastWeek = new Date(current);
      lastWeek.setDate(lastWeek.getDate() - 7);
      if (start.getTime() === lastWeek.getTime()) return 'Last week';
      return weekRangeLabel(start);
    }
    case 'month': {
      if (isCurrent) return 'This month';
      const sameYear = start.getFullYear() === now.getFullYear();
      return start.toLocaleDateString(undefined, {
        month: 'long',
        ...(sameYear ? {} : { year: 'numeric' }),
      });
    }
    case 'year':
      return isCurrent ? 'This year' : `${start.getFullYear()}`;
  }
}

function partLabel(start: Date, mode: PeriodMode): string {
  switch (mode) {
    case 'day':
      return start.toLocaleDateString(undefined, { weekday: 'short' });
    case 'week':
      return weekRangeLabel(start);
    case 'month':
      return start.toLocaleDateString(undefined, { month: 'short' });
    case 'year':
      return `${start.getFullYear()}`;
  }
}

/** "Aug 3 – 9", or "Jul 27 – Aug 2" when the week straddles two months. */
function weekRangeLabel(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const from = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const to =
    start.getMonth() === end.getMonth()
      ? `${end.getDate()}`
      : end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return `${from} – ${to}`;
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
