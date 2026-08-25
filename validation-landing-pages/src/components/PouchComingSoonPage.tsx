import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { submitLead } from '../lib/submitLead'
import { trackEveraEvent } from '../lib/posthogAnalytics'

const validSources = new Set(['zyn', 'energy', 'coffee'])

export function PouchComingSoonPage() {
  const querySource = new URLSearchParams(window.location.search).get('source') || ''
  const source = validSources.has(querySource) ? querySource : 'unknown'
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Almost there | EVERA SHIFT'
    document.querySelector('meta[name="description"]')?.setAttribute('content', "We're preparing the first batch of EVERA SHIFT.")
    trackEveraEvent('coming_soon_viewed', { positioning: source, source }, `coming_soon_${source}`)
  }, [source])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email || busy) return
    setBusy(true)
    trackEveraEvent('coming_soon_email_submitted', { positioning: source, source })
    try { await submitLead({ idea: 'evera-shift', page: `/coming-soon?source=${source}`, email, answers: { positioning: source } }) } catch { /* Analytics still records intent if the lead endpoint is unavailable. */ }
    setSubmitted(true)
    setBusy(false)
  }

  return <main className="pouch-coming"><a className="pouch-logo" href={`/${source === 'zyn' ? 'zyn-alternative' : source === 'unknown' ? 'energy' : source}`}>EVERA <b>SHIFT</b></a><section><div className="pouch-coming__tin"><span>EVERA</span><strong>SHIFT</strong><small>NICOTINE FREE</small></div>{submitted ? <><i><Check /></i><p className="pouch-kicker">You’re on the list</p><h1>We’ll let you know when it drops.</h1><p>Thanks for being early.</p></> : <><p className="pouch-kicker">Almost there.</p><h1>We’re preparing the first batch.</h1><p>Leave your email and we’ll let you know when it drops.</p><form onSubmit={submit}><label><span>Email address</span><input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label><button disabled={busy}>{busy ? 'SAVING…' : 'NOTIFY ME'} <ArrowRight /></button></form><small>No spam. Just the drop.</small></>}</section></main>
}
