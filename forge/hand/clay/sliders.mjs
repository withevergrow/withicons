// forge/hand/clay/sliders.mjs — three slim violet clay tracks, each with its own plump orange bar knob at a different
// spot, and a clear gap between every row. The generated version let the tube-wide tracks and tall knobs fuse into one
// striped lump; here the tracks are thin capsules (fills, no fat tube) and the knobs are short pills that never reach
// the neighbouring track, so it reads as three sliders at 16px. Same model and light as the generator (_clay-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.filter(p => p.d).map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.f).map(p => { const subs = parsePath(p.f); return { d: p.f, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const cap = (x0, x1, y, h) => `M${x0 + h} ${y - h}H${x1 - h}A${h} ${h} 0 0 1 ${x1 - h} ${y + h}H${x0 + h}A${h} ${h} 0 0 1 ${x0 + h} ${y - h}Z`

const ROWS = [[5.3, 16], [12, 8], [18.7, 13]]

export default function render(icon) {
  const name = (icon && icon.name) || 'sliders'
  const parts = []
  for (const [y] of ROWS) parts.push({ d: `M4 ${y}H20`, plate: 'K' })
  for (const [y, x] of ROWS) parts.push({ d: `M${x} ${y - 1.1}V${y + 1.1}`, plate: 'S' })
  // the knobs are the moving part (motion animates parts.A), so tag the candy pills wm-a
  return build(skeleton(name, parts)).map(n => (n[1] && n[1].class === 'wm-s' ? [n[0], { ...n[1], class: 'wm-a' }] : n))
}
