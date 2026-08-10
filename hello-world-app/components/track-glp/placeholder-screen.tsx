import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrackGLPColors } from '@/constants/track-glp-theme';

export function PlaceholderScreen({ title, icon }: { title: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.icon}><Ionicons name={icon} size={30} color={TrackGLPColors.plum} /></View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>This area is coming in the next TrackGLP build.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TrackGLPColors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  icon: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: TrackGLPColors.lavender },
  title: { color: TrackGLPColors.text, fontSize: 25, fontWeight: '700', marginTop: 18 },
  message: { color: TrackGLPColors.muted, fontSize: 14, textAlign: 'center', marginTop: 8 },
});
