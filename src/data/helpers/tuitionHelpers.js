/**
 * Tuition Helper Functions
 * Utilities for formatting and categorizing tuition data
 */

/**
 * Get tuition range bracket for filtering
 * @param {number} amount - Tuition amount in dollars
 * @returns {string|null} Range bracket string
 */
export const getTuitionRange = (amount) => {
  if (!amount || amount <= 0) return null;
  if (amount < 100000) return '<$100,000';
  if (amount < 150000) return '$100,000-$150,000';
  if (amount < 200000) return '$150,000-$200,000';
  return '>$200,000';
};

/**
 * Format currency for display
 * @param {number} amount - Amount in dollars
 * @param {boolean} includeDecimals - Whether to include cents
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, includeDecimals = false) => {
  if (amount === null || amount === undefined) return 'N/A';

  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  };

  return new Intl.NumberFormat('en-US', options).format(amount);
};

/**
 * Format tuition as compact string (e.g., "$150K")
 * @param {number} amount - Amount in dollars
 * @returns {string} Compact formatted string
 */
export const formatTuitionCompact = (amount) => {
  if (amount === null || amount === undefined) return 'N/A';
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}K`;
  }
  return formatCurrency(amount);
};

/**
 * Get tuition display text with range
 * @param {number} inState - In-state tuition
 * @param {number} outOfState - Out-of-state tuition
 * @returns {string} Display text
 */
export const getTuitionDisplay = (inState, outOfState) => {
  if (!inState && !outOfState) return 'Contact school';

  if (inState === outOfState || !outOfState) {
    return formatCurrency(inState || outOfState);
  }

  return `${formatCurrency(inState)} - ${formatCurrency(outOfState)}`;
};

/**
 * All tuition range options for filtering
 */
export const TUITION_RANGES = [
  { value: 'under100k', label: 'Under $100,000', min: 0, max: 99999 },
  { value: '100k-150k', label: '$100,000 - $150,000', min: 100000, max: 149999 },
  { value: '150k-200k', label: '$150,000 - $200,000', min: 150000, max: 199999 },
  { value: 'over200k', label: 'Over $200,000', min: 200000, max: Infinity },
];

/**
 * Check if tuition falls within a range
 * @param {number} tuition - Tuition amount
 * @param {string} rangeValue - Range value from TUITION_RANGES
 * @returns {boolean} Whether tuition is in range
 */
export const isTuitionInRange = (tuition, rangeValue) => {
  if (!tuition) return false;
  const range = TUITION_RANGES.find(r => r.value === rangeValue);
  if (!range) return false;
  return tuition >= range.min && tuition <= range.max;
};

/**
 * Calculate monthly payment estimate
 * @param {number} totalTuition - Total program cost
 * @param {number} months - Program length in months
 * @returns {number} Monthly payment
 */
export const calculateMonthlyPayment = (totalTuition, months) => {
  if (!totalTuition || !months) return null;
  return Math.round(totalTuition / months);
};

export default {
  getTuitionRange,
  formatCurrency,
  formatTuitionCompact,
  getTuitionDisplay,
  TUITION_RANGES,
  isTuitionInRange,
  calculateMonthlyPayment,
};
