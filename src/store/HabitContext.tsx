import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Achievement, Habit, HabitFrequency, UserProfile } from '../types';
import { evaluateAchievements } from '../utils/achievements';
import { toDateKey } from '../utils/dates';
import { createId } from '../utils/id';
import { syncHabitReminders } from '../utils/notifications';
import {
  defaultProfile,
  loadAchievements,
  loadHabits,
  loadLastInterstitial,
  loadProfile,
  saveAchievements,
  saveHabits,
  saveLastInterstitial,
  saveProfile,
} from './storage';

export type HabitInput = {
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  customDays?: number[];
  reminderTime: string | null;
};

type HabitContextValue = {
  ready: boolean;
  habits: Habit[];
  profile: UserProfile;
  achievements: Achievement[];
  lastInterstitialAt: number | null;
  newlyUnlocked: Achievement[];
  clearNewlyUnlocked: () => void;
  addHabit: (input: HabitInput) => Promise<Habit>;
  updateHabit: (id: string, input: Partial<HabitInput>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleComplete: (id: string, dateKey?: string) => Promise<boolean>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (name: string, goals: string[]) => Promise<void>;
  markInterstitialShown: () => Promise<void>;
  resetAllData: () => Promise<void>;
};

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [lastInterstitialAt, setLastInterstitialAt] = useState<number | null>(
    null,
  );
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    (async () => {
      const [h, p, a, li] = await Promise.all([
        loadHabits(),
        loadProfile(),
        loadAchievements(),
        loadLastInterstitial(),
      ]);
      setHabits(h);
      // Sync adsRemoved UI flag from AdManager (permanent or 24h unlock)
      let profileNext = p;
      try {
        const { areAdsRemoved } = await import('../ads/AdManager');
        const removed = await areAdsRemoved();
        if (removed !== p.adsRemoved) {
          profileNext = { ...p, adsRemoved: removed };
          await saveProfile(profileNext);
        }
      } catch {
        // ignore
      }
      setProfile(profileNext);
      setAchievements(a);
      setLastInterstitialAt(li);
      setReady(true);
      // Sync reminders on boot
      syncHabitReminders(h).catch(() => undefined);
    })();
  }, []);

  const persistHabits = useCallback(async (next: Habit[]) => {
    setHabits(next);
    await saveHabits(next);
    syncHabitReminders(next).catch(() => undefined);
  }, []);

  const refreshAchievements = useCallback(
    async (nextHabits: Habit[], current: Achievement[]) => {
      const { achievements: updated, newlyUnlocked: unlocked } =
        evaluateAchievements(nextHabits, current);
      setAchievements(updated);
      await saveAchievements(updated);
      if (unlocked.length > 0) {
        setNewlyUnlocked((prev) => [...prev, ...unlocked]);
      }
      return unlocked;
    },
    [],
  );

  const addHabit = useCallback(
    async (input: HabitInput) => {
      const habit: Habit = {
        id: createId(),
        name: input.name.trim(),
        icon: input.icon,
        color: input.color,
        frequency: input.frequency,
        customDays: input.customDays,
        reminderTime: input.reminderTime,
        createdAt: new Date().toISOString(),
        completedDates: [],
      };
      const next = [...habits, habit];
      await persistHabits(next);
      await refreshAchievements(next, achievements);
      return habit;
    },
    [habits, achievements, persistHabits, refreshAchievements],
  );

  const updateHabit = useCallback(
    async (id: string, input: Partial<HabitInput>) => {
      const next = habits.map((h) =>
        h.id === id
          ? {
              ...h,
              ...input,
              name: input.name !== undefined ? input.name.trim() : h.name,
            }
          : h,
      );
      await persistHabits(next);
    },
    [habits, persistHabits],
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      const next = habits.filter((h) => h.id !== id);
      await persistHabits(next);
    },
    [habits, persistHabits],
  );

  /** Returns true if now completed for that date */
  const toggleComplete = useCallback(
    async (id: string, dateKey = toDateKey()) => {
      let nowCompleted = false;
      const next = habits.map((h) => {
        if (h.id !== id) return h;
        const has = h.completedDates.includes(dateKey);
        nowCompleted = !has;
        return {
          ...h,
          completedDates: has
            ? h.completedDates.filter((d) => d !== dateKey)
            : [...h.completedDates, dateKey].sort(),
        };
      });
      await persistHabits(next);
      await refreshAchievements(next, achievements);
      return nowCompleted;
    },
    [habits, achievements, persistHabits, refreshAchievements],
  );

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      const next = { ...profile, ...patch };
      setProfile(next);
      await saveProfile(next);
    },
    [profile],
  );

  const completeOnboarding = useCallback(
    async (name: string, goals: string[]) => {
      const next: UserProfile = {
        ...profile,
        name: name.trim(),
        goals,
        onboardingComplete: true,
      };
      setProfile(next);
      await saveProfile(next);
    },
    [profile],
  );

  const markInterstitialShown = useCallback(async () => {
    const ts = Date.now();
    setLastInterstitialAt(ts);
    await saveLastInterstitial(ts);
  }, []);

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  const resetAllData = useCallback(async () => {
    await persistHabits([]);
    const nextProfile = { ...defaultProfile };
    setProfile(nextProfile);
    await saveProfile(nextProfile);
    const { DEFAULT_ACHIEVEMENTS } = await import('../utils/achievements');
    setAchievements(DEFAULT_ACHIEVEMENTS);
    await saveAchievements(DEFAULT_ACHIEVEMENTS);
  }, [persistHabits]);

  const value = useMemo(
    () => ({
      ready,
      habits,
      profile,
      achievements,
      lastInterstitialAt,
      newlyUnlocked,
      clearNewlyUnlocked,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleComplete,
      updateProfile,
      completeOnboarding,
      markInterstitialShown,
      resetAllData,
    }),
    [
      ready,
      habits,
      profile,
      achievements,
      lastInterstitialAt,
      newlyUnlocked,
      clearNewlyUnlocked,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleComplete,
      updateProfile,
      completeOnboarding,
      markInterstitialShown,
      resetAllData,
    ],
  );

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
