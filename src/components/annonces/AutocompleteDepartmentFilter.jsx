import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

const normalize = (value) => (value || '').trim().toLowerCase();

export default function AutocompleteDepartmentFilter({
  value,
  countryValue,
  onChange,
  items = [],
  placeholder,
  disabled = false,
  language,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const rootRef = useRef(null);
  const isDisabled = disabled || normalize(countryValue) !== 'france';

  const selectedItem = useMemo(() => {
    const normalizedValue = normalize(value);
    return items.find(
      (item) =>
        normalize(item.value) === normalizedValue ||
        normalize(item.label) === normalizedValue
    );
  }, [items, value]);

  useEffect(() => {
    if (selectedItem) {
      setInputValue(selectedItem.label);
      return;
    }
    setInputValue(value || '');
  }, [selectedItem, value]);

  const filteredItems = useMemo(() => {
    const query = normalize(inputValue);
    if (!query) return items.slice(0, 8);
    return items
      .filter(
        (item) =>
          normalize(item.label).includes(query) ||
          normalize(item.value).includes(query)
      )
      .slice(0, 8);
  }, [inputValue, items]);

  useEffect(() => {
    if (isDisabled) {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  }, [isDisabled]);

  useEffect(() => {
    if (!open) return undefined;
    const onClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const handleSelect = (item) => {
    onChange(item.value);
    setInputValue(item.label);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <Input
        value={inputValue}
        disabled={isDisabled}
        placeholder={placeholder}
        onFocus={() => !isDisabled && setOpen(true)}
        onChange={(event) => {
          const next = event.target.value;
          setInputValue(next);
          onChange(next);
          if (!isDisabled) setOpen(true);
        }}
        onKeyDown={(event) => {
          if (isDisabled) return;
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            setHighlightedIndex((prev) =>
              Math.min(prev + 1, Math.max(filteredItems.length - 1, 0))
            );
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          } else if (event.key === 'Enter') {
            if (open && highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
              event.preventDefault();
              handleSelect(filteredItems[highlightedIndex]);
            } else {
              setOpen(false);
            }
          } else if (event.key === 'Escape') {
            setOpen(false);
            setHighlightedIndex(-1);
          }
        }}
        className={`h-9 w-full rounded-lg border-gray-300 bg-white text-sm pr-8 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />

      {open && !isDisabled && (
        <div className="absolute z-40 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-3 py-2 text-sm ${
                  index === highlightedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              {language === 'fr' ? 'Aucune suggestion' : 'No suggestions'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
