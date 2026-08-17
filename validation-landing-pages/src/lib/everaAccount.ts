import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'
import { getEveraFlowUrl } from './domainRouting'

export type EveraFocus = 'Weight Stability' | 'Sustainable Routine' | 'Nutrition & Protein' | 'Strength & Movement' | 'Transition Preparation'

export type EveraAccountData = {
  userId: string
  email: string
  answers: Record<string, string>
  primaryFocus: EveraFocus
  hasPaid: boolean
  selectedPlan?: string
}

type AuthResult = {
  account: EveraAccountData
  needsEmailConfirmation?: boolean
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const LOCAL_ACCOUNT_KEY = 'evera_mvp_account_v1'
const LOCAL_SESSION_KEY = 'evera_mvp_session_v1'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const isEveraTestMode = !isSupabaseConfigured

const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null

function readLocalAccount(): EveraAccountData | null {
  try {
    const value = window.localStorage.getItem(LOCAL_ACCOUNT_KEY)
    return value ? JSON.parse(value) as EveraAccountData : null
  } catch {
    return null
  }
}

function writeLocalAccount(account: EveraAccountData) {
  window.localStorage.setItem(LOCAL_ACCOUNT_KEY, JSON.stringify(account))
  window.localStorage.setItem(LOCAL_SESSION_KEY, account.userId)
}

async function readSupabaseProfile(session: Session): Promise<EveraAccountData> {
  const { data, error } = await supabase!
    .from('evera_profiles')
    .select('quiz_answers,primary_focus,has_paid,selected_plan')
    .eq('id', session.user.id)
    .maybeSingle()

  if (error) throw new Error('We could not load your Evera plan. Please try again.')

  if (!data) {
    const metadataAnswers = (session.user.user_metadata?.evera_answers as Record<string, string> | undefined) ?? {}
    const metadataFocus = (session.user.user_metadata?.evera_focus as EveraFocus | undefined) ?? 'Weight Stability'
    const { error: createError } = await supabase!.from('evera_profiles').insert({
      id: session.user.id,
      email: session.user.email ?? '',
      quiz_answers: metadataAnswers,
      primary_focus: metadataFocus,
      has_paid: false,
    })
    if (createError) throw new Error('We could not finish setting up your Evera plan.')
    return {
      userId: session.user.id,
      email: session.user.email ?? '',
      answers: metadataAnswers,
      primaryFocus: metadataFocus,
      hasPaid: false,
    }
  }

  return {
    userId: session.user.id,
    email: session.user.email ?? '',
    answers: (data?.quiz_answers as Record<string, string> | null) ?? {},
    primaryFocus: (data?.primary_focus as EveraFocus | null) ?? 'Weight Stability',
    hasPaid: Boolean(data?.has_paid),
    selectedPlan: data?.selected_plan ?? undefined,
  }
}

export async function getEveraAccount(): Promise<EveraAccountData | null> {
  if (!supabase) {
    const account = readLocalAccount()
    const sessionId = window.localStorage.getItem(LOCAL_SESSION_KEY)
    return account && sessionId === account.userId ? account : null
  }

  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) return null
  return readSupabaseProfile(data.session)
}

export async function createEveraAccount(
  email: string,
  password: string,
  answers: Record<string, string>,
  primaryFocus: EveraFocus,
): Promise<AuthResult> {
  if (!supabase) {
    const account: EveraAccountData = {
      userId: `local-${Date.now()}`,
      email,
      answers,
      primaryFocus,
      hasPaid: false,
    }
    writeLocalAccount(account)
    return { account }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { evera_answers: answers, evera_focus: primaryFocus } },
  })
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('Your account could not be created. Please try again.')

  const account: EveraAccountData = {
    userId: data.user.id,
    email,
    answers,
    primaryFocus,
    hasPaid: false,
  }

  if (data.session) {
    const { error: profileError } = await supabase.from('evera_profiles').upsert({
      id: data.user.id,
      email,
      quiz_answers: answers,
      primary_focus: primaryFocus,
      has_paid: false,
      updated_at: new Date().toISOString(),
    })
    if (profileError) throw new Error('Your account was created, but your plan could not be saved yet.')
  }

  return { account, needsEmailConfirmation: !data.session }
}

export async function signInToEvera(email: string, password: string): Promise<EveraAccountData> {
  if (!supabase) {
    const account = readLocalAccount()
    if (!account || account.email.toLowerCase() !== email.toLowerCase()) {
      throw new Error('No test account was found for that email.')
    }
    window.localStorage.setItem(LOCAL_SESSION_KEY, account.userId)
    return account
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return readSupabaseProfile(data.session)
}

export async function claimVerifiedEveraPurchase(sessionId: string): Promise<EveraAccountData> {
  if (!supabase) throw new Error('Account persistence must be configured before a purchase can be claimed.')
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session?.access_token) throw new Error('Sign in before opening your purchased plan.')

  const response = await fetch('/api/claim-purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.session.access_token}`,
    },
    body: JSON.stringify({ sessionId }),
  })
  const result = await response.json() as { claimed?: boolean; error?: string }
  if (!response.ok || !result.claimed) throw new Error(result.error || 'Your verified purchase could not be attached to this account.')
  return readSupabaseProfile(data.session)
}

export async function signOutOfEvera() {
  if (!supabase) {
    window.localStorage.removeItem(LOCAL_SESSION_KEY)
    return
  }
  await supabase.auth.signOut()
}

export async function requestEveraPasswordReset(email: string) {
  if (!supabase) throw new Error('Password reset email is available after Supabase is connected.')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getEveraFlowUrl(),
  })
  if (error) throw new Error(error.message)
}
