// @withicons/loaders — runtime. Every loader is pre-rendered per style at build time (an SVG body with its own tiny
// CSS animation), so the runtime only assembles strings: no animation engine, no frame loop, nothing to tune.
//
//   svg(name, { style, size, color, speed, paused, label, vars, class, idSuffix, flat })  -> '<svg …>'   (sync)
//   svgAsync(name, options)                     same, loading the style first when needed
//   url(name, style)                            the standalone .svg on the CDN (works as <img src>, zero JS)
//   morph(items, { style, effect, hold, size, … })   one looping svg that turns each item into the next
//   morphAsync(items, options)                  same, fetching library icons by name (CDN, or setIconSource())
//   Morph items (0.6.0): a plain name is a library ICON; a loader only when asked for: 'loader:<name>' or
//   { loader: '<name>' } ({ icon }, { svg } and '<svg …>' markup work too). morphItem(item) says how one is read.
//   list() catalog() get(name) search(query) effects() styles() load(style) loaded(style) register(style, data)
import { EFFECTS, morphKeys, keyframes } from './effects.js'

let CATALOG = []           // [{ name, title, group, description, intent, aliases, tags, synonyms, duration, morph, icons? }]
const BY = Object.create(null)
const DATA = Object.create(null)   // style -> { root, loaders: { name: body } }
let LOADER = null          // style -> Promise (sets DATA via register)
let ONE = null             // (name, style) -> Promise<{ root, body }>: fetch one loader instead of a whole style (optional)
let ICON_SOURCE = null     // (name, style) -> Promise<svg string>
let META = { version: '0.0.0', styles: ['line'], cdn: {} }
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

// ------------------------------------------------------------------ setup (called by the generated entries)
export function configure(o) {
  if (o.catalog) { CATALOG = o.catalog; for (const k in BY) delete BY[k]; for (const l of CATALOG) { BY[l.name] = l; for (const a of l.aliases || []) if (!BY[a]) BY[a] = l } }
  if (o.meta) META = { ...META, ...o.meta }
  if (o.loader !== undefined) LOADER = o.loader
  if (o.one !== undefined) ONE = typeof o.one === 'function' ? o.one : null
  if (o.iconSource !== undefined) ICON_SOURCE = o.iconSource
}
/** Add (or replace) a style's pre-rendered loaders: { root: {svg attrs}, loaders: { name: body } } (every loader). */
export function register(style, data) { DATA[style] = { ...data, full: true }; return DATA[style] }
/** Add one loader of a style (what a one-file fetch brings): { root, body }. A full register() replaces it. */
export function registerOne(style, name, f) {
  const d = DATA[style] || (DATA[style] = { root: f.root, loaders: {}, full: false })
  if (!d.root) d.root = f.root
  d.loaders[name] = f.body
  return d
}
export const loaded = style => !!(DATA[style || 'line'] && DATA[style || 'line'].full)
const hasOne = (name, style) => !!(DATA[style] && DATA[style].loaders[name] != null)
/** Load a style's loaders (dynamic import in bundlers / ESM, a sibling script on the CDN build). */
export function load(style) {
  const s = style || 'line'
  if (DATA[s] && DATA[s].full) return Promise.resolve(DATA[s])
  if (!META.styles.includes(s)) return Promise.reject(fail('WITH_LOADER_STYLE', `unknown style "${s}". Styles: ${META.styles.join(', ')}`))
  if (!LOADER) return Promise.reject(fail('WITH_LOADER_STYLE', `style "${s}" is not loaded: import "@withicons/loaders/styles/${s}"`))
  return Promise.resolve(LOADER(s)).then(() => DATA[s] || Promise.reject(fail('WITH_LOADER_STYLE', `style "${s}" did not register`)))
}
/** Where library icons come from for morphAsync / <with-loader morph>: (name, style) => Promise<svg markup>. */
export const setIconSource = fn => { ICON_SOURCE = typeof fn === 'function' ? fn : null }

// ------------------------------------------------------------------ catalog
export const version = () => META.version
export const styles = () => META.styles.slice()
export const list = () => CATALOG.map(l => l.name)
export const catalog = () => CATALOG.map(l => ({ ...l }))
export const effects = () => Object.keys(EFFECTS).map(k => ({ name: k, title: EFFECTS[k].title, description: EFFECTS[k].say }))
export function get(name) { const l = BY[String(name || '').trim().toLowerCase()]; return l ? { ...l } : null }
const words = s => String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
/** Best loaders for a plain-language query ("ai thinking", "upload", "diwali"): [{ name, title, group, score }]. */
export function search(query, limit = 8) {
  const q = words(query)
  if (!q.length) return []
  return CATALOG.map(l => {
    let s = 0
    const name = words(l.name), al = (l.aliases || []).flatMap(words), tg = (l.tags || []).flatMap(words),
      sy = (l.synonyms || []).flatMap(words), ds = words(l.description + ' ' + (l.intent || ''))
    for (const w of q) {
      if (name.includes(w)) s += 10; else if (name.some(n => n.startsWith(w))) s += 6
      if (al.includes(w)) s += 6; if (tg.includes(w)) s += 4; if (sy.includes(w)) s += 4; if (ds.includes(w)) s += 1
      if (l.group === w) s += 3
    }
    if (String(query).trim().toLowerCase() === l.name) s += 50
    return { name: l.name, title: l.title, group: l.group, score: s }
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score || (a.name < b.name ? -1 : 1)).slice(0, limit)
}
function suggest(name) { return search(String(name).replace(/[-_]/g, ' '), 3).map(r => r.name) }
function fail(code, msg, extra) { const e = new Error(`with icons loaders: ${msg}`); e.code = code; Object.assign(e, extra); return e }

// ------------------------------------------------------------------ svg assembly
const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const attrs = o => Object.keys(o).filter(k => o[k] != null && o[k] !== false && o[k] !== '').map(k => ` ${k}="${esc(o[k])}"`).join('')
const CSS_SAFE = v => String(v).replace(/[;{}<>"\\]/g, '')
const VAR_KEY = k => { const s = String(k).trim(); return s.startsWith('--') ? s : s.startsWith('with-') ? '--' + s : '--with-' + s }
/** Give every id (and url(#…)/href="#…" reference) a suffix: one page may hold many copies of a rich loader. */
export function uniqueIds(markup, suffix) {
  if (suffix == null || suffix === '' || markup.indexOf('id="') < 0) return markup
  const sfx = '-' + String(suffix).replace(/[^\w-]/g, '')
  return markup.replace(/(\sid="|url\(#|href="#)([^")\s]+)/g, '$1$2' + sfx)
}
/** Resolve var(--x, fallback) paints (for <img>, canvas, data URIs). */
export function flatten(svg, vars) {
  const map = {}
  for (const k in vars || {}) map[VAR_KEY(k)] = CSS_SAFE(vars[k])
  let prev, s = svg
  do {
    prev = s
    s = s.replace(/var\(\s*(--[\w-]+)\s*,\s*([^()]*?)\s*\)/g, (m, k, fb) => k.startsWith('--wl-') ? m : has(map, k) ? map[k] : fb)
  } while (s !== prev)
  return s
}
function rootStyle(o) {
  const css = []
  if (o.color && o.color !== 'currentColor') css.push('color:' + CSS_SAFE(o.color))
  if (o.speed != null && o.speed !== '' && Number(o.speed) > 0) css.push('--wl-speed:' + Number(o.speed))
  if (o.paused) css.push('--wl-state:paused')
  for (const k in o.vars || {}) if (o.vars[k] != null && o.vars[k] !== '') css.push(VAR_KEY(k) + ':' + CSS_SAFE(o.vars[k]))
  if (o.cssText) css.push(CSS_SAFE(o.cssText))
  return css.join(';')
}
function finish(svg, o) {
  if (!o.flat) return svg
  const out = flatten(svg, o.vars)
  return o.color && o.color !== 'currentColor' ? out.replace(/currentColor/g, CSS_SAFE(o.color)) : out
}
/**
 * One loader as an inline <svg> string (sync; the style must be loaded: line always is).
 *   svg('spinner', { style: 'glass', size: 48, color: '#7c5cff', speed: 1.5, label: 'Loading results' })
 * options: style ('line'), size (24, number or CSS length), color (currentColor), speed (1 = as designed),
 *          paused, label ('Loading'; '' = decorative), vars ({ role: value } style colours), class, idSuffix, flat
 */
export function svg(name, options) {
  const o = options || {}
  const l = get(name)
  if (!l) { const s = suggest(name); throw fail('WITH_LOADER_UNKNOWN', `no loader "${name}"${s.length ? ` (did you mean ${s.join(', ')}?)` : ''}. list() names them all.`, { suggestions: s }) }
  const st = o.style || o.variant || 'line'
  const d = DATA[st]
  if (!d) throw fail('WITH_LOADER_STYLE', `style "${st}" is not loaded yet: await load("${st}"), or use svgAsync()`, { style: st })
  const body = d.loaders[l.name]
  if (body == null) throw d.full ? fail('WITH_LOADER_UNKNOWN', `loader "${l.name}" has no "${st}" drawing`) : fail('WITH_LOADER_STYLE', `loader "${l.name}" in "${st}" is not loaded yet: use svgAsync()`, { style: st })
  const size = o.size == null || o.size === '' ? 24 : o.size
  const label = o.label == null ? 'Loading' : o.label
  const a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', ...d.root,
    class: `wl wl-${l.name}-${st}${o.class ? ' ' + o.class : ''}`, style: rootStyle(o) || null }
  if (label) { a.role = 'img'; a['aria-label'] = label } else a['aria-hidden'] = 'true'
  return finish(`<svg${attrs(a)}>${uniqueIds(body, o.idSuffix)}</svg>`, o)
}
/** Make sure one loader of a style can draw: already here, fetched alone (configure({ one })), or its whole style. */
export function ensure(name, style) {
  const st = style || 'line', l = get(name), n = l ? l.name : name
  if (hasOne(n, st)) return Promise.resolve()
  if (!ONE || !l) return load(st).then(() => {})
  return Promise.resolve(ONE(n, st)).then(f => { if (!f || f.body == null) throw new Error('empty'); registerOne(st, n, f) })
    .catch(() => load(st).then(() => {}))
}
export function svgAsync(name, options) {
  const st = (options && (options.style || options.variant)) || 'line'
  return ensure(name, st).then(() => svg(name, options))
}
/** The standalone file on jsDelivr: <img src="…" width="32" alt="Loading">. */
export const url = (name, style, ver) => {
  const l = get(name)
  return `https://cdn.jsdelivr.net/npm/@withicons/loaders@${ver || META.version}/dist/svg/${style || 'line'}/${l ? l.name : name}.svg`
}
export const dataUri = (name, options) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(name, { ...options, flat: true }))

// ------------------------------------------------------------------ morph
const ATTR = /([\w:-]+)="([^"]*)"/g
function splitSvg(markup) {
  const m = /<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(String(markup).trim())
  if (!m) return { root: {}, inner: String(markup) }
  const root = {}
  let a
  ATTR.lastIndex = 0
  while ((a = ATTR.exec(m[1]))) root[a[1]] = a[2]
  for (const k of ['xmlns', 'width', 'height', 'viewBox', 'class', 'style', 'role', 'aria-label', 'aria-hidden', 'id']) delete root[k]
  return { root, inner: m[2] }
}
let MID = 0
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return (h >>> 0).toString(36) }
/**
 * How a morph item is read: { kind: 'icon', name } | { kind: 'loader', name } | { kind: 'svg', markup } | null.
 * A plain name is a library icon (since 0.6.0: many loaders share a name with an icon, e.g. rocket, download, gift);
 * a loader only when asked for explicitly: 'loader:rocket' or { loader: 'rocket' }. 'icon:rocket', { icon: 'rocket' },
 * { svg: '<svg …>' } and '<svg …>' markup work too.
 */
export function morphItem(it) {
  if (it && typeof it === 'object') {
    if (it.svg != null) return { kind: 'svg', markup: String(it.svg) }
    if (it.loader != null) return String(it.loader).trim() ? { kind: 'loader', name: String(it.loader).trim() } : null
    if (it.icon != null) return String(it.icon).trim() ? { kind: 'icon', name: String(it.icon).trim() } : null
    return null
  }
  const s = it == null ? '' : String(it).trim()
  if (!s) return null
  if (s[0] === '<') return { kind: 'svg', markup: s }
  const m = /^(loader|icon):\s*(.+)$/i.exec(s)
  if (m) return { kind: m[1].toLowerCase(), name: m[2].trim() }
  return { kind: 'icon', name: s }
}
const itemKey = p => p.kind === 'svg' ? p.markup : p.kind + ':' + p.name
const loaderHint = name => get(name) ? ` (for the "${get(name).name}" loader write "loader:${name}")` : ''
/**
 * Turn items into one another in a loop: each holds the stage for `hold` seconds and hands over with `effect`.
 * items: icon <svg> strings of any with icons style, and/or loaders asked for as 'loader:<name>' / { loader } (drawn in
 * options.style). A plain name is an icon: morph() cannot fetch it (use morphAsync(), or pass its <svg>).
 *   morph([fileSvg, 'loader:spinner', checkSvg], { style: 'line', effect: 'bloom', hold: 1.2 })
 * options: style, effect (bloom spin flip slide-up slide-left drop zoom fade), hold (s per item, 1.1), size, color,
 *          speed, paused, label, vars, class, flat
 */
export function morph(items, options) {
  const o = options || {}
  const st = o.style || o.variant || 'line'
  const raw = (Array.isArray(items) ? items : items == null ? [] : [items]).filter(it => it != null && it !== '')
  if (!raw.length) throw fail('WITH_LOADER_MORPH', 'morph() needs at least one item')
  const list0 = raw.map((it, i) => {
    const p = morphItem(it)
    if (!p) throw fail('WITH_LOADER_MORPH', `morph item ${i}: ${JSON.stringify(it)} is not an icon <svg>, 'loader:<name>' or { loader | icon | svg }`)
    return p
  })
  const fx = EFFECTS[o.effect] ? o.effect : 'bloom'
  const hold = Math.max(0.3, Number(o.hold) || 1.1)
  const n = list0.length, dur = hold * n
  const id = o.id || 'wl-m' + hash(st + fx + hold + list0.map(itemKey).join('\u0001')).slice(0, 6)
  const css = [`.${id}{--wl-k:1;overflow:visible}`, `@media (prefers-reduced-motion:reduce){.${id}{--wl-k:2.4}}`]
  const D = s => `calc(${Math.round(s * 1000) / 1000}s*var(--wl-k,1)/var(--wl-speed,1))`
  const groups = list0.map((it, i) => {
    let root, inner, l = null
    if (it.kind === 'loader') {
      l = get(it.name)
      if (!l) { const s = suggest(it.name); throw fail('WITH_LOADER_UNKNOWN', `morph item ${i}: no loader "${it.name}"${s.length ? ` (did you mean ${s.join(', ')}?)` : ''}`, { suggestions: s }) }
      const d = DATA[st]
      if (!d || d.loaders[l.name] == null) throw fail('WITH_LOADER_STYLE', `loader "${l.name}" in "${st}" is not loaded yet: use morphAsync()`)
      root = d.root; inner = d.loaders[l.name]
    } else if (it.kind === 'svg') ({ root, inner } = splitSvg(it.markup))
    else throw fail('WITH_LOADER_MORPH', `morph item ${i}: "${it.name}" is an icon name: pass its <svg> markup, or use morphAsync(), which fetches icons by name${loaderHint(it.name)}`)
    const cls = `${id}-${i}`
    if (n > 1) {
      css.push(keyframes(cls, morphKeys(i, n, fx)))
      css.push(`.${cls}{transform-box:view-box;transform-origin:12px 12px;animation:${cls} ${D(dur)} linear infinite;animation-play-state:var(--wl-state,running)}`)
    } else if (o.enter !== false) {
      // a single item (a finished state): it arrives once with the effect's entrance and stays
      const k = morphKeys(0, 2, fx).filter(([t]) => t <= 0.5 * EFFECTS[fx].fade + 1e-9 || t === 0)
      css.push(keyframes(cls, k.map(([t, v]) => [t / (0.5 * EFFECTS[fx].fade), v]).filter(([t]) => t <= 1)))
      css.push(`.${cls}{transform-box:view-box;transform-origin:12px 12px;animation:${cls} .6s both}`)
    }
    // a loader body inside a morph keeps its own classes: wrap it so its root presentation attributes still apply
    const sub = l ? `<g class="wl wl-${l.name}-${st}">${inner}</g>` : inner
    return `<g class="${cls}"${attrs(root)}>${uniqueIds(sub, `${id}-${i}`)}</g>`
  })
  const size = o.size == null || o.size === '' ? 24 : o.size
  const label = o.label == null ? 'Loading' : o.label
  const a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'none', class: `wl ${id}${o.class ? ' ' + o.class : ''}`, style: rootStyle(o) || null }
  if (label) { a.role = 'img'; a['aria-label'] = label } else a['aria-hidden'] = 'true'
  return finish(`<svg${attrs(a)}><style>${css.join('')}</style>${groups.join('')}</svg>`, o)
}
const ICONS = new Map()
/** The library icon `name` in `style` as an <svg> string (setIconSource() first, else the jsDelivr CDN). */
export function iconSvg(name, style) {
  const st = style || 'line', k = st + '/' + name
  if (ICONS.has(k)) return ICONS.get(k)
  const p = (ICON_SOURCE ? Promise.resolve(ICON_SOURCE(name, st)) : (typeof fetch === 'function'
    ? fetch(iconUrl(name, st)).then(r => r.ok ? r.text() : Promise.reject(fail('WITH_LOADER_ICON', `no icon "${name}" in style "${st}" (${r.status})`)))
    : Promise.reject(fail('WITH_LOADER_ICON', 'no fetch(): pass icon <svg> strings to morph(), or setIconSource()'))))
  p.catch(() => ICONS.delete(k))
  ICONS.set(k, p)
  return p
}
export const iconUrl = (name, style) => `https://cdn.jsdelivr.net/npm/@withicons/${(META.cdn || {})[style || 'line'] || 'core'}@${META.version}/dist/svg/${style || 'line'}/${name}.svg`
/**
 * morph() for names: every plain name is a library icon, fetched in the same style; 'loader:<name>' (or { loader })
 * is a loader. A string is a comma / space separated list ("file, cloud-upload, loader:spinner").
 */
export function morphAsync(items, options) {
  const st = (options && (options.style || options.variant)) || 'line'
  const list0 = (Array.isArray(items) ? items : String(items == null ? '' : items).split(/[\s,]+/)).filter(it => it != null && it !== '')
  return Promise.all(list0.map((it, i) => {
    const p = morphItem(it)
    if (!p) return Promise.reject(fail('WITH_LOADER_MORPH', `morph item ${i}: ${JSON.stringify(it)} is not an icon name, 'loader:<name>' or <svg>`))
    if (p.kind === 'svg') return p.markup
    if (p.kind === 'loader') {
      const l = get(p.name)
      if (!l) { const s = suggest(p.name); return Promise.reject(fail('WITH_LOADER_UNKNOWN', `no loader "${p.name}"${s.length ? ` (did you mean ${s.join(', ')}?)` : ''}`, { suggestions: s })) }
      return ensure(l.name, st).then(() => ({ loader: l.name }))
    }
    return iconSvg(p.name, st).catch(e => { const h = loaderHint(p.name); if (h && e && e.message && !e.message.includes(h)) e.message += h; throw e })
  })).then(list => morph(list, options))
}
export const nextId = () => 'l' + (++MID).toString(36)
