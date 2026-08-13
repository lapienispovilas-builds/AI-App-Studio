import {
  Activity,
  ArrowRight,
  Check,
  Droplets,
  Footprints,
  HeartPulse,
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
      <div className="maintenance-research-hero__label">Research after treatment</div>
      <strong className="maintenance-research-hero__stat">60%</strong>
      <p>Research found people regained around 60% of the weight they had lost after stopping treatment.</p>
      <div className="maintenance-research-hero__value">TrackGLP is being built to help you maintain your progress after treatment.</div>
    </div>
  }

  const journeyStages = [
    ['Starting', 'Baseline · Goals'],
    ['Active treatment', 'Dose · Symptoms · Reminders'],
    ['Progress', 'Weight · Protein · Water · Movement'],
    ['Treatment changes', 'History stays with you'],
    ['Maintaining', 'Movement · Habits · Progress'],
  ]
  const highlightedStage = 2
  return <div className="positioning-hero-visual positioning-longitudinal-hero" aria-label="TrackGLP whole journey timeline">
    <div className="positioning-dashboard-top"><span>Your journey</span><strong>One connected history</strong></div>
    <div className="longitudinal-journey">{journeyStages.map(([stage, details], index) => <article className={index === highlightedStage ? 'is-current' : ''} key={stage}><i /><div><strong>{stage}</strong><small>{details}</small></div></article>)}</div>
    <div className="journey-evidence"><small>Why the later stages matter</small><strong>~⅔ of prior weight loss was regained one year after semaglutide withdrawal in the STEP 1 extension.</strong><span>Population-level research finding</span></div>
    <p className="journey-product-note">TrackGLP is being designed for the full timeline—not only the medication phase.</p>
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

export function MaintenanceFeatureGrid({ features }: { features: Array<{ title: string; description: string }> }) {
  return <div className="maintenance-feature-grid">
    {features.map((feature, index) => <article key={feature.title}>
      <span className="maintenance-coming-soon">Coming soon</span>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      <PositioningUpcomingVisual variant="maintenance" index={index} />
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
  if (variant === 'maintenance') return <ProductScreen screen={screen} />
  if (index === 0) return <ProductScreen screen={screen} />
  if (index === 1) return <ConnectedDetails variant={variant} />
  return <JourneyMap variant={variant} detailed />
}

export function PositioningDifferenceVisual({ variant }: { variant: Variant }) {
  if (variant === 'whole-journey') return <div className="positioning-aggregation"><div>{['Dose history', 'Weight', 'Symptoms', 'Habits', 'Movement'].map((item) => <span key={item}>{item}</span>)}</div><i><ArrowRight /></i><strong>Your GLP-1 journey<small>One timeline</small></strong></div>
  const maintenanceStages = [
    { title: 'On treatment', description: 'Track doses, weight, symptoms and daily habits.', features: ['Dose', 'Weight', 'Symptoms', 'Reminders'] },
    { title: 'Transition', description: 'Keep your history while priorities shift toward habits and movement.', features: ['History', 'Weight trend', 'Movement', 'Habits'], soon: true },
    { title: 'Maintaining', description: 'Keep movement, habits and long-term progress visible after treatment.', features: ['Movement', 'Protein', 'Hydration', 'Consistency'], soon: true },
  ]
  return <div className="maintenance-stage-journey">
    {maintenanceStages.map((stage, index) => <article key={stage.title}>
      <div className="maintenance-stage-journey__heading"><i>{index + 1}</i><strong>{stage.title}</strong>{stage.soon && <span>Coming soon</span>}</div>
      <p>{stage.description}</p>
      <div className="maintenance-stage-journey__features">{stage.features.map((feature) => <small key={feature}>{feature}</small>)}</div>
    </article>)}
  </div>
}

export function PositioningUpcomingVisual({ variant, index }: { variant: Variant; index: number }) {
  if (index === 0) return <div className="positioning-steps-bars">{[6.2, 8.1, 7.4, 9.0, 7.8, 8.5, 6.9].map((value, day) => <div key={day}><i style={{ height: `${value * 7}px` }} /><small>{['M','T','W','T','F','S','S'][day]}</small><span>{value}k</span></div>)}</div>
  if (index === 1) return <div className="positioning-mode"><div>{(variant === 'maintenance' ? ['On treatment', 'Maintaining'] : ['Starting', 'Active', 'Maintaining']).map((item, itemIndex, list) => <span className={itemIndex === list.length - 1 ? 'is-selected' : ''} key={item}>{item}</span>)}</div><HabitTiles journey={variant === 'whole-journey'} /></div>
  return <div className="positioning-guidance"><Footprints size={28} /><div><strong>{variant === 'maintenance' ? 'Why movement matters now' : 'Movement through every stage'}</strong><span>{variant === 'maintenance' ? 'Walking and strength support an active routine.' : 'During treatment · Build consistency'}</span><span>{variant === 'maintenance' ? 'Educational guidance, not a workout plan.' : 'Maintaining · Keep movement in your routine'}</span></div></div>
}
