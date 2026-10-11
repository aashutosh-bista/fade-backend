const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000; // UTC+05:45
export const DAY_MS = 24 * 60 * 60 * 1000;

// Nepal date + time ("2026-10-12", "10:00") -> UTC Date
export const nepalToUtc = (date: string, time: string): Date =>
  new Date(
    Date.UTC(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)) - 1,
      Number(date.slice(8, 10)),
      Number(time.slice(0, 2)),
      Number(time.slice(3, 5)),
    ) - NEPAL_OFFSET_MS,
  );

// Today's date in Nepal as "YYYY-MM-DD"
export const getNepalDateString = (now: Date = new Date()): string =>
  new Date(now.getTime() + NEPAL_OFFSET_MS).toISOString().slice(0, 10);

export const addDays = (date: string, days: number): string =>
  new Date(
    Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10)) + days),
  )
    .toISOString()
    .slice(0, 10);

export const isRealDate = (date: string): boolean => {
  const d = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
};