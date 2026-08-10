import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrackGLPColors } from '@/constants/track-glp-theme';
import { useAppData } from '@/context/app-data-context';

export default function DevelopmentDataScreen() {
  const { data, resetAppData } = useAppData();

  if (!__DEV__) return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Development data</Text>
        <Text style={styles.note}>This screen is included only in development builds.</Text>
        <Text selectable style={styles.data}>{JSON.stringify(data, null, 2)}</Text>
        <TouchableOpacity style={styles.button} onPress={resetAppData}>
          <Text style={styles.buttonText}>Reset onboarding data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TrackGLPColors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: TrackGLPColors.text, fontSize: 28, fontWeight: '800' },
  note: { color: TrackGLPColors.muted, fontSize: 12, marginTop: 5, marginBottom: 18 },
  data: { color: TrackGLPColors.text, fontSize: 11, lineHeight: 17, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 18, padding: 16 },
  button: { backgroundColor: TrackGLPColors.plum, borderRadius: 16, alignItems: 'center', padding: 16, marginTop: 18 },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
