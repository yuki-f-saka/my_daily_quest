import { CATEGORIES } from './categories';
import type { Achievement, AchievementId, XPStats } from './types';

/**
 * Achievements are looked up only after the fact: nothing here is ever shown
 * as a target to reach. They exist to notice what already happened.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'You earned XP for the first time.',
    isEarned: (s) => s.entryCount > 0,
  },
  {
    id: 'back-to-coding',
    title: 'Back to Coding',
    description: 'You earned your first Coding XP.',
    isEarned: (s) => s.byCategory.coding > 0,
  },
  {
    id: 'coding-10',
    title: 'Coding 10',
    description: 'You piled up 10 XP in Coding.',
    isEarned: (s) => s.byCategory.coding >= 10,
  },
  {
    id: 'storyteller',
    title: 'Storyteller',
    description: 'You piled up 5 XP in Behavioral.',
    isEarned: (s) => s.byCategory.behavioral >= 5,
  },
  {
    id: 'architect',
    title: 'Architect',
    description: 'You piled up 5 XP in System Design.',
    isEarned: (s) => s.byCategory['system-design'] >= 5,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'You earned XP in all four categories.',
    isEarned: (s) => CATEGORIES.every((c) => s.byCategory[c.id] > 0),
  },
  {
    id: 'welcome-back',
    title: 'Welcome Back',
    description: 'You came back after a break of a week or more. Good to see you.',
    isEarned: (s) => s.longestGapDays >= 7,
  },
];

const BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

export function isAchievementId(value: unknown): value is AchievementId {
  return typeof value === 'string' && BY_ID.has(value as AchievementId);
}

export function findAchievement(id: AchievementId): Achievement | undefined {
  return BY_ID.get(id);
}

export function earnedAchievementIds(stats: XPStats): AchievementId[] {
  return ACHIEVEMENTS.filter((a) => a.isEarned(stats)).map((a) => a.id);
}
