// Сборка HTML-блоков для Тильды (блок T123 «HTML-код»).
// Запуск: node build-tilda.mjs  → файлы в папке tilda/
// Источник правды — src/config.js, src/styles.css, src/app.js.
import fs from 'node:fs';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const b64 = (p) => fs.readFileSync(new URL(p, import.meta.url)).toString('base64');
const out = (name, html) => {
  fs.writeFileSync(new URL('tilda/' + name, import.meta.url), html.trim() + '\n');
  console.log(name.padEnd(28), (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
};
fs.mkdirSync(new URL('tilda/', import.meta.url), { recursive: true });

// --- конфиг: в Тильде нет локальной папки assets/ ---
const config = read('src/config.js').replace(/assetsBase: 'assets\/',/, "assetsBase: '',");

// --- шрифты: встраиваем WOFF2 прямо в CSS, чтобы ничего не хостить отдельно ---
const fontsInline = `
@font-face { font-family: 'Florisel Script'; font-weight: 400; font-style: normal; font-display: swap;
  src: url(data:font/woff2;base64,${b64('assets/fonts/FloriselScript.woff2')}) format('woff2'); }
@font-face { font-family: 'Lora'; font-weight: 400 700; font-style: normal; font-display: swap;
  src: url(data:font/woff2;base64,${b64('assets/fonts/Lora-Variable.woff2')}) format('woff2'); }
@font-face { font-family: 'Lora'; font-weight: 400 700; font-style: italic; font-display: swap;
  src: url(data:font/woff2;base64,${b64('assets/fonts/Lora-Italic-Variable.woff2')}) format('woff2'); }`;

// запасной вариант: шрифты по ссылке из GitHub через jsDelivr (после слияния в main)
const CDN = 'https://cdn.jsdelivr.net/gh/qaishabdulaziz-beep/Wedding@main/assets/fonts/';
const fontsCdn = `
@font-face { font-family: 'Florisel Script'; font-weight: 400; font-style: normal; font-display: swap;
  src: url(${CDN}FloriselScript.woff2) format('woff2'); }
@font-face { font-family: 'Lora'; font-weight: 400 700; font-style: normal; font-display: swap;
  src: url(${CDN}Lora-Variable.woff2) format('woff2'); }
@font-face { font-family: 'Lora'; font-weight: 400 700; font-style: italic; font-display: swap;
  src: url(${CDN}Lora-Italic-Variable.woff2) format('woff2'); }`;

const css = read('src/styles.css').replace(/\/\* @fonts-start[\s\S]*?@fonts-end \*\//, '/* шрифты подключены отдельным блоком */');
const js = read('src/app.js');

const head = (title, note) => `<!-- ===== ${title} =====\n     ${note}\n-->`;
const mount = (sections) => `<div class="aa-mount" data-sections="${sections}"></div>`;

const BLOCKS = [
  ['04-splash-hero-quote.html', 'splash,hero,quote', 'Заставка со стиранием, hero с именами, цитата'],
  ['05-guests-date-countdown.html', 'guests,calendar,countdown', 'Обращение, календарь, таймер'],
  ['06-timing-location-transfer.html', 'timing,location,transfer', 'Тайминг дня, локация, трансфер'],
  ['07-dresscode-story.html', 'dresscode,story', 'Дресс-код, наша история'],
  ['08-gallery-rsvp-final.html', 'gallery,rsvp,final', 'Галерея, анкета гостя, финал'],
];

out('01-config.html', head('БЛОК 1 · КОНФИГ', 'Все тексты, даты, ссылки и фото. Меняйте только значения в кавычках.') + `\n<script>\n${config}\n</script>`);
out('02-fonts.html', head('БЛОК 2 · ШРИФТЫ', 'Florisel Script + Lora, встроены в код. Ничего менять не нужно.') + `\n<style>${fontsInline}\n</style>`);
out('02-fonts-cdn.html', head('БЛОК 2 (облегчённый) · ШРИФТЫ ПО ССЫЛКЕ', 'Используйте вместо 02-fonts.html, если Тильда не принимает большой блок. Работает, когда файлы из репозитория слиты в ветку main.') + `\n<style>${fontsCdn}\n</style>`);
out('03-styles-engine.html', head('БЛОК 3 · СТИЛИ И СКРИПТ', 'Оформление и логика сайта. Ничего менять не нужно.') + `\n<style>\n${css}\n</style>\n<script>\n${js}\n</script>`);
for (const [file, sections, note] of BLOCKS) {
  out(file, head('БЛОК ' + file.slice(1, 2) + ' · ' + note, 'Секции собираются из конфига (блок 1).') + '\n' + mount(sections));
}
out('all-in-one.html',
  head('ВЕСЬ САЙТ ОДНИМ БЛОКОМ', 'Альтернатива блокам 1–8: вставьте целиком в один блок T123.') +
  `\n<script>\n${config}\n</script>\n<style>${fontsInline}\n${css}\n</style>\n` +
  BLOCKS.map(([, s]) => mount(s)).join('\n') + `\n<script>\n${js}\n</script>`);
