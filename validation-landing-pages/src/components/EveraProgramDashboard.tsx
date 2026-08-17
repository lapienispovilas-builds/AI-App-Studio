import { CheckCircle2, ChevronRight, Target } from 'lucide-react'
import type { EveraAccountData, EveraFocus } from '../lib/everaAccount'
import { everaPlans } from '../lib/everaCheckout'

const focusDescriptions: Record<EveraFocus, string> = {
  'Weight Stability': 'Build awareness around your maintenance range and respond to changes without obsessing over every number.',
  'Sustainable Routine': 'Create simple, repeatable habits that make consistency feel realistic after treatment.',
  'Nutrition & Protein': 'Build a supportive nutrition structure with practical protein and meal-planning priorities.',
  'Strength & Movement': 'Protect strength and make approachable movement part of your long-term routine.',
  'Transition Preparation': 'Create clarity around what to focus on as your treatment and daily priorities change.',
}

export function EveraProgramDashboard({ account, onExit, onSignOut }: { account: EveraAccountData; onExit?: () => void; onSignOut?: () => void }) {
  const purchasedPlan = everaPlans.find((plan) => plan.id === account.selectedPlan) ?? everaPlans[1]

  return <main className="evera-program">
    <header><div><p>YOUR PERSONALIZED PROGRAM</p><h1>Welcome to your Evera {purchasedPlan.name}</h1></div><span>Day 1</span></header>
    <div className="evera-program__progress"><div><strong>Week 1 progress</strong><span>0%</span></div><i><span /></i></div>
    <div className="evera-program__layout">
      <section className="evera-program__week"><small>WEEK 1</small><h2>Build your foundation</h2><p>Your first week creates a calm, repeatable baseline around the priorities that matter most.</p><div className="evera-program__tasks">
        {[
          ['Protein foundation', 'Choose one protein anchor for today'],
          ['Daily movement', 'Take a comfortable 15-minute walk'],
          ['Weight awareness', 'Record your starting maintenance weight'],
          ['Habit checklist', 'Choose two habits to repeat this week'],
        ].map(([title, description]) => <button type="button" key={title}><i /><span><strong>{title}</strong><small>{description}</small></span><ChevronRight size={17} /></button>)}
      </div></section>
      <aside><Target size={25} /><small>YOUR PRIMARY FOCUS</small><h3>{account.primaryFocus}</h3><p>{focusDescriptions[account.primaryFocus]}</p><div><CheckCircle2 size={18} /> Your plan was shaped by all 12 answers.</div></aside>
    </div>
    {(onExit || onSignOut) && <div className="evera-program__actions">{onExit && <button className="evera-program__close" type="button" onClick={onExit}>Return to Evera</button>}{onSignOut && <button className="evera-program__close" type="button" onClick={onSignOut}>Sign out</button>}</div>}
  </main>
}
