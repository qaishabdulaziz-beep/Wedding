// Блок «details» по референсу невесты: фото слева, текст справа. 1 основной + 3 похожих.
// Запуск: node location4-variants.mjs → tilda/location4/
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
<script>document.documentElement.classList.add('dx-js')</script>`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const BODY = `<h2 class="ttl"><span>details</span></h2>
  <div class="panel">
    <!-- ФОТО ЛОКАЦИИ --><div class="ph">
      <img src="${PHOTO}" alt="Дрокино парк" loading="lazy" decoding="async" onerror="this.style.display='none'">
      CAPTION
    </div>
    <div class="col">
      <div class="loc fade" style="--d:.45s">
        <h3 class="lbl">Локация</h3>
        <ul class="pts">
          <li>г.&nbsp;Красноярск</li>
          <li>Дрокино парк</li>
          <li>ул.&nbsp;Монамур,&nbsp;2</li>
        </ul>
        <a class="btn" href="${ROUTE}" target="_blank" rel="noopener">Маршрут <span aria-hidden="true">→</span></a>
      </div>
      <div class="sep" aria-hidden="true"></div>
      <div class="tr fade" style="--d:.65s">
        <h3 class="lbl">Транспорт</h3>
        <!-- ССЫЛКА НА ГРУППУ: вместо # вставьте адрес группы -->
        <p class="txt">Для гостей будет организован трансфер. Подробности расскажем в&nbsp;<a class="lnk" href="#" target="_blank" rel="noopener" onclick="if(this.getAttribute('href')==='#')return false">онлайн-группе</a> ближе к&nbsp;дате праздника.</p>
      </div>
    </div>
  </div>`;

const base = (p) => `
.${p}{--ivory:#F6F1EA;--sand:#E8DDD0;--choc:#2E221C;--cream:#F3EBE1;--latte:#C4AE9A;
--pt:clamp(74px,22vw,110px);--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--ivory);color:var(--ivory);font-family:var(--serif);font-weight:400;font-size:14px;line-height:1.5;
max-width:520px;margin:0 auto;padding-top:var(--pt);overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,h3,ul,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.12;background-size:200px;background-image:${NOISE}}
/* «details»: половина на бежевом, половина на фото; слово укладывается в ширину фото */
.${p} .ttl{position:absolute;z-index:5;left:6px;top:calc(var(--pt) - .47em);font-family:var(--script);font-weight:400;font-style:normal;color:var(--choc);
  font-size:min(33vw,170px);line-height:1;letter-spacing:-.04em;white-space:nowrap;pointer-events:none}
.${p} .ttl span{display:inline-block;padding:.3em .45em .3em;margin:-.3em -.45em -.3em}
.${p} .panel{position:relative;display:grid;grid-template-columns:48% minmax(0,1fr);background:var(--choc)}
.${p} .ph{position:relative;overflow:hidden;min-height:100%;background:linear-gradient(160deg,#CDBDAE,#8E7A6C)}
.${p} .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.04) brightness(1.02)}
.${p} .ph::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(246,241,234,.6) 0,rgba(246,241,234,.2) 30px,rgba(246,241,234,0) 64px)}
.${p} .loc{padding:22px 16px 24px}
.${p} .tr{padding:20px 16px 28px}
.${p} .lbl{font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:700;color:var(--ivory);margin-right:-.22em}
.${p} .pts{margin-top:12px;display:grid;gap:5px}
.${p} .pts li{position:relative;padding-left:14px;font-size:14px;line-height:1.4;color:var(--cream)}
.${p} .pts li::before{content:'';position:absolute;left:0;top:.62em;width:4px;height:4px;border-radius:50%;background:var(--latte)}
.${p} .btn{display:flex;align-items:center;justify-content:center;gap:10px;min-height:44px;margin-top:20px;padding:10px 8px;
  font-size:11px;letter-spacing:.18em;white-space:nowrap;text-transform:uppercase;font-weight:600;color:var(--ivory)!important;text-decoration:none;
  box-shadow:inset 0 0 0 1px rgba(246,241,234,.55);transition:background .4s,color .4s}
.${p} .btn:hover{background:var(--ivory);color:var(--choc)!important}
.${p} .sep{height:1px;background:var(--sand);opacity:.55}
.${p} .txt{margin-top:10px;font-size:13.5px;line-height:1.55;color:var(--cream)}
.${p} .lnk{color:var(--sand)!important;text-decoration:underline;text-decoration-color:rgba(232,221,208,.55);text-decoration-thickness:1px;text-underline-offset:3px;transition:color .3s,text-decoration-color .3s}
.${p} .lnk:hover{color:var(--ivory)!important;text-decoration-color:var(--ivory)}
/* анимация: фото раскрывается сверху вниз, «details» пишется слева направо, текст проявляется */
.dx-js .${p} .ph{clip-path:inset(0 0 100% 0);transition:clip-path 1.5s cubic-bezier(.7,0,.2,1)}
.dx-js .${p}.dx-on .ph{clip-path:inset(0)}
.dx-js .${p} .ph img{transform:scale(1.14);transition:transform 2.6s var(--ease)}
.dx-js .${p}.dx-on .ph img{transform:none}
.dx-js .${p} .ttl{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;transition:-webkit-mask-position 1.9s cubic-bezier(.45,.05,.3,1) .6s,mask-position 1.9s cubic-bezier(.45,.05,.3,1) .6s}
.dx-js .${p}.dx-on .ttl{-webkit-mask-position:0 0;mask-position:0 0}
.dx-js .${p} .sep{transform:scaleX(0);transform-origin:left;transition:transform 1.2s var(--ease) .55s}
.dx-js .${p}.dx-on .sep{transform:none}
.dx-js .${p} .fade{opacity:0;transform:translateY(12px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.dx-js .${p}.dx-on .fade{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.dx-js .${p} *{transition-duration:.01s!important;transition-delay:0s!important}}`;

const JS = `<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('[data-dx]:not(.dx-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('dx-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('dx-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.15});
els.forEach(function(e){e.classList.add('dx-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [
  /* 1. Как в референсе */
  ['01-reference', 'Как в референсе', 'dx1', '', ''],

  /* 2. Печатная карточка: тонкая рамка по всему коричневому полю, пункты пронумерованы */
  ['02-frame', 'С тонкой рамкой', 'dx2', `
.dx2 .panel::before{content:'';position:absolute;inset:9px;z-index:3;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(232,221,208,.45)}
.dx2 .loc{padding:26px 20px 24px 16px}
.dx2 .tr{padding:20px 20px 30px 16px}
.dx2 .pts{counter-reset:p;gap:6px}
.dx2 .pts li{padding-left:24px;counter-increment:p}
.dx2 .pts li::before{content:'0' counter(p);width:auto;height:auto;border-radius:0;background:none;top:.28em;font-size:10px;letter-spacing:.08em;color:var(--latte);font-variant-numeric:lining-nums}
.dx2 .btn{box-shadow:inset 0 0 0 1px var(--sand)}`, ''],

  /* 3. Мягкий стык: фото растворяется в коричневом, кнопка-ссылка с линией */
  ['03-soft', 'Мягкий стык', 'dx3', `
.dx3 .panel{grid-template-columns:52% minmax(0,1fr)}
.dx3 .ph::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,rgba(46,34,28,0) 55%,rgba(46,34,28,.55) 82%,var(--choc) 100%)}
.dx3 .col{margin-left:-14px;position:relative;z-index:2}
.dx3 .loc{padding:24px 16px 24px 4px}
.dx3 .tr{padding:20px 16px 30px 4px}
.dx3 .sep{background:linear-gradient(90deg,rgba(232,221,208,0),var(--sand) 30%);opacity:.6}
.dx3 .pts li{padding-left:16px}
.dx3 .pts li::before{width:8px;height:1px;border-radius:0;top:.72em}
.dx3 .btn{justify-content:flex-start;gap:12px;min-height:0;margin-top:18px;padding:0 0 6px;box-shadow:none;border-bottom:1px solid rgba(246,241,234,.6);width:max-content;max-width:100%}
.dx3 .btn:hover{background:none;color:var(--sand)!important;border-color:var(--sand)}
.dx3 .btn span{transition:transform .4s var(--ease)}
.dx3 .btn:hover span{transform:translateX(4px)}`, ''],

  /* 4. С подписью на фото: вертикальная подпись, пункты в строках-«таблице», кнопка-заливка */
  ['04-caption', 'С подписью на фото', 'dx4', `
.dx4 .cap{position:absolute;z-index:2;left:12px;bottom:16px;writing-mode:vertical-rl;transform:rotate(180deg);font-size:9.5px;letter-spacing:.32em;text-transform:uppercase;font-weight:600;color:var(--ivory);text-shadow:0 1px 6px rgba(0,0,0,.35)}
.dx4 .ph img{filter:grayscale(1) contrast(1.06) brightness(.98)}
.dx4 .ph::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(0deg,rgba(46,34,28,.45),rgba(46,34,28,0) 40%)}
.dx4 .pts{gap:0;margin-top:10px}
.dx4 .pts li{padding:7px 0;border-bottom:1px solid rgba(232,221,208,.18)}
.dx4 .pts li:last-child{border-bottom:0}
.dx4 .pts li::before{display:none}
.dx4 .btn{background:var(--sand);color:var(--choc)!important;box-shadow:none;margin-top:16px}
.dx4 .btn:hover{background:var(--ivory)}`, `<p class="cap" aria-hidden="true">Krasnoyarsk · 2027</p>`],
];

const dir = new URL('tilda/location4/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, p, css, caption] of V) {
  const html = `<style>${base(p)}${css}\n</style>
<section class="${p}" data-dx aria-label="Детали">
  ${BODY.replace('CAPTION', caption).replace(/\n\s*\n/g, '\n')}
</section>`;
  const code = `<!-- DETAILS · ${name} -->\n${FONTS}\n${html}\n${JS}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(16), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
