// forge/hand/liquid/gold-ingot.mjs: a pyramid of three beveled gold bars (two below, one above), each a clear front
// face under a coloured top face. The generated stack ran its bars together into one lumpy mass because
// their thick outlines grew into each other; here each bar is drawn inset by the glass' own growth, so a clean gap
// stays between every bar.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
// shrink a convex polygon by d (the style's strokes grow every outline back out by about this much)
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
const bar = (x0, x1, yb, yt, s) => [[x0, yb], [x1, yb], [x1 - s, yt], [x0 + s, yt]]

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

// one beveled ingot: a sloping front face (clear glass) under a narrower top face (coloured glass), a clean gap between,
// each drawn inset by the glass' own growth. Both faces share the ingot's straight sloping sides.
const KG = 0.95, AG = 0.8
function ingot(x0, x1, yb, yt, s) {
  const h = yb - yt, X = (y, side) => side ? x1 - s * (yb - y) / h : x0 + s * (yb - y) / h
  const ym = yb - h * 0.55, gap = 0.55
  const front = [[X(yb, 0), yb], [X(yb, 1), yb], [X(ym, 1), ym], [X(ym, 0), ym]]
  const top = [[X(ym - gap, 0), ym - gap], [X(ym - gap, 1), ym - gap], [X(yt, 1), yt], [X(yt, 0), yt]]
  return { front: poly(inset(front, KG)), top: poly(inset(top, AG)) }
}
const B = [ingot(0.9, 11.8, 21.4, 13.1, 2.4), ingot(12.2, 23.1, 21.4, 13.1, 2.4), ingot(5.4, 18.6, 12.3, 3.2, 2.8)]

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'gold-ingot', paths: [],
    lines: B.flatMap(b => [...lines(b.front, 'K'), ...lines(b.top, 'A')]),
    fills: B.flatMap(b => [fill(b.front), fill(b.top)]),
    cutouts: [],
  }) || []
}
