import { useState } from 'react';
import type { Habit } from './types/habit';
import { useHabits } from './hooks/useHabits';
import { useSettings } from './hooks/useTheme';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HabitModal } from './components/HabitModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { Statistics } from './pages/Statistics';
import { Settings } from './pages/Settings';
import { clearAll } from './utils/storage';

export type Page = 'dashboard' | 'calendar' | 'stats' | 'settings';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const { habits, addHabit, updateHabit, deleteHabit, toggleToday, resetAll, setHabits } = useHabits();
  const { settings, updateSettings, resetSettings } = useSettings();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [deleting, setDeleting] = useState<Habit | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (h: Habit) => {
    setEditing(h);
    setModalOpen(true);
  };

  const handleSave = (
    data: Omit<Habit, 'id' | 'createdAt' | 'completions'>,
    id?: string
  ) => {
    if (id) updateHabit(id, data);
    else addHabit(data);
  };

  const handleResetAll = () => {
    clearAll();
    resetAll();
    resetSettings();
    setPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <div className="flex">
        <Sidebar current={page} onNavigate={setPage} />

        <div className="flex-1 min-w-0">
          <Header
            settings={settings}
            onToggleTheme={() =>
              updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
            }
          />

          <main className="px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-5xl mx-auto">
            <div key={page} className="animate-fade-in">
              {page === 'dashboard' && (
                <Dashboard
                  habits={habits}
                  userName={settings.userName}
                  onAdd={openAdd}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                  onToggle={toggleToday}
                />
              )}
              {page === 'calendar' && (
                <CalendarPage habits={habits} weekStartsOn={settings.weekStartsOn} />
              )}
              {page === 'stats' && <Statistics habits={habits} />}
              {page === 'settings' && (
                <Settings
                  settings={settings}
                  onUpdate={updateSettings}
                  onResetData={() => setResetConfirm(true)}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <BottomNav current={page} onNavigate={setPage} />

      <HabitModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Удалить привычку?"
        message={`Привычка «${deleting?.name}» и вся её история будут удалены.`}
        onConfirm={() => {
          if (deleting) deleteHabit(deleting.id);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />

      <ConfirmDialog
        open={resetConfirm}
        title="Удалить все данные?"
        message="Все привычки и настройки будут удалены безвозвратно."
        confirmLabel="Удалить всё"
        onConfirm={handleResetAll}
        onCancel={() => setResetConfirm(false)}
      />
    </div>
  );
}

export default App;
