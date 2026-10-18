// forge/hand/gothic/arrow-left-right.mjs — a double arrow: one long enamelled gilt shaft with a gilt collar at its
// middle, driven into two compact notched ogival heads with swept barbs, a gold trefoil in each; the generated drawing
// (two huge flat-backed heads on a stub of shaft) read as an H or a bone, not as an arrow pointing both ways.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const place = (pts, ox, oy, a) => {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
// the notched ogival arrowhead of the arrow family (tip at the origin pointing +x, scale s)
const HEAD = s => [['M', [0, 0]], ['C', [-2.4 * s, -2.3 * s], [-4.9 * s, -4.3 * s], [-6.9 * s, -5.3 * s]],
  ['L', [-5 * s, 0]], ['L', [-6.9 * s, 5.3 * s]], ['C', [-4.9 * s, 4.3 * s], [-2.4 * s, 2.3 * s], [0, 0]]]
const headD = (tx, ty, a, s) => HEAD(s).map(([k, ...p]) => k + place(p, tx, ty, a).map(q => q.join(' ')).join(' ')).join(' ') + ' Z'

// a head (moving part A) with its tip at (tx, ty) pointing a, pierced by a gold trefoil
function head(tx, ty, a, s) {
  const [tc] = place([[-3.3 * s, 0]], tx, ty, a)
  return [
    g.gilt(g.path(headD(tx, ty, a, s)), { plate: 'A' }),
    g.glass(g.foil(tc[0], tc[1], 1.2 * s, 3, a + 180), 'c3', { outline: 0.22, glint: false, glow: 0.34, plate: 'A' }),
  ]
}

export default function render(icon) {
  const s = 0.82
  const parts = [
    g.gilt(g.seg(5.6, 12, 18.4, 12, 2.5)),
    g.gilt(g.rr(11.3, 10.1, 12.7, 13.9, 0.55), { thin: true, glint: false, outline: 0.32 }),
    ...head(2.4, 12, 180, s),
    ...head(21.6, 12, 0, s),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
