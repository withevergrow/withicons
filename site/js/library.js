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

  /* ───────────────────────── data ───────────────────────── */
  var ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch']
  var STYLES = META.styles.slice().sort(function (a, b) { return ((ORDER.indexOf(a.name) + 99) % 99) - ((ORDER.indexOf(b.name) + 99) % 99) })
  var STYLE = {}; STYLES.forEach(function (s) { STYLE[s.name] = s })
  var SNAMES = STYLES.map(function (s) { return s.name })
  var ICONS = META.icons
  var BY = {}; ICONS.forEach(function (ic, i) { ic.i = i; ic.title = ic.title || titleOf(ic.name); BY[ic.name] = ic })
  var CATS = (META.categories || []).slice()
  ICONS.forEach(function (ic) { if (CATS.indexOf(ic.category) < 0) CATS.push(ic.category) })
  var CAT_RANK = {}; CATS.forEach(function (c, i) { CAT_RANK[c] = i })
  var BROWSE = ICONS.slice().sort(function (a, b) { return (CAT_RANK[a.category] - CAT_RANK[b.category]) || (a.name < b.name ? -1 : 1) })
  var HEX = { line: '#2F5BFF', solid: '#FF5A36', duo: '#7B5CFF', gloss: '#FF4FA3', engrave: '#C9962B', blueprint: '#00A3C4', sketch: '#22A861' }
  var INK = '#111318', PAPER = '#FBF8F3'
  var styleHex = function (st) { return HEX[st] || INK }
  var CLASH = { Map: 1, Image: 1, History: 1, File: 1, Link: 1, Navigation: 1, Clipboard: 1, Keyboard: 1, Bluetooth: 1, Screen: 1, Option: 1, Text: 1, Location: 1, Range: 1, Selection: 1, Notification: 1, Set: 1, Date: 1, Error: 1, Symbol: 1, Proxy: 1, Worker: 1, Lock: 1, Headers: 1, Request: 1, Response: 1 }
  var comp = function (n) { var p = pascal(n); return CLASH[p] ? p + 'Icon' : p }
  var CAT_ICON = { navigation: 'home', arrows: 'arrow-up-right', actions: 'pencil', status: 'check-circle', media: 'play', files: 'file', communication: 'mail', users: 'user', commerce: 'shopping-cart', time: 'clock', devices: 'smartphone', layout: 'layout-grid', text: 'type', maps: 'map-pin', development: 'code', security: 'lock', charts: 'chart-bar', weather: 'sun', objects: 'gift' }
  function catIcon(c) { var n = CAT_ICON[c]; if (n && BY[n]) return n; for (var i = 0; i < BROWSE.length; i++) if (BROWSE[i].category === c) return BROWSE[i].name; return ICONS[0].name }
  var numericSW = function (st) { return !!(STYLE[st] && typeof STYLE[st].strokeWidth === 'number') }

  function svgMap(st) { var a = W.WITH_SVG; return (a && a[st]) || null }
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
  function idleLoadRest() {
    var rest = SNAMES.filter(function (n) { return !svgMap(n) })
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
    var map = svgMap(st)
    if (!map) return '<span class="t-skel" aria-hidden="true"></span>'
    var inner = map[name]
    if (inner == null) return '<span class="t-skel is-missing" aria-hidden="true"></span>'
    if (DRAWABLE[st] && inner.indexOf('dasharray') < 0) inner = inner.replace(/<(path|circle|line|rect|ellipse|polyline|polygon)\b(?![^>]*\bfill="(?!none))/g, '<$1 pathLength="1"')
    return (gCache[key] = '<svg viewBox="0 0 24 24"' + ROOT_ATTR[st] + (numericSW(st) ? ' class="sw"' : '') + ' aria-hidden="true" focusable="false">' + inner + '</svg>')
  }
  function rawInner(st, name) { var m = svgMap(st); return (m && m[name]) || '' }
  // Standalone SVG. mode 'code' keeps currentColor + CSS hooks (for developers); 'file' bakes the chosen colour in.
  function svgText(st, name, o) {
    o = o || {}
    var s = STYLE[st], root = { xmlns: 'http://www.w3.org/2000/svg', width: o.px || 24, height: o.px || 24, viewBox: '0 0 24 24' }
    Object.keys(s.root || {}).forEach(function (k) { root[k] = s.root[k] })
    if (numericSW(st) && S.sw != null) root['stroke-width'] = S.sw
    var inner = rawInner(st, name)
    if (o.mode === 'file') {
      var c = o.color || INK
      inner = inner.replace(/var\(--[\w-]+,\s*([^)]+)\)/g, '$1').replace(/currentColor/g, c)
      Object.keys(root).forEach(function (k) { if (typeof root[k] === 'string') root[k] = root[k].replace(/var\(--[\w-]+,\s*([^)]+)\)/g, '$1').replace(/currentColor/g, c) })
    }
    var a = Object.keys(root).filter(function (k) { return root[k] !== false && root[k] != null }).map(function (k) { return ' ' + k + '="' + esc(root[k]) + '"' }).join('')
    if (o.bg) {
      // background tile: the icon sits at 72% inside a rounded square
      var attrs = Object.keys(s.root || {}).map(function (k) { var v = root[k]; return v == null || v === false ? '' : ' ' + k + '="' + esc(v) + '"' }).join('')
      return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (o.px || 24) + '" height="' + (o.px || 24) + '" viewBox="0 0 24 24"><rect width="24" height="24" rx="5.5" fill="' + o.bg + '"/><g transform="translate(3.36 3.36) scale(.72)"' + attrs + '>' + inner + '</g></svg>'
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
    fi: 0,
    results: [], counts: {}, total: 0, fix: null,
  }
  var V = {
    name: null, st: S.style, open: false, full: false, snap: 'peek',
    bg: /^(paper|white|dark|brand|check)$/.test(store.get('vbg', 'paper')) ? store.get('vbg', 'paper') : 'paper',
    bgInc: !!store.get('bginc', false),
    w: clamp(+store.get('vw', 440) || 440, 340, 900),
    tab: store.get('devtab', 'react'),
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
  var catNav = $('[data-cats]'), stylesEl = $('[data-styles]'), viewer = $('[data-viewer]'), vwBody = $('[data-vw-body]'), vwPanel = $('[data-vw-panel]')
  var selbar = $('[data-selbar]'), toastEl = $('[data-toast]'), scrim = $('[data-vw-scrim]'), tools = $('[data-tools]')

  /* ───────────────────────── toast ───────────────────────── */
  var toastTimer = 0
  function toast(html, o) {
    o = o || {}
    toastEl.innerHTML = '<span class="toast-ic" aria-hidden="true">' + (o.icon ? glyph(svgMap(o.st || 'line') ? (o.st || 'line') : 'line', o.icon) : '') + '</span><span class="toast-msg">' + html + '</span>' + (o.action ? '<button type="button" class="toast-act">' + esc(o.action.label) + '</button>' : '')
    if (o.action) $('.toast-act', toastEl).onclick = function () { o.action.run(); hideToast() }
    toastEl.classList.toggle('is-err', !!o.err)
    toastEl.style.setProperty('--sc', 'var(--s-' + (o.st || S.style) + ')')
    toastEl.classList.add('is-on')
    clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, o.ms || 4200)
  }
  function hideToast() { toastEl.classList.remove('is-on') }
  toastEl.addEventListener('pointerenter', function () { clearTimeout(toastTimer) })
  toastEl.addEventListener('pointerleave', function () { toastTimer = setTimeout(hideToast, 1600) })

  /* ───────────────────────── colour & background ───────────────────────── */
  var BGS = { paper: PAPER, white: '#FFFFFF', dark: INK, brand: null, check: null }
  function bgHex(st) { return V.bg === 'brand' ? styleHex(st) : BGS[V.bg] || null }
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
    if (S.color === 'style') return V.bg === 'brand' ? '#FFFFFF' : 'var(--s-' + st + ')'
    if (S.color === 'ink') return V.bg === 'dark' ? PAPER : V.bg === 'brand' ? '#FFFFFF' : V.bg === 'check' ? 'var(--l-fg)' : INK
    return S.color
  }
  function fileSvg(st, name, px) { return svgText(st, name, { mode: 'file', color: exportColor(st), bg: exportBg(st), px: px || S.px }) }
  function codeSvg(st, name) { return svgText(st, name, { mode: 'code', pretty: true }) }
  function fname(st, name, ext, px) { return name + (st === 'line' ? '' : '-' + st) + (px ? '-' + px : '') + '.' + ext }

  /* ───────────────────────── export: png, clipboard, files, zip ───────────────────────── */
  var pngCache = new Map()
  function pngKey(st, name, px) { return [st, name, px, exportColor(st), exportBg(st) || '', S.sw == null ? '' : S.sw].join('|') }
  function renderPng(st, name, px) {
    px = px || S.px
    var key = pngKey(st, name, px)
    if (pngCache.has(key)) return pngCache.get(key)
    var p = loadStyle(st).then(function () {
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
        toast('This browser can’t copy images, so we copied <b>' + esc(T) + '</b> as SVG code. Use <b>Download PNG</b> for an image file.', { icon: name, st: st })
      }).catch(clipFail)
    }
    var blobP = renderPng(st, name, Math.max(S.px, 128)).then(function (r) { return r.blob })
    var item
    try { item = new W.ClipboardItem({ 'image/png': blobP }) } catch (e) { item = null }
    var go = item ? navigator.clipboard.write([item]) : blobP.then(function (b) { return navigator.clipboard.write([new W.ClipboardItem({ 'image/png': b })]) })
    return go.then(function () {
      bump(name)
      toast('Copied <b>' + esc(T) + '</b> as an image. Paste it with <kbd>' + (isMac ? '⌘' : 'Ctrl') + '</kbd>&nbsp;<kbd>V</kbd> into Slides, Docs, Notion or Canva.', { icon: name, st: st, action: { label: 'Copy SVG instead', run: function () { copySvgCode(st, name) } } })
    }).catch(function () {
      return copyText(fileSvg(st, name)).then(function () { toast('Copied <b>' + esc(T) + '</b> as SVG code (your browser blocked image copying).', { icon: name, st: st }) })
    }).catch(clipFail)
  }
  function copySvgCode(st, name) {
    return copyText(S.color === 'ink' && !V.bgInc ? codeSvg(st, name) : fileSvg(st, name, 24)).then(function () {
      bump(name); toast('Copied <b>' + esc(BY[name].title) + '</b> as SVG code. Paste it into Figma, Canva or your HTML.', { icon: name, st: st })
    }, function () { toast('Couldn’t reach the clipboard. Try the download button.', { err: true }) })
  }
  function downloadSvg(st, name) { saveBlob(new Blob([fileSvg(st, name)], { type: 'image/svg+xml' }), fname(st, name, 'svg')); bump(name); toast('Downloaded <b>' + esc(fname(st, name, 'svg')) + '</b>', { icon: name, st: st }) }
  function downloadPng(st, name, px) {
    px = px || S.px
    renderPng(st, name, px).then(function (r) { saveBlob(r.blob, fname(st, name, 'png', px)); bump(name); toast('Downloaded <b>' + esc(fname(st, name, 'png', px)) + '</b> (' + px + '×' + px + ')', { icon: name, st: st }) },
      function () { toast('Couldn’t make that PNG. Try SVG instead.', { err: true }) })
  }

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
      L.headH = narrow ? 0 : 34
      L.tw = Math.floor(Math.min(d.min, (w - L.labelW - L.gap * (L.cols - 1)) / L.cols)); L.th = L.tw
      L.ib = Math.round(Math.min(d.ib, L.tw * 0.46))
      L.rowH = L.th + L.labelH + L.gap
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
    paintCompareHead()
  }
  function pos(idx) {
    var it = ITEMS[idx]
    if (S.view === 'compare') return { x: L.labelW + it.col * (L.tw + L.gap), y: L.headH + it.row * L.rowH + L.labelH, row: it.row, col: it.col }
    var row = Math.floor(idx / L.cols), col = idx % L.cols
    return { x: col * (L.tw + L.gap), y: row * L.rowH, row: row, col: col }
  }
  var compareHead = null
  function paintCompareHead() {
    if (S.view !== 'compare' || !L.headH) { if (compareHead) { compareHead.remove(); compareHead = null } return }
    if (!compareHead) {
      compareHead = D.createElement('div'); compareHead.className = 'cmp-head'; compareHead.setAttribute('aria-hidden', 'true')
      compareHead.innerHTML = SNAMES.map(function (s) { return '<span style="--sc:var(--s-' + s + ')"><i></i>' + esc(STYLE[s].title) + '</span>' }).join('')
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
  function whyHtml(m) {
    if (!m || !m.field) return ''
    var term = esc(String(m.field === 'description' ? S.q.trim() : (m.term || '')).replace(/-/g, ' '))
    if (m.field === 'synonym' || m.field === 'alias') { if (norm(m.term).replace(/-/g, ' ') === norm(S.q).replace(/-/g, ' ')) return (m.field === 'alias' ? 'also called' : 'means') + ' <b>' + term + '</b>' }
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
    var why = S.view === 'grid' ? whyHtml(m) : ''
    var label = S.view === 'compare' ? esc(STYLE[it.st].title) : hiName(ic.title)
    n.style.setProperty('--sc', 'var(--s-' + it.st + ')')
    n.innerHTML = '<span class="t-card"><span class="t-ic">' + glyph(it.st, it.name) + '</span><span class="t-name">' + label + '</span>' + (why ? '<span class="t-why">' + why + '</span>' : '') + '</span>' +
      '<span class="t-chk" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
    var whyTxt = why ? why.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') : ''
    n.setAttribute('aria-label', ic.title + ', ' + STYLE[it.st].title + ' style' + (whyTxt ? ', ' + whyTxt : ''))
    n.title = ic.title + (S.view === 'compare' ? ' · ' + STYLE[it.st].title : '') + (whyTxt ? ' (' + whyTxt + ')' : '') + ' — click to copy'
    n._st = it.st
    paintTileState(n)
  }
  function paintTileState(n) {
    var sel = S.sel.has(n._k)
    n.classList.toggle('is-sel', sel)
    n.setAttribute('aria-selected', sel ? 'true' : 'false')
    n.classList.toggle('is-active', !!(V.open && V.name === n._name && (S.view === 'grid' || V.st === n._st)))
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
      l.style.height = (L.labelW ? L.th : L.labelH) + 'px'
    }
    labels.forEach(function (l, k) { if (!want.has(k)) { l.remove(); labels.delete(k) } })
  }

  var scrollQueued = false
  function onScroll() {
    if (scrollQueued) return
    scrollQueued = true
    raf(function () {
      scrollQueued = false; render({ scrolling: true })
      var b = $('[data-bar]'); if (b) { var st = b.getBoundingClientRect().top <= (parseFloat(root.style.getPropertyValue('--lib-top')) || 0) + 1 && W.scrollY > 40; if (st !== b.classList.contains('is-stuck')) { b.classList.toggle('is-stuck', st); measureTop() } }
    })
  }

  /* ───────────────────────── update pipeline ───────────────────────── */
  function snapshot() { var m = new Map(); mounted.forEach(function (n, k) { var t = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(n._tr || ''); if (t) m.set(k, { x: +t[1], y: +t[2] }) }); return m }
  function update(o) {
    o = o || {}
    var prev = snapshot()
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
    if (!q) head = '<b>' + fmt(n) + '</b> icon' + (n === 1 ? '' : 's') + catTxt + (S.view === 'compare' ? ' <span class="meta-sep">·</span> <b>' + fmt(n * SNAMES.length) + '</b> in all ' + SNAMES.length + ' styles' : ' <span class="meta-sep">·</span> <span class="meta-sc">' + esc(STYLE[S.style].title) + '</span> style')
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
  var POP_CATS = ['actions', 'communication', 'commerce', 'files', 'users', 'weather', 'objects', 'charts']
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
        '<div class="em-ai"><div class="em-ai-h"><span class="em-ai-ic" aria-hidden="true">' + ICO.spark + '</span><div><h3>Ask an AI to pick the right icon</h3><p>Describe what you need in your own words. We’ll hand your assistant a ready prompt that knows all 300 icons.</p></div></div>' +
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
  }

  /* ───────────────────────── style switcher ───────────────────────── */
  var SAMPLE = ['heart', 'star', 'home', 'bell'].filter(function (n) { return BY[n] })[0] || ICONS[0].name
  function paintStylePills() {
    $$('[data-style-pill]', stylesEl).forEach(function (b) {
      var st = b.getAttribute('data-style-pill')
      var on = S.view === 'grid' && st === S.style
      b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on || (S.view === 'compare' && st === S.style) ? 0 : -1
      var g = $('.sp-g', b); if (g && !g.firstElementChild && svgMap(st)) g.innerHTML = glyph(st, SAMPLE)
    })
    var cmp = $('[data-compare]'); if (cmp) { cmp.setAttribute('aria-pressed', S.view === 'compare' ? 'true' : 'false'); if (S.view === 'compare' && stylesEl.scrollWidth > stylesEl.clientWidth) stylesEl.scrollLeft = stylesEl.scrollWidth }
    moveInk()
    root.setAttribute('data-style', S.view === 'compare' ? 'all' : S.style)
    paintTools()
  }
  function moveInk() {
    var ink = $('.sp-ink', stylesEl), on = $('[aria-checked="true"]', stylesEl)
    if (!ink || !on) { if (ink) ink.style.opacity = 0; return }
    ink.style.opacity = 1
    ink.style.transform = 'translateX(' + on.offsetLeft + 'px)'; ink.style.width = on.offsetWidth + 'px'
  }
  function setStyle(st, fromEl) {
    if (!STYLE[st]) return
    var wasCompare = S.view === 'compare'
    if (st === S.style && !wasCompare) return
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
    if (e.shiftKey && lastClickIdx >= 0) { selectRange(lastClickIdx, idx); return }
    if (e.metaKey || e.ctrlKey || e.target.closest('.t-chk') || root.classList.contains('is-selecting')) { toggleSel(it.k); lastClickIdx = idx; return }
    lastClickIdx = idx
    // desktop: copy + show details beside the grid. phones: open the sheet (it has a big Copy button)
    if (!isSheet()) copyImage(it.st, it.name)
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
    $('[data-sel-prev]', selbar).innerHTML = Array.from(S.sel).slice(-5).map(function (k) { var p = k.split('|'); return '<span style="--sc:var(--s-' + p[1] + ')">' + glyph(p[1], p[0]) + '</span>' }).join('')
    $$('[data-zip-px]', selbar).forEach(function (el) { el.textContent = S.px })
  }
  function refreshTabStops() { mounted.forEach(function (n) { n.tabIndex = n._idx === S.fi ? 0 : -1 }) }

  // keyboard: roving focus over the virtual grid
  grid.addEventListener('keydown', function (e) {
    var n = tileFromEvent(e); if (!n) return
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
      case 'Enter': e.preventDefault(); if (!isSheet()) copyImage(ITEMS[idx].st, ITEMS[idx].name); openViewer(ITEMS[idx].name, ITEMS[idx].st, { from: n, keyboard: true }); return
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
    if (n && !noFocus) n.focus({ preventScroll: true })
    // the docked viewer follows the keyboard
    if (V.open && !isSheet() && !V.full) setViewerIcon(ITEMS[i].name, S.view === 'compare' ? ITEMS[i].st : V.st)
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
  grid.addEventListener('pointerover', function (e) { var n = tileFromEvent(e); if (n && !n._warm && e.pointerType === 'mouse') { n._warm = 1; renderPng(n._st, n._name, S.px).catch(function () { }) } })
  grid.addEventListener('dragstart', function (e) {
    var n = tileFromEvent(e); if (!n) return
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
  var BG_LIST = [['paper', 'Paper'], ['white', 'White'], ['dark', 'Dark'], ['brand', 'Style colour'], ['check', 'Transparent']]

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
    return [
      { id: 'react', label: 'React', file: 'App.jsx', code: imp('@withicons/react') + "\n\nexport const Example = () => <" + alias + " size={24} title=\"" + T + "\" />" },
      { id: 'vue', label: 'Vue', file: 'Example.vue', code: "<script setup>\n" + imp('@withicons/vue') + "\n</script>\n\n<template>\n  <" + alias + " :size=\"24\" />\n</template>" },
      { id: 'svelte', label: 'Svelte', file: 'Example.svelte', code: "<script>\n  " + imp('@withicons/svelte') + "\n</script>\n\n<" + alias + " size={24} />" },
      { id: 'angular', label: 'Angular', file: 'example.component.ts', code: "import { Component } from '@angular/core'\nimport { WithIconComponent } from '@withicons/angular'\n" + imp('@withicons/angular') + "\n\n@Component({\n  selector: 'app-example',\n  imports: [WithIconComponent],\n  template: `<with-icon [icon]=\"icon\" [size]=\"24\" />`,\n})\nexport class ExampleComponent { icon = " + alias + " }" },
      { id: 'solid', label: 'Solid', file: 'Example.tsx', code: imp('@withicons/solid') + "\n\nexport const Example = () => <" + alias + " size={24} />" },
      { id: 'wc', label: 'Web component', file: 'index.html', code: '<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web/dist/index.js"></script>\n\n<with-icon name="' + name + '"' + (st === 'line' ? '' : ' variant="' + st + '"') + ' label="' + T + '"></with-icon>' },
      { id: 'classes', label: 'Icon classes', file: 'index.html', code: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-' + (st === 'line' ? 'line' : 'all') + '.css">\n\n<i class="with with-' + name + (st === 'line' ? '' : ' with-' + st) + '"></i>' },
      { id: 'svg', label: 'SVG', file: fname(st, name, 'svg'), code: codeSvg(st, name) },
    ]
  }
  var CSS_LINK = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-all.css">'
  function iTag(name, st) { return '<i class="with with-' + name + (st && st !== 'line' ? ' with-' + st : '') + '"></i>' }
  function flash(btn, label) { var p = btn.querySelector('[data-vw-tagdone]') || btn; var old = p.textContent; btn.classList.add('is-done'); p.textContent = label || 'Copied'; clearTimeout(btn._ft); btn._ft = setTimeout(function () { btn.classList.remove('is-done'); p.textContent = old === (label || 'Copied') ? 'Copy' : old }, 1500) }
  function hl(code) { var w = WI(); return w && w.highlight ? w.highlight(code) : esc(code) }

  function sizeIndex(px) { var i = SIZES.indexOf(px); if (i >= 0) return i; for (i = 0; i < SIZES.length; i++) if (SIZES[i] >= px) return i; return SIZES.length - 1 }

  // build the viewer skeleton once; parts are repainted in place (sliders never rebuild the DOM)
  function buildViewer() {
    vwBody.innerHTML =
      '<header class="vw-head" data-vw-drag>' +
        '<div class="vw-topline">' +
          '<p class="vw-crumbs"><a data-vw-cat href="#"></a><span class="vw-dot" aria-hidden="true"></span><span class="vw-stname" data-vw-stname></span></p>' +
          '<div class="vw-hbtns">' +
            '<button type="button" class="vw-ib" data-vw="prev" aria-label="Previous icon" title="Previous icon (←)">' + ICO.prev + '</button>' +
            '<button type="button" class="vw-ib" data-vw="next" aria-label="Next icon" title="Next icon (→)">' + ICO.next + '</button>' +
            '<button type="button" class="vw-ib" data-vw="share" aria-label="Copy a link to this icon" title="Copy link">' + ICO.link + '</button>' +
            '<button type="button" class="vw-ib vw-only-desk" data-vw="full" aria-label="Expand to full screen" title="Full screen (F)">' + ICO.expand + '</button>' +
            '<button type="button" class="vw-ib" data-vw="close" aria-label="Close details" title="Close (Esc)">' + ICO.close + '</button>' +
          '</div>' +
        '</div>' +
        '<h2 class="vw-title" id="vw-title" tabindex="-1" data-vw-title></h2>' +
        '<p class="vw-desc" data-vw-desc></p>' +
      '</header>' +
      '<div class="vw-main">' +
        '<div class="vw-col-a">' +
          '<div class="vw-stage" data-vw-stage draggable="true" title="Drag me into your slides, doc or desktop">' +
            '<div class="vw-art" data-vw-art></div>' +
            '<span class="vw-drag-hint" aria-hidden="true">drag me out ↘</span>' +
            '<div class="vw-bgs" role="radiogroup" aria-label="Preview background">' + BG_LIST.map(function (b) { return '<button type="button" role="radio" class="vw-bg is-' + b[0] + '" data-vw-bg="' + b[0] + '" aria-label="' + b[1] + ' background" title="' + b[1] + '"><span></span></button>' }).join('') + '</div>' +
            '<output class="vw-readout" data-vw-readout></output>' +
          '</div>' +
          '<div class="vw-styles" role="radiogroup" aria-label="Style" data-vw-styles>' + SNAMES.map(function (s, i) { return '<button type="button" role="radio" class="vw-st" data-vw-st="' + s + '" style="--sc:var(--s-' + s + ')" title="' + esc(STYLE[s].title) + ' (' + (i + 1) + ')"><span class="vw-st-g"></span><span class="vw-st-t">' + esc(STYLE[s].title) + '</span></button>' }).join('') + '</div>' +
          '<section class="vw-sec vw-mocks" aria-labelledby="vw-mk-h"><h3 class="vw-h3" id="vw-mk-h">See it in use</h3><div class="mk-grid" data-vw-mocks></div></section>' +
        '</div>' +
        '<div class="vw-col-b">' +
          '<div class="vw-actions">' +
            '<button type="button" class="vw-btn is-primary" data-vw="copy-img">' + ICO.copy + '<span><b>Copy image</b><small>Paste into Slides, Docs, Notion, Canva</small></span><kbd class="vw-kbd">Enter</kbd></button>' +
            '<div class="vw-itag">' +
              '<button type="button" class="vw-btn is-tag" data-vw="copy-tag">' + ICO.code + '<span><b>Copy &lt;i&gt; tag</b><code data-vw-tag></code></span><span class="vw-pill" data-vw-tagdone>Copy</span></button>' +
              '<p class="vw-once"><span>First time on a page? Add this once:</span><code data-vw-css></code><button type="button" class="vw-mini" data-vw="copy-css">Copy</button></p>' +
            '</div>' +
            '<div class="vw-png">' +
              '<button type="button" class="vw-btn" data-vw="png">' + ICO.down + '<span><b>Download PNG</b><small data-vw-pngsize></small></span></button>' +
              '<div class="vw-presets" role="radiogroup" aria-label="PNG size">' + PRESETS.map(function (p) { return '<button type="button" role="radio" data-vw-px="' + p + '">' + p + '</button>' }).join('') + '</div>' +
            '</div>' +
            '<div class="vw-duo">' +
              '<button type="button" class="vw-btn is-soft" data-vw="svg">' + ICO.down + '<span><b>Download SVG</b><small>Sharp at any size</small></span></button>' +
              '<button type="button" class="vw-btn is-soft" data-vw="copy-svg">' + ICO.code + '<span><b>Copy SVG code</b><small>For Figma, Canva, HTML</small></span></button>' +
            '</div>' +
            '<a class="vw-page" data-vw-page href="#"><span><b data-vw-pagetitle>Open the icon page</b><small>Every style, guides and a shareable page</small></span>' + ICO.arrow + '</a>' +
          '</div>' +
          '<section class="vw-sec vw-tune" aria-labelledby="vw-tune-h"><h3 class="vw-h3" id="vw-tune-h">Make it yours</h3>' +
            '<div class="vw-field"><span class="vw-label" id="vw-col-l">Colour</span>' +
              '<div class="vw-swatches" role="radiogroup" aria-labelledby="vw-col-l">' + PALETTE.map(function (p) { return '<button type="button" role="radio" class="vw-sw' + (p[0] === 'ink' ? ' is-auto' : p[0] === 'style' ? ' is-style' : '') + '" data-vw-color="' + p[0] + '" title="' + p[1] + '" aria-label="' + p[1] + '"' + (p[0][0] === '#' ? ' style="--c:' + p[0] + '"' : '') + '><span></span></button>' }).join('') +
                '<label class="vw-sw is-custom" title="Any colour"><input type="color" data-vw-custom value="#FF5A36" aria-label="Pick any colour"><span>' + ICO.pick + '</span></label>' +
              '</div></div>' +
            '<div class="vw-field"><label class="vw-label" for="vw-size">Size</label>' +
              '<input class="vw-range" id="vw-size" type="range" min="0" max="' + (SIZES.length - 1) + '" step="1" data-vw-size aria-valuetext=""><output class="vw-out" data-vw-sizeout></output></div>' +
            '<div class="vw-field" data-vw-swrow><label class="vw-label" for="vw-sw">Stroke</label>' +
              '<input class="vw-range" id="vw-sw" type="range" min="0.75" max="3" step="0.25" data-vw-sw><span class="vw-out"><output data-vw-swout></output><button type="button" class="vw-reset" data-vw="sw-reset">reset</button></span></div>' +
            '<label class="vw-check"><input type="checkbox" data-vw-bginc><span class="vw-check-ui" aria-hidden="true"></span><span>Put the preview background in downloads <small>(rounded tile)</small></span></label>' +
          '</section>' +
          '<section class="vw-sec" data-vw-akasec aria-labelledby="vw-aka-h"><h3 class="vw-h3" id="vw-aka-h">Also known as</h3><p class="vw-chips" data-vw-aka></p></section>' +
          '<section class="vw-sec" aria-labelledby="vw-rel-h"><h3 class="vw-h3" id="vw-rel-h">Related icons</h3><div class="vw-rel" data-vw-rel></div></section>' +
          '<section class="vw-sec vw-ai" aria-labelledby="vw-ai-h"><h3 class="vw-h3" id="vw-ai-h"><span class="vw-ai-ic" aria-hidden="true">' + ICO.spark + '</span>Ask AI to help with it</h3><p class="vw-ai-p">Pick a task. Your assistant gets a ready brief about this icon and style.</p><div data-vw-ai></div></section>' +
          '<details class="vw-dev" data-vw-dev><summary><span><b>For developers</b><small>React, Vue, Svelte, Angular, Solid, web component, classes, SVG</small></span></summary>' +
            '<div class="vw-tabs" role="tablist" aria-label="Code format" data-vw-tabs></div>' +
            '<div class="vw-code" role="tabpanel" id="vw-codepanel" data-vw-codepanel><div class="vw-code-bar"><span data-vw-file></span><button type="button" class="vw-copy" data-vw="copy-code">' + ICO.copy + '<span>Copy</span></button></div><pre><code data-vw-code></code></pre></div>' +
            '<p class="vw-soon">npm packages are <b>launching soon</b>. SVG, PNG and copy work today. <a href="developers.html">Developer docs</a></p>' +
          '</details>' +
        '</div>' +
      '</div>'
    if (store.get('devopen', false)) $('[data-vw-dev]', vwBody).open = true
    viewer._built = true
  }

  function openViewer(name, st, o) {
    o = o || {}
    if (!BY[name]) return
    if (!viewer._built) buildViewer()
    var wasOpen = V.open
    V.open = true
    if (!wasOpen) V.returnFocus = o.from || D.activeElement
    setViewerIcon(name, st || V.st || S.style, true)
    loadAll()
    if (!wasOpen) {
      viewer.hidden = false
      root.classList.add('has-vw'); body.classList.add('has-vw')
      if (isSheet()) { setSnap('peek', true); lockScroll(true) }
      else { updateBodyCols(); relayout(true); keepActiveInView() }
      viewer.classList.remove('is-in'); void viewer.offsetWidth; viewer.classList.add('is-in')
      paintScrim()
    }
    if (isSheet() || V.full || o.focus) focusTitle()
    syncUrl()
  }
  function focusTitle() { var t = $('[data-vw-title]', vwBody); if (t) setTimeout(function () { t.focus({ preventScroll: true }) }, reduced ? 0 : 60) }
  function closeViewer() {
    if (!V.open) return
    if (V.full) setFull(false)
    V.open = false
    var finish = function () {
      viewer.hidden = true
      root.classList.remove('has-vw'); body.classList.remove('has-vw')
      if (!isSheet()) { updateBodyCols(); relayout(true) }
    }
    if (isSheet()) { setSnap('closed'); lockScroll(false); setTimeout(function () { if (!V.open) finish() }, reduced ? 0 : 320) }
    else finish()
    paintScrim()
    mounted.forEach(paintTileState)
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
    V.name = name; V.st = STYLE[st] ? st : V.st
    paintViewer(changedName ? 'all' : 'style')
    mounted.forEach(paintTileState)
    if (changedName && oldName && !reduced) {
      var art = $('[data-vw-art]', vwBody)
      if (art) art.animate([{ transform: 'scale(.82)', opacity: 0 }, { transform: 'scale(1.03)', opacity: 1, offset: 0.65 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.2,.8,.2,1)' })
    }
    syncUrl()
  }
  function setViewerStyle(st, fromGrid) {
    if (!STYLE[st] || st === V.st) return
    V.st = st
    loadStyle(st).then(function () { paintViewer('style') })
    paintViewer('style')
    mounted.forEach(paintTileState)
    if (!fromGrid && !reduced) {
      var art = $('[data-vw-art]', vwBody)
      if (art) art.animate([{ transform: 'rotate(-8deg) scale(.86)', opacity: 0.2 }, { transform: 'none', opacity: 1 }], { duration: 340, easing: 'cubic-bezier(.34,1.56,.64,1)' })
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
    viewer.style.setProperty('--sc-soft', 'var(--c-' + st + '-soft, color-mix(in srgb, var(--s-' + st + ') 14%, transparent))')
    viewer.setAttribute('data-st', st)
    if (part === 'all') {
      $('[data-vw-title]', b).textContent = ic.title
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
      $('[data-vw-stname]', b).textContent = STYLE[st].title + ' style'
      $$('[data-vw-st]', b).forEach(function (btn) {
        var s = btn.getAttribute('data-vw-st'), on = s === st
        btn.setAttribute('aria-checked', on ? 'true' : 'false'); btn.tabIndex = on ? 0 : -1
        $('.vw-st-g', btn).innerHTML = svgMap(s) ? glyph(s, name) : '<span class="t-skel" aria-hidden="true"></span>'
      })
      $('[data-vw-rel]', b).innerHTML = (viewer._rel || []).map(function (n) { return '<button type="button" class="vw-relb" data-vw-open="' + n + '" title="' + esc(BY[n].title) + '" aria-label="' + esc(BY[n].title) + '">' + (svgMap(st) ? glyph(st, n) : '') + '<span>' + esc(BY[n].title) + '</span></button>' }).join('')
      $('[data-vw-tag]', b).textContent = iTag(name, st)
      $('[data-vw-css]', b).textContent = CSS_LINK
      paintDev()
      var ai = $('[data-vw-ai]', b)
      var host = D.createElement('div')
      host.setAttribute('data-ask-ai', ''); host.setAttribute('data-icon', name); host.setAttribute('data-style', st); host.setAttribute('data-ask-mode', 'tasks'); host.setAttribute('data-compact', '')
      ai.innerHTML = ''; ai.appendChild(host)
      renderAskAI(host, { icon: name, style: st, mode: 'tasks', compact: true })
    }
    paintLook()
  }
  function paintLook() {
    if (!viewer._built || !V.name) return
    var name = V.name, st = V.st, b = vwBody
    var stage = $('[data-vw-stage]', b)
    stage.setAttribute('data-bg', V.bg)
    stage.style.setProperty('--stage-ic', stageColor(st))
    var art = $('[data-vw-art]', b)
    art.innerHTML = svgMap(st) ? svgInline(st, name) : '<span class="t-skel" aria-hidden="true"></span>'
    art.style.setProperty('--disp', S.px + 'px')
    var bgHexV = exportBg(st)
    art.classList.toggle('has-tile', !!bgHexV); art.style.setProperty('--tile', bgHexV || 'transparent'); if (bgHexV) stage.setAttribute('data-tile', ''); else stage.removeAttribute('data-tile')
    $('[data-vw-readout]', b).innerHTML = '<b>' + S.px + '</b> × ' + S.px + ' px'
    $$('[data-vw-bg]', b).forEach(function (x) { var on = x.getAttribute('data-vw-bg') === V.bg; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1 })
    $$('[data-vw-color]', b).forEach(function (x) { var on = x.getAttribute('data-vw-color') === S.color; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on || (!isPreset(S.color) && x.getAttribute('data-vw-color') === 'ink') ? 0 : -1 })
    var cust = $('[data-vw-custom]', b), isC = !isPreset(S.color)
    cust.closest('.vw-sw').classList.toggle('is-on', isC); if (isC) { cust.value = S.color; cust.closest('.vw-sw').style.setProperty('--c', S.color) }
    var si = sizeIndex(S.px), sr = $('[data-vw-size]', b)
    sr.value = si; sr.setAttribute('aria-valuetext', S.px + ' pixels'); sr.style.setProperty('--fill', (si / (SIZES.length - 1) * 100) + '%')
    $('[data-vw-sizeout]', b).textContent = S.px + ' px'
    $('[data-vw-pngsize]', b).textContent = S.px + ' × ' + S.px + ' px' + (V.bgInc ? ' · with background' : ' · transparent')
    $$('[data-vw-px]', b).forEach(function (x) { var on = +x.getAttribute('data-vw-px') === S.px; x.setAttribute('aria-checked', on ? 'true' : 'false') })
    var swRow = $('[data-vw-swrow]', b), swOk = numericSW(st)
    swRow.hidden = !swOk
    if (swOk) {
      var def = STYLE[st].strokeWidth, v = S.sw == null ? def : S.sw, swr = $('[data-vw-sw]', b)
      swr.value = v; swr.style.setProperty('--fill', ((v - 0.75) / 2.25 * 100) + '%')
      $('[data-vw-swout]', b).textContent = (+v).toFixed(2).replace(/0$/, '') 
      $('[data-vw="sw-reset"]', b).hidden = S.sw == null
    }
    $('[data-vw-bginc]', b).checked = V.bgInc
    paintMocks()
  }
  function isPreset(c) { return PALETTE.some(function (p) { return p[0] === c }) }
  function paintMocks() {
    var name = V.name, st = V.st, g = svgMap(st) ? svgInline(st, name) : ''
    var col = S.color === 'ink' ? 'var(--mk-ink)' : S.color === 'style' ? 'var(--s-' + st + ')' : S.color
    var tabCol = S.color === 'ink' ? 'var(--s-' + st + ')' : col
    var rel = (viewer._rel || []).slice(0, 3)
    var relG = function (n) { return svgMap(st) && BY[n] ? svgInline(st, n) : '' }
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
  }

  viewer.addEventListener('click', function (e) {
    if (!V.name) return
    var t = e.target.closest('button, a'); if (!t || !viewer.contains(t)) return
    var act = t.getAttribute('data-vw'), name = V.name, st = V.st
    if (act === 'copy-img') copyImage(st, name)
    else if (act === 'png') downloadPng(st, name)
    else if (act === 'svg') downloadSvg(st, name)
    else if (act === 'copy-svg') copySvgCode(st, name)
    else if (act === 'copy-tag') { copyText(iTag(name, st)).then(function () { flash(t); bump(name); toast('Copied <code>' + esc(iTag(name, st)) + '</code>. First time on a page? Also add the stylesheet line once.', { icon: name, st: st, action: { label: 'Copy stylesheet', run: function () { copyText(CSS_LINK).then(function () { toast('Copied the stylesheet line. Put it in your page’s &lt;head&gt; once.') }, clipFail) } } }) }, clipFail) }
    else if (act === 'copy-css') { copyText(CSS_LINK).then(function () { flash(t); toast('Copied the stylesheet line. Put it in your page’s &lt;head&gt; once, then every &lt;i&gt; tag works.') }, clipFail) }
    else if (act === 'close') closeViewer()
    else if (act === 'prev') stepViewer(-1)
    else if (act === 'next') stepViewer(1)
    else if (act === 'full') setFull(!V.full)
    else if (act === 'sw-reset') { S.sw = null; afterLook() }
    else if (act === 'share') {
      var url = location.href.split('?')[0].split('#')[0] + urlQuery(true)
      copyText(url).then(function () { toast('Link copied. Anyone who opens it lands on <b>' + esc(BY[name].title) + '</b>.', { icon: name, st: st }) }, clipFail)
    } else if (act === 'copy-code') {
      var code = $('[data-vw-code]', vwBody)._raw || ''
      copyText(code).then(function () { t.classList.add('is-done'); $('span', t).textContent = 'Copied'; setTimeout(function () { t.classList.remove('is-done'); $('span', t).textContent = 'Copy' }, 1400) }).catch(clipFail)
    } else if (t.hasAttribute('data-vw-st')) setViewerStyle(t.getAttribute('data-vw-st'))
    else if (t.hasAttribute('data-vw-bg')) { V.bg = t.getAttribute('data-vw-bg'); store.set('vbg', V.bg); afterLook() }
    else if (t.hasAttribute('data-vw-color')) { S.color = t.getAttribute('data-vw-color'); store.set('color', S.color); afterLook() }
    else if (t.hasAttribute('data-vw-px')) { setPx(+t.getAttribute('data-vw-px')) }
    else if (t.hasAttribute('data-vw-tab')) { V.tab = t.getAttribute('data-vw-tab'); store.set('devtab', V.tab); paintDev(); var nt = $('[data-vw-tab="' + V.tab + '"]', vwBody); if (nt) nt.focus() }
    else if (t.hasAttribute('data-vw-q')) { var q = t.getAttribute('data-vw-q'); if (isSheet() || V.full) closeViewer(); setQuery(q); if (!isSheet()) input.focus({ preventScroll: true }); W.scrollTo({ top: Math.max(0, W.scrollY + grid.getBoundingClientRect().top - barBottom() - 90), behavior: reduced ? 'auto' : 'smooth' }) }
    else if (t.hasAttribute('data-vw-open')) { setViewerIcon(t.getAttribute('data-vw-open'), V.st); vwBody.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); keepActiveInView() }
    else if (t.hasAttribute('data-vw-cat')) { e.preventDefault(); if (isSheet() || V.full) closeViewer(); setCat(BY[name].category, true) }
  })
  viewer.addEventListener('input', function (e) {
    var t = e.target
    if (t.hasAttribute('data-vw-size')) setPx(SIZES[+t.value], true)
    else if (t.hasAttribute('data-vw-sw')) { S.sw = +t.value; afterLook(true) }
    else if (t.hasAttribute('data-vw-custom')) { S.color = t.value; store.set('color', S.color); afterLook(true) }
  })
  viewer.addEventListener('change', function (e) {
    var t = e.target
    if (t.hasAttribute('data-vw-bginc')) { V.bgInc = t.checked; store.set('bginc', V.bgInc); afterLook() }
    else if (t.hasAttribute('data-vw-size') || t.hasAttribute('data-vw-sw')) paintTools()
  })
  viewer.addEventListener('keydown', function (e) {
    var t = e.target
    // arrow keys inside radio groups / tab lists
    var group = t.closest && t.closest('[role="radiogroup"], [role="tablist"]')
    if (group && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      var items = $$('button', group), i = items.indexOf(t)
      if (i >= 0) { e.preventDefault(); var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1; var n = items[(i + dir + items.length) % items.length]; n.focus(); n.click(); return }
    }
  })
  viewer.addEventListener('toggle', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-vw-dev')) store.set('devopen', e.target.open) }, true)
  viewer.addEventListener('dragstart', function (e) {
    var s = e.target.closest && e.target.closest('[data-vw-stage]'); if (!s || !V.name) return
    dragData(e, V.st, V.name, $('[data-vw-art] svg', s))
  })
  viewer.addEventListener('pointerover', function (e) { if (V.name && e.pointerType === 'mouse' && e.target.closest && e.target.closest('[data-vw-stage]')) renderPng(V.st, V.name, S.px).catch(function () { }) })
  function afterLook(live) { paintLook(); if (!live) paintTools(); else paintGridColour() }
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
  function setFull(on) {
    if (isSheet()) on = false
    V.full = on
    viewer.classList.toggle('is-full', on)
    HTML.classList.toggle('vw-lock', on || (isSheet() && V.open))
    var b = $('[data-vw="full"]', vwBody)
    if (b) { b.innerHTML = on ? ICO.shrink : ICO.expand; b.setAttribute('aria-label', on ? 'Exit full screen' : 'Expand to full screen'); b.title = on ? 'Exit full screen (F)' : 'Full screen (F)' }
    viewer.setAttribute('role', on ? 'dialog' : 'complementary')
    if (on) { viewer.setAttribute('aria-modal', 'true'); focusTitle() } else viewer.removeAttribute('aria-modal')
    paintScrim()
    if (!reduced) vwPanel.animate([{ transform: on ? 'scale(.97)' : 'scale(1.02)', opacity: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)' })
  }
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
    if (s === 'peek') return Math.max(0, h - Math.min(vh * 0.64, 620))
    return h + 24
  }
  function setSnap(s, fromClosed) {
    V.snap = s
    viewer.setAttribute('data-snap', s)
    if (fromClosed && !reduced) { vwPanel.style.transition = 'none'; vwPanel.style.transform = 'translate3d(0,' + snapY('closed') + 'px,0)'; void vwPanel.offsetWidth; vwPanel.style.transition = '' }
    vwPanel.style.transform = 'translate3d(0,' + snapY(s) + 'px,0)'
    paintScrim()
  }
  function lockScroll(on) { HTML.classList.toggle('vw-lock', on || V.full) }
  ;(function sheetGestures() {
    var drag = null
    vwPanel.addEventListener('pointerdown', function (e) {
      if (!isSheet() || !V.open || e.button !== 0) return
      var inBody = vwBody.contains(e.target), onControl = e.target.closest('input, select, textarea, .vw-styles, .vw-presets, .vw-tabs, .vw-rel, pre')
      if (onControl) return
      // at "full", the content scrolls: only the grip/header drag the sheet (or a pull-down from the very top)
      var head = e.target.closest('[data-vw-grip], .vw-head')
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
    var f = $$('button:not([disabled]), a[href], input, summary, [tabindex="0"], [tabindex="-1"]#vw-title', vwPanel).filter(function (x) { return x.offsetParent !== null && !x.closest('[hidden]') })
    if (!f.length) return
    var first = f[0], last = f[f.length - 1]
    if (!vwPanel.contains(D.activeElement)) { e.preventDefault(); first.focus(); return }
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
  stylesEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-style-pill]'); if (b) { setStyle(b.getAttribute('data-style-pill'), b); return }
    if (e.target.closest('[data-compare]')) setView(S.view === 'compare' ? 'grid' : 'compare')
  })
  stylesEl.addEventListener('keydown', function (e) {
    if (!e.target.hasAttribute('data-style-pill')) return
    var pills = $$('[data-style-pill]', stylesEl), i = pills.indexOf(e.target)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var n = pills[(i + (e.key === 'ArrowRight' ? 1 : -1) + pills.length) % pills.length]; n.focus(); n.click() }
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
  }
  function paintTools() {
    $$('[data-density]', tools).forEach(function (b) { b.setAttribute('aria-pressed', S.density === b.getAttribute('data-density') ? 'true' : 'false') })
    $$('[data-color]', tools).forEach(function (b) { b.setAttribute('aria-pressed', S.color === b.getAttribute('data-color') ? 'true' : 'false') })
    var custom = $('[data-color-custom]', tools)
    if (custom) { var isC = !isPreset(S.color); custom.closest('.sw').classList.toggle('is-on', isC); if (isC) { custom.value = S.color; custom.closest('.sw').style.setProperty('--c', S.color) } }
    var sw = $('[data-stroke]', tools), swWrap = $('[data-sw-wrap]', tools), ok = S.view === 'compare' || numericSW(S.style)
    if (sw) { var def = numericSW(S.style) ? STYLE[S.style].strokeWidth : 1.75; sw.value = S.sw == null ? def : S.sw; sw.disabled = !ok; $('[data-sw-out]', tools).textContent = (+sw.value).toFixed(2).replace(/0$/, ''); sw.style.setProperty('--fill', ((sw.value - 0.75) / 2.25 * 100) + '%') }
    if (swWrap) swWrap.classList.toggle('is-off', !ok)
    var rs = $('[data-sw-reset]', tools); if (rs) rs.hidden = S.sw == null
    paintGridColour()
  }
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return
    if (b.hasAttribute('data-density')) {
      S.density = b.getAttribute('data-density'); store.set('dens2', S.density); paintTools()
      var prev = snapshot(); layout(); render({ anim: true, prev: prev, noEnter: true }); keepActiveInView(); return
    }
    if (b.hasAttribute('data-color')) { S.color = b.getAttribute('data-color'); store.set('color', S.color) }
    else if (b.hasAttribute('data-sw-reset')) { S.sw = null }
    else if (b.hasAttribute('data-select-mode')) { var on = !root.classList.contains('is-selecting'); root.classList.toggle('is-selecting', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) toast('Selection mode: tap icons to pick several, then download them as one ZIP.', { ms: 3200 }); return }
    else if (b.hasAttribute('data-pop-toggle')) { togglePop(b.closest('[data-pop]')); return }
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
    p.classList.toggle('is-open', open); $('[data-pop-toggle]', p).setAttribute('aria-expanded', open ? 'true' : 'false')
    if (open) { var f = $('button[aria-pressed="true"], button', $('.pop-panel', p)); if (f) setTimeout(function () { f.focus() }, 30) }
  }
  D.addEventListener('pointerdown', function (e) { $$('[data-pop].is-open', tools).forEach(function (p) { if (!p.contains(e.target)) togglePop(p, false) }) })
  // selection bar
  selbar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return
    if (b.hasAttribute('data-zip')) zipSelected(b.getAttribute('data-zip'))
    else if (b.hasAttribute('data-sel-tags')) {
      var tags = Array.from(S.sel).map(function (k) { var p = k.split('|'); return iTag(p[0], p[1]) }).join('\n')
      copyText(tags).then(function () { toast('Copied ' + S.sel.size + ' &lt;i&gt; tag' + (S.sel.size > 1 ? 's' : '') + '. First time on a page? Add the stylesheet line once.', { action: { label: 'Copy stylesheet', run: function () { copyText(CSS_LINK).then(function () { toast('Copied the stylesheet line.') }, clipFail) } } }) }, clipFail)
    }
    else if (b.hasAttribute('data-sel-clear')) clearSel()
    else if (b.hasAttribute('data-sel-all')) selectRange(0, ITEMS.length - 1)
  })

  // global keys
  W.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase(), typing = tag === 'input' && !/^(range|checkbox|radio|color|button)$/.test(e.target.type) || tag === 'textarea' || tag === 'select' || e.target.isContentEditable
    if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K'))) {
      e.preventDefault(); e.stopImmediatePropagation()
      if (V.open && (V.full || isSheet())) closeViewer()
      input.focus({ preventScroll: true }); input.select()
      var r = input.getBoundingClientRect(); if (r.top < 0 || r.bottom > W.innerHeight) input.scrollIntoView({ block: 'center' })
      return
    }
    if (e.key === 'Escape') {
      var pop = $('[data-pop].is-open', tools)
      if (pop) { togglePop(pop, false); $('[data-pop-toggle]', pop).focus(); return }
      if (typing && e.target === input) return
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
    else if (inViewer && /^[1-7]$/.test(e.key) && SNAMES[+e.key - 1]) { e.preventDefault(); setViewerStyle(SNAMES[+e.key - 1]) }
    else if (inViewer && e.key === 'Enter' && e.target === $('[data-vw-title]', vwBody)) { e.preventDefault(); copyImage(V.st, V.name) }
  }, true)
  $$('[data-search-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopImmediatePropagation(); input.focus({ preventScroll: true }); input.select(); input.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }) }, true)
  })

  /* ───────────────────────── placeholder: rotating examples ───────────────────────── */
  var EXAMPLES = ['throw away', 'money', 'settings', 'send email', 'happy', 'calendar', 'upload', 'warning', 'shopping', 'rocket']
  function placeholderLoop() {
    var base = 'Search ' + ICONS.length + ' icons… try “', i = 0, ch = 0, del = false, pause = 0
    if (reduced) { input.placeholder = base + EXAMPLES[0] + '”'; return }
    setInterval(function () {
      if (D.activeElement === input || input.value || D.hidden) return
      var w = EXAMPLES[i]
      if (pause) { pause--; return }
      if (!del) { ch++; if (ch >= w.length) { del = true; pause = 22 } }
      else { ch--; if (ch <= 0) { del = false; i = (i + 1) % EXAMPLES.length; pause = 3 } }
      input.placeholder = base + w.slice(0, ch) + '”'
    }, 70)
  }

  /* ───────────────────────── boot ───────────────────────── */
  function buildChrome() {
    stylesEl.insertAdjacentHTML('afterbegin', '<span class="sp-ink" aria-hidden="true"></span>' + STYLES.map(function (s) {
      return '<button type="button" class="sp" role="radio" data-style-pill="' + s.name + '" style="--sc:var(--s-' + s.name + ')" aria-checked="false" title="' + esc(s.description) + '"><span class="sp-g" aria-hidden="true"></span><span class="sp-t">' + esc(s.title) + '</span></button>'
    }).join(''))
    catNav.innerHTML = '<button type="button" class="cat" data-cat="" aria-pressed="true"><span class="cat-g" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg></span><span class="cat-t">All icons</span><small>' + ICONS.length + '</small></button>' +
      CATS.map(function (c) { return '<button type="button" class="cat" data-cat="' + c + '" aria-pressed="false"><span class="cat-g" aria-hidden="true" data-cat-g="' + catIcon(c) + '"></span><span class="cat-t">' + esc(cap(c)) + '</span><small></small></button>' }).join('')
    $$('[data-icon-total]').forEach(function (el) { el.textContent = ICONS.length })
  }
  function paintCatGlyphs() { $$('[data-cat-g]', catNav).forEach(function (g) { if (!g.firstChild && svgMap('line')) g.innerHTML = glyph('line', g.getAttribute('data-cat-g')) }) }
  function measureTop() {
    var h = $('.site-header'), top = 0
    if (h) { var cs = getComputedStyle(h); if (cs.position === 'sticky' || cs.position === 'fixed') top = Math.max(0, Math.round(h.getBoundingClientRect().bottom)) }
    root.style.setProperty('--lib-top', top + 'px')
    var bar = $('[data-bar]'); if (bar) root.style.setProperty('--lib-bar-h', Math.round(bar.offsetHeight) + 'px')
  }
  styleHooks.push(function (st) {
    if (st === 'line') paintCatGlyphs()
    paintStylePills()
    if (V.open && viewer._built) paintViewer('style')
    if (S.view === 'compare' || st === S.style) mounted.forEach(function (n) { if (n._st === st && n.querySelector('.t-skel')) { var it = itemOf(n); if (it) fillTile(n, it) } })
  })

  buildChrome()
  paintTools()
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
    idleLoadRest()
    var idleRun = W.requestIdleCallback ? function (f) { W.requestIdleCallback(f, { timeout: 1500 }) } : function (f) { setTimeout(f, 200) }
    idleRun(function () { try { var en = getEngine(); if (typeof en.warm === 'function') en.warm(); else en.search('warm', { limit: 1 }) } catch (e) { } })
  })
  W.addEventListener('scroll', onScroll, { passive: true })
  var roQ = false
  if (W.ResizeObserver) new ResizeObserver(function () {
    if (roQ) return; roQ = true
    raf(function () { roQ = false; var w = Math.floor(grid.clientWidth); if (w && Math.abs(w - L.w) > 0.5 && !root.classList.contains('is-resizing')) { relayout(false); moveInk() } })
  }).observe(grid)
  var wasSheet = isSheet()
  W.addEventListener('resize', function () {
    measureTop(); moveInk(); updateBodyCols()
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
  measureTop(); setTimeout(measureTop, 400)
  if (W.WI && W.WI.on) W.WI.on('fonts', function () { measureTop(); moveInk() })
  placeholderLoop()
  // engine may arrive after us (deferred script order): swap it in and re-run the query
  if (!(W.WithSearch && W.WITH_SEARCH_INDEX)) W.addEventListener('load', function () { if (W.WithSearch && W.WITH_SEARCH_INDEX && !(engine && engine.isShared)) { engine = null; if (S.q) update({ anim: false }) } })
  // public hook for debugging / other scripts
  W.WITH_LIBRARY = { _m: function () { return mounted }, state: S, viewer: V, open: openViewer, close: closeViewer, search: function (q) { setQuery(q) }, zip: zip, png: renderPng, svg: fileSvg, engine: getEngine }
})()
