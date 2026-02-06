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
import { Badge } from '@/components/ui/badge';

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
  MapPin,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTORS = ['technology', 'retail', 'hospitality', 'manufacturing', 'services', 'healthcare', 'construction', 'transport', 'agriculture', 'other'];

export default function Businesses() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  
  // Filters
  const [listingType, setListingType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
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
      setBusinesses(businesses || []);
    } catch (e) {
      console.error('Error loading businesses:', e);
      // Fallback to mock data on error
      setBusinesses(mockBusinesses || []);
    }
    setLoading(false);
  };

  const toggleFavorite = (businessId) => {
    if (!user) {
      alert(language === 'fr' ? 'Veuillez vous connecter' : 'Please login');
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
    if (selectedSector && business.sector !== selectedSector) return false;

    // Location
    if (selectedLocation && !business.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
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
    setSelectedLocation('');
    setBudgetRange([0, 5000000]);
  };

  const hasActiveFilters = searchQuery || selectedSector || selectedLocation || budgetRange[0] !== 0 || budgetRange[1] !== 5000000;

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {t('all_businesses')}
            </h1>
          </div>
          {isAuthenticated && (
            <Button 
              onClick={() => navigate(createPageUrl('CreateBusiness'))} 
              className="bg-gradient-to-r from-primary to-blue-600 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('create_listing')}
            </Button>
          )}
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 w-full">
          {/* Search Bar and Type Buttons */}
          <div className="flex flex-col lg:flex-row items-center gap-2 mb-2 w-full">
            {/* Type Buttons */}
            <div className="flex-shrink-0 flex space-x-2">
              <Button
                variant={listingType === 'all' ? 'default' : 'outline'}
                onClick={() => setListingType('all')}
                className={listingType === 'all' ? 'bg-gradient-to-r from-primary to-blue-600 text-white' : ''}
              >
                {language === 'fr' ? 'Tout' : 'All'}
              </Button>
              <Button
                variant={listingType === 'cession' ? 'default' : 'outline'}
                onClick={() => setListingType('cession')}
                className={listingType === 'cession' ? 'bg-gradient-to-r from-primary to-blue-600 text-white' : ''}
              >
                {language === 'fr' ? 'Cession' : 'Sale'}
              </Button>
              <Button
                variant={listingType === 'acquisition' ? 'default' : 'outline'}
                onClick={() => setListingType('acquisition')}
                className={listingType === 'acquisition' ? 'bg-gradient-to-r from-primary to-blue-600 text-white' : ''}
              >
                {language === 'fr' ? 'Acquisition' : 'Acquisition'}
              </Button>
            </div>

            {/* Main Search Input */}
            <div className="flex-1 relative w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="pl-12 h-12 text-base border-gray-200 focus:border-primary rounded-xl w-full"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            <div>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder={language === 'fr' ? 'Secteur' : 'Sector'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>{language === 'fr' ? 'Tous les secteurs' : 'All sectors'}</SelectItem>
                  {SECTORS.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {t(sector)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <Input
                  type="text"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder={language === 'fr' ? 'Localisation' : 'Location'}
                  className="pl-10 h-12 w-full"
                />
              </div>
            </div>

            {/* Budget Min Input */}
            <div>
              <Input
                type="number"
                value={budgetRange[0] === 0 ? '' : budgetRange[0]}
                onChange={(e) => setBudgetRange([Number(e.target.value) || 0, budgetRange[1]])}
                placeholder={language === 'fr' ? 'Budget Min' : 'Min Budget'}
                className="h-12 w-full"
              />
            </div>

            {/* Budget Max Input */}
            <div>
              <Input
                type="number"
                value={budgetRange[1] === 5000000 ? '' : budgetRange[1]}
                onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value) || 5000000])}
                placeholder={language === 'fr' ? 'Budget Max' : 'Max Budget'}
                className="h-12 w-full"
              />
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
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
                {selectedSector && (
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
                {selectedLocation && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {selectedLocation}
                    <button onClick={() => setSelectedLocation('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
              >
                {t('cancel')}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  {business.verified && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {language === 'fr' ? 'Vérifié' : 'Verified'}
                      </Badge>
                    </div>
                  )}
                  {business.type === 'acquisition' && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-blue-500 to-violet-500 text-white border-0 shadow-lg">
                        {language === 'fr' ? 'Recherche' : 'Looking'}
                      </Badge>
                    </div>
                  )}
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