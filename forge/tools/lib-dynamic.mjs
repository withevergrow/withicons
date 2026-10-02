// Shared loader for Live icons (forge/DYNAMIC.md): list generators, validate + resolve params,
// build a skeleton for params, prepare() it and render it through any style.
//
//   import { listGenerators, loadGenerator, resolveParams, buildSkeleton, prepareLive, renderLive, liveSvg } from './lib-dynamic.mjs'
//   const gen = await loadGenerator('calendar-date')           // or '_example-calendar' (underscore = test, not shipped)
//   const p = resolveParams(gen, { day: 9 })                   // defaults filled, clamped, text cleaned
//   const nodes = renderLive(styles.line, gen, p)              // IconNode array, like renderIcon()
//   const svg = liveSvg(styles.line, gen, p)                   // standalone <svg>
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { ROOT, prepare, renderIcon, toSvg } from '../lib/load.mjs'
import { clean as cleanText, coverage } from '../dynamic/_font.mjs'

export const DYN_DIR = path.join(ROOT, 'forge', 'dynamic')
export const PARAM_TYPES = ['int', 'number', 'level', 'time', 'enum', 'text', 'bool']

// public generators: forge/dynamic/*.mjs not starting with "_". { private: true } adds _example-* test generators.
export function listGenerators({ private: priv = false } = {}) {
  if (!fs.existsSync(DYN_DIR)) return []
  return fs.readdirSync(DYN_DIR).filter(f => f.endsWith('.mjs'))
    .filter(f => !f.startsWith('_') || (priv && f.startsWith('_example-')))
    .map(f => f.slice(0, -4)).sort()
}
export const fileOf = name => path.join(DYN_DIR, `${name}.mjs`)
const mods = new Map()
export async function loadGenerator(name) {
  if (mods.has(name)) return mods.get(name)
  const file = fileOf(name)
  if (!fs.existsSync(file)) throw new Error(`no generator forge/dynamic/${name}.mjs`)
  const mod = await import(pathToFileURL(file).href)
  const gen = mod.default
  if (!gen || typeof gen !== 'object') throw new Error(`forge/dynamic/${name}.mjs has no default export object`)
  Object.defineProperty(gen, '__file', { value: name, enumerable: false })
  mods.set(name, gen)
  return gen
}
export async function loadGenerators(names, opts) {
  const out = {}
  for (const n of names || listGenerators(opts)) out[n] = await loadGenerator(n)
  return out
}

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/
const isNum = v => typeof v === 'number' && Number.isFinite(v)

// Problems with a generator's params SCHEMA (not values). Returns [string].
export function schemaErrors(gen) {
  const errs = []
  const ps = gen.params
  if (!ps || typeof ps !== 'object' || Array.isArray(ps)) return ['params must be an object']
  for (const [k, s] of Object.entries(ps)) {
    const at = m => errs.push(`param "${k}": ${m}`)
    if (!/^[a-z][a-zA-Z0-9]*$/.test(k)) at('name must be camelCase ascii')
    if (!s || !PARAM_TYPES.includes(s.type)) { at(`type must be one of ${PARAM_TYPES.join(' ')}`); continue }
    if (!s.label || typeof s.label !== 'string') at('needs a plain-language label')
    if (s.type === 'int' || s.type === 'number') {
      if (!isNum(s.min) || !isNum(s.max) || s.min > s.max) at('needs numeric min <= max')
      if (s.type === 'number' && !isNum(s.step)) at('number needs a step')
      if (s.step !== undefined && !(isNum(s.step) && s.step > 0)) at('step must be > 0')
      if (s.type === 'int' && (!Number.isInteger(s.min) || !Number.isInteger(s.max))) at('int min/max must be integers')
      const longest = Math.max(String(s.min).length, String(s.max).length)
      if (longest > 4) at(`values up to ${longest} characters: text is at most 4`)
    }
    if (s.type === 'level' && s.steps !== undefined && !(Number.isInteger(s.steps) && s.steps >= 1)) at('steps must be an integer >= 1')
    if (s.type === 'enum') {
      if (!Array.isArray(s.options) || s.options.length < 2) at('enum needs >= 2 options')
      else if (new Set(s.options).size !== s.options.length) at('duplicate enum options')
    }
    if (s.type === 'text') {
      if (!Number.isInteger(s.maxLength) || s.maxLength < 1 || s.maxLength > 4) at('text maxLength must be 1..4')
      if (s.case !== undefined && s.case !== 'upper') at("case must be 'upper'")
    }
    const v = valueErrors(s, s.default)
    if (v) at(`default ${JSON.stringify(s.default)}: ${v}`)
  }
  return errs
}

// why `v` is not a valid value for param schema `s` (strict), or '' if fine
export function valueErrors(s, v) {
  switch (s.type) {
    case 'int': return !Number.isInteger(v) ? 'not an integer' : (v < s.min || v > s.max) ? `outside ${s.min}..${s.max}` : ''
    case 'number': return !isNum(v) ? 'not a number' : (v < s.min || v > s.max) ? `outside ${s.min}..${s.max}` : ''
    case 'level': return !isNum(v) ? 'not a number' : (v < 0 || v > 1) ? 'outside 0..1' : ''
    case 'time': return typeof v === 'string' && TIME.test(v) ? '' : 'not "HH:MM" (00:00-23:59)'
    case 'enum': return (s.options || []).includes(v) ? '' : `not one of ${(s.options || []).join(', ')}`
    case 'text': {
      if (typeof v !== 'string') return 'not a string'
      if ([...v].length > (s.maxLength || 4)) return `longer than ${s.maxLength}`
      const c = coverage(v); return c.ok ? '' : `characters not in the font: ${c.missing.join('')}`
    }
    case 'bool': return typeof v === 'boolean' ? '' : 'not a boolean'
    default: return 'unknown type'
  }
}

// strict validation of a params object: [string]
export function paramErrors(gen, p) {
  const errs = []
  for (const k of Object.keys(p || {})) if (!gen.params?.[k]) errs.push(`unknown param "${k}"`)
  for (const [k, s] of Object.entries(gen.params || {})) {
    if (p && k in p) { const e = valueErrors(s, p[k]); if (e) errs.push(`${k}=${JSON.stringify(p[k])}: ${e}`) }
  }
  return errs
}

// lenient: defaults filled, numbers coerced/clamped/stepped, text upper-cased + cleaned + clipped,
// unknown keys dropped. Never throws. This is what runtimes do with user input: it is the SAME logic as
// packages/dynamic/src/core.js resolveParams (keep the two in step), so check-dynamic and preview-dynamic test
// exactly the defaults users get. Empty / null / boolean input for a number means "use the default" (never 0).
const has = (o, k) => o != null && Object.prototype.hasOwnProperty.call(o, k)
export function resolveParams(gen, p = {}) {
  const out = {}
  for (const [k, s] of Object.entries(gen.params || {})) {
    let v = has(p, k) ? p[k] : undefined
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

// the raw skeleton (forge/CONTRACT.md format) for params; params are resolved first and frozen
export function buildSkeleton(gen, params = {}) {
  const p = Object.freeze(resolveParams(gen, params))
  const sk = gen.build(p) || {}
  const paths = (sk.paths || []).map(x => typeof x === 'string' ? { d: x, plate: 'A' } : x).filter(x => x && x.d)
  return {
    name: gen.name, category: gen.category, description: gen.description,
    aliases: gen.aliases || [], tags: gen.tags || [],
    paths, fills: (sk.fills || []).filter(Boolean), cutouts: (sk.cutouts || []).filter(Boolean),
    params: p,
  }
}
export const prepareLive = (gen, params) => prepare(buildSkeleton(gen, params))
export const renderLive = (style, gen, params) => renderIcon(style, prepareLive(gen, params))
export const liveSvg = (style, gen, params, extra) => toSvg(style, renderLive(style, gen, params), extra)

// a short human label for a params object (previews)
export const paramLabel = p => Object.values(p).map(v => typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(2).replace(/0+$/, '') : String(v)).join(' ')

// extreme / edge params for stress tests: every param at its corners, others at defaults
export function stressParams(gen) {
  const base = resolveParams(gen, {})
  const out = [base]
  for (const [k, s] of Object.entries(gen.params || {})) {
    const vs = []
    if (s.type === 'int' || s.type === 'number') vs.push(s.min, s.max, (s.min + s.max) / 2)
    if (s.type === 'level') vs.push(0, 0.01, 0.5, 0.99, 1)
    if (s.type === 'time') vs.push('00:00', '03:15', '06:30', '09:45', '12:00', '23:59')
    if (s.type === 'enum') vs.push(...(s.options || []))
    if (s.type === 'bool') vs.push(true, false)
    if (s.type === 'text') {
      const n = s.maxLength || 4
      vs.push('', 'I', 'W'.repeat(n), 'M'.repeat(n), '8'.repeat(n), '%'.repeat(n), '-50%'.slice(0, n), '#&?$'.slice(0, n))
    }
    for (const v of vs) out.push(resolveParams(gen, { ...base, [k]: v }))
  }
  // all params at max/min together
  const hi = {}, lo = {}
  for (const [k, s] of Object.entries(gen.params || {})) {
    if (s.type === 'int' || s.type === 'number') { hi[k] = s.max; lo[k] = s.min }
    if (s.type === 'level') { hi[k] = 1; lo[k] = 0 }
    if (s.type === 'text') { hi[k] = 'W'.repeat(s.maxLength || 4); lo[k] = 'I' }
  }
  out.push(resolveParams(gen, hi), resolveParams(gen, lo))
  const seen = new Set()
  return out.filter(p => { const j = JSON.stringify(p); if (seen.has(j)) return false; seen.add(j); return true })
}

// the text a skeleton actually draws: the characters of its glyph paths (ids "text:<char>:<cap>:<n>", set by
// live() in forge/dynamic/_font.mjs), in path order. check-dynamic compares it with what the params ask for.
export const drawnText = sk => (sk.paths || []).filter(p => p && typeof p.id === 'string' && p.id.startsWith('text:')).map(p => [...p.id.slice(5)][0]).join('')
export const drawnCaps = sk => (sk.paths || []).filter(p => p && typeof p.id === 'string' && p.id.startsWith('text:')).map(p => +p.id.slice(5).split(':').at(-2))
// what a generator says it writes for params: gen.shows(p) -> string | [acceptable strings]; undefined when the
// generator does not declare it
export const expectedText = (gen, p) => typeof gen.shows === 'function' ? [].concat(gen.shows(p)).map(s => String(s ?? '').replace(/ /g, '')) : undefined

// Plain-language warnings for params whose text is not drawn as typed: [{ param, typed, shown, message }].
// A runtime `validate()` / live page shows these under the input ("shown as NE"). Text params compare with what
// the glyphs spell (accents folded, case ignored); a generator's shows(p) is the reference for numbers.
export function textWarnings(gen, params = {}) {
  const p = resolveParams(gen, params), sk = buildSkeleton(gen, p), d = drawnText(sk), out = []
  for (const [k, s] of Object.entries(gen.params || {})) {
    if (s.type !== 'text') continue
    const typed = params?.[k] == null ? '' : String(params[k]), want = String(p[k] ?? '').replace(/ /g, '')
    if (typed && [...cleanText(typed, 99)].length > [...want].length) out.push({ param: k, typed, shown: want, message: `${k}: only ${s.maxLength || 4} characters fit, shown as ${want}` })
    else if (want && !d.includes(want)) {
      const shown = [...want].filter((c, i) => d.includes(want.slice(0, i + 1))).join('')
      out.push({ param: k, typed, shown, message: shown ? `${k}: too wide to read at small sizes, shown as ${shown}` : `${k}: cannot be drawn legibly here` })
    }
  }
  const ex = expectedText(gen, p)
  if (ex && !ex.includes(d)) out.push({ param: null, typed: '', shown: d, message: `shown as ${d || 'no text'} (expected ${ex[0]})` })
  return out
}
