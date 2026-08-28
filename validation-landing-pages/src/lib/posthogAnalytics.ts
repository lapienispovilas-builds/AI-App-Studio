import posthog from 'posthog-js'

type AnalyticsValue = string | number | boolean | null | undefined
type AnalyticsProperties = Record<string, AnalyticsValue>

const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN?.trim()
const host = import.meta.env.VITE_POSTHOG_HOST?.trim() || 'https://eu.i.posthog.com'
const debugEnabled = import.meta.env.VITE_POSTHOG_DEBUG === 'true'
let initialized = false
const capturedPageViews = new Set<string>()

const ATTRIBUTION_KEY = 'evera_posthog_attribution_v1'

function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/ipad|tablet/.test(userAgent)) return 'tablet'
  if (/mobi|iphone|android/.test(userAgent)) return 'mobile'
  return 'desktop'
}

function readAttribution(): AnalyticsProperties {
  try {
    const current = new URLSearchParams(window.location.search)
    const stored = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) || '{}') as AnalyticsProperties
    const next: AnalyticsProperties = { ...stored }

    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      if (current.get(key)) next[key] = current.get(key)
    }

    if (!next.traffic_source) {
      next.traffic_source = current.get('utm_source')
        || (document.referrer ? new URL(document.referrer).hostname : 'direct')
    }
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next))
    return next
  } catch {
    return { traffic_source: 'unknown' }
  }
}

export function initializePostHog() {
  if (initialized || !token || (!import.meta.env.PROD && !debugEnabled)) return initialized ? posthog : null

  posthog.init(token, {
    api_host: host,
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
    person_profiles: 'identified_only',
    loaded: (client) => {
      if (debugEnabled) client.debug()
    },
  })
  initialized = true
  posthog.register({
    product: 'evera',
    device_type: getDeviceType(),
    ...readAttribution(),
  })
  return posthog
}

export function trackEveraEvent(event: string, properties: AnalyticsProperties = {}, onceKey?: string) {
  if (!initialized) return false
  if (onceKey) {
    const key = `evera_posthog_once_${onceKey}`
    if (window.sessionStorage.getItem(key)) return false
    window.sessionStorage.setItem(key, '1')
  }
  posthog.capture(event, {
    current_url: window.location.href,
    pathname: window.location.pathname,
    referrer: document.referrer || '',
    ...readAttribution(),
    ...properties,
  })
  return true
}

export function trackEveraPageView(path: string) {
  const pageViewKey = `${path}${window.location.search}`
  if (capturedPageViews.has(pageViewKey)) return false
  const captured = trackEveraEvent('$pageview', {
    $current_url: window.location.href,
    $pathname: path,
    path,
    page_title: document.title,
  })
  if (captured) capturedPageViews.add(pageViewKey)
  return captured
}

export function identifyEveraUser(userId: string, selectedProgram?: string) {
  if (!initialized) return
  posthog.identify(userId, selectedProgram ? { selected_program_length: selectedProgram } : undefined)
}

export function resetEveraAnalyticsUser() {
  if (initialized) posthog.reset()
}

export function postHogFocusValue(focus: string) {
  const values: Record<string, string> = {
    'Weight Stability': 'weight_stability',
    'Sustainable Routine': 'sustainable_routine',
    'Nutrition & Protein': 'nutrition_protein',
    'Strength & Movement': 'strength_movement',
    'Transition Preparation': 'transition_preparation',
  }
  return values[focus] || 'weight_stability'
}

export function postHogPlanValue(planId?: string) {
  if (planId === 'starter-7' || planId === '7-day') return '7_day'
  if (planId === 'journey-90' || planId === '90-day') return '90_day'
  return '30_day'
}
