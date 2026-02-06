import React from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';

export default function Dataroom() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
          Dataroom
        </h1>
        <Card>
          <CardContent className="py-16 text-center">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {language === 'fr' ? 'Fonctionnalité à venir' : 'Coming soon'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}