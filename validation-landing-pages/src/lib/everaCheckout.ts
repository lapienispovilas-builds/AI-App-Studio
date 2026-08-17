import type { EveraAccountData } from './everaAccount'

export type EveraPlan = {
  id: 'starter-7' | 'complete-30' | 'journey-90'
  name: string
  price: string
  description: string
  badge?: string
}

export const everaPlans: EveraPlan[] = [
  { id: 'starter-7', name: '7-Day Starter', price: '$7.99', description: 'Try the program' },
  { id: 'complete-30', name: '30-Day Complete Program', price: '$19.99', description: 'Recommended', badge: 'Most Popular' },
  { id: 'journey-90', name: '90-Day Maintenance Journey', price: '$39.99', description: 'Best Value' },
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
      successUrl: `${window.location.origin}/glp1-tracker-maintenance?checkout=success`,
      cancelUrl: `${window.location.origin}/glp1-tracker-maintenance?checkout=cancelled`,
    }),
  })

  if (!response.ok) throw new Error('Checkout could not be started. Please try again.')
  const payload = await response.json() as { url?: string }
  if (!payload.url) throw new Error('Checkout did not return a payment link.')
  window.location.assign(payload.url)
  return { testSuccess: false as const }
}
