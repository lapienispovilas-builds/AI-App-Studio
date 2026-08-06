import { FormEvent, useState } from 'react'
import type { Phase2LandingPageConfig } from '../phase2LandingPageConfig'
import { trackMetaLead } from '../lib/metaPixel'
import { submitLead } from '../lib/submitLead'

export function Phase2LandingPage({ config }: { config: Phase2LandingPageConfig }) {
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
      trackMetaLead()
      setSubmitted(true)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="phase2-page" style={{ '--accent': config.accent, '--accent-soft': config.accentSoft } as React.CSSProperties}>
      <header className="phase2-topbar"><span>{config.brand}</span></header>

      <section className="phase2-hero">
        <div className="phase2-hero__copy">
          <p className="phase2-kicker">{config.heroKicker}</p>
          <h1>{config.headline}</h1>
          <p>{config.subheadline}</p>
          <a className="phase2-button" href="#early-access">{config.cta} <span>→</span></a>
          {config.ctaSubtitle && <small>{config.ctaSubtitle}</small>}
        </div>

        <div className="phase2-phone" aria-label={`${config.brand} app preview`}>
          <div className="phase2-phone__notch" />
          <div className="phase2-phone__screen">
            <div className="phase2-phone__status"><span>9:41</span><span>● ●</span></div>
            <p className="phase2-phone__brand">{config.brand}</p>
            {config.mockup.context && <h2>{config.mockup.context}</h2>}
            <div className="phase2-phone__card">
              {config.mockup.rows.map((row) => (
                <div className="phase2-phone__row" key={row.label}>
                  <span>{row.label}</span><strong>{row.value}</strong>
                </div>
              ))}
            </div>
            {config.mockup.footer && <p className="phase2-phone__footer">{config.mockup.footer}</p>}
          </div>
        </div>
      </section>

      <section className="phase2-benefits" aria-label="Benefits">
        {config.benefits.map((benefit) => <div key={benefit}>{benefit}</div>)}
      </section>

      <section className="phase2-signup" id="early-access">
        <div className="phase2-signup__intro">
          <p className="phase2-kicker">Early access</p>
          <h2>Join Early Access</h2>
          <p>{config.socialProof}</p>
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
    </main>
  )
}
