const SHEET_NAME = 'Early Access Leads';

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    const headers = [
      'Received at',
      'App',
      'Page',
      'Email',
      'Willingness to pay',
      'Biggest frustration',
      'Browser submitted at',
      'Source URL',
      'Form answers',
      'Question 1',
      'Answer 1',
      'Question 2',
      'Answer 2',
      'Question 3',
      'Answer 3',
      'UTM source',
      'UTM medium',
      'UTM campaign',
      'UTM content',
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    } else {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

    if (!data.email || !isValidEmail(data.email)) {
      return jsonResponse({ ok: false, error: 'A valid email address is required.' });
    }

    const answerEntries = Object.entries(data.answers || {});

    sheet.appendRow([
      new Date(),
      safeCell(data.idea),
      safeCell(data.page),
      safeCell(data.email),
      safeCell(data.willingnessToPay),
      safeCell(data.biggestFrustration),
      safeCell(data.submittedAt),
      safeCell(data.sourceUrl),
      safeCell(JSON.stringify(data.answers || {})),
      safeCell(answerEntries[0] && answerEntries[0][0]),
      safeCell(answerEntries[0] && answerEntries[0][1]),
      safeCell(answerEntries[1] && answerEntries[1][0]),
      safeCell(answerEntries[1] && answerEntries[1][1]),
      safeCell(answerEntries[2] && answerEntries[2][0]),
      safeCell(answerEntries[2] && answerEntries[2][1]),
      safeCell(data.utmSource),
      safeCell(data.utmMedium),
      safeCell(data.utmCampaign),
      safeCell(data.utmContent),
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

// Prevent user-entered text from becoming a spreadsheet formula.
function safeCell(value) {
  const text = value == null ? '' : String(value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
