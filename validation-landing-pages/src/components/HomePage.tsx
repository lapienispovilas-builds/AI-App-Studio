import { landingPages } from '../landingPageConfig'

export function HomePage() {
  return (
    <main className="home">
      <div className="home__intro">
        <p className="eyebrow"><span />Internal testing</p>
        <h1>Five ideas.<br />One simple goal.</h1>
        <p>Choose a validation landing page to preview.</p>
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
    </main>
  )
}
