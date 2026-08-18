import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { planPreviews } from './EveraMaintenanceQuiz'
import { beginEveraCheckout, everaPlans, hasAnyStripeCheckout, type EveraPlan } from '../lib/everaCheckout'
import { getEveraQuizDraft, updateEveraQuizDraft } from '../lib/everaFunnel'
import { getEveraFlowUrl } from '../lib/domainRouting'
import { metaFocusValue, trackMetaEvent } from '../lib/metaPixel'
import { danishFocusLabels, danishPlanPreviews, danishPlans, type EveraLocale } from '../everaDanish'
import { postHogFocusValue, postHogPlanValue, trackEveraEvent } from '../lib/posthogAnalytics'

export function EveraPlanPreviewPage({ locale = 'en' }: { locale?: EveraLocale }) {
  const draft = useMemo(() => getEveraQuizDraft(), [])
  const localizedPlans = locale === 'da' ? danishPlans : everaPlans
  const previews = locale === 'da' ? danishPlanPreviews : planPreviews
  const [selectedPlan, setSelectedPlan] = useState<EveraPlan>(() => localizedPlans.find((plan) => plan.id === draft?.selectedPlan) ?? localizedPlans[1])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const preview = previews[selectedPlan.id]

  useEffect(() => {
    if (!draft) return
    const duration = selectedPlan.id === 'starter-7' ? '7-day' : selectedPlan.id === 'journey-90' ? '90-day' : '30-day'
    trackMetaEvent('PlanGenerated', {
      plan_type: metaFocusValue(draft.primaryFocus),
      program_duration: duration,
    }, { custom: true, onceKey: `plan_generated_${draft.createdAt}` })
    // PostHog funnel: result and recommendation are intentionally free of raw quiz answers.
    trackEveraEvent('result_viewed', { primary_focus: postHogFocusValue(draft.primaryFocus) }, `result_viewed_${draft.createdAt}`)
    trackEveraEvent('plan_recommendation_viewed', { recommended_plan: '30_day' }, `recommendation_viewed_${draft.createdAt}`)
    trackEveraEvent('paywall_viewed', { recommended_plan: '30_day' }, `paywall_viewed_${draft.createdAt}`)
  }, [draft, selectedPlan.id])

  function selectPlan(plan: EveraPlan) {
    setSelectedPlan(plan)
    trackEveraEvent('plan_selected', {
      selected_plan: postHogPlanValue(plan.id),
      price: Number(plan.price.replace(/[^0-9.]/g, '')),
      currency: 'EUR',
    })
  }

  async function checkout(plan: EveraPlan = selectedPlan) {
    if (!draft) { window.location.assign(getEveraFlowUrl()); return }
    setSelectedPlan(plan)
    setLoading(true)
    setError('')
    try {
      const updatedDraft = updateEveraQuizDraft({ selectedPlan: plan.id }) ?? { ...draft, selectedPlan: plan.id }
      trackMetaEvent('InitiateCheckout', {
        content_name: plan.name,
        value: Number(plan.price.replace(/[^0-9.]/g, '')),
        currency: 'EUR',
      }, { onceKey: `checkout_${draft.createdAt}_${plan.id}` })
      // PostHog funnel: capture immediately before handing off to Stripe.
      trackEveraEvent('checkout_started', { selected_plan: postHogPlanValue(plan.id) })
      await beginEveraCheckout(plan, updatedDraft)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout could not be started.')
    } finally {
      setLoading(false)
    }
  }

  if (!draft) return <main className="evera-dashboard-state"><Target size={34} /><h1>{locale === 'da' ? 'Gennemfør først din Evera-vurdering' : 'Complete your Evera assessment first'}</h1><p>{locale === 'da' ? 'Dine svar skaber anbefalingen på denne side.' : 'Your answers create the recommendation shown on this page.'}</p><a className="phase2-button" href={locale === 'da' ? '/dk' : getEveraFlowUrl()}>{locale === 'da' ? 'Skab min plan' : 'Build my plan'} <ArrowRight size={18} /></a></main>

  return <main className="evera-plan-page">
    <header className="evera-flow-header"><a href={locale === 'da' ? '/dk' : getEveraFlowUrl()}>◉ Evera</a><span>{locale === 'da' ? 'Personligt vedligeholdelsesprogram' : 'Personalized maintenance program'}</span></header>
    <section className="evera-plan-result">
      <div className="evera-plan-result__icon"><Sparkles size={28} /></div>
      <p className="evera-quiz__eyebrow">{locale === 'da' ? 'Dit personlige resultat' : 'Your personalized result'}</p>
      <h1>{locale === 'da' ? 'Din Evera-vedligeholdelsesplan er klar' : 'Your Evera Maintenance Plan is ready'}</h1>
      <p>{locale === 'da' ? 'Baseret på din GLP-1-rejse, dine mål og udfordringer har vi skabt et program omkring de prioriteter, der betyder mest for dig.' : 'Based on your GLP-1 journey, goals, and challenges, we created a program designed around the priorities that matter most to you.'}</p>
      <div className="evera-plan-result__focus"><div><small>{locale === 'da' ? 'PRIMÆRT FOKUS' : 'PRIMARY FOCUS'}</small><strong>{locale === 'da' ? danishFocusLabels[draft.primaryFocus] : draft.primaryFocus}</strong></div><div><small>{locale === 'da' ? 'YDERLIGERE FOKUSOMRÅDER' : 'ADDITIONAL FOCUS AREAS'}</small>{draft.secondaryFocuses.map((focus) => <span key={focus}>{locale === 'da' ? danishFocusLabels[focus] : focus}</span>)}</div></div>
      <div className="evera-plan-result__recommended"><small>{locale === 'da' ? 'ANBEFALET PLAN' : 'RECOMMENDED PLAN'}</small><strong>{locale === 'da' ? '30-dages vedligeholdelsesplan' : '30-Day Maintenance Plan'}</strong><span>{locale === 'da' ? 'Nok tid til at skabe kontinuitet uden at det føles overvældende.' : 'Enough time to build consistency without feeling overwhelming.'}</span></div>
      <div className="evera-result__includes">{(locale === 'da' ? ['Personlig vedligeholdelsesplan', 'Daglig vanevejledning', 'Ernærings- og proteinstøtte', 'Fremskridtstjek', 'Bæredygtige rutiner'] : ['Personalized maintenance roadmap', 'Daily habit guidance', 'Nutrition and protein support', 'Progress check-ins', 'Sustainable routines']).map((item) => <span key={item}><Check size={15} /> {item}</span>)}</div>
    </section>

    <section className="evera-paywall evera-paywall--page">
      <div className="evera-paywall__heading"><p className="evera-quiz__eyebrow">{locale === 'da' ? 'Vælg din plan' : 'Choose your plan'}</p><h2>{locale === 'da' ? 'Vælg din vedligeholdelsesrejse' : 'Choose your maintenance journey'}</h2><p>{locale === 'da' ? 'Vælg det støtteniveau, der passer til din rejse.' : 'Choose the support level that fits your maintenance journey.'}</p></div>
      <div className="evera-paywall__plans">{localizedPlans.map((plan) => { const isSelected = selectedPlan.id === plan.id; return <article className={`${isSelected ? 'is-selected ' : ''}${plan.id === 'complete-30' ? 'is-recommended' : ''}`} key={plan.id} role="radio" aria-checked={isSelected} tabIndex={0} onClick={() => selectPlan(plan)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPlan(plan) } }}>
        {plan.badge && <em>{plan.badge}</em>}<small>{plan.name}</small><strong>{plan.price}</strong><span className="evera-paywall__positioning">{plan.positioning}</span><p>{plan.description}</p>
        <ul>{plan.includes.map((item) => <li key={item}><Check size={14} /> {item}</li>)}</ul>
        <button className={isSelected ? 'evera-paywall__primary' : 'evera-paywall__secondary'} type="button" disabled={loading} onClick={(event) => { event.stopPropagation(); checkout(plan) }}>{loading && isSelected ? (locale === 'da' ? 'Åbner betaling…' : 'Opening checkout…') : plan.cta} <ArrowRight size={16} /></button>
      </article> })}</div>

      <section className="evera-paywall__roadmap"><p className="evera-quiz__eyebrow">{locale === 'da' ? 'Forhåndsvisning af program' : 'Program preview'}</p><div className="evera-paywall__roadmap-content" key={selectedPlan.id}><h2>{preview.title}</h2><p>{preview.subtitle}</p><div>{preview.cards.map((card) => <article key={card.label}><small>{card.label}</small><strong>{card.title}</strong><ul>{card.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div></section>
      <div className="evera-paywall__closing"><p>{locale === 'da' ? 'Din valgte plan' : 'Your selected plan'}</p><strong>{selectedPlan.name} · {selectedPlan.price}</strong><button className="phase2-button" type="button" disabled={loading} onClick={() => checkout()}>{loading ? (locale === 'da' ? 'Åbner betaling…' : 'Opening checkout…') : selectedPlan.cta} {!loading && <ArrowRight size={18} />}</button></div>
      {error && <p className="evera-account__error" role="alert">{error}</p>}
      {!hasAnyStripeCheckout && <small><ShieldCheck size={13} /> {locale === 'da' ? 'Testbetaling: Intet kort bliver debiteret.' : 'Test checkout mode: no card is charged.'}</small>}
    </section>
  </main>
}
