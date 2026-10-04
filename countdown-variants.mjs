// Блок «До дня свадьбы» (обратный отсчёт) — 4 варианта для Тильды. Запуск: node countdown-variants.mjs → tilda/countdown/
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const FONT_SHA = '5b262026dec5461ae613b800d9f57ca265cc2c3d';
const MAIN_SHA = '076d0ea8abd7db458bdebeb63300c70b9fd89215';
const TARGET = '2027-07-23T15:00:00+03:00';   // начало: 23.07.2027, 15:00 по Москве

const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..600&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Bikham Cyr Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${FONT_SHA}/assets/fonts/BikhamCyrScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/bikhamcyrscript.ttf') format('truetype');}
</style>`;

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Общая основа. dark=true — тёмная версия (шоколад + айвори)
const base = (p, dark) => `
.${p}{--sand:#E8DDD0;--ivory:#F6F1EA;--choc:#3E2F27;--latte:#9C806C;--latte-l:#C4AE9A;
--fg:${dark ? 'var(--ivory)' : 'var(--choc)'};--sub:${dark ? 'var(--latte-l)' : 'var(--latte)'};--line:${dark ? 'rgba(246,241,234,.22)' : 'rgba(62,47,39,.2)'};
--script:'Bikham Cyr Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--sand);color:var(--fg);font-family:var(--serif);font-weight:500;font-size:17px;line-height:1.6;
max-width:520px;margin:0 auto;overflow:hidden;box-sizing:border-box;text-align:center;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} :where(p,h2){margin:0;font-weight:inherit}
.${p}::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;opacity:${dark ? '.16' : '.1'};background-size:200px;background-image:${NOISE}}
.${p} h2{font-family:var(--script);font-weight:400;line-height:1.08;color:var(--fg)}
.${p} h2 span{display:inline-block;padding:.22em .45em .26em;margin:-.22em -.45em -.26em}
.${p} h2 span+br+span{margin-top:-.5em}
.${p} .units{display:grid;grid-template-columns:1.3fr auto 1fr auto 1fr auto 1fr;align-items:start;max-width:380px;margin-left:auto;margin-right:auto;font-variant-numeric:lining-nums tabular-nums}
.${p} .u{display:flex;flex-direction:column;align-items:center}
.${p} .n{font-weight:400;line-height:1;letter-spacing:.01em}
.${p} .l{margin-top:12px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;font-weight:500;color:var(--sub);white-space:nowrap}
.${p} .c{font-weight:400;line-height:1;opacity:.55;padding:0 .08em;transform:translateY(-.04em)}
.${p} .done{display:none;font-family:var(--script);font-weight:400;line-height:1.1}
.${p}.cd-done .units,.${p}.cd-done h2,.${p}.cd-done .hide-done{display:none}
.${p}.cd-done .done{display:block}
.cd-js .${p} .fade{opacity:0;transform:translateY(14px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.cd-js .${p}.cd-on .fade{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.cd-js .${p} .fade{transform:none;transition:opacity .6s linear}}`;

// Таймер + появление при скролле (безопасно вставлять несколько раз)
const SCRIPT = `<script>(function(){var d=document,T=Date.parse('${TARGET}');d.documentElement.classList.add('cd-js');
var F={d:['день','дня','дней'],h:['час','часа','часов'],m:['минута','минуты','минут'],s:['секунда','секунды','секунд']};
function pl(n,f){var a=n%10,b=n%100;return a==1&&b!=11?f[0]:a>=2&&a<=4&&(b<10||b>=20)?f[1]:f[2]}
function pad(n){return(n<10?'0':'')+n}
function run(r){if(r.__cd)return;r.__cd=1;var q=function(s){return r.querySelector(s)};
var t=setInterval(tick,1000);tick();
function tick(){var x=T-Date.now();if(x<=0){r.classList.add('cd-done');clearInterval(t);return}
var v={d:Math.floor(x/864e5),h:Math.floor(x/36e5)%24,m:Math.floor(x/6e4)%60,s:Math.floor(x/1e3)%60};
for(var k in v){var n=q('[data-n='+k+']'),u=q('[data-u='+k+']'),s=k=='d'?String(v[k]):pad(v[k]);if(n&&n.textContent!==s)n.textContent=s;if(u)u.textContent=pl(v[k],F[k])}}}
function seam(r){var h=r.querySelector('h2'),s=h&&h.querySelectorAll('span')[1];if(!s)return;
var pt=parseFloat(getComputedStyle(s).paddingTop)||0,pb=parseFloat(getComputedStyle(s).paddingBottom)||0,y=Math.round(s.offsetTop+pt+(s.offsetHeight-pt-pb)*.66);
r.style.setProperty('--seam',y+'px');s.style.setProperty('--stop',(y-s.offsetTop)+'px')}
function seams(){d.querySelectorAll('[data-seam]').forEach(seam)}
function go(){var els=d.querySelectorAll('[data-cd]');els.forEach(run);seams();if(d.fonts){d.fonts.ready.then(seams);d.fonts.addEventListener&&d.fonts.addEventListener('loadingdone',seams)}window.addEventListener('resize',seams);setTimeout(seams,1200);setTimeout(seams,3000);
if(window.ResizeObserver)d.querySelectorAll('[data-seam] h2').forEach(function(h){new ResizeObserver(seams).observe(h)});
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('cd-on')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('cd-on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.25});
els.forEach(function(e){if(!e.classList.contains('cd-on'))io.observe(e)})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go()})();</script>`;

const TITLE = `<h2 class="fade" aria-label="До нашего дня осталось"><span aria-hidden="true">До нашего дня</span><br><span aria-hidden="true">осталось</span></h2>`;
const DONE = `<p class="done">Этот день настал!</p>`;

// Строка «000:00:00:00» с подписями, как в референсе
const ROW = `<div class="units fade" style="--d:.15s" role="timer" aria-live="off">
    <div class="u"><span class="n" data-n="d">000</span><span class="l" data-u="d">дней</span></div><span class="c" aria-hidden="true">:</span>
    <div class="u"><span class="n" data-n="h">00</span><span class="l" data-u="h">часов</span></div><span class="c" aria-hidden="true">:</span>
    <div class="u"><span class="n" data-n="m">00</span><span class="l" data-u="m">минут</span></div><span class="c" aria-hidden="true">:</span>
    <div class="u"><span class="n" data-n="s">00</span><span class="l" data-u="s">секунд</span></div>
  </div>`;

const V = [];

/* ---------- 1. Тот же песочный фон, как в референсе.
   Переход: блок продолжает календарь, отделён «паузой» — коротким штрихом и ромбом ---------- */
V.push(['01-sand-reference', 'Песочный фон · как в референсе', `
<style>${base('cd1', false)}
.cd1{padding:20px 22px 96px}
.cd1 .pause{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:62px}
.cd1 .pause::before,.cd1 .pause::after{content:'';width:34px;height:1px;background:var(--line)}
.cd1 .pause i{width:5px;height:5px;transform:rotate(45deg);box-shadow:inset 0 0 0 1px var(--latte)}
.cd1 h2{font-size:clamp(46px,13.5vw,58px)}
.cd1 .units{margin-top:30px}
.cd1 .n,.cd1 .c{font-size:clamp(40px,11.6vw,54px)}
.cd1 .done{font-size:clamp(50px,15vw,64px)}
</style>
<section class="cd1" data-cd aria-label="До дня свадьбы">
  <div class="pause fade" aria-hidden="true"><i></i></div>
  ${TITLE}
  ${ROW}
  ${DONE}
</section>`]);

/* ---------- 2. Тёмный: шоколадный купол поднимается из песочного ---------- */
V.push(['02-dark-dome', 'Шоколад · купол', `
<style>${base('cd2', true)}
.cd2{padding-top:18px}
.cd2 .dome{position:relative;background:var(--choc);border-radius:50% 50% 0 0/76px 76px 0 0;padding:96px 22px 104px}
.cd2 .dome::before{content:'';position:absolute;left:14px;right:14px;top:14px;height:150px;border-radius:50% 50% 0 0/66px 66px 0 0;
  box-shadow:inset 0 1px 0 0 rgba(246,241,234,.22);pointer-events:none;-webkit-mask:linear-gradient(#000 30%,transparent);mask:linear-gradient(#000 30%,transparent)}
.cd2 .dome::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 60% at 50% 0%,rgba(246,241,234,.07),transparent 60%)}
.cd2 h2{font-size:clamp(46px,13.5vw,58px)}
.cd2 .units{margin-top:32px}
.cd2 .n,.cd2 .c{font-size:clamp(42px,12vw,56px)}
.cd2 .done{font-size:clamp(50px,15vw,64px)}
.cd2 .mark{margin-top:40px;font-size:11px;letter-spacing:.32em;color:var(--sub)}
</style>
<section class="cd2" data-cd aria-label="До дня свадьбы">
  <div class="dome">
    ${TITLE}
    ${ROW}
    ${DONE}
    <p class="mark fade hide-done" style="--d:.3s" aria-hidden="true">23 · 07 · 2027</p>
  </div>
</section>`]);

/* ---------- 3. Песочный, акцент на днях: крупное число дней, ниже часы-минуты-секунды.
   Переход: тонкая нить спускается от календаря ---------- */
V.push(['03-sand-days', 'Песочный фон · акцент на днях', `
<style>${base('cd3', false)}
.cd3{padding:96px 24px 96px}
.cd3 .thread{position:absolute;left:50%;top:0;width:1px;height:62px;background:linear-gradient(rgba(62,47,39,.1),rgba(62,47,39,.4));transform-origin:top}
.cd3 .thread::after{content:'';position:absolute;left:-2.5px;bottom:-3px;width:6px;height:6px;border-radius:50%;background:var(--choc);opacity:.7}
.cd-js .cd3 .thread{transform:scaleY(0);transition:transform 1.2s var(--ease)}
.cd-js .cd3.cd-on .thread{transform:none}
.cd3 h2{font-size:clamp(44px,13vw,56px)}
.cd3 .big{margin-top:26px}
.cd3 .big .n{display:block;font-size:clamp(92px,28vw,120px);letter-spacing:-.01em}
.cd3 .big .l{display:block;margin-top:6px;font-size:12px}
.cd3 .units{display:flex;margin-top:26px;padding-top:22px;border-top:1px solid var(--line);max-width:none}
.cd3 .units .u{flex:1}
.cd3 .units .u+.u{border-left:1px solid var(--line)}
.cd3 .units .n{font-size:clamp(30px,9vw,38px)}
.cd3 .done{font-size:clamp(50px,15vw,64px)}
.cd3.cd-done .big{display:none}
</style>
<section class="cd3" data-cd aria-label="До дня свадьбы">
  <span class="thread" aria-hidden="true"></span>
  ${TITLE}
  <div class="big fade hide-done" style="--d:.1s"><span class="n" data-n="d">000</span><span class="l" data-u="d">дней</span></div>
  <div class="units fade" style="--d:.2s" role="timer" aria-live="off">
    <div class="u"><span class="n" data-n="h">00</span><span class="l" data-u="h">часов</span></div>
    <div class="u"><span class="n" data-n="m">00</span><span class="l" data-u="m">минут</span></div>
    <div class="u"><span class="n" data-n="s">00</span><span class="l" data-u="s">секунд</span></div>
  </div>
  ${DONE}
</section>`]);

/* ---------- 4. Шоколад: заголовок стоит на стыке — верх шоколадный на песке, низ айвори на шоколаде ---------- */
V.push(['04-dark-seam', 'Шоколад · заголовок на стыке', `
<style>${base('cd4', true)}
.cd4{--seam:140px;background:linear-gradient(180deg,var(--sand) 0 var(--seam),var(--choc) var(--seam));padding:58px 22px 104px}
.cd4 h2{font-size:50px;line-height:1.1;color:var(--choc)}
.cd4 h2 span+br+span{margin-top:-.5em;position:relative;color:var(--ivory)}
.cd4 h2 span+br+span::before{content:attr(data-t);position:absolute;inset:0;padding:inherit;color:var(--choc);
  -webkit-clip-path:inset(0 0 calc(100% - var(--stop,46px)) 0);clip-path:inset(0 0 calc(100% - var(--stop,46px)) 0)}
.cd4 .units{display:flex;justify-content:center;margin-top:36px}
.cd4 .units .u{flex:1;max-width:96px}
.cd4 .units .u+.u{border-left:1px solid var(--line)}
.cd4 .c{display:none}
.cd4 .n{font-size:clamp(36px,10.5vw,46px)}
.cd4 .done{font-size:clamp(50px,15vw,64px);color:var(--ivory)}
.cd4.cd-done{background:linear-gradient(180deg,var(--sand) 0 40px,var(--choc) 40px)}
.cd4 .mark{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:40px;font-size:11px;letter-spacing:.32em;color:var(--sub)}
.cd4 .mark::before,.cd4 .mark::after{content:'';width:26px;height:1px;background:var(--line)}
@media (max-width:359px){.cd4 h2{font-size:44px}}
</style>
<section class="cd4" data-cd data-seam aria-label="До дня свадьбы">
  ${TITLE.replace('<span aria-hidden="true">осталось', '<span aria-hidden="true" data-t="осталось">осталось')}
  ${ROW}
  ${DONE}
  <p class="mark fade hide-done" style="--d:.3s" aria-hidden="true">23 · 07 · 2027</p>
</section>`]);

const dir = new URL('tilda/countdown/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, html] of V) {
  const code = `<!-- ДО ДНЯ СВАДЬБЫ · ${name} -->\n${FONTS}\n${html.trim()}\n${SCRIPT}\n`;
  fs.writeFileSync(new URL(file + '.html', dir), code);
  console.log(file.padEnd(20), (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
}
