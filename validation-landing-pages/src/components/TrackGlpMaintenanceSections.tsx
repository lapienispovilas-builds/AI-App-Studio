import {
  ArrowDown,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronRight,
  Dumbbell,
  Footprints,
  HeartHandshake,
  Moon,
  Scale,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react'
import { trackGlpMaintenanceContent as content } from '../trackGlpMaintenanceConfig'

const problemIcons = [TrendingUp, CalendarCheck, HeartHandshake]

type PhoneFrameProps = {
  label: string
  children: React.ReactNode
  className?: string
}

function PhoneFrame({ label, children, className = '' }: PhoneFrameProps) {
  return (
    <div className={`maintenance-phone ${className}`} aria-label={label}>
      <div className="maintenance-phone__screen">
        <div className="maintenance-phone__status"><strong>9:41</strong><span className="maintenance-phone__island" /><span>5G&nbsp; ▰</span></div>
        {children}
        <div className="maintenance-phone__home" />
      </div>
    </div>
  )
}

function MiniTrend({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={`maintenance-mini-trend${compact ? ' maintenance-mini-trend--compact' : ''}`} viewBox="0 0 260 92" role="img" aria-label="Stable weight trend inside the maintenance zone">
      <defs>
        <linearGradient id={`trend-fill-${compact ? 'compact' : 'full'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".22" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="28" width="260" height="31" rx="12" className="maintenance-mini-trend__zone" />
      <path d="M4 35 C28 31 42 44 65 39 S102 30 125 42 S163 50 188 39 S226 34 256 40 L256 88 L4 88 Z" fill={`url(#trend-fill-${compact ? 'compact' : 'full'})`} />
      <path d="M4 35 C28 31 42 44 65 39 S102 30 125 42 S163 50 188 39 S226 34 256 40" className="maintenance-mini-trend__line" />
      <circle cx="256" cy="40" r="5" className="maintenance-mini-trend__dot" />
    </svg>
  )
}

function DashboardScreen() {
  return (
    <PhoneFrame label="Evera maintenance dashboard" className="maintenance-phone--home">
      <div className="maintenance-app-header"><div><small>GOOD MORNING</small><strong>Your maintenance</strong></div><span>EV</span></div>
      <div className="maintenance-app-stage"><span>MAINTAINING</span><strong>Day 205 off GLP-1s</strong><p>Hold the line. Protect the win you worked for.</p></div>
      <div className="maintenance-app-weight">
        <div><small>CURRENT WEIGHT</small><strong>74.8 <em>kg</em></strong></div><span><Check size={13} /> Stable</span>
        <MiniTrend compact />
        <footer><small>Maintenance zone</small><strong>74–76 kg</strong></footer>
      </div>
      <div className="maintenance-app-timeline"><small>PROGRESS TIMELINE</small><div><i /><i /><i className="is-current" /></div><footer><span>Treatment</span><span>Transition</span><span>Maintaining</span></footer></div>
      <div className="maintenance-daily-overview"><header><small>DAILY OVERVIEW</small><strong>3 of 4 complete</strong></header><div><span><Target size={12} /><small>Protein</small></span><span><Dumbbell size={12} /><small>Strength</small></span><span><Moon size={12} /><small>Sleep</small></span><span><Check size={12} /><small>Habits</small></span></div></div>
      <nav className="maintenance-app-nav" aria-label="App preview navigation"><span className="is-active">Home</span><span>Progress</span><span>Routine</span><span>Learn</span></nav>
    </PhoneFrame>
  )
}

function WeightTrendScreen() {
  return (
    <PhoneFrame label="Evera progress screen">
      <div className="maintenance-app-header"><div><small>PROGRESS</small><strong>Weight trend</strong></div><span><Scale size={16} /></span></div>
      <div className="maintenance-app-summary"><small>LAST 30 DAYS</small><strong>74.8 kg</strong><span>Within your maintenance zone</span></div>
      <div className="maintenance-app-chart"><div className="maintenance-zone-label">Maintenance zone</div><MiniTrend /><footer><span>30 days ago</span><span>Today</span></footer></div>
      <div className="maintenance-app-two-up"><article><small>CURRENT</small><strong>74.8 kg</strong></article><article><small>GOAL RANGE</small><strong>74–76 kg</strong></article></div>
      <div className="maintenance-app-insight"><TrendingUp size={15} /><span><strong>Weight is holding steady</strong><small>Small changes stay visible.</small></span></div>
    </PhoneFrame>
  )
}

function RoutineScreen() {
  const habits = [
    { icon: Dumbbell, label: 'Strength', value: '2 / 3 sessions', progress: 67 },
    { icon: Target, label: 'Protein', value: '96 / 110 g', progress: 87 },
    { icon: Footprints, label: 'Daily movement', value: '8,420 steps', progress: 82 },
    { icon: Moon, label: 'Sleep', value: '7 h 35 min', progress: 76 },
  ]
  return (
    <PhoneFrame label="Evera daily maintenance routine screen">
      <div className="maintenance-app-header"><div><small>TODAY</small><strong>My routine</strong></div><span><Check size={16} /></span></div>
      <div className="maintenance-routine-score"><span>3 of 4</span><div><strong>Strong day</strong><small>Keep your maintenance routine visible.</small></div></div>
      <div className="maintenance-habit-list">
        {habits.map(({ icon: Icon, label, value, progress }) => <article key={label}><Icon size={16} /><div><header><strong>{label}</strong><small>{value}</small></header><span><i style={{ width: `${progress}%` }} /></span></div></article>)}
      </div>
      <button type="button">Complete daily check-in</button>
    </PhoneFrame>
  )
}

function JourneyScreen() {
  return (
    <PhoneFrame label="Evera post-treatment journey timeline">
      <div className="maintenance-app-header"><div><small>MY JOURNEY</small><strong>205 days maintaining</strong></div><span><ShieldCheck size={16} /></span></div>
      <div className="maintenance-journey-stat"><small>SINCE STARTING</small><strong>17.2 kg</strong><span>progress maintained</span></div>
      <div className="maintenance-milestones">
        <article><i className="is-done"><Check size={11} /></i><div><small>JAN 12</small><strong>Treatment started</strong><span>Your baseline was recorded</span></div></article>
        <article><i className="is-done"><Check size={11} /></i><div><small>NOV 21</small><strong>Maintenance began</strong><span>Your history stayed connected</span></div></article>
        <article><i className="is-current" /><div><small>TODAY</small><strong>6-month milestone</strong><span>Weight and habits remain visible</span></div></article>
      </div>
      <div className="maintenance-app-insight"><CalendarCheck size={15} /><span><strong>Next milestone</strong><small>One year maintaining · 160 days</small></span></div>
    </PhoneFrame>
  )
}

function LearnScreen() {
  const resources = [
    { tag: '5 MIN READ', title: 'What changes after treatment?', color: 'blue' },
    { tag: 'PRACTICAL GUIDE', title: 'Build a routine you can repeat', color: 'lavender' },
    { tag: '3 MIN READ', title: 'Why strength and protein matter', color: 'sand' },
  ]
  return (
    <PhoneFrame label="Evera maintenance learning resources screen">
      <div className="maintenance-app-header"><div><small>LEARN</small><strong>Maintenance library</strong></div><span><BookOpen size={16} /></span></div>
      <div className="maintenance-learn-feature"><small>FEATURED</small><strong>Your next chapter starts with a plan</strong><p>Understand the maintenance phase, one clear topic at a time.</p><span>Read guide <ChevronRight size={13} /></span></div>
      <div className="maintenance-resource-list">
        {resources.map((resource) => <article key={resource.title}><i className={`is-${resource.color}`}><BookOpen size={14} /></i><div><small>{resource.tag}</small><strong>{resource.title}</strong></div><ChevronRight size={14} /></article>)}
      </div>
      <p className="maintenance-education-note">Educational content only—not medical advice.</p>
    </PhoneFrame>
  )
}

export function MaintenanceHeroVisual() {
  return (
    <div className="maintenance-hero-showcase">
      <div className="maintenance-hero-glow" />
      <div className="maintenance-hero-secondary" aria-label="Evera app screen previews">
        <WeightTrendScreen />
        <RoutineScreen />
        <LearnScreen />
      </div>
      <DashboardScreen />
    </div>
  )
}

const showcaseScreens = [WeightTrendScreen, RoutineScreen, JourneyScreen, LearnScreen]

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

      <section className="maintenance-help maintenance-help--showcase">
        <div className="phase2-section-heading phase2-section-heading--center"><p className="phase2-kicker">{content.help.kicker}</p><h2>{content.help.headline}</h2></div>
        <div className="maintenance-showcase-list">
          {content.help.cards.map((card, index) => {
            const Screen = showcaseScreens[index]
            return <article className="maintenance-showcase" key={card.title}><div className="maintenance-showcase__copy"><span>0{index + 1}</span><h3>{card.title}</h3><p>{card.description}</p></div><div className="maintenance-showcase__visual"><Screen /></div></article>
          })}
        </div>
      </section>

      <section className="maintenance-how-simple">
        <div className="phase2-section-heading phase2-section-heading--center"><p className="phase2-kicker">{content.how.kicker}</p><h2>{content.how.headline}</h2></div>
        <div className="maintenance-how-simple__steps">
          {content.how.steps.map((step, index) => <article key={step.title}><span>{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p>{index < content.how.steps.length - 1 && <i><ArrowDown size={18} /></i>}</article>)}
        </div>
      </section>

      <section className="maintenance-emotional"><div><p className="phase2-kicker">{content.emotional.kicker}</p><h2>{content.emotional.headline}</h2><p>{content.emotional.description}</p></div></section>
    </>
  )
}
