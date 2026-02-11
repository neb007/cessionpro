import React, { useState, useEffect } from 'react';
import { Zap, Settings, MapPin, DollarSign, Briefcase, Save, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import SmartMatchingBanner from '@/components/layout/SmartMatchingBanner';

export default function SmartMatching() {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  // État des annonces
  const [allListings, setAllListings] = useState([]);
  const [matchedListings, setMatchedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État du formulaire
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    financial: false,
  });
  
  const [criteria, setCriteria] = useState({
    // Basiques
    sector: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    minEmployees: '',
    maxEmployees: '',
    minYear: '',
    maxYear: '',
    
    // Financiers
    minCA: '',
    maxCA: '',
    minEBITDA: '',
    maxEBITDA: '',
  });

  // Charger les annonces depuis Supabase
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

        // Pré-configurer basé sur profil
        if (user?.user_metadata) {
          setCriteria(prev => ({
            ...prev,
            sector: user.user_metadata.sector || '',
            location: user.user_metadata.location || '',
          }));
        }
      } catch (err) {
        console.error('Error loading listings:', err);
        setError(err?.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadListings();
    }
  }, [user]);

  // Fonction de recherche
  const searchMatches = () => {
    let results = allListings;

    // Secteur
    if (criteria.sector) {
      results = results.filter(l => 
        l.sector?.toLowerCase().includes(criteria.sector.toLowerCase())
      );
    }

    // Localisation
    if (criteria.location) {
      results = results.filter(l => 
        l.location?.toLowerCase().includes(criteria.location.toLowerCase()) ||
        l.region?.toLowerCase().includes(criteria.location.toLowerCase())
      );
    }

    // Prix de cession
    if (criteria.minPrice) {
      results = results.filter(l => l.asking_price >= parseInt(criteria.minPrice));
    }
    if (criteria.maxPrice) {
      results = results.filter(l => l.asking_price <= parseInt(criteria.maxPrice));
    }

    // Employés
    if (criteria.minEmployees) {
      results = results.filter(l => l.employees >= parseInt(criteria.minEmployees));
    }
    if (criteria.maxEmployees) {
      results = results.filter(l => l.employees <= parseInt(criteria.maxEmployees));
    }

    // Année de création
    if (criteria.minYear) {
      results = results.filter(l => l.year_founded >= parseInt(criteria.minYear));
    }
    if (criteria.maxYear) {
      results = results.filter(l => l.year_founded <= parseInt(criteria.maxYear));
    }

    // CA (Chiffre d'Affaires)
    if (criteria.minCA) {
      results = results.filter(l => l.annual_revenue >= parseInt(criteria.minCA));
    }
    if (criteria.maxCA) {
      results = results.filter(l => l.annual_revenue <= parseInt(criteria.maxCA));
    }

    // EBITDA
    if (criteria.minEBITDA) {
      results = results.filter(l => l.ebitda >= parseInt(criteria.minEBITDA));
    }
    if (criteria.maxEBITDA) {
      results = results.filter(l => l.ebitda <= parseInt(criteria.maxEBITDA));
    }

    setMatchedListings(results);
  };

  // Charger critères sauvegardés
  useEffect(() => {
    const saved = localStorage.getItem('smartMatchingCriteria');
    if (saved) {
      setCriteria(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder critères
  const saveCriteria = () => {
    localStorage.setItem('smartMatchingCriteria', JSON.stringify(criteria));
    searchMatches();
  };

  const handleCriteriaChange = (field, value) => {
    setCriteria(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetCriteria = () => {
    setCriteria({
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
    setMatchedListings([]);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 85) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: '🏆 Excellent' };
    if (score >= 70) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: '✅ Bon' };
    if (score >= 50) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: '⚠️ Acceptable' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: '❌ Faible' };
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center shadow-lg shadow-[#FF6B4A]/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#3B4759]">Smart Matching</h1>
            <p className="text-[#6B7A94]">
              {language === 'fr' 
                ? 'Configurez vos critères et trouvez les annonces qui vous correspondent'
                : 'Set your criteria and find listings that match your needs'}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      {!loading && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg">
          <div 
            className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#FF6B4A]" />
              <h2 className="text-lg font-semibold text-[#3B4759]">
                {language === 'fr' ? 'Mes Critères' : 'My Criteria'}
              </h2>
            </div>
            <button className="text-[#6B7A94]">
              {showFilters ? '▼' : '▶'}
            </button>
          </div>

          {showFilters && (
            <div className="px-6 pb-6 border-t border-gray-200 space-y-6">
              
              {/* SECTION BASIQUE */}
              <div>
                <div 
                  className="cursor-pointer flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-300"
                  onClick={() => toggleSection('basic')}
                >
                  <h3 className="font-semibold text-[#3B4759] text-lg">📍 Critères Basiques</h3>
                  <span className="text-[#6B7A94]">{expandedSections.basic ? '▼' : '▶'}</span>
                </div>

                {expandedSections.basic && (
                  <div className="space-y-4 pl-4">
                    {/* Secteur */}
                    <div>
                      <label className="block text-sm font-medium text-[#3B4759] mb-2">Secteur d'activité</label>
                      <input
                        type="text"
                        value={criteria.sector}
                        onChange={(e) => handleCriteriaChange('sector', e.target.value)}
                        placeholder="Ex: Restaurant, Technologie..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                      />
                    </div>

                    {/* Localisation */}
                    <div>
                      <label className="block text-sm font-medium text-[#3B4759] mb-2">Localisation</label>
                      <input
                        type="text"
                        value={criteria.location}
                        onChange={(e) => handleCriteriaChange('location', e.target.value)}
                        placeholder="Ex: Paris, Île-de-France..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                      />
                    </div>

                    {/* Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">Prix Min (€)</label>
                        <input type="number" value={criteria.minPrice} onChange={(e) => handleCriteriaChange('minPrice', e.target.value)} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">Prix Max (€)</label>
                        <input type="number" value={criteria.maxPrice} onChange={(e) => handleCriteriaChange('maxPrice', e.target.value)} placeholder="∞" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                    </div>

                    {/* Employees */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">Employés Min</label>
                        <input type="number" value={criteria.minEmployees} onChange={(e) => handleCriteriaChange('minEmployees', e.target.value)} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">Employés Max</label>
                        <input type="number" value={criteria.maxEmployees} onChange={(e) => handleCriteriaChange('maxEmployees', e.target.value)} placeholder="∞" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                    </div>

                    {/* Year */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">Créée depuis</label>
                        <input type="number" value={criteria.minYear} onChange={(e) => handleCriteriaChange('minYear', e.target.value)} placeholder="1990" min="1900" max={new Date().getFullYear()} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">Créée jusqu'à</label>
                        <input type="number" value={criteria.maxYear} onChange={(e) => handleCriteriaChange('maxYear', e.target.value)} placeholder={new Date().getFullYear().toString()} min="1900" max={new Date().getFullYear()} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION FINANCIÈRE */}
              <div>
                <div 
                  className="cursor-pointer flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-300"
                  onClick={() => toggleSection('financial')}
                >
                  <h3 className="font-semibold text-[#3B4759] text-lg">💰 Critères Financiers</h3>
                  <span className="text-[#6B7A94]">{expandedSections.financial ? '▼' : '▶'}</span>
                </div>

                {expandedSections.financial && (
                  <div className="space-y-4 pl-4">
                    {/* CA */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">CA Min (€)</label>
                        <input type="number" value={criteria.minCA} onChange={(e) => handleCriteriaChange('minCA', e.target.value)} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">CA Max (€)</label>
                        <input type="number" value={criteria.maxCA} onChange={(e) => handleCriteriaChange('maxCA', e.target.value)} placeholder="∞" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                    </div>

                    {/* EBITDA */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">EBITDA Min (€)</label>
                        <input type="number" value={criteria.minEBITDA} onChange={(e) => handleCriteriaChange('minEBITDA', e.target.value)} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#3B4759] mb-2">EBITDA Max (€)</label>
                        <input type="number" value={criteria.maxEBITDA} onChange={(e) => handleCriteriaChange('maxEBITDA', e.target.value)} placeholder="∞" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t border-gray-300">
                <button
                  onClick={saveCriteria}
                  className="flex-1 bg-[#FF6B4A] text-white py-2 rounded-lg font-medium hover:bg-[#FF5233] transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Chercher les matches
                </button>
                <button
                  onClick={resetCriteria}
                  className="px-6 bg-gray-200 text-[#3B4759] py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-[#6B7A94]">Chargement...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && matchedListings.length === 0 && !error && (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-[#6B7A94]">
            Configurez vos critères et lancez la recherche
          </p>
        </div>
      )}

      {!loading && matchedListings.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-[#3B4759] mb-6">
            Annonces correspondantes ({matchedListings.length})
          </h2>

          <div className="space-y-4">
            {matchedListings.map((listing) => {
              const scoreColor = getScoreColor(75);
              return (
                <div
                  key={listing.id}
                  className={`${scoreColor.bg} border ${scoreColor.border} rounded-lg p-6 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#3B4759] mb-2">
                        {listing.title || listing.company}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-[#6B7A94] mb-3">
                        {listing.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {listing.location}
                          </div>
                        )}
                        {listing.asking_price && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <strong>{(listing.asking_price / 1000).toFixed(0)}k €</strong>
                          </div>
                        )}
                        {listing.employees && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {listing.employees} employés
                          </div>
                        )}
                        {listing.year_founded && (
                          <div className="flex items-center gap-1">
                            📅 Créée {listing.year_founded}
                          </div>
                        )}
                      </div>

                      {/* Données financières */}
                      {(listing.annual_revenue || listing.ebitda) && (
                        <div className="flex flex-wrap gap-3 text-sm bg-white bg-opacity-50 p-3 rounded">
                          {listing.annual_revenue && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span>CA: <strong>{(listing.annual_revenue / 1000).toFixed(0)}k €</strong></span>
                            </div>
                          )}
                          {listing.ebitda && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              <span>EBITDA: <strong>{(listing.ebitda / 1000).toFixed(0)}k €</strong></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Score Badge */}
                    <div className="flex flex-col items-center ml-4">
                      <div className={`w-16 h-16 flex items-center justify-center rounded-full ${scoreColor.bg} border-2 ${scoreColor.border}`}>
                        <span className={`text-2xl font-bold ${scoreColor.text}`}>75%</span>
                      </div>
                      <span className="text-xs text-[#6B7A94] mt-2 font-semibold">{scoreColor.label}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className={`w-full py-2 border-2 ${scoreColor.border} text-[#FF6B4A] hover:bg-[#FF6B4A]/5 rounded-lg font-medium transition-colors text-sm`}>
                    Voir les détails
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
