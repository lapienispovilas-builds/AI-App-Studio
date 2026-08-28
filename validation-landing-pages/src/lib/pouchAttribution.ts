import type { PouchPositioning } from '../functionalPouchConfig'

export type ExperimentPositioning = 'zyn' | 'energy' | 'coffee'

const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export function experimentPositioning(positioning: PouchPositioning): ExperimentPositioning {
  return positioning === 'preworkout' ? 'energy' : positioning
}

export function comingSoonUrl(positioning: ExperimentPositioning) {
  const current = new URLSearchParams(window.location.search)
  const next = new URLSearchParams({ source: positioning })

  for (const key of utmKeys) {
    const value = current.get(key)
    if (value) next.set(key, value)
  }

  return `/coming-soon?${next.toString()}`
}
