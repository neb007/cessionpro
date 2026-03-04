import { supabase } from '@/api/supabaseClient';

/**
 * Business Service
 * Handles all business-related database operations
 */

export const businessService = {
  _isAbortError(error) {
    const msg = (error?.message || '').toLowerCase();
    return (
      error?.name === 'AbortError' ||
      msg.includes('signal is aborted') ||
      msg.includes('aborted without reason') ||
      msg.includes('the operation was aborted')
    );
  },

  async _withAbortRetry(queryFactory, retries = 2) {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await queryFactory();
      } catch (error) {
        lastError = error;
        if (!this._isAbortError(error) || attempt === retries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }
    throw lastError;
  },

  _formatError(error, fallback = 'Une erreur est survenue') {
    const code = error?.code ? ` [${error.code}]` : '';
    const details = error?.details ? ` — ${error.details}` : '';
    return `${error?.message || fallback}${code}${details}`;
  },

  // Get all businesses
  async listBusinesses(filters = {}, sortBy = 'created_at', options = {}) {
    try {
      const { data, error } = await this._withAbortRetry(async () => {
        let query = supabase
          .from('businesses')
          .select(options.columns || '*');

        // Apply filters
        if (filters.sector) {
          query = query.eq('sector', filters.sector);
        }
        if (filters.country) {
          query = query.eq('country', filters.country);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        if (filters.minPrice && filters.maxPrice) {
          query = query.gte('asking_price', filters.minPrice)
            .lte('asking_price', filters.maxPrice);
        }
        if (filters.searchText) {
          query = query.or(`title.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%`);
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: false });
        if (options.limit && typeof options.offset === 'number') {
          query = query.range(options.offset, options.offset + options.limit - 1);
        } else if (options.limit) {
          query = query.limit(options.limit);
        }

        return query;
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      if (this._isAbortError(error)) {
        console.warn('Businesses query aborted after retries, returning empty list.');
        return [];
      }
      console.error('Error listing businesses:', error);
      throw new Error(this._formatError(error, 'Impossible de charger les annonces'));
    }
  },

  // Count businesses (lightweight)
  async countBusinesses(filters = {}) {
    try {
      const { count, error } = await this._withAbortRetry(async () => {
        let query = supabase
          .from('businesses')
          .select('id', { count: 'exact', head: true });

        if (filters.sector) {
          query = query.eq('sector', filters.sector);
        }
        if (filters.country) {
          query = query.eq('country', filters.country);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.minPrice && filters.maxPrice) {
          query = query.gte('asking_price', filters.minPrice)
            .lte('asking_price', filters.maxPrice);
        }
        if (filters.searchText) {
          query = query.or(`title.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%`);
        }

        return query;
      });
      if (error) throw error;

      return count || 0;
    } catch (error) {
      if (this._isAbortError(error)) {
        console.warn('Businesses count query aborted after retries, returning 0.');
        return 0;
      }
      console.error('Error counting businesses:', error);
      throw new Error(this._formatError(error, 'Impossible de compter les annonces'));
    }
  },

  // Get single business by ID
  async getBusinessById(id) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return data;
    } catch (error) {
      console.error('Error getting business:', error);
      throw error;
    }
  },

  // Create new business
  async createBusiness(businessData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          ...businessData,
          seller_id: user?.id,
          status: businessData.status || 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  },

  // Update business
  async updateBusiness(id, businessData) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...businessData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  },

  // Delete business
  async deleteBusiness(id) {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  },

  // Filter businesses by criteria
  async filterBusinesses(filters, sortBy = 'created_at', options = {}) {
    return this.listBusinesses(filters, sortBy, options);
  },

  // Get businesses by seller ID
  async getBusinessesBySeller(sellerId) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting seller businesses:', error);
      throw error;
    }
  },

  // Increment business views (uses RPC to bypass RLS)
  async incrementViews(id) {
    try {
      const { error } = await supabase.rpc('increment_business_views', {
        p_business_id: id
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }
};

export default businessService;
