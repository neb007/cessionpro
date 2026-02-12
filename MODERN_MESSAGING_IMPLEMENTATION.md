# 🚀 Modern Messaging System Implementation Guide

## Overview

Complete modern messaging system with deal-flow management, real-time presence, emoji reactions, and email notifications.

**Status**: ✅ Phase 1 (Avatar & Design) Complete

---

## 📦 What Has Been Implemented

### Database Migrations
- ✅ `supabase_migration_messaging_system.sql` - Complete schema upgrade
  - deal_stage, anonymize_mode fields for conversations
  - message_type, reactions, is_pinned for messages
  - user_presence table for real-time status
  - document_vault table for file management
  - deal_timeline for tracking progression
  - RLS policies for all new tables

### Services
- ✅ `src/services/socketService.js` - Socket.io real-time communication
  - Message sending/receiving
  - Typing indicators
  - Presence updates
  - Deal stage changes
  - Message reactions

- ✅ `src/services/emailNotificationService.js` - Email notifications
  - Message notifications
  - Deal stage update notifications
  - Document sharing notifications
  - NDA signed notifications
  - User preferences management

### Components - Messages Folder
- ✅ `src/components/messages/AvatarWithPresence.jsx` - DiceBear avatars
  - Automatic avatar generation per user
  - Online/Offline/Away status indicator
  - Typing animation support
  - Multiple size options (xs, sm, md, lg, xl)

- ✅ `src/components/messages/TypingIndicator.jsx` - Typing animation
  - Animated "User is typing..." message
  - Avatar integration
  - Language support (EN/FR)

- ✅ `src/components/messages/MessageBubble.jsx` - Enhanced message display
  - Glassmorphism design
  - Read/Delivered status icons
  - Emoji reaction system with picker
  - Message actions (copy, pin, react)
  - Timestamp formatting
  - Animation support

- ✅ `src/components/messages/DealProgressBar.jsx` - Interactive timeline
  - 5-stage deal progression (Contact → NDA → Data Room → LOI → Closing)
  - NDA gating for Data Room access
  - Progress visualization
  - Stage locking mechanism
  - Detailed stage information
  - Multi-language support

---

## 🔧 Installation & Setup

### 1. Install Required Dependencies

```bash
npm install socket.io-client date-fns framer-motion lucide-react
```

### 2. Execute Database Migration

Run the SQL migration in your Supabase SQL Editor:

```sql
-- Copy contents from: Cessionpro/supabase_migration_messaging_system.sql
-- Paste into Supabase SQL Editor and execute
```

### 3. Set Environment Variables

Add to your `.env.local`:

```env
VITE_SOCKET_SERVER=http://localhost:3001
VITE_API_ENDPOINT=http://localhost:3001
```

### 4. Setup Socket.io Server (Backend)

Create a Node.js/Express backend:

```bash
# Create backend directory
mkdir backend && cd backend
npm init -y
npm install express socket.io cors

# Create server.js
```

Backend reference (minimal example):

```javascript
// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Listen for message sending
  socket.on('message:send', (data) => {
    // Save to database, then broadcast
    io.to(data.conversation_id).emit('message:new', data);
  });

  socket.on('user:typing', (data) => {
    socket.broadcast.to(data.conversation_id).emit('user:typing', {
      user_id: socket.handshake.auth.userId,
      conversation_id: data.conversation_id
    });
  });

  socket.on('conversation:join', (data) => {
    socket.join(data.conversation_id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Socket.io server running on port 3001');
});
```

---

## 📱 Component Usage Examples

### Avatar with Presence

```jsx
import AvatarWithPresence from '@/components/messages/AvatarWithPresence';

<AvatarWithPresence 
  userId="user-123"
  userName="Jean Dupont"
  status="online" // 'online' | 'away' | 'offline' | 'typing'
  size="lg"
  showStatus={true}
/>
```

### Message Bubble

```jsx
import MessageBubble from '@/components/messages/MessageBubble';

<MessageBubble
  message={{
    id: 'msg-1',
    content: 'Hello! How are you?',
    created_at: new Date(),
    read: true,
    reactions: ['👍', '❤️'],
    is_pinned: false
  }}
  isOwn={false}
  userName="Jean"
  onReaction={(messageId, emoji) => {
    // Handle reaction
  }}
  language="fr"
/>
```

### Deal Progress Bar

```jsx
import DealProgressBar from '@/components/messages/DealProgressBar';

<DealProgressBar
  currentStage="nda" // contact | nda | data_room | loi | closing
  onStageChange={(newStage) => {
    // Update conversation in database
  }}
  isEditable={true}
  language="fr"
/>
```

### Typing Indicator

```jsx
import TypingIndicator from '@/components/messages/TypingIndicator';

{typingUsers.map(user => (
  <TypingIndicator
    key={user.id}
    userId={user.id}
    userName={user.name}
    language="fr"
  />
))}
```

### Socket Service

```jsx
import { socketService } from '@/services/socketService';
import { useEffect } from 'react';

export function MyComponent() {
  useEffect(() => {
    // Connect to Socket.io
    socketService.connect(userId);

    // Listen for messages
    socketService.on('message:new', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Send message
    const handleSendMessage = (content) => {
      socketService.sendMessage(conversationId, content, 'text');
    };

    // Set typing status
    const handleTyping = () => {
      socketService.setTyping(conversationId, true);
    };

    return () => {
      socketService.disconnect();
    };
  }, [userId]);
}
```

### Email Notifications

```jsx
import { emailNotificationService } from '@/services/emailNotificationService';

// Send message notification
emailNotificationService.sendMessageNotification({
  recipientEmail: 'buyer@example.com',
  recipientName: 'Jean Dupont',
  senderName: 'Vendeur',
  messagePreview: 'Intéressé par le business...',
  conversationId: 'conv-123',
  businessTitle: 'Restaurant Paris 8ème',
  language: 'fr'
});

// Update preferences
emailNotificationService.updateNotificationPreferences(userId, {
  emailNotifications: true,
  dealStageUpdates: true,
  documentNotifications: true
});
```

---

## 📊 Database Schema Overview

### Conversations (Enhanced)
```sql
- deal_stage: 'contact' | 'nda' | 'data_room' | 'loi' | 'closing'
- anonymize_mode: boolean
- buyer_pseudonym: 'Acheteur #12'
- seller_pseudonym: 'Vendeur #34'
- last_activity_at: timestamp
- is_pinned: boolean
```

### Messages (Enhanced)
```sql
- message_type: 'text' | 'document' | 'signature' | 'meeting'
- reactions: ['👍', '❤️']
- is_pinned: boolean
- edited_at: timestamp
```

### New Tables
- `user_presence` - Real-time user status
- `document_vault` - File sharing & storage
- `deal_timeline` - Deal progression tracking

---

## 🎯 Next Steps (Phase 2 & 3)

### Phase 2: Deal-Flow Management
- [ ] DealStageManager component
- [ ] DealActionButtons component
- [ ] Conversation refresh when deal stage changes
- [ ] NDA signing flow

### Phase 3: Documents & Security
- [ ] DocumentVault component (file list tab)
- [ ] DocumentSecurityPanel (NDA gating)
- [ ] File upload functionality
- [ ] Anti-bypass detection (email/phone regex)
- [ ] Document preview system

### Phase 4: Meetings
- [ ] MeetingScheduler component
- [ ] Calendar integration
- [ ] Meeting reminders

---

## 🔌 API Endpoints Required (Backend)

```
POST /api/notifications/send-email
  - Send email notifications

GET /api/notifications/preferences/:userId
  - Get user notification preferences

PUT /api/notifications/preferences/:userId
  - Update user notification preferences

POST /api/messages
  - Save message to database

POST /api/conversations/:id/stage
  - Update conversation deal stage

POST /api/documents/upload
  - Upload file to document vault

POST /api/documents/:id/sign
  - Mark document as signed
```

---

## 🎨 Design Features

### Glassmorphism
- Backdrop blur effects
- Semi-transparent backgrounds
- Rounded glass cards
- Smooth transitions

### Animations
- Message arrival animations
- Typing indicator dots
- Reaction animations
- Stage progression animations
- Toast notifications

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons
- Scrollable areas

### Accessibility
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Semantic HTML

---

## 📝 Language Support

All components support French and English:
- Component translations via `language` prop
- Date formatting with locale support
- Email templates multi-language

---

## 🚨 Important Notes

1. **Socket.io Server**: Must be running separately on port 3001
2. **Email Service**: Requires backend API integration with Resend/SendGrid
3. **Database**: Run migration before using components
4. **Dependencies**: All required packages listed in installation section
5. **Environment**: Set VITE_SOCKET_SERVER and VITE_API_ENDPOINT

---

## 📞 Support

For questions or issues:
1. Check component props documentation (JSDoc comments)
2. Review example usage above
3. Check console logs for Socket.io connection issues
4. Verify database migration completed successfully

---

## 📅 Timeline

- **Phase 1** (Done): Avatar & Design ✅
- **Phase 2** (Start): Deal-Flow 📊
- **Phase 3** (Next): Documents 📁
- **Phase 4** (Final): Meetings 📅

---

**Last Updated**: 2026-02-06  
**Version**: 1.0.0
