import { useCallback, useEffect, useState } from 'react';
import type { Habit } from '../types/habit';
import { loadHabits, saveHabits } from '../utils/storage';
import { todayISO } from '../utils/date';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = useCallback((data: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const habit: Habit = {
      ...data,
      id: uid(),
      createdAt: todayISO(),
      completions: [],
    };
    setHabits((prev) => [habit, ...prev]);
    return habit;
  }, []);

  const updateHabit = useCallback((id: string, data: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...data } : h)));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleToday = useCallback((id: string) => {
    const today = todayISO();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completions.includes(today);
        return {
          ...h,
          completions: has
            ? h.completions.filter((d) => d !== today)
            : [...h.completions, today],
        };
      })
    );
  }, []);

  const resetAll = useCallback(() => {
    setHabits([]);
  }, []);

  return { habits, addHabit, updateHabit, deleteHabit, toggleToday, resetAll, setHabits };
};
