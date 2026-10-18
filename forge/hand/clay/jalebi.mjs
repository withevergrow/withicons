// forge/hand/clay/jalebi.mjs — a jalebi in clay: a round orange disc of fried batter with a golden syrup spiral piped
// over it (three turns, ending in a small tail at the rim). The generator drew a plain orange ball with a nub; here the
// disc is the generator's own clay model (_clay-core.mjs) and the spiral is a raised tube laid on it through the
// model's transform: soft shade under, gold tube, a lit stripe along it, so the coil reads at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const s = K.SCALE
const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY)]

const CX = 12, CY = 12.4
const DISC = 'M20.2 12.4A8.2 8.2 0 1 1 3.8 12.4A8.2 8.2 0 1 1 20.2 12.4Z'

// Archimedean spiral from the centre outwards, smoothed with Catmull-Rom into cubic segments
function spiral(turns, r0, r1, a0) {
  const n = Math.round(turns * 14), pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t
    pts.push(tf(CX + r * Math.cos(a), CY + r * Math.sin(a)))
  }
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${r2(c1[0])} ${r2(c1[1])} ${r2(c2[0])} ${r2(c2[1])} ${p2[0]} ${p2[1]}`
  }
  return d
}
const shift = (d, dx, dy) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)

export default function render(icon) {
  const name = (icon && icon.name) || 'jalebi'
  const nodes = (build(skeleton(name, [{ d: DISC, plate: 'K', fill: true }])) || [])
  const coil = spiral(2.9, 0.6, 7.2, -2.2)
  const round = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }
  // the groove the syrup sits in, the shade under the tube, the gold tube, the light on its top edge
  nodes.push(['path', { d: shift(coil, 0.1, 0.34), stroke: 'var(--with-clay-shadow, #6B1E05)', 'stroke-opacity': 0.42, 'stroke-width': 1.9, ...round, class: 'wm-k' }])
  nodes.push(['path', { d: coil, stroke: 'var(--with-clay-c2, #FFD84A)', 'stroke-width': 1.6, ...round, class: 'wm-k' }])
  nodes.push(['path', { d: shift(coil, -0.08, -0.26), stroke: 'var(--with-clay-shine, #FFFFFF)', 'stroke-opacity': 0.6, 'stroke-width': 0.4, ...round, class: 'wm-shine' }])
  return nodes
}
