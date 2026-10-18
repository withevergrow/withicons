// forge/hand/soft3d/chart-scatter.mjs
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

const dot = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
const AX = 'M2.6 3.5 A0.9 0.9 0 0 1 4.4 3.5 V18.6 A1 1 0 0 0 5.4 19.6 H20.5 A0.9 0.9 0 0 1 20.5 21.4 H5.4 A2.8 2.8 0 0 1 2.6 18.6 Z'
const DOTS = [dot(8.25, 15.5, 1.75), dot(11.25, 8.5, 1.75), dot(15.75, 12.5, 1.75), dot(18.75, 5.25, 1.75)]
const RAW = {
  paths: [{ d: AX, plate: 'A' }, ...DOTS.map(d => ({ d, plate: 'K' }))],
  fills: [AX, ...DOTS],
  cutouts: [],
}
export default function render(icon) { return draw(icon, RAW, { c1: '#3D7EE0', c2: '#8A97AB' }) }
