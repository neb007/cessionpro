import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Send, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  SMART_MATCHING_SECTORS as SECTORS,
  SMART_MATCHING_LOCATIONS as LOCATIONS,
} from '@/constants/smartMatchingConfig';
import { normalize } from '@/services/smartMatchingScorer';

export default function SmartMatchingFilterBar({
  language,
  criteria,
  onChangeCriteria,
  onToggleSector,
  onToggleLocation,
  onSave,
  onReset,
  saving,
  smartMatchingMode,
  advancedCount,
  children: advancedFiltersContent,
}) {
  const [sectorOpen, setSectorOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [sectorSearch, setSectorSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const sectorRef = useRef(null);
  const locationRef = useRef(null);

  const filteredSectors = useMemo(
    () => SECTORS.filter((s) => normalize(s.label).includes(normalize(sectorSearch))),
    [sectorSearch]
  );
  const filteredLocations = useMemo(
    () => LOCATIONS.filter((l) => normalize(l.label).includes(normalize(locationSearch))),
    [locationSearch]
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (sectorRef.current && !sectorRef.current.contains(e.target)) setSectorOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target)) setLocationOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
      <div className="hidden md:block bg-white border-b border-border sticky top-[73px] z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
            {/* Sector multi-select */}
            <div className="relative flex-1 max-w-[200px]" ref={sectorRef}>
              <div
                onClick={() => setSectorOpen((p) => !p)}
                className="h-9 px-3 flex items-center gap-2 bg-white border border-border rounded-lg text-sm cursor-pointer hover:border-primary transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className={criteria.sectors.length ? 'text-foreground font-medium truncate' : 'text-muted-foreground truncate'}>
                  {criteria.sectors.length
                    ? `${criteria.sectors.length} ${language === 'fr' ? 'secteur(s)' : 'sector(s)'}`
                    : language === 'fr' ? 'Secteur' : 'Sector'}
                </span>
              </div>
              {sectorOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
                  <div className="p-2 border-b border-border">
                    <input
                      type="text"
                      value={sectorSearch}
                      onChange={(e) => setSectorSearch(e.target.value)}
                      placeholder={language === 'fr' ? 'Chercher...' : 'Search...'}
                      className="w-full py-1.5 px-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredSectors.map((sector) => (
                      <button
                        key={sector.value}
                        type="button"
                        onClick={() => onToggleSector(sector.value)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors ${
                          criteria.sectors.includes(sector.value) ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 border-2 rounded flex-shrink-0 ${
                          criteria.sectors.includes(sector.value) ? 'bg-primary border-primary' : 'border-border'
                        }`} />
                        {sector.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location multi-select */}
            <div className="relative flex-1 max-w-[200px]" ref={locationRef}>
              <div
                onClick={() => setLocationOpen((p) => !p)}
                className="h-9 px-3 flex items-center gap-2 bg-white border border-border rounded-lg text-sm cursor-pointer hover:border-primary transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className={criteria.locations.length ? 'text-foreground font-medium truncate' : 'text-muted-foreground truncate'}>
                  {criteria.locations.length
                    ? `${criteria.locations.length} ${language === 'fr' ? 'zone(s)' : 'location(s)'}`
                    : language === 'fr' ? 'Zone' : 'Location'}
                </span>
              </div>
              {locationOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
                  <div className="p-2 border-b border-border">
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder={language === 'fr' ? 'Chercher...' : 'Search...'}
                      className="w-full py-1.5 px-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => onToggleLocation(loc.value)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors ${
                          criteria.locations.includes(loc.value) ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 border-2 rounded flex-shrink-0 ${
                          criteria.locations.includes(loc.value) ? 'bg-primary border-primary' : 'border-border'
                        }`} />
                        {loc.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Budget min/max */}
            <Input
              type="number"
              value={criteria.minPrice}
              onChange={(e) => onChangeCriteria('minPrice', e.target.value)}
              placeholder={language === 'fr' ? 'Budget min' : 'Min budget'}
              className="h-9 w-28 rounded-lg border-border bg-white text-sm"
            />
            <Input
              type="number"
              value={criteria.maxPrice}
              onChange={(e) => onChangeCriteria('maxPrice', e.target.value)}
              placeholder={language === 'fr' ? 'Budget max' : 'Max budget'}
              className="h-9 w-28 rounded-lg border-border bg-white text-sm"
            />

            {/* Advanced filters toggle */}
            <button
              type="button"
              onClick={() => setAdvancedOpen((prev) => !prev)}
              className={`h-9 px-3 flex items-center gap-1.5 border rounded-lg text-sm transition-colors whitespace-nowrap ${
                advancedOpen
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-border text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {language === 'fr' ? '+ Filtres' : '+ Filters'}
              {advancedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-white rounded-full text-[10px] font-bold">{advancedCount}</span>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="h-9 px-4 text-white rounded-lg font-semibold flex items-center gap-1.5 text-sm disabled:opacity-60 hover:shadow-hover transition-all"
                style={{ background: 'var(--gradient-coral)' }}
              >
                <Send className="w-3.5 h-3.5" />
                {language === 'fr' ? 'Rechercher' : 'Search'}
              </button>
              <button
                type="button"
                onClick={onReset}
                className="h-9 w-9 flex items-center justify-center bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Advanced filters inline (below main bar) */}
          {advancedOpen && (
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 lg:grid-cols-4 gap-3">
              {advancedFiltersContent}
            </div>
          )}
        </div>
      </div>
  );
}
