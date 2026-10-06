/* with icons — the icon library (icons.html).
   Vanilla JS, no build, no fetch. Data arrives through plain <script> tags:
     data/meta.js            window.WITH
     data/style-<name>.js    window.WITH_SVG[style][icon] = '<inner svg markup>'
     vendor/with/search.js   window.WithSearch  +  data/search-index.js  window.WITH_SEARCH_INDEX
   Works from file:// and any static host. Pieces:
     search (shared engine, reasons, corrections) · a windowed grid of identical tiles (S/M/L) ·
     compare-all-styles (2,100 tiles, windowed) · the details viewer (docked + resizable side panel on desktop,
     full-screen mode, gesture bottom sheet on phones) · copy / drag / PNG / SVG / ZIP. */
(function () {
  'use strict'
  var W = window, D = document, HTML = D.documentElement
  var META = W.WITH
  if (!META || !META.icons) { HTML.classList.add('lib-nodata'); return }

  /* ───────────────────────── helpers ───────────────────────── */
  var $ = function (s, r) { return (r || D).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)) }
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  var cap = function (s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1) }
  var pascal = function (n) { return n.split(/[-_\s]+/).filter(Boolean).map(cap).join('') }
  var TITLE_WORDS = { qr: 'QR', id: 'ID', cpu: 'CPU', pdf: 'PDF', rss: 'RSS', tv: 'TV', ccw: 'CCW', cw: 'CW', wifi: 'Wi-Fi', x: 'X' }
  var titleOf = function (n) { return n.split('-').map(function (w) { return TITLE_WORDS[w] || cap(w) }).join(' ') }
  var fmt = function (n) { return n.toLocaleString('en-US') }
  var raf = function (f) { return W.requestAnimationFrame(f) }
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)) }
  var reduced = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches)
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('with-lib:' + k); return v == null ? d : JSON.parse(v) } catch (e) { return d } },
    set: function (k, v) { try { localStorage.setItem('with-lib:' + k, JSON.stringify(v)) } catch (e) { /* private mode */ } },
  }
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[_]+/g, ' ').trim() }
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  var WI = function () { return W.WI || W.EG || null }
  var mq = function (q) { return !!(W.matchMedia && W.matchMedia(q).matches) }
  var isSheet = function () { return mq('(max-width: 899px)') }
  var isPhone = function () { return mq('(max-width: 640px)') }

  /* ───────────────────────── data ───────────────────────── */
  // the contract order (forge/CONTRACT.md); styles the data adds later sort after these, missing ones are skipped
  var ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
  var rankOf = function (n) { var i = ORDER.indexOf(n); return i < 0 ? 99 : i }
  var STYLES = META.styles.slice().sort(function (a, b) { return rankOf(a.name) - rankOf(b.name) })
  var STYLE = {}; STYLES.forEach(function (s) { STYLE[s.name] = s })
  var SNAMES = STYLES.map(function (s) { return s.name })
  // how the switchers group them (same five families as the home page and icon pages)
  var GROUPS = [
    { id: 'everyday', title: 'Everyday', styles: ['line', 'solid', 'duo'] },
    { id: 'crafted', title: 'Crafted', styles: ['gloss', 'engrave', 'blueprint', 'sketch'] },
    { id: 'playful', title: 'Playful', styles: ['glass', 'kawaii', 'sticker', 'pixel', 'retro'] },
    { id: 'studio', title: 'Studio', styles: ['luxe', 'bauhaus', 'skeuo'] },
    { id: 'storybook', title: 'Storybook', styles: ['anime', 'gothic', 'pastel', 'coquette', 'plush'], isNew: true },
  ].map(function (g) { return { id: g.id, title: g.title, isNew: g.isNew, styles: g.styles.filter(function (n) { return STYLE[n] }) } })
  SNAMES.forEach(function (n) { if (!GROUPS.some(function (g) { return g.styles.indexOf(n) >= 0 })) GROUPS[GROUPS.length - 1].styles.push(n) })
  GROUPS = GROUPS.filter(function (g) { return g.styles.length })
  var GROUP_OF = {}; GROUPS.forEach(function (g) { g.styles.forEach(function (n) { GROUP_OF[n] = g }) })
  var ICONS = META.icons
  var BY = {}; ICONS.forEach(function (ic, i) { ic.i = i; ic.title = ic.title || titleOf(ic.name); BY[ic.name] = ic })
  var CATS = (META.categories || []).slice()
  ICONS.forEach(function (ic) { if (CATS.indexOf(ic.category) < 0) CATS.push(ic.category) })
  // a category is listed once it has icons (new ones are announced in the data before their icons land)
  CATS = CATS.filter(function (c) { return ICONS.some(function (ic) { return ic.category === c }) })
  var CAT_RANK = {}; CATS.forEach(function (c, i) { CAT_RANK[c] = i })
  var BROWSE = ICONS.slice().sort(function (a, b) { return (CAT_RANK[a.category] - CAT_RANK[b.category]) || (a.name < b.name ? -1 : 1) })
  var HEX = { line: '#2F5BFF', solid: '#FF5A36', duo: '#7252FF', gloss: '#FF4FA3', engrave: '#C9962B', blueprint: '#00A3C4', sketch: '#22A861', glass: '#5B9DFF', kawaii: '#FF7A9A', sticker: '#B57CFF', pixel: '#4FAE0C', retro: '#F57C12', luxe: '#2B3FB8', bauhaus: '#D62718', skeuo: '#5A6E86', anime: '#2E9BF0', gothic: '#7A1F3D', pastel: '#3DBFA0', coquette: '#E2456F', plush: '#F2AE24' }
  var SAY = { line: 'Clean outlines for apps, sites and slides', solid: 'Bold filled shapes that read from afar', duo: 'An outline over a soft tint', gloss: 'Puffy, shiny and toy-like', engrave: 'Fine banknote-style engraving', blueprint: 'A technical drawing with guides', sketch: 'Hand-drawn marker lines', glass: 'Layers of frosted glass', kawaii: 'Chubby and cute, with a tiny face', sticker: 'A shiny die-cut sticker', pixel: 'Crisp pixel art', retro: 'Chunky 70s sunset stripes', luxe: 'Premium layered 3D with gold trim', bauhaus: 'Pure geometry in the Bauhaus primaries', skeuo: 'Real materials, bevels and depth', anime: 'Anime cel shading with sparkling highlights', gothic: 'Cathedral stone and stained glass', pastel: 'Soft, dreamy candy pastels', coquette: 'Blush pink, satin bows and pearls', plush: 'Soft felt toys with stitched seams' }
  var sayOf = function (st) { var wi = W.WI && W.WI.styleInfo && W.WI.styleInfo[st]; return SAY[st] || (wi && wi.description && wi.description.replace(/\.$/, '')) || (STYLE[st] && STYLE[st].description) || '' }
  var INK = '#111318', PAPER = '#FBF8F3'
  var styleHex = function (st) { return HEX[st] || INK }
  var CLASH = { Map: 1, Image: 1, History: 1, File: 1, Link: 1, Navigation: 1, Clipboard: 1, Keyboard: 1, Bluetooth: 1, Screen: 1, Option: 1, Text: 1, Location: 1, Range: 1, Selection: 1, Notification: 1, Set: 1, Date: 1, Error: 1, Symbol: 1, Proxy: 1, Worker: 1, Lock: 1, Headers: 1, Request: 1, Response: 1 }
  var comp = function (n) { var p = pascal(n); return CLASH[p] ? p + 'Icon' : p }
  var CAT_ICON = { navigation: 'home', arrows: 'arrow-up-right', actions: 'pencil', status: 'check-circle', media: 'play', files: 'file', communication: 'mail', users: 'user', commerce: 'shopping-cart', time: 'clock', devices: 'smartphone', layout: 'layout-grid', text: 'type', maps: 'map-pin', development: 'code', security: 'lock', charts: 'chart-bar', weather: 'sun', objects: 'gift', food: 'pizza', health: 'stethoscope', education: 'graduation-cap', nature: 'leaf', home: 'sofa', travel: 'luggage', sports: 'trophy' }
  function catIcon(c) { var n = CAT_ICON[c]; if (n && BY[n]) return n; for (var i = 0; i < BROWSE.length; i++) if (BROWSE[i].category === c) return BROWSE[i].name; return ICONS[0].name }
  var numericSW = function (st) { return !!(STYLE[st] && typeof STYLE[st].strokeWidth === 'number') }

  function svgMap(st) { var a = W.WITH_SVG; return (a && a[st]) || null }
  // one icon in every style (data/by-icon/<name>.js, window.WITH_ICON): the viewer, hover card, copies and downloads use it,
  // so opening an icon costs one small file instead of 20 style files (those stay for switching the grid's style)
  function innerOf(st, name) { var m = svgMap(st); if (m && m[name] != null) return m[name]; var p = W.WITH_ICON && W.WITH_ICON[name]; return p && p[st] != null ? p[st] : null }
  function has(st, name) { return innerOf(st, name) != null }
  var iconLoading = {}
  function loadIcon(name) {
    if (!BY[name]) return Promise.resolve(false)
    if (W.WITH_ICON && W.WITH_ICON[name]) return Promise.resolve(true)
    if (iconLoading[name]) return iconLoading[name]
    return (iconLoading[name] = new Promise(function (res) {
      var el = D.createElement('script'); el.src = 'data/by-icon/' + name + '.js'; el.async = true
      el.onload = el.onerror = function () { res(!!(W.WITH_ICON && W.WITH_ICON[name])); if (W.WITH_ICON && W.WITH_ICON[name]) iconHooks.forEach(function (fn) { try { fn(name) } catch (e) { } }) }
      D.head.appendChild(el)
    }))
  }
  var iconHooks = []
  // a drawing for (st, name): the icon pack when the style file isn't there
  function ensure(st, name) { return has(st, name) ? Promise.resolve(true) : loadIcon(name).then(function () { return has(st, name) || loadStyle(st) }) }
  var loading = {}
  function loadStyle(st) {
    if (!STYLE[st]) return Promise.resolve(false)
    if (svgMap(st)) return Promise.resolve(true)
    if (loading[st]) return loading[st]
    loading[st] = new Promise(function (res) {
      var el = D.querySelector('script[data-with-style="' + st + '"]')
      if (el && el.hasAttribute('data-done')) { res(); return }
      if (!el) { el = D.createElement('script'); el.src = 'data/style-' + st + '.js'; el.async = true; el.setAttribute('data-with-style', st); D.head.appendChild(el) }
      el.addEventListener('load', function () { el.setAttribute('data-done', ''); res() }); el.addEventListener('error', function () { el.setAttribute('data-done', ''); res() })
    }).then(function () { var ok = !!svgMap(st); if (ok) onStyleLoaded(st); return ok })
    return loading[st]
  }
  function loadAll() { return Promise.all(SNAMES.map(loadStyle)) }
  var styleHooks = []
  function onStyleLoaded(st) { styleHooks.forEach(function (f) { try { f(st) } catch (e) { if (W.console) console.error(e) } }) }
  // Every style file is 0.1-1.5 MB of JS (8 MB together). Only desktop-class devices on a normal connection fetch them
  // all in the background; phones, tablets and Save-Data fetch a style when it is needed or the visitor reaches for it.
  // navigator.connection only exists in Chromium, so the hover/pointer check is the main gate.
  function lowData() { var c = navigator.connection; return !!(c && (c.saveData || /2g/.test(c.effectiveType || ''))) }
  function richDevice() { return !lowData() && mq('(hover: hover) and (pointer: fine)') }
  function idleLoadRest(force) {
    if ((!force && !richDevice()) || idleLoadRest.on) return
    idleLoadRest.on = true
    var rest = SNAMES.filter(function (n) { return !svgMap(n) })
    rest.sort(function (a, b) { return (snapOf(a) ? 1 : 0) - (snapOf(b) ? 1 : 0) })
    var idle = W.requestIdleCallback ? function (f) { W.requestIdleCallback(f, { timeout: 2500 }) } : function (f) { setTimeout(f, 300) }
    ;(function next() { var n = rest.shift(); if (n) idle(function () { loadStyle(n).then(next) }) })()
  }

  /* ───────────────────────── markup ───────────────────────── */
  var DRAWABLE = { line: 1, duo: 1, sketch: 1, engrave: 1 }
  var ROOT_ATTR = {}
  STYLES.forEach(function (s) {
    ROOT_ATTR[s.name] = Object.keys(s.root || {}).filter(function (k) { var v = s.root[k]; return v !== false && v != null && !/^(width|height|viewBox|xmlns|class)$/.test(k) })
      .map(function (k) { return ' ' + k + '="' + esc(s.root[k]) + '"' }).join('')
  })
  var gCache = {}
  // cached markup for tiles; stroke overrides are applied through the --l-sw CSS variable (class "sw")
  function glyph(st, name) {
    var key = st + '|' + name
    if (gCache[key]) return gCache[key]
    var inner = innerOf(st, name)
    if (inner == null) return svgMap(st) ? '<span class="t-skel is-missing" aria-hidden="true"></span>' : '<span class="t-skel" aria-hidden="true"></span>'
    if (DRAWABLE[st] && inner.indexOf('dasharray') < 0) inner = inner.replace(/<(path|circle|line|rect|ellipse|polyline|polygon)\b(?![^>]*\bfill="(?!none))/g, '<$1 pathLength="1"')
    return (gCache[key] = '<svg viewBox="0 0 24 24"' + ROOT_ATTR[st] + (numericSW(st) ? ' class="sw"' : '') + ' aria-hidden="true" focusable="false">' + inner + '</svg>')
  }
  function rawInner(st, name) { return innerOf(st, name) || '' }
  // var(--x, fallback) -> fallback (nested too); a bare var(--x) -> currentColor
  function resolveVars(s) { var prev; do { prev = s; s = s.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1').replace(/var\(\s*--[\w-]+\s*\)/g, 'currentColor') } while (s !== prev); return s }
  // Standalone SVG. mode 'code' keeps currentColor + CSS hooks (for developers); 'file' bakes the chosen colour in.
  // o.resolve (code mode, for apps): every var() resolved to its colour, currentColor kept (see appSvg).
  function svgText(st, name, o) {
    o = o || {}
    var s = STYLE[st], root = { xmlns: 'http://www.w3.org/2000/svg', width: o.px || 24, height: o.px || 24, viewBox: '0 0 24 24' }
    Object.keys(s.root || {}).forEach(function (k) { root[k] = s.root[k] })
    if (numericSW(st) && S.sw != null) root['stroke-width'] = S.sw
    var inner = rawInner(st, name)
    var cz = o.mode === 'file' ? edColors(st, name) : null
    if (cz) {
      // every colour the visitor picked for the open icon, baked in (var(--with-x, d) -> hex, currentColor -> ink)
      inner = ED.bakeColors(inner, cz)
      if (cz.ink) Object.keys(root).forEach(function (k) { if (typeof root[k] === 'string') root[k] = root[k].replace(/currentColor/g, cz.ink) })
    }
    if (o.mode === 'file') {
      var c = o.color || INK
      inner = resolveVars(inner).replace(/currentColor/g, c)
      Object.keys(root).forEach(function (k) { if (typeof root[k] === 'string') root[k] = resolveVars(root[k]).replace(/currentColor/g, c) })
    } else if (o.resolve) {
      inner = resolveVars(inner)
      Object.keys(root).forEach(function (k) { if (typeof root[k] === 'string') root[k] = resolveVars(root[k]) })
    }
    var a = Object.keys(root).filter(function (k) { return root[k] !== false && root[k] != null }).map(function (k) { return ' ' + k + '="' + esc(root[k]) + '"' }).join('')
    if (o.bg) {
      // background tile: the icon sits at 72% inside a rounded square
      var attrs = Object.keys(s.root || {}).map(function (k) { var v = root[k]; return v == null || v === false ? '' : ' ' + k + '="' + esc(v) + '"' }).join('')
      // the backdrop's shape and padding come from the viewer's Background panel (rounded tile by default)
      var pad = clamp(V.pad, 0, 0.3), sc = +(1 - 2 * pad).toFixed(4), off = +(24 * pad).toFixed(3), rx = V.shape === 'circle' ? 12 : V.shape === 'square' ? 0 : 5.5
      return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (o.px || 24) + '" height="' + (o.px || 24) + '" viewBox="0 0 24 24"><rect width="24" height="24" rx="' + rx + '" fill="' + o.bg + '"/><g transform="translate(' + off + ' ' + off + ') scale(' + sc + ')"' + attrs + '>' + inner + '</g></svg>'
    }
    if (o.pretty) return '<svg' + a + '>\n  ' + inner.replace(/><(?!\/)/g, '>\n  <') + '\n</svg>'
    return '<svg' + a + '>' + inner + '</svg>'
  }
  // inline svg for the viewer (currentColor, live stroke width)
  function svgInline(st, name, cls) {
    var inner = rawInner(st, name)
    if (!inner) return '<span class="t-skel" aria-hidden="true"></span>'
    var attrs = ROOT_ATTR[st]
    if (numericSW(st) && S.sw != null) attrs = attrs.replace(/stroke-width="[^"]*"/, 'stroke-width="' + S.sw + '"')
    return '<svg viewBox="0 0 24 24"' + attrs + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true" focusable="false">' + inner + '</svg>'
  }

  /* ───────────────────────── search engine ───────────────────────── */
  var engine = null
  function getEngine() {
    if (engine) return engine
    if (W.WithSearch && W.WITH_SEARCH_INDEX) { try { engine = W.WithSearch.create(W.WITH_SEARCH_INDEX); engine.isShared = true } catch (e) { engine = null } }
    return engine || (engine = fallbackEngine())
  }
  // Same shape as WithSearch: used only until vendor/with/search.js is present.
  function fallbackEngine() {
    var docs = ICONS.map(function (ic) {
      return { ic: ic, name: norm(ic.name).replace(/-/g, ' '), al: (ic.aliases || []).map(norm), sy: (ic.synonyms || []).map(norm), tg: (ic.tags || []).map(norm), cat: norm(ic.category), desc: norm(ic.description) }
    })
    function lev(a, b, max) {
      if (Math.abs(a.length - b.length) > max) return max + 1
      var prev = [], cur = [], i, j
      for (j = 0; j <= b.length; j++) prev[j] = j
      for (i = 1; i <= a.length; i++) {
        cur = [i]; var best = i
        for (j = 1; j <= b.length; j++) { cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (cur[j] < best) best = cur[j] }
        if (best > max) return max + 1
        prev = cur
      }
      return prev[b.length]
    }
    function termScore(q, d) {
      var best = null
      function hit(score, field, term, typo) { if (!best || score > best.score) best = { score: score, field: field, term: term, typo: !!typo } }
      if (d.name === q) hit(100, 'name', d.ic.name)
      else if (d.name.indexOf(q) === 0) hit(90, 'name', d.ic.name)
      else if ((' ' + d.name).indexOf(' ' + q) >= 0) hit(82, 'name', d.ic.name)
      ;[['alias', d.al, 78], ['synonym', d.sy, 72], ['tag', d.tg, 58]].forEach(function (L) {
        L[1].forEach(function (t) {
          if (t === q) hit(L[2], L[0], t)
          else if (t.indexOf(q) === 0 && q.length >= 2) hit(L[2] - 12, L[0], t)
          else if (q.length >= 3 && (' ' + t).indexOf(' ' + q) >= 0) hit(L[2] - 18, L[0], t)
        })
      })
      if (d.cat === q || (q.length >= 3 && d.cat.indexOf(q) === 0)) hit(44, 'category', d.ic.category)
      if (q.length >= 3 && (' ' + d.desc).indexOf(' ' + q) >= 0) hit(22, 'description', d.ic.description)
      if (!best && q.length >= 4) {
        var nw = d.name.split(' '), words = nw.concat(d.al, d.sy)
        for (var k = 0; k < words.length; k++) { var mx = q.length > 6 ? 2 : 1; if (lev(q, words[k], mx) <= mx) { hit(k < nw.length ? 50 : 40, k < nw.length ? 'name' : 'alias', k < nw.length ? d.ic.name : words[k], true); break } }
      }
      return best
    }
    return {
      search: function (query, o) {
        o = o || {}
        var q = norm(query).replace(/-/g, ' ')
        if (!q) return []
        var toks = q.split(/\s+/).filter(Boolean), out = []
        docs.forEach(function (d) {
          if (o.category && d.ic.category !== o.category) return
          var whole = termScore(q, d), score = 0, match = null
          if (whole) { score = whole.score + 10; match = whole }
          else if (toks.length > 1) {
            for (var k = 0; k < toks.length; k++) { var r = termScore(toks[k], d); if (!r) { score = 0; break } score += r.score / toks.length; if (!match || r.score > match.score) match = r }
          }
          if (score > 0) out.push({ name: d.ic.name, title: d.ic.title, category: d.ic.category, score: score, match: { field: match.field, term: match.term, typo: match.typo } })
        })
        out.sort(function (a, b) { return b.score - a.score || (a.name < b.name ? -1 : 1) })
        return o.limit ? out.slice(0, o.limit) : out
      },
      suggest: function (query, n) {
        var q = norm(query).replace(/-/g, ' '); if (!q) return []
        var scored = []
        docs.forEach(function (d) {
          var best = 99
          ;[d.name].concat(d.al, d.sy).forEach(function (t) { var v = lev(q, t, 4); if (v < best) best = v })
          if (best <= Math.max(2, Math.floor(q.length / 3))) scored.push([best, d.ic.name])
        })
        scored.sort(function (a, b) { return a[0] - b[0] || (a[1] < b[1] ? -1 : 1) })
        return scored.slice(0, n || 5).map(function (s) { return s[1] })
      },
    }
  }
  function doSearch(q) {
    var res
    try { res = getEngine().search(q, { limit: ICONS.length }) || [] } catch (e) { res = [] }
    return res.filter(function (r) { return r && BY[r.name] })
  }
  function suggestions(q, n) {
    var out = []
    try { out = (getEngine().suggest(q, n || 6) || []).map(function (s) { return typeof s === 'string' ? s : s && s.name }) } catch (e) { }
    return out.filter(function (s) { return s && BY[s] })
  }
  var fuzzyKind = function (m) { return !!(m && (m.typo || m.kind === 'typo' || m.kind === 'similar' || m.kind === 'phonetic' || m.kind === 'fuzzy')) }
  // "Showing results for <corrected>": engine.didYouMean when the engine has it, else infer from fuzzy top hits
  function correction(q, res) {
    var e = getEngine(), c = null
    if (e && typeof e.didYouMean === 'function') {
      try {
        var d = e.didYouMean(q)
        c = typeof d === 'string' ? d : d && (d.corrected || d.query || d.text || d.q || d.suggestion || d.term || null)
        if (Array.isArray(d)) c = d[0] && (typeof d[0] === 'string' ? d[0] : d[0].query || d[0].term || d[0].name)
      } catch (err) { c = null }
    }
    if (c && norm(c) !== norm(q)) return { to: String(c), how: 'dym' }
    var top = res.slice(0, 3)
    if (top.length && top.every(function (r) { return fuzzyKind(r.match) })) {
      var m = top[0].match, term = String(m.term || top[0].name).replace(/-/g, ' ')
      if (norm(term) !== norm(q)) return { to: term, how: m.kind === 'phonetic' ? 'sounds' : m.kind === 'similar' ? 'similar' : 'typo' }
    }
    return null
  }

  /* ───────────────────────── state ───────────────────────── */
  var params = new URLSearchParams(location.search)
  var oldColor = store.get('color', 'ink')
  var S = {
    q: params.get('q') || '',
    style: STYLE[params.get('style')] ? params.get('style') : (STYLE[store.get('style', 'line')] ? store.get('style', 'line') : 'line'),
    cat: CAT_RANK[params.get('cat')] != null ? params.get('cat') : '',
    view: params.get('view') === 'compare' || params.get('style') === 'all' ? 'compare' : 'grid',
    color: oldColor === 'white' ? '#FFFFFF' : (oldColor === 'ink' || oldColor === 'style' || /^#[0-9a-f]{6}$/i.test(oldColor) ? oldColor : 'ink'),
    px: [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024].indexOf(store.get('px', 256)) >= 0 ? store.get('px', 256) : 256,
    sw: null,
    density: /^[sml]$/.test(store.get('dens2', 'm')) ? store.get('dens2', 'm') : 'm',
    sel: new Set(),
    animate: !!store.get('animate', false),
    fi: 0,
    results: [], counts: {}, total: 0, fix: null,
  }
  var V = {
    name: null, st: S.style, open: false, full: false, snap: 'peek',
    bg: /^(auto|paper|white|dark|brand|check|custom)$/.test(store.get('vbg', 'auto')) ? store.get('vbg', 'auto') : 'auto',
    bgc: /^#[0-9a-f]{6}$/i.test(store.get('vbgc', '')) ? store.get('vbgc', '') : '#F4E9FF',
    shape: /^(round|circle|square)$/.test(store.get('vshape', 'round')) ? store.get('vshape', 'round') : 'round',
    pad: clamp(+store.get('vpad', 0.14) || 0.14, 0, 0.3),
    bgInc: !!store.get('bginc', false), bgOpen: false, pal: null,
    w: clamp(+store.get('vw', 440) || 440, 340, 900),
    tab: store.get('devtab', 'react'),
    ttab: /^(look|motion|swap)$/.test(store.get('ttab', 'look')) ? store.get('ttab', 'look') : 'look',
    anim: /^(none|loop|hover|once)$/.test(store.get('anim', 'hover')) ? store.get('anim', 'hover') : 'hover',
    returnFocus: null,
  }
  var initialIcon = params.get('icon') && BY[params.get('icon')] ? params.get('icon') : null
  var initialVSt = STYLE[params.get('vs')] ? params.get('vs') : null

  var urlTimer = 0
  function syncUrl() {
    clearTimeout(urlTimer)
    urlTimer = setTimeout(function () { try { history.replaceState(null, '', location.pathname + urlQuery() + location.hash) } catch (e) { } }, 160)
  }
  function urlQuery(forShare) {
    var p = new URLSearchParams()
    if (S.q && !forShare) p.set('q', S.q)
    if (S.style !== 'line' && !forShare) p.set('style', S.style)
    if (S.cat && !forShare) p.set('cat', S.cat)
    if (S.view === 'compare' && !forShare) p.set('view', 'compare')
    if (V.open && V.name) { p.set('icon', V.name); if (V.st !== (forShare ? 'line' : S.style)) p.set(forShare ? 'style' : 'vs', V.st) }
    var qs = p.toString()
    return qs ? '?' + qs : ''
  }

  /* ───────────────────────── DOM refs ───────────────────────── */
  var root = $('[data-lib]')
  if (!root) return
  var input = $('#lib-q'), grid = $('[data-grid]'), meta = $('[data-meta]'), empty = $('[data-empty]'), body = $('[data-body]')
  var catNav = $('[data-cats]'), stylesEl = $('[data-styles]'), stylesWrap = $('[data-styles-wrap]'), viewer = $('[data-viewer]'), vwBody = $('[data-vw-body]'), vwPanel = $('[data-vw-panel]')
  var selbar = $('[data-selbar]'), toastEl = $('[data-toast]'), scrim = $('[data-vw-scrim]'), tools = $('[data-tools]'), rail = $('[data-rail]')

  /* ───────────────────────── toast ───────────────────────── */
  var toastTimer = 0
  function toast(html, o) {
    o = o || {}
    toastEl.innerHTML = '<span class="toast-ic" aria-hidden="true">' + (o.icon ? glyph(has(o.st || 'line', o.icon) ? (o.st || 'line') : 'line', o.icon) : '') + '</span><span class="toast-msg">' + html + '</span>' + (o.action ? '<button type="button" class="toast-act">' + esc(o.action.label) + '</button>' : '')
    if (o.action) $('.toast-act', toastEl).onclick = function () { o.action.run(); hideToast() }
    toastEl.classList.toggle('is-err', !!o.err)
    toastEl.style.setProperty('--sc', 'var(--s-' + (o.st || S.style) + ')'); toastEl.style.setProperty('--on-sc', 'var(--on-' + (o.st || S.style) + ')')
    toastEl.classList.add('is-on')
    clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, o.ms || 3500); centreOverlays()
  }
  function hideToast() { toastEl.classList.remove('is-on') }
  // the toast and the selection bar sit over the results column (not under the docked viewer)
  function centreOverlays() {
    var r = grid && grid.getBoundingClientRect(), cx = r && r.width ? Math.round(r.left + r.width / 2) : 0
    var vw = D.documentElement.clientWidth
    var v = cx && !isSheet() && !V.full ? cx + 'px' : '50%'
    toastEl.style.setProperty('--lib-cx', v); selbar.style.setProperty('--lib-cx', v)
    if (cx && !isSheet()) { var maxw = Math.min(r.width + 24, vw - 24); toastEl.style.setProperty('--lib-cw', maxw + 'px'); selbar.style.setProperty('--lib-cw', maxw + 'px') }
  }
  toastEl.addEventListener('pointerenter', function () { clearTimeout(toastTimer) })
  toastEl.addEventListener('pointerleave', function () { toastTimer = setTimeout(hideToast, 1600) })

  /* ───────────────────────── colour & background ───────────────────────── */
  var BGS = { paper: PAPER, white: '#FFFFFF', dark: INK, brand: null, check: null }
  function bgHex(st) { return V.bg === 'brand' ? styleHex(st) : V.bg === 'auto' ? autoBg(st) : V.bg === 'custom' ? V.bgc : BGS[V.bg] || null }
  // "Auto": a background picked for the open icon's colours. With a palette: a soft tint of its own tint role, or a deep
  // shade of its main colour, whichever gives the main colour and the line art more contrast. Without one: paper, or
  // ink when the chosen icon colour is light.
  function hexMix(a, b, t) { var p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16), m = function (sh) { return Math.round(((p >> sh) & 255) * (1 - t) + ((q >> sh) & 255) * t) }; return '#' + ((1 << 24) + (m(16) << 16) + (m(8) << 8) + m(0)).toString(16).slice(1).toUpperCase() }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
  function palRoles() {
    if (!ED || !V.name || ED.get().name !== V.name) return null
    var c = ED.get().colors, list = c && c.pal && W.WITH_PALETTES && W.WITH_PALETTES[V.name]
    if (!Array.isArray(list)) return null
    for (var i = 0; i < list.length; i++) if (list[i].id === c.pal) return list[i].colors
    return null
  }
  function isDarkTheme() { var t = HTML.getAttribute('data-theme'); return t ? t === 'dark' : mq('(prefers-color-scheme: dark)') }
  var DARK_GROUND = '#1C1F27'
  // CIE76 ΔE between two hex colours (sRGB -> Lab, D65)
  function lab(hex) {
    var p = parseInt(hex.slice(1), 16), c = [(p >> 16) & 255, (p >> 8) & 255, p & 255].map(function (v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) })
    var x = (c[0] * 0.4124 + c[1] * 0.3576 + c[2] * 0.1805) / 0.95047, y = c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722, z = (c[0] * 0.0193 + c[1] * 0.1192 + c[2] * 0.9505) / 1.08883
    var g = function (t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116 }
    return [116 * g(y) - 16, 500 * (g(x) - g(y)), 200 * (g(y) - g(z))]
  }
  function deltaE(a, b) { var A = lab(a), B = lab(b); return Math.sqrt(Math.pow(A[0] - B[0], 2) + Math.pow(A[1] - B[1], 2) + Math.pow(A[2] - B[2], 2)) }
  // a ground for a palette, from its own roles: the tint as it is, soft washes of c2 / c3 / c1, or a deep shade of c1.
  // Each must keep the main colour and the line art readable (≥ 1.5:1) and look clearly different from plain paper
  // (ΔE ≥ 10); the best mix of readable + distinct wins, with a nudge toward the page's theme.
  var palBgCache = {}
  function palBg(r) {
    var hex = /^#[0-9a-f]{6}$/i; if (!r || !hex.test(r.c1 || '')) return null
    var dark = isDarkTheme(), key = JSON.stringify(r) + dark
    if (palBgCache[key]) return palBgCache[key]
    var ink = hex.test(r.ink || '') ? r.ink : INK, base = dark ? DARK_GROUND : PAPER, c = []
    if (hex.test(r.tint || '')) c.push([r.tint, 0])
    ;['c2', 'c3', 'c1', 'tint'].forEach(function (k) { if (hex.test(r[k] || '')) { c.push([hexMix('#FFFFFF', r[k], 0.3), 0]); c.push([hexMix('#FFFFFF', r[k], 0.22), 0]) } })
    c.push([hexMix(r.c1, '#0D0F14', 0.78), 1]); c.push([hexMix(hex.test(r.c4 || '') ? r.c4 : r.c1, '#0D0F14', 0.6), 1])
    var best = null
    c.forEach(function (x) {
      var bg = x[0], cr = Math.min(contrast(bg, r.c1), contrast(bg, ink)), dE = deltaE(bg, base)
      if (cr < 1.5 || dE < 10) return
      var sc = Math.min(cr, 4.5) + Math.min(dE, 45) / 15 + (x[1] === (dark ? 1 : 0) ? 0.8 : 0)
      if (!best || sc > best.sc) best = { bg: bg, sc: sc }
    })
    return (palBgCache[key] = best ? best.bg : hexMix(r.c1, '#FFFFFF', 0.7))
  }
  function autoBg(st) {
    var p = palBg(palRoles()); if (p) return p
    var c = S.color === 'style' ? styleHex(st) : /^#[0-9a-f]{6}$/i.test(S.color) ? S.color : INK
    if (isDarkTheme()) return S.color !== 'ink' && lum(c) < 0.12 ? PAPER : DARK_GROUND
    return lum(c) > 0.6 ? INK : PAPER
  }
  function bgLabel() { return { auto: 'Auto', paper: 'Paper', white: 'White', dark: 'Dark', brand: 'Style colour', check: 'Transparent', custom: 'Custom' }[V.bg] || 'Paper' }
  function lum(hex) {
    var p = parseInt(hex.slice(1), 16), f = function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
    return 0.2126 * f((p >> 16) & 255) + 0.7152 * f((p >> 8) & 255) + 0.0722 * f(p & 255)
  }
  function autoOn(bg) { return bg && lum(bg) < 0.35 ? (bg === INK ? PAPER : '#FFFFFF') : INK }
  // colour baked into downloads
  function exportColor(st) {
    if (S.color === 'style') return V.bgInc && V.bg === 'brand' ? '#FFFFFF' : styleHex(st)
    if (S.color === 'ink') return V.bgInc ? autoOn(bgHex(st)) : INK
    return /^#[0-9a-f]{6}$/i.test(S.color) ? S.color : INK
  }
  function exportBg(st) { return V.bgInc ? bgHex(st) : null }
  // colour shown on the viewer stage
  function stageColor(st) {
    var bh = V.bg === 'check' ? null : bgHex(st), darkBg = !!(bh && lum(bh) < 0.35)
    if (S.color === 'style') return V.bg === 'brand' ? '#FFFFFF' : 'var(--s-' + st + ')'
    if (S.color === 'ink') return V.bg === 'check' ? 'var(--l-fg)' : V.bg === 'brand' ? '#FFFFFF' : darkBg ? PAPER : INK
    return S.color
  }
  function fileSvg(st, name, px) { return svgText(st, name, { mode: 'file', color: exportColor(st), bg: exportBg(st), px: px || S.px }) }
  function codeSvg(st, name) { return svgText(st, name, { mode: 'code', pretty: true }) }
  // "Copy SVG code — for Figma, Canva, HTML": design apps import SVG without a CSS engine, so var(--with-x, #hex) would
  // paint black there. Resolve the variables; currentColor stays, so pasted HTML still follows `color`.
  function appSvg(st, name) { return svgText(st, name, { mode: 'code', pretty: true, resolve: true }) }
  function fname(st, name, ext, px) { return name + (st === 'line' ? '' : '-' + st) + (px ? '-' + px : '') + '.' + ext }

  /* ───────────────────────── export: png, clipboard, files, zip ───────────────────────── */
  var pngCache = new Map()
  function pngKey(st, name, px) { return [st, name, px, exportColor(st), exportBg(st) || '', S.sw == null ? '' : S.sw, edCss(st, name)].join('|') }
  function renderPng(st, name, px) {
    px = px || S.px
    var key = pngKey(st, name, px)
    if (pngCache.has(key)) return pngCache.get(key)
    var p = ensure(st, name).then(function () {
      return new Promise(function (res, rej) {
        var img = new Image()
        img.onload = function () {
          var c = D.createElement('canvas'); c.width = px; c.height = px
          c.getContext('2d').drawImage(img, 0, 0, px, px)
          c.toBlob(function (b) {
            if (!b) { rej(new Error('png')); return }
            var out = { blob: b, dataUrl: null }
            try { out.dataUrl = c.toDataURL('image/png') } catch (e) { }
            res(out)
          }, 'image/png')
        }
        img.onerror = function () { rej(new Error('svg image')) }
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fileSvg(st, name, px))
      })
    })
    pngCache.set(key, p)
    if (pngCache.size > 160) pngCache.delete(pngCache.keys().next().value)
    p.then(function (v) { p.value = v }, function () { pngCache.delete(key) })
    return p
  }
  function saveBlob(blob, filename) {
    var url = URL.createObjectURL(blob), a = D.createElement('a')
    a.href = url; a.download = filename; a.rel = 'noopener'; D.body.appendChild(a); a.click(); a.remove()
    setTimeout(function () { URL.revokeObjectURL(url) }, 4000)
  }
  function copyText(text) {
    if (navigator.clipboard && W.isSecureContext) return navigator.clipboard.writeText(text).catch(legacy)
    return legacy()
    function legacy() {
      return new Promise(function (res, rej) {
        var ta = D.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'
        D.body.appendChild(ta); ta.select()
        try { D.execCommand('copy') ? res() : rej(new Error('copy')) } catch (e) { rej(e) } finally { ta.remove() }
      })
    }
  }
  function clipFail() { toast('The clipboard is blocked here. Use <b>Download PNG</b> or <b>SVG</b>, or drag the icon out.', { err: true }) }
  // Copy a PNG to the clipboard. ClipboardItem gets a promise so Safari keeps the user gesture.
  function copyImage(st, name) {
    var T = BY[name].title
    if (!(W.ClipboardItem && navigator.clipboard && navigator.clipboard.write && W.isSecureContext)) {
      return copyText(fileSvg(st, name)).then(function () {
        toast('This browser can’t copy images, so we copied <b>' + esc(T) + '</b> as SVG code. Use <b>Download PNG</b> for an image file.', { icon: name, st: st }); return true
      }).catch(clipFail)
    }
    var blobP = renderPng(st, name, Math.max(S.px, 128)).then(function (r) { return r.blob })
    var item
    try { item = new W.ClipboardItem({ 'image/png': blobP }) } catch (e) { item = null }
    var go = item ? navigator.clipboard.write([item]) : blobP.then(function (b) { return navigator.clipboard.write([new W.ClipboardItem({ 'image/png': b })]) })
    return go.then(function () {
      bump(name)
      toast('Copied <b>' + esc(T) + '</b> as an image. Paste it with <kbd>' + (isMac ? '⌘' : 'Ctrl') + '</kbd>&nbsp;<kbd>V</kbd> into Slides, Docs, Notion or Canva.', { icon: name, st: st, action: { label: 'Copy SVG instead', run: function () { copySvgCode(st, name) } } }); return true
    }).catch(function () {
      return copyText(fileSvg(st, name)).then(function () { toast('Copied <b>' + esc(T) + '</b> as SVG code (your browser blocked image copying).', { icon: name, st: st }); return true })
    }).catch(clipFail)
  }
  function copySvgCode(st, name) {
    return copyText(S.color === 'ink' && !V.bgInc && !edColors(st, name) ? appSvg(st, name) : fileSvg(st, name, 24)).then(function () {
      bump(name); toast('Copied <b>' + esc(BY[name].title) + '</b> as SVG code. Paste it into Figma, Canva or your HTML.', { icon: name, st: st }); return true
    }, function () { toast('Couldn’t reach the clipboard. Try the download button.', { err: true }) })
  }
  function downloadSvg(st, name) { saveBlob(new Blob([fileSvg(st, name)], { type: 'image/svg+xml' }), fname(st, name, 'svg')); bump(name); toast('Downloaded <b>' + esc(fname(st, name, 'svg')) + '</b>', { icon: name, st: st }) }
  function downloadPng(st, name, px) {
    px = px || S.px
    return renderPng(st, name, px).then(function (r) { saveBlob(r.blob, fname(st, name, 'png', px)); bump(name); toast('Downloaded <b>' + esc(fname(st, name, 'png', px)) + '</b> (' + px + '×' + px + ')', { icon: name, st: st }); return true },
      function () { toast('Couldn’t make that PNG. Try SVG instead.', { err: true }) })
  }

  // the button that did the job answers: a check pop + a soft ring (css .is-yay); a copied tile says "Copied"
  function yay(btn) { if (!btn || reduced) return; btn.classList.remove('is-yay'); void btn.offsetWidth; btn.classList.add('is-yay'); clearTimeout(btn._yt); btn._yt = setTimeout(function () { btn.classList.remove('is-yay') }, 700) }
  function tileYay(n) { if (!n || !n.isConnected) return; n.classList.remove('is-copied'); void n.offsetWidth; n.classList.add('is-copied'); clearTimeout(n._ct); n._ct = setTimeout(function () { n.classList.remove('is-copied') }, 1150) }

  // Store-only ZIP writer (no compression; SVG/PNG gain nothing from deflate anyway).
  var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })()
  function crc32(u8) { var c = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 }
  function zip(files) {
    var enc = new TextEncoder(), parts = [], central = [], off = 0
    var d = new Date(), time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = f.data, crc = crc32(data)
      var h = new DataView(new ArrayBuffer(30))
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true)
      h.setUint16(10, time, true); h.setUint16(12, date, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true)
      h.setUint16(26, name.length, true); h.setUint16(28, 0, true)
      parts.push(h.buffer, name, data)
      var c = new DataView(new ArrayBuffer(46))
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true)
      c.setUint16(12, time, true); c.setUint16(14, date, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true)
      c.setUint16(28, name.length, true); c.setUint32(42, off, true)
      central.push(c.buffer, name)
      off += 30 + name.length + data.length
    })
    var cdSize = central.reduce(function (a, b) { return a + (b.byteLength || b.length) }, 0)
    var e = new DataView(new ArrayBuffer(22))
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cdSize, true); e.setUint32(16, off, true)
    return new Blob(parts.concat(central, [e.buffer]), { type: 'application/zip' })
  }
  function zipSelected(kind) {
    var list = Array.from(S.sel).map(function (k) { var p = k.split('|'); return { name: p[0], st: p[1] } })
    if (!list.length) return
    var enc = new TextEncoder(), btn = $('[data-zip="' + kind + '"]', selbar)
    if (btn) btn.classList.add('is-busy')
    var styles = []; list.forEach(function (x) { if (styles.indexOf(x.st) < 0) styles.push(x.st) })
    Promise.all(styles.map(loadStyle)).then(function () {
      return Promise.all(list.map(function (x) {
        var folder = styles.length > 1 ? x.st + '/' : ''
        if (kind === 'svg') return { name: folder + fname(x.st, x.name, 'svg'), data: enc.encode(fileSvg(x.st, x.name)) }
        return renderPng(x.st, x.name, S.px).then(function (r) { return r.blob.arrayBuffer() }).then(function (ab) { return { name: folder + fname(x.st, x.name, 'png', S.px), data: new Uint8Array(ab) } })
      }))
    }).then(function (files) {
      files.push({ name: 'LICENSE.txt', data: enc.encode('Icons from with icons (https://withicons.com), powered by Evergrow.\nMIT License. Free for personal and commercial use. No attribution required.\n') })
      var file = 'with-icons-' + list.length + '-' + kind + (kind === 'png' ? '-' + S.px : '') + '.zip'
      saveBlob(zip(files), file)
      toast('Downloaded <b>' + esc(file) + '</b> with ' + list.length + ' icon' + (list.length > 1 ? 's' : '') + '.', { icon: BY.download ? 'download' : list[0].name })
    }).catch(function () { toast('Couldn’t build the ZIP. Try fewer icons or SVG.', { err: true }) })
      .then(function () { if (btn) btn.classList.remove('is-busy') })
  }
  var recent = store.get('recent', [])
  function bump(name) { recent = [name].concat(recent.filter(function (n) { return n !== name })).slice(0, 12); store.set('recent', recent) }

  /* ───────────────────────── results ───────────────────────── */
  var lastSearchMs = 0
  function runSearch() {
    var t0 = performance.now(), q = S.q.trim(), res
    S.fix = null
    if (!q) res = BROWSE.map(function (ic) { return { name: ic.name, match: null } })
    else {
      res = doSearch(q)
      S.fix = correction(q, res)
      if (S.fix && !res.length) { res = doSearch(S.fix.to); if (!res.length) S.fix = null; else S.fix.used = true }
    }
    var counts = {}; res.forEach(function (r) { var c = BY[r.name].category; counts[c] = (counts[c] || 0) + 1 })
    S.counts = counts; S.total = res.length
    S.results = S.cat ? res.filter(function (r) { return BY[r.name].category === S.cat }) : res
    lastSearchMs = performance.now() - t0
  }
  var ITEMS = [], KEYS = new Map()
  function buildItems() {
    ITEMS = []; KEYS = new Map()
    S.results.forEach(function (r, ri) {
      if (S.view === 'compare') SNAMES.forEach(function (st, si) { var it = { name: r.name, st: st, r: r, row: ri, col: si, k: r.name + '|' + st }; KEYS.set(it.k, ITEMS.length); ITEMS.push(it) })
      else { var it = { name: r.name, st: S.style, r: r, k: r.name + '|' + S.style }; KEYS.set(it.k, ITEMS.length); ITEMS.push(it) }
    })
    if (S.fi >= ITEMS.length) S.fi = Math.max(0, ITEMS.length - 1)
  }

  /* ───────────────────────── layout (windowed, identical tiles) ───────────────────────── */
  // min tile width / tile height / icon box / gap — every tile in a view is exactly the same size
  var DENS = {
    s: { min: 96, h: 100, ib: 32, gap: 10, la: 0 },
    m: { min: 128, h: 144, ib: 48, gap: 12, la: 42 },
    l: { min: 172, h: 188, ib: 64, gap: 14, la: 46 },
  }
  var DENS_SM = {
    s: { min: 70, h: 74, ib: 28, gap: 6, la: 0 },
    m: { min: 100, h: 120, ib: 40, gap: 8, la: 38 },
    l: { min: 148, h: 164, ib: 56, gap: 10, la: 42 },
  }
  var L = { w: 0, cols: 1, tw: 100, th: 100, gap: 10, rowH: 110, rows: 0, labelW: 0, labelH: 0, headH: 0, ib: 48 }
  function layout() {
    var w = Math.floor(grid.clientWidth || 800)
    L.w = w
    var d = (w < 560 ? DENS_SM : DENS)[S.density] || DENS.m
    if (S.view === 'compare') {
      var narrow = w < 640
      L.gap = narrow ? 5 : 10; L.cols = SNAMES.length
      L.labelW = narrow ? 0 : Math.round(clamp(w * 0.17, 132, 210)); L.labelH = narrow ? 30 : 0
      // every style of an icon sits on one line; when that would make tiles too small (20 styles on a phone or
      // beside the open drawer) the line wraps into two rows of six
      var fit = function (per) { return Math.floor(Math.min(d.min, (w - L.labelW - L.gap * (per - 1)) / per)) }
      L.per = L.cols; L.tw = fit(L.cols)
      if (L.tw < (narrow ? 40 : 58) && L.cols > 6) { L.per = Math.ceil(L.cols / 2); L.tw = fit(L.per) }
      L.sub = Math.ceil(L.cols / L.per)
      L.headH = narrow || L.sub > 1 ? 0 : 34
      L.th = L.tw
      L.ib = Math.round(Math.min(d.ib, L.tw * 0.46))
      L.rowH = L.sub * (L.th + L.gap) + L.labelH + (L.sub > 1 ? 8 : 0)
      L.rows = S.results.length
    } else {
      L.gap = d.gap; L.labelW = 0; L.labelH = 0; L.headH = 0
      L.cols = Math.max(2, Math.floor((w + d.gap) / (d.min + d.gap)))
      L.tw = Math.floor((w - d.gap * (L.cols - 1)) / L.cols); L.th = d.h; L.ib = d.ib
      L.rowH = L.th + d.gap
      L.rows = Math.ceil(ITEMS.length / L.cols)
    }
    L.la = S.view === 'compare' ? 0 : d.la
    var h = Math.max(0, L.headH + L.rows * L.rowH - L.gap)
    grid.style.height = h + 'px'
    grid.style.setProperty('--tw', L.tw + 'px'); grid.style.setProperty('--th', L.th + 'px')
    grid.style.setProperty('--ib', L.ib + 'px'); grid.style.setProperty('--la', L.la + 'px')
    grid.setAttribute('data-view', S.view); grid.setAttribute('data-density', S.density)
    if (S.view === 'compare' && L.sub > 1) grid.setAttribute('data-wrap', ''); else grid.removeAttribute('data-wrap')
    paintCompareHead()
  }
  function pos(idx) {
    var it = ITEMS[idx]
    if (S.view === 'compare') { var c = it.col % L.per, sr = Math.floor(it.col / L.per); return { x: L.labelW + c * (L.tw + L.gap), y: L.headH + it.row * L.rowH + L.labelH + sr * (L.th + L.gap), row: it.row, col: it.col } }
    var row = Math.floor(idx / L.cols), col = idx % L.cols
    return { x: col * (L.tw + L.gap), y: row * L.rowH, row: row, col: col }
  }
  var compareHead = null
  function paintCompareHead() {
    if (S.view !== 'compare' || !L.headH) { if (compareHead) { compareHead.remove(); compareHead = null } return }
    if (!compareHead) {
      compareHead = D.createElement('div'); compareHead.className = 'cmp-head'; compareHead.setAttribute('aria-hidden', 'true')
      compareHead.innerHTML = SNAMES.map(function (s) { return '<span style="--sc:var(--s-' + s + ');--sc-text:var(--t-' + s + ')"><i></i>' + esc(STYLE[s].title) + '</span>' }).join('')
      grid.appendChild(compareHead)
    }
    compareHead.style.left = L.labelW + 'px'
    compareHead.style.gridTemplateColumns = 'repeat(' + L.cols + ',' + L.tw + 'px)'
    compareHead.style.columnGap = L.gap + 'px'
  }

  var mounted = new Map()   // key -> node
  var labels = new Map()    // compare row labels: name -> node
  var gen = 0, seen = new Set()
  function visibleRange() {
    var r = grid.getBoundingClientRect(), vh = W.innerHeight, top0 = -r.top - L.headH
    var top = Math.max(0, top0 - vh * 0.5), bottom = Math.max(0, top0 + vh * 1.5)
    var r0 = Math.max(0, Math.floor(top / L.rowH)), r1 = Math.min(L.rows - 1, Math.floor(bottom / L.rowH))
    return { r0: r0, r1: r1, vis0: Math.floor(Math.max(0, top0) / L.rowH), vis1: Math.floor(Math.max(0, top0 + vh) / L.rowH) }
  }
  function tileNode(it) {
    var n = D.createElement('div')
    n.className = 'tile'; n.setAttribute('role', 'option'); n.tabIndex = -1; n.draggable = true
    n._k = it.k; n._name = it.name; n._st = it.st
    fillTile(n, it)
    return n
  }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9
    var p = [], i, j; for (j = 0; j <= b.length; j++) p[j] = j
    for (i = 1; i <= a.length; i++) { var c = [i]; for (j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c }
    return p[b.length]
  }
  function whyHtml(m, name) {
    if (!m || !m.field) return ''
    // a misspelling kept as a synonym ("calender" on Calendar) is not a meaning: the name already says it
    if (name && name.length >= 5 && (m.field === 'synonym' || m.field === 'alias') && m.term && lev(norm(m.term).replace(/-/g, ' '), name.replace(/-/g, ' ')) <= 2) return ''
    var term = esc(String(m.field === 'description' ? S.q.trim() : (m.term || '')).replace(/-/g, ' '))
    if (m.field === 'synonym' || m.field === 'alias') { if (norm(m.term).replace(/-/g, ' ') === norm(S.q).replace(/-/g, ' ')) return (m.field === 'alias' ? 'also called' : 'means') + ' <b>' + term + '</b>' }
    if (name && m.term && norm(m.term).replace(/-/g, ' ') === name.replace(/-/g, ' ')) return ''
    if (m.kind === 'phonetic') return 'sounds like <b>' + term + '</b>'
    if (m.kind === 'similar') return 'similar to <b>' + term + '</b>'
    if (m.typo || m.kind === 'typo') return '≈ <b>' + term + '</b>'
    switch (m.field) {
      case 'name': return ''
      case 'alias': return 'also called <b>' + term + '</b>'
      case 'synonym': return 'means <b>' + term + '</b>'
      case 'tag': return 'tagged <b>' + term + '</b>'
      case 'category': return 'in <b>' + esc(cap(m.term)) + '</b>'
      case 'description': return 'about <b>' + term + '</b>'
      default: return 'matches <b>' + term + '</b>'
    }
  }
  function fillTile(n, it) {
    var ic = BY[it.name], m = it.r && it.r.match
    var why = S.view === 'grid' ? whyHtml(m, it.name) : ''
    var label = S.view === 'compare' ? esc(STYLE[it.st].title) : hiName(ic.title)
    n.style.setProperty('--sc', 'var(--s-' + it.st + ')'); n.style.setProperty('--sc-text', 'var(--t-' + it.st + ')'); n.style.setProperty('--on-sc', 'var(--on-' + it.st + ')')
    n.innerHTML = '<span class="t-card"><span class="t-ic">' + glyph(it.st, it.name) + '</span><span class="t-name">' + label + '</span>' + (why ? '<span class="t-why">' + why + '</span>' : '') + '</span>' +
      '<span class="t-chk" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
    var whyTxt = why ? why.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') : ''
    n.setAttribute('aria-label', ic.title + ', ' + STYLE[it.st].title + ' style' + (whyTxt ? ', ' + whyTxt : ''))
    n._st = it.st
    paintTileState(n)
  }
  function paintTileState(n) {
    var sel = S.sel.has(n._k)
    n.classList.toggle('is-sel', sel)
    n.setAttribute('aria-selected', sel ? 'true' : 'false')
    var act = !!(V.open && V.name === n._name && (S.view === 'grid' || V.st === n._st))
    n.classList.toggle('is-active', act)
    // the open icon's tile wears its custom colours too
    var svg = n.querySelector('.t-ic svg'), css = act ? edCss(n._st, n._name) : ''
    if (svg && (css || svg._cz)) { svg.style.cssText = css.replace(/: /g, ':'); svg._cz = !!css }
  }
  function hiName(text) {
    var q = norm(S.q)
    if (!q) return esc(text)
    var low = text.toLowerCase(), toks = q.split(/[\s-]+/).filter(function (t) { return t.length > 0 })
    var marks = new Array(text.length).fill(false)
    toks.forEach(function (t) { var i = low.indexOf(t); if (i >= 0) for (var k = i; k < i + t.length; k++) marks[k] = true })
    var out = '', open = false
    for (var i = 0; i < text.length; i++) {
      if (marks[i] && !open) { out += '<mark>'; open = true }
      if (!marks[i] && open) { out += '</mark>'; open = false }
      out += esc(text[i])
    }
    return out + (open ? '</mark>' : '')
  }

  var leaving = []
  function render(o) {
    o = o || {}
    if (leaving.length && (o.anim || o.refill)) { leaving.forEach(function (n) { n.remove() }); leaving = [] }
    leaving = leaving.filter(function (n) { return n.isConnected })
    var rng = visibleRange(), want = new Map()
    var c0 = rng.r0 * L.cols, c1 = Math.min(ITEMS.length - 1, (rng.r1 + 1) * L.cols - 1)
    for (var idx = c0; idx <= c1; idx++) want.set(ITEMS[idx].k, idx)
    // keep the keyboard-focused tile mounted so focus never drops
    if (ITEMS[S.fi] && D.activeElement && D.activeElement._k === ITEMS[S.fi].k) want.set(ITEMS[S.fi].k, S.fi)
    var anim = o.anim && !reduced
    var enterOrder = 0
    mounted.forEach(function (n, k) {
      if (want.has(k)) return
      mounted.delete(k)
      if (anim && o.prev && o.prev.has(k) && !KEYS.has(k)) {
        n.style.pointerEvents = 'none'; n.classList.add('is-leaving'); leaving.push(n)
        var a = n.animate([{ opacity: 1 }, { opacity: 0, transform: n.style.transform + ' scale(.7)' }], { duration: 140, easing: 'ease-in', fill: 'forwards' })
        a.onfinish = function () { n.remove() }; setTimeout(function () { n.remove() }, 200)
      } else n.remove()
    })
    var frag = null
    want.forEach(function (idx, k) {
      var it = ITEMS[idx], p = pos(idx), n = mounted.get(k), isNew = !n
      if (isNew) { n = tileNode(it); (frag || (frag = D.createDocumentFragment())).appendChild(n); mounted.set(k, n) }
      else if (o.refill) fillTile(n, it)
      n._idx = idx
      n.setAttribute('aria-posinset', idx + 1); n.setAttribute('aria-setsize', ITEMS.length)
      n.tabIndex = idx === S.fi ? 0 : -1
      var tr = 'translate(' + p.x + 'px,' + p.y + 'px)'
      var old = o.prev && o.prev.get(k)
      if (n._tr !== tr) { n.style.transform = tr; n._tr = tr }
      if (!anim) return
      var inView = p.row >= rng.vis0 - 1 && p.row <= rng.vis1 + 1
      if (old && (old.x !== p.x || old.y !== p.y) && inView) {
        n.animate([{ transform: 'translate(' + old.x + 'px,' + old.y + 'px)' }, { transform: tr }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' })
      } else if (isNew && inView && !o.noEnter) {
        entrance(n, Math.min(enterOrder++ * 12, 240), it.st)
      }
    })
    if (frag) grid.appendChild(frag)
    if (!anim) mounted.forEach(function (n, k) { var sk = gen + '|' + k; if (!seen.has(sk)) { seen.add(sk); if (!reduced && o.scrolling && n.firstChild) n.firstChild.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' }) } })
    else mounted.forEach(function (n, k) { seen.add(gen + '|' + k) })
    if (seen.size > 6000) seen.clear()
    if (S.view === 'compare') renderLabels(rng); else if (labels.size) { labels.forEach(function (l) { l.remove() }); labels.clear() }
  }
  function entrance(n, delay, st, quick) {
    var g = n.firstChild
    if (!g) return
    g.animate([{ opacity: 0, transform: 'translateY(8px) scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: quick ? 260 : 380, delay: delay, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' })
    if (DRAWABLE[st]) {
      n.classList.add('is-draw'); n.style.setProperty('--dd', delay + 'ms'); n.style.setProperty('--dl', (quick ? 420 : 680) + 'ms')
      clearTimeout(n._dt); n._dt = setTimeout(function () { n.classList.remove('is-draw') }, delay + (quick ? 460 : 720))
    }
  }
  function renderLabels(rng) {
    var want = new Set()
    for (var r = rng.r0; r <= rng.r1; r++) {
      var res = S.results[r]; if (!res) continue
      want.add(res.name)
      var l = labels.get(res.name)
      if (!l) {
        l = D.createElement('button'); l.type = 'button'; l.className = 'crow-l'; l.setAttribute('data-open', res.name)
        l.innerHTML = '<b>' + hiName(BY[res.name].title) + '</b><small>' + esc(cap(BY[res.name].category)) + '</small>'
        l.title = 'Details for ' + BY[res.name].title
        grid.appendChild(l); labels.set(res.name, l)
      }
      l.style.transform = 'translate(0,' + (L.headH + r * L.rowH) + 'px)'
      l.style.width = (L.labelW ? L.labelW - 14 : L.w) + 'px'
      l.style.height = (L.labelW ? L.th * L.sub + L.gap * (L.sub - 1) : L.labelH) + 'px'
    }
    labels.forEach(function (l, k) { if (!want.has(k)) { l.remove(); labels.delete(k) } })
  }

  // the rail (in the page) and the bar's Style button show the same choice: only one of them at a time. The rail fades
  // as it slides under the sticky bar, and the button arrives as it leaves.
  function railWatch() {
    if (!rail) return
    var bar = $('[data-bar]'), bb = bar.getBoundingClientRect().bottom, r = rail.getBoundingClientRect()
    var on = r.bottom > bb + 12 && r.top < W.innerHeight
    if (on !== bar.classList.contains('rail-on')) { bar.classList.toggle('rail-on', on); if (on && stylesWrap.classList.contains('is-open')) sbOpen(false) }
    var fade = clamp((r.top - bb + 20) / 60, 0, 1)
    if (fade !== rail._f) { rail._f = fade; rail.style.opacity = fade < 1 ? (0.15 + 0.85 * fade).toFixed(3) : '' }
  }
  var scrollQueued = false
  function onScroll() {
    if (scrollQueued) return
    scrollQueued = true
    raf(function () {
      scrollQueued = false; render({ scrolling: true }); railWatch()
      var b = $('[data-bar]'); if (b) { var st = b.getBoundingClientRect().top <= (parseFloat(root.style.getPropertyValue('--lib-top')) || 0) + 1 && W.scrollY > 40; if (st !== b.classList.contains('is-stuck')) { b.classList.toggle('is-stuck', st); measureTop() } }
    })
  }

  /* ───────────────────────── update pipeline ───────────────────────── */
  function snapshot() { var m = new Map(); mounted.forEach(function (n, k) { var t = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(n._tr || ''); if (t) m.set(k, { x: +t[1], y: +t[2] }) }); return m }
  function update(o) {
    o = o || {}
    if (o.newQuery) hideToast()
    var prev = snapshot()
    peekHide(true)
    runSearch(); buildItems(); layout()
    if (o.newQuery) gen++
    render({ anim: o.anim !== false, prev: prev, refill: o.refill !== false })
    paintMeta(); paintCats(); paintSel(); syncUrl()
  }
  function relayout(anim) {
    var prev = snapshot()
    layout(); render({ anim: !!anim, prev: prev, noEnter: true })
  }
  var lastEmptyQ = null
  function paintMeta() {
    var q = S.q.trim(), n = S.results.length
    var catTxt = S.cat ? ' in <button type="button" class="meta-chip" data-clear-cat>' + esc(cap(S.cat)) + ' <span aria-hidden="true">×</span><span class="vh">remove category filter</span></button>' : ''
    var head
    if (!q) head = '<b>' + fmt(n) + '</b> icon' + (n === 1 ? '' : 's') + catTxt + (S.view === 'compare' ? ' <span class="meta-sep">·</span> <b>' + fmt(n * SNAMES.length) + '</b> in all ' + SNAMES.length + ' styles' : ' <span class="meta-sep">·</span> <span class="meta-sc">' + esc(STYLE[S.style].title) + '</span> style' + (sayOf(S.style) ? '<span class="meta-say"> · ' + esc(sayOf(S.style)) + '</span>' : ''))
    else head = '<b>' + fmt(n) + '</b> icon' + (n === 1 ? '' : 's') + ' for <q>' + esc(S.fix && S.fix.used ? S.fix.to : q) + '</q>' + catTxt + (S.cat && S.total > n ? ' <button type="button" class="meta-link" data-clear-cat>+' + (S.total - n) + ' in other categories</button>' : '')
    var fix = ''
    if (q && S.fix && n) {
      var how = S.fix.how === 'sounds' ? 'sounds like' : S.fix.how === 'similar' ? 'is close to' : 'looks like'
      fix = '<p class="meta-fix"><span class="mf-ic" aria-hidden="true">' + ICO.spark + '</span><span>Showing results for <button type="button" class="mf-to" data-q="' + esc(S.fix.to) + '">' + esc(S.fix.to) + '</button>. <span class="mf-small">“' + esc(q) + '” ' + how + ' it.</span></span></p>'
    }
    var dym = ''
    if (q && n > 0 && n < 4) {
      var have = {}; S.results.forEach(function (r) { have[r.name] = 1 })
      var sug = suggestions(S.fix ? S.fix.to : q, 8).filter(function (s) { return !have[s] }).slice(0, 5)
      if (sug.length) dym = '<p class="meta-dym"><span>Also try</span>' + sug.map(function (s) { return '<button type="button" class="dym" data-q="' + esc(BY[s].title.toLowerCase()) + '" style="--sc:var(--s-' + S.style + ')">' + glyph(S.style, s) + esc(BY[s].title) + '</button>' }).join('') + '</p>'
    }
    meta.innerHTML = '<p class="meta-line">' + head + '<span class="meta-speed" title="search time">' + (q ? lastSearchMs.toFixed(1) + ' ms' : '') + '</span></p>' + fix + dym
    empty.hidden = n > 0
    grid.hidden = n === 0
    if (!n && lastEmptyQ !== q + '|' + S.cat) { lastEmptyQ = q + '|' + S.cat; paintEmpty(q) }
    if (n) lastEmptyQ = null
    root.classList.toggle('has-query', !!q)
  }
  var POP_CATS = ['actions', 'communication', 'commerce', 'files', 'users', 'food', 'travel', 'nature', 'weather', 'objects']
  function paintEmpty(q) {
    var sug = q ? suggestions(q, 8).slice(0, 6) : []
    var reqUrl = 'https://github.com/withevergrow/withicons/issues/new?title=' + encodeURIComponent('Icon request: ' + (q || '')) + '&labels=icon-request'
    empty.innerHTML =
      '<div class="em-card">' +
        '<div class="em-art" aria-hidden="true">' + ICO.searchFace + '</div>' +
        '<h2 class="em-h">' + (q ? 'No icon for “<span>' + esc(q) + '</span>” yet' : 'Nothing in this category matches') + '</h2>' +
        '<p class="em-p">Try a simpler word (“money” instead of “invoice payment”), check the spelling, or pick one of these.</p>' +
        (sug.length ? '<div class="em-row"><span class="em-l">Did you mean</span>' + sug.map(function (s) { return '<button type="button" class="dym" data-q="' + esc(BY[s].title.toLowerCase()) + '" style="--sc:var(--s-' + S.style + ')">' + glyph(S.style, s) + esc(BY[s].title) + '</button>' }).join('') + '</div>' : '') +
        '<div class="em-row"><span class="em-l">Or browse</span>' + POP_CATS.filter(function (c) { return CAT_RANK[c] != null }).map(function (c) { return '<button type="button" class="dym is-cat" data-pick-cat="' + c + '">' + glyph('line', catIcon(c)) + esc(cap(c)) + '</button>' }).join('') + '</div>' +
        '<div class="em-ai"><div class="em-ai-h"><span class="em-ai-ic" aria-hidden="true">' + ICO.spark + '</span><div><h3>Ask an AI to pick the right icon</h3><p>Describe what you need in your own words. We’ll hand your assistant a ready prompt that knows all ' + fmt(ICONS.length) + ' icons.</p></div></div>' +
          '<div data-ask-ai data-intent="find" data-query="' + esc(q) + '"></div></div>' +
        '<p class="em-actions"><button type="button" class="btn-pill" data-q="">Show all icons</button><a class="btn-pill is-ghost" href="' + esc(reqUrl) + '" target="_blank" rel="noopener">Request this icon ' + ICO.ext + '</a></p>' +
      '</div>'
    renderAskAI($('[data-ask-ai]', empty), { query: q, intent: 'find' })
  }
  function renderAskAI(el, opts) {
    if (!el) return
    var w = WI()
    if (w && w.askAI && typeof w.askAI.render === 'function') { try { w.askAI.render(el, opts) } catch (e) { if (W.console) console.warn(e) } }
  }
  function paintCats() {
    var total = 0; CATS.forEach(function (c) { total += S.counts[c] || 0 })
    var all = $('[data-cat=""]', catNav)
    if (all) { all.setAttribute('aria-pressed', S.cat ? 'false' : 'true'); $('small', all).textContent = total }
    $$('[data-cat]', catNav).forEach(function (b) {
      var c = b.getAttribute('data-cat'); if (!c) return
      var k = S.counts[c] || 0
      b.setAttribute('aria-pressed', S.cat === c ? 'true' : 'false')
      b.classList.toggle('is-zero', !k)
      $('small', b).textContent = k
    })
    // horizontal chip row (narrow screens): keep the picked category in view
    if (S.cat !== paintCats._last) {
      paintCats._last = S.cat
      var on = $('[aria-pressed="true"]', catNav)
      if (on && catNav.scrollWidth > catNav.clientWidth + 2 && getComputedStyle(catNav).flexDirection === 'row') raf(function () {
        var l = on.offsetLeft - catNav.offsetLeft, r = l + on.offsetWidth
        if (l < catNav.scrollLeft || r > catNav.scrollLeft + catNav.clientWidth - 24) catNav.scrollTo({ left: Math.max(0, l - 16), behavior: reduced ? 'auto' : 'smooth' })
      })
    }
  }

  /* ───────────────────────── style switcher ─────────────────────────
     Two homes for the same options, five groups (Everyday · Crafted · Playful · Studio · Storybook), each a live mini icon +
     its name: the RAIL in the page flow under the bar (one row on wide screens, two even rows below ~1040px, a sideways
     strip on phones; a rich hover card per style) and the bar's compact PICKER (popover on desktop, bottom sheet on
     phones) so every style stays one click away while the bar is stuck. Selection is drawn by CSS (aria-checked). Mini
     icons come from the inline snapshot (#lib-style-samples), a localStorage copy for styles added later, then the live drawing. */
  var SAMPLE = BY.heart ? 'heart' : ['star', 'home', 'bell'].filter(function (n) { return BY[n] })[0] || ICONS[0].name
  var SNAP = (function () { try { var el = D.getElementById('lib-style-samples'); return el ? JSON.parse(el.textContent) : {} } catch (e) { return {} } })()
  // a style the inline snapshot doesn't know yet (added after the page was generated) still gets its preview: the
  // first time its data file arrives the sample is kept in localStorage, and on rich devices those styles load first
  function snapOf(st) { if (SNAP[st]) return SNAP[st]; var c = store.get('snap:' + st, null); return typeof c === 'string' && /^<[a-z]/.test(c) ? c : null }
  function sampleSvg(st) {
    if (svgMap(st) && svgMap(st)[SAMPLE] != null) { if (SAMPLE === 'heart' && !SNAP[st] && !snapOf(st)) store.set('snap:' + st, svgMap(st)[SAMPLE]); return glyph(st, SAMPLE) }
    var inner = SAMPLE === 'heart' && snapOf(st)
    return inner ? '<svg viewBox="0 0 24 24"' + ROOT_ATTR[st] + ' aria-hidden="true" focusable="false">' + inner + '</svg>' : ''
  }
  function paintSample(g, st) {
    if (!g) return
    var live = !!svgMap(st)
    if (g.firstElementChild && g._live === live && g._st === st) return
    var h = sampleSvg(st); if (!h) return
    g.innerHTML = h; g._live = live; g._st = st
  }
  var CMP_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="4" height="16" rx="1.5" fill="currentColor" opacity=".35"/><rect x="10" y="4" width="4" height="16" rx="1.5" fill="currentColor" opacity=".65"/><rect x="17" y="4" width="4" height="16" rx="1.5" fill="currentColor"/></svg>'
  function paintStylePills() {
    $$('[data-style-pill]', root).forEach(function (b) {
      var st = b.getAttribute('data-style-pill')
      var on = S.view === 'grid' && st === S.style
      b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on || (S.view === 'compare' && st === S.style) ? 0 : -1
      paintSample($('.sb-ic', b), st)
    })
    $$('[data-compare]', root).forEach(function (cmp) { cmp.setAttribute('aria-pressed', S.view === 'compare' ? 'true' : 'false') })
    if (rail) $$('[data-style-pill]', rail).forEach(function (b) { b.tabIndex = b.getAttribute('aria-checked') === 'true' || (S.view === 'compare' && b.getAttribute('data-style-pill') === S.style) ? 0 : -1 })
    sbSay()
    // phone trigger: the current style (or "All styles" in compare)
    var cur = $('[data-sb-cur]', stylesWrap), curG = $('[data-sb-cur-g]', stylesWrap), curIc = $('[data-sb-cur-ic]', stylesWrap)
    if (cur) {
      var all = S.view === 'compare'
      cur.textContent = all ? 'All ' + SNAMES.length + ' styles' : STYLE[S.style].title
      curG.textContent = all ? 'Compare' : (GROUP_OF[S.style] ? GROUP_OF[S.style].title : 'Style') + ' style'
      if (all) { if (curIc._st !== 'all') { curIc.innerHTML = CMP_SVG; curIc._st = 'all'; curIc._live = null } } else paintSample(curIc, S.style)
      $('[data-sb-toggle]', stylesWrap).setAttribute('aria-label', 'Icon style: ' + (all ? 'comparing all ' + SNAMES.length + ' styles' : STYLE[S.style].title) + '. Show all ' + SNAMES.length + ' styles')
    }
    moveInk()
    root.setAttribute('data-style', S.view === 'compare' ? 'all' : S.style)
    paintTools()
  }
  // the selected option is drawn by CSS (aria-checked); nothing to measure
  function moveInk() { }
  // the picker's footer line: the style under the pointer / focus, else the current one
  // a popover opens where it is: it never scrolls the page, it scrolls inside itself when the screen is short
  function fitPanel(el) {
    if (!el) return
    if (isPhone()) { el.style.maxHeight = ''; return }
    var t = el.parentNode.getBoundingClientRect().bottom + 10
    el.style.maxHeight = Math.max(220, W.innerHeight - t - 16) + 'px'
  }
  function sbSay(st) {
    var el = $('[data-sb-say]', stylesWrap); if (!el) return
    var all = !st && S.view === 'compare'; st = st || S.style
    el.innerHTML = all ? '<b>Comparing all ' + SNAMES.length + ' styles</b> side by side' : '<b style="color:var(--t-' + st + ')">' + esc(STYLE[st].title) + '</b> ' + esc(sayOf(st))
  }
  // phones: the panel opens from the trigger and closes on pick / Escape / outside tap
  function sbSheet() { var t = $('[data-sb-toggle]', stylesWrap); return !!(t && t.offsetWidth) }
  function sbOpen(open, focus) {
    var t = $('[data-sb-toggle]', stylesWrap); if (!t) return
    if (open && !sbSheet()) open = false
    if (open) { var vp = $('[data-pop].is-open', tools); if (vp) togglePop(vp, false) }
    if (open) { hideToast(); fitPanel($('[data-sb-panel]', stylesWrap)) }
    stylesWrap.classList.toggle('is-open', open); t.setAttribute('aria-expanded', open ? 'true' : 'false')
    HTML.classList.toggle('lib-sheet-open', open && isPhone())
    if (open) { sbSay(); if (focus) { var on = $('[aria-checked="true"]', stylesEl) || $('[data-compare]', stylesWrap); setTimeout(function () { on.focus({ preventScroll: true }) }, 40) } }
    else if (focus) t.focus({ preventScroll: true })
  }
  function setStyle(st, fromEl) {
    if (!STYLE[st]) return
    var wasCompare = S.view === 'compare'
    if (st === S.style && !wasCompare) return
    peekHide(true)
    S.style = st; S.view = 'grid'; store.set('style', st)
    if (V.open && !wasCompare) setViewerStyle(st, true)
    root.classList.add('is-loading')
    paintStylePills()
    loadStyle(st).then(function () {
      root.classList.remove('is-loading')
      if (wasCompare) { mounted.forEach(function (n) { n.remove() }); mounted.clear(); clearLabels() }
      runSearch(); buildItems(); layout()
      // remap mounted tiles to the new style key so they morph in place
      var old = mounted; mounted = new Map()
      old.forEach(function (n) { var nk = n._name + '|' + st; if (KEYS.has(nk) && !mounted.has(nk)) { n._k = nk; mounted.set(nk, n) } else n.remove() })
      gen++
      render({ refill: true, anim: wasCompare, prev: new Map() })
      if (!wasCompare) wave(fromEl)
      paintMeta(); paintCats(); paintSel(); syncUrl()
    })
  }
  function clearLabels() { labels.forEach(function (l) { l.remove() }); labels.clear() }
  function wave(fromEl) {
    if (reduced) return
    var rng = visibleRange(), originCol = 0
    if (fromEl) { var gr = grid.getBoundingClientRect(), fr = fromEl.getBoundingClientRect(); originCol = clamp(Math.floor((fr.left + fr.width / 2 - gr.left) / (L.tw + L.gap)), 0, L.cols - 1) }
    mounted.forEach(function (n) {
      var p = pos(n._idx); if (p.row < rng.vis0 - 1 || p.row > rng.vis1 + 1) return
      var d = Math.min((Math.abs(p.col - originCol) + (p.row - rng.vis0)) * 28, 700)
      var g = n.querySelector('.t-ic'); if (!g) return
      g.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1.06)', opacity: 1, offset: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: d, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' })
      if (DRAWABLE[S.style]) entrance(n, d, S.style, true)
    })
  }
  function setView(v) {
    if (S.view === v) return
    S.view = v
    peekHide(true)
    root.classList.add('is-loading')
    paintStylePills()
    ;(v === 'compare' ? loadAll() : loadStyle(S.style)).then(function () {
      root.classList.remove('is-loading')
      mounted.forEach(function (n) { n.remove() }); mounted.clear(); clearLabels()
      gen++; S.fi = 0
      runSearch(); buildItems(); layout(); render({ anim: true, prev: new Map() })
      paintMeta(); paintCats(); paintSel(); syncUrl(); paintStylePills()
    })
  }

  /* ───────────────────────── grid interactions ───────────────────────── */
  function itemOf(n) { return n && n._k != null ? ITEMS[KEYS.get(n._k)] : null }
  function tileFromEvent(e) { var t = e.target.closest && e.target.closest('.tile'); return t && grid.contains(t) ? t : null }
  var lastClickIdx = -1
  grid.addEventListener('click', function (e) {
    var lab = e.target.closest && e.target.closest('[data-open]')
    if (lab) { openViewer(lab.getAttribute('data-open'), S.style, { from: lab }); return }
    var n = tileFromEvent(e); if (!n) return
    var it = itemOf(n); if (!it) return
    var idx = KEYS.get(it.k)
    S.fi = idx; refreshTabStops()
    if (e.shiftKey) { if (lastClickIdx >= 0) selectRange(lastClickIdx, idx); else toggleSel(it.k); lastClickIdx = idx; return }
    if (e.metaKey || e.ctrlKey || e.target.closest('.t-chk') || root.classList.contains('is-selecting')) { toggleSel(it.k); lastClickIdx = idx; return }
    lastClickIdx = idx
    peekHide(true)
    // desktop: copy + show details beside the grid. phones: open the sheet (it has a big Copy button)
    if (!isSheet()) copyImage(it.st, it.name).then(function (ok) { if (ok) tileYay(n) })
    openViewer(it.name, it.st, { from: n })
  })
  function toggleSel(k) {
    if (S.sel.has(k)) S.sel.delete(k); else S.sel.add(k)
    var n = mounted.get(k); if (n) { paintTileState(n); if (!reduced && S.sel.has(k)) n.querySelector('.t-chk').animate([{ transform: 'scale(.4)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' }) }
    paintSel()
  }
  function selectRange(a, b) {
    var lo = Math.min(a, b), hi = Math.max(a, b)
    for (var i = lo; i <= hi; i++) S.sel.add(ITEMS[i].k)
    mounted.forEach(paintTileState); paintSel()
  }
  function clearSel() { S.sel.clear(); mounted.forEach(paintTileState); paintSel() }
  function paintSel() {
    var n = S.sel.size
    root.classList.toggle('has-sel', n > 0)
    selbar.classList.toggle('is-on', n > 0)
    selbar.setAttribute('aria-hidden', n ? 'false' : 'true')
    $$('button', selbar).forEach(function (b) { b.tabIndex = n ? 0 : -1 })
    $('[data-sel-n]', selbar).textContent = n
    $('[data-sel-s]', selbar).textContent = n === 1 ? '' : 's'
    $('[data-sel-prev]', selbar).innerHTML = Array.from(S.sel).slice(-5).map(function (k) { var p = k.split('|'); return '<span style="--sc:var(--s-' + p[1] + ');--on-sc:var(--on-' + p[1] + ')">' + glyph(p[1], p[0]) + '</span>' }).join('')
    $$('[data-zip-px]', selbar).forEach(function (el) { el.textContent = S.px })
    // toasts sit above the bar, whatever height it wraps to
    if (n) toastEl.style.setProperty('--selbar-h', selbar.offsetHeight + 'px')
  }
  function refreshTabStops() { mounted.forEach(function (n) { n.tabIndex = n._idx === S.fi ? 0 : -1 }) }

  // keyboard: roving focus over the virtual grid
  grid.addEventListener('keydown', function (e) {
    var n = tileFromEvent(e); if (!n) return
    // the hover card names the keys for the icon under the pointer: they act on that one, not on a tile clicked earlier
    if (PK.on && !PK.kb && PK.tile && PK.tile !== n && PK.tile.isConnected && /^(Enter|c|C|d|D|s|S)$/.test(e.key) && !e.ctrlKey && !e.metaKey) n = PK.tile
    var idx = n._idx, cols = L.cols, next = idx
    switch (e.key) {
      case 'ArrowRight': next = idx + 1; break
      case 'ArrowLeft': next = idx - 1; break
      case 'ArrowDown': next = idx + cols; break
      case 'ArrowUp': next = idx - cols; break
      case 'Home': next = e.ctrlKey ? 0 : idx - (idx % cols); break
      case 'End': next = e.ctrlKey ? ITEMS.length - 1 : Math.min(ITEMS.length - 1, idx - (idx % cols) + cols - 1); break
      case 'PageDown': next = idx + cols * Math.max(1, Math.floor(W.innerHeight / L.rowH) - 1); break
      case 'PageUp': next = idx - cols * Math.max(1, Math.floor(W.innerHeight / L.rowH) - 1); break
      case 'Enter': e.preventDefault(); peekHide(true); if (!isSheet()) copyImage(ITEMS[idx].st, ITEMS[idx].name); openViewer(ITEMS[idx].name, ITEMS[idx].st, { from: n, keyboard: true }); return
      case ' ': e.preventDefault(); toggleSel(ITEMS[idx].k); return
      case 'a': case 'A': if (e.ctrlKey || e.metaKey) { e.preventDefault(); selectRange(0, ITEMS.length - 1) } return
      case 'd': case 'D': if (!e.ctrlKey && !e.metaKey) downloadPng(ITEMS[idx].st, ITEMS[idx].name); return
      case 's': case 'S': if (!e.ctrlKey && !e.metaKey) downloadSvg(ITEMS[idx].st, ITEMS[idx].name); return
      case 'c': case 'C': if (!e.ctrlKey && !e.metaKey) copySvgCode(ITEMS[idx].st, ITEMS[idx].name); return
      case 'i': case 'I': case 'o': case 'O': openViewer(ITEMS[idx].name, ITEMS[idx].st, { from: n, keyboard: true, focus: true }); return
      default: return
    }
    e.preventDefault()
    focusIndex(clamp(next, 0, ITEMS.length - 1))
  })
  function focusIndex(i, noFocus) {
    S.fi = i
    scrollToIndex(i)
    render()
    var n = mounted.get(ITEMS[i].k); refreshTabStops()
    if (n && !noFocus) { n.focus({ preventScroll: true }); playTile(n) }
    // the docked viewer follows the keyboard
    if (V.open && !isSheet() && !V.full) { setViewerIcon(ITEMS[i].name, S.view === 'compare' ? ITEMS[i].st : V.st); if (n) V.returnFocus = n }
  }
  function scrollToIndex(i, center) {
    if (!ITEMS[i]) return
    var p = pos(i), gr = grid.getBoundingClientRect(), top = gr.top + p.y, bar = barBottom()
    var by = function (d) { W.scrollBy({ top: d, behavior: 'instant' }) }
    if (center && (top < bar + 8 || top + L.th > W.innerHeight - 12)) { by(top - (bar + (W.innerHeight - bar) / 2 - L.th / 2)); return }
    if (top < bar + 8) by(top - bar - 8)
    else if (top + L.th > W.innerHeight - 12) by(top + L.th - W.innerHeight + 12)
  }
  function barBottom() { var b = $('[data-bar]'); return b ? b.getBoundingClientRect().bottom : 0 }

  // drag out: PNG via DownloadURL (Chrome/Edge to desktop), image HTML + SVG text for apps
  grid.addEventListener('pointerover', function (e) {
    var n = tileFromEvent(e); if (!n || e.pointerType !== 'mouse') return
    if (S.animate && !(e.relatedTarget && n.contains(e.relatedTarget))) playTile(n)
    if (!n._warm) { n._warm = 1; renderPng(n._st, n._name, S.px).catch(function () { }) }
    peekOver(n)
  })
  grid.addEventListener('pointerout', function (e) {
    if (e.pointerType !== 'mouse') return
    var to = e.relatedTarget, t = to && to.closest && to.closest('.tile')
    if (!t || !grid.contains(t)) peekLeave()
  })
  grid.addEventListener('focusin', function (e) { var n = tileFromEvent(e); if (n) peekFocus(n) })
  grid.addEventListener('focusout', function (e) { if (PK.kb && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.tile'))) peekHide() })
  grid.addEventListener('dragstart', function (e) {
    var n = tileFromEvent(e); if (!n) return
    peekHide(true); PK.sup = n
    dragData(e, n._st, n._name, n.querySelector('.t-ic svg'))
    n.classList.add('is-drag')
  })
  grid.addEventListener('dragend', function (e) { var n = tileFromEvent(e); if (n) n.classList.remove('is-drag') })
  function dragData(e, st, name, ghost) {
    var dt = e.dataTransfer; if (!dt) return
    var svg = fileSvg(st, name), svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    var p = pngCache.get(pngKey(st, name, S.px)), png = p && p.value
    dt.effectAllowed = 'copy'
    try {
      if (png && png.dataUrl) dt.setData('DownloadURL', 'image/png:' + fname(st, name, 'png', S.px) + ':' + png.dataUrl)
      else dt.setData('DownloadURL', 'image/svg+xml:' + fname(st, name, 'svg') + ':' + svgUrl)
    } catch (err) { }
    var src = png && png.dataUrl ? png.dataUrl : svgUrl
    dt.setData('text/uri-list', src)
    dt.setData('text/html', '<img src="' + src + '" width="' + S.px + '" height="' + S.px + '" alt="' + esc(BY[name].title) + ' icon">')
    dt.setData('text/plain', svg)
    if (ghost && dt.setDragImage) { try { dt.setDragImage(ghost, ghost.clientWidth / 2, ghost.clientHeight / 2) } catch (err) { } }
    bump(name)
  }

  /* ───────────────────────── hover card ─────────────────────────
     A rich preview of the icon under the pointer (or the keyboard-focused tile): a big drawing in the current style on a
     tinted stage, its name + category, why it matched, its motion (intent + a tiny looping preview), the icon in all
     styles, aliases and the keys that act on it. One fixed element, reused: it opens after a short rest, switches
     instantly while it is up (no flicker moving across tiles), closes fast, never covers the sticky bar and never leaves
     the viewport. Not on touch (a tap opens the drawer). Reduced motion: no scale-in, no looping preview. */
  var PK = { el: null, tile: null, key: '', t: 0, ct: 0, on: false, kb: false, at: 0, sup: null }
  var canHover = function () { return mq('(hover: hover) and (pointer: fine)') }
  function peekBuild() {
    if (PK.el) return PK.el
    var el = D.createElement('div')
    el.className = 'lib-peek'; el.id = 'lib-peek'; el.setAttribute('role', 'tooltip')
    el.innerHTML = '<div class="pk-in">' +
      '<div class="pk-stage"><span class="pk-art" data-pk-art></span><span class="pk-style" data-pk-style></span></div>' +
      '<div class="pk-body">' +
        '<p class="pk-cat" data-pk-cat></p>' +
        '<p class="pk-name" data-pk-name></p>' +
        '<p class="pk-why" data-pk-why hidden></p>' +
        '<div class="pk-motion" data-pk-motion><span class="pk-mo" data-pk-mo aria-hidden="true"></span><span class="pk-mo-t"><b data-pk-mo-l>Moves</b><span data-pk-intent></span></span></div>' +
        '<div class="pk-strip" data-pk-strip aria-hidden="true"></div>' +
        '<p class="pk-also" data-pk-also></p>' +
      '</div>' +
      '<p class="pk-keys" data-pk-keys></p>' +
    '</div>'
    D.body.appendChild(el)
    PK.el = el
    syncPeekLook()
    return el
  }
  // the card lives outside .lib: it copies the grid's colour / stroke so its drawing matches the tiles
  function syncPeekLook() {
    if (!PK.el) return
    PK.el.style.setProperty('--ic', root.style.getPropertyValue('--ic') || 'var(--l-fg)')
    PK.el.classList.toggle('has-sw', S.sw != null)
    if (S.sw == null) PK.el.style.removeProperty('--l-sw'); else PK.el.style.setProperty('--l-sw', S.sw)
  }
  function peekOver(n) {
    if (!canHover() || n === PK.sup) return
    PK.sup = null
    clearTimeout(PK.ct)
    if (PK.on && PK.tile === n) return
    // the open viewer already shows everything about an icon: no card on top of it. Otherwise only after a real rest
    // on one tile (no warm-follow: sweeping across the grid never drags a card along)
    clearTimeout(PK.t)
    if (PK.on) peekHide(true)
    if (V.open) return
    PK.t = setTimeout(function () { if (n.isConnected && n.matches(':hover') && !V.open) peekShow(n, false) }, 700)
  }
  function peekLeave() { clearTimeout(PK.t); clearTimeout(PK.ct); if (PK.on && !PK.kb) PK.ct = setTimeout(function () { peekHide() }, 90) }
  function peekFocus(n) {
    if (!n.matches(':focus-visible')) return
    clearTimeout(PK.t); clearTimeout(PK.ct)
    if (V.open) return
    if (PK.on) peekShow(n, true)
    else PK.t = setTimeout(function () { if (D.activeElement === n && !V.open) peekShow(n, true) }, 700)
  }
  function peekHide(now) {
    clearTimeout(PK.t); clearTimeout(PK.ct)
    if (!PK.on) return false
    PK.on = false; PK.at = performance.now()
    if (PK.tile) PK.tile.removeAttribute('aria-describedby')
    PK.tile = null; PK.kb = false
    PK.el.classList.remove('is-on')
    if (now) PK.el.classList.add('is-instant')
    var mo = $('[data-pk-mo]', PK.el); if (mo) mo.innerHTML = ''   // stop the looping preview
    return true
  }
  function peekShow(n, kb) {
    var it = itemOf(n); if (!it) return
    var el = peekBuild()
    if (PK.tile && PK.tile !== n) PK.tile.removeAttribute('aria-describedby')
    var was = PK.on
    PK.tile = n; PK.kb = !!kb; PK.on = true
    peekFill(it)
    n.setAttribute('aria-describedby', 'lib-peek')
    peekPlace(n)
    el.classList.toggle('is-instant', was)
    if (!was) { el.classList.remove('is-on'); void el.offsetWidth }
    el.classList.add('is-on')
    // the card wants every style (the strip) and the motion data: fetch them now if the visitor has not warmed up yet
    if (!W.WITH_MOTION) loadMotion().then(function () { if (PK.on && PK.tile) { peekFill(itemOf(PK.tile), true); peekPlace(PK.tile) } })
  }
  function peekFill(it, force) {
    if (!it || !PK.el) return
    var el = PK.el, name = it.name, st = it.st, ic = BY[name], key = name + '|' + st + '|' + S.q + '|' + Object.keys(W.WITH_SVG || {}).length + '|' + (W.WITH_MOTION ? 1 : 0) + '|' + PK.kb
    if (!force && key === PK.key) return
    var same = PK.key.split('|')[0] === name && PK.key.split('|')[1] === st
    PK.key = key
    el.style.setProperty('--sc', 'var(--s-' + st + ')'); el.style.setProperty('--sc-text', 'var(--t-' + st + ')')
    var art = $('[data-pk-art]', el)
    art.innerHTML = has(st, name) ? svgInline(st, name) : '<span class="t-skel" aria-hidden="true"></span>'
    if (!same && !reduced && el.classList.contains('is-on')) art.animate([{ transform: 'scale(.86)', opacity: 0.35 }, { transform: 'none', opacity: 1 }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' })
    var g = GROUP_OF[st]
    $('[data-pk-style]', el).innerHTML = '<i aria-hidden="true"></i>' + esc(STYLE[st].title) + (g ? '<small>' + esc(g.title) + '</small>' : '')
    $('[data-pk-cat]', el).innerHTML = (svgMap('line') ? glyph('line', catIcon(ic.category)) : '') + '<span>' + esc(cap(ic.category)) + '</span>'
    $('[data-pk-name]', el).textContent = ic.title
    var why = S.view === 'grid' ? whyHtml(it.r && it.r.match, name) : '', whyEl = $('[data-pk-why]', el)
    whyEl.hidden = !why; whyEl.innerHTML = why ? 'Found because it ' + why.replace(/^≈/, 'is close to') : ''
    // motion: what the icon does, and a tiny loop of it
    var spec = W.WITH_MOTION && W.WITH_MOTION[name], mo = $('[data-pk-mo]', el), moBox = $('[data-pk-motion]', el)
    var entry = spec && (spec.loop || spec.hover), P = W.WithEditor && W.WithEditor.PRESETS
    moBox.classList.toggle('is-wait', !spec)
    if (spec && entry) {
      var mi = W.WithEditor && W.WithEditor.motionAttrs(entry, { trigger: 'loop', stroked: !!DRAWABLE[st] })
      mo.innerHTML = mi && has(st, name) ? '<span class="pk-mo-in ' + mi.cls + '" style="' + esc(mi.style) + '">' + svgInline(st, name) + '</span>' : (has(st, name) ? svgInline(st, name) : '')
      if (mi && mi.preset === 'draw' && W.WithEditor.prepareDraw) W.WithEditor.prepareDraw(mo)
      $('[data-pk-mo-l]', el).textContent = (mi && P && P[mi.preset] ? P[mi.preset].label : 'Animated')
      $('[data-pk-intent]', el).textContent = spec.intent ? cap(spec.intent) : 'Moves gently to draw the eye'
    } else {
      mo.innerHTML = ''
      $('[data-pk-mo-l]', el).textContent = 'Animation'
      $('[data-pk-intent]', el).textContent = spec ? 'Still by design' : 'Getting its animation…'
    }
    // the same icon in every style; the current one is ringed
    $('[data-pk-strip]', el).innerHTML = SNAMES.map(function (s2) {
      var body = has(s2, name) ? glyph(s2, name) : '<i class="pk-dot"></i>'
      return '<span class="pk-s' + (s2 === st ? ' is-on' : '') + '" style="--sc:var(--s-' + s2 + ')">' + body + '</span>'
    }).join('')
    var al = (ic.aliases || []).filter(function (a) { return norm(a).replace(/-/g, ' ') !== name.replace(/-/g, ' ') }).slice(0, 4)
    var alEl = $('[data-pk-also]', el); alEl.hidden = !al.length
    alEl.innerHTML = al.length ? '<span>Also</span>' + al.map(function (a) { return '<b>' + esc(String(a).replace(/-/g, ' ')) + '</b>' }).join('') : ''
    var k = function (x) { return '<kbd>' + x + '</kbd>' }
    $('[data-pk-keys]', el).innerHTML = PK.kb
      ? '<span>' + k('↵') + ' copy &amp; open</span><span>' + k('C') + ' SVG</span><span>' + k('D') + ' PNG</span><span>' + k('Space') + ' select</span>'
      : '<span class="pk-click">' + ICO.copy + 'Click to copy</span><span>' + k('↵') + ' open</span><span>' + k('C') + ' SVG</span><span>' + k('D') + ' PNG</span>'
  }
  function peekPlace(n) {
    var el = PK.el, r = n.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight
    var bar = $('[data-bar]'), stuck = bar && bar.classList.contains('is-stuck')
    // below the sticky bar once it is stuck; below the site header otherwise
    var vw = D.documentElement.clientWidth, vh = W.innerHeight, m = 12, gap = 12, top0 = (stuck ? Math.max(0, barBottom()) : parseFloat(root.style.getPropertyValue('--lib-top')) || 0) + 8
    var x, y, side
    // the docked details panel is a wall too: the card prefers the side that leaves it uncovered
    var vr = V.open && !V.full && !isSheet() && !viewer.hidden ? viewer.getBoundingClientRect() : null, right = vr && vr.width ? Math.min(vw, vr.left) : vw
    if (r.right + gap + w <= right - m) { x = r.right + gap; side = 'r' }
    else if (r.left - gap - w >= m) { x = r.left - gap - w; side = 'l' }
    else { x = clamp(r.left + r.width / 2 - w / 2, m, vw - m - w); side = r.top - gap - h >= top0 ? 't' : 'b' }
    if (side === 'r' || side === 'l') y = clamp(r.top + r.height / 2 - h / 2, top0, Math.max(top0, vh - m - h))
    else y = side === 't' ? r.top - gap - h : Math.min(r.bottom + gap, vh - m - h)
    x = Math.round(x); y = Math.round(y)
    el.style.transform = 'translate(' + x + 'px,' + y + 'px)'
    el.setAttribute('data-side', side)
    // the caret points at the tile's centre, wherever the card had to settle
    el.style.setProperty('--pk-ay', clamp(r.top + r.height / 2 - y, 22, h - 22) + 'px')
    el.style.setProperty('--pk-ax', clamp(r.left + r.width / 2 - x, 22, w - 22) + 'px')
  }
  // keys while the pointer rests on a tile (the focused tile has its own, in the grid's keydown)
  W.addEventListener('keydown', function (e) {
    if (!PK.on || PK.kb || !PK.tile || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return
    // only when nothing else has focus: a focused tile handles its own keys, fields and buttons keep theirs
    var a = D.activeElement
    if (a && a !== D.body && a !== D.documentElement) return
    var it = itemOf(PK.tile); if (!it) return
    var k = e.key.toLowerCase(), n = PK.tile
    if (k === 'enter') { e.preventDefault(); peekHide(true); if (!isSheet()) copyImage(it.st, it.name); openViewer(it.name, it.st, { from: n }) }
    else if (k === 'c') { e.preventDefault(); copySvgCode(it.st, it.name) }
    else if (k === 'd') { e.preventDefault(); downloadPng(it.st, it.name) }
    else if (k === 's') { e.preventDefault(); downloadSvg(it.st, it.name) }
  })
  W.addEventListener('scroll', function () { if (PK.on) { peekHide(true); PK.at = 0 } }, { passive: true })
  D.addEventListener('pointerdown', function (e) { if (PK.on || PK.t) { var t = e.target.closest && e.target.closest('.tile'); peekHide(true); PK.sup = t || null } }, true)
  W.addEventListener('blur', function () { peekHide(true) })

  /* ═════════════════════════ DETAILS VIEWER ═════════════════════════ */
  var ICO = {
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.5 8.5 V6 A2.5 2.5 0 0 0 13 3.5 H6 A2.5 2.5 0 0 0 3.5 6 V13 A2.5 2.5 0 0 0 6 15.5 H8.5" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 V15 M7 10.5 L12 15.5 L17 10.5 M4.5 19.5 H19.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 7 L3.5 12 L8.5 17 M15.5 7 L20.5 12 L15.5 17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4 H20 V10 M20 4 L13.5 10.5 M10 20 H4 V14 M4 20 L10.5 13.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shrink: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 10.5 H13.5 V4.5 M13.5 10.5 L20 4 M4.5 13.5 H10.5 V19.5 M10.5 13.5 L4 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14 A4 4 0 0 0 15.66 14 L18.5 11.17 A4 4 0 0 0 12.83 5.5 L11.5 6.83 M14 10 A4 4 0 0 0 8.34 10 L5.5 12.83 A4 4 0 0 0 11.17 18.5 L12.5 17.17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4 H20 V10 M20 4 L11 13 M18 14 V18.5 A1.5 1.5 0 0 1 16.5 20 H5.5 A1.5 1.5 0 0 1 4 18.5 V7.5 A1.5 1.5 0 0 1 5.5 6 H10" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z" fill="currentColor"/><path d="M19 3 L19.6 4.9 L21.5 5.5 L19.6 6.1 L19 8 L18.4 6.1 L16.5 5.5 L18.4 4.9 Z" fill="currentColor" opacity=".6"/></svg>',
    searchFace: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 15.5 L20.5 20.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8.5 9.5 h.01 M12.5 9.5 h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8.5 13 Q10.5 11.6 12.5 13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    pick: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 L18.5 9.5 M4 20 L5 16 L15.5 5.5 A2.83 2.83 0 0 1 19.5 9.5 L9 20 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  }
  var SIZES = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024]
  var PRESETS = [64, 128, 256, 512, 1024]
  var PALETTE = [['ink', 'Auto (ink)'], ['style', 'Style colour'], ['#111318', 'Ink black'], ['#FFFFFF', 'White'], ['#2F5BFF', 'Cobalt'], ['#FF5A36', 'Tomato'], ['#7B5CFF', 'Violet'], ['#FF4FA3', 'Pink'], ['#C9962B', 'Gold'], ['#00A3C4', 'Cyan'], ['#22A861', 'Leaf']]
  var BG_LIST = [['auto', 'Auto: matches the icon’s colours'], ['paper', 'Paper'], ['white', 'White'], ['dark', 'Dark'], ['brand', 'Style colour'], ['check', 'Transparent']]
  var SHAPES = [['round', 'Rounded', '<rect x="4" y="4" width="16" height="16" rx="4.5"/>'], ['circle', 'Circle', '<circle cx="12" cy="12" r="8"/>'], ['square', 'Square', '<rect x="4" y="4" width="16" height="16"/>']]

  var STOP = { off: 1, on: 1, in: 1, out: 1, the: 1, and: 1, with: 1, for: 1, icon: 1, open: 1, line: 1, circle: 1, square: 1 }
  function related(name) {
    var ic = BY[name], tags = {}, words = {}, als = {}
    ;(ic.tags || []).forEach(function (t) { tags[t] = 1 })
    ;(ic.aliases || []).forEach(function (a) { als[a] = 1 })
    ;(ic.aliases || []).concat(name.split('-')).forEach(function (a) { String(a).split(/[-\s]/).forEach(function (w) { if (w.length > 2 && !STOP[w]) words[w] = 1 }) })
    return ICONS.filter(function (x) { return x.name !== name }).map(function (x) {
      var s = x.category === ic.category ? 1.5 : 0
      ;(x.tags || []).forEach(function (t) { if (tags[t]) s += 2 })
      ;(x.aliases || []).forEach(function (a) { if (als[a]) s += 2.5 })
      x.name.split('-').forEach(function (w) { if (words[w]) s += 3 })
      return [s, x.name]
    }).filter(function (p) { return p[0] > 0 }).sort(function (a, b) { return b[0] - a[0] || (a[1] < b[1] ? -1 : 1) }).slice(0, 12).map(function (p) { return p[1] })
  }
  function snippets(st, name) {
    var C = comp(name), sub = st === 'line' ? '' : '/' + st, T = BY[name].title, alias = st === 'line' ? C : C + cap(st)
    var imp = function (pkg) { return st === 'line' ? "import { " + C + " } from '" + pkg + "'" : "import { " + C + " as " + alias + " } from '" + pkg + sub + "'" }
    // the open icon's custom colours: CSS variables in a style attribute / prop (they reach the inline SVG)
    var css = edCss(st, name), cz = css ? edColors(st, name) : null
    var sa = css ? ' style="' + css + '"' : ''
    var sj = css ? ' style={{ ' + (cz.ink ? "color: '" + cz.ink + "', " : '') + Object.keys(cz.vars).map(function (k) { return "'" + k + "': '" + cz.vars[k] + "'" }).join(', ') + ' }}' : ''
    return [
      { id: 'react', label: 'React', file: 'App.jsx', code: imp('@withicons/react') + "\n\nexport const Example = () => <" + alias + " size={24} title=\"" + T + "\"" + sj + " />" },
      { id: 'vue', label: 'Vue', file: 'Example.vue', code: "<script setup>\n" + imp('@withicons/vue') + "\n</script>\n\n<template>\n  <" + alias + " :size=\"24\"" + sa + " />\n</template>" },
      { id: 'svelte', label: 'Svelte', file: 'Example.svelte', code: "<script>\n  " + imp('@withicons/svelte') + "\n</script>\n\n<" + alias + " size={24}" + sa + " />" },
      { id: 'angular', label: 'Angular', file: 'example.component.ts', code: "import { Component } from '@angular/core'\n" + (st === 'line' ? "import { WithIconComponent, " + C + " } from '@withicons/angular'" : "import { WithIconComponent } from '@withicons/angular'\n" + imp('@withicons/angular')) + "\n\n@Component({\n  selector: 'app-example',\n  imports: [WithIconComponent],\n  template: `<with-icon [icon]=\"icon\" [size]=\"24\" />`,\n})\nexport class ExampleComponent { icon = " + alias + " }" },
      { id: 'solid', label: 'Solid', file: 'Example.tsx', code: imp('@withicons/solid') + "\n\nexport const Example = () => <" + alias + " size={24}" + (css ? ' style={{ ' + (cz.ink ? "color: '" + cz.ink + "', " : '') + Object.keys(cz.vars).map(function (k) { return "'" + k + "': '" + cz.vars[k] + "'" }).join(', ') + ' }}' : '') + " />" },
      { id: 'wc', label: 'Web component', file: 'index.html', code: '<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js"></script>\n\n<with-icon name="' + name + '"' + (st === 'line' ? '' : ' variant="' + st + '"') + ' label="' + T + '"' + sa + '></with-icon>' },
      { id: 'classes', label: 'Icon classes', file: 'index.html', code: (css ? '<!-- custom colours need the runtime (inline SVG): CSS-only icons can’t see CSS variables -->\n' + RUNTIME : LOADER) + '\n\n' + iTag(name, st) },
      { id: 'svg', label: 'SVG', file: fname(st, name, 'svg'), code: css ? svgText(st, name, { mode: 'file', color: exportColor(st), pretty: true }) : codeSvg(st, name) },
    ]
  }
  // setup line for <i> tags: with-loader.js (~6 KB gzipped) links just the CSS of the icons on the page, in any mix of
  // styles (a line icon ~270 bytes gzipped). Custom colours need with-icons.js (inline SVG, also only the icons shown).
  // Whole-style stylesheets (with-line.css ~26 KB gzipped) and with-all.css (~6.3 MB gzipped) are opt-ins on the developers page.
  var LOADER = '<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>'
  function headLines(st, name) { return edCss(st, name) ? RUNTIME : LOADER }
  function iTag(name, st, plain) { var c = plain ? '' : edCss(st, name); return '<i class="with with-' + name + (st && st !== 'line' ? ' with-' + st : '') + '"' + (c ? ' style="' + c + '"' : '') + '></i>' }
  // the open icon's own colours (Colours panel in the Look tab, owned by the studio in js/editor.js) for exports and code
  function edColors(st, name) { if (!ED || !V.open || name !== V.name) return null; var e = ED.get(); return e.name === name ? ED.colorsFor(st, name) : null }
  function edCss(st, name) { var cz = edColors(st, name); if (!cz) return ''; var p = cz.ink ? ['color: ' + cz.ink] : []; Object.keys(cz.vars).forEach(function (k) { p.push(k + ': ' + cz.vars[k]) }); return p.join('; ') }
  var RUNTIME = '<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-icons.js" defer></script>'
  function flash(btn, label) { var p = btn.querySelector('[data-vw-tagdone]') || btn; var old = p.textContent; btn.classList.add('is-done'); p.textContent = label || 'Copied'; clearTimeout(btn._ft); btn._ft = setTimeout(function () { btn.classList.remove('is-done'); p.textContent = old === (label || 'Copied') ? 'Copy' : old }, 1500) }
  function hl(code) { var w = WI(); return w && w.highlight ? w.highlight(code) : esc(code) }

  function sizeIndex(px) { var i = SIZES.indexOf(px); if (i >= 0) return i; for (i = 0; i < SIZES.length; i++) if (SIZES[i] >= px) return i; return SIZES.length - 1 }

  // build the viewer skeleton once; parts are repainted in place (sliders never rebuild the DOM).
  // Progressive disclosure: the header, the stage + style strip, ONE primary action (Copy image), three quiet secondary
  // ones (PNG + size, SVG, SVG code) and the "use it in code" bar are always shown; everything else lives in labelled
  // accordions (Make it yours · More formats · See it in use · Related · Ask AI · For developers) that remember their state.
  var STACKS = [['html', 'HTML <i> tag'], ['react', 'React'], ['vue', 'Vue'], ['svelte', 'Svelte'], ['angular', 'Angular'], ['solid', 'Solid'], ['web', 'Web component'], ['svg', 'SVG']]
  var ACC_DEF = { tune: false, dl: false, use: false, rel: false, ai: false }
  function acc(id, title, sub, inner, extra) {
    var open = accOpen(id)
    return '<details class="vw-acc" data-vw-acc="' + id + '"' + (extra || '') + (open ? ' open' : '') + '><summary class="vw-acc-s"><span class="vw-acc-t"><b>' + title + '</b><small>' + sub + '</small></span><span class="vw-acc-x" aria-hidden="true"></span></summary><div class="vw-acc-b">' + inner + '</div></details>'
  }
  function accOpen(id) { var o = store.get('acc', {}) || {}; return o[id] != null ? !!o[id] : !!ACC_DEF[id] }
  function buildViewer() {
    vwBody.innerHTML =
      '<div class="vw-topline" data-vw-drag>' +
          '<b class="vw-mini-t" data-vw-mini-t aria-hidden="true"></b><p class="vw-crumbs"><a data-vw-cat href="#"></a><span class="vw-dot" aria-hidden="true"></span><span class="vw-stname" data-vw-stname></span></p>' +
          '<div class="vw-hbtns">' +
            '<button type="button" class="vw-ib" data-vw="prev" aria-label="Previous icon" title="Previous icon (←)">' + ICO.prev + '</button>' +
            '<button type="button" class="vw-ib" data-vw="next" aria-label="Next icon" title="Next icon (→)">' + ICO.next + '</button>' +
            '<button type="button" class="vw-ib" data-vw="share" aria-label="Copy a link to this icon" title="Copy link">' + ICO.link + '</button>' +
            '<button type="button" class="vw-ib vw-only-desk" data-vw="full" aria-label="Expand to full screen" title="Full screen (F)">' + ICO.expand + '</button>' +
            '<button type="button" class="vw-ib is-close" data-vw="close" aria-label="Close details" title="Close (Esc)">' + ICO.close + '</button>' +
          '</div>' +
      '</div>' +
      '<header class="vw-head">' +
        '<h2 class="vw-title" id="vw-title" tabindex="-1" data-vw-title></h2>' +
        '<p class="vw-desc"><span data-vw-desc></span> <a class="vw-page" data-vw-page href="#"><span data-vw-pagetitle>Open the icon page</span>' + ICO.arrow + '</a></p>' +
      '</header>' +
      '<div class="vw-main">' +
        '<div class="vw-col-a">' +
          '<div class="vw-stage" data-vw-stage draggable="true" title="Drag me into your slides, doc or desktop">' +
            '<div class="vw-art" data-vw-art></div>' +
            '<span class="vw-drag-hint" aria-hidden="true">drag me out ↘</span>' +
            '<button type="button" class="vw-resetc" data-vw="reset-colors" tabindex="-1" aria-hidden="true" title="Back to this style’s own colours"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12 A7.5 7.5 0 1 0 7 6.4 M4 3.5 V7.5 H8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Reset colours</span></button>' +
            '<button type="button" class="vw-bgchip" data-vw="bgp" aria-expanded="false" aria-controls="vw-bgp" title="Preview background"><span class="vw-bgchip-sw" data-vw-bgsw aria-hidden="true"></span><span><span class="vh">Background: </span><span data-vw-bgname>Paper</span></span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10 L12 15 L17 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
            '<output class="vw-readout" data-vw-readout></output>' +
            '<button type="button" class="vw-surprise" data-vw="surprise" hidden title="A random palette picked for this icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg><span>Surprise me</span></button>' +
            '<button type="button" class="vw-play" data-vw="play" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5 V18.5 L18.5 12 Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg><span data-vw-playl>Play</span></button>' +
          '</div>' +
          // the Background panel: the preview's ground, and (opt-in) a backdrop baked into copies and downloads
          '<div class="vw-bgp" id="vw-bgp" data-vw-bgp hidden><div class="vw-bgp-in">' +
            '<div class="vw-bgp-row"><span class="vw-label" id="vw-bg-l">Background</span><div class="vw-bgs" role="radiogroup" aria-labelledby="vw-bg-l">' +
              BG_LIST.map(function (b) { return '<button type="button" role="radio" class="vw-bg is-' + b[0] + '" data-vw-bg="' + b[0] + '" aria-label="' + b[1] + '" title="' + b[1] + '"><span></span></button>' }).join('') +
              '<label class="vw-bg is-custom" title="Any colour"><input type="color" data-vw-bgc value="#F4E9FF" aria-label="Pick any background colour"><span>' + ICO.pick + '</span></label>' +
            '</div></div>' +
            '<label class="vw-check"><input type="checkbox" data-vw-bginc><span class="vw-check-ui" aria-hidden="true"></span><span>Use this background in downloads <small>copy image, PNG and SVG</small></span></label>' +
            '<div class="vw-bgp-tile" data-vw-tilerow>' +
              '<div class="vw-bgp-row"><span class="vw-label" id="vw-shape-l">Shape</span><div class="vw-shapes" role="radiogroup" aria-labelledby="vw-shape-l">' + SHAPES.map(function (x) { return '<button type="button" role="radio" data-vw-shape="' + x[0] + '" aria-checked="false"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + x[2] + '</svg><span>' + x[1] + '</span></button>' }).join('') + '</div></div>' +
              '<div class="vw-field"><label class="vw-label" for="vw-pad">Padding</label><input class="vw-range" id="vw-pad" type="range" min="0" max="0.3" step="0.02" data-vw-pad><output class="vw-out" data-vw-padout></output></div>' +
            '</div>' +
          '</div></div>' +
          '<div class="vw-stylebar">' +
            '<p class="vw-stl" aria-hidden="true"><b data-vw-stl-n></b><span data-vw-stl-s></span></p>' +
            '<div class="vw-styles" role="radiogroup" aria-label="Style" data-vw-styles>' + SNAMES.map(function (s, i) { var g = GROUP_OF[s]; return '<button type="button" role="radio" class="vw-st" data-vw-st="' + s + '" data-group="' + (g ? g.id : '') + '" style="--sc:var(--s-' + s + ');--on-sc:var(--on-' + s + ')" aria-label="' + esc(STYLE[s].title) + '" title="' + esc(STYLE[s].title) + ' · ' + esc(sayOf(s)) + (i < 10 ? ' (' + ((i + 1) % 10) + ')' : '') + '"><span class="vw-st-g"></span><span class="vw-st-t">' + esc(STYLE[s].title) + '</span></button>' }).join('') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="vw-col-b">' +
          '<div class="vw-actions">' +
            '<button type="button" class="vw-btn is-primary" data-vw="copy-img">' + ICO.copy + '<span><b>Copy image</b><small>Paste into Slides, Docs, Notion, Canva</small></span><kbd class="vw-kbd">Enter</kbd></button>' +
            '<div class="vw-acts">' +
              '<div class="vw-pngw">' +
                '<button type="button" class="vw-act" data-vw="png" title="Download a PNG">' + ICO.down + '<span><b>PNG</b><small data-vw-pngsize></small></span></button>' +
                '<label class="vw-pxsel"><span class="vh">PNG size</span><select data-vw-pxsel>' + SIZES.filter(function (p) { return p >= 32 }).map(function (p) { return '<option value="' + p + '">' + p + ' px</option>' }).join('') + '</select></label>' +
              '</div>' +
              '<button type="button" class="vw-act" data-vw="svg" title="Download an SVG: sharp at any size">' + ICO.down + '<span><b>SVG</b><small>any size</small></span></button>' +
              '<button type="button" class="vw-act" data-vw="copy-svg" title="Copy SVG code for Figma, Canva or HTML">' + ICO.code + '<span><b>SVG code</b><small>Figma, HTML</small></span></button>' +
            '</div>' +
          '</div>' +
          '<div class="vw-quick" data-vw-quick>' +
            '<div class="vw-q-top"><span class="vw-q-l" id="vw-q-l">Use it in code</span>' +
              '<label class="vw-stack"><span class="vh">Code for</span><select data-vw-stack aria-describedby="vw-q-l">' + STACKS.map(function (s) { return '<option value="' + s[0] + '">' + esc(s[1]) + '</option>' }).join('') + '</select></label>' +
            '</div>' +
            '<div class="vw-q-row"><code class="vw-q-code" data-vw-q-code></code><button type="button" class="vw-q-copy" data-vw="copy-quick">' + ICO.copy + '<span data-vw-tagdone>Copy</span></button></div>' +
            '<details class="vw-once" data-vw-once><summary data-vw-once-s>Setup</summary><div class="vw-once-b" data-vw-once-b></div></details>' +
            '<details class="vw-once vw-sizeh" data-vw-sizeh><summary data-vw-sizeh-s>Make it bigger or smaller</summary><div class="vw-once-b" data-vw-sizeh-b></div></details>' +
          '</div>' +
          '<div class="vw-accs">' +
            acc('tune', 'Make it yours', 'Colours, size, stroke, motion, turn into',
              '<div class="vw-ttabs" role="tablist" aria-label="Customize" data-vw-ttabs style="--n:3"><span class="vw-ttab-ink" aria-hidden="true"></span>' +
                [['look', 'Look'], ['motion', 'Animate'], ['swap', 'Turn into']].map(function (t) { return '<button type="button" role="tab" id="vwtt-' + t[0] + '" data-vw-ttab="' + t[0] + '" aria-controls="' + (t[0] === 'look' ? 'vw-tp-look' : 'vw-tp-ed') + '" aria-selected="false" tabindex="-1">' + t[1] + (t[0] === 'motion' ? '<i class="vw-newdot" aria-hidden="true"></i>' : '') + '</button>' }).join('') +
              '</div>' +
              '<div class="vw-tpane" role="tabpanel" id="vw-tp-look" aria-labelledby="vwtt-look" data-vw-tpane="look">' +
                '<div class="vw-colors" data-vw-colors hidden></div><button type="button" class="vw-editcols" data-vw="editcols" aria-expanded="false"><span>Edit each colour</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10 L12 15 L17 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
                '<div class="vw-field" data-vw-monocol><span class="vw-label" id="vw-col-l">Colour</span>' +
                  '<div class="vw-swatches" role="radiogroup" aria-labelledby="vw-col-l">' + PALETTE.map(function (p) { return '<button type="button" role="radio" class="vw-sw' + (p[0] === 'ink' ? ' is-auto' : p[0] === 'style' ? ' is-style' : '') + '" data-vw-color="' + p[0] + '" title="' + p[1] + '" aria-label="' + p[1] + '"' + (p[0][0] === '#' ? ' style="--c:' + p[0] + '"' : '') + '><span></span></button>' }).join('') +
                    '<label class="vw-sw is-custom" title="Any colour"><input type="color" data-vw-custom value="#FF5A36" aria-label="Pick any colour"><span>' + ICO.pick + '</span></label>' +
                  '</div>' +
                  // typed hex: exact brand colours, keyboards and screen readers, Firefox for Android (its picker offers presets only)
                  '<label class="vw-hexrow"><span>Hex code</span><input class="vw-hex" data-vw-hex type="text" inputmode="text" maxlength="7" spellcheck="false" autocomplete="off" placeholder="#2F5BFF" title="Type or paste a hex code"></label>' +
                '</div>' +
                '<div class="vw-field"><label class="vw-label" for="vw-size">Size</label>' +
                  '<input class="vw-range" id="vw-size" type="range" min="0" max="' + (SIZES.length - 1) + '" step="1" data-vw-size aria-valuetext=""><output class="vw-out" data-vw-sizeout></output></div>' +
                '<div class="vw-field" data-vw-swrow><label class="vw-label" for="vw-sw">Stroke</label>' +
                  '<input class="vw-range" id="vw-sw" type="range" min="0.75" max="3" step="0.25" data-vw-sw><span class="vw-out"><output data-vw-swout></output><button type="button" class="vw-reset" data-vw="sw-reset">reset</button></span></div>' +
              '</div>' +
              '<div class="vw-tpane" role="tabpanel" id="vw-tp-ed" aria-labelledby="vwtt-motion" data-vw-tpane="ed" hidden><div class="vw-ed" data-vw-ed><p class="vw-ed-wait"><span class="t-skel" aria-hidden="true"></span>Getting the animations ready…</p></div></div>') +
            // every download format (the studio's Download panel, mounted with the studio; its scripts load on first use)
            acc('dl', 'More formats', 'Slides, design tools, websites, animated', '<div class="vw-dl" data-vw-dl><p class="vw-ed-wait"><span class="t-skel" aria-hidden="true"></span>Getting the formats ready…</p></div>', ' data-vw-dlsec') +
            acc('use', 'See it in use', '<span data-vw-mknote>Ten everyday places</span>', '<div class="mk-grid" data-vw-mocks></div>') +
            acc('rel', 'Related icons', 'Similar icons and other names for this one',
              '<div class="vw-rel" data-vw-rel></div><div class="vw-aka" data-vw-akasec><p class="vw-h3" id="vw-aka-h">Also known as</p><p class="vw-chips" data-vw-aka aria-labelledby="vw-aka-h"></p></div>') +
            acc('ai', 'Ask AI to help', 'A ready brief about this icon for your assistant', '<div class="vw-ai" data-vw-ai></div>') +
            '<details class="vw-acc vw-dev" data-vw-dev><summary class="vw-acc-s"><span class="vw-acc-t"><b>For developers</b><small>React, Vue, Svelte, Angular, Solid, web component, classes, SVG</small></span><span class="vw-acc-x" aria-hidden="true"></span></summary><div class="vw-acc-b">' +
              '<div class="vw-tabs" role="tablist" aria-label="Code format" data-vw-tabs></div>' +
              '<div class="vw-code" role="tabpanel" id="vw-codepanel" data-vw-codepanel><div class="vw-code-bar"><span data-vw-file></span><button type="button" class="vw-copy" data-vw="copy-code">' + ICO.copy + '<span>Copy</span></button></div><pre><code data-vw-code></code></pre></div>' +
              '<div class="vw-npm" data-vw-npm></div>' +
              '<details class="vw-once vw-sizeh" data-vw-dsize><summary data-vw-dsize-s>Make it bigger or smaller</summary><div class="vw-once-b" data-vw-dsize-b></div></details>' +
              '<p class="vw-npm vw-npm-docs"><a href="developers.html">Developer docs</a>: every package, prop and option.</p>' +
            '</div></details>' +
          '</div>' +
        '</div>' +
      '</div>'
    if (store.get('devopen', false)) $('[data-vw-dev]', vwBody).open = true
    // the action dock: Copy image · PNG · SVG · code, pinned to the bottom of the panel / sheet whenever the in-panel
    // actions are scrolled (or cropped) out of view, so the main jobs are always one tap away
    var live = D.createElement('p'); live.className = 'vh'; live.setAttribute('aria-live', 'polite'); live.setAttribute('data-vw-live', ''); viewer.appendChild(live)
    var dock = D.createElement('div'); dock.className = 'vw-dock'; dock.setAttribute('data-vw-dock', '')
    dock.innerHTML = '<button type="button" class="vw-dk is-primary" data-vw="copy-img">' + ICO.copy + '<span>Copy image</span></button>' +
      '<button type="button" class="vw-dk" data-vw="png" title="Download PNG">' + ICO.down + '<span>PNG</span></button>' +
      '<button type="button" class="vw-dk" data-vw="svg" title="Download SVG">' + ICO.down + '<span>SVG</span></button>' +
      '<button type="button" class="vw-dk" data-vw="copy-quick" data-vw-dkcode title="Copy the code">' + ICO.code + '<span data-vw-tagdone>Code</span></button>'
    viewer.appendChild(dock)
    if (W.IntersectionObserver) {
      // shown while Copy image or the code bar is out of view (scrolled away, or below the fold of a short panel)
      var seen = {}
      // each dock button stands in for its in-panel twin only while ALL of that twin is out of view (no duplicates on screen),
      // and while the dock shows, the body gives up the strip under it (.has-dock), so the dock never covers visible content
      var dockIO = new IntersectionObserver(function (en) { en.forEach(function (e) { seen[e.target.getAttribute('data-dock-k')] = e.isIntersecting && e.intersectionRatio > 0 }); V.dockWant = !(seen.a && seen.f && seen.q); V.dockMiss = { a: !seen.a, f: !seen.f, q: !seen.q }; paintDock() }, { threshold: [0, 0.01, 1] })
      ;[['.vw-btn.is-primary', 'a'], ['.vw-acts', 'f'], ['[data-vw-quick]', 'q']].forEach(function (x) { var el = $(x[0], vwBody); el.setAttribute('data-dock-k', x[1]); dockIO.observe(el) })
    }
    vwBody.addEventListener('scroll', function () { var sc = vwBody.scrollTop > 110; if (sc !== viewer.classList.contains('is-scrolled')) viewer.classList.toggle('is-scrolled', sc) }, { passive: true })
    var sk = stackGet(); $('[data-vw-stack]', vwBody).value = sk; V.tab = STACK2DEV[sk] || sk
    viewer._built = true
    kitUp(vwBody)
  }
  // the code bar's stack: shared with the icon pages (localStorage 'with-stack', plain string)
  function paintDock() {
    var d = $('[data-vw-dock]', viewer); if (!d) return
    // a phone sheet in peek ends below the screen, so a dock there would sit over visible content: only when full
    var on = !!(V.open && V.dockWant && !(isSheet() && V.snap !== 'full'))
    d.classList.toggle('is-on', on); viewer.classList.toggle('has-dock', on); var m = V.dockMiss || {}; d.classList.toggle('no-copy', !m.a); d.classList.toggle('no-files', !m.f); d.classList.toggle('no-code', !m.q); d.classList.toggle('is-solo', (m.a ? 1 : 0) + (m.f ? 2 : 0) + (m.q ? 1 : 0) === 1)
    var sk = $('[data-vw-stack] option:checked', vwBody), cb = $('[data-vw-dkcode]', d)
    if (cb && sk) cb.title = 'Copy the ' + sk.textContent + ' code'
    var cl = cb && $('span', cb); if (cl && !cb.classList.contains('is-done')) cl.textContent = d.classList.contains('is-solo') && sk ? 'Copy ' + sk.textContent.replace(/^HTML /, '') : 'Code'
  }
  function stackGet() { var v = null; try { v = localStorage.getItem('with-stack') } catch (e) { } if (v && v.charAt(0) === '"') { try { v = JSON.parse(v) } catch (e) { } } return STACKS.some(function (s) { return s[0] === v }) ? v : 'html' }
  function stackSet(v) { try { localStorage.setItem('with-stack', v) } catch (e) { } }
  // one-line usage per stack (shown), what Copy puts on the clipboard, and the one-time setup steps:
  // steps = [{ t: label (HTML), code }]; setup = the first step's line (the toast's "Copy setup line")
  var HEAD_T = function (n) { return 'Add ' + (n > 1 ? 'these lines' : 'this line') + ' once inside your page’s <code>&lt;head&gt;</code>' }
  function importLine(fw, st, name) {
    var C = comp(name), alias = st === 'line' ? C : C + cap(st), sub = st === 'line' ? '' : '/' + st
    if (fw === 'angular') return st === 'line' ? "import { WithIconComponent, " + C + " } from '@withicons/angular'" : "import { WithIconComponent } from '@withicons/angular'\nimport { " + C + " as " + alias + " } from '@withicons/angular" + sub + "'"
    return st === 'line' ? "import { " + C + " } from '@withicons/" + fw + "'" : "import { " + C + " as " + alias + " } from '@withicons/" + fw + sub + "'"
  }
  function fwSteps(fw, st, name) {
    return [{ t: 'Install once in your project', code: 'npm i @withicons/' + fw }, { t: 'Import it at the top of your file <small>(Copy adds it for you)</small>', code: importLine(fw, st, name) }]
  }
  function quickFor(stack, st, name) {
    var snips = {}; snippets(st, name).forEach(function (s) { snips[s.id] = s })
    var C = comp(name), alias = st === 'line' ? C : C + cap(st), css = edCss(st, name), cz = css ? edColors(st, name) : null
    var sa = css ? ' style="' + css + '"' : ''
    var sj = css ? ' style={{ ' + (cz.ink ? "color: '" + cz.ink + "', " : '') + Object.keys(cz.vars).map(function (k) { return "'" + k + "': '" + cz.vars[k] + "'" }).join(', ') + ' }}' : ''
    var fwq = function (fw, show, copy, note) { var steps = fwSteps(fw, st, name); return { show: show, copy: copy, steps: steps, setup: steps[0].code, note: note || 'Copies the import too' } }
    switch (stack) {
      case 'react': return fwq('react', '<' + alias + ' size={24}' + sj + ' />', snips.react.code)
      case 'vue': return fwq('vue', '<' + alias + ' :size="24"' + sa + ' />', snips.vue.code)
      case 'svelte': return fwq('svelte', '<' + alias + ' size={24}' + sa + ' />', snips.svelte.code)
      case 'angular': return fwq('angular', '<with-icon [icon]="icon" [size]="24" />', snips.angular.code, 'Copies the component too')
      case 'solid': return fwq('solid', '<' + alias + ' size={24}' + sj + ' />', snips.solid.code)
      case 'web': var wt = '<with-icon name="' + name + '"' + (st === 'line' ? '' : ' variant="' + st + '"') + ' label="' + BY[name].title + '"' + sa + '></with-icon>', wl = '<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js"></script>'; return { show: wt, copy: wt, setup: wl, steps: [{ t: HEAD_T(1), code: wl }] }
      case 'svg': return { show: '<svg viewBox="0 0 24 24" …>', copy: null, setup: '', steps: [] }
      default:
        if (ED && ED.code && ED.get().name === name && ED.get().style === st) {
          try {
            var full = ED.code('tag'), line = full.split('\n').filter(function (l) { return /^\s*<i /.test(l) })[0] || iTag(name, st), sl = ED.setup ? ED.setup('tag') : null
            if (!sl || !sl.length) sl = [headLines(st, name)]
            return { show: line.trim(), copy: full, setup: sl[0], steps: [{ t: HEAD_T(sl.length), code: sl.join('\n') }] }
          } catch (e) { }
        }
        return { show: iTag(name, st), copy: iTag(name, st), setup: headLines(st, name), steps: [{ t: HEAD_T(1), code: headLines(st, name) }] }
    }
  }
  // "Make it bigger or smaller": copyable 48 px versions per stack (an <i> tag is 1em square: height alone does nothing)
  function sizeFor(stack, st, name) {
    var C = comp(name), alias = st === 'line' ? C : C + cap(st), cls = 'with with-' + name + (st === 'line' ? '' : ' with-' + st)
    switch (stack) {
      case 'html': return { sub: 'font size, a size class or an exact size', say: 'The icon is 1em square, so it follows the text size. Three ways to make it 48 px:',
        rows: [{ t: 'Font size <small>(also grows with the text around it)</small>', code: '<i class="' + cls + '" style="font-size: 48px"></i>' },
          { t: 'A size class <small>(with-xs, with-sm, with-lg, with-2x to with-5x: times the text size)</small>', code: '<i class="' + cls + ' with-3x"></i>' },
          { t: 'An exact size <small>(whatever the text size)</small>', code: '<i class="' + cls + '" style="--with-size: 48px"></i>' }],
        note: 'Setting only <code>height</code> does not work: the width stays 1em.' }
      case 'web': return { sub: 'the size attribute', say: 'Use <code>size</code>: pixels, or any CSS length.', rows: [{ t: '', code: '<with-icon name="' + name + '"' + (st === 'line' ? '' : ' variant="' + st + '"') + ' size="48"></with-icon>' }] }
      case 'svg': return { sub: 'width and height', say: 'Change <code>width</code> and <code>height</code> on the <code>&lt;svg&gt;</code>. It stays sharp at any size.', rows: [{ t: '', code: '<svg width="48" height="48" viewBox="0 0 24 24" …>' }] }
      case 'vue': return { sub: 'the size prop', say: 'Use the <code>size</code> prop: a number in pixels, or any CSS length.', rows: [{ t: '', code: '<' + alias + ' :size="48" />' }] }
      case 'angular': return { sub: 'the size input', say: 'Use the <code>size</code> input: a number in pixels, or any CSS length.', rows: [{ t: '', code: '<with-icon [icon]="icon" [size]="48" />' }] }
      default: return { sub: 'the size prop', say: 'Use the <code>size</code> prop: a number in pixels, or any CSS length.', rows: [{ t: '', code: '<' + alias + ' size={48} />' }] }
    }
  }
  function onceRows(rows, act) {
    return rows.map(function (r, i) { return '<p>' + (r.t ? '<span>' + r.t + '</span>' : '') + '<code title="' + esc(r.code) + '">' + esc(r.code) + '</code><button type="button" class="vw-mini" data-vw="' + act + '" data-i="' + i + '">Copy</button></p>' }).join('')
  }
  function sizeHtml(z) { return '<p class="vw-once-say">' + z.say + '</p>' + onceRows(z.rows, 'copy-size') + (z.note ? '<p class="vw-once-say vw-once-note">' + z.note + '</p>' : '') }
  function paintQuick() {
    if (!viewer._built || !V.name) return
    var b = vwBody, sel = $('[data-vw-stack]', b), sk = sel.value, q = quickFor(sk, V.st, V.name)
    $('[data-vw-q-code]', b).textContent = q.show
    $('[data-vw-q-code]', b).title = q.copy || 'SVG code'
    var once = $('[data-vw-once]', b), fw = /^npm /.test(q.setup)
    once.hidden = !q.steps.length
    $('[data-vw-once-s]', b).textContent = (q.note ? q.note + ' · ' : '') + (sk === 'html' || sk === 'web' ? 'First time? Show setup' : 'Show install and import')
    $('[data-vw-once-b]', b).innerHTML = onceRows(q.steps, 'copy-css')
    V.qsteps = q.steps
    var z = sizeFor(sk, V.st, V.name)
    $('[data-vw-sizeh-b]', b).innerHTML = sizeHtml(z)
    V.qsize = z.rows
    if (fw) once.setAttribute('data-fw', ''); else once.removeAttribute('data-fw')
  }

  /* ── our own pickers (css/ui-kit.css + js/ui-kit.js, window.WIKit) instead of the browser's: the toolbar's and the
     drawer's "any colour" and sliders. The natives stay the value holders, so the listeners here keep working; the
     studio (js/editor.js) enhances its own fields. Colour suggestions: this icon's palettes, then every style colour. ── */
  function kitPalette(t) {
    var out = [], seen = {}, inViewer = viewer.contains(t), st = inViewer ? V.st : S.style, name = inViewer ? V.name : ''
    function add(c, n) { c = String(c || '').toUpperCase(); if (!/^#[0-9A-F]{6}$/.test(c) || seen[c] || out.length >= 16) return; seen[c] = 1; out.push({ name: n, color: c }) }
    if (st && STYLE[st]) add(styleHex(st), STYLE[st].title + ' colour')
    var pals = name && W.WITH_PALETTES && W.WITH_PALETTES[name]
    if (Array.isArray(pals)) pals.forEach(function (p) { if (p && p.colors) add(p.colors.c1, p.name) })
    SNAMES.forEach(function (s) { add(styleHex(s), STYLE[s].title) })
    return { palette: out, paletteLabel: name && BY[name] ? 'Picked for ' + BY[name].title : 'Style colours' }
  }
  function kitColor(K, t) {
    // the suggestions follow the open icon and style: the kit reads them each time the picker opens. On phones the
    // drawer's icon is scrolled into view above the picker's sheet.
    var lab = ''
    K.colorPicker(t, {
      palette: function () { var o = kitPalette(t); lab = o.paletteLabel; return o.palette },
      paletteLabel: function () { return lab },
      preview: function () { return viewer.contains(t) ? $('[data-vw-art]', vwBody) : null }
    })
  }
  function kitUp(scope) {
    var K = W.WIKit
    if (!K) { if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { kitUp(scope) }, { once: true }); return }
    $$('input[type=color]', scope).forEach(function (t) { if (!K.get(t) && !t.closest('.wied, .wied-cpanel, .wdl')) kitColor(K, t) })
    $$('input[type=range]', scope).forEach(function (r) {
      if (K.get(r) || r.closest('.wied, .wied-cpanel, .wdl')) return
      K.slider(r, r.hasAttribute('data-vw-size') ? {} : r.hasAttribute('data-vw-pad') ? { format: function (v) { return Math.round(v * 100) + '%' } } : { format: function (v) { return (+v).toFixed(2).replace(/0$/, '') + ' px' } })
    })
  }

  // the drawer's strip shows this icon in every style. Desktop: fetch them now. Phones and tablets: once the drawer
  // has settled, one style at a time in idle time. Save-Data / 2G: only the styles the visitor reaches for (a dot meanwhile).
  var stripLazy = lowData()
  function loadViewerStyles() { return V.name ? loadIcon(V.name) : Promise.resolve() }
  /* the shared element: the icon flies between its tile and the stage (desktop docked panel), so opening and closing
     read as one object moving, not a panel popping in. Transform + opacity only; skipped for reduced motion. */
  function fly(fromRect, toEl, html, color, done) {
    var b = toEl.getBoundingClientRect()
    // a panel shown a moment ago can still report a zero-size drawing (container units resolve on the next style pass):
    // the landing spot is then worked out from the stage, the same way the CSS sizes the drawing
    if (!b.width) {
      var sr = toEl.parentNode.getBoundingClientRect(), w = Math.min(S.px, sr.width * 0.5, sr.height * 0.72)
      b = { left: sr.left + (sr.width - w) / 2, top: sr.top + (sr.height - w) / 2, width: w, height: w }
    }
    if (!fromRect || !b.width || !fromRect.width) { if (done) done(); return }
    var el = D.createElement('div'); el.className = 'vw-fly'; el.innerHTML = html; el.style.color = color
    el.style.width = b.width + 'px'; el.style.height = b.height + 'px'
    D.body.appendChild(el)
    var k = fromRect.width / b.width
    var a = el.animate([{ transform: 'translate(' + fromRect.left + 'px,' + fromRect.top + 'px) scale(' + k + ')' }, { transform: 'translate(' + b.left + 'px,' + b.top + 'px) scale(1)' }], { duration: 480, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'both' })
    el.style.transformOrigin = '0 0'
    var end = function () { if (done) done(); el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' }).onfinish = function () { el.remove() } }
    a.onfinish = end; a.oncancel = function () { el.remove() }
  }
  function tileIconRect(name) {
    var i = KEYS.get(name + '|' + (S.view === 'compare' ? V.st : S.style)); if (i == null) return null
    var gr = grid.getBoundingClientRect(), p = pos(i), top = gr.top + p.y + (L.th - L.la - L.ib) / 2 + 3
    if (S.view === 'compare') top = gr.top + p.y + (L.th - L.ib) / 2
    var r = { left: gr.left + p.x + (L.tw - L.ib) / 2, top: top, width: L.ib, height: L.ib }
    return r.top + r.height > 0 && r.top < W.innerHeight ? r : null
  }
  function openViewer(name, st, o) {
    o = o || {}
    if (!BY[name]) return
    if (!viewer._built) buildViewer()
    var wasOpen = V.open
    var flyFrom = null, flyHtml = '', flyColor = ''
    if (!wasOpen && !reduced && !isSheet() && o.from && o.from.classList && o.from.classList.contains('tile')) {
      var fi = $('.t-ic', o.from), fs = fi && $('svg', fi)
      if (fs) { flyFrom = fi.getBoundingClientRect(); flyHtml = fs.outerHTML; flyColor = getComputedStyle(fi).color }
    }
    V.open = true
    if (!wasOpen) V.returnFocus = o.from || D.activeElement
    setViewerIcon(name, st || V.st || S.style, true)
    loadViewerStyles()
    loadMotion().then(mountEditor)
    if (!wasOpen) {
      viewer.hidden = false
      root.classList.add('has-vw'); body.classList.add('has-vw')
      if (isSheet()) { setSnap('peek', true); lockScroll(true) }
      else { updateBodyCols(); relayout(true); keepActiveInView() }
      viewer.classList.remove('is-in', 'is-in-fade'); void viewer.offsetWidth; viewer.classList.add(flyFrom ? 'is-in-fade' : 'is-in')
      paintScrim()
      if (flyFrom) { var art0 = $('[data-vw-art]', vwBody); art0.classList.add('is-landing'); fly(flyFrom, art0, flyHtml, flyColor, function () { art0.classList.remove('is-landing'); art0.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140 }) }) }
    }
    if (isSheet() || V.full || o.focus) focusTitle()
    syncUrl(); histSync(); centreOverlays()
  }
  function focusTitle() { var t = $('[data-vw-title]', vwBody); if (t) setTimeout(function () { t.focus({ preventScroll: true }) }, reduced ? 0 : 60) }
  function closeViewer() {
    if (!V.open) return
    var back = null
    if (!reduced && !isSheet() && !V.full && V.name) { var a0 = $('[data-vw-art]', vwBody), sv0 = a0 && $('svg', a0); if (sv0) back = { r: a0.getBoundingClientRect(), html: sv0.outerHTML, color: getComputedStyle(a0).color, name: V.name } }
    if (V.full) setFull(false)
    V.open = false
    var finish = function () {
      viewer.hidden = true
      root.classList.remove('has-vw'); body.classList.remove('has-vw')
      if (!isSheet()) { updateBodyCols(); relayout(true) }
    }
    if (isSheet()) { setSnap('closed'); lockScroll(false); setTimeout(function () { if (!V.open) finish() }, reduced ? 0 : 320) }
    else {
      finish()
      // the icon flies home to its tile (where the tile is going to be once the grid has re-flowed)
      var to = back && tileIconRect(back.name), tn = back && mounted.get(back.name + '|' + (S.view === 'compare' ? V.st : S.style)), ti = tn && $('.t-ic', tn)
      if (to && ti && back.r.width) {
        ti.style.opacity = '0'
        var k2 = back.r.width / to.width
        var el2 = D.createElement('div'); el2.className = 'vw-fly'; el2.innerHTML = back.html; el2.style.color = back.color; el2.style.width = to.width + 'px'; el2.style.height = to.height + 'px'; el2.style.transformOrigin = '0 0'
        D.body.appendChild(el2)
        var an = el2.animate([{ transform: 'translate(' + back.r.left + 'px,' + back.r.top + 'px) scale(' + k2 + ')', opacity: 1 }, { transform: 'translate(' + to.left + 'px,' + to.top + 'px) scale(1)', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'both' })
        an.onfinish = function () { ti.style.opacity = ''; el2.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }).onfinish = function () { el2.remove() } }
        an.oncancel = function () { ti.style.opacity = ''; el2.remove() }
      }
    }
    paintScrim()
    mounted.forEach(paintTileState)
    histSync(); centreOverlays()
    var rf = V.returnFocus; V.returnFocus = null
    if (rf && rf.isConnected && rf.focus) rf.focus({ preventScroll: true })
    else { var n = ITEMS[S.fi] && mounted.get(ITEMS[S.fi].k); if (n) n.focus({ preventScroll: true }) }
    syncUrl()
  }
  function keepActiveInView() {
    if (!V.name) return
    var i = KEYS.get(V.name + '|' + (S.view === 'compare' ? V.st : S.style))
    if (i != null) { S.fi = i; raf(function () { scrollToIndex(i); render(); refreshTabStops() }) }
  }
  function setViewerIcon(name, st, force) {
    if (!BY[name]) return
    var changedName = name !== V.name
    if (!changedName && st === V.st && !force) return
    var oldName = V.name
    if (changedName) V.pal = null
    V.name = name; V.st = STYLE[st] ? st : V.st
    paintViewer(changedName ? 'all' : 'style')
    mounted.forEach(paintTileState)
    if (changedName && oldName && !reduced) {
      var art = $('[data-vw-art]', vwBody)
      if (art) art.animate([{ transform: 'scale(.82)', opacity: 0 }, { transform: 'scale(1.03)', opacity: 1, offset: 0.65 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.2,.8,.2,1)' })
    }
    syncUrl()
  }
  /* Colours belong to a style: a palette or a colour picked for Kawaii doesn't follow the icon into Gothic. Switching
     style puts the icon back on that style's own colours (the palette and per-part edits are cleared, a colour picked in
     the viewer goes back to what the page had), and says so. "Reset colours" on the stage does the same on demand. */
  function vwColor(c) { if (!V.touched) { V.touched = true; V.baseColor = S.color } S.color = c; store.set('color', c) }
  function customised() { return !!((ED && V.name && ED.get().name === V.name && ED.hasCustomColors && ED.hasCustomColors()) || S.color !== 'ink') }
  function resetColours(o) {
    o = o || {}
    var had = customised(), touched = V.touched
    if (!had) return false
    V.resetting = true
    if (ED && ED.hasCustomColors && ED.get().name === V.name && ED.hasCustomColors()) ED.resetColors()
    if (o.all) { S.color = 'ink'; store.set('color', 'ink') } else if (touched) { S.color = V.baseColor || 'ink'; store.set('color', S.color) }
    V.touched = false; V.resetting = false
    if (ED && ED.get().color !== S.color) ED.set({ color: S.color })
    afterLook(); paintTools(); paintQuick(); paintStripColours(); mounted.forEach(paintTileState)
    if (o.say !== false) vwSay(o.msg || 'Colours reset to the ' + STYLE[V.st].title + ' defaults')
    return true
  }
  function vwSay(msg) { var l = $('[data-vw-live]', viewer); if (l) { l.textContent = ''; setTimeout(function () { l.textContent = msg }, 30) } }
  function paintResetChip() {
    var b = viewer._built && $('[data-vw="reset-colors"]', vwBody); if (!b) return
    var on = customised()
    if (on === b._on) return
    b._on = on; b.classList.toggle('is-on', on); b.tabIndex = on ? 0 : -1; b.setAttribute('aria-hidden', on ? 'false' : 'true')
  }
  function setViewerStyle(st, fromGrid) {
    if (!STYLE[st] || st === V.st) return
    var was = V.st
    // the old drawing stays a moment, fading out under the new one (a morph, not a swap)
    var morph = null, art1 = !reduced && $('[data-vw-art]', vwBody)
    if (art1 && art1.firstElementChild && art1.offsetWidth) {
      morph = D.createElement('div'); morph.className = 'vw-morph'; morph.setAttribute('aria-hidden', 'true'); morph.innerHTML = art1.innerHTML
      morph.style.cssText = 'left:' + art1.offsetLeft + 'px;top:' + art1.offsetTop + 'px;width:' + art1.offsetWidth + 'px;height:' + art1.offsetHeight + 'px;color:' + getComputedStyle(art1).color + ';padding:' + getComputedStyle(art1).padding
      $$('[id]', morph).forEach(function (x) { x.removeAttribute('id') })
      art1.parentNode.appendChild(morph)
    }
    V.st = st
    var resetNow = function () { if (resetColours({ say: false })) { vwSay('Colours reset: ' + STYLE[st].title + ' starts from its own colours'); toast('Switched to <b>' + esc(STYLE[st].title) + '</b>, in its own colours.', { icon: V.name, st: st, ms: 2600 }) } }
    ensure(st, V.name).then(function () { paintViewer('style') })
    paintViewer('style')
    resetNow()   // after the studio follows the new style, so its change event can't pull the old one back
    mounted.forEach(paintTileState)
    if (!reduced && morph) {
      var art = $('[data-vw-art]', vwBody)
      if (art) art.animate([{ transform: 'scale(1.06)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.34,1.56,.64,1)' })
      morph.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.9)' }], { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }).onfinish = function () { morph.remove() }
    }
    syncUrl()
  }
  function stepViewer(dir) {
    var names = S.results.length ? S.results.map(function (r) { return r.name }) : BROWSE.map(function (i) { return i.name })
    var i = names.indexOf(V.name)
    if (i < 0) i = dir > 0 ? -1 : 0
    var next = names[(i + dir + names.length) % names.length]
    setViewerIcon(next, V.st)
    var k = KEYS.get(next + '|' + (S.view === 'compare' ? V.st : S.style))
    if (k != null && !isSheet() && !V.full) { S.fi = k; scrollToIndex(k); render(); refreshTabStops() }
  }

  // repaint: part = 'all' | 'style' | 'look' (colour/bg/size/stroke)
  function paintViewer(part) {
    if (!viewer._built || !V.name) return
    var name = V.name, st = V.st, ic = BY[name], b = vwBody
    viewer.style.setProperty('--sc', 'var(--s-' + st + ')')
    viewer.style.setProperty('--on-sc', 'var(--on-' + st + ')'); viewer.style.setProperty('--sc-text', 'var(--t-' + st + ')')
    viewer.style.setProperty('--sc-soft', 'var(--c-' + st + '-soft, color-mix(in srgb, var(--s-' + st + ') 14%, transparent))')
    viewer.setAttribute('data-st', st)
    if (part === 'all') {
      $('[data-vw-title]', b).textContent = ic.title; $('[data-vw-mini-t]', b).textContent = ic.title
      $('[data-vw-desc]', b).textContent = ic.description || ''
      var cat = $('[data-vw-cat]', b); cat.textContent = cap(ic.category); cat.href = 'categories/' + ic.category + '.html'
      var pg = $('[data-vw-page]', b); pg.href = 'icons/' + name + '.html'
      $('[data-vw-pagetitle]', b).textContent = 'Open the ' + ic.title + ' icon page'
      var aka = (ic.aliases || []).concat(ic.synonyms || []).filter(function (x, i, arr) { return arr.indexOf(x) === i && x !== ic.name }).slice(0, 16)
      $('[data-vw-akasec]', b).hidden = !aka.length
      $('[data-vw-aka]', b).innerHTML = aka.map(function (x) { return '<button type="button" class="vw-chip" data-vw-q="' + esc(x.replace(/-/g, ' ')) + '" title="Search “' + esc(x.replace(/-/g, ' ')) + '”">' + esc(x.replace(/-/g, ' ')) + '</button>' }).join('')
      viewer._rel = related(name)
    }
    if (part === 'all' || part === 'style') {
      $('[data-vw-stname]', b).textContent = STYLE[st].title
      paintStl(); setTimeout(paintStripColours, 0)
      $$('[data-vw-st]', b).forEach(function (btn) {
        var s = btn.getAttribute('data-vw-st'), on = s === st
        btn.setAttribute('aria-checked', on ? 'true' : 'false'); btn.tabIndex = on ? 0 : -1
        $('.vw-st-g', btn).innerHTML = has(s, name) ? glyph(s, name) : stripLazy ? '<span class="vw-st-dot" aria-hidden="true"></span>' : '<span class="t-skel" aria-hidden="true"></span>'
      })
      $('[data-vw-rel]', b).innerHTML = (viewer._rel || []).map(function (n) { return '<button type="button" class="vw-relb" data-vw-open="' + n + '" title="' + esc(BY[n].title) + '" aria-label="' + esc(BY[n].title) + '">' + (has(st, n) ? glyph(st, n) : has('line', n) ? glyph('line', n) : '') + '<span>' + esc(BY[n].title) + '</span></button>' }).join('')
      paintQuick()
      paintDev()
      var ai = $('[data-vw-ai]', b)
      var host = D.createElement('div')
      host.setAttribute('data-ask-ai', ''); host.setAttribute('data-icon', name); host.setAttribute('data-style', st); host.setAttribute('data-ask-mode', 'tasks'); host.setAttribute('data-compact', '')
      ai.innerHTML = ''; ai.appendChild(host)
      renderAskAI(host, { icon: name, style: st, mode: 'tasks', compact: true })
    }
    if (part === 'all') { paintTTabs(); if (!reduced) V.pendingPlay = true }
    paintLook()
  }
  function paintLook() {
    if (!viewer._built || !V.name) return
    var name = V.name, st = V.st, b = vwBody
    var stage = $('[data-vw-stage]', b)
    stage.setAttribute('data-bg', V.bg)
    var sbg = V.bg === 'check' ? null : bgHex(st)
    if (sbg) stage.style.setProperty('--stage-bg', sbg); else stage.style.removeProperty('--stage-bg')
    stage.classList.toggle('is-darkbg', !!(sbg && lum(sbg) < 0.35))
    viewer.style.setProperty('--vw-bgc', sbg || 'var(--l-card-2)')
    stage.style.setProperty('--stage-ic', stageColor(st))
    paintBgPanel()
    syncEditor()
    var art = $('[data-vw-art]', b)
    paintArt()
    art.style.setProperty('--disp', S.px + 'px')
    var bgHexV = exportBg(st)
    art.classList.toggle('has-tile', !!bgHexV); art.style.setProperty('--tile', bgHexV || 'transparent'); art.style.setProperty('--tile-pad', (V.pad * 100) + '%'); art.style.setProperty('--tile-r', V.shape === 'circle' ? '50%' : V.shape === 'square' ? '0' : '23%'); if (bgHexV) stage.setAttribute('data-tile', ''); else stage.removeAttribute('data-tile')
    $('[data-vw-readout]', b).innerHTML = '<b>' + S.px + '</b> × ' + S.px + ' px'
    $$('[data-vw-bg]', b).forEach(function (x) { var on = x.getAttribute('data-vw-bg') === V.bg; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1 })
    $$('[data-vw-color]', b).forEach(function (x) { var on = x.getAttribute('data-vw-color') === S.color; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on || (!isPreset(S.color) && x.getAttribute('data-vw-color') === 'ink') ? 0 : -1 })
    var hx = $('[data-vw-hex]', b); if (hx && D.activeElement !== hx) { hx.value = shownHex(st); hx.removeAttribute('aria-invalid') }
    var cust = $('[data-vw-custom]', b), isC = !isPreset(S.color)
    cust.closest('.vw-sw').classList.toggle('is-on', isC); if (isC) { if (cust.value !== S.color.toLowerCase()) cust.value = S.color; cust.closest('.vw-sw').style.setProperty('--c', S.color) }
    var si = sizeIndex(S.px), sr = $('[data-vw-size]', b)
    sr.value = si; sr.setAttribute('aria-valuetext', S.px + ' pixels'); sr.style.setProperty('--fill', (si / (SIZES.length - 1) * 100) + '%')
    $('[data-vw-sizeout]', b).textContent = S.px + ' px'
    $('[data-vw-pngsize]', b).textContent = V.bgInc ? 'with background' : 'transparent'
    var pxs = $('[data-vw-pxsel]', b)
    if (pxs) { if (!$('option[value="' + S.px + '"]', pxs)) { var o = D.createElement('option'); o.value = S.px; o.textContent = S.px + ' px'; pxs.insertBefore(o, pxs.firstChild) } pxs.value = String(S.px) }
    var swRow = $('[data-vw-swrow]', b), swOk = numericSW(st)
    swRow.hidden = !swOk
    if (swOk) {
      var def = STYLE[st].strokeWidth, v = S.sw == null ? def : S.sw, swr = $('[data-vw-sw]', b)
      swr.value = v; swr.style.setProperty('--fill', ((v - 0.75) / 2.25 * 100) + '%')
      $('[data-vw-swout]', b).textContent = (+v).toFixed(2).replace(/0$/, '') 
      $('[data-vw="sw-reset"]', b).hidden = S.sw == null
    }
    $('[data-vw-bginc]', b).checked = V.bgInc
    // multi-colour styles: the Colours panel (every part + palettes) replaces the single colour row
    var multi = !!(ED && ED.get().name === name && ED.isMulti(st))
    $('[data-vw-monocol]', b).hidden = multi
    paintMocks()
  }
  function shownHex(st) { return (S.color === 'ink' ? INK : S.color === 'style' ? styleHex(st) : /^#[0-9a-f]{6}$/i.test(S.color) ? S.color : INK).toUpperCase() }
  function normHex(v) { v = String(v || '').trim().replace(/^#?/, '#'); if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + v.slice(1).replace(/./g, '$&$&'); return /^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : null }
  // the hex field: live while typing a full code, committed on Enter / change, reverted when it isn't a colour
  function hexField(t, commit) {
    var h = normHex(t.value), full = t.value.replace('#', '').length >= 6
    t.setAttribute('aria-invalid', h || (!commit && !full) ? 'false' : 'true')
    if (h && (commit || full)) { if (commit) t.value = h; if (h !== S.color) { vwColor(h); afterLook(!commit) } else if (commit) afterLook() }
    else if (commit) { t.value = shownHex(V.st); t.removeAttribute('aria-invalid') }
  }
  function isPreset(c) { return PALETTE.some(function (p) { return p[0] === c }) }
  function paintMocks() {
    if (ED) return   // the studio's ten live placements took over
    var name = V.name, st = V.st, g = has(st, name) ? svgInline(st, name) : ''
    var col = S.color === 'ink' ? 'var(--mk-ink)' : S.color === 'style' ? 'var(--s-' + st + ')' : S.color
    var tabCol = S.color === 'ink' ? 'var(--s-' + st + ')' : col
    var rel = (viewer._rel || []).slice(0, 3)
    var relG = function (n) { return BY[n] && has(st, n) ? svgInline(st, n) : '' }
    var T = esc(BY[name].title)
    var tabs = [rel[0], name, rel[1], rel[2]].filter(Boolean).map(function (n, i) { return '<span class="ph-tab' + (n === name ? ' is-on' : '') + '">' + relG(n) + '<i>' + (n === name ? T : esc(BY[n].title.split(' ')[0])) + '</i></span>' }).join('')
    $('[data-vw-mocks]', vwBody).innerHTML =
      '<figure class="mk mk-btn" style="--mc:' + col + '"><div class="mk-c"><span class="mk-b1" style="--bc:var(--s-' + st + ')">' + g + 'Get started</span><span class="mk-b2">' + g + T + '</span></div><figcaption>Buttons</figcaption></figure>' +
      '<figure class="mk mk-slide" style="--mc:' + col + '"><div class="mk-c"><div class="sl"><span class="sl-ic">' + g + '</span><div class="sl-t"><b>' + T + '</b><i></i><i></i><i class="s"></i></div></div></div><figcaption>A slide</figcaption></figure>' +
      '<figure class="mk mk-tabs" style="--mc:' + tabCol + '"><div class="mk-c"><div class="ph"><div class="ph-scr"><i></i><i></i><i class="s"></i></div><nav class="ph-bar">' + tabs + '</nav></div></div><figcaption>Phone tab bar</figcaption></figure>' +
      '<figure class="mk mk-doc" style="--mc:' + col + '"><div class="mk-c"><p class="dc-h"><span class="dc-ic">' + g + '</span>' + T + '</p><p class="dc-l"><i></i><i></i><i class="s"></i></p><p class="dc-li"><span class="dc-ic sm">' + g + '</span><i></i></p></div><figcaption>A document</figcaption></figure>'
  }
  function paintDev() {
    var snips = snippets(V.st, V.name)
    if (!snips.some(function (s) { return s.id === V.tab })) V.tab = 'react'
    var cur = snips.filter(function (s) { return s.id === V.tab })[0]
    $('[data-vw-tabs]', vwBody).innerHTML = snips.map(function (s) { var on = s.id === V.tab; return '<button type="button" role="tab" id="vwt-' + s.id + '" aria-controls="vw-codepanel" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-vw-tab="' + s.id + '">' + s.label + '</button>' }).join('')
    $('[data-vw-codepanel]', vwBody).setAttribute('aria-labelledby', 'vwt-' + cur.id)
    $('[data-vw-file]', vwBody).textContent = cur.file
    var code = $('[data-vw-code]', vwBody); code.innerHTML = hl(cur.code); code._raw = cur.code
    var stk = DEV2STACK[cur.id] || cur.id, npm = $('[data-vw-npm]', vwBody)
    var steps = /^(react|vue|svelte|angular|solid)$/.test(stk) ? fwSteps(stk, V.st, V.name).slice(0, 1) : stk === 'web' ? [{ t: 'No build step: the script tag above loads it from a CDN. Or install it', code: 'npm i @withicons/web' }] : stk === 'html' ? [{ t: 'No build step: the script tag above loads only the icons on the page. Or install it', code: 'npm i @withicons/classes' }] : []
    V.dsteps = steps
    npm.className = 'vw-npm vw-once-b'
    npm.innerHTML = steps.length ? onceRows(steps, 'copy-dstep') : '<p><span>No install: paste the SVG anywhere. It takes the text colour.</span></p>'
    var z = sizeFor(stk, V.st, V.name)
    $('[data-vw-dsize-s]', vwBody).textContent = 'Make it bigger or smaller · ' + z.sub
    $('[data-vw-dsize-b]', vwBody).innerHTML = sizeHtml(z)
    V.dsize = z.rows
  }
  var DEV2STACK = { wc: 'web', classes: 'html' }, STACK2DEV = { web: 'wc', html: 'classes' }

  /* ── motion + the Icon Studio (js/editor.js), loaded on demand: Animate / Turn into tabs, ten placements, grid hover moves ── */
  var motionP = null
  function loadCss(href) {
    return new Promise(function (res) {
      if (D.querySelector('link[href="' + href + '"]')) { res(); return }
      var l = D.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.onload = l.onerror = function () { res() }; D.head.appendChild(l)
    })
  }
  function loadJs(src, ready) {
    if (ready()) return Promise.resolve()
    return new Promise(function (res) { var e = D.createElement('script'); e.src = src; e.async = false; e.onload = e.onerror = function () { res() }; D.head.appendChild(e) })
  }
  function loadMotion() {
    if (motionP) return motionP
    motionP = Promise.all([
      loadCss('vendor/motion/motion.css'), loadCss('css/editor.css'),
      loadJs('vendor/motion/motion.js', function () { return !!W.WithMotion }),
      loadJs('data/motion.js', function () { return !!W.WITH_MOTION }),
      loadJs('js/palette-map.js', function () { return !!W.WithPalette }),
      loadJs('js/editor.js', function () { return !!W.WithEditor }),
    ]).then(function () { return !!W.WithEditor })
    return motionP
  }
  var ED = null
  function edBg() { if (V.bg === 'brand') return 'brand'; var h = V.bg === 'check' ? null : bgHex(V.st); return h && lum(h) < 0.35 ? 'dark' : 'light' }
  function paintPalChips() {
    var host = viewer._built && $('[data-vw-colors]', vwBody), list = V.name && W.WITH_PALETTES && W.WITH_PALETTES[V.name]
    if (!host || !Array.isArray(list)) return
    var by = {}; list.forEach(function (p) { by[p.id] = p })
    $$('[data-cp-pal]', host).forEach(function (b) { var p = by[b.getAttribute('data-cp-pal')], bg = p && palBg(p.colors); if (bg && b._bg !== bg) { b._bg = bg; b.style.setProperty('--pal-bg', bg) } })
  }
  function crossfade() {
    if (reduced || !viewer._built) return
    var st = $('[data-vw-stage]', vwBody), strip = $('[data-vw-styles]', vwBody)
    if (st) st.animate([{ opacity: 0.55, filter: 'saturate(.7)' }, { opacity: 1, filter: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' })
    if (strip) strip.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' })
  }
  // the strip wears the icon's custom colours (each style maps the palette onto its own parts)
  function paintStripColours() {
    if (!viewer._built || !V.name) return
    $$('[data-vw-st]', vwBody).forEach(function (btn) {
      var sv = $('.vw-st-g svg', btn); if (!sv) return
      var sst = btn.getAttribute('data-vw-st'), css = sst === V.st ? edCss(sst, V.name) : ''
      if (css || sv._cz) { sv.style.cssText = css.replace(/: /g, ':'); sv._cz = !!css }
    })
    var sp = $('[data-vw="surprise"]', vwBody); if (sp) sp.hidden = !(ED && ED.get().name === V.name && ED.isMulti(V.st))
  }
  function paintBgPanel() {
    var b = vwBody, st = V.st, sw = $('[data-vw-bgsw]', b); if (!sw) return
    var h = V.bg === 'check' ? null : bgHex(st)
    sw.style.background = h || 'conic-gradient(#ddd 25%, #fff 0 50%, #ddd 0 75%, #fff 0) 0 0 / 8px 8px'
    $('[data-vw-bgname]', b).textContent = bgLabel() + (V.bgInc ? ' · in downloads' : '')
    $$('[data-vw-bg]', b).forEach(function (x) { var on = x.getAttribute('data-vw-bg') === V.bg; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on || (V.bg === 'custom' && x.getAttribute('data-vw-bg') === 'auto') ? 0 : -1 })
    var au = $('.vw-bg.is-auto span', b); if (au) au.style.background = autoBg(st)
    var cu = $('[data-vw-bgc]', b), cl = cu && cu.closest('.vw-bg')
    if (cl) { cl.classList.toggle('is-on', V.bg === 'custom'); cl.style.setProperty('--c', V.bgc); if (cu.value.toLowerCase() !== V.bgc.toLowerCase()) cu.value = V.bgc }
    $$('[data-vw-shape]', b).forEach(function (x) { var on = x.getAttribute('data-vw-shape') === V.shape; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1 })
    var pr = $('[data-vw-pad]', b); if (pr) { pr.value = V.pad; pr.style.setProperty('--fill', (V.pad / 0.3 * 100) + '%'); $('[data-vw-padout]', b).textContent = Math.round(V.pad * 100) + '%' }
    var tr = $('[data-vw-tilerow]', b); if (tr) tr.classList.toggle('is-off', !V.bgInc || V.bg === 'check')
    var bc = $('[data-vw="bgp"]', b); if (bc) bc.setAttribute('aria-expanded', V.bgOpen ? 'true' : 'false')
  }
  function setBgOpen(on) {
    V.bgOpen = on
    var p = $('[data-vw-bgp]', vwBody); if (!p) return
    p.hidden = !on
    paintBgPanel()
    if (on) { var f = $('[data-vw-bg][aria-checked="true"]', p) || $('[data-vw-bg]', p); if (f) setTimeout(function () { f.focus({ preventScroll: true }) }, 30); if (!isSheet()) p.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }) }
  }
  function mountEditor() {
    if (ED || !W.WithEditor || !viewer._built || !V.name) return
    var host = $('[data-vw-ed]', vwBody), place = $('[data-vw-mocks]', vwBody)
    place.className = 'vw-places'; place.innerHTML = ''
    try {
      ED = W.WithEditor.mount(host, { name: V.name, title: BY[V.name].title, style: V.st, remember: false, rememberColors: false, colorsPerStyle: true, anim: V.anim, placements: place, onChange: onEdChange, colorsPanel: false, downloads: false })
    } catch (err) { ED = null; if (W.console) console.error(err) }
    if (!ED) { place.className = 'mk-grid'; paintMocks(); var ds = $('[data-vw-dlsec]', vwBody); if (ds) ds.hidden = true; return }
    viewer.classList.add('has-studio')
    // every colour + palettes of multi-colour styles live in the drawer's own Look tab (same studio state)
    try { ED.colorsPanel($('[data-vw-colors]', vwBody)) } catch (err) { if (W.console) console.error(err) }
    // the Download panel: every format (slides, design tools, websites, animated), from the same state as the studio.
    // The drawer's own buttons above already cover Copy image, PNG and SVG, so it comes without the quick row.
    try { if (ED.downloadPanel) ED.downloadPanel($('[data-vw-dl]', vwBody), { quick: false, title: 'Download in any format', motionTab: 'Animate' }) } catch (err) { if (W.console) console.error(err) }
    V.ck = ED.get().colorsKey
    // the stage's live swap follows the studio's shared state (and its own hover / focus): switching animates in place
    try { if (ED.swapHost) ED.swapHost($('[data-vw-art]', vwBody)) } catch (err) { }
    ED.tab(V.ttab === 'swap' ? 'swap' : 'motion')
    syncEditor()
    paintArt(); paintPlay()
  }
  // the drawer owns the look (style, colour, stroke, background, PNG size); the studio owns motion and "turn into"
  function syncEditor() {
    if (!ED || !V.name) return
    var cur = ED.get()
    if (cur.name !== V.name) { ED.setIcon(V.name, { title: BY[V.name].title, style: V.st }); if (!reduced) V.pendingPlay = true }
    else if (cur.style !== V.st) ED.set({ style: V.st })
    var want = { color: S.color, bg: edBg(), px: S.px, stroke: numericSW(V.st) ? S.sw : null }, now = ED.get(), patch = {}, any = false
    Object.keys(want).forEach(function (k) { if (now[k] !== want[k]) { patch[k] = want[k]; any = true } })
    if (any) ED.set(patch)
  }
  function onEdChange(st) {
    if (st.anim !== V.anim) { V.anim = st.anim; store.set('anim', V.anim) }
    // a palette picked in Colours brings a background that suits it (Auto); clearing it keeps whatever is set
    var pal = st.name === V.name && st.colors ? st.colors.pal || '' : V.pal
    if (st.name === V.name && pal !== V.pal) {
      var first = V.pal == null; V.pal = pal
      if (pal && !first && V.bg !== 'auto' && V.bg !== 'check') { V.bg = 'auto'; store.set('vbg', 'auto') }
      if (!first) crossfade()
      afterLook()
    }
    paintPalChips()
    // "Turn into" edits Before's style and colour inside the studio: the drawer follows (it owns the look)
    if (st.name === V.name && st.style !== V.st && STYLE[st.style] && !V.resetting) { setViewerStyle(st.style); return }
    if (st.name === V.name && st.color !== S.color && !V.resetting) { vwColor(st.color); afterLook() }
    if (st.colorsKey !== V.ck && st.name === V.name) {
      V.ck = st.colorsKey
      var b = vwBody
      paintQuick()
      paintDev(); mounted.forEach(paintTileState); paintStripColours()
    }
    var mono = $('[data-vw-monocol]', vwBody); if (mono && st.name === V.name) mono.hidden = ED.isMulti(V.st)
    paintResetChip()
    if (st.name === V.name && (st.anim !== V.qa || st.swapKey !== V.qw)) { V.qa = st.anim; V.qw = st.swapKey; paintQuick() }
    paintArt(); paintPlay()
    var note = $('[data-vw-mknote]', vwBody)
    if (note) note.textContent = st.swap && st.swap.ready ? (st.swap.trigger === 'click' ? 'Press the round button to switch' : st.swap.trigger === 'hover' ? (mq('(hover: none)') ? 'Tap a card’s button to switch' : 'Point at a button to switch') : st.swap.trigger === 'auto' ? 'Switching on its own' : 'Focus a button to switch') : st.anim === 'hover' ? 'Point at a card to see it move' : 'Ten everyday places'
    if (V.pendingPlay && st.name === V.name && st.style === V.st) { V.pendingPlay = false; clearTimeout(V.playT); V.playT = setTimeout(replayStage, 280) }
  }
  function stageHtml(trigger) {
    var st = V.st, name = V.name
    if (!has(st, name)) return '<span class="t-skel" aria-hidden="true"></span>'
    if (ED) {
      var e = ED.get()
      if (e.name === name && e.style === st) { var h = ED.liveIcon({ px: 120, trigger: trigger || 'auto', on: false }); if (h && h.indexOf('<svg') >= 0) return h }
    }
    return svgInline(st, name)
  }
  function paintArt(force, trigger) {
    var art = viewer._built && $('[data-vw-art]', vwBody); if (!art || !V.name) return
    // the studio draws its live icon here and keeps it in step: only a changed drawing repaints, and switching a swap
    // on and off is a class, so it animates (and reverses mid-way) instead of jumping
    if (ED && ED.paintLive) {
      var e = ED.get()
      if (e.name === V.name && e.style === V.st && has(V.st, V.name)) { if (force) art._wk = ''; ED.paintLive(art, { px: 120, trigger: trigger || 'auto' }); art._h = null; return }
    }
    var h = stageHtml(trigger)
    if (force || h !== art._h) {
      art.innerHTML = h; art._h = trigger ? null : h; art._wk = ''
      if (W.WithEditor && W.WithEditor.prepareDraw) W.WithEditor.prepareDraw(art)
    }
  }
  function replayStage() {
    var e = ED && ED.get(); if (!e || e.anim === 'none' || !V.open) return
    var once = e.anim === 'hover'
    paintArt(true, once ? 'once' : 'auto')
    clearTimeout(V.rt)
    if (once) { var mi = ED.motionInfo('hover'); V.rt = setTimeout(function () { paintArt(true) }, ((mi && mi.dur) || 1) * 1000 + 160) }
  }
  function paintPlay() {
    var b = viewer._built && $('[data-vw="play"]', vwBody); if (!b) return
    var e = ED && ED.get()
    var sw = e && e.swap && e.swap.ready ? e.swap : null
    b.hidden = !e || (e.anim === 'none' && !sw)
    if (b.hidden) return
    var mi = e.anim === 'none' ? null : ED.motionInfo(), P = W.WithEditor.PRESETS || {}
    var lab = sw ? (sw.trigger === 'auto' ? ((sw.held != null ? sw.held : sw.paused || reduced) ? 'Play · ' + sw.title : 'Pause switching') : sw.trigger === 'click' ? (sw.on ? 'Switch back' : 'Switch to ' + sw.title) : 'Play · ' + sw.title) : (mi && P[mi.preset] ? P[mi.preset].label : 'Play') + (e.anim === 'loop' ? ' · always' : e.anim === 'hover' ? (mq('(hover: none)') ? ' · on tap' : ' · on hover') : ' · once')
    $('[data-vw-playl]', b).innerHTML = sw ? esc(lab) : 'Replay<small> · ' + esc(lab.replace(/^Play · /, '')) + '</small>'
    b.setAttribute('aria-label', sw ? lab : 'Replay the animation: ' + lab)
  }
  function paintTTabs() {
    $$('[data-vw-ttab]', vwBody).forEach(function (b) { var on = b.getAttribute('data-vw-ttab') === V.ttab; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1 })
    $('[data-vw-tpane="look"]', vwBody).hidden = V.ttab !== 'look'
    var ep = $('[data-vw-tpane="ed"]', vwBody); ep.hidden = V.ttab === 'look'; ep.setAttribute('aria-labelledby', 'vwtt-' + V.ttab)
    moveTInk()
  }
  // the pill is placed by CSS from the active index (--i of --n equal segments): exact at any width, after fonts load,
  // docked -> full screen and inside a closed accordion, so nothing here ever measures
  function moveTInk() {
    var tl = viewer._built && $('[data-vw-ttabs]', vwBody); if (!tl) return
    var tabs = $$('[data-vw-ttab]', tl), i = 0
    tabs.forEach(function (b, k) { if (b.getAttribute('aria-selected') === 'true') i = k })
    tl.style.setProperty('--i', i); tl.style.setProperty('--n', tabs.length)
  }
  // the label over the style strip: the current style, or the one under the pointer / focus (a preview of the choice)
  function paintStl(hover) {
    if (!viewer._built) return
    var s = hover || V.st, g = GROUP_OF[s]
    $('[data-vw-stl-n]', vwBody).textContent = STYLE[s].title
    $('[data-vw-stl-s]', vwBody).textContent = (g ? g.title + ' · ' : '') + sayOf(s)
    $('.vw-stl', vwBody).classList.toggle('is-peek', !!hover && hover !== V.st)
  }
  function copyQuick(btn) {
    var sk = $('[data-vw-stack]', vwBody).value, name = V.name, st = V.st
    if (sk === 'svg') { copySvgCode(st, name).then(function () { flash(btn) }); return }
    var q = quickFor(sk, st, name), label = (STACKS.filter(function (x) { return x[0] === sk })[0] || [0, 'code'])[1]
    copyText(q.copy).then(function () {
      flash(btn); bump(name)
      toast('Copied the ' + esc(label) + ' code for <b>' + esc(BY[name].title) + '</b>.' + (q.setup ? (/^npm /.test(q.setup) ? ' New project? Install it once.' : ' First time on a page? Add the setup line once.') : ''), { icon: name, st: st, action: q.setup ? { label: /^npm /.test(q.setup) ? 'Copy install line' : 'Copy setup line', run: function () { copyText(q.setup).then(function () { toast('Copied <code>' + esc(q.setup.length > 70 ? q.setup.slice(0, 68) + '…' : q.setup) + '</code>') }, clipFail) } } : null })
    }, clipFail)
  }
  function setTTab(t) {
    V.ttab = t; store.set('ttab', t)
    paintTTabs()
    if (t !== 'look') { if (ED) ED.tab(t); else loadMotion().then(mountEditor) }
  }
  // grid: with "Animate" on, the tile under the pointer (or keyboard focus) plays its icon's own one-shot
  function playTile(n) {
    if (!S.animate || reduced || !n || n._playing || !W.WithEditor || !W.WITH_MOTION) return
    var svg = n.querySelector('.t-ic svg'); if (!svg) return
    var spec = W.WITH_MOTION[n._name], entry = spec && (spec.hover || spec.loop); if (!entry) return
    n._playing = true
    if (entry.preset === 'draw' && DRAWABLE[n._st] && svg.querySelector('[pathLength]')) {
      n.style.setProperty('--dd', '0ms'); n.style.setProperty('--dl', '720ms'); n.classList.add('is-draw')
      setTimeout(function () { n.classList.remove('is-draw'); n._playing = false }, 760); return
    }
    if (entry.preset === 'draw') entry = { preset: 'pop' }
    var mi = W.WithEditor.motionAttrs(entry, { trigger: 'hover' }); if (!mi) { n._playing = false; return }
    var cls = ['wm', 'wm-p-' + mi.preset, 'wm-run'], keys = Object.keys(mi.vars)
    cls.forEach(function (c) { svg.classList.add(c) }); keys.forEach(function (k) { svg.style.setProperty(k, mi.vars[k]) })
    setTimeout(function () { cls.forEach(function (c) { svg.classList.remove(c) }); keys.forEach(function (k) { svg.style.removeProperty(k) }); n._playing = false }, mi.dur * 1000 + 80)
  }
  // the View button counts the options that differ from the defaults
  function paintBadge() {
    var bd = $('[data-tools-badge]', tools); if (!bd) return
    var n = (S.density !== 'm') + (S.color !== 'ink') + (S.sw != null) + !!S.animate + root.classList.contains('is-selecting')
    bd.hidden = !n; bd.textContent = n
    var t = $('[data-pop-toggle]', tools); if (t) t.classList.toggle('is-mod', !!n)
  }
  function setAnimate(on, quiet) {
    S.animate = on; store.set('animate', on)
    root.classList.toggle('is-animate', on)
    var b = $('[data-animate]', tools); if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false')
    paintBadge()
    if (on) loadMotion().then(function () { if (!quiet) toast(reduced ? 'Your device asks for less motion, so icons stay still here. Open an icon to preview its animation.' : 'Point at any icon to see it move. Open one to pick a different animation.', { ms: 3400 }) })
  }

  viewer.addEventListener('click', function (e) {
    if (!V.name) return
    var artEl = e.target.closest && e.target.closest('[data-vw-art]')
    if (artEl && ED) { var es = ED.get(); if (!(es.swap && es.swap.ready && ED.swapPress(artEl))) replayStage(); return }
    var t = e.target.closest('button, a'); if (!t || !viewer.contains(t)) return
    if (t.closest('.wied, .wied-cpanel')) return   // the studio handles its own controls
    var act = t.getAttribute('data-vw'), name = V.name, st = V.st
    if (act === 'copy-img') copyImage(st, name).then(function (ok) { if (ok) yay(t) })
    else if (act === 'png') downloadPng(st, name).then(function (ok) { if (ok) yay(t) })
    else if (act === 'svg') { downloadSvg(st, name); yay(t) }
    else if (act === 'copy-svg') copySvgCode(st, name).then(function (ok) { if (ok) yay(t) })
    else if (act === 'copy-quick') copyQuick(t)
    else if (act === 'copy-tag') { copyText(iTag(name, st)).then(function () { flash(t); bump(name); toast('Copied <code>' + esc(iTag(name, st)) + '</code>. First time on a page? Also add the setup line once.', { icon: name, st: st, action: { label: 'Copy setup line', run: function () { copyText(headLines(st, name)).then(function () { toast('Copied the setup line. Put it in your page’s &lt;head&gt; once.') }, clipFail) } } }) }, clipFail) }
    else if (act === 'copy-css' || act === 'copy-dstep') { var stp = ((act === 'copy-css' ? V.qsteps : V.dsteps) || [])[+t.getAttribute('data-i') || 0], sl = stp ? stp.code : '', sk = $('[data-vw-stack]', vwBody).value; if (sl) copyText(sl).then(function () { flash(t); toast(/^npm /.test(sl) ? 'Copied <code>' + esc(sl) + '</code>. Run it once in your project.' : /^import /.test(sl) ? 'Copied the import. Put it at the top of your file.' : 'Copied the setup line. Put it in your page’s &lt;head&gt; once' + (sk === 'html' ? ', then every &lt;i&gt; tag works, in any style.' : '.')) }, clipFail) }
    else if (act === 'copy-size') { var zr = (t.closest('[data-vw-dsize]') ? V.dsize : V.qsize) || [], zc = zr[+t.getAttribute('data-i') || 0]; if (zc) copyText(zc.code).then(function () { flash(t); toast('Copied the 48 px version.') }, clipFail) }
    else if (act === 'close') closeViewer()
    else if (act === 'prev') stepViewer(-1)
    else if (act === 'next') stepViewer(1)
    else if (act === 'full') setFull(!V.full)
    else if (act === 'play') { var ps = ED && ED.get(), pw = ps && ps.swap && ps.swap.ready ? ps.swap : null; if (pw && pw.trigger === 'click') ED.swapToggle(); else if (pw) ED.swapPlay(); else replayStage() }
    else if (t.hasAttribute('data-vw-ttab')) setTTab(t.getAttribute('data-vw-ttab'))
    else if (act === 'sw-reset') { S.sw = null; afterLook() }
    else if (act === 'share') {
      var url = location.href.split('?')[0].split('#')[0] + urlQuery(true)
      copyText(url).then(function () { toast('Link copied. Anyone who opens it lands on <b>' + esc(BY[name].title) + '</b>.', { icon: name, st: st }) }, clipFail)
    } else if (act === 'copy-code') {
      var code = $('[data-vw-code]', vwBody)._raw || ''
      copyText(code).then(function () { t.classList.add('is-done'); $('span', t).textContent = 'Copied'; setTimeout(function () { t.classList.remove('is-done'); $('span', t).textContent = 'Copy' }, 1400) }).catch(clipFail)
    } else if (t.hasAttribute('data-vw-st')) setViewerStyle(t.getAttribute('data-vw-st'))
    else if (t.hasAttribute('data-vw-bg')) { V.bg = t.getAttribute('data-vw-bg'); store.set('vbg', V.bg); afterLook() }
    else if (act === 'bgp') setBgOpen(!V.bgOpen)
    else if (act === 'reset-colors') { resetColours({ all: true }); var bc = $('[data-vw="bgp"]', vwBody); if (bc) bc.focus({ preventScroll: true }) }
    else if (act === 'surprise') { var sp = $('[data-vw-colors] [data-cp-surprise]', vwBody); if (sp) sp.click() }
    else if (act === 'editcols') { var ec = $('[data-vw-colors]', vwBody).classList.toggle('is-edit'); t.setAttribute('aria-expanded', ec ? 'true' : 'false'); $('span', t).textContent = ec ? 'Hide the colour list' : 'Edit each colour' }
    else if (t.hasAttribute('data-vw-shape')) { V.shape = t.getAttribute('data-vw-shape'); store.set('vshape', V.shape); afterLook() }
    else if (t.hasAttribute('data-vw-color')) { vwColor(t.getAttribute('data-vw-color')); afterLook() }
    else if (t.hasAttribute('data-vw-px')) { setPx(+t.getAttribute('data-vw-px')) }
    else if (t.hasAttribute('data-vw-tab')) { V.tab = t.getAttribute('data-vw-tab'); store.set('devtab', V.tab); paintDev(); var nt = $('[data-vw-tab="' + V.tab + '"]', vwBody); if (nt) nt.focus(); var ts = DEV2STACK[V.tab] || V.tab, qs = $('[data-vw-stack]', vwBody); if (qs && qs.value !== ts && STACKS.some(function (x) { return x[0] === ts })) { qs.value = ts; stackSet(ts); paintQuick(); paintDock(); var c3 = { html: 'tag', svg: 'html', react: 'react', vue: 'vue', web: 'web' }[ts]; if (ED && c3 && ED.get().code !== c3) ED.set({ code: c3 }) } }
    else if (t.hasAttribute('data-vw-q')) { var q = t.getAttribute('data-vw-q'); if (isSheet() || V.full) closeViewer(); setQuery(q); if (!isSheet()) input.focus({ preventScroll: true }); W.scrollTo({ top: Math.max(0, W.scrollY + grid.getBoundingClientRect().top - barBottom() - 90), behavior: reduced ? 'auto' : 'smooth' }) }
    else if (t.hasAttribute('data-vw-open')) { setViewerIcon(t.getAttribute('data-vw-open'), V.st); vwBody.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); keepActiveInView() }
    else if (t.hasAttribute('data-vw-cat')) { e.preventDefault(); if (isSheet() || V.full) closeViewer(); setCat(BY[name].category, true) }
  })
  viewer.addEventListener('input', function (e) {
    var t = e.target
    if (t.closest('.wied, .wied-cpanel')) return
    if (t.hasAttribute('data-vw-size')) setPx(SIZES[+t.value], true)
    else if (t.hasAttribute('data-vw-sw')) { S.sw = +t.value; afterLook(true) }
    else if (t.hasAttribute('data-vw-custom')) { vwColor(t.value); afterLook(true) }
    else if (t.hasAttribute('data-vw-hex')) hexField(t, false)
    else if (t.hasAttribute('data-vw-bgc')) { V.bgc = t.value.toUpperCase(); V.bg = 'custom'; store.set('vbgc', V.bgc); store.set('vbg', 'custom'); afterLook(true) }
    else if (t.hasAttribute('data-vw-pad')) { V.pad = clamp(+t.value, 0, 0.3); store.set('vpad', V.pad); afterLook(true) }
  })
  viewer.addEventListener('change', function (e) {
    var t = e.target
    if (t.closest('.wied, .wied-cpanel')) return
    if (t.hasAttribute('data-vw-bginc')) { V.bgInc = t.checked; store.set('bginc', V.bgInc); afterLook() }
    else if (t.hasAttribute('data-vw-stack')) { stackSet(t.value); paintQuick(); paintDock(); V.tab = STACK2DEV[t.value] || t.value; store.set('devtab', V.tab); paintDev(); var c2 = { html: 'tag', svg: 'html', react: 'react', vue: 'vue', web: 'web' }[t.value]; if (ED && c2 && ED.get().code !== c2) ED.set({ code: c2 }); if (!reduced) { var qc = $('[data-vw-q-code]', vwBody); qc.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' }) } }
    else if (t.hasAttribute('data-vw-pxsel')) setPx(+t.value)
    else if (t.hasAttribute('data-vw-hex')) hexField(t, true)
    else if (t.hasAttribute('data-vw-size') || t.hasAttribute('data-vw-sw')) paintTools()
  })
  viewer.addEventListener('keydown', function (e) {
    var t = e.target
    if (t.closest && t.closest('.wied, .wied-cpanel, .vw-places')) return   // the studio has its own keyboard handling
    if (t.hasAttribute && t.hasAttribute('data-vw-hex')) { if (e.key === 'Enter') { e.preventDefault(); hexField(t, true); t.select() } return }
    // arrow keys inside radio groups / tab lists
    var group = t.closest && t.closest('[role="radiogroup"], [role="tablist"]')
    if (group && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      var items = $$('button', group), i = items.indexOf(t)
      if (i >= 0) { e.preventDefault(); var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1; var n = items[(i + dir + items.length) % items.length]; n.focus(); n.click(); return }
    }
  })
  viewer.addEventListener('toggle', function (e) {
    var t = e.target; if (!t.hasAttribute) return
    if (t.hasAttribute('data-vw-dev')) store.set('devopen', t.open)
    var id = t.getAttribute('data-vw-acc'); if (id) { var o = store.get('acc', {}) || {}; o[id] = t.open; store.set('acc', o); if (t.open && id === 'tune') moveTInk() }
  }, true)
  viewer.addEventListener('dragstart', function (e) {
    var s = e.target.closest && e.target.closest('[data-vw-stage]'); if (!s || !V.name) return
    dragData(e, V.st, V.name, $('[data-vw-art] svg', s))
  })
  viewer.addEventListener('pointerover', function (e) { var sb = e.target.closest && e.target.closest('[data-vw-st]'); if (sb) paintStl(sb.getAttribute('data-vw-st')) })
  viewer.addEventListener('pointerout', function (e) { if (e.target.closest && e.target.closest('[data-vw-styles]') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-vw-st]'))) paintStl() })
  viewer.addEventListener('focusin', function (e) { var sb = e.target.closest && e.target.closest('[data-vw-st]'); if (sb && sb.matches(':focus-visible')) paintStl(sb.getAttribute('data-vw-st')) })
  viewer.addEventListener('focusout', function (e) { if (e.target.closest && e.target.closest('[data-vw-st]')) paintStl() })
  viewer.addEventListener('pointerover', function (e) { if (V.name && e.pointerType === 'mouse' && e.target.closest && e.target.closest('[data-vw-stage]')) renderPng(V.st, V.name, S.px).catch(function () { }) })
  function afterLook(live) { paintLook(); paintResetChip(); if (!live) paintTools(); else paintGridColour() }
  function setPx(px, live) { S.px = px; store.set('px', px); paintLook(); paintSel(); if (!live) paintTools() }

  /* ── desktop: docked panel that resizes the grid; drag the left edge; full-screen mode ── */
  function updateBodyCols() {
    var bw = body.clientWidth, vw = V.open && !isSheet() ? Math.min(V.w, Math.max(340, bw * 0.6)) : 0
    body.style.setProperty('--vw-w', Math.round(vw) + 'px')
    // categories move above the grid when the side rail would squeeze it
    body.classList.toggle('cats-top', bw < 1100 || bw - vw - 232 < 620)
  }
  var edge = $('[data-vw-edge]')
  if (edge) {
    edge.addEventListener('pointerdown', function (e) {
      if (isSheet() || V.full) return
      e.preventDefault(); edge.setPointerCapture(e.pointerId)
      var x0 = e.clientX, w0 = V.w, q = false
      root.classList.add('is-resizing')
      var move = function (ev) {
        V.w = clamp(w0 + (x0 - ev.clientX), 340, Math.min(900, body.clientWidth * 0.62))
        if (!q) { q = true; raf(function () { q = false; updateBodyCols(); relayout(false) }) }
      }
      var up = function () { edge.removeEventListener('pointermove', move); edge.removeEventListener('pointerup', up); edge.removeEventListener('pointercancel', up); root.classList.remove('is-resizing'); store.set('vw', Math.round(V.w)); keepActiveInView(); paintEdge() }
      edge.addEventListener('pointermove', move); edge.addEventListener('pointerup', up); edge.addEventListener('pointercancel', up)
    })
    edge.addEventListener('dblclick', function () { V.w = 440; store.set('vw', 440); updateBodyCols(); relayout(true); paintEdge() })
    edge.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowLeft' ? 32 : e.key === 'ArrowRight' ? -32 : 0
      if (!d) return
      e.preventDefault(); V.w = clamp(V.w + d, 340, Math.min(900, body.clientWidth * 0.62)); store.set('vw', Math.round(V.w)); updateBodyCols(); relayout(true); paintEdge()
    })
  }
  function paintEdge() { if (edge) { edge.setAttribute('aria-valuenow', Math.round(V.w)); edge.setAttribute('aria-valuemin', 340); edge.setAttribute('aria-valuemax', 900) } }
  paintEdge()   // a focusable separator needs its value from the start
  function setFull(on) {
    if (isSheet()) on = false
    V.full = on
    viewer.classList.toggle('is-full', on)
    HTML.classList.toggle('vw-lock', on || (isSheet() && V.open))
    var b = $('[data-vw="full"]', vwBody)
    if (b) { b.innerHTML = on ? ICO.shrink : ICO.expand; b.setAttribute('aria-label', on ? 'Exit full screen' : 'Expand to full screen'); b.title = on ? 'Exit full screen (F)' : 'Full screen (F)' }
    viewer.setAttribute('role', on ? 'dialog' : 'complementary')
    if (on) { viewer.setAttribute('aria-modal', 'true'); focusTitle(); var tu = $('[data-vw-acc="tune"]', vwBody), sa = store.get('acc', {}) || {}; if (tu && sa.tune == null) tu.open = true }
    else viewer.removeAttribute('aria-modal')
    histSync()
    paintScrim()
    if (!reduced) vwPanel.animate([{ transform: on ? 'scale(.97)' : 'scale(1.02)', opacity: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)' })
  }
  /* Back closes what looks like a page of its own: the phone sheet and full screen push one history entry; Back
     (popstate) closes them, and closing them by hand pops that entry. The docked panel (and prev / next) never push. */
  function histSync() {
    var modal = V.open && (V.full || isSheet())
    if (modal && !V.hist) { V.hist = true; try { history.pushState({ wiViewer: 1 }, '', location.href) } catch (e) { V.hist = false } }
    else if (!modal && V.hist) { V.hist = false; V.popSkip = true; try { history.back() } catch (e) { V.popSkip = false } }
  }
  W.addEventListener('popstate', function () {
    if (V.popSkip) { V.popSkip = false; return }
    if (!V.hist) return
    V.hist = false
    if (V.full) setFull(false); else if (V.open && isSheet()) closeViewer()
  })
  function paintScrim() {
    var on = V.open && (V.full || isSheet())
    scrim.classList.toggle('is-on', on)
    scrim.classList.toggle('is-full', V.full || V.snap === 'full')
  }
  scrim.addEventListener('click', function () { if (V.full) setFull(false); else closeViewer() })

  /* ── phones: a bottom sheet with snap points (peek / full), drag to resize or dismiss ── */
  function sheetH() { return vwPanel.offsetHeight || W.innerHeight }
  function snapY(s) {
    var h = sheetH(), vh = W.innerHeight
    if (s === 'full') return 0
    if (s === 'peek') return Math.max(0, h - Math.min(vh * 0.72, 660))
    return h + 24
  }
  function setSnap(s, fromClosed) {
    V.snap = s
    viewer.setAttribute('data-snap', s)
    if (fromClosed && !reduced) { vwPanel.style.transition = 'none'; vwPanel.style.transform = 'translate3d(0,' + snapY('closed') + 'px,0)'; void vwPanel.offsetWidth; vwPanel.style.transition = '' }
    vwPanel.style.transform = 'translate3d(0,' + snapY(s) + 'px,0)'
    paintScrim(); paintDock()
  }
  function lockScroll(on) { HTML.classList.toggle('vw-lock', on || V.full) }
  ;(function sheetGestures() {
    var drag = null
    vwPanel.addEventListener('pointerdown', function (e) {
      if (!isSheet() || !V.open || e.button !== 0) return
      var inBody = vwBody.contains(e.target), onControl = e.target.closest('input, select, textarea, summary, .vw-styles, .vw-acts, .vw-quick, .vw-tabs, .vw-ttabs, .vw-rel, .vw-places, .wied-pchips, .wied-ctabs, .wied-chips, pre')
      if (onControl) return
      // at "full", the content scrolls: only the grip/header drag the sheet (or a pull-down from the very top)
      var head = e.target.closest('[data-vw-grip], .vw-head, .vw-topline')
      if (V.snap === 'full' && inBody && !head && vwBody.scrollTop > 0) return
      drag = { id: e.pointerId, y0: e.clientY, base: snapY(V.snap), t: performance.now(), last: e.clientY, v: 0, started: false, head: !!head }
    })
    vwPanel.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return
      var dy = e.clientY - drag.y0
      if (!drag.started) {
        if (Math.abs(dy) < 8) return
        // at full with content scrolled to top: only a downward pull drags; up scrolls content
        if (V.snap === 'full' && !drag.head && dy < 0) { drag = null; return }
        drag.started = true; vwPanel.setPointerCapture(e.pointerId); vwPanel.classList.add('is-dragging')
      }
      var now = performance.now(), dt = Math.max(1, now - drag.t)
      drag.v = (e.clientY - drag.last) / dt; drag.last = e.clientY; drag.t = now
      var y = drag.base + dy
      if (y < 0) y = y * 0.25   // rubber band past full
      vwPanel.style.transform = 'translate3d(0,' + y + 'px,0)'
      e.preventDefault()
    })
    var end = function (e) {
      if (!drag || e.pointerId !== drag.id) return
      var d = drag; drag = null
      if (!d.started) return
      vwPanel.classList.remove('is-dragging')
      var y = d.base + (e.clientY - d.y0), peek = snapY('peek'), h = sheetH()
      var target
      if (d.v > 0.55) target = V.snap === 'full' && y < peek ? 'peek' : 'closed'
      else if (d.v < -0.55) target = 'full'
      else target = y < peek / 2 ? 'full' : y < peek + (h - peek) * 0.45 ? 'peek' : 'closed'
      if (target === 'closed') closeViewer(); else setSnap(target)
      // a drag is not a click
      var swallow = function (ev) { ev.stopPropagation(); ev.preventDefault() }
      vwPanel.addEventListener('click', swallow, true)
      setTimeout(function () { vwPanel.removeEventListener('click', swallow, true) }, 60)
    }
    vwPanel.addEventListener('pointerup', end); vwPanel.addEventListener('pointercancel', end)
    var grip = $('[data-vw-grip]')
    if (grip) grip.addEventListener('click', function () { if (isSheet()) setSnap(V.snap === 'full' ? 'peek' : 'full') })
    vwBody.addEventListener('wheel', function (e) { if (isSheet() && V.snap === 'peek' && e.deltaY > 0) setSnap('full') }, { passive: true })
    vwBody.addEventListener('scroll', function () { if (isSheet() && V.snap === 'peek' && vwBody.scrollTop > 24) setSnap('full') }, { passive: true })
  })()

  // focus trap for the modal states (sheet, full screen)
  D.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !V.open || !(V.full || isSheet())) return
    var f = $$('button:not([disabled]), a[href], input, select, summary, [tabindex="0"], [tabindex="-1"]#vw-title', viewer).filter(function (x) { var d = x.parentElement && x.parentElement.closest('details:not([open])'); return x.offsetParent !== null && !x.closest('[hidden]') && !(d && !(x.tagName === 'SUMMARY' && x.parentElement === d)) })
    if (!f.length) return
    var first = f[0], last = f[f.length - 1]
    if (!viewer.contains(D.activeElement)) { e.preventDefault(); first.focus(); return }
    if (e.shiftKey && D.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && D.activeElement === last) { e.preventDefault(); first.focus() }
  })

  /* ───────────────────────── controls ───────────────────────── */
  function setQuery(q, o) {
    if (input.value !== q) input.value = q
    S.q = q; S.fi = 0
    paintClear()
    update({ newQuery: true, anim: !(o && o.noAnim) })
    revealResults()
  }
  // first keystroke from the hero: glide the bar up to its sticky spot so the results are in view
  function dockBar() {
    var b = $('[data-bar]'); if (!b || b.classList.contains('is-stuck')) return
    var target = W.scrollY + b.getBoundingClientRect().top - (parseFloat(root.style.getPropertyValue('--lib-top')) || 0)
    if (target - W.scrollY > 40) W.scrollTo({ top: target, behavior: reduced ? 'instant' : 'smooth' })
  }
  // after a new query, make sure the top of the results is visible under the sticky bar
  function revealResults() {
    var m = meta.getBoundingClientRect(), bb = barBottom()
    if (m.top < bb) W.scrollTo({ top: Math.max(0, W.scrollY + m.top - bb - 12), behavior: 'instant' })
  }
  function paintClear() { var c = $('[data-clear]'); if (c) c.hidden = !input.value }
  input.value = S.q
  var qTimer = 0
  input.addEventListener('input', function () {
    var v = input.value
    paintClear()
    cancelAnimationFrame(qTimer)
    qTimer = raf(function () { S.q = v; S.fi = 0; update({ newQuery: true }); if (v) dockBar(); revealResults() })
  })
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (input.value) { e.preventDefault(); e.stopPropagation(); setQuery('') } else input.blur() }
    else if ((e.key === 'ArrowDown' || e.key === 'Enter') && ITEMS.length) {
      e.preventDefault()
      var top = W.scrollY + grid.getBoundingClientRect().top - barBottom() - 70
      if (grid.getBoundingClientRect().top > W.innerHeight * 0.7 || grid.getBoundingClientRect().top < barBottom()) W.scrollTo({ top: top, behavior: 'instant' })
      focusIndex(0)
    }
  })
  $('[data-search-form]').addEventListener('submit', function (e) { e.preventDefault() })
  $('[data-clear]').addEventListener('click', function () { setQuery(''); input.focus() })
  root.addEventListener('click', function (e) {
    if (!e.target.closest) return
    var t = e.target.closest('[data-q]')
    if (t && !viewer.contains(t)) { e.preventDefault(); setQuery(t.getAttribute('data-q')); if (t.closest('[data-hints]')) input.focus({ preventScroll: true }); return }
    var pc = e.target.closest('[data-pick-cat]')
    if (pc) { setQuery('', { noAnim: true }); setCat(pc.getAttribute('data-pick-cat'), true); return }
    if (e.target.closest('[data-clear-cat]')) setCat('')
  })
  catNav.addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (b) setCat(b.getAttribute('data-cat')) })
  function setCat(c, force) {
    S.cat = force ? c : (S.cat === c ? '' : c); S.fi = 0
    update({ newQuery: true })
    var on = $('[aria-pressed="true"]', catNav); if (on && on.scrollIntoView && catNav.scrollWidth > catNav.clientWidth + 2) on.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
    var gtop = grid.getBoundingClientRect().top
    if (gtop < barBottom()) W.scrollTo({ top: W.scrollY + gtop - barBottom() - 80, behavior: reduced ? 'auto' : 'smooth' })
  }
  stylesWrap.addEventListener('click', function (e) {
    if (e.target.closest('[data-sb-toggle]')) { sbOpen(!stylesWrap.classList.contains('is-open'), true); return }
    if (e.target.closest('[data-sb-close]')) { sbOpen(false, true); return }
    var b = e.target.closest('[data-style-pill]')
    if (b) { setStyle(b.getAttribute('data-style-pill'), b); if (e.detail && stylesWrap.classList.contains('is-open')) setTimeout(function () { sbOpen(false) }, reduced ? 0 : 220); return }
    if (e.target.closest('[data-compare]')) { setView(S.view === 'compare' ? 'grid' : 'compare'); if (stylesWrap.classList.contains('is-open')) setTimeout(function () { sbOpen(false) }, reduced ? 0 : 220) }
  })
  D.addEventListener('pointerdown', function (e) { if (stylesWrap.classList.contains('is-open') && !stylesWrap.contains(e.target)) sbOpen(false) })
  stylesWrap.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && stylesWrap.classList.contains('is-open')) { e.preventDefault(); e.stopPropagation(); sbOpen(false, true) }
  })
  // reaching for a style (pointer over it, or keyboard focus) starts its download before the click
  function prefetchStyle(e) { var b = e.target.closest && e.target.closest('[data-style-pill], [data-vw-st]'); if (b) loadStyle(b.getAttribute('data-style-pill') || b.getAttribute('data-vw-st')) }
  stylesEl.addEventListener('pointerover', prefetchStyle, { passive: true }); stylesEl.addEventListener('focusin', prefetchStyle)
  // the picker's footer previews the style under the pointer / keyboard
  stylesEl.addEventListener('pointerover', function (e) { var b = e.target.closest && e.target.closest('[data-style-pill]'); if (b) sbSay(b.getAttribute('data-style-pill')) })
  stylesEl.addEventListener('pointerleave', function () { sbSay() })
  stylesEl.addEventListener('focusin', function (e) { var b = e.target.closest && e.target.closest('[data-style-pill]'); if (b) sbSay(b.getAttribute('data-style-pill')) })
  /* the style rail (in the page flow, under the bar): same options, a live mini icon + name each, and a rich hover card */
  if (rail) {
    rail.addEventListener('click', function (e) {
      var b = e.target.closest('[data-style-pill]')
      if (b) { setStyle(b.getAttribute('data-style-pill'), b); return }
      if (e.target.closest('[data-compare]')) setView(S.view === 'compare' ? 'grid' : 'compare')
    })
    rail.addEventListener('pointerover', prefetchStyle, { passive: true }); rail.addEventListener('focusin', prefetchStyle)
    rail.addEventListener('keydown', function (e) {
      if (!e.target.hasAttribute('data-style-pill')) return
      var pills = $$('[data-style-pill]', rail), i = pills.indexOf(e.target), n = null
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = pills[(i + 1) % pills.length]
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = pills[(i - 1 + pills.length) % pills.length]
      else if (e.key === 'Home') n = pills[0]
      else if (e.key === 'End') n = pills[pills.length - 1]
      else if (e.key === 'Escape') { railTip(null); return }
      if (!n) return
      e.preventDefault(); n.focus(); n.click(); railTip(n)
    })
    var RT = { el: null, t: 0, on: null }
    var railTip = function (b) {
      clearTimeout(RT.t)
      if (!b) { if (RT.el) RT.el.classList.remove('is-on'); RT.on = null; return }
      if (!RT.el) { RT.el = D.createElement('div'); RT.el.className = 'rail-tip'; RT.el.setAttribute('aria-hidden', 'true'); rail.parentNode.appendChild(RT.el) }
      var st = b.getAttribute('data-style-pill'), g = GROUP_OF[st], el = RT.el, warm = !!RT.on
      RT.on = b
      el.style.setProperty('--sc', 'var(--s-' + st + ')'); el.style.setProperty('--sc-text', 'var(--t-' + st + ')')
      el.innerHTML = '<span class="rt-art">' + (sampleSvg(st) || '') + '</span><span class="rt-t"><small>' + esc(g ? g.title : 'Style') + (g && g.isNew ? ' · new' : '') + '</small><b>' + esc(STYLE[st].title) + '</b><span>' + esc(sayOf(st)) + '</span></span>'
      var host = rail.parentNode.getBoundingClientRect(), r = b.getBoundingClientRect(), w = 280
      var x = clamp(r.left + r.width / 2 - host.left - w / 2, 0, Math.max(0, host.width - w))
      el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(r.bottom - host.top + 8) + 'px)'
      el.style.setProperty('--rt-ax', Math.round(r.left + r.width / 2 - host.left - x) + 'px')
      el.classList.toggle('is-warm', warm)
      el.classList.add('is-on')
    }
    rail.addEventListener('pointerover', function (e) {
      if (e.pointerType !== 'mouse') return
      var b = e.target.closest('[data-style-pill]'); if (!b) return
      clearTimeout(RT.t)
      if (RT.on) railTip(b); else RT.t = setTimeout(function () { if (b.matches(':hover')) railTip(b) }, 260)
    })
    rail.addEventListener('pointerleave', function () { clearTimeout(RT.t); RT.t = setTimeout(function () { railTip(null) }, 80) })
    rail.addEventListener('focusin', function (e) { var b = e.target.closest('[data-style-pill]'); if (b && b.matches(':focus-visible')) railTip(b) })
    rail.addEventListener('focusout', function () { railTip(null) })
    rail.addEventListener('scroll', function () { railTip(null) }, { passive: true })
    W.addEventListener('scroll', function () { if (RT.on) railTip(null) }, { passive: true })
  }
  viewer.addEventListener('pointerover', prefetchStyle, { passive: true }); viewer.addEventListener('focusin', prefetchStyle)
  // radiogroup keys: arrows move and pick (wrapping), Home / End jump to the ends
  stylesEl.addEventListener('keydown', function (e) {
    if (!e.target.hasAttribute('data-style-pill')) return
    var pills = $$('[data-style-pill]', stylesEl), i = pills.indexOf(e.target), n = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = pills[(i + 1) % pills.length]
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = pills[(i - 1 + pills.length) % pills.length]
    else if (e.key === 'Home') n = pills[0]
    else if (e.key === 'End') n = pills[pills.length - 1]
    if (!n) return
    e.preventDefault(); n.focus(); n.click()
  })

  // toolbar: tile size, colour popover (+ stroke), select mode
  function paintGridColour() {
    var c = S.color, light = false
    var ic = c === 'ink' ? 'var(--l-fg)' : c === 'style' ? 'var(--acc)' : c
    if (/^#/.test(c)) light = lum(c) > 0.72
    root.style.setProperty('--ic', ic)
    root.classList.toggle('ic-light', light)
    root.classList.toggle('has-sw', S.sw != null)
    if (S.sw == null) root.style.removeProperty('--l-sw'); else root.style.setProperty('--l-sw', S.sw)
    var dot = $('[data-tools-dot]', tools); if (dot) dot.style.background = c === 'ink' ? 'var(--l-fg)' : c === 'style' ? 'var(--acc)' : c
    syncPeekLook()
  }
  function paintTools() {
    $$('[data-density]', tools).forEach(function (b) { b.setAttribute('aria-pressed', S.density === b.getAttribute('data-density') ? 'true' : 'false') })
    $$('[data-color]', tools).forEach(function (b) { var c = b.getAttribute('data-color'); b.setAttribute('aria-pressed', S.color === c ? 'true' : 'false'); if (c.charAt(0) === '#') b.hidden = S.view !== 'compare' && c.toUpperCase() === styleHex(S.style).toUpperCase() && S.color !== c })
    var custom = $('[data-color-custom]', tools)
    if (custom) { var isC = !isPreset(S.color); custom.closest('.sw').classList.toggle('is-on', isC); if (isC) { if (custom.value !== S.color.toLowerCase()) custom.value = S.color; custom.closest('.sw').style.setProperty('--c', S.color) } }
    var sw = $('[data-stroke]', tools), swWrap = $('[data-sw-wrap]', tools), ok = S.view === 'compare' || numericSW(S.style)
    if (sw) { var def = numericSW(S.style) ? STYLE[S.style].strokeWidth : 1.75; sw.value = S.sw == null ? def : S.sw; sw.disabled = !ok; $('[data-sw-out]', tools).textContent = (+sw.value).toFixed(2).replace(/0$/, ''); sw.style.setProperty('--fill', ((sw.value - 0.75) / 2.25 * 100) + '%') }
    if (swWrap) swWrap.classList.toggle('is-off', !ok)
    var rs = $('[data-sw-reset]', tools); if (rs) rs.hidden = S.sw == null
    paintGridColour(); paintBadge()
  }
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return
    if (b.hasAttribute('data-density')) {
      S.density = b.getAttribute('data-density'); store.set('dens2', S.density); paintTools()
      var prev = snapshot(); layout(); render({ anim: true, prev: prev, noEnter: true }); keepActiveInView(); return
    }
    if (b.hasAttribute('data-color')) { S.color = b.getAttribute('data-color'); store.set('color', S.color) }
    else if (b.hasAttribute('data-sw-reset')) { S.sw = null }
    else if (b.hasAttribute('data-animate')) { setAnimate(!S.animate); return }
    else if (b.hasAttribute('data-select-mode')) { var on = !root.classList.contains('is-selecting'); root.classList.toggle('is-selecting', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); paintBadge(); if (on) { togglePop(b.closest('[data-pop]'), false); toast('Selection mode: tap icons to pick several, then download them as one ZIP.', { ms: 3200 }) } return }
    else if (b.hasAttribute('data-pop-toggle')) { togglePop(b.closest('[data-pop]')); return }
    else if (b.hasAttribute('data-pop-close')) { var pp = b.closest('[data-pop]'); togglePop(pp, false); $('[data-pop-toggle]', pp).focus(); return }
    else return
    paintTools(); if (V.open) paintLook()
  })
  tools.addEventListener('input', function (e) {
    var t = e.target
    if (t.hasAttribute('data-color-custom')) { S.color = t.value; store.set('color', S.color); paintTools(); if (V.open) paintLook() }
    else if (t.hasAttribute('data-stroke')) { S.sw = +t.value; paintTools(); if (V.open) paintLook() }
  })
  function togglePop(p, force) {
    if (!p) return
    var open = force != null ? force : !p.classList.contains('is-open')
    $$('[data-pop].is-open', tools).forEach(function (o) { if (o !== p) { o.classList.remove('is-open'); $('[data-pop-toggle]', o).setAttribute('aria-expanded', 'false') } })
    if (open && stylesWrap.classList.contains('is-open')) sbOpen(false)
    if (open) { hideToast(); fitPanel($('.pop-panel', p)) }
    p.classList.toggle('is-open', open); $('[data-pop-toggle]', p).setAttribute('aria-expanded', open ? 'true' : 'false')
    HTML.classList.toggle('lib-sheet-open', open && isPhone())
    if (open) { var f = $('button[aria-pressed="true"], button', $('.pop-panel', p)); if (f) setTimeout(function () { f.focus() }, 30) }
  }
  D.addEventListener('pointerdown', function (e) {
    if (e.target.closest && e.target.closest('.wk-layer')) return   // a picker opened from inside the pop (ui-kit.js) is part of it
    $$('[data-pop].is-open', tools).forEach(function (p) { if (!p.contains(e.target)) togglePop(p, false) })
  })
  // selection bar
  selbar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return
    if (b.hasAttribute('data-zip')) zipSelected(b.getAttribute('data-zip'))
    else if (b.hasAttribute('data-sel-tags')) {
      var tags = Array.from(S.sel).map(function (k) { var p = k.split('|'); return iTag(p[0], p[1], true) }).join('\n')
      copyText(tags).then(function () { toast('Copied ' + S.sel.size + ' &lt;i&gt; tag' + (S.sel.size > 1 ? 's' : '') + '. First time on a page? Add the setup line once.', { action: { label: 'Copy setup line', run: function () { copyText(LOADER).then(function () { toast('Copied the setup line. It loads only the icons on the page, in any style.') }, clipFail) } } }) }, clipFail)
    }
    else if (b.hasAttribute('data-sel-clear')) clearSel()
    else if (b.hasAttribute('data-sel-all')) selectRange(0, ITEMS.length - 1)
  })

  // global keys
  W.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('.wk-layer')) return   // an open kit picker owns its keys (Escape closes just it)
    var tag = (e.target.tagName || '').toLowerCase(), typing = tag === 'input' && !/^(range|checkbox|radio|color|button)$/.test(e.target.type) || tag === 'textarea' || tag === 'select' || e.target.isContentEditable
    if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K'))) {
      e.preventDefault(); e.stopImmediatePropagation()
      if (V.open && (V.full || isSheet())) closeViewer()
      input.focus({ preventScroll: true }); input.select()
      var r = input.getBoundingClientRect(); if (r.top < 0 || r.bottom > W.innerHeight) input.scrollIntoView({ block: 'center' })
      return
    }
    if (e.key === 'Escape') {
      if (stylesWrap.classList.contains('is-open')) { e.preventDefault(); sbOpen(false, true); return }
      if (peekHide(true)) { if (PK.kb) PK.kb = false; e.preventDefault(); return }
      var pop = $('[data-pop].is-open', tools)
      if (pop) { togglePop(pop, false); $('[data-pop-toggle]', pop).focus(); return }
      if (typing && e.target === input) return
      // Escape in a field inside the drawer (the studio's icon search) leaves the field, not the drawer
      if (typing && viewer.contains(e.target)) { e.target.blur(); return }
      if (V.full) { setFull(false); return }
      if (V.open && (isSheet() || viewer.contains(e.target) || !S.sel.size)) { closeViewer(); return }
      if (S.sel.size) { clearSel(); return }
      return
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey || !V.open) return
    var inViewer = viewer.contains(e.target), inGrid = grid.contains(e.target)
    if (inGrid) return   // the grid handles its own arrows; the viewer follows
    var inWidget = e.target.closest && e.target.closest('[role="radiogroup"], [role="tablist"], input')
    if ((e.key === 'ArrowRight' || e.key === ']') && !inWidget) { e.preventDefault(); stepViewer(1) }
    else if ((e.key === 'ArrowLeft' || e.key === '[') && !inWidget) { e.preventDefault(); stepViewer(-1) }
    else if ((e.key === 'f' || e.key === 'F') && !isSheet()) { e.preventDefault(); setFull(!V.full) }
    else if (inViewer && /^[0-9]$/.test(e.key) && SNAMES[(+e.key + 9) % 10]) { e.preventDefault(); setViewerStyle(SNAMES[(+e.key + 9) % 10]) }
    else if (inViewer && e.key === 'Enter' && e.target === $('[data-vw-title]', vwBody)) { e.preventDefault(); copyImage(V.st, V.name) }
  }, true)
  $$('[data-search-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopImmediatePropagation(); input.focus({ preventScroll: true }); input.select(); input.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }) }, true)
  })

  /* ───────────────────────── placeholder: rotating examples ───────────────────────── */
  var EXAMPLES = ['throw away', 'money', 'settings', 'send email', 'happy', 'calendar', 'upload', 'warning', 'shopping', 'rocket']
  function placeholderLoop() {
    // narrow fields (phones: the Ask AI pill eats the right side) get a short lead-in so the example is never cut
    var full = 'Search ' + ICONS.length + ' icons… try “', i = 0, ch = 0, del = false, pause = 0
    function base() { return input.clientWidth && input.clientWidth < 520 ? 'Try “' : full }
    if (reduced) { input.placeholder = base() + EXAMPLES[0] + '”'; W.addEventListener('resize', function () { input.placeholder = base() + EXAMPLES[0] + '”' }); return }
    setInterval(function () {
      if (D.activeElement === input || input.value || D.hidden) return
      var w = EXAMPLES[i]
      if (pause) { pause--; return }
      if (!del) { ch++; if (ch >= w.length) { del = true; pause = 22 } }
      else { ch--; if (ch <= 0) { del = false; i = (i + 1) % EXAMPLES.length; pause = 3 } }
      input.placeholder = base() + w.slice(0, ch) + '”'
    }, 70)
  }

  /* ───────────────────────── boot ───────────────────────── */
  function buildChrome() {
    // the grouped switcher: every style visible, a live mini icon + name each (see "style switcher")
    var opts = function (g, tip) {
      return g.styles.map(function (n) {
        var s = STYLE[n]
        return '<button type="button" class="sb-o" role="radio" data-style-pill="' + n + '" data-group="' + g.id + '" style="--sc:var(--s-' + n + ');--sc-text:var(--t-' + n + ');--on-sc:var(--on-' + n + ')" aria-checked="false" aria-label="' + esc(s.title) + ', ' + esc(g.title.toLowerCase()) + ' style' + (g.isNew ? ', new' : '') + '"' + (tip ? '' : ' title="' + esc(s.title) + ': ' + esc(sayOf(n)) + '"') + '><span class="sb-ic" aria-hidden="true"></span><span class="sb-t">' + esc(s.title) + '</span></button>'
      }).join('')
    }
    var groupHtml = function (g, tip) { return '<div class="sb-g" data-group="' + g.id + '" style="--n:' + g.styles.length + '"><p class="sb-gl" aria-hidden="true"><span>' + esc(g.title) + '</span>' + (g.isNew ? '<b class="sb-new">New</b>' : '') + '</p><div class="sb-opts">' + opts(g, tip) + '</div></div>' }
    stylesEl.innerHTML = GROUPS.map(function (g) { return groupHtml(g) }).join('')
    if (rail) rail.innerHTML = GROUPS.map(function (g) { return groupHtml(g, true) }).join('') + '<button type="button" class="sb-o rail-cmp" data-compare aria-pressed="false" title="See every icon in all ' + SNAMES.length + ' styles side by side"><span class="sb-ic" aria-hidden="true">' + CMP_SVG + '</span><span class="sb-t">Compare</span></button>'
    $$('[data-style-pill]', root).forEach(function (b) { paintSample($('.sb-ic', b), b.getAttribute('data-style-pill')) })
    var cmpT = $('[data-compare]', stylesWrap); if (cmpT) cmpT.title = 'See every icon in all ' + SNAMES.length + ' styles side by side'
    catNav.innerHTML = '<button type="button" class="cat" data-cat="" aria-pressed="true"><span class="cat-g" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg></span><span class="cat-t">All icons</span><small>' + ICONS.length + '</small></button>' +
      CATS.map(function (c) { return '<button type="button" class="cat" data-cat="' + c + '" aria-pressed="false"><span class="cat-g" aria-hidden="true" data-cat-g="' + catIcon(c) + '"></span><span class="cat-t">' + esc(cap(c)) + '</span><small></small></button>' }).join('')
    $$('[data-icon-total]').forEach(function (el) { el.textContent = fmt(ICONS.length) })
    $$('[data-style-total]').forEach(function (el) { el.textContent = SNAMES.length })
    var dots = $('.lib-dots'); if (dots) dots.innerHTML = SNAMES.map(function (n) { return '<i style="background:var(--s-' + n + ')"></i>' }).join('')
  }
  function paintCatGlyphs() { $$('[data-cat-g]', catNav).forEach(function (g) { if (!g.firstChild && svgMap('line')) g.innerHTML = glyph('line', g.getAttribute('data-cat-g')) }) }
  var hdr = null, hdrPinned = null
  function measureTop(fresh) {
    if (!hdr) hdr = $('.site-header')
    var top = 0
    if (hdr && (hdrPinned == null || fresh)) { var cs = getComputedStyle(hdr); hdrPinned = cs.position === 'sticky' || cs.position === 'fixed' }
    if (hdr && hdrPinned) top = Math.max(0, Math.round(hdr.getBoundingClientRect().bottom))
    root.style.setProperty('--lib-top', top + 'px')
    var bar = $('[data-bar]'); if (bar) root.style.setProperty('--lib-bar-h', Math.round(bar.offsetHeight) + 'px')
  }
  iconHooks.push(function (name) {
    if (V.open && viewer._built && name === V.name) { paintViewer('style'); if (ED) { syncEditor(); paintArt(true) } }
    if (PK.on && PK.tile && PK.tile._name === name) { peekFill(itemOf(PK.tile), true) }
  })
  styleHooks.push(function (st) {
    if (st === 'line') paintCatGlyphs()
    paintStylePills()
    if (V.open && viewer._built) paintViewer('style')
    if (PK.on && PK.tile) { peekFill(itemOf(PK.tile)); peekPlace(PK.tile) }
    if (S.view === 'compare' || st === S.style) mounted.forEach(function (n) { if (n._st === st && n.querySelector('.t-skel')) { var it = itemOf(n); if (it) fillTile(n, it) } })
  })

  buildChrome()
  paintTools()
  kitUp(tools)
  root.setAttribute('data-style', S.view === 'compare' ? 'all' : S.style)
  updateBodyCols()
  var firstLoad = S.view === 'compare' ? loadAll() : loadStyle(S.style)
  // render immediately (skeletons if the style file is still downloading), then fill in
  runSearch(); buildItems(); layout(); render({ anim: !reduced, prev: new Map() }); paintMeta(); paintCats(); paintStylePills(); paintSel()
  firstLoad.then(function () {
    loadStyle('line').then(function () { paintCatGlyphs(); paintStylePills() })
    mounted.forEach(function (n) { n.remove() }); mounted.clear(); gen++
    layout(); render({ anim: !reduced && !initialIcon, prev: new Map() })
    paintStylePills()
    root.classList.add('is-ready')
    if (initialIcon) {
      openViewer(initialIcon, initialVSt || S.style, {})
      if (!isSheet()) { var k = KEYS.get(initialIcon + '|' + (S.view === 'compare' ? V.st : S.style)); if (k != null) { S.fi = k; raf(function () { scrollToIndex(k, true); render(); refreshTabStops() }) } }
    }
    if (S.animate) setAnimate(true, true)
    var idleRun = W.requestIdleCallback ? function (f) { W.requestIdleCallback(f, { timeout: 1500 }) } : function (f) { setTimeout(f, 200) }
    // the search engine (~1 s of CPU on a slow phone) is built when the visitor reaches for the field, not at load
    var warmEngine = function () { input.removeEventListener('focus', warmEngine); input.removeEventListener('pointerenter', warmEngine); idleRun(function () { try { var en = getEngine(); if (typeof en.warm === 'function') en.warm() } catch (e) { } }) }
    input.addEventListener('focus', warmEngine); input.addEventListener('pointerenter', warmEngine)
    // the other eleven style files (~1.9 MB compressed) and the studio + motion runtime (~0.6 MB) wait for the visitor's
    // first click, key, wheel or touch: a page that is only looked at (or measured) stays at the line style it shows,
    // and anyone who starts browsing still has them before they reach for them
    var warmed = false, warmEvts = ['pointerdown', 'keydown', 'wheel', 'touchstart']
    var warm = function () {
      if (warmed) return; warmed = true
      warmEvts.forEach(function (t) { W.removeEventListener(t, warm, true) })
      setTimeout(function () { idleRun(function () { loadMotion() }) }, 600)
    }
    warmEvts.forEach(function (t) { W.addEventListener(t, warm, { capture: true, passive: true }) })
  })
  W.addEventListener('scroll', onScroll, { passive: true })
  var roQ = false
  if (W.ResizeObserver) new ResizeObserver(function () {
    if (roQ) return; roQ = true
    raf(function () { roQ = false; var w = Math.floor(grid.clientWidth); if (w && Math.abs(w - L.w) > 0.5 && !root.classList.contains('is-resizing')) { relayout(false); moveInk() } })
  }).observe(grid)
  // the switcher reflows (stuck / unstuck, one or two rows, fonts): the selection indicator follows
  var inkQ = false
  if (W.ResizeObserver) new ResizeObserver(function () { if (inkQ) return; inkQ = true; raf(function () { inkQ = false; moveInk() }) }).observe(stylesEl)
  var wasSheet = isSheet()
  W.addEventListener('resize', function () {
    measureTop(true); moveInk(); updateBodyCols(); moveTInk(); centreOverlays(); paintDock(); railWatch()
    if (stylesWrap.classList.contains('is-open') && !sbSheet()) sbOpen(false)
    var nowSheet = isSheet()
    if (nowSheet !== wasSheet) {
      wasSheet = nowSheet
      if (V.open) {
        if (nowSheet) { if (V.full) setFull(false); setSnap('peek'); lockScroll(true) }
        else { vwPanel.style.transform = ''; lockScroll(false); paintScrim() }
      }
    } else if (nowSheet && V.open) setSnap(V.snap)
    render()
  })
  measureTop(true); setTimeout(function () { measureTop(true); railWatch() }, 400); railWatch()
  if (W.WI && W.WI.on) W.WI.on('fonts', function () { measureTop(); moveInk() })
  if (W.WI && W.WI.on) W.WI.on('theme', function () { if (V.open && viewer._built) { afterLook(); paintPalChips() } })
  placeholderLoop()
  // engine may arrive after us (deferred script order): swap it in and re-run the query
  if (!(W.WithSearch && W.WITH_SEARCH_INDEX)) W.addEventListener('load', function () { if (W.WithSearch && W.WITH_SEARCH_INDEX && !(engine && engine.isShared)) { engine = null; if (S.q) update({ anim: false }) } })
  // public hook for debugging / other scripts
  W.WITH_LIBRARY = { _m: function () { return mounted }, state: S, viewer: V, studio: function () { return ED }, animate: setAnimate, open: openViewer, close: closeViewer, search: function (q) { setQuery(q) }, zip: zip, png: renderPng, svg: fileSvg, engine: getEngine }
})()
