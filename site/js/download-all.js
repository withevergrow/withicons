/* with icons — "Download all" buttons for the per-style zips (forge/tools/site-downloads.mjs).
   Classic script, no build, works from file://. Load after js/site.js (optional) and data/downloads.js (optional; without
   it the sizes come from data/downloads.json over http, or the button shows without a size). Style: css/download-all.css.

   WI.downloadAll = {
     button(el, style, opts)  -> renders a "Download all" link with a "<N> SVGs · ZIP · <size>" note into el (element or selector), returns it
                                 opts: { variant: 'style' | 'ink' | 'ghost' | 'hub' (default 'style'), compact: bool (one line),
                                         label: custom main text, note: custom small text }
     all(el, opts)            -> the same for the all-styles zip (renders nothing when it was not built)
     url(style)               -> 'downloads/with-icons-<style>.zip' (relative to the site root, WI.base applied)
     info(style)              -> Promise<{ file, bytes, size, icons, title } | null>   ('all' for the all-styles zip)
     upgrade(root)            -> upgrades every [data-download-all="<style>|all"] inside root (done on load for document)
   }
   No JavaScript? Write the plain link; this script upgrades it in place:
     <a class="btn" data-download-all="line" href="../downloads/with-icons-line.zip" download>Download all Line icons</a> */
(function () {
  'use strict'
  var W = window, D = document
  var cs = D.currentScript && D.currentScript.src
  var OWN_BASE = cs && /js\/download-all\.js(\?.*)?$/.test(cs) ? cs.replace(/js\/download-all\.js(\?.*)?$/, '') : ''
  var pending = null

  function wi() { return W.WI || W.EG || {} }
  function base() { var b = wi().base; return typeof b === 'string' && b ? b : OWN_BASE }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function el$(el) { return typeof el === 'string' ? D.querySelector(el) : el }
  function file(style) { return style === 'all' ? 'downloads/with-icons-all.zip' : 'downloads/with-icons-' + style + '.zip' }
  function url(style) { return base() + file(style) }

  // the generated catalogue: window.WITH_DOWNLOADS (data/downloads.js), else data/downloads.json (http only)
  function load() {
    if (W.WITH_DOWNLOADS) return Promise.resolve(W.WITH_DOWNLOADS)
    if (pending) return pending
    if (!W.fetch || location.protocol === 'file:') return (pending = Promise.resolve(null))
    pending = fetch(base() + 'data/downloads.json').then(function (r) { return r.ok ? r.json() : null })
      .then(function (d) { if (d) W.WITH_DOWNLOADS = d; return d }, function () { return null })
    return pending
  }
  function info(style) {
    return load().then(function (d) {
      if (!d) return null
      var x = style === 'all' ? d.all : d.styles && d.styles[style]
      return x ? Object.assign({ title: style === 'all' ? 'All styles' : x.title }, x) : null
    })
  }
  function titleOf(style, x) {
    if (x && x.title) return x.title
    var i = wi().styleInfo && wi().styleInfo[style]
    return (i && i.title) || (style.charAt(0).toUpperCase() + style.slice(1))
  }
    function fmt(n) { return n >= 1000 ? n.toLocaleString('en-US') : String(n) }
  function glyph() {
    var w = wi()
    if (w.svg) { try { var s = w.svg('download', 'line', 20); if (s) return s } catch (e) { /* data not loaded */ } }
    // fallback: an arrow into a tray (plain geometry, same 24 grid)
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5v11.5"/><path d="M7.5 10.5 12 15l4.5-4.5"/><path d="M4 15.5v2.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5"/></svg>'
  }
  function track(style) { try { if (typeof W.gtag === 'function') W.gtag('event', 'download_all', { style: style }) } catch (e) { /* analytics off */ } }

  function paint(a, style, x, opts) {
    // a link the page generator already filled from the built zip (data-download-all + its text) is right as it is: only
    // wire the analytics. Never repaint it with guesses (a fallback icon total, a size-less ".zip"): that showed stale counts.
    if (!x && a.querySelector('.dl-all-note') && a.querySelector('.dl-all-note').textContent) { wire(a, style); return }
    var all = style === 'all', t = titleOf(style, x)
    var main = opts.label || (all ? 'Download every style' : 'Download all')
    var note = opts.note || (x ? (all ? (x.styles ? x.styles + ' styles · ' : '') + 'ZIP · ' + x.size : fmt(x.icons) + ' SVGs · ZIP · ' + x.size) : 'ZIP')
    var label = all ? main : 'Download all ' + (x ? fmt(x.icons) + ' ' : '') + t + ' SVGs'
    a.href = url(style)
    a.setAttribute('download', file(style).split('/').pop())
    a.setAttribute('aria-label', label + (x ? ' (ZIP, ' + x.size + ')' : ' (ZIP)'))
    a.classList.add('dl-all')
    if (!a.classList.contains('btn')) a.classList.add('btn')
    if (opts.variant === 'ink') a.classList.add('btn-ink')
    else if (opts.variant === 'ghost' || opts.variant === 'hub') a.classList.add('btn-ghost')
    else if (!a.classList.contains('btn-ink') && !a.classList.contains('btn-ghost')) a.classList.add('btn-style')
    if (opts.compact) a.classList.add('dl-all-compact')
    a.innerHTML = '<span class="dl-all-ic" aria-hidden="true">' + glyph() + '</span><span class="dl-all-t"><span class="dl-all-main">' + esc(main) + '</span><span class="dl-all-note">' + esc(note) + '</span></span>'
    wire(a, style)
  }
  function wire(a, style) { if (!a._dlTrack) { a._dlTrack = 1; a.addEventListener('click', function () { track(style) }) } }

  // el: a container (the link goes inside it) or an <a> to upgrade in place
  function button(el, style, opts) {
    el = el$(el); opts = opts || {}
    if (!el || !style) return null
    var a = el.tagName === 'A' ? el : el.querySelector('a.dl-all') || el.appendChild(D.createElement('a'))
    paint(a, style, null, opts)
    info(style).then(function (x) {
      if (x) paint(a, style, x, opts)
      else if (style === 'all' && W.WITH_DOWNLOADS) a.hidden = true   // the all-styles zip was skipped (too big)
    })
    return a
  }
  function upgrade(root) {
    var list = (root || D).querySelectorAll('[data-download-all]')
    Array.prototype.forEach.call(list, function (n) {
      if (n._dlDone) return; n._dlDone = 1
      button(n, n.getAttribute('data-download-all'), { variant: n.getAttribute('data-variant') || undefined, compact: n.hasAttribute('data-compact') })
    })
  }

  var API = { button: button, all: function (el, opts) { return button(el, 'all', opts) }, url: url, info: info, upgrade: upgrade }
  function attach() { var w = W.WI || W.EG; if (w) w.downloadAll = API; W.WithDownloadAll = API }
  attach()
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { attach(); upgrade() })
  else upgrade()
})()
