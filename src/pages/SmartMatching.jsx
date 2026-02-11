import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader } from 'lucide-react';

const SMART_MATCHING_CRITERIA = {
  budget: { id: 'budget', label: 'Budget', type: 'range', hasInputs: true, min: 'budget_min', max: 'budget_max' },
  sector: { id: 'sector', label: 'Secteur', type: 'multiselect', hasInputs: true, field: 'sectors' },
  location: { id: 'location', label: 'Localisation', type: 'text', hasInputs: true, field: 'location' },
};

const CRITERIA_BY_SECTION = {
  general: { label: '🎯 Critères Généraux', description: 'Budget, secteur et localisation', criteria: ['budget', 'sector', 'location'] },
};

const DEFAULT_CRITERIA = { criteria_selected: [], budget_min: null, budget_max: null, sectors: [], location: '' };

const getScoreColor = (score) => {
  if (score >= 85) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' };
  if (score >= 70) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' };
  if (score >= 50) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' };
  return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' };
};

const getScoreLabel = (score) => {
  if (score >= 85) return '🏆 Excellent';
  if (score >= 70) return '✅ Bon';
  if (score >= 50) return '⚠️ Partiel';
  return '❌ Faible';
};

const calculateSmartMatchScore = (listing, criteria) => {
  let score = 50;
  if (criteria.criteria_selected?.includes('budget') && criteria.budget_min && criteria.budget_max) {
    if (listing.asking_price >= criteria.budget_min && listing.asking_price <= criteria.budget_max) {
      score = 90;
    } else {
      score = 40;
    }
  }
  return { score, explanation: [], criteriaMatched: 1 };
};

export default function SmartMatching() {
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
  const [listings, setListings] = useState([]);
  const [enrichedListings, setEnrichedListings] = useState([]);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const mockListings = [
      { id: '1', title: 'Hôtel 3* Cannes', asking_price: 380000, sector: 'hospitality', location: 'Cannes', employees: 15 },
      { id: '2', title: 'Restaurant Paris', asking_price: 250000, sector: 'restaurant', location: 'Paris', employees: 20 },
      { id: '3', title: 'Boutique Mode Lyon', asking_price: 150000, sector: 'retail', location: 'Lyon', employees: 5 },
      { id: '4', title: 'Cabinet Conseil', asking_price: 500000, sector: 'consulting', location: 'Toulouse', employees: 30 },
    ];
    setListings(mockListings);
  }, []);

  const handleCriterionToggle = (criterionId) => {
    const selected = criteria.criteria_selected || [];
    const isSelected = selected.includes(criterionId);
    setCriteria({
      ...criteria,
      criteria_selected: isSelected
        ? selected.filter((id) => id !== criterionId)
        : [...selected, criterionId],
    });
  };

  const handleInputChange = (field, value) => {
    setCriteria({ ...criteria, [field]: value });
  };

  const handleApplyCriteria = () => {
    setCalculating(true);
    setTimeout(() => {
      const scores = listings.map((listing) => ({
        ...listing,
        smartMatchScore: calculateSmartMatchScore(listing, criteria),
      }));
      setEnrichedListings(scores.sort((a, b) => b.smartMatchScore.score - a.smartMatchScore.score));
      setCalculating(false);
    }, 500);
  };

  const handleReset = () => {
    setCriteria(DEFAULT_CRITERIA);
    setEnrichedListings([]);
  };

  const selectedCriteriaCount = criteria.criteria_selected?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎯 Smart Matching</h1>
          <p className="text-gray-600 text-lg">Trouvez les entreprises qui correspondent à vos critères</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Mes Critères</h2>

              <div className="space-y-8">
                {Object.entries(CRITERIA_BY_SECTION).map(([sectionKey, section]) => (
                  <div key={sectionKey} className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 text-sm">{section.label}</h3>
                      <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                    </div>

                    {section.criteria.map((criterionId) => {
                      const criterion = SMART_MATCHING_CRITERIA[criterionId];
                      const isSelected = criteria.criteria_selected?.includes(criterionId);

                      return (
                        <div key={criterionId} className="space-y-2">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCriterionToggle(criterionId)}
                              className="w-5 h-5"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                              {criterion.label}
                            </span>
                          </label>

                          {isSelected && criterion.hasInputs && (
                            <div className="pl-8 space-y-2">
                              {criterion.type === 'range' && (
                                <div className="space-y-2">
                                  <input
                                    type="number"
                                    placeholder="Min"
                                    value={criteria[criterion.min] || ''}
                                    onChange={(e) =>
                                      handleInputChange(criterion.min, e.target.value ? Number(e.target.value) : null)
                                    }
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Max"
                                    value={criteria[criterion.max] || ''}
                                    onChange={(e) =>
                                      handleInputChange(criterion.max, e.target.value ? Number(e.target.value) : null)
                                    }
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
                                  />
                                </div>
                              )}

                              {criterion.type === 'text' && (
                                <input
                                  type="text"
                                  placeholder={criterion.label}
                                  value={criteria[criterion.field] || ''}
                                  onChange={(e) => handleInputChange(criterion.field, e.target.value)}
                                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleApplyCriteria}
                  disabled={calculating}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-11 font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {calculating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Calcul...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Chercher les Matches
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 h-11 font-semibold rounded-lg"
                >
                  Réinitialiser
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Critères: <span className="font-semibold">{selectedCriteriaCount}/3</span>
                </p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                    style={{ width: `${(selectedCriteriaCount / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {calculating && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-orange-500" />
                <p className="text-gray-600 font-semibold">Analyse...</p>
              </div>
            )}

            {!calculating && enrichedListings.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
                <p className="text-gray-500">Sélectionnez vos critères et cherchez</p>
              </div>
            )}

            {!calculating && enrichedListings.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {enrichedListings.length} Résultat{enrichedListings.length > 1 ? 's' : ''}
                </h2>

                {enrichedListings.map((listing, index) => {
                  const score = Math.round(listing.smartMatchScore?.score || 0);
                  const scoreColor = getScoreColor(score);

                  return (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${scoreColor.bg} border ${scoreColor.border} rounded-2xl p-6`}
                    >
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-3xl font-bold ${scoreColor.text}`}>{score}%</span>
                          <span className="text-sm font-medium text-gray-600">{getScoreLabel(score)}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {listing.asking_price?.toLocaleString('fr-FR')} € • {listing.employees} salariés • {listing.location}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium">
                          Voir détails
                        </button>
                        <button className="flex-1 bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                          Contacter
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
