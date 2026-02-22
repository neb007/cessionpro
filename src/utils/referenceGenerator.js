import { supabase } from '@/api/supabaseClient';

export const REFERENCE_START_SEQUENCE = 2164;
export const REFERENCE_PREFIX = 'RIV-';

/**
 * Generate a unique reference number in format RIV-XXXX
 * @param {number} sequence - Sequential number to convert to XXXX format
 * @returns {string} Reference in format RIV-XXXX
 */
export const generateReference = (sequence) => {
  if (!sequence || sequence < 1) {
    return `${REFERENCE_PREFIX}${REFERENCE_START_SEQUENCE}`;
  }

  return `${REFERENCE_PREFIX}${String(sequence)}`;
};

/**
 * Generate the next unique reference from existing businesses
 * @returns {Promise<string>} Reference in format RIV-XXXX
 */
export const generateUniqueReference = async () => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('reference_number')
      .like('reference_number', `${REFERENCE_PREFIX}%`);

    if (error) {
      throw error;
    }

    let maxSequence = REFERENCE_START_SEQUENCE - 1;
    for (const item of data || []) {
      const sequence = extractSequenceFromReference(item?.reference_number);
      if (sequence > maxSequence) {
        maxSequence = sequence;
      }
    }

    return generateReference(Math.max(REFERENCE_START_SEQUENCE, maxSequence + 1));
  } catch {
    return generateReference(REFERENCE_START_SEQUENCE);
  }
};

/**
 * Extract sequence number from a reference (e.g., "RIV-0042" -> 42)
 * @param {string} reference - Reference string
 * @returns {number} Sequence number
 */
export const extractSequenceFromReference = (reference) => {
  if (!reference || !reference.startsWith(REFERENCE_PREFIX)) {
    return 0;
  }

  const number = reference.replace(REFERENCE_PREFIX, '');
  return parseInt(number, 10) || 0;
};
