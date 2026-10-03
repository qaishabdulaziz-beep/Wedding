/* ==========================================================================
   Артур & Анна · движок приглашения
   Собирает секции из window.AAWED_CONFIG в контейнеры
   <div class="aa-mount" data-sections="hero,quote"></div>
   и включает поведение: заставка-стирание, анимации, таймер, слайдер, анкета.
   Без зависимостей.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.AAWED_CONFIG;
  if (!C || window.__aawedBooted) return;
  window.__aawedBooted = true;

  var doc = document;
  var root = doc.documentElement;
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('aa-js');

  /* ------------------------------------------------------------------------
     Утилиты
     ------------------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // детерминированный «случай» — у каждого края и веточки свой рисунок
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function f1(n) { return Math.round(n * 10) / 10; }

  // делит заголовок на две строки примерно поровну (для рукописных заголовков)
  function lines2(text) {
    var w = String(text).split(' ');
    if (w.length < 2) return '<span>' + esc(text) + '</span>';
    var best = 1, bestDiff = 1e9;
    for (var i = 1; i < w.length; i++) {
      var d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length);
      if (d < bestDiff) { bestDiff = d; best = i; }
    }
    return '<span>' + esc(w.slice(0, best).join(' ')) + '</span><span>' + esc(w.slice(best).join(' ')) + '</span>';
  }

  var EVENT = new Date(C.eventStart);
  var Y = +C.eventStart.slice(0, 4), M = +C.eventStart.slice(5, 7) - 1, D = +C.eventStart.slice(8, 10);
  var TIME = C.eventStart.slice(11, 16);
  var DMY = pad(D) + '.' + pad(M + 1) + '.' + Y;

  /* ------------------------------------------------------------------------
     Фото: Unsplash получает srcset и WebP/AVIF, локальные файлы — как есть
     ------------------------------------------------------------------------ */
  function isUnsplash(u) { return /images\.unsplash\.com/.test(u); }
  function sized(u, w) { return u + (u.indexOf('?') > -1 ? '&' : '?') + 'auto=format&fit=crop&w=' + w + '&q=68'; }

  function photo(url, o) {
    o = o || {};
    var cls = 'aa-photo' + (o.cls ? ' ' + o.cls : '') + (o.parallax && !RM ? ' aa-photo--parallax' : '');
    var attrs = ' data-slot="' + esc(o.slot || 'фото') + '"' + (o.attrs || '');
    if (!url) return '<div class="' + cls + ' is-missing"' + attrs + '></div>';
    var w = o.w || 800, img;
    if (isUnsplash(url)) {
      var set = [480, 720, 1080, 1440].map(function (x) { return sized(url, x) + ' ' + x + 'w'; }).join(', ');
      img = '<img src="' + esc(sized(url, w)) + '" srcset="' + esc(set) + '" sizes="' + (o.sizes || '(min-width: 600px) 520px, 100vw') + '"';
    } else {
      img = '<img src="' + esc(url) + '"';
    }
    img += ' alt="' + esc(o.alt || '') + '" decoding="async"' +
      (o.eager ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
    return '<div class="' + cls + '"' + attrs + '>' + img + '</div>';
  }

  /* ------------------------------------------------------------------------
     Графика: рваный край бумаги, ботаника, линейные иллюстрации
     ------------------------------------------------------------------------ */
  var tearSeed = 11;
  function tear(bottom) {
    var r = rng(tearSeed += 17), pts = [], fib = [], x = 0, ph = r() * 6;
    while (x <= 400) {
      var base = 13 + Math.sin(x / 38 + ph) * 2.6 + Math.sin(x / 9.5 + ph * 2) * 1.1;
      var nick = r() < .06 ? 2.5 + r() * 3 : 0;
      var y = base + (r() - .5) * 3.2 + nick;
      pts.push(f1(x) + ' ' + f1(y));
      fib.push(f1(x) + ' ' + f1(y - 1.3 - r() * 1.6));
      x += 2.2 + r() * 5.5;
    }
    pts.push('400 ' + f1(13 + (r() - .5) * 3)); fib.push('400 11');
    return '<svg class="aa-tear' + (bottom ? ' aa-tear--bottom' : '') + '" viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path class="aa-tear__fiber" d="M0 26 L' + fib.join(' L') + ' L400 26 Z"/>' +
      '<path fill="currentColor" d="M0 26 L' + pts.join(' L') + ' L400 26 Z"/></svg>';
  }

  // кубическая Безье
  function bez(p, t) {
    var u = 1 - t;
    return [
      u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6],
      u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7]
    ];
  }
  function leaf(b, ang, len, wid) {
    var dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
    var tx = b[0] + dx * len, ty = b[1] + dy * len;
    var mx = b[0] + dx * len * .48, my = b[1] + dy * len * .48;
    return 'M' + f1(b[0]) + ' ' + f1(b[1]) +
      ' Q' + f1(mx + nx * wid) + ' ' + f1(my + ny * wid) + ' ' + f1(tx) + ' ' + f1(ty) +
      ' Q' + f1(mx - nx * wid) + ' ' + f1(my - ny * wid) + ' ' + f1(b[0]) + ' ' + f1(b[1]) +
      ' M' + f1(b[0] + dx * 2) + ' ' + f1(b[1] + dy * 2) + ' L' + f1(b[0] + dx * len * .72) + ' ' + f1(b[1] + dy * len * .72);
  }
  function oval(cx, cy, rx, ry, rot) {
    return 'M' + f1(cx - rx) + ' ' + f1(cy) + ' A' + rx + ' ' + ry + ' 0 1 0 ' + f1(cx + rx) + ' ' + f1(cy) +
      ' A' + rx + ' ' + ry + ' 0 1 0 ' + f1(cx - rx) + ' ' + f1(cy);
  }
  function P(d, delay) { return '<path pathLength="1" d="' + d + '"' + (delay ? ' style="--d:' + delay + 's"' : '') + '/>'; }

  // ветка оливы: стебель + узкие листья + пара плодов
  function olive(seed, o) {
    o = o || {};
    var r = rng(seed), W = o.w || 200, H = o.h || 70;
    var st = [6, H * .66, W * .3, H * .9, W * .62, H * .08, W - 6, H * .42];
    var out = P('M' + st[0] + ' ' + st[1] + ' C' + st.slice(2).map(f1).join(' '), .1);
    var n = o.leaves || 11, side = 1;
    for (var i = 0; i < n; i++) {
      var t = .07 + i * (.86 / n) + r() * .03, p = bez(st, t), p2 = bez(st, t + .01);
      var tang = Math.atan2(p2[1] - p[1], p2[0] - p[0]);
      var len = (24 - t * 10) * (o.scale || 1) * (.85 + r() * .3);
      out += P(leaf(p, tang + side * (.62 + r() * .3), len, len * .2), (.3 + t * 1.2).toFixed(2));
      side = -side;
    }
    if (o.fruit !== false) {
      [.34, .58].forEach(function (t, k) {
        var p = bez(st, t);
        var cx = p[0] + 5, cy = p[1] + (k ? -11 : 12);
        out += P('M' + f1(p[0]) + ' ' + f1(p[1]) + ' L' + f1(cx - 1) + ' ' + f1(cy + (k ? 4 : -4)) + ' ' + oval(cx, cy, 3.6, 4.8), (1 + k * .3).toFixed(2));
      });
    }
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false">' + out + '</svg>';
  }
  // эвкалипт: вертикальная веточка с округлыми листьями
  function sprig(seed) {
    var r = rng(seed), st = [44, 158, 30, 120, 58, 60, 40, 4], out = P('M44 158 C30 120 58 60 40 4', .1);
    for (var i = 0; i < 9; i++) {
      var t = .1 + i * .095, p = bez(st, t), s = i % 2 ? 1 : -1;
      var rad = 9.5 - t * 5 + r() * 1.5;
      var cx = p[0] + s * (rad + 3), cy = p[1] - 2;
      out += P('M' + f1(p[0]) + ' ' + f1(p[1]) + ' L' + f1(cx - s * rad * .7) + ' ' + f1(cy) + ' ' + oval(cx, cy, rad, rad * .82) + ' M' + f1(cx - s * rad * .5) + ' ' + f1(cy) + ' L' + f1(cx + s * rad * .45) + ' ' + f1(cy - 1.5), (.3 + t * 1.3).toFixed(2));
    }
    return '<svg viewBox="0 0 90 162" aria-hidden="true" focusable="false">' + out + '</svg>';
  }
  // мини-букет: три стебля с травами
  function floral(seed) {
    var r = rng(seed), out = '';
    [[60, 120, 40, 80, 30, 40, 18, 6], [60, 120, 62, 80, 66, 40, 72, 4], [60, 120, 80, 96, 100, 70, 112, 40]].forEach(function (st, k) {
      out += P('M' + st.join(' ').replace(/^(\S+ \S+) /, '$1 C'), (.1 + k * .2).toFixed(2));
      for (var i = 0; i < 6; i++) {
        var t = .3 + i * .12, p = bez(st, t), p2 = bez(st, t + .01);
        var tang = Math.atan2(p2[1] - p[1], p2[0] - p[0]), s = i % 2 ? 1 : -1;
        out += P(leaf(p, tang + s * .55, 11 - i * .8 + r() * 2, 2.2), (.5 + k * .2 + t).toFixed(2));
      }
      var e = [st[6], st[7]];
      out += P(oval(e[0], e[1], 2.4, 3.2), (1.4 + k * .2).toFixed(2));
    });
    return '<svg viewBox="0 0 120 124" aria-hidden="true" focusable="false">' + out + '</svg>';
  }

  var DECOR = {
    'decor-branch-01': function () { return olive(7, { w: 200, h: 70, leaves: 12 }); },
    'decor-branch-02': function () { return olive(23, { w: 150, h: 54, leaves: 8, scale: .8, fruit: false }); },
    'decor-sprig-03': function () { return sprig(5); },
    'decor-floral-04': function () { return floral(9); },
    'decor-branch-05': function () { return olive(41, { w: 170, h: 60, leaves: 10, scale: .9 }); }
  };
  function decor(name, cls) {
    return '<div class="aa-decor aa-draw ' + (cls || '') + '" data-decor="' + name + '" aria-hidden="true">' + DECOR[name]() + '</div>';
  }

  // линейные иллюстрации для тайминга (рисуются от руки, не иконки)
  var ART = {
    champagne:
      '<g transform="rotate(-14 16 30)">' + P('M11 6 H21 L19.6 19 Q16 24 12.4 19 Z') + P('M12 11.5 H20') + P('M16 21.5 V37') + P('M11.5 37.5 H20.5') + '</g>' +
      '<g transform="rotate(14 32 30)">' + P('M27 6 H37 L35.6 19 Q32 24 28.4 19 Z') + P('M28 11.5 H36') + P('M32 21.5 V37') + P('M27.5 37.5 H36.5') + '</g>' +
      P('M24 0.5 V5 M21.8 2.8 H26.2') + P('M5 8 l2 1.6 M43 8 l-2 1.6'),
    arch:
      P('M9 44 V22 A15 15 0 0 1 39 22 V44') + P('M14 44 V23 A10 10 0 0 1 34 23 V44') + P('M3 44.5 H45') +
      P('M10 23 Q5 21 5.5 15.5 Q10 17 10 23') + P('M13 13 Q8 11 9 6 Q13.5 8 13 13') + P(oval(19.5, 7.4, 2.2, 2.2)) + P('M38 23 Q43 21 42.5 15.5 Q38 17 38 23'),
    dinner:
      P(oval(24, 27, 11, 11)) + P(oval(24, 27, 7, 7)) +
      P('M7 14 V21 Q7 24.5 9 24.5 Q11 24.5 11 21 V14 M9 14 V21 M9 24.5 V40') + P('M40.5 14 Q36 20.5 37.5 27 H40.5 V40'),
    cake:
      P('M8 42.5 H40') + P('M12 42 V33 H36 V42') + P('M12 35.5 Q15 37.6 18 35.5 Q21 37.6 24 35.5 Q27 37.6 30 35.5 Q33 37.6 36 35.5') +
      P('M16 33 V25 H32 V33') + P('M20 25 V19 H28 V25') + P('M24 19 V13.5') + P('M24 13 Q21.6 10 24 6.5 Q26.4 10 24 13 Z'),
    moon:
      P('M28 6 A17 17 0 1 0 41 33 A13.5 13.5 0 1 1 28 6 Z') + P('M38 7 V13 M35 10 H41') + P('M10 7 V11 M8 9 H12') + P(oval(42, 22, .9, .9))
  };

  var CHECK_PILL = '<svg viewBox="0 0 26 26" aria-hidden="true"><path pathLength="1" d="M5 13.5 C7 15 8.5 17 10 19.5 C12.5 13 16.5 8.5 22 5"/></svg>';
  var CHECK_BOX = '<svg viewBox="0 0 22 22" aria-hidden="true"><path pathLength="1" d="M4.5 11.5 C6 12.5 7.5 14.5 8.8 16.5 C11 11 14 7 19 3"/></svg>';

  /* ------------------------------------------------------------------------
     Номера разделов 01, 02… (по порядку на странице)
     ------------------------------------------------------------------------ */
  var secN = 0;
  function label(text, end) {
    secN++;
    return '<div class="aa-label' + (end ? ' aa-label--end' : '') + '"><span class="aa-label__n">' + pad(secN) +
      '</span><span class="aa-label__line" aria-hidden="true"></span><span>' + esc(text) + '</span></div>';
  }

  /* ========================================================================
     СЕКЦИИ
     ======================================================================== */
  var S = {};

  /* 0. Заставка */
  S.splash = function () {
    var s = C.splash || {};
    if (s.enabled === false) return '';
    var trail = 'M18 46 C40 18 62 18 76 38 S112 58 128 34 S168 16 184 30';
    return '<div class="aa-splash" role="dialog" aria-modal="true" aria-label="' + esc(s.lineScript + ' ' + s.lineCaps) + '">' +
      '<button type="button" class="aa-splash__skip">' + esc(s.skip) + '</button>' +
      photo(C.photos.splash || C.photos.hero, { cls: 'aa-splash__photo', eager: true, alt: C.hero.alt, slot: 'фото · splash', w: 1080 }) +
      '<div class="aa-splash__shade"></div>' +
      '<canvas class="aa-splash__veil" aria-hidden="true"></canvas>' +
      '<div class="aa-splash__hint" aria-hidden="true"><svg viewBox="0 0 200 70">' +
        '<path class="aa-trail" pathLength="1" d="' + trail + '"/>' +
        '<circle class="aa-finger" r="9" cx="0" cy="0">' +
          (RM ? '' : '<animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.6;1" calcMode="linear" path="' + trail + '"/>' +
          '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.6;1" dur="3.2s" repeatCount="indefinite"/>') +
        '</circle></svg><span>' + esc(s.hint) + '</span></div>' +
      '<div class="aa-splash__reveal"><p class="aa-script">' + esc(s.revealScript) + '</p>' +
      '<span class="aa-splash__tap">' + esc(s.revealHint) + '</span></div>' +
      '</div>';
  };

  /* 1. Hero */
  S.hero = function () {
    function name(n, k, d) {
      return '<span class="aa-name aa-name--' + k + '" data-enter style="--d:' + d + 's" aria-hidden="true">' +
        '<span class="aa-name__cap">' + esc(n.charAt(0)) + '</span><span class="aa-name__rest">' + esc(n.slice(1)) + '</span></span>';
    }
    return '<header class="aa-hero">' +
      photo(C.photos.hero, { cls: 'aa-hero__photo', eager: true, parallax: true, alt: C.hero.alt, slot: 'фото · hero', w: 1080 }) +
      '<div class="aa-hero__top" data-enter style="--d:.9s"><span class="aa-caps">' + esc(C.hero.kicker) + '</span>' +
      '<span class="aa-caps aa-hero__vert">' + esc(DMY) + '</span></div>' +
      '<h1 class="aa-names"><span class="aa-sr">' + esc(C.couple.groom + ' и ' + C.couple.bride) + '</span>' +
        name(C.couple.groom, 1, .3) +
        '<span class="aa-names__and" data-enter style="--d:.6s" aria-hidden="true">' + esc(C.couple.and) + '</span>' +
        name(C.couple.bride, 2, .8) +
      '</h1>' +
      '<p class="aa-hero__date" data-enter style="--d:1.1s">' + esc(C.dateShort) + '</p>' +
      '</header>';
  };

  /* 2. Цитата */
  S.quote = function () {
    return '<section class="aa-sec aa-quote" aria-label="Цитата">' +
      decor('decor-branch-01') +
      '<blockquote data-reveal><p>' + esc(C.quote) + '</p></blockquote>' +
      decor('decor-branch-02', 'aa-decor--down') +
      '</section>';
  };

  /* 3. Дорогие гости */
  S.guests = function () {
    var g = C.guests;
    return '<section class="aa-sec aa-sec--sage aa-guests">' + tear() + label(g.label) +
      '<div class="aa-guests__head">' +
        decor('decor-sprig-03') +
        '<figure class="aa-polaroid aa-guests__photo" style="--r:3.2deg" data-reveal>' +
          '<span class="aa-tape aa-tape--t" aria-hidden="true"></span>' +
          photo(C.photos.guests, { alt: C.couple.groom + ' и ' + C.couple.bride, slot: 'фото · guests', w: 600, sizes: '(min-width: 600px) 290px, 56vw', parallax: true }) +
          '<figcaption>' + esc(g.photoCaption) + '</figcaption></figure>' +
        '<h2 class="aa-script aa-guests__title" data-reveal style="--d:.25s">' + lines2(g.title) + '</h2>' +
      '</div>' +
      '<p class="aa-p aa-dropcap" data-reveal>' + esc(g.text) + '</p>' +
      '<p class="aa-sign" data-reveal><span class="aa-sign__pre">' + esc(g.signaturePre) + '</span>' +
      '<span class="aa-script">' + esc(g.signature) + '</span></p>' +
      '</section>';
  };

  /* 4. Календарь */
  S.calendar = function () {
    var c = C.calendar, first = (new Date(Date.UTC(Y, M, 1)).getUTCDay() + 6) % 7;
    var days = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate(), cells = '';
    c.weekdays.forEach(function (w) { cells += '<span class="aa-cal__wd">' + esc(w) + '</span>'; });
    for (var i = 0; i < first; i++) cells += '<span class="aa-cal__d"></span>';
    for (var d = 1; d <= days; d++) {
      var col = (first + d - 1) % 7, x = d === D;
      cells += '<span class="aa-cal__d' + (col > 4 ? ' aa-cal__d--we' : '') + (x ? ' aa-cal__d--x' : '') + '">' + d +
        (x ? '<svg class="aa-draw" viewBox="0 0 66 56" aria-hidden="true" style="--dur:1.6s;--d:.5s"><path pathLength="1" d="M15 41 C4 31 8 12 28 8 C47 4 63 14 60 29 C57 43 40 50 26 48 C13 46 7 37 10 27 C12 20 20 13 35 11"/></svg>' : '') +
        '</span>';
    }
    return '<section class="aa-sec aa-cal" aria-label="' + esc(c.label) + '">' + label(c.label) +
      '<div class="aa-cal__head" data-reveal>' + decor('decor-floral-04') +
        '<h2 class="aa-script aa-cal__month">' + esc(c.title) + '</h2><span class="aa-cal__year">' + Y + '</span></div>' +
      '<div class="aa-cal__grid" aria-hidden="true" data-reveal>' + cells + '</div>' +
      '<div class="aa-cal__caption" data-reveal><p>' + esc(C.dateLong) + '</p></div>' +
      '</section>';
  };

  /* 5. Обратный отсчёт */
  S.countdown = function () {
    var c = C.countdown;
    function cell(k) {
      return '<div class="aa-count__cell"><span class="aa-count__num" data-k="' + k + '">00</span><span class="aa-count__unit" data-u="' + k + '"></span></div>';
    }
    return '<section class="aa-sec aa-sec--sand aa-count">' + tear() + label(c.label) +
      '<h2 class="aa-script aa-count__title" data-reveal>' + esc(c.title) + '</h2>' +
      '<div class="aa-count__grid" role="timer" aria-live="off" data-reveal style="--d:.15s">' + cell('d') + cell('h') + cell('m') + cell('s') + '</div>' +
      '<p class="aa-count__note" data-reveal>' + esc(C.dateLong) + ' · ' + esc(TIME) + '</p>' +
      '</section>';
  };

  /* 6. Тайминг */
  S.timing = function () {
    var t = C.timing;
    var items = t.items.map(function (it, i) {
      return '<li class="aa-tl__item" data-reveal style="--d:' + (i * .08).toFixed(2) + 's">' +
        '<span class="aa-tl__time">' + esc(it.time) + '</span>' +
        '<div class="aa-tl__body"><p class="aa-tl__name">' + esc(it.title) + '</p><p class="aa-tl__text">' + esc(it.text) + '</p></div>' +
        '<span class="aa-tl__art aa-draw" aria-hidden="true" style="--dur:2s;--d:.35s"><svg viewBox="0 0 48 48">' + (ART[it.art] || ART.arch) + '</svg></span>' +
        '</li>';
    }).join('');
    return '<section class="aa-sec aa-timing">' + label(t.label) +
      '<h2 class="aa-script aa-timing__title" data-reveal>' + lines2(t.title) + '</h2>' +
      '<ol class="aa-tl">' + items + '</ol></section>';
  };

  /* 7. Локация */
  S.location = function () {
    var l = C.location;
    return '<section class="aa-sec aa-sec--sage aa-loc aa-sec--tight-bottom">' + tear() + label(l.label) +
      '<div class="aa-loc__visual" data-reveal>' +
        photo(C.photos.venue, { cls: 'aa-loc__photo aa-arch', alt: l.venue, slot: 'фото · venue', w: 720, sizes: '(min-width: 600px) 380px, 80vw', parallax: true }) +
        '<h2 class="aa-script aa-loc__title">' + esc(l.title) + '</h2></div>' +
      '<div class="aa-loc__info" data-reveal>' +
        '<p class="aa-loc__venue">' + esc(l.venue) + '</p>' +
        '<p class="aa-loc__addr">' + esc(l.address) + '</p>' +
        (l.note ? '<p class="aa-loc__note">' + esc(l.note) + '</p>' : '') +
      '</div>' +
      '<div class="aa-btns" data-reveal>' +
        (l.yandex ? '<a class="aa-btn" href="' + esc(l.yandex) + '" target="_blank" rel="noopener">Открыть в Яндекс Картах</a>' : '') +
        (l.google ? '<a class="aa-btn aa-btn--ghost" href="' + esc(l.google) + '" target="_blank" rel="noopener">Открыть в Google Maps</a>' : '') +
      '</div></section>';
  };

  /* 8. Трансфер */
  S.transfer = function () {
    var t = C.transfer;
    return '<section class="aa-sec aa-sec--sage aa-transfer">' +
      '<div class="aa-transfer__divider" aria-hidden="true"><span></span></div>' +
      label(t.label, true) +
      '<h2 class="aa-script aa-transfer__title" data-reveal>' + esc(t.title) + '</h2>' +
      '<p class="aa-p" data-reveal>' + esc(t.text) + '</p>' +
      '<div class="aa-ticket" data-reveal>' +
        '<div class="aa-ticket__row"><div class="aa-ticket__point"><p class="aa-ticket__k">' + esc(t.pointLabel) + '</p>' +
        '<p class="aa-ticket__v">' + esc(t.point) + '</p></div>' +
        '<div class="aa-ticket__times"><div><p class="aa-ticket__k">туда</p><p class="aa-ticket__v">' + esc(t.departure) + '</p></div>' +
        '<div><p class="aa-ticket__k">обратно</p><p class="aa-ticket__v">' + esc(t.back) + '</p></div></div></div>' +
        '<div class="aa-ticket__perf" aria-hidden="true"></div>' +
        (t.map ? '<a class="aa-btn aa-btn--ghost" href="' + esc(t.map) + '" target="_blank" rel="noopener">Место сбора на карте</a>' : '') +
      '</div></section>';
  };

  /* 9. Дресс-код */
  S.dresscode = function () {
    var d = C.dresscode;
    var shapes = ['52% 48% 55% 45% / 47% 53% 47% 53%', '46% 54% 43% 57% / 55% 45% 58% 42%', '58% 42% 50% 50% / 44% 56% 46% 54%', '44% 56% 57% 43% / 52% 44% 56% 48%', '50% 50% 44% 56% / 58% 46% 54% 42%'];
    var rot = [-8, 6, -3, 9, -5], ys = [0, 14, -4, 12, 2];
    var sw = d.swatches.map(function (s, i) {
      return '<div class="aa-swatch aa-swatch--' + esc(s.texture || 'linen') + '" style="--c:' + esc(s.color) + ';--shape:' + shapes[i % 5] +
        ';--r:' + rot[i % 5] + 'deg;--y:' + ys[i % 5] + 'px;--z:' + (i % 2 ? 2 : 1) + '"><div class="aa-swatch__cloth" role="img" aria-label="' + esc(s.name) + '"></div>' +
        '<span class="aa-swatch__name" aria-hidden="true">' + esc(s.name) + '</span></div>';
    }).join('');
    var refs = (d.refs || []).slice(0, 3).map(function (r, i) {
      return '<figure class="aa-ref aa-polaroid" data-reveal style="--d:' + (i * .1) + 's">' +
        (i === 1 ? '<span class="aa-tape aa-tape--t" aria-hidden="true"></span>' : '') +
        photo(r.src, { alt: 'Пример образа: ' + r.caption, slot: 'образ', w: 480, sizes: '(min-width: 600px) 170px, 33vw' }) +
        '<figcaption>' + esc(r.caption) + '</figcaption></figure>';
    }).join('');
    return '<section class="aa-sec aa-dress">' + label(d.label) +
      '<h2 class="aa-script aa-dress__title" data-reveal>' + esc(d.title) + '</h2>' +
      '<p class="aa-p" data-reveal>' + esc(d.text) + '</p>' +
      (d.wish ? '<p class="aa-dress__wish" data-reveal>' + esc(d.wish) + '</p>' : '') +
      '<div class="aa-swatches" data-reveal>' + sw + '</div>' +
      (refs ? '<div class="aa-refs">' + refs + '</div>' : '') +
      '</section>';
  };

  /* 10. Наша история */
  S.story = function () {
    var s = C.story, n = s.items.length;
    var items = s.items.map(function (it, i) {
      var side = i % 2 ? 'right' : 'left', r = (i % 2 ? 2.4 : -2.6) + (i % 3 ? .4 : 0);
      var link = i < n - 1 ? '<span class="aa-chapter__link aa-draw' + (i % 2 ? ' is-flip' : '') + '" aria-hidden="true" style="--dur:1.6s"><svg viewBox="0 0 200 96" preserveAspectRatio="none"><path pathLength="1" d="M40 2 C36 34 92 30 112 48 C134 68 166 54 160 94"/></svg></span>' : '';
      return '<article class="aa-chapter aa-chapter--' + side + '">' +
        '<figure class="aa-polaroid aa-chapter__fig" style="--r:' + r.toFixed(1) + 'deg" data-reveal>' +
          '<span class="aa-tape ' + (i % 2 ? 'aa-tape--tl' : 'aa-tape--tr') + '" aria-hidden="true"></span>' +
          photo(it.photo, { alt: it.title, slot: 'фото · история ' + (i + 1), w: 600, sizes: '(min-width: 600px) 320px, 64vw' }) +
        '</figure>' +
        '<p class="aa-script aa-chapter__date" data-reveal style="--d:.15s">' + esc(it.date) + '</p>' +
        '<div class="aa-chapter__text" data-reveal style="--d:.25s"><h3 class="aa-chapter__name"><i>' + pad(i + 1) + '</i>' + esc(it.title) + '</h3>' +
        '<p class="aa-chapter__p">' + esc(it.text) + '</p></div>' +
        '</article>' + link;
    }).join('');
    return '<section class="aa-sec aa-sec--sand aa-story">' + tear() + label(s.label) +
      '<h2 class="aa-script aa-story__title" data-reveal>' + lines2(s.title) + '</h2>' + items + '</section>';
  };

  /* 11. Галерея */
  S.gallery = function () {
    var g = C.gallery, ph = g.photos || [], col = ph.slice(0, 3), rest = ph.length > 5 ? ph.slice(3) : ph;
    var alt = C.couple.groom + ' и ' + C.couple.bride;
    var slides = rest.map(function (u, i) {
      return '<figure class="aa-slide">' + photo(u, { alt: alt, slot: 'фото · галерея', w: 720, sizes: '(min-width: 600px) 360px, 72vw' }) +
        '<figcaption class="aa-slide__n">' + pad(i + 1) + ' / ' + pad(rest.length) + '</figcaption></figure>';
    }).join('');
    return '<section class="aa-sec aa-gal">' +
      '<div class="aa-gal__head">' + label(g.label) + '<h2 class="aa-script aa-gal__title" data-reveal>' + esc(g.title) + '</h2></div>' +
      '<div class="aa-collage">' +
        photo(col[0], { cls: 'aa-collage__a aa-arch', alt: alt, slot: 'фото · галерея', w: 720, sizes: '(min-width: 600px) 300px, 64vw', parallax: true, attrs: ' data-reveal' }) +
        '<figure class="aa-polaroid aa-collage__b" data-reveal style="--d:.15s"><span class="aa-tape aa-tape--tr" aria-hidden="true"></span>' +
          photo(col[1], { alt: alt, slot: 'фото · галерея', w: 480, sizes: '(min-width: 600px) 240px, 50vw' }) + '</figure>' +
        photo(col[2], { cls: 'aa-collage__c', alt: alt, slot: 'фото · галерея', w: 480, sizes: '(min-width: 600px) 200px, 40vw', attrs: ' data-reveal style="--d:.3s"' }) +
      '</div>' +
      '<div class="aa-slider" data-reveal>' +
        '<div class="aa-slider__track" tabindex="0" aria-label="Фотографии, листайте вбок">' + slides + '</div>' +
        '<div class="aa-dots" role="tablist" aria-label="Выбор фото"></div>' +
      '</div></section>';
  };

  /* 12. Анкета */
  S.rsvp = function () {
    var r = C.rsvp;
    var att = r.attendOptions.map(function (o, i) {
      return '<label class="aa-choice"><input type="radio" name="attendance" value="' + esc(o) + '"' + (i === 0 ? ' required' : '') + '>' +
        '<span class="aa-pill"><span class="aa-pill__mark">' + CHECK_PILL + '</span>' + esc(o) + '</span></label>';
    }).join('');
    var drinks = r.drinks.map(function (o) {
      return '<label class="aa-choice"><input type="checkbox" name="drinks" value="' + esc(o) + '">' +
        '<span class="aa-check"><span class="aa-check__box">' + CHECK_BOX + '</span>' + esc(o) + '</span></label>';
    }).join('');
    return '<section class="aa-sec aa-sec--sage aa-rsvp" id="rsvp">' + tear() + label(r.label) +
      '<h2 class="aa-script aa-rsvp__title" data-reveal>' + lines2(r.title) + '</h2>' +
      '<p class="aa-rsvp__sub" data-reveal>' + esc(r.subtitle) + '</p>' +
      '<form class="aa-form" novalidate data-reveal>' +
        '<div class="aa-field" data-f="name"><label class="aa-field__label" for="aa-name">' + esc(r.nameLabel) + ' <em>*</em></label>' +
          '<input class="aa-input" id="aa-name" name="name" type="text" autocomplete="name" placeholder="' + esc(r.namePlaceholder) + '" required maxlength="120">' +
          '<p class="aa-err" role="alert">' + esc(r.errorName) + '</p></div>' +
        '<fieldset class="aa-field" data-f="attendance"><legend class="aa-field__label">' + esc(r.attendLabel) + ' <em>*</em></legend>' +
          '<div class="aa-pills">' + att + '</div><p class="aa-err" role="alert">' + esc(r.errorAttend) + '</p></fieldset>' +
        '<fieldset class="aa-field"><legend class="aa-field__label">' + esc(r.drinksLabel) + '</legend><div class="aa-checks">' + drinks + '</div></fieldset>' +
        '<div class="aa-field"><label class="aa-field__label" for="aa-comment">' + esc(r.commentLabel) + '</label>' +
          '<textarea class="aa-input" id="aa-comment" name="comment" rows="3" maxlength="1000" placeholder="' + esc(r.commentPlaceholder) + '"></textarea></div>' +
        '<input class="aa-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<button class="aa-btn" type="submit">' + esc(r.submit) + '</button>' +
        '<p class="aa-form__status" role="status" aria-live="polite"></p>' +
      '</form>' +
      '<div class="aa-thanks" hidden tabindex="-1"><p class="aa-script">' + esc(r.thanksTitle) + '</p>' +
        decor('decor-branch-02') + '<p>' + esc(r.thanksText) + '</p>' +
        '<button type="button" class="aa-btn aa-btn--ghost aa-thanks__again" style="margin-top:30px">' + esc(r.thanksAgain) + '</button></div>' +
      tear(true) +
      '</section>';
  };

  /* 13. Финал */
  S.final = function () {
    var f = C.final;
    return '<section class="aa-final">' +
      photo(C.photos.final, { cls: 'aa-final__photo', alt: C.couple.groom + ' и ' + C.couple.bride, slot: 'фото · final', w: 1080, parallax: true }) +
      '<div class="aa-final__text"><h2 class="aa-script aa-final__title" data-reveal>' + esc(f.title) + '</h2>' +
      '<p class="aa-final__sign" data-reveal style="--d:.2s">' + esc(f.signature) + '</p></div>' +
      '</section>' +
      '<section class="aa-contact">' + decor('decor-branch-05') +
        '<h2 class="aa-script aa-contact__q" data-reveal>' + esc(f.contactLabel) + '</h2>' +
        '<p class="aa-contact__text" data-reveal>' + esc(f.contactText) + '</p>' +
        '<p class="aa-contact__person" data-reveal><span class="aa-contact__name">' + esc(f.contactName) + '</span>' +
        '<a class="aa-contact__phone" href="tel:' + esc(f.contactPhoneHref) + '">' + esc(f.contactPhone) + '</a></p>' +
        '<footer class="aa-footer"><span>' + esc(C.couple.groom.charAt(0)) + ' &amp; ' + esc(C.couple.bride.charAt(0)) + '</span>' +
        '<span class="aa-script" aria-hidden="true">' + esc(C.couple.and) + '</span><span>' + esc(DMY) + '</span></footer>' +
      '</section>';
  };

  /* ========================================================================
     ПОВЕДЕНИЕ
     ======================================================================== */

  /* --- появление при скролле + прорисовка линий --- */
  function initReveal(scope) {
    var els = $$('[data-reveal], .aa-draw, .aa-label, .aa-tl', scope);
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* --- лёгкий параллакс фото --- */
  function initParallax() {
    if (RM) return;
    var items = $$('.aa-photo--parallax').map(function (w) { return { w: w, img: w.querySelector('img') }; })
      .filter(function (o) { return o.img; });
    if (!items.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      items.forEach(function (o) {
        var r = o.w.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        o.img.style.transform = 'translate3d(0,' + (-p * r.height * .06).toFixed(1) + 'px,0)';
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* --- фото: заглушка, если файл не загрузился --- */
  function initPhotos(scope) {
    $$('.aa-photo img', scope).forEach(function (img) {
      function fail() { img.parentNode.classList.add('is-missing'); }
      img.addEventListener('error', fail);
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
    });
  }

  /* --- слоты декора: свой PNG/WebP вместо встроенной графики --- */
  function initDecor(scope) {
    var map = C.decor || {};
    $$('[data-decor]', scope).forEach(function (el) {
      var name = el.getAttribute('data-decor'), v = map[name], url = '';
      if (v === false) { el.parentNode.removeChild(el); return; }
      if (typeof v === 'string' && v) url = v;
      else if (v && C.assetsBase) url = C.assetsBase + 'decor/' + name + '.png';
      if (!url) return;
      var im = new Image();
      im.onload = function () {
        im.alt = ''; el.classList.remove('aa-draw'); el.innerHTML = ''; el.appendChild(im);
      };
      im.src = url;
    });
  }

  /* --- обратный отсчёт --- */
  function plural(n, f) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]; }
  var UNITS = { d: ['день', 'дня', 'дней'], h: ['час', 'часа', 'часов'], m: ['минута', 'минуты', 'минут'], s: ['секунда', 'секунды', 'секунд'] };
  function initCountdown() {
    var grid = $('.aa-count__grid');
    if (!grid) return;
    var nums = {}, units = {};
    ['d', 'h', 'm', 's'].forEach(function (k) { nums[k] = $('[data-k="' + k + '"]', grid); units[k] = $('[data-u="' + k + '"]', grid); });
    function tick() {
      var diff = Math.max(0, EVENT.getTime() - Date.now());
      var v = { d: Math.floor(diff / 864e5), h: Math.floor(diff / 36e5) % 24, m: Math.floor(diff / 6e4) % 60, s: Math.floor(diff / 1e3) % 60 };
      ['d', 'h', 'm', 's'].forEach(function (k) {
        var t = k === 'd' ? String(v.d) : pad(v[k]);
        if (nums[k].textContent !== t) nums[k].textContent = t;
        units[k].textContent = plural(v[k], UNITS[k]);
      });
      grid.setAttribute('aria-label', v.d + ' ' + plural(v.d, UNITS.d) + ' ' + v.h + ' ' + plural(v.h, UNITS.h));
      if (diff <= 0) {
        clearInterval(timer);
        var note = $('.aa-count__note'); if (note) note.textContent = C.countdown.done;
      }
    }
    var timer = setInterval(tick, 1000); tick();
  }

  /* --- слайдер галереи с индикаторами --- */
  function initSlider() {
    var track = $('.aa-slider__track'), dots = $('.aa-dots');
    if (!track || !dots) return;
    var slides = $$('.aa-slide', track);
    slides.forEach(function (s, i) {
      var b = doc.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Фото ' + (i + 1));
      b.addEventListener('click', function () {
        track.scrollTo({ left: s.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: RM ? 'auto' : 'smooth' });
      });
      dots.appendChild(b);
    });
    var btns = $$('button', dots);
    function setActive(i) { btns.forEach(function (b, k) { b.classList.toggle('is-active', k === i); b.setAttribute('aria-selected', k === i); }); }
    setActive(0);
    var raf = 0;
    track.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var pl = parseFloat(getComputedStyle(track).paddingLeft), best = 0, bd = 1e9;
        slides.forEach(function (s, i) { var d = Math.abs(s.offsetLeft - pl - track.scrollLeft); if (d < bd) { bd = d; best = i; } });
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = slides.length - 1;
        setActive(best);
      });
    }, { passive: true });
  }

  /* --- анкета: валидация, защита от двойной отправки, Google Sheets --- */
  function initForm() {
    var form = $('.aa-form');
    if (!form) return;
    var R = C.rsvp, btn = $('button[type="submit"]', form), status = $('.aa-form__status', form);
    var thanks = $('.aa-thanks'), sending = false, lastKey = '';
    try { lastKey = sessionStorage.getItem('aawed-rsvp') || ''; } catch (e) { /* приватный режим */ }

    function field(n) { return $('[data-f="' + n + '"]', form); }
    function validate() {
      var ok = true, name = form.elements.name.value.trim(), att = $('input[name="attendance"]:checked', form);
      field('name').classList.toggle('is-invalid', name.length < 2);
      field('attendance').classList.toggle('is-invalid', !att);
      if (name.length < 2) { ok = false; form.elements.name.focus(); }
      else if (!att) { ok = false; $('input[name="attendance"]', form).focus(); }
      return ok;
    }
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.aa-field'); if (f) f.classList.remove('is-invalid');
      status.textContent = '';
    });
    function showThanks() {
      form.hidden = true; thanks.hidden = false;
      $$('.aa-draw', thanks).forEach(function (d) { d.classList.add('is-in'); });
      thanks.focus({ preventScroll: true });
      var top = thanks.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: top, behavior: RM ? 'auto' : 'smooth' });
    }
    $('.aa-thanks__again', thanks).addEventListener('click', function () {
      form.reset(); form.hidden = false; thanks.hidden = true; form.elements.name.focus();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;                       // защита от двойного клика
      if (!validate()) return;
      var data = {
        name: form.elements.name.value.trim(),
        attendance: $('input[name="attendance"]:checked', form).value,
        drinks: $$('input[name="drinks"]:checked', form).map(function (i) { return i.value; }).join(', '),
        comment: form.elements.comment.value.trim(),
        sentAt: new Date().toISOString()
      };
      var key = [data.name.toLowerCase(), data.attendance, data.drinks, data.comment].join('|');
      if (form.elements.website.value) { showThanks(); return; }   // бот
      if (key === lastKey) { showThanks(); return; }                // та же анкета уже ушла

      sending = true; btn.disabled = true; btn.textContent = R.sending; status.textContent = '';
      function done() {
        sending = false; btn.disabled = false; btn.textContent = R.submit;
        lastKey = key; try { sessionStorage.setItem('aawed-rsvp', key); } catch (e2) { /* ok */ }
        showThanks();
      }
      function fail() {
        sending = false; btn.disabled = false; btn.textContent = R.submit; status.textContent = R.errorNetwork;
      }
      if (!R.formUrl) {
        // демо-режим: адрес таблицы ещё не указан в конфиге
        if (window.console) console.warn('[AAWED] rsvp.formUrl не задан — анкета не отправлена (демо).', data);
        setTimeout(done, 700); return;
      }
      var ctrl = window.AbortController ? new AbortController() : null;
      var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
      fetch(R.formUrl, {
        method: 'POST', mode: 'no-cors', body: new URLSearchParams(data), signal: ctrl ? ctrl.signal : undefined
      }).then(function () { clearTimeout(to); done(); }, function () { clearTimeout(to); fail(); });
    });
  }

  /* --- вход hero --- */
  function enterHero() {
    var h = $('.aa-hero');
    if (h) h.classList.add('is-entered');
  }

  /* --- 0. заставка: стирание вуали --- */
  function initSplash() {
    var sp = $('.aa-splash');
    if (!sp) { enterHero(); return; }
    doc.body.appendChild(sp);                 // поверх всего, вне колонки
    root.classList.add('aa-lock');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    var S0 = C.splash, cv = $('.aa-splash__veil', sp), ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, R = 30;
    var cell = 14, cols = 0, rows = 0, grid = null, cleared = 0, done = false, opened = false;
    var brush = doc.createElement('canvas');

    function makeBrush() {
      var s = Math.ceil(R * 2 * dpr);
      brush.width = brush.height = s;
      var b = brush.getContext('2d'), g = b.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.5, 'rgba(0,0,0,.95)'); g.addColorStop(.78, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      b.fillStyle = g; b.fillRect(0, 0, s, s);
    }
    function spaced(text, x, y, sp0) {   // капс с разрядкой, по центру
      var chars = text.split(''), wsum = 0;
      chars.forEach(function (c) { wsum += ctx.measureText(c).width; });
      var total = wsum + sp0 * (chars.length - 1), cx = x - total / 2;
      ctx.textAlign = 'left';
      chars.forEach(function (c) { ctx.fillText(c, cx, y); cx += ctx.measureText(c).width + sp0; });
    }
    function paint() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      R = Math.max(26, Math.min(46, W * .09)); makeBrush();
      // вуаль
      ctx.fillStyle = 'rgba(247,242,236,.86)'; ctx.fillRect(0, 0, W, H);
      var vg = ctx.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .2, W / 2, H / 2, Math.max(W, H) * .75);
      vg.addColorStop(0, 'rgba(247,242,236,.1)'); vg.addColorStop(1, 'rgba(233,225,216,.55)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      // зерно бумаги
      var n = doc.createElement('canvas'); n.width = n.height = 160;
      var nc = n.getContext('2d'), id = nc.createImageData(160, 160);
      for (var i = 0; i < id.data.length; i += 4) {
        var v = Math.random();
        id.data[i] = 74; id.data[i + 1] = 59; id.data[i + 2] = 51; id.data[i + 3] = v < .45 ? v * 40 : 0;
      }
      nc.putImageData(id, 0, 0);
      ctx.fillStyle = ctx.createPattern(n, 'repeat'); ctx.fillRect(0, 0, W, H);
      // волокна
      ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = .6;
      for (var k = 0; k < 90; k++) {
        var x = Math.random() * W, y = Math.random() * H, l = 6 + Math.random() * 16, a = Math.random() * Math.PI;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + Math.cos(a) * l * .5 + 3, y + Math.sin(a) * l * .5 - 3, x + Math.cos(a) * l, y + Math.sin(a) * l);
        ctx.stroke();
      }
      // текст на вуали
      var fs = Math.min(64, W * .15);
      ctx.font = '400 ' + fs + 'px "Florisel Script", cursive';
      while (ctx.measureText(S0.lineScript).width > W * .78 && fs > 40) { fs -= 2; ctx.font = '400 ' + fs + 'px "Florisel Script", cursive'; }
      ctx.fillStyle = '#9C7B6A'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      var ty = H * .42;
      ctx.fillText(S0.lineScript, W / 2 + fs * .12, ty);   // сдвиг: у заглавной росчерк влево
      ctx.font = '500 ' + Math.round(Math.min(19, W * .048)) + 'px Lora, Georgia, serif';
      ctx.fillStyle = '#4A3B33';
      spaced(S0.lineCaps.toUpperCase(), W / 2, ty + fs * .52 + 36, Math.min(19, W * .048) * .3);
      // сетка покрытия
      cols = Math.ceil(W / cell); rows = Math.ceil(H / cell);
      grid = new Uint8Array(cols * rows); cleared = 0;
    }

    function stamp(x, y) {
      ctx.drawImage(brush, x - R, y - R, R * 2, R * 2);
      var rr = R * .88, c0 = Math.max(0, Math.floor((x - rr) / cell)), c1 = Math.min(cols - 1, Math.floor((x + rr) / cell));
      var r0 = Math.max(0, Math.floor((y - rr) / cell)), r1 = Math.min(rows - 1, Math.floor((y + rr) / cell));
      for (var r = r0; r <= r1; r++) for (var c = c0; c <= c1; c++) {
        var dx = (c + .5) * cell - x, dy = (r + .5) * cell - y, idx = r * cols + c;
        if (!grid[idx] && dx * dx + dy * dy <= rr * rr) { grid[idx] = 1; cleared++; }
      }
    }
    var last = null, active = false;
    function pos(e) { var b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
    function line(p) {
      ctx.globalCompositeOperation = 'destination-out';
      if (!last) stamp(p[0], p[1]);
      else {
        var dx = p[0] - last[0], dy = p[1] - last[1], dist = Math.sqrt(dx * dx + dy * dy), step = R * .3;
        for (var t = step; t <= dist; t += step) stamp(last[0] + dx * t / dist, last[1] + dy * t / dist);
        stamp(p[0], p[1]);
      }
      last = p;
      if (!done && cleared / grid.length >= (S0.threshold || .52)) finish();
    }
    cv.addEventListener('pointerdown', function (e) {
      if (done) return;
      active = true; last = null; sp.classList.add('is-scratching');
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ok */ }
      line(pos(e)); e.preventDefault();
    });
    cv.addEventListener('pointermove', function (e) {
      if (!active || done) return;
      var ev = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      if (ev && ev.length) ev.forEach(function (c) { line(pos(c)); }); else line(pos(e));
      e.preventDefault();
    });
    function up() { active = false; last = null; }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up); cv.addEventListener('pointerleave', up);
    sp.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });

    function finish() {
      done = true; active = false;
      sp.classList.add('is-scratching');
      cv.style.opacity = '0';
      setTimeout(function () {
        sp.classList.add('is-revealed'); revealAt = Date.now();
        sp.setAttribute('tabindex', '0'); sp.setAttribute('role', 'button');
        sp.setAttribute('aria-label', S0.revealScript + ' ' + S0.revealHint);
        sp.focus({ preventScroll: true });
      }, RM ? 200 : 850);
    }
    function open() {
      if (opened) return;
      opened = true;
      sp.classList.add('is-opening');
      root.classList.remove('aa-lock');
      window.scrollTo(0, 0);
      setTimeout(enterHero, RM ? 0 : 350);
      setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, RM ? 700 : 1500);
    }
    // открываем только по новому тапу — не по отпусканию пальца после стирания
    var revealAt = 0, downAt = 0;
    sp.addEventListener('pointerdown', function () { downAt = Date.now(); }, true);
    sp.addEventListener('click', function (e) {
      if (e.target.closest('.aa-splash__skip')) return;
      if (sp.classList.contains('is-revealed') && downAt > revealAt) open();
    });
    sp.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && sp.classList.contains('is-revealed')) { e.preventDefault(); open(); }
    });
    $('.aa-splash__skip', sp).addEventListener('click', function () { if (!done) finish(); setTimeout(open, 50); });

    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      if (done || window.innerWidth === lastW) return;   // перерисовываем только при повороте
      lastW = window.innerWidth; paint();
    });

    var fontsReady = doc.fonts && doc.fonts.load
      ? Promise.race([
          Promise.all([doc.fonts.load('400 60px "Florisel Script"'), doc.fonts.load('500 18px Lora')]),
          new Promise(function (r) { setTimeout(r, 2500); })
        ])
      : Promise.resolve();
    ctx.fillStyle = 'rgba(247,242,236,.94)'; ctx.fillRect(0, 0, cv.width, cv.height);   // пока грузятся шрифты
    fontsReady.then(paint, paint);
  }

  /* --- фон по бокам и зерно --- */
  function initChrome() {
    doc.body.classList.add('aa-site');
    var g = doc.createElement('div'); g.className = 'aa-grain'; g.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(g);
    if (window.matchMedia('(min-width: 600px)').matches) {
      var b = doc.createElement('div'), u = C.photos.backdrop || C.photos.hero;
      b.className = 'aa-backdrop'; b.setAttribute('aria-hidden', 'true');
      if (u) b.innerHTML = '<img src="' + esc(isUnsplash(u) ? sized(u, 480) : u) + '" alt="" decoding="async">';
      doc.body.insertBefore(b, doc.body.firstChild);
    }
  }

  /* ========================================================================
     ЗАПУСК
     ======================================================================== */
  function boot() {
    var mounts = $$('.aa-mount');
    if (!mounts.length) return;
    mounts.forEach(function (m) {
      var html = '';
      (m.getAttribute('data-sections') || '').split(',').forEach(function (k) {
        k = k.trim();
        if (S[k]) html += S[k]();
      });
      m.innerHTML = html;
    });
    initChrome();
    initPhotos(doc);
    initDecor(doc);
    initSplash();
    initReveal(doc);
    initParallax();
    initCountdown();
    initSlider();
    initForm();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
