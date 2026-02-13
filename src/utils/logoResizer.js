/**
 * Logo Resizer Utility
 * Handles logo image resizing, compression, and optimization
 */

/**
 * Resize and optimize a logo image
 * @param {File} file - The image file to resize
 * @param {Object} options - Configuration options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 400)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 400)
 * @param {number} options.quality - Image quality 0-1 (default: 0.9)
 * @returns {Promise<{blob: Blob, width: number, height: number, aspectRatio: number}>}
 */
export async function resizeLogo(file, options = {}) {
  const {
    maxWidth = 300,
    maxHeight = 120,
    quality = 0.9,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const aspectRatio = width / height;

          if (width > maxWidth || height > maxHeight) {
            if (aspectRatio > 1) {
              // Width is larger
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else {
              // Height is larger
              height = maxHeight;
              width = maxHeight * aspectRatio;
            }
          }

          // Create canvas and resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          // Draw image with better quality
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                throw new Error('Failed to create blob from canvas');
              }

              resolve({
                blob,
                width: Math.round(width),
                height: Math.round(height),
                aspectRatio: Number((width / height).toFixed(2)),
                originalWidth: img.width,
                originalHeight: img.height,
                compressionRatio: ((1 - blob.size / file.size) * 100).toFixed(1),
              });
            },
            'image/webp',
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate logo file before processing
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - {valid: boolean, error?: string}
 */
export function validateLogoFile(file, options = {}) {
  const {
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  } = options;

  // Check file size
  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxFileSize / 1024 / 1024}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Create a preview URL for an image file
 * @param {File} file - The image file
 * @returns {string} - Data URL for preview
 */
export function createPreviewUrl(file) {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL to free memory
 * @param {string} url - The preview URL to revoke
 */
export function revokePreviewUrl(url) {
  URL.revokeObjectURL(url);
}

/**
 * Get optimal logo size based on context
 * @param {string} context - 'card' | 'listing' | 'profile' | 'detail'
 * @returns {Object} - {width: number, height: number, className: string}
 */
export function getLogoDimensions(context = 'card') {
  const dimensions = {
    card: {
      width: 96,
      height: 48,
      className: 'w-24 h-12',
    },
    listing: {
      width: 48,
      height: 48,
      className: 'w-12 h-12',
    },
    detail: {
      width: 96,
      height: 48,
      className: 'w-24 h-12',
    },
    profile: {
      width: 96,
      height: 96,
      className: 'w-24 h-24',
    },
  };

  return dimensions[context] || dimensions.card;
}
