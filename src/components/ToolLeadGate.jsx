// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { CheckCircle2, Info, Lock, Sparkles } from 'lucide-react';
import { toolLeadService } from '@/services/toolLeadService';
import { toolAnalyticsService } from '@/services/toolAnalyticsService';

export default function ToolLeadGate({
  language = 'fr',
  tool,
  simulationInput,
  simulationResult,
  preview,
  full
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lead, setLead] = useState({
    email: '',
    consent: false
  });
  const successTimerRef = useRef(null);
  const unlockedTrackedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isUnlocked && !unlockedTrackedRef.current) {
      unlockedTrackedRef.current = true;
      void toolAnalyticsService.track('result_unlocked', {
        tool,
        metadata: { source: 'lead_gate' }
      });
    }
  }, [isUnlocked, tool]);

  const canSubmit = useMemo(() => {
    const email = lead.email.trim();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isEmailValid && lead.consent;
  }, [lead]);

  const setField = (field, value) => {
    setLead((prev) => ({ ...prev, [field]: value }));
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);
    const emailDomain = String(lead.email || '').split('@')[1] || '';

    void toolAnalyticsService.track('lead_form_completed', {
      tool,
      metadata: {
        emailDomain,
        consent: Boolean(lead.consent)
      }
    });

    try {
      await toolLeadService.subscribeLead({
        email: lead.email,
        consent: lead.consent,
        tool,
        simulationInput,
        simulationResult,
        language
      });

      void toolAnalyticsService.track('lead_captured', {
        tool,
        metadata: {
          emailDomain
        }
      });

      setIsUnlocked(true);
      setShowSuccessMessage(true);

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2800);
    } catch (error) {
      void toolAnalyticsService.track('lead_capture_failed', {
        tool,
        metadata: {
          reason: error?.message || 'unknown'
        }
      });
      setErrorMessage(error?.message || (language === 'fr' ? 'Veuillez réessayer.' : 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const withTooltip = (label, hint) => (
    <span className="inline-flex items-center gap-1.5">
      <span>{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#6B7A94] hover:bg-[#F6F0EB]"
            aria-label={language === 'fr' ? 'Aide' : 'Help'}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-[#3B4759] text-white">
          {hint}
        </TooltipContent>
      </Tooltip>
    </span>
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="space-y-4">
        <Card className="border border-[#F2E8E2] shadow-sm relative overflow-hidden bg-white">
          {!isUnlocked ? (
            <>
              <div className="absolute inset-0 backdrop-blur-[6px] bg-white/45 z-10" />
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4">
                <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white/95 border border-[#FFD8CC] px-4 py-2 text-[#FF6B4A] font-medium text-sm text-center">
                  <Lock className="w-4 h-4" />
                  {language === 'fr' ? 'Résultats détaillés verrouillés' : 'Detailed results are locked'}
                </div>
              </div>
            </>
          ) : null}
          <CardContent className="p-6">
            {isUnlocked ? full : preview}
          </CardContent>
        </Card>

        {!isUnlocked ? (
          <Card className="border border-[#FFD8CC] bg-gradient-to-br from-[#FFF7F4] to-white shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#3B4759]">
                  <Sparkles className="w-4 h-4 text-[#FF6B4A]" />
                  <p className="font-display font-semibold">
                    {language === 'fr' ? 'Débloquez vos résultats détaillés' : 'Unlock your detailed results'}
                  </p>
                </div>
                <div className="text-xs text-[#6B7A94] font-medium">
                  {language === 'fr' ? 'Étape finale • 10 secondes' : 'Final step • 10 seconds'}
                </div>
              </div>

              <p className="text-sm text-[#6B7A94]">
                {language === 'fr'
                  ? 'Saisissez votre email professionnel pour afficher immédiatement votre analyse complète.'
                  : 'Enter your business email to instantly reveal your full analysis.'}
              </p>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <Label>
                    {withTooltip(
                      language === 'fr' ? 'Email professionnel' : 'Business email',
                      language === 'fr'
                        ? 'Utilisez de préférence un email de société pour recevoir des recommandations adaptées.'
                        : 'Prefer a company email to receive better-tailored recommendations.'
                    )}
                  </Label>
                  <Input
                    type="email"
                    className="mt-2 h-11 border-[#F0DFD6] focus-visible:ring-[#FF6B4A]"
                    value={lead.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder={language === 'fr' ? 'exemple@entreprise.com' : 'name@company.com'}
                    required
                  />
                </div>

                <label className="flex items-start gap-3 text-xs text-[#6B7A94] leading-relaxed">
                  <Checkbox
                    checked={lead.consent}
                    onCheckedChange={(checked) => setField('consent', Boolean(checked))}
                    className="mt-0.5 border-[#D8C8BE]"
                  />
                  <span>
                    {language === 'fr'
                      ? 'J’accepte d’être contacté(e) par Riviqo au sujet de ces outils. Mes données restent strictement confidentielles.'
                      : 'I agree to be contacted by Riviqo about these tools. My data remains strictly confidential.'}
                  </span>
                </label>

                {errorMessage ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full h-11 bg-[#FF6B4A] hover:bg-[#FF5733] text-white font-medium"
                >
                  {isSubmitting
                    ? (language === 'fr' ? 'Déverrouillage en cours...' : 'Unlocking...')
                    : (language === 'fr' ? 'Débloquer mes résultats' : 'Unlock my results')}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {showSuccessMessage ? (
          <div className="fixed inset-0 z-[80] bg-[#1F2937]/35 backdrop-blur-[1px] flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white border border-[#F0DFD6] shadow-2xl p-6 text-center animate-scaleIn">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EAFBF2] text-[#17A34A]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-display text-lg text-[#3B4759] font-semibold mb-2">
                {language === 'fr' ? 'Merci pour votre confiance' : 'Thank you for your trust'}
              </p>
              <p className="text-sm text-[#6B7A94] mb-5">
                {language === 'fr'
                  ? 'Votre demande a bien été enregistrée. Vos résultats détaillés sont maintenant disponibles.'
                  : 'Your request has been registered. Your detailed results are now available.'}
              </p>
              <Button
                type="button"
                onClick={() => setShowSuccessMessage(false)}
                className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white"
              >
                {language === 'fr' ? 'Voir mes résultats' : 'View my results'}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}
