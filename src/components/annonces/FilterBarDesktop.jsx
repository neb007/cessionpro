import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SortControl from '@/components/annonces/SortControl';
import AutocompleteCountryFilter from '@/components/annonces/AutocompleteCountryFilter';
import AutocompleteDepartmentFilter from '@/components/annonces/AutocompleteDepartmentFilter';

export default function FilterBarDesktop({
  filtersState,
  language,
  t,
  sectors,
  countries,
  departments,
  onUpdateFilter,
}) {
  const isDepartmentDisabled = (filtersState.country || '').trim().toLowerCase() !== 'france';

  return (
    <div className="hidden sm:block w-full bg-background">
      <div className="grid grid-cols-12 gap-2 mb-3 pb-3 border-b border-border">
        <div className="col-span-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={filtersState.query}
              onChange={(e) => onUpdateFilter('query', e.target.value)}
              placeholder={t('search_placeholder')}
              className="pl-9 h-9 text-sm border-border focus:border-primary rounded-lg w-full bg-white"
            />
          </div>
        </div>
        <div className="col-span-4 flex justify-end">
          <SortControl value={filtersState.sortBy} onChange={(v) => onUpdateFilter('sortBy', v)} language={language} />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <div>
          <Select value={filtersState.sector} onValueChange={(v) => onUpdateFilter('sector', v)}>
            <SelectTrigger className="h-9 w-full rounded-lg border-border bg-white text-sm">
              <SelectValue placeholder={language === 'fr' ? 'Secteur' : 'Sector'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'fr' ? 'Tous' : 'All'}</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {t(sector)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <AutocompleteCountryFilter
            value={filtersState.country}
            onChange={(v) => onUpdateFilter('country', v)}
            items={countries}
            placeholder={language === 'fr' ? 'Pays' : 'Country'}
            language={language}
          />
        </div>

        <div>
          <AutocompleteDepartmentFilter
            value={filtersState.department}
            countryValue={filtersState.country}
            onChange={(v) => onUpdateFilter('department', v)}
            items={departments}
            placeholder={language === 'fr' ? 'Département' : 'Department'}
            language={language}
          />
          {isDepartmentDisabled && (
            <p className="text-[11px] text-muted-foreground mt-1">
              {language === 'fr' ? 'Disponible pour la France' : 'Available for France'}
            </p>
          )}
        </div>

        <div>
          <Input
            type="number"
            value={filtersState.budgetMin}
            onChange={(e) => onUpdateFilter('budgetMin', e.target.value)}
            placeholder={language === 'fr' ? 'Min' : 'Min'}
            className="h-9 w-full rounded-lg border-border bg-white text-sm"
          />
        </div>

        <div>
          <Input
            type="number"
            value={filtersState.budgetMax}
            onChange={(e) => onUpdateFilter('budgetMax', e.target.value)}
            placeholder={language === 'fr' ? 'Max' : 'Max'}
            className="h-9 w-full rounded-lg border-border bg-white text-sm"
          />
        </div>
      </div>
    </div>
  );
}
