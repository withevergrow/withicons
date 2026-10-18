/* with icons — Loaders page + Loader Studio (site/loaders.html).
   Data: window.WITH_LOADERS (data/loaders.js: catalog, styles, effects), runtime: window.WithLoaders
   (vendor/loaders/loaders.js), site helpers: window.WI (js/site.js). Each loader x style is one file,
   loaders/svg/<style>/<name>.svg, fetched when it is first shown (falls back to the style bundle on file://). */
(function () {
  'use strict'
  var W = window, doc = document
  var D = W.WITH_LOADERS, L = W.WithLoaders
  if (!D || !L) return
  var $ = function (s, r) { return (r || doc).querySelector(s) }
  var $$ = function (s, r) { return [].slice.call((r || doc).querySelectorAll(s)) }
  var WI = function () { return W.WI || null }
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  var CDN = 'https://cdn.jsdelivr.net/npm/@withicons/loaders@latest/dist/'
  var BY = {}; D.loaders.forEach(function (l) { BY[l.name] = l })
  var LOADERS = D.loaders.filter(function (l) { return l.group !== 'morph' })
  var MORPHS = D.loaders.filter(function (l) { return l.group === 'morph' })
  var STYLE_TITLE = function (s) { var i = WI() && WI().styleInfo && WI().styleInfo[s]; return (i && i.title) || s.charAt(0).toUpperCase() + s.slice(1) }
  var reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches
  var uid = 0
  var nextId = function () { return 'p' + (++uid).toString(36) }

  /* ───────── one loader in one style = one small file (the runtime falls back to the style bundle, e.g. on file://) */
  var ROOT_SKIP = { xmlns: 1, width: 1, height: 1, viewBox: 1, class: 1, role: 1, 'aria-label': 1, 'aria-hidden': 1, style: 1 }
  function parseFile(text) {
    var m = /<svg([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(text.trim())
    if (!m) throw new Error('bad svg')
    var root = {}, a, re = /([\w:-]+)="([^"]*)"/g
    while ((a = re.exec(m[1]))) if (!ROOT_SKIP[a[1]]) root[a[1]] = a[2]
    return { root: root, body: m[2] }
  }
  L.configure({ one: function (name, style) {
    if (location.protocol === 'file:' || !W.fetch) return Promise.reject(new Error('no fetch'))
    return fetch('loaders/svg/' + style + '/' + name + '.svg').then(function (r) { if (!r.ok) throw new Error(r.status); return r.text() }).then(parseFile)
  } })
  // library icons for morph sequences come from the site's own icon data
  L.setIconSource(function (name, style) {
    var w = WI()
    if (!w) return Promise.reject(new Error('site not ready'))
    return w.loadStyleFor(style, [name]).then(function () {
      var s = w.svg(name, style, 24)
      if (!s) throw new Error('no icon ' + name)
      return s
    })
  })
  function draw(name, style, o) { return L.svgAsync(name, Object.assign({ style: style, idSuffix: nextId() }, o || {})) }

  /* ───────── state */
  var SW = [
    { id: 'auto', title: 'Text colour', c: null },
    { id: 'ink', title: 'Ink', c: '#111318' }, { id: 'cobalt', title: 'Cobalt', c: '#2F5BFF' }, { id: 'violet', title: 'Violet', c: '#7B5CFF' },
    { id: 'tomato', title: 'Tomato', c: '#FF5A36' }, { id: 'leaf', title: 'Leaf', c: '#22A861' }, { id: 'pink', title: 'Pink', c: '#FF4FA3' },
    { id: 'sun', title: 'Sun', c: '#F2B705' }, { id: 'white', title: 'White', c: '#FFFFFF' },
  ]
  var PAL = [
    { id: 'default', title: 'Style colours', p: null },
    { id: 'sunset', title: 'Sunset', p: { c1: '#FF6B4A', c2: '#FFB547', c3: '#FF4F8B', c4: '#7B5CFF', tint: '#FFE8D9', accent: '#FFD23F', shine: '#FFFFFF', shadow: '#B23A2A', edge: '#3B1D14' } },
    { id: 'ocean', title: 'Ocean', p: { c1: '#1E88E5', c2: '#26C6DA', c3: '#5E5CE6', c4: '#00BFA5', tint: '#E0F4FF', accent: '#FFD23F', shine: '#FFFFFF', shadow: '#0D3B66', edge: '#08223D' } },
    { id: 'forest', title: 'Forest', p: { c1: '#2E9E5B', c2: '#A3D65C', c3: '#F2B134', c4: '#1E6F5C', tint: '#E8F6EA', accent: '#FF7A59', shine: '#FFFFFF', shadow: '#174A33', edge: '#10241A' } },
    { id: 'candy', title: 'Candy', p: { c1: '#FF7EB6', c2: '#B69CFF', c3: '#7FE3D3', c4: '#FFD36E', tint: '#FFF0F7', accent: '#FF5C8A', shine: '#FFFFFF', shadow: '#B04A7A', edge: '#4A1F3A' } },
    { id: 'neon', title: 'Neon', p: { c1: '#00F5D4', c2: '#9B5DE5', c3: '#F15BB5', c4: '#FEE440', tint: '#1A1A2E', accent: '#00BBF9', shine: '#FFFFFF', shadow: '#0B0B1A', edge: '#05050F' } },
    { id: 'gold', title: 'Gold', p: { c1: '#C9962B', c2: '#E8C66A', c3: '#8C6A1E', c4: '#F6E7B8', tint: '#FBF3DE', accent: '#111318', shine: '#FFF8E1', shadow: '#5C4210', edge: '#2A1E07' } },
    { id: 'mono', title: 'Mono', p: { c1: '#2B2F3A', c2: '#5A6070', c3: '#8A90A0', c4: '#C3C8D4', tint: '#EEF0F4', accent: '#111318', shine: '#FFFFFF', shadow: '#111318', edge: '#111318' } },
  ]
  var S = {
    mode: 'loader', name: LOADERS.some(function (l) { return l.name === 'spinner' }) ? 'spinner' : LOADERS[0].name,
    style: 'line', color: null, pal: 'default', size: 96, speed: 1, label: 'Loading', paused: false, bg: 'paper', ctx: 'alone',
    morph: { items: (MORPHS[0] && MORPHS[0].morph.slice()) || ['sparkles', 'check'], effect: (MORPHS[0] && MORPHS[0].effect) || 'bloom', hold: 1.1, preset: MORPHS[0] ? MORPHS[0].name : null },
    tab: 'img', filter: 'all',
  }
  // URL in, URL out: every studio state is a link
  function readUrl() {
    var q = new URLSearchParams(location.search)
    if (q.get('l') && BY[q.get('l')]) { S.name = q.get('l'); if (BY[S.name].group === 'morph') { S.mode = 'morph'; usePreset(S.name, true) } }
    if (q.get('m')) { S.mode = 'morph'; S.morph.items = q.get('m').split(',').filter(Boolean).slice(0, 8); S.morph.preset = null }
    if (q.get('fx') && D.effects.some(function (e) { return e.name === q.get('fx') })) S.morph.effect = q.get('fx')
    if (+q.get('h') >= 0.5) S.morph.hold = Math.min(3, +q.get('h'))
    if (q.get('s') && D.styles.indexOf(q.get('s')) >= 0) S.style = q.get('s')
    else { try { var st = localStorage.getItem('with-style'); if (st && D.styles.indexOf(st) >= 0) S.style = st } catch (e) { } }
    if (/^#?[0-9a-f]{6}$/i.test(q.get('c') || '')) S.color = '#' + q.get('c').replace('#', '')
    if (q.get('p') && PAL.some(function (p) { return p.id === q.get('p') })) S.pal = q.get('p')
    if (+q.get('sp') > 0) S.speed = Math.min(3, Math.max(0.25, +q.get('sp')))
  }
  function linkFor(hash) {
    var q = new URLSearchParams()
    if (S.mode === 'morph' && !S.morph.preset) { q.set('m', S.morph.items.join(',')); q.set('fx', S.morph.effect); q.set('h', S.morph.hold) }
    else q.set('l', S.mode === 'morph' ? S.morph.preset : S.name)
    q.set('s', S.style)
    if (S.color) q.set('c', S.color.replace('#', ''))
    if (S.pal !== 'default') q.set('p', S.pal)
    if (S.speed !== 1) q.set('sp', S.speed)
    return location.pathname.split('/').pop() + '?' + q.toString() + (hash ? '#studio' : location.hash)
  }
  // the address bar follows the studio after the visitor touches it (a first visit keeps a clean URL)
  var touched = !!location.search
  function writeUrl() { if (!touched) return; try { history.replaceState(null, '', linkFor()) } catch (e) { } }
  document.addEventListener('pointerdown', function (e) { if (e.target.closest && e.target.closest('.ld-studio, .ld-grid')) touched = true }, true)

  /* ───────── the stage */
  var stage = $('[data-ld-stage]'), view = $('[data-ld-view]')
  var current = { svg: '', name: '', meta: null }
  var job = 0
  function palVars(markup) {
    var pal = PAL.filter(function (p) { return p.id === S.pal })[0]
    if (!pal || !pal.p || !W.WithPalette) return null
    return W.WithPalette.applyPalette(markup, pal.p).vars
  }
  function opts(extra) {
    return Object.assign({ style: S.style, size: S.size, color: S.color || undefined, speed: S.speed, paused: S.paused, label: S.label }, extra || {})
  }
  function renderCurrent(o) {
    // draw once, then again with the palette mapped onto the variables this drawing uses
    var run = function (oo) {
      if (S.mode === 'morph') {
        return L.morphAsync(S.morph.items, Object.assign(opts(oo), { effect: S.morph.effect, hold: S.morph.hold, id: 'wl-mstage' }))
      }
      return draw(S.name, S.style, opts(oo))
    }
    return run(o).then(function (svg) {
      var v = palVars(svg)
      return v ? run(Object.assign({}, o, { vars: v })) : svg
    })
  }
  function metaNow() {
    if (S.mode === 'morph') {
      var pre = S.morph.preset && BY[S.morph.preset]
      return pre || { name: 'my-sequence', title: 'Your sequence', group: 'morph', intent: S.morph.items.join(' → ') }
    }
    return BY[S.name]
  }
  function paint() {
    var my = ++job
    stage.classList.add('is-busy')
    var ctx = S.ctx
    var ctxSize = ctx === 'button' ? 22 : ctx === 'card' ? 44 : null
    var extra = ctxSize ? { size: ctxSize } : {}
    if (ctx === 'button') extra.color = S.color || '#ffffff'
    renderCurrent(extra).then(function (svg) {
      if (my !== job) return
      var m = metaNow()
      current.meta = m
      var html
      if (ctx === 'button') html = '<button type="button" class="ld-ctx-button" tabindex="-1">' + svg + '<span>Saving changes</span></button>'
      else if (ctx === 'card') html = '<div class="ld-ctx-card"><div class="ld-card-top">' + svg + '<div><b>Preparing your report</b><small>This takes a few seconds</small></div></div><i class="ld-sk"></i><i class="ld-sk w80"></i><i class="ld-sk w60"></i></div>'
      else if (ctx === 'overlay') html = '<div class="ld-ctx-ghost"><i></i><i></i><i></i><i></i></div><div class="ld-ctx-overlay">' + svg + '<p>' + esc(S.label || 'Loading') + '…</p></div>'
      else html = '<div class="ld-solo">' + svg + '</div>'
      view.innerHTML = html
      stage.classList.remove('is-busy')
      $('[data-ld-title]').textContent = m.title
      $('[data-ld-intent]').textContent = m.intent || m.description || ''
      $('[data-ld-group]').textContent = m.group === 'common' ? 'everyday' : m.group
      // the export always uses the full-size drawing
      return renderCurrent({ idSuffix: undefined }).then(function (full) { if (my === job) { current.svg = full; exportCode() } })
    }, function (e) {
      if (my !== job) return
      stage.classList.remove('is-busy')
      view.innerHTML = '<p class="ld-empty">Could not draw this one: ' + esc(e.message) + '</p>'
    })
    writeUrl()
    markCurrent()
  }

  /* ───────── export */
  var code = $('[data-ld-code]'), note = $('[data-ld-note]')
  function attrs(o) { return Object.keys(o).filter(function (k) { return o[k] != null && o[k] !== '' }).map(function (k) { return ' ' + k + '="' + esc(o[k]) + '"' }).join('') }
  function palVarsOut() { var v = current.svg && palVars(current.svg); return v && Object.keys(v).length ? v : null }
  function exportCode() {
    var w = WI()
    var m = current.meta || metaNow()
    var isMorph = S.mode === 'morph', preset = isMorph ? S.morph.preset : S.name
    var named = !isMorph || !!S.morph.preset
    var size = S.ctx === 'alone' || S.ctx === 'overlay' ? S.size : 32
    var tagAttrs = isMorph && !S.morph.preset
      ? { morph: S.morph.items.join(','), effect: S.morph.effect !== 'bloom' ? S.morph.effect : null, hold: S.morph.hold !== 1.1 ? S.morph.hold : null }
      : { name: preset }
    tagAttrs = Object.assign(tagAttrs, { variant: S.style !== 'line' ? S.style : null, size: size !== 24 ? size : null, color: S.color, speed: S.speed !== 1 ? S.speed : null, label: S.label !== 'Loading' ? S.label : null })
    var pv = palVarsOut()
    var styleAttr = pv ? Object.keys(pv).map(function (k) { return k + ':' + pv[k] }).join(';') : null
    var t = S.tab, txt = '', lang = 'html', msg = ''
    if (t === 'img') {
      if (named) {
        txt = '<img src="' + CDN + 'svg/' + S.style + '/' + preset + '.svg" width="' + size + '" height="' + size + '" alt="' + esc(S.label || 'Loading') + '">'
        msg = S.color || pv || S.speed !== 1 ? 'An image keeps the original colours and speed. For your colour, palette or speed use the HTML tag, or download the SVG.' : 'No code, no install: works in any page, email builder or Markdown that allows images.'
      } else {
        txt = '<!-- custom sequences have no hosted file: download the SVG, then -->\n<img src="loader.svg" width="' + size + '" height="' + size + '" alt="' + esc(S.label || 'Loading') + '">'
        msg = 'Download the SVG below and use it as an image anywhere.'
      }
    } else if (t === 'tag') {
      txt = '<script src="' + CDN + 'cdn/loaders.js"></script>\n\n<with-loader' + attrs(tagAttrs) + (styleAttr ? ' style="' + styleAttr + '"' : '') + '></with-loader>'
      msg = 'Call .done() on the element to turn it into a check mark when the work is finished.'
    } else if (t === 'react' || t === 'vue') {
      var comp = isMorph && !S.morph.preset ? 'Morph' : 'Loader'
      var p = []
      if (comp === 'Morph') { p.push(t === 'react' ? 'items={' + JSON.stringify(S.morph.items) + '}' : ':items="' + esc(JSON.stringify(S.morph.items)).replace(/&quot;/g, "'") + '"'); if (S.morph.effect !== 'bloom') p.push('effect="' + S.morph.effect + '"'); if (S.morph.hold !== 1.1) p.push(t === 'react' ? 'hold={' + S.morph.hold + '}' : ':hold="' + S.morph.hold + '"') }
      else p.push('name="' + preset + '"')
      if (S.style !== 'line') p.push('variant="' + S.style + '"')
      if (size !== 24) p.push(t === 'react' ? 'size={' + size + '}' : ':size="' + size + '"')
      if (S.color) p.push('color="' + S.color + '"')
      if (S.speed !== 1) p.push(t === 'react' ? 'speed={' + S.speed + '}' : ':speed="' + S.speed + '"')
      if (S.label !== 'Loading') p.push('label="' + esc(S.label) + '"')
      if (pv) p.push(t === 'react' ? 'vars={' + JSON.stringify(pv) + '}' : ':vars="' + esc(JSON.stringify(pv)).replace(/&quot;/g, "'") + '"')
      var tag = '<' + comp + ' ' + p.join(' ') + ' />'
      txt = t === 'react'
        ? '// npm i @withicons/loaders\nimport { ' + comp + ' } from \'@withicons/loaders/react\'\n\nexport function Busy() {\n  return ' + tag + '\n}'
        : '<!-- npm i @withicons/loaders -->\n<script setup>\nimport { ' + comp + ' } from \'@withicons/loaders/vue\'\n</script>\n\n<template>\n  ' + tag + '\n</template>'
      lang = t === 'react' ? 'jsx' : 'vue'
      msg = 'Server-rendered as inline SVG: it inherits currentColor and the speed variable --wl-speed from any parent.'
    } else if (t === 'svg') {
      txt = current.svg; lang = 'svg'
      msg = 'Paste it inline. Change the speed on any parent with --wl-speed: 1.5, pause with --wl-state: paused.'
    } else {
      var names = LOADERS.map(function (l) { return l.name }).join(', ')
      txt = 'Loaders: with icons (' + LOADERS.length + ' animated loaders + ' + MORPHS.length + ' morph sequences, ' + D.styles.length + ' styles, MIT, no JS needed).\n' +
        'Use: <img src="' + CDN + 'svg/<style>/<name>.svg" width="32" height="32" alt="Loading">\n' +
        'This one: ' + (named ? preset : 'morph of ' + S.morph.items.join(',')) + ' in ' + S.style + '.\n' +
        'Themeable: <script src="' + CDN + 'cdn/loaders.js"></script> then <with-loader name="<name>" variant="<style>" color="#hex" speed="1"></with-loader>; morph="icon,icon,icon" chains library icons (a plain name is always an icon; loader:<name> puts a loader in the chain); el.done() shows a check.\n' +
        'Names: ' + names + '.\nMorphs: ' + MORPHS.map(function (l) { return l.name }).join(', ') + '.\nStyles: ' + D.styles.join(', ') + '.\nCatalogue (descriptions, aliases): ' + CDN + 'catalog.json'
      lang = 'text'
      msg = 'Paste this into your AI assistant or agent instructions: everything it needs, in a few lines, so it never has to read the docs.'
    }
    code.innerHTML = w && w.codeBlock ? w.codeBlock(txt, lang) : '<pre><code>' + esc(txt) + '</code></pre>'
    note.textContent = msg
  }

  /* ───────── panel: loader picks */
  var picks = $('[data-ld-picks]'), find = $('[data-ld-find]')
  var GROUP_TITLE = { common: 'Everyday', creative: 'Creative', festival: 'Festival', morph: 'Morph sequences' }
  function renderPicks() {
    var q = (find.value || '').trim()
    var list = q ? L.search(q, 40).map(function (r) { return BY[r.name] }).filter(function (l) { return l && l.group !== 'morph' }) : LOADERS
    var html = '', last = ''
    list.forEach(function (l) {
      if (!q && l.group !== last) { html += '<p class="ld-pick-h">' + GROUP_TITLE[l.group] + '</p>'; last = l.group }
      html += '<button type="button" role="option" class="ld-pick" data-pick="' + l.name + '" aria-selected="' + (S.mode === 'loader' && l.name === S.name) + '" title="' + esc(l.title) + '"><span class="visually-hidden">' + esc(l.title) + '</span></button>'
    })
    picks.innerHTML = html || '<p class="ld-empty">Nothing found. Try “dots”, “ai” or “festival”.</p>'
    // thumbnails in line (fast, calm); they play on hover and when selected
    $$('[data-pick]', picks).forEach(function (b) {
      var n = b.getAttribute('data-pick')
      draw(n, 'line', { size: 28, label: '' }).then(function (svg) { b.insertAdjacentHTML('afterbegin', svg) })
    })
  }
  picks.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b) return
    S.mode = 'loader'; S.name = b.getAttribute('data-pick'); syncMode(); paint()
  })
  find.addEventListener('input', renderPicks)

  /* ───────── panel: morph */
  var seq = $('[data-ld-seq]'), presets = $('[data-ld-presets]'), effects = $('[data-ld-effects]')
  function usePreset(name, quiet) {
    var m = BY[name]; if (!m) return
    S.morph = { items: m.morph.slice(), effect: m.effect || 'bloom', hold: Math.round(m.duration / m.morph.length * 10) / 10, preset: name }
    if (!quiet) { renderMorphPanel(); paint() }
  }
  function renderMorphPanel() {
    presets.innerHTML = MORPHS.map(function (m) { return '<button type="button" data-preset="' + m.name + '" aria-pressed="' + (S.morph.preset === m.name) + '">' + esc(m.title) + '</button>' }).join('')
    seq.innerHTML = S.morph.items.map(function (n, i) {
      return '<li data-i="' + i + '"><span class="ld-seq-i" data-seq-icon="' + esc(n) + '"></span>' + esc(n) +
        (i ? '<button type="button" data-move="' + i + '" aria-label="Move ' + esc(n) + ' earlier" title="Move earlier">‹</button>' : '') +
        (S.morph.items.length > 1 ? '<button type="button" data-del="' + i + '" aria-label="Remove ' + esc(n) + '" title="Remove">×</button>' : '') + '</li>'
    }).join('')
    $$('[data-seq-icon]', seq).forEach(function (el) {
      // the same reading as the runtime (0.6.0): a plain name is an icon, "loader:<name>" a loader
      var it = L.morphItem(el.getAttribute('data-seq-icon'))
      var p = !it ? Promise.reject(new Error('empty')) : it.kind === 'loader' ? draw(it.name, 'line', { size: 20, label: '' }) : L.iconSvg(it.name, 'line')
      p.then(function (svg) { el.innerHTML = svg.replace(/width="24" height="24"/, 'width="20" height="20"') }, function () { el.textContent = '?' })
    })
    effects.innerHTML = D.effects.map(function (e) { return '<button type="button" role="radio" data-fx="' + e.name + '" aria-checked="' + (S.morph.effect === e.name) + '" title="' + esc(e.say) + '">' + esc(e.title) + '</button>' }).join('')
    $('[data-ld-hold]').value = S.morph.hold
    $('[data-ld-holdout]').textContent = S.morph.hold + ' s'
  }
  presets.addEventListener('click', function (e) { var b = e.target.closest('[data-preset]'); if (b) usePreset(b.getAttribute('data-preset')) })
  seq.addEventListener('click', function (e) {
    var d = e.target.closest('[data-del]'), mv = e.target.closest('[data-move]')
    if (d) S.morph.items.splice(+d.getAttribute('data-del'), 1)
    else if (mv) { var i = +mv.getAttribute('data-move'); var t = S.morph.items[i]; S.morph.items[i] = S.morph.items[i - 1]; S.morph.items[i - 1] = t }
    else return
    S.morph.preset = null; renderMorphPanel(); paint()
  })
  $('[data-ld-add]').addEventListener('submit', function (e) {
    e.preventDefault()
    var inp = $('[data-ld-addname]'), n = (inp.value || '').trim().toLowerCase().replace(/\s+/g, '-')
    if (!n) return
    // an icon by default; a loader only as "loader:<name>" (typed so, or a name that is a loader and no icon)
    var w = WI(), isIcon = function (x) { return !!(w && w.icons().some(function (i) { return i.name === x })) }
    var lm = /^loader:[\s-]*(.+)$/.exec(n), ok = false
    if (lm) { var ld = L.get(lm[1]); if (ld) { n = 'loader:' + ld.name; ok = true } }
    else {
      n = n.replace(/^icon:[\s-]*/, '')
      ok = isIcon(n)
      if (!ok && w && w.resolve) { var r = w.resolve(n); if (r) n = r.name || r; ok = !!r }
      if (!ok && L.get(n)) { n = 'loader:' + L.get(n).name; ok = true }
    }
    if (!ok) { if (w) w.toast('No icon called “' + n + '”'); return }
    if (S.morph.items.length >= 8) { if (w) w.toast('Up to 8 steps'); return }
    S.morph.items.push(n); S.morph.preset = null; inp.value = ''; renderMorphPanel(); paint()
  })
  effects.addEventListener('click', function (e) { var b = e.target.closest('[data-fx]'); if (!b) return; S.morph.effect = b.getAttribute('data-fx'); S.morph.preset = null; renderMorphPanel(); paint() })
  $('[data-ld-hold]').addEventListener('input', function (e) { S.morph.hold = +e.target.value; S.morph.preset = null; $('[data-ld-holdout]').textContent = S.morph.hold + ' s'; schedule() })

  /* ───────── panel: mode, style, colour, sliders */
  function syncMode() {
    $$('[data-mode]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-mode') === S.mode)) })
    $$('[data-pane]').forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== S.mode })
    $$('[data-pick]').forEach(function (b) { b.setAttribute('aria-selected', String(S.mode === 'loader' && b.getAttribute('data-pick') === S.name)) })
    if (S.mode === 'morph') renderMorphPanel()
  }
  $$('[data-mode]').forEach(function (b) { b.addEventListener('click', function () { S.mode = b.getAttribute('data-mode'); syncMode(); paint() }) })
  var sw = $('[data-ld-swatches]')
  function renderSwatches() {
    sw.innerHTML = SW.map(function (s) {
      return '<button type="button" role="radio" class="ld-sw" style="--sw:' + (s.c || 'linear-gradient(135deg, var(--ink) 50%, var(--paper) 50%)') + ';' + (s.c ? '' : 'background:linear-gradient(135deg, var(--ink) 50%, var(--card) 50%)') + '" data-sw="' + s.id + '" aria-checked="' + ((s.c || null) === (S.color || null)) + '" title="' + s.title + '"><span class="visually-hidden">' + s.title + '</span></button>'
    }).join('') + '<label class="ld-sw ld-sw-custom" title="Any colour"><span class="visually-hidden">Any colour</span><input type="color" value="' + (S.color || '#7b5cff') + '" data-sw-custom></label>'
  }
  sw.addEventListener('click', function (e) { var b = e.target.closest('[data-sw]'); if (!b) return; var s = SW.filter(function (x) { return x.id === b.getAttribute('data-sw') })[0]; S.color = s.c; renderSwatches(); paint() })
  sw.addEventListener('input', function (e) { if (e.target.matches('[data-sw-custom]')) { S.color = e.target.value; schedule() } })
  var pals = $('[data-ld-palettes]')
  function renderPalettes() {
    pals.innerHTML = PAL.map(function (p) {
      var dots = p.p ? [p.p.c1, p.p.c2, p.p.c3, p.p.accent].map(function (c) { return '<i style="background:' + c + '"></i>' }).join('') : '<i style="background:conic-gradient(#ff5a36,#ffd23f,#22a861,#2f5bff,#ff4fa3,#ff5a36)"></i>'
      return '<button type="button" role="radio" class="ld-pal" data-pal="' + p.id + '" aria-checked="' + (S.pal === p.id) + '">' + dots + '<span>' + p.title + '</span></button>'
    }).join('')
  }
  pals.addEventListener('click', function (e) { var b = e.target.closest('[data-pal]'); if (!b) return; S.pal = b.getAttribute('data-pal'); renderPalettes(); paint() })
  var t0 = 0
  function schedule() { clearTimeout(t0); t0 = setTimeout(paint, 60) }
  $('[data-ld-size]').addEventListener('input', function (e) { S.size = +e.target.value; $('[data-ld-sizeout]').textContent = S.size + ' px'; resizeOnly() })
  $('[data-ld-speed]').addEventListener('input', function (e) { S.speed = +e.target.value; $('[data-ld-speedout]').textContent = S.speed + '×'; speedOnly() })
  $('[data-ld-text]').addEventListener('input', function (e) { S.label = e.target.value; schedule() })
  // size and speed change without re-drawing: the svg reads them live
  function resizeOnly() {
    var svg = $('.ld-solo svg, .ld-ctx-overlay svg', view)
    if (svg) { svg.setAttribute('width', S.size); svg.setAttribute('height', S.size) }
    clearTimeout(t0); t0 = setTimeout(function () { renderCurrent({}).then(function (s) { current.svg = s; exportCode(); writeUrl() }) }, 200)
  }
  function speedOnly() {
    $$('svg.wl', view).forEach(function (s) { s.style.setProperty('--wl-speed', S.speed) })
    clearTimeout(t0); t0 = setTimeout(function () { renderCurrent({}).then(function (s) { current.svg = s; exportCode(); writeUrl() }) }, 200)
  }
  var play = $('[data-ld-play]')
  play.addEventListener('click', function () {
    S.paused = !S.paused
    play.setAttribute('aria-pressed', String(S.paused)); play.setAttribute('aria-label', S.paused ? 'Play' : 'Pause')
    $$('svg.wl', view).forEach(function (s) { s.style.setProperty('--wl-state', S.paused ? 'paused' : 'running') })
  })
  $$('[data-ctx-btn]').forEach(function (b) { b.addEventListener('click', function () {
    S.ctx = b.getAttribute('data-ctx-btn'); stage.setAttribute('data-ctx', S.ctx)
    $$('[data-ctx-btn]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); paint()
  }) })
  $$('[data-bg-btn]').forEach(function (b) { b.addEventListener('click', function () {
    S.bg = b.getAttribute('data-bg-btn'); stage.setAttribute('data-bg', S.bg)
    $$('[data-bg-btn]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
  }) })
  $$('[data-tab]').forEach(function (b) { b.addEventListener('click', function () {
    S.tab = b.getAttribute('data-tab'); $$('[data-tab]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)) }); exportCode()
  }) })
  function fileName() { return (S.mode === 'morph' ? (S.morph.preset || 'my-sequence') : S.name) + '-' + S.style + '.svg' }
  $('[data-ld-dl]').addEventListener('click', function () {
    renderCurrent({ flat: true, size: S.size }).then(function (s) { var w = WI(); if (w) { w.download(fileName(), s); w.toast('Downloaded ' + fileName()) } })
  })
  $('[data-ld-copysvg]').addEventListener('click', function () { var w = WI(); if (w && current.svg) w.copy(current.svg, 'SVG copied') })
  $('[data-ld-share]').addEventListener('click', function () { var w = WI(); var u = new URL(linkFor(true), location.href).href; if (w) w.copy(u, 'Link copied') })

  /* ───────── gallery */
  var grid = $('[data-ld-grid]')
  var io = 'IntersectionObserver' in W ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var c = e.target
      if (e.isIntersecting && !c.__drawn) { c.__drawn = true; fillCard(c) }
      var svg = $('svg', c); if (svg) svg.style.setProperty('--wl-state', e.isIntersecting ? 'running' : 'paused')
    })
  }, { rootMargin: '160px' }) : null
  function fillCard(c) {
    var n = c.getAttribute('data-card'), art = $('.ld-card-art', c)
    draw(n, S.style, { size: 72, label: '' }).then(function (svg) { if (c.getAttribute('data-style') === S.style) art.innerHTML = svg })
  }
  function renderGrid() {
    var list = D.loaders.filter(function (l) { return S.filter === 'all' || l.group === S.filter })
    grid.innerHTML = list.map(function (l) {
      return '<button type="button" class="ld-card" data-card="' + l.name + '" data-style="' + S.style + '"><span class="ld-card-g">' + (l.group === 'common' ? 'everyday' : l.group) + '</span><span class="ld-card-art"></span>' +
        '<span class="ld-card-meta"><b>' + esc(l.title) + '</b><span>' + esc(l.intent || l.description) + '</span></span></button>'
    }).join('')
    $('[data-ld-galstyle]').textContent = 'in ' + STYLE_TITLE(S.style)
    $$('[data-card]', grid).forEach(function (c) { if (io) io.observe(c); else fillCard(c) })
    markCurrent()
  }
  function markCurrent() {
    var cur = S.mode === 'morph' ? S.morph.preset : S.name
    $$('[data-card]', grid).forEach(function (c) { c.classList.toggle('is-current', c.getAttribute('data-card') === cur) })
  }
  grid.addEventListener('click', function (e) {
    var c = e.target.closest('[data-card]'); if (!c) return
    var n = c.getAttribute('data-card')
    if (BY[n].group === 'morph') { S.mode = 'morph'; usePreset(n, true) } else { S.mode = 'loader'; S.name = n }
    syncMode(); paint()
    var top = $('#studio'); if (top) top.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  })
  $$('[data-filter]').forEach(function (b) { b.addEventListener('click', function () {
    S.filter = b.getAttribute('data-filter'); $$('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); renderGrid()
  }) })

  /* ───────── hero board: a mosaic of loaders in many styles */
  var BOARD = [['morph-ai', 'line', 1], ['spinner', 'glass'], ['orbit', 'kawaii'], ['dots-bounce', 'clay'], ['diya', 'utsav'], ['ghost', 'halloween'], ['hearts', 'valentine'],
    ['christmas-tree', 'christmas'], ['ai-sparkle', 'chrome'], ['shape-shift', 'bauhaus'], ['icon-morph', 'dock'], ['lantern', 'lunar'], ['rocket', 'soft3d'],
    ['fireworks', 'rangoli'], ['coffee', 'plush'], ['gears', 'skeuo'], ['spinner-dots', 'liquid'], ['bars-equalizer', 'brutal'], ['atom', 'luxe'], ['plant-grow', 'pastel']]
  function renderBoard() {
    var el = $('[data-ld-board]'); if (!el) return
    var tiles = BOARD.filter(function (b) { return BY[b[0]] && D.styles.indexOf(b[1]) >= 0 }).slice(0, 13)
    el.innerHTML = tiles.map(function (b, i) { return '<div class="ld-tile' + (b[2] ? ' is-big' : '') + '" style="--i:' + i + '" data-b="' + i + '"><span class="ld-tile-s">' + esc(BY[b[0]].title) + ' · ' + STYLE_TITLE(b[1]) + '</span></div>' }).join('')
    tiles.forEach(function (b, i) {
      draw(b[0], b[1], { size: 24, label: '' }).then(function (svg) { var t = $('[data-b="' + i + '"]', el); if (t) t.insertAdjacentHTML('afterbegin', svg) })
    })
  }

  /* ───────── ways to use */
  function renderWays() {
    var w = WI(), el = $('[data-ld-ways]'); if (!el || !w) return
    var cb = function (c, l) { return w.codeBlock(c, l) }
    el.innerHTML = [
      ['As an image', 'Zero JavaScript. Pick a style and a name; the file animates itself.', cb('<img src="' + CDN + 'svg/line/spinner.svg"\n     width="32" height="32" alt="Loading">', 'html')],
      ['As a tag', 'Colour, speed, morph sequences and a finished state, in any framework or none.', cb('<script src="' + CDN + 'cdn/loaders.js"></script>\n<with-loader name="orbit" variant="glass" color="#7b5cff"></with-loader>\n<with-loader morph="file,cloud-upload,check-circle"></with-loader>', 'html')],
      ['React and Vue', 'Inline SVG components. Line is built in; other styles load when first used.', cb("import { Loader, Morph } from '@withicons/loaders/react'\n\n<Loader name=\"dots-typing\" variant=\"kawaii\" size={40} />\n<Morph items={['package', 'truck', 'home']} effect=\"slide-left\" />", 'jsx')],
      ['For AI agents', 'Agents save tokens: one URL pattern, a searchable catalogue, no docs to read.', cb("import { search, url } from '@withicons/loaders'\nsearch('ai thinking')   // [{ name: 'ai-sparkle' }, …]\nurl('ai-sparkle', 'glass')\n// " + CDN + 'catalog.json', 'js')],
    ].map(function (x) { return '<article class="ld-way"><h3>' + x[0] + '</h3><p>' + x[1] + '</p>' + x[2] + '</article>' }).join('')
  }

  /* ───────── style picker */
  function mountStyles() {
    var w = WI(), el = $('[data-ld-styles]')
    if (!el) return
    var pick = function (s) {
      S.style = s
      if (w && w.stylePicker && w.stylePicker.remember) w.stylePicker.remember(s)
      doc.body.className = doc.body.className.replace(/\bs-[a-z0-9]+\b/, 's-' + s)
      paint(); renderGrid()
    }
    if (w && w.stylePicker && w.stylePicker.row) w.stylePicker.row(el, { current: S.style, icon: 'loader', onPick: pick, max: 6, size: 28, label: 'Style', title: 'Choose a loader style' })
    else el.innerHTML = '<select class="ld-input" data-style-sel>' + D.styles.map(function (s) { return '<option' + (s === S.style ? ' selected' : '') + '>' + s + '</option>' }).join('') + '</select>'
    var sel = $('[data-style-sel]', el); if (sel) sel.addEventListener('change', function () { pick(sel.value) })
  }

  /* ───────── boot */
  function boot() {
    readUrl()
    var n = LOADERS.length
    $$('[data-ld-count]').forEach(function (e) { e.textContent = n + ' loaders × ' + D.styles.length + ' styles' })
    $$('[data-ld-total]').forEach(function (e) { e.textContent = D.loaders.length })
    var w = WI(), dl = $('[data-ld-names]')
    if (dl) dl.innerHTML = LOADERS.map(function (l) { return '<option value="' + l.name + '">' }).join('') + (w ? w.icons().map(function (i) { return '<option value="' + i.name + '">' }).join('') : '')
    renderSwatches(); renderPalettes(); renderPicks(); syncMode(); mountStyles(); renderGrid(); renderBoard(); renderWays()
    if (S.mode === 'morph') renderMorphPanel()
    paint()
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot()
})()
