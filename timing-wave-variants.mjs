// Тайминг: волнистая линия огибает пункты (по разным краям), по ней при прокрутке едет сердечко.
// 4 варианта → tilda/timing-wave/0N-*.html. Запуск: node timing-wave-variants.mjs
import fs from 'node:fs';

const HOG = `@font-face{font-family:'Hogarth Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@4140bb56dd6b6bb40a7439003be591b2e9dc7901/assets/fonts/HogarthScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/qaishabdulaziz-beep/Wedding/4140bb56dd6b6bb40a7439003be591b2e9dc7901/assets/fonts/HogarthScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@f86f97a5e97c0ca45d085be24ed0e5c6193f24e0/Hogarth%20script.ttf') format('truetype');}`;

const ITEMS = [['16:30', 'Сбор гостей'], ['17:00', 'Выездная церемония'], ['18:00', 'Начало банкета'], ['23:00', 'Завершение вечера']];

/* ---------- геометрия: гладкая кривая через точки (Catmull-Rom → кубические Безье) ---------- */
const f = (n) => +n.toFixed(1);
function smooth(P, t = 1) {
  let d = `M${f(P[0][0])} ${f(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * t, p1[1] + (p2[1] - p0[1]) / 6 * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * t, p2[1] - (p3[1] - p1[1]) / 6 * t];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}
const arc = (cx, cy, r, a0, a1, n = 6, ry = r) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + ry * Math.sin(a)]; });
/* волнистый горизонтальный пробег: от x0 до x1 на высоте y, мягкая волна амплитуды a */
const run = (x0, x1, y, a, waves = 1.5) => { const n = 6, out = []; for (let i = 1; i < n; i++) { const t = i / n; out.push([x0 + (x1 - x0) * t, y + a * Math.sin(t * Math.PI * waves * 2)]); } return out; };
/* завиток в конце линии: по часовой, сужаясь */
const curl = (cx, cy, r, a0, turns = 1.15, dir = 1) => { const n = 14, out = []; for (let i = 1; i <= n; i++) { const t = i / n, a = (a0 + dir * 360 * turns * t) * Math.PI / 180, rr = r * (1 - .55 * t); out.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); } return out; };

/* 1 · Серпантин: горизонтальные волны, полукруглые повороты обнимают текст с внешней стороны */
function serp() {
  const W = 360, R = 50, xl = 62, xr = 298, y0 = 26, step = 2 * R;
  const P = [[18, y0 + 4], [30, y0]];
  let y = y0;
  for (let k = 0; k < 4; k++) {
    const right = k % 2 === 0, from = right ? (k ? xl : 30) : xr, to = right ? xr : xl;
    P.push(...run(from, to, y, 5, 1), [to, y]);
    P.push(...arc(right ? xr : xl, y + R, R, right ? -90 : 270, right ? 90 : 90, 8).slice(1));
    y += step;
  }
  // последний пробег к завитку
  const stopX = 236;
  P.push(...run(xl, stopX, y, 4, .5), [stopX, y]);
  const cx = stopX + 30, cy = y - 22;
  P.push([stopX + 20, y - 1], ...curl(cx, cy, 24, 90, 1.15, -1));
  return { W, H: y + 20, d: smooth(P), anchors: [0, 1, 2, 3].map((k) => [k % 2 ? xl - R : xr + R, y0 + R + k * step]),
    stopAt: [stopX, y],
    items: [0, 1, 2, 3].map((k) => ({ side: k % 2 ? 'l' : 'r', x: k % 2 ? xl + 8 : xr - 8, y: y0 + R + k * step })) };
}

/* 2 · Волна: вертикальная синусоида, каждый пункт стоит в «кармане» изгиба */
function wave(loops = false) {
  const W = 360, cx = 180, A = 128, top = 24, q = loops ? 58 : 52; // четверть периода по вертикали
  const P = [[cx + 22, top - 6], [cx, top + 6]];
  const anchors = [], items = [];
  let y = top + 6;
  for (let k = 0; k < 4; k++) {
    const dir = k % 2 === 0 ? -1 : 1; // 0: влево (текст справа), 1: вправо (текст слева)
    const yApex = y + q, yNext = y + 2 * q;
    P.push([cx + dir * A * .72, y + q * .5], [cx + dir * A, yApex]);
    if (!(loops && k < 3)) P.push([cx + dir * A * .72, y + q * 1.5]);
    anchors.push([cx + dir * A, yApex]);
    items.push({ side: dir < 0 ? 'l' : 'r', x: dir < 0 ? cx + dir * A + 30 : cx + dir * A - 30, y: yApex, al: dir < 0 ? 'left' : 'right' });
    if (loops && k < 3) {
      // маленькая петля-«бантик» на пересечении центра
      // петля-трохоида вдоль направления движения (d) с выносом в сторону (n)
      const s = -dir, len = Math.hypot(A, 2 * q), dx = s * A / len, dy = 2 * q / len, nx = -dy * s, ny = dx * s, a = 7.5, b = 16;
      for (let i = 0; i <= 12; i++) { const u = -Math.PI + 2 * Math.PI * i / 12, al = a * u - b * Math.sin(u), off = b * (1 + Math.cos(u)) * .85;
        P.push([cx + dx * al + nx * off, yNext + dy * al + ny * off]); }
    } else P.push([cx, yNext]);
    y = yNext;
  }
  // финал: уходит к центру и закручивается
  const stopY = y + 12;
  P.push([cx - 6, stopY]);
  P.push(...curl(cx + 18, stopY + 14, 22, 200, 1.1, -1));
  return { W, H: stopY + 40, d: smooth(P), anchors, stopAt: [cx - 6, stopY], items };
}

/* 4 · Нить: петли-овалы вокруг каждого пункта, соединённые плавными переходами */
function ovals() {
  const W = 360, rx = 112, ry = 44, gap = 104, top = 30;
  const P = [[16, top + 60], [72, top + 50]];
  const anchors = [], items = [];
  for (let k = 0; k < 4; k++) {
    const right = k % 2 === 0, cx = right ? 232 : 128, cy = top + ry + k * gap;
    // по верху → внешний бок → по низу, оставляя «вход» и «выход» открытыми
    const pts = right ? arc(cx, cy, rx, k ? 240 : 200, 460, 12, ry) : arc(cx, cy, rx, 300, 80, 12, ry);
    P.push(...pts.map(([x, y]) => [x, y]));
    anchors.push([right ? cx + rx : cx - rx, cy]);
    items.push({ side: right ? 'r' : 'l', x: cx + (right ? -6 : 10), y: cy, al: 'center' });
  }
  const last = P[P.length - 1];
  const stopAt = [last[0] + 70, last[1] + 6];
  P.push([last[0] + 40, last[1] + 6], stopAt);
  P.push(...curl(stopAt[0] + 22, stopAt[1] - 20, 21, 95, 1.1, -1));
  return { W, H: top + 3 * gap + 2 * ry + 34, d: smooth(P), anchors, stopAt, items };
}

const HEART = 'M0 7.2 C-1.6 5.6 -9.6 0.6 -9.6 -4.6 C-9.6 -7.8 -7.2 -10 -4.6 -10 C-2.6 -10 -0.9 -8.8 0 -7 C0.9 -8.8 2.6 -10 4.6 -10 C7.2 -10 9.6 -7.8 9.6 -4.6 C9.6 0.6 1.6 5.6 0 7.2 Z';

function block(v) {
  const { p, name, g, css, timeClass = '' } = v;
  const items = g.items.map((it, i) => {
    const [t, e] = ITEMS[i];
    const al = it.al || (it.side === 'r' ? 'right' : 'left');
    const tx = al === 'right' ? '-100%' : al === 'center' ? '-50%' : '0';
    return `      <li class="it ${al}" style="left:${f(it.x / g.W * 100)}%;top:${f(it.y / g.H * 100)}%;--tx:${tx}"><p class="tm${timeClass}">${t}</p><p class="ev">${e}</p></li>`;
  }).join('\n');
  return `<!-- ТАЙМИНГ · ${name} -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..600&subset=cyrillic&display=swap">
<script>document.documentElement.classList.add('${p}-js')</script>
<style>
${HOG}
.${p}{--bg:#F6F1EA;--choc:#2E221C;--ink:#4A3A31;--latte:#8C7566;--line:#CDBBAA;--ease:cubic-bezier(.22,.68,.18,1);
--script:'Hogarth Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;
position:relative;background:var(--bg);color:var(--choc);font-family:var(--serif);font-weight:400;font-size:15px;line-height:1.4;
max-width:520px;margin:0 auto;padding:30px 18px 34px;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2,ol,li){margin:0;padding:0;list-style:none;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.1;background-size:200px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
/* заголовок: рукописный, по левому краю; поля дают место росчеркам при анимации-маске */
.${p} .ttl{display:inline-block;padding:.32em .3em .22em;margin:-.32em 0 -.22em -.3em;font-family:var(--script);font-weight:400;line-height:1;color:var(--choc);font-size:clamp(50px,15.5vw,72px);white-space:nowrap}
/* сцена: ширина ограничена и высотой экрана — к концу прокрутки весь блок помещается на один экран */
.${p} .stage{position:relative;width:min(100%,calc((100vh - 170px) * ${f(g.W / g.H)}));width:min(100%,calc((100svh - 170px) * ${f(g.W / g.H)}));margin:8px auto 0;container-type:inline-size}
.${p} svg{display:block;width:100%;height:auto;overflow:visible}
.${p} .base{fill:none;stroke:var(--line);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.${p} .done{fill:none;stroke:var(--choc);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.${p} .hrt path{fill:var(--choc);stroke:var(--bg);stroke-width:3;paint-order:stroke;stroke-linejoin:round}
.${p} .hrt g{animation:${p}b 2.6s ease-in-out infinite;transform-origin:0 -1.5px}
@keyframes ${p}b{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
/* пункты */
.${p} .it{position:absolute;transform:translate(var(--tx),-50%);white-space:nowrap}
.${p} .it.right{text-align:right}.${p} .it.center{text-align:center}
.${p} .tm{font-size:28px;font-size:8.4cqw;line-height:1;font-weight:400;font-variant-numeric:lining-nums tabular-nums;letter-spacing:.02em;color:var(--choc)}
.${p} .ev{margin-top:7px;font-size:11.5px;font-size:max(10px,3.35cqw);letter-spacing:.16em;text-transform:uppercase;font-weight:600;color:var(--ink)}
.${p} .it{transition:opacity .8s var(--ease),transform .8s var(--ease)}
.${p}-js .${p}.armed .it:not(.on){opacity:.32}
${css}
.${p}-js .${p} .ttl{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;transition:-webkit-mask-position 1.8s cubic-bezier(.45,.05,.3,1) .2s,mask-position 1.8s cubic-bezier(.45,.05,.3,1) .2s}
.${p}-js .${p}.${p}-on .ttl{-webkit-mask-position:0 0;mask-position:0 0}
@media (prefers-reduced-motion:reduce){.${p} *{animation:none!important;transition-duration:.01s!important}}
</style>
<section class="${p}" aria-label="Тайминг">
  <h2 class="ttl">Тайминг</h2>
  <div class="stage">
    <svg viewBox="0 0 ${g.W} ${f(g.H)}" aria-hidden="true">
      <path class="base" d="${g.d}"/>
      <path class="done"/>${v.stops ? '\n      ' + g.anchors.map(([x, y]) => `<g class="stp" transform="translate(${f(x)} ${f(y)})"><circle r="4.2"/></g>`).join('') : ''}
      <g class="hrt"><g><path d="${HEART}"/></g></g>
    </svg>
    <ol class="list">
${items}
    </ol>
  </div>
</section>
<script>(function(){var d=document;
/* сердечко едет по линии вместе с прокруткой: старт — когда видно ~30% блока, финиш — когда блок виден целиком */
function init(s){if(s.__tw)return;s.__tw=1;var base=s.querySelector('.base'),done=s.querySelector('.done'),h=s.querySelector('.hrt'),its=s.querySelectorAll('.it'),st=s.querySelectorAll('.stp');
if(!base.getTotalLength)return;var T=base.getTotalLength(),N=500,pts=[],i;for(i=0;i<=N;i++){var q=base.getPointAtLength(T*i/N);pts.push([q.x,q.y,T*i/N])}
function near(x,y){var b=0,bd=1e9;for(var j=0;j<pts.length;j++){var dx=pts[j][0]-x,dy=pts[j][1]-y,dd=dx*dx+dy*dy;if(dd<bd){bd=dd;b=pts[j][2]}}return b}
var A=${JSON.stringify(g.anchors.map(([x, y]) => [f(x), f(y)]))},S=${JSON.stringify(g.stopAt.map(f))},END=near(S[0],S[1]),START=6,at=A.map(function(a){return near(a[0],a[1])});
done.setAttribute('d',base.getAttribute('d'));done.style.strokeDasharray=T+' '+T;s.classList.add('armed');
var cur=-1,raf=0,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function place(L){var q=base.getPointAtLength(L);h.setAttribute('transform','translate('+q.x.toFixed(2)+' '+q.y.toFixed(2)+')');done.style.strokeDashoffset=(T-L).toFixed(2);
for(var k=0;k<its.length;k++){its[k].classList.toggle('on',L>=at[k]-14);if(st[k])st[k].classList.toggle('on',L>=at[k]-2)}}
function target(){var r=s.getBoundingClientRect(),vh=window.innerHeight||d.documentElement.clientHeight,hh=r.height,m=.3*Math.min(hh,vh),p=(vh-r.top-m)/Math.max(1,hh-m);p=Math.max(0,Math.min(1,p));return START+(END-START)*p}
function tick(){raf=0;var t=target();if(cur<0||rm)cur=t;else cur+=(t-cur)*.14;place(cur);if(Math.abs(t-cur)>.3)raf=requestAnimationFrame(tick)}
function on(){if(!raf)raf=requestAnimationFrame(tick)}
addEventListener('scroll',on,{passive:true});addEventListener('resize',on);on()}
function go(){var els=d.querySelectorAll('.${p}:not(.${p}-o)');els.forEach(init);
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('${p}-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('${p}-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.15});
els.forEach(function(e){e.classList.add('${p}-o');io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>
`;
}

const V = [
  { file: '01-serpentine', p: 'tw1', name: 'Серпантин', g: serp(), css: '' },
  { file: '02-wave', p: 'tw2', name: 'Волна, время рукописным', g: wave(false), timeClass: ' scr', css: `
.tw2 .tm.scr{font-family:var(--script);font-size:40px;font-size:11.5cqw;letter-spacing:0;padding:.25em .2em .1em;margin:-.25em -.2em -.1em}
.tw2 .ev{margin-top:4px}` },
  { file: '03-stops', p: 'tw3', name: 'Пунктир с остановками', g: wave(false), stops: true, css: `
.tw3 .base{stroke-dasharray:.1 4.4;stroke-width:1.7}
.tw3 .stp circle{fill:var(--bg);stroke:var(--choc);stroke-width:1.2;transition:fill .6s var(--ease)}
.tw3 .stp.on circle{fill:var(--choc)}` },
  { file: '04-ovals', p: 'tw4', name: 'Нить вокруг пунктов', g: ovals(), css: `
.tw4 .ev{font-size:10.5px;font-size:max(9px,3.05cqw);letter-spacing:.14em}` },
];

const dir = new URL('tilda/timing-wave/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const v of V) {
  const s = block(v);
  fs.writeFileSync(new URL(v.file + '.html', dir), s);
  console.log(v.file.padEnd(16), (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB', 'viewBox', v.g.W, f(v.g.H));
}
