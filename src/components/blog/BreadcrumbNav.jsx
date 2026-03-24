import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function BreadcrumbNav({ articleTitle }) {
  return (
    <nav className="max-w-4xl mx-auto px-4 py-4" aria-label="Fil d'Ariane">
      <ol className="flex items-center gap-1.5 text-sm text-[#9EABC1] flex-wrap">
        <li>
          <Link to="/" className="hover:text-[#3B4759] transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            Accueil
          </Link>
        </li>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <li>
          <Link to="/Blog" className="hover:text-[#3B4759] transition-colors">
            Blog
          </Link>
        </li>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <li className="text-[#3B4759] font-medium truncate max-w-[300px]">
          {articleTitle}
        </li>
      </ol>
    </nav>
  );
}
