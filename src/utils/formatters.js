/**
 * Formats a number as currency (USD)
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  if (!isValidNumber(value)) return '-';
  return parseFloat(value).toFixed(2);
}

/**
 * Formats a number as shares (4 decimal places)
 * @param {number} value
 * @returns {string}
 */
function formatShares(value) {
  if (!isValidNumber(value)) return '-';
  return parseFloat(value).toFixed(4);
}

/**
 * Formats a number as percentage
 * @param {number} value
 * @returns {string}
 */
function formatPercentage(value) {
  if (!isValidNumber(value)) return '-';
  return parseFloat(value).toFixed(2);
}
