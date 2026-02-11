import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { X, ChevronDown } from 'lucide-react';
import { searchCountries, EUROPEAN_COUNTRIES } from '@/utils/europeanCountries';

export default function AutocompleteCountry({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const results = searchCountries(search);
  const selectedCountry = EUROPEAN_COUNTRIES.find(c => c.value === value);

  const handleSelect = (countryValue) => {
    onChange(countryValue);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  const displayValue = open ? search : (selectedCountry?.label || '');

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          placeholder="Pays..."
          value={displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          className={`h-12 w-full pr-10 ${disabled ? 'bg-gray-100 opacity-50' : ''}`}
        />
        {!open && value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {!open && !value && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
      </div>

      {open && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map((country) => (
              <button
                key={country.value}
                onClick={() => handleSelect(country.value)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === country.value
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {country.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">Aucun résultat</div>
          )}
        </div>
      )}
    </div>
  );
}
