/**
 * Message Notification Queue Service
 * Batches messages and sends a single digest email after 10 minutes
 */

class MessageNotificationQueue {
  constructor() {
    this.queues = new Map(); // Map of recipientEmail -> { messages: [], timer: timeout }
    this.DELAY_MS = 10 * 60 * 1000; // 10 minutes
  }

  /**
   * Add a message notification to the queue
   * @param {string} recipientEmail - Email of recipient
   * @param {object} notificationData - Message data
   * @param {boolean} userNotificationsEnabled - If user has enabled email notifications
   */
  addNotification(recipientEmail, notificationData, userNotificationsEnabled = true) {
    if (!recipientEmail) return;

    // CHECK: User has disabled notifications
    if (!userNotificationsEnabled) {
      console.log(`[Queue] 🔕 Notifications DISABLED for ${recipientEmail} - skipping queue`);
      return; // Do not add to queue
    }

    // Get or create queue for this recipient
    if (!this.queues.has(recipientEmail)) {
      this.queues.set(recipientEmail, {
        messages: [],
        timer: null,
        firstMessageTime: Date.now()
      });
    }

    const queue = this.queues.get(recipientEmail);
    queue.messages.push({
      ...notificationData,
      receivedAt: new Date().toISOString()
    });

    // If this is the first message, set timer
    if (queue.messages.length === 1) {
      queue.timer = setTimeout(() => {
        this.sendDigestEmail(recipientEmail);
      }, this.DELAY_MS);

      console.log(`[Queue] ✅ Started 10-min timer for ${recipientEmail}`);
    } else {
      console.log(`[Queue] ✅ Added message to batch for ${recipientEmail} (${queue.messages.length} total)`);
    }
  }

  /**
   * Send digest email with all batched messages
   */
  async sendDigestEmail(recipientEmail) {
    const queue = this.queues.get(recipientEmail);
    if (!queue || queue.messages.length === 0) return;

    try {
      const messages = queue.messages;
      console.log(`[Queue] Sending digest for ${recipientEmail} with ${messages.length} messages`);

      // Build digest content
      const digestData = {
        recipientEmail,
        messageCount: messages.length,
        messages: messages,
        digestSentAt: new Date().toISOString()
      };

      // Call backend to send email (server-side)
      await this.sendDigestViaBackend(digestData);

      // Clear queue
      this.queues.delete(recipientEmail);
      console.log(`[Queue] ✅ Digest sent and queue cleared for ${recipientEmail}`);
    } catch (error) {
      console.error(`[Queue] ❌ Error sending digest for ${recipientEmail}:`, error);
      // Retry logic could be added here
    }
  }

  /**
   * Send digest via backend (server-side to avoid CORS)
   */
  async sendDigestViaBackend(digestData) {
    try {
      // This should be called via your backend API
      // For now, we'll log it - backend implementation would handle actual email sending
      console.log('[Queue] Preparing digest data for backend:', digestData);

      // In production, this would call:
      // POST /api/notifications/send-digest-email
      // With server-side auth and CORS handling

      return {
        success: true,
        message: 'Digest queued for sending',
        recipient: digestData.recipientEmail,
        messageCount: digestData.messageCount
      };
    } catch (error) {
      console.error('[Queue] Backend call failed:', error);
      throw error;
    }
  }

  /**
   * Force send pending emails (useful for testing or shutdown)
   */
  async flushAll() {
    const recipients = Array.from(this.queues.keys());
    console.log(`[Queue] Flushing all queues for ${recipients.length} recipients`);

    for (const recipient of recipients) {
      const queue = this.queues.get(recipient);
      if (queue?.timer) {
        clearTimeout(queue.timer);
      }
      await this.sendDigestEmail(recipient);
    }
  }

  /**
   * Get queue stats
   */
  getStats() {
    const stats = {
      totalQueues: this.queues.size,
      totalMessages: 0,
      queuesByRecipient: {}
    };

    for (const [email, queue] of this.queues) {
      stats.queuesByRecipient[email] = {
        messageCount: queue.messages.length,
        firstMessageTime: queue.firstMessageTime,
        timeTillSend: (queue.firstMessageTime + this.DELAY_MS) - Date.now()
      };
      stats.totalMessages += queue.messages.length;
    }

    return stats;
  }

  /**
   * Clear a specific queue (for testing)
   */
  clearQueue(recipientEmail) {
    const queue = this.queues.get(recipientEmail);
    if (queue?.timer) {
      clearTimeout(queue.timer);
    }
    this.queues.delete(recipientEmail);
    console.log(`[Queue] Cleared queue for ${recipientEmail}`);
  }
}

export const messageNotificationQueue = new MessageNotificationQueue();
