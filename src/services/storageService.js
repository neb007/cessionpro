import { supabase } from '@/api/supabaseClient';

// --- Configuration ---
const SIGNED_URL_TTL = {
  Cession: 3600,      // 1 hour for images/logos
  profile: 900,       // 15 min for documents
  dataroom: 900,      // 15 min for dataroom documents
};

// --- In-memory signed URL cache ---
// Map<string, { url: string, expiresAt: number }>
const signedUrlCache = new Map();
const CACHE_MARGIN_MS = 10 * 60 * 1000; // Refresh 10 min before expiry

/**
 * Extract the storage path from either:
 *   - A full public URL: "https://xxx.supabase.co/storage/v1/object/public/Cession/filename.jpg"
 *   - A bare path: "filename.jpg" or "userId/cv/file.pdf"
 * Returns the bare path suitable for createSignedUrl / remove.
 */
export function extractStoragePath(urlOrPath, bucketName) {
  if (!urlOrPath) return null;

  // If it's already a bare path (no "http"), return as-is
  if (!urlOrPath.startsWith('http')) {
    return urlOrPath;
  }

  // Try splitting on "/object/public/<bucket>/"
  const publicMarker = `/object/public/${bucketName}/`;
  const publicIdx = urlOrPath.indexOf(publicMarker);
  if (publicIdx !== -1) {
    return urlOrPath.substring(publicIdx + publicMarker.length);
  }

  // Fallback: try the simpler "/<bucketName>/" marker
  const simpleMarker = `/${bucketName}/`;
  const simpleIdx = urlOrPath.indexOf(simpleMarker);
  if (simpleIdx !== -1) {
    return urlOrPath.substring(simpleIdx + simpleMarker.length);
  }

  // If nothing matched, return as-is (it may already be a path)
  return urlOrPath;
}

/**
 * Check if a URL/path points to Supabase storage (not a local/external image)
 */
export function isSupabaseStorageUrl(urlOrPath) {
  if (!urlOrPath) return false;
  // Local images (sector defaults, partner logos) start with "/"
  if (urlOrPath.startsWith('/images/') || urlOrPath.startsWith('/partner')) return false;
  // External non-Supabase URLs
  if (urlOrPath.startsWith('http') && !urlOrPath.includes('supabase.co/storage')) return false;
  // Bare paths (no http) that aren't local are Supabase storage paths
  if (!urlOrPath.startsWith('http') && !urlOrPath.startsWith('/')) return true;
  // Supabase storage URLs
  if (urlOrPath.includes('supabase.co/storage')) return true;
  return false;
}

/**
 * Get a signed URL for a given storage path and bucket.
 * Uses an in-memory cache to avoid repeated signing.
 */
export async function getSignedUrl(bucketName, pathOrUrl) {
  if (!pathOrUrl) return null;

  // Don't process local/external URLs
  if (!isSupabaseStorageUrl(pathOrUrl)) return pathOrUrl;

  const storagePath = extractStoragePath(pathOrUrl, bucketName);
  if (!storagePath) return null;

  const cacheKey = `${bucketName}:${storagePath}`;
  const cached = signedUrlCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expiresAt > now + CACHE_MARGIN_MS) {
    return cached.url;
  }

  const ttl = SIGNED_URL_TTL[bucketName] || 3600;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(storagePath, ttl);

  if (error || !data?.signedUrl) {
    console.error(`Failed to sign URL for ${bucketName}/${storagePath}:`, error);
    return null;
  }

  signedUrlCache.set(cacheKey, {
    url: data.signedUrl,
    expiresAt: now + ttl * 1000,
  });

  return data.signedUrl;
}

/**
 * Batch-sign multiple URLs for a given bucket.
 */
export async function getSignedUrls(bucketName, pathsOrUrls) {
  if (!pathsOrUrls || pathsOrUrls.length === 0) return [];
  return Promise.all(
    pathsOrUrls.map((p) => getSignedUrl(bucketName, p))
  );
}

/**
 * Clear the signed URL cache (e.g., on logout)
 */
export function clearSignedUrlCache() {
  signedUrlCache.clear();
}
