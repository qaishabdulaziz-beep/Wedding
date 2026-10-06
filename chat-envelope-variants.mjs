// Чат для гостей в конверте: 4 варианта → tilda/chat-env/0N-*.html
// Конверт разрезан на 2 слоя (assets/chat): задник и кружевной карман. Между ними — HTML-карточка с текстом.
// Запуск: node chat-envelope-variants.mjs
import fs from 'node:fs';

const SHA = '0af36a1006b794ba95369d3d0585e8f8b80fa2e3';
const A = `https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@${SHA}/assets/chat/`;
const TG = 'https://t.me/+9a-HvZcIQNA2NmIy';
const TXT = 'Мы создали общий чат в&nbsp;Telegram, где будем делиться важными новостями и&nbsp;деталями праздника, а&nbsp;после него&nbsp;— фотографиями.';
const BTN = `<a class="btn" href="${TG}" target="_blank" rel="noopener"><span>Перейти в Telegram</span></a>`;
const ENV = `<div class="env" aria-hidden="true">
      <img class="bk" src="${A}envelope-back.webp" width="900" height="854" alt="" loading="lazy" decoding="async">
      <img class="fr" src="${A}envelope-front.webp" width="900" height="854" alt="" loading="lazy" decoding="async">
    </div>`;

const FONT = `@font-face{font-family:'Astrum Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@4a83daeb45bb08fd036182115602a4c42002242b/assets/fonts/AstrumScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/qaishabdulaziz-beep/Wedding/4a83daeb45bb08fd036182115602a4c42002242b/assets/fonts/AstrumScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@90b234a93fec945ba023e442202273e508899c9c/AstrumScriptCyrillicRegular%202.ttf') format('truetype');}`;

// Общая база. Геометрия конверта (в долях ширины картинки): лист занимает 16,4% слева … 17,8% справа,
// низ карточки — на 70% высоты конверта (высота = 94,9% ширины → 66,4% ширины), карман закрывает всё ниже ~49,5%.
const base = (p) => `
.${p}{--ivory:#F6F1EA;--sand:#E8DDD0;--choc:#2E221C;--ink:#4A3A31;--latte:#8C7566;--paper:#FBF8F3;
--script:'Astrum Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
--w:min(112%,560px);
position:relative;background:var(--ivory);color:var(--choc);font-family:var(--serif);font-weight:400;font-size:14.5px;line-height:1.65;
max-width:520px;margin:0 auto;padding:52px 0 40px;overflow:hidden;box-sizing:border-box;text-align:center;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2){margin:0;padding:0;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.1;background-size:200px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
/* сцена шире экрана — кружевные края конверта чуть уходят за поля */
.${p} .stage{position:relative;width:var(--w);margin-left:calc((100% - var(--w)) / 2)}
/* карточка-письмо: стоит в потоке, нижняя часть уходит в карман */
.${p} .card{position:relative;z-index:2;margin:0 17.8% 0 16.4%;padding:30px 18px calc(19.5% + 30px);background:var(--paper);
  box-shadow:0 1px 1px rgba(46,34,28,.07),0 18px 34px -22px rgba(46,34,28,.5)}
.${p} .card::before{content:'';position:absolute;inset:8px;border:1px solid rgba(46,34,28,.2);pointer-events:none}
.${p} .env{position:relative;height:0;padding-top:94.9%;margin-top:-66.4%}
.${p} .env img{position:absolute;left:0;top:0;width:100%;height:100%;display:block;pointer-events:none;-webkit-user-select:none;user-select:none}
.${p} .env .bk{z-index:1}
.${p} .env .fr{z-index:3}
.${p} .ttl{font-size:clamp(13px,3.9vw,16px);letter-spacing:.28em;margin-right:-.28em;text-transform:uppercase;font-weight:600;line-height:1.5;text-wrap:balance}
.${p} .rule{width:32px;height:1px;margin:14px auto 0;background:rgba(46,34,28,.38)}
.${p} .txt{margin:14px auto 0;max-width:290px;color:var(--ink);text-wrap:pretty}
.${p} .btn{position:relative;display:flex;align-items:center;justify-content:center;min-height:50px;margin:20px 0 0;padding:10px 12px;
  background:linear-gradient(180deg,#EDE4D8,#E2D5C5);color:var(--choc)!important;text-decoration:none;
  font-size:clamp(10px,2.9vw,11.5px);letter-spacing:.2em;text-transform:uppercase;font-weight:600;white-space:nowrap;transition:background .5s}
.${p} .btn::before{content:'';position:absolute;inset:5px;border:1px solid rgba(46,34,28,.28);pointer-events:none;transition:inset .5s var(--ease),border-color .5s}
.${p} .btn span{margin-right:-.2em}
.${p} .btn:hover{background:var(--ivory)}
.${p} .btn:hover::before{inset:8px;border-color:rgba(46,34,28,.5)}
.${p} .scr{display:inline-block;padding:.45em .3em .3em;margin:-.3em 0 -.2em;font-family:var(--script);font-weight:400;line-height:1;color:var(--choc);white-space:nowrap}
.${p}-js .${p} .fade{opacity:0;transform:translateY(12px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.${p}-js .${p}.${p}-on .fade{opacity:1;transform:none}
.${p}-js .${p} .write{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;
  transition:-webkit-mask-position 1.9s cubic-bezier(.45,.05,.3,1) var(--d,0s),mask-position 1.9s cubic-bezier(.45,.05,.3,1) var(--d,0s)}
.${p}-js .${p}.${p}-on .write{-webkit-mask-position:0 0;mask-position:0 0}`;

const io = (p, extra = '') => `<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('.${p}:not(.${p}-o)');${extra}
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('${p}-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('${p}-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:.25});
els.forEach(function(e){e.classList.add('${p}-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [
  /* 1. Письмо выезжает из конверта при прокрутке */
  ['01-letter', 'Письмо из конверта', 'ce1', `
.ce1-js .ce1 .card{transform:translateY(42%);transition:transform 1.8s cubic-bezier(.3,.7,.15,1) .15s}
.ce1-js .ce1.ce1-on .card{transform:none}`, `
  <div class="stage">
    <div class="card">
      <h2 class="ttl fade" style="--d:.9s">Чат для гостей</h2>
      <div class="rule fade" style="--d:1s" aria-hidden="true"></div>
      <p class="txt fade" style="--d:1.1s">${TXT} Присоединяйтесь!</p>
      <div class="fade" style="--d:1.3s">${BTN}</div>
    </div>
    ${ENV}
  </div>`],

  /* 2. С рукописной строкой «Присоединяйтесь!» */
  ['02-script', 'Письмо с рукописной строкой', 'ce2', `
.ce2 .eyb{font-size:10px;letter-spacing:.3em;margin-right:-.3em;text-transform:uppercase;color:var(--latte);font-weight:500}
.ce2 .ttl{margin-top:8px}
.ce2 .scr{margin-top:6px;font-size:clamp(25px,7.8vw,38px)}
.ce2 .btn{margin-top:10px}
.ce2-js .ce2 .card{transform:translateY(30%);transition:transform 1.8s cubic-bezier(.3,.7,.15,1) .1s}
.ce2-js .ce2.ce2-on .card{transform:none}`, `
  <div class="stage">
    <div class="card">
      <p class="eyb fade" style="--d:.8s">Артур и Анна</p>
      <h2 class="ttl fade" style="--d:.9s">Чат для гостей</h2>
      <p class="txt fade" style="--d:1.05s">${TXT}</p>
      <p><span class="scr write" style="--d:1.4s">Присоединяйтесь!</span></p>
      <div class="fade" style="--d:2.2s">${BTN}</div>
    </div>
    ${ENV}
  </div>`],

  /* 3. Конверт открывается по нажатию: письмо поднимается */
  ['03-open', 'Открыть письмо', 'ce3', `
.ce3 > .ttl{margin:0 0 26px}
.ce3 .stage{overflow:hidden}
.ce3 .card .txt{margin-top:6px}
.ce3 .card .scr{font-size:clamp(25px,7.8vw,34px)}
.ce3 .card,.ce3 .card .in{transition:transform 1.7s cubic-bezier(.3,.7,.15,1),opacity 1s var(--ease)}
.ce3 .tap{position:absolute;z-index:4;left:0;right:0;bottom:0;top:0;width:100%;margin:0;padding:0;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent}
.ce3 .tap:focus-visible{outline:1px solid var(--choc);outline-offset:-10px}
.ce3 .hint{position:relative;z-index:4;margin-top:14px;font-size:10.5px;letter-spacing:.3em;margin-right:-.3em;text-transform:uppercase;color:var(--latte);font-weight:500;transition:opacity .6s}
.ce3 .hint::after{content:'';display:block;width:30px;height:1px;margin:10px auto 0;background:currentColor;animation:ce3p 2.4s ease-in-out infinite}
@keyframes ce3p{0%,100%{transform:scaleX(.4);opacity:.4}50%{transform:none;opacity:1}}
/* закрыто: письмо почти целиком в кармане, видно только верхнее поле */
.ce3.closed .card{transform:translateY(var(--down,60%))}
.ce3.closed .card .in{opacity:0;transform:translateY(16px)}
.ce3:not(.closed) .card .in{transition-delay:.5s}
.ce3:not(.closed) .tap{display:none}
.ce3:not(.closed) .hint{opacity:0}
.ce3-js .ce3 .stage,.ce3-js .ce3 > .ttl,.ce3-js .ce3 .hint{opacity:0;transform:translateY(14px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease)}
.ce3-js .ce3 .stage{transition-delay:.25s}
.ce3-js .ce3 .hint{transition-delay:.6s}
.ce3-js .ce3.ce3-on .stage,.ce3-js .ce3.ce3-on > .ttl{opacity:1;transform:none}
.ce3-js .ce3.ce3-on.closed .hint{opacity:1;transform:none}`, `
  <h2 class="ttl">Чат для гостей</h2>
  <div class="stage">
    <div class="card">
      <div class="in">
        <p class="txt">${TXT}</p>
        <p><span class="scr">Присоединяйтесь!</span></p>
        ${BTN}
      </div>
    </div>
    ${ENV}
    <button class="tap" type="button" aria-label="Открыть письмо"></button>
  </div>
  <p class="hint" aria-hidden="true">Нажмите на конверт</p>`,
  // JS: письмо опускается так, чтобы его верх был на 15% высоты конверта (как лист на исходном фото)
  `
els.forEach(function(s){var c=s.querySelector('.card'),e=s.querySelector('.env'),b=s.querySelector('.tap');if(!c||!e||!b)return;
s.classList.add('closed');
function fit(){if(!s.classList.contains('closed'))return;var h=c.offsetHeight,eh=e.offsetHeight,top=h-.7*eh;s.style.setProperty('--down',Math.round(top+.15*eh)+'px')}
fit();addEventListener('resize',fit);
b.addEventListener('click',function(){s.classList.remove('closed');var a=c.querySelector('a');setTimeout(function(){a&&a.focus({preventScroll:true})},900)})});`],

  /* 4. Крупный план: конверт шире экрана и растворяется книзу, на письме — шапка с датой */
  ['04-closeup', 'Крупный план', 'ce4', `
.ce4{--w:min(132%,620px);padding-bottom:0}
.ce4 .card{padding-top:34px;padding-left:22px;padding-right:22px}
.ce4 .head{display:flex;align-items:center;justify-content:center;gap:10px;font-size:10px;letter-spacing:.32em;margin-right:-.32em;color:var(--latte);font-weight:500}
.ce4 .head i{width:22px;height:1px;background:currentColor;opacity:.6}
.ce4 .mono{display:block;margin:4px 0 2px;font-size:clamp(34px,10vw,44px)}
.ce4 .ttl{margin-top:2px}
.ce4 .env{margin-bottom:-27%}
.ce4 .stage::after{content:'';position:absolute;z-index:5;left:0;right:0;bottom:0;height:22%;background:linear-gradient(180deg,rgba(246,241,234,0),var(--ivory) 92%);pointer-events:none}
.ce4-js .ce4 .card{transform:translateY(26%);transition:transform 1.9s cubic-bezier(.3,.7,.15,1) .1s}
.ce4-js .ce4.ce4-on .card{transform:none}`, `
  <div class="stage">
    <div class="card">
      <p class="head fade" style="--d:.7s"><i></i>23 · 07 · 2027<i></i></p>
      <p><span class="scr mono write" style="--d:.9s">Артур и Анна</span></p>
      <h2 class="ttl fade" style="--d:1.5s">Чат для гостей</h2>
      <div class="rule fade" style="--d:1.6s" aria-hidden="true"></div>
      <p class="txt fade" style="--d:1.7s">${TXT} Присоединяйтесь!</p>
      <div class="fade" style="--d:1.9s">${BTN}</div>
    </div>
    ${ENV}
  </div>`],
];

const dir = new URL('tilda/chat-env/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, p, css, html, js = ''] of V) {
  const s = `<!-- ЧАТ ДЛЯ ГОСТЕЙ · конверт · ${name} -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..700&subset=cyrillic&display=swap">
<script>document.documentElement.classList.add('${p}-js')</script>
<style>
${FONT}${base(p)}
/* вариант: ${name} */${css}
@media (prefers-reduced-motion:reduce){.${p} *{transition-duration:.01s!important;transition-delay:0s!important;animation:none!important}}
</style>
<section class="${p}" aria-label="Чат для гостей">${html}
</section>
${io(p, js)}
`;
  fs.writeFileSync(new URL(file + '.html', dir), s);
  console.log(file.padEnd(12), (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB');
}
