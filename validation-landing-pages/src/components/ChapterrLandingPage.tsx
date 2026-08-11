import { ArrowRight, Compass, Map, MessageCircle, Route, Send, Sparkles, UserRoundSearch, UsersRound } from 'lucide-react'
import type { ChapterrLandingPageConfig } from '../chapterrLandingPageConfig'

const recognitionIcons = [Sparkles, Compass, UsersRound, Route, Map, UserRoundSearch]

function highlightHeroHeadline(headline: string) {
  const oldCircle = 'your old circle'
  const newCircle = 'your new one yet'
  const oldIndex = headline.indexOf(oldCircle)
  const newIndex = headline.indexOf(newCircle)

  if (oldIndex === -1 || newIndex === -1) return headline

  return <>{headline.slice(0, oldIndex)}<span className="chapterr-highlight chapterr-highlight--old">{oldCircle}</span>{headline.slice(oldIndex + oldCircle.length, newIndex)}<span className="chapterr-highlight chapterr-highlight--new">{newCircle}</span>{headline.slice(newIndex + newCircle.length)}</>
}

function typeformHref(typeformUrl: string) {
  const query = window.location.search.replace(/^\?/, '')
  return query ? `${typeformUrl}?${query}` : typeformUrl
}

export function ChapterrLandingPage({ config }: { config: ChapterrLandingPageConfig }) {
  const waitlistUrl = typeformHref(config.typeformUrl)

  return (
    <main className="chapterr-page">
      <header className="chapterr-header">
        <a className="chapterr-wordmark" href={`/${config.slug}`} aria-label={`${config.brand} home`}>
          <img src="/chapterr/chapterr-logo.png" alt="" />{config.brand}
        </a>
      </header>

      <section className="chapterr-hero">
        <div className="chapterr-hero__copy">
          <p className="chapterr-kicker">For the chapter between who you were and who you're becoming</p>
          <h1>{highlightHeroHeadline(config.headline)}</h1>
          <p className="chapterr-hero__subtitle">{config.subtitle}</p>
          <a className="chapterr-button" href={waitlistUrl}>{config.heroCta}<ArrowRight size={19} /></a>
        </div>

        <div className="chapterr-people" aria-label="People finding connection during different chapters of life">
          <img className="chapterr-lifestyle chapterr-lifestyle--main" src="/chapterr/chapterr-community-hero.png" alt="Three new peers sharing ideas around a table" />
          <img className="chapterr-lifestyle chapterr-lifestyle--one" src="/testimonial-avatars/jonathan.jpg" alt="A founder beginning a new chapter" />
          <img className="chapterr-lifestyle chapterr-lifestyle--two" src="/testimonial-avatars/jemima.jpg" alt="A person changing direction in life" />
          <div className="chapterr-chapter-card chapterr-chapter-card--one"><Route size={17} /><span><small>Current chapter</small><strong>Building something new</strong></span></div>
          <div className="chapterr-chapter-card chapterr-chapter-card--two"><Send size={17} /><span><small>New connection</small><strong>Someone who gets it</strong></span></div>
          <div className="chapterr-connection"><UsersRound size={22} /><span><strong>Quit his job to build his own company.</strong><small>A conversation worth starting</small></span></div>
        </div>
      </section>

      <section className="chapterr-recognition">
        <div className="chapterr-section-heading">
          <p className="chapterr-kicker">Does this feel familiar?</p>
          <h2>{config.recognitionTitle}</h2>
        </div>
        <div className="chapterr-recognition__grid">
          {config.recognitionCards.map((card, index) => {
            const Icon = recognitionIcons[index]
            return <article key={card}><span><Icon size={21} /></span><p>{card}</p></article>
          })}
        </div>
      </section>

      <section className="chapterr-concept">
        <div className="chapterr-concept__visual" aria-hidden="true">
          <span>Building</span><span>Changing direction</span><span>Starting again</span>
          <div><MessageCircle size={25} /></div>
        </div>
        <div className="chapterr-concept__copy">
          <p className="chapterr-kicker">Meet people where you are now</p>
          <h2>A circle shaped around your current chapter.</h2>
          <p>{config.concept}</p>
        </div>
      </section>

      <section className="chapterr-how">
        <div className="chapterr-section-heading">
          <p className="chapterr-kicker">How it works</p>
          <h2>Less networking. More recognition.</h2>
        </div>
        <div className="chapterr-steps">
          {config.steps.map((step, index) => (
            <article key={step}><span className="chapterr-step-number">{index + 1}</span><h3>{step}</h3><div className="chapterr-step-arrow" aria-hidden="true"><ArrowRight size={18} /></div></article>
          ))}
        </div>
      </section>

      <section className="chapterr-final">
        <p className="chapterr-kicker">A new circle can start with one conversation</p>
        <h2>{config.finalHeadline}</h2>
        <a className="chapterr-button chapterr-button--light" href={waitlistUrl}>{config.finalCta}<ArrowRight size={19} /></a>
      </section>

      <footer className="chapterr-footer">
        <span className="chapterr-wordmark"><img src="/chapterr/chapterr-logo.png" alt="" />{config.brand}</span>
        <div className="chapterr-footer__legal" aria-label="Legal information"><span>Privacy Statement</span><span>Terms and Conditions</span><span>DMCA Policy</span><span>Do Not Sell My Info</span></div>
      </footer>
    </main>
  )
}
