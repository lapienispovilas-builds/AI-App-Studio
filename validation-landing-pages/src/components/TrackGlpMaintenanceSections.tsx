import { ArrowDown, CalendarCheck, ChartNoAxesCombined, CircleUserRound, Footprints, HeartHandshake, Scale, ShieldCheck, Target, TrendingUp } from 'lucide-react'
import { trackGlpMaintenanceContent as content } from '../trackGlpMaintenanceConfig'

const problemIcons = [TrendingUp, CalendarCheck, HeartHandshake]
const helpIcons = [ChartNoAxesCombined, Footprints, ShieldCheck, Target]

export function MaintenanceHeroVisual() {
  return (
    <div className="maintenance-hero-card" aria-label="TrackGLP maintenance progress overview">
      <div className="maintenance-hero-card__top"><span>Maintenance check-in</span><strong>This week</strong></div>
      <div className="maintenance-hero-card__progress">
        <span><ShieldCheck size={24} /></span>
        <div><small>Your progress</small><strong>Still yours.</strong><p>Keep the habits behind your results visible.</p></div>
      </div>
      <div className="maintenance-hero-card__signals">
        <article><Scale size={18} /><span><small>Weight trend</small><strong>Steady</strong></span></article>
        <article><Footprints size={18} /><span><small>Movement</small><strong>5 / 7 days</strong></span></article>
        <article><CalendarCheck size={18} /><span><small>Consistency</small><strong>On track</strong></span></article>
      </div>
      <div className="maintenance-hero-card__check"><CircleUserRound size={18} /><span><strong>Weekly accountability</strong><small>One simple check-in at a time</small></span><i>✓</i></div>
    </div>
  )
}

export function TrackGlpMaintenanceSections() {
  return (
    <>
      <section className="maintenance-problem">
        <div className="phase2-section-heading phase2-section-heading--center">
          <p className="phase2-kicker">{content.problem.kicker}</p>
          <h2>{content.problem.headline}</h2>
          <p>{content.problem.description}</p>
        </div>
        <div className="maintenance-problem__grid">
          {content.problem.cards.map((card, index) => {
            const Icon = problemIcons[index]
            return <article key={card.title}><span><Icon size={23} /></span><h3>{card.title}</h3><p>{card.description}</p></article>
          })}
        </div>
      </section>

      <section className="maintenance-research-section">
        <div className="maintenance-stat-card">
          <p className="phase2-kicker">{content.research.kicker}</p>
          <div className="maintenance-stat-card__body">
            <strong>{content.research.statistic}</strong>
            <p>{content.research.description}</p>
          </div>
          <div className="maintenance-stat-card__value">{content.research.value}</div>
        </div>
      </section>

      <section className="maintenance-help">
        <div className="phase2-section-heading phase2-section-heading--center">
          <p className="phase2-kicker">{content.help.kicker}</p>
          <h2>{content.help.headline}</h2>
        </div>
        <div className="maintenance-help__grid">
          {content.help.cards.map((card, index) => {
            const Icon = helpIcons[index]
            return <article key={card.title}><span><Icon size={24} /></span><h3>{card.title}</h3><p>{card.description}</p></article>
          })}
        </div>
      </section>

      <section className="maintenance-how-simple">
        <div className="phase2-section-heading phase2-section-heading--center">
          <p className="phase2-kicker">{content.how.kicker}</p>
          <h2>{content.how.headline}</h2>
        </div>
        <div className="maintenance-how-simple__steps">
          {content.how.steps.map((step, index) => <article key={step.title}>
            <span>{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p>
            {index < content.how.steps.length - 1 && <i><ArrowDown size={18} /></i>}
          </article>)}
        </div>
      </section>

      <section className="maintenance-emotional">
        <div>
          <p className="phase2-kicker">{content.emotional.kicker}</p>
          <h2>{content.emotional.headline}</h2>
          <p>{content.emotional.description}</p>
        </div>
      </section>
    </>
  )
}
