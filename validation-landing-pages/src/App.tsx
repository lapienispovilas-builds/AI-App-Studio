import { HomePage } from './components/HomePage'
import { LandingPage } from './components/LandingPage'
import { Phase2LandingPage } from './components/Phase2LandingPage'
import { ChapterrLandingPage } from './components/ChapterrLandingPage'
import { chapterrLandingPage } from './chapterrLandingPageConfig'
import { ChapterrStudentLandingPage } from './components/ChapterrStudentLandingPage'
import { chapterrStudentLandingPage } from './chapterrStudentLandingPageConfig'
import { landingPagesByPath } from './landingPageConfig'
import { phase2LandingPagesByPath } from './phase2LandingPageConfig'

export function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const config = landingPagesByPath[path]
  const phase2Config = phase2LandingPagesByPath[path]

  if (path === '/') return <HomePage />
  if (path === `/${chapterrLandingPage.slug}`) return <ChapterrLandingPage config={chapterrLandingPage} />
  if (path === `/${chapterrStudentLandingPage.slug}`) return <ChapterrStudentLandingPage config={chapterrStudentLandingPage} />
  if (config) return <LandingPage config={config} />
  if (phase2Config) return <Phase2LandingPage config={phase2Config} />

  return (
    <main className="not-found">
      <p>404</p>
      <h1>That idea isn’t here.</h1>
      <a href="/">Back to all landing pages</a>
    </main>
  )
}
