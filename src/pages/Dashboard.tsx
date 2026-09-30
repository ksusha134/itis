import { Plus, Flame, Trophy, Target, CalendarCheck } from 'lucide-react';
import type { Habit } from '../types/habit';
import { HabitCard } from '../components/HabitCard';
import { StatsCard } from '../components/StatsCard';
import { ProgressBar } from '../components/ProgressBar';
import { todayProgress, currentStreak, bestStreak } from '../utils/streak';
import { addDays, toISODate } from '../utils/date';

interface Props {
  habits: Habit[];
  userName: string;
  onAdd: () => void;
  onEdit: (h: Habit) => void;
  onDelete: (h: Habit) => void;
  onToggle: (id: string) => void;
}

export const Dashboard = ({ habits, userName, onAdd, onEdit, onDelete, onToggle }: Props) => {
  const { done, total, percent } = todayProgress(habits);

  // Неделя: сколько выполнений за последние 7 дней
  const weekCompletions = habits.reduce((acc, h) => {
    for (let i = 0; i < 7; i++) {
      if (h.completions.includes(toISODate(addDays(new Date(), -i)))) acc++;
    }
    return acc;
  }, 0);

  const totalStreak = habits.reduce((sum, h) => sum + currentStreak(h), 0);
  const topBest = habits.reduce((max, h) => Math.max(max, bestStreak(h)), 0);

  const motivational = () => {
    if (total === 0) return 'Добавь первую привычку и начни свой путь!';
    if (percent === 100) return 'Отличная работа! Все привычки выполнены 🔥';
    if (percent >= 50) return 'Хороший прогресс, продолжай в том же духе!';
    if (percent > 0) return 'Ты уже начал — двигайся дальше!';
    return 'Новый день — новые возможности. Начни прямо сейчас!';
  };

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-6 md:p-8 text-white shadow-lg animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Добрый день, {userName}!</h1>
        <p className="text-white/80 text-sm md:text-base mb-6">{motivational()}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="text-white/70 text-xs mb-1">Сегодня</div>
            <div className="text-2xl font-bold">{done} / {total}</div>
            <div className="text-white/70 text-xs mt-1">привычек выполнено</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="text-white/70 text-xs mb-1">Дневная цель</div>
            <div className="text-2xl font-bold">{percent}%</div>
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мой прогресс */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Мой прогресс</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            title="Сегодня"
            value={`${percent}%`}
            subtitle={`${done} из ${total}`}
            icon={<Target size={18} />}
            accent="#6366f1"
          />
          <StatsCard
            title="За неделю"
            value={weekCompletions}
            subtitle="выполнений"
            icon={<CalendarCheck size={18} />}
            accent="#10b981"
          />
          <StatsCard
            title="Текущая серия"
            value={totalStreak}
            subtitle="дней суммарно"
            icon={<Flame size={18} />}
            accent="#f59e0b"
          />
          <StatsCard
            title="Лучшая серия"
            value={topBest}
            subtitle="дней подряд"
            icon={<Trophy size={18} />}
            accent="#8b5cf6"
          />
        </div>
      </div>

      {/* Список привычек */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Мои привычки
          </h2>
          <span className="text-sm text-slate-400">{habits.length}</span>
        </div>

        {habits.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-dashed border-slate-200 dark:border-slate-700 animate-fade-in">
            <div className="text-5xl mb-3">🌱</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              Пока нет привычек
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Создай первую привычку и начни отслеживать свой прогресс
            </p>
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition active:scale-95"
            >
              <Plus size={18} /> Создать привычку
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {habits.map((h, i) => (
              <HabitCard
                key={h.id}
                habit={h}
                index={i}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        {habits.length > 0 && (
          <button
            onClick={onAdd}
            className="mt-4 w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Добавить привычку
          </button>
        )}
      </div>
    </div>
  );
};
