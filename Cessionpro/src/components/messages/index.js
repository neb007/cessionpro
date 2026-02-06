/**
 * Modern Messaging System - Complete Component Library
 * Cessionpro B2B Platform - Messaging Module
 * 
 * This index file exports all messaging components and utilities
 * for easy importing across the application
 */

// ============================================================================
// PHASE 1: AVATAR & DESIGN COMPONENTS
// ============================================================================

export { default as AvatarWithPresence } from './AvatarWithPresence';
/**
 * AvatarWithPresence Component
 * @prop {string} userId - Unique user identifier
 * @prop {string} userName - User display name
 * @prop {string} status - 'online' | 'away' | 'offline' | 'typing'
 * @prop {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @prop {boolean} showStatus - Show status indicator
 * @returns {JSX.Element} Avatar with online/offline indicator
 */

export { default as TypingIndicator } from './TypingIndicator';
/**
 * TypingIndicator Component
 * @prop {string} userId - User ID
 * @prop {string} userName - User name
 * @prop {string} language - 'en' | 'fr'
 * @returns {JSX.Element} Animated typing indicator
 */

export { default as MessageBubble } from './MessageBubble';
/**
 * MessageBubble Component
 * @prop {Object} message - Message data with id, content, created_at, etc
 * @prop {boolean} isOwn - Is this message from current user
 * @prop {string} userName - Sender name
 * @prop {Function} onReaction - Callback for emoji reactions
 * @prop {Function} onPin - Callback for pinning messages
 * @prop {string} language - 'en' | 'fr'
 * @returns {JSX.Element} Enhanced message bubble with reactions
 */

export { default as DealProgressBar } from './DealProgressBar';
/**
 * DealProgressBar Component
 * Interactive timeline for deal progression
 * @prop {string} currentStage - 'contact' | 'nda' | 'data_room' | 'loi' | 'closing'
 * @prop {Function} onStageChange - Callback when stage changes
 * @prop {string} language - 'en' | 'fr'
 * @prop {boolean} isEditable - Can user modify stage
 * @returns {JSX.Element} 5-stage deal progression timeline
 */

// ============================================================================
// PHASE 2: DEAL-FLOW MANAGEMENT COMPONENTS
// ============================================================================

export { default as DealStageManager } from './DealStageManager';
/**
 * DealStageManager Component
 * Manages deal stage progression with role-based actions
 * @prop {string} currentStage - Current deal stage
 * @prop {Function} onStageChange - Callback for stage changes
 * @prop {Function} onActionClick - Callback for action execution
 * @prop {string} language - 'en' | 'fr'
 * @prop {boolean} isBuyer - Is current user a buyer
 * @returns {JSX.Element} Interactive deal stage manager with actions
 */

// ============================================================================
// PHASE 3: DOCUMENTS & SECURITY COMPONENTS
// ============================================================================

export { default as DocumentVault } from './DocumentVault';
/**
 * DocumentVault Component
 * Manages document sharing and access control
 * @prop {Array} documents - Array of document objects
 * @prop {string} currentStage - Current deal stage (for NDA gating)
 * @prop {Function} onDownload - Download document callback
 * @prop {Function} onDelete - Delete document callback
 * @prop {Function} onShare - Share document callback
 * @prop {string} language - 'en' | 'fr'
 * @prop {boolean} isSeller - Is current user the seller
 * @prop {boolean} isNDASigned - Has NDA been signed
 * @returns {JSX.Element} Document vault with NDA-based access control
 */

// ============================================================================
// PHASE 4: MEETINGS COMPONENTS
// ============================================================================

export { default as MeetingScheduler } from './MeetingScheduler';
/**
 * MeetingScheduler Component
 * Schedule and manage meetings within conversations
 * @prop {Array} meetings - Array of meeting objects
 * @prop {Function} onScheduleMeeting - Create meeting callback
 * @prop {Function} onCancelMeeting - Cancel meeting callback
 * @prop {Function} onJoinMeeting - Join meeting callback
 * @prop {string} language - 'en' | 'fr'
 * @prop {string} userTimezone - User's timezone
 * @returns {JSX.Element} Meeting scheduler with calendar view
 */

// ============================================================================
// EXPORTS SUMMARY
// ============================================================================

/**
 * Complete Component List:
 * 
 * PHASE 1 - AVATAR & DESIGN:
 *   - AvatarWithPresence: DiceBear avatars with presence indicators
 *   - TypingIndicator: Animated typing feedback
 *   - MessageBubble: Enhanced message display with reactions
 *   - DealProgressBar: 5-stage deal timeline
 * 
 * PHASE 2 - DEAL-FLOW:
 *   - DealStageManager: Role-based stage progression
 * 
 * PHASE 3 - DOCUMENTS:
 *   - DocumentVault: File management with NDA gating
 * 
 * PHASE 4 - MEETINGS:
 *   - MeetingScheduler: Meeting scheduling system
 * 
 * USAGE IN MESSAGES PAGE:
 * 
 * import {
 *   AvatarWithPresence,
 *   MessageBubble,
 *   DealProgressBar,
 *   DocumentVault,
 *   MeetingScheduler,
 *   DealStageManager,
 *   TypingIndicator
 * } from '@/components/messages';
 * 
 * Then use them in your Messages.jsx page with appropriate props.
 */

// Use named imports instead of this export
// import { AvatarWithPresence, MessageBubble, ... } from '@/components/messages';
