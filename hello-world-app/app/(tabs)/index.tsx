import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardCard } from '@/components/track-glp/dashboard-card';
import { ProgressBar } from '@/components/track-glp/progress-bar';
import { WeightTrendChart } from '@/components/track-glp/weight-trend-chart';
import { TrackGLPColors } from '@/constants/track-glp-theme';

const sideEffectOptions = ['None', 'Mild', 'Moderate', 'Severe'];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, Sarah</Text>
            <Text style={styles.journey}>Week 6 of your journey</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} accessibilityLabel="Open profile">
            <Ionicons name="person-outline" size={21} color={TrackGLPColors.plum} />
          </TouchableOpacity>
        </View>

        <DashboardCard style={styles.progressCard}>
          <View style={styles.cardHeadingRow}>
            <View>
              <Text style={styles.eyebrowLight}>TOTAL PROGRESS</Text>
              <Text style={styles.progressValue}>↓ 7.4 kg</Text>
            </View>
            <View style={styles.encouragementBadge}>
              <Ionicons name="sparkles" size={14} color={TrackGLPColors.plum} />
              <Text style={styles.encouragementText}>Great progress</Text>
            </View>
          </View>
          <ProgressBar progress={0.37} light />
          <View style={styles.progressMetaRow}>
            <View>
              <Text style={styles.metaLabelLight}>Current</Text>
              <Text style={styles.metaValueLight}>84.6 kg</Text>
            </View>
            <View style={styles.metaCenter}>
              <Text style={styles.metaLabelLight}>Started at</Text>
              <Text style={styles.metaValueLight}>92 kg</Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={styles.metaLabelLight}>Goal</Text>
              <Text style={styles.metaValueLight}>72 kg</Text>
            </View>
          </View>
        </DashboardCard>

        <DashboardCard style={styles.doseCard}>
          <View style={styles.doseIcon}>
            <Ionicons name="medical-outline" size={25} color={TrackGLPColors.plum} />
          </View>
          <View style={styles.doseBody}>
            <Text style={styles.cardLabel}>NEXT DOSE</Text>
            <Text style={styles.cardTitle}>Ozempic · 1.0 mg</Text>
            <Text style={styles.cardDetail}>Thursday · 3 days remaining</Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Log dose</Text>
          </TouchableOpacity>
        </DashboardCard>

        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.habitRow}>
          <HabitCard icon="water-outline" title="Water" value="1.6 / 2.5 L" progress={0.64} />
          <HabitCard icon="nutrition-outline" title="Protein" value="72 / 100 g" progress={0.72} />
        </View>

        <DashboardCard>
          <View style={styles.feelingHeading}>
            <View style={styles.feelingIcon}>
              <Ionicons name="heart-outline" size={22} color={TrackGLPColors.plum} />
            </View>
            <View>
              <Text style={styles.cardTitle}>How are you feeling today?</Text>
              <Text style={styles.cardDetail}>Any side effects?</Text>
            </View>
          </View>
          <View style={styles.optionRow}>
            {sideEffectOptions.map((option, index) => (
              <View key={option} style={[styles.option, index === 0 && styles.optionSelected]}>
                <Text style={[styles.optionText, index === 0 && styles.optionTextSelected]}>{option}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.secondaryButton} accessibilityRole="button">
            <Text style={styles.secondaryButtonText}>Log side effects</Text>
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
          <WeightTrendChart />
          <View style={styles.trendFooter}>
            <Text style={styles.trendValue}>
              ↓ 3.2 kg <Text style={styles.trendPeriod}>· Last 30 days</Text>
            </Text>
            <TouchableOpacity style={styles.linkButton} accessibilityRole="button">
              <Text style={styles.linkText}>View progress</Text>
              <Ionicons name="chevron-forward" size={16} color={TrackGLPColors.plum} />
            </TouchableOpacity>
          </View>
        </DashboardCard>
      </ScrollView>
    </SafeAreaView>
  );
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
});
