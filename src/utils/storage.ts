import type { Habit, Settings } from '../types/habit';
import { todayISO, addDays, toISODate } from './date';

const HABITS_KEY = 'habitflow_habits_v1';
const SETTINGS_KEY = 'habitflow_settings_v1';

export const defaultSettings: Settings = {
  theme: 'light',
  userName: 'Пользователь',
  weekStartsOn: 1,
  notifications: true,
};

const isLocalStorageAvailable = (): boolean => {
  try {
    const k = '__test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
};

export const loadSettings = (): Settings => {
  if (!isLocalStorageAvailable()) return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (s: Settings): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('Не удалось сохранить настройки', e);
  }
};

export const loadHabits = (): Habit[] => {
  if (!isLocalStorageAvailable()) return seedHabits();
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    if (!raw) {
      const seed = seedHabits();
      saveHabits(seed);
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedHabits();
    return parsed;
  } catch {
    return seedHabits();
  }
};

export const saveHabits = (h: Habit[]): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(h));
  } catch (e) {
    console.warn('Не удалось сохранить привычки', e);
  }
};

export const clearAll = (): void => {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(HABITS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
};

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const makeCompletions = (pattern: number[], days = 30): string[] => {
  const today = new Date();
  const result: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(today, -i);
    const dow = d.getDay();
    if (pattern.includes(dow) || pattern.includes(7)) {
      // 7 = "always" marker
      result.push(toISODate(d));
    }
  }
  return result;
};

const seedHabits = (): Habit[] => {
  const today = new Date();
  const created = toISODate(addDays(today, -30));
  const seed: Habit[] = [
    {
      id: uid(),
      name: 'Читать 20 минут',
      description: 'Развивать привычку чтения каждый вечер',
      icon: '📚',
      color: '#6366f1',
      category: 'Образование',
      frequency: 'daily',
      customDays: [],
      createdAt: created,
      completions: makeCompletions([7], 25),
    },
    {
      id: uid(),
      name: 'Выпить 2 л воды',
      description: 'Поддерживать водный баланс в течение дня',
      icon: '💧',
      color: '#0ea5e9',
      category: 'Здоровье',
      frequency: 'daily',
      customDays: [],
      createdAt: created,
      completions: makeCompletions([0, 1, 2, 3, 4, 5, 6], 20),
    },
    {
      id: uid(),
      name: 'Утренняя зарядка',
      description: '10 минут активности после пробуждения',
      icon: '🏃',
      color: '#10b981',
      category: 'Спорт',
      frequency: 'weekdays',
      customDays: [],
      createdAt: created,
      completions: makeCompletions([1, 2, 3, 4, 5], 18),
    },
    {
      id: uid(),
      name: 'Учить английский',
      description: '30 минут практики языка',
      icon: '🧠',
      color: '#8b5cf6',
      category: 'Образование',
      frequency: 'daily',
      customDays: [],
      createdAt: created,
      completions: makeCompletions([1, 3, 5], 14),
    },
    {
      id: uid(),
      name: 'Программирование',
      description: 'Час практики кода или теории',
      icon: '💻',
      color: '#f59e0b',
      category: 'Работа',
      frequency: 'daily',
      customDays: [],
      createdAt: created,
      completions: makeCompletions([1, 2, 3, 4, 5], 22),
    },
  ];
  return seed;
};
