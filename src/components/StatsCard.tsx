import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  subtitle?: string;
  accent?: string;
}

export const StatsCard = ({ title, value, icon, subtitle, accent = '#6366f1' }: Props) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-slate-500 dark:text-slate-400">{title}</span>
      {icon && (
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {icon}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
    {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
  </div>
);
