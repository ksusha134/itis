import { useEffect, useState } from 'react';
import type { Settings } from '../types/habit';
import { loadSettings, saveSettings, defaultSettings } from '../utils/storage';

export const useSettings = () => {
  const [settings, setSettingsState] = useState<Settings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
    const root = document.documentElement;
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings]);

  const updateSettings = (patch: Partial<Settings>) =>
    setSettingsState((prev) => ({ ...prev, ...patch }));

  const resetSettings = () => setSettingsState(defaultSettings);

  return { settings, updateSettings, resetSettings };
};
