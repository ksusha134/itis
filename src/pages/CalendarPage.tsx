import type { Habit } from '../types/habit';
import { Calendar } from '../components/Calendar';

interface Props {
  habits: Habit[];
  weekStartsOn: 0 | 1;
}

export const CalendarPage = ({ habits, weekStartsOn }: Props) => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Календарь</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        История выполнения привычек по дням
      </p>
    </div>
    <Calendar habits={habits} weekStartsOn={weekStartsOn} />
  </div>
);
