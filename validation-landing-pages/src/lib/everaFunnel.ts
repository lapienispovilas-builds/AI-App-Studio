import type { EveraFocus } from './everaAccount'
import type { EveraPlan } from './everaCheckout'

export type EveraQuizDraft = {
  answers: Record<string, string>
  primaryFocus: EveraFocus
  secondaryFocuses: EveraFocus[]
  selectedPlan?: EveraPlan['id']
  locale?: 'en' | 'da'
  checkoutComplete?: boolean
  createdAt: string
}

const DRAFT_KEY = 'evera_quiz_draft_v1'

export function saveEveraQuizDraft(draft: EveraQuizDraft) {
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function getEveraQuizDraft(): EveraQuizDraft | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY) ?? window.localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) as EveraQuizDraft : null
  } catch {
    return null
  }
}

export function updateEveraQuizDraft(updates: Partial<EveraQuizDraft>) {
  const draft = getEveraQuizDraft()
  if (!draft) return null
  const updated = { ...draft, ...updates }
  saveEveraQuizDraft(updated)
  return updated
}
