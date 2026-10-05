/**
 * Анкета гостя → сообщение в Telegram.
 *
 * Токен бота хранится ТОЛЬКО здесь, в «Свойствах скрипта», и никогда не попадает на сайт.
 * Сайт отправляет ответы на адрес этого веб-приложения, а уже оно пересылает их в Telegram.
 *
 * Настройка (один раз):
 * 1. script.google.com → «Новый проект» → вставьте этот код вместо содержимого Code.gs → сохраните.
 * 2. Слева «Настройки проекта» (шестерёнка) → «Свойства скрипта» → «Добавить свойство»:
 *      BOT_TOKEN = токен бота от @BotFather
 *      CHAT_ID   = 1214163826
 * 3. Вверху выберите функцию testTelegram → «Выполнить» → разрешите доступ.
 *    В Telegram должно прийти тестовое сообщение. (Перед этим напишите боту /start с того аккаунта.)
 * 4. «Развернуть» → «Новое развертывание» → тип «Веб-приложение»:
 *      Выполнять как: «Я»;  У кого есть доступ: «Все».
 *    Скопируйте URL вида https://script.google.com/macros/s/…/exec
 * 5. Вставьте этот URL в код анкеты на сайте вместо ВСТАВЬТЕ_URL_СКРИПТА.
 */

var ATTEND = { yes: 'С радостью приду', no: 'К сожалению, не смогу прийти' };
var WAY = { self: 'Доберусь самостоятельно', transfer: 'Нужен трансфер' };
var DRINKS = ['Красное вино', 'Белое вино', 'Игристое вино', 'Виски', 'Коньяк', 'Водка', 'Не пью алкоголь'];
var MAX_PER_10_MIN = 40;   // защита от спама: не больше 40 анкет за 10 минут со всех устройств

function doPost(e) {
  var p = (e && e.parameter) || {};
  try {
    // 1. ловушки для ботов: скрытое поле и слишком быстрое заполнение
    if (p.website) return json({ ok: true });
    if (Number(p.t || 0) < 2500) return json({ ok: true });

    // 2. общий лимит частоты
    var cache = CacheService.getScriptCache();
    var n = Number(cache.get('rv-count') || 0);
    if (n >= MAX_PER_10_MIN) return json({ ok: false, error: 'rate' });
    cache.put('rv-count', String(n + 1), 600);

    // 3. проверка и очистка данных: принимаем только известные значения
    var guests = String(p.guests || '').split('\n').map(function (s) { return clean(s, 80); }).filter(String).slice(0, 10);
    if (!guests.length) return json({ ok: false, error: 'name' });
    if (!ATTEND[p.attend]) return json({ ok: false, error: 'attend' });
    var drinks = String(p.drinks || '').split('\n').filter(function (d) { return DRINKS.indexOf(d) > -1; });
    var other = clean(p.other, 120);
    var way = WAY[p.way] || '';

    // 4. повторная отправка той же анкеты в течение 2 минут не дублируется
    var key = 'rv-' + Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify([guests, p.attend, drinks, other, p.way])));
    if (cache.get(key)) return json({ ok: true });

    var lines = ['<b>Новая анкета гостя</b>', ''];
    lines.push('<b>Гости:</b> ' + guests.map(esc).join(', '));
    lines.push('<b>Присутствие:</b> ' + ATTEND[p.attend]);
    if (p.attend === 'yes') {
      var d = drinks.slice();
      if (other) d.push('свой вариант: ' + other);
      lines.push('<b>Напитки:</b> ' + (d.length ? esc(d.join(', ')) : '—'));
      lines.push('<b>Дорога:</b> ' + (way || '—'));
    }
    send(lines.join('\n'));
    cache.put(key, '1', 120);
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server' });
  }
}

function doGet() { return json({ ok: true }); }

function send(text) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('BOT_TOKEN'), chat = props.getProperty('CHAT_ID');
  if (!token || !chat) throw new Error('Не заданы BOT_TOKEN / CHAT_ID в свойствах скрипта');
  var res = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    payload: JSON.stringify({ chat_id: chat, text: text, parse_mode: 'HTML', disable_web_page_preview: true })
  });
  if (res.getResponseCode() !== 200) throw new Error('Telegram: ' + res.getResponseCode() + ' ' + res.getContentText());
}

function testTelegram() { send('<b>Проверка:</b> анкета гостя подключена ✓'); }

function clean(v, max) { return String(v || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
