import { ArrowRight, Compass, MessageCircle, Sparkles, UsersRound } from 'lucide-react'
import type { ChapterrLandingPageConfig } from '../chapterrLandingPageConfig'

const recognitionIcons = [Sparkles, Compass, UsersRound, MessageCircle]

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
          <span aria-hidden="true">C</span>{config.brand}
        </a>
      </header>

      <section className="chapterr-hero">
        <div className="chapterr-hero__copy">
          <p className="chapterr-kicker">For the chapter between who you were and who you're becoming</p>
          <h1>{config.headline}</h1>
          <p className="chapterr-hero__subtitle">{config.subtitle}</p>
          <a className="chapterr-button" href={waitlistUrl}>{config.heroCta}<ArrowRight size={19} /></a>
        </div>

        <div className="chapterr-people" aria-label="A warm community of people in new chapters of life">
          <div className="chapterr-orbit chapterr-orbit--one" />
          <div className="chapterr-orbit chapterr-orbit--two" />
          <div className="chapterr-person chapterr-person--one"><span /></div>
          <div className="chapterr-person chapterr-person--two"><span /></div>
          <div className="chapterr-person chapterr-person--three"><span /></div>
          <div className="chapterr-connection"><UsersRound size={22} /><strong>Similar chapter</strong><small>A conversation worth starting</small></div>
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
            <article key={step}><span>0{index + 1}</span><h3>{step}</h3><div aria-hidden="true"><ArrowRight size={18} /></div></article>
          ))}
        </div>
      </section>

      <section className="chapterr-final">
        <p className="chapterr-kicker">A new circle can start with one conversation</p>
        <h2>{config.finalHeadline}</h2>
        <a className="chapterr-button chapterr-button--light" href={waitlistUrl}>{config.finalCta}<ArrowRight size={19} /></a>
      </section>

      <footer className="chapterr-footer"><span className="chapterr-wordmark"><i aria-hidden="true">C</i>{config.brand}</span><small>Made for life's in-between chapters.</small></footer>
    </main>
  )
}
