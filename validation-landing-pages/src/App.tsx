import { HomePage } from './components/HomePage'
import { LandingPage } from './components/LandingPage'
import { Phase2LandingPage } from './components/Phase2LandingPage'
import { ChapterrLandingPage } from './components/ChapterrLandingPage'
import { chapterrLandingPage } from './chapterrLandingPageConfig'
import { ChapterrStudentLandingPage } from './components/ChapterrStudentLandingPage'
import { chapterrStudentLandingPage } from './chapterrStudentLandingPageConfig'
import { ChapterLegalPage } from './components/ChapterLegalPage'
import { chapterLegalPagesByPath } from './chapterLegalPages'
import { landingPagesByPath } from './landingPageConfig'
import { phase2LandingPagesByPath } from './phase2LandingPageConfig'
import { isEveraDomain } from './lib/domainRouting'
import { EveraDashboardPage } from './components/EveraDashboardPage'
import { EveraPlanPreviewPage } from './components/EveraPlanPreviewPage'
import { EveraCreateAccountPage } from './components/EveraCreateAccountPage'

const chapterStudentDomains = new Set(['trychapter.lt', 'www.trychapter.lt'])

export function shouldShowChapterStudentHome(hostname: string, path: string) {
  return path === '/' && chapterStudentDomains.has(hostname.toLowerCase())
}

export function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const showChapterStudentHome = shouldShowChapterStudentHome(window.location.hostname, path)
  const showEveraHome = path === '/' && isEveraDomain(window.location.hostname)
  const config = landingPagesByPath[path]
  const phase2Config = phase2LandingPagesByPath[path]
  const chapterLegalConfig = chapterLegalPagesByPath[path]

  if (showChapterStudentHome) return <ChapterrStudentLandingPage config={chapterrStudentLandingPage} />
  if (showEveraHome) return <Phase2LandingPage config={phase2LandingPagesByPath['/glp1-tracker-maintenance']} />
  if (path === '/dashboard') return <EveraDashboardPage />
  if (path === '/plan-preview') return <EveraPlanPreviewPage />
  if (path === '/create-account') return <EveraCreateAccountPage />
  if (path === '/') return <HomePage />
  if (path === `/${chapterrLandingPage.slug}`) return <ChapterrLandingPage config={chapterrLandingPage} />
  if (path === `/${chapterrStudentLandingPage.slug}`) return <ChapterrStudentLandingPage config={chapterrStudentLandingPage} />
  if (chapterLegalConfig) return <ChapterLegalPage config={chapterLegalConfig} />
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
