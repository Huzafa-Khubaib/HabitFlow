import { Achievement, Habit } from '../types';
import { getLongestCurrentStreak, getTotalCheckIns } from './streaks';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_habit',
    title: 'First Step',
    description: 'Create your first habit',
    icon: 'flag',
    unlockedAt: null,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Reach a 7-day streak',
    icon: 'flame',
    unlockedAt: null,
  },
  {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Reach a 30-day streak',
    icon: 'trophy',
    unlockedAt: null,
  },
  {
    id: 'checkins_100',
    title: 'Century Club',
    description: 'Complete 100 check-ins',
    icon: 'ribbon',
    unlockedAt: null,
  },
];

/** Returns newly unlocked achievements (with unlockedAt set) */
export function evaluateAchievements(
  habits: Habit[],
  current: Achievement[],
): { achievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const now = new Date().toISOString();
  const longest = getLongestCurrentStreak(habits);
  const checkIns = getTotalCheckIns(habits);
  const newlyUnlocked: Achievement[] = [];

  const achievements = current.map((a) => {
    if (a.unlockedAt) return a;

    let shouldUnlock = false;
    switch (a.id) {
      case 'first_habit':
        shouldUnlock = habits.length >= 1;
        break;
      case 'streak_7':
        shouldUnlock = longest >= 7;
        break;
      case 'streak_30':
        shouldUnlock = longest >= 30;
        break;
      case 'checkins_100':
        shouldUnlock = checkIns >= 100;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      const unlocked = { ...a, unlockedAt: now };
      newlyUnlocked.push(unlocked);
      return unlocked;
    }
    return a;
  });

  return { achievements, newlyUnlocked };
}
