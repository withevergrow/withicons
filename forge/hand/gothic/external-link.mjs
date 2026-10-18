// forge/hand/gothic/external-link.mjs — an open carved-stone frame round a clear sapphire pane, and a bold gilded arrow
// (enamelled shaft, the arrow family's notched ogival head) leaving it through the open corner; the generated drawing
// filled the box with a busy diamond-quarry lattice and flew a thin, small arrow that the lattice swallowed at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const place = (pts, ox, oy, a) => {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
const HEAD = s => [['M', [0, 0]], ['C', [-2.4 * s, -2.3 * s], [-4.9 * s, -4.3 * s], [-6.9 * s, -5.3 * s]],
  ['L', [-5 * s, 0]], ['L', [-6.9 * s, 5.3 * s]], ['C', [-4.9 * s, 4.3 * s], [-2.4 * s, 2.3 * s], [0, 0]]]
const headD = (tx, ty, a, s) => HEAD(s).map(([k, ...p]) => k + place(p, tx, ty, a).map(q => q.join(' ')).join(' ')).join(' ') + ' Z'

export default function render() {
  const x0 = 10.2, y0 = 13.8, x1 = 20.9, y1 = 3.1, s = 0.84, w = 2.5
  const a = Math.atan2(y1 - y0, x1 - x0) / RAD
  const [nk] = place([[-4.6 * s, 0]], x1, y1, a)
  const [tc] = place([[-3.3 * s, 0]], x1, y1, a)
  const shaft = g.seg(x0, y0, nk[0], nk[1], w)
  const arrow = g.union(shaft, g.path(headD(x1, y1, a, s)))
  return paint([
    g.glass(g.rr(4.4, 5.8, 18.2, 19.8, 1.4), 'c2', { tracery: 'none', outline: 0.3, dark: 0.4, glow: 0.16 }),
    g.stone(g.stroke('M10.5 4.8 H5.4 A2 2 0 0 0 3.4 6.8 V18.6 A2 2 0 0 0 5.4 20.6 H17 A2 2 0 0 0 19 18.6 V13.6', 2.3),
      { ticks: [[[1, 12], [6, 12]], [[11, 18], [11, 23]], [[17, 17], [21, 17]]] }),
    g.cut(g.grow(arrow, 0.85)),
    g.gilt(arrow, { plate: 'A' }),
    g.glass(g.shrink(arrow, 0.9), 'c1', { plate: 'A', outline: 0.2, tracery: 'none', dark: 0.12, glow: 0.22, glint: false }),
    g.glass(g.foil(tc[0], tc[1], 1.25 * s, 3, a + 180), 'c3', { outline: 0.22, glint: false, glow: 0.34, plate: 'A' }),
  ])
}
