export const SMART_MATCHING_CRITERIA = {
  budget: {
    id: 'budget',
    label: 'Budget',
    section: 'general',
    weight: 3,
    type: 'range',
    hasInputs: true,
    min: 'budget_min',
    max: 'budget_max',
    description: 'Budget d\'acquisition',
  },
  sector: {
    id: 'sector',
    label: 'Secteur d\'activité',
    section: 'general',
    weight: 3,
    type: 'multiselect',
    hasInputs: true,
    field: 'sectors',
    description: 'Domaines d\'activité recherchés',
    options: [
      { value: 'hospitality', label: 'Hôtellerie' },
      { value: 'restaurant', label: 'Restauration' },
      { value: 'retail', label: 'Commerce' },
      { value: 'services', label: 'Services' },
      { value: 'healthcare', label: 'Santé' },
      { value: 'it', label: 'Informatique' },
      { value: 'consulting', label: 'Conseil' },
    ],
  },
  location: {
    id: 'location',
    label: 'Localisation',
    section: 'general',
    weight: 2,
    type: 'text',
    hasInputs: true,
    field: 'location',
    description: 'Région, ville ou département',
  },
  growth_potential: {
    id: 'growth_potential',
    label: 'Potentiel de croissance',
    section: 'growth',
    weight: 2,
    type: 'select',
    hasInputs: true,
    field: 'growth_potential',
    description: 'Synergies et développement',
    options: [
      { value: 'high', label: 'Élevé' },
      { value: 'medium', label: 'Moyen' },
      { value: 'low', label: 'Faible' },
    ],
  },
};

export const CRITERIA_BY_SECTION = {
  general: {
    label: '🎯 Critères Généraux',
    description: 'Budget, secteur et localisation',
    criteria: ['budget', 'sector', 'location'],
  },
  growth: {
    label: '📈 Potentiel',
    description: 'Développement et synergies',
    criteria: ['growth_potential'],
  },
};

export const DEFAULT_CRITERIA = {
  criteria_selected: [],
  budget_min: null,
  budget_max: null,
  sectors: [],
  location: '',
  growth_potential: null,
};

export const SCORE_COLORS = {
  excellent: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    label: 'Excellent match',
  },
  good: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    label: 'Bon match',
  },
  partial: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600',
    label: 'Match partiel',
  },
  poor: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    label: 'Faible match',
  },
};

export function getScoreColor(score) {
  if (score >= 85) return SCORE_COLORS.excellent;
  if (score >= 70) return SCORE_COLORS.good;
  if (score >= 50) return SCORE_COLORS.partial;
  return SCORE_COLORS.poor;
}

export function getScoreLabel(score) {
  if (score >= 85) return '🏆 Excellent match';
  if (score >= 70) return '✅ Bon match';
  if (score >= 50) return '⚠️ Match partiel';
  return '❌ Faible match';
}
