/**
 * Format a number as currency string.
 * @param {number} amount
 * @param {string} [currency='INR']
 * @param {string} [locale='en-IN']
 */
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a compact currency (e.g. ₹24.6K)
 */
export const formatCompactCurrency = (amount, currency = 'INR') => {
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount, currency);
};

/**
 * Format a date string into a human-readable date.
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a trend percentage with sign.
 */
export const formatTrend = (value) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};
