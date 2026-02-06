import { supabase } from '@/api/supabaseClient';

/**
 * Favorite Service
 * Handles all favorite/bookmark-related database operations
 */

export const favoriteService = {
  // Get all favorites for current user
  async listFavorites() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('favorites')
        .select('*, business:business_id(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error listing favorites:', error);
      throw error;
    }
  },

  // Get single favorite by ID
  async getFavoriteById(id) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, business:business_id(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting favorite:', error);
      throw error;
    }
  },

  // Check if a business is favorited
  async isFavorited(businessId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user?.id)
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking if favorited:', error);
      throw error;
    }
  },

  // Add business to favorites
  async addFavorite(businessId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if already favorited
      const isFav = await this.isFavorited(businessId);
      if (isFav) {
        throw new Error('Business is already in favorites');
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert([{
          user_id: user?.id,
          business_id: businessId,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  // Remove business from favorites
  async removeFavorite(businessId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('business_id', businessId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  // Toggle favorite status
  async toggleFavorite(businessId) {
    try {
      const isFav = await this.isFavorited(businessId);
      
      if (isFav) {
        return this.removeFavorite(businessId);
      } else {
        return this.addFavorite(businessId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // Delete favorite by ID
  async deleteFavorite(id) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting favorite:', error);
      throw error;
    }
  },

  // Get count of favorites for a business
  async getFavoriteCount(businessId) {
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('id', { count: 'exact' })
        .eq('business_id', businessId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting favorite count:', error);
      throw error;
    }
  }
};

export default favoriteService;
