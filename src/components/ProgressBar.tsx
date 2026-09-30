interface Props {
  value: number; // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export const ProgressBar = ({ value, color = '#6366f1', height = 8, showLabel = false }: Props) => {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div
        className="w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${v}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{v}%</div>
      )}
    </div>
  );
};
