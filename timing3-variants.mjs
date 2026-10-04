// Тайминг, третья серия: 3 варианта «дорого, минималистично, не пусто», всё видно сразу.
// Запуск: node timing3-variants.mjs → tilda/timing3/
import fs from 'node:fs';

const ITEMS = [
  ['16:30', 'Сбор гостей', 'Welcome-зона, лёгкие закуски и время для тёплых встреч'],
  ['17:00', 'Выездная церемония', 'Самый трогательный момент дня'],
  ['18:00', 'Начало банкета', 'Ужин, тёплые слова и танцы'],
  ['23:00', 'Завершение вечера', 'В 23:30 трансфер отвезёт гостей в город'],
];

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..600;1,400..600&subset=cyrillic&display=swap">`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const base = (p) => `
.${p}{--bg:#F6F1EA;--paper:#FBF8F3;--sand:#EDE3D7;--choc:#3E2F27;--ink:#4A3A31;--latte:#8C7566;--ghost:#E7DCCF;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--bg);color:var(--choc);font-family:'Lora',Georgia,serif;font-weight:500;font-size:16px;line-height:1.5;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,ol,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.1;background-size:200px;background-image:${NOISE}}
.${p}>*{position:relative;z-index:1}
.${p} h2{font-size:clamp(18px,5.2vw,21px);letter-spacing:.42em;text-transform:uppercase;font-weight:500;line-height:1.2;margin-right:-.42em;text-align:center}
.${p} .kick{text-align:center;font-style:italic;font-weight:400;font-size:14.5px;color:var(--latte);margin-top:8px}
.${p} .t{font-variant-numeric:lining-nums tabular-nums;line-height:1}
.${p} .d{color:var(--ink);font-weight:400;text-wrap:balance}
.tm-js .${p} [data-tm]{opacity:0;transform:translateY(14px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease)}
.tm-js .${p} [data-tm].tm-in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.tm-js .${p} [data-tm]{transform:none;transition:opacity .6s linear}}`;

const REVEAL = `<script>(function(){var d=document;d.documentElement.classList.add('tm-js');
function go(){var els=d.querySelectorAll('[data-tm]:not(.tm-o)'),next=0;
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('tm-in')});return}
var io=new IntersectionObserver(function(es){es.filter(function(e){return e.isIntersecting}).sort(function(a,b){var r=a.boundingClientRect,s=b.boundingClientRect;return r.top-s.top||r.left-s.left}).forEach(function(e){
var now=Date.now(),at=Math.max(now,next);next=at+260;io.unobserve(e.target);setTimeout(function(){e.target.classList.add('tm-in')},at-now)})},{rootMargin:'0px 0px -6% 0px',threshold:.15});
els.forEach(function(e){e.classList.add('tm-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [];

/* ---------- 1. Программа на плотной карточке: слепое тиснение рамки, курсивные цифры ---------- */
V.push(['01-letterpress-card', 'Карточка с тиснением', `
<style>${base('tp1')}
.tp1{padding:46px 16px 52px}
.tp1 .card{position:relative;background:var(--paper);padding:38px 24px 34px;border-radius:2px;
  box-shadow:0 1px 1px rgba(62,47,39,.06),0 10px 20px -14px rgba(62,47,39,.25),0 34px 60px -34px rgba(62,47,39,.4)}
.tp1 .card::before{content:'';position:absolute;inset:11px;border-radius:1px;pointer-events:none;
  box-shadow:inset 0 1px 1.5px rgba(62,47,39,.16),inset 0 -1px 0 rgba(255,255,255,.95),0 1px 0 rgba(255,255,255,.9)}
.tp1 .card::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.14;background-size:180px;background-image:${NOISE}}
.tp1 .card>*{position:relative;z-index:1}
.tp1 .top{text-align:center;font-size:10.5px;letter-spacing:.32em;text-transform:uppercase;color:var(--latte);margin-bottom:14px}
.tp1 .list{margin-top:30px;display:grid;gap:22px}
.tp1 li{display:grid;grid-template-columns:76px 1fr;column-gap:14px;align-items:baseline}
.tp1 .t{grid-row:span 2;font-style:italic;font-weight:400;font-size:clamp(26px,7.6vw,30px);color:var(--latte);text-align:right}
.tp1 .n{font-size:16.5px;line-height:1.3;font-weight:500}
.tp1 .d{grid-column:2;margin-top:3px;font-size:14px;line-height:1.45}
.tp1 .sign{margin-top:30px;text-align:center;font-style:italic;font-weight:400;font-size:14.5px;color:var(--latte)}
@media (max-width:359px){.tp1 li{grid-template-columns:66px 1fr}}
</style>
<section class="tp1" aria-label="Тайминг">
  <div class="card" data-tm>
    <p class="top">23 · 07 · 2027</p>
    <h2>Тайминг</h2>
    <ol class="list">${ITEMS.map(([t, n, d]) => `\n      <li data-tm><p class="t">${t}</p><p class="n">${n}</p><p class="d">${d}</p></li>`).join('')}
    </ol>
    <p class="sign" data-tm>Артур &amp; Анна</p>
  </div>
</section>`]);

/* ---------- 2. Большие цифры: крупные «призрачные» часы, на них — время и событие ---------- */
V.push(['02-big-numerals', 'Большие цифры', `
<style>${base('tp2')}
.tp2{padding:58px 22px 64px}
.tp2 .list{margin-top:34px;display:grid;grid-template-columns:1fr 1fr;column-gap:18px;row-gap:26px}
.tp2 li{position:relative;padding-top:58px;min-height:170px}
.tp2 .h{position:absolute;left:-4px;top:-10px;font-size:clamp(104px,31vw,128px);line-height:1;font-weight:400;letter-spacing:-.04em;
  color:var(--ghost);font-variant-numeric:lining-nums;z-index:-1;
  background:linear-gradient(180deg,#E3D6C8 0%,#EFE7DD 70%,rgba(239,231,221,0) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.tp2 .t{font-style:italic;font-weight:400;font-size:19px;color:var(--latte)}
.tp2 .n{margin-top:8px;font-size:12px;letter-spacing:.17em;text-transform:uppercase;font-weight:600;line-height:1.35}
.tp2 .d{margin-top:6px;font-size:14px;line-height:1.45;text-wrap:pretty}
</style>
<section class="tp2" aria-label="Тайминг">
  <h2 data-tm>Тайминг</h2>
  <p class="kick" data-tm>23 июля · пятница</p>
  <ol class="list">${ITEMS.map(([t, n, d]) => `\n    <li data-tm><span class="h" aria-hidden="true">${t.slice(0, 2)}</span><p class="t">${t}</p><p class="n">${n}</p><p class="d">${d}</p></li>`).join('')}
  </ol>
</section>`]);

/* ---------- 3. Арки-ниши: четыре мягко утопленные арки, внутри — время и событие ---------- */
V.push(['03-arches', 'Арки-ниши', `
<style>${base('tp3')}
.tp3{padding:56px 20px 62px}
.tp3 .list{margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:16px 14px}
.tp3 li{position:relative;text-align:center;padding:30px 12px 18px;min-height:206px;border-radius:999px 999px 4px 4px;
  background:linear-gradient(180deg,#EDE3D7 0%,#F3ECE3 46%,#F8F3EC 100%);
  box-shadow:inset 0 14px 22px -14px rgba(62,47,39,.22),inset 0 -1px 0 rgba(255,255,255,.8),0 1px 0 rgba(255,255,255,.95),0 18px 28px -26px rgba(62,47,39,.35)}
.tp3 .t{margin-top:12px;font-weight:400;font-size:clamp(30px,9vw,36px);color:var(--choc);letter-spacing:.01em}
.tp3 .n{margin-top:10px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;line-height:1.35;color:var(--choc)}
.tp3 .d{margin-top:7px;font-size:13.5px;line-height:1.42;font-style:italic}
.tm-js .tp3 li[data-tm]{transform:translateY(14px) scale(.97)}
.tm-js .tp3 li[data-tm].tm-in{transform:none}
@media (max-width:359px){.tp3 .d{font-size:13px}.tp3 li{padding:26px 10px 16px}}
</style>
<section class="tp3" aria-label="Тайминг">
  <h2 data-tm>Тайминг</h2>
  <p class="kick" data-tm>23 июля · пятница</p>
  <ol class="list">${ITEMS.map(([t, n, d]) => `\n    <li data-tm><p class="t">${t}</p><p class="n">${n}</p><p class="d">${d}</p></li>`).join('')}
  </ol>
</section>`]);

const dir = new URL('tilda/timing3/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ТАЙМИНГ · ${name} -->\n${FONTS}\n${html.trim()}\n${REVEAL}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(22), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
