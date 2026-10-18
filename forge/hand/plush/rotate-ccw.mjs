// forge/hand/plush/rotate-ccw.mjs — the line design sewn as a tomato tube looping counter-clockwise from the left round
// to the top, ending in a big separate arrowhead at the upper left that points left; the gap sits at the upper left.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const cx = 12.5, cy = 13.25, r = 7.75
  const a0 = 176, a1 = -118
  const pts = P.arcPts(cx, cy, r, a0, a1, 3)
  const [ex, ey] = pts[pts.length - 1]
  // tangent at the end (counter-clockwise = decreasing angle), nudged toward the left so the head reads as pointing left
  const deg = (a1 - 90) + 360 - 14
  const rad = deg * Math.PI / 180, ux = Math.cos(rad), uy = Math.sin(rad)
  const tip = [ex + ux * 4.6, ey + uy * 4.6]
  const bx = tip[0] - ux * 6, by = tip[1] - uy * 6, half = 5
  const head = P.poly([tip, [bx - uy * half, by + ux * half], [bx + ux * 0.9, by + uy * 0.9], [bx + uy * half, by - ux * half]], [1.3, 0.8, 0.6, 0.8])
  const pieces = [
    P.felt('c1', P.bar(pts, 3), { part: 'K', seam: [pts] }),
    P.felt('c1', head, { part: 'A', stitch: false, out: 0.5 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
