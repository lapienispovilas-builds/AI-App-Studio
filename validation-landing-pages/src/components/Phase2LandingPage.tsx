import { FormEvent, useRef, useState } from 'react'
import { ArrowRight, Bell, ChartNoAxesCombined, Check, Clock3, Heart, LockKeyhole, MessageCircle, Quote, Sparkles, Target, UsersRound, type LucideIcon } from 'lucide-react'
import type { LandingBenefitIcon, Phase2LandingPageConfig } from '../phase2LandingPageConfig'
import { trackMetaLead } from '../lib/metaPixel'
import { submitLead } from '../lib/submitLead'
import { OutcomeMockup } from './OutcomeMockup'
import { ProductScreen, ScenarioStory } from './ProductStoryMockups'

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

function SectionCta({ brand, text, reassurance }: { brand: string; text: string; reassurance: string }) {
  return (
    <section className="phase2-inline-cta">
      <div>
        <small>{brand} early access</small>
        <h2>{text}</h2>
      </div>
      <div className="phase2-inline-cta__action">
        <a className="phase2-button" href="#early-access">Join early access <span>→</span></a>
        <small>{reassurance}</small>
      </div>
    </section>
  )
}

export function Phase2LandingPage({ config }: { config: Phase2LandingPageConfig }) {
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const hasTrackedLead = useRef(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (config.questions.some((question) => !answers[question.id])) {
      setError('Please answer each question before joining early access.')
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
          config.questions.map((question) => [question.label, answers[question.id]]),
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
    <main className="phase2-page" style={{
      '--accent': config.accent,
      '--accent-soft': config.accentSoft,
      '--accent-deep': config.accentDeep ?? config.accent,
      '--page-text': config.textColor ?? '#191a20',
      '--muted-text': config.mutedText ?? '#6f7078',
      '--page-background': config.pageBackground ?? '#ffffff',
    } as React.CSSProperties}>
      <header className="phase2-topbar">
        <div className="phase2-brand"><img src={config.logo} alt="" /><span>{config.brand}</span></div>
      </header>

      <section className="phase2-hero">
        <div className="phase2-hero__copy">
          <p className="phase2-kicker">{config.heroKicker}</p>
          <h1>{highlightPhrase(config.headline, config.heroHighlight)}</h1>
          <p>{highlightPhrase(config.subheadline, config.subheadlineHighlight)}</p>
          <a className="phase2-button" href="#early-access">{config.cta} <span>→</span></a>
          <small>{config.ctaSubtitle ?? config.ctaReassurance}</small>
        </div>

        <OutcomeMockup config={config.mockup} logo={config.logo} />
      </section>

      {config.problem && (
        <section className="phase2-problem">
          <div className="phase2-section-heading">
            <p className="phase2-kicker">{config.problem.kicker}</p>
            <h2>{highlightPhrase(config.problem.headline, config.problem.headlineHighlight)}</h2>
            <p>{config.problem.description}</p>
          </div>
          <div className="phase2-situations">
            {config.problem.situations.map((situation) => <ScenarioStory key={situation.title} scenario={situation} />)}
          </div>
        </section>
      )}

      {config.problem && <SectionCta brand={config.brand} text={config.sectionCtas.afterProblem} reassurance={config.ctaReassurance} />}

      {config.howItWorks && (
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
                <ProductScreen screen={step.screen} />
              </article>
            ))}
          </div>
        </section>
      )}

      {config.howItWorks && <SectionCta brand={config.brand} text={config.sectionCtas.afterHow} reassurance={config.ctaReassurance} />}

      <section className="phase2-benefits" aria-label="Benefits">
        {config.benefits.map((benefit) => {
          const Icon = benefitIcons[benefit.icon]
          return <article key={benefit.title}><span><Icon size={21} strokeWidth={2.3} /></span><h2>{benefit.title}</h2><p>{benefit.description}</p></article>
        })}
      </section>

      {config.difference && (
        <section className="phase2-difference">
          <div className="phase2-difference__copy">
            <p className="phase2-kicker">Why this is different</p>
            <h2>{highlightPhrase(config.difference.headline, config.difference.headlineHighlight)}</h2>
            <p>{config.difference.description}</p>
          </div>
          <div className="phase2-comparisons">
            {config.difference.comparisons.map((comparison) => (
              <article key={comparison.current}>
                <span>{comparison.current}</span>
                <ArrowRight size={18} />
                <strong>{comparison.better}</strong>
              </article>
            ))}
          </div>
          {config.howItWorks?.[2] && <div className="phase2-difference__phone"><ProductScreen screen={config.howItWorks[2].screen} /></div>}
        </section>
      )}

      <section className="phase2-signup" id="early-access">
        <div className="phase2-signup__intro">
          <p className="phase2-kicker">Early access</p>
          <h2>{config.headline}</h2>
          <div className="phase2-proof-badge"><UsersRound size={16} /> Built with early users</div>
          <p>{config.socialProof}</p>
          {config.trustNote && <p className="phase2-trust-note"><LockKeyhole size={16} /> <span>{config.trustNote}</span></p>}
        </div>

        <div className="phase2-form-card">
          {submitted ? (
            <div className="phase2-success" role="status">
              <span>✓</span>
              <h2>You're on the list.</h2>
              <p>Thanks for helping shape {config.brand}.</p>
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
                {isSubmitting ? 'Joining…' : config.cta} {!isSubmitting && <span>→</span>}
              </button>
            </form>
          )}
        </div>
      </section>

      {config.testimonials && (
        <section className="phase2-testimonials">
          <div className="phase2-section-heading phase2-section-heading--center">
            <p className="phase2-kicker">Early-access perspectives</p>
            <h2>Why people want this.</h2>
            <p>Representative validation perspectives—not reviews of a released app.</p>
          </div>
          <div className="phase2-testimonial-grid">
            {config.testimonials.map((testimonial, index) => (
              <article key={`${testimonial.name}-${index}`}>
                <Quote size={28} aria-hidden="true" />
                <blockquote>“{testimonial.quote}”</blockquote>
                <footer>
                  <span className="phase2-avatar" aria-hidden="true">{index + 1}</span>
                  <div><strong>{testimonial.name}</strong><small>{testimonial.descriptor}</small></div>
                </footer>
              </article>
            ))}
          </div>
        </section>
      )}

      {config.testimonials && <SectionCta brand={config.brand} text={config.sectionCtas.afterTestimonials} reassurance={config.ctaReassurance} />}

      <section className="phase2-faq">
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
      </section>

      {config.finalCta && (
        <section className="phase2-final-cta">
          <img src={config.logo} alt="" />
          <h2>{highlightPhrase(config.finalCta.headline, config.finalCta.headlineHighlight)}</h2>
          <p>{config.finalCta.description}</p>
          <a className="phase2-button" href="#early-access">{config.cta} <span>→</span></a>
          <small>{config.ctaReassurance}</small>
        </section>
      )}

      <footer className="phase2-footer">
        <div className="phase2-brand"><img src={config.logo} alt="" /><span>{config.brand}</span></div>
        <div className="phase2-footer__legal" aria-label="Legal information">
          <span>Privacy Statement</span>
          <span>Terms and Conditions</span>
          <span>DMCA Policy</span>
          <span>Do Not Sell My Info</span>
        </div>
      </footer>

      <a className="phase2-sticky-cta" href="#early-access">{config.sectionCtas.sticky} <span>→</span></a>
    </main>
  )
}
