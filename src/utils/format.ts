/**
 * Format a number as NPR currency
 * e.g. 24500 → "NPR 24,500"
 */
export function formatCurrency(amount: number): string {
  return `NPR ${amount.toLocaleString('en-US')}`;
}

/**
 * Calculate discount percentage from original and sale prices
 * Returns integer e.g. 22 for 22%
 */
export function calcDiscount(original: number, sale: number): number {
  if (!original || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Truncate text to a given character count
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Slugify a string for URL use
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
