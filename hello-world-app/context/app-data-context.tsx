import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { createDefaultAppData, defaultAppData } from '@/data/default-app-data';
import { loadAppData, saveAppData } from '@/storage/app-storage';
import { cancelReminder } from '@/services/local-notifications';
import type {
  AppData,
  DailyHabitEntry,
  DoseEntry,
  DosePlan,
  OnboardingData,
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
  completeOnboarding: (answers: OnboardingData) => Promise<void>;
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
    setData((current) => {
      void Promise.all([
        cancelReminder(current.reminders.doseNotificationId),
        cancelReminder(current.reminders.waterNotificationId),
        cancelReminder(current.reminders.proteinNotificationId),
      ]).catch((error) => {
        if (__DEV__) console.warn('Could not clear local reminders while resetting app data.', error);
      });
      return createDefaultAppData();
    });
  }, []);

  const completeOnboarding = useCallback(async (answers: OnboardingData) => {
    const now = new Date().toISOString();
    const nextDoseDate = answers.glp1Status === 'started' && answers.scheduledDay
      ? getNextScheduledDate(answers.scheduledDay).toISOString()
      : '';
    const nextData: AppData = {
      profile: {
        id: makeId('user'),
        name: '',
        ageRange: answers.ageRange,
        sex: answers.sex,
        unitSystem: answers.unitSystem,
        height: answers.heightCm,
        startingWeight: answers.startingWeightKg,
        currentWeight: answers.currentWeightKg,
        goalWeight: answers.goalWeightKg,
        currentMedication: answers.glp1Status === 'started' ? answers.medication ?? null : null,
        glp1Status: answers.glp1Status,
        onboardingCompleted: true,
      },
      weightEntries: [{ id: makeId('weight'), weight: answers.currentWeightKg, date: now }],
      dosePlan: answers.glp1Status === 'started'
        ? {
          medication: answers.medication ?? '',
          dose: answers.doseMg ?? 0,
          unit: 'mg',
          frequency: 'weekly',
          scheduledDay: answers.scheduledDay ?? null,
          nextDoseDate,
        }
        : {
          medication: '',
          dose: 0,
          unit: 'mg',
          frequency: 'weekly',
          scheduledDay: null,
          nextDoseDate: '',
        },
      doseEntries: [],
      symptomEntries: [],
      dailyHabits: [{ date: toDateKey(), waterAmount: 0, proteinAmount: 0, waterGoal: 2500, proteinGoal: 100 }],
      reminders: {
        doseEnabled: false,
        doseTime: '09:00',
        waterEnabled: false,
        waterTime: '10:00',
        proteinEnabled: false,
        proteinTime: '13:00',
      },
    };
    const saved = await saveAppData(nextData);
    if (!saved) throw new Error('Your onboarding information could not be saved. Please try again.');
    if (__DEV__) console.log('TrackGLP onboarding saved', nextData);
    setData(nextData);
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
    completeOnboarding,
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
    completeOnboarding,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

function getNextScheduledDate(dayName: string) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const target = days.indexOf(dayName);
  const next = new Date();
  const daysAhead = target < 0 ? 0 : (target - next.getDay() + 7) % 7;
  next.setDate(next.getDate() + daysAhead);
  next.setHours(8, 0, 0, 0);
  return next;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider.');
  return context;
}

export function getTodayDateKey() {
  return toDateKey();
}
