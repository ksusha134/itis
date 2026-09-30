import { Check, Flame, Pencil, Trash2 } from 'lucide-react';
import type { Habit } from '../types/habit';
import { ProgressBar } from './ProgressBar';
import { currentStreak, completionRate } from '../utils/streak';
import { todayISO } from '../utils/date';

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
  index?: number;
}

export const HabitCard = ({ habit, onToggle, onEdit, onDelete, index = 0 }: Props) => {
  const done = habit.completions.includes(todayISO());
  const streak = currentStreak(habit);
  const rate = completionRate(habit, 30);

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          {habit.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {habit.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                >
                  {habit.category}
                </span>
                {streak > 0 && (
                  <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
                    <Flame size={12} /> {streak} дн.
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(habit)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                aria-label="Редактировать"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(habit)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                aria-label="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {habit.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {habit.description}
            </p>
          )}

          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Прогресс за 30 дней
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {rate}%
              </span>
            </div>
            <ProgressBar value={rate} color={habit.color} height={6} />
          </div>
        </div>

        <button
          onClick={() => onToggle(habit.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 active:scale-95 ${
            done
              ? 'text-white animate-pop'
              : 'border-2 border-slate-200 dark:border-slate-600 text-transparent hover:border-brand-500'
          }`}
          style={done ? { backgroundColor: habit.color } : undefined}
          aria-label={done ? 'Отменить выполнение' : 'Отметить выполнение'}
        >
          <Check size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
