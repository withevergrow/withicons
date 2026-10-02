// @withicons/dynamic — the Live icons runtime (forge/DYNAMIC.md).
// A live icon is a generator: params -> skeleton (forge/CONTRACT.md) -> any style renderer -> SVG.
// Bundled by forge/lib/emit-dynamic.mjs; `with-live:*` are virtual modules filled in at build time.
import GENERATORS from 'with-live:generators'
import { VERSION, STYLE_META, DEFAULT_STYLE } from 'with-live:meta'
import { parsePath } from '../../../forge/kernel/geom.mjs'
import { setOf, unionSets } from '../../../forge/kernel/bool.mjs'
import { clean as cleanText, coverage } from '../../../forge/dynamic/_font.mjs'

export const version = VERSION
export const defaultStyle = DEFAULT_STYLE
const has = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k)
const fail = (code, msg, extra) => Object.assign(new Error('with icons live: ' + msg), { code }, extra)

// ------------------------------------------------------------------ registry
const GENS = Object.create(null)
const ALIASES = Object.create(null)
for (const g of GENERATORS) GENS[g.name] = g
for (const g of GENERATORS) for (const a of g.aliases || []) if (!GENS[a]) (ALIASES[a] ||= []).push(g.name)

const STYLE_NAMES = STYLE_META.map(s => s.name)
/** every style this runtime knows, in display order: [{ name, title, kind, description, strokeWidth, root }] */
export const styles = STYLE_META.map(s => Object.freeze({ ...s }))
export const styleNames = () => STYLE_NAMES.slice()
const RENDERERS = Object.create(null)     // name -> style module (has render())
const LOADERS = Object.create(null)       // name -> () => Promise<module | style>
const PENDING = Object.create(null)

/** Register a style renderer (a forge/styles module default export). Chunks call this on import. */
export function register(style) {
  const s = style && style.default && !style.render ? style.default : style
  if (!s || typeof s.render !== 'function' || !s.name) throw fail('WITH_BAD_STYLE', 'register() needs a style with name and render()')
  RENDERERS[s.name] = s
  if (!STYLE_NAMES.includes(s.name)) { STYLE_NAMES.push(s.name); styles.push(Object.freeze({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root })) }
  return s
}
/** Tell the runtime how to fetch styles that are not bundled: { glass: () => import('./styles/glass.js') } */
export function setLoaders(map) { for (const k in map) LOADERS[k] = map[k] }
/** true when the style can render synchronously right now */
export const loaded = style => !!RENDERERS[style]
/** Load a style's renderer (no-op when bundled). Resolves to the style. */
export function load(style) {
  const v = style || DEFAULT_STYLE
  if (RENDERERS[v]) return Promise.resolve(RENDERERS[v])
  if (!LOADERS[v]) return Promise.reject(unknownStyle(v))
  return PENDING[v] || (PENDING[v] = Promise.resolve().then(LOADERS[v]).then(m => {
    if (!RENDERERS[v] && m) register(m.default || m)
    if (!RENDERERS[v]) throw fail('WITH_STYLE_LOAD', `style "${v}" loaded but did not register`)
    return RENDERERS[v]
  }).catch(e => { delete PENDING[v]; throw e }))
}
function unknownStyle(v) {
  return fail('WITH_UNKNOWN_STYLE', `unknown style "${v}". Use one of: ${STYLE_NAMES.join(', ')}.`, { styles: STYLE_NAMES.slice() })
}

// ------------------------------------------------------------------ names
function lev(a, b) {
  const m = a.length, n = b.length
  if (!m || !n) return m || n
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[n]
}
const keyOf = s => String(s == null ? '' : s).trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[\s_./:]+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')
/** canonical name for a name or alias, or null */
export function resolveName(name) {
  const k = keyOf(name)
  if (GENS[k]) return k
  const hit = ALIASES[k]
  if (hit && hit.length === 1) return hit[0]
  if (hit) throw fail('WITH_AMBIGUOUS_ICON', `"${name}" is an alias of ${hit.join(', ')}. Use a canonical name.`, { candidates: hit.slice() })
  return null
}
/** up to `count` closest live icon names */
export function suggest(name, count = 3) {
  const q = keyOf(name), best = {}
  const see = (key, n, pen) => { const d = lev(q, key) + pen; if (!(n in best) || d < best[n]) best[n] = d }
  for (const n in GENS) see(n, n, 0)
  for (const a in ALIASES) for (const n of ALIASES[a]) see(a, n, 0.5)
  return Object.keys(best).sort((x, y) => best[x] - best[y] || (x < y ? -1 : 1)).slice(0, count)
}
function gen(name) {
  const n = resolveName(name)
  if (n) return GENS[n]
  throw fail('WITH_UNKNOWN_ICON', `unknown live icon "${name}". Did you mean: ${suggest(name).join(', ')}?`, { suggestions: suggest(name) })
}

// ------------------------------------------------------------------ metadata
const META_KEYS = ['name', 'title', 'category', 'description', 'aliases', 'tags', 'synonyms']
const clone = v => v == null ? v : JSON.parse(JSON.stringify(v))
const deepFreeze = o => { if (o && typeof o === 'object') { Object.values(o).forEach(deepFreeze); Object.freeze(o) } return o }
const METAS = Object.create(null)
function meta(g) {
  if (METAS[g.name]) return METAS[g.name]
  const m = {}
  for (const k of META_KEYS) m[k] = clone(g[k] ?? (k === 'aliases' || k === 'tags' || k === 'synonyms' ? [] : ''))
  m.params = clone(g.params || {})
  m.examples = (g.examples || []).map(e => resolveParams(g, e))
  m.defaults = resolveParams(g, {})
  return (METAS[g.name] = deepFreeze(m))
}
/** names of every live icon */
export const list = () => Object.keys(GENS).sort()
/** metadata of every live icon (name, title, category, description, aliases, tags, synonyms, params, examples, defaults) */
export const catalog = () => list().map(n => meta(GENS[n]))
/** metadata for one live icon (name or alias), or null */
export function get(name) { const n = resolveName(name); return n ? meta(GENS[n]) : null }
/** the default params of a live icon */
export const defaults = name => ({ ...meta(gen(name)).defaults })
/** the param schema of a live icon */
export const paramsOf = name => clone(meta(gen(name)).params)

// ------------------------------------------------------------------ params
const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/
const isNum = v => typeof v === 'number' && Number.isFinite(v)
function valueError(s, v) {
  switch (s.type) {
    case 'int': return !Number.isInteger(v) ? 'not an integer' : (v < s.min || v > s.max) ? `outside ${s.min}..${s.max}` : ''
    case 'number': return !isNum(v) ? 'not a number' : (v < s.min || v > s.max) ? `outside ${s.min}..${s.max}` : ''
    case 'level': return !isNum(v) ? 'not a number' : (v < 0 || v > 1) ? 'outside 0..1' : ''
    case 'time': return typeof v === 'string' && TIME.test(v) ? '' : 'not "HH:MM" (00:00-23:59)'
    case 'enum': return (s.options || []).includes(v) ? '' : `not one of ${(s.options || []).join(', ')}`
    case 'text': {
      if (typeof v !== 'string') return 'not a string'
      if ([...v].length > (s.maxLength || 4)) return `longer than ${s.maxLength || 4}`
      const c = coverage(v); return c.ok ? '' : `characters not in the font: ${c.missing.join('')}`
    }
    case 'bool': return typeof v === 'boolean' ? '' : 'not a boolean'
    default: return 'unknown type'
  }
}
/** Strict check of a params object. Returns a list of problems ([] = valid). */
export function validate(name, params) {
  const g = gen(name), errs = []
  for (const k of Object.keys(params || {})) if (!has(g.params, k)) errs.push(`unknown param "${k}"`)
  for (const [k, s] of Object.entries(g.params || {})) if (params && has(params, k)) { const e = valueError(s, params[k]); if (e) errs.push(`${k}=${JSON.stringify(params[k])}: ${e}`) }
  return errs
}
// lenient: defaults filled, numbers coerced/clamped/stepped, text cleaned, unknown keys dropped. Never throws.
function resolveParams(g, p) {
  const out = {}
  for (const [k, s] of Object.entries(g.params || {})) {
    let v = p && has(p, k) ? p[k] : undefined
    const def = s.default
    switch (s.type) {
      case 'int': case 'number': {
        v = v === '' || v === null || v === undefined || typeof v === 'boolean' ? NaN : Number(v)
        if (!Number.isFinite(v)) { v = def; break }
        if (s.step) v = s.min + Math.round((v - s.min) / s.step) * s.step
        if (s.type === 'int') v = Math.round(v)
        v = Math.min(s.max, Math.max(s.min, +v.toFixed(6))); break
      }
      case 'level': {
        if (typeof v === 'string' && /%\s*$/.test(v)) v = parseFloat(v) / 100
        v = v === '' || v === null || v === undefined || typeof v === 'boolean' ? NaN : Number(v)
        if (!Number.isFinite(v)) { v = def; break }
        v = Math.min(1, Math.max(0, v)); if (s.steps) v = Math.round(v * s.steps) / s.steps; break
      }
      case 'time': {
        const m = typeof v === 'string' && v.trim().match(/^(\d{1,2}):(\d{2})$/)
        v = m && +m[1] < 24 && +m[2] < 60 ? `${m[1].padStart(2, '0')}:${m[2]}` : def; break
      }
      case 'enum': {
        if (!(s.options || []).includes(v)) {
          const hit = v == null ? undefined : (s.options || []).find(o => String(o).toLowerCase() === String(v).toLowerCase())
          v = hit ?? def
        }
        break
      }
      case 'text': v = v === undefined || v === null ? def : cleanText(String(v), s.maxLength || 4); break
      case 'bool': v = v === undefined || v === null ? def : v === true || v === 'true' || v === '' || v === 1 || v === '1' || v === 'on' || v === 'yes'; break
      default: v = def
    }
    out[k] = v
  }
  return out
}
/** Lenient params: defaults filled in, values coerced and clamped, unknown keys dropped. Never throws for a known icon. */
export const resolve = (name, params) => resolveParams(gen(name), params)

// ------------------------------------------------------------------ skeleton + render
/** The raw skeleton (forge/CONTRACT.md format) a generator builds for params. */
export function skeleton(name, params) {
  const g = gen(name)
  const p = Object.freeze(resolveParams(g, params))
  const sk = g.build(p) || {}
  return {
    name: g.name, category: g.category, description: g.description, aliases: g.aliases || [], tags: g.tags || [],
    paths: (sk.paths || []).map(x => typeof x === 'string' ? { d: x, plate: 'A' } : x).filter(x => x && x.d),
    fills: (sk.fills || []).filter(Boolean), cutouts: (sk.cutouts || []).filter(Boolean), params: p,
  }
}
// same as forge/lib/load.mjs prepare(): what every renderer receives
function prepare(raw) {
  const paths = raw.paths.map((p, i) => ({ id: p.id || `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = raw.cutouts.map(d => ({ d, subs: parsePath(d) }))
  let fillSet
  return {
    ...raw, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    get fillSet() { return fillSet || (fillSet = fills.length ? unionSets(fills.map(f => f.set)) : []) },
  }
}
const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
function styleOf(style) {
  const v = style || DEFAULT_STYLE
  if (RENDERERS[v]) return RENDERERS[v]
  if (!STYLE_NAMES.includes(v) && !LOADERS[v]) throw unknownStyle(v)
  throw fail('WITH_STYLE_NOT_LOADED', `style "${v}" is not loaded yet: await load("${v}") first, use renderAsync(), or import "@withicons/dynamic" (every style bundled).`, { style: v })
}

// small LRU of rendered inner markup: renders cost 1-100 ms, re-renders with the same params are free
const CACHE = new Map(), CACHE_MAX = 400
const remember = (k, v) => { CACHE.set(k, v); if (CACHE.size > CACHE_MAX) CACHE.delete(CACHE.keys().next().value); return v }
const keyOf3 = (g, p, style) => g.name + '\u0001' + style + '\u0001' + JSON.stringify(p)
const clock = () => typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now()
function inner(g, p, style) {
  const st = styleOf(style)
  const key = keyOf3(g, p, st.name)
  const hit = CACHE.get(key)
  if (hit) { CACHE.delete(key); CACHE.set(key, hit); return hit }
  const t = clock()
  const nodes = st.render(prepare(skeleton(g.name, p)))
  if (!Array.isArray(nodes)) throw fail('WITH_RENDER', `style ${st.name} returned no nodes for ${g.name}`)
  const clean = nodes.filter(n => n && n[1] && (n[0] !== 'path' || (n[1].d && n[1].d.length > 1)))
  measured(st.name, clock() - t)
  return remember(key, { nodes: clean, markup: clean.map(([t, a]) => `<${t}${attrs(a)}/>`).join('') })
}

// ------------------------------------------------------------------ cost + off-main-thread rendering
// What one uncached render costs (ms, median over the 50 live icons on a laptop). Rich styles run whole-icon geometry
// (fields, booleans, bevels), so 50-150 ms per draw is normal for them. Seeds only: the runtime keeps a moving average.
// Scheduling never changes output: a render is byte-identical on the main thread and in a worker.
const COST = { line: 4, duo: 3, blueprint: 9, sketch: 9, pixel: 9, engrave: 18, kawaii: 21, solid: 27, retro: 57, sticker: 65, skeuo: 85, bauhaus: 95, gloss: 100, luxe: 140, glass: 160 }
const FRAME_MS = 16
const SEED = { ...COST }
// a moving average, kept within half to twice the seed so one cold (JIT) or lucky draw cannot reclassify a style
function measured(style, ms) {
  if (!(ms >= 0 && ms < 1e4)) return
  const v = COST[style] == null ? ms : COST[style] * 0.8 + ms * 0.2, s = SEED[style]
  COST[style] = s == null ? v : Math.min(s * 2, Math.max(s / 2, v))
}
/** Typical cost of one uncached render in a style, in ms (a moving average once the style has drawn). */
export const cost = style => Math.round((COST[style || DEFAULT_STYLE] ?? 30) * 10) / 10
/** true when render() for these params is a cache hit (free) */
export function cached(name, params, style) {
  const g = gen(name)
  return CACHE.has(keyOf3(g, resolveParams(g, params), style || DEFAULT_STYLE))
}

// A small pool of workers (when the build provides one: setWorker) renders rich styles off the main thread. Without
// workers (Node, file://, a CSP without worker-src) jobs run on the main thread one per task, so the page can paint
// and take input between draws instead of freezing for the whole batch.
let workerFactory = null, pool = null, poolDead = false, seq = 0
const QUEUE = [], JOBS = new Map()
/** Give the runtime a way to start a render worker: setWorker(() => new Worker(url)). null turns workers off. */
export function setWorker(factory, onlyIfUnset) {
  if (onlyIfUnset && workerFactory) return // several entries on one page share the first factory and its workers
  workerFactory = typeof factory === 'function' ? factory : null
  if (pool) for (const s of pool) { clearTimeout(s.timer); try { s.w.terminate() } catch (e) { /* gone */ } if (s.job) { s.job.sent = false; QUEUE.unshift(s.job) } }
  pool = null; poolDead = false
  if (QUEUE.length) pump()
}
/** true while render workers are running (they start on the first off-thread job) */
export const workers = () => !!(pool && pool.length)
function startPool() {
  if (pool || poolDead || !workerFactory) return pool
  const hw = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 2
  const n = Math.max(1, Math.min(2, hw - 1))
  try {
    pool = []
    for (let i = 0; i < n; i++) {
      const w = workerFactory()
      if (!w || typeof w.postMessage !== 'function') throw new Error('no worker')
      const slot = { w, job: null, timer: 0 }
      w.onmessage = e => done(slot, e.data)
      w.onerror = e => { if (e && e.preventDefault) e.preventDefault(); killPool() }
      pool.push(slot)
    }
  } catch (e) { killPool() }
  return pool
}
// a worker that cannot start (blocked, file://, unsupported) or crashes: finish everything on the main thread
function killPool() {
  if (poolDead) return
  poolDead = true
  const back = (pool || []).map(s => s.job).filter(Boolean)
  for (const s of pool || []) { clearTimeout(s.timer); try { s.w.terminate() } catch (e) { /* gone */ } }
  pool = null
  QUEUE.unshift(...back.map(j => { j.sent = false; return j }))
  pump()
}
function done(slot, m) {
  const job = slot.job
  if (!job || !m || m.id !== job.id) return
  clearTimeout(slot.timer); slot.job = null
  if (m.error) finish(job, fail(m.code || 'WITH_RENDER', String(m.error).replace(/^with icons live: /, '')))
  else { remember(job.key, { nodes: m.nodes, markup: m.markup }); measured(job.style, m.ms); finish(job) }
  pump()
}
function finish(job, err) {
  JOBS.delete(job.key)
  for (const w of job.waiters) err ? w.bad(err) : w.ok(true)
}
// the next job: the oldest icon+style group first (page order), but within a group the newest params (a dragged slider
// shows where the thumb is now, not where it was)
function take() {
  if (!QUEUE.length) return null
  const g = QUEUE[0].group
  let i = 0
  for (let j = QUEUE.length - 1; j >= 0; j--) if (QUEUE[j].group === g) { i = j; break }
  return QUEUE.splice(i, 1)[0]
}
let pumping = false, mainTimer = 0
function pump() {
  if (pumping) return
  pumping = true
  // a microtask: several attribute or param changes in one task become one job
  Promise.resolve().then(() => {
    pumping = false
    const p = startPool()
    if (p) {
      for (const slot of p) {
        if (slot.job) continue
        const job = take(); if (!job) break
        slot.job = job; job.sent = true
        // a worker that never answers (blocked script, hung) is treated as dead after 20 s
        slot.timer = setTimeout(() => { if (slot.job === job) killPool() }, 20000)
        slot.w.postMessage({ id: job.id, name: job.name, params: job.params, style: job.style })
      }
      return
    }
    if (mainTimer || !QUEUE.length) return
    mainTimer = setTimeout(() => {
      mainTimer = 0
      const job = take()
      if (!job) return
      load(job.style).then(() => { inner(GENS[job.name], job.params, job.style); finish(job) }).catch(e => finish(job, e)).then(pump)
    }, 0)
  })
}
/**
 * Make render(name, params, style) instant: draws it in a worker when one is available (else on the main thread, one
 * job per task) and caches the result. Resolves true once cached, or false when a newer request with the same
 * options.owner (any value: an element, 'editor'...) replaced it before it started.
 */
export function warm(name, params, style, options) {
  let g
  try { g = gen(name) } catch (e) { return Promise.reject(e) }
  const v = style || DEFAULT_STYLE
  if (!STYLE_NAMES.includes(v) && !LOADERS[v] && !RENDERERS[v]) return Promise.reject(unknownStyle(v))
  const p = resolveParams(g, params), key = keyOf3(g, p, v)
  // the page needs the style too (root attributes, and render() reads it); it loads while the worker draws
  const ready = load(v)
  if (CACHE.has(key)) return ready.then(() => true)
  const owner = options && options.owner
  const pending = new Promise((ok, bad) => {
    const waiter = { ok, bad, owner }
    if (owner != null) {
      // drop this owner's earlier requests that have not started yet
      for (let i = QUEUE.length - 1; i >= 0; i--) {
        const j = QUEUE[i]
        if (j.key === key || !j.waiters.some(w => w.owner === owner)) continue
        const mine = j.waiters.filter(w => w.owner === owner)
        j.waiters = j.waiters.filter(w => w.owner !== owner)
        for (const w of mine) w.ok(false)
        if (!j.waiters.length) { QUEUE.splice(i, 1); JOBS.delete(j.key) }
      }
    }
    const have = JOBS.get(key)
    if (have) { have.waiters.push(waiter); return }
    const job = { id: ++seq, key, name: g.name, params: p, style: v, group: g.name + '\u0001' + v, waiters: [waiter], sent: false }
    JOBS.set(key, job); QUEUE.push(job)
    pump()
  })
  return Promise.all([ready, pending]).then(r => r[1])
}
/** Worker side: answer { id, name, params, style } with the rendered nodes. Builds call this inside their worker. */
export function serveWorker(scope) {
  scope.onmessage = e => {
    const m = e.data || {}
    if (m.id == null) return
    load(m.style).then(() => {
      const g = gen(m.name), t = clock()
      const r = inner(g, resolveParams(g, m.params), m.style)
      scope.postMessage({ id: m.id, nodes: r.nodes, markup: r.markup, ms: clock() - t })
    }).catch(err => scope.postMessage({ id: m.id, error: String((err && err.message) || err), code: err && err.code }))
  }
}
/** The style's IconNode list for params: { root, nodes: [[tag, attrs], ...] } (for framework wrappers). */
export function nodes(name, params, style) {
  const g = gen(name), st = styleOf(style)
  return { root: { ...st.root }, nodes: inner(g, resolveParams(g, params), st.name).nodes.map(([t, a]) => [t, { ...a }]) }
}

const VAR_KEY = k => { const s = String(k).trim(); return s.startsWith('--') ? s : s.startsWith('with-') ? '--' + s : '--with-' + s }
const CSS_SAFE = v => String(v).replace(/[;{}<>"\\]/g, '')
/** Resolve var(--x, fallback) paints: values from `vars` first, else the fallback (for <img>, canvas, data URIs). */
export function flatten(svg, vars) {
  const map = {}
  for (const k in vars || {}) map[VAR_KEY(k)] = CSS_SAFE(vars[k])
  let prev, s = svg
  do {
    prev = s
    s = s.replace(/var\(\s*(--[\w-]+)\s*,\s*([^()]*?)\s*\)/g, (_, k, fb) => has(map, k) ? map[k] : fb)
      .replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, k) => has(map, k) ? map[k] : 'currentColor')
  } while (s !== prev)
  return s
}
function rootAttrs(st, o) {
  const size = o.size == null || o.size === '' ? 24 : o.size
  const c = o.color || 'currentColor'
  const a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24' }
  for (const k in st.root || {}) a[k] = st.root[k]
  if (st.strokeWidth && o.strokeWidth != null && o.strokeWidth !== '' && !isNaN(Number(o.strokeWidth))) a['stroke-width'] = Number(o.strokeWidth)
  if (st.strokeWidth && o.absoluteStrokeWidth) {
    const px = /^\s*\d*\.?\d+(px)?\s*$/.test(String(size)) ? parseFloat(size) : 0
    const w = Number(a['stroke-width']) || st.strokeWidth
    if (px > 0) a['stroke-width'] = Math.round(w * 24 / px * 1000) / 1000
  }
  const css = []
  if (c !== 'currentColor') css.push('color:' + CSS_SAFE(c))
  for (const k in o.vars || {}) if (o.vars[k] != null && o.vars[k] !== '') css.push(VAR_KEY(k) + ':' + CSS_SAFE(o.vars[k]))
  if (css.length) a.style = css.join(';')
  if (o.class) a.class = o.class
  if (o.part) a.part = o.part
  if (o.label) { a.role = 'img'; a['aria-label'] = o.label } else a['aria-hidden'] = 'true'
  return a
}
/**
 * Render a live icon to an SVG string. Sync; memoized.
 *   render('calendar-date', { day: 9, month: 'MAY' }, 'glass', { size: 48, color: '#0b7', vars: { 'glass-pane': '#cde' }, label: 'May 9' })
 * options: size (24), color (currentColor), vars ({ name: value } CSS custom properties), label (accessible name),
 *          class, strokeWidth / absoluteStrokeWidth (stroke styles), flat (resolve var() paints for <img>/canvas).
 */
export function render(name, params, style, options) {
  const o = options || {}
  const { attrs: a, inner: body } = parts(name, params, style, o)
  const out = `<svg${attrs(a)}>${body}</svg>`
  if (!o.flat) return out
  const color = o.color && o.color !== 'currentColor' ? CSS_SAFE(o.color) : null
  const flat = flatten(out, o.vars)
  return color ? flat.replace(/currentColor/g, color) : flat
}
/** The pieces of render() for framework wrappers: { attrs: root <svg> attributes, inner: markup inside it, params }. */
export function parts(name, params, style, options) {
  const g = gen(name), st = styleOf(style)
  const p = resolveParams(g, params)
  return { attrs: rootAttrs(st, options || {}), inner: inner(g, p, st.name).markup, params: p }
}
/**
 * Same as render(), but loads the style first if needed and draws styles that take longer than a frame off the main
 * thread (in a worker when the build has one). options.latest: true keeps only the newest pending call per icon and
 * style; older calls that have not started reject with code WITH_SUPERSEDED (for sliders and live previews).
 */
export function renderAsync(name, params, style, options) {
  const v = style || DEFAULT_STYLE, o = options || {}
  let g, p
  // params are read now: the caller may change its object while the style loads or the worker draws
  try { g = gen(name); p = resolveParams(g, params) } catch (e) { return Promise.reject(e) }
  return load(v).then(() => {
    if (cost(v) <= FRAME_MS || cached(g.name, p, v)) return render(g.name, p, v, o)
    return warm(g.name, p, v, o.latest ? { owner: '\u0001latest\u0001' + g.name + '\u0001' + v } : null).then(ok => {
      if (!ok) throw fail('WITH_SUPERSEDED', `a newer renderAsync("${g.name}", ..., "${v}", { latest: true }) replaced this call`)
      return render(g.name, p, v, o)
    })
  })
}
/** An empty <svg> of the right size: a placeholder while a style loads. */
export function placeholder(options) {
  const o = options || {}, size = o.size == null || o.size === '' ? 24 : o.size
  return `<svg${attrs({ xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', class: o.class, part: o.part, 'aria-hidden': 'true' })}></svg>`
}
/** A data: URI (var() paints flattened) for <img src>, CSS backgrounds and canvas. */
export const dataUri = (name, params, style, options) =>
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(render(name, params, style, { ...options, flat: true }))
/** The local "today" params for date-like live icons: { day, month, weekday, year, time } (the generator decides what it reads). */
export function now(date) {
  const d = date instanceof Date ? date : new Date()
  const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const W = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const two = n => String(n).padStart(2, '0')
  return { day: d.getDate(), month: M[d.getMonth()], weekday: W[d.getDay()], year: d.getFullYear(), time: `${two(d.getHours())}:${two(d.getMinutes())}` }
}
/** Clear the render cache. */
export const clearCache = () => CACHE.clear()
/** camelCase param name -> kebab-case attribute name (and back) */
export const paramAttr = k => k.replace(/[A-Z]/g, c => '-' + c.toLowerCase())
export const attrParam = a => a.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
/** every param attribute any live icon reads (the element observes these) */
export function paramAttributes() {
  const out = new Set()
  for (const n in GENS) for (const k in GENS[n].params || {}) out.add(paramAttr(k))
  return [...out].sort()
}
