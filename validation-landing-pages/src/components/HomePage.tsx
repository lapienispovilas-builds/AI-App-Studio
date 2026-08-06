import { landingPages } from '../landingPageConfig'
import { phase2LandingPages } from '../phase2LandingPageConfig'

export function HomePage() {
  return (
    <main className="home">
      <div className="home__intro">
        <p className="eyebrow"><span />Internal testing</p>
        <h1>Ten experiments.<br />One simple goal.</h1>
        <p>Choose a validation landing page to preview.</p>
      </div>

      <section className="testing-section">
        <div className="testing-section__heading">
          <p>Round 1</p>
          <h2>Early Access Pages</h2>
        </div>
        <div className="idea-grid">
          {landingPages.map((page, index) => (
            <a className="idea-card" href={page.path} key={page.path} style={{ '--card-accent': page.accent, '--card-soft': page.accentSoft } as React.CSSProperties}>
              <span className="idea-card__number">0{index + 1}</span>
              <h2>{page.name}</h2>
              <p>{page.subheadline}</p>
              <span className="idea-card__link">View page →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="testing-section">
        <div className="testing-section__heading">
          <p>Round 2</p>
          <h2>Phase 2 Landing Pages</h2>
        </div>
        <div className="idea-grid idea-grid--assessments">
          {phase2LandingPages.map((page, index) => (
            <a className="idea-card" href={`/${page.slug}`} key={page.slug} style={{ '--card-accent': page.accent, '--card-soft': page.accentSoft } as React.CSSProperties}>
              <span className="idea-card__number">0{index + 1}</span>
              <h2>{page.brand}</h2>
              <p>{page.subheadline}</p>
              <span className="idea-card__link">View page →</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
