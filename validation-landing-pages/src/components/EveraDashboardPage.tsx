import { useEffect, useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { EveraProgramDashboard } from './EveraProgramDashboard'
import { getEveraAccount, signOutOfEvera, type EveraAccountData } from '../lib/everaAccount'
import { getEveraFlowUrl } from '../lib/domainRouting'
import { getEveraQuizDraft } from '../lib/everaFunnel'
import { trackMetaEvent } from '../lib/metaPixel'

export function EveraDashboardPage() {
  const [account, setAccount] = useState<EveraAccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    getEveraAccount().then((savedAccount) => {
      if (!active) return
      if (savedAccount && !savedAccount.hasPaid) {
        window.location.replace('/pricing')
        return
      }
      setAccount(savedAccount)
    }).catch(() => {
      if (active) setMessage('We could not open your plan. Please sign in again.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!account?.hasPaid) return
    const duration = account.selectedPlan === 'starter-7' ? '7-day' : account.selectedPlan === 'journey-90' ? '90-day' : '30-day'
    trackMetaEvent('DashboardViewed', { program_duration: duration }, {
      custom: true,
      onceKey: `dashboard_viewed_${account.userId}_${account.selectedPlan ?? 'complete-30'}`,
    })
  }, [account])

  async function signOut() {
    await signOutOfEvera()
    window.location.assign(getEveraFlowUrl('?signin=1'))
  }

  if (loading) return <main className="evera-dashboard-state"><span>◉</span><h1>Opening your Evera plan…</h1></main>
  if (!account) {
    const hasQuiz = Boolean(getEveraQuizDraft())
    return <main className="evera-dashboard-state"><LockKeyhole size={34} /><h1>Your Evera plan is protected</h1><p>{message || (hasQuiz ? 'Choose a plan to continue your personalized journey.' : 'Sign in to access a purchased plan, or complete the assessment to create one.')}</p><a className="phase2-button" href={hasQuiz ? '/pricing' : getEveraFlowUrl('?signin=1')}>{hasQuiz ? 'Return to plan selection' : 'Sign in'} <ArrowRight size={18} /></a></main>
  }

  return <div className="evera-dashboard-page"><div className="evera-dashboard-page__brand">◉ Evera</div><EveraProgramDashboard account={account} onSignOut={signOut} /></div>
}
