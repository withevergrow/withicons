/* with icons — Live icons: "Change it live" demos and page motion (classic script, works from file://). window.WithLiveMotion.
   Every transition here is the runtime's own (vendor/dynamic/dynamic.js, window.WithLive: transition(), the element's
   `animate`), the same code the snippets on the page tell developers to use:
     [data-lv-upd]  icon pages: a real <with-live-icon animate> fed by a timer, an API poll, a WebSocket or an input, the
                    wire (what arrived), and the code for that source in HTML / React / Vue, following the studio
     [data-lv-dash] live.html: four tiles, four sources, and the code per source x framework
   playInto() moves a box of inline SVG (hero tiles, the studio stage) with WithLive.transition().
   Needs data/live.js (window.WITH_LIVE), vendor/dynamic/dynamic.js, js/live-snippets.js. Pauses off screen, in background
   tabs and with reduced motion (or the site's own "Pause animations"). */
(function () {
  'use strict'
  var W = window, D = document
  var mq = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false }
  function still() { return (W.WI && 'reduced' in W.WI) ? !!W.WI.reduced || !!(W.WI.isStill && W.WI.isStill()) : mq.matches }
  function L() { return W.WithLive || null }
  function SN() { return W.WithLiveSnippets || null }
  function meta(name) { var C = W.WITH_LIVE; if (C) for (var i = 0; i < C.icons.length; i++) if (C.icons[i].name === name) return C.icons[i]; var l = L(); return l && l.get ? l.get(name) : null }
  function $(s, c) { return (c || D).querySelector(s) }
  function $$(s, c) { return Array.prototype.slice.call((c || D).querySelectorAll(s)) }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function short(l) { return String(l).replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+—.*$/, '').replace(/,.*$/, '').trim() }
  function attrOf(k) { var s = SN(); return s ? s.attrOf(k) : String(k).replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase() }) }
  function feedKeys(m) { var s = SN(); return s ? s.feedKeys(m) : [Object.keys(m.params)[0]] }
  function full(m, ps) { var o = {}; Object.keys(m.params).forEach(function (k) { o[k] = ps && ps[k] != null ? ps[k] : (m.defaults && m.defaults[k] != null ? m.defaults[k] : m.params[k].default) }); return o }
  var EASE = 'cubic-bezier(.23,1,.32,1)', SPRING = 'cubic-bezier(.34,1.56,.64,1)'
  // the site's "Pause animations" and prefers-reduced-motion reach the runtime too
  function syncMotion() { var l = L(); if (l && l.setMotion) l.setMotion({ reduced: still() ? true : null }) }

  /* ───────────── words ───────────── */
  var OPT = { usd: '$', eur: '€', gbp: '£', inr: '₹', jpy: '¥', degree: '°', celsius: '°C', fahrenheit: '°F', kelvin: ' K' }
  function pretty(v) { v = String(v); return OPT[v] || (/^[A-Z0-9+%]{1,4}$/.test(v) ? v : v.charAt(0).toUpperCase() + v.slice(1).replace(/-/g, ' ')) }
  // the fed values with their labels: "Count 3", "Charge 70%", "Condition Rain · Temperature 23°"
  function say(m, ps) {
    return feedKeys(m).map(function (k) {
      var p = m.params[k], v = ps[k], t = p.type === 'level' ? Math.round(v * 100) + '%' : p.type === 'enum' ? pretty(v) : p.type === 'text' ? '“' + v + '”' : String(v)
      if (k === 'temperature' || (m.name === 'thermometer-level' && k === 'value')) t += '°'
      return short(p.label) + ' ' + t
    }).join(' · ')
  }
  function json(o) { return JSON.stringify(o).replace(/,"/g, ', "').replace(/":/g, '": ') }
  function apiSlug(m) { var s = SN(); return s ? s.apiSlug(m) : m.name }

  /* ───────────── little motions (transform/opacity only; nothing when still) ───────────── */
  function roll(el, text) {
    if (!el) return
    text = String(text)
    if (el.getAttribute('data-roll') === text) return
    el.setAttribute('data-roll', text)
    if (still() || !el.animate || !el.firstChild) { el.textContent = text; return }
    var old = D.createElement('span'), nu = D.createElement('span')
    old.className = 'lvm-roll-old'; old.textContent = el.textContent
    nu.className = 'lvm-roll-new'; nu.textContent = text
    el.textContent = ''; el.appendChild(nu); el.appendChild(old)
    old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-80%)', opacity: 0 }], { duration: 240, easing: 'ease-in', fill: 'forwards' }).onfinish = function () { if (old.parentNode) old.parentNode.removeChild(old) }
    nu.animate([{ transform: 'translateY(80%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: SPRING })
  }
  /* move a box of inline SVG between two sets of params with the runtime's transition (hero tiles, the studio stage).
     o: { name, from, to, style, ms, box, owner, paint(svgString), done(completed) } */
  function playInto(o) {
    var l = L()
    if (!l || !l.transition) { if (o.done) o.done(false); return { cancel: function () { } } }
    syncMotion()
    var tr = l.transition(o.name, o.from, o.to, o.style, {
      ms: o.ms, owner: o.owner,
      paint: function (p, info) {
        o.paint(l.render(o.name, p, o.style))
        if (info.swap && o.box && o.box.animate && !still()) o.box.animate([{ opacity: 0.15, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EASE })
      },
      done: function (ok) {
        if (ok) {
          // the exact target: drawn by the last frame, else now (cached by then, or in the background)
          try { if (l.cached(o.name, o.to, o.style) || (l.loaded(o.style) && l.cost(o.style) <= 16)) o.paint(l.render(o.name, o.to, o.style)); else l.renderAsync(o.name, o.to, o.style).then(o.paint, function () { }) } catch (e) { }
        }
        if (o.done) o.done(ok)
      }
    })
    return tr
  }

  /* ───────────── feeds: plausible next values for a source ───────────── */
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)) }
  function textOpts(m, k) {
    var out = [], d = m.defaults && m.defaults[k] != null ? m.defaults[k] : m.params[k].default
    ;[d].concat((m.examples || []).map(function (e) { return e[k] })).forEach(function (v) { if (typeof v === 'string' && v && out.indexOf(v) < 0) out.push(v) })
    return out.length > 1 ? out : [d, 'NEW', 'HOT']
  }
  function mins(s) { var m = /^(\d{1,2}):(\d{2})/.exec(String(s || '')); return m ? (+m[1] % 24) * 60 + +m[2] : 0 }
  function hhmm(t) { t = ((Math.round(t) % 1440) + 1440) % 1440; return (t < 600 ? '0' : '') + Math.floor(t / 60) + ':' + (t % 60 < 10 ? '0' : '') + (t % 60) }
  function next(m, cur, src) {
    var o = {}
    feedKeys(m).forEach(function (k) {
      var p = m.params[k], v = cur[k]
      if (m.name === 'thermometer-level' && k === 'value') { o[k] = Math.max(-10, Math.min(42, +v + (Math.random() < .5 ? -1 : 1) * rnd(3, 11))); return }
      if (m.name === 'weather' && k === 'temperature') { o[k] = Math.max(-6, Math.min(36, +v + (Math.random() < .5 ? -1 : 1) * rnd(2, 7))); return }
      if (k === 'from') { o.from = rnd(1, 22); o.to = o.from + rnd(1, 7); return }
      if (k === 'to' && o.to != null) return
      if (p.type === 'level') { var t; do { t = Math.round((0.08 + Math.random() * 0.92) * 100) / 100 } while (Math.abs(t - v) < 0.18); if (p.steps) t = Math.round(t * p.steps) / p.steps; o[k] = t; return }
      if (p.type === 'time') { o[k] = hhmm(mins(v) + (src === 'timer' ? rnd(4, 38) : (Math.random() < .5 ? -1 : 1) * rnd(20, 300))); return }
      if (p.type === 'enum') { var opts = p.options, n; do { n = opts[rnd(0, opts.length - 1)] } while (n === v && opts.length > 1); o[k] = n; return }
      if (p.type === 'text') { var to = textOpts(m, k); o[k] = to[(to.indexOf(v) + 1) % to.length]; return }
      if (p.type === 'number') { var st = p.step || 0.5, r; do { r = Math.round((Math.max(p.min, 1) + Math.random() * (p.max - Math.max(p.min, 1))) / st) * st } while (r === +v); o[k] = Math.round(r * 100) / 100; return }
      var span = p.max - p.min, top = Math.min(p.max, p.min + 120)
      if (k === 'count') { o[k] = Math.random() < .16 ? rnd(1, 3) : Math.min(+v + rnd(1, 4), 120); return }
      if (k === 'day') { o[k] = +v >= 28 ? 1 : +v + 1; return }
      if (src === 'timer') { o[k] = +v >= top ? p.min + 1 : +v + (p.step || 1); return }
      var d = Math.max(1, Math.round(Math.min(span, 120) * (0.1 + Math.random() * 0.25))), nv, guard = 0
      do { nv = Math.max(p.min + (span > 2 ? 1 : 0), Math.min(top, +v + (Math.random() < .5 ? -d : d))) } while (nv === +v && span > 0 && guard++ < 8)
      o[k] = nv
    })
    return o
  }

  /* ───────────── code: lines, highlighted, with the lines that change the icon marked ───────────── */
  function paintCode(codeEl, text) {
    if (!codeEl) return
    var hl = W.WI && W.WI.highlight ? W.WI.highlight : esc, HIT = SN() ? SN().HIT : /setAttribute\(/
    codeEl.setAttribute('data-text', text)   // what Copy copies (the lines below are blocks, without newline characters)
    codeEl.innerHTML = String(text).split('\n').map(function (l) { return '<span class="cl' + (HIT.test(l.trim()) ? ' is-hot' : '') + '">' + (hl(l) || ' ') + '</span>' }).join('')
  }
  function hitCode(box) {
    if (still()) return
    // a short flash on the lines that change the icon (no forced layout: the Web Animations API restarts it)
    $$('.cl.is-hot', box).forEach(function (l) { if (l.animate) l.animate([{ backgroundColor: 'rgba(255, 210, 63, .24)' }, { backgroundColor: 'rgba(255, 210, 63, .24)', offset: 0.3 }, { backgroundColor: 'rgba(255, 210, 63, 0)' }], { duration: 1000, easing: 'ease-out' }) })
  }

  /* ───────────── the demo machine: targets fed by sources ─────────────
     target: { el (<with-live-icon>), m, src, val, chip, chipT, log, cur, logMax, pulse, box } */
  var GAP = { timer: [1200, 1200], fetch: [2600, 2600], socket: [1100, 2800], input: [0, 0] }
  function logLine(t, src, vals) {
    var path = '/api/' + apiSlug(t.m)
    return src === 'fetch' ? '<b class="is-get">GET</b> <span>' + esc(path) + '</span> <i>200</i> <code>' + esc(json(vals)) + '</code>'
      : src === 'socket' ? '<b class="is-ws">ws ←</b> <code>' + esc(json(vals)) + '</code>'
        : '<b class="' + (src === 'timer' ? 'is-tick">tick' : 'is-in">input →') + '</b> <code>' + esc(Object.keys(vals).map(function (k) { return attrOf(k) + ' = ' + vals[k] }).join(', ')) + '</code>'
  }
  function pushLog(t, src, vals) {
    if (!t.log) return
    var idle = $('.is-idle', t.log); if (idle) idle.remove()
    var li = D.createElement('li'); li.innerHTML = logLine(t, src, vals)
    t.log.insertBefore(li, t.log.firstChild)
    while (t.log.children.length > (t.logMax || 3)) t.log.removeChild(t.log.lastChild)
    if (li.animate && !still()) li.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: EASE })
  }
  function idleLog(t, text) { if (t.log) t.log.innerHTML = '<li class="is-idle"><code>' + esc(text) + '</code></li>' }
  function ping(t) { var i = t.chip && t.chip.querySelector('i'); if (i && i.animate && !still()) i.animate([{ transform: 'scale(1)', opacity: 0.9 }, { transform: 'scale(3.2)', opacity: 0 }], { duration: 700, easing: 'ease-out', pseudoElement: '::after' }) }
  // a value arrives: the wire logs it, a pulse travels up into the icon, then the element gets the attribute
  function arrive(t, vals, src, o) {
    // read before any write (no forced layout): how far the pulse rises to reach the icon
    if (t.pulse && !t.rise) t.rise = -Math.round(((t.pulse.parentNode && t.pulse.parentNode.offsetHeight) || 240) * 0.5) + 'px'
    pushLog(t, src, vals); ping(t)
    if (o.onEvent) o.onEvent(t, vals, src)
    var land = function () {
      t.cur = Object.assign({}, t.cur, vals)
      Object.keys(vals).forEach(function (k) { t.el.setAttribute(attrOf(k), vals[k]) })
      if (t.val) roll(t.val, say(t.m, t.cur))
    }
    if (t.pulse && t.pulse.animate && !still()) {
      var rise = t.rise
      var a = t.pulse.animate([{ transform: 'translate(-50%, 0) scale(.5)', opacity: 0 }, { opacity: 1, offset: 0.25 }, { transform: 'translate(-50%, ' + rise + ') scale(1)', opacity: 0 }], { duration: 360, easing: 'cubic-bezier(.5,0,.2,1)' })
      setTimeout(land, 230)
      return a
    }
    land()
  }
  function machine(targets, o) {
    var on = false
    function schedule(t) {
      clearTimeout(t.timer)
      if (!on || t.src === 'input') return
      var g = GAP[t.src] || [1500, 1500], wait = g[0] + Math.random() * (g[1] - g[0])
      if (t.src === 'fetch') {
        t.timer = setTimeout(function () {
          if (!on) return
          if (t.chipT) t.chipT.textContent = 'GET /api/' + apiSlug(t.m) + '…'
          if (t.chip) t.chip.classList.add('is-wait')
          t.timer = setTimeout(function () {
            if (!on) return
            if (t.chip) t.chip.classList.remove('is-wait')
            chipText(t); arrive(t, next(t.m, t.cur, 'fetch'), 'fetch', o); schedule(t)
          }, 380)
        }, wait - 380)
      } else t.timer = setTimeout(function () { if (!on) return; arrive(t, next(t.m, t.cur, t.src), t.src, o); schedule(t) }, wait)
    }
    function chipText(t) {
      if (!t.chipT) return
      t.chipT.textContent = t.src === 'input' ? 'Your input' : !on ? 'Paused' : t.src === 'fetch' ? 'Polling every 5 s' : t.src === 'socket' ? 'Connected · wss' : 'Every second'
    }
    function idleText(t) { if (t.logMax > 1 && t.log && $('.is-idle', t.log)) idleLog(t, t.src === 'input' ? 'Move the control to send a value' : !on ? 'Press play to stream values' : t.src === 'fetch' ? 'Waiting for the first answer…' : t.src === 'socket' ? 'Connected, waiting for a message…' : 'Waiting for the first tick…') }
    function set(v) {
      on = !!v
      targets.forEach(function (t) { clearTimeout(t.timer); if (t.chip) { t.chip.classList.toggle('is-on', on || t.src === 'input'); t.chip.classList.remove('is-wait') } chipText(t); idleText(t); if (on) schedule(t) })
      if (o.onState) o.onState(on)
    }
    return {
      play: function () { set(true) }, pause: function () { set(false) }, playing: function () { return on },
      source: function (t, src) {
        t.src = src; clearTimeout(t.timer)
        if (t.log && t.logMax > 1) idleLog(t, '…')
        if (t.chip) { t.chip.classList.toggle('is-on', on || src === 'input'); t.chip.classList.remove('is-wait') }
        chipText(t); idleText(t); if (on) schedule(t)
      },
      input: function (t, vals) { arrive(t, vals, 'input', o) }
    }
  }
  // runs while on screen and the tab is visible; starts paused with reduced motion (Play still works)
  function autoplay(box, mac) {
    var userPaused = still(), seen = false
    function vis(v) { seen = v; if (v && !userPaused) mac.play(); else if (!v && mac.playing()) mac.pause() }
    if (W.WI && W.WI.visibility) W.WI.visibility(box, vis, '0px')
    else if ('IntersectionObserver' in W) new IntersectionObserver(function (es) { vis(es[0].isIntersecting && !D.hidden) }).observe(box)
    return { user: function (playing) { userPaused = !playing; if (playing && seen) mac.play(); else if (!playing) mac.pause() }, seen: function () { return seen } }
  }
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>'
  var PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" fill="currentColor"/></svg>'
  function playBtn(btn, mac, ap) {
    if (!btn) return function () { }
    btn.addEventListener('click', function () { ap.user(!mac.playing()) })
    return function (on) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.innerHTML = (on ? PAUSE : PLAY) + '<span>' + (on ? 'Pause' : 'Play') + '</span>'; btn.setAttribute('aria-label', on ? 'Pause the live updates' : 'Play the live updates') }
  }
  function radios(g, sel, attr, on) {
    var items = $$(sel, g)
    function pick(b, focus) { items.forEach(function (x) { var y = x === b; x.setAttribute(attr, y ? 'true' : 'false'); x.tabIndex = y ? 0 : -1 }); if (focus) b.focus(); on(b) }
    g.addEventListener('click', function (e) { var b = e.target.closest(sel); if (b && g.contains(b)) pick(b) })
    g.addEventListener('keydown', function (e) {
      var i = items.indexOf(D.activeElement); if (i < 0) return
      var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : null
      if (n == null) return; e.preventDefault(); pick(items[(n + items.length) % items.length], true)
    })
    return function (value, a) { var b = items.filter(function (x) { return x.getAttribute(a) === value })[0]; if (b) pick(b) }
  }
  function makeEl(name, ps, look) {
    var el = D.createElement('with-live-icon')
    el.setAttribute('name', name)
    el.setAttribute('size', '100%')
    Object.keys(ps).forEach(function (k) { el.setAttribute(attrOf(k), ps[k]) })
    applyLook(el, look)
    return el
  }
  function applyLook(el, look) {
    if (!look) return
    if (look.style && look.style !== 'line') el.setAttribute('variant', look.style); else el.removeAttribute('variant')
    if (look.color) el.setAttribute('color', look.color); else el.removeAttribute('color')
    if (look.vars && Object.keys(look.vars).length) el.setAttribute('vars', JSON.stringify(look.vars)); else el.removeAttribute('vars')
  }

  /* ───────────── icon pages: [data-lv-upd] ───────────── */
  function initUpd(box) {
    var l = L(), name = box.getAttribute('data-lv-upd'), m = meta(name), S = SN()
    if (!l || !m || !S || !W.customElements || !customElements.get('with-live-icon')) return
    var studio = function () { return (W.LiveStudio && W.LiveStudio.state()) || { params: full(m, {}), style: 'line', size: 48 } }
    var st0 = studio(), fed = feedKeys(m)
    var cur = full(m, st0.params)
    var el = makeEl(name, cur, st0)
    el.setAttribute('animate', '')
    var art = $('[data-upd-art]', box); art.innerHTML = ''; art.appendChild(el)
    box.classList.add('is-live')
    var anim = $('[data-upd-anim]', box), playB = $('[data-upd-play]', box), inputBox = $('[data-upd-input]', box)
    var codeEl = $('#lv-code-upd'), langEl = codeEl && codeEl.closest('.code') && $('.lang', codeEl.closest('.code'))
    var srcSay = $('[data-upd-src-say]', box)
    var t = { el: el, m: m, src: box.getAttribute('data-src') || 'fetch', val: $('[data-upd-val]', box), chip: $('[data-upd-chip]', box), chipT: $('[data-upd-chip-t]', box), log: $('[data-upd-log]', box), pulse: $('[data-upd-pulse]', box), cur: cur, logMax: 3 }
    var paint = function () { }
    var mac = machine([t], { onState: function (on) { paint(on) }, onEvent: function () { setTimeout(function () { hitCode(box) }, 200) } })
    var ap = autoplay(box, mac)
    paint = playBtn(playB, mac, ap)
    paint(false)
    // the code: this source x the framework picked for the section, with what the visitor set in the studio
    var fw = (W.LiveStudio && W.LiveStudio.fw) || 'html', codeT = null
    function code() {
      clearTimeout(codeT)
      codeT = setTimeout(function () {
        var s = studio(), st = { params: Object.assign({}, s.params, t.cur), style: s.style, size: s.size, color: s.color, vars: s.vars, today: s.today, animate: !anim || anim.checked }
        paintCode(codeEl, S.update(m, t.src, fw, st))
        if (langEl) langEl.textContent = (fw === 'html' ? 'HTML' : fw === 'react' ? 'React' : 'Vue') + ' · ' + S.SRC.filter(function (x) { return x.id === t.src })[0].t
      }, 60)
    }
    D.addEventListener('lv:fw', function (e) { fw = e.detail.fw; code() })
    // the studio changed (style, colours, other values, today): the demo element and the code follow
    D.addEventListener('lv:state', function () {
      var s = studio()
      applyLook(el, s)
      Object.keys(m.params).forEach(function (k) { if (fed.indexOf(k) >= 0) return; var a = attrOf(k), v = s.params[k]; if (v != null && el.getAttribute(a) !== String(v)) el.setAttribute(a, v) })
      code()
    })
    var srcG = $('.lv-upd-src', box)
    radios(srcG, '[data-src]', 'aria-checked', function (b) {
      var src = b.getAttribute('data-src')
      box.setAttribute('data-src', src)
      mac.source(t, src)
      buildInput(src === 'input')
      if (playB) playB.hidden = src === 'input'
      if (srcSay) srcSay.textContent = $('b', b).textContent + ': ' + $('small', b).textContent
      code()
    })
    if (anim) anim.addEventListener('change', function () { if (anim.checked) el.setAttribute('animate', ''); else el.removeAttribute('animate'); code() })
    // "User input": the control the snippet builds, wired the same way (input -> setAttribute)
    var built = false
    function buildInput(show) {
      box.classList.toggle('is-input', show)
      if (!show || built) return
      built = true
      var k = fed[0], p = m.params[k], v = t.cur[k], id = 'lvu-in-' + name, html
      if (p.type === 'level') html = '<input class="lv-range lv-upd-range" type="range" id="' + id + '" min="0" max="100" value="' + Math.round(v * 100) + '">'
      else if ((p.type === 'int' || p.type === 'number') && p.max - p.min <= 200) html = '<input class="lv-range lv-upd-range" type="range" id="' + id + '" min="' + p.min + '" max="' + p.max + '" step="' + (p.step || 1) + '" value="' + v + '">'
      else if (p.type === 'int' || p.type === 'number') html = '<input class="lv-upd-field" type="number" id="' + id + '" min="' + p.min + '" max="' + p.max + '" value="' + v + '">'
      else if (p.type === 'time') html = '<input class="lv-upd-field" type="time" id="' + id + '" value="' + v + '">'
      else if (p.type === 'enum') html = '<select class="lv-upd-field" id="' + id + '">' + p.options.map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>' }).join('') + '</select>'
      else html = '<input class="lv-upd-field" id="' + id + '" maxlength="' + (p.maxLength || 4) + '" value="' + esc(v) + '" autocomplete="off" spellcheck="false">'
      inputBox.innerHTML = '<label for="' + id + '">' + esc(short(p.label)) + '</label>' + html
      var inp = $('input, select', inputBox), lt = null
      var paintR = function () { if (inp.type === 'range') inp.style.setProperty('--p', ((inp.value - inp.min) / ((inp.max - inp.min) || 1) * 100) + '%') }
      paintR()
      inp.addEventListener('input', function () {
        paintR()
        var raw = inp.value, val = p.type === 'level' ? raw / 100 : (p.type === 'int' || p.type === 'number') ? +raw : p.type === 'text' ? raw.toUpperCase() : raw
        if (p.type === 'text' && inp.value !== val) inp.value = val
        if ((p.type === 'int' || p.type === 'number') && (isNaN(val) || val < p.min || val > p.max)) return
        var o = {}; o[k] = val
        // exactly what the snippet does: setAttribute; with animate the runtime retargets each change from what is on screen
        t.cur = Object.assign({}, t.cur, o)
        el.setAttribute(attrOf(k), val)
        if (t.val) { t.val.textContent = say(m, t.cur); t.val.setAttribute('data-roll', t.val.textContent) }
        clearTimeout(lt); lt = setTimeout(function () { pushLog(t, 'input', o); ping(t); hitCode(box); code() }, inp.type === 'range' ? 140 : 0)
      })
    }
    code()
  }

  /* ───────────── live.html: [data-lv-dash] four tiles, each fed by its own source ───────────── */
  function initDash(box) {
    var l = L()
    if (!l || !W.customElements || !customElements.get('with-live-icon')) return
    var anim = $('[data-dash-anim]', box), paint = function () { }
    var targets = $$('[data-dash-t]', box).map(function (fig) {
      var name = fig.getAttribute('data-name'), m = meta(name)
      if (!m) return null
      var cur = full(m, JSON.parse(fig.getAttribute('data-ps') || '{}'))
      var el = makeEl(name, cur, { style: fig.getAttribute('data-style') })
      el.setAttribute('animate', '')
      var art = $('[data-dash-art]', fig); art.innerHTML = ''; art.appendChild(el)
      return { el: el, m: m, src: fig.getAttribute('data-src'), val: $('[data-dash-val]', fig), chip: $('[data-dash-chip]', fig), chipT: $('[data-dash-chip-t]', fig), log: $('[data-dash-log]', fig), cur: cur, logMax: 1, fig: fig }
    }).filter(Boolean)
    if (!targets.length) return
    box.classList.add('is-live')
    var codeBox = $('[data-dash-code]')
    var mac = machine(targets, { onState: function (on) { paint(on) }, onEvent: function (t) { if (codeBox && codeBox.getAttribute('data-src') === t.src) hitCode(codeBox) } })
    var ap = autoplay(box, mac)
    paint = playBtn($('[data-dash-play]', box), mac, ap)
    paint(false)
    targets.forEach(function (t) {
      if (t.src !== 'input') return
      var inp = $('input[type="range"]', t.fig); if (!inp) return
      var k = feedKeys(t.m)[0], p = t.m.params[k], lt = null
      var paintR = function () { inp.style.setProperty('--p', ((inp.value - inp.min) / ((inp.max - inp.min) || 1) * 100) + '%') }
      paintR()
      inp.addEventListener('input', function () {
        paintR()
        var o = {}; o[k] = p.type === 'level' ? inp.value / 100 : +inp.value
        t.cur = Object.assign({}, t.cur, o)
        t.el.setAttribute(attrOf(k), o[k])
        if (t.val) { t.val.textContent = say(t.m, t.cur); t.val.setAttribute('data-roll', t.val.textContent) }
        clearTimeout(lt); lt = setTimeout(function () { pushLog(t, 'input', o); ping(t); if (codeBox && codeBox.getAttribute('data-src') === 'input') hitCode(codeBox) }, 140)
      })
    })
    if (anim) anim.addEventListener('change', function () { targets.forEach(function (t) { if (anim.checked) t.el.setAttribute('animate', ''); else t.el.removeAttribute('animate') }) })
    // the code: source (element / API / WebSocket / timer / input) x framework; a tile click picks its source
    if (codeBox) {
      var codes = {}
      try { codes = JSON.parse($('[data-dash-codes]', codeBox).textContent) } catch (e) { }
      var src = 'element', fw = 'html', codeEl = $('#lv-code-lib', codeBox), lang = $('.lang', codeBox)
      var show = function () {
        codeBox.setAttribute('data-src', src)
        var txt = codes[src + '-' + fw]; if (txt) paintCode(codeEl, txt)
        if (lang) lang.textContent = (fw === 'html' ? 'HTML' : fw === 'react' ? 'React' : 'Vue') + ' · ' + ($('[data-dsrc="' + src + '"] b', codeBox) || { textContent: src }).textContent.toLowerCase()
      }
      var pickSrc = radios($('.lv-dash-src', codeBox), '[data-dsrc]', 'aria-checked', function (b) { src = b.getAttribute('data-dsrc'); show() })
      radios($('.lv-dash-fw', codeBox), '[data-fw]', 'aria-selected', function (b) { fw = b.getAttribute('data-fw'); show() })
      targets.forEach(function (t) { t.fig.addEventListener('click', function (e) { if (!e.target.closest('input')) pickSrc(t.src, 'data-dsrc') }) })
      show()
    }
  }

  /* ───────────── decorative loops run only on screen (.lv-live-dot pulses, chips) ───────────── */
  function loopsOnScreen() {
    var els = $$('.lv-live-dot, .lv-upd-chip, .lv-stage-hint')
    if (!('IntersectionObserver' in W)) { els.forEach(function (e) { e.classList.add('is-vis') }); return }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-vis', e.isIntersecting) }) })
    els.forEach(function (e) { io.observe(e) })
  }

  W.WithLiveMotion = { playInto: playInto, roll: roll, say: say, full: full, still: still, paintCode: paintCode, syncMotion: syncMotion }
  function boot() {
    syncMotion()
    if (W.WI && W.WI.on) W.WI.on('motion', syncMotion)
    if (mq.addEventListener) mq.addEventListener('change', syncMotion)
    loopsOnScreen()
    // after js/live.js has set up the studio (W.LiveStudio), so the demo starts from what the visitor set
    setTimeout(function () {
      $$('[data-lv-upd]').forEach(function (b) { try { initUpd(b) } catch (e) { if (W.console) console.error(e) } })
      $$('[data-lv-dash]').forEach(function (b) { try { initDash(b) } catch (e) { if (W.console) console.error(e) } })
    }, 0)
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot()
})()
