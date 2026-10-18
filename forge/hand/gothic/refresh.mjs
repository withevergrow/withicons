// forge/hand/gothic/refresh.mjs — two broad enamelled gilt bands chasing each other clockwise round an open centre, each
// ending in the arrow family's notched ogival head (gold trefoil); the generated drawing set ruby beads on both tails and
// a rose-window boss in the middle, gems that crowded the arcs, and its small heads hardly read at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const place = (pts, ox, oy, a) => {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
const HEAD = s => [['M', [0, 0]], ['C', [-2.2 * s, -2.1 * s], [-4.3 * s, -3.9 * s], [-6 * s, -4.9 * s]],
  ['L', [-4.5 * s, 0]], ['L', [-6 * s, 4.9 * s]], ['C', [-4.3 * s, 3.9 * s], [-2.2 * s, 2.1 * s], [0, 0]]]
const headD = (tx, ty, a, s) => HEAD(s).map(([k, ...p]) => k + place(p, tx, ty, a).map(q => q.join(' ')).join(' ')).join(' ') + ' Z'
const pt = (cx, cy, r, a) => [cx + r * Math.cos(a * RAD), cy + r * Math.sin(a * RAD)]

// a gilded band along the circle (cx, cy, r) from a0 to a1 (degrees), the head's notch at a1, its tip further on
function arcArrow(cx, cy, r, a0, a1, s, w, plate = 'K') {
  const dir = Math.sign(a1 - a0)
  const at = a1 + dir * (4.3 * s / r) / RAD
  const [bx, by] = pt(cx, cy, r, a1), [tx, ty] = pt(cx, cy, r, at)
  const a = Math.atan2(ty - by, tx - bx) / RAD
  const [tc] = place([[-3 * s, 0]], tx, ty, a)
  return [
    g.gilt(g.union(g.arc(cx, cy, r, a0, a1 + dir * 3, w), g.path(headD(tx, ty, a, s))), { plate }),
    g.glass(g.foil(tc[0], tc[1], 1.25 * s, 3, a + 180), 'c3', { outline: 0.22, glint: false, glow: 0.34, plate }),
  ]
}

export default function render(icon) {
  return paint(enamel([arcArrow(12, 12, 7.3, 182, 300, 0.78, 2.4), arcArrow(12, 12, 7.3, 2, 120, 0.78, 2.4, 'A')].flat(Infinity).filter(Boolean), icon))
}
