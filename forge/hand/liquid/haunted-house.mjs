// forge/hand/liquid/haunted-house.mjs: a tall pointed clear glass house with a round window and an arched coloured door,
// and a crisp accent crescent moon over its shoulder. The generated house was cluttered and its pink moon read as a
// blob; here the house is one calm silhouette and the moon is a real crescent.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
function inset(P, d) {
  const n = P.length, cx = P.reduce((a, p) => a + p[0], 0) / n, cy = P.reduce((a, p) => a + p[1], 0) / n
  const E = P.map((p, i) => {
    const q = P[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy)
    let nx = -dy / l, ny = dx / l
    if ((cx - p[0]) * nx + (cy - p[1]) * ny < 0) { nx = -nx; ny = -ny }
    return { x: p[0] + nx * d, y: p[1] + ny * d, dx: dx / l, dy: dy / l }
  })
  return P.map((_, i) => {
    const a = E[(i + n - 1) % n], b = E[i]
    const den = a.dx * b.dy - a.dy * b.dx
    const t = ((b.x - a.x) * b.dy - (b.y - a.y) * b.dx) / den
    return [a.x + a.dx * t, a.y + a.dy * t]
  })
}
const poly = P => 'M' + P.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

// the moon: a real crescent, the disc (cx, cy, R) minus the disc offset by (dx, dy) with radius r, as two arcs
function crescent(cx, cy, R, dx, dy, r) {
  const D = Math.hypot(dx, dy), a = (R * R - r * r + D * D) / (2 * D), h = Math.sqrt(R * R - a * a)
  const ux = dx / D, uy = dy / D, mx = cx + ux * a, my = cy + uy * a
  const p1 = [mx - uy * h, my + ux * h], p2 = [mx + uy * h, my - ux * h]
  return `M${r2(p2[0])} ${r2(p2[1])}A${R} ${R} 0 1 0 ${r2(p1[0])} ${r2(p1[1])}A${r} ${r} 0 0 1 ${r2(p2[0])} ${r2(p2[1])}Z`
}
const MC = [19.2, 6.4], MR = 3.5, MD = [1.7, -1.3], Mr = 2.8
const MOON = crescent(MC[0], MC[1], MR, MD[0], MD[1], Mr)
// the bead's centre line sits in the thick middle of the crescent, on the side away from the bite
const MD_ = Math.hypot(MD[0], MD[1]), MT = MR + MD_ - Mr
const MK = [MC[0] - MD[0] / MD_ * (MR - MT / 2), MC[1] - MD[1] / MD_ * (MR - MT / 2)]
const MARK = { pts: [MK, [MK[0] + 0.02, MK[1]]], closed: false, plate: 'S' }
const HOUSE = poly(inset([[2.4, 20.7], [2.4, 11.4], [9.9, 4.0], [17.4, 11.4], [17.4, 20.7]], 1.45))
const CHIMNEY = 'M5.6 4.9V8.8'
const DOOR = 'M8.8 19.4V16.2A1.1 1.1 0 0 1 11 16.2V19.4Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'haunted-house', paths: [],
    lines: [...lines(HOUSE, 'K'), ...lines(CHIMNEY, 'K'), ...lines(DOOR, 'A'), MARK],
    fills: [fill(HOUSE), fill(DOOR), fill(MOON)],
    cutouts: [],
  }) || []
}
