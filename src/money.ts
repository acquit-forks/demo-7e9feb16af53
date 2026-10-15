export type Line = { amount: number };

// ISO 4217 "Codes for the representation of currencies and funds" assigns each
// currency a minor unit (the exponent of its smallest traded unit). It is 2 for
// most codes (USD, EUR, GBP, ...), but the standard explicitly defines:
const ISO_4217_ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG', 'RWF',
  'UGX', 'UYI', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);
const ISO_4217_THREE_DECIMAL = new Set([
  'BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND',
]);
const ISO_4217_FOUR_DECIMAL = new Set([
  'CLF', 'UYW',
]);

export function minorUnitDigits(currency: string): number {
  const code = currency.trim().toUpperCase();
  if (ISO_4217_ZERO_DECIMAL.has(code)) return 0;
  if (ISO_4217_THREE_DECIMAL.has(code)) return 3;
  if (ISO_4217_FOUR_DECIMAL.has(code)) return 4;
  // ISO 4217 defines the minor unit of every remaining listed currency as 2.
  return 2;
}

export function formatTotal(lines: Line[], currency: string): string {
  const digits = minorUnitDigits(currency);
  const scale = 10 ** digits;
  // Sum in integer minor units, rounding each line half-up, so binary
  // floating-point drift (e.g. 0.1 + 0.2) cannot corrupt the total.
  const minorSum = lines.reduce(
    (total, line) => total + Math.round(line.amount * scale),
    0,
  );
  return (minorSum / scale).toFixed(digits);
}
