import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function SidebarMenuItem({ 
  icon: Icon, 
  label, 
  page, 
  isActive, 
  isPremium = false,
  onClick 
}) {
  return (
    <Link
      to={`/${page}`}
      onClick={onClick}
      style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400 }}
      className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-[#FF6B4A]/10 text-[#FF6B4A]'
          : 'text-[#6B7A94] hover:bg-white/80 hover:text-[#3B4759]'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 transition-colors ${
          isActive ? 'text-[#FF6B4A]' : 'text-[#6B7A94] group-hover:text-[#3B4759]'
        }`} />
        <span className="text-sm">{label}</span>
      </div>
      {isPremium && (
        <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
      )}
    </Link>
  );
}
