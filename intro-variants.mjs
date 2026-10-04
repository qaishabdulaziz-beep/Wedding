// 5 вариантов блока «Введение» для Тильды (T123). Запуск: node intro-variants.mjs → tilda/intro/
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const FONT_SHA = '5b262026dec5461ae613b800d9f57ca265cc2c3d';   // коммит с BikhamCyrScript.woff2
const MAIN_SHA = '076d0ea8abd7db458bdebeb63300c70b9fd89215';   // коммит с исходным bikhamcyrscript.ttf
const PHOTO_1 = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=70';
const PHOTO_2 = 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=600&q=70';

const TITLE_1 = 'Дорогие родные';
const TITLE_2 = 'и друзья';
const LEAD_1 = 'Один день. Одна история.';
const LEAD_2 = 'И вы — её важная часть.';
const BODY = 'Приглашаем вас разделить с нами самый главный праздник.';

// Шрифты: Bikham Cyr Script из репозитория (jsDelivr → githack → исходный TTF), Lora из Google Fonts
const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..600;1,400..600&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Bikham Cyr Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/bikhamcyrscript.ttf') format('truetype');}
</style>`;

// Общая основа: цвета, бумага, зерно, появление при скролле. Префикс задаёт вариант.
const base = (p) => `
.${p}{--bg:#F6F1EA;--choc:#3E2F27;--ink:#45352C;--taupe:#8C7566;--line:rgba(62,47,39,.22);--paper:#FBF8F3;
--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--bg);color:var(--ink);font-family:var(--serif);font-size:17.5px;line-height:1.68;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,figure){margin:0;font-weight:400}
.${p}::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.5;
background:radial-gradient(120% 70% at 15% 0%,rgba(255,255,255,.55),transparent 60%),radial-gradient(90% 60% at 100% 100%,rgba(62,47,39,.05),transparent 70%)}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.11;background-size:200px;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.${p}>*{position:relative;z-index:1}
.${p} .s{font-family:var(--script);font-weight:400;color:var(--choc);line-height:1.15;letter-spacing:0}
.${p} .caps{font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:500;color:var(--taupe)}
.${p} .photo{position:relative;overflow:hidden;background:linear-gradient(160deg,#D8C8B9,#A99282 60%,#8C7566)}
.${p} .photo img{display:block;width:100%;height:100%;object-fit:cover;filter:sepia(.18) saturate(.82) contrast(.95) brightness(1.03)}
.${p} .photo::after{content:'';position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;opacity:.8;background-size:160px;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 .95 0 0 0 0 .9 0 0 0 1.4 -.6'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.${p} svg.draw{overflow:visible;display:block}
.${p} svg.draw path{fill:none;stroke:var(--choc);stroke-width:.9;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:0}
.iv-js .${p} [data-iv]{opacity:0;transform:translateY(16px);transition:opacity 1.2s var(--ease),transform 1.2s var(--ease);transition-delay:var(--d,0s)}
.iv-js .${p} [data-iv].iv-in{opacity:1;transform:none}
.iv-js .${p} svg.draw path{stroke-dashoffset:1;transition:stroke-dashoffset 2.4s var(--ease) var(--d,.3s)}
.iv-js .${p} svg.draw.iv-in path{stroke-dashoffset:0}
@media (prefers-reduced-motion:reduce){.iv-js .${p} [data-iv]{transform:none;transition:opacity .6s linear}.iv-js .${p} svg.draw path{stroke-dashoffset:0;transition:none}}`;

// Появление при скролле (общий маленький скрипт, безопасно вставлять несколько раз)
const REVEAL = `<script>(function(){var d=document;d.documentElement.classList.add('iv-js');
function go(){var els=d.querySelectorAll('[data-iv]:not([data-iv-o]),svg.draw:not([data-iv-o])');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('iv-in')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('iv-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.15});
els.forEach(function(e){e.setAttribute('data-iv-o','');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

// Росчерк пером
const FLOURISH = `<svg class="draw" viewBox="0 0 220 34" aria-hidden="true"><path pathLength="1" d="M4 22 C40 22 62 8 92 14 C112 18 104 30 96 27 C88 24 98 10 112 12 C138 16 150 26 178 20 C192 17 204 12 216 13"/></svg>`;
const UNDERLINE = `<svg class="draw" viewBox="0 0 160 18" aria-hidden="true"><path pathLength="1" d="M3 11 C38 6 82 4 126 8 C140 9 150 11 157 9 M60 14 C86 12 112 12 132 13"/></svg>`;

const IMG = (src, alt) => `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" onerror="this.style.display='none'">`;

const V = [];

/* ---------- 1. Классика по центру, без фото ---------- */
V.push(['01-centered', 'По центру, без фото', `
<style>${base('iv1')}
.iv1{padding:100px 26px 108px;text-align:center}
.iv1 .lab{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:26px}
.iv1 .lab::before,.iv1 .lab::after{content:'';width:34px;height:1px;background:var(--taupe);opacity:.55}
.iv1 h2{font-size:clamp(50px,15vw,64px)}
.iv1 h2 span{display:block}
.iv1 h2 span+span{margin-top:-.18em;padding-left:1.4em}
.iv1 .fl{width:190px;margin:22px auto 30px}
.iv1 .lead{font-style:italic;font-size:21px;line-height:1.5;color:var(--choc)}
.iv1 .lead span{display:block}
.iv1 .dot{width:4px;height:4px;border-radius:50%;background:var(--taupe);margin:24px auto;opacity:.7}
.iv1 .body{max-width:290px;margin:0 auto;text-wrap:balance}
.iv1 .date{margin-top:40px}
</style>
<section class="iv1" aria-label="Введение">
  <p class="caps lab" data-iv>Введение</p>
  <h2 class="s" data-iv style="--d:.1s"><span>${TITLE_1}</span><span>${TITLE_2}</span></h2>
  <div class="fl">${FLOURISH}</div>
  <p class="lead" data-iv style="--d:.15s"><span>${LEAD_1}</span><span>${LEAD_2}</span></p>
  <div class="dot" aria-hidden="true"></div>
  <p class="body" data-iv style="--d:.25s">${BODY}</p>
  <p class="caps date" data-iv style="--d:.35s">23 · 07 · 2027</p>
</section>`]);

/* ---------- 2. Буквица: первая буква рукописная и крупная ---------- */
V.push(['02-dropcap', 'Буквица, без фото', `
<style>${base('iv2')}
.iv2{padding:96px 28px 104px}
.iv2 .lab{display:flex;align-items:center;gap:14px;margin-bottom:22px}
.iv2 .lab b{font-weight:500;color:var(--choc);letter-spacing:.1em}
.iv2 .lab i{flex:0 0 40px;height:1px;background:var(--taupe);opacity:.6}
.iv2 h2{font-size:clamp(50px,15vw,64px);text-align:center}
.iv2 h2 span{display:block}
.iv2 h2 span+span{margin-top:-.18em}
.iv2 .rule{display:flex;align-items:center;gap:12px;margin:26px 0 44px}
.iv2 .rule::before,.iv2 .rule::after{content:'';flex:1;height:1px;background:var(--line)}
.iv2 .rule span{width:6px;height:6px;transform:rotate(45deg);box-shadow:inset 0 0 0 1px var(--taupe)}
.iv2 .txt{font-size:18px;line-height:1.72}
.iv2 .cap{float:left;font-family:var(--script);color:var(--choc);font-size:86px;line-height:1;
  height:92px;padding:0 20px 0 4px;margin:4px 0 0 -2px}
.iv2 .txt em{font-style:italic;color:var(--choc)}
.iv2 .end{clear:both;width:120px;margin:34px 0 0 auto}
</style>
<section class="iv2" aria-label="Введение">
  <p class="caps lab" data-iv><b>01</b><i></i>Введение</p>
  <h2 class="s" data-iv style="--d:.1s"><span>${TITLE_1}</span><span>${TITLE_2}</span></h2>
  <div class="rule" aria-hidden="true"><span></span></div>
  <p class="txt" data-iv style="--d:.2s"><span class="cap" aria-hidden="true">${LEAD_1[0]}</span><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${LEAD_1[0]}</span><em>${LEAD_1.slice(1)}</em> <em>${LEAD_2}</em> ${BODY}</p>
  <div class="end">${UNDERLINE}</div>
</section>`]);

/* ---------- 3. По левому краю, вертикальная подпись ---------- */
V.push(['03-left', 'По левому краю, без фото', `
<style>${base('iv3')}
.iv3{padding:100px 28px 104px 56px}
.iv3 .side{position:absolute;left:18px;top:100px;writing-mode:vertical-rl;transform:rotate(180deg);display:flex;align-items:center;gap:14px}
.iv3 .side::after{content:'';width:1px;height:70px;background:var(--taupe);opacity:.5}
.iv3 h2{font-size:clamp(52px,16vw,68px);text-align:left;margin-left:-.12em}
.iv3 h2 span{display:block}
.iv3 h2 span+span{margin-top:-.2em}
.iv3 .ul{width:150px;margin:6px 0 34px}
.iv3 .lead{font-size:13px;letter-spacing:.2em;text-transform:uppercase;font-weight:500;color:var(--choc);line-height:2}
.iv3 .lead span{display:block}
.iv3 .body{margin-top:18px;max-width:300px}
.iv3 .body em{font-style:italic;color:var(--choc)}
.iv3 .mark{display:flex;align-items:center;gap:12px;margin-top:40px}
.iv3 .mark::before{content:'';width:28px;height:1px;background:var(--taupe);opacity:.6}
</style>
<section class="iv3" aria-label="Введение">
  <p class="caps side" aria-hidden="true">Введение · 2027</p>
  <h2 class="s" data-iv><span>${TITLE_1}</span><span>${TITLE_2}</span></h2>
  <div class="ul">${UNDERLINE}</div>
  <p class="lead" data-iv style="--d:.15s"><span>Один день.</span><span>Одна история.</span></p>
  <p class="body" data-iv style="--d:.25s"><em>${LEAD_2}</em> ${BODY}</p>
  <p class="caps mark" data-iv style="--d:.35s">23 · 07 · 2027</p>
</section>`]);

/* ---------- 4. Фото в арке, заголовок заходит на фото ---------- */
V.push(['04-arch-photo', 'Фото в арке', `
<style>${base('iv4')}
.iv4{padding:96px 26px 100px}
.iv4 .lab{display:flex;align-items:center;gap:14px;margin-bottom:28px}
.iv4 .lab::before{content:'';width:34px;height:1px;background:var(--taupe);opacity:.6}
.iv4 .vis{position:relative;width:72%;margin-left:auto}
.iv4 .vis::before{content:'';position:absolute;inset:-11px 11px 13px -11px;border-radius:999px 999px 0 0;box-shadow:inset 0 0 0 1px var(--taupe);opacity:.45}
.iv4 .photo{aspect-ratio:3/4;border-radius:999px 999px 0 0}
.iv4 h2{position:relative;z-index:2;font-size:clamp(50px,15vw,64px);margin-top:-1.15em;margin-left:-.1em;
  text-shadow:0 0 14px rgba(246,241,234,.95),0 0 30px rgba(246,241,234,.8)}
.iv4 h2 span{display:block}
.iv4 h2 span+span{margin-top:-.2em;padding-left:1.1em}
.iv4 .lead{margin-top:26px;font-style:italic;font-size:20px;line-height:1.55;color:var(--choc)}
.iv4 .lead span{display:block}
.iv4 .lead span+span{padding-left:1.6em}
.iv4 .body{margin-top:18px;padding-left:22%;position:relative}
.iv4 .body::before{content:'';position:absolute;left:0;top:.85em;width:15%;height:1px;background:var(--taupe);opacity:.55}
</style>
<section class="iv4" aria-label="Введение">
  <p class="caps lab" data-iv>Введение</p>
  <div class="vis" data-iv><div class="photo">${IMG(PHOTO_1, 'Артур и Анна')}</div></div>
  <h2 class="s" data-iv style="--d:.2s"><span>${TITLE_1}</span><span>${TITLE_2}</span></h2>
  <p class="lead" data-iv style="--d:.25s"><span>${LEAD_1}</span><span>${LEAD_2}</span></p>
  <p class="body" data-iv style="--d:.35s">${BODY}</p>
</section>`]);

/* ---------- 5. Два фото внахлёст (полароид), заголовок справа ---------- */
V.push(['05-polaroid-photos', 'Два фото внахлёст', `
<style>${base('iv5')}
.iv5{padding:96px 26px 104px}
.iv5 .col{position:relative;height:clamp(360px,104vw,470px);margin-bottom:34px}
.iv5 .big{position:absolute;left:0;top:0;width:66%;aspect-ratio:4/5.2;box-shadow:0 20px 34px -24px rgba(62,47,39,.6)}
.iv5 .pol{position:absolute;right:0;bottom:0;width:48%;margin:0;padding:9px 9px 34px;background:var(--paper);transform:rotate(3deg);
  box-shadow:0 1px 1px rgba(62,47,39,.1),0 18px 30px -16px rgba(62,47,39,.5)}
.iv5 .pol .photo{aspect-ratio:1}
.iv5 .pol figcaption{position:absolute;left:0;right:0;bottom:8px;text-align:center;font:italic 14px/1.3 var(--serif);color:var(--taupe)}
.iv5 .tape{position:absolute;z-index:2;top:-11px;left:50%;width:70px;height:22px;margin-left:-35px;transform:rotate(-4deg);
  background:rgba(232,222,210,.78);box-shadow:0 1px 2px rgba(62,47,39,.12);
  clip-path:polygon(3% 8%,10% 0,20% 9%,31% 1%,43% 8%,55% 0,67% 8%,79% 1%,90% 8%,97% 2%,100% 50%,97% 95%,88% 100%,76% 92%,64% 100%,51% 93%,39% 100%,26% 92%,14% 100%,4% 94%,0 50%)}
.iv5 h2{font-size:clamp(50px,15vw,64px);text-align:right;margin-right:-.06em}
.iv5 h2 span{display:block}
.iv5 h2 span+span{margin-top:-.2em;padding-right:.4em}
.iv5 .lead{margin-top:26px;font-style:italic;font-size:20px;line-height:1.55;color:var(--choc)}
.iv5 .lead span{display:block}
.iv5 .body{margin-top:16px;max-width:300px}
.iv5 .date{clear:both;display:flex;justify-content:flex-end;align-items:center;gap:12px;margin-top:30px}
.iv5 .date::before{content:'';width:28px;height:1px;background:var(--taupe);opacity:.6}
</style>
<section class="iv5" aria-label="Введение">
  <div class="col">
    <div class="photo big" data-iv>${IMG(PHOTO_1, 'Артур и Анна')}</div>
    <figure class="pol" data-iv style="--d:.15s"><span class="tape" aria-hidden="true"></span><div class="photo">${IMG(PHOTO_2, 'Артур и Анна')}</div><figcaption>мы · 2027</figcaption></figure>
  </div>
  <h2 class="s" data-iv><span>${TITLE_1}</span><span>${TITLE_2}</span></h2>
  <p class="lead" data-iv style="--d:.15s"><span>${LEAD_1}</span><span>${LEAD_2}</span></p>
  <p class="body" data-iv style="--d:.2s">${BODY}</p>
  <p class="caps date" data-iv style="--d:.25s">23 · 07 · 2027</p>
</section>`]);

const dir = new URL('tilda/intro/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ВВЕДЕНИЕ · вариант ${file.slice(0, 2)} · ${name} -->\n${FONTS}\n${html.trim()}\n${REVEAL}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(22), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
