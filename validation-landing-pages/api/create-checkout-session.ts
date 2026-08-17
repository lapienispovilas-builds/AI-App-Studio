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
  '7-day': { price: 'price_1U5P6nCOfJ4kxI6HehFhkl1J', name: 'Evera 7-Day Foundation' },
  '30-day': { price: 'price_1U5P76COfJ4kxI6H4HvZuZdZ', name: 'Evera 30-Day Maintenance Plan' },
  '90-day': { price: 'price_1U5P7KCOfJ4kxI6HvjdUAoYD', name: 'Evera 90-Day Maintenance Journey' },
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
  const successUrl = safeReturnUrl(body.successUrl, '/payment-success?session_id={CHECKOUT_SESSION_ID}', origin)
  const cancelUrl = safeReturnUrl(body.cancelUrl, '/pricing?payment=cancelled', origin)
  const answerValues = Object.values(body.quizAnswers ?? {})
  const answerMetadata = Object.fromEntries(answerValues.slice(0, 12).map((answer, index) => [`quiz_${index + 1}`, answer.slice(0, 500)]))
  const plan = plans[planId]
  const resultId = crypto.randomUUID()

  try {
    const form = new URLSearchParams()
    form.set('mode', 'payment')
    form.set('customer_creation', 'always')
    form.set('line_items[0][price]', plan.price)
    form.set('line_items[0][quantity]', '1')
    form.set('success_url', successUrl)
    form.set('cancel_url', cancelUrl)
    form.set('client_reference_id', resultId)
    const metadata = {
      plan: planId,
      resultId,
      productName: plan.name,
      primaryFocus: (body.primaryFocus ?? '').slice(0, 500),
      secondaryFocuses: (body.secondaryFocuses ?? []).join(', ').slice(0, 500),
      ...answerMetadata,
    }
    Object.entries(metadata).forEach(([key, value]) => form.set(`metadata[${key}]`, value))

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const session = await stripeResponse.json() as { url?: string; error?: { message?: string } }
    if (!stripeResponse.ok || !session.url) throw new Error(session.error?.message || 'Stripe did not return a Checkout URL.')
    res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Stripe Checkout error', error instanceof Error ? error.message : error)
    res.status(500).json({ error: 'Checkout could not be started.' })
  }
}
