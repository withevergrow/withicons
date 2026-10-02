#!/usr/bin/env node
// Lint per-icon palette suggestions (forge/palettes/<name>.json) against forge/PALETTES.md.
//   node forge/tools/check-palettes.mjs              # every file + report icons without one
//   node forge/tools/check-palettes.mjs pizza heart  # just these
import fs from 'fs'
import path from 'path'
import { ROOT, listIcons } from '../lib/load.mjs'
import { ROLES } from '../lib/palette-map.mjs'

export const TAGS = ['true-to-life', 'pastel', 'vivid', 'neon', 'earthy', 'retro', 'vintage', 'mono', 'grayscale', 'dark', 'on-dark',
  'luxe', 'seasonal', 'nature', 'ocean', 'sunset', 'candy', 'accessible', 'corporate', 'y2k']
const DIR = path.join(ROOT, 'forge', 'palettes')
const HEX = /^#[0-9A-Fa-f]{6}$/
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] }
export const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }

export function lint(name, raw, icons) {
  const hard = [], soft = []
  const bad = m => hard.push(`  ${name}: ${m}`), note = m => soft.push(`  ${name}: (note) ${m}`)
  if (raw.name !== name) bad(`name "${raw.name}" != filename`)
  if (!icons.has(name)) bad('no such icon in forge/icons')
  const P = raw.palettes
  if (!Array.isArray(P) || P.length < 20 || P.length > 30) { bad(`need 20-30 palettes (have ${Array.isArray(P) ? P.length : 0})`); return { hard, soft } }
  const ids = new Set(), sigs = new Set()
  P.forEach((p, i) => {
    const w = `palettes[${i}]${p && p.id ? ' ' + p.id : ''}`
    if (!p || typeof p !== 'object') return bad(`${w} not an object`)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id || '')) bad(`${w}: id must be kebab-case`)
    if (ids.has(p.id)) bad(`${w}: duplicate id`); ids.add(p.id)
    if (typeof p.name !== 'string' || !p.name.trim() || p.name.length > 24) bad(`${w}: name must be 1-24 chars`)
    if (!Array.isArray(p.tags) || p.tags.length < 1 || p.tags.length > 3 || p.tags.some(t => !TAGS.includes(t))) bad(`${w}: tags must be 1-3 of ${TAGS.join(' ')}`)
    const c = p.colors || {}
    for (const r of ROLES) if (!HEX.test(c[r] || '')) bad(`${w}: colors.${r} must be #RRGGBB`)
    const extra = Object.keys(c).filter(k => !ROLES.includes(k)); if (extra.length) bad(`${w}: unknown roles ${extra.join(',')}`)
    if (ROLES.every(r => HEX.test(c[r] || ''))) {
      const sig = ['c1', 'c2', 'c3', 'c4'].map(r => c[r].toLowerCase()).join('')
      if (sigs.has(sig)) bad(`${w}: same c1-c4 as another palette`); sigs.add(sig)
      if (contrast(c.ink, c.c1) < 1.6) note(`${w}: ink barely separates from c1 (${contrast(c.ink, c.c1).toFixed(2)}:1)`)
      if (lum(c.shadow) > lum(c.c1)) note(`${w}: shadow lighter than c1`)
      if (lum(c.shine) < lum(c.c1)) note(`${w}: shine darker than c1`)
      if (new Set(['c1', 'c2', 'c3', 'c4'].map(r => c[r].toLowerCase())).size < 3) note(`${w}: c1-c4 have < 3 distinct colours`)
    }
  })
  return { hard, soft }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const icons = new Set(listIcons())
  const want = process.argv.slice(2).filter(a => a !== '--quiet')
  const quiet = process.argv.includes('--quiet')
  const have = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)) : []
  const names = want.length ? want : have
  const hard = [], soft = []
  for (const n of names) {
    const f = path.join(DIR, `${n}.json`)
    if (!fs.existsSync(f)) { hard.push(`  ${n}: MISSING forge/palettes/${n}.json`); continue }
    let raw
    try { raw = JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { hard.push(`  ${n}: BAD JSON ${e.message}`); continue }
    const r = lint(n, raw, icons); hard.push(...r.hard); soft.push(...r.soft)
  }
  const missing = want.length ? [] : [...icons].filter(n => !have.includes(n))
  console.log(`checked ${names.length} palette file(s): ${hard.length} problem(s), ${soft.length} note(s)${missing.length ? `; ${missing.length} icon(s) without palettes` : ''}`)
  hard.forEach(p => console.log(p)); if (!quiet) soft.forEach(p => console.log(p))
  process.exitCode = hard.length ? 1 : 0
}
