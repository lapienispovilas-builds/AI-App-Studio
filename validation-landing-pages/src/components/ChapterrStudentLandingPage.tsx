import { ArrowRight, BookOpen, Check, Coffee, GraduationCap, MapPin, MessageCircle, Music, Sparkles, UsersRound, X } from 'lucide-react'
import type { ChapterrStudentLandingPageConfig } from '../chapterrStudentLandingPageConfig'
import { ChapterFooter } from './ChapterFooter'

function quizHref(slug: string) {
  const isChapterDomain = ['trychapter.lt', 'www.trychapter.lt'].includes(window.location.hostname.toLowerCase())
  return isChapterDomain ? '/quiz' : `/${slug}/quiz`
}

function StudentResearchMessages({ messages }: { messages: string[] }) {
  const initials = ['A', 'M', 'J', 'E']
  return <div className="chapter-student-messages" aria-label="Studentų pokalbiuose pasikartojusios įžvalgos">
    {messages.map((message, index) => <article className={index % 2 === 1 ? 'is-right' : ''} key={message}>
      <span aria-hidden="true">{initials[index]}</span>
      <div><p>“{message}”</p><small>Studentų pokalbių įžvalga</small></div>
    </article>)}
  </div>
}

function StudentMatchComparison() {
  return <div className="chapter-student-meme" aria-label="Daugybės atsitiktinių žmonių ir mažo tinkamo rato palyginimas">
    <div className="chapter-student-meme__row is-no"><span><X size={25} /></span><div><small>Daugiau triukšmo</small><strong>40 000+ žmonių Facebook grupėje</strong></div></div>
    <div className="chapter-student-meme__row is-yes"><span><Check size={25} /></span><div><small>Tinkamesnis ratas</small><strong>5 žmonės tavo mieste su panašiais interesais, kurie taip pat nori susipažinti</strong></div></div>
  </div>
}

function StudentStepVisual({ index }: { index: number }) {
  if (index === 0) return <div className="chapter-step-product chapter-step-quiz"><div className="chapter-step-product__bar"><span /><span /><span /></div><small>Kas tau įdomu?</small><strong>Pasirink savo interesus</strong><div>{['muzika', 'sportas', 'kelionės', 'knygos', 'chill'].map((item, itemIndex) => <span className={itemIndex < 3 ? 'is-selected' : ''} key={item}>{item}</span>)}</div><button type="button">Tęsti</button></div>
  if (index === 1) return <div className="chapter-step-product chapter-step-profiles"><small>Jūsų ratas</small>{[
    ['AK', 'Austėja', 'muzika · kelionės'], ['MT', 'Matas', 'sportas · startupai'], ['IE', 'Ieva', 'kelionės · chill'],
  ].map(([avatar, name, tags]) => <span key={name}><i>{avatar}</i><div><strong>{name}</strong><small>{tags}</small></div><em>3 bendri</em></span>)}</div>
  if (index === 2) return <div className="chapter-step-product chapter-step-chat"><small>Vilnius · naujas ratas</small><span className="is-theirs"><i>AK</i><p>Gal kas kavos po paskaitų?</p></span><span className="is-mine"><p>Aš už! Žinau jaukią vietą centre ☕</p></span><span className="is-theirs"><i>MT</i><p>Prisijungiu 🙌</p></span><div><span>Parašyk žinutę...</span><MessageCircle size={14}/></div></div>
  return <div className="chapter-step-product chapter-step-activities"><small>Idėjos jūsų grupei</small><span><Coffee size={18}/><div><strong>Kava po paskaitų</strong><small>Senamiestis · šiandien</small></div></span><span><UsersRound size={18}/><div><strong>Krepšinis kieme</strong><small>Naujamiestis · trečiadienį</small></div></span><span><Music size={18}/><div><strong>Studentų koncertas</strong><small>Menų fabrikas · penktadienį</small></div></span></div>
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
  const waitlistUrl = quizHref(config.slug)

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
          <img className="chapterr-lifestyle chapterr-lifestyle--main" src="/chapterr/chapter-students-vilnius.jpg" alt="Studentai kartu žvelgia į Vilniaus senamiestį" />
          <div className="chapterr-chapter-card chapterr-chapter-card--one"><MapPin size={17} /><span><small>Naujas miestas</small><strong>Vilnius</strong></span></div>
          <div className="chapterr-chapter-card chapterr-chapter-card--two"><GraduationCap size={17} /><span><small>Naujas etapas</small><strong>Pirmi studijų metai</strong></span></div>
          <div className="chapterr-connection"><UsersRound size={22} /><span><strong>Žmonės, kurie taip pat pradeda iš naujo.</strong><small>Jau turite apie ką kalbėti</small></span></div>
        </div>
      </section>

      <section className="chapterr-recognition chapterr-student-recognition">
        <div className="chapterr-section-heading">
          <p className="chapterr-kicker">Išgirdome iš studentų</p>
          <h2>{config.recognitionTitle}</h2>
          <p className="chapter-student-research-intro"><strong>Paklausinėjom buvusių ir esamų studentų, kaip jie susirado savo pirmą draugų ratą naujame mieste.</strong><span>Ir supratom vieną dalyką — Facebook grupių neužtenka.</span></p>
        </div>
        <StudentResearchMessages messages={config.recognitionCards} />
      </section>

      <section className="chapterr-concept chapterr-student-concept">
        <StudentMatchComparison />
        <div className="chapterr-concept__copy">
          <p className="chapterr-kicker">Mažiau triukšmo. Daugiau bendro.</p>
          <h2>{config.conceptHeadline}</h2>
          <div className="chapterr-student-concept__statement"><strong>Chapter padeda atrasti ne daugiau žmonių — o tinkamesnius žmones.</strong><span>Pagal tavo interesus, gyvenimo būdą ir tai, ko ieškai šiame etape.</span></div>
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
              <StudentStepVisual index={index} />
            </article>
          ))}
        </div>
      </section>

      <section className="chapterr-final chapterr-student-final">
        <img src="/chapterr/chapter-student-life-collage.jpg" alt="Studentai Vilniuje leidžia laiką kartu: vaikšto mieste, geria kavą, sportuoja, mokosi ir eina į renginį" />
        <div className="chapterr-student-final__overlay" />
        <div className="chapterr-student-final__content"><p className="chapterr-kicker">Žmonės kuria tavo istoriją</p><h2>{config.finalHeadline}</h2><p>{config.finalText}</p><a className="chapterr-button chapterr-button--light" href={waitlistUrl}>{config.finalCta}<ArrowRight size={19} /></a></div>
      </section>

      <ChapterFooter />
    </main>
  )
}
