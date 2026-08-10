import { StyleSheet, Text, View } from 'react-native';

import { TrackGLPColors } from '@/constants/track-glp-theme';

const points = [83, 72, 67, 55, 51, 39, 34, 25];

export function WeightTrendChart() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.startLabel}>92</Text>
      <Text style={styles.endLabel}>84.6</Text>
      <View style={styles.gridTop} />
      <View style={styles.gridMiddle} />
      <View style={styles.gridBottom} />
      <View style={styles.lineWrap}>
        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1];
          const dx = 36;
          const dy = next - point;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={`${point}-${index}`}
              style={[styles.segment, { left: index * dx, top: point, width: length, transform: [{ rotate: `${angle}deg` }] }]}
            />
          );
        })}
        {points.map((point, index) => (
          <View key={`dot-${index}`} style={[styles.dot, { left: index * 36 - 3, top: point - 3 }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 128, marginTop: 14, position: 'relative', overflow: 'hidden' },
  lineWrap: { position: 'absolute', left: 14, right: 10, top: 7, height: 96 },
  segment: { position: 'absolute', height: 3, borderRadius: 2, backgroundColor: TrackGLPColors.purple, transformOrigin: 'left center' },
  dot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: TrackGLPColors.purple, borderWidth: 2, borderColor: '#FFFFFF' },
  gridTop: { position: 'absolute', left: 0, right: 0, top: 20, height: 1, backgroundColor: '#EEE8EF' },
  gridMiddle: { position: 'absolute', left: 0, right: 0, top: 62, height: 1, backgroundColor: '#EEE8EF' },
  gridBottom: { position: 'absolute', left: 0, right: 0, top: 104, height: 1, backgroundColor: '#EEE8EF' },
  startLabel: { position: 'absolute', left: 10, bottom: 0, color: TrackGLPColors.muted, fontSize: 10 },
  endLabel: { position: 'absolute', right: 8, bottom: 0, color: TrackGLPColors.plum, fontSize: 10, fontWeight: '700' },
});
