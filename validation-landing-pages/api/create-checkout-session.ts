import Stripe from 'stripe'

type PlanId = '7-day' | '30-day' | '90-day'
type CheckoutRequest = {
  plan?: PlanId
  planId?: 'starter-7' | 'complete-30' | 'journey-90'
  quizAnswers?: Record<string, string>
  primaryFocus?: string
  secondaryFocuses?: string[]
  successUrl?: string
  cancelUrl?: string
}
type ApiRequest = { method?: string; body?: CheckoutRequest; headers: { origin?: string } }
type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  end: () => void
}

const plans = {
  '7-day': { product: 'prod_V5YSGvrT6X8Nhq', name: 'Evera 7-Day Foundation', amount: 799 },
  '30-day': { product: 'prod_V5YVS7NJuGwCzi', name: 'Evera 30-Day Maintenance Plan', amount: 1499 },
  '90-day': { product: 'prod_V5YWhAtsYAEAfe', name: 'Evera 90-Day Maintenance Journey', amount: 2499 },
} as const

const clientPlanIds: Record<NonNullable<CheckoutRequest['planId']>, PlanId> = {
  'starter-7': '7-day',
  'complete-30': '30-day',
  'journey-90': '90-day',
}

function safeReturnUrl(candidate: string | undefined, fallback: string, origin: string) {
  if (!candidate) return `${origin}${fallback}`
  try {
    const url = new URL(candidate.replace('{CHECKOUT_SESSION_ID}', '__SESSION_ID__'))
    return url.origin === origin ? candidate : `${origin}${fallback}`
  } catch {
    return `${origin}${fallback}`
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end()
    return
  }
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    res.status(500).json({ error: 'Stripe is not configured.' })
    return
  }

  const body = req.body ?? {}
  const planId = body.plan ?? (body.planId ? clientPlanIds[body.planId] : undefined)
  if (!planId || !plans[planId]) {
    res.status(400).json({ error: 'Choose a valid Evera plan.' })
    return
  }

  const origin = (process.env.EVERA_APP_URL || req.headers.origin || 'https://everahealth.pro').replace(/\/$/, '')
  const successUrl = safeReturnUrl(body.successUrl, '/create-account?payment=success&session_id={CHECKOUT_SESSION_ID}', origin)
  const cancelUrl = safeReturnUrl(body.cancelUrl, '/pricing?payment=cancelled', origin)
  const answerValues = Object.values(body.quizAnswers ?? {})
  const answerMetadata = Object.fromEntries(answerValues.slice(0, 12).map((answer, index) => [`quiz_${index + 1}`, answer.slice(0, 500)]))
  const plan = plans[planId]

  try {
    const stripe = new Stripe(secretKey)
    const priceData = secretKey.startsWith('sk_test_')
      ? { currency: 'eur', unit_amount: plan.amount, product_data: { name: plan.name } }
      : { currency: 'eur', unit_amount: plan.amount, product: plan.product }
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_creation: 'always',
      line_items: [{ quantity: 1, price_data: priceData }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan: planId,
        productName: plan.name,
        primaryFocus: (body.primaryFocus ?? '').slice(0, 500),
        secondaryFocuses: (body.secondaryFocuses ?? []).join(', ').slice(0, 500),
        quizAnswers: JSON.stringify(answerValues).slice(0, 500),
        ...answerMetadata,
      },
    })
    if (!session.url) throw new Error('Stripe did not return a Checkout URL.')
    res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Stripe Checkout error', error instanceof Error ? error.message : error)
    res.status(500).json({ error: 'Checkout could not be started.' })
  }
}
