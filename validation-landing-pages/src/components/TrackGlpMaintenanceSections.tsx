import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  Compass,
  HeartHandshake,
  ListChecks,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { trackGlpMaintenanceContent as content } from '../trackGlpMaintenanceConfig'

const problemIcons = [TrendingUp, CalendarDays, HeartHandshake]
const planFeatureIcons = [Compass, ListChecks, Route, ShieldCheck]

const planPriorities = [
  'Weight stability',
  'Sustainable habits',
  'Protein & nutrition',
  'Strength & movement',
]

const planWeeks = [
  {
    week: 'Week 1',
    title: 'Build your foundation',
    items: ['Understand your maintenance range', 'Create sustainable routines', 'Track important habits'],
  },
  {
    week: 'Week 2',
    title: 'Protect your progress',
    items: ['Stay consistent', 'Build confidence', 'Identify challenges'],
  },
  {
    week: 'Week 3',
    title: 'Strengthen your habits',
    items: ['Focus on what matters most', 'Adjust routines that feel difficult', 'Recognize early warning signs'],
  },
  {
    week: 'Week 4',
    title: 'Create your long-term routine',
    items: ['Review your progress', 'Choose habits you can sustain', 'Plan your next maintenance phase'],
  },
]

export function MaintenanceHeroVisual() {
  return (
    <div className="evera-plan-preview" aria-label="Example personalized Evera maintenance plan">
      <div className="evera-plan-preview__top"><span><Sparkles size={16} /> Personalized for you</span><small>30 DAYS</small></div>
      <div className="evera-plan-preview__heading"><small>YOUR EVERA</small><strong>Maintenance Plan</strong><p>Created for your GLP-1 journey</p></div>
      <div className="evera-plan-preview__profile"><span>Based on your answers</span><strong>Transitioning into maintenance</strong></div>
      <div className="evera-plan-preview__priorities">
        {planPriorities.map((priority) => <span key={priority}><i><Check size={12} /></i>{priority}</span>)}
      </div>
      <div className="evera-plan-preview__footer"><div><small>YOUR FIRST FOCUS</small><strong>Build a routine you can repeat</strong></div><ArrowRight size={20} /></div>
    </div>
  )
}

function PlanRoadmap() {
  return <div className="evera-roadmap">
    <header><div><small>YOUR PERSONALIZED PROGRAM</small><h3>Your 30-Day Maintenance Plan</h3></div><span><ClipboardCheck size={18} /> 4 weeks</span></header>
    <div className="evera-roadmap__weeks">
      {planWeeks.map((week, index) => <article className={index === 0 ? 'is-active' : ''} key={week.week}>
        <div className="evera-roadmap__week"><span>{String(index + 1).padStart(2, '0')}</span><div><small>{week.week}</small><strong>{week.title}</strong></div>{index === 0 && <em>Start here</em>}</div>
        <ul>{week.items.map((item) => <li key={item}><Check size={12} />{item}</li>)}</ul>
      </article>)}
    </div>
  </div>
}

export function TrackGlpMaintenanceSections() {
  return (
    <>
      <section className="maintenance-problem">
        <div className="phase2-section-heading phase2-section-heading--center">
          <p className="phase2-kicker">{content.problem.kicker}</p><h2>{content.problem.headline}</h2><p>{content.problem.description}</p>
        </div>
        <div className="maintenance-problem__grid">
          {content.problem.cards.map((card, index) => { const Icon = problemIcons[index]; return <article key={card.title}><span><Icon size={23} /></span><h3>{card.title}</h3><p>{card.description}</p></article> })}
        </div>
      </section>

      <section className="maintenance-research-section">
        <div className="maintenance-stat-card"><p className="phase2-kicker">{content.research.kicker}</p><div className="maintenance-stat-card__body"><strong>{content.research.statistic}</strong><p>{content.research.description}</p></div><div className="maintenance-stat-card__value">{content.research.value}</div></div>
      </section>

      <section className="evera-personalized-plan">
        <div className="phase2-section-heading phase2-section-heading--center"><p className="phase2-kicker">Personalized to your answers</p><h2>Your personalized plan.</h2><p>A focused month of guidance, practical priorities and simple actions designed around your maintenance stage.</p></div>
        <PlanRoadmap />
      </section>

      <section className="evera-plan-features">
        <div className="phase2-section-heading phase2-section-heading--center"><p className="phase2-kicker">Built around you</p><h2>Your plan adapts to your journey.</h2></div>
        <div className="evera-plan-features__grid">
          {content.help.cards.map((card, index) => { const Icon = planFeatureIcons[index]; return <article key={card.title}><span><Icon size={22} /></span><h3>{card.title}</h3><p>{card.description}</p></article> })}
        </div>
      </section>

      <section className="maintenance-how-simple evera-plan-process">
        <div className="phase2-section-heading phase2-section-heading--center"><p className="phase2-kicker">{content.how.kicker}</p><h2>{content.how.headline}</h2></div>
        <div className="maintenance-how-simple__steps">
          {content.how.steps.map((step, index) => <article key={step.title}><span>{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}
        </div>
      </section>

      <section className="maintenance-plan-cta"><div><p className="phase2-kicker">Your plan starts with your answers</p><h2>Get your personalized maintenance plan.</h2><p>Answer a few questions about your GLP-1 journey and receive a plan designed around your current stage, challenges, and goals.</p><a className="phase2-button" href="#early-access">Create My Plan <ArrowRight size={18} /></a><small>Personalized 30-day program · Takes only a few minutes</small></div><Target size={170} aria-hidden="true" /></section>
    </>
  )
}
