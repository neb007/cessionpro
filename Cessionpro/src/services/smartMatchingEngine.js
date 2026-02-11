/**
 * Smart Matching Engine - Scoring Simple Sans NLP
 * Matching bidirectionnel: Acheteur ↔ Vendeur
 */

/**
 * Calcule le score de compatibilité entre deux annonces
 * @param {Object} listing1 - Annonce 1 (acheteur ou vendeur)
 * @param {Object} listing2 - Annonce 2 (vendeur ou acheteur)
 * @returns {Object} { score: 0-100, explanation: string, criteriaMatched: number }
 */
export const calculateSmartMatchScore = (listing1, listing2) => {
  let score = 0;
  let criteriaMatched = 0;
  const explanations = [];

  // ===== 1. BUDGET (40 points max) =====
  if (listing1.asking_price && listing2.asking_price) {
    const priceDiff = Math.abs(listing1.asking_price - listing2.asking_price);
    const priceMatch = (priceDiff / Math.max(listing1.asking_price, listing2.asking_price)) * 100;
    
    if (priceMatch <= 10) {
      score += 40;
      criteriaMatched++;
      explanations.push("💰 Budget parfaitement aligné");
    } else if (priceMatch <= 25) {
      score += 25;
      criteriaMatched++;
      explanations.push("💰 Budget très proche");
    } else if (priceMatch <= 50) {
      score += 15;
      criteriaMatched++;
      explanations.push("💰 Budget acceptable");
    }
  }

  // ===== 2. SECTEUR D'ACTIVITÉ (30 points max) =====
  if (listing1.sector && listing2.sector) {
    const sector1 = (listing1.sector || "").toLowerCase().trim();
    const sector2 = (listing2.sector || "").toLowerCase().trim();
    
    if (sector1 === sector2) {
      score += 30;
      criteriaMatched++;
      explanations.push(`🏢 Même secteur: ${listing1.sector}`);
    } else {
      // Vérifier si secteur compatible (ex: "café" et "restauration")
      const compatibleSectors = {
        "restauration": ["café", "pizzeria", "boulangerie", "restaurant"],
        "commerce": ["retail", "boutique", "ecommerce"],
        "services": ["consulting", "conseils", "agence"],
      };
      
      let isCompatible = false;
      for (const [key, compatible] of Object.entries(compatibleSectors)) {
        if (sector1.includes(key) && compatible.some(s => sector2.includes(s))) {
          isCompatible = true;
          break;
        }
        if (sector2.includes(key) && compatible.some(s => sector1.includes(s))) {
          isCompatible = true;
          break;
        }
      }
      
      if (isCompatible) {
        score += 15;
        criteriaMatched++;
        explanations.push("🏢 Secteurs compatibles");
      }
    }
  }

  // ===== 3. LOCALISATION (20 points max) =====
  if (listing1.location && listing2.location) {
    const loc1 = (listing1.location || "").toLowerCase().trim();
    const loc2 = (listing2.location || "").toLowerCase().trim();
    
    if (loc1 === loc2) {
      score += 20;
      criteriaMatched++;
      explanations.push(`📍 Même localisation: ${listing1.location}`);
    } else if (listing1.region && listing2.region && listing1.region === listing2.region) {
      score += 12;
      criteriaMatched++;
      explanations.push(`📍 Même région: ${listing1.region}`);
    } else if (listing1.country && listing2.country && listing1.country === listing2.country) {
      score += 8;
      criteriaMatched++;
      explanations.push(`📍 Même pays`);
    }
  }

  // ===== 4. EFFECTIFS (5 points max) =====
  if (listing1.employees && listing2.employees) {
    const empDiff = Math.abs(listing1.employees - listing2.employees);
    if (empDiff <= 3) {
      score += 5;
      criteriaMatched++;
      explanations.push(`👥 Effectifs similaires: ~${listing1.employees} employés`);
    }
  }

  // ===== 5. REVENU ANNUEL / EBITDA (5 points bonus) =====
  if (listing1.annual_revenue && listing2.annual_revenue) {
    const revenueDiff = Math.abs(listing1.annual_revenue - listing2.annual_revenue);
    const revenueMatch = (revenueDiff / Math.max(listing1.annual_revenue, listing2.annual_revenue)) * 100;
    
    if (revenueMatch <= 20) {
      score += 5;
      criteriaMatched++;
      explanations.push("💵 Chiffre d'affaires compatible");
    }
  }

  // Cap le score à 100
  score = Math.min(score, 100);

  return {
    score: Math.round(score),
    explanation: explanations.length > 0 
      ? explanations.join(" • ") 
      : "Profils complémentaires",
    criteriaMatched: criteriaMatched,
  };
};

/**
 * Récupère tous les matches pour une annonce donnée
 * @param {Object} selectedListing - L'annonce de l'utilisateur
 * @param {Array} allListings - Toutes les autres annonces
 * @returns {Array} Matches triés par score décroissant
 */
export const findMatches = (selectedListing, allListings) => {
  if (!selectedListing || !allListings || allListings.length === 0) {
    return [];
  }

  const matches = allListings
    .filter(listing => listing.id !== selectedListing.id) // Exclure sa propre annonce
    .map(listing => ({
      ...listing,
      smartMatchScore: calculateSmartMatchScore(selectedListing, listing),
    }))
    .sort((a, b) => b.smartMatchScore.score - a.smartMatchScore.score); // Tri décroissant

  return matches;
};

/**
 * Filtre les matches selon les critères de l'utilisateur
 * @param {Array} matches - Les matches calculés
 * @param {Object} filters - Filtres appliqués
 * @returns {Array} Matches filtrés
 */
export const filterMatches = (matches, filters = {}) => {
  return matches.filter(match => {
    // Filtre par score minimum
    if (filters.minScore && match.smartMatchScore.score < filters.minScore) {
      return false;
    }

    // Filtre par secteur
    if (filters.sector && match.sector?.toLowerCase() !== filters.sector.toLowerCase()) {
      return false;
    }

    // Filtre par localisation
    if (filters.location && !match.location?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Filtre par budget
    if (filters.minBudget && match.asking_price < filters.minBudget) {
      return false;
    }
    if (filters.maxBudget && match.asking_price > filters.maxBudget) {
      return false;
    }

    return true;
  });
};
