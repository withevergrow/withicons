#!/usr/bin/env node
// Lint skeletons, then render them through every style that exists.
//   node forge/tools/check.mjs                 # all icons
//   node forge/tools/check.mjs home lock heart # just these
import fs from 'fs'
import path from 'path'
import { ICON_DIR, listIcons, loadIcon, loadStyles, renderIcon, readManifest } from '../lib/load.mjs'
import { bbox } from '../kernel/geom.mjs'

const manifest = readManifest()
const CATS = new Set(manifest.categories)
// usage: check.mjs [--styles line,duo] [names...]
const argv = process.argv.slice(2)
const si = argv.indexOf('--styles')
const onlyStyles = si >= 0 ? argv.splice(si, 2)[1].split(',') : undefined
const want = argv
const names = want.length ? want : listIcons()
const styles = await loadStyles(onlyStyles)
const problems = []
const warn = (n, m) => problems.push(`  ${n}: ${m}`)

for (const name of names) {
  const f = path.join(ICON_DIR, `${name}.json`)
  if (!fs.existsSync(f)) { warn(name, 'MISSING FILE'); continue }
  let raw
  try { raw = JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { warn(name, 'BAD JSON ' + e.message); continue }
  if (raw.name !== name) warn(name, `name field "${raw.name}" != filename`)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) warn(name, 'not kebab-case')
  if (!CATS.has(raw.category)) warn(name, `unknown category "${raw.category}"`)
  if (!Array.isArray(raw.aliases) || raw.aliases.length < 3 || raw.aliases.length > 15) warn(name, 'need 3-15 aliases')
  if (raw.synonyms !== undefined && !Array.isArray(raw.synonyms)) warn(name, 'synonyms must be an array')
  { const all = [...(raw.aliases || []), ...(raw.synonyms || [])]
    if (all.length > 50) warn(name, `aliases + synonyms = ${all.length} (max 50)`)
    const low = all.map(a => String(a).toLowerCase().trim())
    if (low.some(a => a !== String(a) || !a)) warn(name, 'empty alias/synonym')
    if (new Set(low).size !== low.length) warn(name, 'duplicate alias/synonym') }
  if (!Array.isArray(raw.tags) || raw.tags.length < 2) warn(name, 'need >=2 tags')
  if (!Array.isArray(raw.paths) || !raw.paths.length) { warn(name, 'no paths'); continue }
  for (const p of raw.paths) if (!['K', 'A', 'S'].includes(p.plate)) warn(name, `bad plate "${p.plate}"`)
  let icon
  try { icon = loadIcon(name) } catch (e) { warn(name, 'PARSE ' + e.message); continue }
  const pts = icon.lines.flatMap(l => l.pts)
  if (!pts.length) { warn(name, 'paths produced no geometry'); continue }
  const b = bbox(pts)
  if (b.x0 < 1.5 || b.y0 < 1.5 || b.x1 > 22.5 || b.y1 > 22.5) warn(name, `geometry outside live area: ${[b.x0, b.y0, b.x1, b.y1].map(v => v.toFixed(2)).join(',')}`)
  if (b.w < 6 && b.h < 6) warn(name, 'geometry suspiciously small')
  for (const fl of icon.fills) if (fl.subs.some(s => !s.closed)) warn(name, 'a fill subpath is not closed (end it with Z)')
  if (!icon.fills.length) warn(name, 'no fills — solid/duo/engrave will look empty (ok only for pure-line glyphs like arrows)')
  for (const [sn, st] of Object.entries(styles)) {
    try { const nodes = renderIcon(st, icon); if (!nodes.length) warn(name, `style ${sn} rendered nothing`) }
    catch (e) { warn(name, `style ${sn} THREW: ${e.message.split('\n')[0]}`) }
  }
}
const hard = problems.filter(p => !p.includes('no fills'))
console.log(`checked ${names.length} icon(s) against ${Object.keys(styles).length} style(s): ${hard.length} problem(s), ${problems.length - hard.length} note(s)`)
problems.forEach(p => console.log(p))
process.exitCode = hard.length ? 1 : 0
