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
      if (W.WI && W.WI.announce) W.WI.announce(ok ? 'Copied to clipboard' : 'Copy failed, press Ctrl+C')
      clearTimeout(b._t); b._t = setTimeout(function () { b.classList.remove('is-done'); if (l) l.textContent = 'Copy' }, 1500)
    })
  })

  /* the visitor's stack: one choice shared by the hero's "Use it in code" bar, the developer tabs and the library viewer */
  var STACKS = /^(html|react|vue|svelte|angular|solid|web|svg)$/
  function getStack() { try { var v = String(localStorage.getItem('with-stack') || '').replace(/"/g, ''); return STACKS.test(v) ? v : '' } catch (e) { return '' } }
  function putStack(v) { if (STACKS.test(v)) try { localStorage.setItem('with-stack', v) } catch (e) { } }

  var tabs = $$('.ip-tabs [role="tab"]'), row = $('[data-tabs-row]'), more = $('[data-tabs-more]')
  var moreB = more && $('.ip-more-b', more), moreM = more && $('.ip-more-m', more), moreL = more && $('[data-more-l]', more)
  var visTabs = function () { return tabs.filter(function (t) { return !t.classList.contains('is-over') }) }
  function selectTab(t, focus, quiet) {
    if (!t) return
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1
      var p = D.getElementById(x.getAttribute('aria-controls')); if (p) { p.hidden = !on; p.removeAttribute('data-off') }
    })
    if (focus) (t.classList.contains('is-over') ? moreB : t).focus()
    var id = t.getAttribute('data-tab')
    if (!quiet) { putStack(id); setQuick(id, true) }
    syncMore()
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { selectTab(t) })
    t.addEventListener('keydown', function (e) {
      var vis = visTabs(), i = vis.indexOf(t)
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
      if (k && i === vis.length - 1 && k > 0 && more && !more.hidden) { e.preventDefault(); moreB.focus(); return }
      if (k) { e.preventDefault(); selectTab(vis[(i + k + vis.length) % vis.length], true) }
      else if (e.key === 'Home') { e.preventDefault(); selectTab(vis[0], true) } else if (e.key === 'End') { e.preventDefault(); selectTab(vis[vis.length - 1], true) }
    })
  })
  // priority+: the tabs that don't fit on one row move into a "More" menu (the selected one always stays reachable)
  function fit() {
    if (!row || !more || !tabs.length) return
    tabs.forEach(function (t) { t.classList.remove('is-over') }); more.hidden = true
    var list = $('.ip-tabs', row)
    if (!row.offsetWidth || list.scrollWidth <= list.clientWidth + 1) { syncMore(); return }
    more.hidden = false
    for (var k = tabs.length - 1; k > 0 && list.scrollWidth > list.clientWidth + 1; k--) tabs[k].classList.add('is-over')
    syncMore()
  }
  function syncMore() {
    if (!more) return
    var over = tabs.filter(function (t) { return t.classList.contains('is-over') })
    var cur = over.filter(function (t) { return t.getAttribute('aria-selected') === 'true' })[0]
    moreM.innerHTML = over.map(function (t) { var on = t.getAttribute('aria-selected') === 'true'; return '<button type="button" role="menuitemradio" aria-checked="' + on + '" tabindex="-1" data-tab-go="' + t.getAttribute('data-tab') + '">' + esc(t.textContent) + '</button>' }).join('')
    moreL.textContent = cur ? cur.textContent : 'More'
    moreB.classList.toggle('is-on', !!cur)
  }
  function menu(open, focusFirst) {
    if (!more) return
    moreM.hidden = !open; moreB.setAttribute('aria-expanded', open ? 'true' : 'false')
    if (open) { var items = $$('[role="menuitemradio"]', moreM), f = items.filter(function (x) { return x.getAttribute('aria-checked') === 'true' })[0] || items[0]; if (f && focusFirst !== false) f.focus() }
  }
  if (more) {
    moreB.addEventListener('click', function () { menu(moreM.hidden) })
    moreB.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); menu(true) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); var vis = visTabs(); selectTab(vis[vis.length - 1], true) }
    })
    moreM.addEventListener('click', function (e) { var b = e.target.closest('[data-tab-go]'); if (!b) return; menu(false); selectTab($('.ip-tabs [data-tab="' + b.getAttribute('data-tab-go') + '"]'), false); moreB.focus() })
    moreM.addEventListener('keydown', function (e) {
      var items = $$('[role="menuitemradio"]', moreM), i = items.indexOf(D.activeElement)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus() }
      else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); items[e.key === 'Home' ? 0 : items.length - 1].focus() }
      else if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); moreB.focus() } menu(false, false) }
    })
    D.addEventListener('pointerdown', function (e) { if (!moreM.hidden && !more.contains(e.target)) menu(false, false) })
    var fq = 0; W.addEventListener('resize', function () { if (!fq) fq = requestAnimationFrame(function () { fq = 0; fit() }) })
    var dvx = $('.ip-dev'); if (dvx) dvx.addEventListener('toggle', fit)
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(fit)
  }
  // the panels are all readable without JS; with it, one shows at a time
  var st0 = (location.hash.match(/^#use-([a-z]+)$/) || [])[1] || getStack()
  selectTab((st0 && $('.ip-tabs [data-tab="' + st0 + '"]')) || tabs[0], false, true)
  fit()
  function openDev() {
    var m = location.hash.match(/^#(developers|use-([a-z]+))$/); if (!m) return
    var dv = $('.ip-dev'); if (dv) dv.open = true
    if (m[2]) selectTab($('.ip-tabs [data-tab="' + m[2] + '"]'), false, true)
  }
  openDev()

  /* the hero's "Use it in code" bar */
  var qu = $('[data-qu]'), quPick = qu && $('[data-qu-pick]', qu)
  function setQuick(v, fromTabs) {
    if (!qu || !STACKS.test(v)) return
    qu.setAttribute('data-stack', v)
    if (quPick && quPick.value !== v) quPick.value = v
    if (!fromTabs) { putStack(v); selectTab($('.ip-tabs [data-tab="' + v + '"]'), false, true) }
  }
  if (qu) {
    setQuick(getStack() || qu.getAttribute('data-stack'), true)
    quPick.addEventListener('change', function () {
      setQuick(quPick.value)
      if (!reduced()) { var ln = $('[data-qu-line="' + quPick.value + '"] .ip-qu-code', qu); if (ln && ln.animate) ln.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }) }
    })
    // the site's own dropdown (js/ui-kit.js, window.WIKit) replaces the browser's: the <select> stays the source of truth
    // (and the no-JS fallback). The kit loads after the page (or the moment the visitor reaches for the picker).
    var kitP = null
    var kitUp = function () {
      if (kitP) return kitP
      var css = D.querySelector('link[href$="ui-kit.css"]') ? Promise.resolve() : new Promise(function (ok) { var l = D.createElement('link'); l.rel = 'stylesheet'; l.href = BASE + 'css/ui-kit.css'; l.onload = l.onerror = function () { ok() }; D.head.appendChild(l) })
      var js = W.WIKit ? Promise.resolve() : new Promise(function (ok) { var s = D.createElement('script'); s.src = BASE + 'js/ui-kit.js'; s.async = true; s.onload = s.onerror = function () { ok() }; D.head.appendChild(s) })
      return (kitP = Promise.all([css, js]).then(function () {
        var K = W.WIKit; if (!K || !K.select || K.get && K.get(quPick)) return
        var hadFocus = D.activeElement === quPick
        try { K.select(quPick, { search: false, label: 'Your stack' }); quPick.parentNode.classList.add('is-kit') } catch (e) { return }
        if (hadFocus) { var cb = $('.wk-select', quPick.parentNode); if (cb) cb.focus() }
      }))
    }
    var pickWrap = quPick.parentNode
    ;['pointerenter', 'focusin', 'touchstart'].forEach(function (ev) { pickWrap.addEventListener(ev, function () { kitUp() }, { once: true, passive: true }) })
    if (D.readyState === 'complete') setTimeout(kitUp, 400); else W.addEventListener('load', function () { if (W.requestIdleCallback) W.requestIdleCallback(function () { kitUp() }, { timeout: 2000 }); else setTimeout(kitUp, 800) })
    var all = $('[data-qu-all]', qu)
    if (all) all.addEventListener('click', function (e) {
      var sec = $('#developers'), dv = $('.ip-dev'); if (!sec || !dv) return
      e.preventDefault(); dv.open = true; fit()
      var t = $('.ip-tabs [data-tab="' + qu.getAttribute('data-stack') + '"]')
      selectTab(t, false, true)
      sec.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
      if (history.replaceState) history.replaceState(null, '', '#developers')
      setTimeout(function () { try { (t && !t.classList.contains('is-over') ? t : moreB || t).focus({ preventScroll: true }) } catch (err) { } }, reduced() ? 0 : 500)
    })
  }
  // tiny colouring for the bar's code (the same rules as the page generator's)
  function hl(code) {
    var re = /(\/\/[^\n]*|<!--[\s\S]*?-->)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(import|from|export|const|function|return|class|default|as)\b|(<\/?[A-Za-z][\w.-]*)/g
    var out = '', last = 0, m
    while ((m = re.exec(code))) { out += esc(code.slice(last, m.index)) + '<span class="' + (m[1] ? 'tk-c' : m[2] ? 'tk-s' : m[3] ? 'tk-k' : 'tk-t') + '">' + esc(m[0]) + '</span>'; last = re.lastIndex }
    return out + esc(code.slice(last))
  }

  /* ───────── style hubs: heavy styles' grids arrive one category at a time ─────────
     (styles/<style>.html inlines its first category; every other one is a line drawing marked data-ph until
     data/hub/<style>/<category>.js comes in, fetched as the category nears the screen) */
  ;(function hubLazy() {
    var groups = $$('[data-hub-lazy]'); if (!groups.length) return
    function attrs(o) { return Object.keys(o || {}).map(function (k) { return o[k] == null || o[k] === false ? '' : ' ' + k + '="' + esc(o[k]) + '"' }).join('') }
    function fill(g) {
      var key = g.getAttribute('data-hub-key'), map = W.WITH_HUB && W.WITH_HUB[key]; if (!map) return
      var root = {}; try { root = JSON.parse(g.getAttribute('data-root') || '{}') } catch (e) { }
      $$('svg[data-ph]', g).forEach(function (sv) {
        var m = map[sv.getAttribute('data-ph')]; if (m == null) return
        var r = root; if (sv.hasAttribute('data-root')) try { r = JSON.parse(sv.getAttribute('data-root')) } catch (e) { }
        sv.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' + attrs(r) + ' aria-hidden="true" focusable="false">' + m + '</svg>'
      })
      g.removeAttribute('data-hub-lazy'); g.classList.add('is-in')
    }
    function load(g) {
      if (g._hub) return; g._hub = 1
      var s = D.createElement('script'); s.src = g.getAttribute('data-hub-lazy'); s.async = true
      s.onload = function () { fill(g) }; s.onerror = function () { g._hub = 0 }
      D.head.appendChild(s)
    }
    if (!W.IntersectionObserver) { groups.forEach(load); return }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); load(e.target) } }) }, { rootMargin: '900px 0px' })
    groups.forEach(function (g) { io.observe(g) })
  })()

  /* ───────── choosing a style (site/STYLE-PICKER.md) ─────────
     The shared full picker (js/style-picker.js + css/style-picker.css) loads only when someone reaches for it.
     "What are you making?" chips lift a job's best styles into a row above the five groups, best first. */
  var assets = {}
  function asset(url, css) {
    return assets[url] || (assets[url] = new Promise(function (ok) {
      var el = D.createElement(css ? 'link' : 'script')
      if (css) { el.rel = 'stylesheet'; el.href = url } else { el.src = url; el.async = true }
      el.onload = function () { ok(true) }; el.onerror = function () { ok(false) }
      D.head.appendChild(el)
    }))
  }
  function picker() {
    var wi = W.WI || W.EG
    if (wi && wi.stylePicker) return Promise.resolve(wi.stylePicker)
    return Promise.all([asset(BASE + 'css/style-picker.css', true), asset(BASE + 'js/style-picker.js')]).then(function () {
      var w = W.WI || W.EG; return (w && w.stylePicker) || W.WIStylePicker || null
    })
  }
  // warm the picker once the page is idle, or the moment a pointer or focus nears an "All styles" control
  function warmPicker() { if (!warmPicker.on) { warmPicker.on = 1; picker() } }
  $$('[data-pick-all], [data-style-all]').forEach(function (a) {
    ;['pointerenter', 'focus', 'touchstart'].forEach(function (ev) { a.addEventListener(ev, warmPicker, { once: true, passive: true }) })
    a.setAttribute('aria-haspopup', 'dialog')
  })
  function remember(st) {
    var sp = (W.WI && W.WI.stylePicker) || W.WIStylePicker
    if (sp) return sp.remember(st)
    try {
      var r = []; try { r = JSON.parse(localStorage.getItem('with-style-recent') || '[]') } catch (e) { }
      localStorage.setItem('with-style', st)
      localStorage.setItem('with-style-recent', JSON.stringify([st].concat((Array.isArray(r) ? r : []).filter(function (x) { return x !== st })).slice(0, 4)))
    } catch (e) { }
  }
  function recentStyles() {
    var sp = (W.WI && W.WI.stylePicker) || W.WIStylePicker
    if (sp) return sp.recent()
    try { var r = JSON.parse(localStorage.getItem('with-style-recent') || '[]'); return Array.isArray(r) ? r.filter(function (x) { return typeof x === 'string' }) : [] } catch (e) { return [] }
  }
  function lastStyle() { try { return localStorage.getItem('with-style') || null } catch (e) { return null } }
  // the hubs' "All N styles": the full picker, and picking a style opens its page (no JS: the link to the list)
  $$('[data-style-all]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return
      e.preventDefault()
      picker().then(function (sp) {
        if (!sp) { location.href = a.getAttribute('href'); return }
        sp.open({ current: a.getAttribute('data-current') || null, icon: 'home', anchor: a, title: 'Choose a style' }).then(function (st) {
          if (st) location.href = BASE + 'styles/' + st + '.html'
        })
      })
    })
    a.setAttribute('role', 'button')
    a.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); a.click() } })
  })
  // hub rows: show as many tiles as fit, so "All N styles" sits right after the last one (no JS: the extra ones clip)
  var rows = $$('.st-row')
  function fitRows() {
    rows.forEach(function (nav) {
      var ul = $('ul', nav), all = $('.st-row-all', nav), lis = $$('li', ul); if (!ul || !all || !lis.length) return
      lis.forEach(function (li) { li.hidden = false })
      var t = lis[0].offsetWidth; if (!t) return
      var n = Math.max(3, Math.floor((nav.clientWidth - all.offsetWidth - parseFloat(getComputedStyle(all).marginLeft || 0) + 4) / (t + 4)))
      lis.forEach(function (li, k) { li.hidden = k >= n })
    })
  }
  if (rows.length) {
    fitRows()
    var rowQ = 0; W.addEventListener('resize', function () { if (!rowQ) rowQ = requestAnimationFrame(function () { rowQ = 0; fitRows() }) })
  }
  // "What are you making?"
  $$('[data-uses]').forEach(function (box) {
    var scope = box.closest('[data-uses-scope]') || D.body
    var wrap = $('[data-best-wrap]', box), list = $('[data-best]', box), head = $('[data-best-h]', box)
    var chips = $$('[data-use]', box)
    box.hidden = false
    function show(chip) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false') })
      $$('[data-style-card].is-match', scope).forEach(function (c) { c.classList.remove('is-match') })
      list.innerHTML = ''
      if (!chip) { wrap.hidden = true; return }
      var t = chip.textContent
      head.innerHTML = 'Best for ' + esc(t.charAt(0).toLowerCase() + t.slice(1)) + '<span>best first</span>'
      chip.getAttribute('data-use-styles').split(' ').forEach(function (st, k) {
        var card = $$('[data-style-card="' + st + '"]', scope).filter(function (c) { return !list.contains(c) })[0]; if (!card) return
        card.classList.add('is-match')
        var cl = card.cloneNode(true)
        cl.removeAttribute('id'); $$('[id]', cl).forEach(function (x) { x.removeAttribute('id') })
        cl.classList.remove('is-match'); cl.classList.add('is-best')
        if (!k) { var b = D.createElement('span'); b.className = 'st-badge'; b.textContent = 'Best pick'; cl.insertBefore(b, cl.firstChild) }
        list.appendChild(cl)
      })
      wrap.hidden = false
      if (!reduced() && list.animate) list.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' })
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        show(c.getAttribute('aria-pressed') === 'true' ? null : c)
        // phones scroll the chips sideways: keep the pressed one in view
        if (c.parentNode.scrollWidth > c.parentNode.clientWidth) try { c.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }) } catch (e) { }
      })
    })
  })

  /* ───────── icon page ───────── */
  var dataEl = $('#ip-data'), root = $('[data-ip]')
  if (!dataEl || !root) return
  var DATA; try { DATA = JSON.parse(dataEl.textContent) } catch (e) { return }
  // each style's markup lives once in the page, in the <symbol>s the previews <use> (a rich style's gradient <defs> sit
  // beside its symbol, marked data-for, where every <use> can reach them; never inside display:none)
  var sprite = $('.ip-sprite') || (D.getElementById('s-line') && D.getElementById('s-line').ownerSVGElement)
  function symInner(s) {
    var sym = D.getElementById('s-' + s); if (!sym || sym.hasAttribute('data-lazy')) return null
    var df = sprite && sprite.querySelector('defs[data-for="s-' + s + '"]')
    return (df ? '<defs>' + df.innerHTML + '</defs>' : '') + sym.innerHTML
  }
  Object.keys(DATA.styles).forEach(function (s) { if (DATA.styles[s].inner == null) DATA.styles[s].inner = symInner(s) })
  // heavy styles (rich gradients, big drawings) are not in the HTML: their symbols start empty and fill from
  // data/by-icon/<name>.js (this icon in every style, the same file the library and the studio use) right after first paint
  var lazyStyles = (root.getAttribute('data-lazy-styles') || '').split(' ').filter(Boolean)
  var lazyP = null
  function fillLazy() {
    var all = W.WITH_ICON && W.WITH_ICON[DATA.name]; if (!all) return false
    lazyStyles.forEach(function (s) {
      var m = all[s], sym = D.getElementById('s-' + s); if (m == null || !sym || !sym.hasAttribute('data-lazy')) return
      DATA.styles[s].inner = m
      var d = /<defs>([\s\S]*?)<\/defs>/.exec(m), body = d ? m.replace(d[0], '') : m
      if (d && sprite) { var df = D.createElementNS('http://www.w3.org/2000/svg', 'defs'); df.setAttribute('data-for', 's-' + s); df.innerHTML = d[1]; sprite.insertBefore(df, sprite.firstChild) }
      sym.innerHTML = body; sym.removeAttribute('data-lazy')
    })
    $$('.ip-pick-b.is-lazy').forEach(function (b) { var d = DATA.styles[b.getAttribute('data-pick')]; if (d && d.inner != null) b.classList.remove('is-lazy') })
    return true
  }
  function loadLazy() {
    if (lazyP) return lazyP
    if (!lazyStyles.length || fillLazy()) return (lazyP = Promise.resolve(true))
    lazyP = new Promise(function (ok) {
      var el = D.createElement('script'); el.src = BASE + 'data/by-icon/' + DATA.name + '.js'; el.async = true
      el.onload = el.onerror = function () { ok(fillLazy()) }
      D.head.appendChild(el)
    })
    lazyP.then(function () { if (typeof paint === 'function') paint() })
    return lazyP
  }
  if (lazyStyles.length) loadLazy()
  var qsStyle = null
  try { qsStyle = new URLSearchParams(location.search).get('style'); if (!DATA.styles[qsStyle]) qsStyle = null } catch (e) { }

  // until the studio is here, the hero wears what the visitor chose last time (the studio's own memory), so nothing jumps
  var mem = store('with-editor-v1') || {}
  var S = {
    style: qsStyle || (DATA.styles[lastStyle()] ? lastStyle() : DATA.styles[mem.style] ? mem.style : root.getAttribute('data-style')),
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
    studioP = Promise.all(js.concat([css, loadLazy()])).then(function () {
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
  // (on Save-Data or a 2G link the idle warm-up is skipped: the studio then loads when it is reached for)
  function warm() { loadStudio() }
  var lowData = (function () { var c = navigator.connection; return !!(c && (c.saveData || /2g/.test(c.effectiveType || ''))) })()
  if (lowData) { /* only on demand */ }
  else if (W.requestIdleCallback) W.addEventListener('load', function () { W.requestIdleCallback(warm, { timeout: 2500 }) })
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
    var base = DATA.cdn || 'https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/'
    // with-loader.js links only the CSS of the icons on the page (any style mix); custom colours need the inline-SVG runtime
    return '<script src="' + base + (colorCss(st) ? 'with-icons.js' : 'with-loader.js') + '" defer></script>'
  }
  function nowrapTokens(t) { return t.split(' ').map(function (w) { return '<span class="nw">' + esc(w) + '</span>' }).join(' ') }
  // the "Use it in code" bar follows the picked style (and, for the <i> tag, the studio's custom colours)
  function quickFill(t, s) { return t.replace(/\{sub\}/g, s === 'line' ? '' : '/' + s).replace(/\{cls\}/g, s === 'line' ? '' : ' with-' + s).replace(/\{var\}/g, s === 'line' ? '' : ' variant="' + s + '"').replace(/\{style\}/g, s).replace(/\{core\}/g, ((DATA.homes && DATA.homes[s]) || 'core') + '@latest/dist') }
  function quickPaint() {
    if (!qu || !DATA.qu) return
    Object.keys(DATA.qu).forEach(function (id) {
      var c = $('#qu-' + id), txt = id === 'html' ? tagText(S.style) : quickFill(DATA.qu[id], S.style)
      if (c && c.textContent !== txt) c.innerHTML = hl(txt).replace(/>([^<]+)</g, function (m, t) { return '>' + t.split(' ').map(function (w) { return w && w.length < 32 && w.indexOf('\n') < 0 ? '<span class="nw">' + w + '</span>' : w }).join(' ') + '<' })
    })
    var su = $('#qus-html'); if (su) { var t = cssText(S.style); if (su.textContent !== t) { su.textContent = t; su.title = t } }
    // "Make it bigger or smaller": the 48 px one-liners follow the picked style too
    $$('[data-fill]', qu).forEach(function (c) { var t = quickFill(c.getAttribute('data-fill'), S.style); if (c.textContent !== t) c.textContent = t })
  }
  function busy(b, on) { if (!b) return; b.classList.toggle('is-busy', !!on); if (on) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy') }

  function act(kind, st, btn) {
    st = st || S.style
    if (kind === 'copy-tag') {
      var tb = $('.ip-tag-btn', root)
      return copyText(tagText(st)).then(function (ok) {
        toast(ok ? 'Copied ' + tagText(st) + '. Paste it into your HTML.' : 'Couldn’t reach the clipboard.')
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
  var tilesEl = $('[data-pick-tiles]', root), pickAll = $('[data-pick-all]', root)
  var phoneMq = W.matchMedia ? W.matchMedia('(max-width: 640px)') : { matches: false }
  var prevStyle = null
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
    var changed = prevStyle !== null && prevStyle !== S.style
    prevStyle = S.style
    syncRow()
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
    var big = $('.ip-stage-art svg', root); var bigIn = (ed && ed.inner && ed.inner(S.style)) || s.inner; if (big && bigIn != null) big.innerHTML = bigIn
    $$('[data-pick]', root).forEach(function (b) { var on = b.getAttribute('data-pick') === S.style; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1 })
    $$('[data-px-label]').forEach(function (l) { l.textContent = S.px + ' px' })
    $$('[data-color-label]').forEach(function (c) { c.textContent = colourWord() })
    var pn = $('[data-pick-name]', root); if (pn) pn.textContent = s.title
    var ps = $('[data-pick-say]', root); if (ps && s.say) ps.textContent = s.say
    var tc = $('[data-tag-code]', root); if (tc) tc.innerHTML = nowrapTokens(tagText(S.style))
    var cc = $('[data-tag-css]', root); if (cc) cc.textContent = cssText(S.style)
    quickPaint()
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
    dlSet()
    stageMotion()
    if (changed && !reduced()) {
      var art = $('.ip-stage-art', root)
      if (art && art.animate) art.animate([{ transform: 'scale(.7) rotate(-10deg)', opacity: 0.2 }, { transform: 'scale(1.06) rotate(2deg)', opacity: 1, offset: 0.6 }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' })
      $$('.ip-sizes figure', root).forEach(function (f, i) { if (f.animate) f.animate([{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, delay: 60 + i * 50, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }) })
      var mini = $('[data-mini]'); if (mini && mini.animate) mini.animate([{ transform: 'scale(.86)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' })
    }
  }
  /* the short style row: the current style, then recently used, then the featured ones (8, phones 5) */
  function choose(v) {
    if (!DATA.styles[v]) return
    remember(v)
    if (ed) ed.set({ style: v }); else { S.style = v; paint(); loadStudio().then(function () { if (S.style !== v) ed.set({ style: v }) }) }
  }
  // as many tiles as the row's width holds (8 at most, 5 on phones), so "All N styles" sits right after the last one
  function rowWant() {
    var max = phoneMq.matches ? 5 : 8, t = tilesEl && tilesEl.firstElementChild
    if (!t || !pickAll || !t.offsetWidth) return max
    var avail = tilesEl.parentNode.clientWidth - pickAll.offsetWidth - parseFloat(getComputedStyle(pickAll).marginLeft || 0)
    return Math.max(3, Math.min(max, Math.floor((avail + 4) / (t.offsetWidth + 4))))
  }
  function rowList(cur) {
    var want = rowWant(), out = [cur], feat = (W.WI && W.WI.FEATURED) || []
    recentStyles().concat(feat, Object.keys(DATA.styles)).forEach(function (s) { if (out.length < want && out.indexOf(s) < 0 && DATA.styles[s]) out.push(s) })
    return out
  }
  function rowTile(s) {
    var d = DATA.styles[s], on = s === S.style, isNew = ((W.WI && W.WI.NEW_STYLES) || []).indexOf(s) >= 0
    var a = Object.keys(d.root || {}).map(function (k) { return ' ' + k + '="' + esc(d.root[k]) + '"' }).join('')
    return '<button type="button" role="radio" class="ip-pick-b s-' + s + (d.inner == null ? ' is-lazy' : '') + '" data-pick="' + s + '" aria-checked="' + on + '"' + (on ? '' : ' tabindex="-1"') +
      ' style="--sc:var(--c-' + s + ', ' + d.hex + ');--sc-on:var(--c-' + s + '-on, ' + (d.on || '#FFFFFF') + ')" title="' + esc(d.title) + (d.good ? ': good for ' + esc(d.good.toLowerCase()) : '') + '">' +
      '<span class="ip-pick-i"><svg viewBox="0 0 24 24" width="24" height="24"' + a + ' aria-hidden="true" focusable="false"><use href="#s-' + s + '"/></svg></span>' +
      '<span class="ip-pick-n">' + esc(d.title) + '</span>' + (isNew ? '<i class="ip-new" aria-hidden="true"></i>' : '') + '</button>'
  }
  var rowStyles = tilesEl ? $$('[data-pick]', tilesEl).map(function (b) { return b.getAttribute('data-pick') }) : []
  function buildRow(list) {
    if (!tilesEl) return
    var had = tilesEl.contains(D.activeElement)
    rowStyles = list
    tilesEl.innerHTML = list.map(rowTile).join('')
    if (had) { var on = $('[aria-checked="true"]', tilesEl); if (on) on.focus() }
  }
  // keep the current style visible in the row: a style picked elsewhere (the full picker, the studio) joins at the front
  function syncRow() {
    if (!tilesEl) return
    var b = $('[data-pick="' + S.style + '"]', tilesEl), f0 = tilesEl.firstElementChild
    if (b && (!f0.offsetParent || (b.offsetParent && b.offsetTop === f0.offsetTop))) return
    buildRow([S.style].concat(rowStyles.filter(function (s) { return s !== S.style })).slice(0, rowWant()))
  }
  if (tilesEl) {
    var first = rowList(S.style)
    if (first.join(' ') !== rowStyles.join(' ')) buildRow(first)
    var onMq = function () { buildRow(rowList(S.style)) }
    if (phoneMq.addEventListener) phoneMq.addEventListener('change', onMq); else if (phoneMq.addListener) phoneMq.addListener(onMq)
    var rq = 0
    W.addEventListener('resize', function () { if (!rq) rq = requestAnimationFrame(function () { rq = 0; if (rowWant() !== rowStyles.length) buildRow(rowList(S.style)) }) })
    tilesEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pick]'); if (!b) return
      choose(b.getAttribute('data-pick'))
    })
    tilesEl.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      // only the tiles on the visible line (a narrow row clips the rest)
      var all = $$('[data-pick]', tilesEl), top = all.length ? all[0].offsetTop : 0
      var bs = Array.prototype.filter.call(all, function (b) { return b.offsetParent && b.offsetTop === top }), i = bs.indexOf(e.target.closest('[data-pick]'))
      if (i < 0) return
      var to = k ? bs[(i + k + bs.length) % bs.length] : e.key === 'Home' ? bs[0] : e.key === 'End' ? bs[bs.length - 1] : null
      if (to) { e.preventDefault(); to.focus(); choose(to.getAttribute('data-pick')) }
    })
  }
  // "All N styles": the full picker (popover on desktop, sheet on phones); without it, the grouped list below
  if (pickAll) {
    pickAll.setAttribute('role', 'button')
    pickAll.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); pickAll.click() } })
    pickAll.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return
      e.preventDefault()
      picker().then(function (sp) {
        if (!sp) { jumpTo('#styles'); return }
        sp.open({ current: S.style, icon: DATA.name, anchor: pickAll, title: 'Choose a style for ' + DATA.title }).then(function (st) { if (st) choose(st) })
      })
    })
  }
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
    var a = Editor.motionAttrs(e, { trigger: looping ? 'loop' : 'hover', stroked: stroked(), style: S.style })
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
    var a = Editor.motionAttrs(DATA.motion.hover, { trigger: 'once', stroked: stroked(), style: S.style })
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

  /* ───────── "Download all" in the All styles section follows the chosen style ─────────
     The link is plain <a download> (generated by site-seo.mjs from data/downloads.json); the sizes for other styles come
     from data/downloads.js (window.WITH_DOWNLOADS), loaded the first time the style changes. */
  function dlSet() {
    var a = $('[data-dl-set]'); if (!a) return
    var st = S.style; if (a.getAttribute('data-dl-set') === st) return
    function put(d) {
      var x = d && d.styles && d.styles[st]
      if (!x) { a.parentNode.hidden = true; return }
      a.parentNode.hidden = false
      a.setAttribute('data-dl-set', st)
      a.href = BASE + x.file
      a.setAttribute('download', x.file.split('/').pop())
      var t = $('[data-dl-set-t]', a), n = $('[data-dl-set-n]', a)
      if (t) t.textContent = 'Download all ' + Number(x.icons).toLocaleString('en-US') + ' ' + (x.title || (DATA.styles[st] && DATA.styles[st].title) || st) + ' SVGs'
      if (n) n.textContent = '(.zip, ' + x.size + ')'
    }
    if (W.WITH_DOWNLOADS) put(W.WITH_DOWNLOADS)
    else asset(BASE + 'data/downloads.js').then(function () { if (S.style === st) put(W.WITH_DOWNLOADS) })
  }
  $$('[data-dl-set]').forEach(function (a) {
    a.addEventListener('click', function () { try { if (typeof W.gtag === 'function') W.gtag('event', 'download_all', { style: a.getAttribute('data-dl-set') }) } catch (e) { } })
  })

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
    // no measuring: the modes are equal grid columns, so CSS places the pill from the active index alone
    var box = sheet && $('.ip-sheet-modes', sheet); if (!box) return
    var bs = $$('[data-mode]', box), k = bs.findIndex(function (b) { return b.getAttribute('aria-selected') === 'true' })
    box.style.setProperty('--n', bs.length); box.style.setProperty('--i', Math.max(0, k))
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
    W.addEventListener('resize', function () { if (sheetOpen) sheetFoot() })
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
  // deep links: #download opens the sheet on Download (old #customize links land on the "Make it yours" entry);
  // #studio (and #studio-look / -motion / -swap) opens it on Customize at that tab: the "Customize" links on other pages.
  // The #studio hash is dropped once the sheet opens, so closing it and reloading shows the plain page.
  function fromHash() {
    if (sheetOpen) return
    if (location.hash === '#download') { openSheet('download', { from: $('#download'), hash: false }); return }
    var m = /^#studio(?:-(look|motion|swap))?$/.exec(location.hash)
    if (!m) return
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search)
    openSheet('customize', { tab: m[1] || 'look', from: $('[data-open="look"]'), hash: false })
  }
  fromHash()
  W.addEventListener('hashchange', function () { fromHash(); openDev() })

  /* ═════════ the mobile action bar: Download + Copy image within thumb reach ═════════
     Phones only (CSS shows it at 760px and below). It slides up once the hero's own buttons have scrolled out of view
     and goes away while they are back on screen. The section map docks into its right end there. */
  var bar = $('[data-bar]'), actionsEl = $('[data-actions]', root), barOn = false
  var phoneMq = W.matchMedia ? W.matchMedia('(max-width: 760px)') : { matches: false }
  function setBar(v) {
    if (!bar || v === barOn) return
    barOn = v; bar.classList.toggle('is-on', v); D.documentElement.classList.toggle('ip-bar-on', v)
    if ('inert' in bar) bar.inert = !v
  }
  if (bar) {
    D.documentElement.classList.add('ip-has-bar')
    if ('inert' in bar) bar.inert = true
    if (actionsEl && W.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        var e = es[0]
        // only once the buttons are above the screen (scrolled past), not while the page is still loading below them
        setBar(!e.isIntersecting && e.boundingClientRect.top < 0)
        if (W.dispatchEvent) W.dispatchEvent(new Event('scroll'))
      }, { threshold: 0 }).observe(actionsEl)
    }
  }

  /* ═════════ "On this page" ═════════
     js/site.js (WI.pageMap) runs the whole map: the pill, its section list, the active section and the progress ring.
     It shows once the hero has scrolled away; on phones it docks into the action bar and follows it (html.ip-bar-on).
     Here only: a jump to "For developers" opens the developer panel. Without JS it is a plain disclosure after the hero. */
  var map = $('[data-map]')
  if (map) map.addEventListener('pagemap:jump', function (e) { if (e.detail && e.detail.id === 'developers') { var dv = $('.ip-dev'); if (dv) dv.open = true } })

  paint()
})()
