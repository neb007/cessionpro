import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { mockBusinesses } from '@/components/data/mockData';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import BusinessCard from '@/components/ui/BusinessCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  X,
  List,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTORS = ['technology', 'retail', 'hospitality', 'manufacturing', 'services', 'healthcare', 'construction', 'transport', 'agriculture', 'other'];
const COUNTRIES = [
  { value: 'france', label: 'France' },
  { value: 'belgium', label: 'Belgique' },
  { value: 'switzerland', label: 'Suisse' }
];
const DEPARTMENTS = [
  { value: 'paris', label: '75 - Paris' },
  { value: 'rhone', label: '69 - Rhône' },
  { value: 'bouches-du-rhone', label: '13 - Bouches-du-Rhône' },
  { value: 'gironde', label: '33 - Gironde' },
  { value: 'nord', label: '59 - Nord' }
];

export default function Businesses() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  // Filters
  const [listingType, setListingType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [sortBy, setSortBy] = useState('-created_date');
  const [budgetRange, setBudgetRange] = useState([0, 5000000]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search) setSearchQuery(search);
    
    loadData();
    
    // Set up interval to refresh data periodically
    const interval = setInterval(() => {
      loadData();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading active businesses...');
      // Load real data from database
      const businesses = await base44.entities.Business.filter(
        { status: 'active' }
      );
      console.log('Loaded businesses:', businesses);
      setBusinesses([...(businesses || []), ...mockBusinesses]);
    } catch (e) {
      console.error('Error loading businesses:', e);
      // Fallback to mock data on error
      setBusinesses(mockBusinesses || []);
    }
    setLoading(false);
  };

  const toggleFavorite = (businessId) => {
    if (!isAuthenticated) {
      base44.auth.redirectToLogin();
      return;
    }

    const isFav = favorites.includes(businessId);
    if (isFav) {
      setFavorites(favorites.filter(id => id !== businessId));
    } else {
      setFavorites([...favorites, businessId]);
    }
  };

  // Filter businesses
  const filteredBusinesses = businesses.filter(business => {
    // Type filter
    if (listingType !== 'all' && business.type !== listingType) return false;
    
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !business.title?.toLowerCase().includes(query) &&
        !business.description?.toLowerCase().includes(query) &&
        !business.location?.toLowerCase().includes(query) &&
        !t(business.sector)?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Sector
    if (selectedSector && selectedSector !== 'all' && business.sector !== selectedSector) return false;

    // Country
    if (selectedCountry && selectedCountry !== 'all' && business.country?.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }

    // Department
    const departmentValue = business.department || business.region || business.location || '';
    if (selectedDepartment && selectedDepartment !== 'all' && !departmentValue.toLowerCase().includes(selectedDepartment.toLowerCase())) {
      return false;
    }

    // Budget range
    const price = business.asking_price || 0;
    if (price < budgetRange[0] || price > budgetRange[1]) return false;

    return true;
  });

  // Sort
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case '-created_date': {
        const dateA = new Date(b.created_at || b.created_date || 0).getTime();
        const dateB = new Date(a.created_at || a.created_date || 0).getTime();
        return dateA - dateB;
      }
      case 'price_asc':
        return (a.asking_price || 0) - (b.asking_price || 0);
      case 'price_desc':
        return (b.asking_price || 0) - (a.asking_price || 0);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSector('');
    setSelectedCountry('');
    setSelectedDepartment('');
    setBudgetRange([0, 5000000]);
  };

  const hasActiveFilters =
    searchQuery ||
    (selectedSector && selectedSector !== 'all') ||
    (selectedCountry && selectedCountry !== 'all') ||
    (selectedDepartment && selectedDepartment !== 'all') ||
    budgetRange[0] !== 0 ||
    budgetRange[1] !== 5000000;

  return (
    <div className="min-h-screen py-6 lg:py-8 bg-[#FAF9F7]">
      <div className="w-full px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {t('all_businesses')}
            </h1>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="w-full bg-amber-50 p-4 mb-0">
          {/* Tab-style Type Navigation */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-3 border-b border-[#E7E2DE]">
            <button
              onClick={() => setListingType('all')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                listingType === 'all'
                  ? 'bg-[#FFF0ED] text-[#FF6B4A] shadow-sm'
                  : 'text-[#6B7A94] hover:bg-[#F8F3F0]'
              }`}
            >
              <List className="w-4 h-4" /> {language === 'fr' ? 'Tout' : 'All'}
            </button>
            <button
              onClick={() => setListingType('cession')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                listingType === 'cession'
                  ? 'bg-[#FFF0ED] text-[#FF6B4A] shadow-sm'
                  : 'text-[#6B7A94] hover:bg-[#F8F3F0]'
              }`}
            >
              <ArrowRight className="w-4 h-4" /> {language === 'fr' ? 'Cessions' : 'Sales'}
            </button>
            <button
              onClick={() => setListingType('acquisition')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                listingType === 'acquisition'
                  ? 'bg-[#FFF0ED] text-[#FF6B4A] shadow-sm'
                  : 'text-[#6B7A94] hover:bg-[#F8F3F0]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> {language === 'fr' ? 'Acquisitions' : 'Acquisitions'}
            </button>
            
            {/* Sort Dropdown */}
            <div className="w-full sm:w-auto sm:ml-auto">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B7A94]">
                <span>{language === 'fr' ? 'Trier par:' : 'Sort by:'}</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 h-9 sm:h-10 text-xs sm:text-sm border-gray-200 rounded-full bg-white shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created_date">{language === 'fr' ? 'Plus récent' : 'Newest'}</SelectItem>
                    <SelectItem value="price_asc">{language === 'fr' ? 'Prix: Croissant' : 'Price: Low-High'}</SelectItem>
                    <SelectItem value="price_desc">{language === 'fr' ? 'Prix: Décroissant' : 'Price: High-Low'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-nowrap md:flex-wrap items-center gap-2 pt-3 overflow-x-auto md:overflow-visible scrollbar-hide">
            <div className="min-w-[160px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="pl-9 h-9 text-sm border-gray-300 focus:border-primary rounded-lg w-full bg-white"
                />
              </div>
            </div>
            <div className="min-w-[120px]">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="h-9 w-full rounded-lg border-gray-300 bg-white text-xs sm:text-sm">
                  <SelectValue placeholder={language === 'fr' ? 'Sect.' : 'Sect.'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'fr' ? 'Tous' : 'All'}</SelectItem>
                  {SECTORS.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {t(sector)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[100px]">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="h-9 w-full rounded-lg border-gray-300 bg-white text-xs sm:text-sm">
                  <SelectValue placeholder={language === 'fr' ? 'Pays' : 'Pays'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'fr' ? 'Tous' : 'All'}</SelectItem>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[100px]">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="h-9 w-full rounded-lg border-gray-300 bg-white text-xs sm:text-sm">
                  <SelectValue placeholder={language === 'fr' ? 'Dép.' : 'Dpt.'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'fr' ? 'Tous' : 'All'}</SelectItem>
                  {DEPARTMENTS.map(department => (
                    <SelectItem key={department.value} value={department.value}>
                      {department.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[90px]">
              <Input
                type="number"
                value={budgetRange[0] === 0 ? '' : budgetRange[0]}
                onChange={(e) => setBudgetRange([Number(e.target.value) || 0, budgetRange[1]])}
                placeholder={language === 'fr' ? 'Min' : 'Min'}
                className="h-9 w-full rounded-lg border-gray-300 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="min-w-[90px]">
              <Input
                type="number"
                value={budgetRange[1] === 5000000 ? '' : budgetRange[1]}
                onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value) || 5000000])}
                placeholder={language === 'fr' ? 'Max' : 'Max'}
                className="h-9 w-full rounded-lg border-gray-300 bg-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">Filtres actifs:</span>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSector && selectedSector !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
                    {t(selectedSector)}
                    <button onClick={() => setSelectedSector('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(budgetRange[0] > 0 || budgetRange[1] < 5000000) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {budgetRange[0] > 0 ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, notation: 'compact' }).format(budgetRange[0]) : ''}
                    {budgetRange[0] > 0 && budgetRange[1] < 5000000 ? ' - ' : ''}
                    {budgetRange[1] < 5000000 ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, notation: 'compact' }).format(budgetRange[1]) : ''}
                    <button onClick={() => setBudgetRange([0, 5000000])}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCountry && selectedCountry !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {selectedCountry}
                    <button onClick={() => setSelectedCountry('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedDepartment && selectedDepartment !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {selectedDepartment}
                    <button onClick={() => setSelectedDepartment('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

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
              {sortedBusinesses.map((business) => (
                <motion.div
                  key={business.id}
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
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}