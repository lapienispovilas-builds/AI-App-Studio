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

type WeightUnit = 'kg' | 'lb';

type WeightEntry = {
  id: string;
  dateLabel: string;
  weight: number;
};

const START_WEIGHT = 92;
const GOAL_WEIGHT = 72;
const unit: WeightUnit = 'kg';
const timeRanges = ['1M', '3M', '6M', '1Y', 'All'] as const;

const initialWeights: WeightEntry[] = [
  { id: '2026-08-10', dateLabel: 'Today', weight: 84.6 },
  { id: '2026-08-03', dateLabel: 'Aug 3', weight: 85.2 },
  { id: '2026-07-27', dateLabel: 'Jul 27', weight: 86.0 },
  { id: '2026-07-20', dateLabel: 'Jul 20', weight: 86.4 },
];

const historicalWeights = [92, 91.4, 90.5, 89.8, 88.9, 88.2, 87.4, 86.8, 86.0, 85.2];

function formatWeight(value: number, selectedUnit: WeightUnit = unit) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} ${selectedUnit}`;
}

export default function ProgressScreen() {
  const [weights, setWeights] = useState(initialWeights);
  const [selectedRange, setSelectedRange] = useState<(typeof timeRanges)[number]>('3M');
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);
  const [draftWeight, setDraftWeight] = useState(formatInputWeight(initialWeights[0].weight));

  const currentWeight = weights[0].weight;
  const totalLost = START_WEIGHT - currentWeight;
  const remaining = Math.max(currentWeight - GOAL_WEIGHT, 0);
  const goalProgress = Math.min(totalLost / (START_WEIGHT - GOAL_WEIGHT), 1);
  const chartWeights = useMemo(
    () => [...historicalWeights, currentWeight],
    [currentWeight],
  );

  function openLogWeight() {
    setDraftWeight(formatInputWeight(currentWeight));
    setIsLogWeightOpen(true);
  }

  function saveWeight() {
    const parsedWeight = Number.parseFloat(draftWeight.replace(',', '.'));
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) return;

    setWeights((currentWeights) => [
      { ...currentWeights[0], weight: parsedWeight },
      ...currentWeights.slice(1),
    ]);
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
          <Text style={styles.totalLost}>↓ {totalLost.toFixed(1)} kg</Text>
          <ProgressBar progress={goalProgress} light />
          <View style={styles.summaryValues}>
            <SummaryValue label="Start" value={formatWeight(START_WEIGHT)} />
            <SummaryValue label="Current" value={formatWeight(currentWeight)} centered />
            <SummaryValue label="Goal" value={formatWeight(GOAL_WEIGHT)} right />
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

          <WeightTrendChart
            values={chartWeights}
            height={190}
            startLabel={formatWeight(START_WEIGHT)}
            endLabel={formatWeight(currentWeight)}
          />

          <TouchableOpacity style={styles.logWeightButton} onPress={openLogWeight} accessibilityRole="button">
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.logWeightButtonText}>Log weight</Text>
          </TouchableOpacity>
        </DashboardCard>

        <DashboardCard>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardEyebrow}>YOUR GOAL</Text>
              <Text style={styles.goalValue}>{formatWeight(GOAL_WEIGHT)}</Text>
              <Text style={styles.remainingText}>{remaining.toFixed(1)} kg to go</Text>
            </View>
            <View style={styles.goalIcon}>
              <Ionicons name="flag-outline" size={23} color={TrackGLPColors.plum} />
            </View>
          </View>
          <View style={styles.goalProgressWrap}>
            <ProgressBar progress={goalProgress} />
          </View>
          <GoalProjection hasEnoughHistory />
        </DashboardCard>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent weights</Text>
          <View style={styles.recentList}>
            {weights.map((entry, index) => (
              <View key={entry.id} style={[styles.weightRow, index < weights.length - 1 && styles.weightRowBorder]}>
                <View style={styles.weightDateWrap}>
                  <View style={[styles.weightDot, index === 0 && styles.weightDotCurrent]} />
                  <Text style={[styles.weightDate, index === 0 && styles.weightDateCurrent]}>{entry.dateLabel}</Text>
                </View>
                <Text style={styles.weightValue}>{formatWeight(entry.weight)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <LogWeightModal
        visible={isLogWeightOpen}
        value={draftWeight}
        onChangeValue={setDraftWeight}
        onClose={() => setIsLogWeightOpen(false)}
        onSave={saveWeight}
      />
    </SafeAreaView>
  );
}

function formatInputWeight(value: number) {
  return value.toFixed(1);
}

function SummaryValue({ label, value, centered, right }: { label: string; value: string; centered?: boolean; right?: boolean }) {
  return (
    <View style={[centered && styles.summaryValueCenter, right && styles.summaryValueRight]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function GoalProjection({ hasEnoughHistory }: { hasEnoughHistory: boolean }) {
  return (
    <View style={styles.projectionCard}>
      <View style={styles.projectionIcon}>
        <Ionicons name={hasEnoughHistory ? 'calendar-outline' : 'analytics-outline'} size={20} color={TrackGLPColors.plum} />
      </View>
      <View style={styles.projectionBody}>
        <Text style={styles.projectionLabel}>{hasEnoughHistory ? 'Estimated goal' : 'Keep logging your weight'}</Text>
        <Text style={styles.projectionValue}>{hasEnoughHistory ? 'December 2026' : "We'll estimate your goal timeline once you have enough progress data."}</Text>
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
};

function LogWeightModal({ visible, value, onChangeValue, onClose, onSave }: LogWeightModalProps) {
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
                <Text style={styles.dateSecondary}>August 10, 2026</Text>
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
  saveButton: { backgroundColor: TrackGLPColors.plum, borderRadius: 15, alignItems: 'center', paddingVertical: 15, marginTop: 22 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
