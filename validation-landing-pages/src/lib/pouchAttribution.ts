import type { PouchPositioning } from '../functionalPouchConfig'

export type ExperimentPositioning = 'zyn' | 'energy' | 'coffee'
export type PouchPackage = '1-pack' | '5-pack'
export type PurchaseType = 'one-time' | 'subscription'

export type PouchOffer = {
  positioning: ExperimentPositioning
  flavor: string
  package: PouchPackage
  purchase_type: PurchaseType
  price: 89 | 239 | 279
  strength?: 'original' | 'strong'
}

export const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const funnelQueryKeys = [...utmKeys, 'test'] as const

export function experimentPositioning(positioning: PouchPositioning): ExperimentPositioning {
  return positioning === 'preworkout' ? 'energy' : positioning
}

export function offerPrice(packageSize: PouchPackage, purchaseType: PurchaseType): PouchOffer['price'] {
  if (packageSize === '1-pack') return 89
  return purchaseType === 'subscription' ? 239 : 279
}

export function normalizePurchaseType(packageSize: PouchPackage, purchaseType: PurchaseType): PurchaseType {
  return packageSize === '1-pack' ? 'one-time' : purchaseType
}

export function slugifyFlavor(flavor: string) {
  return flavor.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function attributionFromSearch(search = window.location.search) {
  const current = new URLSearchParams(search)
  return Object.fromEntries(utmKeys.map(key => [key, current.get(key) || ''])) as Record<(typeof utmKeys)[number], string>
}

function appendAttribution(next: URLSearchParams, current = new URLSearchParams(window.location.search)) {
  for (const key of funnelQueryKeys) {
    const value = current.get(key)
    if (value) next.set(key, value)
  }
  return next
}

export function checkoutUrl(offer: PouchOffer) {
  const next = new URLSearchParams({
    source: offer.positioning,
    flavor: slugifyFlavor(offer.flavor),
    package: offer.package,
    purchase_type: offer.purchase_type,
    price: String(offer.price),
    strength: offer.strength ?? 'original',
  })
  appendAttribution(next)
  return `/checkout?${next.toString()}`
}

export function comingSoonUrl(offer: PouchOffer, completedOrder = false) {
  const next = new URLSearchParams({
    source: offer.positioning,
    flavor: slugifyFlavor(offer.flavor),
    package: offer.package,
    purchase_type: offer.purchase_type,
    price: String(offer.price),
  })
  if (offer.strength) next.set('strength', offer.strength)
  if (completedOrder) next.set('intent', 'complete-order')
  appendAttribution(next)
  return `/coming-soon?${next.toString()}`
}

export function analyticsOfferProperties(offer: PouchOffer) {
  return {
    positioning: offer.positioning,
    package: offer.package,
    purchase_type: offer.purchase_type,
    flavor: offer.flavor,
    price: offer.price,
    strength: offer.strength ?? 'original',
  }
}
