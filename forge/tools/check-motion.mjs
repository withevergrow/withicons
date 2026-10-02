#!/usr/bin/env node
// Lint per-icon motion specs (forge/motion/<name>.json) against forge/MOTION.md.
//   node forge/tools/check-motion.mjs              # every spec + report icons without one
//   node forge/tools/check-motion.mjs bell heart   # just these
import fs from 'fs'
import path from 'path'
import { ROOT, listIcons } from '../lib/load.mjs'

export const PRESETS = ['spin', 'spin-once', 'tick', 'pulse', 'beat', 'breathe', 'float', 'bounce', 'sway', 'ring', 'wiggle', 'shake',
  'nod', 'nudge', 'pass', 'rise', 'drop', 'blink', 'flicker', 'twinkle', 'pop', 'tada', 'jelly', 'flip', 'rock', 'tilt', 'zoom',
  'orbit', 'glow', 'draw', 'type', 'fill']
export const EFFECTS = ['fade', 'scale', 'rotate', 'flip', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'blur', 'spin', 'morph', 'draw']
const DIR = path.join(ROOT, 'forge', 'motion')
const STYLE_DIR = path.join(ROOT, 'forge', 'styles')

export function lint(name, raw, icons, styles) {
  const out = []
  const bad = m => out.push(`  ${name}: ${m}`)
  if (raw.name !== name) bad(`name "${raw.name}" != filename`)
  if (!icons.has(name)) bad('no such icon in forge/icons')
  if (typeof raw.intent !== 'string' || !raw.intent.trim() || raw.intent.length > 80) bad('intent must be 1-80 chars')
  const obj = (o, where, part) => {
    if (!o || typeof o !== 'object') return bad(`${where} missing`)
    if (!PRESETS.includes(o.preset)) bad(`${where}.preset "${o.preset}" unknown`)
    if (o.origin !== undefined && !(Array.isArray(o.origin) && o.origin.length === 2 && o.origin.every(v => typeof v === 'number' && v >= 0 && v <= 24))) bad(`${where}.origin must be [x,y] in 0..24`)
    if (o.dir !== undefined && !(typeof o.dir === 'number' && o.dir >= 0 && o.dir < 360)) bad(`${where}.dir must be 0..359`)
    if (o.amount !== undefined && !(typeof o.amount === 'number' && o.amount >= 0.25 && o.amount <= 2)) bad(`${where}.amount must be 0.25..2`)
    if (o.duration !== undefined && !(typeof o.duration === 'number' && o.duration >= 0.3 && o.duration <= 6)) bad(`${where}.duration must be 0.3..6`)
    if (o.steps !== undefined && !(Number.isInteger(o.steps) && o.steps >= 0 && o.steps <= 12)) bad(`${where}.steps must be int 0..12`)
    if (part && o.delay !== undefined && !(typeof o.delay === 'number' && o.delay >= 0 && o.delay <= 1)) bad(`${where}.delay must be 0..1`)
    const extra = Object.keys(o).filter(k => !['preset', 'origin', 'dir', 'amount', 'duration', 'steps'].concat(part ? ['delay'] : []).includes(k))
    if (extra.length) bad(`${where} unknown keys: ${extra.join(',')}`)
  }
  obj(raw.loop, 'loop'); obj(raw.hover, 'hover')
  if (raw.alt !== undefined) { if (!Array.isArray(raw.alt) || raw.alt.length > 3) bad('alt must be an array of 0-3'); else raw.alt.forEach((a, i) => obj(a, `alt[${i}]`)) }
  if (raw.swap !== undefined) {
    if (!Array.isArray(raw.swap) || raw.swap.length > 4) bad('swap must be an array of 0-4')
    else raw.swap.forEach((s, i) => {
      const [to, st] = String(s && s.to).split('@')
      if (!icons.has(to)) bad(`swap[${i}].to "${s && s.to}": unknown icon`)
      if (st !== undefined && !styles.has(st)) bad(`swap[${i}].to style "${st}" unknown`)
      if (to === name && st === undefined) bad(`swap[${i}] swaps to itself`)
      if (!EFFECTS.includes(s && s.effect)) bad(`swap[${i}].effect "${s && s.effect}" unknown`)
    })
  }
  // parts choreography (MOTION.md, run 9)
  if (raw.parts !== undefined) {
    if (!raw.parts || typeof raw.parts !== 'object' || Array.isArray(raw.parts)) bad('parts must be an object')
    else for (const [k, v] of Object.entries(raw.parts)) { if (!['A', 'S'].includes(k)) bad(`parts.${k}: only A and S`); else obj(v, `parts.${k}`, true) }
  }
  if (raw.deco !== undefined && !['breathe', 'float', 'twinkle', 'still'].includes(raw.deco)) bad('deco must be breathe|float|twinkle|still')
  const extra = Object.keys(raw).filter(k => !['name', 'intent', 'loop', 'hover', 'alt', 'swap', 'parts', 'deco'].includes(k))
  if (extra.length) bad(`unknown keys: ${extra.join(',')}`)
  return out
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const icons = new Set(listIcons())
  const styles = new Set(fs.readdirSync(STYLE_DIR).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).map(f => f.slice(0, -4)))
  const want = process.argv.slice(2)
  const have = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)) : []
  const names = want.length ? want : have
  const problems = []
  for (const n of names) {
    const f = path.join(DIR, `${n}.json`)
    if (!fs.existsSync(f)) { problems.push(`  ${n}: MISSING forge/motion/${n}.json`); continue }
    let raw
    try { raw = JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { problems.push(`  ${n}: BAD JSON ${e.message}`); continue }
    problems.push(...lint(n, raw, icons, styles))
  }
  const missing = want.length ? [] : [...icons].filter(n => !have.includes(n))
  console.log(`checked ${names.length} motion spec(s): ${problems.length} problem(s)${missing.length ? `; ${missing.length} icon(s) without a spec` : ''}`)
  problems.forEach(p => console.log(p))
  process.exitCode = problems.length ? 1 : 0
}
