import { useEffect, useMemo, useState } from 'react'
import { Check, CheckCircle2, ChevronDown, ChevronRight, LockKeyhole, Target } from 'lucide-react'
import type { EveraAccountData, EveraFocus } from '../lib/everaAccount'
import { everaPlans } from '../lib/everaCheckout'
import { postHogPlanValue, trackEveraEvent } from '../lib/posthogAnalytics'

const focusDescriptions: Record<EveraFocus, string> = {
  'Weight Stability': 'Build awareness around your maintenance range and respond to changes without obsessing over every number.',
  'Sustainable Routine': 'Create simple, repeatable habits that make consistency feel realistic after treatment.',
  'Nutrition & Protein': 'Build a supportive nutrition structure with practical protein and meal-planning priorities.',
  'Strength & Movement': 'Protect strength and make approachable movement part of your long-term routine.',
  'Transition Preparation': 'Create clarity around what to focus on as your treatment and daily priorities change.',
}

type TaskId = 'protein' | 'movement' | 'weight' | 'habits'
type DayOneProgress = { completed: TaskId[]; protein?: string; weight?: string; habits: string[] }

const taskSummary: Record<TaskId, [string, string]> = {
  protein: ['Protein foundation', 'Choose one protein anchor for today'],
  movement: ['Daily movement', 'Take a comfortable 15-minute walk'],
  weight: ['Weight awareness', 'Record your current maintenance baseline'],
  habits: ['Habit checklist', 'Choose two habits to repeat this week'],
}
const proteinOptions = ['Greek yogurt', 'Eggs', 'Chicken or fish', 'Cottage cheese', 'Protein shake']
const habitOptions = ['Protein at breakfast', 'Daily walk', 'Strength training', 'Planned meals', 'Consistent sleep schedule']

function readProgress(key: string): DayOneProgress {
  try {
    const saved = window.localStorage.getItem(key)
    if (saved) return { completed: [], habits: [], ...JSON.parse(saved) }
  } catch { /* Start empty if browser storage is unavailable. */ }
  return { completed: [], habits: [] }
}

export function EveraProgramDashboard({ account, onExit, onSignOut }: { account: EveraAccountData; onExit?: () => void; onSignOut?: () => void }) {
  const purchasedPlan = everaPlans.find((plan) => plan.id === account.selectedPlan) ?? everaPlans[1]
  const duration = purchasedPlan.id === 'starter-7' ? 7 : purchasedPlan.id === 'journey-90' ? 90 : 30
  const storageKey = `evera_day_one_${account.userId}_${purchasedPlan.id}`
  const [progress, setProgress] = useState<DayOneProgress>(() => readProgress(storageKey))
  const [activeTask, setActiveTask] = useState<TaskId | null>('protein')
  const completion = progress.completed.length * 25
  const allComplete = completion === 100

  useEffect(() => {
    // Day 1 begins when the purchased program opens with its first action ready.
    trackEveraEvent('first_day_started', { program_duration: postHogPlanValue(purchasedPlan.id) }, `first_day_${account.userId}_${purchasedPlan.id}`)
  }, [account.userId, purchasedPlan.id])

  function save(next: DayOneProgress) {
    setProgress(next)
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* Keep current session working. */ }
  }

  function complete(task: TaskId, updates: Partial<DayOneProgress> = {}) {
    const isFirstCompletion = progress.completed.length === 0 && !progress.completed.includes(task)
    const completed = progress.completed.includes(task) ? progress.completed : [...progress.completed, task]
    save({ ...progress, ...updates, completed })
    // PostHog funnel: no task name, weight, food choice, or other health detail is sent.
    if (isFirstCompletion) trackEveraEvent('first_task_completed', { program_duration: postHogPlanValue(purchasedPlan.id) }, `first_task_${account.userId}_${purchasedPlan.id}`)
    setActiveTask(null)
  }

  function toggleHabit(habit: string) {
    const habits = progress.habits.includes(habit)
      ? progress.habits.filter((item) => item !== habit)
      : progress.habits.length < 2 ? [...progress.habits, habit] : progress.habits
    save({ ...progress, habits, completed: progress.completed.filter((task) => task !== 'habits') })
  }

  const roadmap = useMemo(() => duration === 7
    ? [['Days 2–4', 'Strengthen your foundation', 'Unlocks tomorrow'], ['Days 5–7', 'Create your next step', 'Unlocks on Day 5']]
    : duration === 90
      ? [['Weeks 2–4', 'Protect your progress', 'Unlocks after Week 1'], ['Month 2', 'Strengthen your lifestyle', 'Unlocks after Month 1'], ['Month 3', 'Maintain your results', 'Unlocks after Month 2']]
      : [['Week 2', 'Protect your progress', 'Unlocks after Week 1'], ['Week 3', 'Strengthen your routine', 'Unlocks after Week 2'], ['Week 4', 'Create your long-term system', 'Unlocks after Week 3']], [duration])

  return <main className="evera-program">
    <header><div><p>YOUR PERSONALIZED PROGRAM</p><h1>Welcome to your Evera {purchasedPlan.name}</h1></div><span>Day 1 of {duration}</span></header>
    <section className="evera-program__day-one-intro"><small>DAY 1 OF {duration}</small><h2>Your journey starts today</h2><p>Complete these first steps to build your maintenance foundation.</p></section>
    <div className="evera-program__progress"><div><strong>Week 1 progress</strong><span>{completion}%</span></div><i><span style={{ width: `${completion}%` }} /></i></div>
    <div className="evera-program__layout">
      <section className="evera-program__week"><small>WEEK 1 · DAY 1</small><h2>Build your foundation</h2><p>Start with four practical actions you can complete today.</p><div className="evera-program__tasks">
        {(Object.keys(taskSummary) as TaskId[]).map((task) => {
          const [title, description] = taskSummary[task]
          const isComplete = progress.completed.includes(task)
          const isOpen = activeTask === task
          return <article className={`${isOpen ? 'is-open ' : ''}${isComplete ? 'is-complete' : ''}`} key={task}>
            <button type="button" onClick={() => { if (!isOpen) trackEveraEvent('first_day_started', { program_duration: postHogPlanValue(purchasedPlan.id) }, `first_day_${account.userId}_${purchasedPlan.id}`); setActiveTask(isOpen ? null : task) }} aria-expanded={isOpen}><i>{isComplete && <Check size={13} />}</i><span><strong>{title}</strong><small>{description}</small></span>{isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}</button>
            {isOpen && <div className="evera-program__task-detail">
              {task === 'protein' && <><p>Choose one protein anchor for today.</p><div className="evera-program__choices">{proteinOptions.map((option) => <button className={progress.protein === option ? 'is-selected' : ''} type="button" key={option} onClick={() => save({ ...progress, protein: option, completed: progress.completed.filter((item) => item !== 'protein') })}>{progress.protein === option && <Check size={14} />}{option}</button>)}</div><button className="evera-program__task-cta" type="button" disabled={!progress.protein} onClick={() => complete('protein')}>Save and complete</button></>}
              {task === 'movement' && <><p>Take a comfortable 15-minute walk today.</p><blockquote>Small consistent actions help protect your progress after GLP-1.</blockquote><button className="evera-program__task-cta" type="button" onClick={() => complete('movement')}>Mark complete</button></>}
              {task === 'weight' && <><p>Record your current weight as your maintenance baseline.</p><label>Current weight<input inputMode="decimal" type="number" min="1" step="0.1" value={progress.weight ?? ''} onChange={(event) => save({ ...progress, weight: event.target.value, completed: progress.completed.filter((item) => item !== 'weight') })} placeholder="Enter your current weight" /></label><button className="evera-program__task-cta" type="button" disabled={!progress.weight || Number(progress.weight) <= 0} onClick={() => complete('weight')}>Save weight</button></>}
              {task === 'habits' && <><p>Choose two habits you want to focus on this week.</p><div className="evera-program__choices">{habitOptions.map((option) => <button className={progress.habits.includes(option) ? 'is-selected' : ''} type="button" key={option} onClick={() => toggleHabit(option)}>{progress.habits.includes(option) && <Check size={14} />}{option}</button>)}</div><small>{progress.habits.length} of 2 selected</small><button className="evera-program__task-cta" type="button" disabled={progress.habits.length !== 2} onClick={() => complete('habits')}>Save habits</button></>}
            </div>}
          </article>
        })}
      </div></section>
      <aside><Target size={25} /><small>YOUR PRIMARY FOCUS</small><h3>{account.primaryFocus}</h3><p>{focusDescriptions[account.primaryFocus]}</p><div><CheckCircle2 size={18} /> Your plan was shaped by all 12 answers.</div></aside>
    </div>
    {allComplete && <section className="evera-program__celebration"><CheckCircle2 size={28} /><div><h2>Great start</h2><p>You've completed the first steps toward building habits that last beyond GLP-1.</p></div></section>}
    <section className="evera-program__roadmap"><small>YOUR ROADMAP</small><h2>What comes next</h2><div>{roadmap.map(([label, title, unlock]) => <article key={label}><LockKeyhole size={18} /><span><small>{label}</small><strong>{title}</strong><em>{unlock}</em></span></article>)}</div></section>
    {(onExit || onSignOut) && <div className="evera-program__actions">{onExit && <button className="evera-program__close" type="button" onClick={onExit}>Return to Evera</button>}{onSignOut && <button className="evera-program__close" type="button" onClick={onSignOut}>Sign out</button>}</div>}
  </main>
}
