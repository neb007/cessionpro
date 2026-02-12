/**
 * Email Notification Service
 * Handles sending email notifications when messages are received
 * Uses Resend or SendGrid API
 */

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001';

class EmailNotificationService {
  /**
   * Send message notification email
   * @param {Object} data - Notification data
   */
  async sendMessageNotification(data) {
    try {
      const {
        recipientEmail,
        recipientName,
        senderName,
        messagePreview,
        conversationId,
        businessTitle,
        language = 'en'
      } = data;

      const response = await fetch(`${API_ENDPOINT}/api/notifications/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          type: 'message',
          recipient: recipientEmail,
          recipientName,
          senderName,
          messagePreview,
          conversationId,
          businessTitle,
          language,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Email notification failed: ${response.statusText}`);
      }

      console.log('[Email] Message notification sent to:', recipientEmail);
      return await response.json();
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
      const {
        recipientEmail,
        recipientName,
        dealStage,
        businessTitle,
        conversationId,
        language = 'en'
      } = data;

      const response = await fetch(`${API_ENDPOINT}/api/notifications/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          type: 'deal_stage_update',
          recipient: recipientEmail,
          recipientName,
          dealStage,
          businessTitle,
          conversationId,
          language,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Deal stage notification failed: ${response.statusText}`);
      }

      console.log('[Email] Deal stage notification sent to:', recipientEmail);
      return await response.json();
    } catch (error) {
      console.error('[Email] Error sending deal stage notification:', error);
    }
  }

  /**
   * Send document shared notification
   */
  async sendDocumentSharedNotification(data) {
    try {
      const {
        recipientEmail,
        recipientName,
        senderName,
        documentName,
        conversationId,
        businessTitle,
        language = 'en'
      } = data;

      const response = await fetch(`${API_ENDPOINT}/api/notifications/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          type: 'document_shared',
          recipient: recipientEmail,
          recipientName,
          senderName,
          documentName,
          conversationId,
          businessTitle,
          language,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Document notification failed: ${response.statusText}`);
      }

      console.log('[Email] Document notification sent to:', recipientEmail);
      return await response.json();
    } catch (error) {
      console.error('[Email] Error sending document notification:', error);
    }
  }

  /**
   * Send NDA signed notification
   */
  async sendNDASignedNotification(data) {
    try {
      const {
        recipientEmail,
        recipientName,
        signerName,
        conversationId,
        businessTitle,
        language = 'en'
      } = data;

      const response = await fetch(`${API_ENDPOINT}/api/notifications/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          type: 'nda_signed',
          recipient: recipientEmail,
          recipientName,
          signerName,
          conversationId,
          businessTitle,
          language,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`NDA notification failed: ${response.statusText}`);
      }

      console.log('[Email] NDA signed notification sent to:', recipientEmail);
      return await response.json();
    } catch (error) {
      console.error('[Email] Error sending NDA notification:', error);
    }
  }

  /**
   * Get auth token from localStorage
   */
  async getAuthToken() {
    // Get from Supabase session
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        throw new Error('No active session');
      }
      return data.session.access_token;
    } catch (e) {
      console.error('[Email] No auth token available');
      return null;
    }
  }

  /**
   * Check if notifications are enabled for user
   */
  async isNotificationEnabled(userId) {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/api/notifications/preferences/${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        return true; // Default to enabled
      }

      const data = await response.json();
      return data.emailNotifications !== false;
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
      const response = await fetch(
        `${API_ENDPOINT}/api/notifications/preferences/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await this.getAuthToken()}`
          },
          body: JSON.stringify(preferences)
        }
      );

      if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`);
      }

      console.log('[Email] Notification preferences updated');
      return await response.json();
    } catch (error) {
      console.error('[Email] Error updating preferences:', error);
    }
  }
}

export const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;
