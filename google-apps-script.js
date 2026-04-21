// Paste this into Extensions → Apps Script in your Google Sheet
// Then: Deploy → New deployment → Web App → Execute as: Me → Who has access: Anyone → Deploy

var SHEET_ID = '1pUCS1XeUY_Cn5LXntS9m_Cqa2fNcY9gfWEOesBP7Gp4';

function doPost(e) {
  try {
    var data   = JSON.parse(e.postData.contents);
    var sheet  = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Always ensure correct headers in row 1
    var headers = ['Submitted At', 'Name', 'Email', 'Mobile', 'Skills Known', 'Course', 'Score %', 'Correct', 'Total', 'Status'];
    var firstCell = sheet.getRange(1, 1).getValue();
    if (firstCell !== 'Submitted At' || sheet.getRange(1, 5).getValue() !== 'Skills Known') {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
           .setFontWeight('bold')
           .setBackground('#0d0d0d')
           .setFontColor('#00ff41');
      sheet.setFrozenRows(1);
    }

    var status = data.percentage >= 60 ? '✅ QUALIFIED' : '❌ NOT QUALIFIED';

    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name,
      data.email,
      data.mobile,
      data.skills,
      data.course,
      data.percentage + '%',
      data.correct,
      data.total,
      status
    ]);

    // Colour the new row green if qualified
    if (data.percentage >= 60) {
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, 10)
           .setBackground('#e8f5e9');
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: click Run on this function inside Apps Script editor to test
function testPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User', email: 'test@test.com', mobile: '9999999999',
        skills: 'HTML / CSS, JavaScript',
        course: 'MERN Stack & AI', percentage: 73, correct: 8, total: 11
      })
    }
  };
  Logger.log(doPost(fakeEvent).getContent());
}
