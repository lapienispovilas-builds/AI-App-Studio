import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrackGLPColors } from '@/constants/track-glp-theme';
import { useAppData } from '@/context/app-data-context';
import type { Glp1Status, OnboardingData, Sex, UnitSystem } from '@/types/app-data';

type Step = 'welcome' | 'units' | 'treatment' | 'medication' | 'dose' | 'schedule' |
  'startingWeight' | 'currentWeight' | 'goalWeight' | 'height' | 'age' | 'sex' | 'disclaimer';

type Answers = {
  unitSystem: UnitSystem | null;
  glp1Status: Glp1Status | null;
  medication: string | null;
  dose: string;
  scheduledDay: string | null;
  startingWeight: string;
  startingWeightSecondary: string;
  currentWeight: string;
  currentWeightSecondary: string;
  goalWeight: string;
  goalWeightSecondary: string;
  height: string;
  heightSecondary: string;
  ageRange: string | null;
  sex: Sex | null;
};

const initialAnswers: Answers = {
  unitSystem: null,
  glp1Status: null,
  medication: null,
  dose: '',
  scheduledDay: null,
  startingWeight: '',
  startingWeightSecondary: '',
  currentWeight: '',
  currentWeightSecondary: '',
  goalWeight: '',
  goalWeightSecondary: '',
  height: '',
  heightSecondary: '',
  ageRange: null,
  sex: null,
};

const medications = ['Ozempic', 'Wegovy', 'Mounjaro', 'Zepbound', 'Other'];
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ageRanges = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'];

export function OnboardingFlow() {
  const { completeOnboarding } = useAppData();
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const steps = useMemo<Step[]>(() => [
    'welcome',
    'units',
    'treatment',
    ...(answers.glp1Status === 'started' ? ['medication', 'dose', 'schedule'] as Step[] : []),
    'startingWeight',
    'currentWeight',
    'goalWeight',
    'height',
    'age',
    'sex',
    'disclaimer',
  ], [answers.glp1Status]);

  const activeIndex = Math.min(stepIndex, steps.length - 1);
  const step = steps[activeIndex];

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function goNext() {
    if (activeIndex < steps.length - 1) setStepIndex(activeIndex + 1);
  }

  function goBack() {
    if (activeIndex > 0) setStepIndex(activeIndex - 1);
  }

  async function finish() {
    const payload = buildOnboardingData(answers);
    if (!payload) return;
    setIsSaving(true);
    setSaveError('');
    try {
      await completeOnboarding(payload);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Your information could not be saved.');
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.shell}>
          {step !== 'welcome' && (
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backIcon} onPress={goBack} accessibilityLabel="Back">
                <Ionicons name="chevron-back" size={22} color={TrackGLPColors.text} />
              </TouchableOpacity>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(activeIndex / (steps.length - 1)) * 100}%` }]} />
              </View>
              <Text style={styles.stepCount}>{activeIndex}/{steps.length - 1}</Text>
            </View>
          )}

          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {step === 'welcome' && <Welcome />}
            {step === 'units' && (
              <SelectionQuestion
                title="Measurement units"
                value={answers.unitSystem}
                options={[
                  { value: 'imperial_us', label: 'Imperial US', detail: 'lb, ft' },
                  { value: 'imperial_uk', label: 'Imperial UK', detail: 'st/lb, ft' },
                  { value: 'metric', label: 'Metric', detail: 'kg, cm' },
                ]}
                onSelect={(value) => update('unitSystem', value as UnitSystem)}
              />
            )}
            {step === 'treatment' && (
              <SelectionQuestion
                title="Have you started your GLP-1 treatment?"
                value={answers.glp1Status}
                options={[{ value: 'started', label: 'Yes' }, { value: 'not_started', label: 'Not yet' }]}
                onSelect={(value) => update('glp1Status', value as Glp1Status)}
              />
            )}
            {step === 'medication' && (
              <SelectionQuestion
                title="Which medication are you using?"
                subtitle="This is for tracking only. TrackGLP does not recommend medications."
                value={answers.medication}
                options={medications.map((value) => ({ value, label: value }))}
                onSelect={(value) => update('medication', value)}
              />
            )}
            {step === 'dose' && (
              <NumericQuestion title="What's your current dose?" subtitle="Enter the dose you currently use. TrackGLP does not recommend dosages.">
                <NumberInput label="Current dose" value={answers.dose} onChange={(value) => update('dose', value)} unit="mg" />
              </NumericQuestion>
            )}
            {step === 'schedule' && (
              <SelectionQuestion
                title="When do you usually take your dose?"
                value={answers.scheduledDay}
                options={weekdays.map((value) => ({ value, label: value }))}
                onSelect={(value) => update('scheduledDay', value)}
              />
            )}
            {step === 'startingWeight' && <MeasurementQuestion kind="weight" title="What was your starting weight?" prefix="startingWeight" answers={answers} update={update} />}
            {step === 'currentWeight' && <MeasurementQuestion kind="weight" title="What's your current weight?" prefix="currentWeight" answers={answers} update={update} />}
            {step === 'goalWeight' && <MeasurementQuestion kind="weight" title="What's your goal weight?" prefix="goalWeight" answers={answers} update={update} />}
            {step === 'height' && <MeasurementQuestion kind="height" title="What's your height?" prefix="height" answers={answers} update={update} />}
            {step === 'age' && (
              <SelectionQuestion title="What is your age range?" value={answers.ageRange} options={ageRanges.map((value) => ({ value, label: value }))} onSelect={(value) => update('ageRange', value)} />
            )}
            {step === 'sex' && (
              <SelectionQuestion
                title="Sex assigned at birth"
                subtitle="This does not affect recommendations or medical logic in V1."
                value={answers.sex}
                options={[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                ]}
                onSelect={(value) => update('sex', value as Sex)}
              />
            )}
            {step === 'disclaimer' && <Disclaimer error={saveError} />}
          </ScrollView>

          <View style={styles.navigation}>
            {step === 'disclaimer' ? (
              <>
                <TouchableOpacity style={styles.secondaryButton} onPress={goBack} disabled={isSaving}>
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <PrimaryButton label={isSaving ? 'Saving…' : 'I Understand'} onPress={finish} disabled={isSaving} compact />
              </>
            ) : (
              <PrimaryButton label={step === 'welcome' ? 'Get started' : 'Next'} onPress={goNext} disabled={!isStepValid(step, answers)} />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function OnboardingLoadingScreen() {
  return (
    <SafeAreaView style={[styles.safeArea, styles.loading]}>
      <ActivityIndicator size="large" color={TrackGLPColors.plum} />
    </SafeAreaView>
  );
}

function Welcome() {
  return (
    <View style={styles.welcome}>
      <View style={styles.brandMark}><Ionicons name="analytics" size={28} color="#FFFFFF" /></View>
      <Text style={styles.welcomeTitle}>Your GLP-1 journey, all in one place</Text>
      <Text style={styles.subtitle}>Track your progress, doses, symptoms and daily habits.</Text>
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}><Text style={styles.previewEyebrow}>TODAY</Text><Text style={styles.previewMetric}>{"You're on track"}</Text></View>
        <View style={styles.previewRows}>
          <PreviewItem icon="trending-down" label="Progress" value="Clear trends" />
          <PreviewItem icon="medical" label="Next dose" value="Never lose track" />
          <PreviewItem icon="water" label="Daily habits" value="Simple check-ins" />
        </View>
      </View>
    </View>
  );
}

function PreviewItem({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return <View style={styles.previewItem}><View style={styles.previewIcon}><Ionicons name={icon} size={18} color={TrackGLPColors.plum} /></View><View><Text style={styles.previewLabel}>{label}</Text><Text style={styles.previewValue}>{value}</Text></View></View>;
}

type Option = { value: string; label: string; detail?: string };

function SelectionQuestion({ title, subtitle, value, options, onSelect }: { title: string; subtitle?: string; value: string | null; options: Option[]; onSelect: (value: string) => void }) {
  return (
    <View>
      <Text style={styles.questionTitle}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.optionList}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <TouchableOpacity key={option.value} style={[styles.option, selected && styles.optionSelected]} onPress={() => onSelect(option.value)} accessibilityRole="radio" accessibilityState={{ checked: selected }}>
              <View><Text style={styles.optionLabel}>{option.label}</Text>{option.detail && <Text style={styles.optionDetail}>{option.detail}</Text>}</View>
              <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}</View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function NumericQuestion({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return <View><Text style={styles.questionTitle}>{title}</Text>{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}<View style={styles.numericCard}>{children}</View></View>;
}

function MeasurementQuestion({ kind, title, prefix, answers, update }: { kind: 'weight' | 'height'; title: string; prefix: 'startingWeight' | 'currentWeight' | 'goalWeight' | 'height'; answers: Answers; update: <K extends keyof Answers>(key: K, value: Answers[K]) => void }) {
  const unit = answers.unitSystem;
  const primaryKey = prefix as keyof Answers;
  const secondaryKey = `${prefix}Secondary` as keyof Answers;
  const isMetric = unit === 'metric';
  const isUkWeight = kind === 'weight' && unit === 'imperial_uk';
  const needsSecondary = (kind === 'height' && !isMetric) || isUkWeight;
  const firstUnit = kind === 'height' ? (isMetric ? 'cm' : 'ft') : (isMetric ? 'kg' : isUkWeight ? 'st' : 'lb');
  const secondUnit = kind === 'height' ? 'in' : 'lb';
  return (
    <NumericQuestion title={title}>
      <View style={needsSecondary && styles.inputPair}>
        <NumberInput label={kind === 'height' ? 'Height' : 'Weight'} value={answers[primaryKey] as string} onChange={(value) => update(primaryKey, value)} unit={firstUnit} compact={needsSecondary} />
        {needsSecondary && <NumberInput label={kind === 'height' ? 'Inches' : 'Pounds'} value={answers[secondaryKey] as string} onChange={(value) => update(secondaryKey, value)} unit={secondUnit} compact />}
      </View>
    </NumericQuestion>
  );
}

function NumberInput({ label, value, onChange, unit, compact }: { label: string; value: string; onChange: (value: string) => void; unit: string; compact?: boolean }) {
  return (
    <View style={compact ? styles.compactInput : undefined}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput value={value} onChangeText={onChange} keyboardType="decimal-pad" style={styles.input} placeholder="0" placeholderTextColor="#B5ADB6" accessibilityLabel={`${label} in ${unit}`} />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

function Disclaimer({ error }: { error: string }) {
  return (
    <View>
      <View style={styles.disclaimerIcon}><Ionicons name="shield-checkmark-outline" size={32} color={TrackGLPColors.plum} /></View>
      <Text style={styles.questionTitle}>Health Disclaimer</Text>
      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerText}>TrackGLP is a tracking and educational tool designed to help you understand your GLP-1 treatment journey.{`\n\n`}It is not a medical device and does not provide medical advice, diagnosis, or treatment.{`\n\n`}Always consult a qualified healthcare professional before making changes to your medication or treatment.</Text>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

function PrimaryButton({ label, onPress, disabled, compact }: { label: string; onPress: () => void; disabled?: boolean; compact?: boolean }) {
  return <TouchableOpacity style={[styles.primaryButton, compact && styles.compactButton, disabled && styles.buttonDisabled]} onPress={onPress} disabled={disabled}><Text style={styles.primaryButtonText}>{label}</Text></TouchableOpacity>;
}

function isStepValid(step: Step, answers: Answers) {
  switch (step) {
    case 'units': return Boolean(answers.unitSystem);
    case 'treatment': return Boolean(answers.glp1Status);
    case 'medication': return Boolean(answers.medication);
    case 'dose': return positive(answers.dose);
    case 'schedule': return Boolean(answers.scheduledDay);
    case 'startingWeight': return validMeasurement('weight', 'startingWeight', answers);
    case 'currentWeight': return validMeasurement('weight', 'currentWeight', answers);
    case 'goalWeight': return validMeasurement('weight', 'goalWeight', answers);
    case 'height': return validMeasurement('height', 'height', answers);
    case 'age': return Boolean(answers.ageRange);
    case 'sex': return Boolean(answers.sex);
    default: return true;
  }
}

function validMeasurement(kind: 'weight' | 'height', prefix: 'startingWeight' | 'currentWeight' | 'goalWeight' | 'height', answers: Answers) {
  if (!positive(answers[prefix])) return false;
  if (kind === 'height' && answers.unitSystem !== 'metric') return nonNegative(answers.heightSecondary) && Number(answers.heightSecondary) < 12;
  if (kind === 'weight' && answers.unitSystem === 'imperial_uk') return nonNegative(answers[`${prefix}Secondary`]) && Number(answers[`${prefix}Secondary`]) < 14;
  return true;
}

function positive(value: string) { return Number(value) > 0; }
function nonNegative(value: string) { return value !== '' && Number(value) >= 0; }

function buildOnboardingData(answers: Answers): OnboardingData | null {
  if (!answers.unitSystem || !answers.glp1Status || !answers.ageRange || !answers.sex) return null;
  return {
    unitSystem: answers.unitSystem,
    glp1Status: answers.glp1Status,
    startingWeightKg: weightToKg(answers.startingWeight, answers.startingWeightSecondary, answers.unitSystem),
    currentWeightKg: weightToKg(answers.currentWeight, answers.currentWeightSecondary, answers.unitSystem),
    goalWeightKg: weightToKg(answers.goalWeight, answers.goalWeightSecondary, answers.unitSystem),
    heightCm: heightToCm(answers.height, answers.heightSecondary, answers.unitSystem),
    ageRange: answers.ageRange,
    sex: answers.sex,
    medication: answers.glp1Status === 'started' ? answers.medication ?? undefined : undefined,
    doseMg: answers.glp1Status === 'started' ? Number(answers.dose) : undefined,
    scheduledDay: answers.glp1Status === 'started' ? answers.scheduledDay ?? undefined : undefined,
  };
}

function weightToKg(primary: string, secondary: string, unit: UnitSystem) {
  if (unit === 'metric') return Number(primary);
  const pounds = unit === 'imperial_uk' ? Number(primary) * 14 + Number(secondary) : Number(primary);
  return round(pounds * 0.45359237, 2);
}

function heightToCm(primary: string, secondary: string, unit: UnitSystem) {
  if (unit === 'metric') return Number(primary);
  return round(Number(primary) * 30.48 + Number(secondary) * 2.54, 1);
}

function round(value: number, precision: number) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: TrackGLPColors.background },
  loading: { alignItems: 'center', justifyContent: 'center' },
  shell: { flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8 },
  backIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: TrackGLPColors.border },
  progressTrack: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#E9DFEC', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: TrackGLPColors.plum },
  stepCount: { color: TrackGLPColors.muted, fontSize: 11, fontWeight: '600', width: 34, textAlign: 'right' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 38, paddingBottom: 24 },
  welcome: { flex: 1, justifyContent: 'center', paddingTop: 20 },
  brandMark: { width: 58, height: 58, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.plum, marginBottom: 26 },
  welcomeTitle: { color: TrackGLPColors.text, fontSize: 38, lineHeight: 43, fontWeight: '800', letterSpacing: -1.2 },
  questionTitle: { color: TrackGLPColors.text, fontSize: 31, lineHeight: 37, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: TrackGLPColors.muted, fontSize: 15, lineHeight: 23, marginTop: 12 },
  previewCard: { backgroundColor: '#F1E9F4', borderRadius: 28, padding: 20, marginTop: 36, borderWidth: 1, borderColor: '#E4D7E8' },
  previewHeader: { backgroundColor: TrackGLPColors.plum, borderRadius: 20, padding: 18 },
  previewEyebrow: { color: '#DCC8E2', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  previewMetric: { color: '#FFFFFF', fontSize: 23, fontWeight: '800', marginTop: 5 },
  previewRows: { flexDirection: 'row', gap: 8, marginTop: 12 },
  previewItem: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 10, minHeight: 90 },
  previewIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  previewLabel: { color: TrackGLPColors.text, fontSize: 10, fontWeight: '700', marginTop: 8 },
  previewValue: { color: TrackGLPColors.muted, fontSize: 8, lineHeight: 11, marginTop: 2 },
  optionList: { gap: 12, marginTop: 30 },
  option: { minHeight: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: TrackGLPColors.border, paddingHorizontal: 18, paddingVertical: 14 },
  optionSelected: { borderColor: TrackGLPColors.plum, backgroundColor: '#F8F2FA' },
  optionLabel: { color: TrackGLPColors.text, fontSize: 15, fontWeight: '700' },
  optionDetail: { color: TrackGLPColors.muted, fontSize: 11, marginTop: 3 },
  radio: { width: 25, height: 25, borderRadius: 13, borderWidth: 2, borderColor: '#D7CCD9', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { backgroundColor: TrackGLPColors.plum, borderColor: TrackGLPColors.plum },
  numericCard: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: TrackGLPColors.border, padding: 20, marginTop: 30 },
  inputPair: { flexDirection: 'row', gap: 12 },
  compactInput: { flex: 1 },
  inputLabel: { color: TrackGLPColors.muted, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#DED4E0', backgroundColor: '#FCFAFC', paddingHorizontal: 16 },
  input: { flex: 1, color: TrackGLPColors.text, fontSize: 24, fontWeight: '700', paddingVertical: 17 },
  unit: { color: TrackGLPColors.plum, fontSize: 14, fontWeight: '800' },
  disclaimerIcon: { width: 62, height: 62, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender, marginBottom: 20 },
  disclaimerCard: { backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 1, borderColor: TrackGLPColors.border, padding: 20, marginTop: 24 },
  disclaimerText: { color: TrackGLPColors.muted, fontSize: 14, lineHeight: 22 },
  error: { color: '#A43F56', fontSize: 12, lineHeight: 18, marginTop: 14 },
  navigation: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 14, backgroundColor: TrackGLPColors.background },
  primaryButton: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: TrackGLPColors.plum },
  compactButton: { flex: 1.7 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  buttonDisabled: { opacity: 0.38 },
  secondaryButton: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: TrackGLPColors.border },
  secondaryButtonText: { color: TrackGLPColors.text, fontSize: 15, fontWeight: '700' },
});
