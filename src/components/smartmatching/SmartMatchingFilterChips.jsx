import React from 'react';
import { X } from 'lucide-react';
import {
  SMART_MATCHING_SECTORS as SECTORS,
  SMART_MATCHING_LOCATIONS as LOCATIONS,
} from '@/constants/smartMatchingConfig';
import { isRangeActive, toNumber } from '@/services/smartMatchingScorer';

const formatCompact = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(value);

export default function SmartMatchingFilterChips({
  language,
  criteria,
  onToggleSector,
  onToggleLocation,
  onChangeCriteria,
}) {
  const chips = [];

  // Sectors
  criteria.sectors.forEach((v) => {
    const label = SECTORS.find((s) => s.value === v)?.label || v;
    chips.push({ key: `sector-${v}`, label, type: 'sector', onRemove: () => onToggleSector(v) });
  });

  // Locations
  criteria.locations.forEach((v) => {
    const label = LOCATIONS.find((l) => l.value === v)?.label || v;
    chips.push({ key: `loc-${v}`, label, type: 'location', onRemove: () => onToggleLocation(v) });
  });

  // Budget range
  const minP = toNumber(criteria.minPrice);
  const maxP = toNumber(criteria.maxPrice);
  if (minP || maxP) {
    const parts = [];
    if (minP) parts.push(formatCompact(minP));
    if (maxP) parts.push(formatCompact(maxP));
    chips.push({
      key: 'budget',
      label: parts.join(' - '),
      type: 'budget',
      onRemove: () => { onChangeCriteria('minPrice', ''); onChangeCriteria('maxPrice', ''); },
    });
  }

  // Advanced filters
  if (isRangeActive(criteria.minEmployees, criteria.maxEmployees)) {
    chips.push({
      key: 'employees',
      label: language === 'fr' ? 'Effectifs' : 'Employees',
      type: 'advanced',
      onRemove: () => { onChangeCriteria('minEmployees', ''); onChangeCriteria('maxEmployees', ''); },
    });
  }
  if (isRangeActive(criteria.minYear, criteria.maxYear)) {
    chips.push({
      key: 'year',
      label: language === 'fr' ? 'Année' : 'Year',
      type: 'advanced',
      onRemove: () => { onChangeCriteria('minYear', ''); onChangeCriteria('maxYear', ''); },
    });
  }
  if (isRangeActive(criteria.minCA, criteria.maxCA)) {
    chips.push({
      key: 'ca',
      label: language === 'fr' ? "Chiffre d'affaires" : 'Revenue',
      type: 'advanced',
      onRemove: () => { onChangeCriteria('minCA', ''); onChangeCriteria('maxCA', ''); },
    });
  }
  if (isRangeActive(criteria.minEBITDA, criteria.maxEBITDA)) {
    chips.push({
      key: 'ebitda',
      label: 'EBITDA',
      type: 'advanced',
      onRemove: () => { onChangeCriteria('minEBITDA', ''); onChangeCriteria('maxEBITDA', ''); },
    });
  }

  if (chips.length === 0) return null;

  const typeStyles = {
    sector: 'bg-primary/10 text-primary border-primary/20',
    location: 'bg-violet/10 text-violet border-violet/20',
    budget: 'bg-green-50 text-green-700 border-green-200',
    advanced: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-1.5 flex-wrap py-2">
        <span className="text-xs text-muted-foreground mr-1">
          {language === 'fr' ? 'Filtres :' : 'Filters:'}
        </span>
        {chips.map((chip) => (
          <span
            key={chip.key}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${typeStyles[chip.type]}`}
          >
            {chip.label}
            <button type="button" onClick={chip.onRemove} className="hover:opacity-70 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
