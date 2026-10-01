/* with icons — generated icon pages (icons/<name>.html) and hubs (categories/, styles/).
   Style picker, colour + size, Copy image (PNG to clipboard), SVG/PNG downloads, drag-out,
   developer tabs and code copy. Self-contained; uses window.WI.toast when the shared runtime is present. */
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

  /* ───────── code blocks + tabs (icon pages and hubs) ───────── */
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
  // open the developer drawer when arriving with #developers or a #use-… hash
  if (/^#(developers|use-)/.test(location.hash)) { var dv = $('.ip-dev'); if (dv) dv.open = true }

  /* ───────── icon page ───────── */
  var dataEl = $('#ip-data'), root = $('[data-ip]')
  if (!dataEl || !root) return
  var DATA; try { DATA = JSON.parse(dataEl.textContent) } catch (e) { return }
  var S = { style: root.getAttribute('data-style'), color: 'ink', px: 256 }
  try { var p = JSON.parse(localStorage.getItem('with-ip') || '{}'); if ([64, 128, 256, 512, 1024].indexOf(p.px) >= 0) S.px = p.px; if (p.color) S.color = p.color; if (p.style && DATA.styles[p.style]) S.style = p.style } catch (e) { }
  function save() { try { localStorage.setItem('with-ip', JSON.stringify({ px: S.px, color: S.color, style: S.style })) } catch (e) { } }

  function hexFor(st) {
    var c = S.color
    if (c === 'ink') return INK
    if (c === 'style') return DATA.styles[st].hex
    return /^#[0-9a-f]{6}$/i.test(c) ? c : INK
  }
  function attrString(root, color) {
    return Object.keys(root).map(function (k) {
      var v = root[k]; if (v === false || v == null) return ''
      if (color && typeof v === 'string') v = v.replace(/var\(--[\w-]+,\s*([^)]+)\)/g, '$1').replace(/currentColor/g, color)
      return ' ' + k + '="' + esc(v) + '"'
    }).join('')
  }
  // mode 'file' bakes the colour in; 'code' keeps currentColor for developers
  function svgText(st, px, mode) {
    var s = DATA.styles[st], c = mode === 'file' ? hexFor(st) : null
    var inner = c ? s.inner.replace(/var\(--[\w-]+,\s*([^)]+)\)/g, '$1').replace(/currentColor/g, c) : s.inner
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (px || 24) + '" height="' + (px || 24) + '" viewBox="0 0 24 24"' + attrString(s.root, c) + '>' + inner + '</svg>'
  }
  function tagText(st) { return '<i class="with with-' + DATA.name + (st === 'line' ? '' : ' with-' + st) + '"></i>' }
  function cssText(st) { return '<link rel="stylesheet" href="' + (DATA.cdn || 'https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/') + 'with-' + st + '.css">' }
  function colorName() { return S.color === 'ink' ? 'black' : S.color === 'style' ? DATA.styles[S.style].title.toLowerCase() + ' colour' : S.color === '#FFFFFF' ? 'white' : S.color.toUpperCase() }
  function fname(st, ext, px) { return DATA.name + (st === 'line' ? '' : '-' + st) + (px ? '-' + px : '') + '.' + ext }
  var pngCache = {}
  function png(st, px) {
    var key = st + '|' + px + '|' + hexFor(st)
    if (pngCache[key]) return pngCache[key]
    var pr = new Promise(function (res, rej) {
      var img = new Image()
      img.onload = function () {
        var c = D.createElement('canvas'); c.width = px; c.height = px
        c.getContext('2d').drawImage(img, 0, 0, px, px)
        c.toBlob(function (b) { if (!b) return rej(new Error('png')); var out = { blob: b, dataUrl: null }; try { out.dataUrl = c.toDataURL('image/png') } catch (e) { } res(out) }, 'image/png')
      }
      img.onerror = rej
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText(st, px, 'file'))
    })
    pr.then(function (v) { pr.value = v }, function () { delete pngCache[key] })
    return (pngCache[key] = pr)
  }
  function save_(blob, name) {
    var u = URL.createObjectURL(blob), a = D.createElement('a'); a.href = u; a.download = name; D.body.appendChild(a); a.click(); a.remove()
    setTimeout(function () { URL.revokeObjectURL(u) }, 4000)
  }
  function act(kind, st) {
    st = st || S.style
    var T = DATA.title
    if (kind === 'svg') { save_(new Blob([svgText(st, S.px, 'file')], { type: 'image/svg+xml' }), fname(st, 'svg')); toast('Downloaded ' + fname(st, 'svg')) }
    else if (kind === 'png') { png(st, S.px).then(function (r) { save_(r.blob, fname(st, 'png', S.px)); toast('Downloaded ' + fname(st, 'png', S.px)) }, function () { toast('Couldn’t make the PNG. Try SVG.') }) }
    else if (kind === 'copy-tag') {
      var tb = $('.ip-tag-btn', root)
      copyText(tagText(st)).then(function (ok) {
        toast(ok ? 'Copied ' + tagText(st) + ' — paste it into your HTML.' : 'Couldn’t reach the clipboard.')
        var gl = tb && $('.ip-tag-go span', tb)
        if (ok && tb) { tb.classList.add('is-done'); if (gl) gl.textContent = 'Copied'; clearTimeout(tb._t); tb._t = setTimeout(function () { tb.classList.remove('is-done'); if (gl) gl.textContent = 'Copy' }, 1600) }
      })
    }
    else if (kind === 'copy-css') { copyText(cssText(st)).then(function (ok) { toast(ok ? 'Copied the stylesheet line. Add it once inside <head>.' : 'Couldn’t reach the clipboard.') }) }
    else if (kind === 'copy-svg') { copyText(svgText(st, 24, S.color === 'ink' ? 'code' : 'file')).then(function (ok) { toast(ok ? 'Copied ' + T + ' as SVG code. Paste it into Figma, Canva or HTML.' : 'Couldn’t reach the clipboard.') }) }
    else if (kind === 'copy-img') {
      if (!(W.ClipboardItem && navigator.clipboard && navigator.clipboard.write && W.isSecureContext)) {
        copyText(svgText(st, 24, 'file')).then(function () { toast('Your browser can’t copy images, so we copied the SVG code. Use Download PNG for a picture.') }); return
      }
      var blobP = png(st, Math.max(S.px, 256)).then(function (r) { return r.blob })
      navigator.clipboard.write([new W.ClipboardItem({ 'image/png': blobP })]).then(function () {
        toast('Copied ' + T + ' as an image. Paste it into Slides, Docs or Notion.')
      }, function () { copyText(svgText(st, 24, 'file')).then(function () { toast('Image copy was blocked, so we copied the SVG code instead.') }) })
    }
  }

  // style picker: swap every preview in the hero to the chosen style
  var picks = $$('[data-pick]')
  function paint(animate) {
    var s = DATA.styles[S.style]; if (!s) return
    root.setAttribute('data-style', S.style)
    D.body.className = D.body.className.replace(/\bs-[a-z]+\b/g, '').trim() + ' s-' + S.style
    root.style.setProperty('--sc', s.hex)
    root.style.setProperty('--ic', S.color === 'ink' ? 'var(--ink)' : hexFor(S.style))
    $$('svg[data-root]', root).forEach(function (svg) {
      Object.keys(svg.dataset).length // keep
      ;['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].forEach(function (k) { if (s.root[k] == null) svg.removeAttribute(k); else svg.setAttribute(k, s.root[k]) })
      var u = $('use', svg); if (u) u.setAttribute('href', '#s-' + S.style)
    })
    picks.forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-pick') === S.style ? 'true' : 'false'); b.tabIndex = b.getAttribute('data-pick') === S.style ? 0 : -1 })
    $$('[data-color]', root).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-color') === S.color ? 'true' : 'false') })
    var ci = $('[data-color-input]', root); if (ci && /^#/.test(S.color) && S.color !== '#FFFFFF') { ci.value = S.color; ci.closest('label').classList.add('is-on') } else if (ci) ci.closest('label').classList.remove('is-on')
    $$('[data-px]', root).forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-px') === S.px ? 'true' : 'false') })
    var lbl = $('[data-px-label]', root); if (lbl) lbl.textContent = S.px + ' px'
    $$('[data-color-label]', root).forEach(function (c) { c.textContent = colorName() })
    var tc = $('[data-tag-code]', root); if (tc) tc.textContent = tagText(S.style)
    var cc = $('[data-tag-css]', root); if (cc) cc.textContent = cssText(S.style)
    root.classList.toggle('is-white', S.color === '#FFFFFF')
    askAI()
    if (animate && !reduced) {
      var art = $('.ip-stage-art', root)
      art.animate([{ transform: 'scale(.7) rotate(-10deg)', opacity: 0.2 }, { transform: 'scale(1.06) rotate(2deg)', opacity: 1, offset: 0.6 }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' })
      $$('.ip-sizes figure', root).forEach(function (f, i) { f.animate([{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, delay: 60 + i * 50, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }) })
    }
  }
  // "Ask AI" task widget follows the chosen style (site.js renders it; update keeps the visitor's task and text)
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
  // the little chat demo mirrors the chosen task
  function askDemo(intent) {
    var q = $('[data-ask-demo-q]'), an = $('[data-ask-demo-a]')
    if (!q || !an) return
    if (!intent) { var on = $('.ip-ask-widget .ask-task[aria-checked="true"]'); intent = on ? on.getAttribute('data-ask-intent') : 'set' }
    var n = DATA.name, st = DATA.styles[S.style].title
    var rel = $$('.ip-side-links li a').map(function (x) { return (x.getAttribute('href') || '').replace(/.html$/, '') }).filter(Boolean).slice(0, 4)
    var T = {
      code: ['Code ' + n + ' into my React delete button', 'Here’s <b>' + esc(n) + '</b> at 20px with <i>aria-label</i>, a tooltip, and hover, focus and disabled states…'],
      set: ['What goes with ' + n + ' on my screen?', 'Use these with <b>' + esc(n) + '</b>, all in ' + esc(st) + ': ' + rel.map(function (r) { return '<b>' + esc(r) + '</b>' }).join(', ') + '… here’s why each belongs.'],
      fit: ['Is ' + n + ' right for my meaning?', 'It depends on your users. Here’s how most people read <b>' + esc(n) + '</b>, and two clearer options if you need them…'],
      slides: ['How do I put ' + n + ' on my Google Slides?', 'Press <i>Copy image</i> on its page, paste onto the slide, then drag a corner to resize…']
    }[intent] || null
    if (!T) return
    q.textContent = T[0]; an.innerHTML = T[1]
  }
  root.ownerDocument.addEventListener('askai:intent', function (e) { if (e.target.closest && e.target.closest('.ip-ask-widget')) askDemo(e.detail && e.detail.intent) })
  // the compact entry near the downloads jumps to the task picker and focuses it
  var jump = $('[data-ask-jump]', root)
  if (jump) jump.addEventListener('click', function (e) {
    var sec = $('#ask-ai'); if (!sec) return
    e.preventDefault()
    sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    var t = $('.ip-ask-widget .ask-task[aria-checked="true"]') || $('.ip-ask-widget .ask-task')
    if (t) setTimeout(function () { t.focus({ preventScroll: true }) }, reduced ? 0 : 450)
    if (history.replaceState) history.replaceState(null, '', '#ask-ai')
  })
  picks.forEach(function (b, i) {
    b.addEventListener('click', function () { S.style = b.getAttribute('data-pick'); save(); paint(true) })
    b.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      if (k) { e.preventDefault(); var n = picks[(i + k + picks.length) % picks.length]; n.focus(); n.click() }
    })
  })
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !root.contains(b)) return
    if (b.hasAttribute('data-act')) act(b.getAttribute('data-act'), b.getAttribute('data-style'))
    else if (b.hasAttribute('data-color')) { S.color = b.getAttribute('data-color'); save(); paint() }
    else if (b.hasAttribute('data-px')) { S.px = +b.getAttribute('data-px'); save(); paint() }
  })
  var ci = $('[data-color-input]', root)
  if (ci) ci.addEventListener('input', function () { S.color = ci.value; save(); paint() })

  // drag the big preview out: PNG file (Chrome/Edge), image HTML for apps, SVG text as fallback
  var drag = $('[data-drag]', root)
  if (drag) {
    drag.addEventListener('pointerenter', function () { png(S.style, S.px).catch(function () { }) })
    drag.addEventListener('dragstart', function (e) {
      var dt = e.dataTransfer, svg = svgText(S.style, S.px, 'file'), svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
      var p = pngCache[S.style + '|' + S.px + '|' + hexFor(S.style)], r = p && p.value
      dt.effectAllowed = 'copy'
      try { dt.setData('DownloadURL', r && r.dataUrl ? 'image/png:' + fname(S.style, 'png', S.px) + ':' + r.dataUrl : 'image/svg+xml:' + fname(S.style, 'svg') + ':' + svgUrl) } catch (err) { }
      var src = r && r.dataUrl ? r.dataUrl : svgUrl
      dt.setData('text/uri-list', src)
      dt.setData('text/html', '<img src="' + src + '" width="' + S.px + '" height="' + S.px + '" alt="' + esc(DATA.title) + ' icon">')
      dt.setData('text/plain', svg)
    })
  }
  paint(false)
})()
