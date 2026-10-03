// Сборка HTML-блоков для Тильды (блок T123 «HTML-код»).
// Запуск: npm install && npm run build:tilda  → файлы в папке tilda/
// Источник правды — src/config.js, src/styles.css, src/app.js.
import fs from 'node:fs';
import { minify as minifyJs } from 'terser';
import { minify as minifyCss } from 'csso';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const dir = new URL('tilda/', import.meta.url);
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });
const out = (name, html) => {
  fs.writeFileSync(new URL(name, dir), html.trim() + '\n');
  console.log(name.padEnd(34), (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
};

// --- конфиг: в Тильде нет локальной папки assets/ ---
const config = read('src/config.js').replace(/assetsBase: 'assets\/',/, "assetsBase: '',");

// --- шрифты по ссылке (большой base64-блок Тильда не принимает) ---
// Florisel Script — из этого публичного репозитория через jsDelivr, закреплено
// на коммите (ссылка не меняется и не зависит от веток); запасной адрес — GitHub.
// Lora — из Google Fonts (тот же шрифт, что в репозитории).
const FONT_COMMIT = 'cf98a5c39946f41565898f834b515d5ce048b3cb';
const REPO = 'qaishabdulaziz-beep/Wedding';
const florisel = [
  `https://cdn.jsdelivr.net/gh/${REPO}@${FONT_COMMIT}/assets/fonts/FloriselScript.woff2`,
  `https://raw.githubusercontent.com/${REPO}/${FONT_COMMIT}/assets/fonts/FloriselScript.woff2`,
];
const fontsBlock = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="${florisel[0]}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&subset=cyrillic&display=swap">
<style>
@font-face {
  font-family: 'Florisel Script'; font-weight: 400; font-style: normal; font-display: swap;
  src: url('${florisel[0]}') format('woff2'),
       url('${florisel[1]}') format('woff2');
}
</style>`;

const cssSrc = read('src/styles.css').replace(/\/\* @fonts-start[\s\S]*?@fonts-end \*\//, '');
const css = minifyCss(cssSrc, { restructure: false }).css;
const js = (await minifyJs(read('src/app.js'), { compress: true, mangle: true, format: { comments: false } })).code;

const head = (title, note) => `<!-- ${title}${note ? ' · ' + note : ''} -->`;
const mount = (sections) => `<div class="aa-mount" data-sections="${sections}"></div>`;

const BLOCKS = [
  ['05-splash-hero-quote.html', 'splash,hero,quote', 'заставка, hero, цитата'],
  ['06-guests-date-countdown.html', 'guests,calendar,countdown', 'обращение, календарь, таймер'],
  ['07-timing-location-transfer.html', 'timing,location,transfer', 'тайминг, локация, трансфер'],
  ['08-dresscode-story.html', 'dresscode,story', 'дресс-код, история'],
  ['09-gallery-rsvp-final.html', 'gallery,rsvp,final', 'галерея, анкета, финал'],
];

out('01-config.html', head('БЛОК 1 · КОНФИГ', 'меняйте только значения в кавычках') + `\n<script>\n${config}\n</script>`);
out('02-fonts.html', head('БЛОК 2 · ШРИФТЫ') + '\n' + fontsBlock);
out('03-styles.html', head('БЛОК 3 · СТИЛИ') + `\n<style>${css}</style>`);
out('04-script.html', head('БЛОК 4 · СКРИПТ') + `\n<script>${js}</script>`);
BLOCKS.forEach(([file, sections, note]) => out(file, head('БЛОК ' + file.slice(1, 2), note) + '\n' + mount(sections)));

// --- Вариант «весь сайт в 3 блока» ---
out('site-1-of-3-config.html', head('САЙТ · КОД 1 из 3 · КОНФИГ', 'меняйте только значения в кавычках') + `\n<script>\n${config}\n</script>`);
out('site-2-of-3-fonts-styles.html', head('САЙТ · КОД 2 из 3 · ШРИФТЫ И СТИЛИ') + '\n' + fontsBlock + `\n<style>${css}</style>`);
out('site-3-of-3-content-script.html', head('САЙТ · КОД 3 из 3 · СЕКЦИИ И СКРИПТ') + '\n' + BLOCKS.map(([, s]) => mount(s)).join('\n') + `\n<script>${js}</script>`);

// --- Минифицированные файлы для подключения по ссылке (короткие блоки) ---
const dist = new URL('dist/', import.meta.url);
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(new URL('aawed.min.css', dist), css);
fs.writeFileSync(new URL('aawed.min.js', dist), js);

// LOADER_COMMIT — коммит, в котором лежат dist/aawed.min.* (обновляется после пересборки)
const LOADER_COMMIT = process.env.LOADER_COMMIT || (fs.existsSync(new URL('dist/.commit', import.meta.url)) ? read('dist/.commit').trim() : '');
if (LOADER_COMMIT) {
  const cdn = (f) => `https://cdn.jsdelivr.net/gh/${REPO}@${LOADER_COMMIT}/${f}`;
  const alt = (f) => `https://rawcdn.githack.com/${REPO}/${LOADER_COMMIT}/${f}`;
  const fontF = 'assets/fonts/FloriselScript.woff2';
  out('short-2-of-3-fonts-styles.html', head('КОД 2 из 3 · ШРИФТЫ И СТИЛИ') + `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&subset=cyrillic&display=swap">
<link rel="stylesheet" href="${cdn('dist/aawed.min.css')}" onerror="this.onerror=null;this.href='${alt('dist/aawed.min.css')}'">
<style>
@font-face {
  font-family: 'Florisel Script'; font-weight: 400; font-style: normal; font-display: swap;
  src: url('${cdn(fontF)}') format('woff2'), url('${alt(fontF)}') format('woff2');
}
</style>`);
  out('short-3-of-3-content-script.html', head('КОД 3 из 3 · СЕКЦИИ И СКРИПТ') + '\n' + BLOCKS.map(([, s]) => mount(s)).join('\n') + `
<script src="${cdn('dist/aawed.min.js')}" onerror="var s=document.createElement('script');s.src='${alt('dist/aawed.min.js')}';document.body.appendChild(s)"></script>`);
}
