import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { billingService } from '@/services/billingService';

/**
 * Hook to check if the current user has an active SmartMatching subscription.
 * Calls billingService once and caches the result for the session.
 * @returns {{ hasAccess: boolean | null, loading: boolean }}
 */
export function useSmartMatchingAccess() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const checkAccess = async () => {
      try {
        const data = await billingService.getMyActiveServices(10);
        if (cancelled) return;

        const activeFeatureCodes = new Set(
          (data?.entitlements || [])
            .filter((item) => item?.entitlement_type === 'feature' && item?.status === 'active')
            .map((item) => item.product_code)
        );

        setHasAccess(activeFeatureCodes.has('smart_matching'));
      } catch {
        if (!cancelled) setHasAccess(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { hasAccess, loading };
}
