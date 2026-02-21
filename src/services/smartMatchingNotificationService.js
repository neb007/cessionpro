const SMART_MATCHING_CRITERIA_STORAGE_PREFIX = 'smartMatchingCriteria';
const SMART_MATCHING_ALERTS_STORAGE_PREFIX = 'smartMatchingAlerts';

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

export const SMART_MATCHING_LOCATIONS = [
  { value: 'france', label: 'France' },
  { value: 'paris', label: 'Paris' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'marseille', label: 'Marseille' },
  { value: 'toulouse', label: 'Toulouse' },
  { value: 'nantes', label: 'Nantes' },
  { value: 'bordeaux', label: 'Bordeaux' },
  { value: 'lille', label: 'Lille' },
  { value: 'strasbourg', label: 'Strasbourg' },
];

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

export const DEFAULT_SMART_MATCHING_ALERTS = {
  enabled: false,
  frequency: 'disabled', // daily | weekly | disabled
  noEmailWithoutMatches: true,
  updatedAt: null,
};

const parseJSON = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const getCriteriaStorageKey = (userId, mode) =>
  `${SMART_MATCHING_CRITERIA_STORAGE_PREFIX}:${userId || 'guest'}:${mode || 'buyer'}`;

export const getAlertsStorageKey = (userId) =>
  `${SMART_MATCHING_ALERTS_STORAGE_PREFIX}:${userId || 'guest'}`;

export function getSmartMatchingCriteria(userId, mode) {
  if (!canUseStorage()) return { ...DEFAULT_SMART_MATCHING_CRITERIA };

  const raw = window.localStorage.getItem(getCriteriaStorageKey(userId, mode));
  return {
    ...DEFAULT_SMART_MATCHING_CRITERIA,
    ...parseJSON(raw, {}),
  };
}

export function saveSmartMatchingCriteria(userId, mode, criteria) {
  if (!canUseStorage()) return;

  const payload = {
    ...DEFAULT_SMART_MATCHING_CRITERIA,
    ...(criteria || {}),
  };

  window.localStorage.setItem(getCriteriaStorageKey(userId, mode), JSON.stringify(payload));
}

export function getSmartMatchingAlertPreferences(userId) {
  if (!canUseStorage()) return { ...DEFAULT_SMART_MATCHING_ALERTS };

  const raw = window.localStorage.getItem(getAlertsStorageKey(userId));
  return {
    ...DEFAULT_SMART_MATCHING_ALERTS,
    ...parseJSON(raw, {}),
  };
}

export function saveSmartMatchingAlertPreferences(userId, alerts) {
  if (!canUseStorage()) return;

  const payload = {
    ...DEFAULT_SMART_MATCHING_ALERTS,
    ...(alerts || {}),
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(getAlertsStorageKey(userId), JSON.stringify(payload));
}

export function getSmartMatchingAlertFrequencyLabel(frequency, language = 'fr') {
  const map = {
    daily: language === 'fr' ? 'Quotidienne' : 'Daily',
    weekly: language === 'fr' ? 'Hebdomadaire' : 'Weekly',
    disabled: language === 'fr' ? 'Désactivée' : 'Disabled',
  };

  return map[frequency] || map.disabled;
}
