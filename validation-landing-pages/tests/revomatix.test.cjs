const { test } = require('node:test')
const assert = require('node:assert/strict')
const { mkdtempSync, writeFileSync, rmSync, readFileSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join } = require('node:path')
const { execFileSync } = require('node:child_process')
const { generateKeyPairSync, randomUUID } = require('node:crypto')

const output = mkdtempSync(join(tmpdir(), 'revomatix-test-'))
writeFileSync(join(output, 'package.json'), '{"type":"commonjs"}')
execFileSync('./node_modules/.bin/tsc', ['--outDir', output, '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node', '--skipLibCheck', '--types', 'node', 'api/revomatix-submit.ts'])
process.on('exit', () => rmSync(output, { recursive: true, force: true }))

const { validate, fields, mappedRow } = require(join(output, 'server/revomatix/validation.js'))
const handler = require(join(output, 'api/revomatix-submit.js')).default
const { voiceFormOptions, voicePages, voicePaths } = require(join(output, 'src/voice/config.js'))

const expectedFields = ['Submission ID','Timestamp','Name','Work email','Company','Volume','Current spend','Current use','Channel preference','Optional answer','Related issues','Anonymized examples','Niche','Submission path','Original landing path','UTM source','UTM medium','UTM campaign','UTM content','UTM term','Referrer','Test traffic']
const body = () => ({
  submissionId: randomUUID(), name: 'QA Test', email: 'qa@example.com', company: 'Synthetic QA',
  volume: '21–50', currentSpend: 'Yes', currentUse: 'Answering service', channelPreference: 'Phone call',
  answer: '=SUM(1,2)', relatedIssues: [], anonymizedExamples: true, path: '/moving', landingPath: '/fitness',
  utmSource: 'qa', utmMedium: 'test', utmCampaign: 'launch-check', utmContent: 'form', utmTerm: 'synthetic',
  referrer: 'https://example.com/', test: true, startedAt: Date.now() - 5000
})
const call = async b => {
  let code = 200, result
  const res = { status(n) { code = n; return this }, json(v) { result = v }, setHeader() {}, end() {} }
  await handler({ method: 'POST', body: b, headers: { host: 'localhost', 'content-type': 'application/json', origin: 'http://localhost' } }, res)
  return { code, ...result }
}

process.env.REVOMATIX_SHEET_ID = 'test-sheet'
process.env.REVOMATIX_SHEET_TAB = 'QA'
process.env.SUPABASE_URL = 'https://db.example'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'synthetic'
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@example.com'
process.env.GOOGLE_PRIVATE_KEY = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' })

let rows, book, fail, ambiguous
function reset() { rows = [['Unrelated', ...fields]]; book = new Map(); fail = false; ambiguous = false }
global.fetch = async (url, init = {}) => {
  const data = init.body && typeof init.body === 'string' ? JSON.parse(init.body) : null
  if (url.includes('oauth2')) return Response.json({ access_token: 'synthetic' })
  if (url.includes('/rpc/')) {
    let r = book.get(data.p_id)
    if (r && r.hash !== data.p_hash) return new Response('', { status: 409 })
    if (!r) { r = { hash: data.p_hash, row_number: Math.max(data.p_floor, book.size + 2), created_at: '2026-09-14T10:00:00Z' }; book.set(data.p_id, r) }
    return Response.json(r)
  }
  if (url.endsWith(':batchUpdate')) {
    if (fail) return new Response('', { status: 503 })
    assert.equal(data.valueInputOption, 'RAW')
    for (const d of data.data) {
      const m = d.range.match(/!([A-Z]+)(\d+)/)
      const col = [...m[1]].reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0) - 1
      const row = Number(m[2]) - 1
      rows[row] ||= []
      rows[row][col] = d.values[0][0]
    }
    if (ambiguous) { ambiguous = false; throw new Error('Simulated lost response') }
    return Response.json({})
  }
  if (url.includes('sheets.googleapis')) {
    const range = decodeURIComponent(url.split('/values/')[1])
    const m = range.match(/!A(\d+):ZZ/)
    return Response.json({ values: m ? [rows[Number(m[1]) - 1] || []] : rows })
  }
  throw new Error('Unexpected upstream')
}

test('all 13 paths have personalized typed form configuration and preserve attribution', () => {
  assert.equal(voicePaths.length, 13)
  for (const path of voicePaths) {
    const page = voicePages[path]
    assert.equal(page.path, path)
    for (const key of ['volumeLabel', 'spendLabel', 'channelLabel']) assert.ok(page.form[key].length > 20, `${path} ${key}`)
    assert.ok(page.form.relatedIssues.length >= 2, `${path} related issues`)
    const lead = validate({ ...body(), path })
    assert.equal(lead.niche, path.slice(1))
    assert.equal(lead.landingPath, '/fitness')
    assert.equal(lead.test, true)
    assert.equal(lead.utmSource, 'qa')
  }
})

test('every configured adjacent issue is accepted only for its own path', () => {
  for (const path of voicePaths) {
    const issues = voicePages[path].form.relatedIssues
    const lead = validate({ ...body(), path, relatedIssues: issues })
    assert.equal(lead.relatedIssues, issues.join(' | '))
    const otherPath = voicePaths.find(candidate => !voicePages[candidate].form.relatedIssues.includes(issues[0]))
    assert.ok(otherPath, `cross-route test target for ${path}`)
    assert.throws(() => validate({ ...body(), path: otherPath, relatedIssues: [issues[0]] }), /Invalid form data/)
  }
  assert.throws(() => validate({ ...body(), relatedIssues: ['Unknown adjacent issue'] }), /Invalid form data/)
})

test('dropdown option sets remain unchanged and reject unknown values', () => {
  assert.deepEqual([...voiceFormOptions.volume], ['Fewer than 5','5–20','21–50','More than 50','Not sure'])
  assert.deepEqual([...voiceFormOptions.spend], ['Yes','No','Not sure'])
  assert.deepEqual([...voiceFormOptions.channel], ['Phone call','Text message','Email','Not sure'])
  for (const volume of voiceFormOptions.volume) assert.equal(validate({ ...body(), volume }).volume, volume)
  for (const currentSpend of voiceFormOptions.spend) assert.equal(validate({ ...body(), currentSpend, currentUse: currentSpend === 'Yes' ? 'Tool' : '' }).currentSpend, currentSpend)
  for (const channelPreference of voiceFormOptions.channel) assert.equal(validate({ ...body(), channelPreference }).channelPreference, channelPreference)
  assert.throws(() => validate({ ...body(), volume: 'Many' }), /Invalid form data/)
})

test('current-use detail is conditional on a Yes answer', () => {
  assert.equal(validate({ ...body(), currentSpend: 'Yes', currentUse: 'Lifecycle tool' }).currentUse, 'Lifecycle tool')
  assert.throws(() => validate({ ...body(), currentSpend: 'No', currentUse: 'Lifecycle tool' }), /Invalid form data/)
  assert.equal(validate({ ...body(), currentSpend: '', currentUse: '' }).currentUse, '')
})

test('identity fields stay required while qualification fields stay optional', () => {
  for (const change of [{ name: ' ' }, { company: '' }, { email: '' }, { email: 'bad' }, { path: '/unknown' }, { website: 'spam' }, { submissionId: 'bad' }]) assert.throws(() => validate({ ...body(), ...change }))
  const lead = validate({ ...body(), volume: '', currentSpend: '', currentUse: '', channelPreference: '', answer: '', relatedIssues: [], anonymizedExamples: false })
  assert.equal(lead.volume, '')
  assert.equal(lead.answer, '')
  assert.equal(lead.relatedIssues, '')
  assert.equal(lead.anonymizedExamples, false)
})

test('field-to-sheet mapping and header order remain unchanged', () => {
  assert.deepEqual([...fields], expectedFields)
  const lead = validate(body())
  const mapping = mappedRow(lead, '2026-09-20T10:00:00Z', [...fields])
  assert.equal(mapping.length, expectedFields.length)
  assert.equal(mapping[expectedFields.indexOf('Volume')].value, '21–50')
  assert.equal(mapping[expectedFields.indexOf('Optional answer')].value, '=SUM(1,2)')
  assert.equal(mapping[expectedFields.indexOf('Original landing path')].value, '/fitness')
  assert.equal(mapping[expectedFields.indexOf('Test traffic')].value, 'true')
  assert.throws(() => mappedRow(lead, 'now', ['Email']), /SHEET_HEADERS/)
})

test('confirmed RAW save is duplicate-safe for retries and concurrent requests', async () => {
  reset()
  const b = body()
  const first = await call(b)
  assert.equal(first.ok, true)
  assert.equal((await call(b)).duplicate, true)
  await Promise.all([call(b), call(b)])
  assert.equal(rows.length, 2)
  assert.equal(rows[1][0], undefined)
})

test('ambiguous or failed upstream saves never return false success', async () => {
  reset(); const ambiguousBody = body(); ambiguous = true
  assert.equal((await call(ambiguousBody)).code, 503)
  assert.equal((await call(ambiguousBody)).ok, true)
  reset(); const failedBody = body(); fail = true
  assert.equal((await call(failedBody)).code, 503)
  assert.equal(rows.length, 1)
  fail = false
  assert.equal((await call(failedBody)).ok, true)
})

test('existing leads and unrelated columns are preserved', async () => {
  reset()
  rows.push(['keep', ...Array(fields.length).fill('existing')])
  const before = JSON.stringify(rows[1])
  assert.equal((await call(body())).ok, true)
  assert.equal(JSON.stringify(rows[1]), before)
})

test('analytics allowlist excludes test traffic and form data', () => {
  const source = readFileSync('src/voice/leadClient.ts', 'utf8')
  assert.match(source, /attribution\(\)\.test/)
  assert.match(source, /!consent/)
  assert.doesNotMatch(source.split('properties:')[1].split('}}')[0], /email|company|answer|name:/)
})
