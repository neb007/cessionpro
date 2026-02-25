import {
  SMART_MATCHING_LOCATIONS,
  SMART_MATCHING_MIN_SCORE,
  SECTOR_COMPATIBILITY,
} from '@/constants/smartMatchingConfig';

// ── Helpers ───────────────────────────────────────────────────────────────────

export const normalize = (value) => String(value || '').trim().toLowerCase();

export const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export const isRangeActive = (minValue, maxValue) => minValue !== '' || maxValue !== '';

export const getListingBudget = (listing, mode) => {
  const askingPrice = toNumber(listing.asking_price);
  const buyerBudgetMin = toNumber(listing.buyer_budget_min);
  const buyerBudgetMax = toNumber(listing.buyer_budget_max);
  const buyerInvestment = toNumber(listing.buyer_investment_available);

  if (mode === 'seller') {
    return buyerBudgetMax || buyerInvestment || buyerBudgetMin || askingPrice;
  }

  return askingPrice || buyerInvestment || buyerBudgetMax || buyerBudgetMin;
};

export const evaluateRangeScore = ({ value, min, max, weight, tolerance = 0.15 }) => {
  const hasMin = min !== null;
  const hasMax = max !== null;

  if (!hasMin && !hasMax) {
    return { points: 0, matched: false, partial: false, missing: false };
  }

  if (value === null) {
    return { points: 0, matched: false, partial: false, missing: true };
  }

  let exact = true;
  let partial = true;

  if (hasMin) {
    exact = exact && value >= min;
    partial = partial && value >= min * (1 - tolerance);
  }

  if (hasMax) {
    exact = exact && value <= max;
    partial = partial && value <= max * (1 + tolerance);
  }

  if (exact) {
    return { points: weight, matched: true, partial: false, missing: false };
  }

  if (partial) {
    return { points: Math.round(weight * 0.55), matched: true, partial: true, missing: false };
  }

  return { points: 0, matched: false, partial: false, missing: false };
};

// ── Criteria-vs-Listing scoring (SmartMatching page) ──────────────────────────

/**
 * Score a listing against user-defined criteria.
 * @param {Object} params
 * @param {Object} params.criteria - User criteria (from DEFAULT_SMART_MATCHING_CRITERIA shape)
 * @param {Object} params.listing  - Business listing row
 * @param {string} params.mode     - 'buyer' | 'seller'
 * @param {string} params.language - 'fr' | 'en'
 * @param {number} params.activeCriteriaCount - Number of active criteria (for totalCriteria output)
 * @returns {{ score: number, confidence: number, matchedCriteria: number, totalCriteria: number, highlights: string[], missingFields: string[] }}
 */
export function scoreCriteriaVsListing({ criteria, listing, mode, language = 'fr', activeCriteriaCount = 0 }) {
  let points = 0;
  let totalWeight = 0;
  let matchedCriteria = 0;
  const highlights = [];
  const missingFields = [];

  // ── Sector ────────────────────────────────────────────────────────────────
  const sectorCriteria = mode === 'seller'
    ? (criteria.buyerSectorsInterested?.length ? criteria.buyerSectorsInterested : criteria.sectors)
    : criteria.sectors;

  if (sectorCriteria.length > 0) {
    const weight = 24;
    totalWeight += weight;

    const listingSectorBlob = mode === 'seller'
      ? normalize((Array.isArray(listing.buyer_sectors_interested) ? listing.buyer_sectors_interested : []).join(' '))
      : normalize(listing.sector);

    if (!listingSectorBlob) {
      missingFields.push(language === 'fr' ? 'secteur' : 'sector');
    } else {
      const exactMatch = sectorCriteria.some((sector) => listingSectorBlob.includes(normalize(sector)));
      if (exactMatch) {
        points += weight;
        matchedCriteria += 1;
        highlights.push(language === 'fr' ? 'Secteur compatible' : 'Sector fit');
      } else {
        // Check sector compatibility matrix
        const compatibleMatch = sectorCriteria.some((sector) => {
          const compatibles = SECTOR_COMPATIBILITY[normalize(sector)] || [];
          return compatibles.some((compat) => listingSectorBlob.includes(normalize(compat)));
        });
        if (compatibleMatch) {
          points += Math.round(weight * 0.6);
          matchedCriteria += 1;
          highlights.push(language === 'fr' ? 'Secteur connexe' : 'Related sector');
        }
      }
    }
  }

  // ── Location ──────────────────────────────────────────────────────────────
  const locationCriteria = mode === 'seller'
    ? (criteria.buyerLocations?.length ? criteria.buyerLocations : criteria.locations)
    : criteria.locations;

  if (locationCriteria.length > 0) {
    const weight = 16;
    totalWeight += weight;

    const listingLocationBlob = mode === 'seller'
      ? normalize((Array.isArray(listing.buyer_locations) ? listing.buyer_locations : []).join(' '))
      : normalize([listing.location, listing.region, listing.country].filter(Boolean).join(' '));

    if (!listingLocationBlob) {
      missingFields.push(language === 'fr' ? 'localisation' : 'location');
    } else {
      const matched = locationCriteria.some((locValue) => {
        const option = SMART_MATCHING_LOCATIONS.find((loc) => normalize(loc.value) === normalize(locValue));
        const probes = [locValue, option?.label].filter(Boolean).map(normalize);
        return probes.some((probe) => listingLocationBlob.includes(probe));
      });

      if (matched) {
        points += weight;
        matchedCriteria += 1;
        highlights.push(language === 'fr' ? 'Zone géographique cohérente' : 'Geographic fit');
      }
    }
  }

  // ── Buyer profile type (seller mode only) ─────────────────────────────────
  if (mode === 'seller' && criteria.buyerProfileType) {
    const weight = 8;
    totalWeight += weight;

    const listingBuyerProfileType = normalize(listing.buyer_profile_type);
    if (!listingBuyerProfileType) {
      missingFields.push(language === 'fr' ? 'profil acquéreur' : 'buyer profile');
    } else if (listingBuyerProfileType === normalize(criteria.buyerProfileType)) {
      points += weight;
      matchedCriteria += 1;
      highlights.push(language === 'fr' ? 'Profil acquéreur aligné' : 'Buyer profile aligned');
    }
  }

  // ── Business type sought (seller mode only) ───────────────────────────────
  if (mode === 'seller' && criteria.businessTypeSought) {
    const weight = 8;
    totalWeight += weight;

    const listingBusinessTypeSought = normalize(listing.business_type_sought);
    if (!listingBusinessTypeSought) {
      missingFields.push(language === 'fr' ? 'type recherché' : 'sought type');
    } else if (listingBusinessTypeSought === normalize(criteria.businessTypeSought)) {
      points += weight;
      matchedCriteria += 1;
      highlights.push(language === 'fr' ? 'Type de cession recherché aligné' : 'Sought business type aligned');
    }
  }

  // ── Seller business type (buyer mode only) ────────────────────────────────
  if (mode === 'buyer' && criteria.sellerBusinessType) {
    const weight = 8;
    totalWeight += weight;

    const listingSellerBusinessType = normalize(listing.seller_business_type || listing.business_type);
    if (!listingSellerBusinessType) {
      missingFields.push(language === 'fr' ? 'type de cession' : 'sell-side type');
    } else if (listingSellerBusinessType === normalize(criteria.sellerBusinessType)) {
      points += weight;
      matchedCriteria += 1;
      highlights.push(language === 'fr' ? 'Type de cession compatible' : 'Sell-side business type aligned');
    }
  }

  // ── Budget / Price ────────────────────────────────────────────────────────
  if (isRangeActive(criteria.minPrice, criteria.maxPrice)) {
    const weight = 24;
    totalWeight += weight;

    const budgetScore = evaluateRangeScore({
      value: getListingBudget(listing, mode),
      min: toNumber(criteria.minPrice),
      max: toNumber(criteria.maxPrice),
      weight,
      tolerance: 0.2,
    });

    points += budgetScore.points;
    if (budgetScore.matched) {
      matchedCriteria += 1;
      highlights.push(
        budgetScore.partial
          ? language === 'fr' ? 'Budget proche de votre cible' : 'Budget close to your target'
          : language === 'fr' ? 'Budget dans votre fourchette' : 'Budget inside your range'
      );
    }
    if (budgetScore.missing) {
      missingFields.push(language === 'fr' ? 'budget' : 'budget');
    }
  }

  // ── Employees ─────────────────────────────────────────────────────────────
  if (isRangeActive(criteria.minEmployees, criteria.maxEmployees)) {
    const weight = 10;
    totalWeight += weight;
    const employeesScore = evaluateRangeScore({
      value: toNumber(listing.employees),
      min: toNumber(criteria.minEmployees),
      max: toNumber(criteria.maxEmployees),
      weight,
    });

    points += employeesScore.points;
    if (employeesScore.matched) {
      matchedCriteria += 1;
      highlights.push(language === 'fr' ? 'Effectifs alignés' : 'Team size aligned');
    }
    if (employeesScore.missing) {
      missingFields.push(language === 'fr' ? 'effectifs' : 'employees');
    }
  }

  // ── Year founded ──────────────────────────────────────────────────────────
  if (isRangeActive(criteria.minYear, criteria.maxYear)) {
    const weight = 8;
    totalWeight += weight;
    const yearScore = evaluateRangeScore({
      value: toNumber(listing.year_founded),
      min: toNumber(criteria.minYear),
      max: toNumber(criteria.maxYear),
      weight,
      tolerance: 0.05,
    });

    points += yearScore.points;
    if (yearScore.matched) {
      matchedCriteria += 1;
      highlights.push(language === 'fr' ? 'Maturité entreprise cohérente' : 'Business maturity aligned');
    }
    if (yearScore.missing) {
      missingFields.push(language === 'fr' ? 'année' : 'year');
    }
  }

  // ── Revenue (CA) ──────────────────────────────────────────────────────────
  if (isRangeActive(criteria.minCA, criteria.maxCA)) {
    const weight = 10;
    totalWeight += weight;
    const revenueScore = evaluateRangeScore({
      value: toNumber(listing.annual_revenue),
      min: toNumber(criteria.minCA),
      max: toNumber(criteria.maxCA),
      weight,
    });

    points += revenueScore.points;
    if (revenueScore.matched) {
      matchedCriteria += 1;
      highlights.push(language === 'fr' ? 'Chiffre d\'affaires compatible' : 'Revenue compatible');
    }
    if (revenueScore.missing) {
      missingFields.push(language === 'fr' ? 'CA' : 'revenue');
    }
  }

  // ── EBITDA ────────────────────────────────────────────────────────────────
  if (isRangeActive(criteria.minEBITDA, criteria.maxEBITDA)) {
    const weight = 8;
    totalWeight += weight;
    const ebitdaScore = evaluateRangeScore({
      value: toNumber(listing.ebitda),
      min: toNumber(criteria.minEBITDA),
      max: toNumber(criteria.maxEBITDA),
      weight,
    });

    points += ebitdaScore.points;
    if (ebitdaScore.matched) {
      matchedCriteria += 1;
      highlights.push(language === 'fr' ? 'EBITDA aligné' : 'EBITDA aligned');
    }
    if (ebitdaScore.missing) {
      missingFields.push(language === 'fr' ? 'EBITDA' : 'EBITDA');
    }
  }

  // ── Final score ───────────────────────────────────────────────────────────
  const score = totalWeight > 0 ? Math.round((points / totalWeight) * 100) : 0;
  const confidence = totalWeight > 0
    ? Math.max(20, Math.round(((totalWeight - missingFields.length * 4) / totalWeight) * 100))
    : 0;

  return {
    score,
    confidence,
    matchedCriteria,
    totalCriteria: totalWeight > 0 ? activeCriteriaCount : 0,
    highlights,
    missingFields,
  };
}

// ── Listing-vs-Listing scoring (Edge Function, similar listings) ──────────────

/**
 * Score compatibility between two listings.
 * Used by the Edge Function for email notifications and for "similar listings" suggestions.
 * @param {Object} listing1 - Source listing
 * @param {Object} listing2 - Candidate listing
 * @returns {{ score: number, explanation: string, criteriaMatched: number }}
 */
export function scoreListingVsListing(listing1, listing2) {
  let score = 0;
  let criteriaMatched = 0;
  const explanations = [];

  // ── Budget (40 points max) ────────────────────────────────────────────────
  if (listing1.asking_price && listing2.asking_price) {
    const priceDiff = Math.abs(listing1.asking_price - listing2.asking_price);
    const priceMatch = (priceDiff / Math.max(listing1.asking_price, listing2.asking_price)) * 100;

    if (priceMatch <= 10) {
      score += 40;
      criteriaMatched++;
      explanations.push('Budget parfaitement aligné');
    } else if (priceMatch <= 25) {
      score += 25;
      criteriaMatched++;
      explanations.push('Budget très proche');
    } else if (priceMatch <= 50) {
      score += 15;
      criteriaMatched++;
      explanations.push('Budget acceptable');
    }
  }

  // ── Sector (30 points max) ────────────────────────────────────────────────
  if (listing1.sector && listing2.sector) {
    const sector1 = normalize(listing1.sector);
    const sector2 = normalize(listing2.sector);

    if (sector1 === sector2) {
      score += 30;
      criteriaMatched++;
      explanations.push(`Même secteur: ${listing1.sector}`);
    } else {
      const isCompatible =
        (SECTOR_COMPATIBILITY[sector1] || []).some((s) => sector2.includes(s)) ||
        (SECTOR_COMPATIBILITY[sector2] || []).some((s) => sector1.includes(s));

      if (isCompatible) {
        score += 18;
        criteriaMatched++;
        explanations.push('Secteurs compatibles');
      }
    }
  }

  // ── Location (20 points max) ──────────────────────────────────────────────
  if (listing1.location && listing2.location) {
    const loc1 = normalize(listing1.location);
    const loc2 = normalize(listing2.location);

    if (loc1 === loc2) {
      score += 20;
      criteriaMatched++;
      explanations.push(`Même localisation: ${listing1.location}`);
    } else if (listing1.region && listing2.region && listing1.region === listing2.region) {
      score += 12;
      criteriaMatched++;
      explanations.push(`Même région: ${listing1.region}`);
    } else if (listing1.country && listing2.country && listing1.country === listing2.country) {
      score += 8;
      criteriaMatched++;
      explanations.push('Même pays');
    }
  }

  // ── Employees (5 points max) ──────────────────────────────────────────────
  if (listing1.employees && listing2.employees) {
    const empDiff = Math.abs(listing1.employees - listing2.employees);
    if (empDiff <= 3) {
      score += 5;
      criteriaMatched++;
      explanations.push(`Effectifs similaires: ~${listing1.employees} employés`);
    }
  }

  // ── Revenue (5 points bonus) ──────────────────────────────────────────────
  if (listing1.annual_revenue && listing2.annual_revenue) {
    const revenueDiff = Math.abs(listing1.annual_revenue - listing2.annual_revenue);
    const revenueMatch = (revenueDiff / Math.max(listing1.annual_revenue, listing2.annual_revenue)) * 100;

    if (revenueMatch <= 20) {
      score += 5;
      criteriaMatched++;
      explanations.push('Chiffre d\'affaires compatible');
    }
  }

  score = Math.min(score, 100);

  return {
    score: Math.round(score),
    explanation: explanations.length > 0
      ? explanations.join(' • ')
      : 'Profils complémentaires',
    criteriaMatched,
  };
}

/**
 * Find and rank matches for a listing against all other listings.
 * @param {Object} selectedListing - The source listing
 * @param {Array} allListings - All candidate listings
 * @returns {Array} Matches sorted by score descending
 */
export function findListingMatches(selectedListing, allListings) {
  if (!selectedListing || !allListings || allListings.length === 0) {
    return [];
  }

  return allListings
    .filter((listing) => listing.id !== selectedListing.id)
    .map((listing) => ({
      ...listing,
      smartMatchScore: scoreListingVsListing(selectedListing, listing),
    }))
    .sort((a, b) => b.smartMatchScore.score - a.smartMatchScore.score);
}
