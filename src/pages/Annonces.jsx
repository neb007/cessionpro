import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { businessService } from '@/services/businessService';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import BusinessCard from '@/components/ui/BusinessCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SortControl from '@/components/annonces/SortControl';
import FilterBarDesktop from '@/components/annonces/FilterBarDesktop';
import FilterSheetMobile from '@/components/annonces/FilterSheetMobile';
import ActiveFilterChips from '@/components/annonces/ActiveFilterChips';
import { sponsorshipService } from '@/services/sponsorshipService';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { 
  Search, 
  Loader2,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTORS = ['technology', 'retail', 'hospitality', 'manufacturing', 'services', 'healthcare', 'construction', 'transport', 'agriculture', 'other'];
const COUNTRIES = [
  { value: 'france', label: 'France' },
  { value: 'belgium', label: 'Belgique' },
  { value: 'switzerland', label: 'Suisse' },
  { value: 'germany', label: 'Allemagne' },
  { value: 'italy', label: 'Italie' },
  { value: 'spain', label: 'Espagne' },
  { value: 'netherlands', label: 'Pays-Bas' },
  { value: 'portugal', label: 'Portugal' },
  { value: 'austria', label: 'Autriche' },
  { value: 'poland', label: 'Pologne' },
  { value: 'czechia', label: 'Tchéquie' },
  { value: 'hungary', label: 'Hongrie' },
  { value: 'romania', label: 'Roumanie' },
  { value: 'greece', label: 'Grèce' },
  { value: 'sweden', label: 'Suède' },
  { value: 'denmark', label: 'Danemark' },
  { value: 'finland', label: 'Finlande' },
  { value: 'ireland', label: 'Irlande' },
  { value: 'luxembourg', label: 'Luxembourg' },
  { value: 'cyprus', label: 'Chypre' }
];

const DEPARTMENTS = [
  { value: '01', label: '01 - Ain' },
  { value: '02', label: '02 - Aisne' },
  { value: '03', label: '03 - Allier' },
  { value: '04', label: '04 - Alpes-de-Haute-Provence' },
  { value: '05', label: '05 - Hautes-Alpes' },
  { value: '06', label: '06 - Alpes-Maritimes' },
  { value: '07', label: '07 - Ardèche' },
  { value: '08', label: '08 - Ardennes' },
  { value: '09', label: '09 - Ariège' },
  { value: '10', label: '10 - Aube' },
  { value: '11', label: '11 - Aude' },
  { value: '12', label: '12 - Aveyron' },
  { value: '13', label: '13 - Bouches-du-Rhône' },
  { value: '14', label: '14 - Calvados' },
  { value: '15', label: '15 - Cantal' },
  { value: '16', label: '16 - Charente' },
  { value: '17', label: '17 - Charente-Maritime' },
  { value: '18', label: '18 - Cher' },
  { value: '19', label: '19 - Corrèze' },
  { value: '2a', label: '2A - Corse-du-Sud' },
  { value: '2b', label: '2B - Haute-Corse' },
  { value: '21', label: '21 - Côte-d\'Or' },
  { value: '22', label: '22 - Côtes-d\'Armor' },
  { value: '23', label: '23 - Creuse' },
  { value: '24', label: '24 - Dordogne' },
  { value: '25', label: '25 - Doubs' },
  { value: '26', label: '26 - Drôme' },
  { value: '27', label: '27 - Eure' },
  { value: '28', label: '28 - Eure-et-Loir' },
  { value: '29', label: '29 - Finistère' },
  { value: '30', label: '30 - Gard' },
  { value: '31', label: '31 - Haute-Garonne' },
  { value: '32', label: '32 - Gers' },
  { value: '33', label: '33 - Gironde' },
  { value: '34', label: '34 - Hérault' },
  { value: '35', label: '35 - Ille-et-Vilaine' },
  { value: '36', label: '36 - Indre' },
  { value: '37', label: '37 - Indre-et-Loire' },
  { value: '38', label: '38 - Isère' },
  { value: '39', label: '39 - Jura' },
  { value: '40', label: '40 - Landes' },
  { value: '41', label: '41 - Loir-et-Cher' },
  { value: '42', label: '42 - Loire' },
  { value: '43', label: '43 - Haute-Loire' },
  { value: '44', label: '44 - Loire-Atlantique' },
  { value: '45', label: '45 - Loiret' },
  { value: '46', label: '46 - Lot' },
  { value: '47', label: '47 - Lot-et-Garonne' },
  { value: '48', label: '48 - Lozère' },
  { value: '49', label: '49 - Maine-et-Loire' },
  { value: '50', label: '50 - Manche' },
  { value: '51', label: '51 - Marne' },
  { value: '52', label: '52 - Haute-Marne' },
  { value: '53', label: '53 - Mayenne' },
  { value: '54', label: '54 - Meurthe-et-Moselle' },
  { value: '55', label: '55 - Meuse' },
  { value: '56', label: '56 - Morbihan' },
  { value: '57', label: '57 - Moselle' },
  { value: '58', label: '58 - Nièvre' },
  { value: '59', label: '59 - Nord' },
  { value: '60', label: '60 - Oise' },
  { value: '61', label: '61 - Orne' },
  { value: '62', label: '62 - Pas-de-Calais' },
  { value: '63', label: '63 - Puy-de-Dôme' },
  { value: '64', label: '64 - Pyrénées-Atlantiques' },
  { value: '65', label: '65 - Hautes-Pyrénées' },
  { value: '66', label: '66 - Pyrénées-Orientales' },
  { value: '67', label: '67 - Bas-Rhin' },
  { value: '68', label: '68 - Haut-Rhin' },
  { value: '69', label: '69 - Rhône' },
  { value: '70', label: '70 - Haute-Saône' },
  { value: '71', label: '71 - Saône-et-Loire' },
  { value: '72', label: '72 - Sarthe' },
  { value: '73', label: '73 - Savoie' },
  { value: '74', label: '74 - Haute-Savoie' },
  { value: '75', label: '75 - Paris' },
  { value: '76', label: '76 - Seine-Maritime' },
  { value: '77', label: '77 - Seine-et-Marne' },
  { value: '78', label: '78 - Yvelines' },
  { value: '79', label: '79 - Deux-Sèvres' },
  { value: '80', label: '80 - Somme' },
  { value: '81', label: '81 - Tarn' },
  { value: '82', label: '82 - Tarn-et-Garonne' },
  { value: '83', label: '83 - Var' },
  { value: '84', label: '84 - Vaucluse' },
  { value: '85', label: '85 - Vendée' },
  { value: '86', label: '86 - Vienne' },
  { value: '87', label: '87 - Haute-Vienne' },
  { value: '88', label: '88 - Vosges' },
  { value: '89', label: '89 - Yonne' },
  { value: '90', label: '90 - Territoire de Belfort' },
  { value: '91', label: '91 - Essonne' },
  { value: '92', label: '92 - Hauts-de-Seine' },
  { value: '93', label: '93 - Seine-Saint-Denis' },
  { value: '94', label: '94 - Val-de-Marne' },
  { value: '95', label: '95 - Val-d\'Oise' },
  { value: '971', label: '971 - Guadeloupe' },
  { value: '972', label: '972 - Martinique' },
  { value: '973', label: '973 - Guyane' },
  { value: '974', label: '974 - Réunion' },
  { value: '976', label: '976 - Mayotte' }
];
const PAGE_SIZE = 24;
const DEFAULT_FILTERS = {
  query: '',
  sector: '',
  country: '',
  department: '',
  budgetMin: '',
  budgetMax: '',
  sortBy: '-created_date',
};

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

const normalize = (value) => (value || '').trim().toLowerCase();

export default function Businesses() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const loadMoreRef = useRef(null);
  const isFetchingRef = useRef(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [sponsorshipByBusinessId, setSponsorshipByBusinessId] = useState({});
  
  const [listingType, setListingType] = useState('all');
  const [filtersState, setFiltersState] = useState(() => ({ ...DEFAULT_FILTERS }));
  const debouncedQuery = useDebouncedValue(filtersState.query, 250);
  const debouncedBudgetMin = useDebouncedValue(filtersState.budgetMin, 300);
  const debouncedBudgetMax = useDebouncedValue(filtersState.budgetMax, 300);

  const fetchBusinessesPage = async (pageToLoad, replace = false) => {
    if (isFetchingRef.current) return;
    if (!replace && !hasMore) return;

    isFetchingRef.current = true;
    if (replace) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const fetched = await businessService.filterBusinesses(
        { status: 'active' },
        'created_at',
        {
          columns: 'id,title,description,location,country,department,region,sector,type,asking_price,annual_revenue,buyer_budget_min,buyer_budget_max,buyer_investment_available,buyer_sectors_interested,buyer_locations,buyer_profile_type,business_type_sought,seller_business_type,financial_years,views_count,reference_number,hide_location,is_certified,seller_id,created_at,images',
          limit: PAGE_SIZE,
          offset: pageToLoad * PAGE_SIZE
        }
      );

      const pageData = fetched || [];
      setBusinesses((prev) => {
        if (replace) return pageData;
        const seen = new Set(prev.map((b) => b.id));
        return [...prev, ...pageData.filter((b) => !seen.has(b.id))];
      });
      setPage(pageToLoad + 1);
      setHasMore(pageData.length === PAGE_SIZE);
    } catch (e) {
      console.error('Error loading businesses:', e);
      if (replace) setBusinesses([]);
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBusinessesPage(0, true);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search') || '';
    setFiltersState((prev) => ({ ...prev, query: search }));

    const type = urlParams.get('type');
    if (type && (type === 'cession' || type === 'acquisition')) {
      setListingType(type);
    } else {
      setListingType('all');
    }
  }, [location.search]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          !loading &&
          !loadingMore &&
          hasMore
        ) {
          fetchBusinessesPage(page);
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [page, loading, loadingMore, hasMore]);

  const updateFilter = (key, value) => {
    setFiltersState((prev) => {
      const next = { ...prev, [key]: value };

      if (key === 'country' && normalize(value) !== 'france') {
        next.department = '';
      }

      if (key === 'budgetMin') {
        const minValue = Number(value) || 0;
        const maxValue = Number(prev.budgetMax) || 5000000;
        if (minValue > maxValue) {
          next.budgetMax = String(minValue);
        }
      }

      if (key === 'budgetMax') {
        const maxValue = Number(value) || 5000000;
        const minValue = Number(prev.budgetMin) || 0;
        if (maxValue < minValue) {
          next.budgetMax = String(minValue);
        }
      }

      return next;
    });
  };

  const toggleFavorite = (businessId) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    const isFav = favorites.includes(businessId);
    if (isFav) {
      setFavorites(favorites.filter(id => id !== businessId));
    } else {
      setFavorites([...favorites, businessId]);
    }
  };

  const clearFilters = () => {
    setFiltersState({ ...DEFAULT_FILTERS });
  };

  const normalizedBudgetMin = Number(debouncedBudgetMin) || 0;
  const normalizedBudgetMaxRaw = Number(debouncedBudgetMax) || 5000000;
  const normalizedBudgetMax = normalizedBudgetMin > normalizedBudgetMaxRaw
    ? normalizedBudgetMin
    : normalizedBudgetMaxRaw;

  // Filter businesses
  const filteredBusinesses = useMemo(() => businesses.filter(business => {
    // Type filter
    if (listingType !== 'all' && business.type !== listingType) return false;
    
    // Search
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      const reference = business.reference_number?.toLowerCase() || '';
      const idValue = business.id ? String(business.id).toLowerCase() : '';

      if (
        !business.title?.toLowerCase().includes(query) &&
        !business.description?.toLowerCase().includes(query) &&
        !business.location?.toLowerCase().includes(query) &&
        !t(business.sector)?.toLowerCase().includes(query) &&
        !reference.includes(query) &&
        !idValue.includes(query)
      ) {
        return false;
      }
    }

    // Sector
    if (filtersState.sector && filtersState.sector !== 'all' && business.sector !== filtersState.sector) return false;

    // Country
    const countryFilter = normalize(filtersState.country);
    if (countryFilter && countryFilter !== 'all') {
      const businessCountry = normalize(business.country);
      const businessCountryLabel = normalize(
        COUNTRIES.find((item) => normalize(item.value) === businessCountry)?.label
      );
      if (
        !businessCountry.includes(countryFilter) &&
        !businessCountryLabel.includes(countryFilter)
      ) {
        return false;
      }
    }

    // Department
    const departmentValue = business.department || business.region || business.location || '';
    if (
      filtersState.department &&
      normalize(filtersState.department) !== 'all' &&
      !normalize(departmentValue).includes(normalize(filtersState.department))
    ) {
      return false;
    }

    // Budget range
    const price = business.asking_price || 0;
    if (price < normalizedBudgetMin || price > normalizedBudgetMax) return false;

    return true;
  }), [
    businesses,
    listingType,
    debouncedQuery,
    filtersState.sector,
    filtersState.country,
    filtersState.department,
    normalizedBudgetMin,
    normalizedBudgetMax,
    t
  ]);

  // Sort
  const sortedBusinesses = useMemo(() => [...filteredBusinesses].sort((a, b) => {
    switch (filtersState.sortBy) {
      case '-created_date': {
      const dateA = new Date(b.created_at || 0).getTime();
      const dateB = new Date(a.created_at || 0).getTime();
        return dateA - dateB;
      }
      case 'price_asc':
        return (a.asking_price || 0) - (b.asking_price || 0);
      case 'price_desc':
        return (b.asking_price || 0) - (a.asking_price || 0);
      default:
        return 0;
    }
  }), [filteredBusinesses, filtersState.sortBy]);

  const hasActiveFilters =
    filtersState.query ||
    (filtersState.sector && filtersState.sector !== 'all') ||
    (filtersState.country && filtersState.country !== 'all') ||
    (filtersState.department && filtersState.department !== 'all') ||
    (filtersState.budgetMin && Number(filtersState.budgetMin) > 0) ||
    (filtersState.budgetMax && Number(filtersState.budgetMax) < 5000000);

  useEffect(() => {
    let cancelled = false;

    const loadSponsorships = async () => {
      const ids = sortedBusinesses.map((item) => item.id).filter(Boolean);
      if (ids.length === 0) {
        if (!cancelled) setSponsorshipByBusinessId({});
        return;
      }

      try {
        const rows = await sponsorshipService.getActiveSponsorships({ businessIds: ids });
        if (cancelled) return;

        const map = (rows || []).reduce((acc, row) => {
          if (!acc[row.business_id]) {
            acc[row.business_id] = row;
          }
          return acc;
        }, {});

        setSponsorshipByBusinessId(map);
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading sponsorships:', error);
          setSponsorshipByBusinessId({});
        }
      }
    };

    loadSponsorships();

    return () => {
      cancelled = true;
    };
  }, [sortedBusinesses]);

  const prioritizedBusinesses = useMemo(() => {
    const enriched = sortedBusinesses.map((business, index) => {
      const sponsorship = sponsorshipByBusinessId[business.id];
      const isFeatured = Boolean(sponsorship);
      const featuredLabel = sponsorship?.display_label || (language === 'fr' ? 'À la une' : 'Featured');

      return {
        ...business,
        isFeatured,
        featuredLabel,
        _originalIndex: index
      };
    });

    enriched.sort((a, b) => {
      if (a.isFeatured === b.isFeatured) {
        return a._originalIndex - b._originalIndex;
      }
      return a.isFeatured ? -1 : 1;
    });

    return enriched.map(({ _originalIndex, ...business }) => business);
  }, [sortedBusinesses, sponsorshipByBusinessId, language]);

  return (
    <div className="min-h-screen py-6 lg:py-8 bg-[#FAF9F7]">
      <div className="w-full px-5">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {t('all_businesses')}
            </h1>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="sticky top-0 z-20 bg-[#FAF9F7] pb-3">
          <div className="w-full">
            <div className="sm:hidden w-full bg-[#FAF9F7]">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={filtersState.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="pl-9 h-10 text-sm border-gray-300 focus:border-primary rounded-lg w-full bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E7E2DE]">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-sm"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {language === 'fr' ? 'Filtres' : 'Filters'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-sm"
                  onClick={() => setMobileSortOpen(true)}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {language === 'fr' ? 'Tri' : 'Sort'}
                </Button>
              </div>
            </div>

            <FilterBarDesktop
              filtersState={filtersState}
              language={language}
              t={t}
              sectors={SECTORS}
              countries={COUNTRIES}
              departments={DEPARTMENTS}
              onUpdateFilter={updateFilter}
            />

            <ActiveFilterChips
              filtersState={filtersState}
              hasActiveFilters={hasActiveFilters}
              language={language}
              t={t}
              onUpdateFilter={updateFilter}
            />
          </div>
        </div>

        <FilterSheetMobile
          open={mobileFiltersOpen}
          onOpenChange={setMobileFiltersOpen}
          filtersState={filtersState}
          language={language}
          t={t}
          sectors={SECTORS}
          countries={COUNTRIES}
          departments={DEPARTMENTS}
          onUpdateFilter={updateFilter}
        />

        <Sheet open={mobileSortOpen} onOpenChange={setMobileSortOpen}>
          <SheetContent side="bottom" className="h-[40vh] rounded-t-2xl">
            <SheetHeader className="text-left">
              <SheetTitle className="font-display">
                {language === 'fr' ? 'Trier les annonces' : 'Sort listings'}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <SortControl
                value={filtersState.sortBy}
                onChange={(value) => {
                  updateFilter('sortBy', value);
                  setMobileSortOpen(false);
                }}
                language={language}
                compact
                className="w-full"
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : sortedBusinesses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
              {t('no_results')}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try modifying your search criteria'}
            </p>
            <Button onClick={clearFilters} variant="outline">
              {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
            </Button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6"
          >
            <AnimatePresence mode="popLayout">
              {prioritizedBusinesses.map((business) => (
                <motion.div
                  key={`listing-${business.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  <BusinessCard
                    business={business}
                    isFavorite={favorites.includes(business.id)}
                    onToggleFavorite={toggleFavorite}
                    fetchSellerLogo={false}
                    isFeatured={business.isFeatured}
                    featuredLabel={business.featuredLabel}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {loadingMore && (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}
