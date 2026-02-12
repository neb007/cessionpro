import React from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Valuations() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            {language === 'fr' ? 'Valorisations' : 'Valuations'}
          </h1>
          <Badge className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] text-white">PRO</Badge>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {language === 'fr' ? 'Fonctionnalité Premium - À venir' : 'Premium Feature - Coming soon'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}