import { useState } from 'react';
import { Moon, Sun, User, Calendar, Bell, Trash2, Check } from 'lucide-react';
import type { Settings as SettingsType } from '../types/habit';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface Props {
  settings: SettingsType;
  onUpdate: (patch: Partial<SettingsType>) => void;
  onResetData: () => void;
}

export const Settings = ({ settings, onUpdate, onResetData }: Props) => {
  const [name, setName] = useState(settings.userName);
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSaveName = () => {
    const trimmed = name.trim() || 'Пользователь';
    onUpdate({ userName: trimmed });
    setName(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Настройки</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Персонализируй приложение под себя
        </p>
      </div>

      {/* Тема */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          {settings.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          <h2 className="font-semibold text-slate-900 dark:text-white">Тема оформления</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onUpdate({ theme: 'light' })}
            className={`py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
              settings.theme === 'light'
                ? 'bg-brand-600 text-white'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sun size={18} /> Светлая
          </button>
          <button
            onClick={() => onUpdate({ theme: 'dark' })}
            className={`py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
              settings.theme === 'dark'
                ? 'bg-brand-600 text-white'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Moon size={18} /> Тёмная
          </button>
        </div>
      </div>

      {/* Имя */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <User size={20} />
          <h2 className="font-semibold text-slate-900 dark:text-white">Имя пользователя</h2>
        </div>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
          <button
            onClick={handleSaveName}
            className="px-5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition flex items-center gap-2"
          >
            {saved ? <><Check size={16} /> Готово</> : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Начало недели */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Calendar size={20} />
          <h2 className="font-semibold text-slate-900 dark:text-white">Начало недели</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onUpdate({ weekStartsOn: 1 })}
            className={`py-3 rounded-xl font-medium transition ${
              settings.weekStartsOn === 1
                ? 'bg-brand-600 text-white'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            Понедельник
          </button>
          <button
            onClick={() => onUpdate({ weekStartsOn: 0 })}
            className={`py-3 rounded-xl font-medium transition ${
              settings.weekStartsOn === 0
                ? 'bg-brand-600 text-white'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            Воскресенье
          </button>
        </div>
      </div>

      {/* Уведомления */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={20} />
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Уведомления</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Напоминания о привычках
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpdate({ notifications: !settings.notifications })}
            className={`w-12 h-7 rounded-full transition relative ${
              settings.notifications ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
            aria-label="Переключить уведомления"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                settings.notifications ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Опасная зона */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-rose-200 dark:border-rose-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 size={20} className="text-rose-500" />
          <h2 className="font-semibold text-rose-500">Опасная зона</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Удаление всех данных безвозвратно. Все привычки, история и настройки будут стёрты.
        </p>
        <button
          onClick={() => setConfirmOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition"
        >
          Удалить все данные
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Удалить все данные?"
        message="Это действие нельзя отменить. Все привычки и история выполнения будут удалены."
        confirmLabel="Удалить всё"
        onConfirm={() => {
          onResetData();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};
