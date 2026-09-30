export type Frequency = 'daily' | 'weekdays' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  frequency: Frequency;
  customDays: number[]; // 0-6 (Sun-Sat) — используется при frequency === 'custom'
  reminder?: string;
  goal?: number;
  createdAt: string;
  completions: string[]; // YYYY-MM-DD
}

export interface Settings {
  theme: 'light' | 'dark';
  userName: string;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  notifications: boolean;
}

export const COLOR_OPTIONS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Orange', value: '#f97316' },
];

export const ICON_OPTIONS = [
  '📚', '💧', '🏃', '🧘', '😴', '💻', '🎯', '🍎',
  '🎸', '✍️', '🚴', '🏋️', '🧠', '🌱', '☀️', '💊',
];

export const CATEGORY_OPTIONS = [
  'Здоровье', 'Спорт', 'Образование', 'Работа',
  'Творчество', 'Саморазвитие', 'Другое',
];

export const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
