// forge/hand/soft3d/backpack.mjs — t
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_soft3d-core.mjs'

// the drawing is authored here as soft3d-specific geometry, then lit by the style's own solid + light builder so it
// keeps the family's camera, bevels, tonal bands and contact shadow exactly
function prep(icon, raw) {
  const paths = raw.paths.map((p, i) => ({ id: 'h' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = raw.cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { ...icon, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: fills.length ? unionSets(fills.map(f => f.set)) : [] }
}
// recolor: role -> default hex; swapA: role -> [role, hex] on the moving part (wm-a) only
function draw(icon, raw, recolor = {}, swapA = {}) {
  const ic = prep(icon, raw)
  let nodes = null
  for (const lite of [0, 1, 2, 3]) {
    nodes = build(ic, lite)
    if (nodes && nodes.length > 1 && JSON.stringify(nodes).length < 18500) break
  }
  if (!nodes || nodes.length < 2) return null
  const re = /--with-soft3d-([a-z0-9]+), (#[0-9A-Fa-f]{6})/g
  const fix = (v, a) => {
    if (typeof v !== 'string') return v
    if (a.class === 'wm-a') v = v.replace(re, (m, r) => swapA[r] ? `--with-soft3d-${swapA[r][0]}, ${swapA[r][1]}` : m)
    return v.replace(re, (m, r) => recolor[r] ? `--with-soft3d-${r}, ${recolor[r]}` : m)
  }
  const walk = n => [n[0], Object.fromEntries(Object.entries(n[1]).map(([k, v]) => [k, fix(v, n[1])])), ...(n[2] ? [n[2].map(walk)] : [])]
  return nodes.map(walk)
}

const BODY = 'M7 21.5 H17 A2 2 0 0 0 19 19.5 V12 A5.5 5.5 0 0 0 13.5 6.5 H10.5 A5.5 5.5 0 0 0 5 12 V19.5 A2 2 0 0 0 7 21.5 Z'
// the lid flap in three slices (each small enough to stay one solid raised piece rather than a ring)
const FLAP = 'M9.5 7.1 A5.5 5.5 0 0 0 5 12 V12.4 C6.5 13 8 13.45 9.5 13.65 Z M9.5 7.1 A5.5 5.5 0 0 1 10.5 6.5 H13.5 A5.5 5.5 0 0 1 14.5 7.1 V13.65 C13.6 13.85 12.8 13.9 12 13.9 C11.2 13.9 10.4 13.85 9.5 13.65 Z M14.5 7.1 A5.5 5.5 0 0 1 19 12 V12.4 C17.5 13 16 13.45 14.5 13.65 Z'
const POCKET = 'M8 15.75 H16 V18.5 A1 1 0 0 1 15 19.5 H9 A1 1 0 0 1 8 18.5 Z'
const RAW = {
  paths: [
    { d: BODY, plate: 'K' },
    { d: 'M10 6.5 V4.5 A2 2 0 0 1 14 4.5 V6.5', plate: 'A' },
    { d: FLAP, plate: 'A' },
    { d: POCKET, plate: 'A' },
  ],
  fills: [BODY],
  cutouts: [],
}
export default function render(icon) { return draw(icon, RAW, { c1: '#2F6FD6', c2: '#8DB8F5', c3: '#F2A93B' }) }
