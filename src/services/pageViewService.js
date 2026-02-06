import { supabase } from '@/api/supabaseClient';

/**
 * Service providing page view tracking with IP-based unique visitor counting
 */

/**
 * Get visitor IP address using a publicly available IP API
 * @returns {Promise<string>} The visitor's IP address
 */
export const getVisitorIP = async () => {
  try {
    // Try using ipify API (most reliable & no API key needed)
    const response = await fetch('https://api.ipify.org?format=json', { timeout: 5000 });
    const data = await response.json();
    return data.ip || null;
  } catch (error) {
    console.warn('Could not fetch IP address:', error);
    return null;
  }
};

/**
 * Record a page view for a business
 * @param {string} businessId - The business ID
 * @param {string} visitorIP - The visitor's IP address (optional)
 * @param {string} creatorEmail - Email of the business creator (to exclude their views)
 * @returns {Promise<boolean>} Whether the view was recorded successfully
 */
export const recordPageView = async (businessId, visitorIP = null, creatorEmail = null) => {
  try {
    // Get IP if not provided
    let ip = visitorIP;
    if (!ip) {
      ip = await getVisitorIP();
    }

    if (!ip) {
      console.warn('Could not record page view: no IP address available');
      return false;
    }

    // Don't record views from business creator
    if (creatorEmail) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === creatorEmail) {
          console.log('Skipping page view recording for business creator');
          return false;
        }
      } catch (e) {
        // Continue if auth check fails
      }
    }

    // Insert page view record (use CURRENT_DATE for daily tracking)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { error } = await supabase.from('page_views').insert({
      business_id: businessId,
      visitor_ip: ip,
      creator_email: creatorEmail,
      viewed_at: today
    });

    if (error) {
      // Silently handle unique constraint violation (same IP viewing same day)
      if (error.code === '23505') {
        console.debug('IP already viewed this business today');
        return false;
      }
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error recording page view:', error);
    return false;
  }
};

/**
 * Get unique view count for a business based on unique visitor IPs
 * @param {string} businessId - The business ID
 * @returns {Promise<number>} Number of unique views
 */
export const getUniqueViewCount = async (businessId) => {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('visitor_ip', { count: 'exact' })
      .eq('business_id', businessId);

    if (error) {
      console.error('Error getting view count:', error);
      return 0;
    }

    // Count unique IPs
    const uniqueIPs = new Set(data.map(view => view.visitor_ip));
    return uniqueIPs.size;
  } catch (error) {
    console.error('Error getting unique view count:', error);
    return 0;
  }
};
