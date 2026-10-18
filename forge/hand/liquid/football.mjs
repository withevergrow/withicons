// forge/hand/liquid/football.mjs: a calm glass football: a clear ball, a large coloured centre pentagon and five big coloured rim patches,
// with no seam grooves (fewer, larger panels so it stays clean at 16-24px).
// Same glass model and light as the generator (_liquid-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, erode } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = n => Math.round(n * 100) / 100
const P = (r, deg) => [r2(12 + r * Math.cos(deg * Math.PI / 180)), r2(12 + r * Math.sin(deg * Math.PI / 180))]
// a rounded polygon (quadratic corners)
function round(pts, r) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const v = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n]
    const la = Math.hypot(a[0] - v[0], a[1] - v[1]), lb = Math.hypot(b[0] - v[0], b[1] - v[1])
    const ka = Math.min(r, la / 2) / la, kb = Math.min(r, lb / 2) / lb
    const p1 = [v[0] + (a[0] - v[0]) * ka, v[1] + (a[1] - v[1]) * ka], p2 = [v[0] + (b[0] - v[0]) * kb, v[1] + (b[1] - v[1]) * kb]
    d += `${i ? 'L' : 'M'}${r2(p1[0])} ${r2(p1[1])}Q${r2(v[0])} ${r2(v[1])} ${r2(p2[0])} ${r2(p2[1])}`
  }
  return d + 'Z'
}

const ANG = [0, 1, 2, 3, 4].map(i => -90 + 72 * i)
const RB = 10.5                                   // ball radius, in skeleton units (the glass adds its own rim)
const BALL = `M${12 + RB} 12A${RB} ${RB} 0 1 1 ${12 - RB} 12A${RB} ${RB} 0 1 1 ${12 + RB} 12Z`
const PENT = round(ANG.map(a => P(5.1, a)), 1.4)
// a rim patch: a wide kite midway between pentagon corners, flaring out to the rim of the ball
const CAPS = ANG.map(a => round([P(6.9, a), P(8.4, a - 25), P(RB, a - 21), P(RB, a), P(RB, a + 21), P(8.4, a + 25)], 1.1))

export default function render(icon) {
  const name = (icon && icon.name) || 'football'
  const lines = [], fills = []
  // a glass piece: the drawn outline T is where the glass should end, so the ring the model grows into glass is T pulled in by half the glass width
  const piece = (d, plate, pull) => {
    const set = erode(setOf(parsePath(d, 0.04).map(s => s.pts)), pull)
    for (const r of set) lines.push({ pts: r, closed: true, plate, pathId: 'p' })
    fills.push({ subs: set.map(r => ({ pts: r, closed: true })), set })
  }
  piece(BALL, 'K', 1.48)
  piece(PENT, 'A', 1.3)
  for (const c of CAPS) piece(c, 'A', 1.3)
  return build({ name, paths: [], cutouts: [], lines, fills })
}
