import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import AutocompleteCountryFilter from '@/components/annonces/AutocompleteCountryFilter';
import AutocompleteDepartmentFilter from '@/components/annonces/AutocompleteDepartmentFilter';

export default function FilterSheetMobile({
  open,
  onOpenChange,
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[88vh] rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading">
            {language === 'fr' ? 'Filtres' : 'Filters'}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{language === 'fr' ? 'Secteur' : 'Sector'}</p>
            <Select value={filtersState.sector} onValueChange={(v) => onUpdateFilter('sector', v)}>
              <SelectTrigger className="h-11 rounded-lg border-border bg-white text-sm">
                <SelectValue placeholder={language === 'fr' ? 'Sélectionner un secteur' : 'Select sector'} />
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
            <p className="text-sm text-muted-foreground mb-2">{language === 'fr' ? 'Pays' : 'Country'}</p>
            <AutocompleteCountryFilter
              value={filtersState.country}
              onChange={(v) => onUpdateFilter('country', v)}
              items={countries}
              placeholder={language === 'fr' ? 'Saisir un pays' : 'Type a country'}
              language={language}
              className="w-full"
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">{language === 'fr' ? 'Département' : 'Department'}</p>
            <AutocompleteDepartmentFilter
              value={filtersState.department}
              countryValue={filtersState.country}
              onChange={(v) => onUpdateFilter('department', v)}
              items={departments}
              placeholder={language === 'fr' ? 'Saisir un département' : 'Type a department'}
              language={language}
              disabled={isDepartmentDisabled}
              className="w-full"
            />
            {isDepartmentDisabled && (
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'fr' ? 'Disponible pour la France' : 'Available for France'}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">{language === 'fr' ? 'Budget' : 'Budget'}</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={filtersState.budgetMin}
                onChange={(e) => onUpdateFilter('budgetMin', e.target.value)}
                placeholder={language === 'fr' ? 'Min' : 'Min'}
                className="h-11 rounded-lg border-border bg-white text-sm"
              />
              <Input
                type="number"
                value={filtersState.budgetMax}
                onChange={(e) => onUpdateFilter('budgetMax', e.target.value)}
                placeholder={language === 'fr' ? 'Max' : 'Max'}
                className="h-11 rounded-lg border-border bg-white text-sm"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
