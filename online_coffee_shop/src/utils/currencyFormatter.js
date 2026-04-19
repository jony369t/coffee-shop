/**
 * Currency Formatter for Bangladesh (BDT)
 * Exchange rate: 1 USD = 110 BDT
 */

const USD_TO_BDT = 110;

/**
 * Converts USD amount to BDT
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in BDT
 */
export const convertToBDT = (usdAmount) => {
  return Math.round(usdAmount * USD_TO_BDT);
};

/**
 * Formats number as BDT currency
 * @param {number} amount - Amount in BDT
 * @returns {string} Formatted BDT string (e.g., "550 BDT")
 */
export const formatBDT = (amount) => {
  if (typeof amount !== 'number') return '0 BDT';
  const bdt = Math.round(amount);
  return `${bdt.toLocaleString('en-BD')} BDT`;
};

/**
 * Formats USD amount directly to BDT display
 * @param {number} usdAmount - Amount in USD
 * @returns {string} Formatted BDT string
 */
export const formatUSDToBDT = (usdAmount) => {
  return formatBDT(convertToBDT(usdAmount));
};
