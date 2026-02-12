/**
 * Cessionpro Pricing Configuration - M&A Europe
 * Multi-language support for FR & EN
 * Pay-as-you-go model
 */

export const PRICING = {
  // Free Model
  free: {
    photosPerListing: 1,
    frenchLabel: 'Modèle de Publication (GRATUIT)',
    englishLabel: 'Free Publication Model',
    frenchDescription: 'Publication d\'annonces gratuite pour vendeurs et acheteurs',
    englishDescription: 'Free listing publication for sellers and buyers'
  },

  // Photo Packages
  photos: {
    frenchLabel: 'Packs Photos Supplémentaires',
    englishLabel: 'Additional Photo Packages',
    frenchSubtitle: 'Complétez votre annonce avec plus de visuels',
    englishSubtitle: 'Complete your listing with more visuals',
    pack5: {
      id: 'photos_pack5',
      quantity: 5,
      price: 14.99,
      frenchLabel: 'Pack 5 Photos',
      englishLabel: 'Pack 5 Photos',
      frenchDescription: '5 photos supplémentaires par annonce',
      englishDescription: '5 additional photos per listing',
      icon: 'image'
    },
    pack15: {
      id: 'photos_pack15',
      quantity: 15,
      price: 29.99,
      frenchLabel: 'Pack 15 Photos',
      englishLabel: 'Pack 15 Photos',
      frenchDescription: '15 photos supplémentaires par annonce',
      englishDescription: '15 additional photos per listing',
      icon: 'images'
    }
  },

  // Contact Packages
  contacts: {
    frenchLabel: 'Packs de Mise en Relation',
    englishLabel: 'Contact Packages',
    frenchSubtitle: 'Contactez les profils en dehors de votre quota',
    englishSubtitle: 'Contact profiles outside your quota',
    unit: {
      id: 'contact_unit',
      quantity: 1,
      price: 19.99,
      frenchLabel: 'Contact à l\'unité',
      englishLabel: 'Single Contact',
      frenchDescription: 'Contactez un profil hors quota inclus',
      englishDescription: 'Contact a profile outside your quota',
      icon: 'user'
    },
    pack5: {
      id: 'contact_pack5',
      quantity: 5,
      price: 79.00,
      frenchLabel: 'Pack 5 Contacts',
      englishLabel: 'Pack 5 Contacts',
      frenchDescription: '5 mises en relation',
      englishDescription: '5 contacts',
      icon: 'users'
    },
    pack8: {
      id: 'contact_pack8',
      quantity: 8,
      price: 119.00,
      frenchLabel: 'Pack 8 Contacts',
      englishLabel: 'Pack 8 Contacts',
      frenchDescription: '8 mises en relation',
      englishDescription: '8 contacts',
      icon: 'users'
    },
    pack10: {
      id: 'contact_pack10',
      quantity: 10,
      price: 159.00,
      frenchLabel: 'Pack 10 Contacts',
      englishLabel: 'Pack 10 Contacts',
      frenchDescription: '10 mises en relation',
      englishDescription: '10 contacts',
      icon: 'users'
    }
  },

  // Premium Options
  premium: {
    frenchLabel: 'Options à la Carte',
    englishLabel: 'A La Carte Options',
    frenchSubtitle: 'Complétez votre plan avec des fonctionnalités avancées',
    englishSubtitle: 'Enhance your plan with advanced features',
    
    smartMatching: {
      id: 'smart_matching',
      price: 39.99,
      billingCycle: 'monthly',
      frenchLabel: 'Smart Matching Intelligent',
      englishLabel: 'Smart Matching AI',
      frenchDescription: 'Veille automatique quotidienne et alertes de nouveaux matchs',
      englishDescription: 'Daily automatic monitoring and new match alerts',
      features: {
        fr: ['Algorithme IA de matching', 'Alertes de compatibilité', 'Score de compatibilité', 'Suggestions personnalisées'],
        en: ['AI matching algorithm', 'Compatibility alerts', 'Compatibility score', 'Personalized suggestions']
      },
      icon: 'zap',
      popular: true
    },

    dataRoom: {
      id: 'data_room',
      price: 19.99,
      billingCycle: 'yearly',
      frenchLabel: 'Data Room Sécurisée',
      englishLabel: 'Secure Data Room',
      frenchDescription: 'Stockage des documents officiels (Bilans, Bail, etc.)',
      englishDescription: 'Storage of official documents (Bilans, Lease, etc.)',
      features: {
        fr: ['Stockage illimité', 'Accès contrôlé', 'Historique des consultations', 'Contribue au badge "Vérifiée"'],
        en: ['Unlimited storage', 'Controlled access', 'Consultation history', 'Contributes to "Verified" badge']
      },
      icon: 'database',
      comingSoon: true,
      frenchTooltip: 'Disponible prochainement',
      englishTooltip: 'Coming soon'
    },

    ndaProtection: {
      id: 'nda_protection',
      price: 39.99,
      billingCycle: 'oneTime',
      frenchLabel: 'Protection NDA',
      englishLabel: 'NDA Protection',
      frenchDescription: 'Signature électronique obligatoire avant accès aux données sensibles',
      englishDescription: 'Electronic signature required before accessing sensitive data',
      features: {
        fr: ['Modèle NDA personnalisable', 'Signature électronique', 'Suivi juridique', 'Protection des données'],
        en: ['Customizable NDA template', 'Electronic signature', 'Legal tracking', 'Data protection']
      },
      icon: 'shield',
      comingSoon: true,
      frenchTooltip: 'Disponible prochainement',
      englishTooltip: 'Coming soon'
    }
  },

  // Verified Announcement Badge
  verifiedBadge: {
    frenchLabel: 'Badge "Annonce Vérifiée"',
    englishLabel: '"Verified Announcement" Badge',
    frenchDescription: 'Obtenez le badge de certification pour augmenter la confiance des acheteurs/vendeurs',
    englishDescription: 'Get the certification badge to increase buyer/seller confidence',
    requirements: {
      fr: [
        'Data Room avec les 3 derniers bilans',
        'Profil utilisateur complété à 100%',
        'Identité certifiée par la plateforme'
      ],
      en: [
        'Data Room with 3 last bilans',
        'User profile 100% completed',
        'Identity certified by the platform'
      ]
    }
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
