import { FormEvent, useState } from 'react'
import type { LandingPageConfig } from '../landingPageConfig'
import { submitLead } from '../lib/submitLead'
import { PhoneMockup } from './PhoneMockup'

type PaymentAnswer = 'Yes' | 'Maybe' | 'No'

export function LandingPage({ config }: { config: LandingPageConfig }) {
  const [email, setEmail] = useState('')
  const [payment, setPayment] = useState<PaymentAnswer | ''>('')
  const [frustration, setFrustration] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!isValidEmail) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setEmailError('')
    setSubmitError('')
    setIsSubmitting(true)

    try {
      await submitLead({
        idea: config.name,
        page: config.path,
        email: email.trim(),
        willingnessToPay: payment,
        biggestFrustration: frustration.trim(),
      })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="landing" style={{ '--accent': config.accent, '--accent-soft': config.accentSoft } as React.CSSProperties}>
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand brand--icon" href="/" aria-label={`${config.name} — view all ideas`}>
          <img src={config.icon} alt="" />
        </a>
        <a className="topbar__link" href="#early-access">Early access</a>
      </nav>

      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow"><span />{config.eyebrow}</p>
          <h1>{config.headline}</h1>
          <p className="subheadline">{config.subheadline}</p>
          <ul className="benefits" aria-label="Benefits">
            {config.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
          <a className="primary-button hero__button" href="#early-access">Join Early Access <span>→</span></a>
          <p className="microcopy">No spam. Just one email when we’re ready.</p>
        </div>

        <div className="hero__visual"><PhoneMockup mockup={config.mockup} name={config.name} icon={config.icon} /></div>
      </section>

      <section className="signup-section" id="early-access">
        <div className="signup-intro">
          <p className="eyebrow"><span />Help shape the first version</p>
          <h2>Want to try it first?</h2>
          <p>Join the early-access list and tell us what would make this genuinely useful for you.</p>
        </div>

        <div className="form-card">
          {submitted ? (
            <div className="success" role="status">
              <div className="success__icon">✓</div>
              <h2>You’re on the list!</h2>
              <p>Thanks for helping shape {config.name}. We’ll be in touch when the first version is ready.</p>
              <a href="/">Explore the other ideas</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-describedby={emailError ? 'email-error' : undefined}
                aria-invalid={Boolean(emailError)}
              />
              {emailError && <p className="field-error" id="email-error">{emailError}</p>}

              <fieldset>
                <legend>{config.priceQuestion}</legend>
                <div className="choice-group">
                  {(['Yes', 'Maybe', 'No'] as PaymentAnswer[]).map((answer) => (
                    <label className={`choice ${payment === answer ? 'choice--selected' : ''}`} key={answer}>
                      <input type="radio" name="payment" value={answer} checked={payment === answer} onChange={() => setPayment(answer)} />
                      {answer}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="frustration">{config.frustrationQuestion} <span className="optional">Optional</span></label>
              <textarea id="frustration" name="frustration" value={frustration} onChange={(event) => setFrustration(event.target.value)} placeholder="Tell us in a sentence..." rows={3} />
              {submitError && <p className="submit-error" role="alert">{submitError}</p>}
              <button className="primary-button submit-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Joining…' : 'Join Early Access'} {!isSubmitting && <span>→</span>}
              </button>
              <p className="privacy-note">Your answers are only used to improve this idea.</p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
