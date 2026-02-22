import { supabase } from '@/api/supabaseClient';

const isSchemaGapError = (error) => {
  const code = String(error?.code || '');
  const message = String(error?.message || '').toLowerCase();
  const details = String(error?.details || '').toLowerCase();
  const status = Number(error?.status || 0);

  return (
    status === 404 ||
    code === '42P01' ||
    code === '42703' ||
    code.startsWith('PGRST2') ||
    message.includes('does not exist') ||
    message.includes('could not find the table') ||
    message.includes('relation') ||
    message.includes('schema cache') ||
    details.includes('schema cache')
  );
};

export const sponsorshipService = {
  async getActiveSponsorships({ businessIds = null } = {}) {
    let query = supabase
      .from('business_sponsorships')
      .select('id, business_id, user_id, display_label, status, starts_at, ends_at, updated_at')
      .eq('status', 'active')
      .gt('ends_at', new Date().toISOString())
      .order('updated_at', { ascending: false });

    if (Array.isArray(businessIds) && businessIds.length > 0) {
      query = query.in('business_id', businessIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getMySponsorships(userId) {
    const { data: authData } = await supabase.auth.getUser();
    const effectiveUserId = userId || authData?.user?.id;
    if (!effectiveUserId) return [];

    const { data, error } = await supabase
      .from('business_sponsorships')
      .select('id, business_id, display_label, status, starts_at, ends_at, updated_at')
      .eq('user_id', effectiveUserId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMyFeaturedKpi(userId) {
    const { data: authData } = await supabase.auth.getUser();
    const effectiveUserId = userId || authData?.user?.id;
    if (!effectiveUserId) {
      return {
        activeFeaturedCount: 0,
        activations: 0
      };
    }

    const nowIso = new Date().toISOString();

    const [{ count: activeFeaturedCount, error: featuredError }, { count: activations, error: activationsError }] =
      await Promise.all([
        supabase
          .from('business_sponsorships')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', effectiveUserId)
          .eq('status', 'active')
          .gt('ends_at', nowIso),
        supabase
          .from('billing_usage_logs')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', effectiveUserId)
          .in('usage_type', ['sponsored_listing_activation', 'sponsored_listing_days_consumed'])
      ]);

    if (featuredError) {
      if (isSchemaGapError(featuredError)) {
        return {
          activeFeaturedCount: 0,
          activations: 0
        };
      }
      throw featuredError;
    }
    if (activationsError && !isSchemaGapError(activationsError)) throw activationsError;

    return {
      activeFeaturedCount: Number(activeFeaturedCount || 0),
      activations: isSchemaGapError(activationsError) ? 0 : Number(activations || 0)
    };
  },

  async getMyAvailableSponsoredSlots(userId) {
    const { data: authData } = await supabase.auth.getUser();
    const effectiveUserId = userId || authData?.user?.id;
    if (!effectiveUserId) return 0;

    const nowIso = new Date().toISOString();

    const { data: entitlements, error: entitlementsError } = await supabase
      .from('billing_entitlements')
      .select('id, entitlement_type, quantity_remaining')
      .eq('user_id', effectiveUserId)
      .eq('product_code', 'sponsored_listing')
      .eq('status', 'active')
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`);

    if (entitlementsError) {
      if (isSchemaGapError(entitlementsError)) return 0;
      throw entitlementsError;
    }

    const sponsoredDaysAvailable = (entitlements || [])
      .filter((item) => item?.entitlement_type === 'credits')
      .reduce((acc, item) => acc + Math.max(0, Number(item?.quantity_remaining || 0)), 0);

    if (sponsoredDaysAvailable > 0) {
      return sponsoredDaysAvailable;
    }

    const entitlementIds = (entitlements || []).map((item) => item.id).filter(Boolean);
    if (entitlementIds.length === 0) return 0;

    const { data: usages, error: usageError } = await supabase
      .from('billing_usage_logs')
      .select('entitlement_id')
      .eq('usage_type', 'sponsored_listing_activation')
      .in('entitlement_id', entitlementIds);

    if (usageError) {
      if (isSchemaGapError(usageError)) {
        return entitlementIds.length;
      }
      throw usageError;
    }

    const usedSet = new Set((usages || []).map((item) => item.entitlement_id).filter(Boolean));
    return entitlementIds.reduce((acc, id) => (usedSet.has(id) ? acc : acc + 1), 0);
  },

  async activateSponsoredListing(businessId) {
    return this.activateSponsoredListingForDays(businessId, 30);
  },

  async activateSponsoredListingForDays(businessId, days = 1) {
    const requestedDays = Math.max(1, Math.min(Number(days || 1), 365));

    let { data, error } = await supabase.rpc('activate_sponsored_listing', {
      p_business_id: businessId,
      p_days: requestedDays
    });

    const shouldFallbackToLegacySignature =
      error &&
      (String(error?.code || '') === 'PGRST202' ||
        String(error?.message || '').toLowerCase().includes('function') ||
        String(error?.message || '').toLowerCase().includes('p_days'));

    if (shouldFallbackToLegacySignature) {
      const legacyCall = await supabase.rpc('activate_sponsored_listing', {
        p_business_id: businessId
      });
      data = legacyCall.data;
      error = legacyCall.error;
    }

    if (error) {
      if (String(error?.message || '').includes('BILLING_RUNTIME_UNAVAILABLE')) {
        throw new Error('BILLING_RUNTIME_UNAVAILABLE');
      }
      throw new Error(error.message || 'Impossible d’activer la mise à la une');
    }

    const row = Array.isArray(data) ? data[0] : data;
    return row || null;
  },

  async deactivateSponsoredListing(businessId) {
    const { data, error } = await supabase.rpc('deactivate_sponsored_listing', {
      p_business_id: businessId
    });

    if (error) {
      const message = String(error?.message || '');
      const lower = message.toLowerCase();
      if (
        message.includes('BILLING_RUNTIME_UNAVAILABLE') ||
        String(error?.code || '') === 'PGRST202' ||
        lower.includes('function')
      ) {
        throw new Error('BILLING_RUNTIME_UNAVAILABLE');
      }
      throw new Error(error.message || 'Impossible de désactiver la mise à la une');
    }

    const row = Array.isArray(data) ? data[0] : data;
    return row || null;
  }
};

export default sponsorshipService;
