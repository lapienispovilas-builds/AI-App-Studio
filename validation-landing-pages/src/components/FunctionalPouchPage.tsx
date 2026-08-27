import { useEffect, useState } from 'react'
import { Activity, ArrowRight, Brain, BriefcaseBusiness, Check, ChevronDown, Clock3, Coffee, Eye, Gauge, Leaf, Zap } from 'lucide-react'
import type { FunctionalPouchConfig } from '../functionalPouchConfig'
import { trackEveraEvent } from '../lib/posthogAnalytics'

export function FunctionalPouchPage({ config }: { config: FunctionalPouchConfig }) {
  const [flavor, setFlavor] = useState(config.flavors[0].name)
  const [strength, setStrength] = useState<'original' | 'strong'>('original')
  const [packSize, setPackSize] = useState<1 | 5>(5)
  const benefitIcons = config.positioning === 'zyn' ? [Leaf, Zap, Eye] : config.positioning === 'coffee' ? [Brain, BriefcaseBusiness, Coffee] : [Gauge, Activity, Clock3]

  useEffect(() => {
    document.documentElement.lang = 'sv'
    document.title = `${config.headline} | EVERA`
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.subheadline)
    trackEveraEvent('landing_page_viewed', { positioning: config.positioning }, `pouch_landing_${config.positioning}_${window.location.search}`)
  }, [config])

  const orderNow = (location: string) => {
    trackEveraEvent('buy_now_clicked', { positioning: config.positioning, cta_location: location, flavor, strength, pack_size: packSize })
    window.location.assign(`/coming-soon?source=${config.positioning}`)
  }

  return (
    <div className={`fp-page fp-page--${config.positioning}`} style={{ '--fp-accent': config.accent, '--fp-soft': config.accentSoft } as React.CSSProperties}>
      <div className="fp-announcement">FRI FRAKT PÅ 5-PACK · 0 MG NIKOTIN</div>
      <header className="fp-nav"><a href="#top" className="fp-brand"><i />EVERA</a><nav><a href="#upplevelsen">Upplevelsen</a><a href="#produkt">Produkten</a><a href="#ingredienser">Ingredienser</a></nav><button onClick={() => orderNow('nav')}>LÄGG I VARUKORG</button></header>

      <main id="top">
        <section className="fp-hero" style={{ '--fp-hero-desktop': `url(${config.heroImage})`, '--fp-hero-mobile': `url(${config.mobileHeroImage})` } as React.CSSProperties}>
          <div className="fp-hero__shade" />
          <div className="fp-hero__copy"><p>{config.eyebrow}</p><h1>{config.headline}</h1><span>{config.subheadline}</span><button onClick={() => orderNow('hero')}>LÄGG I VARUKORG <ArrowRight /></button></div>
        </section>

        <section id="upplevelsen" className="fp-experience fp-wrap">
          <div className="fp-product-orbit"><div className="fp-floating-puck" role="img" aria-label={`EVERA ${config.flavors[0].name}`} style={{ backgroundImage: `url(${config.lineupImage})` }} /></div>
          <div><p className="fp-kicker">EVERA-UPPLEVELSEN</p><h2>{config.experienceTitle}</h2><p className="fp-intro">{config.experienceIntro}</p><div className="fp-benefit-list">{config.benefits.map((benefit, i) => { const Icon = benefitIcons[i]; return <article key={benefit.title}><span><Icon /></span><div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div></article> })}</div></div>
        </section>

        <section className="fp-story"><img src={config.lifestyleImage} alt="Svensk livsstil med EVERA" loading="lazy" /><div><p className="fp-kicker">GJORD FÖR DIN VARDAG</p><h2>{config.storyTitle}</h2><p>{config.storyCopy}</p><ul>{config.storyPoints.map(point => <li key={point}><Check />{point}</li>)}</ul></div></section>

        <section id="produkt" className="fp-product-buy fp-wrap">
          <div className="fp-product-buy__visual"><div className="fp-lineup-selector" aria-label={`Tre smaker av EVERA ${config.positioning}`}>{config.flavors.map((item, index) => <div key={item.name} className={flavor === item.name ? 'is-selected' : ''}><span role="img" aria-label={item.name} style={{ backgroundImage: `url(${config.lineupImage})`, backgroundPosition: `${index * 50}% center` }} /></div>)}</div></div>
          <div className="fp-product-buy__panel">
            <p className="fp-kicker">EVERA FUNCTIONAL POUCHES</p>
            <h2>EVERA {config.positioning === 'zyn' ? 'RITUAL' : config.positioning === 'coffee' ? 'FOKUS' : 'MOVE'}</h2>
            <p className="fp-buy-lead">Funktionella prillor i ett diskret format. Välj smak, styrka och antal.</p>

            <fieldset><legend>SMAK</legend><div className="fp-choice-row fp-choice-row--flavors">{config.flavors.map(item => <button type="button" key={item.name} className={flavor === item.name ? 'is-active' : ''} onClick={() => setFlavor(item.name)}><i style={{ background: item.name.includes('Berry') ? '#b65778' : item.name.includes('Mint') || item.name.includes('Spearmint') ? '#769b91' : '#d2a755' }} />{item.name}</button>)}</div></fieldset>
            <fieldset><legend>STYRKA</legend><div className="fp-choice-row"><button type="button" className={strength === 'original' ? 'is-active' : ''} onClick={() => setStrength('original')}>ORIGINAL</button><button type="button" className={strength === 'strong' ? 'is-active' : ''} onClick={() => setStrength('strong')}>STARK · 15 % STARKARE</button></div></fieldset>
            <fieldset><legend>VÄLJ PAKET</legend><div className="fp-pack-grid"><button type="button" className={packSize === 5 ? 'is-active' : ''} onClick={() => setPackSize(5)}><span>MEST VÄRDE</span><strong>5-PACK</strong><b>199 kr</b><small>39,80 kr / dosa · spara 33 %</small></button><button type="button" className={packSize === 1 ? 'is-active' : ''} onClick={() => setPackSize(1)}><strong>1-PACK</strong><b>59 kr</b><small>59 kr / dosa</small></button></div></fieldset>

            <div className="fp-purchase-summary"><div><strong>{packSize}-PACK EVERA</strong><span>{flavor} · {strength === 'strong' ? 'Stark' : 'Original'}</span></div><b>{packSize === 5 ? '199 kr' : '59 kr'}</b></div>
            <button className="fp-add-cart" onClick={() => orderNow('product')}>LÄGG I VARUKORG <ArrowRight /></button>
            <p className="fp-shipping-note">Fri frakt på 5-pack · 20 prillor per dosa</p>
            <div className="fp-product-details">
              <details><summary>SÅ ANVÄNDER DU <ChevronDown /></summary><p>Placera en prilla under överläppen när dagen kräver fokus eller energi. Använd i upp till 30 minuter. Överskrid inte den rekommenderade dagsdosen på förpackningen.</p></details>
              <details id="ingredienser"><summary>FULLSTÄNDIGA INGREDIENSER <ChevronDown /></summary><div>{config.ingredients.map(item => <p key={item.name}><strong>{item.name}:</strong> {item.dose} – {item.why}</p>)}</div></details>
            </div>
          </div>
        </section>

        <section className="fp-photo-break fp-risk-free"><img src={config.secondaryImage} alt="EVERA i en svensk vardag" loading="lazy" /><div><h2>TRY RISK FREE</h2><p>30-DAY SATISFACTION GUARANTEE</p><button onClick={() => orderNow('final_photo')}>TRY IT NOW <ArrowRight /></button></div></section>

      </main>

      <footer className="fp-footer"><div className="fp-footer__top"><a href="#top" className="fp-brand"><i />EVERA</a><p>Funktionella prillor för en modern svensk vardag.</p></div><div className="fp-footer__links"><div><strong>SHOPPA</strong><a href="#produkt">Smaker</a><a href="#ingredienser">Ingredienser</a></div><div><strong>HJÄLP</strong><a href="#">Kontakt</a><a href="#">FAQ</a><a href="#">Leverans & returer</a></div><div><strong>JURIDISKT</strong><a href="#">Integritetspolicy</a><a href="#">Köpvillkor</a><a href="#">Cookiepolicy</a></div></div><small>© 2026 EVERA · Koncept för marknadsvalidering</small></footer>
      <button className="fp-sticky" onClick={() => orderNow('mobile_sticky')}>LÄGG I VARUKORG <ArrowRight /></button>
    </div>
  )
}
