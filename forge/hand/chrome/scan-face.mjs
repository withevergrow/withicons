// forge/hand/chrome/scan-face.mjs: four gunmetal scanner corner brackets around a chrome face disc with two cut-out eyes and a cut-out smile.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const circ = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`
const C = (sx, sy) => { const x = v => (12 + sx * (v - 12)).toFixed(2), y = v => (12 + sy * (v - 12)).toFixed(2)
  return 'M' + x(2.8) + ' ' + y(8) + 'V' + y(5.6) + 'Q' + x(2.8) + ' ' + y(2.8) + ' ' + x(5.6) + ' ' + y(2.8) + 'H' + x(8) }
const FACE = circ(12, 12, 5.6)

export default function render(icon) {
  const name = (icon && icon.name) || 'scan-face'
  const Ls = layers(model(skeleton(name, [{ d: C(1, 1), plate: 'A' }, { d: C(-1, 1), plate: 'A' }, { d: C(1, -1), plate: 'A' }, { d: C(-1, -1), plate: 'A' }, { d: FACE, plate: 'K', fill: true }], [circ(9.9, 10.6, 0.95), circ(14.1, 10.6, 0.95), 'M9.2 13.2Q12 16.6 14.8 13.2Q12 14.9 9.2 13.2Z'])))
  return emit(Ls, name, 0)
}
