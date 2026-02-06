import { supabase } from '@/api/supabaseClient';

/**
 * Lead Service
 * Handles all lead-related database operations
 */

export const leadService = {
  // Get all leads
  async listLeads(filters = {}, sortBy = 'created_at') {
    try {
      let query = supabase
        .from('leads')
        .select('*, business:business_id(*)');

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.businessId) {
        query = query.eq('business_id', filters.businessId);
      }
      if (filters.buyerId) {
        query = query.eq('buyer_id', filters.buyerId);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error listing leads:', error);
      throw error;
    }
  },

  // Get single lead by ID
  async getLeadById(id) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, business:business_id(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting lead:', error);
      throw error;
    }
  },

  // Create new lead
  async createLead(leadData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          ...leadData,
          buyer_id: user?.id,
          status: leadData.status || 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  // Update lead
  async updateLead(id, leadData) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...leadData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  // Delete lead
  async deleteLead(id) {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  // Filter leads
  async filterLeads(filters, sortBy = 'created_at') {
    return this.listLeads(filters, sortBy);
  },

  // Get leads for a buyer
  async getLeadsByBuyer(buyerId) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, business:business_id(*)')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting buyer leads:', error);
      throw error;
    }
  },

  // Get leads for a business
  async getLeadsByBusiness(businessId) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting business leads:', error);
      throw error;
    }
  }
};

export default leadService;
