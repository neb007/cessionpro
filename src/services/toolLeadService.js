import { supabase } from '@/api/supabaseClient';

const TOOL_AUDIENCE_ID = 'c238e3f6-60cc-4d9f-a01a-b011582b8a3f';

const sanitize = (value) => String(value ?? '').trim();

export const toolLeadService = {
  async subscribeLead({
    firstName,
    lastName,
    email,
    consent,
    tool,
    simulationInput,
    simulationResult,
    language = 'fr'
  }) {
    const emailSanitized = sanitize(email).toLowerCase();
    if (!emailSanitized) {
      throw new Error('Email requis');
    }

    if (!consent) {
      throw new Error('Consentement requis');
    }

    const { data, error } = await supabase.functions.invoke('tool-lead-subscribe', {
      body: {
        audienceId: TOOL_AUDIENCE_ID,
        firstName: sanitize(firstName),
        lastName: sanitize(lastName),
        email: emailSanitized,
        consent: Boolean(consent),
        tool: sanitize(tool),
        language: language === 'en' ? 'en' : 'fr',
        simulationInput: simulationInput || {},
        simulationResult: simulationResult || {}
      }
    });

    if (error) {
      throw new Error(error.message || 'Impossible de capturer le lead outil');
    }

    return data;
  }
};

export default toolLeadService;
