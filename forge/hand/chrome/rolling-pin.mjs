// forge/hand/chrome/rolling-pin.mjs — a fat chrome roller on the rising diagonal with a short gunmetal collar at each
// end and a round chrome knob-handle on a neck beyond each collar. The generated pin was a thin sliver whose handles
// were stubs fused to the body; here the roller is thick, the collars set it apart from the handles, and the two
// handles are clear bulbs on narrow necks, the silhouette every rolling pin shares. Same model and paint as the
// generator (_chrome-core.mjs); the geometry is drawn in pin space (x along the pin from its middle, y across) and
// turned onto the diagonal.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const C = Math.SQRT1_2
const r2 = v => Math.round(v * 100) / 100
const P = (x, y) => `${r2(12 + (x + y) * C)} ${r2(12 + (-x + y) * C)}`
const M = (x, y) => 'M' + P(x, y)
const L = (x, y) => 'L' + P(x, y)
const Q = (a, b, c, d) => 'Q' + P(a, b) + ' ' + P(c, d)
// a round knob at x, radius r
const knob = (x, r) => M(x + r, 0) + 'A' + r + ' ' + r + ' 0 1 0 ' + P(x - r, 0) + 'A' + r + ' ' + r + ' 0 1 0 ' + P(x + r, 0) + 'Z'

// the roller: a fat barrel with slightly softened ends
const BARREL = M(-5, -2.9) + L(5, -2.9) + Q(5.5, -2.9, 5.5, -2.4) + L(5.5, 2.4) + Q(5.5, 2.9, 5, 2.9) + L(-5, 2.9) + Q(-5.5, 2.9, -5.5, 2.4) + L(-5.5, -2.4) + Q(-5.5, -2.9, -5, -2.9) + 'Z'
// the collars on the barrel's ends
const COLLAR_A = M(4.7, -3.9) + L(6.7, -3.9) + L(6.7, 3.9) + L(4.7, 3.9) + 'Z'
const COLLAR_B = M(-6.7, -3.9) + L(-4.7, -3.9) + L(-4.7, 3.9) + L(-6.7, 3.9) + 'Z'
// necks and knobs
const NECK_A = M(6.4, 0) + L(9.8, 0)
const NECK_B = M(-6.4, 0) + L(-9.8, 0)

export default function render(icon) {
  const name = (icon && icon.name) || 'rolling-pin'
  const Ls = layers(model(skeleton(name, [
    { d: BARREL, plate: 'K', fill: true },
    { d: COLLAR_A, plate: 'A', fill: true },
    { d: COLLAR_B, plate: 'A', fill: true },
    { d: NECK_A, plate: 'K' }, { d: NECK_B, plate: 'K' },
    { d: knob(11, 1.5), plate: 'K', fill: true },
    { d: knob(-11, 1.5), plate: 'K', fill: true },
  ])))
  return emit(Ls, name, 0)
}
