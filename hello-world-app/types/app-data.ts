export type UnitSystem = 'metric' | 'imperial';
export type Sex = 'female' | 'male' | 'intersex' | 'prefer_not_to_say';
export type SymptomSeverity = 'mild' | 'moderate' | 'severe';
export type HabitKind = 'water' | 'protein';
export type DoseFrequency = 'daily' | 'weekly' | 'custom';

export interface UserProfile {
  id: string;
  name: string;
  ageRange: string;
  sex: Sex;
  unitSystem: UnitSystem;
  height: number;
  startingWeight: number;
  currentWeight: number;
  goalWeight: number;
  currentMedication: string | null;
  onboardingCompleted: boolean;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface DosePlan {
  medication: string;
  dose: number;
  unit: string;
  frequency: DoseFrequency;
  scheduledDay: string | null;
  nextDoseDate: string;
}

export interface DoseEntry {
  id: string;
  medication: string;
  dose: number;
  unit: string;
  date: string;
  injectionSite?: string;
}

export interface SymptomEntry {
  id: string;
  symptom: string;
  severity: SymptomSeverity;
  date: string;
  note?: string;
}

export interface DailyHabitEntry {
  date: string;
  waterAmount: number;
  proteinAmount: number;
  waterGoal: number;
  proteinGoal: number;
}

export interface ReminderSettings {
  doseEnabled: boolean;
  doseTime?: string;
  waterEnabled: boolean;
  waterTime?: string;
  proteinEnabled: boolean;
  proteinTime?: string;
}

export interface AppData {
  profile: UserProfile;
  weightEntries: WeightEntry[];
  dosePlan: DosePlan;
  doseEntries: DoseEntry[];
  symptomEntries: SymptomEntry[];
  dailyHabits: DailyHabitEntry[];
  reminders: ReminderSettings;
}
