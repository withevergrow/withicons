// forge/hand/soft3d/microscope.mjs — the microscope rebuilt as a light lab instrument (white arm and base slab, blue eyepiece tube, clear stage), replacing the generated drawing whose heavy dark-grey body sank into a blob at small sizes
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
    { d: 'M7.52 2.3 L11.42 9.1 L10.38 9.7 L6.48 2.9 Z', plate: 'A' },
    { d: 'M11.1 10 L11.6 10.9', plate: 'A' },
    { d: 'M11.75 6.25 C16.5 6.5 19 9.5 19 13.25 C19 16.25 17.5 18.5 15 19.5', plate: 'K' },
    { d: 'M8 15.5 H18', plate: 'A' },
  ],
  fills: [
    'M5 19.25 H19 A1.5 1.5 0 0 1 20.5 20.75 V21.5 H3.5 V20.75 A1.5 1.5 0 0 1 5 19.25 Z',
  ],
  cutouts: [],
}
export default function render(icon) { return draw(icon, RAW, { c1: '#EEF1F5', c2: '#3D7EE0', c3: '#5BB8E8' }) }
