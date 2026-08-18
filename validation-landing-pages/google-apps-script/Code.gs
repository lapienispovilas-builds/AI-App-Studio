const LEGACY_SHEET_NAME = 'Early Access Leads';

// Phase 2 submissions are routed by page path because the Round 1 project also
// uses the Arrived and Together brand names.
const PHASE_2_SHEETS = {
  '/chapterr-students': {
    sheetName: 'Chapter Leads',
    questions: [
      'city',
      'studies',
      'studyStage',
      'freeTime',
      'peopleType',
      'cityHope',
      'meetingStyle',
      'name',
      'phone',
      'whatsapp',
      'instagram',
    ],
    contactField: 'phone',
  },
  '/glp1-tracker': {
    sheetName: 'TrackGLP Leads',
    questions: ["What's your biggest challenge?", 'What would help you most?'],
  },
  '/glp1-tracker-maintenance': {
    sheetName: 'Evera Maintenance Leads',
    questions: [
      'Where are you in your GLP-1 journey?',
      'What is your biggest concern after GLP-1?',
      'What feels hardest about maintaining your results?',
      'What would help you most?',
      'Would you pay for a tool that helps you maintain your weight after GLP-1 treatment?',
      'landingVariant',
    ],
  },
  '/glp1-tracker-journey': {
    sheetName: 'Evera Whole Journey Leads',
    questions: [
      'Where are you in your GLP-1 journey?',
      'What is your biggest concern after GLP-1?',
      'What feels hardest about maintaining your results?',
      'What would help you most?',
      'Would you pay for a tool that helps you maintain your weight after GLP-1 treatment?',
      'landingVariant',
    ],
  },
  '/dating-again': {
    sheetName: 'NextDate Leads',
    questions: ["What's hardest right now?", 'How long have you been single?'],
  },
  '/together': {
    sheetName: 'Together Leads',
    questions: ["What's hardest in your relationship right now?", 'How often do you have meaningful conversations?'],
  },
  '/reset': {
    sheetName: 'RESET Leads',
    questions: ['When are urges strongest?', 'What have you already tried to stop?'],
  },
  '/arrived': {
    sheetName: 'Arrived Leads',
    questions: [
      'Who would use this most?',
      'When do you feel least safe?',
      'How do you usually let someone know you’re safe?',
    ],
  },
};

const TRACKING_HEADERS = [
  'Browser submitted at',
  'Source URL',
  'UTM source',
  'UTM medium',
  'UTM campaign',
  'UTM content',
  'Form answers',
];

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const pagePath = normalizePagePath(data.page);
    const phase2Config = PHASE_2_SHEETS[pagePath];

    if (phase2Config && phase2Config.contactField === 'phone') {
      if (!data.answers || (!String(data.answers.phone || '').trim() && !String(data.answers.whatsapp || '').trim())) {
        return jsonResponse({ ok: false, error: 'A phone number or WhatsApp username is required.' });
      }
    } else if (!data.email || !isValidEmail(data.email)) {
      return jsonResponse({ ok: false, error: 'A valid email address is required.' });
    }

    if (phase2Config) {
      appendPhase2Lead(spreadsheet, phase2Config, data, pagePath);
    } else {
      appendLegacyLead(spreadsheet, data);
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Run this function once from the Apps Script editor to create/update all routed
// sheet tabs before receiving leads. doPost also creates a missing tab automatically.
function setupPhase2Sheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(PHASE_2_SHEETS).forEach(function (pagePath) {
    const config = PHASE_2_SHEETS[pagePath];
    const headers = phase2Headers(config.questions);
    const sheet = getOrCreateSheet(spreadsheet, config.sheetName, headers);
    sheet.autoResizeColumns(1, headers.length);
  });
}

// Run this after changing the Evera questionnaire if you only want to prepare
// the Evera tab. Do not run doPost manually: it requires a real form request.
function setupEveraMaintenanceSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const config = PHASE_2_SHEETS['/glp1-tracker-maintenance'];
  const headers = phase2Headers(config.questions);
  const sheet = getOrCreateSheet(spreadsheet, config.sheetName, headers);

  formatLeadSheet(sheet, headers, config.questions.length);
}

// Run this once after deploying the updated script to prepare the Variant A tab.
function setupEveraWholeJourneySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const config = PHASE_2_SHEETS['/glp1-tracker-journey'];
  const headers = phase2Headers(config.questions);
  const sheet = getOrCreateSheet(spreadsheet, config.sheetName, headers);

  formatLeadSheet(sheet, headers, config.questions.length);
}

// Recommended setup function for the Evera A/B test. Run this once after
// deploying a new script version. It keeps each variant in its own formatted tab.
function setupEveraLeadSheets() {
  setupEveraMaintenanceSheet();
  setupEveraWholeJourneySheet();
}

// Run this once to create and format the dedicated Chapter student leads tab.
// Chapter uses a phone number as its required contact instead of email.
function setupChapterLeadSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const config = PHASE_2_SHEETS['/chapterr-students'];
  const headers = phase2Headers(config.questions);
  const sheet = getOrCreateSheet(spreadsheet, config.sheetName, headers);

  formatLeadSheet(sheet, headers, config.questions.length);
}

function appendPhase2Lead(spreadsheet, config, data, pagePath) {
  const headers = phase2Headers(config.questions);
  const sheet = getOrCreateSheet(spreadsheet, config.sheetName, headers);
  const answers = data.answers || {};

  sheet.appendRow([
    new Date(),
    safeCell(data.idea),
    safeCell(pagePath),
    safeCell(data.email),
  ].concat(
    config.questions.map(function (question) {
      return safeCell(answers[question]);
    }),
    [
      safeCell(data.submittedAt),
      safeCell(data.sourceUrl),
      safeCell(data.utmSource),
      safeCell(data.utmMedium),
      safeCell(data.utmCampaign),
      safeCell(data.utmContent),
      safeCell(JSON.stringify(answers)),
    ]
  ));
}

function appendLegacyLead(spreadsheet, data) {
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
  const sheet = getOrCreateSheet(spreadsheet, LEGACY_SHEET_NAME, headers);
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
}

function phase2Headers(questions) {
  return ['Received at', 'App', 'Page', 'Email'].concat(questions, TRACKING_HEADERS);
}

function getOrCreateSheet(spreadsheet, sheetName, headers) {
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#1f2937')
      .setFontColor('#ffffff');
  } else {
    validateHeaders(sheet, headers);
  }

  return sheet;
}

function formatLeadSheet(sheet, headers, questionCount) {
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(4);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#205846')
    .setFontColor('#ffffff')
    .setWrap(true)
    .setVerticalAlignment('middle');

  sheet.setRowHeight(1, 44);
  sheet.setColumnWidth(1, 150); // Received at
  sheet.setColumnWidth(2, 110); // App
  sheet.setColumnWidth(3, 210); // Page
  sheet.setColumnWidth(4, 240); // Email

  for (let column = 5; column <= 4 + questionCount; column += 1) {
    sheet.setColumnWidth(column, 260);
  }

  const trackingStartColumn = 5 + questionCount;
  sheet.setColumnWidth(trackingStartColumn, 170); // Browser submitted at
  sheet.setColumnWidth(trackingStartColumn + 1, 260); // Source URL
  sheet.setColumnWidth(trackingStartColumn + 2, 130); // UTM source
  sheet.setColumnWidth(trackingStartColumn + 3, 130); // UTM medium
  sheet.setColumnWidth(trackingStartColumn + 4, 170); // UTM campaign
  sheet.setColumnWidth(trackingStartColumn + 5, 170); // UTM content
  sheet.setColumnWidth(trackingStartColumn + 6, 320); // Raw form answers

  const lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(2, 1, lastRow - 1, headers.length)
    .setWrap(true)
    .setVerticalAlignment('top');

  sheet.getRange(2, 1, lastRow - 1, 1).setNumberFormat('yyyy-mm-dd hh:mm');

  sheet.getBandings().forEach(function (banding) {
    banding.remove();
  });
  sheet.getRange(1, 1, lastRow, headers.length)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
    .setHeaderRowColor('#205846')
    .setFirstRowColor('#f7fbf9')
    .setSecondRowColor('#edf6f1');

  if (sheet.getFilter()) {
    sheet.getFilter().remove();
  }
  sheet.getRange(1, 1, lastRow, headers.length).createFilter();

  const paymentHeader = 'Would you pay for a tool that helps you maintain your weight after GLP-1 treatment?';
  const paymentColumn = headers.indexOf(paymentHeader) + 1;
  if (paymentColumn > 0) {
    const paymentRange = sheet.getRange(2, paymentColumn, Math.max(lastRow - 1, 1), 1);
    const rules = [
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Yes, if it works').setBackground('#d9ead3').setRanges([paymentRange]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Maybe, I would need to learn more').setBackground('#fff2cc').setRanges([paymentRange]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No').setBackground('#f4cccc').setRanges([paymentRange]).build(),
    ];
    sheet.setConditionalFormatRules(rules);
  }
}

function validateHeaders(sheet, expectedHeaders) {
  const existingHeaders = sheet.getRange(1, 1, 1, expectedHeaders.length).getValues()[0];
  const headersMatch = expectedHeaders.every(function (header, index) {
    return existingHeaders[index] === header;
  });

  if (!headersMatch) {
    throw new Error(
      'The headers in "' + sheet.getName() + '" do not match the current form. ' +
      'Rename that tab before running setupPhase2Sheets() to create a fresh one.'
    );
  }
}

function normalizePagePath(value) {
  const page = String(value || '')
    .trim()
    .replace(/^https?:\/\/[^/]+/i, '')
    .split(/[?#]/)[0];
  if (!page) return '';
  return ('/' + page.replace(/^\/+|\/+$/g, '')).replace(/\/$/, '');
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
