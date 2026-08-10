export type UnitSystem = 'metric' | 'imperial_us' | 'imperial_uk';
export type Sex = 'female' | 'male' | 'intersex' | 'prefer_not_to_say';
export type Glp1Status = 'not_started' | 'started';
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
  glp1Status: Glp1Status;
  onboardingCompleted: boolean;
}

export interface OnboardingData {
  unitSystem: UnitSystem;
  glp1Status: Glp1Status;
  startingWeightKg: number;
  currentWeightKg: number;
  goalWeightKg: number;
  heightCm: number;
  ageRange: string;
  sex: Sex;
  medication?: string;
  doseMg?: number;
  scheduledDay?: string;
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
  notificationPermissionDenied?: boolean;
  doseEnabled: boolean;
  doseTime?: string;
  doseNotificationId?: string;
  waterEnabled: boolean;
  waterTime?: string;
  waterNotificationId?: string;
  proteinEnabled: boolean;
  proteinTime?: string;
  proteinNotificationId?: string;
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
