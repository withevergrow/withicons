/* with icons — alternatives & free-icon landers runtime.
   Icon picker (search all 300 via WithSearch, style / colour / click action) and the migration converter.
   Vanilla, no build, works from file://. Runs after site.js (DOMContentLoaded) and degrades to static HTML. */
(function () {
  'use strict'
  var W = window, doc = document
  function $(s, c) { return (c || doc).querySelector(s) }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)) }
  function WI() { return W.WI || W.EG || null }
  function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  var TITLE = { line: 'Line', solid: 'Solid', duo: 'Duo', gloss: 'Gloss', engrave: 'Engrave', blueprint: 'Blueprint', sketch: 'Sketch' }
  var HINT = { svg: 'copy it as SVG', png: 'copy it as a PNG image', dl: 'download a PNG', dlsvg: 'download the SVG file', 'class': 'copy its <i> tag', jsx: 'copy it as JSX for React', vue: 'copy it for a Vue template' }

  var engine = null
  function getEngine() {
    if (engine) return engine
    if (W.WithSearch && W.WITH_SEARCH_INDEX) { try { engine = W.WithSearch.create(W.WITH_SEARCH_INDEX) } catch (e) { engine = null } }
    return engine
  }
  function ready() { var w = WI(); return w && w.loadMeta ? w.loadMeta() : Promise.resolve(false) }
  function withStyle(style) { var w = WI(); return ready().then(function () { return w && w.loadStyle ? w.loadStyle(style) : false }) }
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
      withStyle(st.style).then(function () {
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
    function tile(n) {
      return '<li><button class="ax-tile is-new" type="button" data-name="' + esc(n) + '"><span class="ax-tile-ic"></span><span class="ax-tile-n">' + esc(n) + '</span></button>' +
        '<a class="ax-tile-go" href="' + root + 'icons/' + esc(n) + '.html" aria-label="' + esc(n) + ' icon page"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a></li>'
    }
    function search(q) {
      q = (q || '').trim()
      if (!q) {
        if (mode !== 'curated') { grid.innerHTML = curated; mode = 'curated'; paint() }
        empty.hidden = true; setStatus(); return
      }
      var e = getEngine()
      if (!e) { status.textContent = 'Search is still loading…'; return }
      var hits = e.search(q, { limit: 24 }) || []
      mode = 'search'
      grid.innerHTML = hits.map(function (h) { return tile(h.name) }).join('')
      empty.hidden = !!hits.length
      paint()
      $$('.ax-tile.is-new', grid).forEach(function (b, i) { b.style.setProperty('--i', Math.min(i, 16)); requestAnimationFrame(function () { b.classList.remove('is-new') }) })
      var first = hits[0]
      var why = ''
      if (first && first.match && first.match.field && first.match.field !== 'name' && first.match.term) why = ' “' + esc(q) + '” matched <b>' + esc(first.name) + '</b> by ' + esc(first.match.field) + ' “' + esc(first.match.term) + '”.'
      status.innerHTML = hits.length ? hits.length + ' icon' + (hits.length === 1 ? '' : 's') + ' for “' + esc(q) + '”.' + why + ' Click one to ' + esc(HINT[st.act]) + '.' : 'Nothing for “' + esc(q) + '”.'
    }
    function setStatus() { status.innerHTML = 'Click an icon to <b data-pick-hint>' + esc(HINT[st.act]) + '</b>. The arrow opens its page.' }
    function press(group, btn) { $$(group, box).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false') }) }

    $$('[data-pick-style]', box).forEach(function (b) {
      b.addEventListener('click', function () { st.style = b.getAttribute('data-pick-style'); press('[data-pick-style]', b); box.setAttribute('data-style', st.style); paint() })
    })
    $$('[data-pick-act]', box).forEach(function (b) {
      b.addEventListener('click', function () { st.act = b.getAttribute('data-pick-act'); press('[data-pick-act]', b); if (mode === 'curated' || !input.value.trim()) setStatus(); else search(input.value) })
    })
    $$('[data-pick-color]', box).forEach(function (b) {
      b.addEventListener('click', function () { st.color = b.getAttribute('data-pick-color'); st.colorSet = true; press('[data-pick-color]', b); paint() })
    })
    var custom = $('[data-pick-custom]', box)
    if (custom) custom.addEventListener('input', function () { st.color = custom.value; st.colorSet = true; press('[data-pick-color]', null); paint() })
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
      withStyle(st.style).then(function () {
        var color = st.colorSet ? st.color : null
        var label = n + ' · ' + TITLE[st.style]
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
    box.addEventListener('pointerenter', function () { withStyle(st.style) }, { once: true })
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

  function init() {
    $$('.ax-compare').forEach(initScrollHint)
    $$('[data-picker]').forEach(initPicker)
    $$('[data-converter]').forEach(initConverter)
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init)
  else init()
})()
