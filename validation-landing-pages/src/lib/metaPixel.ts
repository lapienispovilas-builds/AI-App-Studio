type MetaPixel = (...args: unknown[]) => void

declare global {
  interface Window {
    fbq?: MetaPixel
  }
}

export function trackMetaLead() {
  window.fbq?.('track', 'Lead')
}
