import { createSign } from 'node:crypto'

type QuizValue = string | string[]
type ChapterSubmission = {
  submissionId?: string
  answers?: Record<string, QuizValue>
  contactMethod?: string
  contactValue?: string
  acquisition?: {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    referrer?: string
    landingPage?: string
  }
}

type ApiRequest = { method?: string; body?: ChapterSubmission }
type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  end: () => void
}

const headers = [
  'Timestamp',
  'Submission ID',
  'City',
  'Study program',
  'Study stage',
  'Free time interests',
  'People they want to meet',
  'What they want from the new city',
  'Preferred way to meet',
  'Current social situation',
  'Joining alone or with existing friend',
  'University email',
  'Preferred contact method',
  'Contact value',
  'Instagram',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'Referrer',
  'Landing page',
  'Status',
  'Matched group',
  'Notes',
] as const

function safeText(value: unknown, maxLength = 1000) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean).join(', ').slice(0, maxLength)
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url')
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
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  const token = await tokenResponse.json() as { access_token?: string }
  if (!tokenResponse.ok || !token.access_token) throw new Error('Google authentication failed.')
  return token.access_token
}

function sheetRange(sheetName: string, cells: string) {
  return `'${sheetName.replace(/'/g, "''")}'!${cells}`
}

async function sheetsRequest(accessToken: string, spreadsheetId: string, range: string, init?: RequestInit) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}${init?.method === 'POST' ? ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS' : ''}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end()
    return
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Chapter Students'
  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    res.status(503).json({ error: 'Registracija laikinai nepasiekiama. Bandyk dar kartą po kelių minučių.' })
    return
  }

  const body = req.body ?? {}
  const answers = body.answers ?? {}
  const submissionId = safeText(body.submissionId, 100)
  const universityEmail = safeText(answers.universityEmail, 320)
  const contactMethod = safeText(body.contactMethod, 50)
  const contactValue = safeText(body.contactValue, 500)

  if (!/^chapter_[a-zA-Z0-9_-]{8,}$/.test(submissionId)
    || !safeText(answers.city)
    || !safeText(answers.studies)
    || !safeText(answers.studyStage)
    || !safeText(answers.currentStage)
    || !safeText(answers.startStyle)
    || !universityEmail
    || !contactMethod
    || !contactValue) {
    res.status(400).json({ error: 'Patikrink privalomus atsakymus ir bandyk dar kartą.' })
    return
  }

  const acquisition = body.acquisition ?? {}
  const row = [
    new Date().toISOString(),
    submissionId,
    safeText(answers.city),
    safeText(answers.studies),
    safeText(answers.studyStage),
    safeText(answers.freeTime),
    safeText(answers.peopleType),
    '',
    '',
    safeText(answers.currentStage),
    safeText(answers.startStyle),
    universityEmail,
    contactMethod,
    contactValue,
    safeText(answers.instagram),
    safeText(acquisition.utmSource, 250),
    safeText(acquisition.utmMedium, 250),
    safeText(acquisition.utmCampaign, 250),
    safeText(acquisition.referrer, 1000),
    safeText(acquisition.landingPage, 1000),
    'New',
    '',
    '',
  ]

  try {
    const accessToken = await getGoogleAccessToken(serviceAccountEmail, privateKey)

    const headerResponse = await sheetsRequest(accessToken, spreadsheetId, sheetRange(sheetName, 'A1:W1'))
    const headerData = await headerResponse.json() as { values?: string[][] }
    if (!headerResponse.ok) throw new Error('Google Sheet could not be read.')
    const existingHeaders = headerData.values?.[0] ?? []
    if (!existingHeaders.length) {
      const createHeaderResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(sheetRange(sheetName, 'A1:W1'))}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [headers] }),
      })
      if (!createHeaderResponse.ok) throw new Error('Google Sheet headers could not be created.')
    } else if (headers.some((header, index) => existingHeaders[index] !== header)) {
      throw new Error('Google Sheet headers do not match the Chapter schema.')
    }

    const idsResponse = await sheetsRequest(accessToken, spreadsheetId, sheetRange(sheetName, 'B2:B'))
    const idsData = await idsResponse.json() as { values?: string[][] }
    if (!idsResponse.ok) throw new Error('Existing submissions could not be checked.')
    if ((idsData.values ?? []).some(([id]) => id === submissionId)) {
      res.status(200).json({ ok: true, duplicate: true, submissionId })
      return
    }

    const appendResponse = await sheetsRequest(accessToken, spreadsheetId, sheetRange(sheetName, 'A:W'), {
      method: 'POST',
      body: JSON.stringify({ values: [row] }),
    })
    if (!appendResponse.ok) throw new Error('Submission could not be appended.')

    res.status(200).json({ ok: true, duplicate: false, submissionId })
  } catch (error) {
    // Keep contact details out of logs; only record the integration-level reason.
    console.error('Chapter Google Sheets submission failed:', error instanceof Error ? error.message : 'Unknown integration error')
    res.status(502).json({ error: 'Nepavyko išsaugoti atsakymų. Tavo atsakymai liko čia — bandyk dar kartą.' })
  }
}
