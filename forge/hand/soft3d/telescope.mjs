// forge/hand/soft3d/telescope.mjs — t
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

const TRI = 'M11 12.6 H13 L18.4 20.6 A0.8 0.8 0 0 1 17 21.4 L12.8 15.2 V20.8 A0.8 0.8 0 0 1 11.2 20.8 V15.2 L7 21.4 A0.8 0.8 0 0 1 5.6 20.6 Z'
const RAW = {
  paths: [
    { d: 'M13.09 5.34 L5.49 9.15 A1 1 0 0 0 5.04 10.49 L5.93 12.28 A1 1 0 0 0 7.27 12.72 L14.88 8.92 Z', plate: 'K' },
    { d: 'M13.54 4 L15.77 2.88 A1 1 0 0 1 17.11 3.33 L18.9 6.91 A1 1 0 0 1 18.46 8.25 L16.22 9.37 A1 1 0 0 1 14.88 8.92 L13.09 5.34 A1 1 0 0 1 13.54 4 Z', plate: 'K' },
    { d: TRI, plate: 'A' },
  ],
  fills: [
    'M13.09 5.34 L5.49 9.15 A1 1 0 0 0 5.04 10.49 L5.93 12.28 A1 1 0 0 0 7.27 12.72 L14.88 8.92 Z',
    'M13.54 4 L15.77 2.88 A1 1 0 0 1 17.11 3.33 L18.9 6.91 A1 1 0 0 1 18.46 8.25 L16.22 9.37 A1 1 0 0 1 14.88 8.92 L13.09 5.34 A1 1 0 0 1 13.54 4 Z',
    TRI,
  ],
  cutouts: [],
}
export default function render(icon) { return draw(icon, RAW, { c1: '#3D7EE0', c2: '#5E6B80', c3: '#F2C14E' }) }
