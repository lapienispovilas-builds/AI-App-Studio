import { useMemo, useState } from 'react'
import { ArrowRight, Check, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { planPreviews } from './EveraMaintenanceQuiz'
import { beginEveraCheckout, everaPlans, hasAnyStripeCheckout, type EveraPlan } from '../lib/everaCheckout'
import { getEveraQuizDraft, updateEveraQuizDraft } from '../lib/everaFunnel'
import { getEveraFlowUrl } from '../lib/domainRouting'

export function EveraPlanPreviewPage() {
  const draft = useMemo(() => getEveraQuizDraft(), [])
  const [selectedPlan, setSelectedPlan] = useState<EveraPlan>(() => everaPlans.find((plan) => plan.id === draft?.selectedPlan) ?? everaPlans[1])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const preview = planPreviews[selectedPlan.id]

  async function checkout(plan: EveraPlan = selectedPlan) {
    if (!draft) { window.location.assign(getEveraFlowUrl()); return }
    setSelectedPlan(plan)
    setLoading(true)
    setError('')
    try {
      const updatedDraft = updateEveraQuizDraft({ selectedPlan: plan.id }) ?? { ...draft, selectedPlan: plan.id }
      const result = await beginEveraCheckout(plan, updatedDraft)
      if (result.testSuccess) {
        updateEveraQuizDraft({ selectedPlan: plan.id, checkoutComplete: true })
        window.location.assign('/create-account?checkout=success')
      }
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout could not be started.')
    } finally {
      setLoading(false)
    }
  }

  if (!draft) return <main className="evera-dashboard-state"><Target size={34} /><h1>Complete your Evera assessment first</h1><p>Your answers create the recommendation shown on this page.</p><a className="phase2-button" href={getEveraFlowUrl()}>Build my plan <ArrowRight size={18} /></a></main>

  return <main className="evera-plan-page">
    <header className="evera-flow-header"><a href={getEveraFlowUrl()}>◉ Evera</a><span>Personalized maintenance program</span></header>
    <section className="evera-plan-result">
      <div className="evera-plan-result__icon"><Sparkles size={28} /></div>
      <p className="evera-quiz__eyebrow">Your personalized result</p>
      <h1>Your Evera Maintenance Plan is ready</h1>
      <p>Based on your GLP-1 journey, goals, and challenges, we created a program designed around the priorities that matter most to you.</p>
      <div className="evera-plan-result__focus"><div><small>PRIMARY FOCUS</small><strong>{draft.primaryFocus}</strong></div><div><small>ADDITIONAL FOCUS AREAS</small>{draft.secondaryFocuses.map((focus) => <span key={focus}>{focus}</span>)}</div></div>
      <div className="evera-plan-result__recommended"><small>RECOMMENDED PLAN</small><strong>30-Day Maintenance Plan</strong><span>Enough time to build consistency without feeling overwhelming.</span></div>
      <div className="evera-result__includes">{['Personalized maintenance roadmap', 'Daily habit guidance', 'Nutrition and protein support', 'Progress check-ins', 'Sustainable routines'].map((item) => <span key={item}><Check size={15} /> {item}</span>)}</div>
    </section>

    <section className="evera-paywall evera-paywall--page">
      <div className="evera-paywall__heading"><p className="evera-quiz__eyebrow">Choose your plan</p><h2>Choose your maintenance journey</h2><p>Choose the support level that fits your maintenance journey.</p></div>
      <div className="evera-paywall__plans">{everaPlans.map((plan) => { const isSelected = selectedPlan.id === plan.id; return <article className={`${isSelected ? 'is-selected ' : ''}${plan.id === 'complete-30' ? 'is-recommended' : ''}`} key={plan.id} role="radio" aria-checked={isSelected} tabIndex={0} onClick={() => setSelectedPlan(plan)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedPlan(plan) } }}>
        {plan.badge && <em>{plan.badge}</em>}<small>{plan.name}</small><strong>{plan.price}</strong><span className="evera-paywall__positioning">{plan.positioning}</span><p>{plan.description}</p>
        <ul>{plan.includes.map((item) => <li key={item}><Check size={14} /> {item}</li>)}</ul>
        <button className={isSelected ? 'evera-paywall__primary' : 'evera-paywall__secondary'} type="button" disabled={loading} onClick={(event) => { event.stopPropagation(); checkout(plan) }}>{loading && isSelected ? 'Opening checkout…' : plan.cta} <ArrowRight size={16} /></button>
      </article> })}</div>

      <section className="evera-paywall__roadmap"><p className="evera-quiz__eyebrow">Program preview</p><div className="evera-paywall__roadmap-content" key={selectedPlan.id}><h2>{preview.title}</h2><p>{preview.subtitle}</p><div>{preview.cards.map((card) => <article key={card.label}><small>{card.label}</small><strong>{card.title}</strong><ul>{card.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div></section>
      <div className="evera-paywall__closing"><p>Your selected plan</p><strong>{selectedPlan.name} · {selectedPlan.price}</strong><button className="phase2-button" type="button" disabled={loading} onClick={() => checkout()}>{loading ? 'Opening checkout…' : selectedPlan.cta} {!loading && <ArrowRight size={18} />}</button></div>
      {error && <p className="evera-account__error" role="alert">{error}</p>}
      {!hasAnyStripeCheckout && <small><ShieldCheck size={13} /> Test checkout mode: no card is charged.</small>}
    </section>
  </main>
}
