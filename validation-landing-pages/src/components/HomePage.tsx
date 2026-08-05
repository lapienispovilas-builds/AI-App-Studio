import { assessmentPages } from '../assessmentPageConfig'
import { landingPages } from '../landingPageConfig'

export function HomePage() {
  return (
    <main className="home">
      <div className="home__intro">
        <p className="eyebrow"><span />Internal testing</p>
        <h1>Nine experiments.<br />One simple goal.</h1>
        <p>Choose a landing page or assessment funnel to preview.</p>
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
          <h2>Assessment Funnels</h2>
        </div>
        <div className="idea-grid idea-grid--assessments">
          {assessmentPages.map((page, index) => (
            <a className="idea-card" href={`/${page.slug}`} key={page.slug} style={{ '--card-accent': '#635bff', '--card-soft': '#eeecff' } as React.CSSProperties}>
              <span className="idea-card__number">0{index + 1}</span>
              <h2>{page.brand}</h2>
              <p>{page.subheadline}</p>
              <span className="idea-card__link">View assessment →</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
