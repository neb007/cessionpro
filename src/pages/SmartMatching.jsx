import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Heart,
  Lock,
  MapPin,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { billingService } from '@/services/billingService';
import { favoriteService } from '@/services/favoriteService';
import BusinessCard from '@/components/ui/BusinessCard';
import { toast } from '@/components/ui/use-toast';
import { createBusinessDetailsUrl, createPageUrl } from '@/utils';

const SECTORS = [
  { value: 'technology', label: 'Technologie' },
  { value: 'retail', label: 'Vente au détail' },
  { value: 'hospitality', label: 'Hôtellerie' },
  { value: 'manufacturing', label: 'Fabrication' },
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

const LOCATIONS = [
  { value: 'france', label: 'France' },
  { value: 'paris', label: 'Paris' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'marseille', label: 'Marseille' },
  { value: 'toulouse', label: 'Toulouse' },
  { value: 'nice', label: 'Nice' },
  { value: 'nantes', label: 'Nantes' },
  { value: 'strasbourg', label: 'Strasbourg' },
  { value: 'bordeaux', label: 'Bordeaux' },
  { value: 'lille', label: 'Lille' },
  { value: 'uk', label: 'Royaume-Uni' },
  { value: 'canada', label: 'Canada' },
  { value: 'belgium', label: 'Belgique' },
];

const DEFAULT_CRITERIA = {
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
  buyerSectorsInterested: [],
  buyerLocations: [],
  buyerProfileType: '',
  businessTypeSought: '',
  sellerBusinessType: '',
};

const SMART_MATCHING_MIN_SCORE = 60;

const SMART_MATCHING_PREVIEW_DATA = {
  buyer: [
    {
      titleFr: 'SaaS RH B2B en forte traction',
      titleEn: 'High-growth B2B HR SaaS',
      locationFr: 'Paris, France',
      locationEn: 'Paris, France',
      sectorFr: 'Technologie',
      sectorEn: 'Technology',
      matchBudget: 1850000,
      employees: 24,
      yearFounded: 2018,
      score: 92,
      confidence: 88,
      highlightsFr: ['Secteur compatible', 'Budget dans votre fourchette', 'Croissance du CA cohérente'],
      highlightsEn: ['Sector fit', 'Budget inside your range', 'Revenue growth aligned'],
    },
    {
      titleFr: 'Réseau de 3 boulangeries premium',
      titleEn: 'Premium network of 3 bakeries',
      locationFr: 'Lyon, France',
      locationEn: 'Lyon, France',
      sectorFr: 'Commerce',
      sectorEn: 'Retail',
      matchBudget: 980000,
      employees: 17,
      yearFounded: 2015,
      score: 86,
      confidence: 83,
      highlightsFr: ['Zone géographique cohérente', 'Effectifs alignés', 'Prix demandé attractif'],
      highlightsEn: ['Geographic fit', 'Team size aligned', 'Attractive asking price'],
    },
    {
      titleFr: 'Cabinet de services IT récurrents',
      titleEn: 'Recurring revenue IT services firm',
      locationFr: 'Nantes, France',
      locationEn: 'Nantes, France',
      sectorFr: 'Services',
      sectorEn: 'Services',
      matchBudget: 1320000,
      employees: 31,
      yearFounded: 2012,
      score: 81,
      confidence: 79,
      highlightsFr: ['EBITDA aligné', 'Maturité entreprise cohérente', 'Bon niveau de confiance'],
      highlightsEn: ['EBITDA aligned', 'Business maturity aligned', 'Strong confidence level'],
    },
    {
      titleFr: 'Clinique dentaire multi-praticiens',
      titleEn: 'Multi-practitioner dental clinic',
      locationFr: 'Bordeaux, France',
      locationEn: 'Bordeaux, France',
      sectorFr: 'Santé',
      sectorEn: 'Healthcare',
      matchBudget: 2150000,
      employees: 12,
      yearFounded: 2010,
      score: 77,
      confidence: 74,
      highlightsFr: ['Chiffre d\'affaires compatible', 'Zone recherchée active', 'Profil stable'],
      highlightsEn: ['Revenue compatible', 'Active target area', 'Stable profile'],
    },
  ],
  seller: [
    {
      titleFr: 'Holding familiale orientée croissance externe',
      titleEn: 'Family holding focused on external growth',
      locationFr: 'Île-de-France',
      locationEn: 'Île-de-France',
      sectorFr: 'Technologie & Services',
      sectorEn: 'Technology & Services',
      matchBudget: 3500000,
      employees: 42,
      yearFounded: 2009,
      score: 90,
      confidence: 86,
      highlightsFr: ['Capacité financière validée', 'Secteur compatible', 'Décision rapide (< 60 jours)'],
      highlightsEn: ['Validated financial capacity', 'Sector fit', 'Fast decision timeline (< 60 days)'],
    },
    {
      titleFr: 'Repreneur opérateur dans l\'industrie légère',
      titleEn: 'Operator-buyer in light industry',
      locationFr: 'Lille, France',
      locationEn: 'Lille, France',
      sectorFr: 'Industrie',
      sectorEn: 'Manufacturing',
      matchBudget: 2200000,
      employees: 18,
      yearFounded: 2016,
      score: 84,
      confidence: 80,
      highlightsFr: ['Expérience sectorielle forte', 'Budget proche de votre cible', 'Projet de reprise structuré'],
      highlightsEn: ['Strong sector expertise', 'Budget close to your target', 'Structured acquisition project'],
    },
    {
      titleFr: 'Investisseur PME à impact régional',
      titleEn: 'Regional SME impact investor',
      locationFr: 'Toulouse, France',
      locationEn: 'Toulouse, France',
      sectorFr: 'Services & Commerce',
      sectorEn: 'Services & Retail',
      matchBudget: 1500000,
      employees: 9,
      yearFounded: 2019,
      score: 79,
      confidence: 76,
      highlightsFr: ['Zone géographique cohérente', 'Intérêt pour transmissions progressives', 'Bonne qualité de données'],
      highlightsEn: ['Geographic fit', 'Interest in phased transition deals', 'Good data quality'],
    },
    {
      titleFr: 'Groupe stratégique en build-up',
      titleEn: 'Strategic group in build-up phase',
      locationFr: 'Marseille, France',
      locationEn: 'Marseille, France',
      sectorFr: 'Transport & Logistique',
      sectorEn: 'Transport & Logistics',
      matchBudget: 4800000,
      employees: 65,
      yearFounded: 2007,
      score: 75,
      confidence: 72,
      highlightsFr: ['Capacité d\'exécution élevée', 'Synergies opérationnelles probables', 'Mandat d\'acquisition actif'],
      highlightsEn: ['High execution capacity', 'Likely operating synergies', 'Active acquisition mandate'],
    },
  ],
};

const normalize = (value) => String(value || '').trim().toLowerCase();

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const isRangeActive = (minValue, maxValue) => minValue !== '' || maxValue !== '';

const getListingBudget = (listing, mode) => {
  const askingPrice = toNumber(listing.asking_price);
  const buyerBudgetMin = toNumber(listing.buyer_budget_min);
  const buyerBudgetMax = toNumber(listing.buyer_budget_max);
  const buyerInvestment = toNumber(listing.buyer_investment_available);

  if (mode === 'seller') {
    return buyerBudgetMax || buyerInvestment || buyerBudgetMin || askingPrice;
  }

  return askingPrice || buyerInvestment || buyerBudgetMax || buyerBudgetMin;
};

const getScoreTone = (score) => {
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
};

const formatMoneyCompact = (value, language) => {
  const amount = toNumber(value);
  if (!amount) return language === 'fr' ? 'Non renseigné' : 'Not provided';

  return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    notation: amount >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: 0,
  }).format(amount);
};

const evaluateRangeScore = ({ value, min, max, weight, tolerance = 0.15 }) => {
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

export default function SmartMatching() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const sectorDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const layoutGridRef = useRef(null);

  const [allListings, setAllListings] = useState([]);
  const [matchedListings, setMatchedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [accessStatus, setAccessStatus] = useState('loading');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);
  const [sectorSearch, setSectorSearch] = useState('');
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const [smartMatchingMode, setSmartMatchingMode] = useState(
    user?.user_metadata?.role === 'seller' ? 'seller' : 'buyer'
  );
  const userRole = user?.user_metadata?.role || 'buyer';
  const canSwitchMode = userRole === 'both';

  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);

  const labels = useMemo(
    () => ({
      title: language === 'fr' ? 'Smart Matching' : 'Smart Matching',
      subtitle:
        smartMatchingMode === 'buyer'
          ? language === 'fr'
            ? "Trouvez les meilleures entreprises à acquérir selon vos critères"
            : 'Find the best businesses to acquire based on your criteria'
          : language === 'fr'
            ? 'Trouvez les profils acquéreurs les plus alignés avec votre entreprise'
            : 'Find buyer profiles aligned with your business',
      criteriaPanel: language === 'fr' ? 'Critères de matching' : 'Matching criteria',
      essentialFilters: language === 'fr' ? 'Filtres essentiels' : 'Essential filters',
      advancedFilters: language === 'fr' ? 'Filtres avancés' : 'Advanced filters',
      searchButton:
        language === 'fr' ? 'Lancer la recherche et sauvegarder' : 'Search and save criteria',
      resetButton: language === 'fr' ? 'Réinitialiser' : 'Reset',
      noResults:
        language === 'fr'
          ? 'Aucun résultat ne correspond à vos critères actuels'
          : 'No match found for the current criteria',
      inactiveAccessTitle:
        language === 'fr' ? 'Smart Matching en mode découverte' : 'Smart Matching in discovery mode',
      inactiveAccessDescription:
        language === 'fr'
          ? 'Découvrez ci-dessous des exemples de matchs premium. Activez le service pour débloquer vos résultats personnalisés, les alertes et les recommandations avancées.'
          : 'See premium match examples below. Enable the service to unlock your personalized results, alerts, and advanced recommendations.',
      activateCta: language === 'fr' ? 'Activer Smart Matching maintenant' : 'Enable Smart Matching now',
      previewResultsTitle: language === 'fr' ? 'Exemples de résultats premium' : 'Premium result examples',
      previewResultsDescription:
        language === 'fr'
          ? 'Aperçu non contractuel pour illustrer la qualité des matchs Smart Matching.'
          : 'Non-contractual preview to showcase Smart Matching result quality.',
      previewCardBadge: language === 'fr' ? 'Aperçu' : 'Preview',
    }),
    [language, smartMatchingMode]
  );

  const isDiscoveryAccess = accessStatus === 'inactive' || accessStatus === 'unknown';

  const previewMockListings = useMemo(
    () =>
      (SMART_MATCHING_PREVIEW_DATA[smartMatchingMode] || []).map((item, index) => ({
        id: `preview-${smartMatchingMode}-${index + 1}`,
        type: smartMatchingMode === 'buyer' ? 'cession' : 'acquisition',
        title: language === 'fr' ? item.titleFr : item.titleEn,
        description: (language === 'fr' ? item.highlightsFr : item.highlightsEn).join(' • '),
        location: language === 'fr' ? item.locationFr : item.locationEn,
        sector: language === 'fr' ? item.sectorFr : item.sectorEn,
        matchBudget: item.matchBudget,
        asking_price: smartMatchingMode === 'buyer' ? item.matchBudget : null,
        annual_revenue: smartMatchingMode === 'buyer' ? Math.round(item.matchBudget * 0.75) : null,
        buyer_budget_min: smartMatchingMode === 'seller' ? Math.round(item.matchBudget * 0.8) : null,
        buyer_budget_max: smartMatchingMode === 'seller' ? item.matchBudget : null,
        buyer_investment_available: smartMatchingMode === 'seller' ? item.matchBudget : null,
        buyer_sectors_interested: smartMatchingMode === 'seller' ? [normalize(item.sectorEn)] : [],
        financial_years: [],
        views_count: 120 + index * 17,
        reference_number: `SM-${smartMatchingMode.toUpperCase()}-${index + 1}`,
        hide_location: false,
        is_certified: true,
        images: [],
        employees: item.employees,
        year_founded: item.yearFounded,
        smartMatchScore: item.score,
        smartMatchMeta: {
          confidence: item.confidence,
          highlights: language === 'fr' ? item.highlightsFr : item.highlightsEn,
        },
        isMock: true,
      })),
    [language, smartMatchingMode]
  );

  const displayedListings = isDiscoveryAccess ? previewMockListings : matchedListings;

  const getStorageKey = useCallback(
    (mode) => `smartMatchingCriteria:${user?.id || 'guest'}:${mode}`,
    [user?.id]
  );

  const activeCriteriaCount = useMemo(() => {
    let count = 0;
    if (criteria.sectors.length > 0) count += 1;
    if (criteria.locations.length > 0) count += 1;
    if (criteria.buyerSectorsInterested?.length > 0) count += 1;
    if (criteria.buyerLocations?.length > 0) count += 1;
    if (criteria.buyerProfileType) count += 1;
    if (criteria.businessTypeSought) count += 1;
    if (criteria.sellerBusinessType) count += 1;
    if (isRangeActive(criteria.minPrice, criteria.maxPrice)) count += 1;
    if (isRangeActive(criteria.minEmployees, criteria.maxEmployees)) count += 1;
    if (isRangeActive(criteria.minYear, criteria.maxYear)) count += 1;
    if (isRangeActive(criteria.minCA, criteria.maxCA)) count += 1;
    if (isRangeActive(criteria.minEBITDA, criteria.maxEBITDA)) count += 1;
    return count;
  }, [criteria]);

  const filteredSectors = useMemo(
    () =>
      SECTORS.filter((sector) =>
        normalize(sector.label).includes(normalize(sectorSearch))
      ),
    [sectorSearch]
  );

  const filteredLocations = useMemo(
    () =>
      LOCATIONS.filter((location) =>
        normalize(location.label).includes(normalize(locationSearch))
      ),
    [locationSearch]
  );

  useEffect(() => {
    if (canSwitchMode) return;
    setSmartMatchingMode(userRole === 'seller' ? 'seller' : 'buyer');
  }, [userRole, canSwitchMode]);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          { data: listings, error: dbError },
          accessPayload,
        ] = await Promise.all([
          supabase
            .from('businesses')
            .select('*')
            .eq('status', 'active'),
          billingService
            .getMyActiveServices(10)
            .then((data) => ({ data, error: null }))
            .catch((serviceError) => ({ data: null, error: serviceError })),
        ]);

        if (dbError) throw dbError;
        setAllListings(listings || []);

        if (accessPayload.error) {
          setAccessStatus('unknown');
        } else {
          const billingRuntimeUnavailable =
            typeof window !== 'undefined' &&
            window.localStorage?.getItem('riviqo_billing_runtime_unavailable') === '1';

          if (billingRuntimeUnavailable) {
            setAccessStatus('unknown');
          } else {
            const activeFeatureCodes = new Set(
              (accessPayload.data?.entitlements || [])
                .filter((item) => item?.entitlement_type === 'feature' && item?.status === 'active')
                .map((item) => item.product_code)
            );
            setAccessStatus(activeFeatureCodes.has('smart_matching') ? 'active' : 'inactive');
          }
        }

        if (user?.user_metadata?.role && user?.user_metadata?.role !== 'both') {
          setSmartMatchingMode(user.user_metadata.role === 'seller' ? 'seller' : 'buyer');
        }

        setCriteria((prev) => {
          const next = { ...prev };
          if (!next.sectors.length && user?.user_metadata?.sector) {
            next.sectors = [normalize(user.user_metadata.sector)];
          }
          if (!next.locations.length && user?.user_metadata?.location) {
            next.locations = [normalize(user.user_metadata.location)];
          }
          return next;
        });
      } catch (err) {
        console.error('Error loading listings:', err);
        setError(err?.message);
        setAccessStatus('unknown');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadListings();
    }
  }, [user]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) {
        setFavoriteIds([]);
        return;
      }

      try {
        const favorites = await favoriteService.listFavorites();
        setFavoriteIds((favorites || []).map((fav) => fav.business_id).filter(Boolean));
      } catch {
        setFavoriteIds([]);
      }
    };

    loadFavorites();
  }, [user?.id]);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(smartMatchingMode));
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setCriteria({ ...DEFAULT_CRITERIA, ...parsed });
    } catch {
      setCriteria(DEFAULT_CRITERIA);
    }
    setMatchedListings([]);
    setHasSearched(false);
    setSectorSearch('');
    setLocationSearch('');
  }, [smartMatchingMode, getStorageKey]);

  const getMatchAnalysis = useCallback(
    (listing) => {
      let points = 0;
      let totalWeight = 0;
      let matchedCriteria = 0;
      const highlights = [];
      const missingFields = [];

      const sectorCriteria = smartMatchingMode === 'seller'
        ? (criteria.buyerSectorsInterested?.length ? criteria.buyerSectorsInterested : criteria.sectors)
        : criteria.sectors;

      if (sectorCriteria.length > 0) {
        const weight = 24;
        totalWeight += weight;

        const listingSectorBlob = smartMatchingMode === 'seller'
          ? normalize((Array.isArray(listing.buyer_sectors_interested) ? listing.buyer_sectors_interested : []).join(' '))
          : normalize(listing.sector);

        if (!listingSectorBlob) {
          missingFields.push(language === 'fr' ? 'secteur' : 'sector');
        } else {
          const matched = sectorCriteria.some((sector) => listingSectorBlob.includes(normalize(sector)));
          if (matched) {
            points += weight;
            matchedCriteria += 1;
            highlights.push(language === 'fr' ? 'Secteur compatible' : 'Sector fit');
          }
        }
      }

      const locationCriteria = smartMatchingMode === 'seller'
        ? (criteria.buyerLocations?.length ? criteria.buyerLocations : criteria.locations)
        : criteria.locations;

      if (locationCriteria.length > 0) {
        const weight = 16;
        totalWeight += weight;

        const listingLocationBlob = smartMatchingMode === 'seller'
          ? normalize((Array.isArray(listing.buyer_locations) ? listing.buyer_locations : []).join(' '))
          : normalize([listing.location, listing.region, listing.country].filter(Boolean).join(' '));

        if (!listingLocationBlob) {
          missingFields.push(language === 'fr' ? 'localisation' : 'location');
        } else {
          const matched = locationCriteria.some((locValue) => {
            const option = LOCATIONS.find((loc) => normalize(loc.value) === normalize(locValue));
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

      if (smartMatchingMode === 'seller' && criteria.buyerProfileType) {
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

      if (smartMatchingMode === 'seller' && criteria.businessTypeSought) {
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

      if (smartMatchingMode === 'buyer' && criteria.sellerBusinessType) {
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

      if (isRangeActive(criteria.minPrice, criteria.maxPrice)) {
        const weight = 24;
        totalWeight += weight;

        const budgetScore = evaluateRangeScore({
          value: getListingBudget(listing, smartMatchingMode),
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
              ? language === 'fr'
                ? 'Budget proche de votre cible'
                : 'Budget close to your target'
              : language === 'fr'
                ? 'Budget dans votre fourchette'
                : 'Budget inside your range'
          );
        }
        if (budgetScore.missing) {
          missingFields.push(language === 'fr' ? 'budget' : 'budget');
        }
      }

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
    },
    [activeCriteriaCount, criteria, language, smartMatchingMode]
  );

  const searchMatches = useCallback(
    ({ notifyIfLimited = false } = {}) => {
      setSearching(true);

      const targetType = smartMatchingMode === 'buyer' ? 'cession' : 'acquisition';

      let results = (allListings || [])
        .filter((listing) => listing.type === targetType)
        .filter((listing) => listing.seller_id !== user?.id)
        .map((listing) => {
          const analysis = getMatchAnalysis(listing);
          return {
            ...listing,
            smartMatchScore: analysis.score,
            smartMatchMeta: analysis,
            matchBudget: getListingBudget(listing, smartMatchingMode),
          };
        })
        .filter((listing) => listing.smartMatchScore >= SMART_MATCHING_MIN_SCORE);

      results.sort((a, b) => {
        const byScore = (b.smartMatchScore || 0) - (a.smartMatchScore || 0);
        if (byScore !== 0) return byScore;

        const byBudget = (b.matchBudget || 0) - (a.matchBudget || 0);
        if (byBudget !== 0) return byBudget;

        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });

      if (accessStatus === 'inactive') {
        results = results.slice(0, 5);
        if (notifyIfLimited) {
          toast({
            title: language === 'fr' ? 'Mode découverte actif' : 'Preview mode enabled',
            description:
              language === 'fr'
                ? 'Seuls les 5 meilleurs résultats sont visibles. Activez Smart Matching pour tout débloquer.'
                : 'Only top 5 results are visible. Enable Smart Matching to unlock all matches.',
          });
        }
      }

      setMatchedListings(results);
      setHasSearched(true);
      setSearching(false);
    },
    [accessStatus, allListings, getMatchAnalysis, language, smartMatchingMode, user?.id]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target)) {
        setShowSectorDropdown(false);
      }

      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowSectorDropdown(false);
        setShowLocationDropdown(false);
      }
    };

    if (showSectorDropdown || showLocationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showSectorDropdown, showLocationDropdown]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const runLayoutDiagnostics = () => {
      const viewportWidth = window.innerWidth;
      const containerWidth = layoutGridRef.current?.clientWidth || null;

      console.debug('[SmartMatching][UX_DIAG_LAYOUT]', {
        viewportWidth,
        containerWidth,
        layoutMode: 'single_column',
        filterPanelOpen: showFiltersPanel,
        hasSearched,
        resultCount: matchedListings.length,
        showAdvanced,
      });
    };

    runLayoutDiagnostics();
    window.addEventListener('resize', runLayoutDiagnostics);
    return () => window.removeEventListener('resize', runLayoutDiagnostics);
  }, [hasSearched, matchedListings.length, showAdvanced, showFiltersPanel]);

  const saveCriteria = () => {
    localStorage.setItem(getStorageKey(smartMatchingMode), JSON.stringify(criteria));
    toast({
      title: language === 'fr' ? 'Critères sauvegardés' : 'Criteria saved',
      description:
        language === 'fr'
          ? 'Vos préférences Smart Matching ont été enregistrées.'
          : 'Your Smart Matching preferences have been saved.',
    });

    searchMatches({ notifyIfLimited: true });
  };

  const handleChange = (field, value) => {
    setCriteria((prev) => ({ ...prev, [field]: value }));
  };

  const resetCriteria = () => {
    setCriteria(DEFAULT_CRITERIA);
    setMatchedListings([]);
    setSectorSearch('');
    setLocationSearch('');
    setHasSearched(false);
  };

  const toggleSector = (sectorValue) => {
    setCriteria((prev) => {
      const newSectors = prev.sectors.includes(sectorValue)
        ? prev.sectors.filter((s) => s !== sectorValue)
        : [...prev.sectors, sectorValue];
      return { ...prev, sectors: newSectors };
    });
  };

  const toggleLocation = (locationValue) => {
    setCriteria((prev) => {
      const newLocations = prev.locations.includes(locationValue)
        ? prev.locations.filter((l) => l !== locationValue)
        : [...prev.locations, locationValue];
      return { ...prev, locations: newLocations };
    });
  };

  const FormInput = ({ icon: Icon = null, label, type = 'text', value, onChange, placeholder }) => (
    <div className="relative min-w-0">
      {Icon && (
        <div className="absolute left-3 top-2 text-[#FF6B4A]">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all text-sm ${Icon ? 'pl-9' : ''}`}
      />
      {label && (
        <label className="absolute -top-2 left-3 text-xs font-semibold text-[#111827] bg-white px-1">
          {label}
        </label>
      )}
    </div>
  );

  const averageScore = useMemo(() => {
    if (displayedListings.length === 0) return 0;
    return Math.round(
      displayedListings.reduce((sum, item) => sum + (item.smartMatchScore || 0), 0) / displayedListings.length
    );
  }, [displayedListings]);

  const highestScore = useMemo(
    () => (displayedListings.length ? Math.max(...displayedListings.map((x) => x.smartMatchScore || 0)) : 0),
    [displayedListings]
  );

  const handleModeSwitch = (mode) => {
    setSmartMatchingMode(mode);
    setMatchedListings([]);
    setHasSearched(false);
  };

  const handleToggleFavorite = async (listingId) => {
    if (!user?.id) {
      window.location.href = '/login';
      return;
    }

    try {
      await favoriteService.toggleFavorite(listingId);
      setFavoriteIds((prev) =>
        prev.includes(listingId)
          ? prev.filter((id) => id !== listingId)
          : [...prev, listingId]
      );
      toast({
        title: language === 'fr' ? 'Favoris mis à jour' : 'Favorites updated',
        description: language === 'fr'
          ? 'Votre sélection Smart Matching a été enregistrée.'
          : 'Your Smart Matching selection has been saved.',
      });
    } catch {
      toast({
        title: language === 'fr' ? 'Action impossible' : 'Action unavailable',
        description: language === 'fr'
          ? 'Impossible de mettre à jour les favoris pour le moment.'
          : 'Unable to update favorites right now.',
      });
    }
  };

  const isPreviewMode = isDiscoveryAccess;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F8FA] via-white to-[#F3F5F8]">
      <div className="bg-white/95 border-b border-gray-200 sticky top-0 z-30 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center shadow-md ring-4 ring-[#FF6B4A]/10">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-[#3B4759] truncate">{labels.title}</h1>
                <p className="text-sm text-[#4B5563] truncate">{labels.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-[#3B4759]">
                <ShieldCheck className="w-4 h-4 text-[#FF6B4A]" />
                {activeCriteriaCount}{' '}
                {language === 'fr' ? 'critères actifs' : 'active filters'}
              </div>

              {canSwitchMode && (
                <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('buyer')}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                      smartMatchingMode === 'buyer'
                        ? 'bg-[#FF6B4A] text-white shadow-sm'
                        : 'bg-transparent text-[#3B4759] hover:bg-white'
                    }`}
                  >
                    {language === 'fr' ? 'Acquérir' : 'Acquire'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('seller')}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                      smartMatchingMode === 'seller'
                        ? 'bg-[#FF6B4A] text-white shadow-sm'
                        : 'bg-transparent text-[#3B4759] hover:bg-white'
                    }`}
                  >
                    {language === 'fr' ? 'Céder' : 'Sell'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {(accessStatus === 'inactive' || accessStatus === 'unknown') && (
          <div className="rounded-2xl border border-[#FF6B4A]/30 bg-gradient-to-r from-[#FFF4F1] to-[#FFF8F6] p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#FF6B4A] inline-flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {accessStatus === 'inactive'
                  ? labels.inactiveAccessTitle
                  : language === 'fr'
                    ? 'Accès Smart Matching non vérifié'
                    : 'Smart Matching access not verified'}
              </p>
                <p className="text-sm text-[#3B4759] mt-1">
                  {accessStatus === 'inactive'
                    ? labels.inactiveAccessDescription
                    : language === 'fr'
                    ? 'Vous pouvez continuer à utiliser la recherche, mais l\'activation vous garantit toutes les fonctionnalités premium.'
                    : 'You can keep using search, but activation guarantees full premium features.'}
                </p>
              </div>
              <Link
                to={createPageUrl('Abonnement')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white px-4 py-2.5 font-semibold text-sm whitespace-nowrap"
              >
                {labels.activateCta}
              </Link>
            </div>
        )}

        <div ref={layoutGridRef} className="space-y-4">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#3B4759]">{labels.criteriaPanel}</h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  {language === 'fr'
                    ? 'Vue mono-colonne ergonomique avec filtres repliables et résultats pleine largeur.'
                    : 'Ergonomic single-column view with collapsible filters and full-width results.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {activeCriteriaCount}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFiltersPanel((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-[#3B4759] hover:bg-gray-50"
                >
                  {showFiltersPanel
                    ? language === 'fr'
                      ? 'Masquer filtres'
                      : 'Hide filters'
                    : language === 'fr'
                      ? 'Afficher filtres'
                      : 'Show filters'}
                </button>
              </div>
            </div>

            {showFiltersPanel && (
              <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs font-bold text-[#3B4759] uppercase tracking-wide mb-2">{labels.essentialFilters}</p>

                  <div className="mb-3 relative" ref={sectorDropdownRef}>
                    <label className="block text-xs font-semibold text-[#3B4759] mb-1">{language === 'fr' ? 'Secteurs' : 'Sectors'}</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={sectorSearch}
                        onChange={(e) => setSectorSearch(e.target.value)}
                        onFocus={() => setShowSectorDropdown(true)}
                        placeholder={language === 'fr' ? 'Chercher un secteur...' : 'Search a sector...'}
                        className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm"
                        aria-expanded={showSectorDropdown}
                        aria-controls="sector-dropdown"
                      />
                      <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />

                      {showSectorDropdown && (
                        <div
                          id="sector-dropdown"
                          role="listbox"
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-40 max-h-52 overflow-y-auto"
                        >
                          {filteredSectors.length > 0 ? (
                            filteredSectors.map((sector) => (
                              <button
                                key={sector.value}
                                type="button"
                                aria-pressed={criteria.sectors.includes(sector.value)}
                                onClick={() => toggleSector(sector.value)}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 transition-all ${
                                  criteria.sectors.includes(sector.value)
                                    ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] font-semibold'
                                    : 'text-[#3B4759]'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 border-2 rounded ${
                                    criteria.sectors.includes(sector.value)
                                      ? 'bg-[#FF6B4A] border-[#FF6B4A]'
                                      : 'border-gray-300'
                                  }`}
                                />
                                {sector.label}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              {language === 'fr' ? 'Aucun secteur trouvé' : 'No sector found'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {criteria.sectors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {criteria.sectors.map((sectorValue) => {
                          const sectorLabel = SECTORS.find((s) => s.value === sectorValue)?.label;
                          return (
                            <div
                              key={sectorValue}
                              className="flex items-center gap-1 px-2 py-1 bg-[#FF6B4A]/10 border border-[#FF6B4A] rounded-full text-xs font-semibold text-[#FF6B4A]"
                            >
                              {sectorLabel || sectorValue}
                              <button
                                type="button"
                                onClick={() => toggleSector(sectorValue)}
                                className="ml-1 hover:text-red-600 transition-colors"
                                aria-label={language === 'fr' ? 'Retirer le secteur' : 'Remove sector'}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mb-3 relative" ref={locationDropdownRef}>
                    <label className="block text-xs font-semibold text-[#3B4759] mb-1">{language === 'fr' ? 'Localisations' : 'Locations'}</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        onFocus={() => setShowLocationDropdown(true)}
                        placeholder={language === 'fr' ? 'Chercher une zone...' : 'Search a location...'}
                        className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm"
                        aria-expanded={showLocationDropdown}
                        aria-controls="location-dropdown"
                      />
                      <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />

                      {showLocationDropdown && (
                        <div
                          id="location-dropdown"
                          role="listbox"
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-40 max-h-52 overflow-y-auto"
                        >
                          {filteredLocations.length > 0 ? (
                            filteredLocations.map((location) => (
                              <button
                                key={location.value}
                                type="button"
                                aria-pressed={criteria.locations.includes(location.value)}
                                onClick={() => toggleLocation(location.value)}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 transition-all ${
                                  criteria.locations.includes(location.value)
                                    ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] font-semibold'
                                    : 'text-[#3B4759]'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 border-2 rounded ${
                                    criteria.locations.includes(location.value)
                                      ? 'bg-[#FF6B4A] border-[#FF6B4A]'
                                      : 'border-gray-300'
                                  }`}
                                />
                                {location.label}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              {language === 'fr' ? 'Aucune localisation trouvée' : 'No location found'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {criteria.locations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {criteria.locations.map((locationValue) => {
                          const locationLabel = LOCATIONS.find((l) => l.value === locationValue)?.label;
                          return (
                            <div
                              key={locationValue}
                              className="flex items-center gap-1 px-2 py-1 bg-[#FF6B4A]/10 border border-[#FF6B4A] rounded-full text-xs font-semibold text-[#FF6B4A]"
                            >
                              {locationLabel || locationValue}
                              <button
                                type="button"
                                onClick={() => toggleLocation(locationValue)}
                                className="ml-1 hover:text-red-600 transition-colors"
                                aria-label={language === 'fr' ? 'Retirer la localisation' : 'Remove location'}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3B4759] mb-1">
                      {smartMatchingMode === 'buyer'
                        ? language === 'fr'
                          ? 'Budget cible (€)'
                          : 'Target budget (€)'
                        : language === 'fr'
                          ? 'Budget acheteur attendu (€)'
                          : 'Expected buyer budget (€)'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        label="Min"
                        type="number"
                        value={criteria.minPrice}
                        onChange={(v) => handleChange('minPrice', v)}
                        placeholder="100000"
                      />
                      <FormInput
                        label="Max"
                        type="number"
                        value={criteria.maxPrice}
                        onChange={(v) => handleChange('maxPrice', v)}
                        placeholder="2000000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className="text-[#FF6B4A] font-semibold text-xs flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {showAdvanced ? '▼' : '▶'} {labels.advancedFilters}
                  </button>

                  {showAdvanced && (
                    <div className="mt-3 border-t border-gray-200 pt-3 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#3B4759] mb-1">{language === 'fr' ? 'Effectifs' : 'Employees'}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <FormInput icon={Users} label="Min" type="number" value={criteria.minEmployees} onChange={(v) => handleChange('minEmployees', v)} placeholder="5" />
                          <FormInput icon={Users} label="Max" type="number" value={criteria.maxEmployees} onChange={(v) => handleChange('maxEmployees', v)} placeholder="500" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#3B4759] mb-1">{language === 'fr' ? 'Année de création' : 'Founded year'}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <FormInput icon={Calendar} label="Min" type="number" value={criteria.minYear} onChange={(v) => handleChange('minYear', v)} placeholder="1990" />
                          <FormInput icon={Calendar} label="Max" type="number" value={criteria.maxYear} onChange={(v) => handleChange('maxYear', v)} placeholder={new Date().getFullYear().toString()} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#3B4759] mb-1">{language === 'fr' ? 'Chiffre d\'affaires (€)' : 'Revenue (€)'}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <FormInput icon={BarChart3} label="Min" type="number" value={criteria.minCA} onChange={(v) => handleChange('minCA', v)} placeholder="100000" />
                          <FormInput icon={BarChart3} label="Max" type="number" value={criteria.maxCA} onChange={(v) => handleChange('maxCA', v)} placeholder="5000000" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#3B4759] mb-1">EBITDA (€)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <FormInput icon={TrendingUp} label="Min" type="number" value={criteria.minEBITDA} onChange={(v) => handleChange('minEBITDA', v)} placeholder="0" />
                          <FormInput icon={TrendingUp} label="Max" type="number" value={criteria.maxEBITDA} onChange={(v) => handleChange('maxEBITDA', v)} placeholder="1000000" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={saveCriteria}
                    disabled={loading || searching}
                    className="flex-1 bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] text-white py-2.5 rounded-lg font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {labels.searchButton}
                  </button>
                  <button
                    type="button"
                    onClick={resetCriteria}
                    className="px-3 bg-gray-100 text-[#3B4759] py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all inline-flex items-center justify-center"
                    aria-label={labels.resetButton}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm min-w-0">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <p className="text-xs text-[#6B7280]">{language === 'fr' ? 'Résultats' : 'Results'}</p>
                    <p className="text-lg font-bold text-[#3B4759]">{displayedListings.length}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <p className="text-xs text-[#6B7280]">{language === 'fr' ? 'Score moyen' : 'Average score'}</p>
                    <p className="text-lg font-bold text-[#3B4759]">{averageScore}%</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <p className="text-xs text-[#6B7280]">{language === 'fr' ? 'Meilleur score' : 'Top score'}</p>
                    <p className="text-lg font-bold text-[#3B4759]">{highestScore}%</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <p className="text-xs text-[#6B7280]">{language === 'fr' ? 'Type ciblé' : 'Target type'}</p>
                    <p className="text-sm font-semibold text-[#3B4759]">
                      {smartMatchingMode === 'buyer'
                        ? language === 'fr'
                          ? 'Annonces de cession'
                          : 'Sell-side listings'
                        : language === 'fr'
                          ? 'Profils acquéreurs'
                          : 'Buyer profiles'}
                    </p>
                  </div>
              </div>

              {isPreviewMode && (
                <div className="mt-3 rounded-xl border border-[#FF6B4A]/30 bg-[#FFF6F3] px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#FF6B4A]">{labels.previewResultsTitle}</p>
                    <p className="text-xs text-[#7C2D12]">{labels.previewResultsDescription}</p>
                  </div>
                  <Link
                    to={createPageUrl('Abonnement')}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#FF6B4A] text-white text-xs font-semibold hover:bg-[#FF5A3A]"
                  >
                    {labels.activateCta}
                  </Link>
                </div>
              )}
            </div>

            {(loading || searching) && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="h-48 rounded-2xl border border-gray-200 bg-white animate-pulse" />
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {!loading && !searching && !error && hasSearched && matchedListings.length === 0 && !isDiscoveryAccess && (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-[#111827] font-medium">{labels.noResults}</p>
                <p className="text-[#6B7280] text-sm mt-1">
                  {language === 'fr'
                    ? 'Élargissez votre budget, vos zones ou vos secteurs.'
                    : 'Widen your budget, locations, or sectors.'}
                </p>
              </div>
            )}

            {!loading && !searching && !error && !hasSearched && !isDiscoveryAccess && (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-[#FF6B4A]/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#FF6B4A]" />
                </div>
                <p className="text-[#111827] font-medium">
                  {language === 'fr'
                    ? 'Configurez vos critères puis lancez le matching'
                    : 'Set your criteria and start matching'}
                </p>
              </div>
            )}

            {!loading && !searching && displayedListings.length > 0 && (
              isPreviewMode ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                  {displayedListings.map((listing) => (
                    <BusinessCard
                      key={listing.id}
                      business={listing}
                      isFavorite={false}
                      onToggleFavorite={() => {}}
                      fetchSellerLogo={false}
                      detailsUrl={createPageUrl('Abonnement')}
                      hideMessageButton
                      hideFavoriteButton
                    />
                  ))}
                </div>
              ) : (
              <div className="grid sm:grid-cols-2 gap-4 xl:gap-5">
                {displayedListings.map((listing) => {
                  const tone = getScoreTone(listing.smartMatchScore || 0);
                  const detailsUrl = listing.isMock
                    ? createPageUrl('Abonnement')
                    : createBusinessDetailsUrl(listing);
                  const highlights = listing.smartMatchMeta?.highlights?.slice(0, 3) || [];
                  const isFavorite = favoriteIds.includes(listing.id);

                  return (
                    <article
                      key={listing.id}
                      className={`rounded-2xl border p-4 md:p-5 shadow-sm transition-all hover:shadow-md ${tone.card}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {listing.isMock && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 text-[10px] font-bold uppercase tracking-wide text-[#FF6B4A] mb-1">
                              {labels.previewCardBadge}
                            </span>
                          )}
                          <h3 className="text-base md:text-lg font-bold text-[#3B4759] line-clamp-2">
                            {listing.title || listing.company || (language === 'fr' ? 'Annonce sans titre' : 'Untitled listing')}
                          </h3>
                          <p className="text-xs text-[#6B7280] mt-1 inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {listing.location || listing.region || listing.country || (language === 'fr' ? 'Localisation non précisée' : 'Location not provided')}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {!listing.isMock && (
                            <button
                              type="button"
                              onClick={() => handleToggleFavorite(listing.id)}
                              className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
                                isFavorite
                                  ? 'bg-rose-500 text-white border-rose-500'
                                  : 'bg-white text-gray-500 border-gray-300 hover:border-rose-400 hover:text-rose-500'
                              }`}
                              aria-label={language === 'fr' ? 'Ajouter aux favoris' : 'Add to favorites'}
                              title={language === 'fr' ? 'Ajouter aux favoris' : 'Add to favorites'}
                            >
                              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                          )}

                          <div className={`inline-flex items-center justify-center min-w-[64px] h-12 px-2 rounded-xl border text-lg font-bold ${tone.badge} ${tone.ring} ring-2`}>
                            {listing.smartMatchScore}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {listing.sector && (
                          <span className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs text-[#3B4759]">
                            {listing.sector}
                          </span>
                        )}
                        {listing.matchBudget && (
                          <span className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-[#FF6B4A]">
                            {formatMoneyCompact(listing.matchBudget, language)}
                          </span>
                        )}
                        {listing.employees ? (
                          <span className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs text-[#3B4759] inline-flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {listing.employees}
                          </span>
                        ) : null}
                        {listing.year_founded ? (
                          <span className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs text-[#3B4759] inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {listing.year_founded}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 space-y-1.5">
                        {highlights.length > 0 ? (
                          highlights.map((highlight, index) => (
                            <p key={`${listing.id}-${index}`} className={`text-xs font-medium ${tone.accent}`}>
                              • {highlight}
                            </p>
                          ))
                        ) : (
                          <p className="text-xs text-[#6B7280]">
                            {language === 'fr'
                              ? 'Renseignez davantage de critères pour enrichir les explications de matching.'
                              : 'Add more criteria to get richer matching explanations.'}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-[#6B7280]">
                        {language === 'fr' ? 'Confiance des données' : 'Data confidence'}: {listing.smartMatchMeta?.confidence || 0}%
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Link
                          to={detailsUrl}
                          className="inline-flex items-center justify-center py-2 rounded-lg bg-[#FF6B4A] text-white font-semibold text-sm hover:bg-[#FF5A3A]"
                        >
                          {language === 'fr' ? 'Voir l\'annonce' : 'View listing'}
                        </Link>
                        <Link
                          to={detailsUrl}
                          className="inline-flex items-center justify-center py-2 rounded-lg border border-gray-300 text-[#3B4759] font-semibold text-sm hover:bg-gray-50"
                        >
                          {language === 'fr' ? 'Détails du match' : 'Match details'}
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
              )
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
