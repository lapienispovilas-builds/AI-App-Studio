import { HomePage } from './components/HomePage'
import { LandingPage } from './components/LandingPage'
import { landingPagesByPath } from './landingPageConfig'

export function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const config = landingPagesByPath[path]

  if (path === '/') return <HomePage />
  if (config) return <LandingPage config={config} />

  return (
    <main className="not-found">
      <p>404</p>
      <h1>That idea isn’t here.</h1>
      <a href="/">Back to all landing pages</a>
    </main>
  )
}
