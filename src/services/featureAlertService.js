import { supabase } from '@/api/supabaseClient';

class FeatureAlertService {
  async subscribeToNdaDataroomAlert({ language = 'fr' } = {}) {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    let accessToken = sessionData?.session?.access_token || '';

    if (!accessToken) {
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      accessToken = refreshed?.session?.access_token || '';
      if (refreshError) {
        console.warn('[FeatureAlert] subscribeToNdaDataroomAlert:refresh-error', {
          name: refreshError?.name,
          message: refreshError?.message
        });
      }
    }

    console.info('[FeatureAlert] subscribeToNdaDataroomAlert:start', {
      featureCode: 'nda_dataroom',
      language: language === 'en' ? 'en' : 'fr',
      hasAccessToken: Boolean(accessToken),
      sessionError: sessionError?.message || null
    });

    const { data, error } = await supabase.functions.invoke('feature-alert-subscribe', {
      body: {
        featureCode: 'nda_dataroom',
        language: language === 'en' ? 'en' : 'fr'
      },
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`
          }
        : undefined
    });

    if (error) {
      let responseBody = null;
      if (error?.name === 'FunctionsHttpError' && error?.context) {
        try {
          responseBody = await error.context.text();
        } catch (_error) {
          responseBody = null;
        }
      }

      console.error('[FeatureAlert] subscribeToNdaDataroomAlert:invoke-error', {
        name: error?.name,
        message: error?.message,
        context: error?.context || null,
        status: error?.status || null,
        responseBody
      });
    } else {
      console.info('[FeatureAlert] subscribeToNdaDataroomAlert:invoke-success', {
        status: data?.status || null,
        audienceId: data?.audienceId || null,
        ok: data?.ok ?? null
      });
    }

    if (error) {
      throw new Error(error.message || 'Feature alert subscription failed');
    }

    return data;
  }
}

export const featureAlertService = new FeatureAlertService();
export default featureAlertService;
