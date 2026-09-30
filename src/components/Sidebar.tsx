import { Home, Calendar, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import type { Page } from '../App';

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
}

const items: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Главная', icon: <Home size={20} /> },
  { id: 'calendar', label: 'Календарь', icon: <Calendar size={20} /> },
  { id: 'stats', label: 'Статистика', icon: <BarChart3 size={20} /> },
  { id: 'settings', label: 'Настройки', icon: <SettingsIcon size={20} /> },
];

export const Sidebar = ({ current, onNavigate }: Props) => (
  <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 p-4 gap-1">
    <div className="flex items-center gap-2 px-2 py-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
        H
      </div>
      <span className="font-bold text-lg text-slate-900 dark:text-white">HabitFlow</span>
    </div>

    {items.map((it) => (
      <button
        key={it.id}
        onClick={() => onNavigate(it.id)}
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
          current === it.id
            ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
      >
        {it.icon}
        <span>{it.label}</span>
      </button>
    ))}
  </aside>
);
