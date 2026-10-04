// Блок «Календарь» — 4 варианта для Тильды (T123). Запуск: node calendar-variants.mjs → tilda/calendar/
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const FONT_SHA = '5b262026dec5461ae613b800d9f57ca265cc2c3d';
const MAIN_SHA = '076d0ea8abd7db458bdebeb63300c70b9fd89215';

const Y = 2027, M = 6, DAY = 23;              // июль 2027 (месяц с нуля)
const CAPTION = '23 июля 2027 · пятница';
const WD = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..600&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Bikham Cyr Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/bikhamcyrscript.ttf') format('truetype');}
</style>`;

// Сетка месяца: пустые ячейки до 1-го числа (неделя с понедельника)
function grid() {
  const first = (new Date(Date.UTC(Y, M, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();
  let h = WD.map((w) => `<span class="wd">${w}</span>`).join('');
  for (let i = 0; i < first; i++) h += '<span></span>';
  for (let d = 1; d <= days; d++) {
    h += d === DAY
      ? `<span class="x">${d}<svg viewBox="0 0 70 58" aria-hidden="true"><path pathLength="1" d="M16 44 C5 35 7 14 27 9 C46 4 64 13 62 29 C60 44 43 51 28 49 C14 47 7 38 10 27 C13 18 22 11 38 10"/></svg></span>`
      : `<span>${d}</span>`;
  }
  return `<div class="grid" role="img" aria-label="Календарь: июль ${Y}, выделено ${CAPTION}">${h}</div>`;
}

// Общая основа
const base = (p) => `
.${p}{--sand:#E8DDD0;--ivory:#F6F1EA;--choc:#3E2F27;--latte:#9C806C;--line:rgba(62,47,39,.2);
--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--sand);color:var(--choc);font-family:var(--serif);font-weight:500;font-size:17px;line-height:1.6;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2){margin:0;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.1;background-size:200px;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.${p} .script{font-family:var(--script);font-weight:400;line-height:1}
.${p} .caps{font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:500;color:var(--latte);line-height:1.5}
.${p} .grid{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-variant-numeric:lining-nums tabular-nums;font-weight:400;font-size:17px}
.${p} .grid span{position:relative;height:46px;display:flex;align-items:center;justify-content:center}
.${p} .grid .wd{height:36px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:500;color:var(--latte)}
.${p} .grid .x{font-weight:600}
.${p} .grid .x svg{position:absolute;left:50%;top:50%;width:62px;height:52px;margin:-26px 0 0 -31px;overflow:visible;pointer-events:none}
.${p} .grid .x path{fill:none;stroke:var(--choc);stroke-width:1.25;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:0}
.${p} .cap{text-align:center;font-size:17px;letter-spacing:.02em}
.ca-js .${p} .grid .x path{stroke-dashoffset:1}
.ca-js .${p}.ca-on .grid .x path{transition:stroke-dashoffset 1.5s cubic-bezier(.45,.1,.3,1) .9s;stroke-dashoffset:0}
.ca-js .${p} .fade{opacity:0;transform:translateY(14px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.ca-js .${p}.ca-on .fade{opacity:1;transform:none}
@media (max-width:360px){.${p} .grid span{height:42px}.${p} .grid{font-size:16px}}
@media (prefers-reduced-motion:reduce){.ca-js .${p} .grid .x path{stroke-dashoffset:0;transition:none}.ca-js .${p} .fade{transform:none;transition:opacity .6s linear}}`;

// Обводка срабатывает один раз, когда календарь появился на экране
const SCRIPT = `<script>(function(){var d=document;d.documentElement.classList.add('ca-js');
function go(){var els=d.querySelectorAll('[data-ca]:not(.ca-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('ca-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('ca-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -15% 0px',threshold:.35});
els.forEach(function(e){e.classList.add('ca-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [];

/* ---------- 1. Как в референсе: месяц слева, год справа, тонкая линия.
   Переход: айвори плавно перетекает в беж, сверху спускается тонкая «нить» ---------- */
V.push(['01-reference-thread', 'Как в референсе · плавный переход и нить', `
<style>${base('ca1')}
.ca1{background:linear-gradient(180deg,var(--ivory) 0,var(--sand) 170px);padding:128px 26px 88px}
.ca1 .thread{position:absolute;left:50%;top:0;width:1px;height:84px;background:linear-gradient(var(--line),rgba(62,47,39,.45));transform-origin:top}
.ca1 .thread::after{content:'';position:absolute;left:-2.5px;bottom:-3px;width:6px;height:6px;border-radius:50%;background:var(--choc);opacity:.75}
.ca-js .ca1 .thread{transform:scaleY(0);transition:transform 1.3s var(--ease)}
.ca-js .ca1.ca-on .thread{transform:none}
.ca1 .head{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:14px;border-bottom:1px solid var(--line);margin-bottom:14px}
.ca1 .head b{font-weight:400;font-size:clamp(24px,7vw,30px);letter-spacing:.14em;text-transform:uppercase}
.ca1 .cap{margin-top:28px}
</style>
<section class="ca1" data-ca aria-label="Дата свадьбы">
  <span class="thread" aria-hidden="true"></span>
  <div class="head fade"><b>Июль</b><b>2027</b></div>
  <div class="fade" style="--d:.15s">${grid()}</div>
  <p class="cap fade" style="--d:.3s">${CAPTION}</p>
</section>`]);

/* ---------- 2. Арка: беж поднимается куполом в айвори ---------- */
V.push(['02-arch', 'Арка-купол', `
<style>${base('ca2')}
.ca2{background:var(--ivory);padding-top:34px}
.ca2 .arch{position:relative;background:var(--sand);border-radius:50% 50% 0 0/190px 190px 0 0;padding:104px 26px 88px}
.ca2 .arch::before{content:'';position:absolute;left:12px;right:12px;top:12px;height:300px;border-radius:50% 50% 0 0/178px 178px 0 0;
  box-shadow:inset 0 1px 0 0 rgba(62,47,39,.28);pointer-events:none;
  -webkit-mask:linear-gradient(#000 40%,transparent);mask:linear-gradient(#000 40%,transparent)}
.ca2 .title{text-align:center;margin-bottom:22px}
.ca2 .title .script{font-size:clamp(58px,17vw,72px);display:inline-block;padding:.2em .4em .25em;margin:-.2em -.4em -.25em}
.ca2 .title .caps{display:block;margin-top:2px;color:var(--choc);letter-spacing:.42em;font-size:12px}
.ca2 .grid{border-top:1px solid var(--line);padding-top:12px}
.ca2 .cap{margin-top:26px}
.ca2 .cap::before{content:'';display:block;width:5px;height:5px;margin:0 auto 18px;transform:rotate(45deg);box-shadow:inset 0 0 0 1px var(--latte)}
</style>
<section class="ca2" data-ca aria-label="Дата свадьбы">
  <div class="arch">
    <h2 class="title fade"><span class="script">Июль</span><span class="caps">2027</span></h2>
    <div class="fade" style="--d:.15s">${grid()}</div>
    <p class="cap fade" style="--d:.3s">${CAPTION}</p>
  </div>
</section>`]);

/* ---------- 3. Полукруглая выемка по центру стыка (как вырез билета) ---------- */
V.push(['03-notch', 'Выемка на стыке', `
<style>${base('ca3')}
.ca3{padding:110px 26px 88px}
.ca3 .notch{position:absolute;left:50%;top:-38px;width:76px;height:76px;margin-left:-38px;border-radius:50%;background:var(--ivory)}
.ca3 .notch::after{content:'';position:absolute;left:50%;bottom:16px;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:var(--choc);opacity:.7}
.ca3 .head{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:10px;border-bottom:1px solid var(--line);margin-bottom:14px}
.ca3 .head .script{font-size:clamp(54px,16vw,66px);padding:.2em .4em .22em;margin:-.2em -.4em -.22em -.32em}
.ca3 .head .caps{color:var(--choc);font-size:13px;letter-spacing:.34em;padding-bottom:12px}
.ca3 .cap{margin-top:28px;display:flex;align-items:center;gap:14px;justify-content:center}
.ca3 .cap::before,.ca3 .cap::after{content:'';width:26px;height:1px;background:var(--latte);opacity:.6}
</style>
<section class="ca3" data-ca aria-label="Дата свадьбы">
  <span class="notch" aria-hidden="true"></span>
  <div class="head fade"><h2 class="script">Июль</h2><span class="caps">2027</span></div>
  <div class="fade" style="--d:.15s">${grid()}</div>
  <p class="cap fade" style="--d:.3s">${CAPTION}</p>
</section>`]);

/* ---------- 4. Заголовок «Июль» стоит на границе двух цветов ---------- */
V.push(['04-seam-title', 'Заголовок на стыке', `
<style>${base('ca4')}
.ca4{background:linear-gradient(180deg,var(--ivory) 0 58px,var(--sand) 58px);padding:14px 26px 88px}
.ca4 .title{text-align:center}
.ca4 .title .script{font-size:clamp(70px,21vw,88px);display:inline-block;padding:.22em .45em .25em;margin:-.22em -.45em -.25em}
.ca4 .title .caps{display:block;margin-top:4px;color:var(--choc);letter-spacing:.42em;font-size:12px}
.ca4 .frame{margin-top:30px;padding:8px 0 10px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);position:relative}
.ca4 .frame::before,.ca4 .frame::after{content:'';position:absolute;left:0;right:0;height:1px;background:var(--line);opacity:.6}
.ca4 .frame::before{top:3px}.ca4 .frame::after{bottom:3px}
.ca4 .cap{margin-top:26px}
</style>
<section class="ca4" data-ca aria-label="Дата свадьбы">
  <h2 class="title fade"><span class="script">Июль</span><span class="caps">2027</span></h2>
  <div class="frame fade" style="--d:.15s">${grid()}</div>
  <p class="cap fade" style="--d:.3s">${CAPTION}</p>
</section>`]);

const dir = new URL('tilda/calendar/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- КАЛЕНДАРЬ · ${name} -->\n${FONTS}\n${html.trim()}\n${SCRIPT}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(22), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
