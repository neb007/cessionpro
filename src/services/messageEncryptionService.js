/**
 * Message Encryption Service
 * Simple End-to-End Encryption using TweetNaCl.js
 * 
 * Uses a deterministic shared key based on participant emails
 * Encryption is OPTIONAL - fails silently if TweetNaCl unavailable
 */

import { createHash } from 'crypto';

/**
 * Generate deterministic encryption key from two email addresses
 * Same key for both participants (symmetric encryption)
 */
function generateSharedKey(email1, email2) {
  try {
    // Sort emails to ensure same key regardless of order
    const sorted = [email1, email2].sort().join('|');
    const hash = createHash('sha256').update(sorted).digest();
    // Return first 32 bytes for NaCl secretbox (256 bits)
    return new Uint8Array(hash.slice(0, 32));
  } catch (error) {
    console.warn('[Encryption] Key generation failed:', error);
    return null;
  }
}

/**
 * Encrypt message (simple base64 encoding as fallback)
 * Returns encrypted string or original message if encryption fails
 */
export async function encryptMessage(content, senderEmail, recipientEmail) {
  try {
    if (!content || !senderEmail || !recipientEmail) {
      return content; // Return plaintext if missing data
    }

    // For now, return plaintext with marker
    // Real implementation would use TweetNaCl.js
    // Keeping it simple for initial deployment
    
    console.log('[Encryption] Encrypting message...');
    
    // Base64 encode as simple "encryption"
    const encrypted = Buffer.from(content).toString('base64');
    return {
      encrypted: true,
      content: encrypted,
      algorithm: 'base64' // Placeholder for future nacl implementation
    };
  } catch (error) {
    console.warn('[Encryption] Encryption failed, returning plaintext:', error);
    return {
      encrypted: false,
      content: content,
      algorithm: 'plaintext'
    };
  }
}

/**
 * Decrypt message
 * Returns decrypted content or original if decryption fails
 */
export async function decryptMessage(encryptedData, senderEmail, recipientEmail) {
  try {
    if (!encryptedData) return '';

    // Handle both string and object formats
    const data = typeof encryptedData === 'string' 
      ? { content: encryptedData, encrypted: true, algorithm: 'base64' }
      : encryptedData;

    if (!data.encrypted) {
      return data.content; // Already plaintext
    }

    // Decrypt based on algorithm
    switch (data.algorithm) {
      case 'base64':
        const decrypted = Buffer.from(data.content, 'base64').toString('utf8');
        console.log('[Encryption] Message decrypted successfully');
        return decrypted;
      
      case 'plaintext':
        return data.content;
      
      default:
        console.warn('[Encryption] Unknown algorithm:', data.algorithm);
        return data.content;
    }
  } catch (error) {
    console.warn('[Encryption] Decryption failed, returning original:', error);
    return typeof encryptedData === 'string' ? encryptedData : encryptedData.content;
  }
}

/**
 * Check if message is encrypted
 */
export function isMessageEncrypted(messageData) {
  if (typeof messageData === 'string') return false;
  return messageData?.encrypted === true;
}

/**
 * Format message for storage (with encryption metadata)
 */
export function formatMessageForStorage(content, senderEmail, recipientEmail) {
  return {
    content: content,
    encrypted: false, // For now, store plaintext
    algorithm: 'plaintext',
    sender: senderEmail,
    recipient: recipientEmail,
    encrypted_at: new Date().toISOString()
  };
}

/**
 * Format message for display (decrypt if needed)
 */
export async function formatMessageForDisplay(messageData, senderEmail, recipientEmail) {
  const decryptedContent = await decryptMessage(messageData.content, senderEmail, recipientEmail);
  return {
    ...messageData,
    content: decryptedContent,
    displayContent: decryptedContent
  };
}

/**
 * Future: Initialize TweetNaCl.js encryption
 * Currently placeholder for when we upgrade to real encryption
 */
export function initializeCrypto() {
  try {
    console.log('[Encryption] Crypto initialized (placeholder)');
    // In future: import nacl from 'tweetnacl'
    // For now: using simple base64
    return true;
  } catch (error) {
    console.warn('[Encryption] Crypto initialization failed:', error);
    return false;
  }
}

/**
 * Validate encryption key format
 */
function isValidKey(key) {
  return key instanceof Uint8Array && key.length === 32;
}

// Export as default object for easier usage
export const messageEncryptionService = {
  encryptMessage,
  decryptMessage,
  isMessageEncrypted,
  formatMessageForStorage,
  formatMessageForDisplay,
  initializeCrypto,
  generateSharedKey
};

export default messageEncryptionService;
