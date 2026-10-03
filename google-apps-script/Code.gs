/**
 * Приём анкет гостей в Google Таблицу.
 * Как подключить — см. README.md, раздел «Анкета → Google Sheets».
 */
var SHEET_NAME = 'Ответы';
var HEADERS = ['Дата', 'Фамилия и имя', 'Присутствие', 'Напитки', 'Комментарий'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var p = (e && e.parameter) || {};
    if (p.website) return json({ ok: true });            // ловушка для ботов

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    sh.appendRow([
      new Date(),
      clean(p.name, 120),
      clean(p.attendance, 60),
      clean(p.drinks, 300),
      clean(p.comment, 1000)
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, message: 'RSVP endpoint is running' });
}

// защита от формул в ячейках (=, +, -, @) и обрезка длины
function clean(v, max) {
  v = String(v || '').slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
