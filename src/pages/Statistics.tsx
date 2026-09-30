import { useMemo } from 'react';
import type { Habit } from '../types/habit';
import { StatsCard } from '../components/StatsCard';
import { currentStreak, bestStreak, completionRate, isScheduledFor } from '../utils/streak';
import { addDays, toISODate, formatShort } from '../utils/date';
import { CheckCircle2, Flame, Trophy, TrendingUp, CalendarDays, Percent } from 'lucide-react';

interface Props {
  habits: Habit[];
}

export const Statistics = ({ habits }: Props) => {
  const stats = useMemo(() => {
    const today = new Date();

    const totalCompletions = habits.reduce((s, h) => s + h.completions.length, 0);
    const currentSum = habits.reduce((s, h) => s + currentStreak(h), 0);
    const bestSum = habits.reduce((s, h) => Math.max(s, bestStreak(h)), 0);
    const avgRate = habits.length === 0
      ? 0
      : Math.round(habits.reduce((s, h) => s + completionRate(h, 30), 0) / habits.length);

    // Выполнения по дням за последние 30 дней
    const dayTotals: { date: Date; label: string; done: number; total: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = addDays(today, -i);
      const iso = toISODate(d);
      let done = 0;
      let total = 0;
      for (const h of habits) {
        if (!isScheduledFor(h, d)) continue;
        total++;
        if (h.completions.includes(iso)) done++;
      }
      dayTotals.push({ date: d, label: formatShort(d), done, total });
    }

    const week = dayTotals.slice(-7);
    const weekDone = week.reduce((s, d) => s + d.done, 0);
    const monthDone = dayTotals.reduce((s, d) => s + d.done, 0);

    return { totalCompletions, currentSum, bestSum, avgRate, dayTotals, week, weekDone, monthDone };
  }, [habits]);

  const maxDone = Math.max(1, ...stats.dayTotals.map((d) => d.total));

  if (habits.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-dashed border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="text-5xl mb-3">📊</div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Пока нет статистики</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Добавь привычки, чтобы увидеть прогресс и графики
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Статистика</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Твой прогресс и достижения
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard
          title="Всего выполнений"
          value={stats.totalCompletions}
          icon={<CheckCircle2 size={18} />}
          accent="#10b981"
        />
        <StatsCard
          title="Текущая серия"
          value={stats.currentSum}
          subtitle="дней суммарно"
          icon={<Flame size={18} />}
          accent="#f59e0b"
        />
        <StatsCard
          title="Лучшая серия"
          value={stats.bestSum}
          subtitle="дней подряд"
          icon={<Trophy size={18} />}
          accent="#8b5cf6"
        />
        <StatsCard
          title="Средний %"
          value={`${stats.avgRate}%`}
          subtitle="за 30 дней"
          icon={<Percent size={18} />}
          accent="#6366f1"
        />
        <StatsCard
          title="За неделю"
          value={stats.weekDone}
          subtitle="выполнений"
          icon={<TrendingUp size={18} />}
          accent="#0ea5e9"
        />
        <StatsCard
          title="За месяц"
          value={stats.monthDone}
          subtitle="выполнений"
          icon={<CalendarDays size={18} />}
          accent="#f43f5e"
        />
      </div>

      {/* График по дням (30 дней) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
          Выполнение за последние 30 дней
        </h2>
        <div className="flex items-end gap-1 h-40">
          {stats.dayTotals.map((d, i) => {
            const h = (d.done / maxDone) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-brand-500 to-brand-400 transition-all duration-300 hover:from-brand-600 hover:to-brand-500 min-h-[2px]"
                  style={{ height: `${Math.max(2, h)}%` }}
                  title={`${d.label}: ${d.done}/${d.total}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{stats.dayTotals[0]?.label}</span>
          <span>{stats.dayTotals[stats.dayTotals.length - 1]?.label}</span>
        </div>
      </div>

      {/* График за 7 дней */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
          Последние 7 дней
        </h2>
        <div className="space-y-2.5">
          {stats.week.map((d, i) => {
            const pct = d.total === 0 ? 0 : Math.round((d.done / d.total) * 100);
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 w-14 shrink-0">
                  {d.label}
                </span>
                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 w-10 text-right">
                  {d.done}/{d.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* По привычкам */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
          Прогресс по привычкам (30 дней)
        </h2>
        <div className="space-y-3">
          {habits.map((h) => {
            const rate = completionRate(h, 30);
            return (
              <div key={h.id} className="flex items-center gap-3">
                <span className="text-xl w-7 text-center shrink-0">{h.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {h.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">
                      {rate}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${rate}%`, backgroundColor: h.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
