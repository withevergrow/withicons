// forge/hand/gothic/circle-chevron-down.mjs — a stone rose-window roundel with a broad gilded spear chevron set low in it,
// enamelled like the chevron family; the generated chevron was small and carried a ruby trefoil in its point,
// so at 16px the gold V and red jewel read as a heart or a shield instead of a down chevron.
// Chevron sized so its rounded ends sit about 1.2u inside the glass edge (arms d 4.0, width 3.0) instead of kissing the rim.
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

// a spear chevron: two arms of width w meeting in a mitred point at (ax, ay) pointing a, each arm d back and d out
function spearPts(ax, ay, a, d, w, tip) {
  const h = w / 2, L = Math.hypot(d, d), o = h * d / L, m = h * L / d
  return place([[-d + o, -d - o], [m + tip, 0], [-d + o, d + o], [-d - o, d - o], [-m, 0], [-d - o, -d + o]], ax, ay, a)
}

// the chevron (the moving part A): gilt with a rounded end on each arm, a ruby enamel inlay along its spine
function chevron(ax, ay, a, d, w) {
  const ends = place([[-d, -d], [-d, d]], ax, ay, a)
  const F = g.union(g.poly(spearPts(ax, ay, a, d, w, 0.7)), ...ends.map(([x, y]) => g.circle(x, y, w / 2)))
  return [
    g.gilt(F, { plate: 'A' }),
    g.glass(g.shrink(F, 1.15), 'c1', { outline: 0.2, tracery: 'none', glint: false, glow: 0.22, dark: 0.12, plate: 'A' }),
  ]
}

export default function render() {
  return paint([...roundel(), ...chevron(CX, 13.4, 90, 4.0, 3.0)].flat(Infinity).filter(Boolean))
}
