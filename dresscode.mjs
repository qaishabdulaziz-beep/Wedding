// Блок «Дресс-код» с интерактивной палитрой тканей. Запуск: node dresscode.mjs → tilda/dresscode.html
import fs from 'node:fs';

const REPO = 'qaishabdulaziz-beep/Wedding';
const ASTRUM_SHA = '4a83daeb45bb08fd036182115602a4c42002242b';
const MAIN_SHA = '90b234a93fec945ba023e442202273e508899c9c';
const TEX_SHA = '9e3d871b9efe03944f58969ddd13923ae119c089';
const tex = (n) => `https://cdn.jsdelivr.net/gh/${REPO}@${TEX_SHA}/assets/dresscode/${n}.jpg`;
const u = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

// ВРЕМЕННЫЕ фото — замените на свои: main — фото справа от текста, looks — три образа
const COLORS = [
  { id: 'mokko', n: 'Мокко', tex: tex('mokko'),
    d: 'Тёплый оттенок кофе с молоком: мягкий, глубокий и очень благородный.',
    her: 'платье-комбинация из матового шёлка, лёгкий трикотаж, замшевые акценты',
    him: 'брюки или пиджак в кофейной гамме, льняная рубашка в тон',
    fab: 'матовый шёлк, сатин, тонкая замша', jew: 'золото, жемчуг, янтарь', mix: [4, 2],
    main: u('photo-1515372039744-b8f02a3ae446'),
    looks: [u('photo-1496747611176-843222e1e57c', 500), u('photo-1507679799987-c73779587ccf', 500), u('photo-1539109136881-3be0616acf4b', 500)] },
  { id: 'oliva', n: 'Олива', tex: tex('oliva'),
    d: 'Глубокий оттенок летней листвы, спокойный и естественный.',
    her: 'струящееся платье в пол, атласная юбка, костюм с широкими брюками',
    him: 'льняной костюм оливкового цвета или галстук и платок в тон',
    fab: 'лён, сатин, шифон', jew: 'золото, кожаные аксессуары коньячного оттенка', mix: [3, 4],
    main: u('photo-1485968579580-b6d095142e6e'),
    looks: [u('photo-1529139574466-a303027c1d8b', 500), u('photo-1593030761757-71fae45fa0e7', 500), u('photo-1490481651871-ab68de25d43d', 500)] },
  { id: 'shalfey', n: 'Шалфей', tex: tex('shalfey'),
    d: 'Нежный серо-зелёный, лёгкий и воздушный, как летнее утро.',
    her: 'шифоновое или шёлковое платье миди, лёгкие многослойные ткани',
    him: 'рубашка цвета шалфея, светлые брюки',
    fab: 'шифон, шёлк, органза', jew: 'серебро, жемчуг', mix: [0, 3],
    main: u('photo-1496747611176-843222e1e57c'),
    looks: [u('photo-1515372039744-b8f02a3ae446', 500), u('photo-1617137968427-85924c800a22', 500), u('photo-1485968579580-b6d095142e6e', 500)] },
  { id: 'bezhevo-seryy', n: 'Бежево-серый', tex: tex('bezhevo-seryy'),
    d: 'Мягкий тёплый нейтральный оттенок, который делает образ спокойным и элегантным.',
    her: 'платье-рубашка, костюм-тройка, лёгкий трикотаж',
    him: 'костюм песочного оттенка, рубашка без галстука',
    fab: 'лён, хлопок, тонкая шерсть', jew: 'золото, перламутр', mix: [1, 0],
    main: u('photo-1539109136881-3be0616acf4b'),
    looks: [u('photo-1490481651871-ab68de25d43d', 500), u('photo-1507679799987-c73779587ccf', 500), u('photo-1529139574466-a303027c1d8b', 500)] },
  { id: 'slivochnyy', n: 'Сливочный', tex: tex('slivochnyy'),
    d: 'Тёплый сливочно-жёлтый, как мягкий солнечный свет.',
    her: 'атласное или шёлковое платье, юбка с блеском шёлка',
    him: 'рубашка или платок в кармане в сливочном оттенке',
    fab: 'шёлк, атлас, сатин', jew: 'золото, жемчуг', mix: [1, 0],
    main: u('photo-1529139574466-a303027c1d8b'),
    looks: [u('photo-1485968579580-b6d095142e6e', 500), u('photo-1593030761757-71fae45fa0e7', 500), u('photo-1496747611176-843222e1e57c', 500)] },
];
const GUESTS = u('photo-1519225421980-715cb0215aed'); // стартовое фото с гостями

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .24 0 0 0 0 .18 0 0 0 0 .15 0 0 0 1.6 -.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const DATA = JSON.stringify(COLORS.map(({ id, ...c }) => c), null, 0)
  .replace(/\},\{/g, '},\n{');

const code = `<!-- ДРЕСС-КОД · палитра с образами -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400..700&subset=cyrillic&display=swap">
<style>
@font-face{font-family:'Astrum Script';font-weight:400;font-style:normal;font-display:swap;
src:url('https://cdn.jsdelivr.net/gh/${REPO}@${ASTRUM_SHA}/assets/fonts/AstrumScript.woff2') format('woff2'),
url('https://rawcdn.githack.com/${REPO}/${ASTRUM_SHA}/assets/fonts/AstrumScript.woff2') format('woff2'),
url('https://cdn.jsdelivr.net/gh/${REPO}@${MAIN_SHA}/AstrumScriptCyrillicRegular%202.ttf') format('truetype');}
</style>
<script>document.documentElement.classList.add('dc-js')</script>
<style>
.dc{--ivory:#F6F1EA;--sand:#E8DDD0;--choc:#2E221C;--ink:#4A3A31;--latte:#8C7566;--line:rgba(46,34,28,.16);
--script:'Astrum Script','Snell Roundhand',cursive;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(.22,.68,.18,1);
position:relative;background:var(--ivory);color:var(--choc);font-family:var(--serif);font-weight:400;font-size:14px;line-height:1.55;
max-width:520px;margin:0 auto;padding:44px 20px 60px;overflow:hidden;box-sizing:border-box;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.dc *,.dc *::before,.dc *::after{box-sizing:border-box}
.dc :where(p,h2,h3,dl,dt,dd,ul,li,figure){margin:0;padding:0;list-style:none;font-weight:inherit}
.dc button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.dc::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:9;opacity:.1;background-size:200px;background-image:${NOISE}}
/* заголовок: поля дают место росчеркам, маска-«письмо» их не режет */
.dc .ttl{display:inline-block;margin:0 0 0 calc(-.3em + 2px);padding:.42em .3em .22em;font-family:var(--script);font-weight:400;color:var(--choc);
  font-size:clamp(58px,17.5vw,80px);line-height:1;letter-spacing:-.01em;white-space:nowrap}
.dc .intro{margin-top:4px;display:grid;grid-template-columns:minmax(0,1fr) 45%;gap:16px;align-items:center}
.dc .txt p{font-size:13.5px;line-height:1.6;color:var(--ink)}
.dc .note{margin-top:16px;padding-top:14px;border-top:1px solid var(--line);font-size:13.5px;line-height:1.6;color:var(--choc);font-weight:500}
.dc .hero{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--sand) center/cover}
.dc .hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .9s var(--ease),transform 1.6s var(--ease)}
.dc .hero img.off{opacity:0;transform:scale(1.06)}
/* ткани */
.dc .sw{margin-top:30px;display:flex;justify-content:space-between;align-items:center;padding:8px 6px}
.dc .sw button{position:relative;width:clamp(46px,13.6vw,62px);aspect-ratio:1;border-radius:50%;background:center/cover;
  box-shadow:0 0 0 1px rgba(46,34,28,.12),0 6px 14px -8px rgba(46,34,28,.55);transition:transform .55s var(--ease),box-shadow .55s var(--ease)}
.dc .sw button::after{content:'';position:absolute;inset:-6px;border-radius:50%;border:1px solid var(--choc);opacity:0;transform:scale(.85);transition:opacity .5s,transform .55s var(--ease)}
.dc .sw button.on{transform:scale(1.2)}
.dc .sw button.on::after{opacity:.7;transform:none}
.dc .sw button:focus-visible{outline:1px dashed var(--latte);outline-offset:8px}
.dc .hint{margin-top:16px;font-size:12px;line-height:1.5;color:var(--latte);text-align:center}
.dc .hint b{font-weight:600;letter-spacing:.14em;text-transform:uppercase;font-size:10.5px;color:var(--ink);margin-right:4px}
/* образы: раскрываются после первого выбора */
.dc .look{display:grid;grid-template-rows:0fr;transition:grid-template-rows .9s var(--ease)}
.dc .look.open{grid-template-rows:1fr}
.dc .look>div{overflow:hidden;min-height:0}
.dc .trio{margin-top:30px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.dc .trio figure{position:relative;aspect-ratio:2/3;overflow:hidden;background:var(--sand) center/cover}
.dc .trio img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.dc .info{margin-top:22px}
.dc .nm{display:flex;align-items:center;gap:12px}
.dc .nm i{flex:none;width:30px;height:30px;border-radius:50%;background:center/cover;box-shadow:0 0 0 1px rgba(46,34,28,.12)}
.dc .nm h3{font-family:var(--script);font-weight:400;white-space:nowrap;font-size:clamp(34px,11.5vw,52px);line-height:1;padding:.2em .2em .1em;margin:-.2em -.2em -.1em}
.dc .lead{margin-top:10px;font-size:14px;line-height:1.6;color:var(--ink)}
.dc .spec{margin-top:16px;border-top:1px solid var(--line)}
.dc .spec div{display:grid;grid-template-columns:104px minmax(0,1fr);gap:12px;padding:11px 0;border-bottom:1px solid var(--line)}
.dc .spec dt{font-size:10px;line-height:1.45;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--latte);padding-top:2px}
.dc .spec dd{font-size:13.5px;line-height:1.5;color:var(--choc)}
.dc .mix{display:flex;flex-wrap:wrap;gap:6px 16px}
.dc .mix button{display:inline-flex;align-items:center;gap:7px;font-size:13.5px;line-height:1.5;text-decoration:underline;text-decoration-color:rgba(46,34,28,.3);text-underline-offset:3px}
.dc .mix button i{width:16px;height:16px;border-radius:50%;background:center/cover;box-shadow:0 0 0 1px rgba(46,34,28,.15)}
/* смена цвета: всё уходит и возвращается по очереди */
.dc .trio figure,.dc .info>*{transition:opacity .6s var(--ease),transform .7s var(--ease)}
.dc .trio figure:nth-child(2){transition-delay:.08s}.dc .trio figure:nth-child(3){transition-delay:.16s}
.dc .info>*:nth-child(2){transition-delay:.12s}.dc .info>*:nth-child(3){transition-delay:.2s}
.dc .swap .trio figure,.dc .swap .info>*{opacity:0;transform:translateY(14px);transition-delay:0s}
@media (max-width:340px){.dc .spec div{grid-template-columns:96px minmax(0,1fr);gap:10px}.dc .spec dt{letter-spacing:.08em}}
/* появление блока */
.dc-js .dc .ttl{-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent 55%);mask-image:linear-gradient(90deg,#000 45%,transparent 55%);-webkit-mask-size:240% 100%;mask-size:240% 100%;-webkit-mask-position:100% 0;mask-position:100% 0;transition:-webkit-mask-position 1.9s cubic-bezier(.45,.05,.3,1) .2s,mask-position 1.9s cubic-bezier(.45,.05,.3,1) .2s}
.dc-js .dc.dc-on .ttl{-webkit-mask-position:0 0;mask-position:0 0}
.dc-js .dc .fade{opacity:0;transform:translateY(14px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.dc-js .dc.dc-on .fade{opacity:1;transform:none}
.dc-js .dc .sw button{opacity:0;transform:scale(.6)}
.dc-js .dc.dc-on .sw button{opacity:1;transform:none;transition:transform .8s cubic-bezier(.3,1.4,.5,1),opacity .6s,box-shadow .55s}
.dc-js .dc.dc-on .sw button.on{transform:scale(1.2)}
.dc-js .dc.dc-on .sw button:nth-child(2){transition-delay:.08s}.dc-js .dc.dc-on .sw button:nth-child(3){transition-delay:.16s}
.dc-js .dc.dc-on .sw button:nth-child(4){transition-delay:.24s}.dc-js .dc.dc-on .sw button:nth-child(5){transition-delay:.32s}
.dc-js .dc.dc-on .sw.ready button{transition-delay:0s}
@media (prefers-reduced-motion:reduce){.dc *{transition-duration:.01s!important;transition-delay:0s!important}}
</style>
<section class="dc" data-dc aria-label="Дресс-код">
  <h2 class="ttl">Дресс-код</h2>
  <div class="intro">
    <div class="txt fade" style="--d:.5s">
      <p>Мы будем рады, если вы поддержите цветовую гамму нашего праздника. Так вместе мы создадим единую и особенную атмосферу этого дня, а&nbsp;фотографии станут по-настоящему гармоничными.</p>
    </div>
    <!-- СТАРТОВОЕ ФОТО (с гостями) --><figure class="hero fade" style="--d:.65s"><img src="${GUESTS}" alt="Гости в палитре праздника" decoding="async" onerror="this.style.visibility='hidden'"></figure>
  </div>
  <p class="note fade" style="--d:.75s">Пожалуйста, оставьте белый цвет для невесты и&nbsp;по&nbsp;возможности избегайте чёрного.</p>
  <div class="sw" role="radiogroup" aria-label="Цвета дресс-кода">${COLORS.map((c, i) => `
    <button type="button" role="radio" aria-checked="false" aria-label="${c.n}" data-i="${i}" style="background-image:url('${c.tex}')"></button>`).join('')}
  </div>
  <p class="hint fade" style="--d:.9s"><b>Подсказка:</b> нажмите на&nbsp;цвет, чтобы увидеть пример образа (листайте вниз)</p>
  <div class="look" aria-live="polite"><div>
    <div class="trio">
      <figure><img alt="" decoding="async"></figure><figure><img alt="" decoding="async"></figure><figure><img alt="" decoding="async"></figure>
    </div>
    <div class="info">
      <div class="nm"><i aria-hidden="true"></i><h3></h3></div>
      <p class="lead"></p>
      <dl class="spec">
        <div><dt>Для неё</dt><dd data-k="her"></dd></div>
        <div><dt>Для него</dt><dd data-k="him"></dd></div>
        <div><dt>Ткани и фактуры</dt><dd data-k="fab"></dd></div>
        <div><dt>Украшения</dt><dd data-k="jew"></dd></div>
        <div><dt>Сочетается&nbsp;с</dt><dd class="mix" data-k="mix"></dd></div>
      </dl>
    </div>
  </div></div>
</section>
<script>(function(){
/* ЦВЕТА И ФОТО: main — фото справа от текста, looks — три образа (вертикальные 2:3). Замените ссылки на свои. */
var DC=${DATA};
var s=document.currentScript.previousElementSibling;if(!s||!s.classList.contains('dc'))return;
var q=function(x){return s.querySelector(x)},qa=function(x){return s.querySelectorAll(x)};
var btns=qa('.sw button'),hero=q('.hero'),look=q('.look'),box=q('.look>div'),cur=-1,busy=0;
function setHero(src,tex){var old=hero.querySelectorAll('img'),im=new Image();im.alt='';im.decoding='async';im.className='off';
  hero.style.backgroundImage="url('"+tex+"')";
  im.onload=im.onerror=function(){if(im.naturalWidth===0)im.style.visibility='hidden';requestAnimationFrame(function(){im.classList.remove('off');old.forEach(function(o){o.classList.add('off');setTimeout(function(){o.remove()},950)})})};
  im.src=src;hero.appendChild(im)}
function fill(c){var f=qa('.trio figure');f.forEach(function(fg,k){fg.style.backgroundImage="url('"+c.tex+"')";var im=fg.querySelector('img');im.style.visibility='';im.onerror=function(){this.style.visibility='hidden'};im.alt=c.n+' — образ '+(k+1);im.src=c.looks[k]});
  q('.nm i').style.backgroundImage="url('"+c.tex+"')";q('.nm h3').textContent=c.n;q('.lead').textContent=c.d;
  ['her','him','fab','jew'].forEach(function(k){q('[data-k='+k+']').textContent=c[k].charAt(0).toUpperCase()+c[k].slice(1)});
  var m=q('[data-k=mix]');m.innerHTML='';c.mix.forEach(function(j){var b=document.createElement('button');b.type='button';b.innerHTML='<i style="background-image:url(\\''+DC[j].tex+'\\')"></i>'+DC[j].n;b.onclick=function(){pick(j)};m.appendChild(b)})}
function pick(i){if(i===cur)return;var first=cur<0;cur=i;var c=DC[i];
  btns.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-checked',k===i?'true':'false')});
  setHero(c.main,c.tex);
  if(first){fill(c);box.classList.add('swap');look.classList.add('open');setTimeout(function(){box.classList.remove('swap')},350);return}
  box.classList.add('swap');clearTimeout(busy);busy=setTimeout(function(){fill(c);void box.offsetWidth;box.classList.remove('swap')},420)}
btns.forEach(function(b){b.addEventListener('click',function(){pick(+b.getAttribute('data-i'))})});
/* появление блока */
function on(){s.classList.add('dc-on');setTimeout(function(){q('.sw').classList.add('ready')},1300)}
if(!('IntersectionObserver' in window))on();else{var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){on();io.disconnect()}},{rootMargin:'0px 0px -12% 0px',threshold:.12});io.observe(s)}
})();</script>
`;
fs.writeFileSync(new URL('tilda/dresscode.html', import.meta.url), code);
console.log('dresscode.html', (Buffer.byteLength(code) / 1024).toFixed(1) + ' KB');
