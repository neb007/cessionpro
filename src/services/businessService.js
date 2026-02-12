import { supabase } from '@/api/supabaseClient';

/**
 * Business Service
 * Handles all business-related database operations
 */

export const businessService = {
  // Get all businesses
  async listBusinesses(filters = {}, sortBy = 'created_at') {
    try {
      let query = supabase
        .from('businesses')
        .select('*');

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
      if (filters.minPrice && filters.maxPrice) {
        query = query.gte('asking_price', filters.minPrice)
          .lte('asking_price', filters.maxPrice);
      }
      if (filters.searchText) {
        query = query.or(`title.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error listing businesses:', error);
      throw error;
    }
  },

  // Get single business by ID
  async getBusinessById(id) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
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
  async filterBusinesses(filters, sortBy = 'created_at') {
    return this.listBusinesses(filters, sortBy);
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

  // Increment business views
  async incrementViews(id) {
    try {
      const { data: currentBusiness } = await supabase
        .from('businesses')
        .select('views_count')
        .eq('id', id)
        .single();

      const newViewsCount = (currentBusiness?.views_count || 0) + 1;

      const { data, error } = await supabase
        .from('businesses')
        .update({ views_count: newViewsCount })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }
};

export default businessService;
