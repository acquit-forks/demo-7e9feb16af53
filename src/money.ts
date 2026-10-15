export type Line = { amount: number };

// ISO 4217 defines a "minor unit" exponent for every currency, which sets the
// number of decimal places its amounts use (USD: 2, KWD: 3, JPY: 0, CLF: 4, ...).
// Intl.NumberFormat carries the full ISO 4217 table, so resolve the digit
// count from the currency code instead of assuming 2.
function minorUnitDigits(currency: string): number {
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    });
    return formatter.resolvedOptions().maximumFractionDigits;
  } catch {
    // Currency code is not a well-formed or known ISO 4217 code, for which no
    // minor unit is defined; fall back to the common 2-decimal layout.
    return 2;
  }
}

export function formatTotal(lines: Line[], currency: string): string {
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  return sum.toFixed(minorUnitDigits(currency));
}
