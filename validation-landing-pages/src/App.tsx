import { useEffect } from 'react'
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
import { EveraPaymentSuccessPage } from './components/EveraPaymentSuccessPage'
import { createDanishLandingConfig } from './everaDanish'
import { ChapterStudentQuiz } from './components/ChapterStudentQuiz'
import { trackEveraPageView } from './lib/posthogAnalytics'
import { EveraMaintenanceQuiz } from './components/EveraMaintenanceQuiz'
import { captureChapterAcquisition } from './lib/chapterAcquisition'

const chapterStudentDomains = new Set(['trychapter.lt', 'www.trychapter.lt'])

export function shouldShowChapterStudentHome(hostname: string, path: string) {
  return path === '/' && chapterStudentDomains.has(hostname.toLowerCase())
}

export function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const showChapterStudentHome = shouldShowChapterStudentHome(window.location.hostname, path)
  const showChapterStudentQuiz = path === `/${chapterrStudentLandingPage.slug}/quiz` || (path === '/quiz' && chapterStudentDomains.has(window.location.hostname.toLowerCase()))
  const showEveraHome = path === '/' && isEveraDomain(window.location.hostname)
  const config = landingPagesByPath[path]
  const phase2Config = phase2LandingPagesByPath[path]
  const chapterLegalConfig = chapterLegalPagesByPath[path]
  const danishEveraConfig = createDanishLandingConfig(phase2LandingPagesByPath['/glp1-tracker-maintenance'])
  const isEveraPage = isEveraDomain(window.location.hostname)
    || path === '/glp1-tracker-maintenance'
    || ['/dk', '/dk/quiz', '/dk/plan-preview', '/dk/pricing', '/dashboard', '/plan-preview', '/pricing', '/payment-success', '/create-account'].includes(path)

  useEffect(() => {
    if (isEveraPage) trackEveraPageView(path)
  }, [isEveraPage, path])

  useEffect(() => {
    if (showChapterStudentHome || showChapterStudentQuiz) captureChapterAcquisition()
  }, [showChapterStudentHome, showChapterStudentQuiz])

  if (showChapterStudentHome) return <ChapterrStudentLandingPage config={chapterrStudentLandingPage} />
  if (showChapterStudentQuiz) return <ChapterStudentQuiz />
  if (showEveraHome) return <Phase2LandingPage config={phase2LandingPagesByPath['/glp1-tracker-maintenance']} />
  if (path === '/dk') return <Phase2LandingPage config={danishEveraConfig} />
  if (path === '/dk/quiz') return <EveraMaintenanceQuiz locale="da" onClose={() => window.location.assign('/dk')} />
  if (path === '/dk/plan-preview' || path === '/dk/pricing') return <EveraPlanPreviewPage locale="da" />
  if (path === '/dashboard') return <EveraDashboardPage />
  if (path === '/plan-preview' || path === '/pricing') return <EveraPlanPreviewPage />
  if (path === '/payment-success') return <EveraPaymentSuccessPage />
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
