// Блок «Детали», вторая серия: основной вариант по референсу + 2 дополнительных.
// Запуск: node location2-variants.mjs → tilda/location2/
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const FONT_SHA = '5b262026dec5461ae613b800d9f57ca265cc2c3d';
const MAIN_SHA = '076d0ea8abd7db458bdebeb63300c70b9fd89215';
const PHOTO = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=70'; // временное фото площадки
const ROUTE = 'https://2gis.ru/krasnoyarsk/geo/70030076451649732/92.787464,56.090637';

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..700&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Bikham Cyr Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/bikhamcyrscript.ttf') format('truetype');}
</style>
<script>document.documentElement.classList.add('dl-js')</script>`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const IMG = `<img src="${PHOTO}" alt="Дрокино парк" loading="lazy" decoding="async" onerror="this.style.display='none'">`;
const LOC = `<h3 class="lbl">Локация</h3>
      <p class="venue">Дрокино парк</p>
      <p class="addr">г.&nbsp;Красноярск, ул.&nbsp;Монамур,&nbsp;2</p>`;
const BTN = `<a class="btn" href="${ROUTE}" target="_blank" rel="noopener"><span><span class="pre">Построить </span>маршрут</span><span aria-hidden="true">→</span></a>`;
const TRANSFER = `<h3 class="lbl">Трансфер</h3>
      <p class="txt">Для вашего удобства мы организуем трансфер. Автобус заберёт гостей из трёх точек города и привезёт к месту праздника, а в 23:30 отвезёт всех обратно в город.</p>
      <ul class="pts">
        <li><b>хх:хх</b><span>Точка 1, адрес</span></li>
        <li><b>хх:хх</b><span>Точка 2, адрес</span></li>
        <li><b>хх:хх</b><span>Точка 3, адрес</span></li>
      </ul>
      <p class="note">Пожалуйста, отметьте в анкете, если вам нужен трансфер.</p>`;

const base = (p) => `
.${p}{--ivory:#F6F1EA;--sand:#E8DDD0;--choc:#2E221C;--cream:#F3EBE1;--latte:#C4AE9A;
--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--ivory);color:var(--ivory);font-family:var(--serif);font-weight:400;font-size:14px;line-height:1.5;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,h3,ul,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.12;background-size:200px;background-image:${NOISE}}
.${p} .ttl{position:absolute;z-index:4;font-family:var(--script);font-weight:400;color:var(--choc);line-height:1;white-space:nowrap;pointer-events:none}
.${p} .ttl span{display:inline-block;padding:.25em .45em .3em;margin:-.25em -.45em -.3em}
.${p} .ph{position:relative;overflow:hidden;background:linear-gradient(160deg,#CDBDAE,#8E7A6C)}
.${p} .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.55) sepia(.22) contrast(.95) brightness(1.02)}
.${p} .panel{position:relative;background:var(--choc);color:var(--ivory)}
.${p} .lbl{font-size:12.5px;letter-spacing:.24em;text-transform:uppercase;font-weight:700;color:var(--ivory)}
.${p} .venue{margin-top:10px;font-size:14px;line-height:1.45;color:var(--cream)}
.${p} .addr{margin-top:6px;font-size:clamp(11px,3.3vw,13px);line-height:1.45;white-space:nowrap;color:var(--cream)}
.${p} .btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:10px 10px;overflow:hidden;
  font-size:11px;letter-spacing:.1em;white-space:nowrap;text-transform:uppercase;font-weight:600;color:var(--ivory)!important;text-decoration:none;
  box-shadow:inset 0 0 0 1px rgba(246,241,234,.55);transition:background .4s,color .4s}
.${p} .btn:hover{background:var(--ivory);color:var(--choc)!important}
.${p} .btn.short .pre{display:none}
.${p} .sep{height:1px;background:var(--sand);opacity:.45}
.${p} .tr{padding:22px 20px 30px}
.${p} .txt{margin-top:10px;font-size:14px;line-height:1.55;color:var(--cream)}
.${p} .pts{margin-top:12px;display:grid;gap:7px}
.${p} .pts li{display:grid;grid-template-columns:52px 1fr;gap:8px;font-size:14px;line-height:1.4}
.${p} .pts b{font-weight:600;color:var(--ivory);font-variant-numeric:lining-nums tabular-nums}
.${p} .pts span{color:var(--cream)}
.${p} .note{margin-top:12px;font-size:clamp(11px,3.4vw,13px);white-space:nowrap;color:var(--latte);line-height:1.45}
.dl-js .${p} .fade{opacity:0;transform:translateY(14px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.dl-js .${p}.dl-on .fade{opacity:1;transform:none}
.dl-js .${p} .ph.fade{transform:none;clip-path:inset(0 0 100% 0);transition:opacity .6s linear,clip-path 1.4s cubic-bezier(.7,0,.2,1)}
.dl-js .${p}.dl-on .ph.fade{clip-path:inset(0)}
@media (prefers-reduced-motion:reduce){.dl-js .${p} .fade{transform:none;transition:opacity .6s linear}.dl-js .${p} .ph.fade{clip-path:none}}`;

// появление + кнопка: если «Построить маршрут» не помещается без переноса — остаётся «Маршрут»
const JS = `<script>(function(){var d=document;
function fit(){d.querySelectorAll('[data-dl] .btn').forEach(function(b){b.classList.remove('short');if(b.scrollWidth>b.clientWidth+1)b.classList.add('short')})}
function go(){fit();addEventListener('resize',fit);if(d.fonts&&d.fonts.ready)d.fonts.ready.then(fit);
var els=d.querySelectorAll('[data-dl]:not(.dl-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('dl-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('dl-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.15});
els.forEach(function(e){e.classList.add('dl-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [];

/* ---------- 1. По референсу: фото во всю левую часть, верх фото = начало коричневого,
   «Детали» слева — половина на бежевом, половина на фото ---------- */
V.push(['01-reference', 'По референсу', `
<style>${base('dta')}
.dta{padding-top:64px}
.dta .ttl{left:12px;top:calc(64px - .4em);font-size:clamp(44px,13.4vw,60px)}
.dta .top{display:grid;grid-template-columns:48% minmax(0,1fr);min-height:clamp(250px,74vw,340px)}
.dta .ph::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(246,241,234,.7) 0,rgba(246,241,234,.25) 34px,rgba(246,241,234,0) 70px)}
.dta .loc{display:flex;flex-direction:column;padding:24px 14px 22px 16px}
.dta .btn{margin-top:auto}
.dta .addr{margin-bottom:20px}
.dta .sep{margin:0 20px}
</style>
<section class="dta" data-dl aria-label="Детали">
  <h2 class="ttl fade" style="--d:.5s"><span>Детали</span></h2>
  <div class="panel">
    <div class="top">
      <!-- ФОТО ЛОКАЦИИ --><div class="ph fade">${IMG}</div>
      <div class="loc fade" style="--d:.3s">
      ${LOC}
      ${BTN}
      </div>
    </div>
    <div class="sep" aria-hidden="true"></div>
    <div class="tr fade" style="--d:.4s">
      ${TRANSFER}
    </div>
  </div>
</section>`]);

/* ---------- 2. Фото на всю ширину первым, ниже — та же концепция ---------- */
V.push(['02-photo-top', 'Фото на всю ширину сверху', `
<style>${base('dtb')}
.dtb{padding-top:64px}
.dtb .ttl{left:12px;top:calc(64px - .4em);font-size:clamp(58px,17vw,74px)}
.dtb .ph{aspect-ratio:4/3}
.dtb .ph::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(246,241,234,.7) 0,rgba(246,241,234,.25) 36px,rgba(246,241,234,0) 76px)}
.dtb .loc{padding:24px 20px 26px}
.dtb .btn{margin-top:20px}
.dtb .sep{margin:0 20px}
</style>
<section class="dtb" data-dl aria-label="Детали">
  <h2 class="ttl fade" style="--d:.5s"><span>Детали</span></h2>
  <div class="panel">
    <!-- ФОТО ЛОКАЦИИ --><div class="ph fade">${IMG}</div>
    <div class="loc fade" style="--d:.3s">
      ${LOC}
      ${BTN}
    </div>
    <div class="sep" aria-hidden="true"></div>
    <div class="tr fade" style="--d:.4s">
      ${TRANSFER}
    </div>
  </div>
</section>`]);

/* ---------- 3. Фото локации разделяет «Локацию» и «Трансфер» ---------- */
V.push(['03-photo-between', 'Фото между локацией и трансфером', `
<style>${base('dtc')}
.dtc .ttl{position:relative;display:block;padding:20px 0 0 12px;margin-bottom:-.2em;font-size:clamp(58px,17vw,74px)}
.dtc .loc{padding:30px 20px 28px}
.dtc .btn{margin-top:20px}
.dtc .ph{aspect-ratio:3/2}
.dtc .tr{padding-top:26px}
</style>
<section class="dtc" data-dl aria-label="Детали">
  <h2 class="ttl fade"><span>Детали</span></h2>
  <div class="panel">
    <div class="loc fade" style="--d:.15s">
      ${LOC}
      ${BTN}
    </div>
    <!-- ФОТО ЛОКАЦИИ --><div class="ph fade" style="--d:.25s">${IMG}</div>
    <div class="tr fade" style="--d:.35s">
      ${TRANSFER}
    </div>
  </div>
</section>`]);

const dir = new URL('tilda/location2/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ДЕТАЛИ · ${name} -->\n${FONTS}\n${html.trim()}\n${JS}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(20), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
