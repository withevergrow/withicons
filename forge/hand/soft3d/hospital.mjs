// forge/hand/soft3d/hospital.mjs — one clear rectangular block with a red roof band, a big raised red cross and a glass door, replacing the generated tower-and-wings drawing that read as clutter in soft 3D
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_soft3d-core.mjs'

function prep(icon, raw) {
  const paths = raw.paths.map((p, i) => ({ id: 'h' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = raw.cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { ...icon, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: fills.length ? unionSets(fills.map(f => f.set)) : [] }
}
function draw(icon, raw, recolor = {}) {
  const ic = prep(icon, raw)
  let nodes = null
  for (const lite of [0, 1, 2, 3]) {
    nodes = build(ic, lite)
    if (nodes && nodes.length > 1 && JSON.stringify(nodes).length < 18500) break
  }
  if (!nodes || nodes.length < 2) return null
  const keys = Object.keys(recolor)
  if (!keys.length) return nodes
  const fix = v => typeof v === 'string' ? v.replace(/var\(--with-soft3d-([a-z0-9]+), (#[0-9A-Fa-f]{6})\)/g, (m, r, h) => recolor[r] ? `var(--with-soft3d-${r}, ${recolor[r]})` : m) : v
  const walk = n => [n[0], Object.fromEntries(Object.entries(n[1]).map(([k, v]) => [k, fix(v)])), ...(n[2] ? [n[2].map(walk)] : [])]
  return nodes.map(walk)
}

const RAW = {
  paths: [
    { d: 'M12 8.5 V14 M9.25 11.25 H14.75', plate: 'A' },
  ],
  fills: ['M4 21 V6.5 A1.5 1.5 0 0 1 5.5 5 H18.5 A1.5 1.5 0 0 1 20 6.5 V21 Z'],
  cutouts: ['M10 21 V17.5 A0.5 0.5 0 0 1 10.5 17 H13.5 A0.5 0.5 0 0 1 14 17.5 V21 Z', 'M5.75 16 H8 V18.5 H5.75 Z', 'M16 16 H18.25 V18.5 H16 Z'],
}
export default function render(icon) { return draw(icon, RAW, { c2: '#E5483F' }) }
