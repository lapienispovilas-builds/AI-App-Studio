import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { createEveraAccount, markEveraPaid } from '../lib/everaAccount'
import { getEveraQuizDraft, updateEveraQuizDraft, type EveraQuizDraft } from '../lib/everaFunnel'
import { getEveraFlowUrl } from '../lib/domainRouting'
import { submitLead } from '../lib/submitLead'
import { trackMetaLead } from '../lib/metaPixel'

const stripePlans = {
  '7-day': 'starter-7',
  '30-day': 'complete-30',
  '90-day': 'journey-90',
} as const

export function EveraCreateAccountPage() {
  const initialDraft = useMemo(() => getEveraQuizDraft(), [])
  const [draft, setDraft] = useState<EveraQuizDraft | null>(initialDraft)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (initialDraft && params.get('checkout') === 'success') {
      setDraft(updateEveraQuizDraft({ checkoutComplete: true }) ?? initialDraft)
      return
    }
    if (!initialDraft || params.get('payment') !== 'success') return

    const sessionId = params.get('session_id')
    if (!sessionId) {
      setError('We could not verify this payment. Please return to plan selection.')
      return
    }
    setVerifyingPayment(true)
    fetch(`/api/verify-checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Payment verification failed.')
        return response.json() as Promise<{ verified: boolean; plan?: keyof typeof stripePlans }>
      })
      .then((result) => {
        if (!result.verified) throw new Error('Payment has not been confirmed.')
        const selectedPlan = result.plan ? stripePlans[result.plan] : initialDraft.selectedPlan
        const verifiedDraft = updateEveraQuizDraft({ checkoutComplete: true, selectedPlan }) ?? initialDraft
        setDraft(verifiedDraft)
      })
      .catch((verificationError) => setError(verificationError instanceof Error ? verificationError.message : 'Payment verification failed.'))
      .finally(() => setVerifyingPayment(false))
  }, [initialDraft])

  async function createAccount(event: FormEvent) {
    event.preventDefault()
    if (!draft?.checkoutComplete || !draft.selectedPlan) { setError('Complete checkout before creating your account.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return }
    if (password.length < 6) { setError('Use at least 6 characters for your password.'); return }
    setSaving(true)
    setError('')
    try {
      const result = await createEveraAccount(email.trim(), password, draft.answers, draft.primaryFocus)
      if (result.needsEmailConfirmation) {
        setMessage('Check your email to confirm your Evera account, then sign in to open your plan.')
        return
      }
      await markEveraPaid(result.account, draft.selectedPlan)
      await submitLead({ idea: 'Evera', page: '/create-account', email: email.trim(), answers: { ...draft.answers, 'Primary focus': draft.primaryFocus, 'Secondary focuses': draft.secondaryFocuses.join(', '), 'Purchased plan': draft.selectedPlan } }).catch(() => undefined)
      trackMetaLead()
      window.location.assign('/dashboard')
    } catch (accountError) {
      setError(accountError instanceof Error ? accountError.message : 'Your account could not be created.')
    } finally {
      setSaving(false)
    }
  }

  if (verifyingPayment) return <main className="evera-dashboard-state"><ShieldCheck size={35} /><h1>Confirming your payment…</h1><p>Your personalized Evera plan is almost ready.</p></main>
  if (!draft?.checkoutComplete) return <main className="evera-dashboard-state"><ShieldCheck size={35} /><h1>Complete checkout first</h1><p>{error || 'Your personalized plan will remain saved while you choose a program.'}</p><a className="phase2-button" href="/pricing">Return to plan selection <ArrowRight size={18} /></a></main>

  const purchasedPlan = draft.selectedPlan === 'starter-7' ? '7-Day Foundation' : draft.selectedPlan === 'journey-90' ? '90-Day Maintenance Journey' : '30-Day Maintenance Plan'
  return (
    <main className="evera-create-account">
      <header className="evera-flow-header"><a href={getEveraFlowUrl()}>◉ Evera</a><span>Payment confirmed</span></header>
      <section className="evera-account">
        <div className="evera-account__summary"><LockKeyhole size={27} /><div><small>YOUR PURCHASED PLAN</small><strong>{purchasedPlan}</strong></div></div>
        <p className="evera-quiz__eyebrow">Your Evera plan is unlocked</p>
        <h1>Create your Evera account</h1>
        <p>Create your account to access your personalized program.</p>
        <form onSubmit={createAccount}>
          <label><span><Mail size={16} /> Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
          <label><span><LockKeyhole size={16} /> Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete="new-password" /></label>
          {error && <p className="evera-account__error" role="alert">{error}</p>}
          {message && <p className="evera-account__notice" role="status">{message}</p>}
          <button className="phase2-button" type="submit" disabled={saving}>{saving ? 'Creating your account…' : 'Create my Evera account'} {!saving && <ArrowRight size={18} />}</button>
        </form>
      </section>
    </main>
  )
}
