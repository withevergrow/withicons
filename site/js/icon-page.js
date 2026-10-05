/* with icons — generated icon pages (icons/<name>.html) and hubs (categories/, styles/).
   The hero (pick a style, one Download, Copy, Customize), the studio sheet (a modal <dialog> that holds the live editor,
   js/editor.js WI.Editor.mount, with two modes: Customize and Download), the "Make it yours" entry, the floating
   "On this page" map, the hero's animated stage, drag-out and the developer tabs.
   Nothing heavy loads up front: the studio (css/editor.css, vendor/motion/*, js/palette-map.js, this icon's palettes,
   js/editor.js) is fetched when the page goes idle or the visitor reaches for it; download formats (js/export/*) load
   on the first download. Everything reads fine without JS (the map is a plain <details>, the studio a <noscript> note). */
(function () {
  'use strict'
  var D = document, W = window
  var $ = function (s, r) { return (r || D).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)) }
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  var reducedMq = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false }
  var reduced = function () { return reducedMq.matches }
  var INK = '#111318'
  var store = function (k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)) } catch (e) { return null } }
  // the site root, from this script's own address (works from file://, S3 and any sub-path)
  var BASE = (function () { var s = D.currentScript && D.currentScript.src; return s ? s.replace(/js\/icon-page\.js(\?.*)?$/, '') : '../' })()

  function toast(msg) {
    if (W.WI && W.WI.toast) { W.WI.toast(msg); return }
    var t = $('.ip-toast'); if (!t) { t = D.createElement('div'); t.className = 'ip-toast'; t.setAttribute('role', 'status'); D.body.appendChild(t) }
    t.textContent = msg; t.classList.add('is-on'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('is-on') }, 2600)
  }
  function copyText(text) {
    if (navigator.clipboard && W.isSecureContext) return navigator.clipboard.writeText(text).then(function () { return true }, legacy)
    return Promise.resolve(legacy())
    function legacy() {
      var ta = D.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'; D.body.appendChild(ta); ta.select()
      var ok = false; try { ok = D.execCommand('copy') } catch (e) { } ta.remove(); return ok
    }
  }

  /* ───────── code blocks + developer tabs (icon pages and hubs) ───────── */
  D.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-ip-copy]'); if (!b) return
    var el = $(b.getAttribute('data-ip-copy')); if (!el) return
    copyText(el.textContent).then(function (ok) {
      var l = $('span', b); b.classList.add('is-done'); if (l) l.textContent = ok ? 'Copied' : 'Press Ctrl+C'
      setTimeout(function () { b.classList.remove('is-done'); if (l) l.textContent = 'Copy' }, 1500)
    })
  })
  var tabs = $$('.ip-tabs [role="tab"]')
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1
      var p = D.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on
    })
    if (focus) t.focus()
    try { localStorage.setItem('with-ip-tab', t.getAttribute('data-tab')) } catch (e) { }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t) })
    t.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
      if (k) { e.preventDefault(); selectTab(tabs[(i + k + tabs.length) % tabs.length], true) }
      else if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0], true) } else if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1], true) }
    })
  })
  try { var saved = localStorage.getItem('with-ip-tab'); var st0 = saved && $('.ip-tabs [data-tab="' + saved + '"]'); if (st0) selectTab(st0) } catch (e) { }
  function openDev() { if (/^#(developers|use-)/.test(location.hash)) { var dv = $('.ip-dev'); if (dv) dv.open = true } }
  openDev()

  /* ───────── icon page ───────── */
  var dataEl = $('#ip-data'), root = $('[data-ip]')
  if (!dataEl || !root) return
  var DATA; try { DATA = JSON.parse(dataEl.textContent) } catch (e) { return }
  // each style's markup lives once in the page, in the <symbol>s the previews <use>
  Object.keys(DATA.styles).forEach(function (s) { var sym = D.getElementById('s-' + s); if (sym && DATA.styles[s].inner == null) DATA.styles[s].inner = sym.innerHTML })
  var qsStyle = null
  try { qsStyle = new URLSearchParams(location.search).get('style'); if (!DATA.styles[qsStyle]) qsStyle = null } catch (e) { }

  // until the studio is here, the hero wears what the visitor chose last time (the studio's own memory), so nothing jumps
  var mem = store('with-editor-v1') || {}
  var S = {
    style: qsStyle || (DATA.styles[mem.style] ? mem.style : root.getAttribute('data-style')),
    color: typeof mem.color === 'string' && (mem.color === 'ink' || mem.color === 'style' || /^#[0-9a-f]{6}$/i.test(mem.color)) ? mem.color : 'ink',
    px: [64, 128, 256, 512, 1024].indexOf(mem.px) >= 0 ? mem.px : 256, size: +mem.size >= 12 && +mem.size <= 128 ? +mem.size : 24,
    anim: /^(none|loop|hover|once)$/.test(mem.anim) ? mem.anim : 'loop', colorName: 'black'
  }
  if (S.color !== 'ink') S.colorName = S.color === 'style' ? (DATA.styles[S.style].title + ' colour').toLowerCase() : S.color.toUpperCase()
  var Editor = null, ed = null

  /* ───────── the studio, loaded on demand ───────── */
  var loaded = {}
  function loadJs(src) {
    return loaded[src] || (loaded[src] = new Promise(function (ok) {
      var s = D.createElement('script'); s.src = src; s.async = false   // in order, but never blocking
      s.onload = function () { ok(true) }; s.onerror = function () { ok(false) }; D.head.appendChild(s)
    }))
  }
  function loadCss(href) {
    return loaded[href] || (loaded[href] = new Promise(function (ok) {
      var l = D.createElement('link'); l.rel = 'stylesheet'; l.href = href
      l.onload = function () { ok(true) }; l.onerror = function () { ok(false) }; D.head.appendChild(l)
    }))
  }
  var studioP = null
  function loadStudio() {
    if (studioP) return studioP
    var css = Promise.all([loadCss(BASE + 'css/editor.css'), loadCss(BASE + 'vendor/motion/motion.css')])
    var js = [loadJs(BASE + 'vendor/motion/motion.js'), loadJs(BASE + 'js/palette-map.js')]
    if (root.hasAttribute('data-palettes')) js.push(loadJs(BASE + 'data/palettes/' + DATA.name + '.js'))
    js.push(loadJs(BASE + 'js/editor.js'))
    studioP = Promise.all(js.concat([css])).then(function () {
      Editor = (W.WI && W.WI.Editor) || W.WithEditor || null
      if (!Editor) throw new Error('studio')
      mountStudio()
      return ed
    })
    studioP.catch(function () { studioP = null; var w = $('[data-sheet-wait]'); if (w) w.textContent = 'The studio didn’t load. Check your connection and try again.' })
    return studioP
  }
  var host = $('[data-editor]')
  function mountStudio() {
    if (ed || !Editor || !host) return
    ed = Editor.mount(host, {
      name: DATA.name, title: DATA.title, data: DATA, motion: DATA.motion || (W.WITH_MOTION && W.WITH_MOTION[DATA.name]) || null,
      style: S.style, placements: $('[data-placements]'), layers: true, codeFold: true, dlQuick: false,
      onChange: function (st) { S = st; paint() }
    })
    S = ed.get()
    root.classList.add('has-studio')
    // the Download mode's panel has no quick row: the hero and the "what is it for" list already are that
    paint()
    if (sheetOpen) afterOpen(true)
    stageMotion()
    if (pendingPlay) { pendingPlay = false; setTimeout(playOnce, 120) }
  }
  // warm it: when the page is idle, or as soon as the visitor reaches for anything that needs it
  function warm() { loadStudio() }
  if (W.requestIdleCallback) W.addEventListener('load', function () { W.requestIdleCallback(warm, { timeout: 2500 }) })
  else W.addEventListener('load', function () { setTimeout(warm, 1200) })
  $$('[data-actions], .ip-pick, [data-open], [data-stage], .ip-make').forEach(function (el) {
    el.addEventListener('pointerenter', warm, { once: true }); el.addEventListener('focusin', warm, { once: true }); el.addEventListener('touchstart', warm, { once: true, passive: true })
  })
  // (scrolling near the studio's sections warms it too, but only after the page has loaded, so it never competes with
  // the first paint's fonts and images on a tall screen where those sections start in view)
  if (W.IntersectionObserver) W.addEventListener('load', function () {
    var near = new IntersectionObserver(function (es) { if (es.some(function (x) { return x.isIntersecting })) { warm(); near.disconnect() } }, { rootMargin: '900px 0px' })
    $$('[data-placements], #customize').forEach(function (el) { near.observe(el) })
  })

  /* fallbacks while (or if) the studio is not here */
  function hexOf(st) { return S.color === 'ink' ? INK : S.color === 'style' ? DATA.styles[st].hex : (/^#[0-9a-f]{6}$/i.test(S.color) ? S.color : INK) }
  function fileSvg(st, px) {
    if (ed) return ed.svgText('file', st, px)
    var s = DATA.styles[st], c = hexOf(st)
    var attrs = Object.keys(s.root).map(function (k) { return ' ' + k + '="' + esc(String(s.root[k]).replace(/currentColor/g, c)) + '"' }).join('')
    var inner = s.inner.replace(/var\(--[\w-]+,\s*([^()]*?)\)/g, '$1').replace(/currentColor/g, c)
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + px + '" height="' + px + '" viewBox="0 0 24 24"' + attrs + '>' + inner + '</svg>'
  }
  function fname(st, ext, px) { return DATA.name + (st === 'line' ? '' : '-' + st) + (px ? '-' + px : '') + '.' + ext }
  function saveBlob(blob, name) { var u = URL.createObjectURL(blob), a = D.createElement('a'); a.href = u; a.download = name; D.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u) }, 4000) }
  // custom colours of a multi-colour style ride along as CSS variables (they need the small runtime: CSS-only icons can't see them)
  function colorCss(st) { return ed && st === S.style && S.colors && S.colors.custom ? S.colors.css : '' }
  function tagText(st) { var c = colorCss(st); return '<i class="with with-' + DATA.name + (st === 'line' ? '' : ' with-' + st) + '"' + (c ? ' style="' + c + '"' : '') + '></i>' }
  function cssText(st) {
    var base = DATA.cdn || 'https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/'
    // with-loader.js links only the CSS of the icons on the page (any style mix); custom colours need the inline-SVG runtime
    return '<script src="' + base + (colorCss(st) ? 'with-icons.js' : 'with-loader.js') + '" defer></script>'
  }
  function nowrapTokens(t) { return t.split(' ').map(function (w) { return '<span class="nw">' + esc(w) + '</span>' }).join(' ') }
  function busy(b, on) { if (!b) return; b.classList.toggle('is-busy', !!on); if (on) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy') }

  function act(kind, st, btn) {
    st = st || S.style
    if (kind === 'copy-tag') {
      var tb = $('.ip-tag-btn', root)
      return copyText(tagText(st)).then(function (ok) {
        toast(ok ? 'Copied ' + tagText(st) + ' — paste it into your HTML.' : 'Couldn’t reach the clipboard.')
        var gl = tb && $('.ip-tag-go span', tb)
        if (ok && tb) { tb.classList.add('is-done'); if (gl) gl.textContent = 'Copied'; clearTimeout(tb._t); tb._t = setTimeout(function () { tb.classList.remove('is-done'); if (gl) gl.textContent = 'Copy' }, 1600) }
      })
    }
    if (kind === 'copy-css') return copyText(cssText(st)).then(function (ok) { toast(ok ? 'Copied the setup line. Add it once inside <head>.' : 'Couldn’t reach the clipboard.') })
    if (ed) return run(kind, st)
    // the studio is still on its way. An image copy must start inside the click (the clipboard wants the gesture), so it
    // hands the clipboard a promise of the PNG; everything else waits for the studio, with the plain SVG as the fallback
    if (kind === 'copy-img' && W.ClipboardItem && navigator.clipboard && navigator.clipboard.write && W.isSecureContext) {
      busy(btn, true)
      var px = Math.max(S.px, 256)
      var blob = loadStudio().then(function () { return ed.actions.png(st, px) }).then(function (r) { return r.blob })
      return navigator.clipboard.write([new W.ClipboardItem({ 'image/png': blob })]).then(function () { toast('Copied ' + DATA.title + ' as an image. Paste it into Slides, Docs or Notion.') },
        function () { return copyText(fileSvg(st, 24)).then(function (ok) { toast(ok ? 'Image copy was blocked, so we copied the SVG code instead.' : 'Couldn’t reach the clipboard.') }) }).then(function () { busy(btn, false) })
    }
    busy(btn, true)
    return loadStudio().then(function () { busy(btn, false); return run(kind, st) }, function () {
      busy(btn, false)
      if (kind === 'svg') { saveBlob(new Blob([fileSvg(st, 24)], { type: 'image/svg+xml' }), fname(st, 'svg')); return toast('Downloaded ' + fname(st, 'svg')) }
      return copyText(fileSvg(st, 24)).then(function (ok) { toast(ok ? 'Copied ' + DATA.title + ' as SVG code.' : 'Couldn’t reach the clipboard.') })
    })
  }
  function run(kind, st) {
    // a style card's buttons act on that style without changing the visitor's pick
    if (kind === 'svg') return ed.actions.downloadSvg(st)
    if (kind === 'png') return ed.actions.downloadPng(st)
    if (kind === 'copy-img') return ed.actions.copyImage(st)
    if (kind === 'copy-svg') return ed.actions.copySvg(st)
  }

  /* ───────── the hero, the entry card and the sheet mirror the studio's state ───────── */
  var picks = $$('[data-pick]')
  var lastStyle = null
  // multi-colour styles wear their own colours (or a palette); one-colour styles one colour
  function multi() { return S.colors ? !!S.colors.multi : /var\(\s*--with-/.test(DATA.styles[S.style].inner || '') }
  function colourWord() { return multi() ? (S.colors && S.colors.custom ? S.colorName || 'your colours' : 'own colours') : (S.colorName || 'black') }
  function motionWord() {
    if (S.swap && S.swap.title) return 'Turns into ' + S.swap.title.toLowerCase()
    if (S.anim === 'none') return 'Still'
    var m = S.motion && S.motion.preset, P = Editor && Editor.PRESETS, lab = m && P && P[m] ? P[m].label : 'Moving'
    return lab + (S.anim === 'hover' ? ' on hover' : S.anim === 'once' ? ' once' : '')
  }
  function paint() {
    var s = DATA.styles[S.style]; if (!s) return
    var changed = lastStyle !== null && lastStyle !== S.style
    lastStyle = S.style
    root.setAttribute('data-style', S.style)
    D.body.className = D.body.className.replace(/\bs-[a-z]+\b/g, '').trim() + ' s-' + S.style
    ;[root, sheet].forEach(function (el) {
      if (!el) return
      el.style.setProperty('--sc', 'var(--c-' + S.style + ', ' + s.hex + ')')
      el.style.setProperty('--sc-on', 'var(--c-' + S.style + '-on, ' + (s.on || '#FFFFFF') + ')')
      el.style.setProperty('--ic', S.colors && S.colors.ink ? S.colors.ink : S.color === 'ink' ? 'var(--ink)' : (S.hex || hexOf(S.style)))
    })
    // the hero (stage, sizes, style cards) wears the studio's colours: the current style's CSS variables on the page root
    ;(root._cv || []).forEach(function (k) { root.style.removeProperty(k); if (sheet) sheet.style.removeProperty(k) })
    // (a palette's roles carry across styles, so every style card shows, and downloads, the same palette)
    var cv = {}
    if (ed && ed.colorsFor) Object.keys(DATA.styles).forEach(function (st) { var cz = ed.colorsFor(st); if (cz) for (var k in cz.vars) cv[k] = cz.vars[k] })
    root._cv = Object.keys(cv)
    root._cv.forEach(function (k) { root.style.setProperty(k, cv[k]); if (sheet) sheet.style.setProperty(k, cv[k]) })
    $$('svg[data-root]').forEach(function (svg) {
      ;['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].forEach(function (k) { if (s.root[k] == null) svg.removeAttribute(k); else svg.setAttribute(k, s.root[k]) })
      if (S.stroke != null && s.root['stroke-width'] != null) svg.setAttribute('stroke-width', S.stroke)
      var u = $('use', svg); if (u) u.setAttribute('href', '#s-' + S.style)
    })
    // the big stage icon is inline (not <use>) so the draw preset can reach its strokes
    var big = $('.ip-stage-art svg', root); if (big && s.inner != null) big.innerHTML = s.inner
    picks.forEach(function (b) { var on = b.getAttribute('data-pick') === S.style; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1 })
    $$('[data-px-label]').forEach(function (l) { l.textContent = S.px + ' px' })
    $$('[data-color-label]').forEach(function (c) { c.textContent = colourWord() })
    var pn = $('[data-pick-name]', root); if (pn) pn.textContent = s.title
    var ps = $('[data-pick-say]', root); if (ps && s.say) ps.textContent = s.say
    var tc = $('[data-tag-code]', root); if (tc) tc.innerHTML = nowrapTokens(tagText(S.style))
    var cc = $('[data-tag-css]', root); if (cc) cc.textContent = cssText(S.style)
    root.classList.toggle('is-white', S.color === '#FFFFFF')
    // "Make it yours": the current choices at a glance
    var dot = $('[data-now-dot]'); if (dot) dot.style.background = multi() ? (S.colors && S.colors.custom && S.colors.main ? S.colors.main : s.hex) : S.color === 'ink' ? INK : (S.hex || hexOf(S.style))
    var ns = $('[data-now-style]'); if (ns) ns.textContent = s.title
    var nz = $('[data-now-size]'); if (nz) nz.textContent = S.size + ' px'
    var nm = $('[data-now-motion]'); if (nm) nm.textContent = motionWord()
    var sn = $('[data-sheet-now]'); if (sn) sn.textContent = s.title + ' · ' + colourWord() + ' · ' + motionWord().toLowerCase()
    sheetFoot()
    miniMotion()
    askAI()
    stageMotion()
    if (changed && !reduced()) {
      var art = $('.ip-stage-art', root)
      if (art && art.animate) art.animate([{ transform: 'scale(.7) rotate(-10deg)', opacity: 0.2 }, { transform: 'scale(1.06) rotate(2deg)', opacity: 1, offset: 0.6 }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' })
      $$('.ip-sizes figure', root).forEach(function (f, i) { if (f.animate) f.animate([{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, delay: 60 + i * 50, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }) })
      var mini = $('[data-mini]'); if (mini && mini.animate) mini.animate([{ transform: 'scale(.86)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' })
    }
  }
  picks.forEach(function (b, i) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-pick')
      if (ed) ed.set({ style: v }); else { S.style = v; paint(); loadStudio().then(function () { if (S.style !== v) ed.set({ style: v }) }) }
    })
    b.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      if (k) { e.preventDefault(); var n = picks[(i + k + picks.length) % picks.length]; n.focus(); n.click() }
    })
  })
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !root.contains(b) || (host && host.contains(b))) return
    if (b.hasAttribute('data-act')) act(b.getAttribute('data-act'), b.getAttribute('data-style'), b)
  })

  /* ───────── the stage: the icon's own motion (forge/motion spec) ───────── */
  var mo = $('[data-mo]', root), intentBtn = $('[data-intent]', root), looping = false, pendingPlay = false
  function stroked() { var r = DATA.styles[S.style].root; return !!(r.stroke && r.stroke !== 'none') }
  function stageMotion() {
    if (!mo || !Editor || !DATA.motion) return
    var e = looping ? DATA.motion.loop : DATA.motion.hover
    var a = Editor.motionAttrs(e, { trigger: looping ? 'loop' : 'hover', stroked: stroked() })
    if (!a) return
    mo.className = 'ip-mo ' + a.cls + (looping ? ' wm-force' : '')
    mo.setAttribute('style', a.style)
    if (Editor.prepareDraw) Editor.prepareDraw(mo.parentNode)
  }
  // the entry card's mini preview moves the way the studio is set (hover the card to see a hover move)
  function miniMotion() {
    var m = $('[data-mini-mo]'); if (!m || !Editor || !ed) return
    var a = S.anim === 'none' ? null : ed.motionInfo(S.anim === 'once' ? 'hover' : S.anim)
    var key = a ? a.cls + a.style : ''
    if (m._k === key) return
    m._k = key
    m.className = 'ip-mo' + (a ? ' ' + a.cls : '')
    if (a && a.style) m.setAttribute('style', a.style); else m.removeAttribute('style')
    if (a && Editor.prepareDraw) Editor.prepareDraw(m.parentNode)
  }
  function playOnce() {
    if (!mo || !DATA.motion || reduced() || looping) return
    if (!Editor) { pendingPlay = true; return }
    var a = Editor.motionAttrs(DATA.motion.hover, { trigger: 'once', stroked: stroked() })
    if (!a) return
    mo.className = 'ip-mo ' + a.cls; mo.setAttribute('style', a.style)
    if (Editor.prepareDraw) Editor.prepareDraw(mo.parentNode)
    setTimeout(stageMotion, a.dur * 1000 + 60)
  }
  if (intentBtn) {
    intentBtn.addEventListener('click', function () {
      looping = !looping
      intentBtn.setAttribute('aria-pressed', looping ? 'true' : 'false')
      var b = $('[data-intent-b]', intentBtn); if (b) b.textContent = looping ? 'Pause animation' : 'Play animation'
      if (Editor) stageMotion(); else loadStudio().then(stageMotion)
    })
  }
  if (mo && W.IntersectionObserver) {
    var played = false
    new IntersectionObserver(function (es, ob) { es.forEach(function (en) { if (en.isIntersecting && !played) { played = true; setTimeout(playOnce, 450); ob.disconnect() } }) }, { threshold: 0.5 }).observe(mo)
  }

  /* ───────── Ask-AI task widget follows the chosen style ───────── */
  function askAI() {
    var nm = $('[data-ask-style-name]', root); if (nm) nm.textContent = DATA.styles[S.style].title
    var A = W.WI && W.WI.askAI
    if (!A) return
    $$('[data-ask-ai][data-icon]').forEach(function (el) {
      el.setAttribute('data-style', S.style)
      try { if (el.__askAI) A.update(el, { style: S.style }); else A.render(el, { icon: DATA.name, style: S.style, mode: 'tasks' }) } catch (e) { }
    })
    askDemo()
  }
  function askDemo(intent) {
    var q = $('[data-ask-demo-q]'), an = $('[data-ask-demo-a]')
    if (!q || !an) return
    if (!intent) { var on = $('.ip-ask-widget .ask-task[aria-checked="true"]'); intent = on ? on.getAttribute('data-ask-intent') : 'set' }
    var n = DATA.name, st = DATA.styles[S.style].title
    var rel = (DATA.related || []).map(function (r) { return r.name }).slice(0, 3)
    var T = {
      code: ['Code ' + n + ' into my React button', 'Here’s <b>' + esc(n) + '</b> at 20px with <i>aria-label</i>, a tooltip, and hover, focus and disabled states…'],
      set: ['What goes with ' + n + ' on my screen?', 'Use these with <b>' + esc(n) + '</b>, all in ' + esc(st) + ': ' + rel.map(function (r) { return '<b>' + esc(r) + '</b>' }).join(', ') + '… here’s why each belongs.'],
      fit: ['Is ' + n + ' right for my meaning?', 'It depends on your users. Here’s how most people read <b>' + esc(n) + '</b>, and two clearer options if you need them…'],
      slides: ['How do I put ' + n + ' on my Google Slides?', 'Press <i>Copy image</i> on its page, paste onto the slide, then drag a corner to resize…']
    }[intent] || null
    if (!T) return
    q.textContent = T[0]; an.innerHTML = T[1]
  }
  D.addEventListener('askai:intent', function (e) { if (e.target.closest && e.target.closest('.ip-ask-widget')) askDemo(e.detail && e.detail.intent) })
  function jumpTo(sel, focusSel) {
    var sec = $(sel); if (!sec) return false
    sec.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
    var t = focusSel && $(focusSel)
    if (t) setTimeout(function () { t.focus({ preventScroll: true }) }, reduced() ? 0 : 450)
    if (history.replaceState) history.replaceState(null, '', sel)
    return true
  }
  $$('[data-ask-jump]').forEach(function (a) { a.addEventListener('click', function (e) { if (jumpTo('#ask-ai', '.ip-ask-widget .ask-task[aria-checked="true"], .ip-ask-widget .ask-task')) e.preventDefault() }) })

  /* ───────── drag the big preview out: PNG (Chrome/Edge), image HTML for apps, SVG text as fallback ───────── */
  var drag = $('[data-drag]', root), dragPng = null
  if (drag) {
    drag.addEventListener('pointerenter', function () { loadStudio().then(function () { return ed.actions.png(S.style, S.px) }).then(function (r) { dragPng = r }, function () { }) })
    drag.addEventListener('dragstart', function (e) {
      var dt = e.dataTransfer, svg = fileSvg(S.style, S.px), svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
      var r = dragPng
      dt.effectAllowed = 'copy'
      try { dt.setData('DownloadURL', r && r.dataUrl ? 'image/png:' + fname(S.style, 'png', S.px) + ':' + r.dataUrl : 'image/svg+xml:' + fname(S.style, 'svg') + ':' + svgUrl) } catch (err) { }
      var src = r && r.dataUrl ? r.dataUrl : svgUrl
      dt.setData('text/uri-list', src)
      dt.setData('text/html', '<img src="' + src + '" width="' + S.px + '" height="' + S.px + '" alt="' + esc(DATA.title) + ' icon">')
      dt.setData('text/plain', svg)
    })
  }

  /* ═════════ the studio sheet: one modal <dialog>, two modes (Customize · Download) ═════════
     Desktop: a large card that grows out of the button that opened it (a clip-path reveal, spring-eased) and shrinks back
     into it. Phones: a bottom sheet that slides up and can be dragged down to close. Focus is trapped by the dialog,
     Esc closes it, focus returns to the opener. Reduced motion: a short fade. */
  var sheet = $('[data-sheet]'), sheetIn = sheet && $('.ip-sheet-in', sheet), body = sheet && $('[data-sheet-body]', sheet)
  var sheetOpen = false, mode = 'customize', opener = null, want = { tab: '', goal: '' }
  var phone = W.matchMedia ? W.matchMedia('(max-width: 720px)') : { matches: false }
  var EASE = 'cubic-bezier(.22,1,.36,1)', SPRING = 'cubic-bezier(.34,1.3,.64,1)'
  function visible(el) { if (!el || !el.getBoundingClientRect) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < (W.innerHeight || 800) }
  function insetFrom(el) {
    var a = el.getBoundingClientRect(), b = sheetIn.getBoundingClientRect()
    return 'inset(' + Math.max(0, a.top - b.top) + 'px ' + Math.max(0, b.right - a.right) + 'px ' + Math.max(0, b.bottom - a.bottom) + 'px ' + Math.max(0, a.left - b.left) + 'px round 22px)'
  }
  // toasts live outside the top layer: while the sheet is open they move inside it so they stay on top
  var floaters = null
  function adoptFloaters(on) {
    var pick = function () { return $$('body > .toast, body > .wied-toast, body > .ip-toast') }
    if (on) { pick().forEach(function (t) { sheet.appendChild(t) }); if (W.MutationObserver) { floaters = new MutationObserver(function () { pick().forEach(function (t) { sheet.appendChild(t) }) }); floaters.observe(D.body, { childList: true }) } }
    else { if (floaters) floaters.disconnect(); floaters = null; $$('.toast, .wied-toast, .ip-toast', sheet).forEach(function (t) { D.body.appendChild(t) }) }
  }
  function setMode(m, focus) {
    mode = m === 'download' ? 'download' : 'customize'
    if (!sheet) return
    body.setAttribute('data-mode', mode)
    body.setAttribute('aria-labelledby', 'ip-mode-' + mode)
    $$('[data-mode]', $('.ip-sheet-modes', sheet)).forEach(function (b) { var on = b.getAttribute('data-mode') === mode; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus() })
    modeInk()
    sheetFoot()
    if (ed) {
      // the view that just appeared: re-measure its tab ink, and let the download panel fetch its formats
      if (mode === 'customize') ed.tab(ed.get().tab || 'look')
      else if (ed.loadExports) ed.loadExports()
    }
    body.scrollTop = 0
    if (!reduced() && sheetOpen) {
      var v = $(mode === 'customize' ? '.wied-main' : '.wied-out', body)
      if (v && v.animate) v.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: EASE })
    }
  }
  function modeInk() {
    var on = sheet && $('.ip-sheet-modes [aria-selected="true"]', sheet), ink = sheet && $('.ip-sheet-ink', sheet)
    if (on && ink && on.offsetWidth) { ink.style.width = on.offsetWidth + 'px'; ink.style.transform = 'translateX(' + on.offsetLeft + 'px)' }
  }
  var goSeen = null, goIO = null, goNear = false
  function sheetFoot() {
    if (!sheet) return
    var nx = $('[data-sheet-next]', sheet), sum = $('[data-sheet-sum]', sheet)
    // phones, Download mode: the panel's own Download button sits below the fold, so the footer carries it (the mode tabs
    // up top still lead back to Customize)
    var gol = mode === 'download' && phone.matches && body && $('[data-dl-gol]', body)
    if (nx) {
      nx.classList.toggle('is-ink', !!gol); nx.toggleAttribute('data-proxy', !!gol)
      nx.innerHTML = gol ? DOWN + '<span>' + esc(gol.textContent) + '</span>' : mode === 'customize' ? '<span>Download</span>' + ARR : ARR_L + '<span>Customize</span>'
      var go = gol && $('[data-dl-go]', body)
      nx.disabled = !!(go && (go.disabled || go.getAttribute('aria-disabled') === 'true'))
      if (!gol) nx.disabled = false
      // ...but not while the panel's own button is already on screen
      if (go && W.IntersectionObserver && go !== goSeen) { goSeen = go; if (goIO) goIO.disconnect(); goIO = new IntersectionObserver(function (es) { goNear = es[es.length - 1].isIntersecting; var n = $('[data-sheet-next]', sheet); if (n) n.classList.toggle('is-near', goNear && n.hasAttribute('data-proxy')) }, { root: body, threshold: 0.6 }); goIO.observe(go) }
      nx.classList.toggle('is-near', !!gol && goNear)
    }
    var dn = $('.ip-sheet-acts [data-close]', sheet); if (dn) dn.classList.toggle('is-ink', !gol)
    if (sum) {
      var s = DATA.styles[S.style] || {}
      sum.innerHTML = mode === 'customize'
        ? '<b>' + esc(s.title || '') + '</b> · ' + esc(colourWord()) +' · ' + S.size + ' px · ' + esc(motionWord().toLowerCase())
        : 'Every file is made here, in your browser, in your style and colours.'
    }
  }
  var ARR = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12 H19 M13 6 L19 12 L13 18"/></svg>'
  var DOWN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 4 V15 M7 10 L12 15 L17 10 M5 20 H19"/></svg>'
  var ARR_L = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 12 H5 M11 6 L5 12 L11 18"/></svg>'
  // after the sheet is open (and again once the studio has mounted inside it): the asked-for tab, group and focus
  function afterOpen(mountedLate) {
    if (!ed) return
    if (want.tab) ed.tab(want.tab); else ed.tab(ed.get().tab || 'look')
    if (want.goal) { var p = ed.downloads && ed.downloads()[0]; if (p && p.select) p.select(want.goal) }
    if (mode === 'download' && ed.loadExports) ed.loadExports()
    if (mountedLate && !reduced()) { var v = $(mode === 'customize' ? '.wied-main' : '.wied-out', body); if (v && v.animate) v.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: EASE }) }
    var f = mode === 'download' ? ($('.wdl-g[aria-selected="true"]', body) || $('.wdl-g', body)) : $('.wied-tabs [aria-selected="true"]', body)
    if (f && (want.focus || mountedLate)) setTimeout(function () { try { f.focus({ preventScroll: true }) } catch (e) { } }, reduced() ? 0 : 80)
    want = { tab: '', goal: '' }
  }
  function openSheet(m, o) {
    if (!sheet || !sheet.showModal) return false
    o = o || {}
    want = { tab: o.tab || '', goal: o.goal || '', focus: true }
    opener = o.from || D.activeElement
    setMode(m)
    if (sheetOpen) { afterOpen(false); return true }
    sheetOpen = true
    D.documentElement.classList.add('ip-locked')
    sheet.classList.remove('is-closing')
    sheet.showModal()
    adoptFloaters(true)
    modeInk()
    loadStudio().then(function () { if (sheetOpen) afterOpen(false) }, function () { })
    // the entrance
    if (sheetIn.animate) {
      if (reduced()) sheetIn.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 })
      else if (phone.matches) sheetIn.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 520, easing: EASE })
      else if (opener && visible(opener) && opener !== D.body) {
        sheetIn.animate([{ clipPath: insetFrom(opener), opacity: 0.6 }, { opacity: 1, offset: 0.35 }, { clipPath: 'inset(0px 0px 0px 0px round 28px)', opacity: 1 }], { duration: 640, easing: EASE })
        var kids = $$('.ip-sheet-head, .ip-sheet-body, .ip-sheet-foot', sheetIn)
        kids.forEach(function (k, i) { if (k.animate) k.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: 120 + i * 60, easing: SPRING, fill: 'backwards' }) })
      } else sheetIn.animate([{ opacity: 0, transform: 'translateY(24px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 460, easing: EASE })
    }
    if (location.hash !== '#download' && m === 'download' && o.hash !== false && history.replaceState) history.replaceState(null, '', '#download')
    return true
  }
  function closeSheet() {
    if (!sheetOpen) return
    sheetOpen = false
    var done = function () {
      sheet.classList.remove('is-closing'); adoptFloaters(false)
      if (sheet.open) sheet.close()
      D.documentElement.classList.remove('ip-locked')
      sheetIn.style.transform = ''
      if (opener && opener.focus && D.contains(opener)) try { opener.focus({ preventScroll: true }) } catch (e) { }
      if (location.hash === '#download' && history.replaceState) history.replaceState(null, '', location.pathname + location.search)
    }
    sheet.classList.add('is-closing')
    if (!sheetIn.animate) return done()
    var a
    if (reduced()) a = sheetIn.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' })
    else if (phone.matches) a = sheetIn.animate([{ transform: sheetIn.style.transform || 'none' }, { transform: 'translateY(100%)' }], { duration: 320, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' })
    else if (opener && visible(opener)) a = sheetIn.animate([{ clipPath: 'inset(0px 0px 0px 0px round 28px)', opacity: 1 }, { opacity: 1, offset: 0.7 }, { clipPath: insetFrom(opener), opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' })
    else a = sheetIn.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(16px) scale(.98)' }], { duration: 240, easing: 'ease-in', fill: 'forwards' })
    a.onfinish = function () { done(); a.cancel() }
  }
  if (sheet) {
    sheet.addEventListener('cancel', function (e) { e.preventDefault(); closeSheet() })
    // a press on the backdrop (the dialog box itself, outside its card) closes it
    sheet.addEventListener('pointerdown', function (e) { if (e.target === sheet) sheet._down = true })
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet && sheet._down) closeSheet()
      sheet._down = false
      var b = e.target.closest('button'); if (!b || !sheet.contains(b)) return
      if (b.hasAttribute('data-close')) closeSheet()
      else if (b.hasAttribute('data-mode')) setMode(b.getAttribute('data-mode'))
      else if (b.hasAttribute('data-proxy')) { var go = $('[data-dl-go]', body); if (go) { go.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); go.focus({ preventScroll: true }); go.click() } }
      else if (b.hasAttribute('data-sheet-next')) { setMode(mode === 'customize' ? 'download' : 'customize'); afterOpen(false) }
    })
    $('.ip-sheet-modes', sheet).addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return
      e.preventDefault(); setMode(e.key === 'ArrowRight' || e.key === 'End' ? 'download' : 'customize', true)
    })
    W.addEventListener('resize', function () { if (sheetOpen) { modeInk(); sheetFoot() } })
    // the footer's phone Download button follows the panel's own (its format, and 'Making your GIF…' while busy)
    if (W.MutationObserver) { var footQ = 0; new MutationObserver(function () { if (footQ || !sheetOpen || mode !== 'download' || !phone.matches) return; footQ = requestAnimationFrame(function () { footQ = 0; sheetFoot() }) }).observe(body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-disabled', 'disabled'] }) }
    // phones: drag the header down to close
    var dragH = $('[data-sheet-drag]', sheet), y0 = null, dy = 0, t0 = 0
    dragH.addEventListener('pointerdown', function (e) {
      if (!phone.matches || e.target.closest('button')) return
      y0 = e.clientY; dy = 0; t0 = Date.now(); dragH.setPointerCapture(e.pointerId); sheetIn.style.transition = 'none'
    })
    dragH.addEventListener('pointermove', function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sheetIn.style.transform = dy ? 'translateY(' + dy + 'px)' : '' })
    var endDrag = function () {
      if (y0 == null) return
      y0 = null; sheetIn.style.transition = ''
      var fast = dy > 40 && dy / Math.max(1, Date.now() - t0) > 0.5
      if (dy > Math.min(180, sheetIn.offsetHeight * 0.25) || fast) closeSheet()
      else if (dy) { var from = sheetIn.style.transform; sheetIn.style.transform = ''; if (sheetIn.animate && !reduced()) sheetIn.animate([{ transform: from }, { transform: 'none' }], { duration: 380, easing: SPRING }) }
    }
    dragH.addEventListener('pointerup', endDrag); dragH.addEventListener('pointercancel', endDrag)
  }
  D.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-open]'); if (!b || (sheet && sheet.contains(b))) return
    var v = b.getAttribute('data-open')
    if (openSheet(v === 'download' ? 'download' : 'customize', { tab: v === 'download' ? '' : v, goal: b.getAttribute('data-goal') || '', from: b })) e.preventDefault()
  })
  // deep links: #download opens the sheet on Download (old #customize links land on the "Make it yours" entry)
  function fromHash() { if (location.hash === '#download' && !sheetOpen) openSheet('download', { from: $('#download'), hash: false }) }
  fromHash()
  W.addEventListener('hashchange', function () { fromHash(); openDev() })

  /* ═════════ "On this page": a quiet floating pill that opens a section map ═════════
     Shows once the hero has scrolled away; the first time it appears it says what it is, once. The open map marks the
     section in view; the pill's ring fills as the page is read. Without JS it is a plain disclosure after the hero. */
  var map = $('[data-map]')
  if (map) {
    D.documentElement.classList.add('ip-has-map')
    var mapBtn = $('summary', map), links = $$('[data-map-link]', map), now = $('[data-map-now]', map), prog = $('[data-map-prog]', map)
    var secs = links.map(function (a) { return $(a.getAttribute('href')) }).filter(Boolean)
    var hero = $('.ip-hero')
    var hintKey = 'with-ip-map-hint', hinted = !!store(hintKey), hint = null
    function showHint() {
      if (hinted || map.open) return
      hinted = true; store(hintKey, 1)
      hint = D.createElement('p'); hint.className = 'ip-map-hint'; hint.setAttribute('aria-hidden', 'true')
      hint.innerHTML = '<span>Jump to any section</span><svg viewBox="0 0 40 24" width="40" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4 C14 4 26 8 34 18 M27 18 H34 V11"/></svg>'
      mapBtn.appendChild(hint)
      setTimeout(function () { if (hint) hint.classList.add('is-on') }, 60)
      setTimeout(dropHint, 5200)
    }
    function dropHint() { if (!hint) return; var h = hint; hint = null; h.classList.remove('is-on'); setTimeout(function () { h.remove() }, 400) }
    var shown = false
    function setShown(v) {
      if (v === shown) return
      shown = v; map.classList.toggle('is-shown', v)
      if (!v && map.open) map.open = false
      if (v) setTimeout(showHint, 700)
    }
    function current() {
      var y = (W.innerHeight || 800) * 0.35, cur = null
      secs.forEach(function (s) { if (s.getBoundingClientRect().top <= y) cur = s })
      return cur
    }
    var raf = 0
    function onScroll() {
      if (raf) return
      raf = requestAnimationFrame(function () {
        raf = 0
        setShown(!hero || hero.getBoundingClientRect().bottom < 40)
        var c = current(), id = c ? c.id : ''
        links.forEach(function (a) { if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current') })
        var on = id && $('[data-map-link][aria-current]', map)
        if (now) now.textContent = on ? $('b', on).textContent : ''
        var max = D.documentElement.scrollHeight - (W.innerHeight || 800)
        if (prog) prog.style.strokeDashoffset = String(100 - Math.round(Math.min(1, Math.max(0, W.scrollY / Math.max(1, max))) * 100))
      })
    }
    W.addEventListener('scroll', onScroll, { passive: true }); W.addEventListener('resize', onScroll)
    onScroll()
    map.addEventListener('toggle', function () {
      dropHint()
      if (map.open) {
        var cur = $('[data-map-link][aria-current]', map) || links[0]
        var card = $('.ip-map-card', map)
        if (card && card.animate && !reduced()) {
          card.animate([{ opacity: 0, transform: 'translateY(12px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: SPRING })
          links.forEach(function (a, i) { a.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: 40 + i * 22, easing: EASE, fill: 'backwards' }) })
        }
        if (cur && map.contains(D.activeElement)) setTimeout(function () { cur.focus({ preventScroll: true }) }, 30)
      }
    })
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = $(a.getAttribute('href')); if (!t) return
        e.preventDefault(); map.open = false
        t.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
        if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'))
        if (t.id === 'developers') { var dv = $('.ip-dev'); if (dv) dv.open = true }
        // focus lands on the section (its heading reads first), without a second jump
        if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1')
        setTimeout(function () { try { t.focus({ preventScroll: true }) } catch (err) { } }, reduced() ? 0 : 500)
      })
    })
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && map.open) { map.open = false; mapBtn.focus() } })
    D.addEventListener('pointerdown', function (e) { if (map.open && !map.contains(e.target)) map.open = false })
    map.addEventListener('focusout', function (e) { if (map.open && e.relatedTarget && !map.contains(e.relatedTarget)) map.open = false })
  }

  paint()
})()
