import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { submitLead } from '../lib/submitLead'
import { trackEveraEvent } from '../lib/posthogAnalytics'
import { trackMetaEvent } from '../lib/metaPixel'

const validSources = new Set(['zyn', 'energy', 'coffee'])

export function PouchComingSoonPage() {
  const querySource = new URLSearchParams(window.location.search).get('source') || ''
  const source = validSources.has(querySource) ? querySource : 'unknown'
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submittedRef = useRef(false)

  useEffect(() => {
    document.documentElement.lang = 'sv'
    document.title = 'Nästan där | EVERA'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Vi förbereder den första batchen av EVERA.')
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.head.appendChild(document.createElement('meta'))
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    trackEveraEvent('coming_soon_viewed', { positioning: source, source }, `coming_soon_${window.location.search}`)
  }, [source])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email || busy || submittedRef.current) return
    setBusy(true)
    setError('')
    try {
      await submitLead({ idea: 'evera-shift', page: `/coming-soon?source=${source}`, email, answers: { positioning: source } })
    } catch {
      setError('Det gick inte att spara din e-post. Försök igen om en stund.')
      setBusy(false)
      return
    }
    submittedRef.current = true
    const normalizedEmail = email.trim().toLowerCase()
    trackEveraEvent('coming_soon_email_submitted', { positioning: source, source }, `pouch_lead_${source}_${normalizedEmail}`)
    trackMetaEvent('Lead', { positioning: source, source, page_path: window.location.pathname }, { onceKey: `pouch_lead_${source}_${normalizedEmail}` })
    setSubmitted(true)
    setBusy(false)
  }

  return <main className="pouch-coming"><a className="pouch-logo" href={`/${source === 'zyn' ? 'zyn-alternative' : source === 'coffee' ? 'coffee' : 'energy'}`}>EVERA <b>SWEDEN</b></a><section><div className="pouch-coming__tin"><span>EVERA</span><strong>FÖRST</strong><small>0 MG NIKOTIN</small></div>{submitted ? <><i><Check /></i><p className="pouch-kicker">Du står på listan</p><h1>Vi hör av oss när den släpps.</h1><p>Tack för att du är tidig.</p></> : <><p className="pouch-kicker">Nästan där.</p><h1>Vi förbereder den första batchen.</h1><p>Lämna din e-post så berättar vi när den släpps.</p><form onSubmit={submit}><label><span>E-postadress</span><input type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required value={email} onChange={event => setEmail(event.target.value)} placeholder="du@exempel.se" /></label><button disabled={busy}>{busy ? 'SPARAR…' : 'MEDDELA MIG'} <ArrowRight /></button></form>{error && <p className="pouch-coming__error" role="alert">{error}</p>}<small>Ingen spam. Bara lanseringen.</small></>}</section></main>
}
