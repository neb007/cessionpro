import React, { useState } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/LanguageContext';

export default function SmartMatchingBanner({ isPurchased = false }) {
  const { language } = useLanguage();

  const beforePurchaseContent = {
    fr: {
      title: "Smart Matching",
      subtitle: "Obtenez automatiquement une liste de repreneurs/acheteurs adaptée à vos critères",
      btnText: "Découvrir"
    },
    en: {
      title: "Smart Matching",
      subtitle: "Automatically get a list of buyers/acquirers tailored to your criteria",
      btnText: "Discover"
    }
  };

  const afterPurchaseContent = {
    fr: {
      title: "Smart Matching",
      subtitle: "Dashboard dédié avec matchs automatiques",
      btnText: "Accéder au dashboard"
    },
    en: {
      title: "Smart Matching",
      subtitle: "Dedicated dashboard with automatic matches",
      btnText: "Go to dashboard"
    }
  };

  const content = isPurchased ? afterPurchaseContent[language] : beforePurchaseContent[language];

  return (
    <div className="mx-3 mb-8 p-4 rounded-lg bg-gradient-to-br from-[#FF6B4A]/10 to-[#FF8F6D]/5 border border-[#FF6B4A]/20 hover:border-[#FF6B4A]/40 transition-all">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Zap className="w-5 h-5 text-[#FF6B4A]" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-[#3B4759] mb-1">
            {content.title}
          </h4>
          <p className="text-xs text-[#6B7A94] mb-3 leading-snug">
            {content.subtitle}
          </p>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white text-xs font-medium transition-all">
            {content.btnText}
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
