// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Banknote, Calculator, ChevronDown, Globe, Landmark } from 'lucide-react';

const toolItems = [
  { icon: Calculator, labelFr: 'Simulateur valorisation', labelEn: 'Valuation simulator', page: 'Valuations' },
  { icon: Landmark, labelFr: 'Simulateur financement', labelEn: 'Financing simulator', page: 'Financing' },
  { icon: Banknote, labelFr: 'Simulateur de cession', labelEn: 'Sale simulator', page: 'Targeting' }
];

export default function PublicNav() {
  const { language, changeLanguage } = useLanguage();
  const isFr = language === 'fr';
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#F0ECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" showText={false} />
          </Link>

          {/* Nav links desktop */}
          <div className="hidden md:flex items-center gap-7">
            <Link to={createPageUrl('Ceder')}
              className="text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm">
              {isFr ? 'Céder' : 'Sell'}
            </Link>
            <Link to={createPageUrl('Reprendre')}
              className="text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm">
              {isFr ? 'Reprendre' : 'Buy'}
            </Link>

            {/* Outils dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm"
              >
                {isFr ? 'Outils' : 'Tools'}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#EDE6E0] rounded-xl shadow-lg p-2 w-60 z-50">
                  {toolItems.map((tool) => (
                    <Link
                      key={tool.page}
                      to={createPageUrl(tool.page)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FFF0ED] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FFF0ED] flex items-center justify-center group-hover:bg-[#FFD5C7] transition-colors flex-shrink-0">
                        <tool.icon className="w-4 h-4 text-[#FF6B4A]" />
                      </div>
                      <span className="text-sm font-medium text-[#3B4759] group-hover:text-[#FF6B4A] transition-colors font-display">
                        {isFr ? tool.labelFr : tool.labelEn}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to={createPageUrl('Expert')}
              className="text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm">
              {isFr ? 'Experts' : 'Experts'}
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => changeLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm px-2 py-2"
              aria-label={isFr ? 'Switch to English' : 'Passer en français'}
            >
              <Globe className="w-4 h-4" />
              <span className="font-mono text-xs uppercase">{language}</span>
            </button>
            <Link to={createPageUrl('Login')}
              className="hidden sm:block text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm px-3 py-2">
              {isFr ? 'Se connecter' : 'Login'}
            </Link>
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-5 font-display font-semibold text-sm">
                {isFr ? 'Commencer gratuitement' : 'Start for free'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
