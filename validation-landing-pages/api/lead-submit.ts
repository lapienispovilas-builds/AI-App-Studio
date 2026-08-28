import { createSign } from 'node:crypto'

type LeadSubmission = {
  idea?: string
  page?: string
  email?: string
  willingnessToPay?: string
  biggestFrustration?: string
  answers?: Record<string, string>
  submittedAt?: string
  sourceUrl?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
}

type ApiRequest = { method?: string; body?: LeadSubmission }
type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  end: () => void
}

const headers = [
  'Timestamp',
  'Email',
  'Idea',
  'Landing page',
  'Positioning',
  'Willingness to pay',
  'Biggest frustration',
  'Answers',
  'Source URL',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Content',
  'Status',
] as const

function safeText(value: unknown, maxLength = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url')
}

function parseGoogleCredentials() {
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY?.trim()
  let serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim()
  if (!rawPrivateKey) return { serviceAccountEmail, privateKey: '' }

  let privateKey = rawPrivateKey
  if (privateKey.startsWith('{')) {
    const serviceAccount = JSON.parse(privateKey) as { private_key?: string; client_email?: string }
    privateKey = serviceAccount.private_key ?? ''
    serviceAccountEmail ||= serviceAccount.client_email?.trim()
  } else if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = JSON.parse(privateKey) as string
  } else if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1)
  }

  privateKey = privateKey.replace(/^GOOGLE_PRIVATE_KEY=/, '').replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim()
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
    throw new Error('GOOGLE_PRIVATE_KEY is not a valid PEM private key.')
  }
  return { serviceAccountEmail, privateKey }
}

async function getGoogleAccessToken(email: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000)
  const unsignedToken = `${base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64Url(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))}`
  const signer = createSign('RSA-SHA256')
  signer.update(unsignedToken)
  signer.end()
  const assertion = `${unsignedToken}.${base64Url(signer.sign(privateKey))}`
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  })
  const data = await response.json() as { access_token?: string }
  if (!response.ok || !data.access_token) throw new Error('Google authentication failed.')
  return data.access_token
}

function sheetRange(sheetName: string, cells: string) {
  return `'${sheetName.replace(/'/g, "''")}'!${cells}`
}

async function sheetsFetch(token: string, spreadsheetId: string, range: string, init?: RequestInit) {
  const append = init?.method === 'POST' ? ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS' : ''
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}${append}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
  })
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end()
    return
  }

  const body = req.body ?? {}
  const email = safeText(body.email, 320).toLowerCase()
  const page = safeText(body.page, 500)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !page) {
    res.status(400).json({ error: 'Enter a valid email address.' })
    return
  }

  const spreadsheetId = process.env.LEADS_GOOGLE_SHEETS_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const sheetName = process.env.LEADS_GOOGLE_SHEETS_SHEET_NAME || 'Evera Leads'
  let serviceAccountEmail: string | undefined
  let privateKey = ''
  try {
    ({ serviceAccountEmail, privateKey } = parseGoogleCredentials())
  } catch (error) {
    console.error('Lead Google Sheets configuration failed:', error instanceof Error ? error.message : 'Invalid credentials')
    res.status(503).json({ error: 'Lead capture is not configured.' })
    return
  }
  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    res.status(503).json({ error: 'Lead capture is not configured.' })
    return
  }

  const answers = body.answers ?? {}
  const positioning = safeText(answers.positioning, 100)
  const row = [
    safeText(body.submittedAt, 100) || new Date().toISOString(),
    email,
    safeText(body.idea, 200),
    page,
    positioning,
    safeText(body.willingnessToPay, 500),
    safeText(body.biggestFrustration, 1000),
    JSON.stringify(answers).slice(0, 5000),
    safeText(body.sourceUrl, 1000),
    safeText(body.utmSource, 250),
    safeText(body.utmMedium, 250),
    safeText(body.utmCampaign, 250),
    safeText(body.utmContent, 250),
    'New',
  ]

  try {
    const token = await getGoogleAccessToken(serviceAccountEmail, privateKey)
    const headerRange = sheetRange(sheetName, 'A1:N1')
    const headerResponse = await sheetsFetch(token, spreadsheetId, headerRange)
    const headerData = await headerResponse.json() as { values?: string[][] }
    if (!headerResponse.ok) throw new Error(`Google Sheet could not be read (${headerResponse.status}).`)
    const currentHeaders = headerData.values?.[0] ?? []
    if (headers.some((header, index) => currentHeaders[index] !== header)) {
      const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(headerRange)}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [headers] }),
      })
      if (!updateResponse.ok) throw new Error(`Google Sheet headers could not be created (${updateResponse.status}).`)
    }

    const existingResponse = await sheetsFetch(token, spreadsheetId, sheetRange(sheetName, 'B2:D'))
    const existingData = await existingResponse.json() as { values?: string[][] }
    if (!existingResponse.ok) throw new Error(`Existing leads could not be checked (${existingResponse.status}).`)
    const duplicate = (existingData.values ?? []).some(existing => safeText(existing[0], 320).toLowerCase() === email && safeText(existing[2], 500) === page)
    if (!duplicate) {
      const appendResponse = await sheetsFetch(token, spreadsheetId, sheetRange(sheetName, 'A:N'), {
        method: 'POST',
        body: JSON.stringify({ values: [row] }),
      })
      if (!appendResponse.ok) throw new Error(`Lead could not be appended (${appendResponse.status}).`)
    }
    res.status(200).json({ ok: true, duplicate })
  } catch (error) {
    console.error('Lead Google Sheets submission failed:', error instanceof Error ? error.message : 'Unknown integration error')
    res.status(502).json({ error: 'Lead could not be saved.' })
  }
}
