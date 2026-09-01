import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { functionalPouchPages } from '../functionalPouchConfig'
import { trackMetaEvent } from '../lib/metaPixel'
import { trackEveraEvent, trackEveraPageView } from '../lib/posthogAnalytics'
import { analyticsOfferProperties, comingSoonUrl, normalizePurchaseType, offerPrice, slugifyFlavor, type ExperimentPositioning, type PouchOffer, type PouchPackage, type PurchaseType } from '../lib/pouchAttribution'
import { PouchComingSoonPage } from './PouchComingSoonPage'

type CheckoutDetails = {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
}

type CheckoutField = keyof CheckoutDetails

const fieldErrors: Record<CheckoutField, string> = {
  email: 'Ange en giltig e-postadress.',
  firstName: 'Ange ditt förnamn.',
  lastName: 'Ange ditt efternamn.',
  address: 'Ange din leveransadress.',
  city: 'Ange din stad.',
  postalCode: 'Ange ett giltigt svenskt postnummer.',
  country: 'Välj land.',
}

const sourcePaths: Record<ExperimentPositioning, string> = {
  coffee: '/coffee',
  zyn: '/zyn-alternative',
  energy: '/energy',
}

const checkoutPackshots = {
  zyn: '/functional-pouch/checkout/evera-ritual.png',
  coffee: '/functional-pouch/checkout/evera-fokus.png',
  energy: '/functional-pouch/checkout/evera-move.png',
} as const

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
  const [touched, setTouched] = useState<Partial<Record<CheckoutField, boolean>>>({})
  const [showReveal, setShowReveal] = useState(false)
  const detailsTracked = useRef(false)
  const submitting = useRef(false)
  const fieldValid: Record<CheckoutField, boolean> = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()),
    firstName: details.firstName.trim().length >= 2,
    lastName: details.lastName.trim().length >= 2,
    address: details.address.trim().length >= 4,
    city: details.city.trim().length >= 2,
    postalCode: /^\d{3}\s?\d{2}$/.test(details.postalCode.trim()),
    country: details.country === 'Sverige',
  }
  const detailsValid = Object.values(fieldValid).every(Boolean)

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
  const touch = (key: CheckoutField) => setTouched(current => ({ ...current, [key]: true }))
  const inputState = (key: CheckoutField) => ({
    'aria-invalid': touched[key] && !fieldValid[key] ? true : undefined,
    'aria-describedby': touched[key] && !fieldValid[key] ? `${key}-error` : undefined,
    onBlur: () => touch(key),
  })
  const errorFor = (key: CheckoutField) => touched[key] && !fieldValid[key] ? <small className="pouch-checkout__error" id={`${key}-error`}>{fieldErrors[key]}</small> : null

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
    const revealUrl = comingSoonUrl(offer, true)
    window.history.replaceState({}, '', revealUrl)
    trackEveraPageView('/coming-soon')
    setShowReveal(true)
  }

  const purchaseLabel = offer.purchase_type === 'subscription' ? 'Prenumerera & spara 15 %' : 'Engångsköp'
  const packshot = checkoutPackshots[offer.positioning]

  if (showReveal) return <PouchComingSoonPage initialEmail={details.email.trim()} completedOrderIntentOverride />

  return <main className="pouch-checkout">
    <header className="pouch-checkout__header"><a href={sourcePaths[offer.positioning]}><ArrowLeft /> TILLBAKA</a><strong>EVERA</strong><span><LockKeyhole /> SÄKER KASSA</span></header>
    <div className="pouch-checkout__layout">
      <form className="pouch-checkout__form" onSubmit={completeOrder} noValidate>
        <section>
          <p className="pouch-checkout__step">01 · KONTAKT</p>
          <h1>Slutför din beställning</h1>
          <label><span>E-post</span><input type="email" inputMode="email" autoComplete="email" value={details.email} onChange={event => update('email', event.target.value)} placeholder="du@exempel.se" required {...inputState('email')} />{errorFor('email')}</label>
        </section>

        <section>
          <p className="pouch-checkout__step">02 · LEVERANS</p>
          <h2>Leveransuppgifter</h2>
          <div className="pouch-checkout__two"><label><span>Förnamn</span><input autoComplete="given-name" value={details.firstName} onChange={event => update('firstName', event.target.value)} required {...inputState('firstName')} />{errorFor('firstName')}</label><label><span>Efternamn</span><input autoComplete="family-name" value={details.lastName} onChange={event => update('lastName', event.target.value)} required {...inputState('lastName')} />{errorFor('lastName')}</label></div>
          <label><span>Adress</span><input autoComplete="street-address" value={details.address} onChange={event => update('address', event.target.value)} required {...inputState('address')} />{errorFor('address')}</label>
          <div className="pouch-checkout__two"><label><span>Postnummer</span><input inputMode="numeric" autoComplete="postal-code" value={details.postalCode} onChange={event => update('postalCode', event.target.value)} placeholder="123 45" required {...inputState('postalCode')} />{errorFor('postalCode')}</label><label><span>Stad</span><input autoComplete="address-level2" value={details.city} onChange={event => update('city', event.target.value)} required {...inputState('city')} />{errorFor('city')}</label></div>
          <label><span>Land</span><select autoComplete="country-name" value={details.country} onChange={event => update('country', event.target.value)} {...inputState('country')}><option>Sverige</option></select>{errorFor('country')}</label>
        </section>

        <section className="pouch-checkout__review">
          <p className="pouch-checkout__step">03 · BESTÄLLNING</p>
          <h2>Slutlig översikt</h2>
          <div><span>{offer.package.toUpperCase()} · {offer.flavor}</span><span>{purchaseLabel}</span><strong>{offer.price} kr</strong></div>
          <button className="pouch-checkout__complete" disabled={!detailsValid} type="submit">SLUTFÖR BESTÄLLNING — {offer.price} kr <ArrowRight /></button>
        </section>
      </form>

      <aside className="pouch-checkout__summary">
        <p>DIN BESTÄLLNING</p><h2>EVERA</h2>
        <div className="pouch-checkout__item"><img className="pouch-checkout__packshot" src={packshot} alt={`EVERA ${offer.positioning === 'zyn' ? 'RITUAL' : offer.positioning === 'coffee' ? 'FOKUS' : 'MOVE'}`} /><div><strong>{offer.package.toUpperCase()}</strong><span>{offer.flavor}</span><span>{offer.strength === 'strong' ? 'Stark · 15 % starkare' : 'Original'}</span><span>{purchaseLabel}</span></div><b>{offer.price} kr</b></div>
        <dl><div><dt>Delsumma</dt><dd>{offer.price} kr</dd></div><div><dt>Frakt</dt><dd>GRATIS</dd></div><div><dt>Totalt</dt><dd>{offer.price} kr</dd></div></dl>
        <ul><li><Check /> Fri frakt</li><li><Check /> 30 dagars nöjdhetsgaranti</li></ul>
      </aside>
    </div>
  </main>
}
