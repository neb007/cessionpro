// Shared smart matching logic for Edge Functions.
// Keep in sync with src/services/smartMatchingEngine.js

export type Listing = {
  id?: string;
  asking_price?: number | null;
  sector?: string | null;
  location?: string | null;
  region?: string | null;
  country?: string | null;
  employees?: number | null;
  annual_revenue?: number | null;
};

export type SmartMatchResult = {
  score: number;
  explanation: string;
  criteriaMatched: number;
};

export const calculateSmartMatchScore = (
  listing1: Listing,
  listing2: Listing
): SmartMatchResult => {
  let score = 0;
  let criteriaMatched = 0;
  const explanations: string[] = [];

  if (listing1.asking_price && listing2.asking_price) {
    const priceDiff = Math.abs(listing1.asking_price - listing2.asking_price);
    const priceMatch =
      (priceDiff / Math.max(listing1.asking_price, listing2.asking_price)) * 100;

    if (priceMatch <= 10) {
      score += 40;
      criteriaMatched++;
      explanations.push('Budget parfaitement aligne');
    } else if (priceMatch <= 25) {
      score += 25;
      criteriaMatched++;
      explanations.push('Budget tres proche');
    } else if (priceMatch <= 50) {
      score += 15;
      criteriaMatched++;
      explanations.push('Budget acceptable');
    }
  }

  if (listing1.sector && listing2.sector) {
    const sector1 = (listing1.sector || '').toLowerCase().trim();
    const sector2 = (listing2.sector || '').toLowerCase().trim();

    if (sector1 === sector2) {
      score += 30;
      criteriaMatched++;
      explanations.push(`Meme secteur: ${listing1.sector}`);
    } else {
      const compatibleSectors: Record<string, string[]> = {
        restauration: ['cafe', 'pizzeria', 'boulangerie', 'restaurant'],
        commerce: ['retail', 'boutique', 'ecommerce'],
        services: ['consulting', 'conseils', 'agence']
      };

      let isCompatible = false;
      for (const [key, compatible] of Object.entries(compatibleSectors)) {
        if (sector1.includes(key) && compatible.some((s) => sector2.includes(s))) {
          isCompatible = true;
          break;
        }
        if (sector2.includes(key) && compatible.some((s) => sector1.includes(s))) {
          isCompatible = true;
          break;
        }
      }

      if (isCompatible) {
        score += 15;
        criteriaMatched++;
        explanations.push('Secteurs compatibles');
      }
    }
  }

  if (listing1.location && listing2.location) {
    const loc1 = (listing1.location || '').toLowerCase().trim();
    const loc2 = (listing2.location || '').toLowerCase().trim();

    if (loc1 === loc2) {
      score += 20;
      criteriaMatched++;
      explanations.push(`Meme localisation: ${listing1.location}`);
    } else if (
      listing1.region &&
      listing2.region &&
      listing1.region === listing2.region
    ) {
      score += 12;
      criteriaMatched++;
      explanations.push(`Meme region: ${listing1.region}`);
    } else if (
      listing1.country &&
      listing2.country &&
      listing1.country === listing2.country
    ) {
      score += 8;
      criteriaMatched++;
      explanations.push('Meme pays');
    }
  }

  if (listing1.employees && listing2.employees) {
    const empDiff = Math.abs(listing1.employees - listing2.employees);
    if (empDiff <= 3) {
      score += 5;
      criteriaMatched++;
      explanations.push(`Effectifs similaires: ~${listing1.employees} employes`);
    }
  }

  if (listing1.annual_revenue && listing2.annual_revenue) {
    const revenueDiff = Math.abs(
      listing1.annual_revenue - listing2.annual_revenue
    );
    const revenueMatch =
      (revenueDiff /
        Math.max(listing1.annual_revenue, listing2.annual_revenue)) * 100;

    if (revenueMatch <= 20) {
      score += 5;
      criteriaMatched++;
      explanations.push("Chiffre d'affaires compatible");
    }
  }

  score = Math.min(score, 100);

  return {
    score: Math.round(score),
    explanation: explanations.length > 0 ? explanations.join(' • ') : 'Profils complementaires',
    criteriaMatched
  };
};
