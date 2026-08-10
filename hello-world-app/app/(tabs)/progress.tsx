import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardCard } from '@/components/track-glp/dashboard-card';
import { ProgressBar } from '@/components/track-glp/progress-bar';
import { WeightTrendChart } from '@/components/track-glp/weight-trend-chart';
import { TrackGLPColors } from '@/constants/track-glp-theme';
import { useAppData } from '@/context/app-data-context';
import type { UnitSystem, WeightEntry } from '@/types/app-data';
import { getCurrentWeight } from '@/utils/app-data-helpers';

type WeightUnit = 'kg' | 'lb';
const timeRanges = ['1M', '3M', '6M', '1Y', 'All'] as const;

export default function ProgressScreen() {
  const { data, addWeightEntry } = useAppData();
  const [selectedRange, setSelectedRange] = useState<(typeof timeRanges)[number]>('3M');
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);
  const [draftWeight, setDraftWeight] = useState('');
  const [weightError, setWeightError] = useState('');

  const unit = getDisplayUnit(data.profile.unitSystem);
  const startWeight = safeWeight(data.profile.startingWeight);
  const currentWeight = safeWeight(getCurrentWeight(data));
  const goalWeight = safeWeight(data.profile.goalWeight);
  const totalLost = startWeight - currentWeight;
  const remaining = getRemainingWeight(startWeight, currentWeight, goalWeight);
  const goalProgress = getGoalProgress(startWeight, currentWeight, goalWeight);
  const sortedWeights = useMemo(
    () => [...data.weightEntries].filter(isValidEntry).sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
    [data.weightEntries],
  );
  const filteredWeights = useMemo(
    () => filterEntriesByRange(sortedWeights, selectedRange),
    [selectedRange, sortedWeights],
  );
  const recentWeights = useMemo(() => [...sortedWeights].reverse(), [sortedWeights]);
  const goalEstimate = useMemo(
    () => estimateGoalDate(sortedWeights, currentWeight, goalWeight),
    [currentWeight, goalWeight, sortedWeights],
  );

  function openLogWeight() {
    setDraftWeight(formatInputWeight(fromKg(currentWeight, unit)));
    setWeightError('');
    setIsLogWeightOpen(true);
  }

  function saveWeight() {
    const displayWeight = Number.parseFloat(draftWeight.replace(',', '.'));
    const weightKg = toKg(displayWeight, unit);
    if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 1000) {
      setWeightError('Enter a valid positive weight.');
      return;
    }
    addWeightEntry({ weight: round(weightKg, 2), date: new Date().toISOString() });
    setIsLogWeightOpen(false);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Progress</Text>

        <DashboardCard style={styles.summaryCard}>
          <Text style={styles.lightLabel}>TOTAL LOST</Text>
          <Text style={styles.totalLost}>{totalLost >= 0 ? '↓' : '↑'} {formatWeightValue(Math.abs(totalLost), unit)}</Text>
          <ProgressBar progress={goalProgress} light />
          <View style={styles.summaryValues}>
            <SummaryValue label="Start" value={formatWeight(startWeight, unit)} />
            <SummaryValue label="Current" value={formatWeight(currentWeight, unit)} centered />
            <SummaryValue label="Goal" value={formatWeight(goalWeight, unit)} right />
          </View>
        </DashboardCard>

        <DashboardCard>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardEyebrow}>YOUR JOURNEY</Text>
              <Text style={styles.cardTitle}>Weight trend</Text>
            </View>
            <View style={styles.trendBadge}>
              <Ionicons name="trending-down" size={15} color={TrackGLPColors.plum} />
              <Text style={styles.trendBadgeText}>Steady progress</Text>
            </View>
          </View>

          <View style={styles.rangeRow}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range}
                style={[styles.rangeButton, selectedRange === range && styles.rangeButtonSelected]}
                onPress={() => setSelectedRange(range)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedRange === range }}
              >
                <Text style={[styles.rangeText, selectedRange === range && styles.rangeTextSelected]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredWeights.length > 0 ? (
            <WeightTrendChart
              values={filteredWeights.map((entry) => fromKg(entry.weight, unit))}
              height={190}
              startLabel={formatWeight(filteredWeights[0].weight, unit)}
              endLabel={formatWeight(filteredWeights[filteredWeights.length - 1].weight, unit)}
            />
          ) : (
            <View style={styles.emptyChart}><Text style={styles.emptyText}>Log your first weight to see your trend.</Text></View>
          )}

          <TouchableOpacity style={styles.logWeightButton} onPress={openLogWeight} accessibilityRole="button">
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.logWeightButtonText}>Log weight</Text>
          </TouchableOpacity>
        </DashboardCard>

        <DashboardCard>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardEyebrow}>YOUR GOAL</Text>
              <Text style={styles.goalValue}>{formatWeight(goalWeight, unit)}</Text>
              <Text style={styles.remainingText}>{formatWeightValue(remaining, unit)} to go</Text>
            </View>
            <View style={styles.goalIcon}>
              <Ionicons name="flag-outline" size={23} color={TrackGLPColors.plum} />
            </View>
          </View>
          <View style={styles.goalProgressWrap}>
            <ProgressBar progress={goalProgress} />
          </View>
          <GoalProjection estimatedDate={goalEstimate} />
        </DashboardCard>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent weights</Text>
          <View style={styles.recentList}>
            {recentWeights.length > 0 ? recentWeights.map((entry, index) => (
              <View key={entry.id} style={[styles.weightRow, index < recentWeights.length - 1 && styles.weightRowBorder]}>
                <View style={styles.weightDateWrap}>
                  <View style={[styles.weightDot, index === 0 && styles.weightDotCurrent]} />
                  <Text style={[styles.weightDate, index === 0 && styles.weightDateCurrent]}>{formatEntryDate(entry.date)}</Text>
                </View>
                <Text style={styles.weightValue}>{formatWeight(entry.weight, unit)}</Text>
              </View>
            )) : <Text style={styles.emptyRecent}>No weights logged yet.</Text>}
          </View>
        </View>
      </ScrollView>

      <LogWeightModal
        visible={isLogWeightOpen}
        value={draftWeight}
        onChangeValue={setDraftWeight}
        onClose={() => setIsLogWeightOpen(false)}
        onSave={saveWeight}
        unit={unit}
        error={weightError}
      />
    </SafeAreaView>
  );
}

function formatInputWeight(value: number) {
  return value.toFixed(1);
}

function getDisplayUnit(unitSystem: UnitSystem): WeightUnit {
  return unitSystem === 'metric' ? 'kg' : 'lb';
}

function safeWeight(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function isValidEntry(entry: WeightEntry) {
  return Number.isFinite(entry.weight) && entry.weight > 0 && Number.isFinite(Date.parse(entry.date));
}

function fromKg(value: number, unit: WeightUnit) {
  return unit === 'kg' ? value : value * 2.2046226218;
}

function toKg(value: number, unit: WeightUnit) {
  return unit === 'kg' ? value : value / 2.2046226218;
}

function formatWeight(valueKg: number, unit: WeightUnit) {
  return formatWeightValue(valueKg, unit);
}

function formatWeightValue(valueKg: number, unit: WeightUnit) {
  const displayValue = fromKg(valueKg, unit);
  const decimals = Math.abs(displayValue - Math.round(displayValue)) < 0.05 ? 0 : 1;
  return `${displayValue.toFixed(decimals)} ${unit}`;
}

function getGoalProgress(start: number, current: number, goal: number) {
  const totalDistance = start - goal;
  if (!Number.isFinite(totalDistance) || Math.abs(totalDistance) < 0.001) return 0;
  return Math.max(0, Math.min((start - current) / totalDistance, 1));
}

function getRemainingWeight(start: number, current: number, goal: number) {
  if (!start || !current || !goal) return 0;
  return start >= goal ? Math.max(current - goal, 0) : Math.max(goal - current, 0);
}

function filterEntriesByRange(entries: WeightEntry[], range: (typeof timeRanges)[number]) {
  if (range === 'All' || entries.length === 0) return entries;
  const days = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }[range];
  const latestTime = Date.parse(entries[entries.length - 1].date);
  const cutoff = latestTime - days * 24 * 60 * 60 * 1000;
  return entries.filter((entry) => Date.parse(entry.date) >= cutoff);
}

function estimateGoalDate(entries: WeightEntry[], current: number, goal: number) {
  if (entries.length < 2 || current === goal) return null;
  const first = entries[0];
  const latest = entries[entries.length - 1];
  const elapsedWeeks = (Date.parse(latest.date) - Date.parse(first.date)) / (7 * 24 * 60 * 60 * 1000);
  if (elapsedWeeks < 1) return null;
  const weeklyChange = (latest.weight - first.weight) / elapsedWeeks;
  const movingTowardGoal = current > goal ? weeklyChange < 0 : weeklyChange > 0;
  if (!movingTowardGoal || Math.abs(weeklyChange) < 0.01) return null;
  const weeksRemaining = Math.abs((goal - current) / weeklyChange);
  if (!Number.isFinite(weeksRemaining) || weeksRemaining > 520) return null;
  const estimate = new Date();
  estimate.setDate(estimate.getDate() + Math.ceil(weeksRemaining * 7));
  return estimate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatEntryDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function round(value: number, precision: number) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function SummaryValue({ label, value, centered, right }: { label: string; value: string; centered?: boolean; right?: boolean }) {
  return (
    <View style={[centered && styles.summaryValueCenter, right && styles.summaryValueRight]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function GoalProjection({ estimatedDate }: { estimatedDate: string | null }) {
  const hasEnoughHistory = Boolean(estimatedDate);
  return (
    <View style={styles.projectionCard}>
      <View style={styles.projectionIcon}>
        <Ionicons name={hasEnoughHistory ? 'calendar-outline' : 'analytics-outline'} size={20} color={TrackGLPColors.plum} />
      </View>
      <View style={styles.projectionBody}>
        <Text style={styles.projectionLabel}>{hasEnoughHistory ? 'Estimated goal' : 'Keep logging your weight'}</Text>
        <Text style={styles.projectionValue}>{estimatedDate ?? 'Not enough data yet'}</Text>
        {hasEnoughHistory && <Text style={styles.projectionNote}>Based on your recent weight trend. This is a rough estimate.</Text>}
      </View>
    </View>
  );
}

type LogWeightModalProps = {
  visible: boolean;
  value: string;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  unit: WeightUnit;
  error: string;
};

function LogWeightModal({ visible, value, onChangeValue, onClose, onSave, unit, error }: LogWeightModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close log weight" />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Log weight</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Close">
              <Ionicons name="close" size={21} color={TrackGLPColors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.dateField}>
              <Ionicons name="calendar-outline" size={19} color={TrackGLPColors.plum} />
              <View>
                <Text style={styles.datePrimary}>Today</Text>
                <Text style={styles.dateSecondary}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Weight</Text>
            <View style={styles.weightInputWrap}>
              <TextInput
                style={styles.weightInput}
                value={value}
                onChangeText={onChangeValue}
                keyboardType="decimal-pad"
                selectTextOnFocus
                accessibilityLabel="Weight"
              />
              <Text style={styles.inputUnit}>{unit}</Text>
            </View>
            {!!error && <Text style={styles.validationError}>{error}</Text>}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={onSave} accessibilityRole="button">
            <Text style={styles.saveButtonText}>Save weight</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TrackGLPColors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, gap: 16 },
  screenTitle: { color: TrackGLPColors.text, fontSize: 29, fontWeight: '800', letterSpacing: -0.7, marginBottom: 2 },
  summaryCard: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum, padding: 20 },
  lightLabel: { color: '#DCCEE0', fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  totalLost: { color: '#FFFFFF', fontSize: 39, fontWeight: '800', letterSpacing: -1.2, marginTop: 4, marginBottom: 18 },
  summaryValues: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 },
  summaryValueCenter: { alignItems: 'center' },
  summaryValueRight: { alignItems: 'flex-end' },
  summaryLabel: { color: '#CDBED1', fontSize: 11 },
  summaryValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  cardEyebrow: { color: TrackGLPColors.plum, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { color: TrackGLPColors.text, fontSize: 19, fontWeight: '700', marginTop: 4 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: TrackGLPColors.lavender, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 14 },
  trendBadgeText: { color: TrackGLPColors.plum, fontSize: 10, fontWeight: '700' },
  rangeRow: { flexDirection: 'row', gap: 5, marginTop: 18 },
  rangeButton: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 11 },
  rangeButtonSelected: { backgroundColor: TrackGLPColors.plum },
  rangeText: { color: TrackGLPColors.muted, fontSize: 11, fontWeight: '700' },
  rangeTextSelected: { color: '#FFFFFF' },
  emptyChart: { height: 190, alignItems: 'center', justifyContent: 'center', marginTop: 14, borderRadius: 16, backgroundColor: '#F7F2F8' },
  emptyText: { color: TrackGLPColors.muted, fontSize: 12 },
  logWeightButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: TrackGLPColors.plum, borderRadius: 14, paddingVertical: 13, marginTop: 6 },
  logWeightButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  goalValue: { color: TrackGLPColors.text, fontSize: 27, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 },
  remainingText: { color: TrackGLPColors.muted, fontSize: 13, marginTop: 3 },
  goalIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  goalProgressWrap: { marginTop: 17 },
  projectionCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#F7F2F8', borderRadius: 16, padding: 13, marginTop: 16 },
  projectionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  projectionBody: { flex: 1 },
  projectionLabel: { color: TrackGLPColors.muted, fontSize: 11, fontWeight: '600' },
  projectionValue: { color: TrackGLPColors.text, fontSize: 15, fontWeight: '700', lineHeight: 20, marginTop: 2 },
  projectionNote: { color: TrackGLPColors.muted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  recentSection: { marginTop: 3 },
  sectionTitle: { color: TrackGLPColors.text, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  recentList: { backgroundColor: TrackGLPColors.card, borderRadius: 20, borderWidth: 1, borderColor: TrackGLPColors.border, paddingHorizontal: 16 },
  weightRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 54 },
  weightRowBorder: { borderBottomWidth: 1, borderBottomColor: '#EEE8EF' },
  weightDateWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  weightDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D7CDD9' },
  weightDotCurrent: { backgroundColor: TrackGLPColors.purple },
  weightDate: { color: TrackGLPColors.muted, fontSize: 13 },
  weightDateCurrent: { color: TrackGLPColors.text, fontWeight: '700' },
  weightValue: { color: TrackGLPColors.text, fontSize: 14, fontWeight: '700' },
  emptyRecent: { color: TrackGLPColors.muted, fontSize: 13, paddingVertical: 20, textAlign: 'center' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37, 30, 39, 0.42)' },
  sheet: { backgroundColor: TrackGLPColors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  sheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#D7CDD9', alignSelf: 'center', marginBottom: 15 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { color: TrackGLPColors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  closeButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: TrackGLPColors.lavender, alignItems: 'center', justifyContent: 'center' },
  fieldGroup: { marginTop: 20 },
  fieldLabel: { color: TrackGLPColors.muted, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  dateField: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 16, padding: 14 },
  datePrimary: { color: TrackGLPColors.text, fontSize: 15, fontWeight: '700' },
  dateSecondary: { color: TrackGLPColors.muted, fontSize: 11, marginTop: 2 },
  weightInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 16, paddingHorizontal: 15 },
  weightInput: { flex: 1, color: TrackGLPColors.text, fontSize: 28, fontWeight: '700', paddingVertical: 13 },
  inputUnit: { color: TrackGLPColors.muted, fontSize: 16, fontWeight: '700' },
  validationError: { color: '#A43F56', fontSize: 11, marginTop: 7 },
  saveButton: { backgroundColor: TrackGLPColors.plum, borderRadius: 15, alignItems: 'center', paddingVertical: 15, marginTop: 22 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
