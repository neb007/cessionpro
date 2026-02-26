import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, CreditCard, Bell, FileText } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Profile from './Profile';
import Abonnement from './Abonnement';
import Billing from './Billing';
import SmartMatchingNotifications from './SmartMatchingNotifications';

const tabConfig = [
  { key: 'profile', label: { fr: 'Profil', en: 'Profile' }, icon: User },
  { key: 'pricing', label: { fr: 'Abonnement', en: 'Subscription' }, icon: CreditCard },
  { key: 'billing', label: { fr: 'Facturation', en: 'Billing' }, icon: FileText },
  { key: 'smartmatching-notifications', label: { fr: 'Notifications SM', en: 'SM Notifications' }, icon: Bell }
];

const resolveSettingsTab = (tabValue) => {
  const normalized = (tabValue || '').toLowerCase();

  if (normalized === 'pricing' || normalized === 'abonnement' || normalized === 'subscription') {
    return 'pricing';
  }

  if (normalized === 'billing' || normalized === 'facturation') {
    return 'billing';
  }

  if (
    normalized === 'smartmatching-notifications' ||
    normalized === 'smartmatching_notifications' ||
    normalized === 'notification-smart-matching' ||
    normalized === 'notifications-smart-matching'
  ) {
    return 'smartmatching-notifications';
  }

  return 'profile';
};

export default function Settings() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => resolveSettingsTab(searchParams.get('tab')));

  useEffect(() => {
    setActiveTab(resolveSettingsTab(searchParams.get('tab')));
  }, [searchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabKey);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="w-full max-w-none mx-0 px-0 py-8 overflow-x-hidden">
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl text-foreground">
          {language === 'fr' ? 'Paramètres' : 'Settings'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {language === 'fr'
            ? 'Gérez votre profil, votre facturation et vos notifications sans quitter cette page.'
            : 'Manage your profile, billing and notifications from this page.'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <TabsList className="w-full sm:w-auto justify-start bg-muted/50 mb-6">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.key} value={tab.key} className="gap-2 whitespace-nowrap">
                  <Icon className="w-4 h-4" />
                  {tab.label[language] || tab.label.fr}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="w-full bg-white rounded-2xl border border-border shadow-sm p-3 sm:p-6 lg:p-8 overflow-x-hidden">
          <TabsContent value="profile"><Profile /></TabsContent>
          <TabsContent value="pricing"><Abonnement /></TabsContent>
          <TabsContent value="billing"><Billing /></TabsContent>
          <TabsContent value="smartmatching-notifications"><SmartMatchingNotifications /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
