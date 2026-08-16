import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  Droplets,
  Dumbbell,
  Footprints,
  HeartPulse,
  Moon,
  Scale,
  Syringe,
  Utensils,
} from 'lucide-react'
import type { Phase2LandingPageConfig } from '../phase2LandingPageConfig'
import { ProductScreen } from './ProductStoryMockups'

type Variant = NonNullable<Phase2LandingPageConfig['landingVariant']>

const stages = {
  maintenance: ['On treatment', 'Transition', 'Maintaining'],
  'whole-journey': ['Started', 'Active treatment', 'Progress', 'Maintaining'],
} satisfies Record<Variant, string[]>

function StageLine({ variant, compact = false }: { variant: Variant; compact?: boolean }) {
  return <div className={compact ? 'positioning-stage-line is-compact' : 'positioning-stage-line'} style={{ gridTemplateColumns: `repeat(${stages[variant].length}, minmax(0, 1fr))` }}>
    {stages[variant].map((stage, index) => <div className={index === stages[variant].length - 1 ? 'is-current' : ''} key={stage}><i><Check size={10} /></i><span>{stage}</span></div>)}
  </div>
}

function HabitTiles({ journey = false }: { journey?: boolean }) {
  const items = journey
    ? [[Syringe, 'Dose', 'Logged'], [Scale, 'Weight', '-8.2 kg'], [HeartPulse, 'Symptoms', 'Mild'], [Footprints, 'Movement', '7.8k']]
    : [[Footprints, 'Movement', '7.8k avg'], [Utensils, 'Protein', '5 / 7 days'], [Droplets, 'Water', '6 / 7 days']]
  return <div className="positioning-habit-tiles">{items.map(([Icon, label, value]) => {
    const TileIcon = Icon as typeof Footprints
    return <div key={label as string}><span><TileIcon size={16} /></span><small>{label as string}</small><strong>{value as string}</strong></div>
  })}</div>
}

function WeightContinuity({ maintenance = false }: { maintenance?: boolean }) {
  return <div className="positioning-weight-chart">
    <div className="positioning-chart-label"><span>Week 1</span><span>{maintenance ? 'Treatment ended' : 'Week 12'}</span><span>Today</span></div>
    <svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true">
      <path className="chart-area" d="M8 24 C55 34 75 50 112 65 S170 80 198 87 S248 83 292 86 L292 116 L8 116 Z" />
      <path className="chart-line" d="M8 24 C55 34 75 50 112 65 S170 80 198 87 S248 83 292 86" />
      {maintenance && <line className="chart-marker" x1="198" x2="198" y1="10" y2="110" />}
    </svg>
    <div className="positioning-chart-result"><Scale size={15} /><span><strong>{maintenance ? 'Progress maintained' : 'One continuous trend'}</strong><small>{maintenance ? 'History continues beyond treatment' : 'Weight, treatment and habits together'}</small></span></div>
  </div>
}

export function PositioningHero({ variant }: { variant: Variant }) {
  if (variant === 'maintenance') {
    return <div className="positioning-hero-visual maintenance-research-hero" aria-label="Research about weight regain after treatment">
      <div className="maintenance-research-hero__label">Interesting fact</div>
      <strong className="maintenance-research-hero__stat">60%</strong>
      <p>Research found people regained around 60% of the weight they had lost after stopping treatment.</p>
      <div className="maintenance-research-hero__value">TrackGLP is being built to help you maintain your progress after treatment.</div>
    </div>
  }

  const journeyStages = [
    ['Starting', 'Baseline · Goals'],
    ['Active treatment', 'Dose · Symptoms · Reminders'],
    ['Progress', 'Weight · Protein · Water · Movement'],
    ['Transition', 'History stays with you'],
    ['Maintaining', 'Movement · Habits · Progress'],
  ]
  const highlightedStage = journeyStages.length - 1
  return <div className="positioning-hero-visual positioning-longitudinal-hero" aria-label="Evera whole journey timeline">
    <div className="positioning-dashboard-top"><span>Your journey</span><strong>One connected history</strong></div>
    <div className="longitudinal-journey">{journeyStages.map(([stage, details], index) => <article className={index === highlightedStage ? 'is-current is-destination' : ''} key={stage}><i /><div><strong>{stage}</strong><small>{details}</small>{index === highlightedStage && <em>Destination</em>}</div></article>)}</div>
  </div>
}

function TreatmentTimeline({ maintenance }: { maintenance: boolean }) {
  const labels = maintenance ? ['Started', 'Dose changes', 'Current / stopped'] : ['First dose', 'Current plan', 'Next stage']
  return <div className="positioning-treatment-line">{labels.map((label, index) => <div key={label}><span><Syringe size={14} /></span><strong>{label}</strong><small>{index === 0 ? 'Week 1' : index === 1 ? 'History saved' : 'Today'}</small></div>)}</div>
}

export function PositioningStoryGrid({ variant }: { variant: Variant }) {
  const maintenance = variant === 'maintenance'
  const titles = maintenance
    ? ['Your treatment history', 'Habits that continue', 'Progress that stays visible']
    : ['Treatment', 'Daily life', 'Long-term progress']
  return <div className="phase2-situations positioning-story-grid">
    <article className="positioning-story-card"><h3>{titles[0]}</h3><TreatmentTimeline maintenance={maintenance} /><p>{maintenance ? 'Medication remains visible as one chapter—not the whole story.' : 'Keep dose changes and treatment milestones in one history.'}</p></article>
    <article className="positioning-story-card"><h3>{titles[1]}</h3><HabitTiles journey={variant === 'whole-journey'} /><p>{maintenance ? 'Movement, protein and hydration remain useful beyond treatment.' : 'See habits and how you feel alongside treatment.'}</p></article>
    <article className="positioning-story-card"><h3>{titles[2]}</h3><WeightContinuity maintenance={maintenance} /></article>
  </div>
}

export function PositioningFeatureGrid({ variant, features }: { variant: Variant; features: Array<{ title: string; description: string }> }) {
  if (variant === 'whole-journey') {
    const labels = ['During treatment', 'As you approach your goal', 'After treatment']
    const modes: JourneyScreen[] = ['progress', 'routine', 'home']
    return <div className="maintenance-feature-grid journey-feature-grid">
      {features.map((feature, index) => <article key={feature.title}>
        <span className="journey-phase-label">{labels[index]}</span>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
        <EveraJourneyPhone screen={modes[index]} />
      </article>)}
    </div>
  }
  return <div className="maintenance-feature-grid">
    {features.map((feature, index) => <article key={feature.title}>
      <span className="maintenance-coming-soon">Coming soon</span>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      <PositioningUpcomingVisual variant={variant} index={index} />
    </article>)}
  </div>
}

function ConnectedDetails({ variant }: { variant: Variant }) {
  const labels = variant === 'maintenance' ? ['Weight', 'Protein', 'Water', 'Movement', 'Symptoms'] : ['Weight trend', 'Habit consistency', 'Symptoms', 'Treatment']
  return <div className="positioning-connected"><div>{labels.map((label) => <span key={label}>{label}</span>)}</div><i><ArrowRight size={19} /></i><strong>{variant === 'maintenance' ? 'Your progress' : 'One clear timeline'}</strong></div>
}

function JourneyMap({ variant, detailed = false }: { variant: Variant; detailed?: boolean }) {
  const stageLabels = variant === 'maintenance' ? ['ON TREATMENT', 'TRANSITION', 'MAINTAINING'] : ['FIRST DOSE', 'ACTIVE', 'PROGRESS', 'CHANGES', 'MAINTENANCE']
  return <div className={detailed ? 'positioning-journey-map is-detailed' : 'positioning-journey-map'}>
    {stageLabels.map((stage, index) => <div className={index === stageLabels.length - 1 ? 'is-active' : ''} key={stage}><i /><strong>{stage}</strong>{detailed && <small>{variant === 'maintenance' && index === 2 ? 'Movement · Habits · Stability' : 'History continues'}</small>}</div>)}
    {variant === 'maintenance' && <span className="positioning-soon">Coming soon</span>}
  </div>
}

export function PositioningHowVisual({ variant, index, screen }: { variant: Variant; index: number; screen: Parameters<typeof ProductScreen>[0]['screen'] }) {
  if (variant === 'whole-journey') {
    const modes: JourneyScreen[] = ['home', 'routine', 'learn']
    return <EveraJourneyPhone screen={modes[index]} />
  }
  return <ProductScreen screen={screen} />
}

export function PositioningDifferenceVisual({ variant }: { variant: Variant }) {
  const journeyStages = variant === 'maintenance' ? [
    { title: 'On treatment', description: 'Track doses, weight, symptoms and daily habits.', features: ['Dose', 'Weight', 'Symptoms', 'Reminders'] },
    { title: 'Transition', description: 'Keep your history while priorities shift toward habits and movement.', features: ['History', 'Weight trend', 'Movement', 'Habits'], soon: true },
    { title: 'Maintaining', description: 'Keep movement, habits and long-term progress visible after treatment.', features: ['Movement', 'Protein', 'Hydration', 'Consistency'], soon: true },
  ] : [
    { title: 'Starting', description: 'Begin with one clear view of where you are and where you want to go.', features: ['Baseline', 'Goals'] },
    { title: 'Active treatment', description: 'Keep treatment details and everyday signals connected.', features: ['Doses', 'Symptoms', 'Reminders'] },
    { title: 'Progress', description: 'See treatment, habits and results as one continuous story.', features: ['Weight', 'Protein', 'Water', 'Movement'] },
    { title: 'Treatment changes', description: 'Keep the same history as your treatment and priorities change.', features: ['History stays connected'], soon: true },
    { title: 'Maintaining', description: 'Continue seeing the habits and progress that matter over time.', features: ['Movement', 'Habits', 'Long-term progress'], soon: true },
  ]
  return <div className="maintenance-stage-journey">
    {journeyStages.map((stage, index) => <article className={variant === 'whole-journey' && index === journeyStages.length - 1 ? 'is-destination' : ''} key={stage.title}>
      <div className="maintenance-stage-journey__heading"><i>{index + 1}</i><strong>{stage.title}</strong>{stage.soon && <span>Coming soon</span>}</div>
      <p>{stage.description}</p>
      <div className="maintenance-stage-journey__features">{stage.features.map((feature) => <small key={feature}>{feature}</small>)}</div>
    </article>)}
  </div>
}

type JourneyScreen = 'home' | 'progress' | 'routine' | 'learn'

const journeyNavigation: Array<{ label: string; icon: typeof Activity }> = [
  { label: 'Home', icon: HeartPulse },
  { label: 'Progress', icon: Activity },
  { label: 'Routine', icon: Check },
  { label: 'Learn', icon: BookOpen },
]

function MiniTrend() {
  return <svg className="evera-mini-trend" viewBox="0 0 180 62" preserveAspectRatio="none" aria-label="Weight trend">
    <path d="M3 12 C30 16 35 30 61 28 S96 42 119 40 S150 43 177 38 L177 60 L3 60 Z" />
    <path d="M3 12 C30 16 35 30 61 28 S96 42 119 40 S150 43 177 38" />
  </svg>
}

function JourneyNav({ active }: { active: JourneyScreen }) {
  return <nav className="evera-app-nav" aria-label="Evera app preview navigation">{journeyNavigation.map(({ label, icon: Icon }) => <span className={label.toLowerCase() === active ? 'is-active' : ''} key={label}><Icon size={11} /><small>{label}</small></span>)}</nav>
}

function EveraJourneyPhone({ screen }: { screen: JourneyScreen }) {
  return <div className="story-phone evera-journey-phone" aria-label={`Evera ${screen} screen preview`}>
    <div className="story-phone__screen">
      <div className="story-phone__status"><span>9:41</span><span className="story-phone__island" /><span>● ᴡɪ</span></div>
      <header className="evera-screen-header"><span>Evera</span><i>EV</i></header>
      {screen === 'home' && <div className="evera-screen-content">
        <small className="evera-eyebrow">Good morning</small>
        <h4>Your journey</h4>
        <section className="evera-stage-card"><div><small>Current phase</small><strong>Progress</strong></div><span>Next</span><div><small>Preparing for</small><strong>Maintenance</strong></div></section>
        <div className="evera-phone-stages"><span>Starting</span><span>Active</span><span className="is-current">Progress</span><span>Transition</span><span className="is-destination">Maintaining</span></div>
        <section className="evera-weight-card"><div><small>Current weight</small><strong>74.8 kg</strong><em>Maintenance range 74–76 kg</em></div><MiniTrend /></section>
        <p className="evera-block-label">Daily overview</p>
        <div className="evera-overview-grid"><span><Utensils size={12}/>Protein<strong>92g</strong></span><span><Dumbbell size={12}/>Strength<strong>2×</strong></span><span><Moon size={12}/>Sleep<strong>7.6h</strong></span><span><Check size={12}/>Habits<strong>4/5</strong></span></div>
        <div className="evera-next-milestone"><Check size={13}/><span><small>Next milestone</small><strong>Ready for maintenance planning</strong></span></div>
      </div>}
      {screen === 'progress' && <div className="evera-screen-content">
        <small className="evera-eyebrow">Your progress</small><h4>Built to last</h4>
        <section className="evera-weight-card is-large"><div><small>Weight trend</small><strong>74.8 kg</strong><em>Within maintenance range</em></div><MiniTrend /></section>
        <div className="evera-metric-row"><span><small>Starting</small><strong>82 kg</strong></span><span><small>Current</small><strong>74.8 kg</strong></span><span><small>Journey</small><strong>205 days</strong></span></div>
        <p className="evera-block-label">Milestones</p>
        <div className="evera-milestones"><span><Check size={11}/>Goal reached</span><span><Check size={11}/>Routines established</span><span><i/>Maintenance ahead</span></div>
      </div>}
      {screen === 'routine' && <div className="evera-screen-content">
        <small className="evera-eyebrow">Today</small><h4>Your routine</h4><p className="evera-screen-note">Simple behaviors that support your progress.</p>
        <div className="evera-routine-list"><span><Utensils size={15}/><div>Protein<small>Build consistency</small></div><strong>92 / 115g</strong></span><span><Dumbbell size={15}/><div>Strength<small>This week</small></div><strong>2×</strong></span><span><Footprints size={15}/><div>Movement<small>Daily rhythm</small></div><strong>7,800</strong></span><span><Moon size={15}/><div>Sleep<small>Last night</small></div><strong>7.6h</strong></span><span><Check size={15}/><div>Habits<small>Completed</small></div><strong>4 / 5</strong></span></div>
        <button type="button">Complete check-in</button>
      </div>}
      {screen === 'learn' && <div className="evera-screen-content">
        <small className="evera-eyebrow">Learn</small><h4>Prepare with confidence</h4><p className="evera-screen-note">Clear educational guidance for every stage.</p>
        <div className="evera-learn-list"><span><BookOpen size={15}/><div><strong>What happens when GLP-1 treatment ends?</strong><small>6 min read</small></div></span><span><Scale size={15}/><div><strong>Why weight can return after GLP-1</strong><small>5 min read</small></div></span><span><HeartPulse size={15}/><div><strong>How to prepare for maintenance</strong><small>7 min read</small></div></span><span><Dumbbell size={15}/><div><strong>Protein and muscle retention</strong><small>4 min read</small></div></span><span><Check size={15}/><div><strong>Building habits that last</strong><small>5 min read</small></div></span></div>
      </div>}
      <JourneyNav active={screen} />
    </div>
  </div>
}

export function WholeJourneyResearch() {
  return <section className="whole-journey-research">
    <div><p className="phase2-kicker">Why preparation matters</p><strong>60%</strong></div>
    <div><h2>Start preparing before treatment ends.</h2><p>Research found people regained around 60% of the weight they had lost after stopping treatment.</p><span>Evera helps you start preparing for maintenance before treatment ends.</span></div>
  </section>
}

export function PositioningUpcomingVisual({ variant, index }: { variant: Variant; index: number }) {
  if (index === 0) return <div className="positioning-steps-bars">{[6.2, 8.1, 7.4, 9.0, 7.8, 8.5, 6.9].map((value, day) => <div key={day}><i style={{ height: `${value * 7}px` }} /><small>{['M','T','W','T','F','S','S'][day]}</small><span>{value}k</span></div>)}</div>
  if (index === 1) return <div className="positioning-mode"><div>{(variant === 'maintenance' ? ['On treatment', 'Maintaining'] : ['Starting', 'Active', 'Transition', 'Maintaining']).map((item, itemIndex, list) => <span className={itemIndex === list.length - 1 ? 'is-selected' : ''} key={item}>{item}</span>)}</div><HabitTiles journey={variant === 'whole-journey'} /></div>
  return <div className="positioning-guidance"><Footprints size={28} /><div><strong>{variant === 'maintenance' ? 'Why movement matters now' : 'Movement through every stage'}</strong><span>{variant === 'maintenance' ? 'Walking and strength support an active routine.' : 'During treatment · Build consistency'}</span><span>{variant === 'maintenance' ? 'Educational guidance, not a workout plan.' : 'Maintaining · Keep movement in your routine'}</span></div></div>
}
