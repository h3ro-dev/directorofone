export function utmFromLocation() {
  if (typeof window === 'undefined') return {} as Record<string, string>;
  const q = new URLSearchParams(window.location.search);
  return {
    utm_source: q.get('utm_source') || '',
    utm_medium: q.get('utm_medium') || '',
    utm_campaign: q.get('utm_campaign') || '',
    utm_term: q.get('utm_term') || '',
    utm_content: q.get('utm_content') || '',
  } as Record<string, string>;
}

export async function notifyLead(context: string, payload: Record<string, any>) {
  try {
    await fetch('https://utlyzecom.vercel.app/api/notify-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, payload }),
    });
  } catch (e) {
    console.warn('notifyLead failed', e);
  }
}

