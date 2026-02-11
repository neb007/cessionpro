import React, { useState, useEffect } from 'react';
import { Zap, MapPin, DollarSign, Briefcase, Send, TrendingUp, Users, X } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import SmartMatchingBanner from '@/components/layout/SmartMatchingBanner';

export default function SmartMatching() {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const [allListings, setAllListings] = useState([]);
  const [matchedListings, setMatchedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [criteria, setCriteria] = useState({
    sector: '',
    location: '',
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

  // Charger les annonces
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
            sector: user.user_metadata.sector || '',
            location: user.user_metadata.location || '',
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

    if (criteria.sector) {
      results = results.filter(l => 
        l.sector?.toLowerCase().includes(criteria.sector.toLowerCase())
      );
    }
    if (criteria.location) {
      results = results.filter(l => 
        l.location?.toLowerCase().includes(criteria.location.toLowerCase()) ||
        l.region?.toLowerCase().includes(criteria.location.toLowerCase())
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
      sector: '', location: '', minPrice: '', maxPrice: '', 
      minEmployees: '', maxEmployees: '', minYear: '', maxYear: '',
      minCA: '', maxCA: '', minEBITDA: '', maxEBITDA: '',
    });
    setMatchedListings([]);
  };

  // Quick price presets
  const pricePresets = [
    { label: '< 100k', min: 0, max: 100000 },
    { label: '100k - 500k', min: 100000, max: 500000 },
    { label: '500k - 1M', min: 500000, max: 1000000 },
    { label: '> 1M', min: 1000000, max: null },
  ];

  const applyPricePreset = (preset) => {
    setCriteria(prev => ({
      ...prev,
      minPrice: preset.min.toString(),
      maxPrice: preset.max?.toString() || '',
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 85) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
    if (score >= 70) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
    if (score >= 50) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
  };

  // FormInput component
  const FormInput = ({ icon: Icon, label, type = 'text', value, onChange, placeholder }) => (
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-4 text-[#FF6B4A]">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF6B4A] focus:ring-0 transition-all hover:border-gray-200"
      />
      {label && (
        <label className="absolute -top-2.5 left-4 text-xs font-semibold text-[#6B7A94] bg-white px-2">
          {label}
        </label>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3B4759]">Smart Matching</h1>
              <p className="text-sm text-[#6B7A94]">Trouvez l'entreprise parfaite selon vos critères</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Search Form Card */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 transition-all hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <FormInput icon={Briefcase} label="Secteur" value={criteria.sector} onChange={(v) => handleChange('sector', v)} placeholder="Restaurant, Tech..." />
              <FormInput icon={MapPin} label="Localisation" value={criteria.location} onChange={(v) => handleChange('location', v)} placeholder="Paris, Lyon..." />
              <div />
            </div>

            {/* Price Section */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#3B4759] mb-4 uppercase tracking-wide">💰 Prix de Cession</h3>
              
              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pricePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPricePreset(preset)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      criteria.minPrice === preset.min.toString() 
                        ? 'bg-[#FF6B4A] text-white shadow-lg' 
                        : 'bg-gray-100 text-[#3B4759] hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Range Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput icon={DollarSign} label="Min" type="number" value={criteria.minPrice} onChange={(v) => handleChange('minPrice', v)} placeholder="0" />
                <FormInput icon={DollarSign} label="Max" type="number" value={criteria.maxPrice} onChange={(v) => handleChange('maxPrice', v)} placeholder="∞" />
              </div>
            </div>

            {/* Toggle Advanced */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[#FF6B4A] font-semibold text-sm mb-6 flex items-center gap-2 hover:gap-3 transition-all"
            >
              {showAdvanced ? '▼' : '▶'} Critères avancés
            </button>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="border-t-2 border-gray-100 pt-8 space-y-8">
                
                {/* Employees */}
                <div>
                  <h3 className="text-sm font-bold text-[#3B4759] mb-4 uppercase tracking-wide">👥 Effectifs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput icon={null} label="Min" type="number" value={criteria.minEmployees} onChange={(v) => handleChange('minEmployees', v)} placeholder="0" />
                    <FormInput icon={null} label="Max" type="number" value={criteria.maxEmployees} onChange={(v) => handleChange('maxEmployees', v)} placeholder="∞" />
                  </div>
                </div>

                {/* Year Founded */}
                <div>
                  <h3 className="text-sm font-bold text-[#3B4759] mb-4 uppercase tracking-wide">📅 Année de Création</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Depuis" type="number" value={criteria.minYear} onChange={(v) => handleChange('minYear', v)} placeholder="1990" />
                    <FormInput label="Jusqu'à" type="number" value={criteria.maxYear} onChange={(v) => handleChange('maxYear', v)} placeholder={new Date().getFullYear().toString()} />
                  </div>
                </div>

                {/* CA */}
                <div>
                  <h3 className="text-sm font-bold text-[#3B4759] mb-4 uppercase tracking-wide">📊 Chiffre d'Affaires</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Min" type="number" value={criteria.minCA} onChange={(v) => handleChange('minCA', v)} placeholder="0" />
                    <FormInput label="Max" type="number" value={criteria.maxCA} onChange={(v) => handleChange('maxCA', v)} placeholder="∞" />
                  </div>
                </div>

                {/* EBITDA */}
                <div>
                  <h3 className="text-sm font-bold text-[#3B4759] mb-4 uppercase tracking-wide">💹 EBITDA</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Min" type="number" value={criteria.minEBITDA} onChange={(v) => handleChange('minEBITDA', v)} placeholder="0" />
                    <FormInput label="Max" type="number" value={criteria.maxEBITDA} onChange={(v) => handleChange('maxEBITDA', v)} placeholder="∞" />
                  </div>
                </div>

              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={saveCriteria}
                className="flex-1 bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
              >
                <Send className="w-5 h-5" />
                Chercher
              </button>
              <button
                onClick={resetCriteria}
                className="px-8 bg-gray-100 text-[#3B4759] py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin">
              <Zap className="w-12 h-12 text-[#FF6B4A]" />
            </div>
            <p className="text-[#6B7A94] mt-4">Chargement...</p>
          </div>
        )}

        {/* Results */}
        {!loading && matchedListings.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#3B4759]">
                {matchedListings.length} Annonce{matchedListings.length > 1 ? 's' : ''} trouvée{matchedListings.length > 1 ? 's' : ''}
              </h2>
            </div>

            <div className="space-y-4">
              {matchedListings.map((listing) => {
                const colors = getScoreColor(75);
                return (
                  <div
                    key={listing.id}
                    className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#3B4759] mb-4">
                          {listing.title || listing.company}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {listing.location && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-[#6B7A94]">
                              <MapPin className="w-4 h-4" /> {listing.location}
                            </div>
                          )}
                          {listing.asking_price && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm font-semibold text-[#FF6B4A]">
                              <DollarSign className="w-4 h-4" /> {(listing.asking_price / 1000).toFixed(0)}k €
                            </div>
                          )}
                          {listing.employees && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-[#6B7A94]">
                              <Users className="w-4 h-4" /> {listing.employees} empl.
                            </div>
                          )}
                          {listing.year_founded && (
                            <div className="px-3 py-1 bg-white rounded-full text-sm text-[#6B7A94]">
                              📅 {listing.year_founded}
                            </div>
                          )}
                        </div>

                        {(listing.annual_revenue || listing.ebitda) && (
                          <div className="flex flex-wrap gap-3 text-sm">
                            {listing.annual_revenue && (
                              <span className="flex items-center gap-1 text-green-700 font-semibold">
                                <TrendingUp className="w-4 h-4" /> CA: {(listing.annual_revenue / 1000).toFixed(0)}k€
                              </span>
                            )}
                            {listing.ebitda && (
                              <span className="flex items-center gap-1 text-blue-700 font-semibold">
                                <TrendingUp className="w-4 h-4" /> EBITDA: {(listing.ebitda / 1000).toFixed(0)}k€
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Score */}
                      <div className={`flex items-center justify-center w-24 h-24 rounded-full ${colors.bg} border-4 ${colors.border} flex-shrink-0`}>
                        <span className={`text-4xl font-bold ${colors.text}`}>75%</span>
                      </div>
                    </div>

                    <button className={`w-full mt-6 py-3 border-2 ${colors.border} rounded-xl font-semibold text-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-white transition-all`}>
                      Voir les détails
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && matchedListings.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-[#6B7A94] text-lg">Configurez vos critères et lancez la recherche</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
