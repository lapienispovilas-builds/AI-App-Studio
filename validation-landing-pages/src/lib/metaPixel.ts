type MetaPixel = (...args: unknown[]) => void

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
