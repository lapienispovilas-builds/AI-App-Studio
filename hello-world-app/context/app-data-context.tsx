import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { createDefaultAppData, defaultAppData } from '@/data/default-app-data';
import { loadAppData, saveAppData } from '@/storage/app-storage';
import type {
  AppData,
  DailyHabitEntry,
  DoseEntry,
  DosePlan,
  ReminderSettings,
  SymptomEntry,
  UserProfile,
  WeightEntry,
} from '@/types/app-data';
import { getLatestWeightEntry, toDateKey } from '@/utils/app-data-helpers';

type NewEntry<T extends { id: string }> = Omit<T, 'id'> & { id?: string };

type AppDataContextValue = {
  data: AppData;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addWeightEntry: (entry: NewEntry<WeightEntry>) => void;
  updateWeightEntry: (id: string, updates: Partial<Omit<WeightEntry, 'id'>>) => void;
  deleteWeightEntry: (id: string) => void;
  updateDosePlan: (updates: Partial<DosePlan>) => void;
  addDoseEntry: (entry: NewEntry<DoseEntry>) => void;
  addSymptomEntry: (entry: NewEntry<SymptomEntry>) => void;
  updateDailyHabits: (date: string, updates: Partial<Omit<DailyHabitEntry, 'date'>>) => void;
  updateReminderSettings: (updates: Partial<ReminderSettings>) => void;
  resetAppData: () => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mergeWithDefaults(saved: AppData): AppData {
  return {
    ...defaultAppData,
    ...saved,
    profile: { ...defaultAppData.profile, ...saved.profile },
    dosePlan: { ...defaultAppData.dosePlan, ...saved.dosePlan },
    reminders: { ...defaultAppData.reminders, ...saved.reminders },
    weightEntries: saved.weightEntries ?? defaultAppData.weightEntries,
    doseEntries: saved.doseEntries ?? defaultAppData.doseEntries,
    symptomEntries: saved.symptomEntries ?? defaultAppData.symptomEntries,
    dailyHabits: saved.dailyHabits ?? defaultAppData.dailyHabits,
  };
}

function withCurrentWeight(data: AppData): AppData {
  const latest = getLatestWeightEntry(data);
  return latest
    ? { ...data, profile: { ...data.profile, currentWeight: latest.weight } }
    : data;
}

export function AppDataProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<AppData>(() => createDefaultAppData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadAppData().then((saved) => {
      if (!active) return;
      setData(saved ? withCurrentWeight(mergeWithDefaults(saved)) : createDefaultAppData());
      setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isLoading) void saveAppData(data);
  }, [data, isLoading]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setData((current) => ({ ...current, profile: { ...current.profile, ...updates } }));
  }, []);

  const addWeightEntry = useCallback((entry: NewEntry<WeightEntry>) => {
    setData((current) => withCurrentWeight({
      ...current,
      weightEntries: [{ ...entry, id: entry.id ?? makeId('weight') }, ...current.weightEntries],
    }));
  }, []);

  const updateWeightEntry = useCallback((id: string, updates: Partial<Omit<WeightEntry, 'id'>>) => {
    setData((current) => withCurrentWeight({
      ...current,
      weightEntries: current.weightEntries.map((entry) => entry.id === id ? { ...entry, ...updates } : entry),
    }));
  }, []);

  const deleteWeightEntry = useCallback((id: string) => {
    setData((current) => withCurrentWeight({
      ...current,
      weightEntries: current.weightEntries.filter((entry) => entry.id !== id),
    }));
  }, []);

  const updateDosePlan = useCallback((updates: Partial<DosePlan>) => {
    setData((current) => ({ ...current, dosePlan: { ...current.dosePlan, ...updates } }));
  }, []);

  const addDoseEntry = useCallback((entry: NewEntry<DoseEntry>) => {
    setData((current) => ({
      ...current,
      doseEntries: [{ ...entry, id: entry.id ?? makeId('dose') }, ...current.doseEntries],
    }));
  }, []);

  const addSymptomEntry = useCallback((entry: NewEntry<SymptomEntry>) => {
    setData((current) => ({
      ...current,
      symptomEntries: [{ ...entry, id: entry.id ?? makeId('symptom') }, ...current.symptomEntries],
    }));
  }, []);

  const updateDailyHabits = useCallback((date: string, updates: Partial<Omit<DailyHabitEntry, 'date'>>) => {
    setData((current) => {
      const existing = current.dailyHabits.find((entry) => entry.date === date);
      const nextEntry: DailyHabitEntry = {
        date,
        waterAmount: existing?.waterAmount ?? 0,
        proteinAmount: existing?.proteinAmount ?? 0,
        waterGoal: existing?.waterGoal ?? 2500,
        proteinGoal: existing?.proteinGoal ?? 100,
        ...updates,
      };
      return {
        ...current,
        dailyHabits: existing
          ? current.dailyHabits.map((entry) => entry.date === date ? nextEntry : entry)
          : [nextEntry, ...current.dailyHabits],
      };
    });
  }, []);

  const updateReminderSettings = useCallback((updates: Partial<ReminderSettings>) => {
    setData((current) => ({ ...current, reminders: { ...current.reminders, ...updates } }));
  }, []);

  const resetAppData = useCallback(() => {
    setData(createDefaultAppData());
  }, []);

  const value = useMemo<AppDataContextValue>(() => ({
    data,
    isLoading,
    updateProfile,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    updateDosePlan,
    addDoseEntry,
    addSymptomEntry,
    updateDailyHabits,
    updateReminderSettings,
    resetAppData,
  }), [
    data,
    isLoading,
    updateProfile,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    updateDosePlan,
    addDoseEntry,
    addSymptomEntry,
    updateDailyHabits,
    updateReminderSettings,
    resetAppData,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider.');
  return context;
}

export function getTodayDateKey() {
  return toDateKey();
}
