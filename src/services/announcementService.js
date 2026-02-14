import { supabase } from '@/api/supabaseClient';

/**
 * Announcement Service
 * Handles all announcement-related database operations
 */

export const announcementService = {
  async fetchSellerProfiles(sellerIds = []) {
    if (!sellerIds.length) {
      return { data: [] };
    }

    return supabase
      .from('profiles')
      .select('id, company_name, full_name, first_name, last_name')
      .in('id', sellerIds);
  },
  async listAdminAnnouncements(filters = {}) {
    try {
      let query = supabase
        .from('businesses')
        .select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.sourceType) {
        query = query.eq('source_type', filters.sourceType);
      }

      if (filters.searchText) {
        query = query.ilike('title', `%${filters.searchText}%`);
      }

      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error listing admin announcements:', error);
      throw error;
    }
  },

  async approveAnnouncement(id) {
    return this.updateAnnouncement(id, {
      status: 'active',
      rejected_reason: null,
      updated_at: new Date().toISOString()
    });
  },

  async rejectAnnouncement(id, reason) {
    return this.updateAnnouncement(id, {
      status: 'rejected',
      rejected_reason: reason,
      updated_at: new Date().toISOString()
    });
  },

  async disableAnnouncement(id) {
    return this.updateAnnouncement(id, {
      status: 'withdrawn',
      updated_at: new Date().toISOString()
    });
  },

  async toggleCertification(id, isCertified) {
    return this.updateAnnouncement(id, {
      is_certified: isCertified,
      updated_at: new Date().toISOString()
    });
  },
  // Get all announcements
  async listAnnouncements(filters = {}, sortBy = 'created_at') {
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
      console.error('Error listing announcements:', error);
      throw error;
    }
  },

  // Get single announcement by ID
  async getAnnouncementById(id) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting announcement:', error);
      throw error;
    }
  },

  // Create new announcement
  async createAnnouncement(announcementData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          ...announcementData,
          seller_id: user?.id,
          status: announcementData.status || 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  // Update announcement
  async updateAnnouncement(id, announcementData) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...announcementData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  // Delete announcement
  async deleteAnnouncement(id) {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },

  // Filter announcements by criteria
  async filterAnnouncements(filters, sortBy = 'created_at') {
    return this.listAnnouncements(filters, sortBy);
  },

  // Get announcements by creator ID
  async getAnnouncementsByCreator(creatorId) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('seller_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting creator announcements:', error);
      throw error;
    }
  },

  // Increment announcement views
  async incrementViews(id) {
    try {
      const { data: currentAnnouncement } = await supabase
        .from('businesses')
        .select('views_count')
        .eq('id', id)
        .single();

      const newViewsCount = (currentAnnouncement?.views_count || 0) + 1;

      const { data, error } = await supabase
        .from('businesses')
        .update({ views_count: newViewsCount })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error incrementing announcement views:', error);
      throw error;
    }
  }
};

export default announcementService;
