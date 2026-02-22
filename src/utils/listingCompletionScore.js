const asText = (value) => (typeof value === 'string' ? value.trim() : '');

const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
};

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const getTier = (score, language = 'fr') => {
  if (score >= 85) {
    return {
      key: 'excellent',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
      label: language === 'fr' ? 'Excellent' : 'Excellent'
    };
  }
  if (score >= 70) {
    return {
      key: 'good',
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-200',
      label: language === 'fr' ? 'Bon' : 'Good'
    };
  }
  if (score >= 40) {
    return {
      key: 'medium',
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
      label: language === 'fr' ? 'Moyen' : 'Average'
    };
  }
  return {
    key: 'low',
    color: 'text-rose-700',
    bg: 'bg-rose-50 border-rose-200',
    label: language === 'fr' ? 'Faible' : 'Low'
  };
};

const nextMilestoneFor = (score) => {
  if (score < 40) return 40;
  if (score < 70) return 70;
  if (score < 85) return 85;
  if (score < 100) return 100;
  return null;
};

const fieldInsight = (points, maxPoints, tips) => ({
  points,
  maxPoints,
  completed: points >= maxPoints,
  missing: Math.max(0, maxPoints - points),
  tipWhenMissing: tips?.missing || '',
  tipWhenCompleted: tips?.completed || ''
});

const descriptionPoints = (description = '') => {
  const length = asText(description).length;
  if (length >= 300) return 10;
  if (length >= 180) return 8;
  if (length >= 90) return 5;
  if (length >= 40) return 2;
  return 0;
};

const photoPoints = (images = []) => {
  const count = Array.isArray(images) ? images.length : 0;
  if (count >= 5) return 8;
  if (count >= 3) return 6;
  if (count >= 1) return 3;
  return 0;
};

const textThresholdPoints = (text, threshold, maxPoints, partialPoints = 1) => {
  const length = asText(text).length;
  if (length >= threshold) return maxPoints;
  if (length >= Math.round(threshold / 2)) return Math.min(partialPoints, maxPoints);
  return 0;
};

export const getSaleFieldInsights = (formData = {}, language = 'fr') => {
  const fr = language === 'fr';
  return {
    title: fieldInsight(hasValue(formData.title) ? 16 : 0, 16, {
      missing: fr ? 'Ajoutez un titre clair et spécifique.' : 'Add a clear, specific title.',
      completed: fr ? 'Titre clair: excellente première impression.' : 'Clear title: excellent first impression.'
    }),
    sector: fieldInsight(hasValue(formData.sector) ? 12 : 0, 12, {
      missing: fr ? 'Choisissez un secteur pour mieux cibler les acheteurs.' : 'Pick a sector to target buyers better.',
      completed: fr ? 'Secteur défini: le ciblage est plus précis.' : 'Sector set: targeting is more accurate.'
    }),
    location: fieldInsight(hasValue(formData.location) ? 10 : 0, 10, {
      missing: fr ? 'Renseignez la localisation de l’activité.' : 'Add the business location.',
      completed: fr ? 'Localisation ajoutée: visibilité locale renforcée.' : 'Location added: stronger local visibility.'
    }),
    asking_price: fieldInsight(hasValue(formData.asking_price) ? 11 : 0, 11, {
      missing: fr ? 'Indiquez un prix de cession réaliste.' : 'Set a realistic asking price.',
      completed: fr ? 'Prix renseigné: plus de crédibilité immédiate.' : 'Price set: immediate credibility boost.'
    }),
    description: fieldInsight(descriptionPoints(formData.description), 10, {
      missing: fr ? 'Détaillez l’activité (offre, clients, historique).' : 'Describe operations, customers, and history.',
      completed: fr ? 'Description détaillée: annonce plus convaincante.' : 'Detailed description: stronger listing.'
    }),
    annual_revenue: fieldInsight(hasValue(formData.annual_revenue) ? 4 : 0, 4, {
      missing: fr ? 'Ajoutez le CA annuel pour attirer des profils qualifiés.' : 'Add annual revenue to attract qualified buyers.',
      completed: fr ? 'CA ajouté: lecture financière facilitée.' : 'Revenue added: easier financial screening.'
    }),
    ebitda: fieldInsight(hasValue(formData.ebitda) ? 3 : 0, 3, {
      missing: fr ? 'Ajoutez l’EBITDA pour renforcer la transparence.' : 'Add EBITDA to increase transparency.',
      completed: fr ? 'EBITDA renseigné: meilleure projection de rentabilité.' : 'EBITDA set: better profitability projection.'
    }),
    employees: fieldInsight(hasValue(formData.employees) ? 3 : 0, 3, {
      missing: fr ? 'Précisez l’effectif de l’entreprise.' : 'Specify current team size.',
      completed: fr ? 'Effectif précisé: structure plus lisible.' : 'Team size set: clearer business profile.'
    }),
    images: fieldInsight(photoPoints(formData.images), 8, {
      missing: fr ? 'Ajoutez des photos (idéalement 3+) pour rassurer.' : 'Add photos (ideally 3+) to build trust.',
      completed: fr ? 'Photos ajoutées: annonce plus engageante.' : 'Photos added: listing is more engaging.'
    }),
    market_position: fieldInsight(textThresholdPoints(formData.market_position, 30, 4, 1), 4, {
      missing: fr ? 'Expliquez votre positionnement sur le marché.' : 'Explain your market positioning.',
      completed: fr ? 'Positionnement clair: valeur mieux perçue.' : 'Clear positioning: value proposition is stronger.'
    }),
    competitive_advantages: fieldInsight(textThresholdPoints(formData.competitive_advantages, 30, 4, 1), 4, {
      missing: fr ? 'Décrivez vos avantages concurrentiels.' : 'Describe your competitive advantages.',
      completed: fr ? 'Avantages concurrentiels visibles: différenciation forte.' : 'Advantages visible: stronger differentiation.'
    }),
    growth_opportunities: fieldInsight(textThresholdPoints(formData.growth_opportunities, 30, 3, 1), 3, {
      missing: fr ? 'Listez des opportunités de croissance.' : 'List growth opportunities.',
      completed: fr ? 'Croissance future détaillée: projection plus attractive.' : 'Future growth detailed: more attractive upside.'
    }),
    customer_base: fieldInsight(textThresholdPoints(formData.customer_base, 30, 3, 1), 3, {
      missing: fr ? 'Décrivez votre base clients (B2B/B2C, fidélité).' : 'Describe your customer base (B2B/B2C, loyalty).',
      completed: fr ? 'Base clients précisée: risque perçu réduit.' : 'Customer base described: lower perceived risk.'
    }),
    legal_structure: fieldInsight(hasValue(formData.legal_structure) ? 2 : 0, 2, {
      missing: fr ? 'Ajoutez la structure juridique.' : 'Add legal structure.',
      completed: fr ? 'Structure juridique renseignée.' : 'Legal structure added.'
    }),
    registration_number: fieldInsight(asText(formData.registration_number).length >= 6 ? 2 : 0, 2, {
      missing: fr ? 'Renseignez le numéro d’immatriculation.' : 'Provide registration number.',
      completed: fr ? 'Immatriculation renseignée: confiance renforcée.' : 'Registration set: stronger trust.'
    }),
    lease_info: fieldInsight(asText(formData.lease_info).length >= 20 ? 1 : 0, 1, {
      missing: fr ? 'Ajoutez des infos de bail si pertinent.' : 'Add lease details if relevant.',
      completed: fr ? 'Informations de bail ajoutées.' : 'Lease information added.'
    }),
    licenses: fieldInsight(asText(formData.licenses).length >= 15 ? 1 : 0, 1, {
      missing: fr ? 'Indiquez les licences/autorisations nécessaires.' : 'Specify required licenses/permits.',
      completed: fr ? 'Licences/autorisations renseignées.' : 'Licenses/permits provided.'
    }),
    year_founded: fieldInsight(hasValue(formData.year_founded) ? 1 : 0, 1, {
      missing: fr ? 'Ajoutez l’année de création.' : 'Add founding year.',
      completed: fr ? 'Ancienneté renseignée.' : 'Business seniority provided.'
    }),
    reason_for_sale: fieldInsight(hasValue(formData.reason_for_sale) ? 1 : 0, 1, {
      missing: fr ? 'Précisez la raison de la cession.' : 'Specify reason for sale.',
      completed: fr ? 'Contexte de cession clarifié.' : 'Sale context clarified.'
    }),
    business_type: fieldInsight(hasValue(formData.business_type) ? 1 : 0, 1, {
      missing: fr ? 'Choisissez un type de cession.' : 'Choose a business transfer type.',
      completed: fr ? 'Type de cession défini.' : 'Transfer type defined.'
    })
  };
};

const suggestSaleActions = (fieldInsights = {}, language = 'fr') => {
  return Object.entries(fieldInsights)
    .map(([key, value]) => ({ key, points: value.missing, text: value.tipWhenMissing }))
    .filter((item) => item.points > 0 && item.text)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map((item) => ({ ...item, text: item.text }));
};

const computeBuyerScore = (formData = {}, language = 'fr') => {
  const essential = {
    title: hasValue(formData.title) ? 20 : 0,
    description: hasValue(formData.description) ? 12 : 0,
    sectors: hasValue(formData.buyer_sectors_interested) ? 15 : 0,
    business_type_sought: hasValue(formData.business_type_sought) ? 10 : 0,
    profile: hasValue(formData.buyer_profile_type) ? 8 : 0
  };

  const quality = {
    budget: hasValue(formData.buyer_budget_min) || hasValue(formData.buyer_budget_max) ? 12 : 0,
    investment: hasValue(formData.buyer_investment_available) ? 8 : 0,
    criteria: hasValue(formData.buyer_revenue_min) || hasValue(formData.buyer_revenue_max) || hasValue(formData.buyer_employees_min) || hasValue(formData.buyer_employees_max) ? 10 : 0
  };

  const trust = {
    locations: hasValue(formData.buyer_locations) ? 10 : 0,
    profile_media: hasValue(formData.buyer_image) ? 3 : 0,
    document: hasValue(formData.buyer_document_url) ? 2 : 0
  };

  const sectionTotals = { essential: 65, quality: 30, trust: 15 };
  const earnedBySection = {
    essential: Object.values(essential).reduce((sum, value) => sum + value, 0),
    quality: Object.values(quality).reduce((sum, value) => sum + value, 0),
    trust: Object.values(trust).reduce((sum, value) => sum + value, 0)
  };

  const rawScore = earnedBySection.essential + earnedBySection.quality + earnedBySection.trust;
  const score = clampScore((rawScore / 110) * 100);
  const tier = getTier(score, language);
  const nextMilestone = nextMilestoneFor(score);

  return {
    score,
    tier,
    nextMilestone,
    pointsToNextMilestone: nextMilestone ? Math.max(0, nextMilestone - score) : 0,
    sectionTotals,
    earnedBySection,
    details: { essential, quality, trust },
    fieldInsights: {},
    suggestions: [
      !hasValue(formData.buyer_locations)
        ? {
            key: 'buyer_locations',
            points: 10,
            text: language === 'fr' ? 'Ajoutez des lieux d’intérêt.' : 'Add target locations.'
          }
        : null,
      !hasValue(formData.buyer_investment_available)
        ? {
            key: 'buyer_investment_available',
            points: 8,
            text: language === 'fr' ? 'Renseignez votre financement disponible.' : 'Add available investment.'
          }
        : null,
      !hasValue(formData.buyer_document_url)
        ? {
            key: 'buyer_document_url',
            points: 2,
            text: language === 'fr' ? 'Ajoutez un document (CV/teaser).' : 'Add a document (CV/teaser).'
          }
        : null
    ].filter(Boolean).slice(0, 3)
  };
};

export const computeListingCompletionScore = (formData = {}, language = 'fr', announcementType = 'sale') => {
  if (announcementType !== 'sale') {
    return computeBuyerScore(formData, language);
  }

  const fieldInsights = getSaleFieldInsights(formData, language);

  const sectionKeys = {
    essential: ['title', 'sector', 'location', 'asking_price'],
    quality: ['description', 'annual_revenue', 'ebitda', 'employees', 'images'],
    trust: ['market_position', 'competitive_advantages', 'growth_opportunities', 'customer_base', 'legal_structure', 'registration_number', 'lease_info', 'licenses', 'year_founded', 'reason_for_sale', 'business_type']
  };

  const sectionTotals = {
    essential: sectionKeys.essential.reduce((sum, key) => sum + (fieldInsights[key]?.maxPoints || 0), 0),
    quality: sectionKeys.quality.reduce((sum, key) => sum + (fieldInsights[key]?.maxPoints || 0), 0),
    trust: sectionKeys.trust.reduce((sum, key) => sum + (fieldInsights[key]?.maxPoints || 0), 0)
  };

  const earnedBySection = {
    essential: sectionKeys.essential.reduce((sum, key) => sum + (fieldInsights[key]?.points || 0), 0),
    quality: sectionKeys.quality.reduce((sum, key) => sum + (fieldInsights[key]?.points || 0), 0),
    trust: sectionKeys.trust.reduce((sum, key) => sum + (fieldInsights[key]?.points || 0), 0)
  };

  const score = clampScore(
    Object.values(fieldInsights).reduce((sum, insight) => sum + (insight?.points || 0), 0)
  );

  const tier = getTier(score, language);
  const nextMilestone = nextMilestoneFor(score);

  return {
    score,
    tier,
    nextMilestone,
    pointsToNextMilestone: nextMilestone ? Math.max(0, nextMilestone - score) : 0,
    sectionTotals,
    earnedBySection,
    details: {
      essential: Object.fromEntries(sectionKeys.essential.map((key) => [key, fieldInsights[key]?.points || 0])),
      quality: Object.fromEntries(sectionKeys.quality.map((key) => [key, fieldInsights[key]?.points || 0])),
      trust: Object.fromEntries(sectionKeys.trust.map((key) => [key, fieldInsights[key]?.points || 0]))
    },
    fieldInsights,
    suggestions: suggestSaleActions(fieldInsights, language)
  };
};
