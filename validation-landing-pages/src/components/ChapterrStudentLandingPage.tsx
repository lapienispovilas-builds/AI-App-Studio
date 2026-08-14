import { ArrowRight, BookOpen, GraduationCap, HeartHandshake, MapPin, MessageCircle, Sparkles, Sprout, UsersRound } from 'lucide-react'
import type { ChapterrStudentLandingPageConfig } from '../chapterrStudentLandingPageConfig'

const recognitionIcons = [UsersRound, MapPin, MessageCircle, HeartHandshake]
const conceptIcons = [MapPin, GraduationCap, Sparkles, Sprout, MessageCircle]

function typeformHref(typeformUrl: string) {
  const query = window.location.search.replace(/^\?/, '')
  return query ? `${typeformUrl}?${query}` : typeformUrl
}

function highlightedHeadline(headline: string) {
  const first = 'Naujas miestas'
  const second = 'Nauji žmonės'
  const firstIndex = headline.indexOf(first)
  const secondIndex = headline.indexOf(second)

  if (firstIndex === -1 || secondIndex === -1) return headline

  return <>{headline.slice(0, firstIndex)}<span className="chapterr-highlight">{first}</span>{headline.slice(firstIndex + first.length, secondIndex)}<span className="chapterr-highlight">{second}</span>{headline.slice(secondIndex + second.length)}</>
}

export function ChapterrStudentLandingPage({ config }: { config: ChapterrStudentLandingPageConfig }) {
  const waitlistUrl = typeformHref(config.typeformUrl)

  return (
    <main className="chapterr-page chapterr-student-page">
      <header className="chapterr-header">
        <a className="chapterr-wordmark chapterr-student-wordmark" href={`/${config.slug}`} aria-label={`${config.brand} pradžia`}>
          <img src="/chapterr/chapterr-student-logo.png" alt="Chapter" />
        </a>
      </header>

      <section className="chapterr-hero chapterr-student-hero">
        <div className="chapterr-hero__copy">
          <p className="chapterr-kicker">Tavo naujas etapas prasideda čia</p>
          <h1>{highlightedHeadline(config.headline)}</h1>
          <p className="chapterr-student-hero__lead">{config.subheadline}</p>
          <p className="chapterr-hero__subtitle">{config.body}</p>
          <a className="chapterr-button" href={waitlistUrl}>{config.heroCta}<ArrowRight size={19} /></a>
        </div>

        <div className="chapterr-people chapterr-student-visual" aria-label="Studentai kartu atranda naują universitetinį miestą">
          <img className="chapterr-lifestyle chapterr-lifestyle--main" src="/chapterr/chapterr-students-hero.png" alt="Keturi studentai kartu vaikšto Vilniaus senamiestyje" />
          <div className="chapterr-chapter-card chapterr-chapter-card--one"><MapPin size={17} /><span><small>Naujas miestas</small><strong>Vilnius</strong></span></div>
          <div className="chapterr-chapter-card chapterr-chapter-card--two"><GraduationCap size={17} /><span><small>Naujas etapas</small><strong>Pirmi studijų metai</strong></span></div>
          <div className="chapterr-connection"><UsersRound size={22} /><span><strong>Žmonės, kurie taip pat pradeda iš naujo.</strong><small>Jau turite apie ką kalbėti</small></span></div>
        </div>
      </section>

      <section className="chapterr-recognition chapterr-student-recognition">
        <div className="chapterr-section-heading">
          <p className="chapterr-kicker">Tu ne vienas pradedi iš naujo</p>
          <h2>{config.recognitionTitle}</h2>
        </div>
        <div className="chapterr-recognition__grid">
          {config.recognitionCards.map((card, index) => {
            const Icon = recognitionIcons[index]
            return <article key={card}><span><Icon size={21} /></span><p>“{card}”</p></article>
          })}
        </div>
      </section>

      <section className="chapterr-concept chapterr-student-concept">
        <div className="chapterr-concept__visual" aria-label="Kaip Chapter sujungia panašius studentus">
          <ul>{config.conceptItems.map((item, index) => {
            const Icon = conceptIcons[index]
            return <li key={item}><Icon size={18} /><span>{item}</span></li>
          })}</ul>
        </div>
        <div className="chapterr-concept__copy">
          <p className="chapterr-kicker">Panašus etapas. Natūralesnė pažintis.</p>
          <h2>{config.conceptHeadline}</h2>
          <p>Chapter sujungia studentus pagal tai, kas iš tikrųjų svarbu naujoje pradžioje.</p>
          <div className="chapterr-student-concept__statement"><strong>Ne dar viena grupė su šimtais atsitiktinių žmonių.</strong><span>Žmonės, su kuriais gali iškart turėti apie ką kalbėti.</span></div>
        </div>
      </section>

      <section className="chapterr-student-goal">
        <p className="chapterr-kicker">Tikslas</p>
        <h2>Tinkami žmonės naujam gyvenimo etapui.</h2>
        <p>{config.goalText}</p>
      </section>

      <section className="chapterr-how chapterr-student-how">
        <div className="chapterr-section-heading">
          <p className="chapterr-kicker">Paprasta pradžia</p>
          <h2>Kaip tai veikia?</h2>
        </div>
        <div className="chapterr-steps">
          {config.steps.map((step, index) => (
            <article key={step.title}>
              <span className="chapterr-step-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className="chapterr-step-arrow" aria-hidden="true">{index === config.steps.length - 1 ? <BookOpen size={18} /> : <ArrowRight size={18} />}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="chapterr-final chapterr-student-final">
        <p className="chapterr-kicker">Pirmieji ratai jau prasideda</p>
        <h2>{config.finalHeadline}</h2>
        <p>{config.finalText}</p>
        <a className="chapterr-button chapterr-button--light" href={waitlistUrl}>{config.finalCta}<ArrowRight size={19} /></a>
      </section>

      <footer className="chapterr-footer">
        <span className="chapterr-wordmark chapterr-student-wordmark"><img src="/chapterr/chapterr-student-logo.png" alt="Chapter" /></span>
        <div className="chapterr-footer__legal" aria-label="Teisinė informacija"><span>Privacy Statement</span><span>Terms and Conditions</span><span>DMCA Policy</span><span>Do Not Sell My Info</span></div>
      </footer>
    </main>
  )
}
