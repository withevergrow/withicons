// forge/hand/gothic/arrow-up.mjs — the exact mirror of arrow-down: a straight enamelled gilt shaft driven into a broad
// ogival arrowhead with swept-back barbs and a notched back, a gold trefoil set in the head; the generated drawing
// (a lone filled triangle on a thin stem) read as a roof or a lamp, not as an arrow pointing up.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const place = (pts, ox, oy, a) => {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
const HEAD = s => [['M', [0, 0]], ['C', [-2.4 * s, -2.3 * s], [-4.9 * s, -4.3 * s], [-6.9 * s, -5.3 * s]],
  ['L', [-5 * s, 0]], ['L', [-6.9 * s, 5.3 * s]], ['C', [-4.9 * s, 4.3 * s], [-2.4 * s, 2.3 * s], [0, 0]]]
const headD = (tx, ty, a, s) => HEAD(s).map(([k, ...p]) => k + place(p, tx, ty, a).map(q => q.join(' ')).join(' ')).join(' ') + ' Z'

function arrow(x0, y0, x1, y1, s = 1, w = 2.6, plate = 'K') {
  const a = Math.atan2(y1 - y0, x1 - x0) / RAD
  const [nk] = place([[-4.6 * s, 0]], x1, y1, a)
  const [tc] = place([[-3.3 * s, 0]], x1, y1, a)
  return [
    g.gilt(g.union(g.seg(x0, y0, nk[0], nk[1], w), g.path(headD(x1, y1, a, s))), { plate }),
    g.glass(g.foil(tc[0], tc[1], 1.25 * s, 3, a + 180), 'c3', { outline: 0.22, glint: false, glow: 0.34, plate }),
  ]
}

export default function render(icon) {
  return paint(enamel(arrow(12, 20.6, 12, 2.6, 1.05).flat(Infinity).filter(Boolean), icon))
}
