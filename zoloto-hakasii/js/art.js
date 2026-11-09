/* Векторные эскизы изделий.
   Это временные иллюстрации на месте предметной съёмки: когда появятся фотографии,
   замените вызов ZHArt.render() на <img> с фото. */

(function () {
  var counter = 0;
  function uid() { counter += 1; return 'zh' + counter + Math.random().toString(36).slice(2, 6); }
  function f(n) { return Math.round(n * 100) / 100; }

  /* ── Градиенты и фильтры ───────────────────────── */
  function defs(k, finish) {
    var metal = finish === 'aged'
      ? [[0, '#E2C47E'], [0.32, '#B98F47'], [0.68, '#7D5C2C'], [1, '#3A2A14']]
      : [[0, '#FAE7AE'], [0.3, '#E8C06C'], [0.64, '#C48E3D'], [1, '#83592A']];
    var edge = finish === 'aged'
      ? [[0, '#5E4521'], [0.5, '#9C763A'], [1, '#2E2210']]
      : [[0, '#9A6C2E'], [0.5, '#D7A855'], [1, '#6B4A20']];
    function stops(a) {
      return a.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('');
    }
    return '<defs>' +
      '<linearGradient id="' + k + 'm" x1="0" y1="0" x2="1" y2="1">' + stops(metal) + '</linearGradient>' +
      '<linearGradient id="' + k + 'e" x1="1" y1="0" x2="0" y2="1">' + stops(edge) + '</linearGradient>' +
      '<radialGradient id="' + k + 'h" cx=".32" cy=".26" r=".62">' +
        '<stop offset="0" stop-color="#FFF8E6" stop-opacity=".6"/><stop offset="1" stop-color="#FFF8E6" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + k + 'g" cx=".38" cy=".32" r=".72">' +
        '<stop offset="0" stop-color="#E77786"/><stop offset=".42" stop-color="#982636"/><stop offset="1" stop-color="#3A0A13"/></radialGradient>' +
      '<radialGradient id="' + k + 't" cx=".38" cy=".32" r=".72">' +
        '<stop offset="0" stop-color="#C4E7DD"/><stop offset=".45" stop-color="#6BA79D"/><stop offset="1" stop-color="#2A524C"/></radialGradient>' +
      '<filter id="' + k + 's" x="-30%" y="-30%" width="160%" height="170%">' +
        '<feDropShadow dx="0" dy="12" stdDeviation="11" flood-color="#120d06" flood-opacity=".32"/></filter>' +
      '</defs>';
  }

  /* ── Мотивы (координаты в поле 100×100, центр 50,50) ── */
  function spiral(cx, cy, r0, r1, turns, start) {
    var pts = [], steps = 90;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var a = start + t * turns * Math.PI * 2;
      var r = r0 + (r1 - r0) * t;
      pts.push(f(cx + Math.cos(a) * r) + ' ' + f(cy + Math.sin(a) * r));
    }
    return 'M' + pts.join(' L');
  }

  var MOTIFS = {
    sunhead: function () {
      var rays = '';
      for (var i = 0; i < 12; i++) {
        var a = (i / 12) * Math.PI * 2;
        rays += 'M' + f(50 + Math.cos(a) * 13) + ' ' + f(32 + Math.sin(a) * 13) +
                ' L' + f(50 + Math.cos(a) * (i % 2 ? 18 : 21)) + ' ' + f(32 + Math.sin(a) * (i % 2 ? 18 : 21)) + ' ';
      }
      return '<circle cx="50" cy="32" r="9"/><path d="M42 32 H58 M46 36.5 H54"/>' +
        '<path d="' + rays + '"/>' +
        '<path d="M50 41 V66 M33 45 Q42 55 50 50 Q58 55 67 45 M50 66 L42 81 M50 66 L58 81"/>';
    },
    mountains: function () {
      return '<path d="M8 66 L22 54 L30 59 L45 36 L55 51 L62 45 L76 59 L92 66"/>' +
        '<circle cx="70" cy="31" r="6"/><path d="M16 74 H84" stroke-dasharray="1 4"/>';
    },
    grain: function () {
      var g = [[50, 28, 0], [39, 42, -25], [61, 42, 25], [50, 55, 0], [36, 60, -35], [64, 60, 35], [50, 74, 0]];
      return g.map(function (p) {
        return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="5" ry="7.5" transform="rotate(' + p[2] + ' ' + p[0] + ' ' + p[1] + ')"/>';
      }).join('');
    },
    noon: function () {
      var rays = '';
      for (var i = 0; i < 16; i++) {
        var a = (i / 16) * Math.PI * 2, l = i % 2 ? 26 : 32;
        rays += 'M' + f(50 + Math.cos(a) * 17) + ' ' + f(50 + Math.sin(a) * 17) + ' L' + f(50 + Math.cos(a) * l) + ' ' + f(50 + Math.sin(a) * l) + ' ';
      }
      return '<circle cx="50" cy="50" r="11"/><path d="' + rays + '"/>';
    },
    deer: function () {
      return '<path d="M16 64 C24 52 50 50 68 54 C74 48 77 42 83 38 L92 41"/>' +
        '<path d="M16 64 C28 73 55 73 68 65 C72 61 70 57 68 54"/>' +
        '<path d="M29 71 L35 78 L44 76 M54 71 L60 78 L69 76"/>' +
        '<path d="M81 38 C71 27 57 25 44 32 M44 32 C38 32 34 37 37 42"/>' +
        '<path d="M70 30 C67 24 71 19 76 21 M60 27 C57 21 61 16 66 18 M50 28 C47 22 51 17 56 19"/>' +
        '<circle cx="84" cy="40.5" r="1.2"/>';
    },
    kurgan: function () {
      return '<path d="M27 27 H73 V73 H27 Z"/><path d="M37 37 H63 V63 H37 Z" stroke-dasharray="2 3"/>' +
        '<path d="M23 19 h8 v14 h-8 Z M69 19 h8 v14 h-8 Z M23 67 h8 v14 h-8 Z M69 67 h8 v14 h-8 Z"/>';
    },
    path: function () {
      return '<path d="M30 72 L50 59 L70 72 M30 57 L50 44 L70 57 M30 42 L50 29 L70 42"/>' +
        '<circle cx="50" cy="83" r="2"/><circle cx="50" cy="18" r="2"/>';
    },
    hearth: function () {
      return '<path d="M50 18 C61 33 67 45 59 57 C57 49 53 47 50 42 C48 50 42 53 42 61 C35 51 39 34 50 18 Z"/>' +
        '<path d="M26 74 L74 74 M33 80 L67 80 M30 66 L46 72 M70 66 L54 72"/>';
    },
    gates: function () {
      var rays = '';
      for (var i = 0; i < 10; i++) {
        var a = Math.PI + (i / 9) * Math.PI;
        rays += 'M' + f(50 + Math.cos(a) * 16) + ' ' + f(58 + Math.sin(a) * 16) + ' L' + f(50 + Math.cos(a) * 22) + ' ' + f(58 + Math.sin(a) * 22) + ' ';
      }
      return '<path d="M28 82 V38 M72 82 V38 M24 38 H76 M30 32 H70"/>' +
        '<circle cx="50" cy="58" r="10"/><path d="' + rays + '"/><path d="M16 82 H84"/>';
    },
    beast: function () {
      var d = spiral(50, 52, 33, 9, 1.55, -Math.PI / 2);
      return '<path d="' + d + '"/>' +
        '<path d="M50 19 C57 13 66 15 68 22 C64 25 58 25 54 22"/>' +
        '<circle cx="60" cy="19.5" r="1.4"/><path d="M53 15 L51 10 L56 13"/>' +
        '<circle cx="22" cy="58" r="3.4"/><circle cx="44" cy="84" r="3.4"/><circle cx="76" cy="66" r="3.4"/>';
    },
    seal: function () {
      return '<circle cx="50" cy="50" r="38" stroke-dasharray="1 3.2"/>' +
        '<path d="M50 20 V78 M50 40 L36 27 M50 40 L64 27 M38 78 H62"/><circle cx="50" cy="61" r="7"/>';
    },
    filigree: function () {
      var s = '';
      for (var i = 0; i < 8; i++) {
        var a = (i / 8) * Math.PI * 2;
        var x = 50 + Math.cos(a) * 24, y = 50 + Math.sin(a) * 24;
        s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="6.5"/>';
        s += '<path d="' + spiral(x, y, 4.5, 1, 1.2, a) + '"/>';
      }
      return s + '<circle cx="50" cy="50" r="12"/>';
    }
  };

  /* Где лежит камень внутри мотива (поле 100×100) */
  var STONE_AT = { kurgan: [50, 50], hearth: [50, 64], beast: [50, 52], filigree: [50, 50], gates: [50, 58], seal: [50, 61] };

  function inkFor(p) { return p.finish === 'aged' ? '#1E1913' : '#6E4A1C'; }

  function motifGroup(p, cx, cy, size, extraScaleY) {
    var fn = MOTIFS[p.motif] || MOTIFS.noon;
    var s = size / 100, sy = s * (extraScaleY || 1);
    var w = p.finish === 'aged' ? 2.6 : 1.9;
    return '<g transform="translate(' + f(cx - 50 * s) + ' ' + f(cy - 50 * sy) + ') scale(' + f(s) + ' ' + f(sy) + ')" ' +
      'fill="none" stroke="' + inkFor(p) + '" stroke-opacity="' + (p.finish === 'aged' ? 0.92 : 0.78) + '" ' +
      'stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round">' + fn() + '</g>';
  }

  function stone(k, type, cx, cy, r) {
    return '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r + 2.5) + '" fill="url(#' + k + 'e)"/>' +
      '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '" fill="url(#' + k + (type === 'turquoise' ? 't' : 'g') + ')"/>' +
      '<circle cx="' + f(cx - r * 0.35) + '" cy="' + f(cy - r * 0.38) + '" r="' + f(r * 0.28) + '" fill="#fff" fill-opacity=".45"/>';
  }

  function filigreeRim(k, cx, cy, R, n) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      s += '<circle cx="' + f(cx + Math.cos(a) * R) + '" cy="' + f(cy + Math.sin(a) * R) + '" r="' + f(R * 0.07) + '"/>';
    }
    return '<g fill="none" stroke="url(#' + k + 'e)" stroke-width="2">' + s + '</g>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(R * 0.9) + '" fill="none" stroke="url(#' + k + 'e)" stroke-width="1.2" stroke-dasharray="1.5 2.5"/>';
  }

  /* Медальон: диск + обод + мотив + камни + блик */
  function medallion(p, k, cx, cy, R) {
    var out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#' + k + 'm)" filter="url(#' + k + 's)"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(R - 1.5) + '" fill="none" stroke="url(#' + k + 'e)" stroke-width="3"/>';
    var inner = R * (p.filigree ? 0.72 : 0.86);
    if (p.filigree) out += filigreeRim(k, cx, cy, R * 0.84, 22);
    else out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(R * 0.88) + '" fill="none" stroke="' + inkFor(p) + '" stroke-opacity=".28" stroke-width="1"/>';
    out += motifGroup(p, cx, cy, inner * 2 * 0.92);
    var at = STONE_AT[p.motif];
    if (p.stones.length && at) {
      var s = inner * 2 * 0.92 / 100;
      out += stone(k, p.stones[0], cx + (at[0] - 50) * s, cy + (at[1] - 50) * s, R * 0.09);
    }
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#' + k + 'h)"/>';
    return out;
  }

  /* ── Типы изделий (поле 400×400) ───────────────── */
  function pendant(p, k) {
    var cx = 200, R = p.filigree ? 104 : 90, cy = 226;
    var top = cy - R - 26;
    return '<path d="M104 -6 C136 60 176 ' + (top - 10) + ' 200 ' + (top + 4) + ' M296 -6 C264 60 224 ' + (top - 10) + ' 200 ' + (top + 4) + '" ' +
      'fill="none" stroke="url(#' + k + 'e)" stroke-width="2.4" stroke-dasharray="4 2.4" stroke-linecap="round"/>' +
      '<rect x="190" y="' + top + '" width="20" height="30" rx="10" fill="none" stroke="url(#' + k + 'm)" stroke-width="5.5"/>' +
      medallion(p, k, cx, cy, R);
  }

  function ring(p, k) {
    var out = '<g filter="url(#' + k + 's)">' +
      '<ellipse cx="200" cy="250" rx="114" ry="60" fill="none" stroke="url(#' + k + 'e)" stroke-width="' + (p.ringStyle === 'band' ? 18 : 24) + '"/>' +
      '<path d="M86 250 A114 60 0 0 0 314 250" fill="none" stroke="url(#' + k + 'm)" stroke-width="' + (p.ringStyle === 'band' ? 20 : 26) + '"/>' +
      '</g>';
    if (p.ringStyle === 'band') {
      out += '<path d="M128 296 L150 289 L162 292 L181 279 L194 287 L204 283 L222 291 L246 294 L272 296" fill="none" stroke="' + inkFor(p) + '" stroke-opacity=".75" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M100 268 A114 60 0 0 0 300 268" fill="none" stroke="#FFF6DC" stroke-opacity=".45" stroke-width="2"/>';
    } else {
      var cy = 182, rx = p.filigree ? 66 : 56, ry = p.filigree ? 50 : 42;
      out += '<path d="M' + (200 - rx + 10) + ' ' + (cy + 18) + ' C' + (200 - rx + 6) + ' 235 150 238 150 238 M' + (200 + rx - 10) + ' ' + (cy + 18) + ' C' + (200 + rx - 6) + ' 235 250 238 250 238" fill="none" stroke="url(#' + k + 'm)" stroke-width="16"/>' +
        '<ellipse cx="200" cy="' + (cy + 8) + '" rx="' + rx + '" ry="' + ry + '" fill="url(#' + k + 'e)"/>' +
        '<ellipse cx="200" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#' + k + 'm)"/>';
      if (p.filigree) {
        var fs = '';
        for (var i = 0; i < 20; i++) {
          var a = (i / 20) * Math.PI * 2;
          fs += '<circle cx="' + f(200 + Math.cos(a) * rx * 0.86) + '" cy="' + f(cy + Math.sin(a) * ry * 0.86) + '" r="3.2"/>';
        }
        out += '<g fill="none" stroke="url(#' + k + 'e)" stroke-width="1.6">' + fs + '</g>';
      }
      var size = rx * (p.filigree ? 1.5 : 1.7);
      var sy = ry / rx;
      out += motifGroup(p, 200, cy, size, sy);
      var at = STONE_AT[p.motif];
      if (p.stones.length && at) {
        var s = size / 100;
        out += stone(k, p.stones[0], 200 + (at[0] - 50) * s, cy + (at[1] - 50) * s * sy, 6.5);
      }
      out += '<ellipse cx="200" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#' + k + 'h)"/>';
    }
    return out;
  }

  function earrings(p, k) {
    var out = '';
    [128, 272].forEach(function (x, idx) {
      var y0 = 44, dir = idx ? -1 : 1;
      out += '<path d="M' + x + ' 108 C' + x + ' 70 ' + (x + 30 * dir) + ' ' + y0 + ' ' + (x + 8 * dir) + ' ' + (y0 - 6) + '" fill="none" stroke="url(#' + k + 'e)" stroke-width="3.2" stroke-linecap="round"/>' +
        '<circle cx="' + x + '" cy="114" r="7" fill="none" stroke="url(#' + k + 'm)" stroke-width="3.5"/>';
      if (p.motif === 'grain') {
        [[150, 13, 19], [192, 14, 20], [236, 15, 21]].forEach(function (g, i) {
          var rot = (i - 1) * 8 * dir;
          out += '<ellipse cx="' + x + '" cy="' + g[0] + '" rx="' + g[1] + '" ry="' + g[2] + '" transform="rotate(' + rot + ' ' + x + ' ' + g[0] + ')" fill="url(#' + k + 'm)" filter="url(#' + k + 's)"/>' +
            '<ellipse cx="' + x + '" cy="' + g[0] + '" rx="' + g[1] + '" ry="' + g[2] + '" transform="rotate(' + rot + ' ' + x + ' ' + g[0] + ')" fill="url(#' + k + 'h)"/>' +
            '<path d="M' + x + ' ' + (g[0] - g[2] + 6) + ' Q' + (x + 3) + ' ' + g[0] + ' ' + x + ' ' + (g[0] + g[2] - 6) + '" fill="none" stroke="' + inkFor(p) + '" stroke-opacity=".35" stroke-width="1" transform="rotate(' + rot + ' ' + x + ' ' + g[0] + ')"/>';
        });
      } else {
        var R = p.filigree ? 56 : 48, cy = 121 + R + 4;
        var q = { motif: p.motif, finish: p.finish, filigree: p.filigree, stones: p.stones.length > 1 ? [p.stones[idx % 2]] : p.stones };
        out += medallion(q, k, x, cy, R);
        if (p.stones.length > 1) out += stone(k, p.stones[(idx + 1) % 2], x, cy + R + 16, 9);
      }
    });
    return out;
  }

  function bracelet(p, k) {
    var cx = 200, cy = 200, rx = 140, ry = 74;
    function pt(deg) { var a = deg * Math.PI / 180; return [f(cx + Math.cos(a) * rx), f(cy + Math.sin(a) * ry)]; }
    var s = pt(102), e = pt(78);
    var l = pt(180), r = pt(0);
    var out = '<g filter="url(#' + k + 's)">' +
      '<path d="M' + r[0] + ' ' + r[1] + ' A' + rx + ' ' + ry + ' 0 0 0 ' + l[0] + ' ' + l[1] + '" fill="none" stroke="url(#' + k + 'e)" stroke-width="9"/>' +
      '<path d="M' + l[0] + ' ' + l[1] + ' A' + rx + ' ' + ry + ' 0 0 0 ' + s[0] + ' ' + s[1] + '" fill="none" stroke="url(#' + k + 'm)" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + e[0] + ' ' + e[1] + ' A' + rx + ' ' + ry + ' 0 0 0 ' + r[0] + ' ' + r[1] + '" fill="none" stroke="url(#' + k + 'm)" stroke-width="10" stroke-linecap="round"/>' +
      '</g>';
    [s, e].forEach(function (c) {
      out += medallion({ motif: 'noon', finish: p.finish, stones: [] }, k, c[0], c[1] + 4, 20);
    });
    return out;
  }

  function necklace(p, k) {
    function bez(t) {
      var x = Math.pow(1 - t, 3) * 34 + 3 * Math.pow(1 - t, 2) * t * 70 + 3 * (1 - t) * t * t * 330 + t * t * t * 366;
      var y = Math.pow(1 - t, 3) * -6 + 3 * Math.pow(1 - t, 2) * t * 222 + 3 * (1 - t) * t * t * 222 + t * t * t * -6;
      return [f(x), f(y)];
    }
    var out = '<path d="M34 -6 C70 222 330 222 366 -6" fill="none" stroke="url(#' + k + 'e)" stroke-width="2.6" stroke-dasharray="4 2.4"/>';
    [0.18, 0.32, 0.68, 0.82].forEach(function (t, i) {
      var c = bez(t);
      out += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="11" fill="url(#' + k + 'm)"/>' +
        filigreeRim(k, c[0], c[1], 8, 10) +
        (i % 2 ? stone(k, 'turquoise', c[0], c[1], 3.5) : '');
    });
    var mid = bez(0.5);
    out += '<rect x="192" y="' + (mid[1] - 4) + '" width="16" height="22" rx="8" fill="none" stroke="url(#' + k + 'm)" stroke-width="4.5"/>' +
      medallion(p, k, 200, mid[1] + 18 + 74, 74);
    return out;
  }

  function detail(p, k) {
    var q = { motif: p.motif, finish: p.finish, filigree: p.filigree, stones: p.stones.slice(0, 1) };
    return medallion(q, k, 200, 200, 160);
  }

  function qr(x, y, size, seed) {
    var n = 21, c = size / n, out = '', s = seed;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    function finder(fx, fy) {
      return '<rect x="' + f(x + fx * c) + '" y="' + f(y + fy * c) + '" width="' + f(7 * c) + '" height="' + f(7 * c) + '" fill="#2B2B2B"/>' +
        '<rect x="' + f(x + (fx + 1) * c) + '" y="' + f(y + (fy + 1) * c) + '" width="' + f(5 * c) + '" height="' + f(5 * c) + '" fill="#F7F2E7"/>' +
        '<rect x="' + f(x + (fx + 2) * c) + '" y="' + f(y + (fy + 2) * c) + '" width="' + f(3 * c) + '" height="' + f(3 * c) + '" fill="#2B2B2B"/>';
    }
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var inFinder = (i < 8 && j < 8) || (i > 12 && j < 8) || (i < 8 && j > 12);
      if (!inFinder && rnd() > 0.52) out += '<rect x="' + f(x + i * c) + '" y="' + f(y + j * c) + '" width="' + f(c + 0.2) + '" height="' + f(c + 0.2) + '" fill="#2B2B2B"/>';
    }
    return out + finder(0, 0) + finder(14, 0) + finder(0, 14);
  }

  function card(p, k) {
    var seed = 0;
    for (var i = 0; i < p.id.length; i++) seed = (seed * 31 + p.id.charCodeAt(i)) % 233280;
    var lines = '';
    [196, 210, 224, 238, 252].forEach(function (y, i) {
      lines += '<path d="M112 ' + y + ' H' + (i === 4 ? 230 : 288) + '" stroke="#6B5341" stroke-opacity=".35" stroke-width="2"/>';
    });
    return '<g filter="url(#' + k + 's)"><rect x="88" y="52" width="224" height="300" fill="#F7F2E7"/></g>' +
      '<rect x="98" y="62" width="204" height="280" fill="none" stroke="#D4A24F" stroke-width=".8"/>' +
      '<path d="M128 108 L146 96 L154 101 L170 82 L182 96 L190 91 L206 102 L228 110" fill="none" stroke="#D4A24F" stroke-width="1.2" transform="translate(22 0)"/>' +
      '<text x="200" y="146" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="17" letter-spacing="3" fill="#2B2B2B">' + p.name.toUpperCase() + '</text>' +
      '<text x="200" y="168" text-anchor="middle" font-family="Manrope, sans-serif" font-size="8" letter-spacing="2.4" fill="#6B5341">ЛЕГЕНДА ИЗДЕЛИЯ</text>' +
      lines +
      qr(176, 276, 48, seed || 7);
  }

  var TYPES = { pendant: pendant, ring: ring, earrings: earrings, bracelet: bracelet, necklace: necklace };

  window.ZHArt = {
    render: function (p, view) {
      var k = uid();
      var body = view === 'detail' ? detail(p, k) : view === 'card' ? card(p, k) : (TYPES[p.type] || pendant)(p, k);
      var label = p.kind + ' «' + p.name + '»' + (view === 'detail' ? ', крупный план' : view === 'card' ? ', карточка с легендой' : '');
      return '<svg viewBox="0 0 400 400" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + defs(k, p.finish) + body + '</svg>';
    }
  };
})();
