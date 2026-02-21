/**
 * Email Notification Service
 * Handles sending email notifications via Supabase Edge Functions (Resend)
 */

import { supabase } from '@/api/supabaseClient';

class EmailNotificationService {
  /**
   * Send message notification email
   * @param {Object} data - Notification data
   */
  async sendMessageNotification(data) {
    try {
      const {
        recipientId,
        senderName,
        messagePreview,
        conversationId,
        sourceId,
        idempotencyKey,
        language = 'fr'
      } = data;

      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'message',
          recipientId,
          conversationId,
          senderName,
          messagePreview,
          sourceId: sourceId || conversationId,
          idempotencyKey,
          language
        }
      });

      if (error) {
        throw new Error(`Email notification failed: ${error.message}`);
      }

      console.log('[Email] Message notification sent to:', recipientId);
      return response;
    } catch (error) {
      console.error('[Email] Error sending notification:', error);
      // Don't throw - email notifications are non-critical
    }
  }

  /**
   * Send deal stage update notification
   */
  async sendDealStageNotification(data) {
    try {
      const { recipientId, dealStage, sourceId, idempotencyKey, language = 'fr' } = data;
      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'deal_stage_update',
          recipientId,
          dealStage,
          sourceId,
          idempotencyKey,
          language
        }
      });
      if (error) {
        throw new Error(`Deal stage notification failed: ${error.message}`);
      }
      console.log('[Email] Deal stage notification sent');
      return response;
    } catch (error) {
      console.error('[Email] Error sending deal stage notification:', error);
    }
  }

  /**
   * Send document shared notification
   */
  async sendDocumentSharedNotification(data) {
    try {
      const { recipientId, senderName, documentName, sourceId, idempotencyKey, language = 'fr' } = data;
      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'document_shared',
          recipientId,
          senderName,
          documentName,
          sourceId,
          idempotencyKey,
          language
        }
      });
      if (error) {
        throw new Error(`Document notification failed: ${error.message}`);
      }
      console.log('[Email] Document notification sent');
      return response;
    } catch (error) {
      console.error('[Email] Error sending document notification:', error);
    }
  }

  /**
   * Send NDA signed notification
   */
  async sendNDASignedNotification(data) {
    try {
      const { recipientId, signerName, sourceId, idempotencyKey, language = 'fr' } = data;
      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'nda_signed',
          recipientId,
          signerName,
          sourceId,
          idempotencyKey,
          language
        }
      });
      if (error) {
        throw new Error(`NDA notification failed: ${error.message}`);
      }
      console.log('[Email] NDA notification sent');
      return response;
    } catch (error) {
      console.error('[Email] Error sending NDA notification:', error);
    }
  }

  /**
   * Send listing published notification
   */
  async sendListingPublished({ listingId, recipientId, sourceId, idempotencyKey, language = 'fr' }) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'listing_published',
          listingId,
          recipientId,
          sourceId: sourceId || listingId,
          idempotencyKey,
          language
        }
      });

      if (error) {
        throw new Error(`Listing published notification failed: ${error.message}`);
      }

      console.log('[Email] Listing published notification sent');
      return data;
    } catch (error) {
      console.error('[Email] Error sending listing published notification:', error);
    }
  }

  /**
   * Trigger smart match notification for a listing
   */
  async sendSmartMatchNotification({ listingId, idempotencyKey, language = 'fr' }) {
    try {
      const { data, error } = await supabase.functions.invoke('smartmatch-notify', {
        body: { listingId, idempotencyKey, language }
      });

      if (error) {
        throw new Error(`Smart match notification failed: ${error.message}`);
      }

      console.log('[Email] Smart match notification triggered');
      return data;
    } catch (error) {
      console.error('[Email] Error triggering smart match notification:', error);
    }
  }

  /**
   * Send Smart Matching digest email
   */
  async sendSmartMatchingDigest({
    recipientId,
    frequency = 'daily',
    matchCount = 0,
    matches = [],
    sourceId,
    idempotencyKey,
    language = 'fr'
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'smartmatching_digest',
          recipientId,
          frequency,
          matchCount,
          matches,
          sourceId,
          idempotencyKey,
          language
        }
      });

      if (error) {
        throw new Error(`Smart Matching digest failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('[Email] Error sending Smart Matching digest:', error);
    }
  }

  /**
   * Get auth token from localStorage
   */
  async isNotificationEnabled(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_emails_enabled')
        .eq('id', userId)
        .maybeSingle();
      if (error) return true;
      return data?.notification_emails_enabled !== false;
    } catch (error) {
      console.error('[Email] Error checking notification preference:', error);
      return true; // Default to enabled
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          notification_emails_enabled: preferences?.emailNotifications !== false
        })
        .eq('id', userId)
        .select('id')
        .maybeSingle();
      if (error) {
        throw new Error(`Update failed: ${error.message}`);
      }
      console.log('[Email] Notification preferences updated');
      return data;
    } catch (error) {
      console.error('[Email] Error updating preferences:', error);
    }
  }
}

export const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;
