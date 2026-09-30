import { Moon, Sun } from 'lucide-react';
import { formatDateRu } from '../utils/date';
import type { Settings } from '../types/habit';

interface Props {
  settings: Settings;
  onToggleTheme: () => void;
}

export const Header = ({ settings, onToggleTheme }: Props) => (
  <header className="sticky top-0 z-30 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800">
    <div className="flex items-center justify-between px-4 md:px-8 py-3.5">
      <div className="flex items-center gap-3 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
          H
        </div>
        <span className="font-bold text-slate-900 dark:text-white">HabitFlow</span>
      </div>
      <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400 capitalize">
        {formatDateRu(new Date())}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          aria-label="Сменить тему"
        >
          {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold text-sm">
          {settings.userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  </header>
);
