// Фотовставка — 4 варианта для Тильды. Запуск: node photo-variants.mjs → tilda/photo/
// Фото пока временные (Unsplash) — замените ссылки в src="…" на свои.
import fs from 'node:fs';

const IDS = [
  'photo-1522673607200-164d1b6ce486',
  'photo-1519741497674-611481863552',
  'photo-1529634806980-85c3dd6d34ac',
  'photo-1511285560929-80b456fea0bc',
  'photo-1465495976277-4387d4b0b4c6',
  'photo-1583939003579-730e3918a45a',
];
const src = (i) => `https://images.unsplash.com/${IDS[i]}?auto=format&fit=crop&w=800&q=70`;
const img = (i, alt = 'Артур и Анна') =>
  `<img src="${src(i)}" alt="${alt}" loading="lazy" decoding="async" onerror="this.style.display='none'">`;

const LORA = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..600&subset=cyrillic&display=swap">`;
const BIKHAM = `<style>
@font-face{font-family:'Bikham Cyr Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@5b262026dec5461ae613b800d9f57ca265cc2c3d/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/qaishabdulaziz-beep/Wedding/5b262026dec5461ae613b800d9f57ca265cc2c3d/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@076d0ea8abd7db458bdebeb63300c70b9fd89215/bikhamcyrscript.ttf') format('truetype');}
</style>`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const base = (p) => `
.${p}{--sand:#E8DDD0;--ivory:#F6F1EA;--choc:#2E221C;--latte:#8C7566;
--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--sand);color:var(--choc);font-family:var(--serif);font-weight:500;font-size:16px;line-height:1.5;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,figure){margin:0;padding:0;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.12;background-size:200px;background-image:${NOISE}}
.${p} .ph{position:relative;overflow:hidden;background:linear-gradient(160deg,#CFC3B6,#9A8B80)}
.${p} .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.06) brightness(1.03)}
.${p} .script{font-family:var(--script);font-weight:400;line-height:1;color:var(--choc)}
.${p} .script span{display:inline-block;padding:.3em .45em .3em;margin:-.3em -.45em -.3em}
.${p} .caps{font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;font-weight:500;color:var(--latte);margin-right:-.3em}`;

// появление блока (один раз) + мягкий параллакс для [data-par]
const JS = `<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('[data-pv]:not(.pv-o)');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('pv-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:.2});
els.forEach(function(e){e.classList.add('pv-o');io.observe(e)})}else els.forEach(function(e){e.classList.add('pv-on')});
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var secs=[].slice.call(els).filter(function(s){return s.querySelector('[data-par]')}),tick=0;if(!secs.length)return;
function upd(){tick=0;var vh=innerHeight;secs.forEach(function(s){var r=s.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;
var c=(r.top+r.height/2-vh/2);s.querySelectorAll('[data-par]').forEach(function(e){e.style.setProperty('--py',(-c*parseFloat(e.getAttribute('data-par'))).toFixed(1)+'px')})})}
addEventListener('scroll',function(){if(!tick){tick=1;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd()}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [];

/* ---------- 1. Триптих как в референсе: центр целиком, края уходят за экран ---------- */
V.push(['01-triptych', 'Триптих как в референсе', false, `
<style>${base('pv1')}
.pv1{padding:56px 0 60px}
.pv1 .row{display:grid;grid-template-columns:1fr 1.5fr 1fr;gap:8px;width:124%;margin-left:-12%;height:clamp(270px,78vw,400px)}
/* появление: центр поднимается, края мягко приходят из-за экрана, фото чуть «отъезжают» */
.pv-js .pv1 .ph{opacity:0;transition:opacity 1.4s var(--ease),transform 1.6s var(--ease)}
.pv-js .pv1 .ph img{transform:scale(1.14);transition:transform 2.4s var(--ease)}
.pv-js .pv1 .ph:nth-child(1){transform:translateX(-36px);transition-delay:.25s}
.pv-js .pv1 .ph:nth-child(2){transform:translateY(26px)}
.pv-js .pv1 .ph:nth-child(3){transform:translateX(36px);transition-delay:.25s}
.pv-js .pv1.pv-on .ph{opacity:1;transform:none}
.pv-js .pv1.pv-on .ph img{transform:none}
@media (prefers-reduced-motion:reduce){.pv-js .pv1 .ph,.pv-js .pv1 .ph img{transform:none!important;transition:opacity .6s linear}}
</style>
<section class="pv1" data-pv aria-label="Фото">
  <div class="row">
    <!-- ФОТО 1 (левое) --><figure class="ph">${img(0)}</figure>
    <!-- ФОТО 2 (центр) --><figure class="ph">${img(1)}</figure>
    <!-- ФОТО 3 (правое) --><figure class="ph">${img(2)}</figure>
  </div>
</section>`]);

/* ---------- 2. Шторки + параллакс: фото открываются снизу вверх по очереди,
   при прокрутке края и центр плывут в разные стороны ---------- */
V.push(['02-shutter-parallax', 'Шторки и параллакс', true, `
<style>${base('pv2')}
.pv2{padding:64px 16px 56px;text-align:center}
.pv2 .row{display:grid;grid-template-columns:1fr 1.32fr 1fr;gap:8px;align-items:center}
.pv2 .ph{translate:0 var(--py,0px)}
.pv2 .ph:nth-child(2){aspect-ratio:2/3.05}
.pv2 .ph:nth-child(1),.pv2 .ph:nth-child(3){aspect-ratio:2/3.3}
.pv2 .ph:nth-child(1){margin-top:-38px}
.pv2 .ph:nth-child(3){margin-top:38px}
.pv2 .names{margin-top:34px;font-size:clamp(44px,13vw,56px)}
.pv2 .caps{margin-top:6px}
.pv-js .pv2 .ph{clip-path:inset(100% 0 0 0);transition:clip-path 1.5s cubic-bezier(.7,0,.2,1)}
.pv-js .pv2 .ph img{transform:scale(1.3) translateY(8%);transition:transform 2.2s cubic-bezier(.2,.7,.2,1)}
.pv-js .pv2 .ph:nth-child(2),.pv-js .pv2 .ph:nth-child(2) img{transition-delay:.25s}
.pv-js .pv2 .ph:nth-child(3),.pv-js .pv2 .ph:nth-child(3) img{transition-delay:.5s}
.pv-js .pv2.pv-on .ph{clip-path:inset(0 0 0 0)}
.pv-js .pv2.pv-on .ph img{transform:none}
.pv-js .pv2 .fade{opacity:0;transform:translateY(12px);transition:opacity 1.2s var(--ease) 1.2s,transform 1.2s var(--ease) 1.2s}
.pv-js .pv2.pv-on .fade{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.pv-js .pv2 .ph{clip-path:none;opacity:0;transition:opacity .6s linear}.pv-js .pv2.pv-on .ph{opacity:1}.pv-js .pv2 .ph img{transform:none}}
</style>
<section class="pv2" data-pv aria-label="Фото">
  <div class="row">
    <!-- ФОТО 1 --><figure class="ph" data-par=".05">${img(0)}</figure>
    <!-- ФОТО 2 --><figure class="ph" data-par="-.03">${img(1)}</figure>
    <!-- ФОТО 3 --><figure class="ph" data-par=".05">${img(2)}</figure>
  </div>
  <p class="script names fade"><span>Артур &amp; Анна</span></p>
  <p class="caps fade">23 · 07 · 2027</p>
</section>`]);

/* ---------- 3. Бесконечная лента фото перед историей ---------- */
const STRIP = [0, 1, 2, 3, 4, 5];
const strip = (hidden) => STRIP.map((i) => `<figure class="ph"${hidden ? ' aria-hidden="true"' : ''}>${img(i, hidden ? '' : 'Артур и Анна')}</figure>`).join('');
V.push(['03-film-strip', 'Лента перед историей', true, `
<style>${base('pv3')}
.pv3{padding:58px 0 54px;text-align:center}
.pv3 .caps{display:block}
.pv3 .vp{margin-top:24px;overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 12%,#000 88%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 12%,#000 88%,transparent 100%)}
.pv3 .track{display:flex;align-items:center;gap:10px;width:max-content;padding-right:10px;animation:pv3-run 48s linear infinite}
.pv3 .set{display:flex;align-items:center;gap:10px}
.pv3 .ph{flex:none;width:clamp(138px,40vw,180px);aspect-ratio:3/4}
.pv3 .ph:nth-child(even){width:clamp(168px,48vw,214px);aspect-ratio:4/5}
.pv3 .ph:nth-child(3n){aspect-ratio:2/3}
@keyframes pv3-run{to{transform:translateX(-50%)}}
.pv3 h2{margin-top:30px;font-size:clamp(52px,15.5vw,66px)}
.pv3 .sub{margin-top:8px}
.pv-js .pv3 .fade{opacity:0;transform:translateY(14px);transition:opacity 1.3s var(--ease),transform 1.3s var(--ease);transition-delay:var(--d,0s)}
.pv-js .pv3.pv-on .fade{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.pv3 .track{animation:none}.pv-js .pv3 .fade{transform:none;transition:opacity .6s linear}}
</style>
<section class="pv3" data-pv aria-label="Наша история">
  <p class="caps fade">Артур &amp; Анна</p>
  <div class="vp fade" style="--d:.15s">
    <!-- ФОТО: 6 штук, во втором ряду (aria-hidden) те же фото — для бесшовного движения -->
    <div class="track"><div class="set">${strip(false)}</div><div class="set">${strip(true)}</div></div>
  </div>
  <h2 class="script fade" style="--d:.4s"><span>Наша история</span></h2>
  <p class="caps sub fade" style="--d:.55s">как всё начиналось</p>
</section>`]);

/* ---------- 4. Коллаж в рамках перед историей: три фото внахлёст, параллакс ---------- */
V.push(['04-collage', 'Коллаж перед историей', true, `
<style>${base('pv4')}
.pv4{padding:60px 18px 58px}
.pv4 .stage{position:relative;height:clamp(400px,118vw,540px)}
.pv4 .ph{position:absolute;box-shadow:0 0 0 6px var(--ivory),0 22px 34px -18px rgba(46,34,28,.55);translate:0 var(--py,0px)}
.pv4 .p1{left:2%;top:7%;width:58%;aspect-ratio:3/4;--r:-2.5deg;z-index:2}
.pv4 .p2{right:3%;top:0;width:38%;aspect-ratio:3/4;--r:3deg;z-index:1}
.pv4 .p3{right:6%;bottom:2%;width:44%;aspect-ratio:4/5;--r:-1deg;z-index:3}
.pv4 .ph{transform:rotate(var(--r))}
.pv4 .ttl{position:relative;z-index:4;margin-top:22px;text-align:center}
.pv4 h2{font-size:clamp(52px,15.5vw,66px)}
.pv4 .caps{margin-top:8px;display:block}
/* появление: фото «ложатся» на стол по очереди */
.pv-js .pv4 .ph{opacity:0;transform:rotate(calc(var(--r) * -2.2)) translateY(40px) scale(1.06);transition:opacity 1.2s var(--ease),transform 1.6s var(--ease)}
.pv-js .pv4 .p2{transition-delay:.3s}.pv-js .pv4 .p3{transition-delay:.6s}
.pv-js .pv4.pv-on .ph{opacity:1;transform:rotate(var(--r))}
.pv-js .pv4 .fade{opacity:0;transform:translateY(14px);transition:opacity 1.3s var(--ease) 1s,transform 1.3s var(--ease) 1s}
.pv-js .pv4.pv-on .fade{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.pv-js .pv4 .ph{transform:rotate(var(--r));transition:opacity .6s linear}.pv-js .pv4 .fade{transform:none;transition:opacity .6s linear}}
</style>
<section class="pv4" data-pv aria-label="Наша история">
  <div class="stage">
    <!-- ФОТО 1 (большое) --><figure class="ph p1" data-par=".04">${img(1)}</figure>
    <!-- ФОТО 2 (сверху справа) --><figure class="ph p2" data-par=".1">${img(0)}</figure>
    <!-- ФОТО 3 (снизу справа) --><figure class="ph p3" data-par="-.05">${img(2)}</figure>
  </div>
  <div class="ttl fade">
    <h2 class="script"><span>Наша история</span></h2>
    <p class="caps">как всё начиналось</p>
  </div>
</section>`]);

const dir = new URL('tilda/photo/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, script, html] of V) {
  const code = `<!-- ФОТОВСТАВКА · ${name} -->\n${LORA}\n${script ? BIKHAM + '\n' : ''}<script>document.documentElement.classList.add('pv-js')</script>\n${html.trim()}\n${JS}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(22), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
