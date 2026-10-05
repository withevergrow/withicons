#!/usr/bin/env node
// Validate Live icon generators (forge/DYNAMIC.md). Exit 1 on hard problems.
//
//   node forge/tools/check-dynamic.mjs                       # every public generator (forge/dynamic/*.mjs, no "_")
//   node forge/tools/check-dynamic.mjs calendar-date clock   # just these (underscore test generators allowed by name)
//   node forge/tools/check-dynamic.mjs --all                 # public + _example-* test generators
//   options: --styles a,b (default: every style in forge/styles)   --deep (render the stress params through every style too)
//   RASTER GATE: --gate [--style a,b] [--gen a,b] [--json file] [--sheets [dir]] [--fails] [--code c] [--calibrate]
//                (forge/tools/livegate.mjs, documented in forge/DYNAMIC.md "Quality gate")
//
// Checks: exports + metadata, params schema, examples (3-6, strictly valid), build() pure (frozen params, same
// output twice), deterministic, fast (< 5 ms), never throws on edge params, skeleton shape (plates, closed fills),
// geometry inside [2,22], 0.25 grid, text <= 4 chars, resolveParams({}) == schema defaults, the WRITTEN text (glyph ids)
// matches the params or gen.shows(p) for realistic words and every int value (--deep: every value, every style), a
// count badge leaves >= 45% of its base, then renders the default + every example through EVERY style
// (no throw, no empty output, < 150 ms).
import fs from 'fs'
import path from 'path'
import { performance } from 'perf_hooks'
import { loadStyles, listIcons, readManifest, prepare, renderIcon, nodesToMarkup } from '../lib/load.mjs'
import { parsePath, bbox } from '../kernel/geom.mjs'
import { listGenerators, loadGenerator, schemaErrors, paramErrors, resolveParams, buildSkeleton, stressParams, fileOf, drawnText, drawnCaps, expectedText } from './lib-dynamic.mjs'

const argv = process.argv.slice(2)
const opt = k => { const i = argv.indexOf('--' + k); if (i < 0) return undefined; const v = argv[i + 1]; argv.splice(i, v && !v.startsWith('--') ? 2 : 1); return v && !v.startsWith('--') ? v : true }
const onlyStyles = opt('styles'), all = opt('all'), deep = opt('deep')
// ── raster quality gate (forge/tools/livegate.mjs): --gate, or any of its flags
{
  const g = { gate: opt('gate'), style: opt('style'), gen: opt('gen'), json: opt('json'), sheets: opt('sheets'), calibrate: opt('calibrate'), workers: opt('workers'), warn: opt('warn'), max: opt('max'), quiet: opt('quiet'), fails: opt('fails'), code: opt('code') }
  if (Object.values(g).some(v => v !== undefined)) {
    const { runGate } = await import('./livegate.mjs')
    const list = v => typeof v === 'string' ? v.split(',').filter(Boolean) : undefined
    const st = list(g.style) || list(onlyStyles)
    const gens = list(g.gen) || (argv.length ? argv : undefined)
    const code = await runGate({
      styles: st, gens, json: typeof g.json === 'string' ? g.json : g.json ? '.tmp/livegate/report.json' : undefined,
      sheets: typeof g.sheets === 'string' ? g.sheets : g.sheets ? '.preview' : undefined,
      calibrate: !!g.calibrate, thenGate: !!g.gate, workers: g.workers ? +g.workers : undefined, warn: !!g.warn, max: g.max ? +g.max : undefined,
      list: !g.quiet, progress: true, onlyFails: !!g.fails || !!g.code, code: typeof g.code === 'string' ? g.code : undefined,
    })
    process.exit(code)
  }
}
const names = argv.length ? argv : listGenerators({ private: !!all })
const styles = await loadStyles(onlyStyles ? String(onlyStyles).split(',') : undefined)
const manifest = readManifest()
const CATS = new Set(manifest.categories)
const iconNames = new Set(listIcons())
const problems = [], notes = []
const hard = (n, m) => problems.push(`  ${n}: ${m}`)
const note = (n, m) => notes.push(`  ${n}: ${m}`)
const BUILD_MS = 5, RENDER_MS = 150

const onGrid = d => (String(d).match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || []).every(v => Math.abs(v * 4 - Math.round(v * 4)) < 1e-6)

function checkSkeleton(n, sk, label) {
  const at = m => hard(n, `${label}: ${m}`)
  if (!Array.isArray(sk.paths) || !sk.paths.length) return at('no paths')
  for (const p of sk.paths) {
    if (!p || typeof p.d !== 'string' || !p.d.trim()) { at('a path without d'); continue }
    if (!['K', 'A', 'S'].includes(p.plate)) at(`bad plate "${p.plate}"`)
    if (!onGrid(p.d)) at(`path off the 0.25 grid: ${p.d.slice(0, 60)}`)
  }
  let pts = []
  try {
    for (const p of sk.paths) for (const s of parsePath(p.d)) pts.push(...s.pts)
    for (const d of sk.fills) {
      const subs = parsePath(d)
      if (subs.some(s => !s.closed)) at('a fill subpath is not closed (end it with Z)')
      for (const s of subs) pts.push(...s.pts)
    }
    for (const d of sk.cutouts) parsePath(d)
  } catch (e) { return at('PARSE ' + e.message) }
  if (!pts.length) return at('no geometry')
  const b = bbox(pts), E = 1e-6
  if (b.x0 < 2 - E || b.y0 < 2 - E || b.x1 > 22 + E || b.y1 > 22 + E) at(`geometry outside [2,22]: ${[b.x0, b.y0, b.x1, b.y1].map(v => v.toFixed(2)).join(',')}`)
  if (b.w < 6 && b.h < 6) at('geometry suspiciously small')
  if (!sk.fills.length) note(n, `${label}: no fills (solid/duo/engrave look empty)`)
}

// ── text checks ───────────────────────────────────────────────────────────────────────────────────────────
// Realistic words must be written whole (a label may shrink to cap 4 and tighten, open its frame, or drop a
// currency sign only when the generator's shows() says so). Fill-the-box extremes ("WWWW") may be shortened,
// never blanked. Every int / number value that is written must keep all of its digits.
const WORDS = ['A', '7', 'OK', 'HI', 'JD', '#1', '5G', 'NEW', 'DUE', 'PDF', 'VIP', 'WOW', 'LOL', '€99', '$99', '888', 'SALE', 'GIFT', 'BETA', 'DOCX', '2025', '-50%', '100%', 'CAFÉ']
const EXTREMES = n => ['W'.repeat(n), 'M'.repeat(n), '8'.repeat(n)]
const MAX_SWEEP = 400
const sweepValues = s => {
  const lo = Math.ceil(s.min), hi = Math.floor(s.max), step = s.type === 'number' ? (s.step || 1) : 1
  const count = Math.floor((hi - lo) / step) + 1
  const stride = deep || count <= MAX_SWEEP ? 1 : Math.ceil(count / MAX_SWEEP)
  const out = []
  for (let i = 0; i < count; i += stride) out.push(+(lo + i * step).toFixed(6))
  if (out.at(-1) !== s.max) out.push(s.max)
  return out
}
const fmt = v => typeof v === 'number' ? String(Math.abs(v)) : String(v)
function checkText(n, gen, sets) {
  const build = p => { try { const rp = resolveParams(gen, p); return { rp, sk: buildSkeleton(gen, rp) } } catch { return null } }
  const ok = (rp, d, want) => { const ex = expectedText(gen, rp); return ex ? ex.includes(d) : d.includes(want) }
  const bases = sets.map(s => resolveParams(gen, s.p))
  // declared output: every default / example / edge set must draw what shows() says
  if (typeof gen.shows === 'function') {
    for (const p of [...bases, ...stressParams(gen)]) {
      const b = build(p); if (!b) continue
      const d = drawnText(b.sk), ex = expectedText(gen, b.rp)
      if (!ex.includes(d)) hard(n, `${JSON.stringify(b.rp)} draws "${d}", shows() says ${JSON.stringify(ex.length > 1 ? ex : ex[0])}`)
    }
  }
  for (const [k, s] of Object.entries(gen.params || {})) {
    if (!['text', 'int', 'number'].includes(s.type)) continue
    // the context: the first of default / examples that writes this param's value
    // (and whose text changes when the param does: gauge-value's "max" is never written even when it equals the value)
    const probe = p => s.type === 'text' ? (p[k] === 'OK' ? 'NO' : 'OK') : p[k] === s.max ? s.min : s.max
    const ctx = bases.find(p => {
      const b = build(p), v = s.type === 'text' ? String(p[k]).replace(/ /g, '') : fmt(p[k])
      if (!b || !v || !drawnText(b.sk).includes(v)) return false
      const c = build({ ...p, [k]: probe(p) })
      return c && drawnText(c.sk) !== drawnText(b.sk)
    })
    if (!ctx) continue
    if (s.type === 'text') {
      const max = s.maxLength || 4
      for (const w of WORDS) {
        if ([...w].length > max) continue
        const b = build({ ...ctx, [k]: w }); if (!b) continue
        const want = String(b.rp[k]).replace(/ /g, ''), d = drawnText(b.sk)
        if (!want) continue
        if (!ok(b.rp, d, want)) hard(n, `${k}="${w}" draws "${d}" (expected "${want}")`)
        const caps = drawnCaps(b.sk)
        if (caps.length && Math.min(...caps) < 4 - 1e-9 && !gen.smallText) note(n, `${k}="${w}" is set at cap ${Math.min(...caps)} (< 4)`)
      }
      for (const w of EXTREMES(max)) {
        const b = build({ ...ctx, [k]: w }); if (!b) continue
        const want = String(b.rp[k]), d = drawnText(b.sk)
        if (!d) hard(n, `${k}="${w}" draws nothing (shorten it, never blank it)`)
        else if (!d.includes(want)) note(n, `${k}="${w}" is shortened to "${d}" (no legible fit)`)
      }
    } else {
      const bad = []
      for (const v of sweepValues(s)) {
        const b = build({ ...ctx, [k]: v }); if (!b) continue
        const d = drawnText(b.sk)
        if (!ok(b.rp, d, fmt(b.rp[k]))) bad.push(`${v}->"${d}"`)
      }
      if (bad.length) hard(n, `${k}: ${bad.length} value(s) do not draw their text: ${bad.slice(0, 8).join(' ')}${bad.length > 8 ? ' ...' : ''}`)
    }
  }
}

for (const n of names) {
  if (!fs.existsSync(fileOf(n))) { hard(n, 'MISSING FILE forge/dynamic/' + n + '.mjs'); continue }
  let gen
  try { gen = await loadGenerator(n) } catch (e) { hard(n, 'IMPORT ' + e.message.split('\n')[0]); continue }
  // ── metadata
  const base = n.replace(/^_/, '')
  if (gen.name !== base) hard(n, `name "${gen.name}" != filename "${base}"`)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(gen.name || '')) hard(n, 'name not kebab-case')
  if (!n.startsWith('_') && iconNames.has(gen.name)) hard(n, `name collides with static icon "${gen.name}"`)
  if (!gen.title || typeof gen.title !== 'string') hard(n, 'needs a title')
  if (!gen.description || gen.description.length < 12) hard(n, 'needs a description')
  if (!CATS.has(gen.category)) note(n, `category "${gen.category}" is not in forge/manifest.json categories`)
  if (!Array.isArray(gen.aliases) || gen.aliases.length < 3 || gen.aliases.length > 15) hard(n, 'need 3-15 aliases')
  for (const a of gen.aliases || []) if (iconNames.has(a)) hard(n, `alias "${a}" equals a static icon name`)
  if (!Array.isArray(gen.tags) || gen.tags.length < 2) hard(n, 'need >= 2 tags')
  if (gen.synonyms !== undefined && !Array.isArray(gen.synonyms)) hard(n, 'synonyms must be an array')
  { const low = [...(gen.aliases || []), ...(gen.synonyms || [])].map(a => String(a).toLowerCase().trim())
    if (new Set(low).size !== low.length) hard(n, 'duplicate alias/synonym') }
  if (typeof gen.build !== 'function') { hard(n, 'no build(params) function'); continue }
  if (!gen.build.__live) hard(n, "export default live({...}) (forge/dynamic/_font.mjs): style renderers need the text tags")
  // ── params schema
  for (const e of schemaErrors(gen)) hard(n, e)
  // ── examples
  const ex = gen.examples
  if (!Array.isArray(ex) || ex.length < 3 || ex.length > 6) hard(n, 'need 3-6 examples')
  ;(ex || []).forEach((p, i) => { for (const e of paramErrors(gen, p)) hard(n, `example ${i}: ${e}`) })
  // ── build: pure, deterministic, fast, never throws on edge params, geometry
  const sets = [{ label: 'default', p: {} }, ...(ex || []).map((p, i) => ({ label: `example ${i}`, p }))]
  const stress = stressParams(gen).map((p, i) => ({ label: `edge ${JSON.stringify(p)}`, p }))
  const skel = []
  for (const s of [...sets, ...stress]) {
    let a, b
    try {
      const frozen = Object.freeze(resolveParams(gen, s.p))
      const before = JSON.stringify(frozen)
      a = buildSkeleton(gen, frozen); b = buildSkeleton(gen, frozen)
      if (JSON.stringify(frozen) !== before) hard(n, `${s.label}: build mutated params`)
    } catch (e) { hard(n, `${s.label}: build THREW ${String(e.message).split('\n')[0]}`); continue }
    if (JSON.stringify(a) !== JSON.stringify(b)) hard(n, `${s.label}: build is not deterministic`)
    checkSkeleton(n, a, s.label)
    skel.push({ ...s, sk: a })
  }
  { // timing on the default + examples
    const ps = sets.map(s => Object.freeze(resolveParams(gen, s.p)))
    try {
      for (const p of ps) gen.build(p) // warm
      const N = 20, t0 = performance.now()
      for (let k = 0; k < N; k++) for (const p of ps) gen.build(p)
      const ms = (performance.now() - t0) / (N * ps.length)
      if (ms > BUILD_MS) hard(n, `build() averages ${ms.toFixed(2)} ms (limit ${BUILD_MS})`)
    } catch { /* already reported */ }
  }
  // ── resolveParams: omitted params resolve to the schema defaults (what users get with no attributes)
  {
    const defs = Object.fromEntries(Object.entries(gen.params || {}).map(([k, s]) => [k, s.default]))
    if (JSON.stringify(resolveParams(gen, {})) !== JSON.stringify(defs)) hard(n, `resolveParams({}) ${JSON.stringify(resolveParams(gen, {}))} != schema defaults ${JSON.stringify(defs)}`)
    const blank = Object.fromEntries(Object.entries(gen.params || {}).map(([k, s]) => [k, s.type === 'bool' ? undefined : s.type === 'text' ? null : '']))
    if (JSON.stringify(resolveParams(gen, blank)) !== JSON.stringify(defs)) hard(n, `empty values ('' / null) do not resolve to the defaults: ${JSON.stringify(resolveParams(gen, blank))}`)
  }
  // ── text: what the icon WRITES must be what the params ask for (or what gen.shows(p) declares). Catches a
  // reading that silently draws nothing, "NEW" drawn as "NE", a unit that never shows.
  checkText(n, gen, sets)
  // ── count icons: the base must stay recognisable next to the badge
  if (typeof gen.kept === 'function') {
    for (const count of [1, 7, 42, 88, 128, 5000]) for (const corner of ['top-right', 'bottom-right']) for (const limit of ['99+', '9+']) {
      const p = resolveParams(gen, { count, corner, limit }), r = gen.kept(p)
      if (!(r >= 0.45)) hard(n, `count ${count} ${corner} limit ${limit}: the badge leaves only ${(100 * r).toFixed(0)}% of the base (min 45%)`)
      else if (r < 0.55) note(n, `count ${count} ${corner} limit ${limit}: the badge leaves ${(100 * r).toFixed(0)}% of the base`)
    }
  }
  // ── render through every style
  const toRender = deep ? skel : skel.slice(0, sets.length)
  for (const s of toRender) {
    let icon
    try { icon = prepare(s.sk) } catch (e) { hard(n, `${s.label}: prepare THREW ${e.message}`); continue }
    for (const [sn, st] of Object.entries(styles)) {
      try {
        const t0 = performance.now()
        const nodes = renderIcon(st, icon)
        const ms = performance.now() - t0
        if (!nodes.length) hard(n, `${s.label}: style ${sn} rendered nothing`)
        else if (ms > RENDER_MS) note(n, `${s.label}: style ${sn} took ${ms.toFixed(0)} ms`)
        const kb = nodesToMarkup(nodes).length / 1024
        if (kb > 14) note(n, `${s.label}: style ${sn} output ${kb.toFixed(1)} KB`)
      } catch (e) { hard(n, `${s.label}: style ${sn} THREW ${String(e.message).split('\n')[0]}`) }
    }
  }
}
console.log(`checked ${names.length} generator(s) against ${Object.keys(styles).length} style(s): ${problems.length} problem(s), ${notes.length} note(s)`)
problems.forEach(p => console.log(p))
if (notes.length) { console.log('notes:'); notes.slice(0, 60).forEach(p => console.log(p)) }
process.exitCode = problems.length ? 1 : 0
