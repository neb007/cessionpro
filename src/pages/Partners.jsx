// @ts-nocheck
import React, { useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, Briefcase, Calculator, CheckCircle2, Landmark,
  Loader2, Mail, Phone, Scale, Star, TrendingUp, UserRound, Building2
} from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/api/supabaseClient';

const CONTACT_AUDIENCE_ID = '3e8c329d-92fb-4f78-b349-bb04d4fd6160';
const NOTIFY_EMAIL = 'contact@riviqo.com';

const PARTNER_TYPES = [
  {
    icon: Briefcase,
    value: 'ma',
    titleFr: 'Cabinets M&A',
    titleEn: 'M&A Firms',
    descFr: "Accédez aux mandats de cession et d'acquisition sur Riviqo. Sourcing, data room sécurisée, co-mandat et suivi de process intégrés.",
    descEn: "Access sale and acquisition mandates on Riviqo. Sourcing, secure data room, co-mandate and integrated process tracking.",
    benefitsFr: ['Accès aux dossiers qualifiés', 'Data room et NDA électronique', 'Co-mandat avec d\'autres conseils', 'Suivi de process complet'],
    benefitsEn: ['Access to qualified files', 'Data room and electronic NDA', 'Co-mandate with other advisors', 'Complete process tracking'],
  },
  {
    icon: Scale,
    value: 'avocat',
    titleFr: 'Avocats d\'affaires',
    titleEn: 'Business Lawyers',
    descFr: "Intervenez sur les GAP, SPA, pactes d'actionnaires et closing dans un environnement numérique sécurisé avec audit trail complet.",
    descEn: "Intervene on warranties, SPAs, shareholder agreements and closings in a secure digital environment with complete audit trail.",
    benefitsFr: ['Gestion documentaire et versioning', 'Signature électronique intégrée', 'Audit trail et traçabilité', 'Messagerie confidentielle'],
    benefitsEn: ['Document management and versioning', 'Integrated electronic signature', 'Audit trail and traceability', 'Confidential messaging'],
  },
  {
    icon: TrendingUp,
    value: 'investisseur',
    titleFr: 'Investisseurs',
    titleEn: 'Investors',
    descFr: "Identifiez les meilleures opportunités d'acquisition grâce au SmartMatching et accédez aux données financières en data room sécurisée.",
    descEn: "Identify the best acquisition opportunities with SmartMatching and access financial data in a secure data room.",
    benefitsFr: ['SmartMatching intelligent', 'Data room avec accès granulaire', 'Alertes sur les opportunités', 'Analyse financière intégrée'],
    benefitsEn: ['Smart matching', 'Data room with granular access', 'Opportunity alerts', 'Integrated financial analysis'],
  },
  {
    icon: Calculator,
    value: 'expert-comptable',
    titleFr: 'Experts-comptables',
    titleEn: 'Accountants',
    descFr: "Accompagnez vos clients cédants et repreneurs avec les outils Riviqo : valorisation multi-méthodes, simulation fiscale et financement.",
    descEn: "Support your seller and buyer clients with Riviqo tools: multi-method valuation, tax simulation and financing.",
    benefitsFr: ['Simulateurs valorisation et fiscalité', 'Partage de rapports client', 'Référencement réseau Riviqo', 'Formation aux outils de transmission'],
    benefitsEn: ['Valuation and tax simulators', 'Client report sharing', 'Riviqo network listing', 'Transfer tool training'],
  },
  {
    icon: Landmark,
    value: 'banque',
    titleFr: 'Banques',
    titleEn: 'Banks',
    descFr: "Financez les opérations de reprise en accédant aux dossiers structurés et aux simulations de financement directement sur la plateforme.",
    descEn: "Finance acquisition deals by accessing structured files and financing simulations directly on the platform.",
    benefitsFr: ['Dossiers de financement structurés', 'Simulation de capacité d\'emprunt', 'Flux documentaire sécurisé', 'Suivi des opérations en cours'],
    benefitsEn: ['Structured financing files', 'Borrowing capacity simulation', 'Secure document flow', 'Ongoing deal tracking'],
  },
];

export default function Partners() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [partnerType, setPartnerType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    const selectedLabel = PARTNER_TYPES.find(p => p.value === partnerType);
    const typeLabel = selectedLabel ? (isFr ? selectedLabel.titleFr : selectedLabel.titleEn) : partnerType;

    try {
      const { error: fnError } = await supabase.functions.invoke('tool-lead-subscribe', {
        body: {
          audienceId: CONTACT_AUDIENCE_ID,
          firstName,
          lastName,
          email: email.trim().toLowerCase(),
          consent: true,
          tool: `partner-${partnerType}`,
          language: language === 'en' ? 'en' : 'fr',
          notifyEmail: NOTIFY_EMAIL,
          notifySubject: `Nouvelle demande partenaire — ${typeLabel} — ${name.trim()}`,
          simulationInput: {
            phone: phone.trim(),
            company: company.trim(),
            partnerType,
            partnerTypeLabel: typeLabel,
            message: message.trim(),
          },
        },
      });

      if (fnError) throw fnError;
      setSent(true);
    } catch (err) {
      console.error('Partner form error:', err);
      setError(isFr ? "Une erreur est survenue. Veuillez réessayer." : "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F7]">
      <SEO pageName="Partners" />

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            {isFr ? 'Programme partenaires' : 'Partner program'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? 'Devenez partenaire Riviqo'
              : 'Become a Riviqo partner'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "Cabinets M&A, avocats, investisseurs, experts-comptables, banques : rejoignez notre réseau et accédez aux opportunités de transmission d'entreprise."
              : "M&A firms, lawyers, investors, accountants, banks: join our network and access business transfer opportunities."}
          </p>
          <a href="#formulaire">
            <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
              {isFr ? 'Nous contacter' : 'Contact us'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* 5 profils partenaires */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Un programme pour chaque profil' : 'A program for every profile'}
            </h2>
            <p className="text-[#6B7A94] mt-3 max-w-2xl mx-auto">
              {isFr
                ? "Quel que soit votre métier, Riviqo vous offre les outils et le réseau pour développer votre activité en transmission d'entreprise."
                : "Whatever your profession, Riviqo provides the tools and network to grow your business transfer activity."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNER_TYPES.map((partner) => (
              <div key={partner.value} className="rounded-2xl border border-[#F0ECE6] p-7 bg-[#FAF9F7]">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-5">
                  <partner.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display font-semibold text-xl text-[#3B4759] mb-3">
                  {isFr ? partner.titleFr : partner.titleEn}
                </h3>
                <p className="text-sm text-[#6B7A94] leading-relaxed mb-5">
                  {isFr ? partner.descFr : partner.descEn}
                </p>
                <ul className="space-y-2">
                  {(isFr ? partner.benefitsFr : partner.benefitsEn).map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#3B4759]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section id="formulaire" className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-[#3B4759] mb-3">
              {isFr ? 'Contactez-nous' : 'Contact us'}
            </h2>
            <p className="text-[#6B7A94]">
              {isFr
                ? "Remplissez le formulaire ci-dessous et notre équipe vous recontacte sous 48h."
                : "Fill in the form below and our team will get back to you within 48 hours."}
            </p>
          </div>

          {sent ? (
            <div className="bg-white border border-[#F0ECE6] rounded-2xl p-10 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF0ED] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#FF6B4A]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#3B4759]">
                {isFr ? "Demande envoyée !" : "Request sent!"}
              </h3>
              <p className="text-[#6B7A94] text-sm max-w-xs">
                {isFr
                  ? "Notre équipe analyse votre demande et vous recontacte sous 48h ouvrées."
                  : "Our team is reviewing your request and will contact you within 48 business hours."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-[#F0ECE6] rounded-2xl p-7 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">
                  {isFr ? "Type de partenaire" : "Partner type"}
                </label>
                <select
                  required
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full border border-[#EADFD8] rounded-lg px-3 py-2.5 text-sm text-[#3B4759] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                >
                  <option value="">{isFr ? "Sélectionner..." : "Select..."}</option>
                  {PARTNER_TYPES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {isFr ? p.titleFr : p.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">
                    {isFr ? "Prénom & Nom" : "First & Last name"}
                  </label>
                  <div className="relative">
                    <UserRound className="w-4 h-4 text-[#9EABC1] absolute left-3 top-2.5" />
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 border-[#EADFD8] focus:border-[#FF6B4A] text-sm"
                      placeholder={isFr ? "Jean Dupont" : "John Smith"}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9EABC1] absolute left-3 top-2.5" />
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 border-[#EADFD8] focus:border-[#FF6B4A] text-sm"
                      placeholder="jean@cabinet.fr"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">
                    {isFr ? "Téléphone (optionnel)" : "Phone (optional)"}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#9EABC1] absolute left-3 top-2.5" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 border-[#EADFD8] focus:border-[#FF6B4A] text-sm"
                      placeholder="+33 6 00 00 00 00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">
                    {isFr ? "Cabinet / Entreprise" : "Firm / Company"}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#9EABC1] absolute left-3 top-2.5" />
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="pl-9 border-[#EADFD8] focus:border-[#FF6B4A] text-sm"
                      placeholder={isFr ? "Nom du cabinet" : "Firm name"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7A94] mb-1.5">
                  {isFr ? "Votre message" : "Your message"}
                </label>
                <Textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-[#EADFD8] min-h-[120px] focus:border-[#FF6B4A] text-sm"
                  placeholder={
                    isFr
                      ? "Décrivez votre activité, vos spécialités et ce que vous recherchez..."
                      : "Describe your activity, specialties and what you are looking for..."
                  }
                />
              </div>

              <div className="flex items-start gap-2.5">
                <input required type="checkbox" id="consent-partner" className="mt-0.5 accent-[#FF6B4A]" />
                <label htmlFor="consent-partner" className="text-xs text-[#6B7A94] leading-relaxed">
                  {isFr
                    ? "J'accepte d'être contacté(e) par Riviqo concernant le programme partenaires. Mes données ne seront pas transmises à des tiers."
                    : "I agree to be contacted by Riviqo regarding the partner program. My data will not be shared with third parties."}
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full py-5 font-display font-semibold"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isFr ? "Envoi..." : "Sending..."}
                  </span>
                ) : (
                  <>
                    {isFr ? "Envoyer ma demande" : "Send my request"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {isFr ? 'Développez votre activité avec Riviqo' : 'Grow your business with Riviqo'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Rejoignez un réseau de professionnels sélectionnés et accédez aux meilleures opportunités de transmission d'entreprise."
              : "Join a network of selected professionals and access the best business transfer opportunities."}
          </p>
          <a href="#formulaire">
            <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-10 py-6 text-base font-display font-semibold">
              {isFr ? 'Devenir partenaire' : 'Become a partner'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
