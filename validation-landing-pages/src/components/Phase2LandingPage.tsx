import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, Bell, ChartNoAxesCombined, Check, Clock3, Heart, LockKeyhole, MessageCircle, Quote, Sparkles, Target, UsersRound, type LucideIcon } from 'lucide-react'
import type { LandingBenefitIcon, Phase2LandingPageConfig } from '../phase2LandingPageConfig'
import { trackMetaEvent, trackMetaLead } from '../lib/metaPixel'
import { submitLead } from '../lib/submitLead'
import { OutcomeMockup } from './OutcomeMockup'
import { ProductScreen, ScenarioStory } from './ProductStoryMockups'
import {
  PositioningDifferenceVisual,
  PositioningHero,
  PositioningHowVisual,
  PositioningFeatureGrid,
  PositioningStoryGrid,
  PositioningUpcomingVisual,
  WholeJourneyResearch,
} from './TrackGlpPositioningVisuals'
import { MaintenanceHeroVisual, TrackGlpMaintenanceSections } from './TrackGlpMaintenanceSections'
import { EveraMaintenanceQuiz } from './EveraMaintenanceQuiz'
import { trackEveraEvent } from '../lib/posthogAnalytics'

const benefitIcons: Record<LandingBenefitIcon, LucideIcon> = {
  bell: Bell,
  chart: ChartNoAxesCombined,
  check: Check,
  clock: Clock3,
  heart: Heart,
  lock: LockKeyhole,
  message: MessageCircle,
  sparkles: Sparkles,
  target: Target,
}

function highlightPhrase(text: string, phrase?: string) {
  if (!phrase) return text
  const index = text.indexOf(phrase)
  if (index === -1) return text

  return <>{text.slice(0, index)}<span className="phase2-highlight">{phrase}</span>{text.slice(index + phrase.length)}</>
}

export function Phase2LandingPage({ config }: { config: Phase2LandingPageConfig }) {
  const isMaintenance = config.landingVariant === 'maintenance'
  const locale = config.slug === 'dk' ? 'da' : 'en'
  const isPositioning = Boolean(config.landingVariant)
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [maintenanceFlow, setMaintenanceFlow] = useState<'quiz' | 'login' | null>(() => new URLSearchParams(window.location.search).get('signin') === '1' ? 'login' : null)
  const hasTrackedLead = useRef(false)
  const heroRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  function startMaintenanceQuiz() {
    trackMetaEvent('QuizStarted', { quiz_name: 'evera_maintenance' }, { custom: true, onceKey: 'quiz_started' })
    // PostHog funnel: the hero/section CTA begins the Evera assessment.
    trackEveraEvent('hero_cta_clicked', { cta_location: 'landing_page' })
    trackEveraEvent('quiz_started', { quiz_name: 'evera_maintenance' }, 'quiz_started')
    setMaintenanceFlow('quiz')
  }

  useEffect(() => {
    function updateStickyCta() {
      if (!window.matchMedia('(max-width: 520px)').matches) {
        setShowStickyCta(false)
        return
      }

      const heroHasPassed = (heroRef.current?.getBoundingClientRect().bottom ?? 1) < 0
      const footerIsNear = (footerRef.current?.getBoundingClientRect().top ?? Infinity) < window.innerHeight + 24
      setShowStickyCta(heroHasPassed && !footerIsNear)
    }

    updateStickyCta()
    window.addEventListener('scroll', updateStickyCta, { passive: true })
    window.addEventListener('resize', updateStickyCta)
    return () => {
      window.removeEventListener('scroll', updateStickyCta)
      window.removeEventListener('resize', updateStickyCta)
    }
  }, [])

  useEffect(() => {
    if (!isMaintenance) return
    const previousTitle = document.title
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = description?.content
    const previousLang = document.documentElement.lang
    document.documentElement.lang = locale
    document.title = locale === 'da' ? 'Evera | Personligt GLP-1-vedligeholdelsesprogram' : 'Evera | Personalized GLP-1 Maintenance Program'
    if (description) description.content = locale === 'da' ? 'Skab en personlig GLP-1-vedligeholdelsesplan med Evera.' : 'Build a personalized GLP-1 maintenance plan with Evera.'
    return () => {
      document.documentElement.lang = previousLang
      document.title = previousTitle
      if (description && previousDescription) description.content = previousDescription
    }
  }, [isMaintenance, locale])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (config.questions.some((question) => !answers[question.id])) {
      setError(isMaintenance ? 'Please answer each question to build your plan.' : 'Please answer each question before joining early access.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await submitLead({
        idea: config.brand,
        page: `/${config.slug}`,
        email: email.trim(),
        answers: Object.fromEntries(
          [
            ...config.questions.map((question) => [question.label, answers[question.id]]),
            ...(config.landingVariant ? [['landingVariant', config.landingVariant]] : []),
          ],
        ),
      })
      if (!hasTrackedLead.current) {
        hasTrackedLead.current = trackMetaLead()
      }
      setSubmitted(true)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={config.landingVariant ? `phase2-page phase2-page--positioning phase2-page--${config.landingVariant}` : 'phase2-page'} style={{
      '--accent': config.accent,
      '--accent-soft': config.accentSoft,
      '--accent-deep': config.accentDeep ?? config.accent,
      '--page-text': config.textColor ?? '#191a20',
      '--muted-text': config.mutedText ?? '#6f7078',
      '--page-background': config.pageBackground ?? '#ffffff',
    } as React.CSSProperties}>
      <header className="phase2-topbar">
        <div className="phase2-brand"><img src={config.logo} alt="" /><span>{config.brand}</span></div>
        {isMaintenance && <button className="phase2-topbar__login" type="button" onClick={() => setMaintenanceFlow('login')}>{locale === 'da' ? 'Log ind' : 'Sign in'}</button>}
      </header>

      <section className="phase2-hero" ref={heroRef}>
        <div className="phase2-hero__copy">
          <p className="phase2-kicker">{config.heroKicker}</p>
          <h1>{highlightPhrase(config.headline, config.heroHighlight)}</h1>
          <p>{highlightPhrase(config.subheadline, config.subheadlineHighlight)}</p>
          {isMaintenance
            ? <button className="phase2-button" type="button" onClick={startMaintenanceQuiz}>{config.cta} <span>→</span></button>
            : <a className="phase2-button" href="#early-access">{config.cta} <span>→</span></a>}
          <small>{config.ctaSubtitle ?? config.ctaReassurance}</small>
        </div>

        {isMaintenance
          ? <MaintenanceHeroVisual locale={locale} />
          : config.landingVariant
            ? <PositioningHero variant={config.landingVariant} />
            : <OutcomeMockup config={config.mockup} logo={config.logo} />}
      </section>

      {isMaintenance && <TrackGlpMaintenanceSections onStartQuiz={startMaintenanceQuiz} locale={locale} />}

      {!isMaintenance && config.problem && (
        <section className="phase2-problem">
          <div className="phase2-section-heading">
            <p className="phase2-kicker">{config.problem.kicker}</p>
            <h2>{highlightPhrase(config.problem.headline, config.problem.headlineHighlight)}</h2>
            <p>{config.problem.description}</p>
          </div>
          {config.landingVariant && config.upcomingFeatures
            ? <PositioningFeatureGrid variant={config.landingVariant} features={config.upcomingFeatures.cards} />
            : config.landingVariant
              ? <PositioningStoryGrid variant={config.landingVariant} />
            : <div className="phase2-situations">{config.problem.situations.map((situation) => <ScenarioStory key={situation.title} scenario={situation} />)}</div>}
        </section>
      )}

      {!isMaintenance && config.howItWorks && (
        <section className="phase2-how">
          <div className="phase2-section-heading phase2-section-heading--center">
            <p className="phase2-kicker">How it works</p>
            <h2>{highlightPhrase(config.howHeadline ?? 'From today’s action to a clearer outcome.', config.howHighlight)}</h2>
          </div>
          <div className="phase2-steps">
            {config.howItWorks.map((step, index) => (
              <article key={step.title}>
                <div className="phase2-step-copy">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {config.landingVariant
                  ? <PositioningHowVisual variant={config.landingVariant} index={index} screen={step.screen} />
                  : <ProductScreen screen={step.screen} />}
              </article>
            ))}
          </div>
        </section>
      )}

      {config.landingVariant === 'whole-journey' && <WholeJourneyResearch />}

      {!isPositioning && (
        <section className="phase2-benefits" aria-label="Benefits">
          {config.benefits.map((benefit) => {
            const Icon = benefitIcons[benefit.icon]
            return <article key={benefit.title}><span><Icon size={21} strokeWidth={2.3} /></span><h2>{benefit.title}</h2><p>{benefit.description}</p></article>
          })}
        </section>
      )}

      {config.upcomingFeatures && !isPositioning && (
        <section className="phase2-upcoming">
          <div className="phase2-section-heading phase2-section-heading--center">
            <p className="phase2-kicker">Upcoming features</p>
            <h2>{config.upcomingFeatures.headline}</h2>
          </div>
          <div className="phase2-upcoming__grid">
            {config.upcomingFeatures.cards.map((feature, index) => (
              <article key={feature.title}>
                <span>Coming soon</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {config.landingVariant && <PositioningUpcomingVisual variant={config.landingVariant} index={index} />}
              </article>
            ))}
          </div>
        </section>
      )}

      {!isMaintenance && config.difference && (
        <section className="phase2-difference">
          <div className="phase2-difference__copy">
            <p className="phase2-kicker">Why this is different</p>
            <h2>{highlightPhrase(config.difference.headline, config.difference.headlineHighlight)}</h2>
            <p>{config.difference.description}</p>
          </div>
          {!isPositioning && <div className="phase2-comparisons">
            {config.difference.comparisons.map((comparison) => (
              <article key={comparison.current}>
                <span>{comparison.current}</span>
                <ArrowRight size={18} />
                <strong>{comparison.better}</strong>
              </article>
            ))}
          </div>}
          {config.landingVariant
            ? <div className="phase2-difference__visual"><PositioningDifferenceVisual variant={config.landingVariant} /></div>
            : config.howItWorks?.[2] && <div className="phase2-difference__phone"><ProductScreen screen={config.howItWorks[2].screen} /></div>}
        </section>
      )}

      {!isMaintenance && <section className="phase2-signup" id="early-access">
        <div className="phase2-signup__intro">
          <p className="phase2-kicker">{isMaintenance ? 'Personalized assessment' : 'Early access'}</p>
          <h2>{config.signupHeadline ?? config.headline}</h2>
          <div className="phase2-proof-badge"><UsersRound size={16} /> {isMaintenance ? 'A few questions · personalized result' : 'Built with early users'}</div>
          <p>{config.socialProof}</p>
          {config.trustNote && <p className="phase2-trust-note"><LockKeyhole size={16} /> <span>{config.trustNote}</span></p>}
        </div>

        <div className="phase2-form-card">
          {submitted ? (
            <div className="phase2-success" role="status">
              <span>✓</span>
              <h2>{isMaintenance ? 'Your answers are saved.' : "You're on the list."}</h2>
              <p>{isMaintenance ? 'Thank you. Your answers will shape your Evera maintenance plan.' : `Thanks for helping shape ${config.brand}.`}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor={`${config.slug}-email`}>Email</label>
              <input
                id={`${config.slug}-email`}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(error && !email)}
              />

              {config.questions.map((question) => (
                <fieldset key={question.id}>
                  <legend>{question.label}</legend>
                  <div className="phase2-options">
                    {question.options.map((option) => (
                      <label className={answers[question.id] === option ? 'phase2-option phase2-option--selected' : 'phase2-option'} key={option}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              {error && <p className="phase2-form-error" role="alert">{error}</p>}
              <button className="phase2-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isMaintenance ? 'Building…' : 'Joining…') : config.cta} {!isSubmitting && <span>→</span>}
              </button>
            </form>
          )}
        </div>
      </section>}

      {!isMaintenance && config.testimonials && (
        <section className="phase2-testimonials">
          <div className="phase2-section-heading phase2-section-heading--center">
            <p className="phase2-kicker">Early-access perspectives</p>
            <h2>Why people want this.</h2>
            <p>Feedback from early users of the app</p>
          </div>
          <div className="phase2-testimonial-grid">
            {config.testimonials.map((testimonial, index) => (
              <article key={`${testimonial.name}-${index}`}>
                <Quote size={28} aria-hidden="true" />
                <blockquote>“{testimonial.quote}”</blockquote>
                <footer>
                  <img className="phase2-avatar" src={testimonial.avatar} alt={`Portrait of ${testimonial.name.split(' - ')[0]}`} />
                  <div><strong>{testimonial.name}</strong><small>{testimonial.descriptor}</small></div>
                </footer>
              </article>
            ))}
          </div>
        </section>
      )}

      {!isMaintenance && <section className="phase2-faq">
        <p className="phase2-kicker">FAQ</p>
        <h2>Questions, answered.</h2>
        <div className="phase2-faq__list">
          {config.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>}

      {!isMaintenance && config.finalCta && (
        <section className="phase2-final-cta">
          <img src={config.logo} alt="" />
          <h2>{highlightPhrase(config.finalCta.headline, config.finalCta.headlineHighlight)}</h2>
          <p>{config.finalCta.description}</p>
          <a className="phase2-button" href="#early-access">{config.finalCta.cta ?? config.cta} <span>→</span></a>
          <small>{config.ctaReassurance}</small>
        </section>
      )}

      <footer className="phase2-footer" ref={footerRef}>
        <div className="phase2-brand"><img src={config.logo} alt="" /><span>{config.brand}</span></div>
        <div className="phase2-footer__legal" aria-label="Legal information">
          <span>{locale === 'da' ? 'Privatlivspolitik' : 'Privacy Statement'}</span>
          <span>{locale === 'da' ? 'Vilkår og betingelser' : 'Terms and Conditions'}</span>
          <span>{locale === 'da' ? 'DMCA-politik' : 'DMCA Policy'}</span>
          <span>{locale === 'da' ? 'Sælg ikke mine oplysninger' : 'Do Not Sell My Info'}</span>
        </div>
      </footer>

      {isMaintenance
        ? <button className={showStickyCta ? 'phase2-sticky-cta is-visible' : 'phase2-sticky-cta'} type="button" onClick={startMaintenanceQuiz}>{config.stickyCta} <span>→</span></button>
        : <a className={showStickyCta ? 'phase2-sticky-cta is-visible' : 'phase2-sticky-cta'} href="#early-access">{config.stickyCta} <span>→</span></a>}
      {isMaintenance && maintenanceFlow && <EveraMaintenanceQuiz locale={locale} initialView={maintenanceFlow === 'login' ? 'login' : 'question'} onClose={() => setMaintenanceFlow(null)} />}
    </main>
  )
}
