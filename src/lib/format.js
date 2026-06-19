/**
 * Number / currency formatters.
 * Single source of truth so currency rendering is consistent everywhere.
 */

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const cadWholeFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-CA', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export const formatCurrency = (value) => cadFormatter.format(Number(value) || 0);
export const formatCurrencyWhole = (value) => cadWholeFormatter.format(Number(value) || 0);
export const formatPercent = (value) => percentFormatter.format(Number(value) || 0);

/** Round to 2 decimals using banker-safe arithmetic. */
export const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
