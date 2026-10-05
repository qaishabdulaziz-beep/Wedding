// «Чат для гостей» (3 варианта) и «Финал» (2 варианта). Запуск: node chat-final-variants.mjs → tilda/chat/, tilda/final/
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const ASTRUM_SHA = '4a83daeb45bb08fd036182115602a4c42002242b';
const MAIN_SHA = '90b234a93fec945ba023e442202273e508899c9c';
const TG = 'https://t.me/+9a-HvZcIQNA2NmIy';
const PHOTO = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=70'; // временное фото
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const LORA = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..700&subset=cyrillic&display=swap">`;
const ASTRUM = `<style>
@font-face{font-family:'Astrum Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${ASTRUM_SHA}/assets/fonts/AstrumScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${ASTRUM_SHA}/assets/fonts/AstrumScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/AstrumScriptCyrillicRegular%202.ttf') format('truetype');}
</style>`;

const base = (p, bg) => `
.${p}{--ivory:#F6F1EA;--sand:#E8DDD0;--choc:#2E221C;--ink:#4A3A31;--latte:#8C7566;
--script:'Astrum Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:${bg};color:var(--choc);font-family:var(--serif);font-weight:400;font-size:15px;line-height:1.6;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;text-align:center;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2){margin:0;padding:0;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.1;background-size:200px;background-image:${NOISE}}
.fx-js .${p} .rise{opacity:0;transform:translateY(16px);transition:opacity 1.2s var(--ease),transform 1.2s var(--ease);transition-delay:var(--d,0s)}
.fx-js .${p}.fx-on .rise{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.${p} *{transition-duration:.01s!important;transition-delay:0s!important;animation:none!important}}`;

const JS = `<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('[data-fx]:not(.fx-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('fx-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('fx-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:.2});
els.forEach(function(e){e.classList.add('fx-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;
const FXJS = `<script>document.documentElement.classList.add('fx-js')</script>`;

const H = 'Чат для гостей';
const TXT = 'Мы создали общий чат в&nbsp;Telegram, где будем делиться важными новостями и&nbsp;деталями праздника, а&nbsp;после него&nbsp;— фотографиями.';
const BTN_SAND = (p) => `
.${p} .btn{position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:12px 34px;margin-top:30px;
  color:var(--ivory)!important;background:var(--choc);text-decoration:none;font-size:12px;letter-spacing:.28em;text-transform:uppercase;font-weight:600;white-space:nowrap;transition:background .5s}
.${p} .btn::before{content:'';position:absolute;inset:5px;border:1px solid rgba(246,241,234,.35);pointer-events:none;transition:inset .5s var(--ease),border-color .5s}
.${p} .btn span{margin-right:-.28em}
.${p} .btn:hover{background:#3d2e26}.${p} .btn:hover::before{inset:8px;border-color:rgba(246,241,234,.6)}`;

const out = [];

/* ЧАТ 1. Строгий: заголовок капсом между тонкими линиями, кнопка-заливка с внутренней рамкой */
out.push(['chat/01-classic', 'ЧАТ ДЛЯ ГОСТЕЙ · Строгий', false, `
<style>${base('ch1', 'var(--ivory)')}
.ch1{padding:64px 26px 70px}
.ch1 .ttl{display:flex;align-items:center;gap:12px;justify-content:center;white-space:nowrap;font-size:clamp(14px,4.3vw,18px);letter-spacing:.28em;text-transform:uppercase;font-weight:600}
.ch1 .ttl::before,.ch1 .ttl::after{content:'';flex:0 1 40px;min-width:16px;height:1px;background:rgba(46,34,28,.35)}
.ch1 .ttl span{margin-right:-.28em}
.ch1 .txt{margin:22px auto 0;max-width:330px;color:var(--ink);text-wrap:pretty}
.ch1 .join{margin-top:10px;font-weight:600;color:var(--choc)}${BTN_SAND('ch1')}
</style>
<section class="ch1" data-fx aria-label="${H}">
  <h2 class="ttl rise"><span>${H}</span></h2>
  <p class="txt rise" style="--d:.15s">${TXT}</p>
  <p class="join rise" style="--d:.25s">Присоединяйтесь!</p>
  <a class="btn rise" style="--d:.4s" href="${TG}" target="_blank" rel="noopener"><span>Перейти в Telegram</span></a>
</section>`]);

/* ЧАТ 2. Карточка: светлая карточка с тонкой рамкой на бежевом, кнопка-контур */
out.push(['chat/02-card', 'ЧАТ ДЛЯ ГОСТЕЙ · Карточка', false, `
<style>${base('ch2', 'var(--ivory)')}
.ch2{padding:52px 18px 58px}
.ch2 .card{position:relative;padding:46px 24px 42px;background:#FBF8F3;box-shadow:0 1px 1px rgba(46,34,28,.06),0 24px 40px -28px rgba(46,34,28,.45)}
.ch2 .card::before{content:'';position:absolute;inset:9px;border:1px solid rgba(46,34,28,.2);pointer-events:none}
.ch2 .ttl{font-size:clamp(15px,4.6vw,18px);letter-spacing:.34em;text-transform:uppercase;font-weight:600;margin-right:-.34em}
.ch2 .rule{width:36px;height:1px;margin:18px auto 0;background:rgba(46,34,28,.4)}
.ch2 .txt{margin:18px auto 0;max-width:300px;color:var(--ink);text-wrap:pretty}
.ch2 .btn{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:50px;margin-top:28px;padding:10px 26px;
  color:var(--choc)!important;text-decoration:none;font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;font-weight:600;white-space:nowrap;
  box-shadow:inset 0 0 0 1px var(--choc);transition:background .45s,color .45s}
.ch2 .btn span{margin-right:-.26em}
.ch2 .btn:hover{background:var(--choc);color:var(--ivory)!important}
</style>
<section class="ch2" data-fx aria-label="${H}">
  <div class="card rise">
    <h2 class="ttl">${H}</h2>
    <div class="rule" aria-hidden="true"></div>
    <p class="txt">${TXT} Присоединяйтесь!</p>
    <a class="btn" href="${TG}" target="_blank" rel="noopener"><span>Перейти в Telegram</span></a>
  </div>
</section>`]);

/* ЧАТ 3. С рукописным акцентом: «Присоединяйтесь!» крупно от руки, песочная кнопка */
out.push(['chat/03-script', 'ЧАТ ДЛЯ ГОСТЕЙ · Рукописный акцент', true, `
<style>${base('ch3', 'var(--ivory)')}
.ch3{padding:64px 26px 70px}
.ch3 .ttl{font-size:clamp(15px,4.6vw,18px);letter-spacing:.34em;text-transform:uppercase;font-weight:600;margin-right:-.34em}
.ch3 .txt{margin:20px auto 0;max-width:330px;color:var(--ink);text-wrap:pretty}
.ch3 .join{display:inline-block;margin-top:14px;font-family:var(--script);font-size:clamp(36px,10.6vw,54px);line-height:1;white-space:nowrap;padding:.35em .3em .2em;margin-bottom:-.2em;color:var(--choc)}
.ch3 .btn{position:relative;display:flex;align-items:center;justify-content:center;min-height:56px;margin:22px auto 0;max-width:330px;padding:12px 20px;
  background:linear-gradient(180deg,#EDE4D8,#E2D5C5);color:var(--choc)!important;text-decoration:none;font-size:12px;letter-spacing:.28em;text-transform:uppercase;font-weight:600;white-space:nowrap;transition:background .5s}
.ch3 .btn::before{content:'';position:absolute;inset:5px;border:1px solid rgba(46,34,28,.28);pointer-events:none;transition:inset .5s var(--ease),border-color .5s}
.ch3 .btn span{margin-right:-.28em}
.ch3 .btn:hover{background:var(--sand)}.ch3 .btn:hover::before{inset:8px;border-color:rgba(46,34,28,.5)}
/* «Присоединяйтесь!» пишется слева направо */
.fx-js .ch3 .join{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;transition:-webkit-mask-position 1.8s cubic-bezier(.45,.05,.3,1) .5s,mask-position 1.8s cubic-bezier(.45,.05,.3,1) .5s}
.fx-js .ch3.fx-on .join{-webkit-mask-position:0 0;mask-position:0 0}
</style>
<section class="ch3" data-fx aria-label="${H}">
  <h2 class="ttl rise">${H}</h2>
  <p class="txt rise" style="--d:.15s">${TXT}</p>
  <p class="join">Присоединяйтесь!</p>
  <a class="btn rise" style="--d:1.2s" href="${TG}" target="_blank" rel="noopener"><span>Перейти в Telegram</span></a>
</section>`]);

/* ФИНАЛ 1. Фото во весь экран, «До встречи!» по центру, подпись справа внизу */
const SIGN = `<p class="sign rise" style="--d:.9s"><span class="with">С любовью,</span><span class="names">Артур и Анна</span></p>`;
const finalBase = (p) => `${base(p, 'var(--choc)')}
.${p}{color:var(--ivory)}
.${p} .bg{position:absolute;inset:0;z-index:0;background:linear-gradient(160deg,#5B4A3F,#2E221C)}
.${p} .bg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.35) sepia(.15) contrast(.98) brightness(.92)}
.${p} .sign{position:absolute;z-index:2;right:24px;bottom:34px;text-align:right;line-height:1}
.${p} .with{display:block;font-size:14px;letter-spacing:.06em}
.${p} .names{display:block;font-family:var(--script);font-size:clamp(40px,12vw,54px);padding:.3em .3em .15em;margin:-.15em -.3em -.15em}`;

out.push(['final/01-fullscreen', 'ФИНАЛ · Во весь экран', true, `
<style>${finalBase('fn1')}
.fn1{min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:80px 24px 150px}
.fn1 .bg::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(46,34,28,.15) 0,rgba(46,34,28,.35) 45%,rgba(46,34,28,.75) 100%)}
.fn1 .bye{position:relative;z-index:2;font-size:clamp(34px,10.5vw,48px);line-height:1.15;letter-spacing:.02em;text-shadow:0 2px 24px rgba(0,0,0,.25)}
.fx-js .fn1 .bg img{transform:scale(1.12);transition:transform 6s cubic-bezier(.2,.6,.2,1)}
.fx-js .fn1.fx-on .bg img{transform:none}
</style>
<section class="fn1" data-fx aria-label="До встречи">
  <!-- ФОТО ФОНА --><div class="bg" aria-hidden="true"><img src="${PHOTO}" alt="" decoding="async" onerror="this.style.display='none'"></div>
  <p class="bye rise" style="--d:.4s">До встречи!</p>
  ${SIGN}
</section>`]);

/* ФИНАЛ 3. Невысокий: ~1/3–1/2 экрана под детальное фото, текст укладывается внутрь */
out.push(['final/03-short', 'ФИНАЛ · Подпись на фото', true, `
<style>${finalBase('fn3')}
.fn3{height:clamp(190px,30svh,290px)}
.fn3 .bg::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(46,34,28,.05) 0,rgba(46,34,28,.25) 45%,rgba(46,34,28,.75) 100%)}
.fn3 .sign{right:20px;bottom:16px;text-shadow:0 1px 14px rgba(0,0,0,.3)}
.fn3 .with{font-size:13px}
.fn3 .names{font-size:clamp(32px,9.6vw,44px)}
.fx-js .fn3 .bg img{transform:scale(1.1);transition:transform 5s cubic-bezier(.2,.6,.2,1)}
.fx-js .fn3.fx-on .bg img{transform:none}
</style>
<section class="fn3" data-fx aria-label="До встречи">
  <!-- ФОТО ФОНА (детальное, лучше горизонтальное) --><div class="bg" aria-hidden="true"><img src="${PHOTO}" alt="" decoding="async" onerror="this.style.display='none'"></div>
  ${SIGN.replace("--d:.9s","--d:.4s")}
</section>`]);

/* ФИНАЛ 2. Фото с тонкой рамкой внутри, «До встречи!» капсом с линией, подпись справа */
out.push(['final/02-framed', 'ФИНАЛ · С рамкой', true, `
<style>${finalBase('fn2')}
.fn2{min-height:88vh;min-height:88svh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 28px 160px}
.fn2 .bg::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(46,34,28,.25),rgba(46,34,28,.7) 85%)}
.fn2 .frame{position:absolute;z-index:1;inset:14px;border:1px solid rgba(246,241,234,.45);pointer-events:none}
.fn2 .bye{position:relative;z-index:2;font-size:clamp(22px,6.6vw,30px);letter-spacing:.32em;text-transform:uppercase;font-weight:500;margin-right:-.32em}
.fn2 .rule{position:relative;z-index:2;width:44px;height:1px;margin-top:22px;background:rgba(246,241,234,.7);transform-origin:center}
.fn2 .date{position:relative;z-index:2;margin-top:16px;font-size:12px;letter-spacing:.3em;margin-right:-.3em;opacity:.85}
.fn2 .sign{right:34px;bottom:44px}
.fx-js .fn2 .bg img{transform:scale(1.1);transition:transform 6s cubic-bezier(.2,.6,.2,1)}
.fx-js .fn2.fx-on .bg img{transform:none}
.fx-js .fn2 .frame{opacity:0;transform:scale(1.03);transition:opacity 1.6s var(--ease) .2s,transform 1.6s var(--ease) .2s}
.fx-js .fn2.fx-on .frame{opacity:1;transform:none}
.fx-js .fn2 .rule{transform:scaleX(0);transition:transform 1.2s var(--ease) .7s}
.fx-js .fn2.fx-on .rule{transform:none}
</style>
<section class="fn2" data-fx aria-label="До встречи">
  <!-- ФОТО ФОНА --><div class="bg" aria-hidden="true"><img src="${PHOTO}" alt="" decoding="async" onerror="this.style.display='none'"></div>
  <div class="frame" aria-hidden="true"></div>
  <p class="bye rise" style="--d:.4s">До встречи!</p>
  <div class="rule" aria-hidden="true"></div>
  <p class="date rise" style="--d:.8s">23 · 07 · 2027</p>
  ${SIGN}
</section>`]);

for (const [file, name, script, html] of out) {
  const code = `<!-- ${name} -->\n${LORA}\n${script ? ASTRUM + '\n' : ''}${FXJS}\n${html.trim()}\n${JS}\n`;
  const url = new URL('tilda/' + file + '.html', import.meta.url);
  fs.mkdirSync(new URL('.', url), { recursive: true });
  fs.writeFileSync(url, code);
  console.log(file.padEnd(22), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
