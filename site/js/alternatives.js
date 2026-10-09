/* with icons — alternatives & free-icon landers runtime.
   Icon picker (search the whole set via WithSearch, style / colour / click action; on motion landers each tile
   plays its own hover animation from window.WITH_MOTION) and the migration converter.
   Vanilla, no build, works from file://. Runs after site.js (DOMContentLoaded) and degrades to static HTML. */
(function () {
  'use strict'
  var W = window, doc = document
  function $(s, c) { return (c || doc).querySelector(s) }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)) }
  function WI() { return W.WI || W.EG || null }
  function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  var TITLE = { line: 'Line', solid: 'Solid', duo: 'Duo', gloss: 'Gloss', engrave: 'Engrave', blueprint: 'Blueprint', sketch: 'Sketch', glass: 'Glass', kawaii: 'Kawaii', sticker: 'Sticker', pixel: 'Pixel', retro: 'Retro', luxe: 'Luxe', bauhaus: 'Bauhaus', skeuo: 'Skeuo' }
  function title(s) { var w = WI(), i = w && w.styleInfo && w.styleInfo[s]; return (i && i.title) || TITLE[s] || (s.charAt(0).toUpperCase() + s.slice(1)) }
  /* motion landers: the icon's own hover motion as wm classes + CSS variables (forge/MOTION.md) */
  // style: the tile's style; a 3D style (WithMotion.is3dStyle) plays the move's 3D counterpart and wears wm-3d,
  // a backdrop style (bento, dock) keeps its tile still (wm-backdrop)
  function motionAttrs(n, style) {
    var sp = W.WITH_MOTION && W.WITH_MOTION[n], m = sp && (sp.hover || sp.loop); if (!m) return ''
    var WMo = W.WithMotion, d3 = !!(style && WMo && WMo.is3dStyle && WMo.is3dStyle(style)), bd = !!(style && WMo && WMo.isBackdropStyle && WMo.isBackdropStyle(style))
    if (d3 && WMo.styleMotion) { try { m = WMo.styleMotion(m, style) || m } catch (e) { } }
    var v = [], o = m.origin || [12, 12]
    if (o[0] !== 12 || o[1] !== 12) v.push('--wm-ox:' + (o[0] / 24 * 100).toFixed(2) + '%', '--wm-oy:' + (o[1] / 24 * 100).toFixed(2) + '%')
    if (m.dir != null) { var r = m.dir * Math.PI / 180; v.push('--wm-dx:' + Math.cos(r).toFixed(3), '--wm-dy:' + Math.sin(r).toFixed(3)) }
    if (m.amount != null && m.amount !== 1) v.push('--wm-k:' + m.amount)
    if (m.duration != null) v.push('--wm-dur:' + m.duration + 's')
    if (m.steps) v.push('--wm-steps:' + m.steps)
    if (bd) v.push('--wm-deco:none')
    return ' wm wm-hover wm-p-' + esc(m.preset) + (d3 ? ' wm-3d' : '') + (bd ? ' wm-backdrop' : '') + '"' + (v.length ? ' style="' + v.join(';') + '"' : '') + ' data-wm-preset="' + esc(m.preset)
  }
  var HINT = { anim: 'make an animated SVG', gif: 'make a GIF for your slides, in the quality you pick', svg: 'copy it as SVG', png: 'copy it as a PNG image', dl: 'download a PNG', dlsvg: 'download the SVG file', 'class': 'copy its <i> tag', jsx: 'copy it as JSX for React', vue: 'copy it for a Vue template' }

  var engine = null
  function getEngine() {
    if (engine) return engine
    if (W.WithSearch && W.WITH_SEARCH_INDEX) { try { engine = W.WithSearch.create(W.WITH_SEARCH_INDEX) } catch (e) { engine = null } }
    return engine
  }
  // deferred scripts run before site.js: the shared style row waits until WI is there (DOMContentLoaded at the latest)
  function afterWI(fn) { if (WI()) fn(); else doc.addEventListener('DOMContentLoaded', fn) }
  function stylePicker() { var w = WI(); return (w && w.stylePicker) || W.WIStylePicker || null }
  function ready() { var w = WI(); return w && w.loadMeta ? w.loadMeta() : Promise.resolve(false) }
  // only what is on show: a heavy style comes in chunks (site.js loadStyleFor), so a dozen tiles never pull a 7 MB style
  function withStyle(style, names) { var w = WI(); return ready().then(function () { return w && w.loadStyleFor && names ? w.loadStyleFor(style, names) : w && w.loadStyle ? w.loadStyle(style) : false }) }
  function toast(msg) { var w = WI(); if (w && w.toast) w.toast(msg) }
  function copyText(text, label) {
    var w = WI()
    if (w && w.copyWithToast) return w.copyWithToast(text, label)
    if (navigator.clipboard) return navigator.clipboard.writeText(text)
    return Promise.resolve(false)
  }
  function saveBlob(name, blob) {
    var a = doc.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name
    doc.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 800)
  }
  function toJsx(svg, comp) {
    var body = svg.replace(/\s([a-z]+)-([a-z])([a-z]*)=/g, function (m, a, b, c) { return ' ' + a + b.toUpperCase() + c + '=' })
      .replace(/\sclass=/g, ' className=')
      .replace(/<svg([^>]*)>/, '<svg$1 {...props}>')
    return 'export function ' + comp + 'Icon(props) {\n  return (\n    ' + body + '\n  )\n}\n'
  }
  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 0.5
    var n = parseInt(m[1], 16); return (0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255
  }
  function pascal(n) { return n.split('-').map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1) }).join('') }

  /* ───────── the GIF maker: the studio itself (js/editor.js), opened in a dialog on Animated → GIF ─────────
     Every animated file on these pages comes from the one GIF creator the icon pages and the library use: the same
     motion (the icon's own loop), frames, headroom and encoder, with its options (move, quality, size, background,
     edge colour, plays). The studio's scripts load on first use from the site root (data-root). */
  var studioP = null, maker = null
  function loadAsset(root, rel, css) {
    return new Promise(function (resolve) {
      var el = doc.createElement(css ? 'link' : 'script')
      if (css) { el.rel = 'stylesheet'; el.href = root + rel } else { el.src = root + rel; el.async = false }
      el.onload = function () { resolve(true) }; el.onerror = function () { resolve(false) }
      doc.head.appendChild(el)
    })
  }
  function loadStudio(root) {
    if (W.WithEditor && W.WithEditor.mount) return Promise.resolve(W.WithEditor)
    if (studioP) return studioP
    studioP = Promise.all([
      loadAsset(root, 'vendor/motion/motion.css', true), loadAsset(root, 'css/editor.css', true),
      W.WithMotion ? true : loadAsset(root, 'vendor/motion/motion.js'),
      W.WITH_MOTION ? true : loadAsset(root, 'data/motion.js'),
      loadAsset(root, 'js/palette-map.js'), loadAsset(root, 'js/editor.js')
    ]).then(function () {
      if (!W.WithEditor || !W.WithEditor.mount) { studioP = null; throw new Error('studio') }
      return W.WithEditor
    })
    return studioP
  }
  var ICX = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  var ICA = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  function makerDialog() {
    if (maker) return maker
    var d = doc.createElement('dialog')
    d.className = 'ax-gm'; d.setAttribute('aria-labelledby', 'ax-gm-h')
    d.innerHTML =
      '<div class="ax-gm-in">' +
        '<header class="ax-gm-head">' +
          '<span class="ax-gm-grab" aria-hidden="true"></span>' +
          '<span class="ax-gm-ic" data-gm-ic aria-hidden="true"></span>' +
          '<div class="ax-gm-id"><h2 id="ax-gm-h"><span data-gm-t></span> <span class="ax-gm-k" data-gm-k>GIF maker</span></h2><p data-gm-sub>Pick a move and a quality, then download.</p></div>' +
          '<a class="ax-gm-page" data-gm-page href="#">Icon page' + ICA + '</a>' +
          '<button type="button" class="ax-gm-x" data-gm-x>' + ICX + '<span class="pg-sr">Close</span></button>' +
        '</header>' +
        '<div class="ax-gm-body" data-gm-body tabindex="-1"></div>' +
        // phones: the file's button stays in reach while the move and the quality are picked further down
        '<div class="ax-gm-foot"><button type="button" class="ax-gm-go" data-gm-go><span data-gm-gol>Download</span><small>quality and options below</small></button></div>' +
      '</div>'
    doc.body.appendChild(d)
    d.addEventListener('click', function (e) {
      if (e.target === d || (e.target.closest && e.target.closest('[data-gm-x]'))) closeMaker()
      else if (e.target.closest && e.target.closest('[data-gm-go]')) { var go = $('.ax-gm-body [data-dl-go]', d); if (go) go.click() }
    })
    d.addEventListener('close', function () { doc.documentElement.classList.remove('ax-gm-open'); if (maker.from && maker.from.focus) maker.from.focus({ preventScroll: true }) })
    maker = { el: d, ed: null, from: null }
    return maker
  }
  function closeMaker() { if (maker && maker.el.open) maker.el.close() }
  function openMaker(o) {
    var m = makerDialog(), d = m.el, body = $('[data-gm-body]', d), w = WI()
    var gif = o.act !== 'anim'
    m.from = o.from || null
    $('[data-gm-t]', d).textContent = o.title
    $('[data-gm-k]', d).textContent = gif ? 'GIF maker' : 'Animated SVG'
    $('[data-gm-gol]', d).textContent = gif ? 'Download GIF' : 'Download animated SVG'
    $('[data-gm-sub]', d).textContent = gif ? 'Pick a move and a quality, then download. Plays in PowerPoint, Google Slides, Keynote, email and chat.' : 'Pick a move, then download. Plays on websites, in Notion and in browsers.'
    $('[data-gm-page]', d).href = o.root + 'icons/' + o.name + '.html' + (o.style !== 'line' ? '?style=' + o.style : '')
    $('[data-gm-ic]', d).innerHTML = (w && w.svg && w.svg(o.name, o.style, 28)) || ''
    if (m.ed) { try { m.ed.destroy() } catch (e) { } m.ed = null }
    body.innerHTML = '<p class="ax-gm-wait"><span class="ax-gm-spin" aria-hidden="true"></span>Opening the GIF maker…</p>'
    doc.documentElement.classList.add('ax-gm-open')
    if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute('open', '') }
    loadStudio(o.root).then(function (E) {
      if (!d.open) return
      body.innerHTML = ''
      var host = doc.createElement('div'); host.className = 'ax-gm-studio'; body.appendChild(host)
      m.ed = E.mount(host, {
        name: o.name, title: o.title, style: o.style, remember: false, rememberColors: false, anim: 'loop',
        codeFold: true, dlQuick: false, dlGroup: 'animated', dlPick: gif ? 'gif' : 'animated-svg', dlSize: gif ? o.px : null,
        dlTitle: gif ? 'Your GIF' : 'Your animated file'
      })
      if (o.color && m.ed && m.ed.set) m.ed.set({ color: o.color })
      if (m.ed && m.ed.tab) m.ed.tab('motion')   // the move is what changes a GIF most, so its controls come first
      body.focus({ preventScroll: true })
    }, function () {
      // the studio didn't load (offline, blocked): the icon's own page has the same maker
      location.href = $('[data-gm-page]', d).href + '#download'
    })
  }

  // the tile's own label (its visible name), else the icon's name in words
  function tileTitle(b, n) {
    var t = b && b.querySelector('.ax-tile-n, .ax-tile-t, span:not(.ax-tile-ic)')
    var s = (t && t.textContent.trim()) || n.replace(/-/g, ' ')
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  /* ───────── icon picker ───────── */
  function initPicker(box) {
    var grid = $('[data-pick-grid]', box), input = $('[data-pick-q]', box), status = $('[data-pick-status]', box)
    var empty = $('[data-pick-empty]', box), hint = $('[data-pick-hint]', box)
    var root = box.getAttribute('data-root') || ''
    var st = { style: box.getAttribute('data-style') || 'line', act: box.getAttribute('data-act') || 'svg', color: '#111318', colorSet: false, px: +(box.getAttribute('data-px') || 512) }
    var curated = grid.innerHTML, mode = 'curated', timer = null

    function names() { return $$('.ax-tile', grid).map(function (b) { return b.getAttribute('data-name') }) }
    function paint() {
      var w = WI(); if (!w || !w.svg) return
      withStyle(st.style, names()).then(function () {
        $$('.ax-tile', grid).forEach(function (b) {
          var s = w.svg(b.getAttribute('data-name'), st.style, 32)
          if (s) $('.ax-tile-ic', b).innerHTML = s
        })
      })
      tint()
    }
    function tint() {
      var hasColors = !!$('[data-pick-color]', box)
      box.classList.toggle('is-white', hasColors && lum(st.color) > 0.85)
      box.classList.toggle('is-dark-ink', hasColors && lum(st.color) < 0.2)
      grid.style.setProperty('--ax-ink', hasColors ? st.color : '')
    }
    tint()
    var moving = box.hasAttribute('data-pick-motion')
    // same markup as the generated tiles (forge/tools/site-alternatives/render.mjs picker): the button runs the action,
    // the name links to the icon's page, the corner chip opens that page with the studio open in the style shown here
    var czIcon = (function () { var c = $('.ax-tile-cz svg, .ax-cz-glyph svg', box); return c ? c.outerHTML : '' })()
    var czHash = moving ? '#studio-motion' : '#studio'
    function styleQs() { return st.style && st.style !== 'line' ? '?style=' + encodeURIComponent(st.style) : '' }
    function tile(n) {
      var e = esc(n), href = root + 'icons/' + e + '.html'
      return '<li class="ax-cell is-new' + (moving ? ' wm-trigger' : '') + '"><button class="ax-tile" type="button" data-name="' + e + '"><span class="ax-tile-ic' + (moving ? motionAttrs(n, st.style) : '') + '"></span><span class="pg-sr">' + e + '</span></button>' +
        '<a class="ax-tile-n" href="' + href + '" data-icon-link>' + e + '<span class="pg-sr"> icon page</span></a>' +
        '<a class="ax-tile-cz" href="' + href + styleQs() + czHash + '" data-studio-link title="Customize in the studio">' + czIcon + '<span class="pg-sr">Customize ' + e + ' in the studio</span></a></li>'
    }
    // the studio links (and "Browse all") open in the style picked here
    function relink() {
      $$('[data-studio-link], [data-browse-link]', box).forEach(function (a) {
        var h = a.getAttribute('href') || '', m = /^([^?#]*)(?:\?[^#]*)?(#.*)?$/.exec(h)
        if (m) a.setAttribute('href', m[1] + styleQs() + (m[2] || ''))
      })
    }
    function search(q) {
      q = (q || '').trim()
      if (!q) {
        if (mode !== 'curated') { grid.innerHTML = curated; mode = 'curated'; relink(); paint() }
        empty.hidden = true; setStatus(); return
      }
      var e = getEngine()
      if (!e) { status.textContent = 'Search is still loading…'; return }
      var hits = e.search(q, { limit: 24 }) || []
      mode = 'search'
      grid.innerHTML = hits.map(function (h) { return tile(h.name) }).join('')
      empty.hidden = !!hits.length
      paint()
      $$('.ax-cell.is-new', grid).forEach(function (b, i) { b.style.setProperty('--i', Math.min(i, 16)); requestAnimationFrame(function () { b.classList.remove('is-new') }) })
      var first = hits[0]
      var why = ''
      if (first && first.match && first.match.field && first.match.field !== 'name' && first.match.term) why = ' “' + esc(q) + '” matched <b>' + esc(first.name) + '</b> by ' + esc(first.match.field) + ' “' + esc(first.match.term) + '”.'
      status.innerHTML = hits.length ? hits.length + ' icon' + (hits.length === 1 ? '' : 's') + ' for “' + esc(q) + '”.' + why + ' Click one to ' + esc(HINT[st.act]) + '.' : 'Nothing for “' + esc(q) + '”.'
    }
    var tail = $('[data-pick-tail]', status), tailHtml = tail ? ' ' + tail.outerHTML : ''
    function setStatus() { status.innerHTML = 'Click an icon to <b data-pick-hint>' + esc(HINT[st.act]) + '</b>.' + tailHtml }
    function press(group, btn) { $$(group, box).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false') }) }

    $$('[data-pick-style]', box).forEach(function (b) {
      b.addEventListener('click', function () { st.style = b.getAttribute('data-pick-style'); press('[data-pick-style]', b); box.setAttribute('data-style', st.style); relink(); paint() })
    })
    // the style: the shared compact row (js/style-picker.js, site/STYLE-PICKER.md), this lander's own styles first,
    // then "All N styles"; without it the server-rendered chips above keep working
    var segEl = $('.ax-styles', box)
    if (segEl) afterWI(function () {
      var SP = stylePicker(); if (!SP || !SP.row) return
      var prefer = (segEl.getAttribute('data-pick-styles') || '').split(',').filter(Boolean)
      segEl.innerHTML = ''
      SP.row(segEl, { current: st.style, icon: segEl.getAttribute('data-icon') || null, styles: prefer, max: 6, size: 26, label: 'Icon style', title: 'Show these icons in',
        onPick: function (s) { st.style = s; box.setAttribute('data-style', s); relink(); paint() } })
    })
    $$('[data-pick-act]', box).forEach(function (b) {
      b.addEventListener('click', function () { st.act = b.getAttribute('data-pick-act'); press('[data-pick-act]', b); if (mode === 'curated' || !input.value.trim()) setStatus(); else search(input.value) })
    })
    $$('[data-pick-color]', box).forEach(function (b) {
      b.addEventListener('click', function () { st.color = b.getAttribute('data-pick-color'); st.colorSet = true; press('[data-pick-color]', b); paint() })
    })
    var custom = $('[data-pick-custom]', box)
    var customSw = custom && custom.closest('.ax-sw-custom')
    if (custom) custom.addEventListener('input', function () {
      st.color = custom.value; st.colorSet = true; press('[data-pick-color]', null)
      // the "Any colour" dot shows the chosen colour (the picker itself is the in-house one, js/ui-kit.js)
      if (customSw) { customSw.style.setProperty('--sw', custom.value); customSw.classList.add('is-set') }
      paint()
    })
    $$('[data-pick-color]', box).forEach(function (b) { b.addEventListener('click', function () { if (customSw) customSw.classList.remove('is-set') }) })
    $$('[data-pick-px]', box).forEach(function (b) {
      b.addEventListener('click', function () { st.px = +b.getAttribute('data-pick-px'); press('[data-pick-px]', b) })
    })
    if (input) {
      input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { search(input.value) }, 90) })
      input.addEventListener('keydown', function (e) { if (e.key === 'Escape' && input.value) { input.value = ''; search('') } })
    }

    grid.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.ax-tile'); if (!b) return
      var n = b.getAttribute('data-name'), w = WI()
      b.classList.remove('is-hit'); void b.offsetWidth; b.classList.add('is-hit')
      if (st.act === 'class') { copyText('<i class="with with-' + n + (st.style === 'line' ? '' : ' with-' + st.style) + '"></i>', 'Copied <i> tag for ' + n); return }
      if (!w || !w.svgFile) { location.href = root + 'icons/' + n + '.html'; return }
      withStyle(st.style, [n]).then(function () {
        var color = st.colorSet ? st.color : null
        var label = n + ' · ' + title(st.style)
        if (st.act === 'anim' || st.act === 'gif') { openMaker({ name: n, title: tileTitle(b, n), style: st.style, color: color, px: Math.min(st.px, 512), act: st.act, root: root, from: b }); return }
        if (st.act === 'svg' || st.act === 'vue') return copyText(w.svgFile(n, st.style, { color: color }), 'Copied ' + label + ' SVG')
        if (st.act === 'jsx') return copyText(toJsx(w.svgFile(n, st.style, { color: color }), pascal(n)), 'Copied ' + label + ' as JSX')
        if (st.act === 'dlsvg') { w.download(n + '-' + st.style + '.svg', w.svgFile(n, st.style, { color: color })); toast('Downloaded ' + n + '-' + st.style + '.svg'); return }
        var px = st.px, file = n + '-' + st.style + '-' + px + '.png'
        var blobP = w.svgToPng(w.svgFile(n, st.style, { color: color || '#111318', size: px }), px)
        if (st.act === 'png' && navigator.clipboard && navigator.clipboard.write && W.ClipboardItem && W.isSecureContext) {
          var item = null
          try { item = new W.ClipboardItem({ 'image/png': blobP }) } catch (err) { item = null }
          if (item) return navigator.clipboard.write([item]).then(function () { toast('Copied ' + label + ' PNG (' + px + ' px). Paste it in.') }, function () { return blobP.then(function (bl) { saveBlob(file, bl); toast('PNG downloaded: ' + file) }) })
        }
        return blobP.then(function (bl) { saveBlob(file, bl); toast((st.act === 'png' ? 'Image copying isn’t available here, so we downloaded it: ' : 'Downloaded ') + file) })
      })
    })

    // warm up: preload style data on first interaction, run a pre-filled query
    box.addEventListener('pointerenter', function () { withStyle(st.style, names()) }, { once: true })
    var q0 = box.getAttribute('data-q')
    if (q0) { var tries = 0; (function go() { if (getEngine()) search(q0); else if (tries++ < 40) setTimeout(go, 100) })() }
  }

  /* ───────── migration converter ───────── */
  function initConverter(box) {
    var spec; try { spec = JSON.parse($('script[type="application/json"]', box).textContent) } catch (e) { return }
    var src = $('[data-conv-in]', box), out = $('[data-conv-out]', box), note = $('[data-conv-note]', box)
    var map = spec.map || {}, tokens = spec.tokens || {}
    function resolve(name) {
      if (map[name]) return map[name]
      var e = getEngine(), w = WI()
      if (w && w.has && w.has(name)) return name
      if (e && e.resolve) { var r = e.resolve(name); if (r && r.name) return r.name }
      return null
    }
    function convert(text) {
      var known = 0, unknown = []
      function icon(name) { var r = resolve(name); if (r) { known++; return r } unknown.push(name); return null }
      var res = text
      if (spec.mode === 'class') {
        res = text.replace(/class(Name)?=(["'])([^"']*)\2/g, function (m, jsx, q, val) {
          var toks = val.split(/\s+/).filter(Boolean), outT = [], style = null, hit = false, touched = false
          toks.forEach(function (t) {
            if (Object.prototype.hasOwnProperty.call(tokens, t)) { touched = true; var v = tokens[t]; if (v && v.indexOf('style:') === 0) style = v.slice(6); else if (v) outT.push(v); return }
            var name = null, sfx = null
            for (var i = 0; i < spec.prefixes.length; i++) {
              var pf = spec.prefixes[i], pst = null
              if (Array.isArray(pf)) { pst = pf[1]; pf = pf[0] }
              if (t.indexOf(pf) === 0 && t.length > pf.length) { name = t.slice(pf.length); if (pst && pst !== 'line') style = pst; break }
            }
            if (name == null) { outT.push(t); return }
            touched = true
            ;(spec.suffixes || []).forEach(function (s) { if (name.length > s[0].length && name.slice(-s[0].length) === s[0] && sfx == null) { name = name.slice(0, -s[0].length); sfx = s[1] } })
            if (sfx) style = sfx === 'line' ? style : sfx
            var r = icon(name)
            if (r) { outT.push('with-' + r); hit = true } else outT.push(t)
          })
          if (!touched) return m
          if (hit && outT.indexOf('with') < 0) outT.unshift('with')
          if (style && style !== 'line' && hit) outT.push('with-' + style)
          return 'class' + (jsx || '') + '=' + q + outT.join(' ') + q
        })
      } else if (spec.mode === 'ligature') {
        res = text.replace(/<(span|i)([^>]*)class=(["'])([^"']*material-(?:symbols|icons)[^"']*)\3([^>]*)>\s*([a-z0-9_]+)\s*<\/\1>/g, function (m, tag, a, q, cls, b, lig) {
          var r = icon(lig.replace(/_/g, '-')); if (!r) return m
          var solid = /filled|material-icons(?!-outlined)/.test(cls) && !/outlined|round|sharp/.test(cls) ? ' with-solid' : ''
          return '<i class="with with-' + r + solid + '"' + (a + b).replace(/\s+$/, '') + '></i>'
        })
      } else if (spec.mode === 'webcomponent') {
        res = text.replace(/<ion-icon([^>]*)name=(["'])([a-z0-9-]+)\2([^>]*)>\s*<\/ion-icon>/g, function (m, a, q, nm, b) {
          var v = ''; if (/-outline$/.test(nm)) nm = nm.slice(0, -8); else if (/-sharp$/.test(nm)) nm = nm.slice(0, -6); else v = ' variant="solid"'
          var r = icon(nm); if (!r) return m
          return '<with-icon' + a + 'name="' + r + '"' + v + b + '></with-icon>'
        })
      } else if (spec.mode === 'feather') {
        res = text.replace(/<i([^>]*)data-feather=(["'])([a-z0-9-]+)\2([^>]*)>\s*<\/i>/g, function (m, a, q, nm, b) {
          var r = icon(nm); if (!r) return m
          var rest = (a + b).replace(/\s+/g, ' ').trim()
          var cls = /class=(["'])([^"']*)\1/.exec(rest)
          if (cls) rest = rest.replace(cls[0], '').trim()
          return '<i class="with with-' + r + (cls ? ' ' + cls[2] : '') + '"' + (rest ? ' ' + rest : '') + '></i>'
        }).replace(/\n?\s*<script>\s*feather\.replace\(\)\s*;?\s*<\/script>/g, '')
      } else if (spec.mode === 'iconify') {
        res = text.replace(/<(iconify-icon|Icon)([^>]*)\sicon=(["'])([a-z0-9-]+):([a-z0-9-]+)\3([^>]*?)\s*(\/>|>\s*<\/\1>)/g, function (m, tag, a, q, pre, nm, b) {
          var r = map[pre + ':' + nm] || null
          if (r) known++; else r = icon(nm.replace(/-(outline|line|fill|filled|solid|rounded|sharp|bold|duotone|thin|light)$/, ''))
          if (!r) return m
          var solid = /-(fill|filled|solid)$/.test(nm) ? ' variant="solid"' : ''
          return '<with-icon' + a + ' name="' + r + '"' + solid + b + '></with-icon>'
        })
      } else if (spec.mode === 'component') {
        var renamed = {}
        res = text.replace(spec.importRe ? new RegExp(spec.importRe, 'g') : /$^/, function (m, list, pkg) {
          var items = list.split(',').map(function (s) { return s.trim() }).filter(Boolean).map(function (it) {
            var parts = it.split(/\s+as\s+/), orig = parts[0]
            var base = orig.replace(new RegExp(spec.stripRe || '$^'), '')
            var kebab = base.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').replace(/([a-zA-Z])([0-9])/g, '$1-$2').toLowerCase()
            var r = map[kebab] || null
            if (r) known++; else r = icon(kebab)
            if (!r) return it
            var nn = pascal(r)
            if (!parts[1]) renamed[orig] = nn
            return parts[1] ? nn + ' as ' + parts[1] : nn
          })
          var solid = spec.solidPkg && new RegExp(spec.solidPkg).test(pkg)
          return 'import { ' + items.join(', ') + " } from '@withicons/react" + (solid ? '/solid' : '') + "'"
        })
        Object.keys(renamed).forEach(function (o) { res = res.replace(new RegExp('<(/?)' + o + '\\b', 'g'), '<$1' + renamed[o]) })
      }
      return { text: res, known: known, unknown: unknown }
    }
    function run() {
      var r = convert(src.value)
      out.textContent = r.text
      var msg = r.known + ' icon' + (r.known === 1 ? '' : 's') + ' converted.'
      if (r.unknown.length) msg += ' No match yet for: ' + r.unknown.filter(function (v, i, a) { return a.indexOf(v) === i }).slice(0, 8).map(function (u) { return '<code>' + esc(u) + '</code>' }).join(', ') + '. Search for them above.'
      note.innerHTML = msg
    }
    var t = null
    src.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 120) })
    var copyB = $('[data-conv-copy]', box)
    if (copyB) copyB.addEventListener('click', function () { copyText(out.textContent, 'Converted code copied') })
    var tries = 0; (function go() { if (getEngine() || tries++ > 30) run(); else setTimeout(go, 100) })()
  }

  /* wide tables (the hub matrix) scroll inside their box on small screens: fade the edge that has more, and say so once */
  function initScrollHint(wrap) {
    var hint = null
    function upd() {
      var max = wrap.scrollWidth - wrap.clientWidth, x = wrap.scrollLeft
      var can = max > 4
      wrap.classList.toggle('is-scroll', can)
      wrap.classList.toggle('at-start', x <= 4)
      wrap.classList.toggle('at-end', x >= max - 4)
      if (can && !hint) {
        hint = doc.createElement('p'); hint.className = 'ax-swipe'; hint.setAttribute('aria-hidden', 'true')
        hint.textContent = 'Swipe the table sideways to see every column →'
        wrap.parentNode.insertBefore(hint, wrap)
      }
      if (hint) hint.hidden = !can
    }
    wrap.addEventListener('scroll', upd, { passive: true })
    W.addEventListener('resize', upd)
    upd()
  }

  /* name map: switch the "with icons" column between styles (their real icons stay as they are) */
  function pascal(n) { return n.split('-').map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1) }).join('') }
  function mapCode(mode, n, s) {
    if (mode === 'component') return '<' + pascal(n) + ' />' + (s === 'line' ? '' : ' · /' + s)
    if (mode === 'webcomponent' || mode === 'iconify') return '<with-icon name="' + n + '"' + (s === 'line' ? '' : ' variant="' + s + '"') + '>'
    return 'with-' + n + (s === 'line' ? '' : ' with-' + s)
  }
  function initNameMap(tools) {
    var wrap = tools.nextElementSibling, table = wrap && $('.ax-map', wrap)
    if (!table) return
    var btns = $('[data-map-style]', tools), seq = 0
    function apply(s) {
        var mine = ++seq
        $$('[data-map-code]', table).forEach(function (c) { c.textContent = mapCode(c.getAttribute('data-map-code'), c.getAttribute('data-name'), s) })
        table.setAttribute('data-busy', '')
        withStyle(s, $$('[data-map-ic]', table).map(function (el) { return el.getAttribute('data-map-ic') })).then(function () {
          var w = WI()
          if (mine !== seq || !w || !w.svg) return
          $$('[data-map-ic]', table).forEach(function (el) {
            var svg = w.svg(el.getAttribute('data-map-ic'), s, 24)
            if (svg) el.innerHTML = svg
          })
        }).then(function () { if (mine === seq) table.removeAttribute('data-busy') })
    }
    // the shared compact row when it is here (Essentials and Popular first, then "All N styles"); else the chips
    var seg = $('.ax-map-styles', tools), SP = W.WIStylePicker
    if (seg && SP && SP.row) afterWI(function () {
      var prefer = (seg.getAttribute('data-pick-styles') || '').split(',').filter(Boolean)
      seg.innerHTML = ''
      SP.row(seg, { current: 'line', icon: seg.getAttribute('data-icon') || null, styles: prefer, max: 6, size: 24, label: 'with icons style in the name map', title: 'Show with icons in', onPick: apply })
    })
    if (seg && SP && SP.row) return
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
        apply(b.getAttribute('data-map-style'))
      })
    })
  }

  function init() {
    $$('.ax-map-tools').forEach(initNameMap)
    $$('.ax-compare').forEach(initScrollHint)
    $$('[data-picker]').forEach(initPicker)
    $$('[data-converter]').forEach(initConverter)
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init)
  else init()
})()
