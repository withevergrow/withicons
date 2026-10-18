// forge/hand/gothic/repeat-1.mjs — the line design's two looping arrows in gilt: a top band running right and a bottom band
// running left round rounded corners, each ending in the arrow family's notched ogival head, with one plain ruby glass
// 1 at the centre; the generated drawing framed the 1 in a cramped ornate roundel with rivets and a beaded numeral.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const place = (pts, ox, oy, a) => {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
const HEAD = s => [['M', [0, 0]], ['C', [-2.2 * s, -2.1 * s], [-4.3 * s, -3.9 * s], [-6 * s, -4.9 * s]],
  ['L', [-4.5 * s, 0]], ['L', [-6 * s, 4.9 * s]], ['C', [-4.3 * s, 3.9 * s], [-2.2 * s, 2.1 * s], [0, 0]]]
const headD = (tx, ty, a, s) => HEAD(s).map(([k, ...p]) => k + place(p, tx, ty, a).map(q => q.join(' ')).join(' ')).join(' ') + ' Z'

function arrow(shaft, tx, ty, a, plate) {
  const s = 0.82
  const [tc] = place([[-3 * s, 0]], tx, ty, a)
  return [
    g.gilt(g.union(g.stroke(shaft, 2.3), g.path(headD(tx, ty, a, s))), { plate }),
    g.glass(g.foil(tc[0], tc[1], 1.2 * s, 3, a + 180), 'c3', { outline: 0.22, glint: false, glow: 0.34, plate }),
  ]
}

export default function render(icon) {
  const parts = [
    arrow('M3.8 11.4 V9.2 A3.7 3.7 0 0 1 7.5 5.5 H18.5', 21.8, 5.5, 0, 'K'),
    arrow('M20.2 12.6 V14.8 A3.7 3.7 0 0 1 16.5 18.5 H5.5', 2.2, 18.5, 180, 'A'),
    g.glass(g.stroke([[9.9, 10.9], [12.7, 8.8], [12.7, 15.6]], 1.7), 'c1', { outline: 0.34, glint: false, glow: 0.3, tracery: 'none', plate: 'S' }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
