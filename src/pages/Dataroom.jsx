import React, { useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  Lock, 
  Users, 
  FileText, 
  CheckCircle, 
  Info,
  Clock,
  DollarSign
} from 'lucide-react';

export default function Dataroom() {
  const { language } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  const features = [
    {
      icon: Lock,
      title: language === 'fr' ? 'Sécurisé' : 'Secure',
      description: language === 'fr' 
        ? 'Signature NDA requise avant accès aux documents'
        : 'NDA signature required before document access'
    },
    {
      icon: FileText,
      title: language === 'fr' ? 'Organisé' : 'Organized',
      description: language === 'fr'
        ? 'Documents catégorisés et numérotés automatiquement'
        : 'Documents automatically categorized and indexed'
    },
    {
      icon: Users,
      title: language === 'fr' ? 'Contrôlé' : 'Controlled',
      description: language === 'fr'
        ? 'Permissions granulaires par acheteur'
        : 'Granular permissions per buyer'
    },
    {
      icon: CheckCircle,
      title: language === 'fr' ? 'Tracé' : 'Tracked',
      description: language === 'fr'
        ? 'Historique complet des consultations et téléchargements'
        : 'Complete history of views and downloads'
    }
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900">
              Dataroom
            </h1>
            <div 
              className="p-2 hover:bg-blue-100 rounded-full transition-colors cursor-help"
              title={language === 'fr' 
                ? 'Bientôt disponible - La Dataroom sera accessible après activation (9,99€/an)'
                : 'Coming Soon - Dataroom will be available after activation (€9.99/year)'}
            >
              <Info className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-lg text-gray-600">
            {language === 'fr'
              ? 'Partage sécurisé de documents avec vos acheteurs potentiels'
              : 'Secure document sharing with your potential buyers'}
          </p>
        </div>

        {/* Main Coming Soon Card */}
        <Card className="border-2 border-dashed border-blue-200 bg-blue-50 mb-12">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Folder className="w-10 h-10 text-blue-600" />
            </div>
            
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
              {language === 'fr' ? 'Fonctionnalité à venir' : 'Feature Coming Soon'}
            </h2>
            
            <p className="text-gray-600 mb-1">
              {language === 'fr'
                ? 'Implémentation prévue : Q2 2026'
                : 'Planned Release: Q2 2026'}
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              {language === 'fr'
                ? 'La Dataroom sera intégrée comme fonctionnalité premium de CessionPro'
                : 'Dataroom will be integrated as a premium CessionPro feature'}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
              <Clock className="w-4 h-4" />
              {language === 'fr' ? 'Prochainement' : 'Coming Soon'}
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mb-12">
          <h3 className="font-display text-2xl font-bold text-gray-900 mb-8 text-center">
            {language === 'fr' ? 'Fonctionnalités prévues' : 'Planned Features'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Subscription Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {language === 'fr' ? 'Tarif' : 'Pricing'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'fr'
                    ? '9,99€ par an, une seule fois pour débloquer'
                    : '€9.99 per year, one-time unlock'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {language === 'fr' ? 'Pour vendeurs' : 'For Sellers'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'fr'
                    ? 'Partagez vos documents avec les acheteurs'
                    : 'Share your documents with buyers'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {language === 'fr' ? 'Sécurisé' : 'Secure'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'fr'
                    ? 'NDA et audit trail intégré'
                    : 'Built-in NDA and audit trail'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Link */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {language === 'fr'
              ? 'Pour en savoir plus sur l\'implémentation, consultez :'
              : 'For more details on implementation, see:'}
          </p>
          <Button 
            variant="outline"
            className="gap-2"
            onClick={() => {
              // Open the plan file
              window.location.href = 'https://github.com/neb007/cessionpro/blob/main/DATAROOM_IMPLEMENTATION_PLAN.md';
            }}
          >
            <FileText className="w-4 h-4" />
            {language === 'fr' ? 'Plan d\'implémentation' : 'Implementation Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
