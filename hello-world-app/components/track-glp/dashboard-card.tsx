import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { TrackGLPColors } from '@/constants/track-glp-theme';

type DashboardCardProps = PropsWithChildren<{ style?: ViewStyle | ViewStyle[] }>;

export function DashboardCard({ children, style }: DashboardCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: TrackGLPColors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: TrackGLPColors.border,
    padding: 16,
    shadowColor: '#321C38',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.055,
    shadowRadius: 16,
    elevation: 2,
  },
});
