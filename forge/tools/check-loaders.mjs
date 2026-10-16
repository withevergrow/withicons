#!/usr/bin/env node
// Validate loader specs (forge/LOADERS.md): metadata, parts, motion keys, every style compiles, determinism, size.
//   node forge/tools/check-loaders.mjs [names] [--styles line,glass] [--quiet]
// Exit 1 on errors. Warnings: big files, long cycles, names that clash with icons.
import fs from 'fs'
import path from 'path'
import { loadStyles, ROOT } from '../lib/load.mjs'
import { STYLE_ORDER } from '../lib/emit-core.mjs'
import { listLoaders, loadLoader, compile, GROUPS } from '../lib/loader-compile.mjs'

const args = process.argv.slice(2)
const opt = k => { const i = args.indexOf('--' + k); return i < 0 ? null : args[i + 1] }
const quiet = args.includes('--quiet')
const names = args.filter((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--styles')))
const styles = await loadStyles()
const styleNames = (opt('styles') ? opt('styles').split(',') : STYLE_ORDER).filter(s => styles[s])
const icons = new Set(fs.readdirSync(path.join(ROOT, 'forge', 'icons')).map(f => f.replace(/\.json$/, '')))
const MAX_BYTES = 48 * 1024, WARN_BYTES = 24 * 1024
let errors = 0, warnings = 0
const err = (n, m) => { errors++; console.log(`  x ${n}: ${m}`) }
const warn = (n, m) => { warnings++; if (!quiet) console.log(`  ! ${n}: ${m}`) }
const all = listLoaders()
const list = names.length ? names : all
const seen = new Map()
const t0 = Date.now()
for (const name of list) {
  let sp
  try { sp = await loadLoader(name) } catch (e) { err(name, e.message); continue }
  if (sp.name !== name) err(name, `name "${sp.name}" must equal the file name`)
  if (!/^[a-z][a-z0-9-]*$/.test(sp.name || '')) err(name, 'name must be kebab-case')
  if (!sp.title) err(name, 'needs a title')
  if (!GROUPS.includes(sp.group)) err(name, `group must be one of ${GROUPS.join(' ')}`)
  if (!sp.description || sp.description.length > 160) err(name, 'needs a description (<= 160 chars)')
  if (!sp.intent || sp.intent.length > 80) err(name, 'needs an intent (<= 80 chars)')
  if (sp.aliases.length < 3) err(name, 'needs >= 3 aliases')
  for (const a of [sp.name, ...sp.aliases]) { if (seen.has(a)) err(name, `"${a}" also used by ${seen.get(a)}`); seen.set(a, name) }
  if (icons.has(sp.name)) warn(name, 'same name as a static icon (fine, but the loader page says "loader")')
  if (!(sp.duration >= 0.6 && sp.duration <= 8)) err(name, 'duration must be 0.6..8 s')
  if (sp.parts.length > 24) err(name, `${sp.parts.length} parts: at most 24 (use copies)`)
  for (const p of sp.parts) if (p.motion) {
    const k = p.motion.keys
    const a = k[0][1], b = k[k.length - 1][1]
    const jump = ['x', 'y', 'sx', 'sy', 'o'].some(q => Math.abs(a[q] - b[q]) > 1e-6) || Math.abs(((a.r - b.r) % 360 + 360) % 360) > 1e-6 && Math.abs(((a.r - b.r) % 360 + 360) % 360 - 360) > 1e-6
    if (jump && !(a.o < 0.01 && b.o < 0.01)) warn(name, `part ${p.i}: the cycle does not end where it starts (a visible jump each loop)`)
  }
  let worst = 0, worstStyle = ''
  for (const s of styleNames) {
    try {
      const a = compile(sp, styles[s]), b = compile(sp, styles[s])
      if (a.svg !== b.svg) err(name, `${s}: two compiles differ (non-deterministic)`)
      if (a.bytes > worst) { worst = a.bytes; worstStyle = s }
      if (a.bytes > MAX_BYTES) err(name, `${s}: ${(a.bytes / 1024).toFixed(1)} KB > ${MAX_BYTES / 1024} KB`)
    } catch (e) { err(name, `${s}: ${e.message}`) }
  }
  if (worst > WARN_BYTES) warn(name, `largest ${(worst / 1024).toFixed(1)} KB (${worstStyle})`)
  if (!quiet) console.log(`ok ${name.padEnd(18)} ${sp.group.padEnd(9)} ${sp.parts.length} parts  ${sp.duration}s  max ${(worst / 1024).toFixed(1)} KB (${worstStyle})`)
}
console.log(`${list.length} loaders x ${styleNames.length} styles: ${errors} errors, ${warnings} warnings (${((Date.now() - t0) / 1000).toFixed(1)}s)`)
process.exit(errors ? 1 : 0)
