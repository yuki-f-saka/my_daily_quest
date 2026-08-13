import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { earnedAchievementIds, findAchievement } from './achievements';
import { loadEntries, loadUnlocked, saveEntries, saveUnlocked } from './storage';
import type {
  Achievement,
  AchievementId,
  Category,
  UnlockedAchievement,
  XPEntry,
  XPStats,
} from './types';
import { computeStats } from './xp';

type XPStore = {
  /** False until the local log has been read from storage. */
  ready: boolean;
  /** Newest first. */
  entries: XPEntry[];
  stats: XPStats;
  /** Oldest first, in the order they unlocked. */
  unlocked: UnlockedAchievement[];
  addXP: (category: Category, xp: number) => void;
  /** The achievement waiting to be celebrated, if any. */
  pendingUnlock: Achievement | null;
  dismissPendingUnlock: () => void;
};

const XPContext = createContext<XPStore | null>(null);

export function XPProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<XPEntry[]>([]);
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([]);
  const [unlockQueue, setUnlockQueue] = useState<AchievementId[]>([]);

  const hydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [storedEntries, storedUnlocked] = await Promise.all([loadEntries(), loadUnlocked()]);
      if (cancelled) return;

      setEntries(storedEntries);
      // Catch up quietly on anything the stored log already earned: no modal at launch.
      setUnlocked(reconcileUnlocks(storedUnlocked, storedEntries).unlocked);
      hydrated.current = true;
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated.current) void saveEntries(entries);
  }, [entries]);

  useEffect(() => {
    if (hydrated.current) void saveUnlocked(unlocked);
  }, [unlocked]);

  const stats = useMemo(() => computeStats(entries), [entries]);

  const addXP = useCallback(
    (category: Category, xp: number) => {
      const entry: XPEntry = { id: createId(), category, xp, createdAt: new Date().toISOString() };
      const nextEntries = [entry, ...entries];
      setEntries(nextEntries);

      const next = reconcileUnlocks(unlocked, nextEntries);
      if (next.fresh.length > 0) {
        setUnlocked(next.unlocked);
        setUnlockQueue((prev) => [...prev, ...next.fresh]);
      }
    },
    [entries, unlocked],
  );

  const dismissPendingUnlock = useCallback(() => {
    setUnlockQueue((prev) => prev.slice(1));
  }, []);

  const pendingUnlock = unlockQueue.length > 0 ? findAchievement(unlockQueue[0]) ?? null : null;

  const value = useMemo<XPStore>(
    () => ({ ready, entries, stats, unlocked, addXP, pendingUnlock, dismissPendingUnlock }),
    [ready, entries, stats, unlocked, addXP, pendingUnlock, dismissPendingUnlock],
  );

  return <XPContext.Provider value={value}>{children}</XPContext.Provider>;
}

export function useXPStore(): XPStore {
  const store = useContext(XPContext);
  if (!store) throw new Error('useXPStore must be used inside <XPProvider>');
  return store;
}

/** Adds any achievement the log has earned but the unlock list has not recorded yet. */
function reconcileUnlocks(
  unlocked: UnlockedAchievement[],
  entries: XPEntry[],
): { unlocked: UnlockedAchievement[]; fresh: AchievementId[] } {
  const known = new Set(unlocked.map((u) => u.id));
  const fresh = earnedAchievementIds(computeStats(entries)).filter((id) => !known.has(id));
  if (fresh.length === 0) return { unlocked, fresh };

  const unlockedAt = new Date().toISOString();
  return { unlocked: [...unlocked, ...fresh.map((id) => ({ id, unlockedAt }))], fresh };
}

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
