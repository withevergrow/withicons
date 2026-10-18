// forge/hand/gothic/circle-chevron-right.mjs — a stone roundel round plain sapphire glass (no tracery, no inlay) with one
// big bold gilded spear chevron pointing right; the generated chevron was tiny in a busy tiled medallion.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const place = (pts, ox, oy, a) => {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
const rays = (cx, cy, r0, r1, n, a0) => Array.from({ length: n }, (_, k) => {
  const a = (a0 + 360 * k / n) * RAD
  return [[cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)], [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]]
})

const CX = 11.8, CY = 11.8, R = 9.6, W = 1.8
const roundel = () => [
  g.stone(g.rim(g.circle(CX, CY, R), W), { ticks: rays(CX, CY, R - W - 0.5, R + 0.5, 12, -75) }),
  g.glass(g.circle(CX, CY, R - W + 0.05), 'c2', { tracery: 'none', dark: 0.5, glow: 0.1, deep: 0.2 }),
]

function spearPts(ax, ay, a, d, w, tip) {
  const h = w / 2, L = Math.hypot(d, d), o = h * d / L, m = h * L / d
  return place([[-d + o, -d - o], [m + tip, 0], [-d + o, d + o], [-d - o, d - o], [-m, 0], [-d - o, -d + o]], ax, ay, a)
}
function chevron(ax, ay, a, d, w) {
  const ends = place([[-d, -d], [-d, d]], ax, ay, a)
  return g.gilt(g.union(g.poly(spearPts(ax, ay, a, d, w, 0.7)), ...ends.map(([x, y]) => g.circle(x, y, w / 2))), { plate: 'A', outline: 0.34 })
}

export default function render() {
  return paint([...roundel(), chevron(13.4, CY, 0, 4.2, 3.2)].flat(Infinity).filter(Boolean))
}
