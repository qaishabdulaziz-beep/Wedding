// Блок «Детали» (локация + трансфер) — 4 варианта для Тильды. Запуск: node location-variants.mjs → tilda/location/
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const FONT_SHA = '5b262026dec5461ae613b800d9f57ca265cc2c3d';
const MAIN_SHA = '076d0ea8abd7db458bdebeb63300c70b9fd89215';
const PHOTO = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=70'; // временное фото площадки
const ROUTE = 'https://2gis.ru/krasnoyarsk/geo/70030076451649732/92.787464,56.090637';

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..600&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Bikham Cyr Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/bikhamcyrscript.ttf') format('truetype');}
</style>`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Содержание блока
const LOC = `<h3 class="lbl">Локация</h3>
      <p class="venue">Дрокино парк</p>
      <p class="addr">г.&nbsp;Красноярск, ул.&nbsp;Монамур,&nbsp;2</p>
      <a class="btn" href="${ROUTE}" target="_blank" rel="noopener">Построить маршрут <span aria-hidden="true">→</span></a>`;
const TR_TEXT = `<h3 class="lbl">Трансфер</h3>
      <p class="txt">Для вашего удобства мы организуем трансфер. Автобус заберёт гостей из трёх точек города и привезёт к месту праздника, а в 23:30 отвезёт всех обратно в город.</p>
      <ul class="pts">
        <li><b>хх:хх</b><span>Точка 1, адрес</span></li>
        <li><b>хх:хх</b><span>Точка 2, адрес</span></li>
        <li><b>хх:хх</b><span>Точка 3, адрес</span></li>
      </ul>
      <p class="note">Пожалуйста, отметьте в анкете, если вам нужен трансфер.</p>`;
const IMG = `<img src="${PHOTO}" alt="Дрокино парк" loading="lazy" decoding="async" onerror="this.style.display='none'">`;

const base = (p) => `
.${p}{--ivory:#F6F1EA;--choc:#3E2F27;--cream:#F3EBE1;--latte:#C4AE9A;--line:rgba(246,241,234,.2);
--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--ivory);color:var(--ivory);font-family:var(--serif);font-weight:400;font-size:14px;line-height:1.5;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,h3,ul,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.12;background-size:200px;background-image:${NOISE}}
.${p} .ttl{position:absolute;z-index:4;font-family:var(--script);font-weight:400;color:var(--choc);line-height:1;font-size:clamp(58px,17vw,74px);white-space:nowrap;pointer-events:none}
.${p} .ttl span{display:inline-block;padding:.25em .45em .3em;margin:-.25em -.45em -.3em}
.${p} .ph{position:relative;overflow:hidden;background:linear-gradient(160deg,#CDBDAE,#8E7A6C)}
.${p} .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.55) sepia(.22) contrast(.95) brightness(1.02)}
.${p} .ph::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(246,241,234,.92) 0,rgba(246,241,234,.35) 26px,rgba(246,241,234,0) 60px)}
.${p} .panel{position:relative;background:var(--choc);color:var(--ivory)}
.${p} .lbl{font-size:12.5px;letter-spacing:.24em;text-transform:uppercase;font-weight:700;color:var(--ivory)}
.${p} .venue{margin-top:10px;font-size:19px;line-height:1.25;font-style:italic;font-weight:500}
.${p} .addr{margin-top:4px;font-size:13.5px;color:var(--latte)}
.${p} .btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;margin-top:16px;padding:10px 12px;
  font-size:11px;letter-spacing:.1em;white-space:nowrap;text-transform:uppercase;font-weight:600;color:var(--ivory)!important;text-decoration:none;
  box-shadow:inset 0 0 0 1px rgba(246,241,234,.55);transition:background .4s,color .4s}
.${p} .btn:hover{background:var(--ivory);color:var(--choc)!important}
.${p} .sep{height:1px;background:var(--line);margin:24px 0}
.${p} .txt{margin-top:10px;font-size:13.5px;line-height:1.55;color:var(--cream)}
.${p} .pts{margin-top:12px;display:grid;gap:7px}
.${p} .pts li{display:grid;grid-template-columns:44px 1fr;gap:8px;font-size:13.5px;line-height:1.4}
.${p} .pts b{font-weight:600;color:var(--ivory);font-variant-numeric:lining-nums tabular-nums}
.${p} .pts span{color:var(--cream)}
.${p} .note{margin-top:12px;font-size:13px;font-style:italic;color:var(--latte);line-height:1.45}
.dl-js .${p} .fade{opacity:0;transform:translateY(14px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.dl-js .${p}.dl-on .fade{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.dl-js .${p} .fade{transform:none;transition:opacity .6s linear}}`;

const ON = `<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('[data-dl]:not(.dl-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('dl-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('dl-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.15});
els.forEach(function(e){e.classList.add('dl-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [];

/* ---------- 1. Как в референсе: фото слева, шоколадная панель справа ---------- */
V.push(['01-reference', 'Как в референсе', `
<style>${base('dt1')}
.dt1{padding-top:62px}
.dt1 .ttl{left:12px;top:6px}
.dt1 .grid{display:grid;grid-template-columns:40% 60%;align-items:stretch}
.dt1 .ph{min-height:100%}
.dt1 .panel{margin-top:44px;padding:24px 16px 28px 18px}
</style>
<section class="dt1" data-dl aria-label="Детали">
  <h2 class="ttl fade"><span>Детали</span></h2>
  <div class="grid">
    <div class="ph fade" style="--d:.1s">${IMG}</div>
    <div class="panel fade" style="--d:.2s">
      ${LOC}
      <div class="sep" aria-hidden="true"></div>
      ${TR_TEXT}
    </div>
  </div>
</section>
${ON}`]);

/* ---------- 2. Улучшенный: фото в арке, кнопка заливкой ---------- */
V.push(['02-arch', 'Фото в арке', `
<style>${base('dt2')}
.dt2{padding-top:64px}
.dt2 .ttl{left:10px;top:6px}
.dt2 .grid{display:grid;grid-template-columns:40% 60%;align-items:stretch}
.dt2 .ph{border-radius:999px 999px 0 0;margin:0 0 0 0;min-height:100%}
.dt2 .ph::after{background:linear-gradient(180deg,rgba(246,241,234,.85) 0,rgba(246,241,234,0) 70px)}
.dt2 .panel{margin-top:48px;padding:24px 16px 28px 18px}
.dt2 .btn{background:var(--ivory);color:var(--choc)!important;box-shadow:none}
.dt2 .btn:hover{background:#E8DDD0}
.dt2 .sep{height:auto;background:none;margin:22px 0;text-align:center;line-height:0}
.dt2 .sep::before{content:'';display:inline-block;width:5px;height:5px;transform:rotate(45deg);box-shadow:inset 0 0 0 1px rgba(246,241,234,.5)}
</style>
<section class="dt2" data-dl aria-label="Детали">
  <h2 class="ttl fade"><span>Детали</span></h2>
  <div class="grid">
    <div class="ph fade" style="--d:.1s">${IMG}</div>
    <div class="panel fade" style="--d:.2s">
      ${LOC}
      <div class="sep" aria-hidden="true"></div>
      ${TR_TEXT}
    </div>
  </div>
</section>
${ON}`]);

/* ---------- 3. Сетка: фото + локация в одной строке, трансфер на всю ширину ниже (компактнее на телефоне) ---------- */
V.push(['03-grid', 'Сетка 2 строки', `
<style>${base('dt3')}
.dt3{padding-top:62px}
.dt3 .ttl{left:12px;top:6px}
.dt3 .grid{display:grid;grid-template-columns:42% 58%}
.dt3 .ph{grid-row:1 / span 2;min-height:250px}
.dt3 .gap{height:44px}
.dt3 .loc{background:var(--choc);padding:22px 16px 24px 18px}
.dt3 .tr{background:var(--choc);padding:26px 22px 30px;position:relative}
.dt3 .tr::before{content:'';position:absolute;left:22px;right:22px;top:0;height:1px;background:var(--line)}
.dt3 .txt{font-size:14px}
.dt3 .pts li{font-size:14px;grid-template-columns:52px 1fr}
</style>
<section class="dt3" data-dl aria-label="Детали">
  <h2 class="ttl fade"><span>Детали</span></h2>
  <div class="grid">
    <div class="ph fade" style="--d:.1s">${IMG}</div>
    <div class="gap" aria-hidden="true"></div>
    <div class="loc panel fade" style="--d:.2s">
      ${LOC}
    </div>
  </div>
  <div class="tr panel fade" style="--d:.3s">
      ${TR_TEXT}
  </div>
</section>
${ON}`]);

/* ---------- 4. Фото-оттиск в светлой рамке, заголовок справа, трансфер на всю ширину ---------- */
V.push(['04-print', 'Фото в рамке', `
<style>${base('dt4')}
.dt4{padding-top:80px}
.dt4 .ttl{right:14px;top:8px}
.dt4 .panel{padding:0 20px 30px}
.dt4 .top{display:grid;grid-template-columns:44% 1fr;gap:16px;align-items:end}
.dt4 .ph{margin-top:-50px;aspect-ratio:3/4;box-shadow:0 0 0 6px var(--ivory),0 18px 30px -16px rgba(0,0,0,.5);transform:rotate(-2deg)}
.dt4 .ph::after{display:none}
.dt4 .loc{padding:20px 0 4px}
.dt4 .btn{margin-top:22px}
.dt4 .sep{margin:26px 0 22px}
.dt4 .txt{font-size:14px}
.dt4 .pts li{font-size:14px;grid-template-columns:52px 1fr}
</style>
<section class="dt4" data-dl aria-label="Детали">
  <h2 class="ttl fade"><span>Детали</span></h2>
  <div class="panel">
    <div class="top">
      <div class="ph fade" style="--d:.1s">${IMG}</div>
      <div class="loc fade" style="--d:.2s">
      ${LOC.split('\n').slice(0, 3).join('\n')}
      </div>
    </div>
    <div class="fade" style="--d:.25s">${LOC.split('\n')[3].trim()}</div>
    <div class="sep" aria-hidden="true"></div>
    <div class="fade" style="--d:.3s">
      ${TR_TEXT}
    </div>
  </div>
</section>
${ON}`]);

const dir = new URL('tilda/location/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ДЕТАЛИ · ${name} -->\n${FONTS}\n<script>document.documentElement.classList.add('dl-js')</script>\n${html.trim()}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(16), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
