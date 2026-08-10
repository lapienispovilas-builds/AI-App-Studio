import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardCard } from '@/components/track-glp/dashboard-card';
import { DateTimeField } from '@/components/track-glp/date-time-field';
import { ProgressBar } from '@/components/track-glp/progress-bar';
import { TrackGLPColors } from '@/constants/track-glp-theme';
import { useAppData } from '@/context/app-data-context';
import {
  cancelReminder,
  ensureNotificationPermission,
  replaceDailyReminder,
} from '@/services/local-notifications';
import type { HabitKind } from '@/types/app-data';
import { getTodayHabits } from '@/utils/app-data-helpers';

type DailyHabitRecord = {
  dateKey: string;
  water: {
    intakeMl: number;
    goalMl: number;
  };
  protein: {
    intakeG: number;
    goalG: number;
  };
};

type ReminderSetting = {
  habit: HabitKind;
  title: string;
  support: string;
  time: Date;
  enabled: boolean;
};

export default function HabitsScreen() {
  const { data, updateDailyHabits, updateReminderSettings } = useAppData();
  const [editingHabit, setEditingHabit] = useState<HabitKind | null>(null);
  const [editingReminder, setEditingReminder] = useState<HabitKind | null>(null);
  const todayHabits = getTodayHabits(data);
  const hasTodayRecord = data.dailyHabits.some((entry) => entry.date === todayHabits.date);
  const dailyRecord: DailyHabitRecord = {
    dateKey: todayHabits.date,
    water: { intakeMl: todayHabits.waterAmount, goalMl: todayHabits.waterGoal },
    protein: { intakeG: todayHabits.proteinAmount, goalG: todayHabits.proteinGoal },
  };
  const reminders: Record<HabitKind, ReminderSetting> = {
    water: {
      habit: 'water',
      title: 'Water',
      support: 'Stay on top of your hydration.',
      time: timeStringToDate(data.reminders.waterTime ?? '10:00'),
      enabled: data.reminders.waterEnabled,
    },
    protein: {
      habit: 'protein',
      title: 'Protein',
      support: 'A small reminder to hit your protein goal.',
      time: timeStringToDate(data.reminders.proteinTime ?? '13:00'),
      enabled: data.reminders.proteinEnabled,
    },
  };

  useEffect(() => {
    if (hasTodayRecord) return;
    updateDailyHabits(todayHabits.date, {
      waterAmount: 0,
      proteinAmount: 0,
      waterGoal: todayHabits.waterGoal,
      proteinGoal: todayHabits.proteinGoal,
    });
  }, [hasTodayRecord, todayHabits.date, todayHabits.proteinGoal, todayHabits.waterGoal, updateDailyHabits]);

  useEffect(() => {
    if (data.reminders.waterTime && data.reminders.proteinTime) return;
    updateReminderSettings({
      waterTime: data.reminders.waterTime ?? '10:00',
      proteinTime: data.reminders.proteinTime ?? '13:00',
    });
  }, [data.reminders.proteinTime, data.reminders.waterTime, updateReminderSettings]);

  function addWater() {
    updateDailyHabits(dailyRecord.dateKey, { waterAmount: dailyRecord.water.intakeMl + 250 });
  }

  function addProtein() {
    updateDailyHabits(dailyRecord.dateKey, { proteinAmount: dailyRecord.protein.intakeG + 10 });
  }

  function saveHabit(kind: HabitKind, intake: number, goal: number) {
    updateDailyHabits(dailyRecord.dateKey, kind === 'water'
      ? { waterAmount: intake * 1000, waterGoal: goal * 1000 }
      : { proteinAmount: intake, proteinGoal: goal });
    setEditingHabit(null);
  }

  async function applyHabitReminder(kind: HabitKind, enabled: boolean, time: string) {
    const idKey = kind === 'water' ? 'waterNotificationId' : 'proteinNotificationId';
    const enabledKey = kind === 'water' ? 'waterEnabled' : 'proteinEnabled';
    const timeKey = kind === 'water' ? 'waterTime' : 'proteinTime';
    const currentId = data.reminders[idKey];

    if (!enabled) {
      await cancelReminder(currentId);
      updateReminderSettings({ [enabledKey]: false, [timeKey]: time, [idKey]: undefined });
      return true;
    }

    const granted = await ensureNotificationPermission(!data.reminders.notificationPermissionDenied);
    if (!granted) {
      updateReminderSettings({ [enabledKey]: false, [idKey]: undefined, notificationPermissionDenied: true });
      Alert.alert('Notifications unavailable', 'Notifications are disabled in iPhone Settings.');
      return false;
    }

    const notificationId = await replaceDailyReminder(kind, currentId, time);
    if (!notificationId) {
      updateReminderSettings({ [enabledKey]: false, [idKey]: undefined });
      Alert.alert('Reminder not scheduled', 'This device could not schedule the reminder. Please try again.');
      return false;
    }

    updateReminderSettings({
      [enabledKey]: true,
      [timeKey]: time,
      [idKey]: notificationId,
      notificationPermissionDenied: false,
    });
    return true;
  }

  async function toggleReminder(kind: HabitKind, enabled: boolean) {
    const time = kind === 'water'
      ? data.reminders.waterTime ?? '10:00'
      : data.reminders.proteinTime ?? '13:00';
    try {
      await applyHabitReminder(kind, enabled, time);
    } catch (error) {
      if (__DEV__) console.warn(`Could not update ${kind} reminder.`, error);
      updateReminderSettings(kind === 'water'
        ? { waterEnabled: false, waterNotificationId: undefined }
        : { proteinEnabled: false, proteinNotificationId: undefined });
      Alert.alert('Reminder not scheduled', 'This device could not update the reminder. Please try again.');
    }
  }

  async function saveReminder(setting: ReminderSetting) {
    const time = dateToTimeString(setting.time);
    try {
      await applyHabitReminder(setting.habit, setting.enabled, time);
      setEditingReminder(null);
    } catch (error) {
      if (__DEV__) console.warn(`Could not save ${setting.habit} reminder.`, error);
      updateReminderSettings(setting.habit === 'water'
        ? { waterEnabled: false, waterNotificationId: undefined }
        : { proteinEnabled: false, proteinNotificationId: undefined });
      Alert.alert('Reminder not scheduled', 'This device could not update the reminder. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.screenTitle}>Habits</Text>
          <Text style={styles.todayLabel}>Today</Text>
        </View>

        <HabitTrackerCard
          kind="water"
          icon="water-outline"
          title="Water"
          value={`${formatLiters(dailyRecord.water.intakeMl)} / ${formatLiters(dailyRecord.water.goalMl)} L`}
          progress={dailyRecord.water.intakeMl / dailyRecord.water.goalMl}
          quickAddLabel="+ 250 ml"
          education="Staying hydrated supports your body and can help you manage common issues like constipation."
          onQuickAdd={addWater}
          onEdit={() => setEditingHabit('water')}
        />

        <HabitTrackerCard
          kind="protein"
          icon="nutrition-outline"
          title="Protein"
          value={`${formatGrams(dailyRecord.protein.intakeG)} / ${formatGrams(dailyRecord.protein.goalG)} g`}
          progress={dailyRecord.protein.intakeG / dailyRecord.protein.goalG}
          quickAddLabel="+ 10 g"
          education="Getting enough protein helps support muscle mass, especially while losing weight."
          onQuickAdd={addProtein}
          onEdit={() => setEditingHabit('protein')}
        />

        <View style={styles.reminderSection}>
          <Text style={styles.sectionTitle}>Daily reminders</Text>
          <Text style={styles.reminderDisclosure}>Reminders use your device&apos;s local time.</Text>
          <View style={styles.reminderList}>
            {(Object.keys(reminders) as HabitKind[]).map((kind, index) => (
              <ReminderRow
                key={kind}
                setting={reminders[kind]}
                last={index === Object.keys(reminders).length - 1}
                onOpen={() => setEditingReminder(kind)}
                onToggle={(enabled) => toggleReminder(kind, enabled)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <EditHabitModal
        habit={editingHabit}
        record={dailyRecord}
        onClose={() => setEditingHabit(null)}
        onSave={saveHabit}
      />

      <ReminderModal
        setting={editingReminder ? reminders[editingReminder] : null}
        onClose={() => setEditingReminder(null)}
        onSave={saveReminder}
      />
    </SafeAreaView>
  );
}

type HabitTrackerCardProps = {
  kind: HabitKind;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  progress: number;
  quickAddLabel: string;
  education: string;
  onQuickAdd: () => void;
  onEdit: () => void;
};

function HabitTrackerCard({ icon, title, value, progress, quickAddLabel, education, onQuickAdd, onEdit }: HabitTrackerCardProps) {
  return (
    <DashboardCard style={styles.habitCard}>
      <View style={styles.habitHeader}>
        <View style={styles.habitIdentity}>
          <View style={styles.habitIcon}>
            <Ionicons name={icon} size={24} color={TrackGLPColors.plum} />
          </View>
          <View>
            <Text style={styles.habitTitle}>{title}</Text>
            <Text style={styles.habitValue}>{value}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onEdit} accessibilityRole="button">
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar progress={progress} />
      </View>

      <TouchableOpacity style={styles.quickAddButton} onPress={onQuickAdd} accessibilityRole="button">
        <Text style={styles.quickAddText}>{quickAddLabel}</Text>
      </TouchableOpacity>

      <View style={styles.educationNote}>
        <View style={styles.educationTitleRow}>
          <Ionicons name="information-circle-outline" size={16} color={TrackGLPColors.plum} />
          <Text style={styles.educationTitle}>Why it matters</Text>
        </View>
        <Text style={styles.educationCopy}>{education}</Text>
      </View>
    </DashboardCard>
  );
}

function ReminderRow({ setting, last, onOpen, onToggle }: { setting: ReminderSetting; last: boolean; onOpen: () => void; onToggle: (enabled: boolean) => void }) {
  const icon = setting.habit === 'water' ? 'water-outline' : 'nutrition-outline';
  return (
    <View style={[styles.reminderRow, !last && styles.rowBorder]}>
      <TouchableOpacity style={styles.reminderMain} onPress={onOpen} accessibilityRole="button">
        <View style={styles.reminderIcon}>
          <Ionicons name={icon} size={19} color={TrackGLPColors.plum} />
        </View>
        <View style={styles.reminderBody}>
          <Text style={styles.reminderTitle}>{setting.title}</Text>
          <Text style={styles.reminderSupport} numberOfLines={2}>{setting.support}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.reminderControls}>
        <Text style={styles.reminderTime} onPress={onOpen}>{formatTime(setting.time)}</Text>
        <Switch
          value={setting.enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#D8CFDA', true: '#A681B2' }}
          thumbColor={setting.enabled ? TrackGLPColors.plum : '#FFFFFF'}
          accessibilityLabel={`${setting.title} reminder enabled`}
        />
      </View>
    </View>
  );
}

type EditHabitModalProps = {
  habit: HabitKind | null;
  record: DailyHabitRecord;
  onClose: () => void;
  onSave: (kind: HabitKind, intake: number, goal: number) => void;
};

function EditHabitModal({ habit, record, onClose, onSave }: EditHabitModalProps) {
  const waterIntake = record.water.intakeMl / 1000;
  const waterGoal = record.water.goalMl / 1000;
  const initialIntake = habit === 'water' ? waterIntake : record.protein.intakeG;
  const initialGoal = habit === 'water' ? waterGoal : record.protein.goalG;
  const [intake, setIntake] = useState(String(initialIntake));
  const [goal, setGoal] = useState(String(initialGoal));

  useEffect(() => {
    if (!habit) return;
    const nextIntake = habit === 'water' ? record.water.intakeMl / 1000 : record.protein.intakeG;
    const nextGoal = habit === 'water' ? record.water.goalMl / 1000 : record.protein.goalG;
    setIntake(String(nextIntake));
    setGoal(String(nextGoal));
  }, [habit, record.protein.goalG, record.protein.intakeG, record.water.goalMl, record.water.intakeMl]);

  function handleSave() {
    if (!habit) return;
    const parsedIntake = Number.parseFloat(intake.replace(',', '.'));
    const parsedGoal = Number.parseFloat(goal.replace(',', '.'));
    if (!Number.isFinite(parsedIntake) || parsedIntake < 0 || !Number.isFinite(parsedGoal) || parsedGoal <= 0) return;
    onSave(habit, parsedIntake, parsedGoal);
  }

  const title = habit === 'water' ? 'Water' : 'Protein';
  const unit = habit === 'water' ? 'L' : 'g';

  return (
    <Modal visible={Boolean(habit)} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close habit editor" />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <SheetHeader title={title} onClose={onClose} />
          <NumberField label="Today's intake" value={intake} onChange={setIntake} unit={unit} />
          <NumberField label="Daily goal" value={goal} onChange={setGoal} unit={unit} />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityRole="button">
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function NumberField({ label, value, onChange, unit }: { label: string; value: string; onChange: (value: string) => void; unit: string }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.numberInputWrap}>
        <TextInput
          style={styles.numberInput}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          selectTextOnFocus
          accessibilityLabel={label}
        />
        <Text style={styles.inputUnit}>{unit}</Text>
      </View>
    </View>
  );
}

type ReminderModalProps = {
  setting: ReminderSetting | null;
  onClose: () => void;
  onSave: (setting: ReminderSetting) => void;
};

function ReminderModal({ setting, onClose, onSave }: ReminderModalProps) {
  const [draft, setDraft] = useState<ReminderSetting>(() => ({
    habit: 'water',
    title: 'Water',
    support: 'Stay on top of your hydration.',
    time: new Date(),
    enabled: true,
  }));

  useEffect(() => {
    if (setting) setDraft({ ...setting, time: new Date(setting.time) });
  }, [setting]);

  return (
    <Modal visible={Boolean(setting)} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close reminder editor" />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <SheetHeader title={`${setting?.title ?? 'Habit'} reminder`} onClose={onClose} />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Remind me at</Text>
            <DateTimeField value={draft.time} onChange={(time) => setDraft((current) => ({ ...current, time }))} mode="time" />
          </View>

          <View style={styles.reminderToggleRow}>
            <View>
              <Text style={styles.reminderToggleTitle}>Reminder enabled</Text>
              <Text style={styles.reminderToggleSupport}>{draft.enabled ? 'On' : 'Off'}</Text>
            </View>
            <Switch
              value={draft.enabled}
              onValueChange={(enabled) => setDraft((current) => ({ ...current, enabled }))}
              trackColor={{ false: '#D8CFDA', true: '#A681B2' }}
              thumbColor={draft.enabled ? TrackGLPColors.plum : '#FFFFFF'}
              accessibilityLabel="Reminder enabled"
            />
          </View>

          <Text style={styles.notificationNote}>Your reminder is scheduled locally on this device.</Text>

          <TouchableOpacity style={styles.saveButton} onPress={() => onSave(draft)} accessibilityRole="button">
            <Text style={styles.saveButtonText}>Save reminder</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function SheetHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <>
      <View style={styles.sheetHandle} />
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Close">
          <Ionicons name="close" size={21} color={TrackGLPColors.text} />
        </TouchableOpacity>
      </View>
    </>
  );
}

function formatLiters(valueMl: number) {
  if (valueMl === 0) return '0';
  const liters = valueMl / 1000;
  return Number.isInteger(liters)
    ? liters.toFixed(1)
    : liters.toFixed(2).replace(/0$/, '');
}

function formatGrams(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatTime(value: Date) {
  return value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function timeStringToDate(value: string) {
  const [hours = 0, minutes = 0] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function dateToTimeString(value: Date) {
  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TrackGLPColors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, gap: 16 },
  screenTitle: { color: TrackGLPColors.text, fontSize: 29, fontWeight: '800', letterSpacing: -0.7 },
  todayLabel: { color: TrackGLPColors.muted, fontSize: 14, marginTop: 5 },
  habitCard: { padding: 20 },
  habitHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  habitIdentity: { flexDirection: 'row', alignItems: 'center', gap: 13, flex: 1 },
  habitIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  habitTitle: { color: TrackGLPColors.muted, fontSize: 12, fontWeight: '600' },
  habitValue: { color: TrackGLPColors.text, fontSize: 21, fontWeight: '800', letterSpacing: -0.3, marginTop: 3 },
  editText: { color: TrackGLPColors.plum, fontSize: 12, fontWeight: '700', paddingVertical: 4 },
  progressWrap: { marginTop: 17 },
  quickAddButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.plum, borderRadius: 14, paddingVertical: 12, marginTop: 15 },
  quickAddText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  educationNote: { backgroundColor: '#F7F2F8', borderRadius: 15, padding: 13, marginTop: 15 },
  educationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  educationTitle: { color: TrackGLPColors.plum, fontSize: 11, fontWeight: '700' },
  educationCopy: { color: TrackGLPColors.muted, fontSize: 11, lineHeight: 17, marginTop: 5 },
  reminderSection: { marginTop: 3 },
  sectionTitle: { color: TrackGLPColors.text, fontSize: 20, fontWeight: '700' },
  reminderDisclosure: { color: TrackGLPColors.muted, fontSize: 10, lineHeight: 15, marginTop: 4, marginBottom: 10 },
  reminderList: { backgroundColor: TrackGLPColors.card, borderRadius: 20, borderWidth: 1, borderColor: TrackGLPColors.border, paddingHorizontal: 15 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', minHeight: 76 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EEE8EF' },
  reminderMain: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  reminderIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  reminderBody: { flex: 1, minWidth: 0, marginLeft: 10 },
  reminderTitle: { color: TrackGLPColors.text, fontSize: 13, fontWeight: '700' },
  reminderSupport: { color: TrackGLPColors.muted, fontSize: 9, lineHeight: 13, marginTop: 2 },
  reminderControls: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 8 },
  reminderTime: { color: TrackGLPColors.plum, fontSize: 11, fontWeight: '700' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37, 30, 39, 0.42)' },
  sheet: { backgroundColor: TrackGLPColors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  sheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#D7CDD9', alignSelf: 'center', marginBottom: 15 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { color: TrackGLPColors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  closeButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: TrackGLPColors.lavender, alignItems: 'center', justifyContent: 'center' },
  fieldGroup: { marginTop: 20 },
  fieldLabel: { color: TrackGLPColors.muted, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  numberInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 16, paddingHorizontal: 15 },
  numberInput: { flex: 1, color: TrackGLPColors.text, fontSize: 26, fontWeight: '700', paddingVertical: 12 },
  inputUnit: { color: TrackGLPColors.muted, fontSize: 15, fontWeight: '700' },
  saveButton: { backgroundColor: TrackGLPColors.plum, borderRadius: 15, alignItems: 'center', paddingVertical: 15, marginTop: 22 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  reminderToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 16, padding: 14, marginTop: 18 },
  reminderToggleTitle: { color: TrackGLPColors.text, fontSize: 14, fontWeight: '700' },
  reminderToggleSupport: { color: TrackGLPColors.muted, fontSize: 11, marginTop: 2 },
  notificationNote: { color: TrackGLPColors.muted, fontSize: 10, lineHeight: 15, marginTop: 12 },
});
