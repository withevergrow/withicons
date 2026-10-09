/* with icons — the shared style picker (contract: site/STYLE-PICKER.md). Load after js/site.js, with css/style-picker.css.
   WI.stylePicker = {
     row(el, { current, icon, styles, onPick, max, size, label, actions, onAction, title })  -> { set(style), setIcon(name), destroy() }
     open({ current, icon, anchor, onPick, title, actions, onAction })             -> Promise<style | null>
     remember(style) · recent() · groupOf(style) -> { id, title, blurb } · drawTile(style, icon, size) -> markup
   }
   `actions` (optional, both): extra buttons in the full picker's footer, e.g. the library's "Compare all styles":
   [{ id, label, hint, pressed }]; clicking one calls onAction(id) and closes the picker.
   Tiles draw one icon in every style from data/by-icon/<icon>.js (~100 KB, all styles at once); rich (gradient) styles
   are drawn only as their tile scrolls into view. No icon given: each style's sample (a heart). Vanilla, no build. */
(function () {
  'use strict'
  var W = window, D = document, HTML = D.documentElement
  var KEY = 'with-style', RKEY = 'with-style-recent', SAMPLE = 'heart', MAX_RECENT = 4
  var uid = 0

  function WI() { return W.WI || W.EG || {} }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)) }
  function mq(q) { return !!(W.matchMedia && W.matchMedia(q).matches) }
  function phone() { return mq('(max-width: 640px)') }
  function reduced() { return HTML.classList.contains('reduced') || mq('(prefers-reduced-motion: reduce)') }
  function lsGet(k) { try { return W.localStorage.getItem(k) } catch (e) { return null } }
  function lsSet(k, v) { try { W.localStorage.setItem(k, v) } catch (e) { /* private mode */ } }

  /* ───────── data ───────── */
  function order() {
    var wi = WI(), out = (wi.ORDER || []).slice()
    var list = (wi.data && wi.data().styles) || []
    list.forEach(function (s) { if (out.indexOf(s.name) < 0) out.push(s.name) })
    return out
  }
  function known(st) { return order().indexOf(st) >= 0 }
  function info(st) {
    var wi = WI(), inf = (wi.styleInfo && wi.styleInfo[st]) || {}
    return { title: inf.title || (st.charAt(0).toUpperCase() + st.slice(1)), good: inf.good || '', plain: inf.plain || inf.description || '' }
  }
  function groups() {
    var all = order(), seen = {}
    var gs = (WI().GROUPS || []).map(function (g) {
      var styles = g.styles.filter(function (n) { return all.indexOf(n) >= 0 && !seen[n] && (seen[n] = 1) })
      return { id: g.id, title: g.title, blurb: g.blurb || '', styles: styles }
    }).filter(function (g) { return g.styles.length })
    if (!gs.length) gs = [{ id: 'all', title: 'All styles', blurb: '', styles: [] }]
    all.forEach(function (n) { if (!seen[n]) { seen[n] = 1; gs[gs.length - 1].styles.push(n) } })
    return gs
  }
  function groupOf(st) {
    var g = groups().filter(function (x) { return x.styles.indexOf(st) >= 0 })[0]
    return g ? { id: g.id, title: g.title, blurb: g.blurb } : { id: 'more', title: 'More', blurb: '' }
  }
  function featured() { return (WI().FEATURED || ['line', 'solid', 'duo']).filter(known) }
  function uses() { return (WI().USES || []).map(function (u) { return { id: u.id, title: u.title, styles: u.styles.filter(known) } }) }
  function isNew(st) { return (WI().NEW_STYLES || []).indexOf(st) >= 0 }
  function isRich(st) { var wi = WI(); return wi.isRich ? wi.isRich(st) : false }
  function total() { return order().length }

  function recent() {
    var r = []
    try { r = JSON.parse(lsGet(RKEY) || '[]') } catch (e) { r = [] }
    return (Array.isArray(r) ? r : []).filter(function (s) { return typeof s === 'string' && known(s) }).slice(0, MAX_RECENT)
  }
  function remember(st) {
    if (!st || !known(st)) return
    lsSet(KEY, st)
    var r = [st].concat(recent().filter(function (s) { return s !== st })).slice(0, MAX_RECENT)
    lsSet(RKEY, JSON.stringify(r))
  }

  // extra words people type when looking for a look
  var WORDS = {
    line: 'outline stroke minimal simple thin', solid: 'filled fill bold glyph', duo: 'duotone two tone tint accent gradient saas linear product',
    gloss: 'shiny puffy 3d cute', engrave: 'etching vintage banknote old', blueprint: 'technical engineering plan',
    sketch: 'hand drawn doodle marker', glass: 'frosted blur 3d glassmorphism', kawaii: 'cute face japanese',
    sticker: 'cute y2k die cut', pixel: '8-bit 8bit retro game arcade', retro: '70s vintage seventies',
    luxe: '3d premium gold luxury', bauhaus: 'geometric modernist poster', skeuo: '3d realistic skeuomorphic',
    anime: 'manga cartoon', gothic: 'dark fantasy halloween medieval', pastel: 'cute soft calm',
    coquette: 'cute pink bow girly', plush: 'cute toy kids soft felt', clay: '3d soft ai puffy claymorphism', bento: 'tile card grid',
    suite: 'office colour color enterprise microsoft', dock: 'app icon macos tile ios', liquid: 'glass ios apple 3d refraction',
    chrome: 'metal y2k 3d silver metallic', soft3d: 'soft 3d render blender memoji avatar isometric studio clay depth', brutal: 'neo brutalism bold loud', utsav: 'indian diwali durga puja festive ethnic marigold diya holiday festival', rangoli: 'indian diwali durga puja holi navratri festive festival holiday', halloween: 'spooky pumpkin october scary witch holiday', christmas: 'xmas holiday winter snow festive santa noel', lunar: 'lunar new year chinese new year cny tet seollal red gold holiday festival', valentine: 'valentines love hearts romantic cute pink galentine holiday'
  }
  // own words first (name, copy, jobs, extra words); the group's title and blurb only when nothing matches on its own
  function haystack(st, withGroup) {
    var wi = WI(), inf = (wi.styleInfo && wi.styleInfo[st]) || {}, g = groupOf(st)
    var u = uses().filter(function (x) { return x.styles.indexOf(st) >= 0 }).map(function (x) { return x.title })
    return [st, inf.title, inf.plain, inf.good, inf.who, inf.description, u.join(' '), WORDS[st] || '', isNew(st) ? 'new' : '', withGroup ? g.title + ' ' + g.blurb : '']
      .join(' ').toLowerCase()
  }

  /* ───────── drawing ───────── */
  var SNAP = null
  function snap() {
    if (SNAP) return SNAP
    try { var el = D.getElementById('lib-style-samples'); SNAP = el ? JSON.parse(el.textContent) : {} } catch (e) { SNAP = {} }
    return SNAP
  }
  function innerOf(st, icon) {
    var s = (W.WITH_SVG || W.EGI_SVG || {})[st]; if (s && s[icon] != null) return s[icon]
    var p = W.WITH_ICON && W.WITH_ICON[icon]; if (p && p[st] != null) return p[st]
    if (icon === SAMPLE && snap()[st]) return snap()[st]
    return null
  }
  function svgOf(st, icon, size) {
    var inner = innerOf(st, icon); if (inner == null) return ''
    var wi = WI()
    var s = wi.svgFrom ? wi.svgFrom(inner, st, size) : '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true">' + inner + '</svg>'
    // rich drawings: every copy owns its gradient ids (the same icon shows in the row, Popular and its group at once)
    return wi.uniqIds ? wi.uniqIds(s) : s
  }
  var iconLoads = {}, failed = {}
  function loadIcon(icon) {
    if (W.WITH_ICON && W.WITH_ICON[icon]) return Promise.resolve(true)
    if (iconLoads[icon]) return iconLoads[icon]
    var wi = WI()
    if (!/^[a-z0-9-]+$/.test(icon) || !wi.loadScript) return Promise.resolve(false)
    // the page may already be fetching the same file (the library, the studio): wait for that one
    var tag = D.querySelector('script[src$="data/by-icon/' + icon + '.js"]')
    var fetch = tag && !(W.WITH_ICON && W.WITH_ICON[icon])
      ? new Promise(function (r) { tag.addEventListener('load', r); tag.addEventListener('error', r); setTimeout(r, 8000) })
      : wi.loadScript(wi.url('data/by-icon/' + icon + '.js'))
    iconLoads[icon] = fetch.then(function () {
      var ok = !!(W.WITH_ICON && W.WITH_ICON[icon])
      if (!ok) failed[icon] = 1
      fillWaiting(icon)
      return ok
    })
    return iconLoads[icon]
  }
  // markup of one tile icon: the drawing when it is here, else a same-size skeleton that fills itself in later
  function icMarkup(st, icon, size, lazy) {
    icon = icon || SAMPLE; size = size || 32
    var svg = lazy ? '' : svgOf(st, icon, size)
    if (!svg && !lazy && !(W.WITH_ICON && W.WITH_ICON[icon])) loadIcon(icon)
    return '<span class="sp-ic' + (svg ? '' : ' is-wait') + '" data-sp-st="' + esc(st) + '" data-sp-icon="' + esc(icon) + '" data-sp-size="' + size + '"' +
      (lazy ? ' data-sp-lazy=""' : '') + ' style="--sp-s:' + size + 'px" aria-hidden="true">' + (svg || '<i class="sp-skel"></i>') + '</span>'
  }
  function drawTile(st, icon, size) { return icMarkup(st, icon, size, false) }
  function fillOne(el) {
    if (!el.classList.contains('is-wait')) return true
    if (el.hasAttribute('data-sp-lazy') && !el._seen) return false
    var st = el.getAttribute('data-sp-st'), icon = el.getAttribute('data-sp-icon'), size = +el.getAttribute('data-sp-size') || 32
    var svg = svgOf(st, icon, size)
    if (!svg) {
      if (failed[icon] && icon !== SAMPLE) { el.setAttribute('data-sp-icon', SAMPLE); return fillOne(el) }
      if (!failed[icon]) loadIcon(icon)
      return false
    }
    el.innerHTML = svg; el.classList.remove('is-wait')
    if (!reduced() && el.animate) el.firstChild.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' })
    return true
  }
  function fillWaiting(icon) {
    $$('.sp-ic.is-wait').forEach(function (el) { var i = el.getAttribute('data-sp-icon'); if (!icon || i === icon || failed[i]) fillOne(el) })
  }
  // a style's own data file can bring a drawing too (another script loaded it)
  function hookStyleLoads() { var wi = WI(); if (wi.on && !hookStyleLoads.done) { hookStyleLoads.done = 1; wi.on('style', function () { fillWaiting() }) } }

  var CHECK_SVG = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="M3.5 8.4 6.6 11.4 12.5 4.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  // o.card: the full picker's big tile (a "New" tag and a check on the plate instead of the row's dot)
  function tileHtml(st, o) {
    var inf = info(st), on = st === o.current
    var cls = 'sp-t' + (o.card ? ' sp-card' : '') + (on ? ' is-on' : '') + (o.cls ? ' ' + o.cls : '')
    return '<button type="button" class="' + cls + '" data-sp-pick="' + esc(st) + '" aria-pressed="' + on + '" tabindex="-1"' +
      (o.card ? ' style="--sp-c:var(--c-' + esc(st) + ', var(--ink))"' : '') + '>' +
      '<span class="sp-plate">' + icMarkup(st, o.icon, o.size, o.lazy && isRich(st)) +
        (o.card && isNew(st) ? '<i class="sp-tag" aria-hidden="true">New</i>' : '') +
        (o.card && on ? '<i class="sp-check" aria-hidden="true">' + CHECK_SVG + '</i>' : '') + '</span>' +
      '<span class="sp-n">' + esc(inf.title) + (!o.card && isNew(st) ? '<i class="sp-new" aria-hidden="true"></i>' : '') + '</span>' +
      '<span class="sp-vh">' + (on ? ', selected' : '') + (isNew(st) ? ', new' : '') + (inf.good ? '. Good for ' + esc(inf.good) : '') + '</span>' +
      '</button>'
  }
  var ALL_GLYPH = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="7" height="7" rx="2.2" fill="currentColor"/><rect x="13.5" y="3.5" width="7" height="7" rx="2.2" fill="currentColor" opacity=".55"/><rect x="3.5" y="13.5" width="7" height="7" rx="2.2" fill="currentColor" opacity=".55"/><rect x="13.5" y="13.5" width="7" height="7" rx="2.2" fill="currentColor" opacity=".3"/></svg>'

  /* ───────── hover / focus tip ("good for") ───────── */
  var tipEl = null, tipT = 0, tipWarm = 0
  function tip(btn) {
    clearTimeout(tipT)
    if (!btn) { if (tipEl) tipEl.classList.remove('is-on'); return }
    var st = btn.getAttribute('data-sp-pick'), text
    if (st) { var inf = info(st); text = '<b>' + esc(inf.title) + '</b>' + esc(inf.good || inf.plain) } else text = '<b>' + esc(btn.getAttribute('data-sp-tip') || '') + '</b>'
    if (!tipEl) { tipEl = D.createElement('div'); tipEl.className = 'sp-tip'; tipEl.setAttribute('aria-hidden', 'true') }
    var th = (btn.closest && btn.closest('dialog[open]')) || D.body
    if (tipEl.parentNode !== th) th.appendChild(tipEl)
    tipEl.innerHTML = text
    var r = btn.getBoundingClientRect(), w = tipEl.offsetWidth, h = tipEl.offsetHeight
    var x = Math.max(8, Math.min(W.innerWidth - w - 8, r.left + r.width / 2 - w / 2))
    var y = r.top - h - 8; if (y < 8) y = r.bottom + 8
    tipEl.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)'
    tipEl.classList.add('is-on'); tipWarm = Date.now()
  }
  function tipSoon(btn) { clearTimeout(tipT); tipT = setTimeout(function () { tip(btn) }, Date.now() - tipWarm < 600 ? 0 : 380) }

  /* ───────── roving focus ───────── */
  function visible(el) { return !!(el.offsetWidth || el.offsetHeight) && !el.closest('[hidden]') }
  function rove(list, to) {
    list.forEach(function (b) { b.tabIndex = b === to ? 0 : -1 })
    if (to) to.focus({ preventScroll: false })
  }
  // 2-D arrow movement over buttons laid out in rows (wrapping grids and single rows alike)
  function arrowTarget(list, cur, key) {
    var i = list.indexOf(cur); if (i < 0) return list[0]
    if (key === 'Home') return list[0]
    if (key === 'End') return list[list.length - 1]
    if (key === 'ArrowRight') return list[Math.min(list.length - 1, i + 1)]
    if (key === 'ArrowLeft') return list[Math.max(0, i - 1)]
    var r0 = cur.getBoundingClientRect(), cx = r0.left + r0.width / 2, down = key === 'ArrowDown', best = null, bd = Infinity, rowY = null
    list.forEach(function (b) {
      if (b === cur) return
      var r = b.getBoundingClientRect()
      if (down ? r.top <= r0.top + 4 : r.top >= r0.top - 4) return
      var dy = Math.abs(r.top - r0.top)
      if (rowY != null && Math.abs(dy - rowY) > 4 && dy > rowY) return
      var d = Math.abs(r.left + r.width / 2 - cx)
      if (rowY == null || dy < rowY - 4) { rowY = dy; best = b; bd = d } else if (d < bd) { best = b; bd = d }
    })
    return best
  }

  /* ───────── the compact row ───────── */
  function row(el, o) {
    o = o || {}
    hookStyleLoads()
    var S = { current: known(o.current) ? o.current : 'line', icon: o.icon || null, max: o.max || 8, size: o.size || 32, list: [] }
    el.classList.add('sp-row')
    el.setAttribute('role', 'group'); el.setAttribute('aria-label', o.label || 'Style')
    el.style.setProperty('--sp-s', S.size + 'px')
    function want() { return phone() ? Math.min(S.max, 5) : S.max }
    function pickList() {
      var out = [S.current], n = want()
      ;(o.styles || []).concat(recent(), featured(), order()).forEach(function (s) { if (out.length < n && out.indexOf(s) < 0 && known(s)) out.push(s) })
      return out
    }
    function build() {
      S.list = pickList()
      var t = total()
      el.innerHTML = S.list.map(function (s) { return tileHtml(s, { current: S.current, icon: S.icon, size: S.size }) }).join('') +
        '<button type="button" class="sp-t sp-all" data-sp-all aria-haspopup="dialog" tabindex="-1" aria-label="All ' + t + ' styles">' +
        '<span class="sp-plate">' + ALL_GLYPH + '</span><span class="sp-n">All ' + t + '<span class="sp-all-x"> styles</span></span></button>'
      var on = el.querySelector('.sp-t.is-on') || el.querySelector('.sp-t'); if (on) on.tabIndex = 0
    }
    function paintOn() {
      $$('[data-sp-pick]', el).forEach(function (b) {
        var on = b.getAttribute('data-sp-pick') === S.current
        b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false')
        var vh = b.querySelector('.sp-vh'); if (vh) vh.innerHTML = vh.innerHTML.replace(/^, selected/, '').replace(/^/, on ? ', selected' : '')
      })
      var focusIn = el.contains(D.activeElement)
      if (!focusIn) { var on = el.querySelector('.sp-t.is-on') || el.querySelector('.sp-t'); $$('.sp-t', el).forEach(function (b) { b.tabIndex = b === on ? 0 : -1 }) }
    }
    function set(st) {
      if (!known(st)) return
      S.current = st
      if (S.list.indexOf(st) < 0) build(); else paintOn()
    }
    function setIcon(name) {
      S.icon = name || null
      $$('[data-sp-pick]', el).forEach(function (b) { var p = b.querySelector('.sp-plate'); p.innerHTML = icMarkup(b.getAttribute('data-sp-pick'), S.icon, S.size, false) })
    }
    function openAll(btn) {
      tip(null)
      return open({ current: S.current, icon: S.icon, anchor: btn || el, title: o.title, actions: typeof o.actions === 'function' ? o.actions() : o.actions, onAction: o.onAction })
        .then(function (st) {
          if (!st) return st
          var had = btn && D.activeElement === btn
          set(st)
          // the row may have been rebuilt (a style it did not show): keep the keyboard where it was
          if (had && !btn.isConnected) { var nb = el.querySelector('[data-sp-all]'); if (nb) { $$('.sp-t', el).forEach(function (x) { x.tabIndex = x === nb ? 0 : -1 }); nb.focus({ preventScroll: true }) } }
          if (o.onPick) o.onPick(st)
          return st
        })
    }
    function onClick(e) {
      var b = e.target.closest && e.target.closest('.sp-t'); if (!b || !el.contains(b)) return
      $$('.sp-t', el).forEach(function (x) { x.tabIndex = x === b ? 0 : -1 })
      if (b.hasAttribute('data-sp-all')) { openAll(b); return }
      var st = b.getAttribute('data-sp-pick'); tip(null)
      if (st === S.current) { if (o.onPick) o.onPick(st); return }   // e.g. the library leaves compare mode
      set(st); remember(st)
      if (o.onPick) o.onPick(st)
    }
    function onKey(e) {
      if (!/^(Arrow(Left|Right|Up|Down)|Home|End)$/.test(e.key)) return
      var list = $$('.sp-t', el).filter(visible), to = arrowTarget(list, e.target.closest('.sp-t'), e.key === 'ArrowUp' ? 'ArrowLeft' : e.key === 'ArrowDown' ? 'ArrowRight' : e.key)
      if (to) { e.preventDefault(); rove(list, to); tip(to) }
    }
    function onOver(e) { if (e.pointerType && e.pointerType !== 'mouse') return; var b = e.target.closest && e.target.closest('[data-sp-pick]'); if (b && el.contains(b)) tipSoon(b) }
    function onOut(e) { var b = e.target.closest && e.target.closest('.sp-t'); if (b && !(e.relatedTarget && b.contains(e.relatedTarget))) { clearTimeout(tipT); tip(null) } }
    function onFocus(e) { var b = e.target.closest && e.target.closest('[data-sp-pick]'); if (b && b.matches(':focus-visible')) tip(b) }
    function onBlur() { tip(null) }
    function onMedia() { var n = want(); if (n !== S.list.length) build() }
    var mql = W.matchMedia ? W.matchMedia('(max-width: 640px)') : null
    el.addEventListener('click', onClick); el.addEventListener('keydown', onKey)
    el.addEventListener('pointerover', onOver); el.addEventListener('pointerout', onOut)
    el.addEventListener('focusin', onFocus); el.addEventListener('focusout', onBlur)
    W.addEventListener('scroll', onBlur, { passive: true })
    if (mql) { if (mql.addEventListener) mql.addEventListener('change', onMedia); else if (mql.addListener) mql.addListener(onMedia) }
    build()
    return {
      set: set, setIcon: setIcon, open: openAll, el: el,
      destroy: function () {
        el.removeEventListener('click', onClick); el.removeEventListener('keydown', onKey)
        el.removeEventListener('pointerover', onOver); el.removeEventListener('pointerout', onOut)
        el.removeEventListener('focusin', onFocus); el.removeEventListener('focusout', onBlur)
        W.removeEventListener('scroll', onBlur)
        if (mql) { if (mql.removeEventListener) mql.removeEventListener('change', onMedia); else if (mql.removeListener) mql.removeListener(onMedia) }
        el.innerHTML = ''; el.classList.remove('sp-row')
      }
    }
  }

  /* ───────── the full picker: a centred modal (desktop) / a full-height sheet (phones) ─────────
     Header (title, what the tiles show, search, close) · group rail (desktop) or tabs (phones), scroll-spied ·
     the list: "What are you making?", Recent, Popular (or "Best for …"), then the six groups · footer (the
     hovered / focused style in words, the caller's actions). Rich drawings fill in as their tiles scroll into view. */
  var cur = null   // the open picker
  var SEARCH_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 L20.5 20.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
  var X_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'

  function open(o) {
    o = o || {}
    hookStyleLoads()
    if (cur) cur.close(null, true)
    var id = 'sp' + (++uid), sheet = phone(), current = known(o.current) ? o.current : null, icon = o.icon || null
    var opener = D.activeElement, anchor = o.anchor || null, actions = o.actions || []
    var resolveP, done = false
    var promise = new Promise(function (r) { resolveP = r })
    var SZ = sheet ? 44 : 60
    var tile = function (st, extra) { return tileHtml(st, { current: current, icon: icon, size: SZ, lazy: true, cls: extra, card: true }) }
    var gs = groups(), t = total(), rec = recent()
    var shows = icon ? '“' + icon.replace(/-/g, ' ') + '”' : 'a sample icon'

    function secHtml(key, title, blurb, styles, extra, attrs) {
      return '<section class="sp-sec' + (extra ? ' ' + extra : '') + '" data-sp-sec="' + esc(key) + '" aria-labelledby="' + id + '-s-' + esc(key) + '"' + (attrs || '') + '>' +
        '<div class="sp-sh"><h3 class="sp-gh" id="' + id + '-s-' + esc(key) + '">' + esc(title) + '</h3>' +
          (styles ? '<span class="sp-count" aria-hidden="true">' + styles.length + '</span>' : '') +
          (blurb ? '<p class="sp-blurb">' + esc(blurb) + '</p>' : '') + '</div>' +
        '<div class="sp-grid"' + (key === 'best' ? ' data-sp-best' : '') + '>' + (styles || []).map(function (s) { return tile(s, extra === 'is-top' ? '' : 'in-group') }).join('') + '</div></section>'
    }
    var navItems = (rec.length ? [{ id: 'recent', title: 'Recent', n: rec.length }] : [])
      .concat([{ id: 'top', title: 'Popular', n: featured().length }])
      .concat(gs.map(function (g) { return { id: g.id, title: g.title, n: g.styles.length } }))

    var layer = D.createElement('div')
    layer.className = 'sp-layer ' + (sheet ? 'is-sheet' : 'is-pop')
    layer.innerHTML =
      '<div class="sp-scrim" data-sp-close></div>' +
      '<div class="sp-panel" role="dialog" aria-modal="true" aria-labelledby="' + id + '-h" aria-describedby="' + id + '-d" tabindex="-1">' +
        (sheet ? '<div class="sp-grip" aria-hidden="true"><span></span></div>' : '') +
        '<div class="sp-head">' +
          '<div class="sp-ht"><h2 class="sp-h" id="' + id + '-h">' + esc(o.title || 'Choose a style') + '</h2>' +
            '<p class="sp-sub" id="' + id + '-d">' + t + ' styles · each tile shows ' + esc(shows) + '</p></div>' +
          '<div class="sp-find">' + SEARCH_SVG +
            '<input type="search" class="sp-q" autocomplete="off" spellcheck="false" enterkeyhint="go" placeholder="Search styles: glass, 3D, cute…" aria-label="Search styles" aria-controls="' + id + '-list">' +
          '</div>' +
          '<button type="button" class="sp-x" data-sp-close aria-label="Close">' + X_SVG + '</button>' +
        '</div>' +
        '<div class="sp-body">' +
          '<nav class="sp-nav" aria-label="Style groups"><ul class="sp-navl" role="list">' +
            navItems.map(function (n) {
              return '<li><button type="button" class="sp-go" data-sp-go="' + esc(n.id) + '" tabindex="-1" aria-controls="' + id + '-list">' +
                '<span class="sp-go-t">' + esc(n.title) + '</span><span class="sp-go-n" aria-hidden="true">' + n.n + '</span></button></li>'
            }).join('') +
          '</ul></nav>' +
          '<div class="sp-scroll" id="' + id + '-list" tabindex="-1">' +
            '<div class="sp-uses" role="group" aria-labelledby="' + id + '-u"><p class="sp-l" id="' + id + '-u">What are you making?</p><div class="sp-chips">' +
              uses().map(function (u) { return '<button type="button" class="sp-chip" data-sp-use="' + esc(u.id) + '" aria-pressed="false">' + esc(u.title) + '</button>' }).join('') +
            '</div></div>' +
            (rec.length ? secHtml('recent', 'Recent', '', rec, 'is-top') : '') +
            secHtml('best', 'Best for', 'The best four, best first', [], 'is-top', ' hidden') +
            secHtml('popular', 'Popular', 'Safe picks and the most loved new looks', featured(), 'is-top') +
            gs.map(function (g) { return secHtml(g.id, g.title, g.blurb, g.styles, 'is-group') }).join('') +
            '<p class="sp-empty" hidden></p>' +
          '</div>' +
        '</div>' +
        '<div class="sp-foot"><p class="sp-say" aria-hidden="true"></p>' +
          (actions.length ? '' : '<p class="sp-keys" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> move · <kbd>Enter</kbd> pick · <kbd>Esc</kbd> close</p>') +
          actions.map(function (a) { return '<button type="button" class="sp-act' + (a.pressed ? ' is-on' : '') + '" data-sp-act="' + esc(a.id) + '"' + (a.pressed != null ? ' aria-pressed="' + !!a.pressed + '"' : '') + (a.hint ? ' title="' + esc(a.hint) + '"' : '') + '>' + esc(a.label) + '</button>' }).join('') +
        '</div>' +
        '<p class="sp-vh" aria-live="polite" data-sp-live></p>' +
      '</div>'
    // a modal <dialog> (the studio sheet) sits in the top layer: open inside it so the picker shows above it
    var host = (anchor && anchor.closest && anchor.closest('dialog[open]')) || (opener && opener.closest && opener.closest('dialog[open]')) || D.body
    host.appendChild(layer)
    var panel = layer.querySelector('.sp-panel'), scroll = layer.querySelector('.sp-scroll'), q = layer.querySelector('.sp-q')
    var say = layer.querySelector('.sp-say'), bestSec = layer.querySelector('[data-sp-sec="best"]'), popSec = layer.querySelector('[data-sp-sec="popular"]')
    var usesEl = layer.querySelector('.sp-uses'), empty = layer.querySelector('.sp-empty'), nav = layer.querySelector('.sp-nav'), live = layer.querySelector('[data-sp-live]')
    var useOn = null

    // rich drawings only as their tiles come into view
    var io = 'IntersectionObserver' in W ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target._seen = true; fillOne(e.target); io.unobserve(e.target) } })
    }, { root: scroll, rootMargin: '200px 0px' }) : null
    function watchLazy(root) {
      $$('.sp-ic[data-sp-lazy]', root).forEach(function (el) { if (el._seen) return; if (io) io.observe(el); else { el._seen = true; fillOne(el) } })
    }
    watchLazy(layer)
    loadIcon(icon || SAMPLE).then(function () { if (!done) fillWaiting() })

    function paintSay(st) {
      st = st || current
      if (!st) { say.innerHTML = '<span>Hover or focus a style to see what it is good for.</span>'; return }
      var inf = info(st), g = groupOf(st)
      say.innerHTML = '<b>' + esc(inf.title) + '</b><i>' + esc(g.title) + '</i><span>' + esc(inf.good || inf.plain) + '</span>'
    }
    paintSay()

    // desktop: the panel grows out of the control that opened it (transform-origin), then sits centred
    if (!sheet && anchor && anchor.isConnected) {
      var ar = anchor.getBoundingClientRect(), pr = panel.getBoundingClientRect()
      if (pr.width) panel.style.transformOrigin = Math.round(Math.max(0, Math.min(pr.width, ar.left + ar.width / 2 - pr.left))) + 'px ' + Math.round(Math.max(0, Math.min(pr.height, ar.top + ar.height / 2 - pr.top))) + 'px'
    }
    var onResize = function () { if (phone() !== sheet) close(null) }
    W.addEventListener('resize', onResize)
    // the page behind stays put: no scrolling it from the scrim (phones lock the root; desktop keeps its scrollbar, so nothing shifts)
    var prevOverflow = HTML.style.overflow
    if (sheet) HTML.style.overflow = 'hidden'
    var scrim = layer.querySelector('.sp-scrim')
    var noWheel = function (e) { e.preventDefault() }
    scrim.addEventListener('wheel', noWheel, { passive: false })
    scrim.addEventListener('touchmove', noWheel, { passive: false })

    // in
    layer.offsetWidth // eslint-disable-line no-unused-expressions
    layer.classList.add('is-in')

    // focus: the search on desktop; the panel on phones (no keyboard popping up)
    function tiles() { return $$('[data-sp-pick]', scroll).filter(visible) }
    function homeTile() { var l = tiles(); return l.filter(function (b) { return b.classList.contains('is-on') })[0] || l[0] }
    function setRove(to) { tiles().forEach(function (b) { b.tabIndex = b === to ? 0 : -1 }) }
    setRove(homeTile())
    function navBtns() { return $$('[data-sp-go]', nav).filter(function (b) { return !b.parentNode.hidden }) }
    function navRove(to) { navBtns().forEach(function (b) { b.tabIndex = b === to ? 0 : -1 }) }
    setTimeout(function () {
      if (done) return
      if (sheet) { panel.focus({ preventScroll: true }) } else q.focus({ preventScroll: true })
    }, sheet ? 60 : 20)

    /* the group rail / tabs: jump to a section; the list's scroll position lights the section in view */
    function secFor(key) {
      if (key === 'top') return [bestSec, popSec].filter(function (s) { return !s.hidden })[0] || popSec
      return layer.querySelector('[data-sp-sec="' + key + '"]')
    }
    function navKeyOf(sec) { var k = sec.getAttribute('data-sp-sec'); return k === 'best' || k === 'popular' ? 'top' : k }
    var spyOn = null, spyRaf = 0, spyHold = 0
    function lightNav(key, instant) {
      if (key === spyOn) return
      spyOn = key
      $$('[data-sp-go]', nav).forEach(function (b) { var on = b.getAttribute('data-sp-go') === key; b.classList.toggle('is-on', on); if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current') })
      if (!nav.contains(D.activeElement)) navRove(nav.querySelector('.sp-go.is-on') || navBtns()[0])
      // phones: keep the lit tab in the strip's view (scroll the strip only, never the page)
      var b = nav.querySelector('.sp-go.is-on')
      if (b && sheet) {
        var l = b.parentNode.offsetLeft - nav.firstChild.offsetLeft, w = b.parentNode.offsetWidth, s = nav.scrollLeft, vw = nav.clientWidth
        if (l < s + 12 || l + w > s + vw - 12) nav.scrollTo({ left: Math.max(0, l - vw / 2 + w / 2), behavior: instant || reduced() ? 'auto' : 'smooth' })   // two smooth scrolls at once: Chrome drops one
      }
    }
    function spy() {
      spyRaf = 0
      if (Date.now() < spyHold) return
      var secs = $$('.sp-sec', scroll).filter(function (s) { return !s.hidden }), top = scroll.scrollTop, on = secs[0]
      if (!secs.length) return
      if (top + scroll.clientHeight >= scroll.scrollHeight - 2) on = secs[secs.length - 1]
      else secs.forEach(function (s) { if (s.offsetTop - 24 <= top) on = s })
      lightNav(navKeyOf(on))
    }
    scroll.addEventListener('scroll', function () { if (!spyRaf) spyRaf = W.requestAnimationFrame(spy) }, { passive: true })
    function goTo(key, focusTile) {
      var sec = secFor(key); if (!sec || sec.hidden) return
      var y = $$('.sp-sec', scroll).filter(function (x) { return !x.hidden })[0] === sec ? 0 : sec.offsetTop - 8
      lightNav(key, true); spyHold = Date.now() + (reduced() ? 50 : 600)
      scroll.scrollTo({ top: Math.max(0, y), behavior: reduced() ? 'auto' : 'smooth' })
      if (focusTile) { var f = $$('[data-sp-pick]', sec).filter(visible)[0]; if (f) { setRove(f); f.focus({ preventScroll: true }) } }
    }
    nav.addEventListener('click', function (e) { var b = e.target.closest('[data-sp-go]'); if (b) { navRove(b); goTo(b.getAttribute('data-sp-go'), e.detail === 0) } })
    nav.addEventListener('keydown', function (e) {
      var b = e.target.closest('[data-sp-go]'); if (!b || !/^(Arrow(Left|Right|Up|Down)|Home|End)$/.test(e.key)) return
      var l = navBtns(), i = l.indexOf(b), n = e.key === 'Home' ? 0 : e.key === 'End' ? l.length - 1 : /Right|Down/.test(e.key) ? Math.min(l.length - 1, i + 1) : Math.max(0, i - 1)
      e.preventDefault(); navRove(l[n]); l[n].focus(); goTo(l[n].getAttribute('data-sp-go'), false)
    })
    navRove(navBtns()[0]); spy()

    // search
    var liveT = 0
    function runSearch() {
      var v = q.value.trim().toLowerCase(), toks = v.split(/\s+/).filter(Boolean)
      layer.classList.toggle('is-searching', !!toks.length)
      var match = function (hay) { return toks.every(function (k) { return hay.indexOf(k) >= 0 || (k.length > 3 && hay.indexOf(k.slice(0, -1)) >= 0) }) }
      var groupTiles = $$('.sp-sec:not(.is-top) [data-sp-pick]', scroll)
      var own = toks.length && groupTiles.some(function (b) { return match(b._hay || (b._hay = haystack(b.getAttribute('data-sp-pick')))) })
      var hits = 0
      $$('.sp-sec', scroll).forEach(function (sec) {
        if (sec.classList.contains('is-top')) { sec.hidden = !!toks.length || (sec === bestSec ? !useOn : sec === popSec ? !!useOn : false); return }
        var any = 0
        $$('[data-sp-pick]', sec).forEach(function (b) {
          var st = b.getAttribute('data-sp-pick')
          var ok = own ? match(b._hay || (b._hay = haystack(st))) : match(b._hayG || (b._hayG = haystack(st, true)))
          b.hidden = !ok; if (ok) any++
        })
        sec.hidden = !any; hits += any
        var c = sec.querySelector('.sp-count'); if (c) c.textContent = toks.length ? any + ' of ' + $$('[data-sp-pick]', sec).length : $$('[data-sp-pick]', sec).length
      })
      // the rail follows: groups with no match step aside, the top entries hide while searching
      $$('[data-sp-go]', nav).forEach(function (b) {
        var s = secFor(b.getAttribute('data-sp-go')); b.parentNode.hidden = !s || !!s.hidden
        if (s && !s.classList.contains('is-top')) b.querySelector('.sp-go-n').textContent = $$('[data-sp-pick]', s).filter(function (x) { return !x.hidden }).length
      })
      usesEl.hidden = !!toks.length
      empty.hidden = !toks.length || hits > 0
      if (toks.length && !hits) empty.innerHTML = 'No style matches “' + esc(q.value.trim()) + '”. Try <button type="button" class="sp-try" data-sp-try="glass">glass</button>, <button type="button" class="sp-try" data-sp-try="3d">3D</button> or <button type="button" class="sp-try" data-sp-try="cute">cute</button>.'
      setRove(tiles()[0])
      scroll.scrollTop = 0; spyOn = null; spy()
      if (!navBtns().some(function (b) { return b.tabIndex === 0 })) navRove(nav.querySelector('.sp-go.is-on') || navBtns()[0])
      watchLazy(scroll)
      clearTimeout(liveT)
      liveT = setTimeout(function () { if (!done) live.textContent = toks.length ? (hits ? hits + (hits === 1 ? ' style matches' : ' styles match') : 'No style matches') : '' }, 450)
    }
    q.addEventListener('input', runSearch)
    q.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { var l = tiles(); if (l.length) { e.preventDefault(); var h = l.filter(function (b) { return b.tabIndex === 0 })[0] || l[0]; rove(l, h); h.scrollIntoView({ block: 'nearest' }) } }
      else if (e.key === 'Enter') { var f = tiles()[0]; if (f && q.value.trim()) { e.preventDefault(); pick(f.getAttribute('data-sp-pick')) } }
      else if (e.key === 'Escape' && q.value) { e.preventDefault(); e.stopPropagation(); q.value = ''; runSearch() }
    })

    // "What are you making?"
    function setUse(uidv) {
      useOn = useOn === uidv ? null : uidv
      var u = uses().filter(function (x) { return x.id === useOn })[0]
      $$('[data-sp-use]', usesEl).forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-sp-use') === useOn ? 'true' : 'false') })
      $$('.sp-t.is-match', scroll).forEach(function (b) { b.classList.remove('is-match') })
      if (u) {
        var top = u.styles.slice(0, 4)
        bestSec.querySelector('.sp-gh').textContent = 'Best for ' + u.title.charAt(0).toLowerCase() + u.title.slice(1)
        bestSec.querySelector('.sp-count').textContent = top.length
        bestSec.querySelector('[data-sp-best]').innerHTML = top.map(function (s, i) { return tile(s, i === 0 ? 'is-first' : '') }).join('')
        $$('.sp-t.in-group', scroll).forEach(function (b) { if (top.indexOf(b.getAttribute('data-sp-pick')) >= 0) b.classList.add('is-match') })
        watchLazy(bestSec); fillWaiting()
        WI().announce && WI().announce('Best for ' + u.title + ': ' + top.map(function (s) { return info(s).title }).join(', '))
      }
      bestSec.hidden = !u; popSec.hidden = !!u
      var nb = nav.querySelector('[data-sp-go="top"] .sp-go-t'); if (nb) nb.textContent = u ? 'Best for you' : 'Popular'
      var nn = nav.querySelector('[data-sp-go="top"] .sp-go-n'); if (nn) nn.textContent = u ? u.styles.slice(0, 4).length : featured().length
      setRove(homeTile())
      if (u && bestSec.getBoundingClientRect().top < scroll.getBoundingClientRect().top) goTo('top', false)
      if (!reduced() && u && bestSec.animate) bestSec.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' })
    }

    function pick(st) {
      if (!known(st)) return
      remember(st)
      if (o.onPick) { try { o.onPick(st) } catch (e) { if (W.console) console.error(e) } }
      close(st)
    }
    function close(val, instant) {
      if (done) return
      done = true; cur = null
      W.removeEventListener('resize', onResize)
      D.removeEventListener('keydown', onDocKey, true)
      if (io) io.disconnect()
      if (spyRaf) W.cancelAnimationFrame(spyRaf)
      clearTimeout(liveT)
      if (sheet) HTML.style.overflow = prevOverflow
      tip(null)
      var finish = function () { if (layer.parentNode) layer.parentNode.removeChild(layer) }
      if (instant || reduced()) finish()
      else { layer.classList.remove('is-in'); layer.classList.add('is-out'); setTimeout(finish, sheet ? 260 : 170) }
      var back = (anchor && anchor.isConnected && anchor.focus) ? anchor : opener
      if (!instant && back && back.focus && back.isConnected) { try { back.focus({ preventScroll: true }) } catch (e) { } }
      resolveP(val || null)
    }

    layer.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return
      if (t.closest('[data-sp-close]')) { close(null); return }
      var b = t.closest('[data-sp-pick]'); if (b) { pick(b.getAttribute('data-sp-pick')); return }
      var u = t.closest('[data-sp-use]'); if (u) { setUse(u.getAttribute('data-sp-use')); return }
      var tr = t.closest('[data-sp-try]'); if (tr) { q.value = tr.getAttribute('data-sp-try'); runSearch(); q.focus(); return }
      var a = t.closest('[data-sp-act]'); if (a) { var aid = a.getAttribute('data-sp-act'); close(null); if (o.onAction) o.onAction(aid) }
    })
    // the footer line follows the pointer / focus
    var sayFor = null
    layer.addEventListener('pointerover', function (e) {
      var b = e.target.closest && e.target.closest('[data-sp-pick]'), st = b ? b.getAttribute('data-sp-pick') : null
      if (st !== sayFor) { sayFor = st; paintSay(st) }
    })
    layer.addEventListener('focusin', function (e) { var b = e.target.closest && e.target.closest('[data-sp-pick]'); if (b) { sayFor = b.getAttribute('data-sp-pick'); paintSay(sayFor); setRove(b) } })
    scroll.addEventListener('keydown', function (e) {
      var b = e.target.closest && e.target.closest('[data-sp-pick]'); if (!b) return
      if (!/^(Arrow(Left|Right|Up|Down)|Home|End)$/.test(e.key)) return
      var list = tiles(), to = arrowTarget(list, b, e.key)
      e.preventDefault()
      if (to) { rove(list, to); to.scrollIntoView({ block: 'nearest' }) }
      else if (e.key === 'ArrowUp') { scroll.scrollTo({ top: 0 }); q.focus() }
    })
    // Escape closes; Tab stays inside
    function onDocKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(null); return }
      if (e.key !== 'Tab') return
      var f = $$('button, input', panel).filter(function (x) { return visible(x) && x.tabIndex >= 0 && !x.disabled })
      if (!f.length) return
      var first = f[0], last = f[f.length - 1]
      if (!panel.contains(D.activeElement)) { e.preventDefault(); first.focus(); return }
      if (e.shiftKey && (D.activeElement === first || D.activeElement === panel || D.activeElement === scroll)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && D.activeElement === last) { e.preventDefault(); first.focus() }
    }
    D.addEventListener('keydown', onDocKey, true)

    // phones: drag the sheet down by its grip / header to close
    if (sheet) {
      var drag = null
      panel.addEventListener('pointerdown', function (e) {
        if (e.button > 0) return
        if (!(e.target.closest('.sp-grip, .sp-ht') && !e.target.closest('button, input'))) return
        drag = { y0: e.clientY, t0: Date.now(), dy: 0, id: e.pointerId }
      })
      panel.addEventListener('pointermove', function (e) {
        if (!drag || e.pointerId !== drag.id) return
        var dy = e.clientY - drag.y0
        if (!drag.moved && Math.abs(dy) > 3) { drag.moved = true; try { panel.setPointerCapture(e.pointerId) } catch (x) { } panel.classList.add('is-drag') }
        drag.dy = Math.max(0, dy)
        panel.style.transform = 'translateY(' + drag.dy + 'px)'
        layer.style.setProperty('--sp-fade', String(Math.max(0, 1 - drag.dy / 400)))
      })
      var endDrag = function (e) {
        if (!drag || (e && e.pointerId !== drag.id)) return
        var d = drag; drag = null
        panel.classList.remove('is-drag')
        if (!d.moved) return
        panel._justDragged = true; setTimeout(function () { panel._justDragged = false }, 0)
        var v = d.dy / Math.max(1, Date.now() - d.t0)
        if (d.dy > 110 || v > 0.6) { panel.style.transform = 'translateY(100%)'; close(null) }
        else { panel.style.transform = ''; layer.style.removeProperty('--sp-fade') }
      }
      panel.addEventListener('pointerup', endDrag); panel.addEventListener('pointercancel', endDrag)
      panel.addEventListener('click', function (e) { if (panel._justDragged) { e.stopPropagation(); e.preventDefault() } }, true)
    }

    // the selected style starts in view (it may sit far down, e.g. a holiday style)
    var onT = current && scroll.querySelector('.sp-sec.is-group [data-sp-pick="' + current + '"]')
    if (onT && !scroll.querySelector('.sp-sec.is-top [data-sp-pick="' + current + '"]')) {
      var sec = onT.closest('.sp-sec'); if (sec && sec.offsetTop + sec.offsetHeight > scroll.clientHeight) { scroll.scrollTop = Math.max(0, sec.offsetTop - 8); spy() }
    }

    cur = { close: close }
    promise.close = function () { close(null) }
    return promise
  }

  var API = { row: row, open: open, remember: remember, recent: recent, groupOf: groupOf, drawTile: drawTile, loadIcon: loadIcon, last: function () { var s = lsGet(KEY); return known(s) ? s : null } }
  function attach() { var wi = W.WI || W.EG; if (wi) { wi.stylePicker = API; return true } return false }
  if (!attach()) D.addEventListener('DOMContentLoaded', attach)
  W.WIStylePicker = API
})()
