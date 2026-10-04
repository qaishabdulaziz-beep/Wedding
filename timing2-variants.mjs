// Тайминг, вторая серия: 4 варианта, каждый помещается в один экран телефона.
// Запуск: node timing2-variants.mjs → tilda/timing2/
import fs from 'node:fs';

const ITEMS = [
  ['16:30', 'Сбор гостей', 'Welcome-зона, лёгкие закуски и время для тёплых встреч'],
  ['17:00', 'Выездная церемония', 'Самый трогательный момент дня'],
  ['18:00', 'Начало банкета', 'Ужин, тёплые слова и танцы'],
  ['23:00', 'Завершение вечера', 'В 23:30 трансфер отвезёт гостей в город'],
];

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..600&subset=cyrillic&display=swap">`;
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const base = (p) => `
.${p}{--bg:#F6F1EA;--choc:#3E2F27;--ink:#4A3A31;--latte:#8C7566;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--bg);color:var(--choc);font-family:'Lora',Georgia,serif;font-weight:500;font-size:16px;line-height:1.5;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,ol,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.1;background-size:200px;background-image:${NOISE}}
.${p}>*{position:relative;z-index:1}
.${p} h2{font-size:clamp(18px,5.2vw,22px);letter-spacing:.42em;text-transform:uppercase;font-weight:500;line-height:1.2;margin-right:-.42em}
.${p} .t{font-weight:400;font-variant-numeric:lining-nums tabular-nums;color:var(--latte);letter-spacing:.02em;line-height:1}
.${p} .n{color:var(--choc);font-weight:500}
.${p} .d{color:var(--ink);font-weight:400;text-wrap:balance}
.tm-js .${p} [data-tm]>*{opacity:0;transform:translateY(14px);transition:opacity 1s var(--ease),transform 1s var(--ease)}
.tm-js .${p} [data-tm]>*:nth-child(2){transition-delay:.1s}
.tm-js .${p} [data-tm]>*:nth-child(3){transition-delay:.2s}
.tm-js .${p} .tm-in>*{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.tm-js .${p} [data-tm]>*{transform:none;transition:opacity .6s linear}}`;

const REVEAL = `<script>(function(){var d=document;d.documentElement.classList.add('tm-js');
function go(){var els=d.querySelectorAll('[data-tm]:not(.tm-o)'),next=0;
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('tm-in')});return}
var io=new IntersectionObserver(function(es){es.filter(function(e){return e.isIntersecting}).sort(function(a,b){return a.boundingClientRect.top-b.boundingClientRect.top}).forEach(function(e){
var now=Date.now(),at=Math.max(now,next);next=at+300;io.unobserve(e.target);setTimeout(function(){e.target.classList.add('tm-in')},at-now)})},{rootMargin:'0px 0px -8% 0px',threshold:.2});
els.forEach(function(e){e.classList.add('tm-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const li = (attr = 'data-tm') => ITEMS.map(([t, n, d]) =>
  `\n    <li ${attr}><p class="t">${t}</p><p class="n">${n}</p><p class="d">${d}</p></li>`).join('');

const V = [];

/* ---------- 1. Сетка 2×2 со сдвигом: как разворот журнала ---------- */
V.push(['01-grid', 'Сетка 2×2', `
<style>${base('tn1')}
.tn1{padding:64px 24px 72px}
.tn1 h2{text-align:center}
.tn1 .sub{margin-top:10px;text-align:center;font-size:14px;font-style:italic;font-weight:400;color:var(--latte)}
.tn1 .list{margin-top:40px;display:grid;grid-template-columns:1fr 1fr;column-gap:22px;row-gap:34px}
.tn1 li:nth-child(even){transform:translateY(46px)}
.tn1 .list{padding-bottom:46px}
.tn1 .t{font-size:clamp(40px,12vw,50px)}
.tn1 .n{margin-top:12px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;line-height:1.4}
.tn1 .d{margin-top:6px;font-size:14.5px;line-height:1.5;text-wrap:pretty}
</style>
<section class="tn1" aria-label="Тайминг">
  <h2 data-tm><span>Тайминг</span></h2>
  <p class="sub" data-tm><span>23 июля · пятница</span></p>
  <ol class="list">${li()}
  </ol>
</section>
${REVEAL}`]);

/* ---------- 2. Статичный фон и три большие шёлковые ленты, которые медленно колышутся ---------- */
V.push(['02-ribbons', 'Три ленты', `
<style>${base('tn2')}
.tn2{padding:68px 26px 76px;text-align:center}
.tn2 .rib{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.tn2 .rib path{stroke:rgba(255,255,255,.7);stroke-width:.8;opacity:.9;filter:drop-shadow(0 10px 14px rgba(62,47,39,.13))}
.tn2 .list{margin-top:36px;display:grid;gap:26px}
.tn2 .t{font-size:clamp(30px,9vw,36px)}
.tn2 .n{margin-top:8px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:600}
.tn2 .d{margin:4px auto 0;max-width:280px;font-size:15px;line-height:1.5}
</style>
<section class="tn2" aria-label="Тайминг">
  <svg class="rib" viewBox="0 0 400 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="tn2a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFDF9"/><stop offset=".45" stop-color="#EFE5D9"/><stop offset=".7" stop-color="#FBF6EF"/><stop offset="1" stop-color="#D6C3AF"/></linearGradient>
      <linearGradient id="tn2b" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9C7B4"/><stop offset=".4" stop-color="#FFFDF9"/><stop offset=".75" stop-color="#EADFD2"/><stop offset="1" stop-color="#F8F2EA"/></linearGradient>
    </defs>
    <path fill="url(#tn2a)"/><path fill="url(#tn2b)"/><path fill="url(#tn2a)"/>
  </svg>
  <h2 data-tm><span>Тайминг</span></h2>
  <ol class="list">${li()}
  </ol>
</section>
<script>(function(){var s=document.currentScript.previousElementSibling,svg=s&&s.querySelector('svg.rib');if(!svg)return;
var P=svg.querySelectorAll('path'),RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,
/* каждая лента: начало, 2 контрольные точки, конец (кубическая кривая), ширина, скорость, число перекрутов */
R=[[[130,-50],[260,110],[330,-10],[470,230],58,.00021,1.6],
   [[-60,170],[90,300],[-40,470],[90,660],44,.00017,1.4],
   [[110,830],[240,640],[350,770],[480,540],62,.00019,1.5]];
function bz(a,b,c,d,t){var u=1-t;return[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]}
function draw(ms){R.forEach(function(r,i){var ph=ms*r[5]*6.283,sw=Math.sin(ph)*18,sw2=Math.cos(ph*.8)*14,
a=r[0],b=[r[1][0]+sw,r[1][1]-sw2],c=[r[2][0]-sw2,r[2][1]+sw],d=r[3],L=[],Rr=[];
for(var k=0;k<=48;k++){var t=k/48,p=bz(a,b,c,d,t),q=bz(a,b,c,d,Math.min(1,t+.01)),dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy)||1,
w=r[4]*(.35+.65*Math.abs(Math.cos(t*Math.PI*r[6]+ph*1.4)))*(.55+.45*Math.sin(t*Math.PI)),nx=-dy/len*w/2,ny=dx/len*w/2;
L.push((p[0]+nx).toFixed(1)+' '+(p[1]+ny).toFixed(1));Rr.unshift((p[0]-nx).toFixed(1)+' '+(p[1]-ny).toFixed(1))}
P[i].setAttribute('d','M'+L.join(' L')+' L'+Rr.join(' L')+'Z')})}
var on=false,raf=0;function loop(ms){draw(ms);if(on)raf=requestAnimationFrame(loop)}
draw(4000);if(RM)return;
if('IntersectionObserver' in window){new IntersectionObserver(function(e){on=e[0].isIntersecting;cancelAnimationFrame(raf);if(on)raf=requestAnimationFrame(loop)}).observe(s)}
else{on=true;raf=requestAnimationFrame(loop)}})();</script>
${REVEAL}`]);

/* ---------- 3. Путь дня: при скролле тонкая нить спускается от момента к моменту,
   кольцо переходит на текущий пункт, пройденные пункты «оживают» ---------- */
V.push(['03-scroll-path', 'Путь дня при скролле', `
<style>${base('tn3')}
.tn3{padding:64px 24px 72px}
.tn3 h2{text-align:center}
.tn3 .list{position:relative;margin-top:40px;display:grid;gap:30px;padding-left:0}
.tn3 li{display:grid;grid-template-columns:74px 26px 1fr;align-items:baseline;transition:opacity .8s var(--ease)}
.tn3 li>*{grid-column:3}
.tn3 li .t{grid-column:1;grid-row:1 / span 2;font-size:clamp(24px,7vw,28px);text-align:right;transition:color .8s}
.tn3 .n{font-size:17.5px;line-height:1.3}
.tn3 .d{margin-top:3px;font-size:14.5px;line-height:1.45}
.tn3 .track{position:absolute;left:87px;top:6px;bottom:6px;width:1px;background:rgba(62,47,39,.14)}
.tn3 .fill{position:absolute;left:0;top:0;width:1px;height:var(--h,0px);background:var(--choc);transition:height .9s var(--ease)}
.tn3 .ring{position:absolute;left:-5px;top:var(--h,0px);width:11px;height:11px;margin-top:-5px;border-radius:50%;
  box-shadow:inset 0 0 0 1px var(--choc);background:var(--bg);transition:top .9s var(--ease)}
.tm-js .tn3.tp li{opacity:.32}
.tm-js .tn3.tp li.on{opacity:1}
.tm-js .tn3.tp li.on .t{color:var(--choc)}
@media (max-width:359px){.tn3 li{grid-template-columns:64px 24px 1fr}.tn3 .track{left:75px}}
</style>
<section class="tn3" aria-label="Тайминг">
  <h2 data-tm><span>Тайминг</span></h2>
  <ol class="list"><span class="track" aria-hidden="true"><span class="fill"></span><span class="ring"></span></span>${li()}
  </ol>
</section>
<script>(function(){var s=document.currentScript.previousElementSibling;if(!s||!s.querySelector)return;
var list=s.querySelector('.list'),items=[].slice.call(list.querySelectorAll('li')),track=list.querySelector('.track'),tick=false;
s.classList.add('tp');
function upd(){tick=false;var line=window.innerHeight*.8,act=-1;
items.forEach(function(li,i){if(li.getBoundingClientRect().top<line)act=i});
items.forEach(function(li,i){li.classList.toggle('on',i<=act)});
var h=0;if(act>=0){var t=items[act].querySelector('.t');h=t.getBoundingClientRect().top+t.offsetHeight*.42-track.getBoundingClientRect().top}
track.style.setProperty('--h',Math.max(0,h)+'px')}
function req(){if(!tick){tick=true;requestAnimationFrame(upd)}}
window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);upd();setTimeout(upd,600)})();</script>
${REVEAL}`]);

/* ---------- 4. Ступени: моменты спускаются лесенкой слева направо, как течение дня ---------- */
V.push(['04-steps', 'Ступени', `
<style>${base('tn4')}
.tn4{padding:64px 22px 70px}
.tn4 h2{text-align:left;margin-right:0}
.tn4 .list{margin-top:36px;display:grid;gap:22px}
.tn4 li{width:76%}
.tn4 li:nth-child(2){margin-left:8%}
.tn4 li:nth-child(3){margin-left:16%}
.tn4 li:nth-child(4){margin-left:24%}
.tn4 li{display:grid;grid-template-columns:auto 1fr;column-gap:14px;align-items:baseline}
.tn4 .t{grid-row:span 2;font-size:clamp(34px,10vw,42px);letter-spacing:-.01em}
.tn4 .n{font-size:16.5px;line-height:1.3}
.tn4 .d{grid-column:2;margin-top:3px;font-size:14px;line-height:1.45}
.tn4 .end{margin-top:30px;text-align:right;font-size:14px;font-style:italic;font-weight:400;color:var(--latte)}
</style>
<section class="tn4" aria-label="Тайминг">
  <h2 data-tm><span>Тайминг</span></h2>
  <ol class="list">${li()}
  </ol>
  <p class="end" data-tm><span>23 июля · пятница</span></p>
</section>
${REVEAL}`]);

const dir = new URL('tilda/timing2/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ТАЙМИНГ · ${name} -->\n${FONTS}\n${html.trim()}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(18), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
