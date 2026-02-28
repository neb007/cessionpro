import React, { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Search,
  Send,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  SMART_MATCHING_SECTORS as SECTORS,
  SMART_MATCHING_LOCATIONS as LOCATIONS,
} from '@/constants/smartMatchingConfig';
import { normalize } from '@/services/smartMatchingScorer';

export default function SmartMatchingFiltersMobile({
  open,
  onOpenChange,
  language,
  criteria,
  onChangeCriteria,
  onToggleSector,
  onToggleLocation,
  onSave,
  onReset,
  saving,
  smartMatchingMode,
}) {
  const [sectorSearch, setSectorSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredSectors = useMemo(
    () => SECTORS.filter((s) => normalize(s.label).includes(normalize(sectorSearch))),
    [sectorSearch]
  );
  const filteredLocations = useMemo(
    () => LOCATIONS.filter((l) => normalize(l.label).includes(normalize(locationSearch))),
    [locationSearch]
  );

  const handleChange = (field, value) => onChangeCriteria(field, value);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[88vh] rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading">
            {language === 'fr' ? 'Critères de matching' : 'Matching criteria'}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          {/* Sectors */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {language === 'fr' ? 'Secteurs' : 'Sectors'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={sectorSearch}
                onChange={(e) => setSectorSearch(e.target.value)}
                placeholder={language === 'fr' ? 'Chercher un secteur...' : 'Search a sector...'}
                className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="max-h-40 overflow-y-auto mt-1 border border-border rounded-lg bg-white">
              {filteredSectors.map((sector) => (
                <button
                  key={sector.value}
                  type="button"
                  onClick={() => onToggleSector(sector.value)}
                  className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 min-h-[44px] ${
                    criteria.sectors.includes(sector.value)
                      ? 'bg-primary-light text-primary font-semibold'
                      : 'text-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 rounded flex-shrink-0 ${
                    criteria.sectors.includes(sector.value) ? 'bg-primary border-primary' : 'border-border'
                  }`} />
                  {sector.label}
                </button>
              ))}
            </div>
            {criteria.sectors.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {criteria.sectors.map((v) => (
                  <span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-light border border-primary/30 rounded-full text-xs font-semibold text-primary">
                    {SECTORS.find((s) => s.value === v)?.label || v}
                    <button type="button" onClick={() => onToggleSector(v)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Locations */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {language === 'fr' ? 'Localisations' : 'Locations'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder={language === 'fr' ? 'Chercher une zone...' : 'Search a location...'}
                className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="max-h-40 overflow-y-auto mt-1 border border-border rounded-lg bg-white">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.value}
                  type="button"
                  onClick={() => onToggleLocation(loc.value)}
                  className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 min-h-[44px] ${
                    criteria.locations.includes(loc.value)
                      ? 'bg-primary-light text-primary font-semibold'
                      : 'text-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 rounded flex-shrink-0 ${
                    criteria.locations.includes(loc.value) ? 'bg-primary border-primary' : 'border-border'
                  }`} />
                  {loc.label}
                </button>
              ))}
            </div>
            {criteria.locations.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {criteria.locations.map((v) => (
                  <span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-light border border-primary/30 rounded-full text-xs font-semibold text-primary">
                    {LOCATIONS.find((l) => l.value === v)?.label || v}
                    <button type="button" onClick={() => onToggleLocation(v)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {smartMatchingMode === 'buyer'
                ? language === 'fr' ? 'Budget cible (€)' : 'Target budget (€)'
                : language === 'fr' ? 'Budget acheteur attendu (€)' : 'Expected buyer budget (€)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={criteria.minPrice} onChange={(e) => handleChange('minPrice', e.target.value)}
                placeholder="100000" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
              <input type="number" value={criteria.maxPrice} onChange={(e) => handleChange('maxPrice', e.target.value)}
                placeholder="2000000" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
            </div>
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="text-primary font-semibold text-xs flex items-center gap-1.5"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`} />
            {language === 'fr' ? 'Filtres avancés' : 'Advanced filters'}
          </button>

          {showAdvanced && (
            <div className="space-y-3 border-t border-border pt-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">{language === 'fr' ? 'Effectifs' : 'Employees'}</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={criteria.minEmployees} onChange={(e) => handleChange('minEmployees', e.target.value)}
                    placeholder="5" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
                  <input type="number" value={criteria.maxEmployees} onChange={(e) => handleChange('maxEmployees', e.target.value)}
                    placeholder="500" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">{language === 'fr' ? 'Année de création' : 'Founded year'}</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={criteria.minYear} onChange={(e) => handleChange('minYear', e.target.value)}
                    placeholder="1990" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
                  <input type="number" value={criteria.maxYear} onChange={(e) => handleChange('maxYear', e.target.value)}
                    placeholder={new Date().getFullYear().toString()} className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">{language === 'fr' ? "Chiffre d'affaires (€)" : 'Revenue (€)'}</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={criteria.minCA} onChange={(e) => handleChange('minCA', e.target.value)}
                    placeholder="100000" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
                  <input type="number" value={criteria.maxCA} onChange={(e) => handleChange('maxCA', e.target.value)}
                    placeholder="5000000" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">EBITDA (€)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={criteria.minEBITDA} onChange={(e) => handleChange('minEBITDA', e.target.value)}
                    placeholder="0" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
                  <input type="number" value={criteria.maxEBITDA} onChange={(e) => handleChange('maxEBITDA', e.target.value)}
                    placeholder="1000000" className="w-full py-2.5 px-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]" />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 pb-4">
            <button
              type="button"
              onClick={() => { onSave(); onOpenChange(false); }}
              disabled={saving}
              className="flex-1 text-white min-h-[44px] py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              style={{background: 'var(--gradient-coral)'}}
            >
              <Send className="w-4 h-4" />
              {language === 'fr' ? 'Rechercher' : 'Search'}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="min-h-[44px] px-4 bg-muted text-foreground rounded-xl font-semibold inline-flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
