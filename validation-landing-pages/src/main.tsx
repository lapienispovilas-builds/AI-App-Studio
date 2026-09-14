import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { voicePaths } from './voice/config'
import { initializePostHog } from './lib/posthogAnalytics'

const pouchPaths = new Set(['/zyn-alternative', '/energy', '/coffee', '/checkout', '/coming-soon'])
const path = window.location.pathname.replace(/\/$/, '') || '/'

async function start() {
  const isVoicePage = (voicePaths as readonly string[]).includes(path) || path === '/privacy'
  if (!isVoicePage) await import('./styles.css')
  const { App } = isVoicePage
    ? await import('./voice/VoiceApp')
    : pouchPaths.has(path)
    ? await import('./PouchExperimentApp')
    : await import('./App')

  createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
  if (!isVoicePage) initializePostHog()
}

void start()
