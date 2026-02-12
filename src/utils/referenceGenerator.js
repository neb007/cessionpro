/**
 * Generate a unique reference number in format REF-XXXX
 * @param {number} sequence - Sequential number to convert to XXXX format
 * @returns {string} Reference in format REF-XXXX
 */
export const generateReference = (sequence) => {
  if (!sequence || sequence < 1) {
    return 'REF-0001';
  }
  
  // Pad the sequence number with zeros to 4 digits
  const paddedNumber = String(sequence).padStart(4, '0');
  return `REF-${paddedNumber}`;
};

/**
 * Generate a unique reference using timestamp and random number
 * @returns {string} Reference in format REF-XXXX
 */
export const generateUniqueReference = () => {
  // Combine timestamp and random number to create unique reference
  const timestamp = Date.now() % 10000; // Get last 4 digits
  const random = Math.floor(Math.random() * 10000);
  const combined = (timestamp + random) % 10000;
  const paddedNumber = String(combined).padStart(4, '0');
  return `REF-${paddedNumber}`;
};

/**
 * Extract sequence number from a reference (e.g., "REF-0042" -> 42)
 * @param {string} reference - Reference string
 * @returns {number} Sequence number
 */
export const extractSequenceFromReference = (reference) => {
  if (!reference || !reference.startsWith('REF-')) {
    return 0;
  }
  
  const number = reference.replace('REF-', '');
  return parseInt(number, 10) || 0;
};
