const DECIMAL_DOSE_PATTERN = /^\d+(?:[.,]\d+)?$/;

export function normalizeDoseInput(value: string): string {
  return value.trim().replace(',', '.');
}

export function parseDoseInput(value: string): number | null {
  const normalized = normalizeDoseInput(value);
  if (!DECIMAL_DOSE_PATTERN.test(normalized)) return null;

  const dose = Number(normalized);
  return Number.isFinite(dose) && dose > 0 ? dose : null;
}

export function formatDose(amount: number, unit = 'mg'): string {
  if (!Number.isFinite(amount) || amount <= 0) return `0 ${unit}`;
  return `${Number.isInteger(amount) ? amount.toFixed(1) : String(amount)} ${unit}`;
}
