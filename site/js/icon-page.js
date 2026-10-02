/* with icons — generated icon pages (icons/<name>.html) and hubs (categories/, styles/).
   The hero (pick a style, grab it), the live "Customize" studio (js/editor.js: WI.Editor.mount) with its
   real-world placements, the hero's animated stage, drag-out, the in-page section nav and developer tabs.
   Everything reads fine without JS; the studio and placements appear only when scripts run. */
(function () {
  'use strict'
  var D = document, W = window
  var $ = function (s, r) { return (r || D).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)) }
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  var reduced = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches
  var INK = '#111318'

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
  if (/^#(developers|use-)/.test(location.hash)) { var dv = $('.ip-dev'); if (dv) dv.open = true }

  /* ───────── icon page ───────── */
  var dataEl = $('#ip-data'), root = $('[data-ip]')
  if (!dataEl || !root) return
  var DATA; try { DATA = JSON.parse(dataEl.textContent) } catch (e) { return }
  // each style's markup lives once in the page, in the <symbol>s the previews <use>
  Object.keys(DATA.styles).forEach(function (s) { var sym = D.getElementById('s-' + s); if (sym && DATA.styles[s].inner == null) DATA.styles[s].inner = sym.innerHTML })
  var qsStyle = null
  try { qsStyle = new URLSearchParams(location.search).get('style'); if (!DATA.styles[qsStyle]) qsStyle = null } catch (e) { }

  var Editor = (W.WI && W.WI.Editor) || W.WithEditor
  var ed = null, S = null   // S: the editor state (or the fallback below)
  var studio = $('[data-editor]')
  if (Editor && studio) {
    ed = Editor.mount(studio, {
      name: DATA.name, title: DATA.title, data: DATA, motion: DATA.motion || (W.WITH_MOTION && W.WITH_MOTION[DATA.name]) || null,
      style: qsStyle || undefined, placements: $('[data-placements]'), onChange: function (st) { S = st; paint() }
    })
    S = ed.get()
  } else {
    S = { style: qsStyle || root.getAttribute('data-style'), color: 'ink', px: 256, size: 24, colorName: 'black' }
  }

  /* fallbacks when the studio is unavailable (editor.js failed to load) */
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
    return '<link rel="stylesheet" href="' + base + 'with-' + st + '.css">' + (colorCss(st) ? '\n<script src="' + base + 'with-icons.js" defer></script>' : '')
  }
  function nowrapTokens(t) { return t.split(' ').map(function (w) { return '<span class="nw">' + esc(w) + '</span>' }).join(' ') }

  function act(kind, st) {
    st = st || S.style
    if (ed) {
      // a style card's buttons act on that style without changing the visitor's pick
      if (kind === 'svg') return ed.actions.downloadSvg(st)
      if (kind === 'png') return ed.actions.downloadPng(st)
      if (kind === 'copy-img') return ed.actions.copyImage(st)
      if (kind === 'copy-svg') return ed.actions.copySvg(st)
    } else {
      if (kind === 'svg') { saveBlob(new Blob([fileSvg(st, 24)], { type: 'image/svg+xml' }), fname(st, 'svg')); return toast('Downloaded ' + fname(st, 'svg')) }
      if (kind === 'copy-svg' || kind === 'copy-img' || kind === 'png') return copyText(fileSvg(st, 24)).then(function (ok) { toast(ok ? 'Copied ' + DATA.title + ' as SVG code.' : 'Couldn’t reach the clipboard.') })
    }
    if (kind === 'copy-tag') {
      var tb = $('.ip-tag-btn', root)
      return copyText(tagText(st)).then(function (ok) {
        toast(ok ? 'Copied ' + tagText(st) + ' — paste it into your HTML.' : 'Couldn’t reach the clipboard.')
        var gl = tb && $('.ip-tag-go span', tb)
        if (ok && tb) { tb.classList.add('is-done'); if (gl) gl.textContent = 'Copied'; clearTimeout(tb._t); tb._t = setTimeout(function () { tb.classList.remove('is-done'); if (gl) gl.textContent = 'Copy' }, 1600) }
      })
    }
    if (kind === 'copy-css') return copyText(cssText(st)).then(function (ok) { toast(ok ? 'Copied the stylesheet line. Add it once inside <head>.' : 'Couldn’t reach the clipboard.') })
  }

  /* ───────── hero: mirrors the studio state ───────── */
  var picks = $$('[data-pick]')
  var lastStyle = null
  function paint() {
    var s = DATA.styles[S.style]; if (!s) return
    var changed = lastStyle !== null && lastStyle !== S.style
    lastStyle = S.style
    root.setAttribute('data-style', S.style)
    D.body.className = D.body.className.replace(/\bs-[a-z]+\b/g, '').trim() + ' s-' + S.style
    root.style.setProperty('--sc', 'var(--c-' + S.style + ', ' + s.hex + ')')
    root.style.setProperty('--sc-on', 'var(--c-' + S.style + '-on, ' + (s.on || '#FFFFFF') + ')')
    root.style.setProperty('--ic', S.colors && S.colors.ink ? S.colors.ink : S.color === 'ink' ? 'var(--ink)' : (S.hex || hexOf(S.style)))
    // the hero (stage, sizes, style cards) wears the studio's colours: the current style's CSS variables on the page root
    ;(root._cv || []).forEach(function (k) { root.style.removeProperty(k) })
    // (a palette's roles carry across styles, so every style card shows, and downloads, the same palette)
    var cv = {}
    if (ed && ed.colorsFor) Object.keys(DATA.styles).forEach(function (st) { var cz = ed.colorsFor(st); if (cz) for (var k in cz.vars) cv[k] = cz.vars[k] })
    root._cv = Object.keys(cv)
    root._cv.forEach(function (k) { root.style.setProperty(k, cv[k]) })
    $$('svg[data-root]', root).forEach(function (svg) {
      ;['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].forEach(function (k) { if (s.root[k] == null) svg.removeAttribute(k); else svg.setAttribute(k, s.root[k]) })
      if (S.stroke != null && s.root['stroke-width'] != null) svg.setAttribute('stroke-width', S.stroke)
      var u = $('use', svg); if (u) u.setAttribute('href', '#s-' + S.style)
    })
    // the big stage icon is inline (not <use>) so the draw preset can reach its strokes
    var big = $('.ip-stage-art svg', root); if (big && s.inner != null) big.innerHTML = s.inner
    picks.forEach(function (b) { var on = b.getAttribute('data-pick') === S.style; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1 })
    $$('[data-px-label]', root).forEach(function (l) { l.textContent = S.px + ' px' })
    $$('[data-color-label]', root).forEach(function (c) { c.textContent = S.colorName || 'black' })
    var pn = $('[data-pick-name]', root); if (pn) pn.textContent = s.title
    var ps = $('[data-pick-say]', root); if (ps && s.say) ps.textContent = s.say
    var tc = $('[data-tag-code]', root); if (tc) tc.innerHTML = nowrapTokens(tagText(S.style))
    var cc = $('[data-tag-css]', root); if (cc) cc.textContent = cssText(S.style)
    root.classList.toggle('is-white', S.color === '#FFFFFF')
    askAI()
    stageMotion()
    if (changed && !reduced) {
      var art = $('.ip-stage-art', root)
      if (art && art.animate) art.animate([{ transform: 'scale(.7) rotate(-10deg)', opacity: 0.2 }, { transform: 'scale(1.06) rotate(2deg)', opacity: 1, offset: 0.6 }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' })
      $$('.ip-sizes figure', root).forEach(function (f, i) { if (f.animate) f.animate([{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, delay: 60 + i * 50, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }) })
    }
  }
  picks.forEach(function (b, i) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-pick')
      if (ed) ed.set({ style: v }); else { S.style = v; paint() }
    })
    b.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      if (k) { e.preventDefault(); var n = picks[(i + k + picks.length) % picks.length]; n.focus(); n.click() }
    })
  })
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !root.contains(b) || (studio && studio.contains(b))) return
    if (b.hasAttribute('data-act')) act(b.getAttribute('data-act'), b.getAttribute('data-style'))
  })

  /* ───────── the stage: the icon's own motion (forge/motion spec) ───────── */
  var mo = $('[data-mo]', root), intentBtn = $('[data-intent]', root), looping = false
  function stageMotion() {
    if (!mo || !Editor || !DATA.motion) return
    var stroked = !!(DATA.styles[S.style].root.stroke && DATA.styles[S.style].root.stroke !== 'none')
    var e = looping ? DATA.motion.loop : DATA.motion.hover
    var a = Editor.motionAttrs(e, { trigger: looping ? 'loop' : 'hover', stroked: stroked })
    if (!a) return
    mo.className = 'ip-mo ' + a.cls + (looping ? ' wm-force' : '')
    mo.setAttribute('style', a.style)
    if (Editor.prepareDraw) Editor.prepareDraw(mo.parentNode)
  }
  function playOnce() {
    if (!mo || !Editor || !DATA.motion || reduced || looping) return
    var a = Editor.motionAttrs(DATA.motion.hover, { trigger: 'once', stroked: !!DATA.styles[S.style].root.stroke })
    if (!a) return
    mo.className = 'ip-mo ' + a.cls; mo.setAttribute('style', a.style)
    if (Editor.prepareDraw) Editor.prepareDraw(mo.parentNode)
    setTimeout(stageMotion, a.dur * 1000 + 60)
  }
  if (intentBtn) {
    if (!Editor) intentBtn.hidden = true
    intentBtn.addEventListener('click', function () {
      looping = !looping
      intentBtn.setAttribute('aria-pressed', looping ? 'true' : 'false')
      var b = $('[data-intent-b]', intentBtn); if (b) b.textContent = looping ? 'Pause animation' : 'Play animation'
      stageMotion()
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
    sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    var t = focusSel && $(focusSel)
    if (t) setTimeout(function () { t.focus({ preventScroll: true }) }, reduced ? 0 : 450)
    if (history.replaceState) history.replaceState(null, '', sel)
    return true
  }
  var jump = $('[data-ask-jump]', root)
  if (jump) jump.addEventListener('click', function (e) { if (jumpTo('#ask-ai', '.ip-ask-widget .ask-task[aria-checked="true"], .ip-ask-widget .ask-task')) e.preventDefault() })
  $$('[data-jump]', root).forEach(function (a) { a.addEventListener('click', function (e) { if (jumpTo(a.getAttribute('href'), a.getAttribute('data-jump-focus') || '.wied [role=tab][aria-selected="true"]')) e.preventDefault() }) })
  // "More formats" leads to the studio's Download panel (it only exists once the studio has mounted)
  if (ed) $$('[data-more-formats]', root).forEach(function (a) { a.hidden = false })

  /* ───────── drag the big preview out: PNG (Chrome/Edge), image HTML for apps, SVG text as fallback ───────── */
  var drag = $('[data-drag]', root), dragPng = null
  if (drag) {
    drag.addEventListener('pointerenter', function () { if (ed) ed.actions.png(S.style, S.px).then(function (r) { dragPng = r }, function () { }) })
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

  /* ───────── in-page section nav: current section + a sliding marker ───────── */
  var toc = $('.ip-toc'), links = toc ? $$('a', toc) : []
  if (toc && W.IntersectionObserver) {
    var secs = links.map(function (a) { return $(a.getAttribute('href')) }).filter(Boolean)
    var vis = {}
    var mark = function (id) {
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id
        if (on) { a.setAttribute('aria-current', 'true'); var ul = a.closest('ul'); if (ul && ul.scrollWidth > ul.clientWidth) { var l = a.offsetLeft - 16; if (l < ul.scrollLeft || a.offsetLeft + a.offsetWidth > ul.scrollLeft + ul.clientWidth) ul.scrollTo({ left: l, behavior: reduced ? 'auto' : 'smooth' }) } }
        else a.removeAttribute('aria-current')
      })
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { vis[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0 })
      var best = null
      secs.forEach(function (s) { if (vis[s.id] > 0 && !best) best = s.id })
      if (best) mark(best); else if (W.scrollY < (secs[0] ? secs[0].offsetTop - 200 : 0)) mark('')
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.5] })
    secs.forEach(function (s) { io.observe(s) })
    var stuck = new IntersectionObserver(function (es) { toc.classList.toggle('is-stuck', !es[0].isIntersecting) }, { rootMargin: '-' + ((parseInt(getComputedStyle(D.documentElement).getPropertyValue('--header-h'), 10) || 72) + 1) + 'px 0px 0px 0px', threshold: 1 })
    var sentinel = D.createElement('div'); sentinel.className = 'ip-toc-sentinel'; sentinel.setAttribute('aria-hidden', 'true'); toc.parentNode.insertBefore(sentinel, toc); stuck.observe(sentinel)
  }

  paint()
})()
