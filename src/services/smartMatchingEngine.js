/**
 * Smart Matching Engine  
 * Moteur de scoring intelligent pour le matching buyer/listings
 */

export function calculateSmartMatchScore(listing, criteria) {
  let totalScore = 0;
  let totalWeight = 0;
  let breakdown = {};
  let explanation = [];
  let criteriaMatched = 0;

  const selectedCriteria = criteria.criteria_selected || [];

  if (selectedCriteria.includes('budget')) {
    const weight = 3;
    if (criteria.budget_min && criteria.budget_max) {
      const score = scoreNumericRange(
        listing.asking_price || 0,
        criteria.budget_min,
        criteria.budget_max,
        0.15
      );
      breakdown.budget = score;
      totalScore += score * weight;
      totalWeight += weight;
      
      if (score >= 70) {
        explanation.push('✅ Budget OK');
        criteriaMatched++;
      } else if (score >= 50) {
        explanation.push('⚠️ Budget partiel');
      } else {
        explanation.push('❌ Budget inadapté');
      }
    }
  }

  if (selectedCriteria.includes('sector')) {
    const weight = 3;
    const sectors = criteria.sectors || [];
    if (sectors.length > 0) {
      const score = sectors.includes(listing.sector) ? 100 : 0;
      breakdown.sector = score;
      totalScore += score * weight;
      totalWeight += weight;
      
      if (score >= 70) {
        explanation.push('✅ Secteur OK');
        criteriaMatched++;
      } else {
        explanation.push('❌ Secteur différent');
      }
    }
  }

  if (selectedCriteria.includes('location')) {
    const weight = 2;
    if (criteria.location) {
      const score = scoreLocation(listing.location || '', criteria.location);
      breakdown.location = score;
      totalScore += score * weight;
      totalWeight += weight;
      
      if (score >= 70) {
        explanation.push('✅ Localisation OK');
        criteriaMatched++;
      } else if (score >= 50) {
        explanation.push('⚠️ Localisation partielle');
      } else {
        explanation.push('❌ Localisation inadaptée');
      }
    }
  }

  if (selectedCriteria.includes('growth_potential')) {
    const weight = 2;
    if (criteria.growth_potential) {
      const score = criteria.growth_potential === listing.growth_potential ? 100 : 70;
      breakdown.growth_potential = score;
      totalScore += score * weight;
      totalWeight += weight;
      
      if (score >= 70) {
        explanation.push('✅ Potentiel OK');
        criteriaMatched++;
      }
    }
  }

  const finalScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) / 100 : 0;

  if (explanation.length === 0) {
    explanation.push('📊 Match à évaluer');
  }

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    breakdown,
    explanation,
    criteriaMatched,
  };
}

function scoreNumericRange(value, min, max, penaltyFactor = 0.15) {
  if (min === null && max === null) return 100;
  if (min === null) return value <= max ? 100 : Math.max(30, 100 - (value - max) * penaltyFactor);
  if (max === null) return value >= min ? 100 : Math.max(30, 100 - (min - value) * penaltyFactor);

  if (value >= min && value <= max) {
    return 100;
  }

  if (value < min) {
    return Math.max(30, 100 - (min - value) * penaltyFactor);
  }

  return Math.max(30, 100 - (value - max) * penaltyFactor);
}

function scoreLocation(listingLocation, criteriaLocation) {
  const listing = (listingLocation || '').toLowerCase().trim();
  const criteria = (criteriaLocation || '').toLowerCase().trim();

  if (!listing || !criteria) return 0;
  if (listing === criteria) return 100;
  if (listing.includes(criteria) || criteria.includes(listing)) return 85;
  if (listing.substring(0, 3) === criteria.substring(0, 3)) return 70;

  return 40;
}
