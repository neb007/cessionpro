import React, { useState } from 'react';
import { User, CreditCard, Receipt } from 'lucide-react';
import Profile from './Profile';
import Pricing from './Pricing';
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

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[#3B4759]">Paramètres</h1>
        <p className="text-sm text-[#6B7A94]">
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
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'border-[#FF6B4A] text-[#FF6B4A] bg-orange-50'
                  : 'border-transparent text-[#6B7A94] hover:text-[#3B4759]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'pricing' && <Pricing />}
        {activeTab === 'billing' && <Billing />}
      </div>
    </div>
  );
}