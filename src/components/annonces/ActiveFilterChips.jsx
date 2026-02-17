import React from 'react';
import { X } from 'lucide-react';

const formatCompactCurrency = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(value);

export default function ActiveFilterChips({
  filtersState,
  hasActiveFilters,
  language,
  t,
  onUpdateFilter,
}) {
  if (!hasActiveFilters) return null;

  const min = Number(filtersState.budgetMin) || 0;
  const max = Number(filtersState.budgetMax) || 5000000;

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      <span className="text-sm text-gray-500">
        {language === 'fr' ? 'Filtres actifs:' : 'Active filters:'}
      </span>
      <div className="flex flex-wrap gap-2">
        {filtersState.query && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            "{filtersState.query}"
            <button onClick={() => onUpdateFilter('query', '')}>
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        {filtersState.sector && filtersState.sector !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
            {t(filtersState.sector)}
            <button onClick={() => onUpdateFilter('sector', '')}>
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        {(min > 0 || max < 5000000) && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {min > 0 ? formatCompactCurrency(min) : ''}
            {min > 0 && max < 5000000 ? ' - ' : ''}
            {max < 5000000 ? formatCompactCurrency(max) : ''}
            <button
              onClick={() => {
                onUpdateFilter('budgetMin', '');
                onUpdateFilter('budgetMax', '');
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        {filtersState.country && filtersState.country !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            {filtersState.country}
            <button onClick={() => onUpdateFilter('country', '')}>
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        {filtersState.department && filtersState.department !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            {filtersState.department}
            <button onClick={() => onUpdateFilter('department', '')}>
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
