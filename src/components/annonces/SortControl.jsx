import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SortControl({ value, onChange, language, compact = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!compact && (
        <span className="text-xs sm:text-sm text-foreground">
          {language === 'fr' ? 'Tri:' : 'Sort by:'}
        </span>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-full sm:w-44 text-xs sm:text-sm border-border rounded-lg bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-created_date">{language === 'fr' ? 'Plus récent' : 'Newest'}</SelectItem>
          <SelectItem value="price_asc">{language === 'fr' ? 'Prix croissant' : 'Price low-high'}</SelectItem>
          <SelectItem value="price_desc">{language === 'fr' ? 'Prix décroissant' : 'Price high-low'}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
