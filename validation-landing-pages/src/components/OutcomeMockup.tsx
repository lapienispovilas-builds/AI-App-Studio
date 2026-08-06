import {
  Activity,
  BarChart3,
  BatteryFull,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  CircleUserRound,
  ContactRound,
  Droplets,
  Flame,
  HeartPulse,
  History,
  Home,
  Leaf,
  MapPinCheck,
  MessageCircle,
  MessagesSquare,
  Radio,
  Signal,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import type { OutcomeMockupConfig, OutcomeMockupIcon } from '../phase2LandingPageConfig'

const featureIcons: Record<OutcomeMockupIcon, LucideIcon> = {
  'calendar-history': CalendarDays,
  'chat-bubble': MessageCircle,
  'chat-bubbles': MessagesSquare,
  'contact-group': ContactRound,
  'down-chart': TrendingDown,
  'flame-progress': Flame,
  'heart-trend': HeartPulse,
  'insight-chart': BarChart3,
  'leaf-check': Leaf,
  'location-check': MapPinCheck,
  'medical-drop': Droplets,
  'scenario-cards': Sparkles,
  'smiley': CircleUserRound,
  'up-chart': TrendingUp,
  'water-nutrition': Activity,
}

const navigationIcons: Record<string, LucideIcon> = {
  Coach: Sparkles,
  Contacts: UsersRound,
  Habits: Target,
  History,
  Home,
  Insights: BarChart3,
  Practice: MessagesSquare,
  Profile: UserRound,
  Progress: ChartNoAxesCombined,
  Prompts: MessageCircle,
  Today: Home,
  Trends: TrendingUp,
}

export function OutcomeMockup({ config, logo }: { config: OutcomeMockupConfig; logo: string }) {
  return (
    <div className="outcome-phone" aria-label={`${config.appName} app preview`}>
      <div className="outcome-phone__screen">
        <div className="outcome-statusbar" aria-hidden="true">
          <strong>9:41</strong>
          <div className="outcome-island" />
          <span><Signal size={11} strokeWidth={2.6} /><Radio size={10} strokeWidth={2.6} /><BatteryFull size={14} strokeWidth={2.4} /></span>
        </div>

        <div className="outcome-appbar">
          <div><img src={logo} alt="" /><strong>{config.appName}</strong></div>
          <span className="outcome-avatar"><UserRound size={14} /></span>
        </div>

        <section className="outcome-hero-card">
          <p>{config.hero.label}</p>
          <strong>{config.hero.value}</strong>
          <span>{config.hero.supporting}</span>
        </section>

        <section className="outcome-today-card">
          <span className="outcome-today-card__check"><Check size={14} strokeWidth={3} /></span>
          <div><p>{config.today.title}</p><strong>{config.today.status}</strong><small>{config.today.secondary}</small></div>
        </section>

        {config.smallMetrics && (
          <div className="outcome-mini-metrics">
            {config.smallMetrics.map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}
          </div>
        )}

        <div className="outcome-features">
          {config.features.map((feature) => {
            const Icon = featureIcons[feature.icon]
            return (
              <article key={feature.title}>
                <span className="outcome-feature-icon"><Icon size={15} strokeWidth={2.25} /></span>
                <div><strong>{feature.title}</strong><p>{feature.description}</p></div>
              </article>
            )
          })}
        </div>

        <p className="outcome-message"><Sparkles size={13} />{config.outcome}</p>

        <nav className="outcome-nav" aria-label={`${config.appName} preview navigation`}>
          {config.navigation.map((item, index) => {
            const Icon = navigationIcons[item] ?? Home
            return <span className={index === 0 ? 'is-active' : ''} key={item}><Icon size={14} strokeWidth={2.2} /><small>{item}</small></span>
          })}
        </nav>
      </div>
    </div>
  )
}
