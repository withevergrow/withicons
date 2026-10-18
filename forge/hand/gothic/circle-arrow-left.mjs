// forge/hand/gothic/circle-arrow-left.mjs — a stone rose-window roundel with a big gilded arrow pointing left across it:
// a broad enamel-weight shaft into the arrow family's notched ogival head (ruby trefoil); the generated arrow was so
// small and thin in the big disc that its flat head and slim shaft turned into a gold blob, and vanished at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const place = (pts, ox, oy, a) => {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
// radial leads between r0 and r1, and a circle of tracery as four open arcs
const rays = (cx, cy, r0, r1, n, a0) => Array.from({ length: n }, (_, k) => {
  const a = (a0 + 360 * k / n) * RAD
  return [[cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)], [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]]
})
const arc = (cx, cy, r, a0, a1, n = 7) => Array.from({ length: n + 1 }, (_, k) => {
  const a = (a0 + (a1 - a0) * k / n) * RAD
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
})
const ringArcs = (cx, cy, r) => [0, 90, 180, 270].map(a => arc(cx, cy, r, a, a + 90))

// the circle family's roundel: a jointed stone rim round sapphire glass, spokes only in the outer band
const CX = 11.8, CY = 11.8, R = 9.6, W = 1.8, RI = 6.4
const roundel = () => [
  g.stone(g.rim(g.circle(CX, CY, R), W), { ticks: rays(CX, CY, R - W - 0.5, R + 0.5, 12, -75) }),
  g.glass(g.circle(CX, CY, R - W + 0.05), 'c2', { tracery: [...ringArcs(CX, CY, RI), ...rays(CX, CY, RI, R, 16, -90 + 180 / 16)], dark: 0.36, glow: 0.14, deep: 0.16, lw: 0.3 }),
]

// the arrow family's notched ogival head (tip at the origin pointing +x, scale s)
const HEAD = s => [['M', [0, 0]], ['C', [-2.4 * s, -2.3 * s], [-4.9 * s, -4.3 * s], [-6.9 * s, -5.3 * s]],
  ['L', [-5 * s, 0]], ['L', [-6.9 * s, 5.3 * s]], ['C', [-4.9 * s, 4.3 * s], [-2.4 * s, 2.3 * s], [0, 0]]]
const headD = (tx, ty, a, s) => HEAD(s).map(([k, ...p]) => k + place(p, tx, ty, a).map(q => q.join(' ')).join(' ')).join(' ') + ' Z'

// a gilded arrow (the moving part A): shaft from (x0, y0) into a head whose tip is (x1, y1)
function arrow(x0, y0, x1, y1, s, w) {
  const a = Math.atan2(y1 - y0, x1 - x0) / RAD
  const [nk] = place([[-4.6 * s, 0]], x1, y1, a)
  const [tc] = place([[-3.2 * s, 0]], x1, y1, a)
  return [
    g.gilt(g.union(g.seg(x0, y0, nk[0], nk[1], w), g.path(headD(x1, y1, a, s))), { plate: 'A' }),
    g.glass(g.foil(tc[0], tc[1], 1.15 * s, 3, a + 180), 'c1', { outline: 0.2, glint: false, glow: 0.34, plate: 'A' }),
  ]
}

export default function render() {
  return paint([...roundel(), ...arrow(17, CY, 5.6, CY, 0.95, 2.8)].flat(Infinity).filter(Boolean))
}
