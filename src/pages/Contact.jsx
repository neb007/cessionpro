// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, CheckCircle2, Clock, Mail, Phone, Star,
  TrendingDown, TrendingUp, UserRound, Users
} from 'lucide-react';
import SEO from '@/components/SEO';

const REASONS = [
  {
    icon: TrendingDown,
    titleFr: 'Céder mon entreprise',
    titleEn: 'Sell my business',
    descFr: "Valorisation, préparation du dossier, accompagnement jusqu'au closing.",
    descEn: "Valuation, file preparation, support through closing.",
    value: 'ceder',
  },
  {
    icon: TrendingUp,
    titleFr: 'Reprendre une entreprise',
    titleEn: 'Acquire a business',
    descFr: "Sourcing, due diligence, structuration du financement et closing.",
    descEn: "Sourcing, due diligence, financing structure and closing.",
    value: 'reprendre',
  },
  {
    icon: Users,
    titleFr: 'Rejoindre le réseau conseils',
    titleEn: 'Join the advisor network',
    descFr: "Cabinets M&A, experts-comptables, avocats : accédez aux dossiers Riviqo.",
    descEn: "M&A firms, accountants, lawyers: access Riviqo files.",
    value: 'conseil',
  },
];

export default function Contact() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [selectedReason, setSelectedReason] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#FAF9F7]">
      <SEO pageName="Contact" />
      {/* Hero */}
      <section className="pt-20 pb-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
          <Star className="w-3.5 h-3.5" />
          Riviqo Advisory
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] mb-4">
          {isFr ? "Parlons de votre opération" : "Let's talk about your transaction"}
        </h1>
        <p className="text-[#6B7A94] max-w-xl mx-auto text-lg">
          {isFr
            ? "Notre équipe d'experts vous accompagne de la première analyse à la signature."
            : "Our expert team supports you from first analysis to signature."}
        </p>
      </section>

      {/* 2 colonnes */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Colonne gauche */}
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-[#3B4759]">
              {isFr ? "Pourquoi nous contacter ?" : "Why contact us?"}
            </h2>
            {REASONS.map((reason) => (
              <button
                key={reason.value}
                type="button"
                onClick={() => setSelectedReason(reason.value)}
                className={`w-full text-left rounded-2xl border p-5 transition-all flex gap-4 ${
                  selectedReason === reason.value
                    ? 'border-[#FF6B4A] bg-[#FFF4F1]'
                    : 'border-[#F0ECE6] bg-white hover:border-[#FF6B4A]/40'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedReason === reason.value ? 'bg-[#FF6B4A]' : 'bg-[#FFF0ED]'
                }`}>
                  <reason.icon className={`w-4 h-4 ${selectedReason === reason.value ? 'text-white' : 'text-[#FF6B4A]'}`} />
                </div>
                <div>
                  <div className="font-display font-semibold text-[#3B4759] text-sm mb-0.5">{isFr ? reason.titleFr : reason.titleEn}</div>
                  <div className="text-xs text-[#6B7A94]">{isFr ? reason.descFr : reason.descEn}</div>
                </div>
              </button>
            ))}

            {/* Social proof */}
            <div className="bg-white border border-[#F0ECE6] rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFF0ED] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#FF6B4A]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#3B4759]">{isFr ? "Réponse sous 24h ouvrées" : "Response within 24 business hours"}</div>
                  <div className="text-xs text-[#6B7A94]">{isFr ? "Du lundi au vendredi, 9h–18h" : "Monday to Friday, 9am–6pm"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFF0ED] flex items-center justify-center">
                  <UserRound className="w-4 h-4 text-[#FF6B4A]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#3B4759]">{isFr ? "Expert dédié à chaque dossier" : "Dedicated expert per file"}</div>
                  <div className="text-xs text-[#6B7A94]">{isFr ? "Un interlocuteur unique du début à la fin" : "One point of contact from start to finish"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFF0ED] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B4A]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#3B4759]">{isFr ? "Premier échange offert" : "First consultation free"}</div>
                  <div className="text-xs text-[#6B7A94]">{isFr ? "Sans engagement, 30 minutes de conseil" : "No commitment, 30 minutes of advisory"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div>
            {sent ? (
              <div className="bg-white border border-[#F0ECE6] rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF0ED] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#3B4759]">
                  {isFr ? "Message envoyé !" : "Message sent!"}
                </h3>
                <p className="text-[#6B7A94] text-sm max-w-xs">
                  {isFr
                    ? "Notre équipe vous contacte sous 24h ouvrées."
                    : "Our team will contact you within 24 business hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#F0ECE6] rounded-2xl p-7 space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#3B4759] mb-2">
                  {isFr ? "Votre demande" : "Your request"}
                </h2>

                {/* Type de besoin */}
                <div>
                  <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">{isFr ? "Type de besoin" : "Type of need"}</label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full border border-[#EADFD8] rounded-lg px-3 py-2.5 text-sm text-[#3B4759] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                  >
                    <option value="">{isFr ? "Sélectionner..." : "Select..."}</option>
                    <option value="ceder">{isFr ? "Céder mon entreprise" : "Sell my business"}</option>
                    <option value="reprendre">{isFr ? "Reprendre une entreprise" : "Acquire a business"}</option>
                    <option value="conseil">{isFr ? "Rejoindre le réseau conseils" : "Join the advisor network"}</option>
                    <option value="autre">{isFr ? "Autre demande" : "Other request"}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">{isFr ? "Prénom & Nom" : "First & Last name"}</label>
                    <div className="relative">
                      <UserRound className="w-4 h-4 text-[#9EABC1] absolute left-3 top-2.5" />
                      <Input required className="pl-9 border-[#EADFD8] focus:border-[#FF6B4A] text-sm" placeholder={isFr ? "Jean Dupont" : "John Smith"} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#9EABC1] absolute left-3 top-2.5" />
                      <Input required type="email" className="pl-9 border-[#EADFD8] focus:border-[#FF6B4A] text-sm" placeholder="jean@company.fr" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">{isFr ? "Téléphone (optionnel)" : "Phone (optional)"}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#9EABC1] absolute left-3 top-2.5" />
                    <Input className="pl-9 border-[#EADFD8] focus:border-[#FF6B4A] text-sm" placeholder="+33 6 00 00 00 00" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">{isFr ? "Votre message" : "Your message"}</label>
                  <Textarea
                    required
                    className="border-[#EADFD8] min-h-[120px] focus:border-[#FF6B4A] text-sm"
                    placeholder={
                      isFr
                        ? "Décrivez votre projet : secteur, CA, contexte, vos questions..."
                        : "Describe your project: sector, revenue, context, your questions..."
                    }
                  />
                </div>

                <div className="flex items-start gap-2.5">
                  <input required type="checkbox" id="consent" className="mt-0.5 accent-[#FF6B4A]" />
                  <label htmlFor="consent" className="text-xs text-[#6B7A94] leading-relaxed">
                    {isFr
                      ? "J'accepte d'être contacté(e) par Riviqo concernant ma demande. Mes données ne seront pas transmises à des tiers."
                      : "I agree to be contacted by Riviqo regarding my request. My data will not be shared with third parties."}
                  </label>
                </div>

                <Button type="submit" className="w-full bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full py-5 font-display font-semibold">
                  {isFr ? "Envoyer ma demande" : "Send my request"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
