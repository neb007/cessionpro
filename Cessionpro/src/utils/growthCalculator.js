/**
 * Calculate growth percentage from financial years data
 * @param {Array} financialYears - Array of financial year objects with revenue/annual_revenue
 * @returns {number} Growth percentage rounded to nearest integer
 */
export function calculateGrowthPercentage(financialYears) {
  if (!financialYears || !Array.isArray(financialYears) || financialYears.length < 2) {
    return 0;
  }

  // Sort by year to ensure proper calculation
  const sorted = [...financialYears].sort((a, b) => {
    const yearA = a.year || a.fiscal_year || 0;
    const yearB = b.year || b.fiscal_year || 0;
    return yearA - yearB;
  });

  // Get first and last year revenues
  const firstYear = sorted[0];
  const lastYear = sorted[sorted.length - 1];

  const firstRevenue = firstYear?.revenue || firstYear?.annual_revenue || 0;
  const lastRevenue = lastYear?.revenue || lastYear?.annual_revenue || 0;

  // Avoid division by zero
  if (firstRevenue === 0 || firstRevenue === null || firstRevenue === undefined) {
    return 0;
  }

  // Calculate percentage growth: ((finalValue - initialValue) / initialValue) * 100
  const growth = ((lastRevenue - firstRevenue) / firstRevenue) * 100;

  // Round to nearest integer
  return Math.round(growth);
}
