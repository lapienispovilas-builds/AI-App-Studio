export type LeadSubmission = {
  idea: string
  page: string
  email: string
  willingnessToPay?: string
  biggestFrustration?: string
  answers?: Record<string, string>
}

const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL

export async function submitLead(submission: LeadSubmission) {
  if (!scriptUrl) {
    throw new Error('Google Sheets is not connected yet. Add VITE_GOOGLE_APPS_SCRIPT_URL to .env.local.')
  }

  const searchParams = new URLSearchParams(window.location.search)

  // Apps Script web apps do not return browser CORS headers. `no-cors` lets the
  // browser send the request, but the response is intentionally unreadable.
  await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      ...submission,
      submittedAt: new Date().toISOString(),
      sourceUrl: window.location.href,
      utmSource: searchParams.get('utm_source') || '',
      utmMedium: searchParams.get('utm_medium') || '',
      utmCampaign: searchParams.get('utm_campaign') || '',
      utmContent: searchParams.get('utm_content') || '',
    }),
  })
}
