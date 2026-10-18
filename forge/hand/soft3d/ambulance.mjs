// forge/hand/soft3d/ambulance.mjs — a clean white van (box body, sloped cab with one big glass windscreen, a bold raised red cross, two dark wheels set apart from the body by clear arches), replacing the generated drawing whose wheels and highlights blurred into the body
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
    { d: 'M7.5 7.25 V14.25 M4 10.75 H11', plate: 'A' },
  ],
  fills: [
    'M2 17.5 V7 A2 2 0 0 1 4 5 H14.5 L19.25 10.75 H20.25 A1.75 1.75 0 0 1 22 12.5 V17.5 H20.75 A3 3 0 0 0 14.75 17.5 H9.75 A3 3 0 0 0 3.75 17.5 Z',
    'M8.75 17.75 A2 2 0 1 1 4.75 17.75 A2 2 0 1 1 8.75 17.75 Z',
    'M19.75 17.75 A2 2 0 1 1 15.75 17.75 A2 2 0 1 1 19.75 17.75 Z',
  ],
  cutouts: ['M13.5 6.5 H14.75 L18.75 11.25 H13.5 Z'],
}
export default function render(icon) { return draw(icon, RAW, { c1: '#D5DCE6' }) }
