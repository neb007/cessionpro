import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, CreditCard, Receipt } from 'lucide-react';
import Profile from './Profile';
import Abonnement from './Abonnement';
import Billing from './Billing';

const tabs = [
  {
    key: 'profile',
    label: 'Profil',
    icon: User
  },
  {
    key: 'pricing',
    label: 'Abonnement',
    icon: CreditCard
  },
  {
    key: 'billing',
    label: 'Facturation',
    icon: Receipt
  }
];

const resolveSettingsTab = (tabValue) => {
  const normalized = (tabValue || '').toLowerCase();

  if (normalized === 'pricing' || normalized === 'abonnement' || normalized === 'subscription') {
    return 'pricing';
  }

  if (normalized === 'billing' || normalized === 'facturation') {
    return 'billing';
  }

  return 'profile';
};

export default function Settings() {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 overflow-x-hidden">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[#3B4759]">Paramètres</h1>
        <p className="text-sm text-[#111827]">
          Gérez votre profil, votre abonnement et votre facturation sans quitter cette page.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'border-[#FF6B4A] text-[#FF6B4A] bg-orange-50'
                  : 'border-transparent text-[#111827] hover:text-[#3B4759]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-6 overflow-x-hidden">
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'pricing' && <Abonnement />}
        {activeTab === 'billing' && <Billing />}
      </div>
    </div>
  );
}
