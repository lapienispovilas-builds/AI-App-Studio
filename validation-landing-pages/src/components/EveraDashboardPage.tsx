import { useEffect, useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { EveraProgramDashboard } from './EveraProgramDashboard'
import { getEveraAccount, markEveraPaid, signOutOfEvera, type EveraAccountData } from '../lib/everaAccount'
import { getEveraFlowUrl } from '../lib/domainRouting'

export function EveraDashboardPage() {
  const [account, setAccount] = useState<EveraAccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    getEveraAccount().then(async (savedAccount) => {
      if (!active || !savedAccount) return
      const checkoutSucceeded = new URLSearchParams(window.location.search).get('checkout') === 'success'
      if (checkoutSucceeded && !savedAccount.hasPaid && savedAccount.selectedPlan) {
        const unlockedAccount = await markEveraPaid(savedAccount, savedAccount.selectedPlan)
        if (active) setAccount(unlockedAccount)
        window.history.replaceState({}, '', '/dashboard')
      } else {
        setAccount(savedAccount)
      }
    }).catch(() => {
      if (active) setMessage('We could not open your plan. Please sign in again.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function signOut() {
    await signOutOfEvera()
    window.location.assign(getEveraFlowUrl('?signin=1'))
  }

  if (loading) return <main className="evera-dashboard-state"><span>◉</span><h1>Opening your Evera plan…</h1></main>
  if (!account || !account.hasPaid) return <main className="evera-dashboard-state"><LockKeyhole size={34} /><h1>Your Evera plan is protected</h1><p>{message || (account ? 'Complete checkout to unlock your personalized program.' : 'Sign in to access your purchased plan.')}</p><a className="phase2-button" href={getEveraFlowUrl(account ? '' : '?signin=1')}>{account ? 'Return to plan selection' : 'Sign in'} <ArrowRight size={18} /></a></main>

  return <div className="evera-dashboard-page"><div className="evera-dashboard-page__brand">◉ Evera</div><EveraProgramDashboard account={account} onSignOut={signOut} /></div>
}
