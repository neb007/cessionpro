import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getSignedUrl, isSupabaseStorageUrl } from '@/services/storageService';

/**
 * Resolves an array of image paths/URLs into signed URLs.
 * For guests, replaces all Supabase URLs with the sector placeholder.
 *
 * @param {string[]} images - Array of stored paths or legacy public URLs
 * @param {string} placeholder - Fallback image for guests
 * @returns {{ signedImages: string[], loading: boolean }}
 */
export function useSignedImageList(images, placeholder) {
  const { isAuthenticated } = useAuth();
  const [signedImages, setSignedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function resolveAll() {
      if (!images || images.length === 0) {
        setSignedImages(placeholder ? [placeholder] : []);
        setLoading(false);
        return;
      }

      if (!isAuthenticated) {
        // Guest: replace Supabase images with placeholder, keep locals
        const result = images.map((img) =>
          isSupabaseStorageUrl(img) ? placeholder : img
        );
        setSignedImages(result.filter(Boolean));
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          images.map(async (img) => {
            if (!isSupabaseStorageUrl(img)) return img;
            const signed = await getSignedUrl('Cession', img);
            return signed || placeholder;
          })
        );
        if (!cancelled) {
          setSignedImages(results.filter(Boolean));
        }
      } catch {
        if (!cancelled) {
          setSignedImages(placeholder ? [placeholder] : []);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    resolveAll();

    return () => { cancelled = true; };
  }, [JSON.stringify(images), placeholder, isAuthenticated]);

  return { signedImages, loading };
}
