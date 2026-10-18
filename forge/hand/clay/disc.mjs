// forge/hand/clay/disc.mjs — a plump violet clay compact disc: a fat round slab with a clear hole punched through the
// middle, a raised orange hub ring round the hole and two pale sheen arcs on the upper-left rim. The generated disc was a
// plain ball with an orange squiggle (the hole filled in), so it read as a bubble; here the hole is open and the hub ring
// and sheens say "disc". Same model and light as the generator (_clay-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.f || p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`
const r2 = n => Math.round(n * 100) / 100

const RIM = disc(12, 12, 9.5)
const HR = 2.7
const HOLE = disc(12, 12, HR)
// annulus (outer clockwise, inner counter-clockwise) in output coordinates
const ring = (cx, cy, ro, ri) => `M${r2(cx - ro)} ${r2(cy)}A${ro} ${ro} 0 1 1 ${r2(cx + ro)} ${r2(cy)}A${ro} ${ro} 0 1 1 ${r2(cx - ro)} ${r2(cy)}ZM${r2(cx - ri)} ${r2(cy)}A${ri} ${ri} 0 1 0 ${r2(cx + ri)} ${r2(cy)}A${ri} ${ri} 0 1 0 ${r2(cx - ri)} ${r2(cy)}Z`
const arc = (cx, cy, r, a0, a1) => {
  const p = a => [r2(cx + r * Math.cos(a * Math.PI / 180)), r2(cy + r * Math.sin(a * Math.PI / 180))]
  const [x0, y0] = p(a0), [x1, y1] = p(a1)
  return `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`
}

export default function render(icon) {
  const name = (icon && icon.name) || 'disc'
  const sk = skeleton(name, [
    { d: RIM, f: RIM + HOLE, plate: 'K', fill: true },
  ], [HOLE])
  const nodes = build(sk)
  if (!nodes) return nodes
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  const [cx, cy] = tf(12, 12)
  const S = K.SCALE
  const hr = HR * S
  // fine data grooves: two faint concentric rings on the recording area
  for (const g of [5.0, 7.55]) nodes.push(['path', { d: arc(cx, cy, g * S, 0, 359.9), stroke: col('shadow'), 'stroke-opacity': 0.22, 'stroke-width': 0.3, fill: 'none', class: 'wm-k' }])
  // rainbow sheen: two opposite wedges of the recording area in orange / pink / teal / yellow
  const WEDGE = [['c2', 0], ['c3', 1], ['c4', 2], ['accent', 3]]
  for (const base of [-70, 110]) {
    WEDGE.forEach(([role, i]) => nodes.push(['path', { d: arc(cx, cy, 6.3, base + i * 17, base + i * 17 + 17.5), stroke: col(role), 'stroke-opacity': 0.8, 'stroke-width': 1.5, fill: 'none', class: 'wm-a' }]))
  }
  // clear spindle-hub: a pale plastic collar round the hole, rimmed in orange
  nodes.push(['path', { d: ring(cx + 0.08, cy + 0.2, hr + 1.95, hr - 0.05), fill: col('shadow'), 'fill-opacity': 0.3, class: 'wm-a' }])
  nodes.push(['path', { d: ring(cx, cy, hr + 1.9, hr + 0.95), fill: col('tint'), class: 'wm-a' }])
  nodes.push(['path', { d: ring(cx, cy, hr + 1.0, hr - 0.05), fill: col('c2'), class: 'wm-a' }])
  nodes.push(['path', { d: arc(cx, cy, hr + 1.45, 190, 285), stroke: col('shine'), 'stroke-opacity': 0.9, 'stroke-width': 0.35, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  // two white sheen arcs on the upper-left rim
  nodes.push(['path', { d: arc(cx, cy, 7.2, 205, 262), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  nodes.push(['path', { d: arc(cx, cy, 7.2, 273, 292), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  return nodes
}
