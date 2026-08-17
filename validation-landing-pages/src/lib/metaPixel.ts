type MetaPixel = (...args: unknown[]) => void

type MetaParameters = Record<string, string | number | boolean>

declare global {
  interface Window {
    fbq?: MetaPixel
  }
}

export function trackMetaLead(): boolean {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead')
    return true
  }

  return false
}

function storageFor(scope: 'session' | 'local') {
  if (typeof window === 'undefined') return null
  return scope === 'local' ? window.localStorage : window.sessionStorage
}

export function trackMetaEvent(
  event: string,
  parameters: MetaParameters = {},
  options: { custom?: boolean; onceKey?: string; scope?: 'session' | 'local' } = {},
): boolean {
  if (typeof window === 'undefined' || !window.fbq) return false
  const storage = storageFor(options.scope ?? 'session')
  const storageKey = options.onceKey ? `evera_meta_${options.onceKey}` : ''
  if (storageKey && storage?.getItem(storageKey)) return false

  window.fbq(options.custom ? 'trackCustom' : 'track', event, parameters)
  if (storageKey) {
    try { storage?.setItem(storageKey, '1') } catch { /* Tracking still succeeds when storage is unavailable. */ }
  }
  return true
}

export function metaFocusValue(focus: string) {
  const values: Record<string, string> = {
    'Weight Stability': 'weight_stability',
    'Sustainable Routine': 'sustainable_routine',
    'Nutrition & Protein': 'nutrition_protein',
    'Strength & Movement': 'strength_movement',
    'Transition Preparation': 'transition_preparation',
  }
  return values[focus] ?? focus.toLowerCase().replace(/&/g, '').replace(/\s+/g, '_')
}
