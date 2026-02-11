import React, { useState, useEffect, useRef } from 'react';
import { Zap, MapPin, Briefcase, Send, TrendingUp, Users, Calendar, BarChart3, X, Search, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import SmartMatchingBanner from '@/components/layout/SmartMatchingBanner';

// Secteurs disponibles
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

export default function SmartMatching() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const sectorDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  
  const [allListings, setAllListings] = useState([]);
  const [matchedListings, setMatchedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sectorSearch, setSectorSearch] = useState('');
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  // Mode (Achat ou Cession)
  const [smartMatchingMode, setSmartMatchingMode] = useState('buyer');
  const userRole = user?.user_metadata?.role || 'buyer';
  const canSwitchMode = userRole === 'both';
  
  const [criteria, setCriteria] = useState({
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
  });

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: listings, error: dbError } = await supabase
          .from('businesses')
          .select('*')
          .eq('status', 'active');

        if (dbError) throw dbError;
        setAllListings(listings || []);

        if (user?.user_metadata) {
          setCriteria(prev => ({
            ...prev,
            sectors: user.user_metadata.sector ? [user.user_metadata.sector] : [],
            locations: user.user_metadata.location ? [user.user_metadata.location] : [],
          }));
        }
      } catch (err) {
        console.error('Error loading listings:', err);
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadListings();
    }
  }, [user]);

  const searchMatches = () => {
    let results = allListings;

    if (criteria.sectors.length > 0) {
      results = results.filter(l => 
        criteria.sectors.includes(l.sector?.toLowerCase())
      );
    }
    if (criteria.locations.length > 0) {
      results = results.filter(l => 
        criteria.locations.some(loc =>
          l.location?.toLowerCase().includes(loc.toLowerCase()) ||
          l.region?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }
    if (criteria.minPrice) {
      results = results.filter(l => l.asking_price >= parseInt(criteria.minPrice));
    }
    if (criteria.maxPrice) {
      results = results.filter(l => l.asking_price <= parseInt(criteria.maxPrice));
    }
    if (criteria.minEmployees) {
      results = results.filter(l => l.employees >= parseInt(criteria.minEmployees));
    }
    if (criteria.maxEmployees) {
      results = results.filter(l => l.employees <= parseInt(criteria.maxEmployees));
    }
    if (criteria.minYear) {
      results = results.filter(l => l.year_founded >= parseInt(criteria.minYear));
    }
    if (criteria.maxYear) {
      results = results.filter(l => l.year_founded <= parseInt(criteria.maxYear));
    }
    if (criteria.minCA) {
      results = results.filter(l => l.annual_revenue >= parseInt(criteria.minCA));
    }
    if (criteria.maxCA) {
      results = results.filter(l => l.annual_revenue <= parseInt(criteria.maxCA));
    }
    if (criteria.minEBITDA) {
      results = results.filter(l => l.ebitda >= parseInt(criteria.minEBITDA));
    }
    if (criteria.maxEBITDA) {
      results = results.filter(l => l.ebitda <= parseInt(criteria.maxEBITDA));
    }

    setMatchedListings(results);
  };

  // Click-outside handler for sector dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target)) {
        setShowSectorDropdown(false);
      }
    };

    if (showSectorDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSectorDropdown]);

  useEffect(() => {
    const saved = localStorage.getItem('smartMatchingCriteria');
    if (saved) {
      setCriteria(JSON.parse(saved));
    }
  }, []);

  const saveCriteria = () => {
    localStorage.setItem('smartMatchingCriteria', JSON.stringify(criteria));
    searchMatches();
  };

  const handleChange = (field, value) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const resetCriteria = () => {
    setCriteria({
      sectors: [], locations: [], minPrice: '', maxPrice: '', 
      minEmployees: '', maxEmployees: '', minYear: '', maxYear: '',
      minCA: '', maxCA: '', minEBITDA: '', maxEBITDA: '',
    });
    setMatchedListings([]);
    setSectorSearch('');
    setLocationSearch('');
  };

  const toggleSector = (sectorValue) => {
    setCriteria(prev => {
      const newSectors = prev.sectors.includes(sectorValue)
        ? prev.sectors.filter(s => s !== sectorValue)
        : [...prev.sectors, sectorValue];
      return { ...prev, sectors: newSectors };
    });
  };

  const toggleLocation = (locationValue) => {
    setCriteria(prev => {
      const newLocations = prev.locations.includes(locationValue)
        ? prev.locations.filter(l => l !== locationValue)
        : [...prev.locations, locationValue];
      return { ...prev, locations: newLocations };
    });
  };

  // Filtrer les secteurs selon la recherche
  const filteredSectors = SECTORS.filter(sector =>
    sector.label.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  // Filtrer les localisations selon la recherche
  const filteredLocations = LOCATIONS.filter(location =>
    location.label.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const getScoreColor = (score) => {
    if (score >= 85) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
    if (score >= 70) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
    if (score >= 50) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
  };

  const FormInput = ({ icon: Icon, label, type = 'text', value, onChange, placeholder }) => (
    <div className="relative">
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
        <label className="absolute -top-2 left-3 text-xs font-semibold text-[#6B7A94] bg-white px-1">
          {label}
        </label>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#3B4759]">Smart Matching</h1>
                <p className="text-xs text-[#6B7A94]">
                  {smartMatchingMode === 'buyer' 
                    ? 'Trouvez l\'entreprise parfaite à acquérir'
                    : 'Trouvez le bon acquéreur pour votre entreprise'}
                </p>
              </div>
            </div>

            {canSwitchMode && (
              <div className="flex gap-2">
                <button
                  onClick={() => setSmartMatchingMode('buyer')}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all ${
                    smartMatchingMode === 'buyer'
                      ? 'bg-[#FF6B4A] text-white shadow-md'
                      : 'bg-gray-200 text-[#3B4759] hover:bg-gray-300'
                  }`}
                >
                  Acquérir
                </button>
                <button
                  onClick={() => setSmartMatchingMode('seller')}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all ${
                    smartMatchingMode === 'seller'
                      ? 'bg-[#FF6B4A] text-white shadow-md'
                      : 'bg-gray-200 text-[#3B4759] hover:bg-gray-300'
                  }`}
                >
                  Céder
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Search Form Card */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            
            {/* Secteur - Multi-Select Autocomplete */}
            <div className="mb-3 relative" ref={sectorDropdownRef}>
              <label className="block text-xs font-bold text-[#3B4759] mb-1 uppercase tracking-wide">Secteur</label>
              <div className="relative">
                <input
                  type="text"
                  value={sectorSearch}
                  onChange={(e) => setSectorSearch(e.target.value)}
                  onFocus={() => setShowSectorDropdown(true)}
                  placeholder="Chercher un secteur..."
                  className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm"
                />
                <Search className="absolute right-3 top-2 w-4 h-4 text-gray-400" />
                
                {/* Autocomplete Dropdown */}
                {showSectorDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredSectors.length > 0 ? (
                      filteredSectors.map(sector => (
                        <button
                          key={sector.value}
                          onClick={() => {
                            toggleSector(sector.value);
                            setShowSectorDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 transition-all ${
                            criteria.sectors.includes(sector.value)
                              ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] font-semibold'
                              : 'text-[#3B4759]'
                          }`}
                        >
                          <div className={`w-4 h-4 border-2 rounded ${
                            criteria.sectors.includes(sector.value)
                              ? 'bg-[#FF6B4A] border-[#FF6B4A]'
                              : 'border-gray-300'
                          }`} />
                          {sector.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">Aucun secteur trouvé</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Tags des secteurs sélectionnés */}
              {criteria.sectors.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {criteria.sectors.map(sectorValue => {
                    const sectorLabel = SECTORS.find(s => s.value === sectorValue)?.label;
                    return (
                      <div
                        key={sectorValue}
                        className="flex items-center gap-1 px-2 py-1 bg-[#FF6B4A]/10 border border-[#FF6B4A] rounded-full text-xs font-semibold text-[#FF6B4A]"
                      >
                        {sectorLabel}
                        <button
                          onClick={() => toggleSector(sectorValue)}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Localisation - Multi-Select Autocomplete */}
            <div className="mb-3 relative" ref={locationDropdownRef}>
              <label className="block text-xs font-bold text-[#3B4759] mb-1 uppercase tracking-wide">Localisation</label>
              <div className="relative">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="Chercher une localisation..."
                  className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm"
                />
                <Search className="absolute right-3 top-2 w-4 h-4 text-gray-400" />
                
                {/* Autocomplete Dropdown */}
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map(location => (
                        <button
                          key={location.value}
                          onClick={() => {
                            toggleLocation(location.value);
                            setShowLocationDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 transition-all ${
                            criteria.locations.includes(location.value)
                              ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] font-semibold'
                              : 'text-[#3B4759]'
                          }`}
                        >
                          <div className={`w-4 h-4 border-2 rounded ${
                            criteria.locations.includes(location.value)
                              ? 'bg-[#FF6B4A] border-[#FF6B4A]'
                              : 'border-gray-300'
                          }`} />
                          {location.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">Aucune localisation trouvée</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Tags des localisations sélectionnées */}
              {criteria.locations.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {criteria.locations.map(locationValue => {
                    const locationLabel = LOCATIONS.find(l => l.value === locationValue)?.label;
                    return (
                      <div
                        key={locationValue}
                        className="flex items-center gap-1 px-2 py-1 bg-[#FF6B4A]/10 border border-[#FF6B4A] rounded-full text-xs font-semibold text-[#FF6B4A]"
                      >
                        {locationLabel}
                        <button
                          onClick={() => toggleLocation(locationValue)}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Budget - Aligné */}
            <div>
              <label className="block text-xs font-bold text-[#3B4759] mb-1 uppercase tracking-wide">Budget</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={criteria.minPrice}
                  onChange={(e) => handleChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all text-sm"
                />
                <input
                  type="number"
                  value={criteria.maxPrice}
                  onChange={(e) => handleChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] transition-all text-sm"
                />
              </div>
            </div>

            {/* Toggle Advanced */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[#FF6B4A] font-semibold text-xs mb-2 flex items-center gap-1 hover:gap-2 transition-all"
            >
              {showAdvanced ? '▼' : '▶'} Critères avancés
            </button>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="border-t border-gray-200 pt-3 space-y-3">
                
                {/* Employees */}
                <div>
                  <label className="block text-xs font-bold text-[#3B4759] mb-1 uppercase tracking-wide">Effectifs</label>
                  <div className="grid grid-cols-3 gap-2">
                    <FormInput icon={Users} label="Min" type="number" value={criteria.minEmployees} onChange={(v) => handleChange('minEmployees', v)} placeholder="0" />
                    <FormInput icon={Users} label="Max" type="number" value={criteria.maxEmployees} onChange={(v) => handleChange('maxEmployees', v)} placeholder="∞" />
                    <div />
                  </div>
                </div>

                {/* Year Founded */}
                <div>
                  <label className="block text-xs font-bold text-[#3B4759] mb-1 uppercase tracking-wide">Année de création</label>
                  <div className="grid grid-cols-3 gap-2">
                    <FormInput icon={Calendar} label="Min" type="number" value={criteria.minYear} onChange={(v) => handleChange('minYear', v)} placeholder="1990" />
                    <FormInput icon={Calendar} label="Max" type="number" value={criteria.maxYear} onChange={(v) => handleChange('maxYear', v)} placeholder={new Date().getFullYear().toString()} />
                    <div />
                  </div>
                </div>

                {/* CA */}
                <div>
                  <label className="block text-xs font-bold text-[#3B4759] mb-1 uppercase tracking-wide">Chiffre d'affaires</label>
                  <div className="grid grid-cols-3 gap-2">
                    <FormInput icon={BarChart3} label="Min" type="number" value={criteria.minCA} onChange={(v) => handleChange('minCA', v)} placeholder="0" />
                    <FormInput icon={BarChart3} label="Max" type="number" value={criteria.maxCA} onChange={(v) => handleChange('maxCA', v)} placeholder="∞" />
                    <div />
                  </div>
                </div>

                {/* EBITDA */}
                <div>
                  <label className="block text-xs font-bold text-[#3B4759] mb-1 uppercase tracking-wide">EBITDA</label>
                  <div className="grid grid-cols-3 gap-2">
                    <FormInput icon={TrendingUp} label="Min" type="number" value={criteria.minEBITDA} onChange={(v) => handleChange('minEBITDA', v)} placeholder="0" />
                    <FormInput icon={TrendingUp} label="Max" type="number" value={criteria.maxEBITDA} onChange={(v) => handleChange('maxEBITDA', v)} placeholder="∞" />
                    <div />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={saveCriteria}
                className="flex-1 bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] text-white py-2 rounded-lg font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                Chercher
              </button>
              <button
                onClick={resetCriteria}
                className="px-3 bg-gray-100 text-[#3B4759] py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Zap className="w-10 h-10 text-[#FF6B4A]" />
            </div>
            <p className="text-[#6B7A94] mt-3 text-sm">Chargement...</p>
          </div>
        )}

        {/* Results */}
        {!loading && matchedListings.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-[#3B4759] mb-4">
              {matchedListings.length} Annonce{matchedListings.length > 1 ? 's' : ''} trouvée{matchedListings.length > 1 ? 's' : ''}
            </h2>

            <div className="space-y-2">
              {matchedListings.map((listing) => {
                const colors = getScoreColor(75);
                return (
                  <div
                    key={listing.id}
                    className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4 hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#3B4759] mb-2">
                          {listing.title || listing.company}
                        </h3>
                        
                        <div className="flex flex-wrap gap-1 mb-1">
                          {listing.location && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs text-[#6B7A94]">
                              <MapPin className="w-3 h-3" /> {listing.location}
                            </div>
                          )}
                          {listing.asking_price && (
                            <div className="px-2 py-1 bg-white rounded-full text-xs font-semibold text-[#FF6B4A]">
                              {(listing.asking_price / 1000).toFixed(0)}k
                            </div>
                          )}
                          {listing.employees && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs text-[#6B7A94]">
                              <Users className="w-3 h-3" /> {listing.employees}
                            </div>
                          )}
                          {listing.year_founded && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs text-[#6B7A94]">
                              <Calendar className="w-3 h-3" /> {listing.year_founded}
                            </div>
                          )}
                        </div>

                        {(listing.annual_revenue || listing.ebitda) && (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {listing.annual_revenue && (
                              <span className="flex items-center gap-1 text-green-700 font-semibold">
                                <BarChart3 className="w-3 h-3" /> CA: {(listing.annual_revenue / 1000).toFixed(0)}k
                              </span>
                            )}
                            {listing.ebitda && (
                              <span className="flex items-center gap-1 text-blue-700 font-semibold">
                                <TrendingUp className="w-3 h-3" /> EBITDA: {(listing.ebitda / 1000).toFixed(0)}k
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Score */}
                      <div className={`flex items-center justify-center w-14 h-14 rounded-full ${colors.bg} border-3 ${colors.border} flex-shrink-0`}>
                        <span className={`text-xl font-bold ${colors.text}`}>75%</span>
                      </div>
                    </div>

                    <button className={`w-full mt-2 py-1.5 border-2 ${colors.border} rounded-lg font-semibold text-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-white transition-all text-xs`}>
                      Détails
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && matchedListings.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-[#6B7A94] text-sm">Configurez vos critères et lancez la recherche</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
