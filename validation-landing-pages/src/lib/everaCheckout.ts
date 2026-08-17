import type { EveraAccountData } from './everaAccount'
import { getEveraFlowUrl } from './domainRouting'

export type EveraPlan = {
  id: 'starter-7' | 'complete-30' | 'journey-90'
  name: string
  price: string
  description: string
  badge?: string
}

export const everaPlans: EveraPlan[] = [
  { id: 'starter-7', name: '7-Day Starter', price: '$7.99', description: '$1.14 per day' },
  { id: 'complete-30', name: '30-Day Complete Program', price: '$9.99', description: '$0.33 per day', badge: 'Most Popular' },
  { id: 'journey-90', name: '90-Day Maintenance Journey', price: '$24.99', description: '$0.28 per day' },
]

export const isStripeCheckoutConfigured = Boolean(import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT?.trim())

export async function beginEveraCheckout(plan: EveraPlan, account: EveraAccountData) {
  const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT?.trim()
  if (!endpoint) return { testSuccess: true as const }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: plan.id,
      userId: account.userId,
      customerEmail: account.email,
      successUrl: getEveraFlowUrl('?checkout=success'),
      cancelUrl: getEveraFlowUrl('?checkout=cancelled'),
    }),
  })

  if (!response.ok) throw new Error('Checkout could not be started. Please try again.')
  const payload = await response.json() as { url?: string }
  if (!payload.url) throw new Error('Checkout did not return a payment link.')
  window.location.assign(payload.url)
  return { testSuccess: false as const }
}
