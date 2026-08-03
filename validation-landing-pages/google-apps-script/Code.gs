const SHEET_NAME = 'Early Access Leads';

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Received at',
        'App',
        'Page',
        'Email',
        'Willingness to pay',
        'Biggest frustration',
        'Browser submitted at',
        'Source URL',
      ]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    }

    if (!data.email || !isValidEmail(data.email)) {
      return jsonResponse({ ok: false, error: 'A valid email address is required.' });
    }

    sheet.appendRow([
      new Date(),
      safeCell(data.idea),
      safeCell(data.page),
      safeCell(data.email),
      safeCell(data.willingnessToPay),
      safeCell(data.biggestFrustration),
      safeCell(data.submittedAt),
      safeCell(data.sourceUrl),
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
