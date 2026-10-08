// Тайминг по референсу «РефТайм»: свободная линия широкими дугами огибает пункты с противоположной стороны,
// заканчивается каллиграфическим завитком; по линии при прокрутке едет сердечко (медленно: блок «задерживается» на экране).
// 3 варианта → tilda/timing-flow/0N-*.html. Запуск: node timing-flow-variants.mjs
import fs from 'node:fs';

const HOG = `@font-face{font-family:'Hogarth Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@4140bb56dd6b6bb40a7439003be591b2e9dc7901/assets/fonts/HogarthScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/qaishabdulaziz-beep/Wedding/4140bb56dd6b6bb40a7439003be591b2e9dc7901/assets/fonts/HogarthScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@f86f97a5e97c0ca45d085be24ed0e5c6193f24e0/Hogarth%20script.ttf') format('truetype');}`;
const ITEMS = [['16:30', 'Сбор гостей'], ['17:00', 'Выездная церемония'], ['18:00', 'Начало банкета'], ['23:00', 'Завершение вечера']];
const f = (n) => +n.toFixed(1);

/* ---------- геометрия ---------- */
// Catmull-Rom → кубические сегменты [[p0,c1,c2,p1],...]
function segs(P, t = 1) {
  const S = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
    S.push([p1, [p1[0] + (p2[0] - p0[0]) / 6 * t, p1[1] + (p2[1] - p0[1]) / 6 * t], [p2[0] - (p3[0] - p1[0]) / 6 * t, p2[1] - (p3[1] - p1[1]) / 6 * t], p2]);
  }
  return S;
}
const dOf = (S) => `M${f(S[0][0][0])} ${f(S[0][0][1])}` + S.map(([, a, b, c]) => ` C${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${f(c[0])} ${f(c[1])}`).join('');
const bez = ([p0, c1, c2, p1], t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t * t * t * p1[k]); };
function sample(S, n = 40) { const out = []; S.forEach((s, i) => { for (let j = i ? 1 : 0; j <= n; j++) out.push(bez(s, j / n)); }); return out; }
// лента переменной ширины (перо с наклоном): заливаемый контур
function ribbon(pts, wfn) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1], A = [], B = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    const nx = -dy / d, ny = dx / d, w = wfn(L[i] / T, dx / d, dy / d) / 2;
    A.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); B.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  const all = A.concat(B.reverse());
  return 'M' + all.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + ' Z';
}
// ширина пера: тонко по одной диагонали, толсто по другой (как у широкого пера), сужение на концах
const nib = (w0, w1, ang = -0.75) => (t, tx, ty) => { const s = Math.abs(Math.sin(Math.atan2(ty, tx) - ang)); const end = Math.min(1, t / .02, (1 - t) / .1); return (w0 + w1 * s) * Math.max(.18, end); };

/* ---------- раскладка: viewBox 360 × H; пункты справа/слева, линия огибает их с противоположной стороны ---------- */
const H = 510;
const ROWS = [74, 186, 298, 410];                 // центры пунктов по вертикали
const SIDE = ['r', 'l', 'r', 'l'];
const ITEM_X = { r: 338, l: 22 };

// основная линия (до завитка) — свободная, чуть асимметричная, как в референсе
const FLOW_A = [[326, 8], [292, 6], [214, 12], [132, 26], [62, 52], [30, 84], [40, 112], [96, 132], [190, 146], [286, 162], [334, 186], [330, 214], [270, 234], [170, 250], [78, 268], [30, 298], [38, 330], [104, 350], [204, 366], [300, 384], [336, 410], [326, 442], [292, 464], [252, 474]];
// завиток в конце — как выходной штрих рукописной буквы: петля и тонкий хвост
const CURL_A = [[252, 474], [226, 482], [200, 486], [178, 482], [164, 470], [162, 455], [172, 445], [186, 447], [192, 460], [184, 477], [164, 490], [140, 497], [116, 495], [96, 486], [84, 472]];

// вариант 3: линия выходит из заголовка, на поворотах — петли как в прописи
// петля на повороте: трохоида вдоль вертикали, выносится наружу (side=+1 вправо, -1 влево)
const loop = (x, y, side, a = 6.5, b = 13) => Array.from({ length: 15 }, (_, i) => { const u = -Math.PI + 2 * Math.PI * i / 14; return [x - side * 2 * b + side * b * (1 + Math.cos(u)), y + a * u - b * Math.sin(u)]; });
const FLOW_C2 = [[178, -30], [150, -8], [100, 14], [52, 40], [28, 72], [44, 104], [100, 126], [196, 142], [276, 158], ...loop(338, 190, 1), [290, 232], [196, 250], [104, 266], ...loop(22, 302, -1), [70, 346], [164, 362], [262, 380], [334, 410], [326, 442], [292, 464], [252, 474]];
const FLOW_C = [[178, -30], [150, -8], [100, 14], [52, 40], [30, 72], [44, 104], [100, 126], [196, 142], [286, 160], [336, 186], [348, 204], [340, 220], [322, 222], [314, 208], [328, 196], [342, 214], [312, 236], [214, 252], [120, 268], [44, 290], [18, 312], [26, 330], [44, 334], [52, 318], [36, 308], [20, 326], [60, 352], [160, 366], [262, 382], [334, 410], [318, 440], [258, 452], [204, 458]];

function geom(flow, curl) {
  const S = segs(flow), C = segs(curl);
  return { S, C, d: dOf(S), dc: dOf(C), pts: sample(S), cpts: sample(C, 30) };
}

const HEART = 'M0 7.2 C-1.6 5.6 -9.6 0.6 -9.6 -4.6 C-9.6 -7.8 -7.2 -10 -4.6 -10 C-2.6 -10 -0.9 -8.8 0 -7 C0.9 -8.8 2.6 -10 4.6 -10 C7.2 -10 9.6 -7.8 9.6 -4.6 C9.6 0.6 1.6 5.6 0 7.2 Z';

function page(v) {
  const { p, name, g, mode, css = '', tm = '' } = v;
  const items = ROWS.map((y, i) => {
    const s = SIDE[i], [t, e] = ITEMS[i];
    return `      <li class="it ${s}" style="${s === 'r' ? 'right' : 'left'}:${f((s === 'r' ? 360 - ITEM_X.r : ITEM_X.l) / 3.6)}%;top:${f(y / H * 100)}%"><p class="tm${tm}">${t}</p><p class="ev">${e}</p></li>`;
  }).join('\n');
  // линия: «stroke» — ровная тонкая линия + завиток-лента; «nib» — вся линия пером переменной ширины
  const body = mode === 'nib'
    ? `      <defs><mask id="${p}-m" maskUnits="userSpaceOnUse" x="-20" y="-60" width="400" height="${H + 80}"><path class="mk" d="${g.d}"/></mask></defs>
      <path class="trk" d="${g.d}"/>
      <path class="ink lt" d="${ribbon(sample(g.S, 12), nib(.55, 2.1))}"/>
      <path class="ink dk" mask="url(#${p}-m)" d="${ribbon(sample(g.S, 12), nib(.55, 2.1))}"/>
      <path class="crl" d="${ribbon(g.cpts, nib(.5, 2, -0.75))}"/>`
    : `      <path class="trk" d="${g.d}"/>
      <path class="done"/>
      <path class="crl" d="${ribbon(g.cpts, (t) => .4 + 1.9 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - t * .7))}"/>`;
  return `<!-- ТАЙМИНГ · ${name} -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..600&subset=cyrillic&display=swap">
<script>document.documentElement.classList.add('${p}-js')</script>
<style>
${HOG}
/* обёртка: даёт блоку «задержаться» на экране, пока сердечко проходит путь (высоту добавляет скрипт) */
.${p}-pin{position:relative;background:#F6F1EA}
.${p}{--bg:#F6F1EA;--choc:#2E221C;--ink:#4A3A31;--latte:#8C7566;--line:#D5C5B6;--ease:cubic-bezier(.22,.68,.18,1);
--script:'Hogarth Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;
position:relative;background:var(--bg);color:var(--choc);font-family:var(--serif);font-weight:400;font-size:15px;line-height:1.4;
max-width:520px;margin:0 auto;padding:28px 18px 30px;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p}-pin.pin .${p}{position:-webkit-sticky;position:sticky;bottom:0}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,ol,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.1;background-size:200px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
/* заголовок: рукописный, по левому краю */
.${p} .ttl{position:relative;z-index:2;display:inline-block;padding:.32em .3em .22em;margin:-.32em 0 -.22em -.3em;font-family:var(--script);font-weight:400;line-height:1;color:var(--choc);font-size:clamp(50px,15.5vw,72px);white-space:nowrap}
/* сцена ограничена и по высоте экрана — к концу весь блок помещается на один экран */
.${p} .stage{position:relative;width:min(100%,calc((100vh - 160px) * ${f(360 / H)}));width:min(100%,calc((100svh - 160px) * ${f(360 / H)}));margin:6px auto 0;container-type:inline-size}
.${p} svg{display:block;width:100%;height:auto;overflow:visible}
.${p} .trk{fill:none;stroke:var(--line);stroke-width:1.2;stroke-linecap:round}
.${p} .done{fill:none;stroke:var(--choc);stroke-width:1.2;stroke-linecap:round}
.${p} .crl{fill:var(--line);transition:fill 1.2s var(--ease)}
.${p}.fin .crl{fill:var(--choc)}
.${p} .hrt path{fill:var(--choc);stroke:var(--bg);stroke-width:3;paint-order:stroke;stroke-linejoin:round}
.${p} .hrt g{animation:${p}b 2.8s ease-in-out infinite;transform-origin:0 -1.5px}
@keyframes ${p}b{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
/* пункты: время крупно, событие капителью — как в референсе */
.${p} .it{position:absolute;transform:translateY(-50%);white-space:nowrap;transition:opacity .9s var(--ease)}
.${p} .it.r{text-align:right}
.${p} .tm{font-size:30px;font-size:8.6cqw;line-height:1;font-weight:400;font-variant-numeric:lining-nums tabular-nums;letter-spacing:.02em;color:var(--choc)}
.${p} .ev{margin-top:8px;font-size:12px;font-size:max(10.5px,3.5cqw);letter-spacing:.14em;text-transform:uppercase;font-weight:500;color:var(--ink)}
.${p}-js .${p}.armed .it:not(.on){opacity:.3}
${css}
.${p}-js .${p} .ttl{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;transition:-webkit-mask-position 1.8s cubic-bezier(.45,.05,.3,1) .2s,mask-position 1.8s cubic-bezier(.45,.05,.3,1) .2s}
.${p}-js .${p}.${p}-on .ttl{-webkit-mask-position:0 0;mask-position:0 0}
@media (prefers-reduced-motion:reduce){.${p} *{animation:none!important;transition-duration:.01s!important}}
</style>
<div class="${p}-pin"><div class="sp"></div>
<section class="${p}" aria-label="Тайминг">
  <h2 class="ttl">Тайминг</h2>
  <div class="stage">
    <svg viewBox="0 0 360 ${H}" aria-hidden="true">
${body}
      <g class="hrt"><g><path d="${HEART}"/></g></g>
    </svg>
    <ol class="list">
${items}
    </ol>
  </div>
</section>
</div>
<script>(function(){var d=document;
function init(w){if(w.__tf)return;w.__tf=1;var s=w.querySelector('.${p}'),sp=w.querySelector('.sp'),trk=s.querySelector('.trk'),done=s.querySelector('.done')||s.querySelector('.mk'),h=s.querySelector('.hrt'),its=s.querySelectorAll('.it');
if(!trk.getTotalLength)return;var T=trk.getTotalLength(),N=400,pts=[],i;for(i=0;i<=N;i++){var q=trk.getPointAtLength(T*i/N);pts.push([q.x,q.y,T*i/N])}
function near(x,y){var b=0,bd=1e9;for(var j=0;j<pts.length;j++){var dx=pts[j][0]-x,dy=pts[j][1]-y,dd=dx*dx+dy*dy;if(dd<bd){bd=dd;b=pts[j][2]}}return b}
var A=${JSON.stringify(v.anchors)},at=A.map(function(a){return near(a[0],a[1])}),END=T-1,START=4;
if(done.classList.contains('done'))done.setAttribute('d',trk.getAttribute('d'));done.style.strokeDasharray=T+' '+T;s.classList.add('armed');
/* задержка: обёртка выше блока на 60% его высоты — блок стоит на экране целиком, пока сердечко едет */
var sticky=window.CSS&&CSS.supports&&(CSS.supports('position','sticky')||CSS.supports('position','-webkit-sticky')),rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,X=0;
function size(){var hh=s.offsetHeight;X=sticky&&!rm?Math.round(hh*.6):0;w.classList.toggle('pin',X>0);sp.style.height=X+'px'}
function place(L){var q=trk.getPointAtLength(L);h.setAttribute('transform','translate('+q.x.toFixed(2)+' '+q.y.toFixed(2)+')');done.style.strokeDashoffset=(T-L).toFixed(2);
for(var k=0;k<its.length;k++)its[k].classList.toggle('on',L>=at[k]-12);s.classList.toggle('fin',L>=END-2)}
function target(){var r=w.getBoundingClientRect(),vh=window.innerHeight||d.documentElement.clientHeight,hh=s.offsetHeight,m=.15*Math.min(hh,vh),p=(vh-r.top-m)/Math.max(1,r.height-m);p=Math.max(0,Math.min(1,p));return START+(END-START)*p}
var cur=-1,raf=0;
function tick(){raf=0;var t=target();if(cur<0||rm)cur=t;else cur+=(t-cur)*.09;place(cur);if(Math.abs(t-cur)>.2)raf=requestAnimationFrame(tick)}
function on(){if(!raf)raf=requestAnimationFrame(tick)}
size();addEventListener('scroll',on,{passive:true});addEventListener('resize',function(){size();on()});if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){size();on()});on()}
function go(){var els=d.querySelectorAll('.${p}-pin');els.forEach(init);var ss=d.querySelectorAll('.${p}:not(.${p}-o)');
if(!('IntersectionObserver' in window)){ss.forEach(function(e){e.classList.add('${p}-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('${p}-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.15});
ss.forEach(function(e){e.classList.add('${p}-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>
`;
}

const ANCH = [[30, 84], [334, 186], [30, 298], [336, 410]];
const ANCH_C = [[28, 72], [334, 186], [30, 298], [336, 410]];
const FLOW_C3 = [[178, -30], [150, -8], [100, 14], [52, 40], [28, 72], [44, 104], [100, 126], [196, 142], [286, 160], [334, 186], [330, 214], [270, 234], [170, 250], [78, 268], [30, 298], [38, 330], [104, 350], [204, 366], [300, 384], [336, 410], [326, 442], [292, 464], [252, 474]];
const gA = geom(FLOW_A, CURL_A), gC = geom(FLOW_C3, CURL_A);
const V = [
  { file: '01-line', p: 'tf1', name: 'Линия как в референсе', g: gA, anchors: ANCH, mode: 'stroke' },
  { file: '02-pen', p: 'tf2', name: 'Линия пером, время рукописным', g: gA, anchors: ANCH, mode: 'nib', tm: ' scr', css: `
.tf2 .trk{stroke:none}
.tf2 .ink.lt{fill:var(--line)}
.tf2 .ink.dk{fill:var(--choc)}
.tf2 .mk{fill:none;stroke:#fff;stroke-width:12;stroke-linecap:round}
.tf2 .tm.scr{font-family:var(--script);font-size:42px;font-size:12cqw;letter-spacing:0;padding:.25em .2em .08em;margin:-.25em -.2em -.08em}
.tf2 .ev{margin-top:3px}` },
  { file: '03-from-title', p: 'tf3', name: 'Линия продолжает заголовок', g: gC, anchors: ANCH_C, mode: 'stroke', css: `
.tf3 .ttl{margin-bottom:-.05em}
.tf3 .ev{font-weight:400;letter-spacing:.06em;text-transform:none;font-size:15px;font-size:max(13px,4.3cqw)}` },
];

const dir = new URL('tilda/timing-flow/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const v of V) {
  const s = page(v);
  fs.writeFileSync(new URL(v.file + '.html', dir), s);
  console.log(v.file.padEnd(10), (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB');
}
