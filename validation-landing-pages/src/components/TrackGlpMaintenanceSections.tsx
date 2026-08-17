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
  Target,
  TrendingUp,
} from 'lucide-react'
import { trackGlpMaintenanceContent as content } from '../trackGlpMaintenanceConfig'
import { danishLandingContent, type EveraLocale } from '../everaDanish'

const problemIcons = [TrendingUp, CalendarDays, HeartHandshake]
const planFeatureIcons = [Compass, ListChecks, Route, ShieldCheck]

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

const danishPlanWeeks = [
  { week: 'Uge 1', title: 'Byg dit fundament', items: ['Forstå dit vægtinterval', 'Skab bæredygtige rutiner', 'Følg de vigtigste vaner'] },
  { week: 'Uge 2', title: 'Beskyt dine fremskridt', items: ['Bevar kontinuiteten', 'Skab tryghed', 'Identificér udfordringer'] },
  { week: 'Uge 3', title: 'Styrk dine vaner', items: ['Fokusér på det vigtigste', 'Tilpas svære rutiner', 'Genkend tidlige signaler'] },
  { week: 'Uge 4', title: 'Skab din langsigtede rutine', items: ['Gennemgå dine fremskridt', 'Vælg vaner, du kan holde', 'Planlæg din næste fase'] },
]

export function MaintenanceHeroVisual({ locale = 'en' }: { locale?: EveraLocale }) {
  return (
    <figure className="evera-hero-image" aria-label="Preview of a personalized Evera maintenance plan">
      <img
        src={locale === 'da' ? '/assets/evera-maintenance-plan-hero-da.png' : '/assets/evera-maintenance-plan-hero.png'}
        alt={locale === 'da' ? 'Kvinde med et glas vand ved siden af en personlig 30-dages Evera-plan' : 'Woman holding a glass of water beside a personalized 30-day Evera maintenance plan preview'}
      />
    </figure>
  )
}

function PlanRoadmap({ locale = 'en' }: { locale?: EveraLocale }) {
  const weeks = locale === 'da' ? danishPlanWeeks : planWeeks
  return <div className="evera-roadmap">
    <header><div><small>{locale === 'da' ? 'DIT PERSONLIGE PROGRAM' : 'YOUR PERSONALIZED PROGRAM'}</small><h3>{locale === 'da' ? 'Din Evera-vedligeholdelsesplan' : 'Your Evera Maintenance Plan'}</h3></div><span><ClipboardCheck size={18} /> {locale === 'da' ? 'Anbefalet: 30 dage' : 'Recommended: 30 days'}</span></header>
    <div className="evera-roadmap__weeks">
      {weeks.map((week, index) => <article className={index === 0 ? 'is-active' : ''} key={week.week}>
        <div className="evera-roadmap__week"><span>{String(index + 1).padStart(2, '0')}</span><div><small>{week.week}</small><strong>{week.title}</strong></div>{index === 0 && <em>{locale === 'da' ? 'Start her' : 'Start here'}</em>}</div>
        <ul>{week.items.map((item) => <li key={item}><Check size={12} />{item}</li>)}</ul>
      </article>)}
    </div>
  </div>
}

export function TrackGlpMaintenanceSections({ onStartQuiz, locale = 'en' }: { onStartQuiz: () => void; locale?: EveraLocale }) {
  const copy = locale === 'da' ? danishLandingContent : content
  return (
    <>
      <section className="maintenance-problem">
        <div className="phase2-section-heading phase2-section-heading--center">
          <p className="phase2-kicker">{copy.problem.kicker}</p><h2>{copy.problem.headline}</h2><p>{copy.problem.description}</p>
        </div>
        <div className="maintenance-problem__grid">
          {copy.problem.cards.map((card, index) => { const Icon = problemIcons[index]; return <article key={card.title}><span><Icon size={23} /></span><h3>{card.title}</h3><p>{card.description}</p></article> })}
        </div>
      </section>

      <section className="maintenance-research-section">
        <div className="maintenance-stat-card"><p className="phase2-kicker">{copy.research.kicker}</p><div className="maintenance-stat-card__body"><strong>{copy.research.statistic}</strong><p>{copy.research.description}</p></div><div className="maintenance-stat-card__value">{copy.research.value}</div></div>
      </section>

      <section className="evera-program-feedback">
        <div className="phase2-section-heading phase2-section-heading--center">
          <p className="phase2-kicker">{locale === 'da' ? 'Virkelige erfaringer' : 'Real experiences'}</p>
          <h2>{locale === 'da' ? 'Feedback fra brugere af Evera-programmet.' : 'Feedback from Evera program users.'}</h2>
        </div>
        <div className="evera-program-feedback__grid">
          <figure><img src="/assets/evera-feedback/regina.png" alt="Evera program feedback from Regina" /></figure>
          <figure><img src="/assets/evera-feedback/program-feedback-2.png" alt="Evera program feedback about staying calm and on track after GLP-1" /></figure>
          <figure><img src="/assets/evera-feedback/program-feedback-3.png" alt="Evera program feedback about maintaining results after GLP-1" /></figure>
        </div>
      </section>

      <section className="evera-personalized-plan">
        <div className="phase2-section-heading phase2-section-heading--center"><p className="phase2-kicker">{locale === 'da' ? 'Tilpasset dine svar' : 'Personalized to your answers'}</p><h2>{locale === 'da' ? 'Din personlige plan.' : 'Your personalized plan.'}</h2><p>{locale === 'da' ? 'Praktisk vejledning, prioriteter og handlinger tilpasset din vedligeholdelsesfase og dit ønskede støtteniveau.' : 'Practical guidance, priorities, and actions designed around your maintenance stage and preferred level of support.'}</p></div>
        <PlanRoadmap locale={locale} />
      </section>

      <section className="evera-plan-features">
        <div className="phase2-section-heading phase2-section-heading--center"><p className="phase2-kicker">{locale === 'da' ? 'Bygget omkring dig' : 'Built around you'}</p><h2>{locale === 'da' ? 'Din plan tilpasser sig din rejse.' : 'Your plan adapts to your journey.'}</h2></div>
        <div className="evera-plan-features__grid">
          {copy.help.cards.map((card, index) => { const Icon = planFeatureIcons[index]; return <article key={card.title}><span><Icon size={22} /></span><h3>{card.title}</h3><p>{card.description}</p></article> })}
        </div>
      </section>

      <section className="maintenance-how-simple evera-plan-process">
        <div className="phase2-section-heading phase2-section-heading--center"><p className="phase2-kicker">{copy.how.kicker}</p><h2>{copy.how.headline}</h2></div>
        <div className="maintenance-how-simple__steps">
          {copy.how.steps.map((step, index) => <article key={step.title}><span>{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}
        </div>
      </section>

      <section className="maintenance-plan-cta"><div><p className="phase2-kicker">{locale === 'da' ? 'Din plan starter med dine svar' : 'Your plan starts with your answers'}</p><h2>{locale === 'da' ? 'Få din personlige vedligeholdelsesplan.' : 'Get your personalized maintenance plan.'}</h2><p>{locale === 'da' ? 'Besvar nogle få spørgsmål om din GLP-1-rejse, og få en plan tilpasset din fase, dine udfordringer og dine mål.' : 'Answer a few questions about your GLP-1 journey and receive a plan designed around your current stage, challenges, and goals.'}</p><button className="phase2-button" type="button" onClick={onStartQuiz}>{locale === 'da' ? 'Skab min plan' : 'Create My Plan'} <ArrowRight size={18} /></button><small>{locale === 'da' ? 'Personlig vedligeholdelsesplan · Tager kun få minutter' : 'Personalized maintenance roadmap · Takes only a few minutes'}</small></div><Target size={170} aria-hidden="true" /></section>
    </>
  )
}
