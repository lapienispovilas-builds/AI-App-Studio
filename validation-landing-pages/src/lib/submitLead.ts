export type LeadSubmission = {
  idea: string
  page: string
  email: string
  willingnessToPay?: string
  biggestFrustration?: string
  answers?: Record<string, string>
}

export async function submitLead(submission: LeadSubmission) {
  const searchParams = new URLSearchParams(window.location.search)
  const response = await fetch('/api/lead-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  if (!response.ok) throw new Error('Lead could not be saved.')
}
