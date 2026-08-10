import type { AppData, DailyHabitEntry, WeightEntry } from '@/types/app-data';

export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLatestWeightEntry(data: AppData): WeightEntry | undefined {
  return [...data.weightEntries].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0];
}

export function getCurrentWeight(data: AppData): number {
  return getLatestWeightEntry(data)?.weight ?? data.profile.currentWeight;
}

export function getTotalWeightLost(data: AppData): number {
  return Math.max(0, data.profile.startingWeight - getCurrentWeight(data));
}

export function getWeightRemaining(data: AppData): number {
  return Math.max(0, getCurrentWeight(data) - data.profile.goalWeight);
}

export function getNextDose(data: AppData) {
  return data.dosePlan;
}

export function parseStoredDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function getDoseTiming(date: Date, now: Date = new Date()) {
  const today = startOfLocalDay(now);
  const due = startOfLocalDay(date);
  const difference = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (difference === 0) return { badgeNumber: '0', label: 'Due today' };
  if (difference === 1) return { badgeNumber: '1', label: 'Due tomorrow' };
  if (difference > 1) return { badgeNumber: String(difference), label: `${difference} days remaining` };
  const overdue = Math.abs(difference);
  return { badgeNumber: String(overdue), label: `${overdue} ${overdue === 1 ? 'day' : 'days'} overdue` };
}

function startOfLocalDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getTodayHabits(data: AppData, date: Date = new Date()): DailyHabitEntry {
  const dateKey = toDateKey(date);
  const existing = data.dailyHabits.find((entry) => entry.date === dateKey);
  if (existing) return existing;

  const mostRecentPreviousEntry = [...data.dailyHabits]
    .filter((entry) => entry.date < dateKey)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  return {
    date: dateKey,
    waterAmount: 0,
    proteinAmount: 0,
    waterGoal: mostRecentPreviousEntry?.waterGoal ?? 2500,
    proteinGoal: mostRecentPreviousEntry?.proteinGoal ?? 100,
  };
}

export function getRecentSymptoms(data: AppData, limit = 5) {
  return [...data.symptomEntries]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, limit);
}
