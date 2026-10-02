// BAUHAUS kit — shared composed parts, so families (arrows, badges, faces,
// documents, folders, people) are built the same way everywhere.
import * as P from './_bauhaus-prim.mjs'

const RAD = Math.PI / 180
export const BW = 2.5   // colour bar weight
export const IW = 2.25  // ink bar weight

// arrowhead: a soft triangle with its rounded tip landing exactly on (tx, ty), pointing
// along deg (0 east, 90 south). The back edge is a shallow concave arc (notch, u) so the
// head reads as a swept arrowhead, never as a box with a point; the shaft disappears
// into that notch. Tip rounded r (>= 1.25), base corners rounded rb.
//   head(tx, ty, deg, len = 6.5, half = 6.5, r = 1.5, { notch, rb })
export function head(tx, ty, deg, len = 6.5, half = 6.5, r = 1.5, o = {}) {
  const ux = Math.cos(deg * RAD), uy = Math.sin(deg * RAD), nx = -uy, ny = ux
  const { notch = Math.min(0.6, len * 0.09), rb = 1.5 } = o
  const rt = Math.max(r, 1.25)
  // the rounded tip ends short of the vertex: push the triangle forward by that much
  const a = Math.atan2(half, len), t = Math.min(2.4, rt / Math.tan(a))
  const R = t * Math.tan(a), back = R / Math.sin(a) - R // vertex to the fillet's apex
  tx += ux * back; ty += uy * back
  const T = [tx, ty], b = [tx - ux * (len + back), ty - uy * (len + back)]
  return softTri(T, [b[0] + nx * half, b[1] + ny * half], [b[0] - nx * half, b[1] - ny * half], notch, rt, rb)
}
// a soft triangle from tip T and base corners B1, B2: concave back (notch u), tip
// rounded rt, base corners rb. The building block of head() and arcHead().
export function softTri(T, B1, B2, notch = 1, rt = 1.5, rb = 0.95) {
  const c = Math.hypot(B2[0] - B1[0], B2[1] - B1[1]), m = [(B1[0] + B2[0]) / 2, (B1[1] + B2[1]) / 2]
  let sh
  if (notch > 0.05) {
    const R = (c * c / 4 + notch * notch) / (2 * notch)
    // concave: the arc's centre sits behind the base, so its bulge points at the tip
    const fx = T[0] - m[0], fy = T[1] - m[1], fl = Math.hypot(fx, fy) || 1
    const C = [m[0] - fx / fl * (R - notch), m[1] - fy / fl * (R - notch)]
    const cr = (B1[0] - C[0]) * (B2[1] - C[1]) - (B1[1] - C[1]) * (B2[0] - C[0])
    sh = P.path(`M${T[0]} ${T[1]}L${B1[0]} ${B1[1]}A${R} ${R} 0 0 ${cr > 0 ? 1 : 0} ${B2[0]} ${B2[1]}Z`)
  } else sh = P.path(`M${T[0]} ${T[1]}L${B1[0]} ${B1[1]}L${B2[0]} ${B2[1]}Z`)
  return P.soften(sh, v => Math.hypot(v[0] - T[0], v[1] - T[1]) < 1e-3 ? rt : rb, { tmax: 3 })
}
// a straight arrow from (x0, y0) to its tip (x1, y1): ink shaft, red head
export function arrow(x0, y0, x1, y1, o = {}) {
  const { w = BW, len = 7, half = 6.75, shaft = 'ink', tip = 'c1' } = o
  const deg = Math.atan2(y1 - y0, x1 - x0) / RAD
  const ux = Math.cos(deg * RAD), uy = Math.sin(deg * RAD)
  return [[shaft, P.seg2(x0, y0, x1 - ux * len * 0.6, y1 - uy * len * 0.6, w)], [tip, head(x1, y1, deg, len, half)]]
}
// chevron: two bars meeting at (x, y), opening against deg
export function chevron(x, y, deg, arm = 6.5, w = 2.75) {
  const a1 = (deg + 135) * RAD, a2 = (deg - 135) * RAD
  return P.bar([[x + Math.cos(a1) * arm, y + Math.sin(a1) * arm], [x, y], [x + Math.cos(a2) * arm, y + Math.sin(a2) * arm]], w)
}
// small glyphs for discs and badges, centred on (cx, cy), size s (half extent)
export function glyph(kind, cx, cy, s = 2.25, w = 1.75) {
  switch (kind) {
    case 'plus': return P.join(P.seg2(cx - s, cy, cx + s, cy, w), P.seg2(cx, cy - s, cx, cy + s, w))
    case 'minus': return P.seg2(cx - s, cy, cx + s, cy, w)
    case 'x': { const k = s * 0.8; return P.join(P.seg2(cx - k, cy - k, cx + k, cy + k, w), P.seg2(cx - k, cy + k, cx + k, cy - k, w)) }
    case 'check': return P.bar([[cx - s, cy + 0.1 * s], [cx - 0.3 * s, cy + 0.8 * s], [cx + s, cy - 0.7 * s]], w)
    case 'bang': return P.join(P.seg2(cx, cy - s, cx, cy + 0.25 * s, w), P.circle(cx, cy + s * 0.95, w * 0.62))
    case 'dot': return P.circle(cx, cy, s * 0.6)
    case 'up': return P.join(P.seg2(cx, cy + s, cx, cy - s * 0.7, w), P.bar([[cx - s * 0.8, cy - s * 0.1], [cx, cy - s], [cx + s * 0.8, cy - s * 0.1]], w))
    case 'down': return P.join(P.seg2(cx, cy - s, cx, cy + s * 0.7, w), P.bar([[cx - s * 0.8, cy + s * 0.1], [cx, cy + s], [cx + s * 0.8, cy + s * 0.1]], w))
    case 'q': return P.join(P.arc(cx, cy - s * 0.35, s * 0.6, 180, 405, w), P.seg2(cx, cy + 0.2 * s, cx, cy + 0.35 * s, w), P.circle(cx, cy + s * 1.05, w * 0.6))
    default: return P.circle(cx, cy, s * 0.6)
  }
}
// a badge disc with a glyph, cleared from what lies beneath by a moat
export function badge(kind, role = 'c1', cx = 17.5, cy = 17.5, r = 4.5, glyphRole = 'tint', gap = 1.25) {
  return [['cut', P.circle(cx, cy, r + gap)], [role, P.circle(cx, cy, r)], [glyphRole, glyph(kind, cx, cy, r * 0.48, Math.max(1.5, r * 0.38))]]
}
// a clear moat only (for a free-standing modifier)
export const moat = (...ss) => ['cut', ...ss]
// a face: disc, two eye dots, plus mouth parts
export function face(role, extra = [], o = {}) {
  const { eyes = true, ey = 10, ex = 3.25, er = 1.35 } = o
  const L = [[role, P.circle(12, 12, 9.75)]]
  if (eyes) L.push(['ink', P.circle(12 - ex, ey, er), P.circle(12 + ex, ey, er)])
  return L.concat(extra)
}
// document page: a rounded sheet with a quarter-disc dog-ear (foldRole) lifted off
// its top-right corner by a 1u gap; q: a quarter disc in a second primary rising from
// the lower-left corner (null for none)
export function page(role = 'c3', foldRole = 'c2', x0 = 4.5, y0 = 2, x1 = 19.5, y1 = 22, f = 5.5, q = null, qr = 8) {
  const cx = x1 - f, cy = y0 + f
  const body = P.cut(P.rr(x0, y0, x1, y1, 2.5), P.quarter(cx - 1, cy + 1, f + 3, 'ne'))
  const L = [[role, body]]
  if (q) L.push([q, P.clip(P.quarter(x0, y1, qr, 'ne'), body)])
  L.push([foldRole, P.quarter(cx, cy, f, 'ne')])
  return L
}
// folder: a back with a round (half-disc) tab and a front flap with an arched top
export function folder(back = 'c1', front = 'c2', y1 = 20) {
  return [
    [back, P.rr(2, 5.5, 22, y1, 2.5), P.half(7, 6.75, 4.5, 'n')],
    [front, P.rr(2, 10, 22, y1, [0, 0, 2.5, 2.5]), P.cap(22, 10.5, 2, 10.5, 2)],
  ]
}
// person: head disc + half-disc shoulders
export function person(cx = 12, top = 3.5, s = 1, headRole = 'c1', bodyRole = 'c3') {
  return [[bodyRole, P.half(cx, top + 18 * s, 8 * s, 'n')], [headRole, P.circle(cx, top + 4.5 * s, 4.5 * s)]]
}
// text lines: bars at ys from x0 to x1 (x1 may be an array)
export function lines(x0, x1, ys, w = 2) {
  return P.join(...ys.map((y, i) => P.seg2(x0, y, Array.isArray(x1) ? x1[i] : x1, y, w)))
}
// two-arm glyph (chevron, check): one round-joined bent bar. Two colours split it along
// the bisector of its joint, so each arm prints in its own primary and the seam runs
// cleanly through the tip (no overlapping caps, no sliver at the joint). One colour (or
// over set) prints it whole.
export function vee(pts, w = 3, rA = 'c1', rB = 'c3', over = null) {
  const [a, m, b] = pts
  const sh = P.bar([a, m, b], w)
  if (rA === rB || over) return [[over || rA, sh]]
  const ua = norm(a[0] - m[0], a[1] - m[1]), ub = norm(b[0] - m[0], b[1] - m[1])
  let bx = -(ua[0] + ub[0]), by = -(ua[1] + ub[1])
  if (Math.hypot(bx, by) < 1e-6) { bx = -ua[1]; by = ua[0] } // straight: cut square across
  const deg = Math.atan2(by, bx) / RAD
  const nx = Math.sin(deg * RAD), ny = -Math.cos(deg * RAD)
  const aSide = (a[0] - m[0]) * nx + (a[1] - m[1]) * ny > 0
  return split(sh, aSide ? rA : rB, aSide ? rB : rA, m[0], m[1], deg)
}
const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l] }
// chevron points: tip at (x, y) pointing along deg ('e' 0, 's' 90, 'w' 180, 'n' 270)
export function chev(x, y, deg, arm = 6.5) {
  const a1 = (deg + 135) * RAD, a2 = (deg - 135) * RAD
  return [[x + Math.cos(a1) * arm, y + Math.sin(a1) * arm], [x, y], [x + Math.cos(a2) * arm, y + Math.sin(a2) * arm]]
}
// calendar page: body, a header band whose lower edge sags in one big arc, two binder pills
export function calendar(body = 'c3', band = 'c1') {
  const b = P.rr(3, 5, 21, 21, 3)
  return [[body, b], [band, P.clip(b, P.circle(12, -9, 19.5))], ['ink', P.pill(6.75, 2.25, 9.25, 7.75), P.pill(14.75, 2.25, 17.25, 7.75)]]
}
// rounded square container (check-square, square-plus, ...)
export const square = (role = 'c3') => [[role, P.rr(3, 3, 21, 21, 3.5)]]
// disc container (check-circle, x-circle, ...)
export const disc = (role = 'c3', r = 9.75) => [[role, P.circle(12, 12, r)]]
// cloud: a small front bump in one primary peeking over a flat pill base, the big
// bump and the base in another (no sun: that belongs to cloud-sun only)
export function cloud(dy = 0, body = 'c3', lobe = 'c1', k = 1) {
  const t = s => k === 1 ? P.move(s, 0, dy) : P.move(P.scale(s, k, 12, 19.5), 0, dy)
  return [[lobe, t(P.circle(8, 13, 4.5))], [body, t(P.circle(14.5, 10.75, 6)), t(P.pill(2.5, 13, 21.5, 19.5))]]
}
// heart built from its construction: a diamond and two circles on its upper edges
export function heart(cx = 12, cy = 12.5, k = 1) {
  const t = s => k === 1 && cx === 12 && cy === 12.5 ? s : P.move(P.scale(s, k, 12, 12.5), cx - 12, cy - 12.5)
  return {
    left: t(P.join(P.circle(8.5, 9.5, 4.95), P.poly([[12, 6], [12, 20], [5, 13]], [0, 1.5, 0]))),
    right: t(P.join(P.circle(15.5, 9.5, 4.95), P.poly([[12, 6], [19, 13], [12, 20]], [0, 0, 1.5]))),
    all: t(P.join(P.circle(8.5, 9.5, 4.95), P.circle(15.5, 9.5, 4.95), P.poly([[12, 6], [19, 13], [12, 20], [5, 13]], [0, 0, 1.5, 0]))),
  }
}
// arrowhead that rides a circle (cx, cy, r): its base centred on the circle where the
// band ends, its axis half way between the band's tangent there and the chord, so the band
// flows into the head with no kink and the rounded tip lands just outside the circle at
// angle tip (degrees, 0 east, 90 south). dir +1: the arrow travels clockwise into the
// tip, -1 counter-clockwise.
// Returns { shape, base } (base: the angle where the band should end, buried inside).
export function arcHead(cx, cy, r, tip, dir = 1, len = 5.75, half = 5, o = {}) {
  const { bend = 0.5 } = o
  const at = a => [cx + r * Math.cos(a * RAD), cy + r * Math.sin(a * RAD)]
  const half0 = Math.asin(Math.min(1, len / (2 * r))) / RAD // chord vs tangent
  let aB = tip - dir * 2 * half0, T, deg
  for (let k = 0; k < 6; k++) {
    const B = at(aB)
    deg = aB + dir * 90 + dir * half0 * bend // tangent at B turned toward the chord
    T = [B[0] + Math.cos(deg * RAD) * len, B[1] + Math.sin(deg * RAD) * len]
    const got = Math.atan2(T[1] - cy, T[0] - cx) / RAD
    let err = ((tip - got) % 360 + 540) % 360 - 180
    aB += err
  }
  return { shape: head(T[0], T[1], deg, len, half, o.r ?? 1.5, o), base: aB }
}
// curved arrow along a circle: a band from a0 to a1 (degrees, clockwise), round-capped
// at its tail, the head at the a1 end (or at the a0 end pointing back when ccw). The band
// ends flat, buried inside the head, so the joint is one clean silhouette.
// o: { w, len, half, role, tip, ccw, r (tip rounding), rb (base rounding), notch }
export function arcArrow(cx, cy, r, a0, a1, o = {}) {
  const { w = BW, len = 5.75, half = 4.75, role = 'c3', tip = 'c1', ccw = false, r: rt = 1.25, rb = 1.25, notch } = o
  const dir = ccw ? -1 : 1
  const H = arcHead(cx, cy, r, ccw ? a0 : a1, dir, len, half, { r: rt, rb, ...(notch != null ? { notch } : {}) })
  const sink = (len * 0.45) / r / RAD // how far the band runs on under the head
  const body = ccw ? P.arcEnds(cx, cy, r, H.base - sink, a1, w, 'flat', 'round') : P.arcEnds(cx, cy, r, a0, H.base + sink, w, 'round', 'flat')
  return [[role, body], [tip, H.shape]]
}
// split a shape in two along a line: dir 'v' (left | right of x = at), 'h' (above | below
// y = at) or 'd' (the diagonal through (at, at) rising to the right: upper-left | lower-right)
export function halves(sh, ra, rb, dir = 'v', at = 12) {
  const big = 40
  const A = dir === 'v' ? P.rect(-big, -big, at, big) : dir === 'h' ? P.rect(-big, -big, big, at) : P.poly([[at - big, at + big], [at + big, at - big], [at - big, at - big]], 0)
  const B = dir === 'v' ? P.rect(at, -big, big, big) : dir === 'h' ? P.rect(-big, at, big, big) : P.poly([[at - big, at + big], [at + big, at + big], [at + big, at - big]], 0)
  return [[ra, P.clip(sh, A)], [rb, P.clip(sh, B)]]
}
// the "-off" slash: a 1u page-coloured gap either side, then a 2.5u bar on the page
export function slash(x0 = 3.25, y0 = 3.25, x1 = 20.75, y1 = 20.75) {
  return [['cut', P.seg2(x0, y0, x1, y1, 4.5)], ['ink', P.seg2(x0, y0, x1, y1, 2.5)]]
}

// ---------------------------------------------------------------------------------
// Run 8 parts (art direction). The kit is frozen for redrawers after this block.

// split any shape in two along the line through (x, y) at angle deg (0 = horizontal):
// ra prints the side the normal (sin deg, -cos deg) points to (above a horizontal seam,
// right of a vertical one, deg 90), rb the other. The seam is a hairline-exact shared edge, so compose keeps its ends crisp
// while the outer corners stay soft. The general form of halves().
export function split(sh, ra, rb, x = 12, y = 12, deg = 0) {
  const ux = Math.cos(deg * RAD), uy = Math.sin(deg * RAD), nx = uy, ny = -ux, B = 60
  const side = s => P.poly([[x - ux * B, y - uy * B], [x + ux * B, y + uy * B], [x + ux * B + nx * B * s, y + uy * B + ny * B * s], [x - ux * B + nx * B * s, y - uy * B + ny * B * s]], 0)
  return [[ra, P.clip(sh, side(1))], [rb, P.clip(sh, side(-1))]]
}
// disc split in two primaries (the signature Bauhaus body): dir 'v' (ra right) | 'h'
// (ra top) | 'd' (rising diagonal, ra upper-right) or the seam's angle in degrees
export function splitDisc(cx, cy, r, ra = 'c1', rb = 'c3', dir = 'v') {
  const deg = typeof dir === 'number' ? dir : { v: 90, h: 0, d: -45 }[dir] ?? 90
  return split(P.circle(cx, cy, r), ra, rb, cx, cy, deg)
}
// a split chevron: one round-capped bent bar, tip at (x, y) pointing along deg, cut along
// its own axis so each arm prints in its own primary with a clean seam through the tip
// (no overlapping caps, no stray sliver at the joint)
export function chevSplit(x, y, deg, arm = 7, w = 3, ra = 'c3', rb = 'c1') {
  return split(P.bar(chev(x, y, deg, arm), w), ra, rb, x, y, deg)
}
// concentric bands: rings (or arcs a0..a1, round-capped) at radii rs, width w, roles
// cycling through roles. The bullseye, the target, the sound wave.
export function bands(cx, cy, rs, w = 2, roles = ['c1', 'c3'], a0 = 0, a1 = 360) {
  return rs.map((r, i) => [roles[i % roles.length], a1 - a0 >= 360 ? P.ring(cx, cy, r + w / 2, r - w / 2) : P.arc(cx, cy, r, a0, a1, w)])
}
// arch stack: nested n-shaped bands (a rainbow, a portal, a tunnel) standing on y = base,
// centred on x = cx, the arch centres at y = cy, radii rs (outermost first), width w.
// Legs end in round caps on the base line; arcs and legs share flush seams.
export function archStack(cx, cy, base, rs, w = 2.25, roles = ['c1', 'c2', 'c3']) {
  return rs.map((r, i) => [roles[i % roles.length], P.join(
    P.arcEnds(cx, cy, r, 180, 360, w, 'flat', 'flat'),
    ...(base > cy + 0.05 ? [P.seg2(cx - r, cy, cx - r, base, w), P.seg2(cx + r, cy, cx + r, base, w)] : []),
  )])
}
// petal ring: n lens petals around (cx, cy) from radius r0 to r1, each bulging h, roles
// alternating (a flower, a pinwheel, a shutter). start rotates the first petal (degrees,
// 0 = pointing up).
export function petals(cx, cy, n = 6, r0 = 2, r1 = 9, h = 2.5, roles = ['c1', 'c2'], start = 0) {
  const by = new Map()
  for (let i = 0; i < n; i++) {
    const a = (start - 90 + i * 360 / n) * RAD
    const p = P.lens(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, h)
    const role = roles[i % roles.length]
    if (!by.has(role)) by.set(role, [])
    by.get(role).push(p)
  }
  return [...by].map(([role, ss]) => [role, ...ss])
}
// a quarter-disc detail tucked into a corner of a container (the page's dog-ear, the
// calendar's sun, the corner light of a window): the quarter of radius r centred on the
// corner (x, y), opening into the container (dir 'ne' | 'nw' | 'se' | 'sw'), clipped to it
export const cornerQuarter = (container, x, y, r, dir) => P.clip(P.quarter(x, y, r, dir), container)
