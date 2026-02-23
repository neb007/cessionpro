import { supabase } from '@/api/supabaseClient';

const EVENT_NAMESPACE = 'tool_funnel';
const LOCAL_QUEUE_KEY = 'riviqo_tool_events_queue';

const safeString = (value) => String(value ?? '').trim();

const pushLocalEvent = (event) => {
  try {
    const current = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
    const next = [...current, event].slice(-200);
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(next));
  } catch {
    // No-op: analytics should never break UX
  }
};

export const toolAnalyticsService = {
  async track(eventName, { tool, step, metadata = {} } = {}) {
    const event = {
      event: safeString(eventName) || 'unknown_event',
      tool: safeString(tool) || 'unknown_tool',
      step: step ?? null,
      metadata,
      at: new Date().toISOString()
    };

    pushLocalEvent(event);

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user?.id) return;

      await supabase.from('app_logs').insert([
        {
          user_id: user.id,
          page_name: `${EVENT_NAMESPACE}:${event.tool}:${event.event}`,
          created_at: event.at
        }
      ]);
    } catch {
      // Silent fallback (local queue remains available)
    }
  }
};

export default toolAnalyticsService;

