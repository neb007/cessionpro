import { supabase } from '@/api/supabaseClient';

/**
 * Conversation Service
 * Handles all conversation-related database operations
 */

export const conversationService = {
  _normalizeUserIdArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch (error) {
        return [];
      }
    }
    return [];
  },
  // Get all conversations for current user
  async listConversations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*, messages(count)')
        .or(`participant_1_id.eq.${user?.id},participant_2_id.eq.${user?.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((conversation) => ({
        ...conversation,
        archived_by: this._normalizeUserIdArray(conversation.archived_by),
        blocked_by: this._normalizeUserIdArray(conversation.blocked_by)
      }));
    } catch (error) {
      console.error('Error listing conversations:', error);
      throw error;
    }
  },

  // Subscribe to all conversations for a user
  subscribeToUserConversations(userId, callback) {
    const subscription = supabase
      .channel(`conversations:user:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant_1_id=eq.${userId}`
        },
        (payload) => callback(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant_2_id=eq.${userId}`
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return subscription;
  },

  // Get single conversation by ID
  async getConversationById(id) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, messages(count)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        archived_by: this._normalizeUserIdArray(data.archived_by),
        blocked_by: this._normalizeUserIdArray(data.blocked_by)
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  },

  // Create new conversation
  async createConversation(conversationData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('conversations')
        .insert([{
          ...conversationData,
          participant_1_id: user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Update conversation
  async updateConversation(id, conversationData) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({
          ...conversationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  // Delete conversation
  async deleteConversation(id) {
    try {
      // First delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', id);

      if (messagesError) throw messagesError;

      // Then delete the conversation
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  // Get or create conversation between two users
  async getOrCreateConversation(otherUserId, businessId = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if conversation already exists
      const { data: existingConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_1_id.eq.${user?.id},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${user?.id})`)
        .single();

      if (!fetchError && existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      return this.createConversation({
        participant_2_id: otherUserId,
        business_id: businessId,
        subject: `Conversation about business`
      });
    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      throw error;
    }
  },

  // Filter conversations
  async filterConversations(filters = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('conversations')
        .select('*')
        .or(`participant_1_id.eq.${user?.id},participant_2_id.eq.${user?.id}`);

      if (filters.businessId) {
        query = query.eq('business_id', filters.businessId);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error filtering conversations:', error);
      throw error;
    }
  },

  // Subscribe to conversation updates
  subscribeToConversation(conversationId, callback) {
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return subscription;
  }
};

export default conversationService;
