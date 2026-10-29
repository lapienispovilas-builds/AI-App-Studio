import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
const path = window.location.pathname.replace(/\/$/, '') || '/'

async function start() {
  if (path === '/') {
    window.location.replace(`/freight-forwarders/index.html${window.location.search}${window.location.hash}`)
    return
  }

  const { App } = await import('./voice/VoiceApp')

  createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
}

void start()
