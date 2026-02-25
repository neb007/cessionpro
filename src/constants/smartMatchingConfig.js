import { EUROPEAN_COUNTRIES } from '@/utils/europeanCountries';
import { FRENCH_DEPARTMENTS } from '@/utils/frenchDepartmentsData';

// ── Secteurs (source unique) ──────────────────────────────────────────────────
export const SMART_MATCHING_SECTORS = [
  { value: 'technology', label: 'Technologie' },
  { value: 'retail', label: 'Commerce' },
  { value: 'hospitality', label: 'Hôtellerie' },
  { value: 'manufacturing', label: 'Industrie' },
  { value: 'services', label: 'Services' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'construction', label: 'Construction' },
  { value: 'transport', label: 'Transport' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'real_estate', label: 'Immobilier' },
  { value: 'finance', label: 'Finance' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'beauty', label: 'Beauté' },
  { value: 'education', label: 'Éducation' },
  { value: 'events', label: 'Événementiel' },
  { value: 'logistics', label: 'Logistique' },
  { value: 'food_beverage', label: 'Alimentaire & Boissons' },
  { value: 'other', label: 'Autre' },
];

// ── Localisations (pays EU + departements FR + villes) ────────────────────────
const SMART_MATCHING_CITY_LOCATIONS = [
  { value: 'paris', label: 'Paris' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'marseille', label: 'Marseille' },
  { value: 'toulouse', label: 'Toulouse' },
  { value: 'nantes', label: 'Nantes' },
  { value: 'bordeaux', label: 'Bordeaux' },
  { value: 'lille', label: 'Lille' },
  { value: 'strasbourg', label: 'Strasbourg' },
];

const SMART_MATCHING_COUNTRY_LOCATIONS = EUROPEAN_COUNTRIES.map((country) => ({
  value: String(country.value || '').toLowerCase(),
  label: country.label,
}));

const SMART_MATCHING_DEPARTMENT_LOCATIONS = FRENCH_DEPARTMENTS.map((department) => ({
  value: String(department.value || '').toLowerCase(),
  label: `${String(department.value || '').toUpperCase()} - ${department.label}`,
}));

const uniqueLocations = (locations) => {
  const map = new Map();
  locations.forEach((location) => {
    const key = String(location.value || '').toLowerCase();
    if (!map.has(key)) {
      map.set(key, { ...location, value: key });
    }
  });
  return Array.from(map.values());
};

export const SMART_MATCHING_LOCATIONS = uniqueLocations([
  ...SMART_MATCHING_COUNTRY_LOCATIONS,
  ...SMART_MATCHING_DEPARTMENT_LOCATIONS,
  ...SMART_MATCHING_CITY_LOCATIONS,
]);

// ── Matrice de compatibilite secteurs ─────────────────────────────────────────
// Match exact = 100% des points, match compatible = 60%, aucun = 0%
export const SECTOR_COMPATIBILITY = {
  retail: ['ecommerce', 'food_beverage'],
  ecommerce: ['retail', 'technology'],
  hospitality: ['food_beverage', 'events'],
  food_beverage: ['hospitality', 'retail', 'agriculture'],
  technology: ['ecommerce', 'services'],
  services: ['technology', 'finance', 'education'],
  logistics: ['transport', 'manufacturing'],
  transport: ['logistics'],
  construction: ['real_estate'],
  real_estate: ['construction', 'finance'],
  finance: ['real_estate', 'services'],
  beauty: ['healthcare', 'retail'],
  healthcare: ['beauty'],
  education: ['services'],
  events: ['hospitality'],
  manufacturing: ['logistics', 'construction'],
  agriculture: ['food_beverage'],
};

// ── Types de profils ──────────────────────────────────────────────────────────
export const SMART_MATCHING_BUYER_PROFILE_TYPES = [
  { value: 'individual', label: 'Reprise personnelle' },
  { value: 'investor', label: 'Investisseur' },
  { value: 'pe_fund', label: 'Fonds de capital-investissement' },
  { value: 'company', label: 'Entreprise' },
  { value: 'other', label: 'Autre' },
];

export const SMART_MATCHING_BUSINESS_TYPES = [
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'fond_de_commerce', label: 'Fond de commerce' },
  { value: 'franchise', label: 'Franchise' },
];

// ── Criteres par defaut ───────────────────────────────────────────────────────
export const DEFAULT_SMART_MATCHING_CRITERIA = {
  sectors: [],
  locations: [],
  minPrice: '',
  maxPrice: '',
  minEmployees: '',
  maxEmployees: '',
  minYear: '',
  maxYear: '',
  minCA: '',
  maxCA: '',
  minEBITDA: '',
  maxEBITDA: '',
  buyerBudgetMin: '',
  buyerBudgetMax: '',
  buyerInvestmentAvailable: '',
  buyerSectorsInterested: [],
  buyerLocations: [],
  buyerEmployeesMin: '',
  buyerEmployeesMax: '',
  buyerRevenueMin: '',
  buyerRevenueMax: '',
  buyerProfileType: '',
  businessTypeSought: '',
  sellerBusinessType: '',
};

// ── Alertes par defaut ────────────────────────────────────────────────────────
export const DEFAULT_SMART_MATCHING_ALERTS = {
  enabled: false,
  frequency: 'disabled', // daily | weekly | disabled
  noEmailWithoutMatches: true,
  updatedAt: null,
};

// ── Scoring ───────────────────────────────────────────────────────────────────
export const SMART_MATCHING_MIN_SCORE = 60;

export const SCORE_COLORS = {
  excellent: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    label: 'Excellent match',
  },
  good: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    label: 'Bon match',
  },
  partial: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600',
    label: 'Match partiel',
  },
  poor: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    label: 'Faible match',
  },
};

export function getScoreColor(score) {
  if (score >= 85) return SCORE_COLORS.excellent;
  if (score >= 70) return SCORE_COLORS.good;
  if (score >= 50) return SCORE_COLORS.partial;
  return SCORE_COLORS.poor;
}

export function getScoreLabel(score) {
  if (score >= 85) return 'Excellent match';
  if (score >= 70) return 'Bon match';
  if (score >= 50) return 'Match partiel';
  return 'Faible match';
}

export function getScoreTone(score) {
  if (score >= 80) {
    return {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      ring: 'ring-emerald-100',
      card: 'border-emerald-200 bg-emerald-50/40',
      accent: 'text-emerald-700',
    };
  }

  if (score >= 60) {
    return {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      ring: 'ring-blue-100',
      card: 'border-blue-200 bg-blue-50/40',
      accent: 'text-blue-700',
    };
  }

  if (score >= 40) {
    return {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      ring: 'ring-amber-100',
      card: 'border-amber-200 bg-amber-50/40',
      accent: 'text-amber-700',
    };
  }

  return {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    ring: 'ring-rose-100',
    card: 'border-rose-200 bg-rose-50/40',
    accent: 'text-rose-700',
  };
}
