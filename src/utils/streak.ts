import type { Habit } from '../types/habit';
import { parseISO, addDays, daysBetween, todayISO } from './date';

/**
 * Проверяет, должна ли привычка выполняться в конкретный день,
 * с учётом периодичности.
 */
export const isScheduledFor = (habit: Habit, date: Date): boolean => {
  const dow = date.getDay();
  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dow >= 1 && dow <= 5;
    case 'custom':
      return habit.customDays.includes(dow);
    default:
      return true;
  }
};

/**
 * Текущая серия: сколько последних запланированных дней подряд выполнено,
 * включая сегодня (если сегодня ещё не выполнено — не считаем его пропуском,
 * серия считается по вчерашний день).
 */
export const currentStreak = (habit: Habit): number => {
  const set = new Set(habit.completions);
  const today = new Date();
  let streak = 0;
  let cursor = new Date(today);

  // Если сегодня запланировано и не выполнено — не разрываем серию, начинаем со вчера.
  if (isScheduledFor(habit, cursor) && !set.has(todayISO())) {
    cursor = addDays(cursor, -1);
  }

  // Защита от бесконечного цикла
  for (let i = 0; i < 3650; i++) {
    if (daysBetween(parseISO(habit.createdAt), cursor) < 0) break;
    if (isScheduledFor(habit, cursor)) {
      if (set.has(toISO(cursor))) {
        streak++;
      } else {
        break;
      }
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
};

export const bestStreak = (habit: Habit): number => {
  if (habit.completions.length === 0) return 0;
  const set = new Set(habit.completions);
  const sorted = [...habit.completions].sort();
  const first = parseISO(sorted[0]);
  const today = new Date();

  let best = 0;
  let current = 0;
  let cursor = new Date(first);

  while (daysBetween(cursor, today) >= 0) {
    if (isScheduledFor(habit, cursor)) {
      if (set.has(toISO(cursor))) {
        current++;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }
    cursor = addDays(cursor, 1);
  }
  return best;
};

const toISO = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/**
 * Процент выполнения за период (по запланированным дням).
 */
export const completionRate = (habit: Habit, days = 30): number => {
  const set = new Set(habit.completions);
  const today = new Date();
  let scheduled = 0;
  let done = 0;
  for (let i = 0; i < days; i++) {
    const d = addDays(today, -i);
    if (daysBetween(parseISO(habit.createdAt), d) < 0) continue;
    if (isScheduledFor(habit, d)) {
      scheduled++;
      if (set.has(toISO(d))) done++;
    }
  }
  if (scheduled === 0) return 0;
  return Math.round((done / scheduled) * 100);
};

/**
 * Процент выполнения за сегодня (0, 100, либо средний по привычкам).
 */
export const todayProgress = (habits: Habit[]): { done: number; total: number; percent: number } => {
  const today = new Date();
  const scheduled = habits.filter((h) => isScheduledFor(h, today));
  const total = scheduled.length;
  const done = scheduled.filter((h) => h.completions.includes(todayISO())).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
};
