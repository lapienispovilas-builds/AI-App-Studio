import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { initializePostHog } from './lib/posthogAnalytics'

const pouchPaths = new Set(['/zyn-alternative', '/energy', '/coffee', '/checkout', '/coming-soon'])
const path = window.location.pathname.replace(/\/$/, '') || '/'

async function start() {
  const { App } = pouchPaths.has(path)
    ? await import('./PouchExperimentApp')
    : await import('./App')

  createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
  initializePostHog()
}

void start()
