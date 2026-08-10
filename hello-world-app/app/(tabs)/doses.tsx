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
import { useAppData } from '@/context/app-data-context';
import type { DoseEntry, DosePlan } from '@/types/app-data';
import { getDoseTiming, parseStoredDate } from '@/utils/app-data-helpers';

type InjectionSite = 'Abdomen' | 'Thigh' | 'Upper arm';

const medications = ['Ozempic', 'Wegovy', 'Mounjaro', 'Zepbound', 'Other'];
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatDose(amount: number, unit: string) {
  return `${amount.toFixed(1)} ${unit}`;
}

export default function DosesScreen() {
  const { data, addDoseEntry, updateDosePlan, updateProfile } = useAppData();
  const [isLogDoseOpen, setIsLogDoseOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<InjectionSite | null>(null);
  const [doseDate, setDoseDate] = useState(new Date());

  const plan = data.dosePlan;
  const hasPlan = Boolean(plan.medication && plan.dose > 0 && plan.scheduledDay);
  const doseHistory = useMemo(
    () => [...data.doseEntries].filter(isValidDoseEntry).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
    [data.doseEntries],
  );
  const nextDoseDate = parseStoredDate(plan.nextDoseDate);
  const timing = nextDoseDate ? getDoseTiming(nextDoseDate) : null;

  function openLogDose() {
    setSelectedSite(null);
    setDoseDate(new Date());
    setIsLogDoseOpen(true);
  }

  function logDose() {
    if (!hasPlan) return;
    addDoseEntry({
      medication: plan.medication,
      dose: plan.dose,
      unit: plan.unit,
      date: doseDate.toISOString(),
      injectionSite: selectedSite ?? undefined,
    });
    updateDosePlan({ nextDoseDate: getNextScheduledDate(plan.scheduledDay!, doseDate, true).toISOString() });
    setIsLogDoseOpen(false);
  }

  function saveSchedule(values: ScheduleDraft) {
    const nextDate = getNextScheduledDate(values.scheduledDay, new Date(), false);
    updateDosePlan({
      medication: values.medication,
      dose: values.dose,
      unit: 'mg',
      frequency: 'weekly',
      scheduledDay: values.scheduledDay,
      nextDoseDate: nextDate.toISOString(),
    });
    updateProfile({ glp1Status: 'started', currentMedication: values.medication });
    setIsScheduleOpen(false);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Doses</Text>

        {hasPlan ? (
          <>
            <DashboardCard style={styles.nextDoseCard}>
              <View style={styles.nextDoseTopRow}>
                <View style={styles.medicationIcon}>
                  <Ionicons name="medical-outline" size={25} color={TrackGLPColors.plum} />
                </View>
                <View style={styles.countdownBadge}>
                  <Text style={styles.countdownNumber}>{timing?.badgeNumber ?? '—'}</Text>
                  <Text style={styles.countdownLabel}>DAYS</Text>
                </View>
              </View>

              <Text style={styles.nextDoseEyebrow}>NEXT DOSE</Text>
              <View style={styles.medicationLine}>
                <Text style={styles.medicationName}>{plan.medication}</Text>
                <Text style={styles.dosePill}>{formatDose(plan.dose, plan.unit)}</Text>
              </View>
              <Text style={styles.nextDoseDate}>{nextDoseDate ? formatFullDate(nextDoseDate) : 'Not scheduled'}</Text>
              <Text style={styles.nextDoseTiming}>{timing?.label ?? 'Choose a schedule to see the next date'}</Text>

              <TouchableOpacity style={styles.primaryButton} onPress={openLogDose} accessibilityRole="button">
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Log dose</Text>
              </TouchableOpacity>
            </DashboardCard>

            <DashboardCard>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardEyebrow}>CURRENT PLAN</Text>
                  <Text style={styles.cardTitle}>Your schedule</Text>
                </View>
                <View style={styles.scheduleIcon}>
                  <Ionicons name="calendar-outline" size={21} color={TrackGLPColors.plum} />
                </View>
              </View>

              <View style={styles.scheduleList}>
                <ScheduleRow label="Medication" value={plan.medication} />
                <ScheduleRow label="Dose" value={formatDose(plan.dose, plan.unit)} />
                <ScheduleRow label="Schedule" value={`Every ${plan.scheduledDay}`} />
                <ScheduleRow label="Next dose" value={nextDoseDate ? formatShortDate(nextDoseDate) : 'Not scheduled'} last />
              </View>

              <TouchableOpacity style={styles.editButton} onPress={() => setIsScheduleOpen(true)} accessibilityRole="button">
                <Text style={styles.editButtonText}>Edit schedule</Text>
                <Ionicons name="chevron-forward" size={16} color={TrackGLPColors.plum} />
              </TouchableOpacity>
            </DashboardCard>
          </>
        ) : (
          <DashboardCard style={styles.emptySetupCard}>
            <View style={styles.emptySetupIcon}><Ionicons name="calendar-outline" size={27} color={TrackGLPColors.plum} /></View>
            <Text style={styles.emptySetupTitle}>Dose tracking</Text>
            <Text style={styles.emptySetupCopy}>{"You haven't set up a medication yet."}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setIsScheduleOpen(true)} accessibilityRole="button">
              <Text style={styles.primaryButtonText}>Set up medication</Text>
            </TouchableOpacity>
          </DashboardCard>
        )}

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Dose history</Text>
          <View style={styles.historyList}>
            {doseHistory.length > 0 ? doseHistory.map((dose, index) => (
              <DoseHistoryRow key={dose.id} dose={dose} last={index === doseHistory.length - 1} />
            )) : (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryTitle}>No doses logged yet</Text>
                <Text style={styles.emptyHistoryCopy}>Your logged doses will appear here.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <LogDoseModal
        visible={isLogDoseOpen}
        plan={plan}
        selectedSite={selectedSite}
        doseDate={doseDate}
        onSelectSite={(site) => setSelectedSite((current) => current === site ? null : site)}
        onChangeDate={setDoseDate}
        onClose={() => setIsLogDoseOpen(false)}
        onLog={logDose}
      />

      <ScheduleModal
        visible={isScheduleOpen}
        plan={hasPlan ? plan : null}
        onClose={() => setIsScheduleOpen(false)}
        onSave={saveSchedule}
      />
    </SafeAreaView>
  );
}

function ScheduleRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.scheduleRow, !last && styles.rowBorder]}>
      <Text style={styles.scheduleLabel}>{label}</Text>
      <Text style={styles.scheduleValue}>{value}</Text>
    </View>
  );
}

function DoseHistoryRow({ dose, last }: { dose: DoseEntry; last: boolean }) {
  return (
    <View style={[styles.historyRow, !last && styles.rowBorder]}>
      <View style={styles.historyDateBlock}>
        <View style={styles.historyDot} />
        <Text style={styles.historyDate}>{formatHistoryDate(dose.date)}</Text>
      </View>
      <View style={styles.historyMedication}>
        <Text style={styles.historyMedicationName}>{dose.medication}</Text>
        <Text style={styles.historyDose}>
          {formatDose(dose.dose, dose.unit)}
          {dose.injectionSite ? ` · ${dose.injectionSite}` : ''}
        </Text>
      </View>
      <View style={styles.loggedBadge}>
        <Ionicons name="checkmark" size={12} color={TrackGLPColors.plum} />
        <Text style={styles.loggedText}>Logged</Text>
      </View>
    </View>
  );
}

type LogDoseModalProps = {
  visible: boolean;
  plan: DosePlan;
  selectedSite: InjectionSite | null;
  doseDate: Date;
  onSelectSite: (site: InjectionSite) => void;
  onChangeDate: (date: Date) => void;
  onClose: () => void;
  onLog: () => void;
};

function LogDoseModal({ visible, plan, selectedSite, doseDate, onSelectSite, onChangeDate, onClose, onLog }: LogDoseModalProps) {
  const injectionSites: InjectionSite[] = ['Abdomen', 'Thigh', 'Upper arm'];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close log dose" />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <SheetHeader title="Log dose" onClose={onClose} />

          <View style={styles.modalDetails}>
            <ModalDetail icon="medkit-outline" label="Medication" value={plan.medication} />
            <ModalDetail icon="speedometer-outline" label="Dose" value={formatDose(plan.dose, plan.unit)} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Date</Text>
            <DateTimeField value={doseDate} onChange={onChangeDate} />
          </View>

          <View style={styles.siteGroup}>
            <View style={styles.optionalLabelRow}>
              <Text style={styles.fieldLabel}>Injection site</Text>
              <Text style={styles.optionalLabel}>Optional</Text>
            </View>
            <View style={styles.siteOptions}>
              {injectionSites.map((site) => (
                <TouchableOpacity
                  key={site}
                  style={[styles.siteOption, selectedSite === site && styles.siteOptionSelected]}
                  onPress={() => onSelectSite(site)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedSite === site }}
                >
                  <Text style={[styles.siteOptionText, selectedSite === site && styles.siteOptionTextSelected]}>{site}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={onLog} accessibilityRole="button">
            <Text style={styles.saveButtonText}>Log dose</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type ScheduleDraft = { medication: string; dose: number; scheduledDay: string };

function ScheduleModal({ visible, plan, onClose, onSave }: { visible: boolean; plan: DosePlan | null; onClose: () => void; onSave: (values: ScheduleDraft) => void }) {
  const [medication, setMedication] = useState('');
  const [dose, setDose] = useState('');
  const [scheduledDay, setScheduledDay] = useState('');

  function prepare() {
    setMedication(plan?.medication ?? '');
    setDose(plan?.dose ? String(plan.dose) : '');
    setScheduledDay(plan?.scheduledDay ?? '');
  }

  const parsedDose = Number.parseFloat(dose.replace(',', '.'));
  const valid = Boolean(medication && scheduledDay && Number.isFinite(parsedDose) && parsedDose > 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={prepare} onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close schedule editor" />
        <SafeAreaView style={[styles.sheet, styles.scheduleSheet]} edges={['bottom']}>
          <SheetHeader title={plan ? 'Edit schedule' : 'Set up medication'} onClose={onClose} />
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Medication</Text>
            <View style={styles.choiceGrid}>
              {medications.map((item) => <ChoiceChip key={item} label={item} selected={medication === item} onPress={() => setMedication(item)} />)}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Dose</Text>
              <View style={styles.doseInputWrap}>
                <TextInput style={styles.doseInput} value={dose} onChangeText={setDose} keyboardType="decimal-pad" placeholder="0" accessibilityLabel="Dose in mg" />
                <Text style={styles.inputUnit}>mg</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Scheduled day</Text>
              <View style={styles.choiceGrid}>
                {weekdays.map((day) => <ChoiceChip key={day} label={day} selected={scheduledDay === day} onPress={() => setScheduledDay(day)} />)}
              </View>
            </View>

            <TouchableOpacity style={[styles.saveButton, !valid && styles.disabledButton]} disabled={!valid} onPress={() => onSave({ medication, dose: parsedDose, scheduledDay })} accessibilityRole="button">
              <Text style={styles.saveButtonText}>Save schedule</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ChoiceChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <TouchableOpacity style={[styles.choiceChip, selected && styles.choiceChipSelected]} onPress={onPress}><Text style={[styles.choiceChipText, selected && styles.choiceChipTextSelected]}>{label}</Text></TouchableOpacity>;
}

function SheetHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return <><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><Text style={styles.sheetTitle}>{title}</Text><TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Close"><Ionicons name="close" size={21} color={TrackGLPColors.text} /></TouchableOpacity></View></>;
}

function ModalDetail({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return <View style={styles.modalDetailRow}><View style={styles.modalDetailIcon}><Ionicons name={icon} size={19} color={TrackGLPColors.plum} /></View><View><Text style={styles.modalDetailLabel}>{label}</Text><Text style={styles.modalDetailValue}>{value}</Text></View></View>;
}

function isValidDoseEntry(entry: DoseEntry) {
  return Boolean(entry.medication && entry.dose > 0 && Number.isFinite(Date.parse(entry.date)));
}

function getNextScheduledDate(dayName: string, from: Date, strictlyAfter: boolean) {
  const target = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
  const result = new Date(from);
  const sameDayOffset = (target - result.getDay() + 7) % 7;
  result.setDate(result.getDate() + (sameDayOffset === 0 && strictlyAfter ? 7 : sameDayOffset));
  result.setHours(8, 0, 0, 0);
  return result;
}

function formatFullDate(date: Date) { return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }); }
function formatShortDate(date: Date) { return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function formatHistoryDate(value: string) {
  const date = new Date(value);
  return date.toDateString() === new Date().toDateString() ? 'Today' : formatShortDate(date);
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TrackGLPColors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, gap: 16 },
  screenTitle: { color: TrackGLPColors.text, fontSize: 29, fontWeight: '800', letterSpacing: -0.7, marginBottom: 2 },
  nextDoseCard: { backgroundColor: '#F3EBF5', borderColor: '#DFD0E3', padding: 20 },
  nextDoseTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  medicationIcon: { width: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  countdownBadge: { width: 62, height: 62, borderRadius: 31, backgroundColor: TrackGLPColors.plum, alignItems: 'center', justifyContent: 'center' },
  countdownNumber: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', lineHeight: 24 },
  countdownLabel: { color: '#DCCEE0', fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  nextDoseEyebrow: { color: TrackGLPColors.plum, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, marginTop: 18 },
  medicationLine: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 3 },
  medicationName: { color: TrackGLPColors.text, fontSize: 29, fontWeight: '800', letterSpacing: -0.7 },
  dosePill: { color: TrackGLPColors.plum, fontSize: 12, fontWeight: '800', backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, overflow: 'hidden' },
  nextDoseDate: { color: TrackGLPColors.text, fontSize: 17, fontWeight: '700', marginTop: 12 },
  nextDoseTiming: { color: TrackGLPColors.muted, fontSize: 13, marginTop: 3 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: TrackGLPColors.plum, borderRadius: 15, paddingVertical: 14, marginTop: 20 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardEyebrow: { color: TrackGLPColors.plum, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { color: TrackGLPColors.text, fontSize: 19, fontWeight: '700', marginTop: 4 },
  scheduleIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  scheduleList: { marginTop: 13 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 45 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EEE8EF' },
  scheduleLabel: { color: TrackGLPColors.muted, fontSize: 12 },
  scheduleValue: { color: TrackGLPColors.text, fontSize: 13, fontWeight: '700', textAlign: 'right', marginLeft: 16 },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 14, gap: 3 },
  editButtonText: { color: TrackGLPColors.plum, fontSize: 13, fontWeight: '700' },
  historySection: { marginTop: 3 },
  sectionTitle: { color: TrackGLPColors.text, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  historyList: { backgroundColor: TrackGLPColors.card, borderRadius: 20, borderWidth: 1, borderColor: TrackGLPColors.border, paddingHorizontal: 16 },
  historyRow: { flexDirection: 'row', alignItems: 'center', minHeight: 68 },
  historyDateBlock: { width: 63, flexDirection: 'row', alignItems: 'center', gap: 8 },
  historyDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: TrackGLPColors.purple },
  historyDate: { color: TrackGLPColors.text, fontSize: 12, fontWeight: '700' },
  historyMedication: { flex: 1, minWidth: 0 },
  historyMedicationName: { color: TrackGLPColors.text, fontSize: 13, fontWeight: '700' },
  historyDose: { color: TrackGLPColors.muted, fontSize: 11, marginTop: 3 },
  loggedBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: TrackGLPColors.lavender, borderRadius: 11, paddingHorizontal: 7, paddingVertical: 5, marginLeft: 8 },
  loggedText: { color: TrackGLPColors.plum, fontSize: 9, fontWeight: '700' },
  emptySetupCard: { alignItems: 'center', padding: 24 },
  emptySetupIcon: { width: 56, height: 56, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  emptySetupTitle: { color: TrackGLPColors.text, fontSize: 21, fontWeight: '800', marginTop: 15 },
  emptySetupCopy: { color: TrackGLPColors.muted, fontSize: 13, marginTop: 5 },
  emptyHistory: { alignItems: 'center', paddingVertical: 24 },
  emptyHistoryTitle: { color: TrackGLPColors.text, fontSize: 14, fontWeight: '700' },
  emptyHistoryCopy: { color: TrackGLPColors.muted, fontSize: 11, marginTop: 4 },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37, 30, 39, 0.42)' },
  sheet: { maxHeight: '90%', backgroundColor: TrackGLPColors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  scheduleSheet: { paddingBottom: 18 },
  sheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#D7CDD9', alignSelf: 'center', marginBottom: 15 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  sheetTitle: { color: TrackGLPColors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  closeButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: TrackGLPColors.lavender, alignItems: 'center', justifyContent: 'center' },
  modalDetails: { backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 18, paddingHorizontal: 14 },
  modalDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 61, borderBottomWidth: 1, borderBottomColor: '#EEE8EF' },
  modalDetailIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  modalDetailLabel: { color: TrackGLPColors.muted, fontSize: 10, fontWeight: '600' },
  modalDetailValue: { color: TrackGLPColors.text, fontSize: 14, fontWeight: '700', marginTop: 2 },
  fieldGroup: { marginTop: 19 },
  siteGroup: { marginTop: 19 },
  optionalLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  fieldLabel: { color: TrackGLPColors.text, fontSize: 13, fontWeight: '700', marginBottom: 9 },
  optionalLabel: { color: TrackGLPColors.muted, fontSize: 10 },
  siteOptions: { flexDirection: 'row', gap: 7 },
  siteOption: { flex: 1, minWidth: 0, alignItems: 'center', paddingVertical: 11, borderRadius: 13, borderWidth: 1, borderColor: TrackGLPColors.border, backgroundColor: TrackGLPColors.card },
  siteOptionSelected: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum },
  siteOptionText: { color: TrackGLPColors.muted, fontSize: 11, fontWeight: '700' },
  siteOptionTextSelected: { color: '#FFFFFF' },
  choiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choiceChip: { borderWidth: 1, borderColor: TrackGLPColors.border, backgroundColor: TrackGLPColors.card, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 10 },
  choiceChipSelected: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum },
  choiceChipText: { color: TrackGLPColors.muted, fontSize: 11, fontWeight: '700' },
  choiceChipTextSelected: { color: '#FFFFFF' },
  doseInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 16, paddingHorizontal: 15 },
  doseInput: { flex: 1, color: TrackGLPColors.text, fontSize: 22, fontWeight: '700', paddingVertical: 12 },
  inputUnit: { color: TrackGLPColors.muted, fontSize: 14, fontWeight: '700' },
  saveButton: { backgroundColor: TrackGLPColors.plum, borderRadius: 15, alignItems: 'center', paddingVertical: 15, marginTop: 22 },
  disabledButton: { opacity: 0.38 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
