// forge/hand/chrome/ghost.mjs — a chrome ghost: one smooth chrome sheet body with a wavy hem and a clear face of two oval eyes and an open mouth cut through it.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate || 'K', pathId: p.id }))) }
}
const oval = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`
const run = (name, parts, cuts) => emit(layers(model(skeleton(name, parts, cuts))), name, 0)

const BODY = 'M5 20V10A7 7 0 0 1 19 10V20Q17.83 18.5 16.67 20Q15.5 21.5 14.33 20Q13.17 18.5 12 20Q10.83 21.5 9.67 20Q8.5 18.5 7.33 20Q6.17 21.5 5 20Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'ghost'
  return run(name, [{ d: BODY, fill: true }], [oval(9.2, 10.4, 1.2, 1.9), oval(14.8, 10.4, 1.2, 1.9), oval(12, 15, 1.25, 1.5)])
}
