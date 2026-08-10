import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TrackGLPColors } from '@/constants/track-glp-theme';

const defaultValues = [92, 91.3, 90.8, 89.7, 88.9, 87.4, 86.2, 84.6];

type WeightTrendChartProps = {
  values?: number[];
  height?: number;
  startLabel?: string;
  endLabel?: string;
};

export function WeightTrendChart({
  values = defaultValues,
  height = 128,
  startLabel = '92',
  endLabel = '84.6',
}: WeightTrendChartProps) {
  const [chartWidth, setChartWidth] = useState(252);
  const horizontalPadding = 14;
  const lineWidth = Math.max(chartWidth - horizontalPadding * 2, 1);
  const stepWidth = lineWidth / Math.max(values.length - 1, 1);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = Math.max(maxValue - minValue, 1);
  const plotTop = 16;
  const plotBottom = height - 40;
  const points = values.map((value) => values.length === 1
    ? (plotTop + plotBottom) / 2
    : plotTop + ((maxValue - value) / valueRange) * (plotBottom - plotTop));
  const pointOffset = values.length === 1 ? lineWidth / 2 : 0;

  return (
    <View
      style={[styles.wrap, { height }]}
      onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
    >
      <Text style={styles.startLabel}>{startLabel}</Text>
      <Text style={styles.endLabel}>{endLabel}</Text>
      <View style={[styles.gridLine, { top: plotTop }]} />
      <View style={[styles.gridLine, { top: (plotTop + plotBottom) / 2 }]} />
      <View style={[styles.gridLine, { top: plotBottom }]} />
      <View style={styles.lineWrap}>
        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1];
          const dx = stepWidth;
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
          <View key={`dot-${index}`} style={[styles.dot, { left: pointOffset + index * stepWidth - 3, top: point - 3 }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 128, marginTop: 14, position: 'relative', overflow: 'hidden' },
  lineWrap: { position: 'absolute', left: 14, right: 14, top: 0, bottom: 0 },
  segment: { position: 'absolute', height: 3, borderRadius: 2, backgroundColor: TrackGLPColors.purple, transformOrigin: 'left center' },
  dot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: TrackGLPColors.purple, borderWidth: 2, borderColor: '#FFFFFF' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#EEE8EF' },
  startLabel: { position: 'absolute', left: 10, bottom: 0, color: TrackGLPColors.muted, fontSize: 10 },
  endLabel: { position: 'absolute', right: 8, bottom: 0, color: TrackGLPColors.plum, fontSize: 10, fontWeight: '700' },
});
