import { useEffect } from 'react'
import { ArrowRight, Check, Package, Sparkles, Zap } from 'lucide-react'
import type { FunctionalPouchConfig } from '../functionalPouchConfig'
import { trackEveraEvent } from '../lib/posthogAnalytics'

function ProductMockup({ config }: { config: FunctionalPouchConfig }) {
  return (
    <div
      className={`pouch-product pouch-product--${config.positioning}`}
      role="img"
      aria-label={`EVERA ${config.productLabel} functional pouch product`}
    />
  )
}

export function FunctionalPouchPage({ config }: { config: FunctionalPouchConfig }) {
  useEffect(() => {
    document.title = `${config.headline} | EVERA SHIFT`
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.subheadline)
    trackEveraEvent('landing_page_viewed', { positioning: config.positioning }, `pouch_landing_${config.positioning}_${window.location.search}`)
  }, [config])

  const buyNow = (location: string) => {
    trackEveraEvent('buy_now_clicked', { positioning: config.positioning, cta_location: location })
    window.location.assign(`/coming-soon?source=${config.positioning}`)
  }

  return (
    <div className={`pouch-page pouch-page--${config.positioning}`} style={{ '--pouch-accent': config.accent, '--pouch-soft': config.accentSoft } as React.CSSProperties}>
      <header className="pouch-nav"><a href="#top" className="pouch-logo">EVERA <b>SHIFT</b></a><span>NICOTINE FREE</span><button onClick={() => buyNow('nav')}>BUY NOW</button></header>
      <main id="top">
        <section className="pouch-hero">
          <div className="pouch-hero__copy"><p className="pouch-kicker">{config.eyebrow}</p><h1>{config.headline}</h1><p className="pouch-lead">{config.subheadline}</p><button className="pouch-cta" onClick={() => buyNow('hero')}>BUY NOW <ArrowRight /></button><small>First batch coming soon · No payment taken today</small></div>
          <ProductMockup config={config} />
        </section>

        <section className="pouch-strip" aria-label="Product highlights"><span>0 MG NICOTINE</span><span>POCKET READY</span><span>FUNCTIONAL FOCUS</span><span>NO SMOKE OR VAPOR</span></section>

        <section className="pouch-section pouch-benefits"><div className="pouch-heading"><p className="pouch-kicker">A smaller ritual</p><h2>Everything you need. Nothing you don’t.</h2></div><div className="pouch-grid">{config.benefits.map((benefit, index) => <article key={benefit.title}><i>{[<Zap />, <Package />, <Sparkles />, <Check />][index]}</i><h3>{benefit.title}</h3><p>{benefit.copy}</p></article>)}</div></section>

        <section className="pouch-mid-cta"><p>ENERGY + FOCUS · ZERO NICOTINE</p><h2>{config.headline}</h2><button className="pouch-cta pouch-cta--light" onClick={() => buyNow('middle')}>BUY NOW <ArrowRight /></button></section>

        <section className="pouch-section pouch-how"><div><p className="pouch-kicker">How it works</p><h2>Open. Place. Get on with it.</h2><p>Take one soft pouch, place it under your upper lip, and use it when you want a convenient focus or energy moment. No drink, smoke, or vapor.</p></div><ol><li><b>01</b><span><strong>Open</strong>Pop the pocket-sized tin.</span></li><li><b>02</b><span><strong>Place</strong>Tuck one pouch under your lip.</span></li><li><b>03</b><span><strong>Shift</strong>Carry on with your day.</span></li></ol></section>

        <section className="pouch-section pouch-use"><div className="pouch-heading"><p className="pouch-kicker">Made for real life</p><h2>One tin. More options.</h2></div><div>{config.useCases.map((item, index) => <article key={item}><span>0{index + 1}</span><strong>{item}</strong></article>)}</div></section>

        <section className="pouch-section pouch-compare"><div className="pouch-heading"><p className="pouch-kicker">A simple switch</p><h2>{config.alternative} vs. EVERA SHIFT</h2></div><div className="pouch-compare__table"><div className="pouch-compare__head"><span>{config.alternative}</span><strong>EVERA SHIFT</strong></div>{config.comparison.map(row => <div className="pouch-compare__row" key={row.alternative}><span>{row.alternative}</span><strong><Check />{row.evera}</strong></div>)}</div></section>

        <section className="pouch-section pouch-faq"><div className="pouch-heading"><p className="pouch-kicker">Good to know</p><h2>Questions, answered.</h2></div><div>{config.faq.map(item => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div></section>

        <section className="pouch-final"><p className="pouch-kicker">The first drop is coming</p><h2>Ready to make the shift?</h2><p>Be first in line for EVERA SHIFT.</p><button className="pouch-cta pouch-cta--light" onClick={() => buyNow('final')}>BUY NOW <ArrowRight /></button><small>No payment taken today</small></section>
      </main>
      <footer className="pouch-footer"><span>EVERA SHIFT</span><small>© 2026 EVERA · Functional pouch concept</small></footer>
      <button className="pouch-sticky" onClick={() => buyNow('mobile_sticky')}>BUY NOW <ArrowRight /></button>
    </div>
  )
}
