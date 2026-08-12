import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardCard } from '@/components/track-glp/dashboard-card';
import { ProgressBar } from '@/components/track-glp/progress-bar';
import { WeightTrendChart } from '@/components/track-glp/weight-trend-chart';
import { TrackGLPColors } from '@/constants/track-glp-theme';
import { useAppData } from '@/context/app-data-context';
import type { WeightEntry } from '@/types/app-data';
import { getCurrentWeight, getDoseTiming, getTodayHabits, parseStoredDate } from '@/utils/app-data-helpers';
import { formatDose } from '@/utils/dose';

const sideEffectOptions = ['None', 'Mild', 'Moderate', 'Severe'];

export default function HomeScreen() {
  const router = useRouter();
  const { data } = useAppData();
  const unit = data.profile.unitSystem === 'metric' ? 'kg' : 'lb';
  const startWeight = safeWeight(data.profile.startingWeight);
  const currentWeight = safeWeight(getCurrentWeight(data));
  const goalWeight = safeWeight(data.profile.goalWeight);
  const totalChange = startWeight - currentWeight;
  const goalProgress = calculateGoalProgress(startWeight, currentWeight, goalWeight);
  const todayHabits = getTodayHabits(data);
  const dosePlan = data.dosePlan;
  const nextDoseDate = parseStoredDate(dosePlan.nextDoseDate);
  const hasDosePlan = Boolean(dosePlan.medication && dosePlan.dose > 0 && dosePlan.scheduledDay && nextDoseDate);
  const doseTiming = nextDoseDate ? getDoseTiming(nextDoseDate) : null;
  const latestSymptomToday = useMemo(() => getLatestSymptomToday(data.symptomEntries), [data.symptomEntries]);
  const selectedSymptomStatus = latestSymptomToday ? capitalize(latestSymptomToday.severity) : 'None';
  const recentWeights = useMemo(() => getRecentWeightEntries(data.weightEntries, 30), [data.weightEntries]);
  const periodChange = recentWeights.length > 1
    ? recentWeights[0].weight - recentWeights[recentWeights.length - 1].weight
    : 0;
  const name = data.profile.name.trim();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{name ? `Good morning, ${name}` : 'Good morning'}</Text>
            <Text style={styles.journey}>Your GLP-1 journey</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} accessibilityLabel="Open profile">
            <Ionicons name="person-outline" size={21} color={TrackGLPColors.plum} />
          </TouchableOpacity>
        </View>

        <DashboardCard style={styles.progressCard}>
          <View style={styles.cardHeadingRow}>
            <View>
              <Text style={styles.eyebrowLight}>TOTAL PROGRESS</Text>
              <Text style={styles.progressValue}>{totalChange >= 0 ? '↓' : '↑'} {formatWeight(Math.abs(totalChange), unit)}</Text>
            </View>
            <View style={styles.encouragementBadge}>
              <Ionicons name="sparkles" size={14} color={TrackGLPColors.plum} />
              <Text style={styles.encouragementText}>{totalChange > 0 ? 'Great progress' : 'Keep going'}</Text>
            </View>
          </View>
          <ProgressBar progress={goalProgress} light />
          <View style={styles.progressMetaRow}>
            <View>
              <Text style={styles.metaLabelLight}>Current</Text>
              <Text style={styles.metaValueLight}>{formatWeight(currentWeight, unit)}</Text>
            </View>
            <View style={styles.metaCenter}>
              <Text style={styles.metaLabelLight}>Started at</Text>
              <Text style={styles.metaValueLight}>{formatWeight(startWeight, unit)}</Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={styles.metaLabelLight}>Goal</Text>
              <Text style={styles.metaValueLight}>{formatWeight(goalWeight, unit)}</Text>
            </View>
          </View>
        </DashboardCard>

        <DashboardCard style={styles.doseCard}>
          <View style={styles.doseIcon}>
            <Ionicons name="medical-outline" size={25} color={TrackGLPColors.plum} />
          </View>
          <View style={styles.doseBody}>
            <Text style={styles.cardLabel}>{hasDosePlan ? 'NEXT DOSE' : 'DOSE TRACKING'}</Text>
            <Text style={styles.cardTitle}>{hasDosePlan ? `${dosePlan.medication} · ${formatDose(dosePlan.dose, dosePlan.unit)}` : 'Medication not set up'}</Text>
            <Text style={styles.cardDetail}>{hasDosePlan && nextDoseDate ? `${formatDoseDay(nextDoseDate)} · ${doseTiming?.label}` : 'Add your medication and schedule in Doses'}</Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} accessibilityRole="button" onPress={() => router.push('/doses')}>
            <Text style={styles.primaryButtonText}>{hasDosePlan ? 'Log dose' : 'Set up in Doses'}</Text>
          </TouchableOpacity>
        </DashboardCard>

        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.habitRow}>
          <HabitCard icon="water-outline" title="Water" value={`${formatLiters(todayHabits.waterAmount)} / ${formatLiters(todayHabits.waterGoal)} L`} progress={safeRatio(todayHabits.waterAmount, todayHabits.waterGoal)} />
          <HabitCard icon="nutrition-outline" title="Protein" value={`${formatNumber(todayHabits.proteinAmount)} / ${formatNumber(todayHabits.proteinGoal)} g`} progress={safeRatio(todayHabits.proteinAmount, todayHabits.proteinGoal)} />
        </View>

        <DashboardCard>
          <View style={styles.feelingHeading}>
            <View style={styles.feelingIcon}>
              <Ionicons name="heart-outline" size={22} color={TrackGLPColors.plum} />
            </View>
            <View>
              <Text style={styles.cardTitle}>How are you feeling today?</Text>
              <Text style={styles.cardDetail}>{latestSymptomToday ? `${latestSymptomToday.symptom} · ${capitalize(latestSymptomToday.severity)}` : 'No symptoms logged today'}</Text>
            </View>
          </View>
          <View style={styles.optionRow}>
            {sideEffectOptions.map((option) => (
              <View key={option} style={[styles.option, selectedSymptomStatus === option && styles.optionSelected]}>
                <Text style={[styles.optionText, selectedSymptomStatus === option && styles.optionTextSelected]}>{option}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.secondaryButton} accessibilityRole="button" onPress={() => router.push('/side-effects')}>
            <Text style={styles.secondaryButtonText}>View symptoms</Text>
            <Ionicons name="arrow-forward" size={17} color={TrackGLPColors.plum} />
          </TouchableOpacity>
        </DashboardCard>

        <DashboardCard>
          <View style={styles.cardHeadingRow}>
            <View>
              <Text style={styles.cardLabel}>PROGRESS</Text>
              <Text style={styles.cardTitle}>Weight trend</Text>
            </View>
            <View style={styles.periodBadge}>
              <Text style={styles.periodText}>30 days</Text>
            </View>
          </View>
          {recentWeights.length > 1 ? (
            <WeightTrendChart
              values={recentWeights.map((entry) => fromKg(entry.weight, unit))}
              startLabel={formatWeight(recentWeights[0].weight, unit)}
              endLabel={formatWeight(recentWeights[recentWeights.length - 1].weight, unit)}
            />
          ) : (
            <View style={styles.emptyTrend}><Text style={styles.emptyTrendText}>{recentWeights.length === 1 ? 'Keep logging to build your trend.' : 'Log your first weight to see your trend.'}</Text></View>
          )}
          <View style={styles.trendFooter}>
            <Text style={styles.trendValue}>
              {recentWeights.length > 1
                ? <>{periodChange >= 0 ? '↓' : '↑'} {formatWeight(Math.abs(periodChange), unit)} <Text style={styles.trendPeriod}>· Last 30 days</Text></>
                : <>{recentWeights.length === 1 ? `Current ${formatWeight(recentWeights[0].weight, unit)}` : 'No weight data'}</>}
            </Text>
            <TouchableOpacity style={styles.linkButton} accessibilityRole="button" onPress={() => router.push('/progress')}>
              <Text style={styles.linkText}>View progress</Text>
              <Ionicons name="chevron-forward" size={16} color={TrackGLPColors.plum} />
            </TouchableOpacity>
          </View>
        </DashboardCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function safeWeight(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function calculateGoalProgress(start: number, current: number, goal: number) {
  const distance = start - goal;
  if (!start || !current || !goal || Math.abs(distance) < 0.001) return 0;
  return Math.max(0, Math.min((start - current) / distance, 1));
}

function fromKg(value: number, unit: 'kg' | 'lb') {
  return unit === 'kg' ? value : value * 2.2046226218;
}

function formatWeight(valueKg: number, unit: 'kg' | 'lb') {
  const value = fromKg(valueKg, unit);
  const decimals = Math.abs(value - Math.round(value)) < 0.05 ? 0 : 1;
  return `${value.toFixed(decimals)} ${unit}`;
}

function formatDoseDay(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatLiters(valueMl: number) {
  if (!Number.isFinite(valueMl) || valueMl <= 0) return '0';
  const liters = valueMl / 1000;
  return Number.isInteger(liters) ? liters.toFixed(1) : liters.toFixed(2).replace(/0$/, '');
}

function formatNumber(value: number) {
  return Number.isFinite(value) ? (Number.isInteger(value) ? String(value) : value.toFixed(1)) : '0';
}

function safeRatio(value: number, goal: number) {
  return Number.isFinite(value) && Number.isFinite(goal) && goal > 0 ? value / goal : 0;
}

function getLatestSymptomToday(entries: { symptom: string; severity: string; date: string }[]) {
  const today = new Date().toDateString();
  return entries
    .filter((entry) => Number.isFinite(Date.parse(entry.date)) && new Date(entry.date).toDateString() === today)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0] ?? null;
}

function getRecentWeightEntries(entries: WeightEntry[], days: number) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return entries
    .filter((entry) => Number.isFinite(entry.weight) && entry.weight > 0 && Number.isFinite(Date.parse(entry.date)) && new Date(entry.date) >= cutoff)
    .slice()
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type HabitCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  progress: number;
};

function HabitCard({ icon, title, value, progress }: HabitCardProps) {
  return (
    <DashboardCard style={styles.habitCard}>
      <View style={styles.habitIcon}>
        <Ionicons name={icon} size={22} color={TrackGLPColors.plum} />
      </View>
      <Text style={styles.habitTitle}>{title}</Text>
      <Text style={styles.habitValue}>{value}</Text>
      <ProgressBar progress={progress} />
    </DashboardCard>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TrackGLPColors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  greeting: { color: TrackGLPColors.text, fontSize: 25, fontWeight: '700', letterSpacing: -0.6 },
  journey: { color: TrackGLPColors.muted, fontSize: 14, marginTop: 5 },
  profileButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender, borderWidth: 1, borderColor: TrackGLPColors.border },
  progressCard: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum, padding: 20 },
  cardHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrowLight: { color: '#DCCEE0', fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  progressValue: { color: '#FFFFFF', fontSize: 38, fontWeight: '800', letterSpacing: -1.2, marginTop: 4, marginBottom: 18 },
  encouragementBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F3EAF4', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 16 },
  encouragementText: { color: TrackGLPColors.plum, fontSize: 11, fontWeight: '700' },
  progressMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 },
  metaCenter: { alignItems: 'center' },
  metaRight: { alignItems: 'flex-end' },
  metaLabelLight: { color: '#CDBED1', fontSize: 11 },
  metaValueLight: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 3 },
  doseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4EDF6', borderColor: '#E1D2E5' },
  doseIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  doseBody: { flex: 1, marginLeft: 13 },
  cardLabel: { color: TrackGLPColors.plum, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { color: TrackGLPColors.text, fontSize: 17, fontWeight: '700', marginTop: 3 },
  cardDetail: { color: TrackGLPColors.muted, fontSize: 12, marginTop: 4 },
  primaryButton: { backgroundColor: TrackGLPColors.plum, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 13 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  sectionTitle: { color: TrackGLPColors.text, fontSize: 20, fontWeight: '700', marginTop: 4 },
  habitRow: { flexDirection: 'row', gap: 12 },
  habitCard: { flex: 1, minWidth: 0 },
  habitIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: TrackGLPColors.lavender, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  habitTitle: { color: TrackGLPColors.muted, fontSize: 12, fontWeight: '600' },
  habitValue: { color: TrackGLPColors.text, fontSize: 16, fontWeight: '700', marginTop: 4, marginBottom: 12 },
  feelingHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  feelingIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: TrackGLPColors.lavender, alignItems: 'center', justifyContent: 'center' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 17 },
  option: { flexBasis: '47%', flexGrow: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: TrackGLPColors.border, backgroundColor: '#FFFFFF' },
  optionSelected: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum },
  optionText: { color: TrackGLPColors.muted, fontSize: 12, fontWeight: '600' },
  optionTextSelected: { color: '#FFFFFF' },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14, paddingVertical: 11 },
  secondaryButtonText: { color: TrackGLPColors.plum, fontSize: 13, fontWeight: '700' },
  periodBadge: { backgroundColor: TrackGLPColors.lavender, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  periodText: { color: TrackGLPColors.plum, fontSize: 11, fontWeight: '700' },
  trendFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  trendValue: { color: TrackGLPColors.plum, fontSize: 19, fontWeight: '800' },
  trendPeriod: { color: TrackGLPColors.muted, fontSize: 12, fontWeight: '500' },
  linkButton: { flexDirection: 'row', alignItems: 'center' },
  linkText: { color: TrackGLPColors.plum, fontSize: 13, fontWeight: '700' },
  emptyTrend: { minHeight: 128, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  emptyTrendText: { color: TrackGLPColors.muted, fontSize: 12, textAlign: 'center' },
});
