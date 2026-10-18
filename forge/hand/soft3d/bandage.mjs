// forge/hand/soft3d/bandage.mjs — t
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
    { d: 'M14 3.5 A2.83 2.83 0 0 1 18 3.5 L20.5 6 A2.83 2.83 0 0 1 20.5 10 L10 20.5 A2.83 2.83 0 0 1 6 20.5 L3.5 18 A2.83 2.83 0 0 1 3.5 14 Z', plate: 'K' },
    { d: 'M11.5 6.5 L17.5 12.5 L12.5 17.5 L6.5 11.5 Z', plate: 'A' },
  ],
  fills: [
    'M14 3.5 A2.83 2.83 0 0 1 18 3.5 L20.5 6 A2.83 2.83 0 0 1 20.5 10 L10 20.5 A2.83 2.83 0 0 1 6 20.5 L3.5 18 A2.83 2.83 0 0 1 3.5 14 Z',
    'M11.5 6.5 L17.5 12.5 L12.5 17.5 L6.5 11.5 Z',
  ],
  cutouts: [
    'M16.2 5.8 A0.55 0.55 0 1 1 17.3 5.8 A0.55 0.55 0 1 1 16.2 5.8 Z', 'M17.7 7.3 A0.55 0.55 0 1 1 18.8 7.3 A0.55 0.55 0 1 1 17.7 7.3 Z',
    'M5.2 16.7 A0.55 0.55 0 1 1 6.3 16.7 A0.55 0.55 0 1 1 5.2 16.7 Z', 'M6.7 18.2 A0.55 0.55 0 1 1 7.8 18.2 A0.55 0.55 0 1 1 6.7 18.2 Z',
  ],
}
export default function render(icon) { return draw(icon, RAW, { c1: '#E8B489', c2: '#FBF1E4', c3: '#FBF1E4' }) }
