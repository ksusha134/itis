import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Habit, Frequency } from '../types/habit';
import { COLOR_OPTIONS, ICON_OPTIONS, CATEGORY_OPTIONS, WEEKDAYS } from '../types/habit';

interface Props {
  open: boolean;
  initial?: Habit | null;
  onClose: () => void;
  onSave: (data: Omit<Habit, 'id' | 'createdAt' | 'completions'>, id?: string) => void;
}

interface FormState {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  frequency: Frequency;
  customDays: number[];
  reminder: string;
  goal: string;
}

const empty: FormState = {
  name: '',
  description: '',
  icon: ICON_OPTIONS[0],
  color: COLOR_OPTIONS[0].value,
  category: CATEGORY_OPTIONS[0],
  frequency: 'daily',
  customDays: [],
  reminder: '',
  goal: '',
};

export const HabitModal = ({ open, initial, onClose, onSave }: Props) => {
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name,
          description: initial.description,
          icon: initial.icon,
          color: initial.color,
          category: initial.category,
          frequency: initial.frequency,
          customDays: initial.customDays,
          reminder: initial.reminder ?? '',
          goal: initial.goal ? String(initial.goal) : '',
        });
      } else {
        setForm(empty);
      }
      setError('');
    }
  }, [open, initial]);

  if (!open) return null;

  const toggleDay = (d: number) => {
    setForm((p) => ({
      ...p,
      customDays: p.customDays.includes(d)
        ? p.customDays.filter((x) => x !== d)
        : [...p.customDays, d],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('Введите название привычки');
      return;
    }
    if (form.frequency === 'custom' && form.customDays.length === 0) {
      setError('Выберите хотя бы один день недели');
      return;
    }
    const goalNum = form.goal ? Number(form.goal) : undefined;
    if (form.goal && (isNaN(goalNum!) || goalNum! <= 0)) {
      setError('Цель должна быть положительным числом');
      return;
    }
    onSave(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon,
        color: form.color,
        category: form.category,
        frequency: form.frequency,
        customDays: form.frequency === 'custom' ? form.customDays : [],
        reminder: form.reminder || undefined,
        goal: goalNum,
      },
      initial?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-xl animate-scale-in">
        <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {initial ? 'Редактировать привычку' : 'Новая привычка'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Название *
            </label>
            <input
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(''); }}
              placeholder="Например: Читать 20 минут"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Описание
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Краткое описание привычки"
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Иконка
            </label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setForm({ ...form, icon: ic })}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xl transition ${
                    form.icon === ic
                      ? 'bg-brand-50 dark:bg-brand-500/20 ring-2 ring-brand-500'
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Цвет
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={`w-9 h-9 rounded-full transition ${
                    form.color === c.value ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-800 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Категория
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Периодичность
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                ['daily', 'Каждый день'],
                ['weekdays', 'По будням'],
                ['custom', 'Свои дни'],
              ] as [Frequency, string][]).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm({ ...form, frequency: v })}
                  className={`py-2 rounded-xl text-sm font-medium transition ${
                    form.frequency === v
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {form.frequency === 'custom' && (
            <div className="flex gap-1.5 flex-wrap animate-fade-in">
              {WEEKDAYS.map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                    form.customDays.includes(idx)
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Напоминание
              </label>
              <input
                type="time"
                value={form.reminder}
                onChange={(e) => setForm({ ...form, reminder: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Цель (раз)
              </label>
              <input
                type="number"
                min={1}
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                placeholder="1"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3.5 py-2.5 rounded-xl animate-fade-in">
              {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-slate-800 p-5 border-t border-slate-100 dark:border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition active:scale-[0.98]"
          >
            {initial ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
};
