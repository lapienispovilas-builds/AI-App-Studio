import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
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

type HabitKind = 'water' | 'protein';

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

const initialDailyRecord: DailyHabitRecord = {
  dateKey: '2026-08-10',
  water: { intakeMl: 1600, goalMl: 2500 },
  protein: { intakeG: 72, goalG: 100 },
};

const initialReminders: Record<HabitKind, ReminderSetting> = {
  water: {
    habit: 'water',
    title: 'Water',
    support: 'Stay on top of your hydration.',
    time: new Date(2026, 7, 10, 10, 0),
    enabled: true,
  },
  protein: {
    habit: 'protein',
    title: 'Protein',
    support: 'A small reminder to hit your protein goal.',
    time: new Date(2026, 7, 10, 13, 0),
    enabled: true,
  },
};

export default function HabitsScreen() {
  const [dailyRecord, setDailyRecord] = useState(initialDailyRecord);
  const [editingHabit, setEditingHabit] = useState<HabitKind | null>(null);
  const [reminders, setReminders] = useState(initialReminders);
  const [editingReminder, setEditingReminder] = useState<HabitKind | null>(null);

  function addWater() {
    setDailyRecord((record) => ({
      ...record,
      water: { ...record.water, intakeMl: record.water.intakeMl + 250 },
    }));
  }

  function addProtein() {
    setDailyRecord((record) => ({
      ...record,
      protein: { ...record.protein, intakeG: record.protein.intakeG + 10 },
    }));
  }

  function saveHabit(kind: HabitKind, intake: number, goal: number) {
    setDailyRecord((record) => kind === 'water'
      ? { ...record, water: { intakeMl: intake * 1000, goalMl: goal * 1000 } }
      : { ...record, protein: { intakeG: intake, goalG: goal } });
    setEditingHabit(null);
  }

  function toggleReminder(kind: HabitKind, enabled: boolean) {
    setReminders((current) => ({
      ...current,
      [kind]: { ...current[kind], enabled },
    }));
  }

  function saveReminder(setting: ReminderSetting) {
    setReminders((current) => ({ ...current, [setting.habit]: setting }));
    setEditingReminder(null);
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
          <Text style={styles.reminderDisclosure}>Settings are saved locally. OS alerts will be connected in a later build.</Text>
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
        <Text style={styles.reminderTime}>{formatTime(setting.time)}</Text>
      </TouchableOpacity>
      <Switch
        value={setting.enabled}
        onValueChange={onToggle}
        trackColor={{ false: '#D8CFDA', true: '#A681B2' }}
        thumbColor={setting.enabled ? TrackGLPColors.plum : '#FFFFFF'}
        accessibilityLabel={`${setting.title} reminder enabled`}
      />
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

  function handleShow() {
    const nextIntake = habit === 'water' ? record.water.intakeMl / 1000 : record.protein.intakeG;
    const nextGoal = habit === 'water' ? record.water.goalMl / 1000 : record.protein.goalG;
    setIntake(String(nextIntake));
    setGoal(String(nextGoal));
  }

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
    <Modal visible={Boolean(habit)} transparent animationType="slide" onShow={handleShow} onRequestClose={onClose}>
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
  const [draft, setDraft] = useState<ReminderSetting>(initialReminders.water);

  function handleShow() {
    if (setting) setDraft({ ...setting, time: new Date(setting.time) });
  }

  return (
    <Modal visible={Boolean(setting)} transparent animationType="slide" onShow={handleShow} onRequestClose={onClose}>
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

          <Text style={styles.notificationNote}>This saves your preference locally. OS notification scheduling is the next implementation step.</Text>

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
  return (valueMl / 1000).toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
}

function formatGrams(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatTime(value: Date) {
  return value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
  reminderTime: { color: TrackGLPColors.plum, fontSize: 11, fontWeight: '700', marginHorizontal: 8 },
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
