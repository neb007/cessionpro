import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function TableOfContents({ chapters, label = 'Table des matières' }) {
  return (
    <section className="py-10 px-4 bg-white border-y border-[#F0ECE6]">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm font-semibold text-[#6B7A94] uppercase tracking-wider mb-4">{label}</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {chapters.map((ch, idx) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF0ED] transition-colors group"
            >
              <span className="font-mono text-xs text-[#FF6B4A] font-bold">{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-sm font-medium text-[#3B4759] group-hover:text-[#FF6B4A] transition-colors">{ch.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B7A94] ml-auto flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
