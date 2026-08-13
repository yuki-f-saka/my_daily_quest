export type Category = 'applications' | 'coding' | 'behavioral' | 'system-design';

/** One thing you actually did. The only kind of record this app keeps. */
export type XPEntry = {
  id: string;
  category: Category;
  xp: number;
  /** ISO-8601 timestamp of the moment the XP was earned. */
  createdAt: string;
};

/** Everything derived from the entry log. Never stored — always recomputed. */
export type XPStats = {
  totalXP: number;
  byCategory: Record<Category, number>;
  entryCount: number;
  /** Longest pause between two entries, in days. Used only to celebrate coming back. */
  longestGapDays: number;
};

export type AchievementId =
  | 'first-step'
  | 'back-to-coding'
  | 'coding-10'
  | 'storyteller'
  | 'architect'
  | 'explorer'
  | 'welcome-back';

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  /** Pure check against derived stats. Achievements are never shown before they unlock. */
  isEarned: (stats: XPStats) => boolean;
};

export type UnlockedAchievement = {
  id: AchievementId;
  unlockedAt: string;
};
