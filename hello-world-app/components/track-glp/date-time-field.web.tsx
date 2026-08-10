import type { CSSProperties, ChangeEvent } from 'react';
import { StyleSheet, View } from 'react-native';

import { TrackGLPColors } from '@/constants/track-glp-theme';

type DateTimeFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
  mode?: 'dateTime' | 'time';
};

export function DateTimeField({ value, onChange, mode = 'dateTime' }: DateTimeFieldProps) {
  function updateDate(event: ChangeEvent<HTMLInputElement>) {
    const [year, month, day] = event.target.value.split('-').map(Number);
    const nextValue = new Date(value);
    nextValue.setFullYear(year, month - 1, day);
    onChange(nextValue);
  }

  function updateTime(event: ChangeEvent<HTMLInputElement>) {
    const [hours, minutes] = event.target.value.split(':').map(Number);
    const nextValue = new Date(value);
    nextValue.setHours(hours, minutes, 0, 0);
    onChange(nextValue);
  }

  return (
    <View style={styles.row}>
      {mode === 'dateTime' && <input type="date" value={toDateInput(value)} onChange={updateDate} style={inputStyle} aria-label="Symptom date" />}
      <input type="time" value={toTimeInput(value)} onChange={updateTime} style={inputStyle} aria-label={mode === 'time' ? 'Reminder time' : 'Symptom time'} />
    </View>
  );
}

function toDateInput(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toTimeInput(value: Date) {
  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
}

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  boxSizing: 'border-box',
  border: `1px solid ${TrackGLPColors.border}`,
  borderRadius: 14,
  background: TrackGLPColors.card,
  color: TrackGLPColors.text,
  fontFamily: 'system-ui, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  padding: '12px 10px',
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
});
