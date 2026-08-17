type ApiRequest = { method?: string; query?: { session_id?: string | string[] } }
type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  end: () => void
}

type StripeSession = {
  id?: string
  payment_status?: string
  payment_intent?: string | { id?: string }
  amount_total?: number | null
  currency?: string | null
  customer_details?: { email?: string | null }
  customer_email?: string | null
  created?: number
  client_reference_id?: string | null
  metadata?: Record<string, string | undefined>
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).end()
    return
  }
  const secretKey = process.env.STRIPE_SECRET_KEY
  const sessionId = Array.isArray(req.query?.session_id) ? req.query?.session_id[0] : req.query?.session_id
  if (!secretKey || !sessionId || !sessionId.startsWith('cs_')) {
    res.status(400).json({ verified: false })
    return
  }

  try {
    const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    const session = await stripeResponse.json() as StripeSession
    if (!stripeResponse.ok) throw new Error('Stripe could not verify this Checkout Session.')
    if (session.payment_status !== 'paid') {
      res.status(402).json({ verified: false })
      return
    }
    const metadata = session.metadata ?? {}
    if (!metadata.plan || !['7-day', '30-day', '90-day'].includes(metadata.plan)) {
      res.status(400).json({ verified: false })
      return
    }
    const quizAnswers = Object.fromEntries(
      Array.from({ length: 12 }, (_, index) => metadata[`quiz_${index + 1}`])
        .filter((answer): answer is string => Boolean(answer))
        .map((answer, index) => [`Question ${index + 1}`, answer]),
    )
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
    res.status(200).json({
      verified: true,
      sessionId: session.id ?? sessionId,
      paymentIntentId,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? 'eur',
      plan: metadata.plan,
      resultId: metadata.resultId ?? session.client_reference_id,
      customerEmail: session.customer_details?.email ?? session.customer_email ?? '',
      primaryFocus: metadata.primaryFocus || 'Weight Stability',
      secondaryFocuses: (metadata.secondaryFocuses ?? '').split(',').map((focus) => focus.trim()).filter(Boolean),
      quizAnswers,
      purchasedAt: session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString(),
    })
  } catch (error) {
    console.error('Stripe verification error', error instanceof Error ? error.message : error)
    res.status(400).json({ verified: false })
  }
}
