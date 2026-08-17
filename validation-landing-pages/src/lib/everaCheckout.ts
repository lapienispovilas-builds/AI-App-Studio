import type { EveraQuizDraft } from './everaFunnel'
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
    price: '€7.99',
    description: 'A simple introduction to Evera to understand your maintenance priorities and start building confidence after GLP-1.',
    badge: 'Start here',
    positioning: '€1.14 per day',
    includes: ['Personalized maintenance recommendations', 'First 7 days of habit guidance', 'Nutrition and routine foundations', 'Simple progress check-ins'],
    cta: 'Start my 7-day plan',
  },
  {
    id: 'complete-30',
    name: '30-Day Maintenance Plan',
    price: '€14.99',
    description: 'Your complete GLP-1 maintenance roadmap designed to help you protect your weight loss and build habits that last.',
    badge: 'Most popular',
    positioning: 'Recommended for most people because building maintenance habits takes consistency.',
    includes: ['Personalized 30-day roadmap', 'Weekly maintenance goals', 'Daily habit checklist', 'Nutrition and protein guidance', 'Strength and movement recommendations', 'Progress tracking', 'Guidance for life after GLP-1'],
    cta: 'Start my 30-day plan',
  },
  {
    id: 'journey-90',
    name: '90-Day Maintenance Journey',
    price: '€24.99',
    description: 'Long-term support for building sustainable routines and maintaining your results beyond the first month.',
    badge: 'Best value',
    positioning: '€0.28 per day',
    includes: ['Everything in the 30-day plan', 'Extended habit-building roadmap', 'Long-term progress tracking', 'Additional maintenance guidance'],
    cta: 'Start my 90-day journey',
  },
]

const localHostnames = new Set(['localhost', '127.0.0.1'])
const defaultCheckoutEndpoint = typeof window !== 'undefined' && !localHostnames.has(window.location.hostname)
  ? '/api/create-checkout-session'
  : undefined

export const isStripeCheckoutConfigured = Boolean(import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT?.trim() || defaultCheckoutEndpoint)

const stripeLinks: Record<EveraPlan['id'], string | undefined> = {
  'starter-7': import.meta.env.VITE_STRIPE_LINK_7_DAY?.trim(),
  'complete-30': import.meta.env.VITE_STRIPE_LINK_30_DAY?.trim(),
  'journey-90': import.meta.env.VITE_STRIPE_LINK_90_DAY?.trim(),
}

function isRealStripeLink(value?: string) {
  return Boolean(value && value.startsWith('https://'))
}

export const hasAnyStripeCheckout = isStripeCheckoutConfigured || Object.values(stripeLinks).some(isRealStripeLink)

export async function beginEveraCheckout(plan: EveraPlan, draft: EveraQuizDraft) {
  const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT?.trim() || defaultCheckoutEndpoint
  const paymentLink = stripeLinks[plan.id]
  if (!endpoint && isRealStripeLink(paymentLink)) {
    window.location.assign(paymentLink!)
    return { testSuccess: false as const }
  }
  if (!endpoint) throw new Error('Secure checkout is not configured in this environment.')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: plan.id,
      plan: plan.id === 'starter-7' ? '7-day' : plan.id === 'journey-90' ? '90-day' : '30-day',
      quizAnswers: draft.answers,
      primaryFocus: draft.primaryFocus,
      secondaryFocuses: draft.secondaryFocuses,
      successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}${draft.locale === 'da' ? '/dk/pricing' : '/pricing'}?payment=cancelled`,
    }),
  })

  const payload = await response.json().catch(() => ({})) as { url?: string; error?: string }
  if (!response.ok) throw new Error(payload.error || 'Checkout could not be started. Please try again.')
  if (!payload.url) throw new Error('Checkout did not return a payment link.')
  window.location.assign(payload.url)
  return { testSuccess: false as const }
}
