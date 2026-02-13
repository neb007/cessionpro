import { supabase } from '@/api/supabaseClient';

/**
 * Message Service
 * Handles all message-related database operations
 */

export const messageService = {
  // Get all messages for a conversation
  async listMessages(conversationId, options = {}) {
    try {
      const { limit = 50, before } = options;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit)
        .lt('created_at', before || new Date().toISOString());

      if (error) throw error;
      return (data || []).reverse();
    } catch (error) {
      console.error('Error listing messages:', error);
      throw error;
    }
  },

  // Get single message by ID
  async getMessageById(id) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  },

  // Send new message
  async sendMessage(messageData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          ...messageData,
          sender_id: user?.id,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Update message
  async updateMessage(id, messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({
          ...messageData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  // Delete message
  async deleteMessage(id) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Get messages by sender
  async getMessagesBySender(senderId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', senderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting sender messages:', error);
      throw error;
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages(conversationId, callback) {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => callback(payload.new)
      )
      .subscribe();

    return subscription;
  }
  ,

  // Subscribe to message updates (read receipts, edits)
  subscribeToMessageUpdates(conversationId, callback) {
    const subscription = supabase
      .channel(`messages:update:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => callback(payload.new)
      )
      .subscribe();

    return subscription;
  }
};

export default messageService;
