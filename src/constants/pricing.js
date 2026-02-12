/**
 * Cessionpro Pricing Configuration
 * Multi-language support for FR & EN
 * Payment integration ready
 */

export const PRICING = {
  contacts: {
    frenchLabel: 'Packs de Mise en Relation',
    englishLabel: 'Contact Packages',
    unit: {
      quantity: 1,
      price: 19.99,
      frenchLabel: 'Contact Unité',
      englishLabel: 'Single Contact',
      frenchDescription: '1 mise en relation',
      englishDescription: '1 contact',
      savingsPercent: 0
    },
    pack5: {
      quantity: 5,
      price: 79.00,
      unitPrice: 15.80,
      frenchLabel: 'Pack 5 Contacts',
      englishLabel: 'Pack 5 Contacts',
      frenchDescription: '5 mises en relation',
      englishDescription: '5 contacts',
      savingsPercent: 21,
      savingsAmount: 20.00
    },
    pack8: {
      quantity: 8,
      price: 119.00,
      unitPrice: 14.87,
      frenchLabel: 'Pack 8 Contacts',
      englishLabel: 'Pack 8 Contacts',
      frenchDescription: '8 mises en relation',
      englishDescription: '8 contacts',
      savingsPercent: 26,
      savingsAmount: 40.00
    },
    pack10: {
      quantity: 10,
      price: 159.00,
      unitPrice: 15.90,
      frenchLabel: 'Pack 10 Contacts',
      englishLabel: 'Pack 10 Contacts',
      frenchDescription: '10 mises en relation',
      englishDescription: '10 contacts',
      savingsPercent: 20,
      savingsAmount: 39.90
    }
  },

  photos: {
    frenchLabel: 'Packs Visibilité (Photos Supplémentaires)',
    englishLabel: 'Visibility Packages (Additional Photos)',
    frenchNote: 'Rappel : 1 photo est toujours gratuite par annonce',
    englishNote: 'Reminder: 1 photo is always free per listing',
    pack5: {
      quantity: 5,
      price: 9.99,
      frenchLabel: 'Pack 5 Photos',
      englishLabel: 'Pack 5 Photos',
      frenchDescription: '5 photos supplémentaires par annonce',
      englishDescription: '5 additional photos per listing',
      ideal: 'TPE / Small Business'
    },
    pack15: {
      quantity: 15,
      price: 19.99,
      frenchLabel: 'Pack 15 Photos',
      englishLabel: 'Pack 15 Photos',
      frenchDescription: '15 photos supplémentaires par annonce',
      englishDescription: '15 additional photos per listing',
      ideal: 'Standard Professional'
    }
  },

  premium: {
    frenchLabel: 'Options de Sécurité & Automatisation',
    englishLabel: 'Security & Automation Options',
    smartMatching: {
      price: 29.99,
      billingCycle: 'monthly',
      frenchLabel: 'Smart Matching IA',
      englishLabel: 'Smart Matching AI',
      frenchDescription: 'Matching automatisé avec IA',
      englishDescription: 'Automated AI-powered matching',
      features: ['Automatic matching', 'Lead prioritization', '24/7 updates']
    },
    dataRoom: {
      price: 9.99,
      billingCycle: 'oneTime',
      frenchLabel: 'Data Room Sécurisée',
      englishLabel: 'Secure Data Room',
      frenchDescription: 'Par annonce - Partage sécurisé de documents',
      englishDescription: 'Per listing - Secure document sharing',
      features: ['Secure storage', 'Download tracking', 'Access control']
    },
    ndaProtection: {
      price: 39.99,
      billingCycle: 'oneTime',
      frenchLabel: 'Protection NDA Juridique',
      englishLabel: 'Legal NDA Protection',
      frenchDescription: 'Signature électronique incluse',
      englishDescription: 'Electronic signature included',
      features: ['Legal NDA', 'E-signature', 'Document tracking']
    }
  },

  // Free tier configuration
  free: {
    photosPerListing: 1,
    frenchLabel: '1 photo gratuite par annonce',
    englishLabel: '1 free photo per listing'
  }
};

/**
 * Get pricing label in specified language
 * @param {object} pricingItem - Pricing item object
 * @param {string} language - 'fr' or 'en'
 * @returns {string} - Label in requested language
 */
export const getPricingLabel = (pricingItem, language = 'fr') => {
  if (!pricingItem) return '';
  const key = language === 'fr' ? 'frenchLabel' : 'englishLabel';
  return pricingItem[key] || '';
};

/**
 * Get pricing description in specified language
 * @param {object} pricingItem - Pricing item object
 * @param {string} language - 'fr' or 'en'
 * @returns {string} - Description in requested language
 */
export const getPricingDescription = (pricingItem, language = 'fr') => {
  if (!pricingItem) return '';
  const key = language === 'fr' ? 'frenchDescription' : 'englishDescription';
  return pricingItem[key] || '';
};

/**
 * Format price for display
 * @param {number} price - Price in euros
 * @param {string} language - 'fr' or 'en'
 * @returns {string} - Formatted price (e.g., "19,99 €" or "$19.99")
 */
export const formatPrice = (price, language = 'fr') => {
  if (language === 'fr') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
};

/**
 * Get all contact packages
 * @returns {array} - Array of contact packages
 */
export const getContactPackages = () => {
  const { contacts } = PRICING;
  return [
    { id: 'unit', ...contacts.unit },
    { id: 'pack5', ...contacts.pack5 },
    { id: 'pack8', ...contacts.pack8 },
    { id: 'pack10', ...contacts.pack10 }
  ];
};

/**
 * Get all photo packages
 * @returns {array} - Array of photo packages
 */
export const getPhotoPackages = () => {
  const { photos } = PRICING;
  return [
    { id: 'pack5', ...photos.pack5 },
    { id: 'pack15', ...photos.pack15 }
  ];
};

/**
 * Calculate total savings for a package
 * @param {number} unitPrice - Unit price
 * @param {number} quantity - Quantity
 * @param {number} packagePrice - Package price
 * @returns {object} - { savingsAmount, savingsPercent }
 */
export const calculateSavings = (unitPrice, quantity, packagePrice) => {
  const totalIfBought = unitPrice * quantity;
  const savingsAmount = totalIfBought - packagePrice;
  const savingsPercent = Math.round((savingsAmount / totalIfBought) * 100);
  
  return {
    savingsAmount: parseFloat(savingsAmount.toFixed(2)),
    savingsPercent
  };
};

export default PRICING;
