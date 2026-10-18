#!/usr/bin/env node
// Validate loader specs and morph presets (forge/LOADERS.md): metadata, names and aliases, parts, motion keys, every
// style compiles, determinism (the second compile starts from empty caches), size.
//   node forge/tools/check-loaders.mjs [names] [--styles line,glass] [--quiet]
// Exit 1 on errors. Errors include an alias that equals an icon name or another loader's name / alias, and a morph
// preset item that is not a library icon. A loader NAME may equal an icon name (morph items are icons unless written
// "loader:<name>", so nothing is ambiguous). Warnings: big files, a cycle that does not end where it starts.
// Compiling runs in worker threads, a few styles each (every loader x style is compiled twice).
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import { fileURLToPath, pathToFileURL } from 'url'
import { loadStyles, ROOT } from '../lib/load.mjs'
import { STYLE_ORDER } from '../lib/emit-core.mjs'
import { listLoaders, loadLoader, loadMorphs, compile, resetCaches, GROUPS, LOADER_DIR } from '../lib/loader-compile.mjs'

// ---- worker: compile the listed specs in a few styles, twice each (the second from empty caches)
if (!isMainThread && workerData && workerData.kind === 'check-loaders') {
  const styles = await loadStyles(workerData.styles)
  const specs = []
  for (const n of listLoaders()) if (workerData.names.includes(n)) { try { specs.push(await loadLoader(n)) } catch { /* reported by main */ } }
  try { specs.push(...(await loadMorphs()).filter(sp => workerData.names.includes(sp.name))) } catch { /* reported by main */ }
  for (const s of workerData.styles) for (const sp of specs) {
    const r = { name: sp.name, style: s }
    try {
      if (!styles[s]) throw new Error('style not found')
      const a = compile(sp, styles[s])
      resetCaches()   // the second compile draws every part and chrome probe again: a cached drawing proves nothing
      const b = compile(sp, styles[s])
      r.bytes = a.bytes; r.same = a.svg === b.svg
    } catch (e) { r.error = e.message }
    parentPort.postMessage(r)
  }
  parentPort.postMessage({ done: true })
}
if (isMainThread) await main()

async function main() {

const args = process.argv.slice(2)
const opt = k => { const i = args.indexOf('--' + k); return i < 0 ? null : args[i + 1] }
const quiet = args.includes('--quiet')
const names = args.filter((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--styles')))
const styleNames = (opt('styles') ? opt('styles').split(',') : STYLE_ORDER).filter(s => fs.existsSync(path.join(ROOT, 'forge', 'styles', s + '.mjs')))
const icons = new Set(fs.readdirSync(path.join(ROOT, 'forge', 'icons')).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')))
const { EFFECTS } = await import(pathToFileURL(path.join(ROOT, 'packages', 'loaders', 'src', 'effects.js')).href)
const MAX_BYTES = 48 * 1024, WARN_BYTES = 24 * 1024
const MORPH_MAX_BYTES = 64 * 1024          // a morph preset holds 3-4 whole icons (forge/LOADERS.md rule 6)
let errors = 0, warnings = 0
const err = (n, m) => { errors++; console.log(`  x ${n}: ${m}`) }
const warn = (n, m) => { warnings++; if (!quiet) console.log(`  ! ${n}: ${m}`) }
const t0 = Date.now()

// ---- every spec (loaders + morph presets), so names and aliases are checked across the whole set
const specs = []
for (const n of listLoaders()) { try { specs.push(await loadLoader(n)) } catch (e) { if (!names.length || names.includes(n)) err(n, e.message) } }
let presets = []
try {
  presets = (await import(pathToFileURL(path.join(LOADER_DIR, '_morphs.mjs')).href)).default
  specs.push(...await loadMorphs())
} catch (e) { err('_morphs', e.message) }
const owner = new Map()   // name or alias -> loader that has it
for (const sp of specs) {
  for (const a of [sp.name, ...sp.aliases]) {
    if (owner.has(a) && owner.get(a) !== sp.name) err(sp.name, `"${a}" is also ${a === owner.get(a) ? 'the name' : 'an alias'} of ${owner.get(a)}`)
    else if (!owner.has(a)) owner.set(a, sp.name)
  }
  for (const a of sp.aliases) if (icons.has(a)) err(sp.name, `alias "${a}" is an icon name (aliases may not equal an icon name)`)
  if (new Set(sp.aliases).size !== sp.aliases.length) err(sp.name, 'duplicate alias')
  if (sp.aliases.includes(sp.name)) err(sp.name, 'an alias equals the name')
}
// ---- morph presets: chains of library icons
for (const m of presets) {
  const n = m.name || '(no name)'
  if (names.length && !names.includes(n)) continue
  if (!/^morph-[a-z0-9-]+$/.test(n)) err(n, 'a morph preset name is "morph-<kebab-case>"')
  if (!m.title) err(n, 'needs a title')
  if (!m.intent || m.intent.length > 80) err(n, 'needs an intent (<= 80 chars)')
  if (!Array.isArray(m.aliases) || m.aliases.length < 3) err(n, 'needs >= 3 aliases')
  if (!EFFECTS[m.effect]) err(n, `effect "${m.effect}" is not one of ${Object.keys(EFFECTS).join(' ')}`)
  if (!Array.isArray(m.icons) || m.icons.length < 2 || m.icons.length > 8) err(n, 'needs 2..8 icons')
  for (const i of m.icons || []) if (!icons.has(i)) err(n, `"${i}" is not a library icon (forge/icons/${i}.json)`)
  if (!(m.hold >= 0.5 && m.hold <= 3)) err(n, `hold ${m.hold} s: must be 0.5..3 s per icon`)
}

const list = names.length ? specs.filter(sp => names.includes(sp.name)) : specs
for (const n of names) if (!specs.some(sp => sp.name === n) && !listLoaders().includes(n)) err(n, 'no such loader or morph preset')

// ---- compile every listed spec in every style (workers), results by loader
const results = new Map(list.map(sp => [sp.name, []]))
{
  const n = Math.max(1, Math.min(styleNames.length, (os.availableParallelism ? os.availableParallelism() : os.cpus().length) - 1, 8))
  const buckets = Array.from({ length: n }, () => [])
  styleNames.forEach((s, i) => buckets[i % n].push(s))
  const listNames = list.map(sp => sp.name)
  await Promise.all(buckets.filter(b => b.length).map(b => new Promise((ok, bad) => {
    const w = new Worker(fileURLToPath(import.meta.url), { workerData: { kind: 'check-loaders', styles: b, names: listNames } })
    w.on('message', m => { if (m.done) { w.terminate(); ok() } else results.get(m.name).push(m) })
    w.on('error', bad)
  })))
}

for (const sp of list) {
  const name = sp.name, isMorph = sp.group === 'morph'
  if (!isMorph && sp.file !== name) err(name, `name "${sp.name}" must equal the file name (${sp.file}.mjs)`)
  if (!/^[a-z][a-z0-9-]*$/.test(sp.name || '')) err(name, 'name must be kebab-case')
  if (!sp.title) err(name, 'needs a title')
  if (!GROUPS.includes(sp.group)) err(name, `group must be one of ${GROUPS.join(' ')}`)
  if (!isMorph && sp.group === 'morph') err(name, 'group "morph" is for the presets in forge/loaders/_morphs.mjs')
  if (!sp.description || sp.description.length > 160) err(name, 'needs a description (<= 160 chars)')
  if (!sp.intent || sp.intent.length > 80) err(name, 'needs an intent (<= 80 chars)')
  if (sp.aliases.length < 3) err(name, 'needs >= 3 aliases')
  if (!(sp.duration >= 0.6 && sp.duration <= 8)) err(name, `duration ${sp.duration} s: must be 0.6..8 s`)
  if (sp.parts.length > 24) err(name, `${sp.parts.length} parts: at most 24 (use copies)`)
  for (const i of sp.morph) if (!icons.has(i)) err(name, `morph: "${i}" is not a library icon`)
  for (const p of sp.parts) if (p.motion && !isMorph) {
    const k = p.motion.keys
    const a = k[0][1], b = k[k.length - 1][1]
    const jump = ['x', 'y', 'sx', 'sy', 'o'].some(q => Math.abs(a[q] - b[q]) > 1e-6) || Math.abs(((a.r - b.r) % 360 + 360) % 360) > 1e-6 && Math.abs(((a.r - b.r) % 360 + 360) % 360 - 360) > 1e-6
    if (jump && !(a.o < 0.01 && b.o < 0.01)) warn(name, `part ${p.i}: the cycle does not end where it starts (a visible jump each loop)`)
  }
  const cap = isMorph ? MORPH_MAX_BYTES : MAX_BYTES
  let worst = 0, worstStyle = ''
  const got = new Map(results.get(name).map(r => [r.style, r]))
  for (const s of styleNames) {
    const r = got.get(s)
    if (!r) { err(name, `${s}: not compiled`); continue }
    if (r.error) { err(name, `${s}: ${r.error}`); continue }
    if (!r.same) err(name, `${s}: two compiles differ (non-deterministic)`)
    if (r.bytes > worst) { worst = r.bytes; worstStyle = s }
    if (r.bytes > cap) err(name, `${s}: ${(r.bytes / 1024).toFixed(1)} KB > ${cap / 1024} KB`)
  }
  if (!isMorph && worst > WARN_BYTES) warn(name, `largest ${(worst / 1024).toFixed(1)} KB (${worstStyle})`)
  if (!quiet) console.log(`ok ${name.padEnd(18)} ${sp.group.padEnd(9)} ${sp.parts.length} parts  ${Math.round(sp.duration * 100) / 100}s  max ${(worst / 1024).toFixed(1)} KB (${worstStyle})`)
}
const nl = list.filter(sp => sp.group !== 'morph').length
console.log(`${nl} loaders + ${list.length - nl} morph presets x ${styleNames.length} styles: ${errors} errors, ${warnings} warnings (${((Date.now() - t0) / 1000).toFixed(1)}s)`)
process.exit(errors ? 1 : 0)
}
