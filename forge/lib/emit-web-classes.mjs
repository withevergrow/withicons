// emit-classes — Font-Awesome-style class API inside @withicons/web (packages/web/dist/classes/).
//
//   dist/classes/with-<style>.css   CSS-only icons: <i class="with with-home with-solid"></i>  (SVG data-URI masks, zero JS)
//   dist/classes/with-all.css       every style in one file (line is the default)
//   dist/classes/with-icons.js      classic script: decorates .with elements with inline <svg> (true multi-colour,
//                                 stroke width); lazily imports ../data/<style>.js (the <with-icon> chunks) per used style
//   dist/classes/with-icons.d.ts    window.WithIcons typings
//   dist/classes/demo.html        demo page;  dist/classes/README.md  docs
//
// Also mirrors everything into site/vendor/with/ (self-contained: data chunks copied to site/vendor/with/data/).
//
// Declares `after = ['web']` so it runs AFTER emit-web:  emit-web's distWriter
// prunes files it did not write and rewrites package.json/README, so this emitter must come last.
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { J, LOOKUP_SRC, styleTable, innerOf, namesAndAliasesDts } from './emit-core.mjs'

const MODIFIERS = ['xs', 'sm', 'lg', '2x', '3x', '4x', '5x', 'fw', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270',
  'flip-h', 'flip-v', 'flip-both']
// class suffixes that are never icon names (modifiers + internal / future-proof words)
const RESERVED = [...MODIFIERS, 'svg', 'js', 'css', 'all', 'icons', 'skip']

// ---------------------------------------------------------------- CSS
const MASK = 'var(--with-i,linear-gradient(#0000 0 0)) center/contain no-repeat'
function baseCss() {
  const sizes = { xs: '.75em', sm: '.875em', '2x': '2em', '3x': '3em', '4x': '4em', '5x': '5em' }
  return [
    // .with keeps real (0,1,0) specificity; modifiers use .with.with-x (0,2,0) so they win regardless of file order
    `.with{display:inline-block;width:1em;height:1em;vertical-align:-.125em;flex-shrink:0;font-style:normal;line-height:1;background-color:currentColor;-webkit-mask:${MASK};mask:${MASK}}`,
    `.with[data-with-svg]{background:none;-webkit-mask:none;mask:none}`,
    `.with>.with-svg{display:block;width:100%;height:100%;overflow:visible}`,
    Object.entries(sizes).map(([k, v]) => `.with.with-${k}{font-size:${v}}`).join(''),
    `.with.with-lg{font-size:1.33em;vertical-align:-.25em}`,
    `.with.with-fw{width:1.25em}`,
    `.with.with-spin{animation:with-spin 1.6s linear infinite}.with.with-pulse{animation:with-spin 1s steps(8) infinite}`,
    `@keyframes with-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`,
    `.with.with-rotate-90{rotate:90deg}.with.with-rotate-180{rotate:180deg}.with.with-rotate-270{rotate:270deg}`,
    `.with.with-flip-h{scale:-1 1}.with.with-flip-v{scale:1 -1}.with.with-flip-both{scale:-1 -1}`,
    `@media (prefers-reduced-motion:reduce){.with.with-spin,.with.with-pulse{animation:none}}`,
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

// ---------------------------------------------------------------- JS runtime (serialized; free vars:
// VERSION, STYLES, DEFAULT_STYLE, STYLE_NAMES, RESERVED, BASE_CSS, DATA_BASE + LOOKUP_SRC helpers)
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

  // data chunks live next to the <with-icon> runtime: <script>/../data/<style>.js (override: data-with-base)
  var me = document.currentScript || document.querySelector('script[src*="with-icons"]')
  var base = (me && me.getAttribute('data-with-base')) || DATA_BASE
  try { base = new URL(base, (me && me.src) || document.baseURI).href } catch (e) { /* keep relative */ }
  var DATA = {}, PENDING = {}, META = null

  function load(style) {
    var s = style || DEFAULT_STYLE
    if (!has(STYLES, s)) return Promise.reject(new Error('with icons: unknown style "' + s + '". Use one of: ' + STYLE_NAMES.join(', ') + '.'))
    if (DATA[s]) return Promise.resolve(DATA[s])
    return PENDING[s] || (PENDING[s] = import(base + s + '.js').then(function (m) { return (DATA[s] = m.default) }))
  }
  function meta() { return META || (META = import(base + 'meta.js').then(function (m) { return m.default })) }

  // name (canonical or alias) -> canonical, warning once about aliases / typos; resolves null when unknown
  function resolve(cands, map, strict) {
    for (var i = 0; i < cands.length; i++) if (has(map, cands[i])) return Promise.resolve(cands[i])
    if (!cands.length) return Promise.resolve(null)
    return meta().then(function (md) {
      var errs = []
      for (var i = 0; i < cands.length; i++) {
        try {
          var n = withLookup(cands[i], function (k) { return has(map, k) }, md.names, md.aliases)
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
    return load(p.style).then(function (map) {
      return resolve(p.cands, map).then(function (name) {
        if (token !== el._withToken) return
        if (!name) { clear(el); return }
        var label = el.getAttribute('aria-label') || ''
        var sw = el.getAttribute('data-with-stroke-width') || ''
        var key = name + '|' + p.style + '|' + sw + '|' + label
        if (key === el._withKey && el._withSvg && el._withSvg.parentNode === el) return
        var t = document.createElement('div')
        t.innerHTML = markup(map[name], p.style, { strokeWidth: sw, label: label, 'class': 'with-svg' })
        var svg = t.firstChild
        if (el._withSvg && el._withSvg.parentNode === el) el.replaceChild(svg, el._withSvg)
        else el.appendChild(svg)
        el._withSvg = svg
        el._withKey = key
        if (el.getAttribute('data-with-svg') !== name) el.setAttribute('data-with-svg', name)
      })
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
    return load(s).then(function (map) {
      return resolve([String(name).replace(/^with-/, '')], map, true).then(function (n) { return markup(map[n], s, o) })
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

function runtimeJs(ctx, dataBase, css) {
  const table = styleTable(ctx)
  return `/*! @withicons/web ${ctx.version} — with-icons.js (classic script, no dependencies). MIT. Generated, do not edit.
 * <script src=".../dist/classes/with-icons.js" defer></script>  then  <i class="with with-home with-duo"></i>
 * Loads ${ctx.defaultStyle} (default) and other style data lazily from ${dataBase}<style>.js. */
;(function () {
'use strict'
var VERSION = ${J(ctx.version)}
var DEFAULT_STYLE = ${J(ctx.defaultStyle)}
var STYLES = ${J(table)}
var STYLE_NAMES = ${J(ctx.styles.map(s => s.name))}
var RESERVED = ${J(RESERVED)}
var DATA_BASE = ${J(dataBase)}
var BASE_CSS = ${J(css)}
${LOOKUP_SRC}
;(${withRuntime.toString()})()
})()
`
}

// ---------------------------------------------------------------- d.ts / docs / demo
function dts(ctx) {
  return `// @withicons/web ${ctx.version} — types for dist/classes/with-icons.js (window.WithIcons). Generated.
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

function classesDoc(ctx, sizes) {
  const v = ctx.version
  const cdn = `https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes`
  const styles = ctx.styles.map(s => s.name)
  const sw = ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => '`' + s.name + '`').join(', ')
  const kb = n => (n / 1024).toFixed(0) + ' KB'
  return `## Icon classes (Font Awesome style)

Plain \`<i>\`/\`<span>\` elements with classes, no build step. Two interchangeable ways to render them:

### 1. CSS only (zero JS)

\`\`\`html
<link rel="stylesheet" href="${cdn}/with-line.css">

<i class="with with-home"></i>                      <!-- line (default) -->
<i class="with with-search with-2x with-spin"></i>
\`\`\`

One file per style (\`${styles.map(s => 'with-' + s + '.css').join('`, `')}\`) or every style at once:

\`\`\`html
<link rel="stylesheet" href="${cdn}/with-all.css">

<i class="with with-home with-solid"></i>
<span class="with with-heart with-gloss"></span>
\`\`\`

Without a style class an icon is \`line\` (when \`with-line.css\` or \`with-all.css\` is loaded; if you load a single other style file,
bare \`with with-<name>\` uses that style). Each icon is an SVG data-URI used as a CSS \`mask\` over \`background-color: currentColor\`,
so it takes the text colour and font size (\`1em\` square, \`vertical-align: -.125em\`). Masks are single-colour: the duo tint
and blueprint construction lines render as translucent \`currentColor\`. Use the JS runtime for real multi-colour and stroke width.

| file | size | gzip |
|---|---|---|
${Object.entries(sizes).map(([f, s]) => `| \`${f}\` | ${kb(s.raw)} | ${kb(s.gz)} |`).join('\n')}

### 2. JS runtime (inline SVG)

\`\`\`html
<script src="${cdn}/with-icons.js" defer></script>

<i class="with with-home with-duo" style="--with-duo:#f59e0b"></i>
<i class="with with-ruler with-blueprint" style="--with-accent:#38bdf8"></i>
<i class="with with-settings" data-with-stroke-width="1.5"></i>
\`\`\`

A classic (non-module), dependency-free script. It injects an inline \`<svg class="with-svg">\` into every element with class
\`with\` and an \`with-<name>\` class, and keeps doing so for elements added or changed later (MutationObserver on added nodes and
\`class\` / \`aria-label\` / \`data-with-stroke-width\` changes). Only the styles actually used are downloaded
(\`dist/data/<style>.js\`, resolved relative to the script's URL; override with \`data-with-base="…/"\` on the script tag).
It can be combined with the CSS files: the mask shows until the SVG arrives, then it is switched off.

- \`data-with-stroke-width="1.5"\` on the element: stroke width for ${sw}.
- Aliases work (\`with-bin\` -> \`trash\`, with a one-time console hint); unknown names warn with the nearest suggestions.
- Opt a subtree out with \`data-with-skip\`.
- \`window.WithIcons\`: \`render(root?)\`, \`svg(name, style?, opts?)\` (Promise of an svg string), \`load(style)\`, \`styles\`, \`version\`.
  Types: \`dist/classes/with-icons.d.ts\`.

### Modifiers

| class | effect |
|---|---|
| \`with-xs\` / \`with-sm\` / \`with-lg\` | .75em / .875em / 1.33em (lg also \`vertical-align: -.25em\`) |
| \`with-2x\` … \`with-5x\` | 2em … 5em |
| \`with-fw\` | fixed width 1.25em, icon centred (for lists / menus) |
| \`with-spin\` / \`with-pulse\` | rotate continuously (1.6s linear) / in 8 steps; disabled under \`prefers-reduced-motion\` |
| \`with-rotate-90\` / \`-180\` / \`-270\` | rotate |
| \`with-flip-h\` / \`with-flip-v\` / \`with-flip-both\` | mirror (combines with rotate and spin) |

### Accessibility

Icons are decorative by default (empty element; the JS-rendered svg is \`aria-hidden\`). For a meaningful icon give the element
a name: \`<i class="with with-trash" role="img" aria-label="Delete"></i>\`. With the JS runtime, an \`aria-label\` also becomes the
svg's \`role="img"\` + \`<title>\`. Inside a labelled button keep the icon decorative.

### CSS or JS?

- **CSS**: zero JS, works in emails-to-web, static sites, CMS content; one HTTP request; single-colour.
- **JS**: true multi-colour (\`--with-duo\`, \`--with-accent\`), \`data-with-stroke-width\`, aliases and typo hints, only the styles you use are fetched.
- Using a framework? Prefer the component packages (\`@withicons/react\`, \`vue\`, \`svelte\`…) or \`<with-icon>\`.
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
<h1>Icon classes <small style="color:var(--muted);font-size:13px">@withicons/web ${ctx.version}</small></h1>
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

// ---------------------------------------------------------------- package.json / README patches
const START = '<!-- with-classes:start -->', END = '<!-- with-classes:end -->'
function patchPkg(text) {
  const p = JSON.parse(text)
  const ex = {}
  for (const [k, v] of Object.entries(p.exports || {})) {
    if (k === './package.json') ex['./classes/*'] = './dist/classes/*'
    if (k !== './classes/*') ex[k] = v
  }
  if (!ex['./classes/*']) ex['./classes/*'] = './dist/classes/*'
  p.exports = ex
  const se = new Set(Array.isArray(p.sideEffects) ? p.sideEffects : [])
  se.add('./dist/classes/*')
  p.sideEffects = [...se]
  return JSON.stringify(p, null, 2) + '\n'
}
function patchReadme(text, doc) {
  const block = `${START}\n${doc}${END}\n`
  const i = text.indexOf(START), j = text.indexOf(END)
  if (i >= 0 && j > i) return text.slice(0, i) + block + text.slice(j + END.length).replace(/^\n/, '')
  const k = text.lastIndexOf('\nMIT licensed.')
  return k >= 0 ? text.slice(0, k + 1) + block + '\n' + text.slice(k + 1) : text.replace(/\n*$/, '\n\n') + block
}

// ---------------------------------------------------------------- emit
export const after = ['web']

export default async function emit(ctx) {
  const styleNames = ctx.styles.map(s => s.name)
  const bad = ctx.icons.map(i => i.name).filter(n => RESERVED.includes(n) || styleNames.includes(n))
  if (bad.length) throw new Error('icon names collide with reserved class words: ' + bad.join(', '))

  const header = `/*! @withicons/web ${ctx.version} — icon classes. MIT. Generated, do not edit. */\n`
  const css = baseCss()
  const rules = {}   // style -> [selector-less pieces]
  for (const s of ctx.styles) rules[s.name] = ctx.icons.map(i => [i.name, maskUri(s, innerOf(ctx, i, s.name))])

  const files = new Map()
  for (const s of ctx.styles) {
    const isDef = s.name === ctx.defaultStyle
    // non-default file: `.with-solid.with-home` + zero-specificity `:where(.with-home)` so bare classes work when it is the only file
    const body = rules[s.name].map(([n, u]) => (isDef ? `.with-${n}` : `:where(.with-${n}),.with-${s.name}.with-${n}`) + `{--with-i:${u}}`).join('\n')
    files.set(`with-${s.name}.css`, `${header}${css}\n${body}\n`)
  }
  const all = ctx.styles.map(s => rules[s.name].map(([n, u]) => (s.name === ctx.defaultStyle ? `.with-${n}` : `.with-${s.name}.with-${n}`) + `{--with-i:${u}}`).join('\n')).join('\n')
  files.set('with-all.css', `${header}${css}\n${all}\n`)

  const sizes = {}
  for (const [f, t] of files) sizes[f] = { raw: Buffer.byteLength(t), gz: zlib.gzipSync(t, { level: 9 }).length }
  const pkgJs = runtimeJs(ctx, '../data/', css)
  sizes['with-icons.js'] = { raw: Buffer.byteLength(pkgJs), gz: zlib.gzipSync(pkgJs, { level: 9 }).length }
  const doc = classesDoc(ctx, sizes)
  files.set('with-icons.js', pkgJs)
  files.set('with-icons.d.ts', dts(ctx))
  files.set('demo.html', demoHtml(ctx))
  files.set('README.md', `# @withicons/web — icon classes\n\n${doc}\nMIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).\n`)

  // site mirror: self-contained, data chunks next to the script
  const site = new Map(files)
  site.set('with-icons.js', runtimeJs(ctx, './data/', css))
  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  const dh = `// @withicons/web ${ctx.version} — generated, do not edit. MIT.\n`
  for (const s of styleNames) {
    const d = {}
    for (const i of ctx.icons) d[i.name] = innerOf(ctx, i, s)
    site.set(`data/${s}.js`, `${dh}export default ${J(d)}\n`)
  }
  site.set('data/meta.js', `${dh}export default ${J({ names: ctx.icons.map(i => i.name), aliases })}\n`)

  const writeDir = (rel, map) => {
    const dir = path.join(ctx.root, rel)
    fs.rmSync(dir, { recursive: true, force: true })
    for (const [f, t] of map) { const p = path.join(dir, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, t) }
  }
  const writeAll = () => writeDir('packages/web/dist/classes', files)
  writeAll()
  writeDir('site/vendor/with', site)

  // package.json / README were just (re)written by emit-web; patch in the classes exports + docs
  const P = f => path.join(ctx.root, 'packages/web', f)
  if (fs.existsSync(P('package.json'))) fs.writeFileSync(P('package.json'), patchPkg(fs.readFileSync(P('package.json'), 'utf8')))
  if (fs.existsSync(P('README.md'))) fs.writeFileSync(P('README.md'), patchReadme(fs.readFileSync(P('README.md'), 'utf8'), doc))
  const k = n => (n / 1024).toFixed(0) + 'K'
  return `${files.size} files; line.css ${k(sizes['with-line.css'].raw)} (${k(sizes['with-line.css'].gz)} gz), all.css ${k(sizes['with-all.css'].raw)} (${k(sizes['with-all.css'].gz)} gz), with-icons.js ${k(sizes['with-icons.js'].raw)}; site/vendor/with mirrored`
}
