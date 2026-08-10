import { StyleSheet, View } from 'react-native';

import { TrackGLPColors } from '@/constants/track-glp-theme';

export function ProgressBar({ progress, light = false }: { progress: number; light?: boolean }) {
  const width = `${Math.max(0, Math.min(progress, 1)) * 100}%` as `${number}%`;

  return (
    <View style={[styles.track, light && styles.trackLight]}>
      <View style={[styles.fill, light && styles.fillLight, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 7, borderRadius: 4, backgroundColor: '#ECE6EE', overflow: 'hidden' },
  trackLight: { backgroundColor: '#6B4A72' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: TrackGLPColors.purple },
  fillLight: { backgroundColor: '#DAB7E2' },
});
