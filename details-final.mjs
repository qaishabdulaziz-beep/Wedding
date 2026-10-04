// Финальный блок «details» (вариант 4, доработка). Запуск: node details-final.mjs → tilda/details-final.html
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const ASTRUM_SHA = '4a83daeb45bb08fd036182115602a4c42002242b'; // assets/fonts/AstrumScript.woff2
const MAIN_SHA = '90b234a93fec945ba023e442202273e508899c9c';   // исходный «AstrumScriptCyrillicRegular 2.ttf»
const ROUTE = 'https://2gis.ru/krasnoyarsk/geo/70030076451649732/92.787464,56.090637';
// временные фото площадки — замените на свои
const PH = ['photo-1519167758481-83f550bb49b3', 'photo-1464366400600-7168b8af9bc3', 'photo-1478146896981-b80fe463b330', 'photo-1469371670807-013ccf25f16a'];
const img = (i) => `<img src="https://images.unsplash.com/${PH[i]}?auto=format&fit=crop&w=900&q=70" alt="Дрокино парк" loading="lazy" decoding="async" onerror="this.style.display='none'">`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// TITLE_TOP / TITLE_SIZE / LINE_K подобраны по метрикам шрифта и замерам в браузере
const TITLE_SIZE = process.env.TS || 'min(calc(22.4vw - 6px),112px)';
const TITLE_TOP = process.env.TT || '.25em';
const LINE_K = process.env.LK || '13.2';

const code = `<!-- DETAILS · финальная версия -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..700&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Astrum Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${ASTRUM_SHA}/assets/fonts/AstrumScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${ASTRUM_SHA}/assets/fonts/AstrumScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/AstrumScriptCyrillicRegular%202.ttf') format('truetype');}
</style>
<script>document.documentElement.classList.add('dx-js')</script>
<style>
.dxf{--ivory:#F6F1EA;--sand:#E8DDD0;--choc:#2E221C;--cream:#F3EBE1;--latte:#C4AE9A;--pt:clamp(70px,21vw,104px);
--script:'Astrum Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--ivory);color:var(--ivory);font-family:var(--serif);font-weight:400;font-size:14px;line-height:1.5;
max-width:520px;margin:0 auto;padding-top:var(--pt);overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.dxf *,.dxf *::before,.dxf *::after{box-sizing:border-box}
.dxf :where(p,h2,h3,ul,li,figure){margin:0;padding:0;list-style:none;font-weight:inherit}
.dxf::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.12;background-size:200px;background-image:${NOISE}}
/* «details»: верхняя половина на бежевом, нижняя — на фото */
.dxf .ttl{position:absolute;z-index:5;left:8px;top:calc(var(--pt) - ${TITLE_TOP});font-family:var(--script);font-weight:400;color:var(--choc);
  font-size:${TITLE_SIZE};line-height:1;letter-spacing:-.02em;white-space:nowrap;pointer-events:none}
.dxf .ttl span{display:inline-block;padding:.3em .45em .3em;margin:-.3em -.45em -.3em}
.dxf .panel{position:relative;background:var(--choc);padding-bottom:56px}
.dxf .top{display:grid;grid-template-columns:48% minmax(0,1fr)}
.dxf .ph{position:relative;overflow:hidden;background:linear-gradient(160deg,#CDBDAE,#8E7A6C)}
.dxf .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.06) brightness(.98)}
.dxf .main{min-height:100%}
.dxf .main::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(246,241,234,.6) 0,rgba(246,241,234,.2) 30px,rgba(246,241,234,0) 64px)}
.dxf .main::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(0deg,rgba(46,34,28,.45),rgba(46,34,28,0) 40%)}
.dxf .cap{position:absolute;z-index:2;left:12px;bottom:16px;writing-mode:vertical-rl;transform:rotate(180deg);font-size:9.5px;letter-spacing:.32em;text-transform:uppercase;font-weight:600;color:var(--ivory);text-shadow:0 1px 6px rgba(0,0,0,.35)}
.dxf .loc{padding:24px 14px 20px 16px}
.dxf .tr{padding:20px 14px 28px 16px}
.dxf .lbl{font-size:14px;letter-spacing:.22em;text-transform:uppercase;font-weight:700;color:var(--ivory);margin-right:-.22em}
/* строки места и текст трансфера — один размер; «Дрокино парк, ул. Монамур, 2» всегда в одну строку */
.dxf .pts{margin-top:10px}
.dxf .pts li,.dxf .txt{font-size:min(13px,calc((52vw - 30px) / ${LINE_K}));color:var(--cream)}
.dxf .pts li{padding:7px 0;line-height:1.35;white-space:nowrap;border-bottom:1px solid rgba(232,221,208,.18)}
.dxf .pts li:last-child{border-bottom:0;padding-bottom:0}
.dxf .sep{height:1px;background:var(--sand);opacity:.55}
.dxf .txt{margin-top:10px;line-height:1.55}
.dxf .lnk{color:var(--sand)!important;text-decoration:underline;text-decoration-color:rgba(232,221,208,.55);text-decoration-thickness:1px;text-underline-offset:3px;transition:color .3s,text-decoration-color .3s}
.dxf .lnk:hover{color:var(--ivory)!important;text-decoration-color:var(--ivory)}
/* кнопка во всю ширину: песочная заливка с тонкой внутренней рамкой */
.dxf .btn{position:relative;display:flex;align-items:center;justify-content:center;min-height:58px;padding:12px 20px;
  background:linear-gradient(180deg,#EDE4D8,#E2D5C5);color:var(--choc)!important;text-decoration:none;
  font-size:12px;letter-spacing:.3em;text-transform:uppercase;font-weight:600;white-space:nowrap;transition:background .5s,color .5s}
.dxf .btn::before{content:'';position:absolute;inset:5px;border:1px solid rgba(46,34,28,.28);pointer-events:none;transition:inset .5s var(--ease),border-color .5s}
.dxf .btn span{margin-right:-.3em}
.dxf .btn:hover{background:var(--ivory)}
.dxf .btn:hover::before{inset:8px;border-color:rgba(46,34,28,.5)}
/* три фото в ряд, крайние наполовину уходят за край */
.dxf .row{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:8px;width:140%;margin-left:-20%;margin-top:28px;height:clamp(230px,66vw,330px)}
/* анимация */
.dx-js .dxf .main{clip-path:inset(0 0 100% 0);transition:clip-path 1.5s cubic-bezier(.7,0,.2,1)}
.dx-js .dxf.dx-on .main{clip-path:inset(0)}
.dx-js .dxf .main img{transform:scale(1.14);transition:transform 2.6s var(--ease)}
.dx-js .dxf.dx-on .main img{transform:none}
.dx-js .dxf .ttl{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;transition:-webkit-mask-position 1.9s cubic-bezier(.45,.05,.3,1) .6s,mask-position 1.9s cubic-bezier(.45,.05,.3,1) .6s}
.dx-js .dxf.dx-on .ttl{-webkit-mask-position:0 0;mask-position:0 0}
.dx-js .dxf .sep{transform:scaleX(0);transform-origin:left;transition:transform 1.2s var(--ease) .55s}
.dx-js .dxf.dx-on .sep{transform:none}
.dx-js .dxf .fade{opacity:0;transform:translateY(12px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.dx-js .dxf.dx-on .fade{opacity:1;transform:none}
.dx-js .dxf .row .ph{opacity:0;transition:opacity 1.4s var(--ease),transform 1.6s var(--ease)}
.dx-js .dxf .row .ph:nth-child(1){transform:translateX(-36px)}
.dx-js .dxf .row .ph:nth-child(2){transform:translateY(26px)}
.dx-js .dxf .row .ph:nth-child(3){transform:translateX(36px)}
.dx-js .dxf .row.dx-on .ph{opacity:1;transform:none}
.dx-js .dxf .row .ph:nth-child(odd){transition-delay:.25s}
@media (prefers-reduced-motion:reduce){.dx-js .dxf *{transition-duration:.01s!important;transition-delay:0s!important}}
</style>
<section class="dxf" data-dx aria-label="Детали">
  <h2 class="ttl"><span>details</span></h2>
  <div class="panel">
    <div class="top">
      <!-- ФОТО ЛОКАЦИИ (главное) --><div class="ph main">
        ${img(0)}
        <p class="cap" aria-hidden="true">Krasnoyarsk · 2027</p>
      </div>
      <div class="col">
        <div class="loc fade" style="--d:.45s">
          <h3 class="lbl">Локация</h3>
          <ul class="pts">
            <li>г.&nbsp;Красноярск</li>
            <li>Дрокино парк, ул.&nbsp;Монамур,&nbsp;2</li>
          </ul>
        </div>
        <div class="sep" aria-hidden="true"></div>
        <div class="tr fade" style="--d:.65s">
          <h3 class="lbl">Трансфер</h3>
          <!-- ССЫЛКА НА ГРУППУ: вместо # вставьте адрес группы -->
          <p class="txt">Для гостей будет организован трансфер. Подробности расскажем в&nbsp;<a class="lnk" href="#" target="_blank" rel="noopener" onclick="if(this.getAttribute('href')==='#')return false">онлайн-группе</a> ближе к&nbsp;дате праздника.</p>
        </div>
      </div>
    </div>
    <a class="btn fade" style="--d:.8s" href="${ROUTE}" target="_blank" rel="noopener"><span>Построить маршрут</span></a>
    <div class="row" data-dx>
      <!-- ФОТО 2 --><figure class="ph">${img(1)}</figure>
      <!-- ФОТО 3 --><figure class="ph">${img(2)}</figure>
      <!-- ФОТО 4 --><figure class="ph">${img(3)}</figure>
    </div>
  </div>
</section>
<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('[data-dx]:not(.dx-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('dx-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('dx-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.15});
els.forEach(function(e){e.classList.add('dx-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>
`;
fs.writeFileSync(new URL('tilda/details-final.html', import.meta.url), code);
console.log('details-final.html', (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
