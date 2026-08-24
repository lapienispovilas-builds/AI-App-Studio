export type ChapterAcquisition = {
  utmSource: string
  utmMedium: string
  utmCampaign: string
  referrer: string
  landingPage: string
}

const storageKey = 'chapter_acquisition_context'

const emptyContext: ChapterAcquisition = {
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  referrer: '',
  landingPage: '',
}

export function captureChapterAcquisition(): ChapterAcquisition {
  if (typeof window === 'undefined') return emptyContext

  let stored = emptyContext
  try {
    stored = JSON.parse(window.sessionStorage.getItem(storageKey) || 'null') || emptyContext
  } catch {
    // Acquisition tracking must never prevent the quiz from loading.
  }

  const params = new URLSearchParams(window.location.search)
  const context: ChapterAcquisition = {
    utmSource: params.get('utm_source') || stored.utmSource,
    utmMedium: params.get('utm_medium') || stored.utmMedium,
    utmCampaign: params.get('utm_campaign') || stored.utmCampaign,
    referrer: stored.referrer || document.referrer,
    landingPage: stored.landingPage || `${window.location.pathname}${window.location.search}`,
  }

  try { window.sessionStorage.setItem(storageKey, JSON.stringify(context)) } catch { /* Keep the funnel usable. */ }
  return context
}

export function getChapterAcquisition(): ChapterAcquisition {
  return captureChapterAcquisition()
}
