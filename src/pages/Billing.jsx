import React from 'react';

export default function Billing() {
  return (
    <div className="max-w-5xl mx-auto px-0 py-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h1 className="font-display text-2xl text-[#3B4759] mb-2">Billing</h1>
        <p className="text-sm text-[#6B7A94] mb-6">
          Cette section accueillera bientôt l’intégration Stripe pour la facturation et le
          téléchargement de vos factures.
        </p>
        <div className="rounded-2xl border border-dashed border-[#FF6B4A]/40 bg-orange-50/40 p-6">
          <p className="text-sm text-[#3B4759]">
            ✅ Placeholder Stripe — à connecter prochainement.
          </p>
        </div>
      </div>
    </div>
  );
}