// Дресс-код: 4 варианта верхней части (текст + главное фото). Палитра и образы — без изменений.
// Берёт tilda/dresscode.html → tilda/dresscode-v/0N-*.html. Запуск: node dresscode.mjs && node dresscode-intro-variants.mjs
import fs from 'node:fs';

const src = fs.readFileSync(new URL('tilda/dresscode.html', import.meta.url), 'utf8');
const MAIN = src.match(/<img src="([^"]+main\.jpg)"/)[1];
const T1 = 'Мы будем рады, если вы поддержите цветовую гамму нашего праздника. Так вместе мы создадим единую и&nbsp;особенную атмосферу этого дня.';
const NOTE = 'Пожалуйста, оставьте белый цвет для невесты и&nbsp;по&nbsp;возможности избегайте чёрного.';
const IMG = `<img src="${MAIN}" alt="Гости в палитре праздника" decoding="async" onerror="this.style.visibility='hidden'">`;

// вырезаем старую верхнюю часть: от <h2 class="ttl"> до начала палитры
const a = src.indexOf('  <h2 class="ttl">Дресс-код</h2>'), b = src.indexOf('  <div class="sw"');
if (a < 0 || b < 0) throw new Error('не найдена верхняя часть');

const V = [
  /* 1. Без фото: всё по центру, тонкая линия-разделитель */
  ['01-center', 'Без фото, по центру', `
.dc .top{text-align:center}
.dc .top .ttl{margin:0 auto}
.dc .lead{margin:6px auto 0;max-width:310px;font-size:14.5px;line-height:1.7;color:var(--ink);text-wrap:pretty}
.dc .rule{width:40px;height:1px;margin:22px auto;background:rgba(46,34,28,.35)}
.dc .note2{margin:0 auto;max-width:300px;font-size:13.5px;line-height:1.6;font-weight:500;color:var(--choc);text-wrap:balance}
.dc-js .dc .rule{transform:scaleX(0);transition:transform 1.1s var(--ease) .7s}
.dc-js .dc.dc-on .rule{transform:none}`, `
  <div class="top">
    <h2 class="ttl">Дресс-код</h2>
    <p class="lead fade" style="--d:.45s">${T1}</p>
    <div class="rule" aria-hidden="true"></div>
    <p class="note2 fade" style="--d:.8s">${NOTE}</p>
  </div>
`],

  /* 2. Фото фоном: верхние ⅔ — фото, ниже оно растворяется в бежевом, на этом месте заголовок и текст */
  ['02-photo-bg', 'Фото фоном', `
.dc{padding-top:0}
.dc .bgph{position:absolute;left:0;right:0;top:0;height:min(128vw,660px);overflow:hidden;
  -webkit-mask-image:linear-gradient(180deg,#000 0,#000 42%,rgba(0,0,0,.45) 60%,transparent 84%);mask-image:linear-gradient(180deg,#000 0,#000 42%,rgba(0,0,0,.45) 60%,transparent 84%)}
.dc .bgph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 30%}
.dc .top{position:relative;z-index:1;padding-top:min(86vw,440px);text-align:center}
.dc .top .ttl{margin:0 auto}
.dc .lead{margin:4px auto 0;max-width:310px;font-size:14.5px;line-height:1.7;color:var(--ink);text-wrap:pretty}
.dc .note2{margin:18px auto 0;padding-top:16px;max-width:290px;border-top:1px solid var(--line);font-size:13.5px;line-height:1.6;font-weight:500;color:var(--choc);text-wrap:balance}
.dc-js .dc .bgph img{transform:scale(1.1);transition:transform 4s cubic-bezier(.2,.6,.2,1)}
.dc-js .dc.dc-on .bgph img{transform:none}`, `
  <!-- ГЛАВНОЕ ФОТО (фоном сверху) --><div class="bgph" aria-hidden="true">${IMG}</div>
  <div class="top">
    <h2 class="ttl">Дресс-код</h2>
    <p class="lead fade" style="--d:.45s">${T1}</p>
    <p class="note2 fade" style="--d:.7s">${NOTE}</p>
  </div>
`],

  /* 3. Фото во всю ширину, «Дресс-код» на стыке фото и фона (как в блоке «Детали») */
  ['03-photo-edge', 'Фото во всю ширину', `
.dc{padding-top:0}
.dc .wide{position:relative;margin:0 -20px;aspect-ratio:4/5;overflow:hidden;background:var(--sand)}
.dc .wide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 35%}
.dc .wide::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(246,241,234,0) 62%,rgba(246,241,234,.55) 86%,rgba(246,241,234,.9) 100%)}
.dc .top{position:relative;z-index:1;margin-top:-.92em;font-size:clamp(58px,17.5vw,80px)}
.dc .top .ttl{font-size:1em}
.dc .lead{margin-top:4px;font-size:14.5px;line-height:1.7;color:var(--ink);text-wrap:pretty}
.dc .note2{margin-top:16px;padding-left:14px;border-left:1px solid rgba(46,34,28,.35);font-size:13.5px;line-height:1.6;font-weight:500;color:var(--choc)}
.dc-js .dc .wide{clip-path:inset(0 0 100% 0);transition:clip-path 1.5s cubic-bezier(.7,0,.2,1)}
.dc-js .dc.dc-on .wide{clip-path:inset(0)}
.dc-js .dc .wide img{transform:scale(1.12);transition:transform 2.6s var(--ease)}
.dc-js .dc.dc-on .wide img{transform:none}`, `
  <!-- ГЛАВНОЕ ФОТО (во всю ширину) --><figure class="wide">${IMG}</figure>
  <div class="top"><h2 class="ttl">Дресс-код</h2></div>
  <p class="lead fade" style="--d:.6s">${T1}</p>
  <p class="note2 fade" style="--d:.8s">${NOTE}</p>
`],

  /* 4. Арка: фото в арке с тонкой линией вокруг, текст по центру */
  ['04-arch', 'Фото в арке', `
.dc .top{text-align:center}
.dc .top .ttl{margin:0 auto}
.dc .arch{position:relative;width:min(66%,300px);margin:8px auto 0;aspect-ratio:3/4}
.dc .arch::before{content:'';position:absolute;inset:-9px;border:1px solid rgba(46,34,28,.28);border-radius:999px 999px 0 0;border-bottom:0}
.dc .arch figure{position:absolute;inset:0;overflow:hidden;border-radius:999px 999px 0 0;background:var(--sand)}
.dc .arch img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%}
.dc .lead{margin:26px auto 0;max-width:310px;font-size:14.5px;line-height:1.7;color:var(--ink);text-wrap:pretty}
.dc .note2{margin:16px auto 0;max-width:290px;font-size:13.5px;line-height:1.6;font-weight:500;color:var(--choc);text-wrap:balance}
.dc-js .dc .arch figure{clip-path:inset(100% 0 0 0 round 999px 999px 0 0);transition:clip-path 1.6s cubic-bezier(.7,0,.2,1) .3s}
.dc-js .dc.dc-on .arch figure{clip-path:inset(0 0 0 0 round 999px 999px 0 0)}
.dc-js .dc .arch img{transform:scale(1.15);transition:transform 2.6s var(--ease) .3s}
.dc-js .dc.dc-on .arch img{transform:none}
.dc-js .dc .arch::before{opacity:0;transition:opacity 1.2s var(--ease) 1.2s}
.dc-js .dc.dc-on .arch::before{opacity:1}`, `
  <div class="top">
    <h2 class="ttl">Дресс-код</h2>
    <!-- ГЛАВНОЕ ФОТО (в арке) --><div class="arch"><figure>${IMG}</figure></div>
    <p class="lead fade" style="--d:.8s">${T1}</p>
    <p class="note2 fade" style="--d:1s">${NOTE}</p>
  </div>
`],
];

const dir = new URL('tilda/dresscode-v/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });
for (const [file, name, css, html] of V) {
  let s = src.slice(0, a) + html.replace(/^\n/, '') + src.slice(b);
  s = s.replace('<!-- ДРЕСС-КОД · палитра с образами -->', `<!-- ДРЕСС-КОД · ${name} -->`);
  // стили варианта добавляем в конец основного <style>, до правила reduced-motion
  s = s.replace('@media (prefers-reduced-motion:reduce){.dc *', `/* верхняя часть: ${name} */${css}\n@media (prefers-reduced-motion:reduce){.dc *`);
  fs.writeFileSync(new URL(file + '.html', dir), s);
  console.log(file.padEnd(16), (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB');
}
