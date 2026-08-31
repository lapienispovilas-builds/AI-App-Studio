import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { functionalPouchPages } from '../functionalPouchConfig'
import { trackMetaEvent } from '../lib/metaPixel'
import { trackEveraEvent } from '../lib/posthogAnalytics'
import { analyticsOfferProperties, comingSoonUrl, normalizePurchaseType, offerPrice, slugifyFlavor, type ExperimentPositioning, type PouchOffer, type PouchPackage, type PurchaseType } from '../lib/pouchAttribution'

type CheckoutDetails = {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
}

const sourcePaths: Record<ExperimentPositioning, string> = {
  coffee: '/coffee',
  zyn: '/zyn-alternative',
  energy: '/energy',
}

function checkoutOffer(): PouchOffer {
  const params = new URLSearchParams(window.location.search)
  const sourceParam = params.get('source')
  const positioning: ExperimentPositioning = sourceParam === 'zyn' || sourceParam === 'energy' || sourceParam === 'coffee' ? sourceParam : 'coffee'
  const config = functionalPouchPages[sourcePaths[positioning]]
  const requestedFlavor = params.get('flavor') || ''
  const flavor = config.flavors.find(item => slugifyFlavor(item.name) === requestedFlavor)?.name ?? config.flavors[0].name
  const packageSize: PouchPackage = params.get('package') === '1-pack' ? '1-pack' : '5-pack'
  const requestedPurchaseType: PurchaseType = params.get('purchase_type') === 'subscription' ? 'subscription' : 'one-time'
  const purchaseType = normalizePurchaseType(packageSize, requestedPurchaseType)
  const strength = params.get('strength') === 'strong' ? 'strong' : 'original'
  return { positioning, flavor, package: packageSize, purchase_type: purchaseType, price: offerPrice(packageSize, purchaseType), strength }
}

export function PouchCheckoutPage() {
  const offer = checkoutOffer()
  const analyticsProperties = analyticsOfferProperties(offer)
  const [details, setDetails] = useState<CheckoutDetails>({ email: '', firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'Sverige' })
  const detailsTracked = useRef(false)
  const submitting = useRef(false)
  const detailsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())
    && details.firstName.trim().length >= 2
    && details.lastName.trim().length >= 2
    && details.address.trim().length >= 4
    && details.city.trim().length >= 2
    && /^\d{3}\s?\d{2}$/.test(details.postalCode.trim())
    && details.country === 'Sverige'

  useEffect(() => {
    document.documentElement.lang = 'sv'
    document.title = 'Kassa | EVERA'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Slutför ditt val av EVERA funktionella prillor.')
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.head.appendChild(document.createElement('meta'))
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    const offerKey = `${offer.positioning}_${offer.package}_${offer.purchase_type}_${slugifyFlavor(offer.flavor)}_${offer.price}`
    trackEveraEvent('checkout_started', analyticsProperties, `checkout_started_${offerKey}_${window.location.search}`)
    trackMetaEvent('InitiateCheckout', {
      ...analyticsProperties,
      content_name: `EVERA ${offer.package}`,
      content_category: 'functional_pouches',
      content_ids: [`${offer.positioning}_${slugifyFlavor(offer.flavor)}_${offer.package}`],
      content_type: 'product',
      value: offer.price,
      currency: 'SEK',
    }, { onceKey: `pouch_checkout_${offerKey}_${window.location.search}` })
  }, [])

  useEffect(() => {
    if (!detailsValid || detailsTracked.current) return
    detailsTracked.current = true
    trackEveraEvent('checkout_details_completed', analyticsProperties, `checkout_details_${offer.positioning}_${offer.package}_${offer.purchase_type}_${slugifyFlavor(offer.flavor)}_${window.location.search}`)
  }, [detailsValid])

  const update = (key: keyof CheckoutDetails, value: string) => setDetails(current => ({ ...current, [key]: value }))

  const completeOrder = (event: FormEvent) => {
    event.preventDefault()
    if (!detailsValid || submitting.current) return
    submitting.current = true
    trackEveraEvent('complete_order_clicked', analyticsProperties)
    trackMetaEvent('PurchaseIntent', {
      ...analyticsProperties,
      content_name: `EVERA ${offer.package}`,
      content_category: 'functional_pouches',
      content_type: 'product',
      value: offer.price,
      currency: 'SEK',
    }, { custom: true })
    window.location.assign(comingSoonUrl(offer, true))
  }

  const purchaseLabel = offer.purchase_type === 'subscription' ? 'Prenumerera & spara 15 %' : 'Engångsköp'

  return <main className="pouch-checkout">
    <header className="pouch-checkout__header"><a href={sourcePaths[offer.positioning]}><ArrowLeft /> TILLBAKA</a><strong>EVERA</strong><span><LockKeyhole /> SÄKER KASSA</span></header>
    <div className="pouch-checkout__layout">
      <form className="pouch-checkout__form" onSubmit={completeOrder} noValidate>
        <section>
          <p className="pouch-checkout__step">01 · KONTAKT</p>
          <h1>Slutför din beställning</h1>
          <label><span>E-post</span><input type="email" inputMode="email" autoComplete="email" value={details.email} onChange={event => update('email', event.target.value)} placeholder="du@exempel.se" required /></label>
        </section>

        <section>
          <p className="pouch-checkout__step">02 · LEVERANS</p>
          <h2>Leveransuppgifter</h2>
          <div className="pouch-checkout__two"><label><span>Förnamn</span><input autoComplete="given-name" value={details.firstName} onChange={event => update('firstName', event.target.value)} required /></label><label><span>Efternamn</span><input autoComplete="family-name" value={details.lastName} onChange={event => update('lastName', event.target.value)} required /></label></div>
          <label><span>Adress</span><input autoComplete="street-address" value={details.address} onChange={event => update('address', event.target.value)} required /></label>
          <div className="pouch-checkout__two"><label><span>Postnummer</span><input inputMode="numeric" autoComplete="postal-code" value={details.postalCode} onChange={event => update('postalCode', event.target.value)} placeholder="123 45" required /></label><label><span>Stad</span><input autoComplete="address-level2" value={details.city} onChange={event => update('city', event.target.value)} required /></label></div>
          <label><span>Land</span><select autoComplete="country-name" value={details.country} onChange={event => update('country', event.target.value)}><option>Sverige</option></select></label>
        </section>

        <section>
          <p className="pouch-checkout__step">03 · BETALNING</p>
          <h2>Betalning</h2>
          <div className="pouch-checkout__payment" aria-label="Simulerad kortbetalning">
            <div><span>Kortnummer</span><b>•••• •••• •••• ••••</b></div><div><span>MM / ÅÅ</span><b>•• / ••</b></div><div><span>CVC</span><b>•••</b></div>
          </div>
          <p className="pouch-checkout__security"><LockKeyhole /> Kortuppgifter efterfrågas eller behandlas inte i detta valideringstest.</p>
        </section>

        <button className="pouch-checkout__complete" disabled={!detailsValid} type="submit">SLUTFÖR BESTÄLLNING <ArrowRight /></button>
        <p className="pouch-checkout__button-note">Du debiteras inte när du fortsätter.</p>
      </form>

      <aside className="pouch-checkout__summary">
        <p>DIN BESTÄLLNING</p><h2>EVERA</h2>
        <div className="pouch-checkout__item"><div className={`pouch-checkout__tin pouch-checkout__tin--${offer.positioning}`}><span>EVERA</span><small>{offer.positioning === 'zyn' ? 'RITUAL' : offer.positioning === 'coffee' ? 'FOKUS' : 'MOVE'}</small></div><div><strong>{offer.package.toUpperCase()}</strong><span>{offer.flavor}</span><span>{offer.strength === 'strong' ? 'Stark · 15 % starkare' : 'Original'}</span><span>{purchaseLabel}</span></div><b>{offer.price} kr</b></div>
        <dl><div><dt>Delsumma</dt><dd>{offer.price} kr</dd></div><div><dt>Frakt</dt><dd>GRATIS</dd></div><div><dt>Totalt</dt><dd>{offer.price} kr</dd></div></dl>
        <ul><li><Check /> Fri frakt</li><li><Check /> 30 dagars nöjdhetsgaranti</li><li><Check /> Ingen betalning tas i detta test</li></ul>
      </aside>
    </div>
  </main>
}
