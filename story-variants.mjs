// «Наша история» (Our story): 4 варианта → tilda/story/0N-*.html. Шоколадный фон, визуальный язык блока «Детали».
// Фото — временные заглушки (замените ссылки P1…P4 на свои). Запуск: node story-variants.mjs
import fs from 'node:fs';

const HOG = `@font-face{font-family:'Hogarth Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@4140bb56dd6b6bb40a7439003be591b2e9dc7901/assets/fonts/HogarthScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/qaishabdulaziz-beep/Wedding/4140bb56dd6b6bb40a7439003be591b2e9dc7901/assets/fonts/HogarthScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@f86f97a5e97c0ca45d085be24ed0e5c6193f24e0/Hogarth%20script.ttf') format('truetype');}`;
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ФОТО (временные): замените на свои — вертикальные, лучше 3:4
const U = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;
const P = [U('photo-1522673607200-164d1b6ce486'), U('photo-1519741497674-611481863552'), U('photo-1529634806980-85c3dd6d34ac'), U('photo-1522673607200-164d1b6ce486', 1200)];

const CH = [
  ['Знакомство', 'Три года назад Артур и&nbsp;Анна нашли друг друга. В&nbsp;тот вечер он ждал её у&nbsp;машины, протянул руку и&nbsp;открыл дверь. Возможно, тогда они ещё не&nbsp;знали, что эта встреча изменит их&nbsp;жизнь.'],
  ['Влюблённость', 'Их первое свидание длилось до&nbsp;самого утра. Они катались по&nbsp;ночному городу, пили чай и&nbsp;говорили обо всём на&nbsp;свете, словно были знакомы уже много лет.'],
  ['Навсегда', 'С&nbsp;той первой встречи прошло время, а&nbsp;чувства стали только глубже. Они создали свои маленькие традиции, научились быть рядом в&nbsp;радости и&nbsp;в&nbsp;обычных буднях и&nbsp;однажды поняли: именно так выглядит их&nbsp;«навсегда».'],
];
const FIN = 'Теперь впереди самое важное «да»&nbsp;— день, когда их история любви станет началом новой, общей главы.';
const SIGN = 'Артур and Анна';
const img = (i, alt = '') => `<img src="${P[i]}" alt="${alt}" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'">`;
const ch = (k, extra = '') => `<h3 class="hd">${CH[k][0]}</h3>${extra}<p class="tx">${CH[k][1]}</p>`;

const base = (p) => `
.${p}{--bg:#2E221C;--ivory:#F6F1EA;--cream:#EDE3D8;--sand:#E8DDD0;--latte:#C4AE9A;--line:rgba(232,221,208,.24);--ease:cubic-bezier(.22,.68,.18,1);
--script:'Hogarth Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;
position:relative;background:var(--bg);color:var(--cream);font-family:var(--serif);font-weight:400;font-size:14px;line-height:1.65;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,h3,figure){margin:0;padding:0;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.16;background-size:200px;background-image:${GRAIN}}
/* «Our story»: поля дают место росчеркам, маска-«письмо» их не режет */
.${p} .ttl{position:relative;z-index:4;display:inline-block;padding:.36em .3em .3em;font-family:var(--script);font-weight:400;line-height:1;color:var(--ivory);font-size:min(26.5vw,124px);white-space:nowrap;pointer-events:none}
/* фото: тёплый тон под палитру сайта */
.${p} .ph{position:relative;overflow:hidden;background:linear-gradient(160deg,#5A473C,#3A2C24)}
.${p} .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:sepia(.14) saturate(.88) contrast(1.03)}
/* главы: подзаголовок — основной шрифт жирный, текст — обычный */
.${p} .hd{font-size:clamp(11.5px,3.6vw,14px);letter-spacing:.17em;margin-right:-.17em;text-transform:uppercase;font-weight:700;color:var(--ivory);line-height:1.3}
.${p} .tx{margin-top:10px;font-size:13.5px;line-height:1.68;color:var(--cream);text-wrap:pretty}
.${p} .sep{height:1px;background:var(--sand);opacity:.35}
.${p} .fin{font-size:14.5px;line-height:1.7;color:var(--ivory);text-align:center;text-wrap:balance}
.${p} .sign{display:block;width:max-content;max-width:100%;margin:6px auto 0;padding:.3em .25em .25em;font-family:var(--script);font-weight:400;line-height:1;color:var(--ivory);font-size:clamp(36px,11vw,50px);white-space:nowrap}
/* появление: каждый элемент — когда доходит до экрана */
.${p}-js .${p} .rv{opacity:0;transform:translateY(16px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.${p}-js .${p} .rv.in{opacity:1;transform:none}
.${p}-js .${p} .ph.rv{opacity:1;transform:none}
.${p}-js .${p} .ph.rv img{clip-path:inset(0 0 100% 0);transform:scale(1.12);transition:clip-path 1.5s cubic-bezier(.7,0,.2,1),transform 2.6s var(--ease)}
.${p}-js .${p} .ph.rv.in img{clip-path:inset(0);transform:none}
.${p}-js .${p} .sep.rv{opacity:.35;transform:scaleX(0);transform-origin:left;transition:transform 1.3s var(--ease)}
.${p}-js .${p} .sep.rv.in{transform:none}
.${p}-js .${p} .wr{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;opacity:1;transform:none;
  transition:-webkit-mask-position 2s cubic-bezier(.45,.05,.3,1) var(--d,.2s),mask-position 2s cubic-bezier(.45,.05,.3,1) var(--d,.2s)}
.${p}-js .${p} .wr.in{-webkit-mask-position:0 0;mask-position:0 0}
@media (prefers-reduced-motion:reduce){.${p} *{transition-duration:.01s!important;transition-delay:0s!important}}`;

const js = (p) => `<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('.${p} .rv:not(.rv-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.12});
els.forEach(function(e){e.classList.add('rv-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const V = [
  /* 1. Как «Детали»: фото у края экрана зигзагом, текст рядом, главы разделены линиями */
  ['01-zigzag', 'Фото зигзагом, как в «Деталях»', 'st1', `
.st1{--pt:clamp(70px,21vw,104px);padding:var(--pt) 0 56px}
.st1 .ttl{position:absolute;left:calc(8px - .3em);top:calc(var(--pt) - .95em)}
.st1 .row{display:grid;grid-template-columns:46% minmax(0,1fr);align-items:stretch}
.st1 .row.rev{grid-template-columns:minmax(0,1fr) 46%}
.st1 .row .ph{min-height:clamp(220px,64vw,300px)}
.st1 .row .ph::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(46,34,28,.55),rgba(46,34,28,0) 34%);pointer-events:none}
.st1 .row.rev .ph::before{display:none}
.st1 .row:first-of-type .ph::before{display:block}
.st1 .col{padding:20px 14px 22px 16px;align-self:center}
.st1 .row.rev .col{padding:20px 16px 22px 18px}
.st1 .row:first-of-type .col{padding-top:calc(min(26.5vw,124px) * .42 + 10px)}
.st1 .sep{margin:20px 18px}
.st1 .end{padding:34px 26px 0}`, `
  <h2 class="ttl rv wr">Our story</h2>
  <div class="row">
    <!-- ФОТО 1 --><figure class="ph rv">${img(0, 'Артур и Анна')}</figure>
    <div class="col rv" style="--d:.3s">${ch(0)}</div>
  </div>
  <div class="sep rv" aria-hidden="true"></div>
  <div class="row rev">
    <div class="col rv" style="--d:.2s">${ch(1)}</div>
    <!-- ФОТО 2 --><figure class="ph rv">${img(1)}</figure>
  </div>
  <div class="sep rv" aria-hidden="true"></div>
  <div class="row">
    <!-- ФОТО 3 --><figure class="ph rv">${img(2)}</figure>
    <div class="col rv" style="--d:.2s">${ch(2)}</div>
  </div>
  <div class="end">
    <p class="fin rv">${FIN}</p>
    <p class="rv wr" style="--d:.5s"><span class="sign">${SIGN}</span></p>
  </div>`],

  /* 2. Большое фото сверху, «Our story» на его нижней кромке, главы под линиями, внизу пара фото */
  ['02-hero', 'Большое фото и главы', 'st2', `
.st2{padding:0 0 56px}
.st2 .hero{height:min(112vw,560px)}
.st2 .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(46,34,28,0) 55%,rgba(46,34,28,.55) 82%,var(--bg) 100%);pointer-events:none}
.st2 .ttl{display:block;width:max-content;margin:calc(-.85em - .36em) 0 0 calc(10px - .3em)}
.st2 .body{padding:0 24px}
.st2 .chap{display:grid;grid-template-columns:auto 1fr;column-gap:14px;padding:22px 0}
.st2 .chap+.chap,.st2 .chap+.duo+.chap{border-top:1px solid var(--line)}
.st2 .num{grid-row:span 2;font-size:12px;letter-spacing:.12em;line-height:1.3;color:var(--latte);padding-top:2px;min-width:22px;font-variant-numeric:lining-nums}
.st2 .duo{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:4px -24px 4px}
.st2 .duo .ph{aspect-ratio:4/5}
.st2 .end{margin-top:12px;padding-top:28px;border-top:1px solid var(--line)}`, `
  <!-- ФОТО 1 (главное) --><figure class="ph hero rv">${img(3, 'Артур и Анна')}</figure>
  <h2 class="ttl rv wr" style="--d:.4s">Our story</h2>
  <div class="body">
    <div class="chap rv"><span class="num" aria-hidden="true">01</span>${ch(0)}</div>
    <div class="chap rv"><span class="num" aria-hidden="true">02</span>${ch(1)}</div>
    <div class="duo">
      <!-- ФОТО 2 --><figure class="ph rv">${img(1)}</figure>
      <!-- ФОТО 3 --><figure class="ph rv" style="--d:.15s">${img(2)}</figure>
    </div>
    <div class="chap rv"><span class="num" aria-hidden="true">03</span>${ch(2)}</div>
    <div class="end">
      <p class="fin rv">${FIN}</p>
      <p class="rv wr" style="--d:.5s"><span class="sign">${SIGN}</span></p>
    </div>
  </div>`],

  /* 3. Фото-лента вдоль левого края на всю высоту глав, текст справа (как «Детали», но выше) */
  ['03-strip', 'Фото-лента сбоку', 'st3', `
.st3{--pt:clamp(70px,21vw,104px);padding:var(--pt) 0 56px}
.st3 .ttl{position:absolute;left:calc(8px - .3em);top:calc(var(--pt) - .95em)}
.st3 .grid{display:grid;grid-template-columns:38% minmax(0,1fr)}
.st3 .strip{display:flex;flex-direction:column;gap:6px}
.st3 .strip .ph{flex:1;min-height:140px}
.st3 .strip .ph:first-child::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(46,34,28,.55),rgba(46,34,28,0) 30%);pointer-events:none}
.st3 .cols{padding:0 16px 0 16px}
.st3 .chap{padding:22px 0 24px}
.st3 .chap:first-child{padding-top:calc(min(26.5vw,124px) * .42 + 10px)}
.st3 .chap+.chap{border-top:1px solid var(--line)}
.st3 .end{padding:34px 26px 0}`, `
  <h2 class="ttl rv wr">Our story</h2>
  <div class="grid">
    <div class="strip">
      <!-- ФОТО 1 --><figure class="ph rv">${img(0, 'Артур и Анна')}</figure>
      <!-- ФОТО 2 --><figure class="ph rv">${img(1)}</figure>
      <!-- ФОТО 3 --><figure class="ph rv">${img(2)}</figure>
    </div>
    <div class="cols">
      <div class="chap rv" style="--d:.3s">${ch(0)}</div>
      <div class="chap rv">${ch(1)}</div>
      <div class="chap rv">${ch(2)}</div>
    </div>
  </div>
  <div class="end">
    <p class="fin rv">${FIN}</p>
    <p class="rv wr" style="--d:.5s"><span class="sign">${SIGN}</span></p>
  </div>`],

  /* 4. Главы по центру, между ними широкие кадры от края до края — как страницы книги */
  ['04-book', 'Главы и широкие кадры', 'st4', `
.st4{padding:52px 0 56px;text-align:center}
.st4 .ttl{margin:0 auto}
.st4 .chap{padding:26px 28px 30px}
.st4 .chap .hd{display:flex;align-items:center;justify-content:center;gap:14px}
.st4 .chap .hd::before,.st4 .chap .hd::after{content:'';flex:0 0 28px;height:1px;background:var(--sand);opacity:.4}
.st4 .tx{max-width:330px;margin-left:auto;margin-right:auto}
.st4 .wide{aspect-ratio:16/10}
.st4 .wide.tall{aspect-ratio:4/3}
.st4 .end{margin:6px 28px 0;padding-top:28px;border-top:1px solid var(--line)}`, `
  <h2 class="ttl rv wr">Our story</h2>
  <div class="chap rv">${ch(0)}</div>
  <!-- ФОТО 1 --><figure class="ph wide rv">${img(0, 'Артур и Анна')}</figure>
  <div class="chap rv">${ch(1)}</div>
  <!-- ФОТО 2 --><figure class="ph wide tall rv">${img(1)}</figure>
  <div class="chap rv">${ch(2)}</div>
  <div class="end">
    <p class="fin rv">${FIN}</p>
    <p class="rv wr" style="--d:.5s"><span class="sign">${SIGN}</span></p>
  </div>`],
];

const dir = new URL('tilda/story/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, p, css, html] of V) {
  const s = `<!-- НАША ИСТОРИЯ · ${name} -->
<!-- ФОТО: сейчас стоят временные снимки — замените ссылки в <img src="…"> на свои фото -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..700&subset=cyrillic&display=swap">
<script>document.documentElement.classList.add('${p}-js')</script>
<style>
${HOG}${base(p)}
/* вариант: ${name} */${css}
</style>
<section class="${p}" aria-label="Наша история">${html}
</section>
${js(p)}
`;
  fs.writeFileSync(new URL(file + '.html', dir), s);
  console.log(file.padEnd(12), (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB');
}
