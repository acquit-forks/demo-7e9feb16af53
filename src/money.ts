export type Line = { amount: number };

// ISO 4217 defines each currency's minor unit exponent (USD: 2, KWD: 3, JPY: 0,
// CLF: 4, ...). ECMA-402 (Intl.NumberFormat) resolves it from the currency code,
// so the digit count comes from the standard instead of a hardcoded value.
function currencyMinorUnitDigits(currency: string): number {
  try {
    const resolved = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
    }).resolvedOptions();
    return resolved.maximumFractionDigits ?? 2;
  } catch {
    // Unknown currency code: fall back to 2 as a generic decimal currency.
    return 2;
  }
}

export function formatTotal(lines: Line[], currency: string): string {
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  const digits = currencyMinorUnitDigits(currency);
  return sum.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}
