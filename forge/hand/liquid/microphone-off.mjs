// forge/hand/liquid/microphone-off.mjs — a whole capsule mic in firm clear glass on a violet cradle, stem and foot,
// struck through by one pink glass slash. The generated mic only kept the top arc of the capsule, so the head
// dissolved at small sizes and the slash sat on a pale shape; now the capsule is a full, firmer glass pill and the
// slash is a single clean bar. Same model and light as the generator.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

const CAPSULE = rr(8.6, 2.6, 15.4, 11.6, 3.4)

function firm(nodes, name) {
  for (const n of nodes) {
    if (n[0] === 'defs') {
      const g0 = n[2].find(g => g[1].id === `wg-liquid-${name}-0`)
      if (g0) [0.4, 0.66, 0.9].forEach((o, i) => { g0[2][i][1]['stop-opacity'] = o })
    } else if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = 0.48
  }
  return nodes
}

export default function render(icon) {
  const name = (icon && icon.name) || 'microphone-off'
  const nodes = build(skeleton(name, [
    { d: CAPSULE, plate: 'A', fill: true },
    { d: 'M5.6 10.6A6.4 6.4 0 0 0 18.4 10.6', plate: 'K' },
    { d: 'M12 17V20.2M8.6 20.5H15.4', plate: 'K' },
    { d: 'M5.4 5.2L18.6 19.6', plate: 'S' },
  ]))
  return nodes ? firm(nodes, name) : null
}
