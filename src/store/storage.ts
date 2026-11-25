import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import { Achievement, Habit, UserProfile } from '../types';
import { DEFAULT_ACHIEVEMENTS } from '../utils/achievements';

export const defaultProfile: UserProfile = {
  name: '',
  goals: [],
  onboardingComplete: false,
  themePreference: 'system',
  adsRemoved: false,
};

export async function loadHabits(): Promise<Habit[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.habits);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
}

export async function loadProfile(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.profile);
    return raw
      ? { ...defaultProfile, ...(JSON.parse(raw) as UserProfile) }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

export async function loadAchievements(): Promise<Achievement[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.achievements);
    if (!raw) return DEFAULT_ACHIEVEMENTS;
    const saved = JSON.parse(raw) as Achievement[];
    // Merge with defaults so new achievements appear after updates
    return DEFAULT_ACHIEVEMENTS.map((def) => {
      const found = saved.find((s) => s.id === def.id);
      return found ? { ...def, unlockedAt: found.unlockedAt } : def;
    });
  } catch {
    return DEFAULT_ACHIEVEMENTS;
  }
}

export async function saveAchievements(
  achievements: Achievement[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.achievements,
    JSON.stringify(achievements),
  );
}

export async function loadLastInterstitial(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.lastInterstitial);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export async function saveLastInterstitial(ts: number): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.lastInterstitial, String(ts));
}
