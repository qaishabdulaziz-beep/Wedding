// Анкета гостя с прямой отправкой в Telegram-бота (без Google). Берёт tilda/rsvp/*.html → tilda/rsvp-tg/
// Внимание: токен бота виден в коде страницы. В репозитории — заглушка ВСТАВЬТЕ_ТОКЕН_БОТА.
// Запуск: node rsvp-variants.mjs && node rsvp-tg.mjs   (TG_TOKEN=... — подставить токен в копию, OUT=папка)
import fs from 'node:fs';

const TOKEN = process.env.TG_TOKEN || 'ВСТАВЬТЕ_ТОКЕН_БОТА';
const CHAT = process.env.TG_CHAT || '1214163826';
const src = new URL('tilda/rsvp/', import.meta.url);
const out = process.env.OUT ? new URL('file://' + process.env.OUT.replace(/\/?$/, '/')) : new URL('tilda/rsvp-tg/', import.meta.url);
fs.mkdirSync(out, { recursive: true });

const OLD_SEND_START = "var data=new URLSearchParams({guests:";
const OLD_SEND_END = "fetch(ep,{method:'POST',body:data,signal:ctl?ctl.signal:undefined}).then(function(r){return r.json()}).then(function(r){if(!r||!r.ok)throw 0;";
const NEW_SEND = `var oth=a==='yes'&&oc.checked?q('input[name=other]').value.trim().slice(0,120):'',wr=q('input[name=way]:checked');
var esc=function(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')};
var L=['<b>Новая анкета гостя</b>','','<b>Гости:</b> '+esc(guests().join(', ')),'<b>Присутствие:</b> '+(a==='yes'?'С радостью приду':'К сожалению, не смогу прийти')];
if(a==='yes'){var dd=dr.slice();if(oth)dd.push('свой вариант: '+oth);L.push('<b>Напитки:</b> '+(dd.length?esc(dd.join(', ')):'—'));L.push('<b>Дорога:</b> '+(wr?(wr.value==='transfer'?'Нужен трансфер':'Доберусь самостоятельно'):'—'))}
var tk=f.getAttribute('data-token')||'',chat=f.getAttribute('data-chat')||'';
var bot=q('.hp').value||Date.now()-t0<2500;
busy=true;f.classList.add('busy');var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){ctl&&ctl.abort()},15000);
(bot?Promise.resolve({ok:true}):fetch('https://api.telegram.org/bot'+tk+'/sendMessage',{method:'POST',body:new URLSearchParams({chat_id:chat,text:L.join('\\n'),parse_mode:'HTML'}),signal:ctl?ctl.signal:undefined}).then(function(r){return r.json()})).then(function(r){if(!r||!r.ok)throw 0;`;

for (const file of fs.readdirSync(src).filter((f) => f.endsWith('.html'))) {
  let s = fs.readFileSync(new URL(file, src), 'utf8');
  const i = s.indexOf(OLD_SEND_START), j = s.indexOf(OLD_SEND_END);
  if (i < 0 || j < 0) throw new Error('не найден код отправки в ' + file);
  s = s.slice(0, i) + NEW_SEND + s.slice(j + OLD_SEND_END.length);
  s = s.replace(/  <!-- АДРЕС ОТПРАВКИ:.*-->\n/, '  <!-- TELEGRAM: data-token — токен бота, data-chat — ID получателя (он должен один раз нажать «Старт» в боте) -->\n')
       .replace('data-endpoint="ВСТАВЬТЕ_URL_СКРИПТА"', `data-token="${TOKEN}" data-chat="${CHAT}"`);
  if (/ВСТАВЬТЕ_URL|script\.google/.test(s)) throw new Error('остался адрес Google в ' + file);
  fs.writeFileSync(new URL(file, out), s);
  console.log(file.padEnd(14), (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB');
}
