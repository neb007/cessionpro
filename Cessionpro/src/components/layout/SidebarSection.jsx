import React from 'react';

export default function SidebarSection({ icon: Icon, title, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 px-4 mb-4">
        {Icon && <Icon className="w-5 h-5 text-[#FF6B4A]" />}
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B4759]">
          {title}
        </h3>
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
