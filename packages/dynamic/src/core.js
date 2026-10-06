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

// A build may ship generators as metadata only (no build()): the CDN lite script, where each live icon's drawing code
// is its own small file. list(), get(), catalog(), resolve() and validate() work at once; drawing waits for loadIcon()
// (renderAsync(), warm() and the element do that themselves). Every other build bundles build() and loads nothing.
let ICON_LOADER = null
const ICON_PENDING = Object.create(null)
/** Tell the runtime how to fetch a live icon's drawing code: (name) => Promise (the file calls registerIcon). */
export function setIconLoader(fn) { ICON_LOADER = typeof fn === 'function' ? fn : null }
/** Register a live icon's generator ({ name, build, ... }); replaces the metadata-only entry of the same name. */
export function registerIcon(g) {
  const d = g && g.default && !g.build ? g.default : g
  if (!d || typeof d.build !== 'function' || !d.name) throw fail('WITH_BAD_ICON', 'registerIcon() needs a generator with name and build()')
  if (!GENS[d.name]) for (const a of d.aliases || []) if (!GENS[a]) (ALIASES[a] ||= []).push(d.name)
  GENS[d.name] = d
  return d
}
/** true when the live icon can draw synchronously right now (always, except in the CDN lite script before loadIcon) */
export function iconLoaded(name) { const n = resolveName(name); return !!(n && typeof GENS[n].build === 'function') }
/** Load a live icon's drawing code (no-op when bundled). Resolves to its canonical name. */
export function loadIcon(name) {
  let g
  try { g = gen(name) } catch (e) { return Promise.reject(e) }
  if (typeof g.build === 'function') return Promise.resolve(g.name)
  if (!ICON_LOADER) return Promise.reject(fail('WITH_ICON_NOT_LOADED', `live icon "${g.name}" has no drawing code in this build and no loader`))
  const n = g.name
  return ICON_PENDING[n] || (ICON_PENDING[n] = Promise.resolve().then(() => ICON_LOADER(n)).then(m => {
    if (m && typeof (m.default || m).build === 'function') registerIcon(m)
    if (typeof GENS[n].build !== 'function') throw fail('WITH_ICON_LOAD', `live icon "${n}" loaded but did not register`)
    return n
  }).catch(e => { delete ICON_PENDING[n]; throw e }))
}

const STYLE_NAMES = STYLE_META.map(s => s.name)
const META_BY = Object.fromEntries(STYLE_META.map(s => [s.name, s]))
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
  if (typeof g.build !== 'function') throw fail('WITH_ICON_NOT_LOADED', `live icon "${g.name}" is not loaded yet: await loadIcon("${g.name}") first, or use renderAsync().`, { icon: g.name })
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
const REAL = Object.create(null)
const remember = (k, v) => { CACHE.set(k, v); if (CACHE.size > CACHE_MAX) CACHE.delete(CACHE.keys().next().value); return v }
const keyOf3 = (g, p, style) => g.name + '\u0001' + style + '\u0001' + JSON.stringify(p)
const clock = () => typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now()
function inner(g, p, style) {
  const v = style || DEFAULT_STYLE
  const hit = CACHE.get(keyOf3(g, p, v))
  if (hit) { const k = keyOf3(g, p, v); CACHE.delete(k); CACHE.set(k, hit); return hit }
  const st = styleOf(v)
  const key = keyOf3(g, p, st.name)
  const t = clock()
  const nodes = st.render(prepare(skeleton(g.name, p)))
  if (!Array.isArray(nodes)) throw fail('WITH_RENDER', `style ${st.name} returned no nodes for ${g.name}`)
  const clean = nodes.filter(n => n && n[1] && (n[0] !== 'path' || (n[1].d && n[1].d.length > 1)))
  const dt = clock() - t
  measured(st.name, dt)
  // what this icon really costs here (not clamped like cost(): a slow device or a heavy icon shows up at once); the
  // first draw of an icon is cold (code still compiling), so it does not count
  const rk = g.name + '\u0001' + st.name, r = REAL[rk] || (REAL[rk] = { n: 0, ms: null })
  if (r.n++) r.ms = r.ms == null ? dt : r.ms * 0.6 + dt * 0.4
  return remember(key, { nodes: clean, markup: clean.map(([t, a]) => `<${t}${attrs(a)}/>`).join('') })
}

// ------------------------------------------------------------------ cost + off-main-thread rendering
// What one uncached render costs (ms, median over the 50 live icons on a laptop). Rich styles run whole-icon geometry
// (fields, booleans, bevels), so 50-150 ms per draw is normal for them. Seeds only: the runtime keeps a moving average.
// Scheduling never changes output: a render is byte-identical on the main thread and in a worker.
const COST = { line: 4, duo: 3, blueprint: 9, sketch: 9, pixel: 9, engrave: 18, kawaii: 21, solid: 27, anime: 45, plush: 50, retro: 57, pastel: 60, sticker: 65, coquette: 80, skeuo: 85, bauhaus: 95, gloss: 100, luxe: 140, glass: 160, gothic: 160 }
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
// a job worth a worker: its style costs more than a frame (cheap styles draw on this thread, no worker download), or a
// transition's frames that proved slower than planned on this device
const rich = job => job.worker || cost(job.style) > FRAME_MS
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
// ok(job): only jobs that may start now (workers wait until the page has the style, so the worker's copy of the style
// file comes from the HTTP cache instead of a second download)
// (a transition's frames are queued with fifo: they draw in order, so playback can start before the last one is ready)
function take(ok) {
  const f = ok || (() => true)
  const first = QUEUE.findIndex(f)
  if (first < 0) return null
  if (QUEUE[first].fifo) return QUEUE.splice(first, 1)[0]
  const g = QUEUE[first].group
  let i = first
  for (let j = QUEUE.length - 1; j >= 0; j--) if (QUEUE[j].group === g && f(QUEUE[j])) { i = j; break }
  return QUEUE.splice(i, 1)[0]
}
let pumping = false, mainTimer = 0
function pump() {
  if (pumping) return
  pumping = true
  // a microtask: several attribute or param changes in one task become one job
  Promise.resolve().then(() => {
    pumping = false
    // workers start only for styles slower than a frame: a page of cheap icons (line, duo...) never downloads the worker
    const p = pool || (QUEUE.some(rich) ? startPool() : null)
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
      Promise.all([load(job.style), loadIcon(job.name)]).then(() => { inner(GENS[job.name], job.params, job.style); finish(job) }).catch(e => finish(job, e)).then(pump)
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
  // (the icon's drawing code loads where it draws: in the worker, or on the main thread when the job runs there)
  const ready = RENDERERS[v] || (cost(v) > FRAME_MS && startPool()) ? Promise.resolve() : load(v)
  if (CACHE.has(key)) return ready.then(() => true)
  const owner = options && options.owner
  const pending = new Promise((ok, bad) => {
    const waiter = { ok, bad, owner }
    // drop this owner's earlier requests that have not started yet
    if (owner != null) dropOwner(owner, key)
    const have = JOBS.get(key)
    if (have) { have.waiters.push(waiter); return }
    const job = { id: ++seq, key, name: g.name, params: p, style: v, group: g.name + '\u0001' + v, waiters: [waiter], sent: false }
    JOBS.set(key, job); QUEUE.push(job)
    pump()
  })
  // a worker starts the job once the page has the style (see take); a style that fails to load fails its jobs
  ready.then(pump, e => {
    const job = JOBS.get(key)
    if (job && !job.sent) { const i = QUEUE.indexOf(job); if (i >= 0) QUEUE.splice(i, 1); finish(job, e) }
  })
  return Promise.all([ready, pending]).then(r => r[1])
}
// forget the jobs an owner asked for that have not started (their waiters resolve false); `keep` = a key to leave alone
function dropOwner(owner, keep) {
  for (let i = QUEUE.length - 1; i >= 0; i--) {
    const j = QUEUE[i]
    if (j.key === keep || !j.waiters.some(w => w.owner === owner)) continue
    const mine = j.waiters.filter(w => w.owner === owner)
    j.waiters = j.waiters.filter(w => w.owner !== owner)
    for (const w of mine) w.ok(false)
    if (!j.waiters.length) { QUEUE.splice(i, 1); JOBS.delete(j.key) }
  }
}
// queue several renders for one owner, drawn in this order (a transition's frames); nothing to wait on
function warmInOrder(g, list, v, owner) {
  dropOwner(owner)
  for (const p of list) {
    const key = keyOf3(g, p, v)
    if (CACHE.has(key)) continue
    const waiter = { ok() { }, bad() { }, owner }
    const have = JOBS.get(key)
    if (have) { have.waiters.push(waiter); continue }
    const job = { id: ++seq, key, name: g.name, params: p, style: v, group: g.name + '\u0001' + v, waiters: [waiter], sent: false, fifo: true, worker: true }
    JOBS.set(key, job); QUEUE.push(job)
  }
  ;(RENDERERS[v] || (cost(v) > FRAME_MS && startPool()) ? Promise.resolve() : load(v)).then(pump, () => { })
}
/** Worker side: answer { id, name, params, style } with the rendered nodes. Builds call this inside their worker. */
export function serveWorker(scope) {
  scope.onmessage = e => {
    const m = e.data || {}
    if (m.id == null) return
    Promise.all([load(m.style), loadIcon(m.name)]).then(() => {
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
  const g = gen(name), p = resolveParams(g, params), v = style || DEFAULT_STYLE
  const st = RENDERERS[v] || (META_BY[v] && CACHE.has(keyOf3(g, p, v)) ? META_BY[v] : styleOf(v))
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
  // rich styles with render workers: the worker loads the style, this thread only paints the cached result
  const slow = !RENDERERS[v] && cost(v) > FRAME_MS && (STYLE_NAMES.includes(v) || LOADERS[v]) && startPool()
  return (slow ? Promise.resolve() : load(v)).then(() => {
    if (cached(g.name, p, v)) return render(g.name, p, v, o)
    if (cost(v) <= FRAME_MS) return loadIcon(g.name).then(() => render(g.name, p, v, o))
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

// ------------------------------------------------------------------ words: a default accessible name
const MONTH_NAMES = { JAN: 'January', FEB: 'February', MAR: 'March', APR: 'April', MAY: 'May', JUN: 'June', JUL: 'July', AUG: 'August', SEP: 'September', OCT: 'October', NOV: 'November', DEC: 'December' }
const DAY_NAMES = { MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday' }
const UNIT_WORDS = { degree: '°', celsius: '°C', fahrenheit: '°F', kelvin: ' K', kt: ' knots', mph: ' mph', kmh: ' km/h', ms: ' m/s', bft: ' Beaufort' }
const CURRENCY_WORDS = { usd: '$', eur: '€', gbp: '£', inr: '₹', jpy: '¥' }
// enums that are the content (the rest are looks: shape, corner, layout...); ints that are settings, not content
const SAID_ENUMS = ['condition', 'tech', 'symbol', 'status']
const QUIET_INTS = ['warnAt', 'points', 'bars', 'marked']
const humanize = v => { const s = String(v).replace(/-/g, ' '); return s.charAt(0).toUpperCase() + s.slice(1) }
/**
 * What a live icon shows, in words: describe('calendar-date', { day: 17, month: 'MAR' }) -> 'Calendar date, March 17'.
 * The element and the React/Vue wrappers use it as the accessible name unless a label is given.
 */
export function describe(name, params) {
  const g = gen(name), ps = g.params || {}, p = resolveParams(g, params), out = []
  const dated = 'day' in ps && ('month' in ps || 'weekday' in ps)
  if (dated) out.push('month' in ps ? `${MONTH_NAMES[p.month] || p.month} ${p.day}` : `${DAY_NAMES[p.weekday] || p.weekday} ${p.day}`)
  for (const [k, s] of Object.entries(ps)) {
    const v = p[k]
    if (dated && (k === 'day' || k === 'month' || k === 'weekday')) continue
    if (s.type === 'int' || s.type === 'number') {
      if (QUIET_INTS.includes(k) || k === 'to') continue
      if (k === 'from' && 'to' in ps) { out.push(`${p.from} to ${p.to}`); continue }
      if ((k === 'max' || k === 'total') && out.length) { out[out.length - 1] += ` of ${v}`; continue }
      let t = String(v)
      if ('unit' in ps && UNIT_WORDS[p.unit] != null) t += UNIT_WORDS[p.unit]
      if ('currency' in ps && CURRENCY_WORDS[p.currency]) t = CURRENCY_WORDS[p.currency] + t
      out.push(t)
    } else if (s.type === 'level') out.push(Math.round(v * 100) + '%')
    else if (s.type === 'time') out.push(v)
    else if (s.type === 'text') { if (v) out.push(v) }
    else if (s.type === 'enum' && (SAID_ENUMS.includes(k) || (k === 'month' && !dated) || (k === 'weekday' && !dated))) out.push(k === 'month' ? MONTH_NAMES[v] || v : k === 'weekday' ? DAY_NAMES[v] || v : humanize(v))
  }
  const said = out.filter(Boolean).slice(0, 3).join(', ')
  return said ? `${g.title || g.name}, ${said}` : String(g.title || g.name)
}

// ------------------------------------------------------------------ motion: transitions between two sets of params
// Numbers roll through every value between (an odometer), levels ease in on a light spring, the hands of an analogue dial
// take the short way round the 12-hour face (a digital clock: round 24 hours), and choices, text and switches swap once,
// on the first frame (painters cross-fade it). Every frame is an ordinary params object and the last one is exactly the
// target, so a transition never draws anything render() would not.
// The frame planner budgets by the style's cost and the frames the page really gets: cheap styles (<= 8 ms a draw) tween
// every frame on this thread; slower ones draw a handful of frames ahead in the render workers, in order, and play them
// back from the cache (no workers: just the final drawing, cross-faded). One shared animation-frame loop paints every
// running transition, newest due frame first, within about 8 ms of work per frame; a new target for the same owner
// retargets from what is on screen. prefers-reduced-motion (or setMotion({ reduced: true })): no frames, the target at once.
const MOTION = { reduced: null, raf: null }
const SYNC_MS = 8, BUDGET_MS = 8, GRACE_MS = 900
export const DEFAULT_MS = 650
/** Motion settings: { reduced: true | false | null (follow prefers-reduced-motion), raf: fn (a requestAnimationFrame stand-in) } */
export function setMotion(o) { for (const k of ['reduced', 'raf']) if (o && has(o, k)) MOTION[k] = o[k] }
/** true when transitions should jump straight to the target */
export function reducedMotion() {
  if (MOTION.reduced != null) return !!MOTION.reduced
  try { return !!(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) } catch (e) { return false }
}
const easeRoll = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const easeSpring = t => t >= 1 ? 1 : 1 - Math.exp(-7 * t) * Math.cos(8 * t)
const EASES = { linear: t => t, out: t => 1 - Math.pow(1 - t, 3), 'in-out': easeRoll, roll: easeRoll, spring: easeSpring }
const KIND_EASE = { number: 'roll', level: 'spring', dial: 'in-out', digits: 'in-out' }
// what kind of motion a param makes
function kindOf(g, k, s) {
  if (s.type === 'int' || s.type === 'number') return 'number'
  if (s.type === 'level') return 'level'
  if (s.type === 'time') return /digital/.test(g.name) || has(g.params, 'format') ? 'digits' : 'dial'
  return 'swap'
}
const toMin = v => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(v)); return m ? (+m[1] % 24) * 60 + +m[2] : 0 }
const toTime = t => { t = ((Math.round(t) % 1440) + 1440) % 1440; return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0') }
// the short way round a face of `span` minutes (720: the 12-hour dial; 1440: a 24-hour display); a tie goes forward
const shortWay = (a, b, span) => { const d = ((((b - a) % span) + span * 1.5) % span) - span / 2; return d === -span / 2 ? span / 2 : d }
function lerp(g, a, b, t, ease) {
  const out = {}
  for (const [k, s] of Object.entries(g.params || {})) {
    const x = a[k], y = b[k]
    if (x === y || t >= 1) { out[k] = y; continue }
    const kind = kindOf(g, k, s)
    if (kind === 'swap') { out[k] = t > 0 ? y : x; continue }
    const e = typeof ease === 'function' ? ease : EASES[ease] || EASES[KIND_EASE[kind]]
    const f = t <= 0 ? 0 : e(t)
    if (kind === 'number') {
      let v = x + (y - x) * f
      if (s.step) v = s.min + Math.round((v - s.min) / s.step) * s.step
      v = s.type === 'int' ? Math.round(v) : Math.round(v * 100) / 100
      out[k] = Math.min(s.max, Math.max(s.min, v))
    } else if (kind === 'level') {
      let v = Math.min(1, Math.max(0, x + (y - x) * f))
      v = s.steps ? Math.round(v * s.steps) / s.steps : Math.round(v * 100) / 100
      out[k] = v
    } else {
      const m = toMin(x)
      out[k] = toTime(m + shortWay(m, toMin(y), kind === 'dial' ? 720 : 1440) * f)
    }
  }
  return out
}
/**
 * The params at time t (0..1) of a transition from `from` to `to`, eased per kind (options.ease: 'linear' | 'out' |
 * 'in-out' | 'roll' | 'spring' | (t) => number overrides that). t >= 1 is exactly `to` (resolved).
 */
export function interpolate(name, from, to, t, options) {
  const g = gen(name)
  return lerp(g, resolveParams(g, from), resolveParams(g, to), Math.min(1, Math.max(0, +t || 0)), options && options.ease)
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
let frameMs = 1000 / 60
function workerSlots() { return pool ? pool.length : workerFactory && !poolDead ? Math.max(1, Math.min(2, ((typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 2) - 1)) : 0 }
/**
 * Plan a transition: { from, to, ms, swap, frames: [{ t, params }] } (deduplicated; the last frame is exactly `to`).
 * options: ms (default 650), ease, frames (force a count).
 */
export function plan(name, from, to, style, options) {
  const g = gen(name), o = options || {}, v = style || DEFAULT_STYLE
  const a = resolveParams(g, from), b = resolveParams(g, to)
  const ms = Math.max(0, o.ms == null || o.ms === '' || isNaN(+o.ms) ? DEFAULT_MS : +o.ms)
  const swap = Object.entries(g.params || {}).some(([k, s]) => kindOf(g, k, s) === 'swap' && a[k] !== b[k])
  let n = o.frames > 0 ? Math.round(o.frames) : 1
  if (!(o.frames > 0) && ms > 0) {
    const ideal = Math.max(1, Math.round(ms / Math.max(1000 / 120, frameMs)))
    if (syncOK(g, v)) n = Math.min(ideal, 90)
    else { const w = workerSlots(); n = w ? Math.max(1, Math.min(12, ideal, Math.floor(ms * w / cost(v) * 0.75))) : 1 }
  }
  const frames = []
  let last = JSON.stringify(a)
  for (let i = 1; i <= n; i++) {
    const t = i / n, p = lerp(g, a, b, t, o.ease), key = JSON.stringify(p)
    if (key !== last) { frames.push({ t, params: p }); last = key }
  }
  if (!frames.length || !same(frames[frames.length - 1].params, b)) frames.push({ t: 1, params: b })
  // easings that settle early (a level's spring, a number's roll) reach the target's exact values before t = 1, and the
  // repeats are dropped above: spread the frames over the whole duration, so the transition takes the ms it was given
  const tEnd = frames[frames.length - 1].t
  if (tEnd > 0 && tEnd < 1) for (const f of frames) f.t = f.t / tEnd
  return { name: g.name, style: v, ms, swap, from: a, to: b, frames, sync: syncOK(g, v) }
}
// the running transitions, painted by one animation-frame loop
const ACTIVE = new Set(), OWNED = new Map()
let ticking = 0, lastTick = 0, turn = 0
const rafOf = () => MOTION.raf || (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : f => setTimeout(() => f(clock()), 16))
function kick() { if (!ticking && ACTIVE.size) { ticking = 1; rafOf()(tick) } }
// a frame can be drawn on this thread inside the budget: cheap for this style and this icon, as measured on this device
function syncOK(g, v) { const r = REAL[g.name + '\u0001' + v]; return (r && r.ms != null ? r.ms : cost(v)) <= SYNC_MS }
// (the last frame draws here too when no worker could: this thread is the only place it can)
function drawable(tr, p, last) {
  const v = tr.pl.style, g = GENS[tr.pl.name]
  if (!g) return false
  return CACHE.has(keyOf3(g, p, v)) || ((tr.pl.sync || (last && !workerSlots())) && !!RENDERERS[v] && typeof g.build === 'function')
}
function tick() {
  ticking = 0
  const now = clock()
  if (lastTick && now - lastTick < 250) frameMs = frameMs * 0.85 + Math.max(1000 / 120, now - lastTick) * 0.15
  lastTick = ACTIVE.size ? now : 0
  const list = [...ACTIVE]
  if (list.length > 1) { const r = turn++ % list.length; list.push(...list.splice(0, r)) }
  let spent = 0, painted = 0
  for (const tr of list) {
    if (!tr.live) continue
    const fr = tr.pl.frames, el = now - tr.start
    let j = -1
    for (let i = fr.length - 1; i > tr.i; i--) if (fr[i].t * tr.pl.ms <= el && drawable(tr, fr[i].params, i === fr.length - 1)) { j = i; break }
    // a frame that took longer than the budget: let the page breathe for as long before this transition paints again
    if (j >= 0 && j < fr.length - 1 && tr.rest > now) j = -1
    if (j >= 0 && (!painted || spent < BUDGET_MS)) {
      const t0 = clock()
      tr.i = j; tr.shown = fr[j].params
      const info = { t: fr[j].t, final: j === fr.length - 1, swap: tr.pl.swap && !tr.swapped, plan: tr.pl }
      tr.swapped = true
      try { if (tr.o.paint) tr.o.paint(fr[j].params, info) } catch (e) { end(tr, false); throw e }
      const took = clock() - t0
      if (took > BUDGET_MS) {
        tr.rest = clock() + took
        // slower than planned (a slow device, a heavy icon): the rest of the frames draw in the workers
        if (tr.pl.sync && j < fr.length - 1 && workerSlots()) {
          tr.pl.sync = false
          tr.warming = { transition: tr }
          warmInOrder(GENS[tr.pl.name], fr.slice(j + 1).map(x => x.params), tr.pl.style, tr.warming)
        }
      }
      spent += took; painted++
    }
    if (tr.i === fr.length - 1 || el > tr.pl.ms + GRACE_MS) end(tr, true)
  }
  kick()
}
function end(tr, completed) {
  if (!tr.live) return
  tr.live = false
  ACTIVE.delete(tr)
  if (tr.o.owner != null && OWNED.get(tr.o.owner) === tr.ctl) OWNED.delete(tr.o.owner)
  if (tr.warming) dropOwner(tr.warming)
  if (!ACTIVE.size) lastTick = 0
  tr.ok(completed)
  if (tr.o.done) tr.o.done(completed)
}
/**
 * Run a transition: paint(params, { t, final, swap, plan }) is called from an animation frame with params that render()
 * draws at once (cached or cheap). done(completed) always runs at the end; the last painted params are the target unless
 * the transition was cancelled or its last frames were still drawing (then draw `to` yourself, e.g. with renderAsync).
 * options: ms, ease, owner (a new transition of the same owner cancels this one), paint, done.
 * Returns { done: Promise<boolean>, cancel(), params (what is on screen now), plan }.
 */
export function transition(name, from, to, style, options) {
  const o = options || {}
  const pl = plan(name, from, to, style, o)
  if (o.owner != null && OWNED.has(o.owner)) OWNED.get(o.owner).cancel()
  let ok
  const tr = { pl, o, i: -1, live: true, swapped: false, shown: pl.from, start: clock(), warming: null }
  const ctl = { done: new Promise(r => { ok = r }), cancel() { end(tr, false) }, get params() { return tr.shown }, plan: pl }
  tr.ok = ok; tr.ctl = ctl
  if (o.owner != null) OWNED.set(o.owner, ctl)
  if (reducedMotion() || pl.ms === 0 || same(pl.from, pl.to)) { tr.shown = pl.to; Promise.resolve().then(() => end(tr, true)); return ctl }
  const g = GENS[pl.name]
  if (!pl.sync && workerSlots()) { tr.warming = { transition: tr }; warmInOrder(g, pl.frames.map(f => f.params), pl.style, tr.warming) }
  ACTIVE.add(tr)
  kick()
  return ctl
}
/** true while any transition is running */
export const animating = () => ACTIVE.size > 0
