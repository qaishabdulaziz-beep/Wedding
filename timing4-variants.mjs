// Тайминг, четвёртая серия: 2 варианта. Запуск: node timing4-variants.mjs → tilda/timing4/
import fs from 'node:fs';

const ITEMS = [
  ['16:30', 'Сбор гостей', 'Welcome-зона, лёгкие закуски и время для тёплых встреч'],
  ['17:00', 'Выездная церемония', 'Самый трогательный момент дня'],
  ['18:00', 'Начало банкета', 'Ужин, тёплые слова и танцы'],
  ['23:00', 'Завершение вечера', 'В 23:30 трансфер отвезёт гостей в город'],
];

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..600&subset=cyrillic&display=swap">`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const base = (p) => `
.${p}{--bg:#F6F1EA;--choc:#3E2F27;--ink:#5A4A40;--latte:#8C7566;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--bg);color:var(--choc);font-family:'Lora',Georgia,serif;font-weight:500;font-size:16px;line-height:1.5;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,ol,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.1;background-size:200px;background-image:${NOISE}}
.${p}>*{position:relative;z-index:1}
.${p} h2{font-size:clamp(18px,5.2vw,21px);letter-spacing:.42em;text-transform:uppercase;font-weight:500;line-height:1.2;margin-right:-.42em;text-align:center}
.${p} .t{font-weight:400;font-variant-numeric:lining-nums tabular-nums;line-height:1;letter-spacing:.02em}
.${p} .n{font-weight:500;color:var(--choc)}
.${p} .d{font-weight:400;color:var(--ink);text-wrap:balance}`;

// Блок «включается», когда появляется на экране (один раз)
const ON = `<script>(function(){var d=document;d.documentElement.classList.add('tl-js');
function go(){var els=d.querySelectorAll('[data-tl]:not(.tl-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('tl-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('tl-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -15% 0px',threshold:.25});
els.forEach(function(e){e.classList.add('tl-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [];

/* ---------- 1. По центру: время → событие → описание (мельче) ---------- */
V.push(['01-centered', 'По центру', `
<style>${base('tc')}
.tc{padding:52px 26px 56px;text-align:center}
.tc .list{margin-top:38px;display:grid;gap:30px}
.tc .t{font-size:clamp(28px,8.4vw,34px);color:var(--latte)}
.tc .n{margin-top:10px;font-size:17.5px;line-height:1.3}
.tc .d{margin:5px auto 0;max-width:290px;font-size:14.5px;line-height:1.5}
/* поэтапно сверху вниз */
.tl-js .tc h2,.tl-js .tc li>*{opacity:0;transform:translateY(-12px);transition:opacity 1s var(--ease),transform 1s var(--ease)}
.tl-js .tc.tl-on h2,.tl-js .tc.tl-on li>*{opacity:1;transform:none}
.tc li:nth-child(1)>*{transition-delay:.35s}.tc li:nth-child(2)>*{transition-delay:.75s}
.tc li:nth-child(3)>*{transition-delay:1.15s}.tc li:nth-child(4)>*{transition-delay:1.55s}
@media (prefers-reduced-motion:reduce){.tl-js .tc h2,.tl-js .tc li>*{transform:none;transition:opacity .6s linear}}
</style>
<section class="tc" data-tl aria-label="Тайминг">
  <h2>Тайминг</h2>
  <ol class="list">${ITEMS.map(([t, n, d]) => `\n    <li><p class="t">${t}</p><p class="n">${n}</p><p class="d">${d}</p></li>`).join('')}
  </ol>
</section>
${ON}`]);

/* ---------- 2. Линия слева с точками: линия прорисовывается сверху вниз,
   у каждой точки по очереди появляются время и событие ---------- */
V.push(['02-line-dots', 'Линия с точками', `
<style>${base('tv')}
.tv{padding:60px 26px 66px}
.tv .list{position:relative;margin:38px auto 0;max-width:330px;display:grid;gap:26px;padding-left:36px}
.tv .line{position:absolute;left:5px;top:9px;bottom:var(--lb,40px);width:1px;
  background:linear-gradient(180deg,rgba(62,47,39,.55),rgba(140,117,102,.35));transform-origin:top}
.tv li{position:relative}
.tv li::before{content:'';position:absolute;left:-36px;top:3px;width:11px;height:11px;border-radius:50%;
  background:var(--bg);box-shadow:inset 0 0 0 1px var(--choc),0 0 0 5px var(--bg)}
.tv li::after{content:'';position:absolute;left:-33px;top:6px;width:5px;height:5px;border-radius:50%;background:var(--choc)}
.tv .t{font-size:clamp(22px,6.6vw,26px);color:var(--latte)}
.tv .n{margin-top:7px;font-size:17px;line-height:1.3}
.tv .d{margin-top:3px;font-size:14.5px;line-height:1.48}
/* анимация: линия растёт сверху вниз, точки и тексты появляются, когда линия до них доходит */
.tl-js .tv .line{transform:scaleY(0);transition:transform 2.6s cubic-bezier(.45,.05,.3,1) .2s}
.tl-js .tv.tl-on .line{transform:none}
.tl-js .tv h2{opacity:0;transition:opacity 1s var(--ease)}
.tl-js .tv.tl-on h2{opacity:1}
.tl-js .tv li::before,.tl-js .tv li::after{transform:scale(0);transition:transform .7s cubic-bezier(.3,1.5,.5,1) var(--dl)}
.tl-js .tv.tl-on li::before,.tl-js .tv.tl-on li::after{transform:none}
.tl-js .tv li>*{opacity:0;transform:translateY(-12px);transition:opacity .9s var(--ease) var(--dl),transform .9s var(--ease) var(--dl)}
.tl-js .tv li>.n{transition-delay:calc(var(--dl) + .1s)}.tl-js .tv li>.d{transition-delay:calc(var(--dl) + .2s)}
.tl-js .tv.tl-on li>*{opacity:1;transform:none}
.tv li:nth-child(2){--dl:.25s}.tv li:nth-child(3){--dl:.95s}.tv li:nth-child(4){--dl:1.65s}.tv li:nth-child(5){--dl:2.35s}
@media (prefers-reduced-motion:reduce){.tl-js .tv .line,.tl-js .tv li::before,.tl-js .tv li::after{transform:none;transition:none}.tl-js .tv li>*{transform:none;transition:opacity .6s linear}}
</style>
<section class="tv" data-tl aria-label="Тайминг">
  <h2>Тайминг</h2>
  <ol class="list"><span class="line" aria-hidden="true"></span>${ITEMS.map(([t, n, d]) => `\n    <li><p class="t">${t}</p><p class="n">${n}</p><p class="d">${d}</p></li>`).join('')}
  </ol>
</section>
<script>(function(){var s=document.currentScript.previousElementSibling;if(!s||!s.querySelector)return;
/* линия заканчивается ровно на последней точке */
function fit(){var l=s.querySelector('.list'),li=l.querySelectorAll('li'),last=li[li.length-1];if(last)l.style.setProperty('--lb',(l.offsetHeight-last.offsetTop-9)+'px')}
fit();window.addEventListener('resize',fit);if(document.fonts)document.fonts.ready.then(fit)})();</script>
${ON}`]);

const dir = new URL('tilda/timing4/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ТАЙМИНГ · ${name} -->\n${FONTS}\n<script>document.documentElement.classList.add('tl-js')</script>\n${html.trim()}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(16), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
