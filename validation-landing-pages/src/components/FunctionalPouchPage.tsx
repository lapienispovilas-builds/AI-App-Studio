import { useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import type { FunctionalPouchConfig } from '../functionalPouchConfig'
import { trackEveraEvent } from '../lib/posthogAnalytics'

export function FunctionalPouchPage({ config }: { config: FunctionalPouchConfig }) {
  const [flavor, setFlavor] = useState(config.flavors[0].name)

  useEffect(() => {
    document.documentElement.lang = 'sv'
    document.title = `${config.headline} | EVERA`
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.subheadline)
    trackEveraEvent('landing_page_viewed', { positioning: config.positioning }, `pouch_landing_${config.positioning}_${window.location.search}`)
  }, [config])

  const orderNow = (location: string) => {
    trackEveraEvent('buy_now_clicked', { positioning: config.positioning, cta_location: location, flavor })
    window.location.assign(`/coming-soon?source=${config.positioning}`)
  }

  return (
    <div className={`fp-page fp-page--${config.positioning}`} style={{ '--fp-accent': config.accent, '--fp-soft': config.accentSoft } as React.CSSProperties}>
      <div className="fp-announcement">FRI FRAKT VID LANSERING · 0 MG NIKOTIN</div>
      <header className="fp-nav"><a href="#top" className="fp-brand"><i />EVERA</a><nav><a href="#upplevelsen">Upplevelsen</a><a href="#produkt">Produkten</a><a href="#ingredienser">Ingredienser</a></nav><button onClick={() => orderNow('nav')}>BESTÄLL NU</button></header>

      <main id="top">
        <section className="fp-hero" style={{ backgroundImage: `url(${config.heroImage})` }}>
          <div className="fp-hero__shade" />
          <div className="fp-hero__copy"><p>{config.eyebrow}</p><h1>{config.headline}</h1><span>{config.subheadline}</span><button onClick={() => orderNow('hero')}>BESTÄLL NU <ArrowRight /></button><small>Första släppet kommer snart · Ingen betalning idag</small></div>
        </section>

        <section id="upplevelsen" className="fp-experience fp-wrap">
          <div className="fp-product-orbit"><div className="fp-single-product" role="img" aria-label={`EVERA ${config.flavors[0].name}`} style={{ backgroundImage: `url(${config.lineupImage})` }} /></div>
          <div><p className="fp-kicker">EVERA-UPPLEVELSEN</p><h2>{config.experienceTitle}</h2><p className="fp-intro">{config.experienceIntro}</p><div className="fp-benefit-list">{config.benefits.map((benefit, i) => <article key={benefit.title}><span>0{i + 1}</span><div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div></article>)}</div></div>
        </section>

        <section className="fp-story"><img src={config.lifestyleImage} alt="Svensk livsstil med EVERA" loading="lazy" /><div><p className="fp-kicker">GJORD FÖR DIN VARDAG</p><h2>{config.storyTitle}</h2><p>{config.storyCopy}</p><ul>{config.storyPoints.map(point => <li key={point}><Check />{point}</li>)}</ul></div></section>

        <section id="produkt" className="fp-offer fp-wrap"><div className="fp-section-head"><p className="fp-kicker">HITTA DIN SMAK</p><h2>En dosa. Tre sätt att göra den din.</h2></div><img className="fp-lineup" src={config.lineupImage} alt={`Tre smaker av EVERA ${config.positioning}`} loading="lazy" /><div className="fp-flavors">{config.flavors.map((item, i) => <button key={item.name} className={flavor === item.name ? 'is-active' : ''} onClick={() => setFlavor(item.name)}><span>0{i + 1}</span><strong>{item.name}</strong><em>{item.note}</em></button>)}</div><div className="fp-orderbar"><div><small>VALD SMAK</small><strong>{flavor}</strong><span>20 prillor · Första släppet snart</span></div><button onClick={() => orderNow('product')}>BESTÄLL NU <ArrowRight /></button></div></section>

        <section id="ingredienser" className="fp-formula"><div className="fp-wrap"><div className="fp-section-head"><p className="fp-kicker">VAD FINNS I?</p><h2>En tydlig formula. Inget hemligt “blend”.</h2></div><div className="fp-ingredients"><div className="fp-ingredients__head"><span>Ingrediens</span><span>Mängd</span><span>Varför den finns med</span></div>{config.ingredients.map(item => <div key={item.name}><strong>{item.name}</strong><b>{item.dose}</b><span>{item.why}</span></div>)}</div><button className="fp-dark-cta" onClick={() => orderNow('ingredients')}>BESTÄLL NU <ArrowRight /></button></div></section>

        <section className="fp-photo-break"><img src={config.lifestyleImage} alt="EVERA i en svensk vardag" loading="lazy" /><div><p>FUNKTION I ETT FORMAT SOM FÖLJER MED</p><h2>{config.finalTitle}</h2><button onClick={() => orderNow('final_photo')}>BESTÄLL NU <ArrowRight /></button></div></section>

      </main>

      <footer className="fp-footer"><div className="fp-footer__top"><a href="#top" className="fp-brand"><i />EVERA</a><p>Funktionella prillor för en modern svensk vardag.</p></div><div className="fp-footer__links"><div><strong>SHOPPA</strong><a href="#produkt">Smaker</a><a href="#ingredienser">Ingredienser</a></div><div><strong>HJÄLP</strong><a href="#">Kontakt</a><a href="#">FAQ</a><a href="#">Leverans & returer</a></div><div><strong>JURIDISKT</strong><a href="#">Integritetspolicy</a><a href="#">Köpvillkor</a><a href="#">Cookiepolicy</a></div></div><small>© 2026 EVERA · Koncept för marknadsvalidering</small></footer>
      <button className="fp-sticky" onClick={() => orderNow('mobile_sticky')}>BESTÄLL NU <ArrowRight /></button>
    </div>
  )
}
