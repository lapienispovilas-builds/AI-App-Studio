const REVOMATIX_HEADERS = [
  'Submission ID', 'Timestamp', 'Name', 'Work email', 'Company', 'Monthly trigger volume',
  'Existing solution?', 'Existing solution details', 'Preferred follow-up channel', 'How it is handled today',
  'Adjacent problems', 'Open to share examples?', 'Wedge', 'Form submitted on',
  'First landing page', 'UTM source', 'UTM medium', 'UTM campaign',
  'UTM content', 'UTM term', 'Referrer', 'Test traffic'
];
const REVOMATIX_HEADER_ALIASES = {
  'Monthly trigger volume': ['Volume'],
  'Existing solution?': ['Current spend'],
  'Existing solution details': ['Current use'],
  'Preferred follow-up channel': ['Channel preference'],
  'How it is handled today': ['Optional answer'],
  'Adjacent problems': ['Related issues'],
  'Open to share examples?': ['Anonymized examples'],
  'Wedge': ['Niche'],
  'Form submitted on': ['Submission path'],
  'First landing page': ['Original landing path']
};

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse(event.postData.contents || '{}');
    const expected = PropertiesService.getScriptProperties().getProperty('REVOMATIX_SHARED_SECRET');
    if (!expected || body.secret !== expected) return revomatixReply({ok: false, error: 'Unauthorized'});
    const lead = body.lead || {};
    if (!lead.submissionId) return revomatixReply({ok: false, error: 'Missing submission ID'});
    lock.waitLock(10000);

    const sheetId = PropertiesService.getScriptProperties().getProperty('REVOMATIX_SHEET_ID');
    const tabName = PropertiesService.getScriptProperties().getProperty('REVOMATIX_SHEET_TAB') || 'first';
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(tabName);
    if (!sheet) throw new Error('Sheet tab not found');
    const width = Math.max(sheet.getLastColumn(), REVOMATIX_HEADERS.length);
    const headers = sheet.getRange(1, 1, 1, width).getDisplayValues()[0].map(String);
    const headerColumns = revomatixResolveHeaders(headers);

    const idColumn = headerColumns['Submission ID'] + 1;
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const ids = sheet.getRange(2, idColumn, lastRow - 1, 1).getDisplayValues().flat();
      if (ids.includes(String(lead.submissionId))) return revomatixReply({ok: true, submissionId: lead.submissionId, duplicate: true});
    }

    const values = {
      'Submission ID': lead.submissionId, 'Timestamp': new Date().toISOString(), 'Name': lead.name,
      'Work email': lead.email, 'Company': lead.company, 'Monthly trigger volume': lead.volume,
      'Existing solution?': lead.currentSpend, 'Existing solution details': lead.currentUse,
      'Preferred follow-up channel': lead.channelPreference, 'How it is handled today': lead.answer,
      'Adjacent problems': lead.relatedIssues, 'Open to share examples?': String(lead.anonymizedExamples === true),
      'Wedge': lead.niche, 'Form submitted on': lead.path, 'First landing page': lead.landingPath,
      'UTM source': lead.utmSource, 'UTM medium': lead.utmMedium, 'UTM campaign': lead.utmCampaign,
      'UTM content': lead.utmContent, 'UTM term': lead.utmTerm, 'Referrer': lead.referrer,
      'Test traffic': String(lead.test === true)
    };
    const row = Array(width).fill('');
    REVOMATIX_HEADERS.forEach(header => row[headerColumns[header]] = revomatixPlainText(values[header]));
    const target = sheet.getRange(lastRow + 1, 1, 1, row.length);
    target.setNumberFormat('@');
    target.setValues([row]);
    SpreadsheetApp.flush();
    return revomatixReply({ok: true, submissionId: lead.submissionId, duplicate: false});
  } catch (error) {
    console.error(String(error));
    return revomatixReply({ok: false, error: 'Save failed'});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function revomatixResolveHeaders(headers) {
  const normalized = headers.map(value => value.trim().toLowerCase());
  return REVOMATIX_HEADERS.reduce((columns, header) => {
    const accepted = [header].concat(REVOMATIX_HEADER_ALIASES[header] || []).map(value => value.toLowerCase());
    const matches = normalized.map((value, index) => accepted.indexOf(value) >= 0 ? index : -1).filter(index => index >= 0);
    if (matches.length !== 1) throw new Error('Missing, duplicate, or ambiguous header: ' + header);
    columns[header] = matches[0];
    return columns;
  }, {});
}

function revomatixPlainText(value) {
  const text = value == null ? '' : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function revomatixReply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
