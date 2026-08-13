import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import unlockSound from '../assets/sounds/unlock.wav';
import xp1Sound from '../assets/sounds/xp-1.wav';
import xp2Sound from '../assets/sounds/xp-2.wav';
import { loadSoundEnabled, saveSoundEnabled } from './storage';

type SoundStore = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  playXP: (xp: number) => void;
  playUnlock: () => void;
};

const SoundContext = createContext<SoundStore | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(true);

  const playXP1 = useBlip(xp1Sound);
  const playXP2 = useBlip(xp2Sound);
  const playUnlockSound = useBlip(unlockSound);

  useEffect(() => {
    // Ambient playback: respects the ringer switch and never interrupts music.
    void setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
      allowsRecording: false,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const stored = await loadSoundEnabled();
      if (!cancelled && stored !== null) setEnabledState(stored);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setEnabled = useCallback(
    (next: boolean) => {
      setEnabledState(next);
      void saveSoundEnabled(next);
      // Turning it on confirms itself audibly.
      if (next) playXP1();
    },
    [playXP1],
  );

  const playXP = useCallback(
    (xp: number) => {
      if (!enabled) return;
      if (xp >= 2) playXP2();
      else playXP1();
    },
    [enabled, playXP1, playXP2],
  );

  const playUnlock = useCallback(() => {
    if (!enabled) return;
    playUnlockSound();
  }, [enabled, playUnlockSound]);

  const value = useMemo<SoundStore>(
    () => ({ enabled, setEnabled, playXP, playUnlock }),
    [enabled, setEnabled, playXP, playUnlock],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundStore {
  const store = useContext(SoundContext);
  if (!store) throw new Error('useSound must be used inside <SoundProvider>');
  return store;
}

/**
 * Two players per sound, used alternately. A single player has to finish seeking
 * back to zero before it can replay, which swallows the second of two fast taps.
 */
function useBlip(source: number): () => void {
  const first = useAudioPlayer(source);
  const second = useAudioPlayer(source);
  const useFirst = useRef(true);

  return useCallback(() => {
    const player = useFirst.current ? first : second;
    useFirst.current = !useFirst.current;
    void player.seekTo(0);
    player.play();
  }, [first, second]);
}
