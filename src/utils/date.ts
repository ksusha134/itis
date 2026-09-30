export const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayISO = (): string => toISODate(new Date());

export const parseISO = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d: Date, n: number): Date => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
};

export const daysBetween = (a: Date, b: Date): number => {
  const ms = 1000 * 60 * 60 * 24;
  const aUTC = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bUTC = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bUTC - aUTC) / ms);
};

export const formatDateRu = (d: Date): string =>
  d.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

export const formatShort = (d: Date): string =>
  d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

export const getMonthMatrix = (year: number, month: number, weekStartsOn: 0 | 1) => {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -startOffset);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
  return cells;
};
