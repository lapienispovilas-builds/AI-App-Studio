import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'
import { submitLead } from '../lib/submitLead'
import { trackMetaLead } from '../lib/metaPixel'

type Focus = 'Weight Stability' | 'Sustainable Routine' | 'Nutrition & Protein' | 'Strength & Movement' | 'Transition Preparation'

type QuizOption = {
  label: string
  focus: Focus
  secondaryFocus?: Focus
}

type QuizQuestion = {
  title: string
  eyebrow?: string
  options: QuizOption[]
}

const questions: QuizQuestion[] = [
  {
    title: 'Where are you currently in your GLP-1 journey?',
    options: [
      { label: 'Just starting GLP-1 treatment', focus: 'Transition Preparation' },
      { label: 'Currently losing weight with GLP-1', focus: 'Sustainable Routine' },
      { label: 'Nearing my goal weight', focus: 'Weight Stability' },
      { label: 'Recently stopped or tapering off', focus: 'Transition Preparation', secondaryFocus: 'Weight Stability' },
      { label: 'Already stopped GLP-1', focus: 'Weight Stability' },
    ],
  },
  {
    title: 'What is your biggest concern after GLP-1?',
    options: [
      { label: 'Regaining the weight I lost', focus: 'Weight Stability' },
      { label: 'Losing the habits that helped me succeed', focus: 'Sustainable Routine' },
      { label: 'Losing muscle or strength', focus: 'Strength & Movement' },
      { label: 'Not knowing what to do next', focus: 'Transition Preparation' },
      { label: 'Staying consistent long term', focus: 'Sustainable Routine' },
    ],
  },
  {
    title: 'What feels hardest about maintaining your results?',
    options: [
      { label: 'Keeping my weight stable', focus: 'Weight Stability' },
      { label: 'Building healthy routines without medication', focus: 'Sustainable Routine' },
      { label: 'Getting enough protein', focus: 'Nutrition & Protein' },
      { label: 'Staying active and strong', focus: 'Strength & Movement' },
      { label: 'Knowing when and how to transition', focus: 'Transition Preparation' },
    ],
  },
  {
    title: 'What would you like the most help with?',
    options: [
      { label: 'Keeping my weight in a healthy range', focus: 'Weight Stability' },
      { label: 'Creating daily habits that last', focus: 'Sustainable Routine' },
      { label: 'Planning my nutrition', focus: 'Nutrition & Protein' },
      { label: 'Protecting muscle and strength', focus: 'Strength & Movement' },
      { label: 'Preparing for life after GLP-1', focus: 'Transition Preparation' },
    ],
  },
  {
    title: 'How long have you been using GLP-1 medication?',
    options: [
      { label: 'Less than 3 months', focus: 'Sustainable Routine' },
      { label: '3–6 months', focus: 'Sustainable Routine' },
      { label: '6–12 months', focus: 'Weight Stability' },
      { label: 'More than a year', focus: 'Transition Preparation' },
      { label: 'I already stopped', focus: 'Transition Preparation' },
    ],
  },
  {
    title: 'What is your biggest lifestyle challenge?',
    options: [
      { label: 'Staying consistent', focus: 'Sustainable Routine' },
      { label: 'Planning meals', focus: 'Nutrition & Protein' },
      { label: 'Getting enough protein', focus: 'Nutrition & Protein' },
      { label: 'Finding time for movement', focus: 'Strength & Movement' },
      { label: 'Avoiding old habits', focus: 'Weight Stability' },
    ],
  },
  {
    title: 'How confident are you about maintaining your results?',
    options: [
      { label: 'Not confident yet', focus: 'Transition Preparation' },
      { label: 'Somewhat confident', focus: 'Sustainable Routine' },
      { label: 'Very confident', focus: 'Weight Stability' },
    ],
  },
  {
    title: 'How often do you currently track your progress?',
    options: [
      { label: 'Daily', focus: 'Weight Stability' },
      { label: 'Weekly', focus: 'Weight Stability' },
      { label: 'Occasionally', focus: 'Sustainable Routine' },
      { label: "I don't track anymore", focus: 'Transition Preparation' },
    ],
  },
  {
    title: 'What does success after GLP-1 look like for you?',
    options: [
      { label: 'Maintaining my weight', focus: 'Weight Stability' },
      { label: 'Feeling healthy and in control', focus: 'Sustainable Routine' },
      { label: 'Building strength', focus: 'Strength & Movement' },
      { label: 'Creating sustainable habits', focus: 'Sustainable Routine' },
      { label: 'Feeling confident again', focus: 'Transition Preparation' },
    ],
  },
  {
    title: 'How active are you currently?',
    options: [
      { label: 'Mostly sedentary', focus: 'Strength & Movement' },
      { label: 'Light activity', focus: 'Strength & Movement' },
      { label: 'Exercise a few times per week', focus: 'Strength & Movement' },
      { label: 'Regular strength training', focus: 'Strength & Movement' },
    ],
  },
  {
    title: 'How would you describe your nutrition?',
    options: [
      { label: 'I struggle with consistency', focus: 'Sustainable Routine' },
      { label: 'I need more protein', focus: 'Nutrition & Protein' },
      { label: 'I eat well but need structure', focus: 'Nutrition & Protein' },
      { label: 'I already have strong habits', focus: 'Weight Stability' },
    ],
  },
  {
    title: 'What would make a GLP-1 maintenance program valuable for you?',
    options: [
      { label: 'A clear plan after medication', focus: 'Transition Preparation' },
      { label: 'Daily guidance and accountability', focus: 'Sustainable Routine' },
      { label: 'Personalized nutrition support', focus: 'Nutrition & Protein' },
      { label: 'Tracking progress without obsession', focus: 'Weight Stability' },
      { label: 'Strength and habit building', focus: 'Strength & Movement' },
    ],
  },
]

const insights = [
  {
    afterQuestion: 2,
    image: '/assets/evera-quiz/walking.jpg',
    myth: 'Stopping GLP-1 means losing your progress.',
    fact: 'Long-term success depends on building habits, nutrition, and routines that continue after treatment.',
  },
  {
    afterQuestion: 5,
    image: '/assets/evera-quiz/strength.jpg',
    myth: 'Weight loss is only about the number on the scale.',
    fact: 'Maintaining muscle, protein intake, and daily movement are important parts of long-term success.',
  },
  {
    afterQuestion: 8,
    image: '/assets/evera-quiz/nutrition.jpg',
    myth: 'You need medication forever to keep results.',
    fact: 'The transition phase is where building sustainable habits becomes most important.',
  },
]

const focusDetails: Record<Focus, { description: string; icon: typeof Target }> = {
  'Weight Stability': { description: 'Build awareness around your maintenance range and respond to changes without obsessing over every number.', icon: TrendingUp },
  'Sustainable Routine': { description: 'Create simple, repeatable habits that make consistency feel realistic after treatment.', icon: CheckCircle2 },
  'Nutrition & Protein': { description: 'Build a supportive nutrition structure with practical protein and meal-planning priorities.', icon: Leaf },
  'Strength & Movement': { description: 'Protect strength and make approachable movement part of your long-term routine.', icon: Dumbbell },
  'Transition Preparation': { description: 'Create clarity around what to focus on as your treatment and daily priorities change.', icon: ShieldCheck },
}

export function EveraMaintenanceQuiz({ onClose }: { onClose: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, QuizOption>>({})
  const [view, setView] = useState<'question' | 'insight' | 'result' | 'account' | 'program'>('question')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  const primaryFocus = useMemo<Focus>(() => {
    const scores = Object.values(answers).reduce<Record<Focus, number>>((current, answer) => {
      current[answer.focus] += 1
      if (answer.secondaryFocus) current[answer.secondaryFocus] += 1
      return current
    }, { 'Weight Stability': 0, 'Sustainable Routine': 0, 'Nutrition & Protein': 0, 'Strength & Movement': 0, 'Transition Preparation': 0 })
    return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Weight Stability') as Focus
  }, [answers])

  const insight = insights.find((item) => item.afterQuestion === questionIndex)
  const progress = ((questionIndex + (view === 'result' || view === 'account' || view === 'program' ? 1 : 0)) / questions.length) * 100

  function chooseAnswer(option: QuizOption) {
    setAnswers((current) => ({ ...current, [questionIndex]: option }))
    window.setTimeout(() => {
      if (insight) setView('insight')
      else if (questionIndex === questions.length - 1) setView('result')
      else setQuestionIndex((current) => current + 1)
    }, 160)
  }

  function continueFromInsight() {
    setView('question')
    setQuestionIndex((current) => current + 1)
  }

  function goBack() {
    setError('')
    if (view === 'insight') { setView('question'); return }
    if (view === 'result') { setView('question'); setQuestionIndex(questions.length - 1); return }
    if (view === 'account') { setView('result'); return }
    if (questionIndex > 0) setQuestionIndex((current) => current - 1)
    else onClose()
  }

  async function saveAccount(event: FormEvent) {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return }
    if (password.length < 6) { setError('Use at least 6 characters for your password.'); return }
    setSaving(true)
    setError('')
    try {
      await submitLead({
        idea: 'Evera',
        page: '/glp1-tracker-maintenance',
        email: email.trim(),
        answers: {
          ...Object.fromEntries(questions.map((question, index) => [question.title, answers[index]?.label ?? ''])),
          'Personalized plan focus': primaryFocus,
          landingVariant: 'maintenance-program-quiz',
        },
      })
      trackMetaLead()
      setView('program')
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const FocusIcon = focusDetails[primaryFocus].icon

  return (
    <div className="evera-quiz" role="dialog" aria-modal="true" aria-label="Evera personalized maintenance assessment">
      <header className="evera-quiz__header">
        <button type="button" onClick={goBack} aria-label="Go back"><ArrowLeft size={20} /></button>
        <div className="evera-quiz__brand"><span>◉</span> Evera</div>
        <button type="button" onClick={onClose} aria-label="Close assessment"><X size={20} /></button>
      </header>

      {view !== 'program' && <div className="evera-quiz__progress">
        <div><span>Creating your personalized GLP-1 maintenance plan</span><strong>{view === 'question' ? `Question ${questionIndex + 1} of 12` : view === 'insight' ? 'Personal insight' : 'Your plan'}</strong></div>
        <i><span style={{ width: `${Math.max(8, progress)}%` }} /></i>
      </div>}

      {view === 'question' && <main className="evera-quiz__question">
        <p className="evera-quiz__eyebrow">Tell us about your journey</p>
        <h1>{questions[questionIndex].title}</h1>
        <div className="evera-quiz__answers">
          {questions[questionIndex].options.map((option) => <button className={answers[questionIndex]?.label === option.label ? 'is-selected' : ''} type="button" key={option.label} onClick={() => chooseAnswer(option)}>
            <span>{option.label}</span><i>{answers[questionIndex]?.label === option.label ? <Check size={17} /> : <ChevronRight size={17} />}</i>
          </button>)}
        </div>
        <small>Your answers help shape your program. There are no wrong choices.</small>
      </main>}

      {view === 'insight' && insight && <main className="evera-insight">
        <img src={insight.image} alt="Supportive maintenance lifestyle" />
        <div className="evera-insight__copy">
          <span><Sparkles size={16} /> A useful perspective</span>
          <section><small>MYTH</small><h1>“{insight.myth}”</h1></section>
          <section className="is-fact"><small>FACT</small><p>{insight.fact}</p></section>
          <button className="phase2-button" type="button" onClick={continueFromInsight}>Continue <ArrowRight size={18} /></button>
        </div>
      </main>}

      {view === 'result' && <main className="evera-result">
        <div className="evera-result__icon"><FocusIcon size={34} /></div>
        <p className="evera-quiz__eyebrow">Your personalized Evera plan is ready</p>
        <h1>Your primary focus is<br /><span>{primaryFocus}</span></h1>
        <p>{focusDetails[primaryFocus].description}</p>
        <div className="evera-result__includes">
          {['Personalized 30-day roadmap', 'Daily habit guidance', 'Progress tracking', 'Nutrition recommendations', 'Sustainable routines'].map((item) => <span key={item}><Check size={15} /> {item}</span>)}
        </div>
        <button className="phase2-button" type="button" onClick={() => setView('account')}>Create my Evera plan <ArrowRight size={18} /></button>
        <small>Built from your 12 assessment answers</small>
      </main>}

      {view === 'account' && <main className="evera-account">
        <div className="evera-account__summary"><FocusIcon size={30} /><div><small>YOUR PLAN FOCUS</small><strong>{primaryFocus}</strong></div></div>
        <p className="evera-quiz__eyebrow">One last step</p>
        <h1>Save your personalized Evera plan</h1>
        <p>Create your login details to keep your results and continue to your program preview.</p>
        <form onSubmit={saveAccount}>
          <label><span><Mail size={16} /> Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
          <label><span><LockKeyhole size={16} /> Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete="new-password" /></label>
          {error && <p className="evera-account__error" role="alert">{error}</p>}
          <button className="phase2-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Start my 30-day plan'} {!saving && <ArrowRight size={18} />}</button>
        </form>
        <small><LockKeyhole size={12} /> UI-only account preview for this early validation version. Your password is not transmitted or stored.</small>
      </main>}

      {view === 'program' && <main className="evera-program">
        <header><div><p>YOUR PERSONALIZED PROGRAM</p><h1>Your 30-Day Evera Maintenance Plan</h1></div><span>Day 1 of 30</span></header>
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
          <aside><Target size={25} /><small>YOUR PRIMARY FOCUS</small><h3>{primaryFocus}</h3><p>{focusDetails[primaryFocus].description}</p><div><CheckCircle2 size={18} /> Your plan was shaped by all 12 answers.</div></aside>
        </div>
        <button className="evera-program__close" type="button" onClick={onClose}>Return to Evera</button>
      </main>}
    </div>
  )
}
