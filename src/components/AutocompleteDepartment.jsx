import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { X, ChevronDown } from 'lucide-react';
import { searchDepartments, FRENCH_DEPARTMENTS } from '@/utils/frenchDepartmentsData';

export default function AutocompleteDepartment({ value, onChange, disabled = false, country = '' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  // Only enable if country is France (or empty which means France by default)
  const isDisabled = disabled || (country && country !== 'france');
  const results = searchDepartments(search);
  const selectedDepartment = FRENCH_DEPARTMENTS.find(d => d.value === value);

  const handleSelect = (deptValue) => {
    onChange(deptValue);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  const displayValue = open ? search : (selectedDepartment?.label || '');

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          placeholder="Département..."
          value={displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => !isDisabled && setOpen(true)}
          disabled={isDisabled}
          className={`h-12 w-full pr-10 ${isDisabled ? 'bg-gray-100 opacity-50' : ''}`}
        />
        {!open && value && !isDisabled && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isDisabled}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {!open && !value && !isDisabled && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
      </div>

      {open && !isDisabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map((dept) => (
              <button
                key={dept.value}
                onClick={() => handleSelect(dept.value)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === dept.value
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {dept.label}
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
