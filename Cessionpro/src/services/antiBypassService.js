/**
 * Anti-Bypass Detection Service
 * Detects and prevents attempts to share contact information outside the platform
 * Protects user privacy and ensures all communications stay on Cessionpro
 */

class AntiBypassService {
  constructor() {
    // Regex patterns for contact information
    this.patterns = {
      // Email patterns
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      
      // Phone patterns (multiple formats)
      phone: /(?:(?:\+|00)?33|0)[1-9](?:[0-9]{8}|[0-9]{9})|(?:(?:\+|00)?[1-9]{1,3})?[-.\s]?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}/g,
      
      // WhatsApp pattern
      whatsapp: /whatsapp|wa\.me|whatsapp\.com/gi,
      
      // Telegram pattern
      telegram: /telegram|@\w+|t\.me/gi,
      
      // Viber pattern
      viber: /viber|viber:\/\//gi,
      
      // Signal pattern
      signal: /signal|signalapp/gi,
      
      // WeChat pattern
      wechat: /wechat|weixin/gi,
      
      // Skype pattern
      skype: /skype|skype:\/\//gi,
      
      // Instagram/Facebook pattern
      social: /instagram\.com|facebook\.com|@insta|@fb|instagram @/gi,
      
      // URL patterns
      url: /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g,
      
      // Payment service patterns (PayPal, Stripe, etc)
      payment: /paypal|stripe|revolut|wise|cryptocurrency|bitcoin|ethereum|wallet/gi
    };

    // Severity levels
    this.severityLevels = {
      email: 'high',
      phone: 'high',
      whatsapp: 'high',
      telegram: 'high',
      viber: 'high',
      signal: 'high',
      wechat: 'high',
      skype: 'high',
      social: 'medium',
      url: 'medium',
      payment: 'medium'
    };

    // Whitelist for safe URLs (Cessionpro domains)
    this.urlWhitelist = [
      'cessionpro.com',
      'app.cessionpro.com',
      'www.cessionpro.com'
    ];
  }

  /**
   * Scan message for bypass attempts
   * @param {string} content - Message content to scan
   * @returns {Object} Detection results
   */
  scanMessage(content) {
    const results = {
      isViolating: false,
      violations: [],
      severity: 'none',
      highlightedContent: content,
      details: []
    };

    if (!content || typeof content !== 'string') {
      return results;
    }

    const lowerContent = content.toLowerCase();

    // Check each pattern
    for (const [patternName, pattern] of Object.entries(this.patterns)) {
      const matches = content.match(pattern);
      
      if (matches && matches.length > 0) {
        const severity = this.severityLevels[patternName];
        
        // Filter URLs through whitelist
        if (patternName === 'url') {
          const filteredMatches = matches.filter(url => 
            !this.urlWhitelist.some(safe => url.includes(safe))
          );
          
          if (filteredMatches.length === 0) continue;
          matches.splice(0, matches.length, ...filteredMatches);
        }

        results.violations.push({
          type: patternName,
          severity: severity,
          matches: matches,
          count: matches.length
        });

        results.isViolating = true;

        // Update overall severity
        if (severity === 'high') {
          results.severity = 'high';
        } else if (severity === 'medium' && results.severity !== 'high') {
          results.severity = 'medium';
        }

        // Add detailed information
        results.details.push({
          type: patternName,
          message: this.getWarningMessage(patternName),
          examples: matches.slice(0, 2) // First 2 matches
        });

        // Highlight violations in content
        matches.forEach(match => {
          results.highlightedContent = results.highlightedContent.replace(
            match,
            `[${patternName.toUpperCase()}]`
          );
        });
      }
    }

    return results;
  }

  /**
   * Get user-friendly warning message
   * @param {string} violationType - Type of violation detected
   * @returns {string} Warning message
   */
  getWarningMessage(violationType) {
    const messages = {
      email: 'Adresse email détectée. Veuillez garder toutes les communications sur Cessionpro pour votre sécurité.',
      phone: 'Numéro de téléphone détecté. Utilisez la plateforme pour toutes les communications.',
      whatsapp: 'WhatsApp détecté. Continuez la conversation sur Cessionpro pour maintenir un historique sécurisé.',
      telegram: 'Telegram détecté. La plateforme propose une messagerie sécurisée.',
      viber: 'Viber détecté. Utilisez Cessionpro pour tracer toutes les communications.',
      signal: 'Signal détecté. Cessionpro offre une communication sécurisée.',
      wechat: 'WeChat détecté. Gardez les discussions sur Cessionpro.',
      skype: 'Skype détecté. Communiquez via Cessionpro.',
      social: 'Réseaux sociaux détectés. Restez sur Cessionpro pour une communication professionnelle.',
      url: 'Lien externe détecté. Partagez les documents via la Data Room Cessionpro.',
      payment: 'Informations de paiement détectées. Utilisez les canaux officiels Cessionpro.'
    };

    return messages[violationType] || 'Contenu suspect détecté. Veuillez vérifier votre message.';
  }

  /**
   * Get severity level description
   * @param {string} severity - Severity level
   * @returns {string} Severity description
   */
  getSeverityDescription(severity) {
    const descriptions = {
      high: 'Violation - Le message sera bloqué',
      medium: 'Avertissement - Veuillez réviser votre message',
      low: 'Info - Message autorisé'
    };

    return descriptions[severity] || 'Unknown';
  }

  /**
   * Check if message can be sent
   * @param {string} content - Message content
   * @param {string} mode - 'strict' | 'warning' | 'log'
   * @returns {Object} Permission result
   */
  canSendMessage(content, mode = 'warning') {
    const scanResults = this.scanMessage(content);

    const canSend = {
      allowed: true,
      reason: null,
      violations: scanResults.violations,
      severity: scanResults.severity
    };

    if (scanResults.isViolating) {
      if (mode === 'strict') {
        // Block all violations
        canSend.allowed = false;
        canSend.reason = 'Anti-bypass violation detected';
      } else if (mode === 'warning') {
        // Block high severity only
        if (scanResults.severity === 'high') {
          canSend.allowed = false;
          canSend.reason = 'High-severity contact information blocked';
        }
      } else if (mode === 'log') {
        // Log but allow
        console.warn('[AntiBypass] Violation detected:', scanResults);
      }
    }

    return canSend;
  }

  /**
   * Get sanitized version of message
   * Removes or masks detected violations
   * @param {string} content - Original content
   * @param {boolean} mask - true to mask, false to remove
   * @returns {string} Sanitized content
   */
  sanitizeMessage(content, mask = true) {
    let sanitized = content;

    for (const [patternName, pattern] of Object.entries(this.patterns)) {
      if (patternName === 'url') {
        // Filter whitelisted URLs
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(url => {
            if (!this.urlWhitelist.some(safe => url.includes(safe))) {
              sanitized = sanitized.replace(
                url,
                mask ? '[URL_REMOVED]' : ''
              );
            }
          });
        }
      } else {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            sanitized = sanitized.replace(
              match,
              mask ? `[${patternName.toUpperCase()}_REMOVED]` : ''
            );
          });
        }
      }
    }

    return sanitized;
  }

  /**
   * Log violation attempt
   * @param {Object} data - Violation data
   */
  logViolation(data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: data.userId,
      conversationId: data.conversationId,
      violationType: data.violationType,
      severity: data.severity,
      message: data.message,
      sanitizedContent: this.sanitizeMessage(data.message, true)
    };

    console.error('[AntiBypass Violation]', logEntry);

    // Could send to backend for analytics
    // fetch('/api/logs/violations', { method: 'POST', body: JSON.stringify(logEntry) });

    return logEntry;
  }

  /**
   * Get statistics on violation attempts
   * @returns {Object} Stats object (would be fetched from backend in production)
   */
  getViolationStats() {
    return {
      totalViolations: 0,
      byType: {},
      bySeverity: {
        high: 0,
        medium: 0,
        low: 0
      },
      topViolators: []
    };
  }

  /**
   * Check if user has exceeded violation threshold
   * @param {string} userId - User ID
   * @param {number} maxViolations - Max allowed violations
   * @returns {boolean} True if exceeded
   */
  async hasExceededViolationThreshold(userId, maxViolations = 5) {
    try {
      // This would be fetched from backend
      // const stats = await fetch(`/api/violations/user/${userId}`);
      // return stats.violationCount >= maxViolations;
      
      return false; // Placeholder
    } catch (error) {
      console.error('[AntiBypass] Error checking violation threshold:', error);
      return false;
    }
  }
}

export const antiBypassService = new AntiBypassService();
export default antiBypassService;
