// emit-classes — @withicons/classes (packages/classes): the Font-Awesome-style class API, its own package so that
// neither it nor @withicons/web (the <with-icon> element) gets near jsDelivr's 150 MB package limit.
//
//   dist/with-<style>.css     CSS-only icons: <i class="with with-home with-solid"></i>  (SVG data-URI masks, zero JS)
//   dist/with-all.css         @import of every style file (line is the default); heavy, for prototypes
//   dist/<style>/<name>.css   one icon's rule;  dist/with-base.css  the shared base rules
//   dist/with-loader.js       classic script: links only the <style>/<name>.css files of the icons on the page
//   dist/with-icons.js        classic script: decorates .with elements with inline <svg> (true multi-colour, stroke width);
//                             imports each icon shown from @withicons/web (dist/icons/<style>/<name>.js, same version)
//   dist/with-icons.d.ts      window.WithIcons typings
//   dist/data/alias/<i>.js, dist/data/meta.js   alias shards + names, for the loader's / runtime's alias and typo hints
//   dist/demo.html            demo page
//
// Also mirrors everything into site/vendor/with/ (self-contained: data chunks copied to site/vendor/with/data/).
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { J, LOOKUP_SRC, styleTable, innerOf, renderOf, namesAndAliasesDts, flattenVars, liveStrokeStyles, paletteDoc, distWriter, basePkg, writePkg } from './emit-core.mjs'

const MODIFIERS = ['xs', 'sm', 'lg', '2x', '3x', '4x', '5x', 'fw', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270',
  'flip-h', 'flip-v', 'flip-both', 'rtl']
// class suffixes that are never icon names (modifiers + internal / future-proof words)
const RESERVED = [...MODIFIERS, 'svg', 'js', 'css', 'all', 'icons', 'skip']

// ---------------------------------------------------------------- CSS
// Two layers per icon, both CSS-only:
//   .with           background-image  --with-p : the palette colours (palette styles only), CSS variables baked to their defaults
//   .with::after    currentColor masked by --with-i : the ink, so `color` still recolours it
// Ink that the original drawing covers with later palette shapes is knocked out of the mask, so the
// stacking order of the real SVG is preserved. Mono styles only set --with-i (exactly the old single mask).
const EMPTY = 'linear-gradient(#0000 0 0)'
const MASK = `var(--with-i,${EMPTY}) center/contain no-repeat`
function baseCss() {
  const sizes = { xs: '.75em', sm: '.875em', '2x': '2em', '3x': '3em', '4x': '4em', '5x': '5em' }
  return [
    // .with keeps real (0,1,0) specificity; modifiers use .with.with-x (0,2,0) so they win regardless of file order
    `.with{display:inline-block;width:1em;height:1em;vertical-align:-.125em;flex-shrink:0;font-style:normal;line-height:1;background:var(--with-p,none) center/contain no-repeat}`,
    `.with::after{content:"";display:block;width:100%;height:100%;background-color:currentColor;-webkit-mask:${MASK};mask:${MASK}}`,
    `.with[data-with-svg]{background:none}.with[data-with-svg]::after{content:none}`,
    `.with>.with-svg{display:block;width:100%;height:100%;overflow:visible}`,
    Object.entries(sizes).map(([k, v]) => `.with.with-${k}{font-size:${v}}`).join(''),
    `.with.with-lg{font-size:1.33em;vertical-align:-.25em}`,
    `.with.with-fw{width:1.25em}`,
    `.with.with-spin{animation:with-spin 1.6s linear infinite}.with.with-pulse{animation:with-spin 1s steps(8) infinite}`,
    `@keyframes with-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`,
    `.with.with-rotate-90{rotate:90deg}.with.with-rotate-180{rotate:180deg}.with.with-rotate-270{rotate:270deg}`,
    `.with.with-flip-h{scale:-1 1}.with.with-flip-v{scale:1 -1}.with.with-flip-both{scale:-1 -1}`,
    // with-rtl: mirror only in right-to-left text (directional icons); [dir=rtl] fallback where :dir() is missing (iOS < 16.4)
    `.with.with-rtl:dir(rtl){scale:-1 1}`,
    `@supports not selector(:dir(rtl)){[dir=rtl] .with.with-rtl{scale:-1 1}[dir=rtl] [dir=ltr] .with.with-rtl{scale:none}}`,
    // browsers without the individual transform properties (Chrome < 104, Samsung Internet < 20): a flipped arrow
    // must still point the right way, so fall back to transform (spin then replaces it, which is only cosmetic)
    `@supports not (scale:1){.with.with-rotate-90{transform:rotate(90deg)}.with.with-rotate-180{transform:rotate(180deg)}.with.with-rotate-270{transform:rotate(270deg)}` +
      `.with.with-flip-h,[dir=rtl] .with.with-rtl{transform:scaleX(-1)}.with.with-flip-v{transform:scaleY(-1)}.with.with-flip-both{transform:scale(-1)}}`,
    `@media (prefers-reduced-motion:reduce){.with.with-spin,.with.with-pulse{animation:none}}`,
    // Windows High Contrast / forced colours would repaint the masked background as Canvas (invisible ink): keep
    // currentColor, which is itself the forced CanvasText / LinkText / ButtonText
    `@media (forced-colors:active){.with::after{forced-color-adjust:none;background-color:currentColor}}`,
    // both layers are backgrounds, which printing drops by default ("Background graphics" off)
    `.with,.with::after{-webkit-print-color-adjust:exact;print-color-adjust:exact}`,
  ].join('\n')
}

// Compact SVG data URI for a mask: single-quoted attributes, every paint -> black (alpha is what matters),
// opacity attributes kept so partial alpha survives, only the characters CSS/URLs need are escaped.
function maskUri(style, inner) {
  const attrs = Object.entries(style.root || {}).map(([k, v]) => ` ${k}='${v}'`).join('')
  if (inner.includes("'")) throw new Error(`single quote in ${style.name} markup`)
  let s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'${attrs}>${inner.replace(/"/g, "'")}</svg>`
  s = s.replace(/var\(--[\w-]+,\s*currentColor\)/g, 'black').replace(/currentColor/g, 'black')
  s = s.replace(/[%#"\\\r\n\t]|[^\x20-\x7e]/g, c => encodeURIComponent(c))
  return `url("data:image/svg+xml,${s}")`
}

// Palette styles: split the drawing into a palette picture and an ink mask (see the CSS comment above).
// Returns null when the style paints only currentColor (then maskUri() alone is exact).
const PAINT_DROP = new Set(['fill', 'stroke', 'color'])
function paintKind(v) {
  if (v == null) return 'none'
  const r = flattenVars(String(v)).trim()
  return r === 'none' || r === 'transparent' ? 'none' : /^currentcolor$/i.test(r) ? 'ink' : 'pal'
}
const q = v => String(v).replace(/'/g, '&#39;').replace(/"/g, "'").replace(/</g, '&lt;')
const nodeMarkup = (tag, a) => `<${tag}${Object.entries(a).filter(([, v]) => v != null && v !== false).map(([k, v]) => ` ${k}='${q(v)}'`).join('')}/>`
const encodeSvg = s => `url("data:image/svg+xml,${s.replace(/[%#"\\\r\n\t]|[^\x20-\x7e]/g, c => encodeURIComponent(c))}")`
export function layerUris(style, nodes) {
  const root = style.root || {}
  const rootFill = root.fill == null ? 'black' : root.fill, rootStroke = root.stroke == null ? 'none' : root.stroke
  const parts = []
  for (const [tag, a] of nodes) {
    const fill = a.fill == null ? rootFill : a.fill, stroke = a.stroke == null ? rootStroke : a.stroke
    const fk = paintKind(fill), sk = paintKind(stroke)
    const base = {}
    for (const [k, v] of Object.entries(a)) if (!PAINT_DROP.has(k)) base[k] = typeof v === 'string' ? flattenVars(v) : v
    // fill and stroke of one element can belong to different layers: split it (fill is painted first)
    if (fk !== 'none') parts.push({ ink: fk === 'ink', tag, a: base, fill: flattenVars(String(fill)), stroke: 'none' })
    if (sk !== 'none') {
      if (fk !== 'none' && fk === sk) { parts[parts.length - 1].stroke = flattenVars(String(stroke)); continue }
      parts.push({ ink: sk === 'ink', tag, a: base, fill: 'none', stroke: flattenVars(String(stroke)) })
    }
  }
  if (!parts.some(p => !p.ink)) return null
  const rootAttrs = Object.entries(root).filter(([k]) => !PAINT_DROP.has(k)).map(([k, v]) => ` ${k}='${q(v)}'`).join('')
  const open = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'${rootAttrs}>`
  const paint = (p, col) => nodeMarkup(p.tag, { ...p.a, fill: p.fill === 'none' ? 'none' : col || p.fill, stroke: p.stroke === 'none' ? 'none' : col || p.stroke })
  const pal = parts.filter(p => !p.ink).map(p => paint(p)).join('')
  // ink runs, each knocked out by the palette shapes drawn after it
  let ink = '', masks = '', run = [], n = 0
  const flush = end => {
    if (!run.length) return
    const later = parts.slice(end).filter(p => !p.ink)
    const body = run.map(p => paint(p, 'black')).join('')
    if (later.length) {
      const id = 'k' + n++
      masks += `<mask id='${id}' maskUnits='userSpaceOnUse' x='-4' y='-4' width='32' height='32'><rect x='-4' y='-4' width='32' height='32' fill='white'/>${later.map(p => paint(p, 'black')).join('')}</mask>`
      ink += `<g mask='url(#${id})'>${body}</g>`
    } else ink += body
    run = []
  }
  parts.forEach((p, i) => { if (p.ink) run.push(p); else flush(i) })
  flush(parts.length)
  return {
    p: encodeSvg(`${open}${pal}</svg>`),
    i: ink ? encodeSvg(`${open}${masks}${ink}</svg>`) : EMPTY,
  }
}

// ---------------------------------------------------------------- JS runtime (serialized; free vars:
// VERSION, STYLES, DEFAULT_STYLE, STYLE_NAMES, RESERVED, BASE_CSS, DATA_BASE, WEB + LOOKUP_SRC helpers)
function withRuntime() {
  var G = typeof window !== 'undefined' ? window : null
  if (!G || typeof document === 'undefined' || G.WithIcons) return
  var has = function (o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k) }
  var seen = {}
  var warn = function (m) { if (!seen[m] && typeof console !== 'undefined') { seen[m] = 1; console.warn(m) } }
  var esc = function (v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
  var STYLE_SET = {}, RES = {}
  STYLE_NAMES.forEach(function (s) { STYLE_SET[s] = 1 })
  RESERVED.forEach(function (s) { RES[s] = 1 })

  // alias shards + names live next to this script (./data/); the icons themselves come from @withicons/web:
  // per icon <web>/dist/icons/<style>/<name>.js, whole styles <web>/dist/data/<style>.js. <web> is the sibling package
  // on the same CDN or node_modules path (…/@withicons/classes@1.2.3/dist/ -> …/@withicons/web@1.2.3/dist/), else
  // jsDelivr at this version. Overrides on the script tag: data-with-web="…/web/dist/", data-with-base="…/data/"
  // (alias + meta + style chunks, e.g. @withicons/web's dist/data/) and data-with-icons="…/icons/".
  var me = document.currentScript || document.querySelector('script[src*="with-icons"]')
  var attr = function (k) { return (me && me.getAttribute(k)) || '' }
  var abs = function (u) { try { return new URL(u, (me && me.src) || document.baseURI).href } catch (e) { return u } }
  var web = null
  if (WEB) {
    var src = (me && me.src) || '', wm = /^(.*\/)(@withicons\/|packages\/)classes(@[^/]*)?\/dist\//.exec(src)
    web = attr('data-with-web') ? abs(attr('data-with-web')) : wm ? wm[1] + wm[2] + 'web' + (wm[3] || '') + '/dist/' : 'https://cdn.jsdelivr.net/npm/@withicons/web@' + VERSION + '/dist/'
  }
  var base = abs(attr('data-with-base') || DATA_BASE)
  var styleBase = attr('data-with-base') || !web ? base : web + 'data/'
  var iconBase = attr('data-with-icons') ? abs(attr('data-with-icons')) : web ? web + 'icons/' : null
  var DATA = {}, PENDING = {}, META = null, ONE = {}, ALIAS = {}
  var NAMES = {}
  NAME_LIST.split(' ').forEach(function (n) { NAMES[n] = 1 })

  function load(style) {
    var s = style || DEFAULT_STYLE
    if (!has(STYLES, s)) return Promise.reject(new Error('with icons: unknown style "' + s + '". Use one of: ' + STYLE_NAMES.join(', ') + '.'))
    if (DATA[s]) return Promise.resolve(DATA[s])
    return PENDING[s] || (PENDING[s] = import(styleBase + s + '.js').then(function (m) { return (DATA[s] = m.default) }, function (e) { delete PENDING[s]; throw e }))
  }
  // one icon's inner markup: its own small file when the package has them, else the style's data
  function icon(style, name) {
    if (DATA[style] && has(DATA[style], name)) return Promise.resolve(DATA[style][name])
    var key = style + '/' + name
    if (has(ONE, key)) return Promise.resolve(ONE[key])
    if (!iconBase || !has(STYLES, style)) return load(style).then(function (map) { return map[name] })
    return PENDING[key] || (PENDING[key] = import(iconBase + key + '.js').then(function (m) { return (ONE[key] = m.default) },
      function () { delete PENDING[key]; return load(style).then(function (map) { return map[name] }) }))
  }
  function meta() { return META || (META = import(base + 'meta.js').then(function (m) { return m.default }, function (e) { META = null; throw e })) }
  // the alias shards (data/alias/<i>.js) that can hold these lookup keys
  function aliases(cands) {
    var want = {}
    cands.forEach(function (c) { withKeys(c).forEach(function (k) { want[withShard(k, ALIAS_SHARDS)] = 1 }) })
    return Promise.all(Object.keys(want).map(function (i) {
      return ALIAS[i] || (ALIAS[i] = import(base + 'alias/' + i + '.js').then(function (m) { return m.default }, function () { delete ALIAS[i]; return {} }))
    })).then(function (list) { var o = {}; list.forEach(function (x) { for (var k in x) o[k] = x[k] }); return o })
  }

  // name (canonical or alias) -> canonical, warning once about aliases / typos; resolves null when unknown
  function resolve(cands, map, strict) {
    var known = function (k) { return has(NAMES, k) || has(map, k) }
    for (var i = 0; i < cands.length; i++) if (known(cands[i])) return Promise.resolve(cands[i])
    if (!cands.length) return Promise.resolve(null)
    return aliases(cands).then(function (al) {
      for (var i = 0; i < cands.length; i++) {
        try { var n = withLookup(cands[i], known, [], al); warn('with icons: "with-' + cands[i] + '" is an alias; use the canonical class "with-' + n + '".'); return { md: null, n: n } } catch (e) { if (e.code === 'WITH_AMBIGUOUS_ICON') return { md: null, e: e } }
      }
      return meta().then(function (md) { return { md: md } })
    }).then(function (r) {
      if (r.n) return r.n
      var md = r.md || { names: [], aliases: {} }
      var errs = r.e ? [r.e] : []
      for (var i = 0; !r.e && i < cands.length; i++) {
        try {
          var n = withLookup(cands[i], known, md.names, md.aliases)
          if (n !== cands[i]) warn('with icons: "with-' + cands[i] + '" is an alias; use the canonical class "with-' + n + '".')
          return n
        } catch (e) { errs.push(e) }
      }
      var e = errs[0]
      var msg = e.code === 'WITH_AMBIGUOUS_ICON'
        ? 'with icons: "with-' + cands[0] + '" is ambiguous; use one of: ' + e.candidates.map(function (c) { return 'with-' + c }).join(', ') + '.'
        : 'with icons: unknown icon "with-' + cands[0] + '". Did you mean: ' + (e.suggestions || []).map(function (c) { return 'with-' + c }).join(', ') + '?'
      if (strict) throw new Error(msg)
      warn(msg)
      return null
    })
  }

  function markup(inner, style, o) {
    var st = STYLES[style], a = { xmlns: 'http://www.w3.org/2000/svg', width: o.size == null ? '1em' : o.size, height: o.size == null ? '1em' : o.size, viewBox: '0 0 24 24' }
    for (var k in st.root) a[k] = st.root[k]
    if (o.color) a.color = o.color
    if (st.strokeWidth !== false && o.strokeWidth != null && o.strokeWidth !== '') {
      var w = Number(o.strokeWidth)
      if (w > 0 && isFinite(w)) a['stroke-width'] = w
      else warn('with icons: ignoring invalid stroke width "' + o.strokeWidth + '".')
    }
    if (o['class']) a['class'] = o['class']
    if (o.label) a.role = 'img'
    else { a['aria-hidden'] = 'true'; a.focusable = 'false' }
    var s = '<svg'
    for (var q in a) s += ' ' + q + '="' + esc(a[q]) + '"'
    return s + '>' + (o.label ? '<title>' + esc(o.label) + '</title>' : '') + inner + '</svg>'
  }

  // parse an element's classes: { style, cands }
  function parse(el) {
    var style = null, cands = [], cl = el.classList
    for (var i = 0; i < cl.length; i++) {
      var c = cl[i]
      if (c.slice(0, 5) !== 'with-') continue
      var k = c.slice(5)
      if (STYLE_SET[k]) { if (!style) style = k; continue }
      if (!RES[k] && k) cands.push(k)
    }
    return { style: style || DEFAULT_STYLE, cands: cands }
  }
  function clear(el) {
    if (el._withSvg && el._withSvg.parentNode === el) el.removeChild(el._withSvg)
    el._withSvg = el._withKey = null
    if (el.hasAttribute('data-with-svg')) el.removeAttribute('data-with-svg')
  }
  function skip(el) { return !el.classList || !el.classList.contains('with') || (el.closest && el.closest('[data-with-skip]')) }
  function one(el) {
    if (skip(el)) { if (el._withSvg) clear(el); return Promise.resolve() }
    var p = parse(el)
    if (!p.cands.length) { clear(el); return Promise.resolve() }
    var token = el._withToken = (el._withToken || 0) + 1
    if (!has(STYLES, p.style)) return Promise.resolve()
    return resolve(p.cands, DATA[p.style] || {}).then(function (name) {
      return name ? icon(p.style, name).then(function (inner) { return [name, inner] }) : [null]
    }).then(function (r) {
        var name = r[0], inner = r[1]
        if (token !== el._withToken) return
        if (!name || inner == null) { clear(el); return }
        var label = el.getAttribute('aria-label') || ''
        var sw = el.getAttribute('data-with-stroke-width') || ''
        var key = name + '|' + p.style + '|' + sw + '|' + label
        if (key === el._withKey && el._withSvg && el._withSvg.parentNode === el) return
        var t = document.createElement('div')
        t.innerHTML = markup(inner, p.style, { strokeWidth: sw, label: label, 'class': 'with-svg' })
        var svg = t.firstChild
        if (el._withSvg && el._withSvg.parentNode === el) el.replaceChild(svg, el._withSvg)
        else el.appendChild(svg)
        el._withSvg = svg
        el._withKey = key
        if (el.getAttribute('data-with-svg') !== name) el.setAttribute('data-with-svg', name)
    }, function (e) { warn(e.message) })
  }
  function render(root) {
    var r = root || document
    var list = []
    if (r.nodeType === 1 && (r._withSvg || r.classList.contains('with'))) list.push(r)
    if (r.querySelectorAll) list.push.apply(list, r.querySelectorAll('.with'))
    return Promise.all(list.map(one)).then(function () {})
  }
  function svg(name, style, opts) {
    var s = style || DEFAULT_STYLE, o = opts || {}
    if (!has(STYLES, s)) return load(s)
    return resolve([String(name).replace(/^with-/, '')], DATA[s] || {}, true).then(function (n) {
      return icon(s, n).then(function (inner) { return markup(inner, s, o) })
    })
  }

  function injectCss() {
    if (document.getElementById('with-icons-css')) return
    var st = document.createElement('style')
    st.id = 'with-icons-css'
    st.textContent = BASE_CSS
    var h = document.head || document.documentElement
    h.insertBefore(st, h.firstChild)
  }
  function start() {
    injectCss()
    render(document)
    if (typeof MutationObserver === 'undefined') return
    var queue = [], queued = false
    var flush = function () {
      queued = false
      var q = queue
      queue = []
      for (var i = 0; i < q.length; i++) q[i].isConnected !== false && render(q[i])
    }
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i]
        if (m.type === 'attributes') { if (m.target._withSvg || (m.target.classList && m.target.classList.contains('with'))) queue.push(m.target) }
        else for (var j = 0; j < m.addedNodes.length; j++) if (m.addedNodes[j].nodeType === 1 && m.addedNodes[j] !== m.target._withSvg) queue.push(m.addedNodes[j])
      }
      if (queue.length && !queued) { queued = true; (G.queueMicrotask || setTimeout)(flush) }
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-label', 'data-with-stroke-width'] })
  }

  G.WithIcons = { render: render, svg: svg, load: load, styles: STYLE_NAMES.slice(), version: VERSION }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start)
  else start()
}

// ---------------------------------------------------------------- CSS-on-demand loader (serialized; classic script)
// with-loader.js: the CSS-only icons without downloading a whole style. It injects the base rules, scans the page for
// `with with-<name> [with-<style>]`, and adds one <link> per icon and style it finds (<style>/<name>.css next to the
// script: a few hundred bytes to a few KB each). Elements added or re-classed later load theirs too (MutationObserver).
// Aliases get the canonical class added (with a console hint); unknown names warn with suggestions.
// free vars: VERSION, DEFAULT_STYLE, STYLE_NAMES, RESERVED, BASE_CSS, NAME_LIST, ALIAS_SHARDS + LOOKUP_SRC, withShard
function withLoader() {
  var G = typeof window !== 'undefined' ? window : null
  if (!G || typeof document === 'undefined' || G.WithIconsLoader) return
  var has = function (o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k) }
  var seen = {}
  var warn = function (m) { if (!seen[m] && typeof console !== 'undefined') { seen[m] = 1; console.warn(m) } }
  var me = document.currentScript || document.querySelector('script[src*="with-loader"]')
  var abs = function (u) { try { return new URL(u, (me && me.src) || document.baseURI).href } catch (e) { return u } }
  var cssBase = abs((me && me.getAttribute('data-with-css')) || './')
  var dataBase = abs((me && me.getAttribute('data-with-base')) || './data/')
  var STYLE_SET = {}, RES = {}, NAMES = {}, DONE = {}, ALIAS = {}, META = null
  STYLE_NAMES.forEach(function (s) { STYLE_SET[s] = 1 })
  RESERVED.forEach(function (s) { RES[s] = 1 })
  NAME_LIST.split(' ').forEach(function (n) { NAMES[n] = 1 })

  function css(style, name) {
    var key = style + '/' + name
    if (DONE[key]) return DONE[key]
    return (DONE[key] = new Promise(function (ok) {
      var l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = cssBase + key + '.css'
      l.setAttribute('data-with', key)
      l.onload = function () { ok(true) }
      l.onerror = function () { warn('with icons: could not load ' + l.href); ok(false) }
      ;(document.head || document.documentElement).appendChild(l)
    }))
  }
  function aliasShard(k) {
    var i = withShard(k, ALIAS_SHARDS)
    return ALIAS[i] || (ALIAS[i] = import(dataBase + 'alias/' + i + '.js').then(function (m) { return m.default }, function () { delete ALIAS[i]; return {} }))
  }
  function meta() { return META || (META = import(dataBase + 'meta.js').then(function (m) { return m.default }, function () { META = null; return { names: [], aliases: {} } })) }
  // a class that is not a canonical name: alias -> add the canonical class; otherwise warn once
  function alias(el, c) {
    var known = function (k) { return has(NAMES, k) }
    return Promise.all(withKeys(c).map(aliasShard)).then(function (list) {
      var al = {}
      list.forEach(function (x) { for (var k in x) al[k] = x[k] })
      try { return withLookup(c, known, [], al) } catch (e) { if (e.code === 'WITH_AMBIGUOUS_ICON') throw e }
      return meta().then(function (md) { return withLookup(c, known, md.names, md.aliases) })
    }).then(function (n) {
      warn('with icons: "with-' + c + '" is an alias; use the canonical class "with-' + n + '".')
      if (!el.classList.contains('with-' + n)) el.classList.add('with-' + n)
    }, function (e) {
      warn(e.code === 'WITH_AMBIGUOUS_ICON'
        ? 'with icons: "with-' + c + '" is ambiguous; use one of: ' + e.candidates.map(function (x) { return 'with-' + x }).join(', ') + '.'
        : 'with icons: unknown icon "with-' + c + '". Did you mean: ' + (e.suggestions || []).map(function (x) { return 'with-' + x }).join(', ') + '?')
    })
  }
  function one(el) {
    if (!el.classList || !el.classList.contains('with') || (el.closest && el.closest('[data-with-skip]'))) return null
    var style = null, cands = [], cl = el.classList
    for (var i = 0; i < cl.length; i++) {
      var c = cl[i]
      if (c.slice(0, 5) !== 'with-') continue
      var k = c.slice(5)
      if (STYLE_SET[k]) { if (!style) style = k; continue }
      if (!RES[k] && k) cands.push(k)
    }
    style = style || DEFAULT_STYLE
    var jobs = []
    for (var j = 0; j < cands.length; j++) jobs.push(has(NAMES, cands[j]) ? css(style, cands[j]) : alias(el, cands[j]))
    return Promise.all(jobs)
  }
  function scan(root) {
    var r = root || document, list = []
    if (r.nodeType === 1 && r.classList && r.classList.contains('with')) list.push(r)
    if (r.querySelectorAll) list.push.apply(list, r.querySelectorAll('.with'))
    return Promise.all(list.map(one)).then(function () {})
  }
  function start() {
    if (!document.getElementById('with-icons-css')) {
      var st = document.createElement('style')
      st.id = 'with-icons-css'
      st.textContent = BASE_CSS
      var h = document.head || document.documentElement
      h.insertBefore(st, h.firstChild)
    }
    scan(document)
    if (typeof MutationObserver === 'undefined') return
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i]
        if (m.type === 'attributes') one(m.target)
        else for (var j = 0; j < m.addedNodes.length; j++) if (m.addedNodes[j].nodeType === 1) scan(m.addedNodes[j])
      }
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
  }
  G.WithIconsLoader = { scan: scan, load: css, version: VERSION }
  // the head may still be parsing: scan what is there now, the rest arrives through the observer / DOMContentLoaded
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start)
  else start()
}
function loaderJs(ctx, css) {
  return `/*! @withicons/classes ${ctx.version} — with-loader.js: CSS icon classes on demand (classic script, no dependencies). MIT. Generated, do not edit.
 * <script src="https://cdn.jsdelivr.net/npm/@withicons/classes@${ctx.version}/dist/with-loader.js" defer></script>  then  <i class="with with-home with-duo"></i>
 * Loads only the rules of the icons on the page: <style>/<name>.css next to this script. */
;(function () {
'use strict'
var VERSION = ${J(ctx.version)}
var DEFAULT_STYLE = ${J(ctx.defaultStyle)}
var STYLE_NAMES = ${J(ctx.styles.map(s => s.name))}
var RESERVED = ${J(RESERVED)}
var ALIAS_SHARDS = ${ALIAS_SHARDS}
var NAME_LIST = ${J(ctx.icons.map(i => i.name).join(' '))}
var BASE_CSS = ${J(css)}
${LOOKUP_SRC}
${withShard}
;(${withLoader.toString()})()
})()
`
}

// same hash as emit-web (alias shards, data/alias/<i>.js)
function withShard(name, n) {
  let h = 2166136261
  for (let i = 0; i < name.length; i++) { h ^= name.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) % n
}
const ALIAS_SHARDS = 16

// web: icons come from @withicons/web (the package build); false: style chunks in dataBase (the site mirror)
function runtimeJs(ctx, dataBase, web, css) {
  const table = styleTable(ctx)
  return `/*! @withicons/classes ${ctx.version} — with-icons.js (classic script, no dependencies). MIT. Generated, do not edit.
 * <script src="https://cdn.jsdelivr.net/npm/@withicons/classes@${ctx.version}/dist/with-icons.js" defer></script>  then  <i class="with with-home with-duo"></i>
 * Loads each icon it shows from ${web ? '@withicons/web@' + ctx.version + ' (dist/icons/<style>/<name>.js)' : dataBase + '<style>.js'}, nothing else up front. */
;(function () {
'use strict'
var VERSION = ${J(ctx.version)}
var DEFAULT_STYLE = ${J(ctx.defaultStyle)}
var STYLES = ${J(table)}
var STYLE_NAMES = ${J(ctx.styles.map(s => s.name))}
var RESERVED = ${J(RESERVED)}
var DATA_BASE = ${J(dataBase)}
var WEB = ${J(!!web)}
var ALIAS_SHARDS = ${ALIAS_SHARDS}
var NAME_LIST = ${J(ctx.icons.map(i => i.name).join(' '))}
var BASE_CSS = ${J(css)}
${LOOKUP_SRC}
${withShard}
;(${withRuntime.toString()})()
})()
`
}

// ---------------------------------------------------------------- d.ts / docs / demo
function dts(ctx) {
  return `// @withicons/classes ${ctx.version} — types for dist/with-icons.js (window.WithIcons). Generated.
${namesAndAliasesDts(ctx)}
export interface WithSvgOptions {
  /** width/height attribute. Default '1em'. */
  size?: number | string
  /** Only affects styles with live strokes (${ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => s.name).join(', ')}). */
  strokeWidth?: number | string
  /** Sets the color attribute (paint stays currentColor). */
  color?: string
  /** Accessible name: role="img" + <title>. Without it the svg is aria-hidden. */
  label?: string
  class?: string
}
export interface WithIconsApi {
  /** (Re)render every element with class "with" inside root (default: document). */
  render(root?: ParentNode): Promise<void>
  /** Complete <svg> markup. Accepts canonical names, unambiguous aliases and an optional "with-" prefix. Rejects on unknown names. */
  svg(name: IconName | IconAlias | (string & {}), style?: StyleName, opts?: WithSvgOptions): Promise<string>
  /** Load (once) a style's data: { name: inner svg markup }. */
  load(style: StyleName): Promise<Record<IconName, string>>
  readonly styles: StyleName[]
  readonly version: string
}
declare global {
  interface Window { WithIcons: WithIconsApi }
  // eslint-disable-next-line no-var
  var WithIcons: WithIconsApi
}
`
}

function readme(ctx, sizes, per) {
  const v = ctx.version
  const cdn = `https://cdn.jsdelivr.net/npm/@withicons/classes@${v}/dist`
  const styles = ctx.styles.map(s => s.name)
  const sw = ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => '`' + s.name + '`').join(', ')
  const kb = n => n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + ' MB' : (n / 1024).toFixed(0) + ' KB'
  const pal = ctx.styles.filter(s => s.palette)
  return `# @withicons/classes

Font Awesome-style icon classes for ${ctx.icons.length} icons x ${styles.length} styles: plain \`<i>\`/\`<span>\` tags, no build step,
no framework, zero dependencies. One line in your page:

\`\`\`html
<script src="${cdn}/with-loader.js" defer></script>

<i class="with with-home"></i>
<i class="with with-heart with-solid"></i>
\`\`\`

Every file sits at the top of \`dist/\`, so the URLs are short: \`dist/with-loader.js\`, \`dist/with-line.css\` (one style),
\`dist/line/home.css\` (one icon). Prefer a custom element or components? \`<with-icon>\` is
[\`@withicons/web\`](https://www.npmjs.com/package/@withicons/web); React, Vue, Svelte, Angular and Solid have their own packages.

With a bundler or a self-hosted copy:

\`\`\`bash
npm i @withicons/classes
\`\`\`
\`\`\`js
import '@withicons/classes/with-line.css'    // every line icon (or with-solid.css, with-duo.css, ...)
import '@withicons/classes/with-base.css'    // or: the base rules, then only the icons you use
import '@withicons/classes/line/home.css'
\`\`\`

Plain \`<i>\`/\`<span>\` elements with classes. Three interchangeable ways to render them, lightest first:

### 1. CSS on demand (recommended from a CDN)

\`\`\`html
<script src="${cdn}/with-loader.js" defer></script>

<i class="with with-home"></i>                      <!-- line (default) -->
<i class="with with-heart with-solid"></i>
<i class="with with-search with-2x with-spin"></i>
\`\`\`

\`with-loader.js\` (${kb(sizes['with-loader.js'].raw)}, ${kb(sizes['with-loader.js'].gz)} gzip) adds the base rules, finds every \`with with-<name>\` on the
page and links just that icon's rule: \`dist/<style>/<name>.css\` (a \`${ctx.defaultStyle}\` icon is typically ${per.line} bytes,
${per.lineGz} gzip; a \`${per.heavy}\` icon about ${(per.heavyRaw / 1024).toFixed(1)} KB, ${(per.heavyGz / 1024).toFixed(1)} KB gzip). Any style mix costs only the icons shown, and icons
added later (or re-classed) load theirs. The rendering is the CSS-only one below (masks, no inline SVG); aliases get their
canonical class added with a console hint. Without JavaScript, link the same files yourself:

\`\`\`html
<link rel="stylesheet" href="${cdn}/with-base.css">
<link rel="stylesheet" href="${cdn}/line/home.css">
<link rel="stylesheet" href="${cdn}/solid/heart.css">
\`\`\`

### 2. One stylesheet per style (zero JS)

\`\`\`html
<link rel="stylesheet" href="${cdn}/with-line.css">

<i class="with with-home"></i>
<i class="with with-search with-2x with-spin"></i>
\`\`\`

One file per style (\`${styles.map(s => 'with-' + s + '.css').join('`, `')}\`), each holding all ${ctx.icons.length} icons
(see the sizes below: the default \`with-${ctx.defaultStyle}.css\` is ${kb(sizes[`with-${ctx.defaultStyle}.css`].gz)} gzipped, the richest styles several hundred KB).
\`with-all.css\` imports every style file: ${kb(sizes['with-all.css'].raw)} (${kb(sizes['with-all.css'].gz)} gzipped) in ${styles.length} requests,
so keep it for prototypes and offline tools, never for a production page:

\`\`\`html
<link rel="stylesheet" href="${cdn}/with-all.css">   <!-- heavy: every icon in every style -->

<i class="with with-home with-solid"></i>
<span class="with with-heart with-gloss"></span>
\`\`\`

Without a style class an icon is \`line\` (when \`with-line.css\` or \`with-all.css\` is loaded; if you load a single other style file,
bare \`with with-<name>\` uses that style). Each icon is an SVG data-URI used as a CSS \`mask\` over \`currentColor\` (drawn in the
element's \`::after\`), so it takes the text colour and font size (\`1em\` square, \`vertical-align: -.125em\`). In mono styles the duo tint
and blueprint construction lines render as translucent \`currentColor\`.
${pal.length ? `
**Palette styles** (${pal.map(s => '`' + s.name + '`').join(', ')}) keep their colours in CSS-only mode too: the palette is the element's
\`background-image\` (default colours baked in) and the ink is the \`currentColor\` mask on top, with the original stacking order
preserved, so \`color\` still recolours the outline. The \`--with-<style>-<role>\` variables cannot reach into a data URI, so to
re-theme a palette use the JS runtime below (or a component), where every variable works.
` : ''}
Use the JS runtime for live CSS variables and stroke width.

| file | size | gzip |
|---|---|---|
| \`<style>/<name>.css\` (one icon, typical) | ${per.line} B (\`${ctx.defaultStyle}\`) to ${(per.heavyRaw / 1024).toFixed(1)} KB (\`${per.heavy}\`) | ${per.lineGz} B to ${(per.heavyGz / 1024).toFixed(1)} KB |
${Object.entries(sizes).map(([f, s]) => `| \`${f}\`${f === 'with-all.css' ? ' (imports every style file)' : ''} | ${kb(s.raw)} | ${kb(s.gz)} |`).join('\n')}

### 3. JS runtime (inline SVG)

\`\`\`html
<script src="${cdn}/with-icons.js" defer></script>

<i class="with with-home with-duo" style="--with-duo:#f59e0b"></i>
<i class="with with-ruler with-blueprint" style="--with-accent:#38bdf8"></i>
<i class="with with-settings" data-with-stroke-width="1.5"></i>
\`\`\`

A classic (non-module), dependency-free script that draws the icons from
[\`@withicons/web\`](https://www.npmjs.com/package/@withicons/web) at the same version. It injects an inline \`<svg class="with-svg">\` into every element with class
\`with\` and an \`with-<name>\` class, and keeps doing so for elements added or changed later (MutationObserver on added nodes and
\`class\` / \`aria-label\` / \`data-with-stroke-width\` changes). Only the icons actually shown are downloaded, one small
module each (\`@withicons/web/dist/icons/<style>/<name>.js\`, fetched from the sibling \`@withicons/web\` path on the
same CDN or \`node_modules\`, else jsDelivr; point it elsewhere with \`data-with-web="/vendor/withicons-web/dist/"\` on the script tag). \`WithIcons.load(style)\` still fetches a whole style.
It can be combined with the CSS files: the mask shows until the SVG arrives, then it is switched off.

- \`data-with-stroke-width="1.5"\` on the element: stroke width for ${sw}.
- Aliases work (\`with-bin\` -> \`trash\`, with a one-time console hint); unknown names warn with the nearest suggestions.
- Opt a subtree out with \`data-with-skip\`.
- \`window.WithIcons\`: \`render(root?)\`, \`svg(name, style?, opts?)\` (Promise of an svg string), \`load(style)\`, \`styles\`, \`version\`.
  Types: \`dist/with-icons.d.ts\`.

### Modifiers

| class | effect |
|---|---|
| \`with-xs\` / \`with-sm\` / \`with-lg\` | .75em / .875em / 1.33em (lg also \`vertical-align: -.25em\`) |
| \`with-2x\` … \`with-5x\` | 2em … 5em |
| \`with-fw\` | fixed width 1.25em, icon centred (for lists / menus) |
| \`with-spin\` / \`with-pulse\` | rotate continuously (1.6s linear) / in 8 steps; disabled under \`prefers-reduced-motion\` |
| \`with-rotate-90\` / \`-180\` / \`-270\` | rotate |
| \`with-flip-h\` / \`with-flip-v\` / \`with-flip-both\` | mirror (combines with rotate and spin) |
| \`with-rtl\` | mirror only inside right-to-left text (\`dir="rtl"\`), for directional icons (\`with-arrow-right\`, \`with-undo\`…) |

### Accessibility

Icons are decorative by default (empty element; the JS-rendered svg is \`aria-hidden\`). For a meaningful icon give the element
a name: \`<i class="with with-trash" role="img" aria-label="Delete"></i>\`. With the JS runtime, an \`aria-label\` also becomes the
svg's \`role="img"\` + \`<title>\`. Inside a labelled button keep the icon decorative.

CSS-only icons stay visible in Windows High Contrast (forced colours: the ink takes the system text, link or button colour)
and they print even with the browser's "Background graphics" option off.

### CSS or JS?

- **CSS on demand** (\`with-loader.js\`): the CSS rendering, downloading only the icons on the page.
- **CSS stylesheet**: zero JS, works in emails-to-web, static sites, CMS content; one request per style; palette styles in their default colours.
- **JS runtime**: live CSS variables (\`--with-duo\`, \`--with-accent\`${pal.length ? ', \`--with-<style>-<role>\`' : ''}), \`data-with-stroke-width\`, aliases and typo hints, only the icons you show are fetched.
- Using a framework? Prefer the component packages (\`@withicons/react\`, \`vue\`, \`svelte\`…) or \`<with-icon>\` (\`@withicons/web\`).

## Files

| path | what |
|---|---|
| \`dist/with-loader.js\` | CSS on demand: links \`dist/<style>/<name>.css\` for each icon on the page |
| \`dist/with-<style>.css\` | one style, every icon (${styles.map(s => '\`' + s + '\`').join(', ')}) |
| \`dist/<style>/<name>.css\` | one icon in one style (needs \`with-base.css\` or the loader) |
| \`dist/with-base.css\` | the shared base rules and modifiers |
| \`dist/with-all.css\` | \`@import\` of every style file (prototypes only) |
| \`dist/with-icons.js\` (+ \`.d.ts\`) | JS runtime: inline SVG from \`@withicons/web\` |
| \`dist/data/alias/<n>.js\`, \`dist/data/meta.js\` | alias and typo lookups, loaded only for a non-canonical class |
| \`dist/demo.html\` | every style, modifier and runtime feature on one page |

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}

function demoHtml(ctx) {
  const styles = ctx.styles.map(s => s.name)
  const pick = ['home', 'search', 'heart', 'settings', 'bell', 'trash', 'camera', 'rocket', 'cloud-sun', 'shield-check', 'lock', 'star']
    .filter(n => ctx.icons.some(i => i.name === n))
  const row = (s, cls = '') => pick.map(n => `<i class="with with-${n}${s === ctx.defaultStyle && !cls ? '' : ' with-' + s}${cls}" title="with-${n} with-${s}"></i>`).join('')
  const mods = [['with-xs', ''], ['with-sm', ''], ['', '(1em)'], ['with-lg', ''], ['with-2x', ''], ['with-3x', ''], ['with-4x', ''], ['with-5x', '']]
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Icon classes demo — with icons</title>
<link rel="stylesheet" href="with-all.css">
<script src="with-icons.js" defer></script>
<style>
  :root { color-scheme: light dark; --bg: #f8fafc; --fg: #0f172a; --muted: #64748b; --card: #fff; --line: #e2e8f0 }
  @media (prefers-color-scheme: dark) { :root { --bg: #0b1120; --fg: #e2e8f0; --muted: #94a3b8; --card: #111827; --line: #1f2937 } }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, sans-serif }
  main { max-width: 1040px; margin: 0 auto; padding: 24px 16px 64px }
  h1 { font-size: 22px; margin: 0 0 4px } h2 { font-size: 16px; margin: 28px 0 8px } p { color: var(--muted); margin: 4px 0 }
  code { font: 13px ui-monospace, monospace }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 12px 16px; overflow-x: auto }
  .dark { background: #0b1120; color: #e2e8f0; border-color: #1f2937 }
  .row { display: flex; align-items: center; gap: 14px; font-size: 26px; padding: 6px 0; white-space: nowrap }
  .row > b { font: 600 12px ui-monospace, monospace; width: 84px; flex: none; color: var(--muted) }
  .mods { display: flex; flex-wrap: wrap; gap: 18px 26px; align-items: baseline }
  .mods > span { font-size: 16px; display: inline-flex; gap: 6px; align-items: baseline }
  .mods small { color: var(--muted); font: 12px ui-monospace, monospace }
  ul.fw { list-style: none; padding: 0; margin: 0 } ul.fw li { padding: 2px 0 }
  button { font: inherit; padding: 4px 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; cursor: pointer }
  #log { font: 12px ui-monospace, monospace; color: var(--muted) }
</style>
</head>
<body>
<main>
<h1>Icon classes <small style="color:var(--muted);font-size:13px">@withicons/classes ${ctx.version}</small></h1>
<p><code>&lt;i class="with with-home with-solid"&gt;&lt;/i&gt;</code> — ${ctx.icons.length} icons x ${styles.length} styles. CSS-only sections use <code>data-with-skip</code> so the JS runtime leaves them alone.</p>

<div data-with-skip>
<h2>1 · CSS only (with-all.css, masks)</h2>
<div class="card">
${styles.map(s => `<div class="row"><b>${s}</b>${row(s)}</div>`).join('\n')}
</div>
<h2>CSS only on a dark background</h2>
<div class="card dark">
${styles.map(s => `<div class="row"><b>${s}</b>${row(s)}</div>`).join('\n')}
</div>

<h2>Modifiers</h2>
<div class="card">
<div class="mods">
${mods.map(([m, t]) => `<span><i class="with with-star with-solid ${m}"></i><small>${m || t}</small></span>`).join('\n')}
</div>
<div class="mods" style="margin-top:14px">
${['with-spin', 'with-pulse', 'with-rotate-90', 'with-rotate-180', 'with-rotate-270', 'with-flip-h', 'with-flip-v', 'with-flip-both'].map(m => `<span><i class="with with-${m.includes('spin') || m.includes('pulse') ? 'loader' : 'arrow-up-right'} with-2x ${m}"></i><small>${m}</small></span>`).join('\n')}
<span style="color:#e11d48"><i class="with with-heart with-gloss with-2x"></i><small>colour = currentColor</small></span>
</div>
<ul class="fw" style="margin-top:14px">
<li><i class="with with-home with-fw"></i> with-fw Home</li>
<li><i class="with with-mail with-fw"></i> with-fw Mail</li>
<li><i class="with with-settings with-fw"></i> with-fw Settings</li>
<li><i class="with with-home"></i> (no with-fw) Home</li>
</ul>
</div>
</div>

<h2>2 · JS runtime (with-icons.js, inline SVG, real colours)</h2>
<div class="card" id="js">
${styles.map(s => `<div class="row"><b>${s}</b>${row(s)}</div>`).join('\n')}
<div class="row"><b>custom</b><i class="with with-home with-duo" style="--with-duo:#f59e0b"></i><i class="with with-heart with-duo" style="color:#e11d48;--with-duo:#fb7185"></i><i class="with with-ruler with-blueprint" style="--with-accent:#38bdf8"></i><i class="with with-compass with-blueprint" style="--with-accent:#f43f5e"></i>
<i class="with with-settings" data-with-stroke-width="1"></i><i class="with with-settings"></i><i class="with with-settings" data-with-stroke-width="2.5"></i>
<i class="with with-bin" aria-label="Delete (alias with-bin)"></i><i class="with with-loader with-spin"></i><i class="with with-arrow-up with-rotate-90 with-flip-v"></i></div>
<div class="row"><b>dynamic</b><span id="dyn"></span></div>
<div class="row"><b>class chg</b><i id="chg" class="with with-heart with-line"></i><button id="swap" style="font-size:13px">change class</button><button id="add" style="font-size:13px">add icon</button></div>
</div>
<div class="card dark" style="margin-top:12px">
${styles.map(s => `<div class="row"><b>${s}</b>${row(s)}</div>`).join('\n')}
</div>
<p id="log"></p>
</main>
<script>
  var ORDER = ${J(styles)}, DYN = ${J(pick)}, n = 0
  function add() { var i = document.createElement('i'); i.className = 'with with-' + DYN[n % DYN.length] + ' with-' + ORDER[n % ORDER.length]; n++; document.getElementById('dyn').appendChild(i) }
  function swap() { var el = document.getElementById('chg'), k = (ORDER.indexOf((el.className.match(/with-(\\w+)$/) || [])[1]) + 1) % ORDER.length; el.className = 'with with-' + (k % 2 ? 'star' : 'heart') + ' with-' + ORDER[k] }
  document.getElementById('add').onclick = add
  document.getElementById('swap').onclick = swap
  // self-test for screenshots: add 7 icons and change a class after load
  window.addEventListener('load', function () {
    for (var i = 0; i < 7; i++) add()
    swap(); swap()
    setTimeout(function () {
      var js = document.querySelectorAll('#js .with'), done = document.querySelectorAll('#js .with[data-with-svg]').length
      document.getElementById('log').textContent = 'WithIcons ' + (window.WithIcons ? WithIcons.version : 'missing') + ': ' + done + '/' + js.length + ' JS-section icons rendered inline; #chg = ' + document.getElementById('chg').className + ' -> ' + document.getElementById('chg').getAttribute('data-with-svg')
    }, 1500)
  })
</script>
</body>
</html>
`
}

// ---------------------------------------------------------------- package.json
function pkgJson(ctx, styleNames) {
  return {
    ...basePkg(ctx, '@withicons/classes', `Font Awesome-style CSS icon classes: <i class="with with-home">. ${ctx.icons.length} icons x ${styleNames.length} styles, CSS-only or loaded on demand, zero dependencies.`,
      ['css', 'css-icons', 'icon-classes', 'icon-font', 'font-awesome-alternative', 'cdn', 'no-build', 'html', ...styleNames, 'multicolor-icons']),
    type: 'module',
    // every file is a stylesheet or a script that runs for its effect
    sideEffects: ['*.css', './dist/with-loader.js', './dist/with-icons.js'],
    style: './dist/with-line.css',
    exports: {
      '.': { style: './dist/with-line.css', default: './dist/with-line.css' },
      './with-icons.js': { types: './dist/with-icons.d.ts', default: './dist/with-icons.js' },
      './package.json': './package.json',
      // @withicons/classes/with-line.css, @withicons/classes/line/home.css, @withicons/classes/with-loader.js …
      './*': './dist/*',
    },
    files: ['dist', 'README.md', 'LICENSE'],
    // the bare CDN URL (cdn.jsdelivr.net/npm/@withicons/classes) serves the few-KB loader, never a whole style
    unpkg: './dist/with-loader.js', jsdelivr: './dist/with-loader.js',
    scripts: { test: 'node --test test/*.test.mjs' },
  }
}

// ---------------------------------------------------------------- emit
export default async function emit(ctx) {
  const styleNames = ctx.styles.map(s => s.name)
  const bad = ctx.icons.map(i => i.name).filter(n => RESERVED.includes(n) || styleNames.includes(n))
  if (bad.length) throw new Error('icon names collide with reserved class words: ' + bad.join(', '))

  const header = `/*! @withicons/classes ${ctx.version} — icon classes. MIT. Generated, do not edit. */\n`
  const css = baseCss()
  const rules = {}   // style -> [[name, declarations]]
  let layered = 0
  for (const s of ctx.styles) {
    rules[s.name] = ctx.icons.map(i => {
      const r = renderOf(ctx, i, s.name)
      const st = ctx.styles.find(x => x.name === r.style) || s
      const L = layerUris(st, r.nodes)
      if (L) { layered++; return [i.name, `--with-i:${L.i};--with-p:${L.p}`] }
      return [i.name, `--with-i:${maskUri(s, innerOf(ctx, i, s.name))}`]
    })
  }

  const files = new Map()
  for (const s of ctx.styles) {
    const isDef = s.name === ctx.defaultStyle
    // non-default file: `.with-solid.with-home` + zero-specificity `:where(.with-home)` so bare classes work when it is the only file
    const body = rules[s.name].map(([n, d]) => (isDef ? `.with-${n}` : `:where(.with-${n}),.with-${s.name}.with-${n}`) + `{${d}}`).join('\n')
    files.set(`with-${s.name}.css`, `${header}${css}\n${body}\n`)
  }
  // with-all.css: every style file through @import (bare classes stay line: `.with-home` outranks the other files'
  // zero-specificity `:where(.with-home)`). One 30 MB file would be over the 20 MB a CDN such as jsDelivr serves.
  files.set('with-all.css', `${header}${ctx.styles.map(s => `@import url("with-${s.name}.css");`).join('\n')}\n`)
  // the base rules alone, for pages that link per-icon files by hand
  files.set('with-base.css', `${header}${css}\n`)
  // one file per icon and style (the loader's unit): the same rule as in with-<style>.css, nothing else
  const perIcon = new Map()
  for (const s of ctx.styles) {
    const isDef = s.name === ctx.defaultStyle
    for (const [n, d] of rules[s.name]) perIcon.set(`${s.name}/${n}.css`, (isDef ? `.with-${n}` : `:where(.with-${n}),.with-${s.name}.with-${n}`) + `{${d}}\n`)
  }

  const gzn = t => zlib.gzipSync(t, { level: 9 }).length
  const sizes = {}
  for (const [f, t] of files) sizes[f] = { raw: Buffer.byteLength(t), gz: gzn(t) }
  // what with-all.css really downloads: every style file
  sizes['with-all.css'] = ctx.styles.reduce((a, s) => ({ raw: a.raw + sizes[`with-${s.name}.css`].raw, gz: a.gz + sizes[`with-${s.name}.css`].gz }), { raw: 0, gz: 0 })
  const pkgJs = runtimeJs(ctx, './data/', true, css)
  sizes['with-icons.js'] = { raw: Buffer.byteLength(pkgJs), gz: gzn(pkgJs) }
  const ldr = loaderJs(ctx, css)
  sizes['with-loader.js'] = { raw: Buffer.byteLength(ldr), gz: gzn(ldr) }
  const med = a => a.sort((x, y) => x - y)[a.length >> 1]
  const iconCss = st => ctx.icons.map(i => perIcon.get(`${st}/${i.name}.css`))
  const heavy = styleNames.reduce((a, b) => sizes[`with-${b}.css`].raw > sizes[`with-${a}.css`].raw ? b : a)
  const perIconSizes = {
    line: med(iconCss(ctx.defaultStyle).map(t => Buffer.byteLength(t))), lineGz: med(iconCss(ctx.defaultStyle).map(gzn)),
    heavy, heavyRaw: med(iconCss(heavy).map(t => Buffer.byteLength(t))), heavyGz: med(iconCss(heavy).map(gzn)),
  }
  files.set('with-icons.js', pkgJs)
  files.set('with-loader.js', ldr)
  files.set('with-icons.d.ts', dts(ctx))
  files.set('demo.html', demoHtml(ctx))

  // alias shards + names (same split as @withicons/web's dist/data/): the loader and the runtime resolve aliases and
  // suggest names for typos without touching @withicons/web
  const dh = `// @withicons/classes ${ctx.version} — generated, do not edit. MIT.\n`
  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  const aliasParts = Array.from({ length: ALIAS_SHARDS }, () => ({}))
  for (const k of Object.keys(aliases)) aliasParts[withShard(k, ALIAS_SHARDS)][k] = aliases[k]
  const lookup = new Map()
  aliasParts.forEach((p, k) => lookup.set(`data/alias/${k}.js`, `export default ${J(p)}\n`))
  lookup.set('data/meta.js', `${dh}export default ${J({ names: ctx.icons.map(i => i.name), aliases })}\n`)

  // site mirror: self-contained, data chunks next to the script
  // (no per-icon files or loader there: the site serves the style files and the data chunks)
  const site = new Map([...files, ...lookup])
  site.delete('with-loader.js')
  // the site offers with-all.css as a single download: keep it one self-contained file there
  site.set('with-all.css', `${header}${css}\n${ctx.styles.map(s => rules[s.name].map(([n, d]) => (s.name === ctx.defaultStyle ? `.with-${n}` : `.with-${s.name}.with-${n}`) + `{${d}}`).join('\n')).join('\n')}\n`)
  site.set('with-icons.js', runtimeJs(ctx, './data/', false, css))
  for (const s of styleNames) {
    const d = {}
    for (const i of ctx.icons) d[i.name] = innerOf(ctx, i, s)
    site.set(`data/${s}.js`, `${dh}export default ${J(d)}\n`)
  }

  // the package: unchanged files are left alone, stale ones (renamed icons) pruned
  const out = distWriter(ctx, 'packages/classes/dist')
  for (const [f, t] of [...files, ...perIcon, ...lookup]) out.add(f, t)
  await out.flush()
  writePkg(ctx, 'classes', pkgJson(ctx, styleNames), readme(ctx, sizes, perIconSizes))

  // keep: files other emitters put in the same folder (emit-search writes site/vendor/with/search.js)
  const writeDir = (rel, map, keep = []) => {
    const dir = path.join(ctx.root, rel)
    const saved = keep.map(k => [k, path.join(dir, k)]).filter(([, p]) => fs.existsSync(p)).map(([k, p]) => [k, fs.readFileSync(p)])
    fs.rmSync(dir, { recursive: true, force: true })
    for (const [k, buf] of saved) { const p = path.join(dir, k); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, buf) }
    for (const [f, t] of map) { const p = path.join(dir, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, t) }
  }
  writeDir('site/vendor/with', site, ['search.js'])

  const k = n => (n / 1024).toFixed(0) + 'K'
  return `${files.size + perIcon.size + lookup.size} files (${perIcon.size} per-icon); line.css ${k(sizes['with-line.css'].raw)} (${k(sizes['with-line.css'].gz)} gz), all.css via @import ${k(sizes['with-all.css'].raw)} (${k(sizes['with-all.css'].gz)} gz), with-icons.js ${k(sizes['with-icons.js'].raw)}, with-loader.js ${k(sizes['with-loader.js'].raw)}; ${layered} palette icons as 2 layers; site/vendor/with mirrored`
}
