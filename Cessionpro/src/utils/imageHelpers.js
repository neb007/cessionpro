import { getDefaultImageForSector } from '@/constants/defaultImages';

/**
 * Normalize business images array (strings or objects) to a plain array of URLs
 */
export const normalizeImageArray = (images = []) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image) => {
      if (!image) return null;
      if (typeof image === 'string') return image;
      if (typeof image === 'object') {
        return image.url || image.file_url || null;
      }
      return null;
    })
    .filter(Boolean);
};

/**
 * Returns the primary image URL for a business, falling back to the sector default
 */
export const getPrimaryImageUrl = (business, fallbackSector) => {
  const normalizedImages = normalizeImageArray(business?.images);
  if (normalizedImages.length > 0) {
    return normalizedImages[0];
  }
  return getDefaultImageForSector(business?.sector || fallbackSector);
};

/**
 * Returns the business images array normalized and ensures at least a default image
 */
export const getBusinessImageList = (business, fallbackSector) => {
  const normalized = normalizeImageArray(business?.images);

  if (normalized.length === 0) {
    return [getDefaultImageForSector(business?.sector || fallbackSector)];
  }

  return normalized;
};