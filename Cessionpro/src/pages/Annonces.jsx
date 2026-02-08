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
        <div className="w-full p-4 mb-0" style={{ backgroundColor: '#F6F5F3' }}>
          {/* Sort Dropdown */}
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#E7E2DE]">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B7A94]">
              <span>{language === 'fr' ? 'Trier par:' : 'Sort by:'}</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-9 text-xs sm:text-sm border-gray-200 rounded-lg bg-white">
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

          {/* Filters Row - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="col-span-2 sm:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="pl-9 h-9 text-xs sm:text-sm border-gray-300 focus:border-primary rounded-lg w-full bg-white"
                />
              </div>
            </div>
            <div className="col-span-1">
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
            <div className="col-span-1">
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
            <div className="col-span-1">
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
                disabled={selectedCountry && selectedCountry !== 'all' && selectedCountry !== 'france'}
              >
                <SelectTrigger className={`h-9 w-full rounded-lg border-gray-300 bg-white text-xs sm:text-sm ${
                  selectedCountry && selectedCountry !== 'all' && selectedCountry !== 'france' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}>
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
            <div className="col-span-1">
              <Input
                type="number"
                value={budgetRange[0] === 0 ? '' : budgetRange[0]}
                onChange={(e) => setBudgetRange([Number(e.target.value) || 0, budgetRange[1]])}
                placeholder={language === 'fr' ? 'Min' : 'Min'}
                className="h-9 w-full rounded-lg border-gray-300 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="col-span-1">
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