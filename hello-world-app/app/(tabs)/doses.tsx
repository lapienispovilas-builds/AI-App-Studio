import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardCard } from '@/components/track-glp/dashboard-card';
import { TrackGLPColors } from '@/constants/track-glp-theme';

type MedicationRoute = 'injection' | 'oral' | 'other';
type DoseStatus = 'logged';
type InjectionSite = 'Abdomen' | 'Thigh' | 'Upper arm';

type MedicationPlan = {
  id: string;
  name: string;
  route: MedicationRoute;
  dose: {
    amount: number;
    unit: 'mg' | 'mcg' | 'mL';
  };
  schedule: {
    cadence: 'daily' | 'weekly' | 'custom';
    label: string;
  };
};

type NextDose = {
  fullDateLabel: string;
  shortDateLabel: string;
  daysRemaining: number;
};

type DoseLog = {
  id: string;
  dateLabel: string;
  medicationId: string;
  medicationName: string;
  doseAmount: number;
  doseUnit: MedicationPlan['dose']['unit'];
  status: DoseStatus;
  administrationSite?: InjectionSite;
};

const medicationPlan: MedicationPlan = {
  id: 'ozempic-weekly',
  name: 'Ozempic',
  route: 'injection',
  dose: { amount: 1, unit: 'mg' },
  schedule: { cadence: 'weekly', label: 'Every Thursday' },
};

const initialNextDose: NextDose = {
  fullDateLabel: 'Thursday, Aug 13',
  shortDateLabel: 'Aug 13',
  daysRemaining: 3,
};

const nextDoseAfterLogging: NextDose = {
  fullDateLabel: 'Thursday, Aug 20',
  shortDateLabel: 'Aug 20',
  daysRemaining: 10,
};

const initialDoseHistory: DoseLog[] = [
  createDoseLog('2026-08-06', 'Aug 6', 1),
  createDoseLog('2026-07-30', 'Jul 30', 1),
  createDoseLog('2026-07-23', 'Jul 23', 0.5),
  createDoseLog('2026-07-16', 'Jul 16', 0.5),
];

function createDoseLog(id: string, dateLabel: string, amount: number, administrationSite?: InjectionSite): DoseLog {
  return {
    id,
    dateLabel,
    medicationId: medicationPlan.id,
    medicationName: medicationPlan.name,
    doseAmount: amount,
    doseUnit: medicationPlan.dose.unit,
    status: 'logged',
    administrationSite,
  };
}

function formatDose(amount: number, doseUnit: DoseLog['doseUnit']) {
  return `${amount.toFixed(amount % 1 === 0 ? 1 : 1)} ${doseUnit}`;
}

export default function DosesScreen() {
  const [nextDose, setNextDose] = useState(initialNextDose);
  const [doseHistory, setDoseHistory] = useState(initialDoseHistory);
  const [isLogDoseOpen, setIsLogDoseOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<InjectionSite | null>(null);

  function openLogDose() {
    setSelectedSite(null);
    setIsLogDoseOpen(true);
  }

  function logDose() {
    const newDose = createDoseLog(
      `logged-${Date.now()}`,
      'Today',
      medicationPlan.dose.amount,
      selectedSite ?? undefined,
    );

    setDoseHistory((currentHistory) => [newDose, ...currentHistory]);
    setNextDose(nextDoseAfterLogging);
    setIsLogDoseOpen(false);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Doses</Text>

        <DashboardCard style={styles.nextDoseCard}>
          <View style={styles.nextDoseTopRow}>
            <View style={styles.medicationIcon}>
              <Ionicons name="medical-outline" size={25} color={TrackGLPColors.plum} />
            </View>
            <View style={styles.countdownBadge}>
              <Text style={styles.countdownNumber}>{nextDose.daysRemaining}</Text>
              <Text style={styles.countdownLabel}>DAYS</Text>
            </View>
          </View>

          <Text style={styles.nextDoseEyebrow}>NEXT DOSE</Text>
          <View style={styles.medicationLine}>
            <Text style={styles.medicationName}>{medicationPlan.name}</Text>
            <Text style={styles.dosePill}>{formatDose(medicationPlan.dose.amount, medicationPlan.dose.unit)}</Text>
          </View>
          <Text style={styles.nextDoseDate}>{nextDose.fullDateLabel}</Text>
          <Text style={styles.nextDoseTiming}>{nextDose.daysRemaining} days remaining</Text>

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
            <ScheduleRow label="Medication" value={medicationPlan.name} />
            <ScheduleRow label="Dose" value={formatDose(medicationPlan.dose.amount, medicationPlan.dose.unit)} />
            <ScheduleRow label="Schedule" value={medicationPlan.schedule.label} />
            <ScheduleRow label="Next dose" value={nextDose.shortDateLabel} last />
          </View>

          <TouchableOpacity style={styles.editButton} accessibilityRole="button">
            <Text style={styles.editButtonText}>Edit schedule</Text>
            <Ionicons name="chevron-forward" size={16} color={TrackGLPColors.plum} />
          </TouchableOpacity>
        </DashboardCard>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Dose history</Text>
          <View style={styles.historyList}>
            {doseHistory.map((dose, index) => (
              <DoseHistoryRow key={dose.id} dose={dose} last={index === doseHistory.length - 1} />
            ))}
          </View>
        </View>
      </ScrollView>

      <LogDoseModal
        visible={isLogDoseOpen}
        medication={medicationPlan}
        selectedSite={selectedSite}
        onSelectSite={setSelectedSite}
        onClose={() => setIsLogDoseOpen(false)}
        onLog={logDose}
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

function DoseHistoryRow({ dose, last }: { dose: DoseLog; last: boolean }) {
  return (
    <View style={[styles.historyRow, !last && styles.rowBorder]}>
      <View style={styles.historyDateBlock}>
        <View style={styles.historyDot} />
        <Text style={styles.historyDate}>{dose.dateLabel}</Text>
      </View>
      <View style={styles.historyMedication}>
        <Text style={styles.historyMedicationName}>{dose.medicationName}</Text>
        <Text style={styles.historyDose}>
          {formatDose(dose.doseAmount, dose.doseUnit)}
          {dose.administrationSite ? ` · ${dose.administrationSite}` : ''}
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
  medication: MedicationPlan;
  selectedSite: InjectionSite | null;
  onSelectSite: (site: InjectionSite) => void;
  onClose: () => void;
  onLog: () => void;
};

function LogDoseModal({
  visible,
  medication,
  selectedSite,
  onSelectSite,
  onClose,
  onLog,
}: LogDoseModalProps) {
  const injectionSites: InjectionSite[] = ['Abdomen', 'Thigh', 'Upper arm'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close log dose" />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Log dose</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Close">
              <Ionicons name="close" size={21} color={TrackGLPColors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalDetails}>
            <ModalDetail icon="medkit-outline" label="Medication" value={medication.name} />
            <ModalDetail icon="speedometer-outline" label="Dose" value={formatDose(medication.dose.amount, medication.dose.unit)} />
            <ModalDetail icon="calendar-outline" label="Date" value="Today" />
          </View>

          {medication.route === 'injection' && (
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
                    <Text style={[styles.siteOptionText, selectedSite === site && styles.siteOptionTextSelected]}>
                      {site}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={onLog} accessibilityRole="button">
            <Text style={styles.saveButtonText}>Log dose</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function ModalDetail({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.modalDetailRow}>
      <View style={styles.modalDetailIcon}>
        <Ionicons name={icon} size={19} color={TrackGLPColors.plum} />
      </View>
      <View>
        <Text style={styles.modalDetailLabel}>{label}</Text>
        <Text style={styles.modalDetailValue}>{value}</Text>
      </View>
    </View>
  );
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
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37, 30, 39, 0.42)' },
  sheet: { backgroundColor: TrackGLPColors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  sheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#D7CDD9', alignSelf: 'center', marginBottom: 15 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { color: TrackGLPColors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  closeButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: TrackGLPColors.lavender, alignItems: 'center', justifyContent: 'center' },
  modalDetails: { backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 18, marginTop: 19, paddingHorizontal: 14 },
  modalDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 61, borderBottomWidth: 1, borderBottomColor: '#EEE8EF' },
  modalDetailIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  modalDetailLabel: { color: TrackGLPColors.muted, fontSize: 10, fontWeight: '600' },
  modalDetailValue: { color: TrackGLPColors.text, fontSize: 14, fontWeight: '700', marginTop: 2 },
  siteGroup: { marginTop: 19 },
  optionalLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  fieldLabel: { color: TrackGLPColors.text, fontSize: 13, fontWeight: '700' },
  optionalLabel: { color: TrackGLPColors.muted, fontSize: 10 },
  siteOptions: { flexDirection: 'row', gap: 7 },
  siteOption: { flex: 1, minWidth: 0, alignItems: 'center', paddingVertical: 11, borderRadius: 13, borderWidth: 1, borderColor: TrackGLPColors.border, backgroundColor: TrackGLPColors.card },
  siteOptionSelected: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum },
  siteOptionText: { color: TrackGLPColors.muted, fontSize: 11, fontWeight: '700' },
  siteOptionTextSelected: { color: '#FFFFFF' },
  saveButton: { backgroundColor: TrackGLPColors.plum, borderRadius: 15, alignItems: 'center', paddingVertical: 15, marginTop: 22 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
