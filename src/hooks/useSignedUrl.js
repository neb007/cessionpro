import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getSignedUrl, isSupabaseStorageUrl } from '@/services/storageService';

/**
 * React hook that resolves a storage path/URL into a signed URL.
 * For unauthenticated users, returns `placeholder` instead.
 *
 * @param {string} bucketName - 'Cession' | 'profile' | 'dataroom'
 * @param {string|null} pathOrUrl - The stored path or legacy public URL
 * @param {string|null} placeholder - Fallback for guests or errors
 * @returns {{ signedUrl: string|null, loading: boolean }}
 */
export function useSignedUrl(bucketName, pathOrUrl, placeholder = null) {
  const { isAuthenticated } = useAuth();
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      // If no path, return placeholder
      if (!pathOrUrl) {
        setSignedUrl(placeholder);
        setLoading(false);
        return;
      }

      // If it's not a Supabase URL (local sector default, external), pass through
      if (!isSupabaseStorageUrl(pathOrUrl)) {
        setSignedUrl(pathOrUrl);
        setLoading(false);
        return;
      }

      // If user is not authenticated, return placeholder
      if (!isAuthenticated) {
        setSignedUrl(placeholder);
        setLoading(false);
        return;
      }

      try {
        const url = await getSignedUrl(bucketName, pathOrUrl);
        if (!cancelled) {
          setSignedUrl(url || placeholder);
        }
      } catch {
        if (!cancelled) {
          setSignedUrl(placeholder);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    resolve();

    return () => { cancelled = true; };
  }, [bucketName, pathOrUrl, placeholder, isAuthenticated]);

  return { signedUrl, loading };
}
