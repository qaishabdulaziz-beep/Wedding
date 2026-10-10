// «Наша история» — вторая серия: 5 разных дизайнов без рамок → tilda/story2/0N-*.html
// Фото — временные заглушки (замените ссылки на свои). Запуск: node story2-variants.mjs
import fs from 'node:fs';

const HOG = `@font-face{font-family:'Hogarth Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@4140bb56dd6b6bb40a7439003be591b2e9dc7901/assets/fonts/HogarthScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/qaishabdulaziz-beep/Wedding/4140bb56dd6b6bb40a7439003be591b2e9dc7901/assets/fonts/HogarthScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@f86f97a5e97c0ca45d085be24ed0e5c6193f24e0/Hogarth%20script.ttf') format('truetype');}`;
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const U = (id, w = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;
const P = [U('photo-1522673607200-164d1b6ce486'), U('photo-1519741497674-611481863552'), U('photo-1529634806980-85c3dd6d34ac')];
const img = (i, alt = '') => `<img src="${P[i % 3]}" alt="${alt}" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'">`;

const CH = [
  ['Знакомство', 'Три года назад Артур и&nbsp;Анна нашли друг друга. В&nbsp;тот вечер он ждал её у&nbsp;машины, протянул руку и&nbsp;открыл дверь. Возможно, тогда они ещё не&nbsp;знали, что эта встреча изменит их&nbsp;жизнь.'],
  ['Влюблённость', 'Их первое свидание длилось до&nbsp;самого утра. Они катались по&nbsp;ночному городу, пили чай и&nbsp;говорили обо всём на&nbsp;свете, словно были знакомы уже много лет.'],
  ['Навсегда', 'С&nbsp;той первой встречи прошло время, а&nbsp;чувства стали только глубже. Они создали свои маленькие традиции, научились быть рядом в&nbsp;радости и&nbsp;в&nbsp;обычных буднях и&nbsp;однажды поняли: именно так выглядит их&nbsp;«навсегда».'],
];
const FIN = 'Теперь впереди самое важное «да»&nbsp;— день, когда их история любви станет началом новой, общей главы.';
const END = `<div class="end">
    <p class="fin rv">${FIN}</p>
    <p class="rv wr" style="--d:.5s"><span class="sign">Артур and Анна</span></p>
  </div>`;
const no = (k) => `<span class="no">0${k + 1}</span>`;

const base = (p) => `
.${p}{--bg:#2E221C;--ivory:#F6F1EA;--cream:#E9DFD3;--latte:#C4AE9A;--line:rgba(232,221,208,.2);--ease:cubic-bezier(.22,.68,.18,1);
--script:'Hogarth Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;
position:relative;background:var(--bg);color:var(--cream);font-family:var(--serif);font-weight:400;font-size:14px;line-height:1.7;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,h3,figure){margin:0;padding:0;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:20;opacity:.16;background-size:200px;background-image:${GRAIN}}
.${p} .ttl{position:relative;z-index:4;display:inline-block;padding:.36em .3em .3em;font-family:var(--script);font-weight:400;line-height:1;color:var(--ivory);font-size:min(25vw,118px);white-space:nowrap;pointer-events:none}
.${p} .ph{position:relative;overflow:hidden;background:#3B2D25}
.${p} .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:sepia(.12) saturate(.9) contrast(1.03)}
.${p} .no{display:block;font-size:11px;letter-spacing:.28em;color:var(--latte);font-variant-numeric:lining-nums;line-height:1}
/* подзаголовки глав — основной шрифт, жирный; текст — основной, обычный */
.${p} .hd{margin-top:10px;font-size:clamp(11.5px,3.6vw,13.5px);letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:var(--ivory);line-height:1.35}
.${p} .tx{margin-top:12px;font-size:13.5px;line-height:1.72;color:var(--cream);text-wrap:pretty}
.${p} .end{text-align:center}
.${p} .fin{max-width:320px;margin:0 auto;font-size:14.5px;line-height:1.72;color:var(--ivory);text-wrap:balance}
.${p} .sign{display:block;width:max-content;max-width:100%;margin:8px auto 0;padding:.3em .25em .25em;font-family:var(--script);font-weight:400;line-height:1;color:var(--ivory);font-size:clamp(36px,11vw,50px);white-space:nowrap}
.${p}-js .${p} .rv{opacity:0;transform:translateY(18px);transition:opacity 1.2s var(--ease),transform 1.2s var(--ease);transition-delay:var(--d,0s)}
.${p}-js .${p} .rv.in{opacity:1;transform:none}
.${p}-js .${p} .wr{opacity:1;transform:none;-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;
  transition:-webkit-mask-position 2.1s cubic-bezier(.45,.05,.3,1) var(--d,.2s),mask-position 2.1s cubic-bezier(.45,.05,.3,1) var(--d,.2s)}
.${p}-js .${p} .wr.in{-webkit-mask-position:0 0;mask-position:0 0}
@media (prefers-reduced-motion:reduce){.${p} *{transition-duration:.01s!important;transition-delay:0s!important;animation:none!important}}`;

const reveal = (p) => `<script>(function(){var d=document;
function go(){var els=d.querySelectorAll('.${p} .rv:not(.rv-o)');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.1});
els.forEach(function(e){e.classList.add('rv-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

// общий «двигатель» прокрутки: вызывает f(rect, vh) на каждом кадре прокрутки
const scrollJs = (p, body) => `<script>(function(){var d=document,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm)return;
function init(s){if(s.__s)return;s.__s=1;var raf=0;
${body}
function tick(){raf=0;var vh=window.innerHeight||d.documentElement.clientHeight;frame(vh)}
function on(){if(!raf)raf=requestAnimationFrame(tick)}
addEventListener('scroll',on,{passive:true});addEventListener('resize',on);on()}
function run(){d.querySelectorAll('.${p}').forEach(init)}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',run);else run()})();</script>`;

const V = [
  /* 1 · Журнальный разворот: фото разных размеров у краёв экрана, асимметричная вёрстка, параллакс */
  ['01-editorial', 'Журнальный разворот', 'sa', `
.sa{padding:64px 0 64px}
.sa .hero{position:relative}
.sa .pa{width:72%;margin-left:auto;aspect-ratio:4/5}
.sa .pa::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(46,34,28,.55),rgba(46,34,28,0) 42%);pointer-events:none}
.sa .hero .ttl{position:absolute;left:calc(12px - .3em);top:40%}
.sa [data-par] img{top:-9%;bottom:-9%;height:118%;transform:translate3d(0,var(--py,0px),0);will-change:transform}
.sa .r1{display:grid;grid-template-columns:minmax(0,1fr) 39%;gap:18px;align-items:start;margin-top:42px;padding-left:24px}
.sa .r1 .ph{aspect-ratio:3/4;margin-top:72px}
.sa .r2{padding:46px 24px 0 26%}
.sa .pc{width:80%;aspect-ratio:5/4;margin-top:46px}
.sa .r3{width:84%;margin:40px 0 0 auto;padding-right:24px}
.sa .end{padding:56px 28px 0}`, `
  <div class="hero">
    <!-- ФОТО 1 --><figure class="ph pa" data-par="1">${img(0, 'Артур и Анна')}</figure>
    <h2 class="ttl rv wr" style="--d:.3s">Our story</h2>
  </div>
  <div class="r1">
    <div class="rv">${no(0)}<h3 class="hd">${CH[0][0]}</h3><p class="tx">${CH[0][1]}</p></div>
    <!-- ФОТО 2 --><figure class="ph" data-par="1.6">${img(1)}</figure>
  </div>
  <div class="r2 rv">${no(1)}<h3 class="hd">${CH[1][0]}</h3><p class="tx">${CH[1][1]}</p></div>
  <!-- ФОТО 3 --><figure class="ph pc" data-par="1.2">${img(2)}</figure>
  <div class="r3 rv">${no(2)}<h3 class="hd">${CH[2][0]}</h3><p class="tx">${CH[2][1]}</p></div>
  ${END}`, scrollJs('sa', `var f=s.querySelectorAll('[data-par]');
function frame(vh){f.forEach(function(e){var r=e.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;var c=(r.top+r.height/2-vh/2)/vh;c=Math.max(-1,Math.min(1,c));e.style.setProperty('--py',(-c*16*(+e.getAttribute('data-par'))).toFixed(1)+'px')})}`)],

  /* 2 · Кино-кадры: фото на весь экран сменяется плавной склейкой, текст главы меняется внизу кадра */
  ['02-film', 'Кино-кадры', 'sb', `
.sb{padding:0 0 64px;overflow:hidden;overflow:clip}
.sb .head{padding:58px 24px 30px;text-align:center}
.sb .scene{position:relative}
.sb .stick{position:-webkit-sticky;position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
.sb .fr{position:absolute;inset:0;opacity:0;transition:opacity 1.4s var(--ease)}
.sb .fr.on{opacity:1}
.sb .fr img{transform:scale(1.1);transition:transform 9s cubic-bezier(.2,.6,.3,1)}
.sb .fr.on img{transform:scale(1)}
.sb .stick::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,var(--bg) 0,rgba(46,34,28,0) 16%,rgba(46,34,28,0) 40%,rgba(46,34,28,.78) 66%,rgba(46,34,28,.96) 86%,var(--bg) 100%);pointer-events:none}
.sb .count{position:absolute;z-index:2;right:22px;top:26px;font-size:11px;letter-spacing:.28em;color:var(--ivory);font-variant-numeric:lining-nums;opacity:.85}
.sb .count b{font-weight:400;display:inline-block;transition:opacity .5s}
/* тексты глав — внизу кадра, сменяют друг друга */
.sb .texts{position:absolute;z-index:3;left:26px;right:26px;bottom:8vh;bottom:8svh}
.sb .texts .in{position:absolute;left:0;right:0;bottom:0;max-width:330px;opacity:0;transform:translateY(16px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.sb .texts .in.act{opacity:1;transform:none;transition-delay:.25s}
/* «шаги» — невидимые отрезки прокрутки, по одному на главу */
.sb .steps{position:relative;margin-top:-100vh;margin-top:-100svh;pointer-events:none}
.sb .step{height:70vh;height:70svh}
.sb .step:first-child{height:100vh;height:100svh}
.sb .end{padding:40px 28px 0}`, `
  <div class="head"><h2 class="ttl rv wr">Our story</h2></div>
  <div class="scene">
    <div class="stick">
      <!-- ФОТО 1 --><figure class="ph fr on" aria-hidden="true">${img(0, 'Артур и Анна')}</figure>
      <!-- ФОТО 2 --><figure class="ph fr" aria-hidden="true">${img(1)}</figure>
      <!-- ФОТО 3 --><figure class="ph fr" aria-hidden="true">${img(2)}</figure>
      <span class="count" aria-hidden="true"><b>01</b> / 03</span>
      <div class="texts">
        <div class="in act">${no(0)}<h3 class="hd">${CH[0][0]}</h3><p class="tx">${CH[0][1]}</p></div>
        <div class="in">${no(1)}<h3 class="hd">${CH[1][0]}</h3><p class="tx">${CH[1][1]}</p></div>
        <div class="in">${no(2)}<h3 class="hd">${CH[2][0]}</h3><p class="tx">${CH[2][1]}</p></div>
      </div>
    </div>
    <div class="steps" aria-hidden="true"><div class="step"></div><div class="step"></div><div class="step"></div></div>
  </div>
  ${END}`, `<script>(function(){var d=document;
function init(s){if(s.__f)return;s.__f=1;var fr=s.querySelectorAll('.fr'),tx=s.querySelectorAll('.texts .in'),st=s.querySelectorAll('.step'),c=s.querySelector('.count b'),cur=0;
function set(k){if(k===cur)return;cur=k;fr.forEach(function(e,i){e.classList.toggle('on',i===k)});tx.forEach(function(e,i){e.classList.toggle('act',i===k)});
if(c){c.style.opacity=0;setTimeout(function(){c.textContent='0'+(k+1);c.style.opacity=1},250)}}
if(!('IntersectionObserver' in window))return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)set([].indexOf.call(st,e.target))})},{rootMargin:'-50% 0px -49% 0px'});
st.forEach(function(e){io.observe(e)})}
function run(){d.querySelectorAll('.sb').forEach(init)}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',run);else run()})();</script>`],

  /* 3 · Коллаж: три снимка разного масштаба наложены друг на друга и «съезжаются»; главы — журнальной сеткой */
  ['03-collage', 'Коллаж', 'sc', `
.sc{padding:52px 0 64px}
.sc .ttl{display:block;width:max-content;margin:0 calc(12px - .3em) 0 auto}
.sc .col{position:relative;width:100%;aspect-ratio:1/1.06;margin-top:6px}
.sc .col .ph{position:absolute;box-shadow:0 34px 60px -26px rgba(0,0,0,.75)}
.sc .q1{left:0;top:0;width:60%;aspect-ratio:3/4;box-shadow:none!important}
.sc .q2{right:7%;top:16%;width:42%;aspect-ratio:4/5;z-index:2}
.sc .q3{left:31%;bottom:0;width:34%;aspect-ratio:1/1;z-index:3}
.sc-js .sc .col .ph{opacity:0;transition:opacity 1.2s var(--ease),transform 1.6s cubic-bezier(.16,.84,.24,1)}
.sc-js .sc .q1{transform:translateX(-26px)}
.sc-js .sc .q2{transform:translate(30px,18px);transition-delay:.25s}
.sc-js .sc .q3{transform:translateY(40px) scale(.94);transition-delay:.5s}
.sc-js .sc .col.in .ph{opacity:1;transform:none}
.sc .chs{padding:50px 24px 0}
.sc .ch{display:grid;grid-template-columns:22% minmax(0,1fr);gap:4px;padding:26px 0;border-top:1px solid var(--line)}
.sc .ch:last-child{border-bottom:1px solid var(--line)}
.sc .ch .big{font-size:30px;line-height:1;color:var(--latte);font-variant-numeric:lining-nums;letter-spacing:.02em}
.sc .ch .hd{margin-top:2px}
.sc .end{padding:46px 28px 0}`, `
  <h2 class="ttl rv wr">Our story</h2>
  <div class="col rv-o" data-col>
    <!-- ФОТО 1 --><figure class="ph q1">${img(0, 'Артур и Анна')}</figure>
    <!-- ФОТО 2 --><figure class="ph q2">${img(1)}</figure>
    <!-- ФОТО 3 --><figure class="ph q3">${img(2)}</figure>
  </div>
  <div class="chs">
    ${CH.map((c, k) => `<div class="ch rv"><span class="big">0${k + 1}</span><div><h3 class="hd">${c[0]}</h3><p class="tx">${c[1]}</p></div></div>`).join('\n    ')}
  </div>
  ${END}`, `<script>(function(){var d=document;
function run(){d.querySelectorAll('.sc [data-col]').forEach(function(c){if(!('IntersectionObserver' in window)){c.classList.add('in');return}
var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){c.classList.add('in');io.disconnect()}},{threshold:.25});io.observe(c)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',run);else run()})();</script>`],

  /* 4 · Камея: круглый портрет с надписью по кругу (вращается при прокрутке), два круга-фото сближаются */
  ['04-cameo', 'Камея', 'sd', `
.sd{padding:54px 0 64px;text-align:center}
.sd .cam{position:relative;width:min(84%,380px);aspect-ratio:1/1;margin:0 auto}
.sd .cam .ph{position:absolute;inset:12.5%;border-radius:50%}
.sd .ring{position:absolute;inset:0;width:100%;height:100%;overflow:visible;transform:rotate(var(--rot,0deg));will-change:transform}
.sd .ring text{font-family:var(--serif);font-size:7.4px;letter-spacing:2.4px;font-weight:600;fill:var(--latte)}
.sd .cam+.ttl{margin:-.75em auto 0}
.sd .ch{padding:34px 30px 0}
.sd .ch .no{margin-bottom:2px}
.sd .tx{max-width:320px;margin-left:auto;margin-right:auto}
.sd .duo{position:relative;width:88%;aspect-ratio:1.72/1;margin:46px auto 0}
.sd .duo .ph{position:absolute;top:0;width:58%;aspect-ratio:1/1;border-radius:50%}
.sd .duo .o1{left:0;transform:translateX(calc(var(--k,1) * -11%))}
.sd .duo .o2{right:0;transform:translateX(calc(var(--k,1) * 11%));box-shadow:-18px 0 40px -18px rgba(0,0,0,.7)}
.sd .end{padding:46px 28px 0}`, `
  <div class="cam rv">
    <svg class="ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="sd-c" d="M100 100 m-93 0 a93 93 0 1 1 186 0 a93 93 0 1 1 -186 0"/></defs>
      <text><textPath href="#sd-c" textLength="584" lengthAdjust="spacing">ЗНАКОМСТВО · ВЛЮБЛЁННОСТЬ · НАВСЕГДА · ЗНАКОМСТВО · ВЛЮБЛЁННОСТЬ · НАВСЕГДА ·</textPath></text></svg>
    <!-- ФОТО 1 --><figure class="ph">${img(0, 'Артур и Анна')}</figure>
  </div>
  <h2 class="ttl rv wr" style="--d:.4s">Our story</h2>
  <div class="ch rv">${no(0)}<h3 class="hd">${CH[0][0]}</h3><p class="tx">${CH[0][1]}</p></div>
  <div class="ch rv">${no(1)}<h3 class="hd">${CH[1][0]}</h3><p class="tx">${CH[1][1]}</p></div>
  <div class="duo" aria-hidden="true">
    <!-- ФОТО 2 --><figure class="ph o1">${img(1)}</figure>
    <!-- ФОТО 3 --><figure class="ph o2">${img(2)}</figure>
  </div>
  <div class="ch rv">${no(2)}<h3 class="hd">${CH[2][0]}</h3><p class="tx">${CH[2][1]}</p></div>
  ${END}`, scrollJs('sd', `var ring=s.querySelector('.ring'),duo=s.querySelector('.duo');
function frame(vh){var r=s.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
ring.style.setProperty('--rot',(-r.top*.09).toFixed(2)+'deg');
var q=duo.getBoundingClientRect(),p=(vh-q.top)/(vh*.65);p=Math.max(0,Math.min(1,p));p=1-Math.pow(1-p,2);duo.style.setProperty('--k',(1-p).toFixed(3))}`)],

  /* 5 · Плёнка: лента снимков едет вбок при прокрутке; в главах — рукописная буквица, как в книге */
  ['05-reel', 'Плёнка и буквицы', 'se', `
.se{padding:56px 0 64px}
.se .ttl{display:block;width:max-content;margin:0 0 0 calc(14px - .3em)}
.se .reel{margin-top:14px;overflow:hidden}
.se .strip{display:flex;align-items:flex-start;gap:10px;width:max-content;padding:0 16px;transform:translate3d(var(--x,0px),0,0);will-change:transform}
.se .strip .ph{flex:none;height:min(66vw,320px)}
.se .strip .ph:nth-child(1){aspect-ratio:3/4}
.se .strip .ph:nth-child(2){aspect-ratio:1/1;margin-top:34px}
.se .strip .ph:nth-child(3){aspect-ratio:4/5}
.se .strip .ph:nth-child(4){aspect-ratio:5/4;margin-top:22px}
.se .strip .ph:nth-child(5){aspect-ratio:3/4}
.se .chs{padding:26px 26px 0}
.se .ch{padding:30px 0 4px}
.se .ch+.ch{border-top:1px solid var(--line);margin-top:26px}
.se .ch .hd{display:flex;align-items:baseline;gap:12px;margin-top:0}
.se .ch .hd .no{display:inline;font-weight:400}
/* буквица: первая буква текста — рукописным, крупно */
.se .tx::first-letter{float:left;font-family:var(--script);font-size:3.7em;line-height:.8;padding:.12em .34em 0 .06em;color:var(--ivory)}
.se .end{padding:52px 28px 0}`, `
  <h2 class="ttl rv wr">Our story</h2>
  <div class="reel" aria-hidden="true"><div class="strip">
    <!-- ФОТО 1 --><figure class="ph">${img(0)}</figure>
    <!-- ФОТО 2 --><figure class="ph">${img(1)}</figure>
    <!-- ФОТО 3 --><figure class="ph">${img(2)}</figure>
    <!-- ФОТО 4 --><figure class="ph">${img(0)}</figure>
    <!-- ФОТО 5 --><figure class="ph">${img(1)}</figure>
  </div></div>
  <div class="chs">
    ${CH.map((c, k) => `<div class="ch rv"><h3 class="hd"><span class="no">0${k + 1}</span>${c[0]}</h3><p class="tx">${c[1]}</p></div>`).join('\n    ')}
  </div>
  ${END}`, scrollJs('se', `var reel=s.querySelector('.reel'),st=s.querySelector('.strip');
function frame(vh){var r=reel.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;var p=(vh-r.top)/(vh+r.height);p=Math.max(0,Math.min(1,p));
var max=Math.max(0,st.scrollWidth-reel.clientWidth);st.style.setProperty('--x',(-p*max).toFixed(1)+'px')}`)],
];

const dir = new URL('tilda/story2/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, p, css, html, extra = ''] of V) {
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
${reveal(p)}
${extra}
`;
  fs.writeFileSync(new URL(file + '.html', dir), s);
  console.log(file.padEnd(14), (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB');
}
