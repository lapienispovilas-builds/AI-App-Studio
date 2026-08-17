import type { EveraAccountData } from './everaAccount'
import { getEveraFlowUrl } from './domainRouting'

export type EveraPlan = {
  id: 'starter-7' | 'complete-30' | 'journey-90'
  name: string
  price: string
  description: string
  badge?: string
  positioning: string
  includes: string[]
  cta: string
}

export const everaPlans: EveraPlan[] = [
  {
    id: 'starter-7',
    name: '7-Day Foundation',
    price: '$7.99',
    description: 'A simple introduction to Evera to understand your maintenance priorities and start building confidence after GLP-1.',
    badge: 'Start here',
    positioning: '$1.14 per day',
    includes: ['Personalized maintenance recommendations', 'First 7 days of habit guidance', 'Nutrition and routine foundations', 'Simple progress check-ins'],
    cta: 'Start my 7-day plan',
  },
  {
    id: 'complete-30',
    name: '30-Day Maintenance Plan',
    price: '$19.99',
    description: 'Your complete GLP-1 maintenance roadmap designed to help you protect your weight loss and build habits that last.',
    badge: 'Most popular',
    positioning: 'Recommended for most people because building maintenance habits takes consistency.',
    includes: ['Personalized 30-day roadmap', 'Weekly maintenance goals', 'Daily habit checklist', 'Nutrition and protein guidance', 'Strength and movement recommendations', 'Progress tracking', 'Guidance for life after GLP-1'],
    cta: 'Start My 30-Day Plan',
  },
  {
    id: 'journey-90',
    name: '90-Day Maintenance Journey',
    price: '$39.99',
    description: 'Long-term support for building sustainable routines and maintaining your results beyond the first month.',
    badge: 'Best value',
    positioning: '$0.44 per day',
    includes: ['Everything in the 30-day plan', 'Extended habit-building roadmap', 'Long-term progress tracking', 'Additional maintenance guidance'],
    cta: 'Start my 90-day journey',
  },
]

export const isStripeCheckoutConfigured = Boolean(import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT?.trim())

const stripeLinks: Record<EveraPlan['id'], string | undefined> = {
  'starter-7': import.meta.env.VITE_STRIPE_LINK_7_DAY?.trim(),
  'complete-30': import.meta.env.VITE_STRIPE_LINK_30_DAY?.trim(),
  'journey-90': import.meta.env.VITE_STRIPE_LINK_90_DAY?.trim(),
}

function isRealStripeLink(value?: string) {
  return Boolean(value && value.startsWith('https://'))
}

export const hasAnyStripeCheckout = isStripeCheckoutConfigured || Object.values(stripeLinks).some(isRealStripeLink)

export async function beginEveraCheckout(plan: EveraPlan, account: EveraAccountData) {
  const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT?.trim()
  const paymentLink = stripeLinks[plan.id]
  if (isRealStripeLink(paymentLink)) {
    window.location.assign(paymentLink!)
    return { testSuccess: false as const }
  }
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
