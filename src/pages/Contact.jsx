// @ts-nocheck
import React from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, UserRound } from 'lucide-react';

export default function Contact() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF9F7] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
            {language === 'fr' ? 'Contactez notre équipe' : 'Contact our team'}
          </h1>
          <p className="text-[#6B7A94] mt-2">
            {language === 'fr'
              ? 'Parlez-nous de votre projet de cession ou de reprise, nous revenons vers vous rapidement.'
              : 'Tell us about your sale or acquisition project and we will get back to you quickly.'}
          </p>
        </div>

        <Card className="border border-[#F2E8E2] bg-white shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <UserRound className="w-4 h-4 text-[#6B7A94] absolute left-3 top-3.5" />
                <Input className="pl-9 border-[#EADFD8]" placeholder={language === 'fr' ? 'Nom complet' : 'Full name'} />
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B7A94] absolute left-3 top-3.5" />
                <Input className="pl-9 border-[#EADFD8]" placeholder={language === 'fr' ? 'Email professionnel' : 'Business email'} />
              </div>
              <div className="relative md:col-span-2">
                <Phone className="w-4 h-4 text-[#6B7A94] absolute left-3 top-3.5" />
                <Input className="pl-9 border-[#EADFD8]" placeholder={language === 'fr' ? 'Téléphone (optionnel)' : 'Phone (optional)'} />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  className="border-[#EADFD8] min-h-[140px]"
                  placeholder={
                    language === 'fr'
                      ? 'Décrivez votre besoin: valorisation, montage financier, net vendeur, accompagnement M&A…'
                      : 'Describe your need: valuation, financing structure, net seller, M&A support…'
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-[#6B7A94]">
                {language === 'fr'
                  ? 'En soumettant ce formulaire, vous acceptez d’être contacté(e) par Riviqo.'
                  : 'By submitting this form, you agree to be contacted by Riviqo.'}
              </p>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white">
                {language === 'fr' ? 'Envoyer ma demande' : 'Send my request'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

