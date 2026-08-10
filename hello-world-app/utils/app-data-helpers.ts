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

export function getTodayHabits(data: AppData, date: Date = new Date()): DailyHabitEntry {
  const dateKey = toDateKey(date);
  return data.dailyHabits.find((entry) => entry.date === dateKey) ?? {
    date: dateKey,
    waterAmount: 0,
    proteinAmount: 0,
    waterGoal: 2500,
    proteinGoal: 100,
  };
}

export function getRecentSymptoms(data: AppData, limit = 5) {
  return [...data.symptomEntries]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, limit);
}
