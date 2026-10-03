// PASTEL kit — the family parts every Pastel icon is composed from. FROZEN for redrawers.
// Everything returns SHAPES (pass them in a layer) unless its name ends in "Layers" or it says
// it returns layers. Measures follow PASTEL-GUIDE.md §2: containers r 3, bars 2.5-3, ink 1.5-1.75.
import {
  circle, ellipse, ring, arc, seg2, bar, rr, pill, poly, star as starPts, path, join, rot, around, unite,
  move, scale, lens, stroke,
} from './_pastel-prim.mjs'

const RAD = Math.PI / 180
const pt = (cx, cy, r, a) => [cx + r * Math.cos(a * RAD), cy + r * Math.sin(a * RAD)]

// ---------------------------------------------------------------------------------
// weights
export const W = { BAR: 2.75, GLYPH: 3, INK: 1.6, INK_FINE: 1.35, MOAT: 1.2, R: 3 }

// ---------------------------------------------------------------------------------
// containers
export const box = (x0, y0, x1, y1, r = W.R) => rr(x0, y0, x1, y1, r)
export const disc = (cx = 12, cy = 12, r = 9.5) => circle(cx, cy, r)

// a document sheet with a folded top-right corner: { sheet, fold }
// sheet: the page minus its corner; fold: the turned-over flap (paint it 'paper' or a lighter hue)
export function page(x0 = 4.5, y0 = 2.5, x1 = 19.5, y1 = 21.5, f = 5.5, r = 2.5) {
  const sheet = poly([[x0, y0], [x1 - f, y0], [x1, y0 + f], [x1, y1], [x0, y1]], [r, 1.2, 1.2, r, r])
  const fold = poly([[x1 - f, y0 + 0.2], [x1 - f, y0 + f - 0.9], [x1 - f + 0.9, y0 + f], [x1 - 0.2, y0 + f]], [1, 1.1, 1.1, 1])
  return { sheet, fold }
}

// folder: { back, front } — back carries the tab, front is the lower flap
export function folder(x0 = 2.5, y0 = 4, x1 = 21.5, y1 = 20, tab = 7.5) {
  const back = poly([[x0, y0], [x0 + tab, y0], [x0 + tab + 2, y0 + 2.5], [x1, y0 + 2.5], [x1, y1], [x0, y1]], [2.5, 1.5, 1.5, 2.5, 3, 3])
  const front = poly([[x0, y0 + 6], [x1, y0 + 6], [x1, y1], [x0, y1]], [2, 2, 3, 3])
  return { back, front }
}

// calendar: { body, head, rings } — body page, header band, two binder rings
export function calendar(x0 = 3, y0 = 4.5, x1 = 21, y1 = 21, hb = 10) {
  const body = rr(x0, y0, x1, y1, 3.25)
  const head = rr(x0, y0, x1, hb, [3.25, 3.25, 0, 0])
  const rings = join(pill(7, 2.25, 9.5, 7.5), pill(14.5, 2.25, 17, 7.5))
  return { body, head, rings }
}

// cloud: one soft silhouette (three lobes on a pill base), centred on (cx, cy), scale s
export function cloud(cx = 12, cy = 13, s = 1) {
  const c = join(
    pill(-8.75, -0.25, 8.75, 5.5),
    circle(-3.25, -0.25, 4),
    circle(2.25, -2, 5.25),
    circle(6, 1.25, 3.5),
  )
  return unite(move(scale(c, s, 0, 0), cx, cy))
}

// heart: a full, soft heart (cx, cy = visual centre), scale s
export function heart(cx = 12, cy = 12.5, s = 1) {
  const h = path('M0 8 C-3.75 5.25 -9 1.75 -9 -3 C-9 -6 -6.75 -8.25 -4 -8.25 C-2.15 -8.25 -0.8 -7.1 0 -5.7 C0.8 -7.1 2.15 -8.25 4 -8.25 C6.75 -8.25 9 -6 9 -3 C9 1.75 3.75 5.25 0 8 Z')
  return move(scale(h, s, 0, 0), cx, cy)
}

// person: { head, body } — head disc over rounded shoulders; top = top of the head
export function person(cx = 12, top = 2.75, s = 1) {
  const r = 4.25 * s
  const head = circle(cx, top + r, r)
  // shoulders: a soft slab with broad rounded top corners (never a dome)
  const y0 = top + 2 * r + 1.4 * s, w = 8.25 * s, h = 8.85 * s
  const body = rr(cx - w, y0, cx + w, y0 + h, [6.25 * s, 6.25 * s, 2 * s, 2 * s])
  return { head, body }
}

// a rounded five-point star
export const star5 = (cx = 12, cy = 12.5, ro = 10.5, ri = 5, r = 1) => poly(starPts(cx, cy, ro, ri, 5), starPts(0, 0, 1, 1, 5).map((_, i) => i % 2 ? 1.25 : r))
// a four-point sparkle (decoration: keep it wholly off the object)
export const sparkle = (cx, cy, r = 2.5) => poly(starPts(cx, cy, r, r * 0.36, 4), 0.9)

// gear: n teeth around a body disc, one silhouette; hole: optional axle hole radius
export function gear(cx = 12, cy = 12, ro = 10, rb = 7.25, n = 8, tw = 4) {
  const tooth = rr(cx - tw / 2, cy - ro, cx + tw / 2, cy - rb + 1.5, [1.25, 1.25, 0, 0])
  return unite(circle(cx, cy, rb), around(tooth, n, cx, cy))
}

// chat bubble: rounded box with a soft tail at the bottom-left (or 'right')
export function bubble(x0 = 2.5, y0 = 3.5, x1 = 21.5, y1 = 17.5, side = 'left') {
  const b = rr(x0, y0, x1, y1, 4)
  const tail = side === 'left'
    ? poly([[x0 + 3, y1 - 2], [x0 + 8, y1 - 0.5], [x0 + 2.5, y1 + 4]], [1, 1, 1.1])
    : poly([[x1 - 8, y1 - 0.5], [x1 - 3, y1 - 2], [x1 - 2.5, y1 + 4]], [1, 1, 1.1])
  return unite(b, tail)
}

// ---------------------------------------------------------------------------------
// line glyphs (one soft bar each, one hue): arrows, chevrons, checks
// arrow from (x0, y0) to the tip (x1, y1): shaft and a two-arm head, round caps
export function arrow(x0, y0, x1, y1, o = {}) {
  const { w = W.GLYPH, head = 6.25, spread = 45 } = o
  const a = Math.atan2(y1 - y0, x1 - x0) / RAD
  const p1 = pt(x1, y1, head, a + 180 - spread), p2 = pt(x1, y1, head, a + 180 + spread)
  return join(seg2(x0, y0, x1, y1, w), bar([p1, [x1, y1], p2], w))
}
// chevron pointing toward deg (0 = right), tip at (x, y), arms of length arm
export function chevron(x, y, deg = 0, arm = 7, w = W.GLYPH, spread = 45) {
  return bar([pt(x, y, arm, deg + 180 - spread), [x, y], pt(x, y, arm, deg + 180 + spread)], w)
}
export const check = (pts = [[4.5, 12.5], [9.5, 17.5], [19.5, 6.5]], w = W.GLYPH) => bar(pts, w)

// curved arrow: an arc band (centre, radius, degrees a0 -> a1 clockwise) with a head at a1
export function arcArrow(cx, cy, r, a0, a1, o = {}) {
  const { w = W.BAR, head = 5, spread = 45 } = o
  const tip = pt(cx, cy, r, a1)
  const t = a1 + 90 // travel direction (clockwise)
  return join(arc(cx, cy, r, a0, a1, w), bar([pt(tip[0], tip[1], head, t + 180 - spread), tip, pt(tip[0], tip[1], head, t + 180 + spread)], w))
}

// ---------------------------------------------------------------------------------
// small glyphs (ink, or a field): plus minus x check bang dot q, centred, size s
export function glyph(kind, cx, cy, s = 2.5, w = W.INK) {
  switch (kind) {
    case 'plus': return join(seg2(cx - s, cy, cx + s, cy, w), seg2(cx, cy - s, cx, cy + s, w))
    case 'minus': return seg2(cx - s, cy, cx + s, cy, w)
    case 'x': { const k = s * 0.8; return join(seg2(cx - k, cy - k, cx + k, cy + k, w), seg2(cx - k, cy + k, cx + k, cy - k, w)) }
    case 'check': return bar([[cx - s, cy + 0.1 * s], [cx - 0.3 * s, cy + 0.75 * s], [cx + s, cy - 0.7 * s]], w)
    case 'bang': return join(seg2(cx, cy - s, cx, cy + 0.3 * s, w), circle(cx, cy + s, w * 0.6))
    case 'dot': return circle(cx, cy, s * 0.55)
    case 'up': return join(seg2(cx, cy + s, cx, cy - s, w), bar([[cx - s * 0.8, cy - s * 0.2], [cx, cy - s], [cx + s * 0.8, cy - s * 0.2]], w))
    case 'down': return join(seg2(cx, cy - s, cx, cy + s, w), bar([[cx - s * 0.8, cy + s * 0.2], [cx, cy + s], [cx + s * 0.8, cy + s * 0.2]], w))
    default: return circle(cx, cy, s * 0.5)
  }
}

// ---------------------------------------------------------------------------------
// modifiers (return LAYERS: spread them into your composition, last)
// a badge disc with a glyph and a moat cut into everything below
export function badgeLayers(kind, hue = 'mint', cx = 17.5, cy = 17.5, r = 4.75) {
  return [['cut', circle(cx, cy, r + W.MOAT)], [hue + '@S', circle(cx, cy, r)], ['ink@S', glyph(kind, cx, cy, r * 0.48, W.INK)]]
}
// the "-off" slash: a soft bar from top-left to bottom-right with a gap cut around it
export function slashLayers(hue = 'blush', a = [4, 4], b = [20, 20], w = 2.5) {
  return [['cut', seg2(a[0] - 0.5, a[1] - 0.5, b[0] + 0.5, b[1] + 0.5, w + 2 * W.MOAT)], [hue + '.flat@S', seg2(a[0], a[1], b[0], b[1], w)]]
}

// ink text lines (documents, lists): rows at ys from x0 to x1 (x1 may be an array per row)
export function lines(x0, x1, ys, w = W.INK) {
  return join(...ys.map((y, i) => seg2(x0, y, Array.isArray(x1) ? x1[i] : x1, y, w)))
}

// soft wavy steam / scent strokes: one S-curve rising from (x, y) of height h
export const steam = (x, y, h = 4.5, w = 1.75) => stroke(`M${x} ${y} C${x - 1.5} ${y - h * 0.3} ${x + 1.5} ${y - h * 0.6} ${x} ${y - h}`, w)

export { ellipse, ring, lens }
