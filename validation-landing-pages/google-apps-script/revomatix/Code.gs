const REVOMATIX_HEADERS = [
  'Submission ID', 'Timestamp', 'Name', 'Work email', 'Company', 'Volume',
  'Current spend', 'Current use', 'Channel preference', 'Optional answer',
  'Related issues', 'Anonymized examples', 'Niche', 'Submission path',
  'Original landing path', 'UTM source', 'UTM medium', 'UTM campaign',
  'UTM content', 'UTM term', 'Referrer', 'Test traffic'
];

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
    REVOMATIX_HEADERS.forEach(name => {
      if (headers.filter(value => value.trim().toLowerCase() === name.toLowerCase()).length !== 1) throw new Error('Missing or duplicate header: ' + name);
    });

    const idColumn = headers.findIndex(value => value.trim().toLowerCase() === 'submission id') + 1;
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const ids = sheet.getRange(2, idColumn, lastRow - 1, 1).getDisplayValues().flat();
      if (ids.includes(String(lead.submissionId))) return revomatixReply({ok: true, submissionId: lead.submissionId, duplicate: true});
    }

    const values = {
      'Submission ID': lead.submissionId, 'Timestamp': new Date().toISOString(), 'Name': lead.name,
      'Work email': lead.email, 'Company': lead.company, 'Volume': lead.volume,
      'Current spend': lead.currentSpend, 'Current use': lead.currentUse,
      'Channel preference': lead.channelPreference, 'Optional answer': lead.answer,
      'Related issues': lead.relatedIssues, 'Anonymized examples': String(lead.anonymizedExamples === true),
      'Niche': lead.niche, 'Submission path': lead.path, 'Original landing path': lead.landingPath,
      'UTM source': lead.utmSource, 'UTM medium': lead.utmMedium, 'UTM campaign': lead.utmCampaign,
      'UTM content': lead.utmContent, 'UTM term': lead.utmTerm, 'Referrer': lead.referrer,
      'Test traffic': String(lead.test === true)
    };
    const row = headers.map(header => Object.prototype.hasOwnProperty.call(values, header) ? revomatixPlainText(values[header]) : '');
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

function revomatixPlainText(value) {
  const text = value == null ? '' : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function revomatixReply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
