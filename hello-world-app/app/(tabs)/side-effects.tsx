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
import { DateTimeField } from '@/components/track-glp/date-time-field';
import { TrackGLPColors } from '@/constants/track-glp-theme';

type Severity = 'Mild' | 'Moderate' | 'Severe';
type SymptomOption = (typeof symptomOptions)[number];

type SymptomEntry = {
  id: string;
  symptom: string;
  severity: Severity;
  occurredAt: Date;
  displayDate: string;
  note?: string;
};

const symptomOptions = [
  'Nausea',
  'Constipation',
  'Diarrhea',
  'Vomiting',
  'Stomach pain',
  'Headache',
  'Fatigue',
  'Dizziness',
  'Other',
] as const;

const severityOptions: Severity[] = ['Mild', 'Moderate', 'Severe'];

const initialSymptoms: SymptomEntry[] = [
  {
    id: 'nausea-today',
    symptom: 'Nausea',
    severity: 'Mild',
    occurredAt: new Date(2026, 7, 10, 9, 30),
    displayDate: 'Today · 9:30 AM',
    note: 'Felt slightly nauseous after breakfast',
  },
  {
    id: 'fatigue-yesterday',
    symptom: 'Fatigue',
    severity: 'Moderate',
    occurredAt: new Date(2026, 7, 9, 16, 20),
    displayDate: 'Yesterday · 4:20 PM',
  },
  {
    id: 'headache-aug-8',
    symptom: 'Headache',
    severity: 'Mild',
    occurredAt: new Date(2026, 7, 8, 11, 45),
    displayDate: 'Aug 8 · 11:45 AM',
  },
];

const initialWeeklyCounts: Record<string, number> = { Nausea: 2, Fatigue: 1 };

export default function SymptomJournalScreen() {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [weeklyCounts, setWeeklyCounts] = useState(initialWeeklyCounts);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);

  const weeklyTotal = Object.values(weeklyCounts).reduce((total, count) => total + count, 0);
  const mostFrequent = useMemo(
    () => Object.entries(weeklyCounts).sort((a, b) => b[1] - a[1])[0] ?? ['—', 0],
    [weeklyCounts],
  );

  function saveSymptom(draft: SymptomDraft) {
    const symptomName = draft.symptom === 'Other' ? draft.otherSymptom.trim() : draft.symptom;
    if (!symptomName || !draft.severity) return;

    const newEntry: SymptomEntry = {
      id: `symptom-${Date.now()}`,
      symptom: symptomName,
      severity: draft.severity,
      occurredAt: draft.occurredAt,
      displayDate: formatEntryDate(draft.occurredAt),
      note: draft.note.trim() || undefined,
    };

    setSymptoms((currentSymptoms) => [newEntry, ...currentSymptoms]);
    setWeeklyCounts((currentCounts) => ({
      ...currentCounts,
      [symptomName]: (currentCounts[symptomName] ?? 0) + 1,
    }));
    setIsLoggerOpen(false);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Symptom Journal</Text>

        <DashboardCard style={styles.loggingCard}>
          <View style={styles.loggingIcon}>
            <Ionicons name="heart-outline" size={25} color={TrackGLPColors.plum} />
          </View>
          <Text style={styles.loggingTitle}>How are you feeling?</Text>
          <Text style={styles.loggingSupport}>Keep track of symptoms as they happen.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setIsLoggerOpen(true)} accessibilityRole="button">
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Log symptom</Text>
          </TouchableOpacity>
        </DashboardCard>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent symptoms</Text>
          <View style={styles.symptomList}>
            {symptoms.map((entry, index) => (
              <SymptomRow key={entry.id} entry={entry} last={index === symptoms.length - 1} />
            ))}
          </View>
        </View>

        <DashboardCard>
          <View style={styles.weekHeader}>
            <View>
              <Text style={styles.cardEyebrow}>SUMMARY</Text>
              <Text style={styles.cardTitle}>This week</Text>
            </View>
            <View style={styles.weekIcon}>
              <Ionicons name="calendar-outline" size={21} color={TrackGLPColors.plum} />
            </View>
          </View>
          <View style={styles.weekStats}>
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>{weeklyTotal}</Text>
              <Text style={styles.weekStatLabel}>symptoms logged</Text>
            </View>
            <View style={styles.weekDivider} />
            <View style={styles.weekStat}>
              <Text style={styles.weekStatLabel}>Most frequent</Text>
              <Text style={styles.frequentValue}>
                {mostFrequent[0]} · {mostFrequent[1]} {mostFrequent[1] === 1 ? 'time' : 'times'}
              </Text>
            </View>
          </View>
        </DashboardCard>
      </ScrollView>

      <LogSymptomModal
        visible={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSave={saveSymptom}
      />
    </SafeAreaView>
  );
}

function SymptomRow({ entry, last }: { entry: SymptomEntry; last: boolean }) {
  return (
    <View style={[styles.symptomRow, !last && styles.rowBorder]}>
      <View style={styles.symptomRowTop}>
        <View style={styles.symptomNameWrap}>
          <View style={styles.symptomDot} />
          <Text style={styles.symptomName}>{entry.symptom}</Text>
        </View>
        <SeverityBadge severity={entry.severity} />
      </View>
      <Text style={styles.symptomDate}>{entry.displayDate}</Text>
      {entry.note && <Text style={styles.symptomNote}>“{entry.note}”</Text>}
    </View>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <View style={[
      styles.severityBadge,
      severity === 'Moderate' && styles.severityBadgeModerate,
      severity === 'Severe' && styles.severityBadgeSevere,
    ]}>
      <Text style={[
        styles.severityBadgeText,
        severity === 'Moderate' && styles.severityBadgeTextModerate,
        severity === 'Severe' && styles.severityBadgeTextSevere,
      ]}>
        {severity}
      </Text>
    </View>
  );
}

type SymptomDraft = {
  symptom: SymptomOption | null;
  otherSymptom: string;
  severity: Severity | null;
  occurredAt: Date;
  note: string;
};

type LogSymptomModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (draft: SymptomDraft) => void;
};

function LogSymptomModal({ visible, onClose, onSave }: LogSymptomModalProps) {
  const [symptom, setSymptom] = useState<SymptomOption | null>(null);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [occurredAt, setOccurredAt] = useState(() => new Date());
  const [note, setNote] = useState('');

  const symptomIsComplete = Boolean(symptom && (symptom !== 'Other' || otherSymptom.trim()));
  const canSave = symptomIsComplete && Boolean(severity);

  function resetAndClose() {
    resetDraft();
    onClose();
  }

  function resetDraft() {
    setSymptom(null);
    setOtherSymptom('');
    setSeverity(null);
    setOccurredAt(new Date());
    setNote('');
  }

  function handleSave() {
    if (!canSave) return;
    onSave({ symptom, otherSymptom, severity, occurredAt, note });
    resetDraft();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={resetAndClose} accessibilityLabel="Close symptom logger" />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Log symptom</Text>
            <TouchableOpacity style={styles.closeButton} onPress={resetAndClose} accessibilityLabel="Close">
              <Ionicons name="close" size={21} color={TrackGLPColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Symptom</Text>
              <View style={styles.symptomOptions}>
                {symptomOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.symptomOption, symptom === option && styles.optionSelected]}
                    onPress={() => setSymptom(option)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: symptom === option }}
                  >
                    <Text style={[styles.symptomOptionText, symptom === option && styles.optionTextSelected]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {symptom === 'Other' && (
                <TextInput
                  style={styles.otherInput}
                  value={otherSymptom}
                  onChangeText={setOtherSymptom}
                  placeholder="Enter symptom name"
                  placeholderTextColor="#9A929B"
                  accessibilityLabel="Other symptom name"
                />
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Severity</Text>
              <View style={styles.severityOptions}>
                {severityOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.severityOption, severity === option && styles.optionSelected]}
                    onPress={() => setSeverity(option)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: severity === option }}
                  >
                    <Text style={[styles.severityOptionText, severity === option && styles.optionTextSelected]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Date &amp; time</Text>
              <DateTimeField value={occurredAt} onChange={setOccurredAt} />
              <Text style={styles.datePreview}>{formatModalDate(occurredAt)}</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Note (optional)</Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add a note about how you're feeling..."
                placeholderTextColor="#9A929B"
                multiline
                textAlignVertical="top"
                accessibilityLabel="Optional symptom note"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave }}
            >
              <Text style={styles.saveButtonText}>Save symptom</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function formatEntryDate(value: Date) {
  const now = new Date();
  const isToday = value.getFullYear() === now.getFullYear()
    && value.getMonth() === now.getMonth()
    && value.getDate() === now.getDate();
  const date = isToday ? 'Today' : value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

function formatModalDate(value: Date) {
  const now = new Date();
  const isToday = value.getFullYear() === now.getFullYear()
    && value.getMonth() === now.getMonth()
    && value.getDate() === now.getDate();
  const date = isToday ? 'Today' : value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date}, ${time}`;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TrackGLPColors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, gap: 16 },
  screenTitle: { color: TrackGLPColors.text, fontSize: 29, fontWeight: '800', letterSpacing: -0.7, marginBottom: 2 },
  loggingCard: { backgroundColor: '#F3EBF5', borderColor: '#DFD0E3', padding: 20 },
  loggingIcon: { width: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  loggingTitle: { color: TrackGLPColors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginTop: 16 },
  loggingSupport: { color: TrackGLPColors.muted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: TrackGLPColors.plum, borderRadius: 15, paddingVertical: 14, marginTop: 19 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  recentSection: { marginTop: 3 },
  sectionTitle: { color: TrackGLPColors.text, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  symptomList: { backgroundColor: TrackGLPColors.card, borderRadius: 20, borderWidth: 1, borderColor: TrackGLPColors.border, paddingHorizontal: 16 },
  symptomRow: { paddingVertical: 15 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EEE8EF' },
  symptomRowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  symptomNameWrap: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  symptomDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: TrackGLPColors.purple },
  symptomName: { color: TrackGLPColors.text, fontSize: 15, fontWeight: '700' },
  symptomDate: { color: TrackGLPColors.muted, fontSize: 11, marginTop: 5, marginLeft: 16 },
  symptomNote: { color: TrackGLPColors.text, fontSize: 12, lineHeight: 18, marginTop: 8, marginLeft: 16 },
  severityBadge: { backgroundColor: '#F1ECF3', borderWidth: 1, borderColor: '#E2D8E5', borderRadius: 11, paddingHorizontal: 8, paddingVertical: 5 },
  severityBadgeModerate: { backgroundColor: '#E4D7E8', borderColor: '#CDB8D3' },
  severityBadgeSevere: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum },
  severityBadgeText: { color: TrackGLPColors.muted, fontSize: 9, fontWeight: '700' },
  severityBadgeTextModerate: { color: TrackGLPColors.plum },
  severityBadgeTextSevere: { color: '#FFFFFF' },
  weekHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardEyebrow: { color: TrackGLPColors.plum, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { color: TrackGLPColors.text, fontSize: 19, fontWeight: '700', marginTop: 4 },
  weekIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  weekStats: { flexDirection: 'row', alignItems: 'stretch', marginTop: 17, backgroundColor: '#F7F2F8', borderRadius: 16, padding: 14 },
  weekStat: { flex: 1, minWidth: 0 },
  weekDivider: { width: 1, backgroundColor: '#DFD5E1', marginHorizontal: 14 },
  weekStatValue: { color: TrackGLPColors.plum, fontSize: 26, fontWeight: '800', lineHeight: 29 },
  weekStatLabel: { color: TrackGLPColors.muted, fontSize: 10, lineHeight: 15 },
  frequentValue: { color: TrackGLPColors.text, fontSize: 13, fontWeight: '700', lineHeight: 18, marginTop: 3 },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37, 30, 39, 0.42)' },
  sheet: { maxHeight: '92%', backgroundColor: TrackGLPColors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8 },
  sheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#D7CDD9', alignSelf: 'center', marginBottom: 15 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { color: TrackGLPColors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  closeButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: TrackGLPColors.lavender, alignItems: 'center', justifyContent: 'center' },
  sheetContent: { paddingBottom: 10 },
  fieldGroup: { marginTop: 20 },
  fieldLabel: { color: TrackGLPColors.text, fontSize: 13, fontWeight: '700', marginBottom: 9 },
  symptomOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  symptomOption: { flexBasis: '47%', flexGrow: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, borderRadius: 13, borderWidth: 1, borderColor: TrackGLPColors.border, backgroundColor: TrackGLPColors.card },
  symptomOptionText: { color: TrackGLPColors.muted, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  optionSelected: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum },
  optionTextSelected: { color: '#FFFFFF' },
  otherInput: { color: TrackGLPColors.text, fontSize: 14, backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 12, marginTop: 9 },
  severityOptions: { flexDirection: 'row', gap: 7 },
  severityOption: { flex: 1, minWidth: 0, alignItems: 'center', paddingVertical: 12, borderRadius: 13, borderWidth: 1, borderColor: TrackGLPColors.border, backgroundColor: TrackGLPColors.card },
  severityOptionText: { color: TrackGLPColors.muted, fontSize: 11, fontWeight: '700' },
  datePreview: { color: TrackGLPColors.muted, fontSize: 11, marginTop: 7 },
  noteInput: { minHeight: 92, color: TrackGLPColors.text, fontSize: 14, lineHeight: 20, backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 15, paddingHorizontal: 13, paddingVertical: 12 },
  saveButton: { backgroundColor: TrackGLPColors.plum, borderRadius: 15, alignItems: 'center', paddingVertical: 15, marginTop: 22 },
  saveButtonDisabled: { opacity: 0.42 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
