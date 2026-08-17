import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import {
  claimVerifiedEveraPurchase,
  createEveraAccount,
  getEveraAccount,
  signInToEvera,
  type EveraFocus,
} from '../lib/everaAccount'
import { saveEveraQuizDraft } from '../lib/everaFunnel'
import { trackMetaEvent } from '../lib/metaPixel'

type VerifiedPurchase = {
  verified: true
  sessionId: string
  paymentIntentId?: string
  amountTotal?: number | null
  currency?: string
  plan: '7-day' | '30-day' | '90-day'
  resultId?: string
  customerEmail: string
  primaryFocus: EveraFocus
  secondaryFocuses: EveraFocus[]
  quizAnswers: Record<string, string>
  purchasedAt: string
}

const storedPlanIds = {
  '7-day': 'starter-7',
  '30-day': 'complete-30',
  '90-day': 'journey-90',
} as const

const planNames = {
  '7-day': 'Your 7-Day Evera Foundation',
  '30-day': 'Your 30-Day Evera Maintenance Plan',
  '90-day': 'Your 90-Day Evera Maintenance Journey',
} as const

export function EveraPaymentSuccessPage() {
  const [purchase, setPurchase] = useState<VerifiedPurchase | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'create' | 'signin'>('create')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    if (!sessionId) {
      setError('This payment return link is incomplete. Open the link from your Stripe confirmation instead.')
      setLoading(false)
      return
    }

    fetch(`/api/verify-checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const result = await response.json() as VerifiedPurchase & { error?: string }
        if (!response.ok || !result.verified) throw new Error(result.error || 'Stripe has not confirmed this payment.')
        return result
      })
      .then(async (verifiedPurchase) => {
        if (!active) return
        const selectedPlan = storedPlanIds[verifiedPurchase.plan]
        saveEveraQuizDraft({
          answers: verifiedPurchase.quizAnswers,
          primaryFocus: verifiedPurchase.primaryFocus,
          secondaryFocuses: verifiedPurchase.secondaryFocuses,
          selectedPlan,
          checkoutComplete: true,
          createdAt: verifiedPurchase.purchasedAt,
        })
        setPurchase(verifiedPurchase)
        setEmail(verifiedPurchase.customerEmail || '')
        const fallbackAmounts = { '7-day': 7.99, '30-day': 14.99, '90-day': 24.99 }
        trackMetaEvent('Purchase', {
          value: typeof verifiedPurchase.amountTotal === 'number' ? verifiedPurchase.amountTotal / 100 : fallbackAmounts[verifiedPurchase.plan],
          currency: (verifiedPurchase.currency || 'EUR').toUpperCase(),
          content_name: planNames[verifiedPurchase.plan],
        }, { onceKey: `purchase_${verifiedPurchase.sessionId}`, scope: 'local' })

        const account = await getEveraAccount()
        if (account && active) {
          await claimVerifiedEveraPurchase(verifiedPurchase.sessionId)
          window.location.replace('/dashboard')
        }
      })
      .catch((verificationError) => {
        if (active) setError(verificationError instanceof Error ? verificationError.message : 'Payment verification failed.')
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [])

  async function finishAccount(event: FormEvent) {
    event.preventDefault()
    if (!purchase) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return }
    if (password.length < 6) { setError('Use at least 6 characters for your password.'); return }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      if (mode === 'create') {
        const result = await createEveraAccount(email.trim(), password, purchase.quizAnswers, purchase.primaryFocus)
        if (result.needsEmailConfirmation) {
          setNotice('Confirm your email, then return to this payment link and sign in to open your plan.')
          return
        }
      } else {
        await signInToEvera(email.trim(), password)
      }
      await claimVerifiedEveraPurchase(purchase.sessionId)
      window.location.replace('/dashboard')
    } catch (accountError) {
      setError(accountError instanceof Error ? accountError.message : 'Your account could not be connected to this purchase.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className="evera-dashboard-state"><ShieldCheck size={36} /><h1>Confirming your payment…</h1><p>We’re securely unlocking your personalized Evera plan.</p></main>
  if (!purchase) return <main className="evera-dashboard-state"><LockKeyhole size={36} /><h1>We couldn’t verify this purchase</h1><p>{error}</p><a className="phase2-button" href="/pricing">Return to plan selection <ArrowRight size={18} /></a></main>

  return <main className="evera-create-account evera-payment-success">
    <header className="evera-flow-header"><a href="/">◉ Evera</a><span>Verified Stripe purchase</span></header>
    <section className="evera-account">
      <div className="evera-payment-success__verified"><CheckCircle2 size={24} /><span>Payment confirmed</span></div>
      <div className="evera-account__summary"><ShieldCheck size={27} /><div><small>PURCHASED PROGRAM</small><strong>{planNames[purchase.plan]}</strong></div></div>
      <p className="evera-quiz__eyebrow">Your Evera plan is unlocked</p>
      <h1>{mode === 'create' ? 'Create your Evera account' : 'Welcome back to Evera'}</h1>
      <p>{mode === 'create' ? 'Create your account to save your program and access it anytime.' : 'Sign in to connect this verified purchase to your account.'}</p>
      <form onSubmit={finishAccount}>
        <label><span><Mail size={16} /> Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" readOnly={Boolean(purchase.customerEmail)} /></label>
        <label><span><LockKeyhole size={16} /> Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} /></label>
        {error && <p className="evera-account__error" role="alert">{error}</p>}
        {notice && <p className="evera-account__notice" role="status">{notice}</p>}
        <button className="phase2-button" type="submit" disabled={saving}>{saving ? 'Connecting your plan…' : mode === 'create' ? 'Create my Evera account' : 'Sign in and open my plan'} {!saving && <ArrowRight size={18} />}</button>
      </form>
      <button className="evera-account__switch" type="button" onClick={() => { setMode((current) => current === 'create' ? 'signin' : 'create'); setError(''); setNotice('') }}>{mode === 'create' ? <>Already have an account? <strong>Sign in</strong></> : <>New to Evera? <strong>Create your account</strong></>}</button>
    </section>
  </main>
}
