// «Введение», доработка варианта 1: 3 версии с анимацией «написания» заголовка.
// Запуск: node intro2-variants.mjs → tilda/intro-v2/
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const FONT_SHA = '5b262026dec5461ae613b800d9f57ca265cc2c3d';
const MAIN_SHA = '076d0ea8abd7db458bdebeb63300c70b9fd89215';

const T1 = 'Дорогие';
const T2 = 'родные и друзья';
const TEXT = 'Один день. Одна история. И вы — её важная часть. Приглашаем Вас разделить с нами самый главный праздник.';

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..600&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Bikham Cyr Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/bikhamcyrscript.ttf') format('truetype');}
</style>`;

// общая основа + эффект «пишется от руки»: мягкая маска уезжает слева направо, строка за строкой
const base = (p) => `
.${p}{--bg:#F6F1EA;--choc:#3E2F27;--ink:#3E2F27;--taupe:#8C7566;--paper:#FBF8F3;
--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--bg);color:var(--ink);font-family:var(--serif);font-weight:500;font-size:18px;line-height:1.72;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2){margin:0}
.${p}::before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.5;
background:radial-gradient(120% 70% at 15% 0%,rgba(255,255,255,.55),transparent 60%),radial-gradient(90% 60% at 100% 100%,rgba(62,47,39,.05),transparent 70%)}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.11;background-size:200px;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.${p}>*{position:relative;z-index:1}
.${p} .caps{font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:500;color:var(--taupe);line-height:1.5}
.${p} h2{font-family:var(--script);font-weight:400;color:var(--choc);line-height:1.12;letter-spacing:0}
.${p} h2 .w{display:inline-block;padding:.28em .5em .34em;margin:-.28em -.5em -.34em}
.${p} h2 .w+br+.w{margin-top:-.5em}
.wr-js .${p} h2 .w{-webkit-mask-image:linear-gradient(100deg,#000 46%,rgba(0,0,0,0) 54%);mask-image:linear-gradient(100deg,#000 46%,rgba(0,0,0,0) 54%);
  -webkit-mask-size:260% 100%;mask-size:260% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
  -webkit-mask-position:100% 0;mask-position:100% 0}
.wr-js .${p}.wr-on h2 .w{animation:${p}-write var(--t,1.6s) cubic-bezier(.5,.08,.4,1) var(--d,0s) forwards}
@keyframes ${p}-write{to{-webkit-mask-position:0 0;mask-position:0 0}}
.wr-js .${p} .fade{opacity:0;transform:translateY(12px);transition:opacity 1.2s var(--ease),transform 1.2s var(--ease);transition-delay:var(--d,0s)}
.wr-js .${p}.wr-on .fade{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.wr-js .${p} h2 .w{-webkit-mask-image:none;mask-image:none;animation:none}.wr-js .${p} .fade{transform:none;transition:opacity .6s linear}}`;

// запуск анимации, когда блок появляется на экране
const SCRIPT = `<script>(function(){var d=document;d.documentElement.classList.add('wr-js');
function go(){var els=d.querySelectorAll('[data-wr]:not(.wr-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('wr-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('wr-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:.3});
els.forEach(function(e){e.classList.add('wr-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const title = `<h2 aria-label="${T1} ${T2}"><span class="w" style="--t:1.3s;--d:.2s" aria-hidden="true">${T1}</span><br><span class="w" style="--t:2.1s;--d:1.35s" aria-hidden="true">${T2}</span></h2>`;

const V = [];

/* ---------- 1. По центру (доработанный вариант 1) ---------- */
V.push(['01-centered', 'По центру', `
<style>${base('wa')}
.wa{padding:100px 28px 108px;text-align:center}
.wa .lab{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:28px}
.wa .lab::before,.wa .lab::after{content:'';width:34px;height:1px;background:var(--taupe);opacity:.55}
.wa h2{font-size:clamp(48px,14.5vw,62px)}
.wa .txt{max-width:300px;margin:34px auto 0;text-wrap:balance}
.wa .date{margin-top:40px}
</style>
<section class="wa" data-wr aria-label="Введение">
  <p class="caps lab">Введение</p>
  ${title}
  <p class="txt fade" style="--d:2.6s">${TEXT}</p>
  <p class="caps date fade" style="--d:2.9s">23 · 07 · 2027</p>
</section>`]);

/* ---------- 2. По левому краю, спокойный размер ---------- */
V.push(['02-left', 'По левому краю', `
<style>${base('wb')}
.wb{padding:96px 30px 104px}
.wb .lab{display:flex;align-items:center;gap:14px;margin-bottom:24px}
.wb .lab::before{content:'';width:30px;height:1px;background:var(--taupe);opacity:.6}
.wb h2{font-size:clamp(42px,12.5vw,52px);text-align:left}
.wb .txt{max-width:310px;margin-top:28px}
.wb .date{display:flex;align-items:center;gap:12px;margin-top:38px}
.wb .date::after{content:'';flex:0 0 46px;height:1px;background:var(--taupe);opacity:.5}
</style>
<section class="wb" data-wr aria-label="Введение">
  <p class="caps lab">Введение</p>
  ${title}
  <p class="txt fade" style="--d:2.5s">${TEXT}</p>
  <p class="caps date fade" style="--d:2.8s">23 · 07 · 2027</p>
</section>`]);

/* ---------- 3. Открытка: плотная бумага с неровным краем ---------- */
V.push(['03-card', 'Открытка', `
<style>${base('wc')}
.wc{padding:72px 20px 80px;text-align:center}
.wc .card{position:relative;padding:58px 26px 54px;filter:drop-shadow(0 1px 1px rgba(62,47,39,.08)) drop-shadow(0 18px 26px rgba(62,47,39,.16))}
.wc .card::before{content:'';position:absolute;inset:0;z-index:-1;background:var(--paper);
  clip-path:polygon(0 1.2%,6% .4%,13% 1.1%,21% .2%,29% .9%,37% .3%,46% 1%,55% .2%,63% .8%,72% .1%,80% .9%,88% .3%,95% 1%,100% .4%,99.4% 9%,100% 18%,99.3% 27%,99.9% 37%,99.2% 47%,100% 57%,99.4% 66%,99.9% 76%,99.2% 86%,99.8% 95%,99.3% 100%,92% 99.3%,84% 99.9%,75% 99.2%,66% 99.8%,57% 99.1%,48% 99.9%,39% 99.3%,30% 99.9%,21% 99.2%,12% 99.8%,4% 99.3%,0 99.9%,.6% 91%,0 82%,.7% 72%,.1% 62%,.8% 52%,0 42%,.6% 32%,.1% 22%,.7% 12%)}
.wc .card::after{content:'';position:absolute;inset:12px;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(140,117,102,.35),inset 0 0 0 4px var(--paper),inset 0 0 0 5px rgba(140,117,102,.2)}
.wc .lab{margin-bottom:24px}
.wc h2{font-size:clamp(44px,13.4vw,58px)}
.wc .orn{display:flex;align-items:center;justify-content:center;gap:10px;margin:26px 0 22px}
.wc .orn::before,.wc .orn::after{content:'';width:42px;height:1px;background:var(--taupe);opacity:.45}
.wc .orn i{width:5px;height:5px;transform:rotate(45deg);box-shadow:inset 0 0 0 1px var(--taupe)}
.wc .txt{max-width:270px;margin:0 auto;text-wrap:balance}
.wc .date{margin-top:30px}
</style>
<section class="wc" data-wr aria-label="Введение">
  <div class="card">
    <p class="caps lab">Введение</p>
    ${title}
    <div class="orn fade" style="--d:2.4s" aria-hidden="true"><i></i></div>
    <p class="txt fade" style="--d:2.6s">${TEXT}</p>
    <p class="caps date fade" style="--d:2.9s">23 · 07 · 2027</p>
  </div>
</section>`]);

const dir = new URL('tilda/intro-v2/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ВВЕДЕНИЕ · ${name} -->\n${FONTS}\n${html.trim()}\n${SCRIPT}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(14), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
