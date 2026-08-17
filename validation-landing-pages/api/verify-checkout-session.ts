import Stripe from 'stripe'

type ApiRequest = { method?: string; query?: { session_id?: string | string[] } }
type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  end: () => void
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
    const stripe = new Stripe(secretKey)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      res.status(402).json({ verified: false })
      return
    }
    res.status(200).json({ verified: true, plan: session.metadata?.plan })
  } catch (error) {
    console.error('Stripe verification error', error instanceof Error ? error.message : error)
    res.status(400).json({ verified: false })
  }
}
