import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { submitLead } from '../lib/submitLead'
import { trackEveraEvent } from '../lib/posthogAnalytics'
import { trackMetaEvent } from '../lib/metaPixel'
import { attributionFromSearch, slugifyFlavor } from '../lib/pouchAttribution'
import { functionalPouchPages } from '../functionalPouchConfig'

const validSources = new Set(['zyn', 'energy', 'coffee'])

export function PouchComingSoonPage({ initialEmail = '', completedOrderIntentOverride = false }: { initialEmail?: string; completedOrderIntentOverride?: boolean } = {}) {
  const query = new URLSearchParams(window.location.search)
  const querySource = query.get('source') || ''
  const source = validSources.has(querySource) ? querySource : 'unknown'
  const completedOrderIntent = completedOrderIntentOverride || query.get('intent') === 'complete-order'
  const sourcePath = source === 'zyn' ? '/zyn-alternative' : source === 'energy' ? '/energy' : '/coffee'
  const sourceConfig = source === 'unknown' ? null : functionalPouchPages[sourcePath]
  const requestedFlavor = query.get('flavor') || ''
  const resolvedFlavor = sourceConfig?.flavors.find(item => slugifyFlavor(item.name) === requestedFlavor)?.name || requestedFlavor || 'unknown'
  const offerProperties = {
    positioning: source,
    source,
    package: query.get('package') || 'unknown',
    purchase_type: query.get('purchase_type') || 'unknown',
    flavor: resolvedFlavor,
    price: Number(query.get('price')) || 0,
  }
  const [email, setEmail] = useState(initialEmail)
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
    trackEveraEvent('coming_soon_viewed', offerProperties, `coming_soon_${window.location.search}`)
  }, [source])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email || busy || submittedRef.current) return
    setBusy(true)
    setError('')
    try {
      const attribution = attributionFromSearch()
      await submitLead({ idea: 'evera-shift-round-2', page: `${window.location.pathname}${window.location.search}`, email, answers: {
        positioning: source,
        package: offerProperties.package,
        purchaseType: offerProperties.purchase_type,
        flavor: offerProperties.flavor,
        price: String(offerProperties.price),
        ...attribution,
      } })
    } catch {
      setError('Det gick inte att spara din e-post. Försök igen om en stund.')
      setBusy(false)
      return
    }
    submittedRef.current = true
    const leadOnceKey = `pouch_lead_${source}_${window.location.search}`
    trackEveraEvent('coming_soon_email_submitted', offerProperties, leadOnceKey)
    trackMetaEvent('Lead', { ...offerProperties, page_path: window.location.pathname }, { onceKey: leadOnceKey })
    setSubmitted(true)
    setBusy(false)
  }

  return <main className="pouch-coming"><a className="pouch-logo" href={`/${source === 'zyn' ? 'zyn-alternative' : source === 'coffee' ? 'coffee' : 'energy'}`}>EVERA <b>SWEDEN</b></a><section><div className="pouch-coming__tin"><span>EVERA</span><strong>FÖRST</strong><small>0 MG NIKOTIN</small></div>{submitted ? <><i><Check /></i><p className="pouch-kicker">Du står på listan</p><h1>Vi hör av oss när den släpps.</h1><p>Tack för att du är tidig. Ingen betalning har tagits.</p></> : <>{completedOrderIntent ? <><p className="pouch-kicker">Nästan där.</p><h1>EVERA har inte lanserats än.</h1><div className="pouch-coming__notice"><Check /><div><strong>Ingen betalning har tagits.</strong><span>Din beställning har inte genomförts eller registrerats.</span></div></div><p>Vi förbereder den första batchen och vill förstå efterfrågan före produktion. Få tidig tillgång när EVERA lanseras.</p></> : <><p className="pouch-kicker">Nästan där.</p><h1>Vi förbereder den första batchen.</h1><p>Produkten har inte lanserats och ingen betalning tas. Lämna din e-post så berättar vi när den släpps.</p></>}<form className={initialEmail ? 'pouch-coming__early-access' : ''} onSubmit={submit}>{initialEmail ? <p>Lanseringsbesked skickas till <strong>{email}</strong>.</p> : <label><span>E-postadress</span><input type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required value={email} onChange={event => setEmail(event.target.value)} placeholder="du@exempel.se" /></label>}<button disabled={busy}>{busy ? 'SPARAR…' : initialEmail ? 'FÅ TIDIG TILLGÅNG' : 'MEDDELA MIG'} <ArrowRight /></button></form>{error && <p className="pouch-coming__error" role="alert">{error}</p>}<small>Ingen spam. Bara lanseringen.</small></>}</section></main>
}
