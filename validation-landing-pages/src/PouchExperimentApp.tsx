import { useEffect } from 'react'
import { FunctionalPouchPage } from './components/FunctionalPouchPage'
import { PouchComingSoonPage } from './components/PouchComingSoonPage'
import { functionalPouchPages } from './functionalPouchConfig'
import { trackEveraPageView } from './lib/posthogAnalytics'

export function PouchExperimentApp() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const config = functionalPouchPages[path]

  useEffect(() => {
    trackEveraPageView(path)
  }, [path])

  if (config) return <FunctionalPouchPage config={config} />
  return <PouchComingSoonPage />
}

export { PouchExperimentApp as App }
