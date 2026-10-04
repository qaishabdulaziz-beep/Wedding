// Блок «Локация» (коричневый фон, фото площадки, адрес, 2ГИС, коротко о трансфере) — 4 варианта.
// Запуск: node location3-variants.mjs → tilda/location3/
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const FONT_SHA = '5b262026dec5461ae613b800d9f57ca265cc2c3d';
const MAIN_SHA = '076d0ea8abd7db458bdebeb63300c70b9fd89215';
const ROUTE = 'https://2gis.ru/krasnoyarsk/geo/70030076451649732/92.787464,56.090637';
// временные фото площадки — замените на свои
const IDS = ['photo-1519167758481-83f550bb49b3', 'photo-1464366400600-7168b8af9bc3', 'photo-1478146896981-b80fe463b330', 'photo-1469371670807-013ccf25f16a'];
const img = (i) => `<img src="https://images.unsplash.com/${IDS[i]}?auto=format&fit=crop&w=900&q=70" alt="Дрокино парк" loading="lazy" decoding="async" onerror="this.style.display='none'">`;

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..700&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Bikham Cyr Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/bikhamcyrscript.ttf') format('truetype');}
</style>
<script>document.documentElement.classList.add('lc-js')</script>`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const TITLE = `<h2 class="ttl"><span>Локация</span></h2>`;
const PLACE = (split) => `<p class="venue">Дрокино парк</p>
      <p class="addr">${split ? '<span>г.&nbsp;Красноярск,</span> <span>ул.&nbsp;Монамур,&nbsp;2</span>' : 'г.&nbsp;Красноярск, ул.&nbsp;Монамур,&nbsp;2'}</p>`;
const BTN = `<a class="btn" href="${ROUTE}" target="_blank" rel="noopener">Построить маршрут <span aria-hidden="true">→</span></a>`;
const NOTE = `<div class="tr"><p class="lbl">Трансфер</p><p class="note">Для гостей будет организован трансфер. Подробности расскажем в&nbsp;онлайн-группе ближе к&nbsp;дате праздника.</p></div>`;

const base = (p) => `
.${p}{--ivory:#F6F1EA;--sand:#E8DDD0;--choc:#2E221C;--cream:#F3EBE1;--latte:#C4AE9A;--line:rgba(232,221,208,.28);
--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--choc);color:var(--ivory);font-family:var(--serif);font-weight:400;font-size:14px;line-height:1.5;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,figure){margin:0;padding:0;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.16;background-size:200px;background-image:${NOISE}}
.${p} .ttl{font-family:var(--script);font-weight:400;line-height:1;color:var(--ivory);font-size:clamp(58px,17vw,74px);white-space:nowrap}
.${p} .ttl span{display:inline-block;padding:.3em .45em .3em;margin:-.3em -.45em -.3em}
.${p} .ph{position:relative;overflow:hidden;background:linear-gradient(160deg,#6B5A4E,#3B2E27)}
.${p} .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.55) sepia(.22) contrast(.95) brightness(.98)}
.${p} .venue{font-size:18px;line-height:1.3;font-weight:500;letter-spacing:.01em;color:var(--ivory)}
.${p} .addr{margin-top:6px;font-size:14px;line-height:1.45;color:var(--cream)}
.${p} .btn{display:flex;align-items:center;justify-content:center;gap:10px;min-height:46px;padding:10px 12px;
  font-size:11px;letter-spacing:.14em;white-space:nowrap;text-transform:uppercase;font-weight:600;color:var(--ivory)!important;text-decoration:none;
  box-shadow:inset 0 0 0 1px rgba(246,241,234,.55);transition:background .4s,color .4s}
.${p} .btn:hover{background:var(--ivory);color:var(--choc)!important}
.${p} .tr{padding-top:18px;border-top:1px solid var(--line)}
.${p} .lbl{font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:700;color:var(--sand)}
.${p} .note{margin-top:6px;font-size:13.5px;line-height:1.55;color:var(--latte)}
.lc-js .${p} .fade{opacity:0;transform:translateY(14px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.lc-js .${p}.lc-on .fade{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.lc-js .${p} *{transition-duration:.01s!important;transition-delay:0s!important}}`;

const JS = `<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('[data-lc]:not(.lc-o)');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('lc-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:.15});
els.forEach(function(e){e.classList.add('lc-o');io.observe(e)})}else els.forEach(function(e){e.classList.add('lc-on')});
/* параллакс для [data-par] */
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,secs=[].slice.call(els).filter(function(s){return s.querySelector('[data-par]')}),t=0;
function upd(){t=0;var vh=innerHeight;secs.forEach(function(s){var r=s.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;var c=r.top+r.height/2-vh/2;
s.querySelectorAll('[data-par]').forEach(function(e){e.style.setProperty('--py',(-c*parseFloat(e.getAttribute('data-par'))).toFixed(1)+'px')})})}
if(!rm&&secs.length){addEventListener('scroll',function(){if(!t){t=1;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd()}
/* галерея: счётчик и полоса прогресса */
[].forEach.call(d.querySelectorAll('[data-lc] .gal'),function(g){var s=g.closest('[data-lc]'),n=s.querySelector('.cnt b'),bar=s.querySelector('.bar i'),it=g.querySelectorAll('.ph');
function f(){var max=g.scrollWidth-g.clientWidth,p=max>0?g.scrollLeft/max:0,i=Math.round(p*(it.length-1));if(n)n.textContent='0'+(i+1);if(bar)bar.style.transform='scaleX('+(1+p*(it.length-1))/it.length+')';
it.forEach(function(e,k){e.classList.toggle('cur',k===i)})}
g.addEventListener('scroll',function(){requestAnimationFrame(f)},{passive:true});f()})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [];

/* ---------- 1. Фото по бокам «зигзагом»: слева фото + место, справа трансфер + фото ---------- */
V.push(['01-sides-zigzag', 'Фото по бокам', `
<style>${base('lz')}
.lz{padding:58px 0 62px}
.lz .ttl{text-align:center}
.lz .row{display:grid;gap:18px}
.lz .r1{margin-top:34px;grid-template-columns:54% minmax(0,1fr);align-items:end}
.lz .r2{margin-top:18px;grid-template-columns:minmax(0,1fr) 54%;align-items:start}
.lz .ph{aspect-ratio:3/4}
.lz .r1 .txt{padding-right:20px;padding-bottom:4px}
.lz .r2 .txt{padding-left:20px;padding-top:4px;text-align:right}
.lz .addr span{display:block}
.lz .mini{font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:700;color:var(--sand);margin-bottom:10px}
.lz .r2 .note{margin-top:8px}
.lz .foot{margin:30px 20px 0}
/* фото выезжают из-за краёв экрана и раскрываются шторкой */
.lc-js .lz .ph{clip-path:inset(0 100% 0 0);transform:translateX(-30px);transition:clip-path 1.5s cubic-bezier(.7,0,.2,1),transform 1.6s var(--ease)}
.lc-js .lz .r2 .ph{clip-path:inset(0 0 0 100%);transform:translateX(30px);transition-delay:.35s}
.lc-js .lz .ph img{transform:scale(1.15);transition:transform 2.4s var(--ease)}
.lc-js .lz.lc-on .ph{clip-path:inset(0);transform:none}
.lc-js .lz.lc-on .ph img{transform:none}
</style>
<section class="lz" data-lc aria-label="Локация">
  <div class="fade">${TITLE}</div>
  <div class="row r1">
    <!-- ФОТО 1 --><figure class="ph">${img(0)}</figure>
    <div class="txt fade" style="--d:.5s">
      <p class="mini">Место</p>
      ${PLACE(true)}
    </div>
  </div>
  <div class="row r2">
    <div class="txt fade" style="--d:.8s">
      <p class="mini">Трансфер</p>
      <p class="note">Для гостей будет организован трансфер. Подробности расскажем в&nbsp;онлайн-группе ближе к&nbsp;дате праздника.</p>
    </div>
    <!-- ФОТО 2 --><figure class="ph">${img(1)}</figure>
  </div>
  <div class="foot fade" style="--d:1s">${BTN}</div>
</section>`]);

/* ---------- 2. Журнальная вёрстка: большое фото с заголовком на нём + фото-врезка ---------- */
V.push(['02-magazine', 'Журнальная вёрстка', `
<style>${base('lm')}
.lm{padding:0 0 60px}
.lm .hero{position:relative;aspect-ratio:4/5}
.lm .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(46,34,28,.35) 0,rgba(46,34,28,0) 28%,rgba(46,34,28,0) 55%,rgba(46,34,28,.92) 100%)}
.lm .kick{position:absolute;z-index:2;left:20px;right:20px;top:22px;display:flex;justify-content:space-between;font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;font-weight:600;color:var(--ivory)}
.lm .ttl{position:absolute;z-index:2;left:16px;bottom:62px}
.lm .body{position:relative;z-index:3;display:grid;grid-template-columns:minmax(0,1fr) 42%;gap:16px;padding:0 20px;margin-top:-46px;align-items:start}
.lm .body .txt{padding-top:58px}
.lm .inset{aspect-ratio:3/4;box-shadow:0 0 0 6px var(--choc)}
.lm .foot{margin:30px 20px 0;display:grid;gap:24px}
/* анимация: фото медленно «отъезжает», заголовок проявляется слева направо, врезка поднимается */
.lc-js .lm .hero img{transform:scale(1.14);transition:transform 2.8s var(--ease)}
.lc-js .lm.lc-on .hero img{transform:none}
.lc-js .lm .ttl{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;transition:-webkit-mask-position 2s cubic-bezier(.45,.05,.3,1) .5s,mask-position 2s cubic-bezier(.45,.05,.3,1) .5s}
.lc-js .lm.lc-on .ttl{-webkit-mask-position:0 0;mask-position:0 0}
.lc-js .lm .inset{transform:translateY(40px);opacity:0;transition:transform 1.4s var(--ease) .7s,opacity 1.2s var(--ease) .7s}
.lc-js .lm.lc-on .inset{transform:none;opacity:1}
</style>
<section class="lm" data-lc aria-label="Локация">
  <!-- ФОТО 1 (большое) --><figure class="ph hero">${img(0)}
    <p class="kick"><span>Красноярск</span><span>23 · 07 · 2027</span></p>
    ${TITLE}
  </figure>
  <div class="body">
    <div class="txt fade" style="--d:.9s">
      ${PLACE(false)}
    </div>
    <!-- ФОТО 2 (врезка) --><figure class="ph inset">${img(1)}</figure>
  </div>
  <div class="foot fade" style="--d:1.1s">
    ${BTN}
    ${NOTE}
  </div>
</section>`]);

/* ---------- 3. Арки: центральное фото-арка и две арки по бокам, уходящие за край ---------- */
V.push(['03-arches', 'Арки', `
<style>${base('la')}
.la{padding:58px 0 62px;text-align:center}
.la .stage{position:relative;margin-top:32px;height:clamp(330px,98vw,460px)}
.la .ph{position:absolute;border-radius:999px 999px 0 0;translate:0 var(--py,0px)}
.la .c{left:50%;top:0;width:56%;margin-left:-28%;height:100%;z-index:2;box-shadow:0 0 0 7px var(--choc)}
.la .l,.la .r{top:16%;width:36%;height:74%;z-index:1}
.la .l{left:-9%}.la .r{right:-9%}
.la .l img,.la .r img{filter:grayscale(.6) sepia(.22) contrast(.95) brightness(.78)}
.la .info{padding:30px 22px 0}
.la .addr{white-space:nowrap}
.la .btn{margin-top:22px}
.la .tr{margin-top:28px;text-align:left}
/* анимация: центральная арка вырастает снизу, боковые выходят из-за краёв */
.lc-js .la .c{clip-path:inset(100% 0 0 0 round 999px 999px 0 0);transition:clip-path 1.6s cubic-bezier(.7,0,.2,1)}
.lc-js .la.lc-on .c{clip-path:inset(0 0 0 0 round 999px 999px 0 0)}
.lc-js .la .c img{transform:scale(1.2);transition:transform 2.6s var(--ease)}
.lc-js .la.lc-on .c img{transform:none}
.lc-js .la .l,.lc-js .la .r{opacity:0;transition:opacity 1.2s var(--ease) .7s,transform 1.6s var(--ease) .7s}
.lc-js .la .l{transform:translateX(-40px)}.lc-js .la .r{transform:translateX(40px)}
.lc-js .la.lc-on .l,.lc-js .la.lc-on .r{opacity:1;transform:none}
</style>
<section class="la" data-lc aria-label="Локация">
  <div class="fade">${TITLE}</div>
  <div class="stage">
    <!-- ФОТО 2 (слева) --><figure class="ph l" data-par=".06">${img(1)}</figure>
    <!-- ФОТО 1 (центр) --><figure class="ph c">${img(0)}</figure>
    <!-- ФОТО 3 (справа) --><figure class="ph r" data-par="-.06">${img(2)}</figure>
  </div>
  <div class="info fade" style="--d:.9s">
    ${PLACE(false)}
    ${BTN}
    ${NOTE}
  </div>
</section>`]);

/* ---------- 4. Галерея: листаемые фото (уходят за правый край), счётчик и полоса ---------- */
V.push(['04-gallery', 'Листаемая галерея', `
<style>${base('lg')}
.lg{padding:58px 0 62px}
.lg .head{display:flex;justify-content:space-between;align-items:flex-end;padding:0 20px 0 14px}
.lg .cnt{font-size:11px;letter-spacing:.24em;color:var(--latte);font-variant-numeric:lining-nums tabular-nums;padding-bottom:12px}
.lg .cnt b{font-weight:600;color:var(--ivory)}
.lg .gal{margin-top:24px;display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding:0 20px;padding:0 20px;
  -webkit-overflow-scrolling:touch;scrollbar-width:none;overscroll-behavior-x:contain}
.lg .gal::-webkit-scrollbar{display:none}
.lg .gal::after{content:'';flex:0 0 10px}
.lg .gal .ph{flex:0 0 78%;aspect-ratio:4/5;scroll-snap-align:start;opacity:.5;transition:opacity .6s var(--ease)}
.lg .gal .ph.cur{opacity:1}
.lg .bar{margin:18px 20px 0;height:1px;background:var(--line);overflow:hidden}
.lg .bar i{display:block;height:100%;background:var(--sand);transform-origin:left;transform:scaleX(.25);transition:transform .3s linear}
.lg .hint{margin:10px 20px 0;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--latte)}
.lg .info{padding:28px 20px 0}
.lg .btn{margin-top:22px}
.lg .tr{margin-top:28px}
/* анимация: лента приезжает справа */
.lc-js .lg .gal{opacity:0;transform:translateX(70px);transition:opacity 1.2s var(--ease) .2s,transform 1.6s var(--ease) .2s}
.lc-js .lg.lc-on .gal{opacity:1;transform:none}
</style>
<section class="lg" data-lc aria-label="Локация">
  <div class="head fade">${TITLE}<p class="cnt"><b>01</b> / 04</p></div>
  <div class="gal">
    <!-- ФОТО 1–4 --><figure class="ph cur">${img(0)}</figure><figure class="ph">${img(1)}</figure><figure class="ph">${img(2)}</figure><figure class="ph">${img(3)}</figure>
  </div>
  <div class="bar fade" style="--d:.5s" aria-hidden="true"><i></i></div>
  <p class="hint fade" style="--d:.6s" aria-hidden="true">листайте →</p>
  <div class="info fade" style="--d:.7s">
    ${PLACE(false)}
    ${BTN}
    ${NOTE}
  </div>
</section>`]);

const dir = new URL('tilda/location3/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ЛОКАЦИЯ · ${name} -->\n${FONTS}\n${html.trim()}\n${JS}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(18), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
