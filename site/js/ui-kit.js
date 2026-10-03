/* with icons — ui-kit.js (v1.1). Dependency-free pickers that replace the browser's native ones.
   window.WIKit = { enhance, observe, colorPicker, select, slider, stepper, timePicker, destroy, get, close, parseColor }
   Natives stay the source of truth: their value/events are kept in sync, so existing listeners keep working.
   Every popover: is-open (+ aria-expanded on button triggers) while open, CustomEvent 'wikit:close' {value, changed}
   + opts.onClose on each close, focus back to the trigger (or whatever opened it when the trigger cannot take focus).
   Live docs + tests: site/ui-kit.html. Styles: css/ui-kit.css. */
(function () {
  'use strict'
  var W = window, D = document
  if (W.WIKit) return
  var REG = new WeakMap(), seq = 0, current = null
  var POP = typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function'
  var ICO = {
    chev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    drop: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13.2 3.6a2 2 0 012.9 2.9l-1.6 1.6.9.9-1.3 1.3-.9-.9-5.6 5.6-2.8.7.7-2.8 5.6-5.6-.9-.9 1.3-1.3.9.9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    clock: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 6v4l2.6 1.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    minus: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8 3.5v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
  }
  var BRAND = [['Ink', '#111318'], ['Tomato', '#FF5A36'], ['Sun', '#FFD23F'], ['Leaf', '#22A861'], ['Cyan', '#00A3C4'],
    ['Cobalt', '#2F5BFF'], ['Violet', '#7252FF'], ['Pink', '#FF4FA3'], ['Gold', '#C9962B'], ['White', '#FFFFFF']]

  /* ───────── helpers ───────── */
  function uid(p) { return 'wk-' + p + '-' + (++seq).toString(36) }
  function on(el, t, fn, o) { el.addEventListener(t, fn, o); return function () { el.removeEventListener(t, fn, o) } }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
  function el(tag, cls, attrs, html) {
    var e = D.createElement(tag); if (cls) e.className = cls
    if (attrs) for (var k in attrs) if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k] === true ? '' : attrs[k])
    if (html != null) e.innerHTML = html
    return e
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';' }) }
  function mq(q) { try { return W.matchMedia(q).matches } catch (e) { return false } }
  function reduced() { return mq('(prefers-reduced-motion: reduce)') }
  function sheetMode() { return (W.innerWidth || 1024) < 600 }
  function fire(t, type, detail) {
    var ev
    try { ev = detail === undefined ? new Event(type, { bubbles: true }) : new CustomEvent(type, { bubbles: true, detail: detail }) }
    catch (e) { ev = D.createEvent('CustomEvent'); ev.initCustomEvent(type, true, false, detail) }
    t.dispatchEvent(ev)
  }
  function shown(n) {
    if (!n || !n.isConnected || !n.getClientRects().length) return false
    var cs = getComputedStyle(n); return cs.visibility !== 'hidden' && +cs.opacity > 0.05
  }
  function focus(n) { if (!n) return; try { n.focus({ preventScroll: true }) } catch (e) { try { n.focus() } catch (x) { } } }
  function isRtl(n) { try { return getComputedStyle(n || D.body).direction === 'rtl' } catch (e) { return false } }
  function labelsOf(n) { try { return n.labels ? [].slice.call(n.labels) : [] } catch (e) { return [] } }
  function labelIds(n) { return labelsOf(n).map(function (l) { if (!l.id) l.id = uid('l'); return l.id }) }
  /* a label's words, joined with spaces ("Custom size" + <small>px</small> -> "Custom size px", not "Custom sizepx"),
     skipping the control itself, other fields, hidden bits and live value read-outs (<output>, a bare "48" / "1.5×") */
  var SKIP = /^(SELECT|OPTION|OPTGROUP|SCRIPT|STYLE|TEXTAREA|INPUT|OUTPUT|BUTTON|SVG|TEMPLATE)$/i
  function textOf(root, ctl) {
    var out = []
    ;(function walk(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) { var s = c.nodeValue.replace(/\s+/g, ' ').trim(); if (s) out.push(s) }
        else if (c.nodeType === 1 && c !== ctl && !SKIP.test(c.tagName) && !c.hidden && c.getAttribute('aria-hidden') !== 'true' && !c.classList.contains('wk-native')) walk(c)
      }
    })(root)
    while (out.length > 1 && /^[-+−]?[\d.,]+\s*(px|%|×|x|ms|s|°|deg|pt|em|rem)?$/i.test(out[out.length - 1])) out.pop()
    return out.join(' ').trim()
  }
  function nameOf(n, fb) {
    var a = n.getAttribute('aria-label'); if (a) return a
    var by = n.getAttribute('aria-labelledby')
    if (by) { var t = by.split(/\s+/).map(function (id) { var x = D.getElementById(id); return x ? textOf(x, n) : '' }).filter(Boolean).join(' '); if (t) return t }
    var ls = labelsOf(n).map(function (l) { return textOf(l, n) }).filter(Boolean)
    return ls.length ? ls.join(' ') : (n.getAttribute('title') || fb || '')
  }
  function focusable(n) { return !!n && n.nodeType === 1 && n.isConnected && !n.disabled && !n.closest('[inert]') }
  /* try each candidate until one really takes focus (a hidden / display:none native silently refuses it) */
  function focusFirst(list, not) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i]
      if (typeof c === 'function') { try { c = c() } catch (e) { c = null } }
      if (!focusable(c) || (not && not.contains(c))) continue
      focus(c); if (D.activeElement === c) return c
    }
    return null
  }
  function buttonish(n) {
    if (!n || n.nodeType !== 1) return false
    var r = n.getAttribute('role'); if (r) return /^(button|combobox)$/.test(r)
    return n.tagName === 'BUTTON' || (n.tagName === 'INPUT' && /^(button|submit)$/i.test(n.type)) || (n.tagName === 'A' && n.hasAttribute('href'))
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(W.localStorage.getItem(k) || 'null'); W.localStorage.setItem(k, JSON.stringify(v)) } catch (e) { return null } }
  /* intercept programmatic `.value = x` on a native so the custom UI repaints; returns the raw setter */
  function patchValue(n, cb) {
    var p = Object.getPrototypeOf(n), d
    while (p && !(d = Object.getOwnPropertyDescriptor(p, 'value'))) p = Object.getPrototypeOf(p)
    if (!d || !d.set) return { set: function (v) { n.value = v }, undo: function () { } }
    try { Object.defineProperty(n, 'value', { configurable: true, enumerable: true, get: function () { return d.get.call(n) }, set: function (v) { d.set.call(n, v); cb() } }) } catch (e) { }
    return { set: function (v) { d.set.call(n, v) }, undo: function () { try { delete n.value } catch (e) { } } }
  }
  function observeAttrs(n, list, cb) {
    if (!W.MutationObserver) return function () { }
    var mo = new MutationObserver(cb); mo.observe(n, { attributes: true, attributeFilter: list })
    return function () { mo.disconnect() }
  }
  function hideNative(n) { n.classList.add('wk-native'); n.setAttribute('tabindex', '-1'); n.setAttribute('aria-hidden', 'true') }
  function unhideNative(n, ti) { n.classList.remove('wk-native'); n.removeAttribute('aria-hidden'); if (ti == null) n.removeAttribute('tabindex'); else n.setAttribute('tabindex', ti) }

  /* ───────── colour maths ───────── */
  var ctx = null
  function hex2(n) { return ('0' + Math.round(clamp(n, 0, 255)).toString(16)).slice(-2) }
  function rgbHex(r, g, b) { return '#' + hex2(r) + hex2(g) + hex2(b) }
  function parseColor(s) {
    s = String(s == null ? '' : s).trim(); if (!s) return null
    var m = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(s)
    if (m) { var x = m[1]; if (x.length < 6) x = x.replace(/./g, '$&$&'); return '#' + x.slice(0, 6).toLowerCase() }
    try {
      if (!ctx) ctx = D.createElement('canvas').getContext('2d')
      ctx.fillStyle = '#010203'; ctx.fillStyle = s; var a = ctx.fillStyle
      ctx.fillStyle = '#030201'; ctx.fillStyle = s; if (a !== ctx.fillStyle) return null
      if (a.charAt(0) === '#') return a.toLowerCase()
      var p = a.match(/[\d.]+/g); return p ? rgbHex(+p[0], +p[1], +p[2]) : null
    } catch (e) { return null }
  }
  function hexRgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255] }
  function hsvRgb(h, s, v) {
    var f = function (n) { var k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)) }
    return [f(5) * 255, f(3) * 255, f(1) * 255]
  }
  function rgbHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, hh = 0
    if (d) hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
    return { h: (hh * 60 + 360) % 360, s: mx ? d / mx : 0, v: mx }
  }
  function hueName(h) { return ['red', 'orange', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'magenta', 'pink', 'red'][Math.round(h / 30)] }

  /* ───────── Layer: one anchored popover (desktop) / bottom sheet (phones) ─────────
     Lives in the top layer via the Popover API (escapes overflow + transforms) and inside the anchor's modal
     container when there is one, so host focus traps and outside-click checks still see it as "inside". */
  function Layer(o) {
    var root = el('div', 'wk-layer'), panel = el('div', 'wk-panel ' + (o.cls || ''), { id: uid('p') })
    var grab = el('div', 'wk-grab', { 'aria-hidden': 'true' }), body = el('div', 'wk-body')
    if (o.role) { panel.setAttribute('role', o.role); panel.setAttribute('aria-label', o.label || '') }
    if (POP) root.setAttribute('popover', 'manual')
    panel.appendChild(grab); panel.appendChild(body); root.appendChild(panel)
    var L = { root: root, panel: panel, body: body, isOpen: false, anchor: null, opener: null, open: open, close: close, place: place, reveal: reveal }
    var offs = [], timer = 0, raf = 0, marks = []
    root.addEventListener('pointerdown', function (e) { if (e.target === root) { e.preventDefault(); close(true) } })
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return }
      if (e.key === 'Tab' && o.trap) {
        var f = [].filter.call(panel.querySelectorAll('button,input,[tabindex="0"]'), function (x) { return !x.disabled && x.getClientRects().length })
        if (!f.length) return
        e.stopPropagation()
        var i = f.indexOf(D.activeElement), n = f.length
        if (e.shiftKey ? i <= 0 : i === n - 1) { e.preventDefault(); focus(f[e.shiftKey ? n - 1 : 0]) }
      }
    })
    // swipe the sheet down to dismiss
    grab.addEventListener('pointerdown', function (e) {
      if (!root.classList.contains('is-sheet')) return
      var y0 = e.clientY, dy = 0; try { grab.setPointerCapture(e.pointerId) } catch (x) { }
      panel.style.transition = 'none'
      function mv(ev) { dy = Math.max(0, ev.clientY - y0); panel.style.transform = 'translateY(' + dy + 'px)' }
      function up() { grab.removeEventListener('pointermove', mv); grab.removeEventListener('pointerup', up); grab.removeEventListener('pointercancel', up); panel.style.transition = panel.style.transform = ''; if (dy > 70) close(true) }
      grab.addEventListener('pointermove', mv); grab.addEventListener('pointerup', up); grab.addEventListener('pointercancel', up)
    })
    function onMove(e) {
      if (e && e.type === 'scroll' && e.target && e.target.nodeType === 1 && panel.contains(e.target)) return
      if (raf) return
      raf = (W.requestAnimationFrame || setTimeout)(function () { raf = 0; place(true) })
    }
    /* is-open on the trigger(s) while open; aria-expanded on the ones that are buttons (the owner manages its own) */
    function mark(on_) {
      if (!on_) { marks.forEach(function (m) { if (!m.had) m.n.classList.remove('is-open'); if (m.aria) { if (m.prev == null) m.n.removeAttribute('aria-expanded'); else m.n.setAttribute('aria-expanded', m.prev) } }); marks = []; return }
      var lb = o.owner && o.owner.closest && o.owner.closest('label'), seen = []
      ;[o.owner, L.anchor, lb].forEach(function (n) {
        if (!n || n.nodeType !== 1 || seen.indexOf(n) > -1 || root.contains(n)) return
        seen.push(n)
        var managed = n === o.owner && o.aria !== false, aria = !managed && buttonish(n)
        marks.push({ n: n, aria: aria, prev: n.getAttribute('aria-expanded'), had: n.classList.contains('is-open') })
        n.classList.add('is-open'); if (aria) n.setAttribute('aria-expanded', 'true')
      })
    }
    /* phones: keep what is being edited (o.reveal(), else the anchor) visible above the sheet */
    function reveal(t) {
      if (!L.isOpen || !root.classList.contains('is-sheet')) return
      t = t || (o.reveal && o.reveal()) || L.anchor
      if (!t || !t.isConnected || !t.scrollIntoView) return
      var h = panel.offsetHeight, vh = W.innerHeight, r = t.getBoundingClientRect(), top = 12
      // clear a fixed / sticky header bar at the top of the screen (not a full-height drawer the target lives in)
      try {
        var hits = D.elementsFromPoint ? D.elementsFromPoint((W.innerWidth || 0) / 2, 2) : []
        for (var i = 0; i < hits.length; i++) {
          var n = hits[i]; if (root.contains(n)) continue
          if (n.contains(t)) break
          for (; n && n !== D.body && n !== D.documentElement; n = n.parentElement) {
            var pos = getComputedStyle(n).position, nr = n.getBoundingClientRect()
            if ((pos === 'fixed' || pos === 'sticky') && nr.top <= 2 && nr.height < vh * 0.3 && !n.contains(t)) { top = Math.max(top, nr.bottom + 8); break }
          }
          break
        }
      } catch (e) { }
      if (r.top >= top - 4 && r.bottom <= vh - h - 8) return
      var s = t.style, mb = s.scrollMarginBottom, mt = s.scrollMarginTop
      s.scrollMarginBottom = (h + 12) + 'px'; s.scrollMarginTop = top + 'px'
      try { t.scrollIntoView({ block: r.height > vh - h - top - 12 ? 'start' : 'nearest', inline: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }) } catch (e) { }
      s.scrollMarginBottom = mb; s.scrollMarginTop = mt
    }
    function open(focusTarget) {
      if (L.isOpen) return
      var act = D.activeElement
      if (current && current !== L) current.close(false)
      clearTimeout(timer)
      L.opener = act && act !== D.body && !root.contains(act) ? act : null
      L.anchor = o.anchor()
      var host = POP && L.anchor && L.anchor.closest && (L.anchor.closest('dialog[open],[aria-modal="true"]') || L.anchor.closest('main,[role=main]')) || D.body
      if (root.parentNode !== host) host.appendChild(root)
      root.classList.remove('is-open')
      if (POP) { try { root.showPopover() } catch (e) { } } else root.classList.add('is-fallback')
      L.isOpen = true; current = L
      if (o.owner && o.aria !== false) o.owner.setAttribute('aria-expanded', 'true')
      mark(true)
      if (o.onOpen) o.onOpen()
      place()
      void panel.offsetWidth
      root.classList.add('is-open')
      offs = [on(W, 'scroll', onMove, { capture: true, passive: true }), on(W, 'resize', onMove)]
      if (W.visualViewport) offs.push(on(W.visualViewport, 'resize', onMove))
      if (focusTarget) focus(typeof focusTarget === 'function' ? focusTarget() : focusTarget)
      reveal()
    }
    function close(returnFocus) {
      if (!L.isOpen) return
      L.isOpen = false; if (current === L) current = null
      offs.forEach(function (f) { f() }); offs = []
      root.classList.remove('is-open')
      if (o.owner && o.aria !== false) o.owner.setAttribute('aria-expanded', 'false')
      mark(false)
      var a = D.activeElement, inside = panel.contains(a) || !a || a === D.body
      // back to the trigger; when it cannot take focus (hidden / display:none), the element that opened us, then the anchor
      if (returnFocus !== false && inside) {
        var anc = L.anchor, list = [].concat(o.returnTo ? o.returnTo() : o.owner, L.opener, anc, anc && anc.closest && anc.closest('button,a[href],[tabindex]:not([tabindex="-1"])'))
        if (!focusFirst(list, root) && panel.contains(D.activeElement)) { try { D.activeElement.blur() } catch (e) { } }
      }
      var done = function () { if (L.isOpen) return; if (POP) { try { root.hidePopover() } catch (e) { } } if (root.parentNode) root.parentNode.removeChild(root) }
      if (reduced()) done(); else timer = setTimeout(done, 170)
      if (o.onClose) o.onClose()
    }
    function place(fromScroll) {
      if (!L.isOpen) return
      var sheet = sheetMode(), ps = panel.style
      root.classList.toggle('is-sheet', sheet)
      if (o.role === 'dialog') panel.setAttribute('aria-modal', sheet ? 'true' : 'false')
      if (sheet) { ps.left = ps.top = ps.maxHeight = ps.minWidth = ps.transformOrigin = ''; panel.classList.toggle('is-compact', !!o.compact); return }
      var a = L.anchor, r = a && a.isConnected ? a.getBoundingClientRect() : null
      var vw = D.documentElement.clientWidth || W.innerWidth, vh = W.innerHeight, m = 8, g = 8
      if (!r || (!r.width && !r.height)) r = { left: vw / 2, right: vw / 2, top: vh / 3, bottom: vh / 3, width: 0, height: 0 }
      else if (fromScroll && (r.bottom < 0 || r.top > vh)) { close(false); return }
      ps.minWidth = o.matchWidth ? r.width + 'px' : ''
      ps.maxHeight = ''
      if (o.compact) panel.classList.remove('is-compact')
      var pw = panel.offsetWidth, ph = panel.offsetHeight
      var below = vh - r.bottom - g - m, above = r.top - g - m
      // cramped on both sides: take the roomier side and switch to the compact layout before ever scrolling inside
      if (o.compact && ph > below && ph > above) { panel.classList.add('is-compact'); pw = panel.offsetWidth; ph = panel.offsetHeight }
      var down = ph <= below || below >= above
      var mh = Math.max(down ? below : above, 140)
      // still too tall: a compact panel that fits the viewport slides over the anchor (the clamp below) rather than
      // hiding its swatches behind an inner scroll; anything else scrolls inside
      if (ph > mh && !(o.compact && ph <= vh - 2 * m)) { ps.maxHeight = mh + 'px'; ph = mh }
      var x = isRtl(a) ? r.right - pw : r.left
      x = clamp(x, m, Math.max(m, vw - pw - m))
      var y = clamp(down ? r.bottom + g : r.top - g - ph, m, Math.max(m, vh - ph - m))
      ps.left = Math.round(x) + 'px'; ps.top = Math.round(y) + 'px'
      panel.setAttribute('data-side', down ? 'bottom' : 'top')
      ps.transformOrigin = Math.round(clamp(r.left + r.width / 2 - x, 0, pw)) + 'px ' + (down ? '0' : '100%')
    }
    L.owns = function (t) { return (o.owner && o.owner.contains(t)) || (L.anchor && L.anchor.contains && L.anchor.contains(t)) }
    return L
  }
  D.addEventListener('pointerdown', function (e) {
    var L = current; if (!L) return
    var t = e.target
    if (L.root.contains(t) || L.owns(t)) return
    L.close(false)
  }, true)

  /* every popover close: CustomEvent 'wikit:close' on the target + opts.onClose, detail { value, changed } */
  function closedEv(t, v, was, opts) {
    var d = { value: v, changed: v !== was }
    fire(t, 'wikit:close', d)
    if (opts && opts.onClose) try { opts.onClose(d) } catch (e) { }
  }
  function base(kind, host) {
    var I = { kind: kind, el: host, offs: [], refresh: function () { }, destroy: function () { } }
    REG.set(host, I)
    return I
  }

  /* ───────── 1. Colour picker ─────────
     colorPicker(target, opts): target = <input type=color> (enhanced in place) or any element (becomes the trigger).
     opts: value, label, palette ([hex | {name,color}] or a function returning one, read each time it opens),
           paletteLabel (string or function), swatches (false | [hex | [name,hex]]), recent (true), eyedropper (true),
           closeOnSwatch (false: a swatch click applies live and keeps the picker open; Enter / double-click commits),
           returnTo (element or function: where focus goes on close; default the trigger, else whatever opened it),
           preview (element or function: on phones it is scrolled into view above the sheet), compact (true),
           onInput(hex), onChange(hex), onClose({value, changed}).
     Events: input (live) + change (commit, when the popover closes with a new colour) + wikit:close (every close,
     detail {value, changed}). On a native input input/change are plain Events on it; otherwise CustomEvents with
     detail.value. Instance: value, open(), close(), isOpen(), refresh(), setPalette(list, label), destroy(). */
  function colorPicker(t, opts) {
    if (REG.has(t)) return REG.get(t)
    opts = opts || {}
    var native = t.tagName === 'INPUT' && t.type === 'color'
    var I = base('color', t), raw = null, st = { h: 0, s: 0, v: 0 }, val = '#000000', openVal = null, L = null, ui = {}
    var label = opts.label || nameOf(t, 'Colour')
    function setFromHex(hx) { hx = parseColor(hx); if (!hx) return false; var hsv = rgbHsv.apply(null, hexRgb(hx)); if (hsv.s === 0 || hsv.v === 0) hsv.h = st.h; if (hsv.v === 0) hsv.s = st.s; st = hsv; val = hx; return true }
    function paintTrigger() {
      t.style.setProperty('--wk-color', val)
      if (!native && t.classList.contains('wk-swatch')) t.setAttribute('aria-label', label + ': ' + val.toUpperCase())
    }
    function emit(type) {
      if (native) { raw.set(val); fire(t, type) } else fire(t, type, { value: val })
      var cb = type === 'change' ? opts.onChange : opts.onInput; if (cb) try { cb(val) } catch (e) { }
    }
    function pick(fromState, hx, live) {
      if (fromState) val = rgbHex.apply(null, hsvRgb(st.h, st.s, st.v))
      else if (!setFromHex(hx)) return
      paint(); paintTrigger(); if (live !== false) emit('input')
    }
    function opt(k) { var v = opts[k]; if (typeof v === 'function') { try { v = v() } catch (e) { v = null } } return v }
    function elOf(v) { if (typeof v === 'function') { try { v = v() } catch (e) { v = null } } return v && v.nodeType === 1 ? v : null }
    function sw(c, name) { var hx = parseColor(c); return hx ? '<button type="button" class="wk-sw" data-c="' + hx + '" style="--sw:' + hx + '" aria-label="' + esc((name ? name + ', ' : '') + hx.toUpperCase()) + '" aria-pressed="false"></button>' : '' }
    function group(title, items, cls) { return items ? '<div class="wk-cp-group' + (cls ? ' ' + cls : '') + '"><p class="wk-cp-gt" aria-hidden="true">' + esc(title) + '</p><div class="wk-cp-sws" role="group" aria-label="' + esc(title) + '">' + items + '</div></div>' : '' }
    function recentList() { var r = store('wikit-recent-colours'); return Array.isArray(r) ? r.filter(parseColor).slice(0, 10) : [] }
    // the swatch groups are drawn each time the picker opens (and on setPalette), so late / changing palettes just work
    function fillSwatches() {
      if (!L) return
      var list = opt('palette'), seen = {}
      var pal = Array.isArray(list) ? list.map(function (p) {
        var c = p && typeof p === 'object' ? p.color : p, hx = parseColor(c)
        if (!hx || seen[hx]) return ''
        seen[hx] = 1; return typeof p === 'string' ? sw(p) : sw(p.color, p.name)
      }).join('') : ''
      var br = opts.swatches === false ? '' : (opts.swatches || BRAND).map(function (p) { return Array.isArray(p) ? sw(p[1], p[0]) : sw(p) }).join('')
      var rl = opts.recent === false ? [] : recentList()
      ui.sws.innerHTML = group(opt('paletteLabel') || 'Palette', pal, 'is-pal') + group('with icons', br, 'is-brand') + group('Recent', rl.map(function (c) { return sw(c) }).join(''), 'wk-cp-recentbox')
      ui.sws.hidden = !ui.sws.children.length
      paint()
    }
    function build() {
      L = Layer({ cls: 'wk-cp', role: 'dialog', label: label, trap: true, owner: t, aria: !native, anchor: anchor, compact: opts.compact !== false,
        returnTo: function () { return [elOf(opts.returnTo), shown(t) ? t : null, L.opener, t] },
        reveal: function () { return elOf(opts.preview) }, onClose: closed })
      var eye = opts.eyedropper !== false && 'EyeDropper' in W
      L.body.innerHTML =
        '<div class="wk-cp-sv" role="slider" tabindex="0" dir="ltr" aria-label="Saturation and brightness" aria-valuemin="0" aria-valuemax="100"><span class="wk-cp-svk"></span></div>' +
        '<div class="wk-cp-row">' + (eye ? '<button type="button" class="wk-ib wk-cp-eye" aria-label="Pick a colour from the screen" title="Pick from screen">' + ICO.drop + '</button>' : '') +
        '<div class="wk-cp-hue" role="slider" tabindex="0" dir="ltr" aria-label="Hue" aria-valuemin="0" aria-valuemax="360"><span class="wk-cp-huek"></span></div></div>' +
        '<div class="wk-cp-row"><span class="wk-cp-prev" aria-hidden="true"><i class="wk-cp-old"></i><i class="wk-cp-new"></i></span>' +
        '<label class="wk-cp-hexf"><span class="wk-vh">Colour code</span><input class="wk-cp-hex" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby=""></label></div>' +
        '<p class="wk-cp-err" role="status" aria-live="polite"></p>' +
        '<div class="wk-cp-swatches"></div>'
      var q = function (s) { return L.body.querySelector(s) }
      ui = { sv: q('.wk-cp-sv'), svk: q('.wk-cp-svk'), hue: q('.wk-cp-hue'), huek: q('.wk-cp-huek'), hex: q('.wk-cp-hex'), err: q('.wk-cp-err'), old: q('.wk-cp-old'), sws: q('.wk-cp-swatches') }
      var errId = uid('e'); ui.err.id = errId; ui.hex.setAttribute('aria-describedby', errId)
      drag(ui.sv, function (x, y) { st.s = x; st.v = 1 - y; pick(true) })
      drag(ui.hue, function (x) { st.h = x * 360; pick(true) })
      ui.sv.addEventListener('keydown', function (e) {
        var k = e.key, d = e.shiftKey ? 0.1 : 0.01, dx = 0, dy = 0
        if (k === 'ArrowLeft') dx = -d; else if (k === 'ArrowRight') dx = d; else if (k === 'ArrowUp') dy = d; else if (k === 'ArrowDown') dy = -d
        else if (k === 'PageUp') dy = 0.1; else if (k === 'PageDown') dy = -0.1; else if (k === 'Home') dx = -1; else if (k === 'End') dx = 1
        else if (k === 'Enter') { e.preventDefault(); L.close(true); return } else return
        e.preventDefault(); st.s = clamp(st.s + dx, 0, 1); st.v = clamp(st.v + dy, 0, 1); pick(true)
      })
      ui.hue.addEventListener('keydown', function (e) {
        var k = e.key, d = e.shiftKey ? 10 : 1, h = st.h
        if (k === 'ArrowLeft' || k === 'ArrowDown') h -= d; else if (k === 'ArrowRight' || k === 'ArrowUp') h += d
        else if (k === 'PageUp') h += 30; else if (k === 'PageDown') h -= 30; else if (k === 'Home') h = 0; else if (k === 'End') h = 359
        else if (k === 'Enter') { e.preventDefault(); L.close(true); return } else return
        e.preventDefault(); st.h = (h + 360) % 360; pick(true)
      })
      ui.hex.addEventListener('input', function () {
        var hx = parseColor(ui.hex.value), bad = !hx && ui.hex.value.trim() !== ''
        ui.hex.setAttribute('aria-invalid', bad ? 'true' : 'false'); ui.err.textContent = bad ? 'Use a code like #FF5A36, F53 or rgb(255 90 54)' : ''
        if (hx) pick(false, hx)
      })
      ui.hex.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (parseColor(ui.hex.value)) L.close(true) } })
      ui.hex.addEventListener('blur', function () { ui.hex.value = val.toUpperCase(); ui.hex.setAttribute('aria-invalid', 'false'); ui.err.textContent = '' })
      // a swatch tries the colour live and keeps the picker open (unless closeOnSwatch); Enter / double-click commits + closes
      L.body.addEventListener('click', function (e) {
        var b = e.target.closest('.wk-sw')
        if (b) { pick(false, b.getAttribute('data-c')); if (opts.closeOnSwatch) L.close(true); return }
        if (e.target.closest('.wk-cp-eye')) {
          try { new W.EyeDropper().open().then(function (r) { pick(false, r.sRGBHex) }, function () { }) } catch (x) { }
        }
      })
      L.body.addEventListener('dblclick', function (e) { if (e.target.closest('.wk-sw') && L.isOpen) L.close(true) })
      L.body.addEventListener('keydown', function (e) {
        var b = e.key === 'Enter' && e.target.closest && e.target.closest('.wk-sw')
        if (b) { e.preventDefault(); pick(false, b.getAttribute('data-c')); L.close(true) }
      })
    }
    function drag(area, fn) {
      area.addEventListener('pointerdown', function (e) {
        if (e.button) return
        e.preventDefault(); focus(area); area.classList.add('is-drag')
        try { area.setPointerCapture(e.pointerId) } catch (x) { }
        var mv = function (ev) { var r = area.getBoundingClientRect(); fn(clamp((ev.clientX - r.left) / r.width, 0, 1), clamp((ev.clientY - r.top) / r.height, 0, 1)) }
        var up = function () { area.classList.remove('is-drag'); area.removeEventListener('pointermove', mv); area.removeEventListener('pointerup', up); area.removeEventListener('pointercancel', up) }
        mv(e); area.addEventListener('pointermove', mv); area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up)
      })
    }
    function paint() {
      if (!L) return
      var hue = rgbHex.apply(null, hsvRgb(st.h, 1, 1))
      L.panel.style.setProperty('--wk-hue', hue); L.panel.style.setProperty('--wk-c', val)
      ui.svk.style.left = st.s * 100 + '%'; ui.svk.style.top = (1 - st.v) * 100 + '%'; ui.huek.style.left = st.h / 3.6 + '%'
      var sp = Math.round(st.s * 100), vp = Math.round(st.v * 100), hd = Math.round(st.h)
      ui.sv.setAttribute('aria-valuenow', sp); ui.sv.setAttribute('aria-valuetext', 'Saturation ' + sp + '%, brightness ' + vp + '%, ' + val.toUpperCase())
      ui.hue.setAttribute('aria-valuenow', hd); ui.hue.setAttribute('aria-valuetext', hd + ' degrees, ' + hueName(hd))
      if (D.activeElement !== ui.hex) ui.hex.value = val.toUpperCase()
      ;[].forEach.call(L.body.querySelectorAll('.wk-sw'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-c') === val ? 'true' : 'false') })
    }
    function anchor() {
      if (shown(t)) return t
      var lb = t.closest('label'); if (shown(lb)) return lb
      var a = D.activeElement; if (a && a !== D.body && shown(a)) return a
      return shown(t.parentElement) ? t.parentElement : null
    }
    function open() {
      if (t.disabled || t.getAttribute('aria-disabled') === 'true') return
      if (L && L.isOpen) return
      if (!L) build()
      if (native) setFromHex(t.value)
      openVal = val; ui.old.style.background = val
      fillSwatches()
      L.open(ui.sv)
    }
    function closed() {
      var changed = val !== openVal
      if (changed) {
        if (opts.recent !== false) { var rl = recentList().filter(function (c) { return c !== val }); rl.unshift(val); store('wikit-recent-colours', rl.slice(0, 10)) }
        emit('change')
      }
      var d = { value: val, changed: changed }
      fire(t, 'wikit:close', d)
      if (opts.onClose) try { opts.onClose(d) } catch (e) { }
    }
    function toggle(e) { if (e) e.preventDefault(); if (L && L.isOpen) L.close(true); else open() }
    if (native) {
      raw = patchValue(t, function () { setFromHex(t.value); paintTrigger(); paint() })
      if (shown(t)) t.classList.add('wk-color-native')
      I.offs.push(on(t, 'click', toggle), on(t, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') toggle(e) }))
      t.showPicker = open
      setFromHex(t.value || '#000000')
    } else {
      if (!/^(BUTTON|A|INPUT)$/.test(t.tagName)) { t.setAttribute('role', 'button'); if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '0') }
      if (t.tagName === 'BUTTON' && !t.children.length && !t.textContent.trim()) t.classList.add('wk-swatch')
      t.setAttribute('aria-haspopup', 'dialog'); t.setAttribute('aria-expanded', 'false')
      I.offs.push(on(t, 'click', toggle), on(t, 'keydown', function (e) { if (t.tagName !== 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) toggle(e) }))
      setFromHex(opts.value || t.getAttribute('data-value') || '#111318')
    }
    paintTrigger()
    I.open = open; I.close = function () { if (L) L.close(false) }
    I.isOpen = function () { return !!(L && L.isOpen) }
    I.setPalette = function (list, lab) {
      opts.palette = list; if (lab !== undefined) opts.paletteLabel = lab
      if (L && L.isOpen) { fillSwatches(); L.place() }
      return I
    }
    Object.defineProperty(I, 'value', { get: function () { return val }, set: function (v) { if (native) t.value = v; else if (setFromHex(v)) { paintTrigger(); paint() } } })
    I.refresh = function () { if (native) setFromHex(t.value); paintTrigger(); paint() }
    I.destroy = function () {
      I.close(); I.offs.forEach(function (f) { f() }); if (raw) raw.undo()
      if (native) { delete t.showPicker; t.classList.remove('wk-color-native') } else t.classList.remove('wk-swatch')
      t.removeAttribute('aria-haspopup'); t.removeAttribute('aria-expanded'); REG.delete(t)
    }
    return I
  }

  /* ───────── 2. Dropdown / select (ARIA APG select-only combobox) ─────────
     select(target, opts): target = <select> (enhanced in place) or a container the dropdown is appended to.
     opts: options [{value,label,hint,swatch,icon(html),group,disabled}], value, label, placeholder, name (hidden input),
           search (true | false | 'auto' = when > 8 options), searchLabel, onChange(value), onClose({value, changed}).
     Native <option> extras: data-swatch="#hex", data-icon="<icon name>" (drawn with WI.svg), data-hint="…". */
  function select(t, opts) {
    if (REG.has(t)) return REG.get(t)
    opts = opts || {}
    var native = t.tagName === 'SELECT', I = base('select', t), raw = null, items = [], val = null, openVal = null, act = -1, L = null, list = null, sIn = null, hidden = null, buf = '', bufT = 0
    var cb = el('div', 'wk-select', { role: 'combobox', tabindex: '0', 'aria-haspopup': 'listbox', 'aria-expanded': 'false' }, '<span class="wk-select-lead" aria-hidden="true"></span><span class="wk-select-v"></span><span class="wk-select-chev" aria-hidden="true">' + ICO.chev + '</span>')
    var listId = uid('lb'); cb.setAttribute('aria-controls', listId)
    var lead = cb.firstChild, vEl = cb.children[1]
    function read() {
      if (!native) return (opts.options || []).map(function (o) { return typeof o === 'string' ? { value: o, label: o } : o })
      var out = []
      ;[].forEach.call(t.querySelectorAll('option'), function (op) {
        var g = op.parentNode.tagName === 'OPTGROUP' ? op.parentNode : null
        var ic = op.getAttribute('data-icon')
        out.push({ value: op.value, label: op.label || op.textContent, hint: op.getAttribute('data-hint'), swatch: op.getAttribute('data-swatch'),
          icon: ic && W.WI && W.WI.svg ? W.WI.svg(ic, op.getAttribute('data-icon-style') || 'line', 18) : null, group: g ? g.label : null, disabled: op.disabled || (g && g.disabled) })
      })
      return out
    }
    function leadHtml(it) { return it ? (it.swatch ? '<i class="wk-dot" style="--sw:' + esc(it.swatch) + '"></i>' : it.icon ? '<span class="wk-ic">' + it.icon + '</span>' : '') : '' }
    function idx(v) { for (var i = 0; i < items.length; i++) if (items[i].value === v) return i; return -1 }
    function paint() {
      var i = idx(val), it = items[i]
      vEl.textContent = it ? it.label : (opts.placeholder || 'Choose…'); cb.classList.toggle('is-empty', !it)
      lead.innerHTML = leadHtml(it); lead.hidden = !lead.innerHTML
      var dis = native ? t.disabled : !!opts.disabled
      cb.setAttribute('aria-disabled', dis ? 'true' : 'false'); cb.setAttribute('tabindex', dis ? '-1' : '0')
      if (list) [].forEach.call(list.querySelectorAll('[role=option]'), function (o) { o.setAttribute('aria-selected', items[+o.getAttribute('data-i')].value === val ? 'true' : 'false') })
    }
    function build() {
      var useSearch = opts.search === true || (opts.search !== false && items.length > 8)
      L = Layer({ cls: 'wk-sl', owner: cb, anchor: function () { return cb }, matchWidth: true, returnTo: function () { return cb }, onClose: function () { cb.removeAttribute('aria-activedescendant'); if (sIn) { sIn.value = ''; filter('') } closedEv(t, val, openVal, opts) } })
      L.body.innerHTML = (useSearch ? '<div class="wk-sl-search">' + ICO.search + '<input type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" autocomplete="off" spellcheck="false"></div>' : '') +
        '<div class="wk-sl-list" role="listbox" id="' + listId + '" tabindex="-1"></div><p class="wk-sl-empty" hidden>No matches</p>'
      list = L.body.querySelector('.wk-sl-list')
      var lid = cb.getAttribute('aria-labelledby'), ln = cb.getAttribute('aria-label')
      if (lid) list.setAttribute('aria-labelledby', lid); else list.setAttribute('aria-label', ln || 'Options')
      sIn = L.body.querySelector('.wk-sl-search input')
      if (sIn) {
        sIn.setAttribute('aria-controls', listId); sIn.setAttribute('aria-label', opts.searchLabel || 'Filter ' + (ln || nameOf(native ? t : cb, 'options')).toLowerCase())
        sIn.setAttribute('placeholder', 'Search'); sIn.addEventListener('input', function () { filter(sIn.value) }); sIn.addEventListener('keydown', keys)
      }
      list.addEventListener('pointerdown', function (e) { e.preventDefault() })
      list.addEventListener('pointermove', function (e) { var o = e.target.closest('[role=option]'); if (o && !o.hidden && o.getAttribute('aria-disabled') !== 'true') setAct(+o.getAttribute('data-i'), true) })
      list.addEventListener('click', function (e) { var o = e.target.closest('[role=option]'); if (o && o.getAttribute('aria-disabled') !== 'true') choose(+o.getAttribute('data-i')) })
      fill()
    }
    function fill() {
      var html = '', g = null, gi = 0
      items.forEach(function (it, i) {
        if ((it.group || null) !== g) {
          if (g !== null) html += '</div>'
          g = it.group || null
          if (g !== null) { var gid = listId + '-g' + (gi++); html += '<div role="group" aria-labelledby="' + gid + '" class="wk-sl-g"><p class="wk-sl-gl" id="' + gid + '" role="presentation">' + esc(g) + '</p>' }
        }
        html += '<div role="option" class="wk-opt" id="' + listId + '-' + i + '" data-i="' + i + '" aria-selected="false"' + (it.disabled ? ' aria-disabled="true"' : '') + '>' +
          '<span class="wk-opt-lead" aria-hidden="true">' + leadHtml(it) + '</span><span class="wk-opt-l">' + esc(it.label) + (it.hint ? '<small>' + esc(it.hint) + '</small>' : '') + '</span>' +
          '<span class="wk-opt-chk" aria-hidden="true">' + ICO.check + '</span></div>'
      })
      if (g !== null) html += '</div>'
      list.innerHTML = html; paint()
    }
    function opt(i) { return list && list.querySelector('[data-i="' + i + '"]') }
    function usable(i) { var o = opt(i); return o && !o.hidden && !items[i].disabled }
    function setAct(i, noScroll) {
      var p = opt(act); if (p) p.classList.remove('is-active')
      act = i; var o = opt(i); if (!o) return
      o.classList.add('is-active'); (sIn || cb).setAttribute('aria-activedescendant', o.id)
      if (!noScroll) { try { o.scrollIntoView({ block: 'nearest' }) } catch (e) { } }
    }
    function move(from, dir, n) {
      var i = from, last = from, c = n || 1
      while (c > 0) { i += dir; if (i < 0 || i >= items.length) break; if (usable(i)) { last = i; c-- } }
      if (last !== from || usable(last)) setAct(last)
    }
    function edge(first) { for (var k = 0; k < items.length; k++) { var i = first ? k : items.length - 1 - k; if (usable(i)) return setAct(i) } }
    function filter(q) {
      q = q.trim().toLowerCase(); var any = false
      items.forEach(function (it, i) { var o = opt(i), hit = !q || (it.label + ' ' + (it.hint || '') + ' ' + it.value).toLowerCase().indexOf(q) > -1; o.hidden = !hit; any = any || hit })
      ;[].forEach.call(list.querySelectorAll('.wk-sl-g'), function (g) { g.hidden = !g.querySelector('[role=option]:not([hidden])') })
      L.body.querySelector('.wk-sl-empty').hidden = any
      if (!usable(act)) edge(true)
      L.place()
    }
    function open(at) {
      if (cb.getAttribute('aria-disabled') === 'true') return
      items = read(); if (!L) build(); else fill()
      var focusTo = sIn && (mq('(pointer: fine)') || at === 'key') ? sIn : null
      openVal = val
      L.open(focusTo)
      var i = idx(val)
      if (at === 'first') edge(true); else if (at === 'last') edge(false); else if (usable(i)) setAct(i); else edge(true)
    }
    function close(ret) { if (L) L.close(ret) }
    function setVal(v, emitIt) {
      if (v === val) return
      val = v
      if (native) raw.set(v)
      if (hidden) hidden.value = v
      paint()
      if (emitIt) {
        if (native) { fire(t, 'input'); fire(t, 'change') } else { fire(t, 'input', { value: v }); fire(t, 'change', { value: v }) }
        if (opts.onChange) try { opts.onChange(v) } catch (e) { }
      }
    }
    function choose(i) { if (!items[i] || items[i].disabled) return; setVal(items[i].value, true); close(true) }
    function typeahead(ch) {
      clearTimeout(bufT); bufT = setTimeout(function () { buf = '' }, 600)
      buf = (buf.length === 1 && buf === ch ? '' : buf) + ch
      var n = items.length, start = buf.length === 1 ? act + 1 : act
      for (var k = 0; k < n; k++) { var i = ((start < 0 ? 0 : start) + k) % n; if (usable(i) && items[i].label.toLowerCase().indexOf(buf) === 0) return setAct(i) }
    }
    function keys(e) {
      var k = e.key, isOpen = L && L.isOpen, inSearch = e.target === sIn
      if (!isOpen) {
        if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); open('key') }
        else if (k === 'Home' || k === 'End') { e.preventDefault(); open(k === 'Home' ? 'first' : 'last') }
        else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { open('key'); if (!sIn) typeahead(k.toLowerCase()); else { e.preventDefault(); sIn.value = k; filter(k) } }
        return
      }
      if (k === 'ArrowDown' && e.altKey) return
      if (k === 'ArrowDown') { e.preventDefault(); move(act, 1) }
      else if (k === 'ArrowUp') { e.preventDefault(); if (e.altKey) choose(act); else move(act, -1) }
      else if (k === 'PageDown') { e.preventDefault(); move(act, 1, 10) }
      else if (k === 'PageUp') { e.preventDefault(); move(act, -1, 10) }
      else if ((k === 'Home' || k === 'End') && !inSearch) { e.preventDefault(); edge(k === 'Home') }
      else if (k === 'Enter' || (k === ' ' && !inSearch && !buf)) { e.preventDefault(); if (usable(act)) choose(act); else close(true) }
      else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true) }
      else if (k === 'Tab') { if (usable(act)) setVal(items[act].value, true); close(false); if (inSearch) { e.preventDefault(); focus(cb) } }
      else if (!inSearch && k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); typeahead(k.toLowerCase()) }
    }
    I.offs.push(on(cb, 'keydown', keys), on(cb, 'click', function () { if (L && L.isOpen) close(true); else open() }))
    if (native) {
      var ids = labelIds(t)
      if (ids.length) cb.setAttribute('aria-labelledby', ids.join(' ')); else cb.setAttribute('aria-label', opts.label || nameOf(t, 'Options'))
      raw = patchValue(t, function () { val = t.value; paint() })
      var ti = t.getAttribute('tabindex')
      hideNative(t); t.parentNode.insertBefore(cb, t.nextSibling)
      val = t.value
      I.offs.push(on(t, 'change', function () { if (t.value !== val) { val = t.value; paint() } }), on(t, 'focus', function () { focus(cb) }))
      labelsOf(t).forEach(function (l) { I.offs.push(on(l, 'click', function (e) { e.preventDefault(); focus(cb) })) })
      var mo = W.MutationObserver ? new MutationObserver(function () { items = read(); val = t.value; if (L && L.isOpen) fill(); else paint() }) : null
      if (mo) mo.observe(t, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'label', 'data-swatch', 'data-icon'] })
      I.offs.push(function () { if (mo) mo.disconnect(); cb.remove(); unhideNative(t, ti) })
    } else {
      cb.setAttribute('aria-label', opts.label || t.getAttribute('aria-label') || 'Options')
      t.appendChild(cb)
      if (opts.name) { hidden = el('input', null, { type: 'hidden', name: opts.name }); t.appendChild(hidden) }
      val = opts.value != null ? String(opts.value) : null
      if (hidden && val != null) hidden.value = val
      I.offs.push(function () { cb.remove(); if (hidden) hidden.remove() })
    }
    items = read(); paint()
    I.combobox = cb; I.open = open; I.close = function () { close(false) }
    I.setOptions = function (o, v) { opts.options = o; items = read(); if (v !== undefined) val = v == null ? null : String(v); if (L) fill(); else paint() }
    Object.defineProperty(I, 'value', { get: function () { return val }, set: function (v) { if (native) t.value = v; else { val = v == null ? null : String(v); if (hidden) hidden.value = val || ''; paint() } } })
    I.refresh = function () { items = read(); if (native) val = t.value; if (L) fill(); else paint() }
    I.destroy = function () { close(false); I.offs.forEach(function (f) { f() }); if (raw) raw.undo(); REG.delete(t) }
    return I
  }

  /* ───────── 3. Slider: the native range stays on top (transparent) and keeps doing pointer, touch, keys and a11y;
     we draw the track, fill, thumb and value bubble underneath. opts: format(value) → bubble text, bubble (true). ───────── */
  function wrapNative(n, cls) {
    var w = el('span', cls)
    n.parentNode.insertBefore(w, n); return w
  }
  function unwrap(w, n) { if (w.parentNode) { w.parentNode.insertBefore(n, w); w.parentNode.removeChild(w) } }
  function slider(n, opts) {
    if (REG.has(n)) return REG.get(n)
    opts = opts || {}
    var I = base('slider', n), pd = '', nw = n.offsetWidth
    try { pd = getComputedStyle(n.parentNode).display } catch (e) { }
    var w = wrapNative(n, 'wk-slider')
    if (!/flex|grid/.test(pd) && nw) w.style.inlineSize = Math.max(nw, 140) + 'px'
    w.innerHTML = '<span class="wk-sld-track" aria-hidden="true"><span class="wk-sld-fill"></span></span><span class="wk-sld-thumb" aria-hidden="true">' + (opts.bubble === false ? '' : '<span class="wk-sld-bub"></span>') + '</span>'
    w.appendChild(n); n.classList.add('wk-sld-in')
    var bub = w.querySelector('.wk-sld-bub')
    function text() {
      if (opts.format) try { return opts.format(+n.value) } catch (e) { }
      return n.getAttribute('aria-valuetext') || (n.value + (n.getAttribute('data-unit') || ''))
    }
    function paint() {
      var mn = parseFloat(n.min), mx = parseFloat(n.max); if (isNaN(mn)) mn = 0; if (isNaN(mx)) mx = 100
      w.style.setProperty('--wk-p', mx > mn ? clamp((parseFloat(n.value) - mn) / (mx - mn), 0, 1) : 0)
      w.classList.toggle('is-disabled', n.disabled)
      if (bub) bub.textContent = text()
    }
    var raw = patchValue(n, paint)
    var up = function () { w.classList.remove('is-active') }
    I.offs.push(on(n, 'input', paint), on(n, 'change', paint),
      on(n, 'pointerdown', function () { w.classList.add('is-active') }), on(n, 'pointerup', up), on(n, 'pointercancel', up), on(n, 'blur', up),
      observeAttrs(n, ['min', 'max', 'step', 'disabled', 'aria-valuetext', 'value'], function () { (W.requestAnimationFrame || setTimeout)(paint) }))
    paint()
    I.wrapper = w; I.refresh = paint
    Object.defineProperty(I, 'value', { get: function () { return +n.value }, set: function (v) { n.value = v } })
    I.destroy = function () { I.offs.forEach(function (f) { f() }); raw.undo(); n.classList.remove('wk-sld-in'); unwrap(w, n); REG.delete(n) }
    return I
  }

  /* ───────── 4a. Number stepper: −/+ buttons (press-and-hold repeats) around the native number field ───────── */
  function stepper(n, opts) {
    if (REG.has(n)) return REG.get(n)
    opts = opts || {}
    var I = base('stepper', n), w = wrapNative(n, 'wk-stepper'), nm = nameOf(n, '')
    var dn = el('button', 'wk-step', { type: 'button', tabindex: '-1', 'aria-label': 'Decrease' + (nm ? ' ' + nm : '') }, ICO.minus)
    var upB = el('button', 'wk-step', { type: 'button', tabindex: '-1', 'aria-label': 'Increase' + (nm ? ' ' + nm : '') }, ICO.plus)
    if (!n.id) n.id = uid('n')
    dn.setAttribute('aria-controls', n.id); upB.setAttribute('aria-controls', n.id)
    w.appendChild(dn); w.appendChild(n); w.appendChild(upB); n.classList.add('wk-step-in')
    var tm = 0, moved = false
    function paint() {
      var v = parseFloat(n.value), mn = parseFloat(n.min), mx = parseFloat(n.max)
      dn.disabled = n.disabled || (!isNaN(mn) && v <= mn); upB.disabled = n.disabled || (!isNaN(mx) && v >= mx)
      w.classList.toggle('is-disabled', n.disabled)
    }
    function step(d) {
      var before = n.value
      try { if (d > 0) n.stepUp(); else n.stepDown() } catch (e) { var s = parseFloat(n.step) || 1; raw.set((parseFloat(n.value) || 0) + d * s) }
      if (n.value !== before) { moved = true; fire(n, 'input') }
      paint()
    }
    function stop() { clearTimeout(tm); if (moved) { moved = false; fire(n, 'change') } }
    function press(b, d) {
      I.offs.push(on(b, 'pointerdown', function (e) {
        if (e.button) return
        e.preventDefault(); b.classList.add('is-press'); step(d)
        var rep = function (ms) { tm = setTimeout(function () { step(d); rep(Math.max(35, ms * 0.75)) }, ms) }; rep(380)
      }), on(b, 'pointerup', function () { b.classList.remove('is-press'); stop() }), on(b, 'pointerleave', function () { b.classList.remove('is-press'); stop() }), on(b, 'pointercancel', stop),
      on(b, 'click', function (e) { if (e.detail === 0) { step(d); stop() } }))
    }
    var raw = patchValue(n, paint)
    press(dn, -1); press(upB, 1)
    I.offs.push(on(n, 'input', paint), on(n, 'change', paint), observeAttrs(n, ['min', 'max', 'disabled'], paint))
    paint()
    I.wrapper = w; I.refresh = paint
    Object.defineProperty(I, 'value', { get: function () { return n.value === '' ? null : +n.value }, set: function (v) { n.value = v } })
    I.destroy = function () { stop(); I.offs.forEach(function (f) { f() }); raw.undo(); n.classList.remove('wk-step-in'); dn.remove(); upB.remove(); unwrap(w, n); REG.delete(n) }
    return I
  }

  /* ───────── 4b. Time picker: a trigger button + popover with hour / minute / AM-PM columns.
     The native <input type=time> stays in the DOM (hidden) as the value holder. opts: hour12 (locale default),
     minuteStep (from the input's step, else 1), label, onClose({value, changed}). ───────── */
  function timePicker(n, opts) {
    if (REG.has(n)) return REG.get(n)
    opts = opts || {}
    var I = base('time', n), L = null, cols = {}, openVal = null, st = { h: 9, m: 0 }
    var h12 = opts.hour12
    if (h12 == null) { try { h12 = !!new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12 } catch (e) { h12 = true } }
    var mStep = opts.minuteStep || Math.max(1, Math.round((parseFloat(n.step) || 60) / 60))
    var vid = uid('tv'), label = opts.label || nameOf(n, 'Time')
    var trig = el('button', 'wk-time', { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' }, '<span class="wk-time-ic" aria-hidden="true">' + ICO.clock + '</span><span class="wk-time-v" id="' + vid + '"></span><span class="wk-select-chev" aria-hidden="true">' + ICO.chev + '</span>')
    var ids = labelIds(n)
    if (ids.length) trig.setAttribute('aria-labelledby', ids.concat(vid).join(' ')); else trig.setAttribute('aria-label', label)
    var vEl = trig.querySelector('.wk-time-v'), ti = n.getAttribute('tabindex')
    hideNative(n); n.parentNode.insertBefore(trig, n.nextSibling)
    function pad(x) { return (x < 10 ? '0' : '') + x }
    function parse(v) { var m = /^(\d{1,2}):(\d{2})/.exec(v || ''); return m ? { h: +m[1] % 24, m: +m[2] % 60 } : null }
    function fmt(s) { if (!s) return '--:--'; return h12 ? ((s.h % 12) || 12) + ':' + pad(s.m) + ' ' + (s.h < 12 ? 'AM' : 'PM') : pad(s.h) + ':' + pad(s.m) }
    function paint() {
      var s = parse(n.value); vEl.textContent = fmt(s); trig.classList.toggle('is-empty', !s)
      trig.disabled = n.disabled
      if (L) {
        var hv = h12 ? ((st.h % 12) || 12) : st.h
        sel(cols.h, hv); sel(cols.m, st.m - st.m % mStep); if (cols.p) sel(cols.p, st.h < 12 ? 0 : 1)
        L.panel.querySelector('.wk-tp-big').textContent = fmt(st)
      }
    }
    function sel(col, v) {
      ;[].forEach.call(col.children, function (o) {
        var on_ = +o.getAttribute('data-v') === v; o.setAttribute('aria-selected', on_ ? 'true' : 'false')
        if (on_) { col.setAttribute('aria-activedescendant', o.id); if (L.isOpen) center(col, o) }
      })
    }
    function center(col, o) { var top = o.offsetTop - (col.clientHeight - o.offsetHeight) / 2; try { col.scrollTo({ top: top, behavior: reduced() || !col._wkReady ? 'auto' : 'smooth' }) } catch (e) { col.scrollTop = top } }
    function col(kind, lab, vals, show) {
      var c = el('div', 'wk-tp-col', { role: 'listbox', tabindex: '0', 'aria-label': lab, 'data-k': kind })
      c.innerHTML = vals.map(function (v, i) { return '<div role="option" class="wk-tp-o" id="' + c.getAttribute('data-k') + '-' + uid('o') + '" data-v="' + v + '">' + show(v, i) + '</div>' }).join('')
      return c
    }
    function set(kind, v, live) {
      if (kind === 'h') st.h = h12 ? (v % 12) + (st.h >= 12 ? 12 : 0) : v
      else if (kind === 'm') st.m = v
      else st.h = (st.h % 12) + (v ? 12 : 0)
      var s = pad(st.h) + ':' + pad(st.m)
      if (n.value !== s) { raw.set(s); if (live !== false) fire(n, 'input') }
      paint()
    }
    function build() {
      L = Layer({ cls: 'wk-tp', role: 'dialog', label: label, trap: true, owner: trig, anchor: function () { return trig }, returnTo: function () { return trig }, onClose: function () { if (n.value !== openVal) fire(n, 'change'); closedEv(n, n.value, openVal, opts) } })
      var hs = [], ms = [], i
      for (i = h12 ? 1 : 0; i <= (h12 ? 12 : 23); i++) hs.push(i)
      if (h12) { hs.pop(); hs.unshift(12) }
      for (i = 0; i < 60; i += mStep) ms.push(i)
      cols.h = col('h', 'Hours', hs, function (v) { return h12 ? v : pad(v) })
      cols.m = col('m', 'Minutes', ms, pad)
      if (h12) cols.p = col('p', 'AM or PM', [0, 1], function (v) { return v ? 'PM' : 'AM' })
      L.body.innerHTML = '<p class="wk-tp-big" aria-hidden="true"></p><div class="wk-tp-cols"></div><div class="wk-tp-foot"><button type="button" class="wk-btn wk-btn-ghost" data-now>Now</button><button type="button" class="wk-btn" data-done>Done</button></div>'
      var box = L.body.querySelector('.wk-tp-cols'); box.appendChild(cols.h); box.appendChild(el('span', 'wk-tp-sep', { 'aria-hidden': 'true' }, ':')); box.appendChild(cols.m); if (cols.p) box.appendChild(cols.p)
      box.addEventListener('click', function (e) { var o = e.target.closest('[role=option]'); if (o) { var c = o.parentNode; focus(c); set(c.getAttribute('data-k'), +o.getAttribute('data-v')) } })
      box.addEventListener('keydown', function (e) {
        var c = e.target.closest('.wk-tp-col'); if (!c) return
        var k = c.getAttribute('data-k'), opts_ = [].map.call(c.children, function (o) { return +o.getAttribute('data-v') })
        var curEl = c.querySelector('[aria-selected=true]'), i = curEl ? opts_.indexOf(+curEl.getAttribute('data-v')) : 0, n_ = opts_.length, j = i
        var key = e.key
        if (key === 'ArrowDown') j = (i + 1) % n_; else if (key === 'ArrowUp') j = (i - 1 + n_) % n_
        else if (key === 'PageDown') j = Math.min(n_ - 1, i + 5); else if (key === 'PageUp') j = Math.max(0, i - 5)
        else if (key === 'Home') j = 0; else if (key === 'End') j = n_ - 1
        else if (key === 'Enter') { e.preventDefault(); L.close(true); return }
        else if (k === 'p' && /^[ap]$/i.test(key)) j = /p/i.test(key) ? 1 : 0
        else if (/^\d$/.test(key) && k !== 'p') {
          var now = Date.now(); c._b = (now - (c._t || 0) < 900 ? (c._b || '') : '') + key; c._t = now
          var want = +c._b, hit = opts_.indexOf(want)
          if (hit < 0) { c._b = key; hit = opts_.indexOf(+key) }
          if (hit < 0) return; j = hit
        } else return
        e.preventDefault(); set(k, opts_[j])
      })
      L.body.querySelector('[data-now]').addEventListener('click', function () { var d = new Date(); st.h = d.getHours(); set('m', d.getMinutes() - d.getMinutes() % mStep) })
      L.body.querySelector('[data-done]').addEventListener('click', function () { L.close(true) })
    }
    function open() {
      if (n.disabled) return
      if (!L) build()
      openVal = n.value
      var s = parse(n.value); if (s) st = s; else { var d = new Date(); st = { h: d.getHours(), m: d.getMinutes() - d.getMinutes() % mStep } }
      L.open(function () { return cols.h })
      paint()
      ;[cols.h, cols.m, cols.p].forEach(function (c) { if (c) c._wkReady = true })
    }
    var raw = patchValue(n, paint)
    I.offs.push(on(trig, 'click', function () { if (L && L.isOpen) L.close(true); else open() }), on(n, 'change', paint), on(n, 'input', paint), on(n, 'focus', function () { focus(trig) }),
      observeAttrs(n, ['disabled', 'value'], paint))
    labelsOf(n).forEach(function (l) { I.offs.push(on(l, 'click', function (e) { e.preventDefault(); focus(trig) })) })
    paint()
    I.trigger = trig; I.open = open; I.close = function () { if (L) L.close(false) }; I.refresh = paint
    Object.defineProperty(I, 'value', { get: function () { return n.value }, set: function (v) { n.value = v } })
    I.destroy = function () { I.close(); I.offs.forEach(function (f) { f() }); raw.undo(); trig.remove(); unhideNative(n, ti); REG.delete(n) }
    return I
  }

  /* ───────── enhance / observe / destroy ───────── */
  var NATIVE = 'select,input[type=color],input[type=range],input[type=number],input[type=time]'
  function kindOf(n) {
    var k = n.getAttribute('data-wikit')
    if (k && k !== 'auto' && k !== '' && k !== 'on') return k
    if (n.tagName === 'SELECT') return n.multiple || n.size > 1 ? null : 'select'
    var t = (n.getAttribute('type') || '').toLowerCase()
    return { color: 'color', range: 'slider', number: 'stepper', time: 'time' }[t] || null
  }
  var MAKE = { color: colorPicker, select: select, slider: slider, stepper: stepper, time: timePicker }
  function enhance(root, o) {
    root = root || D; o = o || {}
    var all = o.all || (root.nodeType === 1 && root.hasAttribute('data-wikit-all')) || (root === D && D.documentElement.hasAttribute('data-wikit-all'))
    var sel = all ? NATIVE + ',[data-wikit]' : '[data-wikit],[data-wikit-all] :is(' + NATIVE + ')', out = []
    var list = [].slice.call(root.querySelectorAll ? root.querySelectorAll(sel) : [])
    if (root.nodeType === 1 && root.matches && root.matches(sel)) list.unshift(root)
    list.forEach(function (n) {
      if (REG.has(n) || n.getAttribute('data-wikit') === 'off' || n.closest('[data-wikit-skip]')) return
      var k = kindOf(n), fn = k && MAKE[k]
      if (!fn) return
      try { out.push(fn(n, o[k] || {})) } catch (e) { if (W.console) console.warn('WIKit: could not enhance', n, e) }
    })
    return out
  }
  function observe(root, o) {
    root = root || D.body
    if (!W.MutationObserver) return function () { }
    var pend = 0, mo = new MutationObserver(function () { if (pend) return; pend = setTimeout(function () { pend = 0; enhance(root, o) }, 0) })
    mo.observe(root, { childList: true, subtree: true }); enhance(root, o)
    return function () { mo.disconnect() }
  }
  function destroy(n) { var I = n && REG.get(n); if (I) I.destroy() }

  W.WIKit = {
    version: '1.1.0', enhance: enhance, observe: observe, colorPicker: colorPicker, select: select, slider: slider, stepper: stepper,
    timePicker: timePicker, destroy: destroy, get: function (n) { return REG.get(n) || null }, close: function () { if (current) current.close(false) },
    parseColor: parseColor, BRAND: BRAND
  }
  if (W.WI && !W.WI.kit) W.WI.kit = W.WIKit
  function auto() { enhance(D) }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', auto); else auto()
})()
