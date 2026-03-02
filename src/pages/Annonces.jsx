// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { businessService } from '@/services/businessService';
import { favoriteService } from '@/services/favoriteService';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import BusinessCard from '@/components/ui/BusinessCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import SortControl from '@/components/annonces/SortControl';
import FilterBarDesktop from '@/components/annonces/FilterBarDesktop';
import FilterSheetMobile from '@/components/annonces/FilterSheetMobile';
import ActiveFilterChips from '@/components/annonces/ActiveFilterChips';
import { sponsorshipService } from '@/services/sponsorshipService';
import { COUNTRIES, DEPARTMENTS } from '@/constants/locations';
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
import { SECTORS } from '@/constants/sectors';
import { useSmartMatchingAccess } from '@/hooks/useSmartMatchingAccess';
import { getSmartMatchingCriteria } from '@/services/smartMatchingNotificationService';
import { scoreCriteriaVsListing } from '@/services/smartMatchingScorer';
import { isRangeActive } from '@/services/smartMatchingScorer';

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

const readFiltersFromUrl = (searchString) => {
  const params = new URLSearchParams(searchString);
  return {
    query: params.get('search') || '',
    sector: params.get('sector') || '',
    country: params.get('country') || '',
    department: params.get('department') || '',
    budgetMin: params.get('budgetMin') || '',
    budgetMax: params.get('budgetMax') || '',
    sortBy: params.get('sort') || '-created_date',
  };
};

const syncFiltersToUrl = (filters, listingType) => {
  const params = new URLSearchParams();
  if (filters.query) params.set('search', filters.query);
  if (listingType && listingType !== 'all') params.set('type', listingType);
  if (filters.sector && filters.sector !== 'all') params.set('sector', filters.sector);
  if (filters.country && filters.country !== 'all') params.set('country', filters.country);
  if (filters.department && filters.department !== 'all') params.set('department', filters.department);
  if (filters.budgetMin) params.set('budgetMin', filters.budgetMin);
  if (filters.budgetMax) params.set('budgetMax', filters.budgetMax);
  if (filters.sortBy && filters.sortBy !== '-created_date') params.set('sort', filters.sortBy);

  const qs = params.toString();
  const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
};

export default function Businesses() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const { user } = useAuth();

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
  const [filtersState, setFiltersState] = useState(() => readFiltersFromUrl(window.location.search));
  const debouncedQuery = useDebouncedValue(filtersState.query, 250);
  const debouncedBudgetMin = useDebouncedValue(filtersState.budgetMin, 300);
  const debouncedBudgetMax = useDebouncedValue(filtersState.budgetMax, 300);

  // SmartMatching score badge (subscribers only)
  const { hasAccess: hasSmartMatching } = useSmartMatchingAccess();

  const smartMatchingCriteria = useMemo(() => {
    if (!hasSmartMatching || !user?.id) return null;
    const buyerCriteria = getSmartMatchingCriteria(user.id, 'buyer');
    const hasBuyerCriteria =
      (buyerCriteria.sectors && buyerCriteria.sectors.length > 0) ||
      isRangeActive(buyerCriteria.budgetMin, buyerCriteria.budgetMax) ||
      (buyerCriteria.locations && buyerCriteria.locations.length > 0);
    return hasBuyerCriteria ? buyerCriteria : null;
  }, [hasSmartMatching, user?.id]);

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
      const filters = { status: 'active' };
      if (listingType !== 'all') {
        filters.type = listingType;
      }
      if (debouncedQuery) {
        filters.searchText = debouncedQuery;
      }
      const fetched = await businessService.filterBusinesses(
        filters,
        'created_at',
        {
          columns: 'id,title,description,location,country,department,region,sector,type,asking_price,annual_revenue,buyer_budget_min,buyer_budget_max,buyer_investment_available,buyer_sectors_interested,buyer_locations,buyer_profile_type,business_type_sought,seller_business_type,financial_years,views_count,reference_number,hide_location,is_certified,seller_id,created_at,images,external_url',
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
  }, [listingType, debouncedQuery]);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await favoriteService.listFavorites();
        setFavorites((favs || []).map((f) => f.business_id).filter(Boolean));
      } catch {
        // favorites table may not exist yet — silent fallback
      }
    };
    loadFavorites();
  }, []);

  // Read URL params on location change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search') || '';
    const sector = urlParams.get('sector') || '';
    const country = urlParams.get('country') || '';
    const department = urlParams.get('department') || '';
    const budgetMin = urlParams.get('budgetMin') || '';
    const budgetMax = urlParams.get('budgetMax') || '';
    const sort = urlParams.get('sort') || '-created_date';

    setFiltersState((prev) => ({
      ...prev,
      query: search,
      sector: sector || prev.sector,
      country: country || prev.country,
      department: department || prev.department,
      budgetMin: budgetMin || prev.budgetMin,
      budgetMax: budgetMax || prev.budgetMax,
      sortBy: sort,
    }));

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

  const updateFilter = useCallback((key, value) => {
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

      syncFiltersToUrl(next, undefined);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(async (businessId) => {
    const wasFav = favorites.includes(businessId);
    // Optimistic update
    setFavorites((prev) =>
      wasFav ? prev.filter((id) => id !== businessId) : [...prev, businessId]
    );

    try {
      await favoriteService.toggleFavorite(businessId);
      toast({
        title: language === 'fr' ? 'Favoris mis à jour' : 'Favorites updated',
      });
    } catch {
      // Revert on error
      setFavorites((prev) =>
        wasFav ? [...prev, businessId] : prev.filter((id) => id !== businessId)
      );
      toast({
        title: language === 'fr' ? 'Erreur lors de la mise à jour des favoris' : 'Error updating favorites',
        variant: 'destructive',
      });
    }
  }, [favorites, language]);

  const clearFilters = () => {
    setFiltersState({ ...DEFAULT_FILTERS });
    syncFiltersToUrl(DEFAULT_FILTERS, listingType);
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

    // Budget range — use buyer_budget for acquisitions
    const price = business.type === 'acquisition'
      ? (business.buyer_budget_max || business.buyer_budget_min || 0)
      : (business.asking_price || 0);
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

  // Stable key for sponsorship fetch — avoids re-fetching when same IDs
  const businessIdsKey = useMemo(
    () => sortedBusinesses.map((b) => b.id).join(','),
    [sortedBusinesses]
  );

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
  }, [businessIdsKey]);

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

  // Compute SmartMatching scores — depends on filteredBusinesses (stable, not sponsorship-dependent)
  const smartMatchScores = useMemo(() => {
    if (!smartMatchingCriteria || !hasSmartMatching) return {};
    const scores = {};
    const activeCriteriaCount = [
      smartMatchingCriteria.sectors?.length > 0,
      isRangeActive(smartMatchingCriteria.budgetMin, smartMatchingCriteria.budgetMax),
      smartMatchingCriteria.locations?.length > 0,
      isRangeActive(smartMatchingCriteria.revenueMin, smartMatchingCriteria.revenueMax),
      isRangeActive(smartMatchingCriteria.employeesMin, smartMatchingCriteria.employeesMax),
    ].filter(Boolean).length;

    for (const business of filteredBusinesses) {
      const result = scoreCriteriaVsListing({
        criteria: smartMatchingCriteria,
        listing: business,
        mode: 'buyer',
        language,
        activeCriteriaCount,
      });
      if (result.score >= 50) {
        scores[business.id] = Math.round(result.score);
      }
    }
    return scores;
  }, [smartMatchingCriteria, hasSmartMatching, filteredBusinesses, language]);

  return (
    <div className="py-6 lg:py-8 bg-background">
      <div className="w-full px-5">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {t('all_businesses')}
            </h1>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="sticky top-0 z-20 bg-background pb-3">
          <div className="w-full">
            <div className="sm:hidden w-full bg-background">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={filtersState.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="pl-9 h-10 text-sm border-border focus:border-primary rounded-lg w-full bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
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
              <SheetTitle className="font-heading">
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
              <div key={i} className="bg-muted rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : prioritizedBusinesses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              {t('no_results')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {language === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try modifying your search criteria'}
            </p>
            <Button onClick={clearFilters} variant="outline">
              {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
            </Button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 max-w-sm mx-auto md:max-w-none"
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

                    isFeatured={business.isFeatured}
                    featuredLabel={business.featuredLabel}
                    smartMatchScore={smartMatchScores[business.id] ?? null}
                    showSmartMatchBadge={hasSmartMatching === true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        {hasMore && prioritizedBusinesses.length > 0 && (
          <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
            {loadingMore && (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
