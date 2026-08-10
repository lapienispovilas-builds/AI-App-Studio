import type { AppData } from '@/types/app-data';

/** Development seed. Replace this object with an empty first-user state after onboarding is built. */
export const defaultAppData: AppData = {
  profile: {
    id: 'dev-user-sarah',
    name: 'Sarah',
    ageRange: '35-44',
    sex: 'female',
    unitSystem: 'metric',
    height: 168,
    startingWeight: 92,
    currentWeight: 84.6,
    goalWeight: 72,
    currentMedication: 'Ozempic',
    glp1Status: 'started',
    onboardingCompleted: false,
  },
  weightEntries: [
    { id: 'weight-2026-08-10', weight: 84.6, date: '2026-08-10T07:30:00.000Z' },
    { id: 'weight-2026-08-03', weight: 85.2, date: '2026-08-03T07:30:00.000Z' },
    { id: 'weight-2026-07-27', weight: 86, date: '2026-07-27T07:30:00.000Z' },
    { id: 'weight-2026-07-20', weight: 86.4, date: '2026-07-20T07:30:00.000Z' },
    { id: 'weight-2026-05-18', weight: 92, date: '2026-05-18T07:30:00.000Z' },
  ],
  dosePlan: {
    medication: 'Ozempic',
    dose: 1,
    unit: 'mg',
    frequency: 'weekly',
    scheduledDay: 'Thursday',
    nextDoseDate: '2026-08-13T08:00:00.000Z',
  },
  doseEntries: [
    { id: 'dose-2026-08-06', medication: 'Ozempic', dose: 1, unit: 'mg', date: '2026-08-06T08:00:00.000Z', injectionSite: 'Abdomen' },
    { id: 'dose-2026-07-30', medication: 'Ozempic', dose: 1, unit: 'mg', date: '2026-07-30T08:00:00.000Z' },
    { id: 'dose-2026-07-23', medication: 'Ozempic', dose: 0.5, unit: 'mg', date: '2026-07-23T08:00:00.000Z' },
    { id: 'dose-2026-07-16', medication: 'Ozempic', dose: 0.5, unit: 'mg', date: '2026-07-16T08:00:00.000Z' },
  ],
  symptomEntries: [
    { id: 'symptom-1', symptom: 'Nausea', severity: 'mild', date: '2026-08-10T06:30:00.000Z', note: 'Felt slightly nauseous after breakfast' },
    { id: 'symptom-2', symptom: 'Fatigue', severity: 'moderate', date: '2026-08-09T13:20:00.000Z' },
    { id: 'symptom-3', symptom: 'Headache', severity: 'mild', date: '2026-08-08T08:45:00.000Z' },
  ],
  dailyHabits: [
    { date: '2026-08-10', waterAmount: 1600, proteinAmount: 72, waterGoal: 2500, proteinGoal: 100 },
  ],
  reminders: {
    doseEnabled: true,
    doseTime: '09:00',
    waterEnabled: true,
    waterTime: '10:00',
    proteinEnabled: true,
    proteinTime: '13:00',
  },
};

export function createDefaultAppData(): AppData {
  return JSON.parse(JSON.stringify(defaultAppData)) as AppData;
}
