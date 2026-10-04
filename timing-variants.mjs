// Блок «Тайминг» — 4 варианта для Тильды. Запуск: node timing-variants.mjs → tilda/timing/
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
.${p}{--bg:#F6F1EA;--choc:#3E2F27;--ink:#4A3A31;--latte:#8C7566;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--bg);color:var(--choc);font-family:'Lora',Georgia,serif;font-weight:500;font-size:17px;line-height:1.6;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,ol,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.1;background-size:200px;background-image:${NOISE}}
.${p} h2{font-size:clamp(20px,5.8vw,24px);letter-spacing:.42em;text-transform:uppercase;font-weight:500;color:var(--choc);margin-right:-.42em}
.${p} .t{font-weight:400;font-variant-numeric:lining-nums tabular-nums;color:var(--latte);letter-spacing:.03em;line-height:1}
.${p} .n{color:var(--choc)}
.${p} .d{color:var(--ink);font-weight:400;text-wrap:balance}
/* поэтапное появление: время → название → описание */
.tm-js .${p} [data-tm]>*{opacity:0;transform:translateY(16px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease)}
.tm-js .${p} [data-tm]>*:nth-child(2){transition-delay:.12s}
.tm-js .${p} [data-tm]>*:nth-child(3){transition-delay:.24s}
.tm-js .${p} .tm-in>*{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.tm-js .${p} [data-tm]>*{transform:none;transition:opacity .6s linear}}`;

// Пункты появляются по очереди: даже если на экран попали сразу несколько — с шагом 0.35 с
const SCRIPT = `<script>(function(){var d=document;d.documentElement.classList.add('tm-js');
function go(){var els=d.querySelectorAll('[data-tm]:not(.tm-o)'),next=0;
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('tm-in')});return}
var io=new IntersectionObserver(function(es){es.filter(function(e){return e.isIntersecting}).sort(function(a,b){return a.boundingClientRect.top-b.boundingClientRect.top}).forEach(function(e){
var now=Date.now(),at=Math.max(now,next);next=at+350;io.unobserve(e.target);setTimeout(function(){e.target.classList.add('tm-in')},at-now)})},{rootMargin:'0px 0px -12% 0px',threshold:.2});
els.forEach(function(e){e.classList.add('tm-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const head = (p) => `<h2 data-tm><span>Тайминг</span></h2>`;
const list = (cls = '') => `<ol class="list ${cls}">${ITEMS.map(([t, n, d]) =>
  `\n    <li data-tm><p class="t">${t}</p><p class="n">${n}</p><p class="d">${d}</p></li>`).join('')}\n  </ol>`;

/* ---------- Волны из ткани: бесшовные по горизонтали, мягко растворяются сверху и снизу ---------- */
function ribbon(yc, amp, thick, phase, seed) {
  const P = 800, W = 1600, pts = (sign) => {
    const out = [];
    for (let x = 0; x <= W; x += 20) {
      const k = (2 * Math.PI * x) / P;
      const mid = yc + amp * Math.sin(k + phase) + amp * 0.35 * Math.sin(2 * k + phase * 1.7 + seed);
      const half = (thick / 2) * (1 + 0.45 * Math.sin(k + phase + 1.3 + seed));
      out.push([x, mid + sign * half]);
    }
    return out;
  };
  const top = pts(-1), bot = pts(1).reverse();
  return 'M' + top.map(([x, y]) => `${x} ${y.toFixed(1)}`).join(' L') + ' L' + bot.map(([x, y]) => `${x} ${y.toFixed(1)}`).join(' L') + ' Z';
}
const WAVES = (() => {
  const H = 1000;
  const bands = [
    [120, 46, 120, 0.2, 0.4, 'a', 46, 1], [300, 60, 150, 2.1, 1.1, 'b', 64, -1], [480, 40, 110, 4.0, 2.2, 'a', 52, 1],
    [660, 58, 160, 1.2, 0.7, 'b', 70, -1], [850, 44, 120, 3.3, 1.9, 'a', 58, 1],
  ];
  return `<svg class="waves" viewBox="0 0 1600 ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="tmA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".45" stop-color="#FBF7F1" stop-opacity=".55"/><stop offset="1" stop-color="#E4D8CA" stop-opacity=".55"/></linearGradient>
      <linearGradient id="tmB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9DFD3" stop-opacity=".5"/><stop offset=".55" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#EDE4D9" stop-opacity=".35"/></linearGradient>
    </defs>
    ${bands.map(([y, a, t, ph, s, g, dur, dir], i) =>
      `<g class="w" style="--dur:${dur}s;animation-direction:${dir > 0 ? 'normal' : 'reverse'};--bob:${(i % 2 ? 7 : -6)}px"><path fill="url(#tm${g.toUpperCase()})" d="${ribbon(y, a, t, ph, s)}"/></g>`).join('\n    ')}
  </svg>`;
})();

const V = [];

/* ---------- 1. Классика по центру: только типографика и воздух ---------- */
V.push(['01-centered', 'По центру', `
<style>${base('tm1')}
.tm1{padding:104px 28px 112px;text-align:center}
.tm1 .list{margin-top:64px;display:grid;gap:56px}
.tm1 .t{font-size:clamp(34px,10vw,42px)}
.tm1 .n{margin-top:14px;font-size:12.5px;letter-spacing:.24em;text-transform:uppercase;font-weight:600}
.tm1 .d{margin:8px auto 0;max-width:270px;font-size:16.5px;line-height:1.6;text-wrap:balance}
</style>
<section class="tm1" aria-label="Тайминг">
  ${head()}
  ${list()}
</section>`]);

/* ---------- 2. Две колонки: время слева, событие справа ---------- */
V.push(['02-columns', 'Две колонки', `
<style>${base('tm2')}
.tm2{padding:100px 28px 108px}
.tm2 h2{text-align:left;margin-right:0}
.tm2 .list{margin-top:56px;display:grid;gap:44px}
.tm2 li{display:grid;grid-template-columns:88px 1fr;column-gap:18px;align-items:baseline}
.tm2 .t{font-size:clamp(25px,7.2vw,30px);grid-row:span 2}
.tm2 .n{font-size:19px;line-height:1.35;font-weight:500}
.tm2 .d{grid-column:2;margin-top:6px;font-size:16px;line-height:1.55}
@media (max-width:359px){.tm2 li{grid-template-columns:76px 1fr;column-gap:14px}}
</style>
<section class="tm2" aria-label="Тайминг">
  ${head()}
  ${list()}
</section>`]);

/* ---------- 3. По центру на фоне струящихся волн ткани (с лёгким движением) ---------- */
V.push(['03-silk-waves', 'Волны ткани', `
<style>${base('tm3')}
.tm3{padding:112px 28px 120px;text-align:center}
.tm3 .waves{position:absolute;left:0;top:0;width:300%;height:100%;z-index:0;pointer-events:none;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 16%,#000 84%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 16%,#000 84%,transparent 100%)}
.tm3 .waves .w{animation-name:tm3-flow;animation-duration:var(--dur);animation-timing-function:linear;animation-iteration-count:infinite;will-change:transform}
.tm3 .waves .w path{animation:tm3-bob calc(var(--dur) / 4) ease-in-out infinite alternate}
@keyframes tm3-flow{from{transform:translateX(0)}to{transform:translateX(-800px)}}
@keyframes tm3-bob{from{transform:translateY(0)}to{transform:translateY(var(--bob))}}
.tm3>*:not(.waves){position:relative;z-index:1}
.tm3 .list{margin-top:64px;display:grid;gap:56px}
.tm3 .t{font-size:clamp(34px,10vw,42px)}
.tm3 .n{margin-top:14px;font-size:12.5px;letter-spacing:.24em;text-transform:uppercase;font-weight:600}
.tm3 .d{margin:8px auto 0;max-width:270px;font-size:16.5px;line-height:1.6;text-wrap:balance}
@media (prefers-reduced-motion:reduce){.tm3 .waves .w,.tm3 .waves .w path{animation:none}}
</style>
<section class="tm3" aria-label="Тайминг">
  ${WAVES}
  ${head()}
  ${list()}
</section>`]);

/* ---------- 4. Шахматный ритм: пункты по очереди слева и справа ---------- */
V.push(['04-zigzag', 'Шахматный ритм', `
<style>${base('tm4')}
.tm4{padding:104px 28px 108px}
.tm4 h2{text-align:center}
.tm4 .list{margin-top:60px;display:grid;gap:50px}
.tm4 li{width:78%}
.tm4 li:nth-child(even){margin-left:auto;text-align:right}
.tm4 .t{font-size:clamp(44px,13vw,54px)}
.tm4 .n{margin-top:12px;font-size:19px;line-height:1.35}
.tm4 .d{margin-top:6px;font-size:16px;line-height:1.55}
</style>
<section class="tm4" aria-label="Тайминг">
  ${head()}
  ${list()}
</section>`]);

const dir = new URL('tilda/timing/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ТАЙМИНГ · ${name} -->\n${FONTS}\n${html.trim()}\n${SCRIPT}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(16), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
