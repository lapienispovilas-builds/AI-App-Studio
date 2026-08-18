import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from '@posthog/react'
import { App } from './App'
import './styles.css'
import { initializePostHog } from './lib/posthogAnalytics'

const posthogClient = initializePostHog()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {posthogClient ? <PostHogProvider client={posthogClient}><App /></PostHogProvider> : <App />}
  </StrictMode>,
)
