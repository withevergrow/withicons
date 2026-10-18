// forge/hand/soft3d/school.mjs — a wide schoolhouse (flat-roofed wings, a pitched central gable with a flag on its ridge, a round clock and an arched door), replacing the generated stepped block that read like a backpack in soft 3D
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

const RAW = {
  paths: [
    { d: 'M12 5 V2 M12.75 2 L15.25 3 L12.75 4 Z', plate: 'A' },
  ],
  fills: ['M2 21 V13 A1 1 0 0 1 3 12 H7 V10 L12 5 L17 10 V12 H21 A1 1 0 0 1 22 13 V21 Z'],
  cutouts: [
    'M10.25 21 V17.75 A1.75 1.75 0 0 1 13.75 17.75 V21 Z',
    'M13.25 12.75 A1.25 1.25 0 1 1 10.75 12.75 A1.25 1.25 0 1 1 13.25 12.75 Z',
    'M3.75 14.75 H6 V17.25 H3.75 Z', 'M18 14.75 H20.25 V17.25 H18 Z',
  ],
}
export default function render(icon) { return draw(icon, RAW, {}, { c2: ['accent', '#E5483F'] }) }
