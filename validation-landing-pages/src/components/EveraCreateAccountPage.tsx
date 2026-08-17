import { ArrowRight, ShieldCheck } from 'lucide-react'

export function EveraCreateAccountPage() {
  const sessionId = new URLSearchParams(window.location.search).get('session_id')
  if (sessionId) {
    window.location.replace(`/payment-success?session_id=${encodeURIComponent(sessionId)}`)
    return null
  }

  return <main className="evera-dashboard-state">
    <ShieldCheck size={35} />
    <h1>Complete checkout first</h1>
    <p>Account creation opens after Stripe securely confirms your Evera purchase.</p>
    <a className="phase2-button" href="/pricing">Return to plan selection <ArrowRight size={18} /></a>
  </main>
}
