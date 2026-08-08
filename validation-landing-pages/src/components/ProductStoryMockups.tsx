import {
  BatteryMedium,
  BellRing,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  ChevronLeft,
  Coffee,
  Footprints,
  GlassWater,
  Heart,
  Home,
  Laptop,
  MapPin,
  MessageCircle,
  Moon,
  Navigation,
  Route,
  Scale,
  Signal,
  Sparkles,
  Syringe,
  Trophy,
  Utensils,
  UserRound,
  Wifi,
} from 'lucide-react'
import type { LandingScenario, ProductScreenConfig } from '../phase2LandingPageConfig'

function ScreenIcon({ mode }: { mode: ProductScreenConfig['mode'] }) {
  if (mode === 'question' || mode === 'reply') return <MessageCircle size={15} />
  if (mode === 'journey' || mode === 'map' || mode === 'confirmation') return <MapPin size={15} />
  if (mode === 'form' || mode === 'checklist') return <Syringe size={15} />
  return <Sparkles size={15} />
}

function MiniChart({ points = [70, 56, 61, 42, 48, 31, 24] }: { points?: number[] }) {
  const coordinates = points.map((point, index) => `${index * (100 / (points.length - 1))},${point}`).join(' ')
  return (
    <div className="story-chart" aria-hidden="true">
      <svg viewBox="0 0 100 90" preserveAspectRatio="none">
        <defs><linearGradient id="story-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".25" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,90 ${coordinates} 100,90`} fill="url(#story-chart-fill)" />
        <polyline points={coordinates} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div><span>Week 1</span><span>Today</span></div>
    </div>
  )
}

export function ProductScreen({ screen, compact = false }: { screen: ProductScreenConfig; compact?: boolean }) {
  return (
    <div className={compact ? 'story-phone story-phone--compact' : 'story-phone'}>
      <div className="story-phone__screen">
        <div className="story-status"><strong>9:41</strong><i /><span><Signal size={8} /><Wifi size={8} /><BatteryMedium size={10} /></span></div>
        <div className="story-appbar"><ChevronLeft size={15} /><span><ScreenIcon mode={screen.mode} /></span></div>

        {screen.mode === 'map' && (
          <div className="story-map" aria-hidden="true">
            <span className="story-map__park story-map__park--one" />
            <span className="story-map__park story-map__park--two" />
            <span className="story-map__water" />
            <span className="story-map__road story-map__road--one" />
            <span className="story-map__road story-map__road--two" />
            <span className="story-map__road story-map__road--three" />
            <span className="story-map__road story-map__road--four" />
            <span className="story-map__street story-map__street--one">King St</span>
            <span className="story-map__street story-map__street--two">Park Rd</span>
            <svg className="story-map__route" viewBox="0 0 180 92" preserveAspectRatio="none">
              <path d="M20 72 C42 65 43 42 70 44 S103 64 124 47 S140 22 162 18" />
            </svg>
            <span className="story-map__start"><Navigation size={9} /></span>
            <span className="story-map__end"><Home size={11} /></span>
            <span className="story-map__eta"><strong>12 min</strong><small>2.4 km · Home</small></span>
          </div>
        )}

        <div className="story-screen-copy">
          <small>{screen.eyebrow}</small>
          <h4>{screen.title}</h4>
          {screen.primary && <strong>{screen.primary}</strong>}
          {screen.secondary && <p>{screen.secondary}</p>}
        </div>

        {screen.mode === 'question' && <div className="story-answer-lines"><span /><span /><span /></div>}
        {screen.chart && <MiniChart points={screen.chart} />}

        {screen.rows && (
          <div className="story-rows">
            {screen.rows.map((row) => <div key={row.label}><span>{row.label}</span><strong>{row.value}</strong></div>)}
          </div>
        )}

        {screen.mode === 'reply' && <div className="story-partners"><span>J</span><i /><span>Y</span></div>}

        {screen.notification && (
          <div className="story-notification">
            <span><Check size={12} /></span><div><strong>{screen.notification.title}</strong><small>{screen.notification.body}</small></div>
          </div>
        )}

        {screen.action && <div className="story-action">{screen.action}</div>}
        <div className="story-home-indicator" />
      </div>
    </div>
  )
}

function SceneIllustration({ illustration, image }: { illustration: LandingScenario['illustration']; image?: string }) {
  if (image) {
    return (
      <div className={`story-scene story-scene--photo story-scene--${illustration}`} aria-hidden="true">
        <img src={image} alt="" />
        <span className="story-scene__shade" />
      </div>
    )
  }

  return (
    <div className={`story-scene story-scene--${illustration}`} aria-hidden="true">
      {illustration === 'glp-injection' && <><div className="scene-date"><small>Today</small><strong>08</strong></div><Syringe className="scene-injection" size={50} /><div className="scene-timeline"><i /><i /><i /></div><span className="scene-check"><Check size={16} /></span></>}
      {illustration === 'glp-habits' && <div className="scene-habit-grid"><span><Utensils /><small>Protein</small></span><span><GlassWater /><small>Water</small></span><span><Footprints /><small>Walk</small></span><span><Moon /><small>Sleep</small></span></div>}
      {illustration === 'glp-progress' && <><div className="scene-progress-chart"><i /><i /><i /><i /><i /></div><Scale className="scene-scale" size={32} /><span className="scene-milestone"><Trophy size={16} /> Week 8</span></>}

      {illustration === 'couple-busy' && <><CalendarDays className="scene-calendar" size={33} /><Laptop className="scene-laptop" size={52} /><div className="scene-couple"><span><UserRound /></span><span><UserRound /></span></div><Coffee className="scene-coffee" size={26} /><span className="scene-ping"><Heart size={13} /></span></>}
      {illustration === 'couple-answering' && <><div className="scene-person scene-person--left"><UserRound /><span>Answering…</span></div><div className="scene-question"><MessageCircle size={20} /><strong>Today’s question</strong></div><div className="scene-person scene-person--right"><UserRound /><span>Answered</span></div><span className="scene-connection"><Heart size={15} /></span></>}
      {illustration === 'couple-dinner' && <><div className="scene-dinner-people"><span><UserRound /></span><span><UserRound /></span></div><div className="scene-dinner-table"><i /><i /><Coffee size={20} /></div><div className="scene-warm-chat"><MessageCircle size={18} /><Heart size={13} /></div></>}

      {illustration === 'taxi-night' && <><Moon className="scene-moon" size={25} /><div className="scene-taxi"><CarFront size={56} /><span><UserRound size={18} /></span></div><Route className="scene-route" size={74} /><MapPin className="scene-destination" size={25} /><span className="scene-sent"><Check size={13} /> Sent</span></>}
      {illustration === 'coffee-date' && <><div className="scene-cafe"><span><UserRound /></span><div><Coffee size={27} /></div><span><UserRound /></span></div><div className="scene-location-share"><MapPin size={15} /><strong>Shared with Maya</strong></div><span className="scene-cafe-check"><CheckCircle2 size={22} /></span></>}
      {illustration === 'walk-home' && <><Moon className="scene-moon" size={24} /><div className="scene-street"><i /><i /><i /></div><Footprints className="scene-walker" size={35} /><MapPin className="scene-walk-pin" size={24} /><Home className="scene-home" size={39} /><span className="scene-safe"><Check size={14} /> Safe home</span></>}
    </div>
  )
}

export function ScenarioStory({ scenario }: { scenario: LandingScenario }) {
  const isGlp = scenario.illustration.startsWith('glp-')
  const isTravel = ['taxi-night', 'coffee-date', 'walk-home'].includes(scenario.illustration)
  const secondLabel = scenario.screen.rows?.[0]?.label ?? (isTravel ? 'Automatic check-in' : 'Small daily action')
  const secondValue = scenario.screen.rows?.[0]?.value ?? scenario.screen.primary ?? scenario.screen.secondary ?? 'In progress'
  const finalLabel = scenario.screen.notification?.title ?? 'Outcome'
  const finalValue = scenario.screen.notification?.body ?? scenario.screen.action ?? scenario.screen.secondary ?? 'Complete'

  return (
    <article className={`scenario-story scenario-story--${scenario.illustration}${scenario.image ? ' scenario-story--photo' : ''}`}>
      <div className="scenario-story__label"><Check size={16} /><span>{scenario.title}</span></div>
      <div className="scenario-story__visual">
        <SceneIllustration illustration={scenario.illustration} image={scenario.image} />
        {isGlp ? (
          <div className="scenario-data-panel" aria-label={`${scenario.title} details`}>
            <div className="scenario-data-panel__heading"><small>{scenario.screen.eyebrow}</small><strong>{scenario.screen.title}</strong></div>
            {scenario.screen.primary && <div className="scenario-data-panel__metric"><strong>{scenario.screen.primary}</strong><span>{scenario.screen.secondary}</span></div>}
            {scenario.screen.rows?.map((row) => <div className="scenario-data-panel__row" key={row.label}><span>{row.label}</span><strong>{row.value}</strong></div>)}
            {scenario.screen.chart && <MiniChart points={scenario.screen.chart} />}
            {scenario.screen.action && <div className="scenario-data-panel__action">{scenario.screen.action}</div>}
            {scenario.screen.notification && <div className="scenario-data-panel__result"><CheckCircle2 size={14} /><span><strong>{scenario.screen.notification.title}</strong><small>{scenario.screen.notification.body}</small></span></div>}
          </div>
        ) : <div className="scenario-flow" aria-label={`${scenario.title} story`}>
          <div className="scenario-flow__card"><span><ScreenIcon mode={scenario.screen.mode} /></span><p><small>{scenario.screen.eyebrow}</small><strong>{scenario.screen.title}</strong></p></div>
          <i>↓</i>
          <div className="scenario-flow__card"><span><BellRing size={14} /></span><p><small>{secondLabel}</small><strong>{secondValue}</strong></p></div>
          <i>↓</i>
          <div className="scenario-flow__card scenario-flow__card--result"><span><CheckCircle2 size={14} /></span><p><small>{finalLabel}</small><strong>{finalValue}</strong></p></div>
        </div>}
      </div>
    </article>
  )
}
