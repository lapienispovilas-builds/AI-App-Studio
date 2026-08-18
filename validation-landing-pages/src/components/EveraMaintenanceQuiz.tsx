import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Leaf,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'
import { submitLead } from '../lib/submitLead'
import { metaFocusValue, trackMetaEvent, trackMetaLead } from '../lib/metaPixel'
import {
  createEveraAccount,
  getEveraAccount,
  isEveraTestMode,
  requestEveraPasswordReset,
  signInToEvera,
  signOutOfEvera,
  type EveraAccountData,
  type EveraFocus,
} from '../lib/everaAccount'
import { beginEveraCheckout, everaPlans, hasAnyStripeCheckout, type EveraPlan } from '../lib/everaCheckout'
import { EveraProgramDashboard } from './EveraProgramDashboard'
import { saveEveraQuizDraft } from '../lib/everaFunnel'
import { danishInsights, danishPlanPreviews, danishPlans, danishQuestions, type EveraLocale } from '../everaDanish'
import { identifyEveraUser, postHogFocusValue, postHogPlanValue, resetEveraAnalyticsUser, trackEveraEvent } from '../lib/posthogAnalytics'

type Focus = EveraFocus

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

const englishQuestions: QuizQuestion[] = [
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

const englishInsights = [
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

export const planPreviews: Record<EveraPlan['id'], { title: string; subtitle: string; cards: Array<{ label: string; title: string; items: string[] }> }> = {
  'starter-7': {
    title: 'Your 7-day foundation includes',
    subtitle: 'A quick start to understand your maintenance priorities and build confidence after GLP-1.',
    cards: [
      { label: 'Step 1', title: 'Understand your maintenance goals', items: ['Review your GLP-1 journey', 'Identify your biggest challenges', 'Set your starting baseline'] },
      { label: 'Step 2', title: 'Build your first habits', items: ['Create simple daily routines', 'Focus on consistency over perfection', 'Establish your maintenance priorities'] },
      { label: 'Step 3', title: 'Support your progress', items: ['Improve nutrition awareness', 'Add sustainable movement', 'Track your first wins'] },
      { label: 'Step 4', title: 'Create your next step', items: ['Review your progress', 'Understand your focus areas', 'Decide your long-term maintenance approach'] },
    ],
  },
  'complete-30': {
    title: 'Your 30-day roadmap includes',
    subtitle: 'A complete maintenance system designed to help you protect your weight loss and build habits that last.',
    cards: [
      { label: 'Week 1', title: 'Build your foundation', items: ['Understand your maintenance goals', 'Create your daily routine', 'Establish key habits'] },
      { label: 'Week 2', title: 'Protect your progress', items: ['Support nutrition habits', 'Maintain consistency', 'Build confidence'] },
      { label: 'Week 3', title: 'Strengthen your routine', items: ['Improve sustainable habits', 'Focus on movement and strength', 'Build long-term consistency'] },
      { label: 'Week 4', title: 'Create your long-term system', items: ['Prepare for challenges', 'Build habits beyond the program', 'Create your maintenance strategy'] },
    ],
  },
  'journey-90': {
    title: 'Your 90-day maintenance journey includes',
    subtitle: 'Long-term support to turn your GLP-1 results into sustainable lifestyle changes.',
    cards: [
      { label: 'Month 1', title: 'Build your foundation', items: ['Establish your maintenance routine', 'Create nutrition habits', 'Understand your progress patterns'] },
      { label: 'Month 2', title: 'Strengthen your lifestyle', items: ['Improve consistency', 'Build strength and movement habits', 'Adapt your routine to real life'] },
      { label: 'Month 3', title: 'Maintain your results', items: ['Handle challenges confidently', 'Create your long-term system', 'Continue tracking your progress'] },
      { label: 'Beyond 90 days', title: 'Your maintenance framework', items: ['Keep your results sustainable', 'Understand what works for you', 'Continue improving your habits'] },
    ],
  },
}

type QuizView = 'question' | 'insight' | 'analyzing' | 'result' | 'account' | 'login' | 'paywall' | 'program'

export function EveraMaintenanceQuiz({ onClose, initialView = 'question', locale = 'en' }: { onClose: () => void; initialView?: 'question' | 'login'; locale?: EveraLocale }) {
  const questions = locale === 'da' ? danishQuestions : englishQuestions
  const insights = locale === 'da' ? danishInsights : englishInsights
  const localizedPlans = locale === 'da' ? danishPlans : everaPlans
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, QuizOption>>({})
  const [view, setView] = useState<QuizView>(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [account, setAccount] = useState<EveraAccountData | null>(null)
  const [selectedPlan, setSelectedPlan] = useState(localizedPlans[1])
  const [checkingSession, setCheckingSession] = useState(true)
  const viewedQuestions = useRef(new Set<number>())

  useEffect(() => {
    if (view !== 'question' || viewedQuestions.current.has(questionIndex)) return
    viewedQuestions.current.add(questionIndex)
    // PostHog funnel: only the question number is captured, never the health-related answer.
    trackEveraEvent('quiz_question_viewed', { question_number: questionIndex + 1, quiz_locale: locale })
  }, [locale, questionIndex, view])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  useEffect(() => {
    let active = true
    getEveraAccount().then((savedAccount) => {
      if (!active) return
      if (savedAccount) {
        setAccount(savedAccount)
        setEmail(savedAccount.email)
        setView(savedAccount.hasPaid ? 'program' : 'paywall')
      }
    }).finally(() => { if (active) setCheckingSession(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (view !== 'program' || !account?.hasPaid) return
    const duration = account.selectedPlan === 'starter-7' ? '7-day' : account.selectedPlan === 'journey-90' ? '90-day' : '30-day'
    trackMetaEvent('DashboardViewed', { program_duration: duration }, {
      custom: true,
      onceKey: `dashboard_viewed_${account.userId}_${account.selectedPlan ?? 'complete-30'}`,
    })
  }, [account, view])

  const primaryFocus = useMemo<Focus>(() => {
    const scores = Object.values(answers).reduce<Record<Focus, number>>((current, answer) => {
      current[answer.focus] += 1
      if (answer.secondaryFocus) current[answer.secondaryFocus] += 1
      return current
    }, { 'Weight Stability': 0, 'Sustainable Routine': 0, 'Nutrition & Protein': 0, 'Strength & Movement': 0, 'Transition Preparation': 0 })
    return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Weight Stability') as Focus
  }, [answers])

  const insight = insights.find((item) => item.afterQuestion === questionIndex)
  const progress = ((questionIndex + (['result', 'account', 'login', 'paywall', 'program'].includes(view) ? 1 : 0)) / questions.length) * 100

  function chooseAnswer(option: QuizOption) {
    const nextAnswers = { ...answers, [questionIndex]: option }
    setAnswers(nextAnswers)
    window.setTimeout(() => {
      if (insight) setView('insight')
      else if (questionIndex === questions.length - 1) finishQuiz(nextAnswers)
      else setQuestionIndex((current) => current + 1)
    }, 160)
  }

  function finishQuiz(completedAnswers: Record<number, QuizOption>) {
    const scores = Object.values(completedAnswers).reduce<Record<Focus, number>>((current, answer) => {
      current[answer.focus] += 1
      if (answer.secondaryFocus) current[answer.secondaryFocus] += 1
      return current
    }, { 'Weight Stability': 0, 'Sustainable Routine': 0, 'Nutrition & Protein': 0, 'Strength & Movement': 0, 'Transition Preparation': 0 })
    const ranked = (Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([focus]) => focus)) as Focus[]
    const completedAt = new Date().toISOString()
    const generatedFocus = ranked[0] ?? 'Weight Stability'
    saveEveraQuizDraft({
      answers: Object.fromEntries(questions.map((question, index) => [question.title, completedAnswers[index]?.label ?? ''])),
      primaryFocus: generatedFocus,
      secondaryFocuses: ranked.slice(1, 3),
      locale,
      createdAt: completedAt,
    })
    trackMetaEvent('QuizCompleted', {
      quiz_name: 'evera_maintenance',
      primary_focus: metaFocusValue(generatedFocus),
    }, { custom: true, onceKey: `quiz_completed_${completedAt}` })
    trackEveraEvent('quiz_finished', {
      quiz_name: 'evera_maintenance',
      primary_focus: postHogFocusValue(generatedFocus),
      question_count: questions.length,
    }, `quiz_finished_${completedAt}`)
    setView('analyzing')
    window.setTimeout(() => window.location.assign(locale === 'da' ? '/dk/plan-preview' : '/plan-preview'), 1400)
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
    if (view === 'login') { setView(initialView === 'login' ? 'question' : 'account'); return }
    if (view === 'paywall') { setView('result'); return }
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
      const answerPayload = Object.fromEntries(questions.map((question, index) => [question.title, answers[index]?.label ?? '']))
      const authResult = await createEveraAccount(email.trim(), password, answerPayload, primaryFocus)
      setAccount(authResult.account)
      identifyEveraUser(authResult.account.userId)
      trackEveraEvent('account_created', { account_mode: isEveraTestMode ? 'local_test' : 'supabase' })
      await submitLead({
        idea: 'Evera',
        page: '/glp1-tracker-maintenance',
        email: email.trim(),
        answers: {
          ...answerPayload,
          'Personalized plan focus': primaryFocus,
          landingVariant: 'maintenance-program-quiz',
        },
      })
      trackMetaLead()
      if (authResult.needsEmailConfirmation) {
        setError('Check your email to confirm your Evera account, then return and sign in.')
      } else {
        setView('paywall')
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    if (!email || !password) { setError('Enter your email and password.'); return }
    setSaving(true)
    setError('')
    try {
      const signedInAccount = await signInToEvera(email.trim(), password)
      setAccount(signedInAccount)
      identifyEveraUser(signedInAccount.userId, postHogPlanValue(signedInAccount.selectedPlan))
      trackEveraEvent('login_completed')
      setView(signedInAccount.hasPaid ? 'program' : 'paywall')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Sign in failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function forgotPassword() {
    setError('')
    setNotice('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter your email address first.'); return }
    try {
      await requestEveraPasswordReset(email.trim())
      setNotice('Check your email for a password reset link.')
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Password reset could not be started.')
    }
  }

  async function startCheckout(plan: EveraPlan = selectedPlan) {
    if (!account) { setView('account'); return }
    setSelectedPlan(plan)
    setSaving(true)
    setError('')
    try {
      trackMetaEvent('InitiateCheckout', {
        content_name: plan.name,
        value: Number(plan.price.replace(/[^0-9.]/g, '')),
        currency: 'EUR',
      }, { onceKey: `checkout_${account.userId}_${plan.id}` })
      trackEveraEvent('checkout_started', { selected_plan: postHogPlanValue(plan.id) })
      await beginEveraCheckout(plan, {
        answers: account.answers,
        primaryFocus: account.primaryFocus,
        secondaryFocuses: [],
        selectedPlan: plan.id,
        createdAt: new Date().toISOString(),
      })
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout could not be started.')
    } finally {
      setSaving(false)
    }
  }

  async function logOut() {
    await signOutOfEvera()
    resetEveraAnalyticsUser()
    setAccount(null)
    setPassword('')
    setView('login')
  }

  const displayedFocus = account?.primaryFocus ?? primaryFocus
  const FocusIcon = focusDetails[displayedFocus].icon
  const selectedPreview = (locale === 'da' ? danishPlanPreviews : planPreviews)[selectedPlan.id]

  function selectPlan(plan: EveraPlan) {
    setSelectedPlan(plan)
    trackEveraEvent('plan_selected', {
      selected_plan: postHogPlanValue(plan.id),
      price: Number(plan.price.replace(/[^0-9.]/g, '')),
      currency: 'EUR',
    })
  }

  if (checkingSession) return <div className="evera-quiz evera-quiz--loading"><div className="evera-quiz__loader"><span>◉</span><p>{locale === 'da' ? 'Åbner din Evera-rejse…' : 'Opening your Evera journey…'}</p></div></div>

  return (
    <div className="evera-quiz" role="dialog" aria-modal="true" aria-label="Evera personalized maintenance assessment">
      <header className="evera-quiz__header">
        <button type="button" onClick={goBack} aria-label={locale === 'da' ? 'Gå tilbage' : 'Go back'}><ArrowLeft size={20} /></button>
        <div className="evera-quiz__brand"><span>◉</span> Evera</div>
        <button type="button" onClick={onClose} aria-label={locale === 'da' ? 'Luk vurdering' : 'Close assessment'}><X size={20} /></button>
      </header>

      {!['program', 'paywall', 'login'].includes(view) && <div className="evera-quiz__progress">
        <div><span>{locale === 'da' ? 'Vi skaber din personlige GLP-1-vedligeholdelsesplan' : 'Creating your personalized GLP-1 maintenance plan'}</span><strong>{view === 'question' ? (locale === 'da' ? `Spørgsmål ${questionIndex + 1} af 12` : `Question ${questionIndex + 1} of 12`) : view === 'insight' ? (locale === 'da' ? 'Personlig indsigt' : 'Personal insight') : (locale === 'da' ? 'Din plan' : 'Your plan')}</strong></div>
        <i><span style={{ width: `${Math.max(8, progress)}%` }} /></i>
      </div>}

      {view === 'question' && <main className="evera-quiz__question">
        <p className="evera-quiz__eyebrow">{locale === 'da' ? 'Fortæl os om din rejse' : 'Tell us about your journey'}</p>
        <h1>{questions[questionIndex].title}</h1>
        <div className="evera-quiz__answers">
          {questions[questionIndex].options.map((option) => <button className={answers[questionIndex]?.label === option.label ? 'is-selected' : ''} type="button" key={option.label} onClick={() => chooseAnswer(option)}>
            <span>{option.label}</span><i>{answers[questionIndex]?.label === option.label ? <Check size={17} /> : <ChevronRight size={17} />}</i>
          </button>)}
        </div>
        <small>{locale === 'da' ? 'Dine svar former dit program. Der er ingen forkerte valg.' : 'Your answers help shape your program. There are no wrong choices.'}</small>
      </main>}

      {view === 'insight' && insight && <main className="evera-insight">
        <img src={insight.image} alt="Supportive maintenance lifestyle" />
        <div className="evera-insight__copy">
          <span><Sparkles size={16} /> {locale === 'da' ? 'Et nyttigt perspektiv' : 'A useful perspective'}</span>
          <section><small>{locale === 'da' ? 'MYTE' : 'MYTH'}</small><h1>“{insight.myth}”</h1></section>
          <section className="is-fact"><small>{locale === 'da' ? 'FAKTA' : 'FACT'}</small><p>{insight.fact}</p></section>
          <button className="phase2-button" type="button" onClick={continueFromInsight}>{locale === 'da' ? 'Fortsæt' : 'Continue'} <ArrowRight size={18} /></button>
        </div>
      </main>}

      {view === 'analyzing' && <main className="evera-analyzing"><div><span>◉</span><i /><i /><i /></div><p className="evera-quiz__eyebrow">{locale === 'da' ? 'Analyserer dine svar…' : 'Analyzing your answers…'}</p><h1>{locale === 'da' ? 'Skaber din Evera-vedligeholdelsesplan…' : 'Building your Evera maintenance plan…'}</h1><small>{locale === 'da' ? 'Forbinder dine mål, udfordringer og prioriteter' : 'Connecting your goals, challenges, and priorities'}</small></main>}

      {view === 'result' && <main className="evera-result">
        <div className="evera-result__icon"><FocusIcon size={34} /></div>
        <p className="evera-quiz__eyebrow">Your personalized Evera plan is ready</p>
        <h1>Your primary focus is<br /><span>{primaryFocus}</span></h1>
        <p>Based on your GLP-1 journey, goals, and answers, we created your maintenance roadmap.</p>
        <div className="evera-result__includes">
          {['Personalized maintenance roadmap', 'Daily habit guidance', 'Progress tracking', 'Nutrition recommendations', 'Sustainable routines'].map((item) => <span key={item}><Check size={15} /> {item}</span>)}
        </div>
        <button className="phase2-button" type="button" onClick={() => setView(account ? 'paywall' : 'account')}>Unlock my Evera plan <ArrowRight size={18} /></button>
        <small>Built from your 12 assessment answers</small>
      </main>}

      {view === 'account' && <main className="evera-account">
        <div className="evera-account__summary"><FocusIcon size={30} /><div><small>YOUR PLAN FOCUS</small><strong>{primaryFocus}</strong></div></div>
        <p className="evera-quiz__eyebrow">One last step</p>
        <h1>Save your personalized Evera plan</h1>
        <p>Create your account to access your personalized GLP-1 maintenance program anytime.</p>
        <form onSubmit={saveAccount}>
          <label><span><Mail size={16} /> Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
          <label><span><LockKeyhole size={16} /> Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete="new-password" /></label>
          {error && <p className="evera-account__error" role="alert">{error}</p>}
          <button className="phase2-button" type="submit" disabled={saving}>{saving ? 'Creating account…' : 'Continue to my plan'} {!saving && <ArrowRight size={18} />}</button>
        </form>
        <button className="evera-account__switch" type="button" onClick={() => { setError(''); setView('login') }}>Already have an account? <strong>Sign in</strong></button>
        {isEveraTestMode && <small><LockKeyhole size={12} /> Local test mode is active until Supabase keys are added.</small>}
      </main>}

      {view === 'login' && <main className="evera-account evera-login">
        <div className="evera-account__summary"><LogIn size={27} /><div><small>RETURNING MEMBER</small><strong>Your plan is waiting</strong></div></div>
        <p className="evera-quiz__eyebrow">Welcome back</p>
        <h1>Welcome back to Evera</h1>
        <p>Sign in to continue your maintenance journey.</p>
        <form onSubmit={login}>
          <label><span><Mail size={16} /> Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
          <label><span><LockKeyhole size={16} /> Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" autoComplete="current-password" /></label>
          <button className="evera-account__forgot" type="button" onClick={forgotPassword}>Forgot password?</button>
          {notice && <p className="evera-account__notice" role="status">{notice}</p>}
          {error && <p className="evera-account__error" role="alert">{error}</p>}
          <button className="phase2-button" type="submit" disabled={saving}>{saving ? 'Signing in…' : 'Sign in'} {!saving && <ArrowRight size={18} />}</button>
        </form>
        <button className="evera-account__switch" type="button" onClick={() => { setError(''); setView('account') }}>New to Evera? <strong>Create your account</strong></button>
        {isEveraTestMode && <small><LockKeyhole size={12} /> Local test mode is active until Supabase keys are added.</small>}
      </main>}

      {view === 'paywall' && <main className="evera-paywall">
        <p className="evera-quiz__eyebrow">Your personalized program</p>
        <h1>Your Evera plan is ready</h1>
        <p>Based on your GLP-1 journey, goals, and challenges, we created a personalized maintenance program designed to help you protect your progress.</p>
        <div className="evera-paywall__focus"><FocusIcon size={27} /><div><small>YOUR PRIMARY FOCUS</small><strong>{displayedFocus}</strong><span>Your plan is personalized based on your answers.</span></div></div>
        <div className="evera-paywall__heading"><h2>Choose your maintenance journey</h2><p>Select the program length that fits your goals.</p></div>
        <div className="evera-paywall__plans">
          {localizedPlans.map((plan) => <article className={`${selectedPlan.id === plan.id ? 'is-selected ' : ''}${plan.id === 'complete-30' ? 'is-recommended' : ''}`} key={plan.id} onClick={() => selectPlan(plan)}>
            {plan.badge && <em>{plan.badge}</em>}
            <small>{plan.name}</small><strong>{plan.price}</strong><span className="evera-paywall__positioning">{plan.positioning}</span><p>{plan.description}</p>
            <ul>{plan.includes.map((item) => <li key={item}><Check size={14} /> {item}</li>)}</ul>
            <button className={selectedPlan.id === plan.id ? 'evera-paywall__primary' : 'evera-paywall__secondary'} type="button" disabled={saving} onClick={(event) => { event.stopPropagation(); startCheckout(plan) }}>{saving && selectedPlan.id === plan.id ? 'Opening checkout…' : plan.cta} <ArrowRight size={16} /></button>
          </article>)}
        </div>
        <section className="evera-paywall__value"><div><p className="evera-quiz__eyebrow">Personalized to your answers</p><h2>Your plan is built around you</h2><p>Evera creates a maintenance roadmap based on your answers, not a generic program.</p></div><div>{['Your GLP-1 journey stage', 'Your biggest challenges', 'Your maintenance goals', 'Your preferred focus areas'].map((item) => <span key={item}><Check size={15} /> {item}</span>)}</div></section>
        <section className="evera-paywall__roadmap"><p className="evera-quiz__eyebrow">Program preview</p><div className="evera-paywall__roadmap-content" key={selectedPlan.id}><h2>{selectedPreview.title}</h2><p>{selectedPreview.subtitle}</p><div>{selectedPreview.cards.map((card) => <article key={card.label}><small>{card.label}</small><strong>{card.title}</strong><ul>{card.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div></section>
        <div className="evera-paywall__closing">
          <p>Your recommended plan</p><strong>{selectedPlan.name} · {selectedPlan.price}</strong>
          <button className="phase2-button" type="button" disabled={saving} onClick={() => startCheckout()}>{saving ? 'Opening checkout…' : selectedPlan.cta} {!saving && <ArrowRight size={18} />}</button>
        </div>
        {error && <p className="evera-account__error" role="alert">{error}</p>}
        {!hasAnyStripeCheckout && <small><ShieldCheck size={13} /> Test checkout mode: no card is charged.</small>}
      </main>}

      {view === 'program' && account?.hasPaid && <EveraProgramDashboard account={account} onExit={onClose} onSignOut={logOut} />}
    </div>
  )
}
