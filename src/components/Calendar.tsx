import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Habit } from '../types/habit';
import { getMonthMatrix, toISODate, formatShort } from '../utils/date';
import { isScheduledFor } from '../utils/streak';

interface Props {
  habits: Habit[];
  weekStartsOn: 0 | 1;
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const Calendar = ({ habits, weekStartsOn }: Props) => {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const matrix = getMonthMatrix(year, month, weekStartsOn);

  const weekLabels = weekStartsOn === 1
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const dayStats = (date: Date) => {
    const iso = toISODate(date);
    let total = 0;
    let done = 0;
    for (const h of habits) {
      if (!isScheduledFor(h, date)) continue;
      total++;
      if (h.completions.includes(iso)) done++;
    }
    return { total, done };
  };

  const todayISO = toISODate(today);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          aria-label="Предыдущий месяц"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          aria-label="Следующий месяц"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekLabels.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {matrix.map((d, i) => {
          const inMonth = d.getMonth() === month;
          const iso = toISODate(d);
          const isToday = iso === todayISO;
          const { total, done } = dayStats(d);
          const ratio = total > 0 ? done / total : 0;

          return (
            <div
              key={i}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs relative transition ${
                inMonth ? '' : 'opacity-30'
              } ${isToday ? 'ring-2 ring-brand-500' : ''}`}
              title={`${formatShort(d)} — ${done}/${total}`}
            >
              <span
                className={`${
                  isToday ? 'font-bold text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {d.getDate()}
              </span>
              {total > 0 && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  {ratio === 1 ? (
                    <div className="w-3 h-1.5 rounded-full bg-emerald-500" />
                  ) : ratio > 0 ? (
                    <div
                      className="w-3 h-1.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #10b981 ${ratio * 100}%, #e2e8f0 ${ratio * 100}%)`,
                      }}
                    />
                  ) : (
                    <div className="w-3 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1.5 rounded-full bg-emerald-500" />
          <span>Всё выполнено</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-slate-200" />
          <span>Частично</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span>Ничего</span>
        </div>
      </div>
    </div>
  );
};
