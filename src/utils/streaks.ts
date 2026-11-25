import { Habit, HabitFrequency } from '../types';
import { addDays, parseDateKey, toDateKey } from './dates';

function isScheduledOn(habit: Habit, date: Date): boolean {
  const day = date.getDay(); // 0 Sun … 6 Sat
  switch (habit.frequency as HabitFrequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return day >= 1 && day <= 5;
    case 'weekends':
      return day === 0 || day === 6;
    case 'custom':
      return (habit.customDays ?? []).includes(day);
    default:
      return true;
  }
}

/** Current streak: consecutive scheduled days completed ending today or yesterday */
export function getCurrentStreak(habit: Habit): number {
  const completed = new Set(habit.completedDates);
  let streak = 0;
  let cursor = new Date();

  // If today is scheduled and not done, start from yesterday
  if (isScheduledOn(habit, cursor) && !completed.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  // Walk backwards over scheduled days
  for (let i = 0; i < 400; i += 1) {
    if (!isScheduledOn(habit, cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    const key = toDateKey(cursor);
    if (completed.has(key)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }

  return streak;
}

/** Best streak across all completed dates */
export function getBestStreak(habit: Habit): number {
  if (habit.completedDates.length === 0) return 0;

  const sorted = [...habit.completedDates].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = parseDateKey(sorted[i - 1]);
    const curr = parseDateKey(sorted[i]);

    // Count consecutive calendar days for best-streak simplicity
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      current += 1;
      best = Math.max(best, current);
    } else if (diffDays === 0) {
      // duplicate date — ignore
    } else {
      current = 1;
    }
  }

  return Math.max(best, getCurrentStreak(habit));
}

export function isCompletedToday(habit: Habit): boolean {
  return habit.completedDates.includes(toDateKey());
}

export function getDailyProgress(habits: Habit[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const today = new Date();
  const due = habits.filter((h) => isScheduledOn(h, today));
  const completed = due.filter((h) => isCompletedToday(h)).length;
  const total = due.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export function getTotalCheckIns(habits: Habit[]): number {
  return habits.reduce((sum, h) => sum + h.completedDates.length, 0);
}

export function getLongestCurrentStreak(habits: Habit[]): number {
  if (habits.length === 0) return 0;
  return Math.max(...habits.map(getCurrentStreak), 0);
}

export { isScheduledOn };
