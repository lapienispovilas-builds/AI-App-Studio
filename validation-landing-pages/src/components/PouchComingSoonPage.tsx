import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { submitLead } from '../lib/submitLead'
import { trackEveraEvent } from '../lib/posthogAnalytics'

const validSources = new Set(['zyn', 'preworkout', 'coffee'])

export function PouchComingSoonPage() {
  const querySource = new URLSearchParams(window.location.search).get('source') || ''
  const source = validSources.has(querySource) ? querySource : 'unknown'
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.documentElement.lang = 'sv'
    document.title = 'Nästan där | EVERA'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Vi förbereder den första batchen av EVERA.')
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

  return <main className="pouch-coming"><a className="pouch-logo" href={`/${source === 'zyn' ? 'zyn-alternative' : source === 'coffee' ? 'coffee' : 'energy'}`}>EVERA <b>SWEDEN</b></a><section><div className="pouch-coming__tin"><span>EVERA</span><strong>FÖRST</strong><small>0 MG NIKOTIN</small></div>{submitted ? <><i><Check /></i><p className="pouch-kicker">Du står på listan</p><h1>Vi hör av oss när den släpps.</h1><p>Tack för att du är tidig.</p></> : <><p className="pouch-kicker">Nästan där.</p><h1>Vi förbereder den första batchen.</h1><p>Lämna din e-post så berättar vi när den släpps.</p><form onSubmit={submit}><label><span>E-postadress</span><input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="du@exempel.se" /></label><button disabled={busy}>{busy ? 'SPARAR…' : 'MEDDELA MIG'} <ArrowRight /></button></form><small>Ingen spam. Bara lanseringen.</small></>}</section></main>
}
