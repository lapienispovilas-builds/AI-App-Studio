import { useEffect, useRef, useState } from 'react'
import { Activity, ArrowRight, Brain, BriefcaseBusiness, Check, ChevronDown, Clock3, Coffee, Eye, Gauge, Leaf, Plus, ShoppingBag, Zap } from 'lucide-react'
import type { FunctionalPouchConfig } from '../functionalPouchConfig'
import { trackEveraEvent } from '../lib/posthogAnalytics'
import { trackMetaEvent } from '../lib/metaPixel'
import { comingSoonUrl, experimentPositioning } from '../lib/pouchAttribution'

const pouchArtwork = {
  zyn: { width: 1672, height: 941, crops: ['100 150 540 620', '600 150 540 620', '1100 150 540 620'] },
  coffee: { width: 1672, height: 941, crops: ['30 170 560 620', '560 170 560 620', '1080 170 560 620'] },
  preworkout: { width: 1905, height: 825, crops: ['40 90 620 640', '650 90 640 640', '1260 90 640 640'] },
} as const

export function FunctionalPouchPage({ config }: { config: FunctionalPouchConfig }) {
  const [flavor, setFlavor] = useState<string | null>(null)
  const [strength, setStrength] = useState<'original' | 'strong'>('original')
  const [packSize, setPackSize] = useState<1 | 5>(5)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const navigationStarted = useRef(false)
  const analyticsPositioning = experimentPositioning(config.positioning)
  const selectedFlavorIndex = flavor ? Math.max(0, config.flavors.findIndex(item => item.name === flavor)) : 0
  const selectedArtwork = pouchArtwork[config.positioning]
  const benefitIcons = config.positioning === 'zyn' ? [Leaf, Zap, Eye] : config.positioning === 'coffee' ? [Brain, BriefcaseBusiness, Coffee] : [Gauge, Activity, Clock3]
  const faqs = [
    { question: 'Kan jag använda EVERA varje dag?', answer: 'Följ alltid den rekommenderade dagsdosen på förpackningen och räkna in koffein från kaffe, energidryck och andra källor. Produkten rekommenderas inte för barn, gravida, ammande eller personer som är känsliga för koffein. Rådgör med vården om du har ett medicinskt tillstånd eller använder läkemedel.' },
    { question: 'Hur använder jag en funktionell prilla?', answer: 'Placera en prilla under överläppen. Tugga eller svälj inte prillan. Ta ut den efter användning och släng den på ett lämpligt sätt.' },
    { question: 'Hur länge ska prillan vara inne?', answer: 'Använd den i upp till 30 minuter. Smak och ingredienser frigörs gradvis, och du kan ta ut prillan tidigare om det känns bättre.' },
    { question: 'Kan jag ta fler än den rekommenderade mängden?', answer: 'Nej. Överskrid inte dagsdosen på förpackningen och var uppmärksam på ditt totala koffeinintag under dagen.' },
    { question: 'Innehåller EVERA nikotin?', answer: 'Nej. Samtliga EVERA-prillor i den här serien innehåller 0 mg nikotin.' },
    { question: 'När märker jag effekten?', answer: 'Det varierar mellan personer och påverkas bland annat av koffeinkänslighet, mat och övrigt koffeinintag. Använd produkten enligt anvisningarna och utvärdera hur den passar dig.' },
    { question: 'Kan prillan irritera tandköttet?', answer: 'Vissa kan uppleva lokal irritation, särskilt i början. Variera placeringen och sluta använda produkten om obehaget kvarstår.' },
  ]

  useEffect(() => {
    document.documentElement.lang = 'sv'
    document.title = `${config.headline} | EVERA`
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.subheadline)
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.head.appendChild(document.createElement('meta'))
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
  }, [analyticsPositioning, config])

  useEffect(() => {
    const updateStickyCta = () => {
      const productSection = document.getElementById('produkt')
      setShowStickyCta(Boolean(productSection && productSection.getBoundingClientRect().bottom <= 0))
    }

    updateStickyCta()
    window.addEventListener('scroll', updateStickyCta, { passive: true })
    window.addEventListener('resize', updateStickyCta)
    return () => {
      window.removeEventListener('scroll', updateStickyCta)
      window.removeEventListener('resize', updateStickyCta)
    }
  }, [])

  const orderNow = (location: string) => {
    if (navigationStarted.current) return
    navigationStarted.current = true
    const destination = comingSoonUrl(analyticsPositioning)
    trackEveraEvent('buy_now_clicked', { positioning: analyticsPositioning, cta_location: location, flavor: flavor ?? config.flavors[0].name, strength, pack_size: packSize })
    trackMetaEvent('BuyNowClicked', { positioning: analyticsPositioning, page_path: window.location.pathname }, { custom: true })
    window.setTimeout(() => window.location.assign(destination), 80)
  }

  return (
    <div className={`fp-page fp-page--${config.positioning}`} style={{ '--fp-accent': config.accent, '--fp-soft': config.accentSoft } as React.CSSProperties}>
      <div className="fp-announcement">FRI FRAKT PÅ 5-PACK · 0 MG NIKOTIN</div>
      <header className="fp-nav"><a href="#top" className="fp-brand"><i />EVERA</a><nav><details className="fp-nav-shop"><summary>KÖP NU <ChevronDown /></summary><div className="fp-nav-flavors"><img src={config.lineupImage} alt="" aria-hidden="true" />{config.flavors.map(item => <button key={item.name} onClick={(event) => { setFlavor(item.name); (event.currentTarget.closest('details') as HTMLDetailsElement).open = false; document.getElementById('produkt')?.scrollIntoView({ behavior: 'smooth' }) }}><strong>{item.name}</strong></button>)}</div></details><a href="#formula" onClick={(event) => { const menu = event.currentTarget.closest('header')?.querySelector('.fp-nav-shop') as HTMLDetailsElement | null; if (menu) menu.open = false }}>INGREDIENSER</a><a href="#faq" onClick={(event) => { const menu = event.currentTarget.closest('header')?.querySelector('.fp-nav-shop') as HTMLDetailsElement | null; if (menu) menu.open = false }}>FAQ</a></nav><button className="fp-cart" onClick={() => orderNow('nav_cart')}><ShoppingBag /> VARUKORG</button></header>

      <main id="top">
        <section className="fp-hero" style={{ '--fp-hero-desktop': `url(${config.heroImage})`, '--fp-hero-mobile': `url(${config.mobileHeroImage})` } as React.CSSProperties}>
          <div className="fp-hero__shade" />
          <div className="fp-hero__copy"><p>{config.eyebrow}</p><h1>{config.headline}</h1><span>{config.subheadline}</span><button onClick={() => orderNow('hero')}>LÄGG I VARUKORG <ArrowRight /></button></div>
        </section>

        <section id="upplevelsen" className="fp-experience fp-wrap">
          <div className="fp-product-orbit"><div className="fp-floating-puck" role="img" aria-label={`EVERA ${config.flavors[0].name}`} style={{ backgroundImage: `url(${config.lineupImage})` }} /></div>
          <div><p className="fp-kicker">EVERA-UPPLEVELSEN</p><h2>{config.experienceTitle}</h2><p className="fp-intro">{config.experienceIntro}</p><div className="fp-benefit-list">{config.benefits.map((benefit, i) => { const Icon = benefitIcons[i]; return <article key={benefit.title}><span><Icon /></span><div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div></article> })}</div></div>
        </section>

        <section id="produkt" className="fp-product-buy fp-wrap">
          <div className="fp-product-buy__visual">{flavor ? <svg className="fp-selected-flavor" viewBox={selectedArtwork.crops[selectedFlavorIndex]} role="img" aria-label={`EVERA ${flavor}`} preserveAspectRatio="xMidYMid meet"><image href={config.lineupImage} width={selectedArtwork.width} height={selectedArtwork.height} /></svg> : <img className="fp-product-lineup" src={config.lineupImage} alt={`Alla tre smaker av EVERA ${config.positioning === 'zyn' ? 'RITUAL' : config.positioning === 'coffee' ? 'FOKUS' : 'MOVE'}`} />}</div>
          <div className="fp-product-buy__panel">
            <p className="fp-kicker">EVERA FUNCTIONAL POUCHES</p>
            <h2>EVERA {config.positioning === 'zyn' ? 'RITUAL' : config.positioning === 'coffee' ? 'FOKUS' : 'MOVE'}</h2>
            <p className="fp-buy-lead">Funktionella prillor i ett diskret format. Välj smak, styrka och antal.</p>

            <fieldset><legend>SMAK</legend><div className="fp-choice-row fp-choice-row--flavors">{config.flavors.map(item => <button type="button" key={item.name} className={flavor === item.name ? 'is-active' : ''} onClick={() => setFlavor(item.name)}><i style={{ background: item.name.includes('Berry') ? '#b65778' : item.name.includes('Mint') || item.name.includes('Spearmint') ? '#769b91' : '#d2a755' }} />{item.name}</button>)}</div></fieldset>
            <fieldset><legend>STYRKA</legend><div className="fp-choice-row"><button type="button" className={strength === 'original' ? 'is-active' : ''} onClick={() => setStrength('original')}>ORIGINAL</button><button type="button" className={strength === 'strong' ? 'is-active' : ''} onClick={() => setStrength('strong')}>STARK · 15 % STARKARE</button></div></fieldset>
            <fieldset><legend>VÄLJ PAKET</legend><div className="fp-pack-grid"><button type="button" className={packSize === 5 ? 'is-active' : ''} onClick={() => setPackSize(5)}><span>MEST VÄRDE</span><strong>5-PACK</strong><b>199 kr</b><small>39,80 kr / dosa · spara 33 %</small></button><button type="button" className={packSize === 1 ? 'is-active' : ''} onClick={() => setPackSize(1)}><strong>1-PACK</strong><b>59 kr</b><small>59 kr / dosa</small></button></div></fieldset>

            <div className="fp-purchase-summary"><div><strong>{packSize}-PACK EVERA</strong><span>{flavor ?? 'Välj smak'} · {strength === 'strong' ? 'Stark' : 'Original'}</span></div><b>{packSize === 5 ? '199 kr' : '59 kr'}</b></div>
            <button className="fp-add-cart" onClick={() => orderNow('product')}>LÄGG I VARUKORG <ArrowRight /></button>
            <p className="fp-shipping-note">Fri frakt på 5-pack · 20 prillor per dosa</p>
            <div className="fp-product-details">
              <details><summary>SÅ ANVÄNDER DU <ChevronDown /></summary><p>Placera en prilla under överläppen när dagen kräver fokus eller energi. Använd i upp till 30 minuter. Överskrid inte den rekommenderade dagsdosen på förpackningen.</p></details>
              <details id="ingredienser"><summary>FULLSTÄNDIGA INGREDIENSER <ChevronDown /></summary><div>{config.ingredients.map(item => <p key={item.name}><strong>{item.name}:</strong> {item.dose} – {item.why}</p>)}</div></details>
            </div>
          </div>
        </section>

        <section className="fp-story"><img src={config.lifestyleImage} alt="Svensk livsstil med EVERA" loading="lazy" /><div><p className="fp-kicker">GJORD FÖR DIN VARDAG</p><h2>{config.storyTitle}</h2><p>{config.storyCopy}</p><ul>{config.storyPoints.map(point => <li key={point}><Check />{point}</li>)}</ul></div></section>

        <section id="formula" className="fp-formula-cards"><div className="fp-formula-heading"><p>VAD FINNS I?</p><h2>Formulan</h2><span>Utvalda ingredienser för varje EVERA-positionering. Mängd per prilla:</span></div><div className="fp-formula-grid">{config.ingredients.map((item, index) => <article key={item.name}><div><b>{item.dose}</b><span>0{index + 1}</span></div><h3>{item.name}</h3><p>{item.why}</p></article>)}</div></section>

        <section className="fp-photo-break fp-risk-free"><img src={config.secondaryImage} alt="EVERA i en svensk vardag" loading="lazy" /><div><h2>PROVA RISKFRITT</h2><p>30 DAGARS NÖJDHETSGARANTI</p><button onClick={() => orderNow('final_photo')}>PROVA NU <ArrowRight /></button></div></section>

        <section id="faq" className="fp-faq fp-wrap"><div className="fp-faq__heading"><p>VILL DU VETA MER?</p><h2>Vanliga frågor</h2><span>Det viktigaste om användning, koffein och nikotininnehåll.</span></div><div className="fp-faq__list">{faqs.map(item => <details key={item.question}><summary>{item.question}<Plus /></summary><p>{item.answer}</p></details>)}</div></section>

      </main>

      <footer className="fp-footer"><div className="fp-footer__top"><a href="#top" className="fp-brand"><i />EVERA</a><p>Funktionella prillor för en modern svensk vardag.</p></div><div className="fp-footer__links"><div><strong>SHOPPA</strong><a href="#produkt">Smaker</a><a href="#formula">Ingredienser</a></div><div><strong>HJÄLP</strong><a href="#faq">FAQ</a></div></div><small>© 2026 EVERA · Koncept för marknadsvalidering</small></footer>
      <button className={`fp-sticky${showStickyCta ? ' is-visible' : ''}`} onClick={() => orderNow('mobile_sticky')} aria-hidden={!showStickyCta} tabIndex={showStickyCta ? 0 : -1}>LÄGG I VARUKORG <ArrowRight /></button>
    </div>
  )
}
