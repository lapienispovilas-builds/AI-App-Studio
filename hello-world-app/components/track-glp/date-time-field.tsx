import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import { TrackGLPColors } from '@/constants/track-glp-theme';

type DateTimeFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
};

export function DateTimeField({ value, onChange }: DateTimeFieldProps) {
  const [androidMode, setAndroidMode] = useState<'date' | 'time' | null>(null);

  function handleChange(event: DateTimePickerEvent, nextValue?: Date) {
    if (Platform.OS === 'android') setAndroidMode(null);
    if (event.type !== 'dismissed' && nextValue) onChange(nextValue);
  }

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.iosRow}>
        <DateTimePicker value={value} mode="date" display="compact" onChange={handleChange} />
        <DateTimePicker value={value} mode="time" display="compact" onChange={handleChange} />
      </View>
    );
  }

  return (
    <View style={styles.androidWrap}>
      <View style={styles.androidRow}>
        <PickerButton icon="calendar-outline" label={formatDate(value)} onPress={() => setAndroidMode('date')} />
        <PickerButton icon="time-outline" label={formatTime(value)} onPress={() => setAndroidMode('time')} />
      </View>
      {androidMode && (
        <DateTimePicker value={value} mode={androidMode} display="default" onChange={handleChange} />
      )}
    </View>
  );
}

function PickerButton({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.pickerButton} onPress={onPress} accessibilityRole="button">
      <Ionicons name={icon} size={18} color={TrackGLPColors.plum} />
      <Text style={styles.pickerButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function formatDate(value: Date) {
  return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(value: Date) {
  return value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  iosRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  androidWrap: { gap: 8 },
  androidRow: { flexDirection: 'row', gap: 8 },
  pickerButton: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: TrackGLPColors.card, borderWidth: 1, borderColor: TrackGLPColors.border, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8 },
  pickerButtonText: { color: TrackGLPColors.text, fontSize: 12, fontWeight: '700' },
});
