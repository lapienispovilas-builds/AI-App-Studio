type ApiRequest = {
  method?: string
  body?: { sessionId?: string }
  headers: { authorization?: string }
}

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
  customer_details?: { email?: string | null }
  customer_email?: string | null
  created?: number
  client_reference_id?: string | null
  metadata?: Record<string, string | undefined>
}

const validPlans = new Set(['7-day', '30-day', '90-day'])
const storedPlanIds: Record<string, string> = {
  '7-day': 'starter-7',
  '30-day': 'complete-30',
  '90-day': 'journey-90',
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end()
    return
  }

  const sessionId = req.body?.sessionId
  const accessToken = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!sessionId?.startsWith('cs_') || !accessToken || !stripeKey || !supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    res.status(400).json({ claimed: false, error: 'Purchase claiming is not configured.' })
    return
  }

  try {
    const [stripeResponse, userResponse] = await Promise.all([
      fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
        headers: { Authorization: `Bearer ${stripeKey}` },
      }),
      fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${accessToken}` },
      }),
    ])
    const session = await stripeResponse.json() as StripeSession
    const user = await userResponse.json() as { id?: string; email?: string }
    if (!stripeResponse.ok || session.payment_status !== 'paid') throw new Error('Stripe payment is not verified.')
    if (!userResponse.ok || !user.id || !user.email) throw new Error('Sign in before claiming this purchase.')

    const plan = session.metadata?.plan ?? ''
    if (!validPlans.has(plan)) throw new Error('The purchased plan is invalid.')
    const stripeEmail = (session.customer_details?.email ?? session.customer_email ?? '').trim().toLowerCase()
    if (stripeEmail && stripeEmail !== user.email.trim().toLowerCase()) {
      throw new Error('Use the same email address that was entered during checkout.')
    }

    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
    const quizAnswers = Object.fromEntries(
      Array.from({ length: 12 }, (_, index) => session.metadata?.[`quiz_${index + 1}`])
        .filter((answer): answer is string => Boolean(answer))
        .map((answer, index) => [`Question ${index + 1}`, answer]),
    )
    const purchasedAt = session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString()
    const headers = {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    }

    const purchaseResponse = await fetch(`${supabaseUrl}/rest/v1/evera_purchases?on_conflict=stripe_checkout_session_id`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_id: user.id,
        email: user.email,
        stripe_checkout_session_id: session.id ?? sessionId,
        stripe_payment_intent_id: paymentIntentId ?? null,
        result_id: session.metadata?.resultId ?? session.client_reference_id ?? null,
        selected_plan: storedPlanIds[plan],
        payment_status: 'paid',
        quiz_answers: quizAnswers,
        primary_focus: session.metadata?.primaryFocus || 'Weight Stability',
        secondary_focuses: (session.metadata?.secondaryFocuses ?? '').split(',').map((focus) => focus.trim()).filter(Boolean),
        purchased_at: purchasedAt,
      }),
    })
    if (!purchaseResponse.ok) throw new Error('The verified purchase could not be saved.')

    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/evera_profiles?id=eq.${encodeURIComponent(user.id)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        has_paid: true,
        selected_plan: storedPlanIds[plan],
        quiz_answers: quizAnswers,
        primary_focus: session.metadata?.primaryFocus || 'Weight Stability',
        updated_at: new Date().toISOString(),
      }),
    })
    if (!profileResponse.ok) throw new Error('The verified entitlement could not be attached to your account.')

    res.status(200).json({ claimed: true, plan: storedPlanIds[plan] })
  } catch (error) {
    console.error('Evera purchase claim error', error instanceof Error ? error.message : error)
    res.status(400).json({ claimed: false, error: error instanceof Error ? error.message : 'Purchase could not be claimed.' })
  }
}
