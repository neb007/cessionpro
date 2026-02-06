import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.socket && this.socket.connected) {
      return;
    }

    // Connect to Socket.io server
    this.socket = io(import.meta.env.VITE_SOCKET_SERVER || 'http://localhost:3001', {
      auth: {
        userId,
        timestamp: Date.now()
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id);
      this.emit('user:connected', { userId });
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('[Socket] Error:', error);
    });

    // Message events
    this.socket.on('message:new', (data) => {
      this.trigger('message:new', data);
    });

    // Typing events
    this.socket.on('user:typing', (data) => {
      this.trigger('user:typing', data);
    });

    this.socket.on('user:stopped_typing', (data) => {
      this.trigger('user:stopped_typing', data);
    });

    // Presence events
    this.socket.on('presence:updated', (data) => {
      this.trigger('presence:updated', data);
    });

    // Deal stage update
    this.socket.on('deal:stage_updated', (data) => {
      this.trigger('deal:stage_updated', data);
    });

    // Reaction events
    this.socket.on('message:reaction_added', (data) => {
      this.trigger('message:reaction_added', data);
    });

    this.socket.on('message:reaction_removed', (data) => {
      this.trigger('message:reaction_removed', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send message
  sendMessage(conversationId, content, messageType = 'text') {
    if (!this.socket) return;
    
    this.socket.emit('message:send', {
      conversation_id: conversationId,
      content,
      message_type: messageType,
      timestamp: Date.now()
    });
  }

  // Set typing status
  setTyping(conversationId, isTyping = true) {
    if (!this.socket) return;

    if (isTyping) {
      this.socket.emit('user:typing', {
        conversation_id: conversationId,
        timestamp: Date.now()
      });
    } else {
      this.socket.emit('user:stopped_typing', {
        conversation_id: conversationId,
        timestamp: Date.now()
      });
    }
  }

  // Update presence status
  updatePresence(status = 'online') {
    if (!this.socket) return;

    this.socket.emit('presence:update', {
      status,
      timestamp: Date.now()
    });
  }

  // Update deal stage
  updateDealStage(conversationId, stage) {
    if (!this.socket) return;

    this.socket.emit('deal:stage_update', {
      conversation_id: conversationId,
      stage,
      timestamp: Date.now()
    });
  }

  // Add reaction to message
  addReaction(messageId, emoji) {
    if (!this.socket) return;

    this.socket.emit('message:add_reaction', {
      message_id: messageId,
      emoji,
      timestamp: Date.now()
    });
  }

  // Remove reaction from message
  removeReaction(messageId, emoji) {
    if (!this.socket) return;

    this.socket.emit('message:remove_reaction', {
      message_id: messageId,
      emoji,
      timestamp: Date.now()
    });
  }

  // Join conversation room
  joinConversation(conversationId) {
    if (!this.socket) return;

    this.socket.emit('conversation:join', {
      conversation_id: conversationId,
      timestamp: Date.now()
    });
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (!this.socket) return;

    this.socket.emit('conversation:leave', {
      conversation_id: conversationId,
      timestamp: Date.now()
    });
  }

  // Listen for events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // Trigger listeners
  trigger(event, data) {
    if (!this.listeners.has(event)) return;

    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in listener for ${event}:`, error);
      }
    });
  }

  // Emit event to server
  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  // Check if connected
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Export singleton instance
export const socketService = new SocketService();

// Export hook for React
export const useSocket = () => {
  return socketService;
};
