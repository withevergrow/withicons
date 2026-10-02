// BAUHAUS primitives — the geometric vocabulary every Bauhaus icon is composed from.
//
// A shape is a list of closed subpaths of exact segments (lines and circular arcs,
// plus Béziers only for raw paths). Solids wind clockwise on screen (positive
// shoelace area with y down); holes wind the other way, so every colour layer
// is one nonzero path and a hole is real geometry, never paint.
//
//   circle ring disc-with-hole, half / quarter / sector discs, arcs with round
//   caps, stadium bars, pills, arches, rounded rectangles and rounded polygons
//   (per-corner radii), lenses (petals, leaves, eyes), drops (pins, flames)
//
// Booleans that need more than "a hole fully inside a solid" fall back to exact
// polygon booleans of the flattened outlines (kernel/bool.mjs).
import { parsePath, area, pointInRing, simplify } from '../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, roundStrokeSet } from '../kernel/bool.mjs'
import { segments as parseSegs } from './_bauhaus-path.mjs'

const RAD = Math.PI / 180
const pt = (cx, cy, r, a) => [cx + r * Math.cos(a * RAD), cy + r * Math.sin(a * RAD)]

// ---------------------------------------------------------------------------------
// subpath builder: segs = [{c:'M'|'L'|'A'|'C'|'Q'|'Z', ...}]
const M = (x, y) => ({ c: 'M', x, y })
const L = (x, y) => ({ c: 'L', x, y })
const A = (r, large, sweep, x, y) => ({ c: 'A', rx: r, ry: r, rot: 0, fa: large ? 1 : 0, fs: sweep ? 1 : 0, x, y })
const Z = () => ({ c: 'Z' })

const shape = subs => ({ subs })
export const isShape = s => s && Array.isArray(s.subs)

// reverse one closed subpath
function revSub(sub) {
  const pts = [], segs = []
  let x = 0, y = 0
  for (const s of sub) {
    if (s.c === 'M') { x = s.x; y = s.y; pts.push([x, y]); continue }
    if (s.c === 'Z') continue
    segs.push({ ...s, x0: x, y0: y }); x = s.x; y = s.y
  }
  if (!segs.length) return sub
  const out = [M(x, y)]
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i]
    if (s.c === 'L') out.push(L(s.x0, s.y0))
    else if (s.c === 'A') out.push({ ...A(s.rx, s.fa, !s.fs, s.x0, s.y0), ry: s.ry, rot: s.rot })
    else if (s.c === 'C') out.push({ c: 'C', x1: s.x2, y1: s.y2, x2: s.x1, y2: s.y1, x: s.x0, y: s.y0 })
    else if (s.c === 'Q') out.push({ c: 'Q', x1: s.x1, y1: s.y1, x: s.x0, y: s.y0 })
  }
  out.push(Z())
  return out
}
const fmt = n => { let s = (Math.round(n * 100) / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, ''); if (s === '-0') s = '0'; return s.replace(/^(-?)0\./, '$1.') }
const j = arr => { let out = '', prev = null; for (const v of arr) { out += prev === null || v.startsWith('-') || (v.startsWith('.') && prev.includes('.')) ? v : ' ' + v; prev = v } return out }
function subD(sub) {
  let d = ''
  for (const s of sub) {
    switch (s.c) {
      case 'M': d += 'M' + j([fmt(s.x), fmt(s.y)]); break
      case 'L': d += 'L' + j([fmt(s.x), fmt(s.y)]); break
      case 'A': d += 'A' + j([fmt(s.rx), fmt(s.ry), s.rx === s.ry ? '0' : fmt(s.rot || 0), s.fa ? '1' : '0', s.fs ? '1' : '0', fmt(s.x), fmt(s.y)]); break
      case 'C': d += 'C' + j([fmt(s.x1), fmt(s.y1), fmt(s.x2), fmt(s.y2), fmt(s.x), fmt(s.y)]); break
      case 'Q': d += 'Q' + j([fmt(s.x1), fmt(s.y1), fmt(s.x), fmt(s.y)]); break
      case 'Z': d += 'Z'; break
    }
  }
  return d
}
export const shapeD = s => s.subs.map(subD).join('')

// flattened rings of one subpath (kernel parser flattens arcs and curves)
const flatSub = sub => { try { const p = parsePath(subD(sub), 0.4); return p.length ? p[0].pts : [] } catch { return [] } }
const signedArea = sub => area(flatSub(sub))
// make a subpath wind as a solid (+1) or a hole (-1)
const orient = (sub, sign = 1) => (signedArea(sub) * sign < 0 ? revSub(sub) : sub)

// ---------------------------------------------------------------------------------
// primitives (all solids, clockwise)

export function circle(cx, cy, r) {
  return shape([[M(cx - r, cy), A(r, 0, 1, cx + r, cy), A(r, 0, 1, cx - r, cy), Z()]])
}
// axis-aligned ellipse, and its half (dir 'n' upper / 's' lower)
const AE = (rx, ry, large, sweep, x, y) => ({ c: 'A', rx, ry, rot: 0, fa: large ? 1 : 0, fs: sweep ? 1 : 0, x, y })
export function ellipse(cx, cy, rx, ry) {
  return shape([[M(cx - rx, cy), AE(rx, ry, 0, 1, cx + rx, cy), AE(rx, ry, 0, 1, cx - rx, cy), Z()]])
}
export function ehalf(cx, cy, rx, ry, dir = 's') {
  return dir === 's' ? shape([[M(cx + rx, cy), AE(rx, ry, 0, 1, cx - rx, cy), Z()]]) : shape([[M(cx - rx, cy), AE(rx, ry, 0, 1, cx + rx, cy), Z()]])
}
// ring: outer radius ro, inner radius ri
export function ring(cx, cy, ro, ri) {
  return shape([circle(cx, cy, ro).subs[0], revSub(circle(cx, cy, ri).subs[0])])
}
// pie sector from angle a0 to a1 (degrees, 0 = east, 90 = south, clockwise)
export function sector(cx, cy, r, a0, a1) {
  const s = a1 - a0
  if (s >= 359.99) return circle(cx, cy, r)
  const p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1)
  return shape([[M(cx, cy), L(...p0), A(r, s > 180, 1, ...p1), Z()]])
}
const DIR = { e: 0, se: 45, s: 90, sw: 135, w: 180, nw: 225, n: 270, ne: 315 }
// half disc whose round side points to dir ('n' = dome)
export const half = (cx, cy, r, dir = 'n') => { const a = DIR[dir]; return segment(cx, cy, r, a - 90, a + 90) }
// quarter disc (fan) with its corner at (cx, cy), opening toward dir ('ne','nw','se','sw')
export const quarter = (cx, cy, r, dir = 'ne') => { const a = DIR[dir]; return sector(cx, cy, r, a - 45, a + 45) }
// circular segment between angles (the chord closes it): a half disc when the span is 180
export function segment(cx, cy, r, a0, a1) {
  const s = a1 - a0, p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1)
  return shape([[M(...p0), A(r, s > 180, 1, ...p1), Z()]])
}
// annular sector (band) between radii ri..ro, angles a0..a1, flat ends
export function band(cx, cy, ro, ri, a0, a1) {
  const s = a1 - a0
  if (s >= 359.99) return ring(cx, cy, ro, ri)
  const o0 = pt(cx, cy, ro, a0), o1 = pt(cx, cy, ro, a1), i1 = pt(cx, cy, ri, a1), i0 = pt(cx, cy, ri, a0)
  return shape([[M(...o0), A(ro, s > 180, 1, ...o1), L(...i1), A(ri, s > 180, 0, ...i0), Z()]])
}
// arc of centre radius r and width w with round caps (or flat: caps = false)
export function arc(cx, cy, r, a0, a1, w = 2.5, caps = true) {
  if (a1 < a0) [a0, a1] = [a1, a0]
  const s = a1 - a0, h = w / 2
  if (s >= 359.99) return ring(cx, cy, r + h, r - h)
  if (!caps) return band(cx, cy, r + h, r - h, a0, a1)
  const o0 = pt(cx, cy, r + h, a0), o1 = pt(cx, cy, r + h, a1), i1 = pt(cx, cy, r - h, a1), i0 = pt(cx, cy, r - h, a0)
  return shape([[M(...o0), A(r + h, s > 180, 1, ...o1), A(h, 0, 1, ...i1), A(r - h, s > 180, 0, ...i0), A(h, 0, 1, ...o0), Z()]])
}
// arc band with a chosen end at each side: 'round' (a semicircular cap) or 'flat' (a
// cut on the radius line; compose softens its two corners unless it is buried under
// another field, e.g. the flat end an arcArrow hides inside its head)
export function arcEnds(cx, cy, r, a0, a1, w = 2.5, e0 = 'round', e1 = 'round') {
  if (a1 < a0) { [a0, a1] = [a1, a0]; [e0, e1] = [e1, e0] }
  const s = a1 - a0, h = w / 2
  if (s >= 359.99) return ring(cx, cy, r + h, r - h)
  const o0 = pt(cx, cy, r + h, a0), o1 = pt(cx, cy, r + h, a1), i1 = pt(cx, cy, r - h, a1), i0 = pt(cx, cy, r - h, a0)
  const end = (e, p) => e === 'round' ? A(h, 0, 1, ...p) : L(...p)
  return shape([[M(...o0), A(r + h, s > 180, 1, ...o1), end(e1, i1), A(r - h, s > 180, 0, ...i0), end(e0, o0), Z()]])
}
// stadium bar from a to b, width w (a dot when a == b)
export function seg2(ax, ay, bx, by, w = 2.5) {
  const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy), h = w / 2
  if (l < 1e-6) return circle(ax, ay, h)
  const nx = -dy / l * h, ny = dx / l * h
  return shape([orient([M(ax + nx, ay + ny), L(bx + nx, by + ny), A(h, 0, 0, bx - nx, by - ny), L(ax - nx, ay - ny), A(h, 0, 0, ax + nx, ay + ny), Z()])])
}
// round-capped, round-joined polyline: bar([[x,y],...], w)
export function bar(pts, w = 2.5, closed = false) {
  if (pts.length === 1) return circle(pts[0][0], pts[0][1], w / 2)
  const subs = []
  const n = closed ? pts.length : pts.length - 1
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; subs.push(...seg2(a[0], a[1], b[0], b[1], w).subs) }
  return shape(subs)
}
export const dot = (cx, cy, r = 1.25) => circle(cx, cy, r)

// rounded rectangle: r = number or [tl, tr, br, bl]
export function rr(x0, y0, x1, y1, r = 2) {
  if (x1 < x0) [x0, x1] = [x1, x0]
  if (y1 < y0) [y0, y1] = [y1, y0]
  const R = (Array.isArray(r) ? r : [r, r, r, r]).map(v => Math.max(0, Math.min(v, (x1 - x0) / 2, (y1 - y0) / 2)))
  const [tl, tr, br, bl] = R
  const s = [M(x0 + tl, y0), L(x1 - tr, y0)]
  if (tr) s.push(A(tr, 0, 1, x1, y0 + tr))
  s.push(L(x1, y1 - br))
  if (br) s.push(A(br, 0, 1, x1 - br, y1))
  s.push(L(x0 + bl, y1))
  if (bl) s.push(A(bl, 0, 1, x0, y1 - bl))
  s.push(L(x0, y0 + tl))
  if (tl) s.push(A(tl, 0, 1, x0 + tl, y0))
  s.push(Z())
  return shape([s.filter((q, i) => !(q.c === 'L' && i > 0 && s[i - 1].x === q.x && s[i - 1].y === q.y))])
}
export const rect = (x0, y0, x1, y1) => rr(x0, y0, x1, y1, 0)
export const pill = (x0, y0, x1, y1) => rr(x0, y0, x1, y1, Math.min(Math.abs(x1 - x0), Math.abs(y1 - y0)) / 2)
// arch: a portal, round on the side dir points to (default 'n'), other corners rb
export function arch(x0, y0, x1, y1, dir = 'n', rb = 0) {
  const w = Math.abs(x1 - x0), h = Math.abs(y1 - y0), R = (dir === 'n' || dir === 's') ? w / 2 : h / 2
  const c = { n: [R, R, rb, rb], s: [rb, rb, R, R], e: [rb, R, R, rb], w: [R, rb, rb, R] }[dir]
  return rr(x0, y0, x1, y1, c)
}
// rounded polygon: corners rounded with radius r (number or per-corner array);
// radii shrink where an edge is too short. Concave corners round the other way.
export function poly(P, r = 1.5) {
  let pts = P.map(p => [p[0], p[1]])
  // house rule: a rounded corner is never tighter than 0.9u (0 stays a hidden joint)
  let rs = (Array.isArray(r) ? r.slice() : pts.map(() => r)).map(v => v > 0 && v < 0.9 ? 0.9 : v)
  if (area(pts) < 0) { pts.reverse(); rs.reverse() }
  const n = pts.length
  const corners = pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n]
    const ux = a[0] - p[0], uy = a[1] - p[1], vx = b[0] - p[0], vy = b[1] - p[1]
    const lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy)
    const cos = Math.max(-1, Math.min(1, (ux * vx + uy * vy) / (lu * lv)))
    const th = Math.acos(cos)
    const z = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])
    return { p, lu, lv, u: [ux / lu, uy / lu], v: [vx / lv, vy / lv], th, convex: z > 0, r: rs[i] || 0 }
  })
  // tangent lengths, limited so neighbouring roundings never overlap
  for (const c of corners) c.t = c.r > 0 && c.th > 1e-3 && c.th < Math.PI - 1e-3 ? c.r / Math.tan(c.th / 2) : 0
  for (let i = 0; i < n; i++) {
    const c = corners[i], nx = corners[(i + 1) % n], len = c.lv
    if (c.t + nx.t > len) { const k = len / (c.t + nx.t); c.t2 = Math.min(c.t2 ?? c.t, c.t * k); nx.t1 = Math.min(nx.t1 ?? nx.t, nx.t * k) }
  }
  const s = []
  corners.forEach((c, i) => {
    const t = Math.min(c.t, c.t1 ?? c.t, c.t2 ?? c.t)
    if (t <= 1e-6) { s.push(i ? L(...c.p) : M(...c.p)); return }
    const rr2 = t * Math.tan(c.th / 2)
    const p1 = [c.p[0] + c.u[0] * t, c.p[1] + c.u[1] * t], p2 = [c.p[0] + c.v[0] * t, c.p[1] + c.v[1] * t]
    s.push(i ? L(...p1) : M(...p1))
    s.push(A(rr2, 0, c.convex ? 1 : 0, ...p2))
  })
  s.push(Z())
  return shape([s])
}
// triangle with rounded corners
export const tri = (a, b, c, r = 1.5) => poly([a, b, c], r)
// lens between a and b: two arcs, each bulging h from the chord (a petal, a leaf, an eye)
export function lens(ax, ay, bx, by, h = 3, h2 = h) {
  const c = Math.hypot(bx - ax, by - ay)
  const R1 = (c * c / 4 + h * h) / (2 * h), R2 = (c * c / 4 + h2 * h2) / (2 * h2)
  return shape([orient([M(ax, ay), A(R1, h > c / 2, 1, bx, by), A(R2, h2 > c / 2, 1, ax, ay), Z()])])
}
// one-sided lens: a chord closed by one arc bulging h (a dome on any axis)
export function cap(ax, ay, bx, by, h = 3) {
  const c = Math.hypot(bx - ax, by - ay), R = (c * c / 4 + h * h) / (2 * h)
  return shape([orient([M(ax, ay), A(R, h > c / 2, 1, bx, by), Z()])])
}
// drop: a circle (cx, cy, r) drawn out to a point (tx, ty), the point rounded by rt
export function drop(cx, cy, r, tx, ty, rt = 0.6) {
  const dx = tx - cx, dy = ty - cy, d = Math.hypot(dx, dy)
  if (d <= r * 1.05) return circle(cx, cy, r)
  const base = Math.atan2(dy, dx) / RAD, off = Math.acos(r / d) / RAD
  const t1 = pt(cx, cy, r, base + off), t2 = pt(cx, cy, r, base - off)
  if (rt <= 0) return shape([orient([M(...t1), L(tx, ty), L(...t2), A(r, 1, 0, ...t1), Z()])])
  // round the tip: back off along both tangents
  const ang = Math.asin(r / d) // half angle at the tip
  const t = rt / Math.tan(ang), ux1 = (t1[0] - tx), uy1 = (t1[1] - ty), l1 = Math.hypot(ux1, uy1)
  const ux2 = (t2[0] - tx), uy2 = (t2[1] - ty), l2 = Math.hypot(ux2, uy2)
  const q1 = [tx + ux1 / l1 * t, ty + uy1 / l1 * t], q2 = [tx + ux2 / l2 * t, ty + uy2 / l2 * t]
  const rr2 = t * Math.tan(ang)
  return shape([orient([M(...t1), L(...q1), A(rr2, 0, 0, ...q2), L(...t2), A(r, 1, 0, ...t1), Z()])])
}
// regular polygon / star helpers (points only)
export const ngon = (cx, cy, r, n, rot = -90) => Array.from({ length: n }, (_, i) => pt(cx, cy, r, rot + i * 360 / n))
export const star = (cx, cy, ro, ri, n = 5, rot = -90) => Array.from({ length: 2 * n }, (_, i) => pt(cx, cy, i % 2 ? ri : ro, rot + i * 180 / n))
// raw SVG path data (any commands); every subpath is made to wind as a solid
export function path(d) {
  const segs = parseSegs(d), subs = []
  let cur = null
  for (const s of segs) {
    if (s.c === 'M') { cur = [s]; subs.push(cur); continue }
    if (!cur) continue
    cur.push(s)
  }
  return shape(subs.map(sub => { if (sub.at(-1).c !== 'Z') sub.push(Z()); return orient(sub, 1) }))
}
// raw path data whose subpaths keep their nesting (even-odd): outer solid, nested holes
export function pathEO(d) {
  const sh = path(d)
  const rings = sh.subs.map(flatSub)
  return shape(sh.subs.map((sub, i) => {
    const depth = rings.filter((r, k) => k !== i && r.length > 2 && rings[i].length && pointInRing(rings[i][0], r)).length
    return depth % 2 ? revSub(sub) : sub
  }))
}

// ---------------------------------------------------------------------------------
// transforms
function mapSub(sub, f, flip = false) {
  const out = sub.map(s => {
    if (s.c === 'Z') return s
    const q = { ...s };
    [q.x, q.y] = f([s.x, s.y])
    if (s.c === 'C') { [q.x1, q.y1] = f([s.x1, s.y1]); [q.x2, q.y2] = f([s.x2, s.y2]) }
    if (s.c === 'Q') [q.x1, q.y1] = f([s.x1, s.y1])
    if (s.c === 'A' && flip) q.fs = s.fs ? 0 : 1
    return q
  })
  return flip ? revSub(out) : out
}
export const move = (s, dx, dy) => shape(s.subs.map(sub => mapSub(sub, ([x, y]) => [x + dx, y + dy])))
export function rot(s, deg, cx = 12, cy = 12) {
  const c = Math.cos(deg * RAD), si = Math.sin(deg * RAD)
  return shape(s.subs.map(sub => mapSub(sub, ([x, y]) => [cx + (x - cx) * c - (y - cy) * si, cy + (x - cx) * si + (y - cy) * c]).map(q => q.c === 'A' && q.rx !== q.ry ? { ...q, rot: (q.rot || 0) + deg } : q)))
}
// mirror across the vertical line x = ax (or horizontal y = ay when axis = 'y')
export const flipX = (s, ax = 12) => shape(s.subs.map(sub => mapSub(sub, ([x, y]) => [2 * ax - x, y], true)))
export const flipY = (s, ay = 12) => shape(s.subs.map(sub => mapSub(sub, ([x, y]) => [x, 2 * ay - y], true)))
export function scale(s, k, cx = 12, cy = 12) {
  return shape(s.subs.map(sub => mapSub(sub, ([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]).map(q => q.c === 'A' ? { ...q, rx: q.rx * k, ry: q.ry * k } : q)))
}
// n copies rotated about (cx, cy)
export const around = (s, n, cx = 12, cy = 12, start = 0) => join(...Array.from({ length: n }, (_, i) => rot(s, start + i * 360 / n, cx, cy)))
export const join = (...ss) => shape(ss.filter(Boolean).flatMap(s => s.subs))

// ---------------------------------------------------------------------------------
// booleans
// region set of a shape: union of the solids minus union of the holes
export function setOfShape(s) {
  const sol = [], hol = []
  for (const sub of s.subs) {
    const r = flatSub(sub)
    if (r.length < 3) continue
    ;(area(r) >= 0 ? sol : hol).push([r])
  }
  let u = sol.length ? unionSets(sol) : []
  if (hol.length) u = differenceSets(u, unionSets(hol))
  return u
}
const setShape = set => shape(set.map(r => r.map((p, i) => i ? L(p[0], p[1]) : M(p[0], p[1])).concat([Z()])).map(sub => orient(sub, 1)))
// region sets come back as even-odd rings: rebuild nesting
function shapeOfSet(set) {
  set = set.map(r => simplify(r, 0.02, true))
  const subs = set.filter(r => r.length > 2).map(r => {
    const sub = r.map((p, i) => i ? L(p[0], p[1]) : M(p[0], p[1])).concat([Z()])
    const depth = set.filter(o => o !== r && o.length > 2 && pointInRing(r[0], o)).length
    return orient(sub, depth % 2 ? -1 : 1)
  })
  return shape(subs)
}
// a minus b...: subpaths the cut never reaches stay exact; holes that sit fully
// inside one solid stay exact arcs; anything else goes through polygon booleans
const bbOf = r => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of r) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y } return [x0, y0, x1, y1] }
const meet = (a, b) => a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3]
export function cut(a, ...bs) {
  bs = bs.filter(Boolean)
  if (!bs.length) return a
  const aR = a.subs.map(flatSub), aB = aR.map(bbOf)
  const bR = bs.flatMap(b => b.subs.map(flatSub)), bB = bR.map(bbOf)
  const hit = aB.map(x => bB.some(y => meet(x, y)))
  if (!hit.some(Boolean)) return a
  // grow the affected group by anything overlapping it (a hole and its solid)
  for (let pass = 0; pass < 2; pass++) aB.forEach((x, i) => { if (!hit[i] && aB.some((y, k) => hit[k] && meet(x, y))) hit[i] = true })
  const keep = a.subs.filter((_, i) => !hit[i]), sub = shape(a.subs.filter((_, i) => hit[i]))
  const sR = aR.filter((_, i) => hit[i])
  const easy = bR.every(r => {
    if (area(r) < 0) return false
    const host = sR.filter(h => area(h) > 0 && r.every(p => pointInRing(p, h)))
    if (host.length !== 1) return false
    return sR.every(h => h === host[0] || !r.some(p => pointInRing(p, h)) && !h.some(p => pointInRing(p, r)))
  })
  if (easy) return shape([...a.subs, ...bs.flatMap(b => b.subs.map(q => revSub(q)))])
  // the cut misses every affected outline entirely: nothing to do
  if (bR.every(r => !sR.some(h => r.some(p => pointInRing(p, h)) || h.some(p => pointInRing(p, r))))) return a
  return shape([...keep, ...shapeOfSet(differenceSets(setOfShape(sub), unionSets(bs.map(setOfShape)))).subs])
}
// any path data stroked at width w with round caps and joins (curves: Béziers,
// S-bends). Each smooth run becomes one outline (left offset, round cap, right
// offset, round cap); sharp corners split the runs so every join is round.
const turnOf = (a, b, c) => { const ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1]; const l = Math.hypot(ux, uy) * Math.hypot(vx, vy); return l ? Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / l))) : 0 }
function runOutline(pts, h) {
  const n = pts.length
  if (n < 2) return circle(pts[0][0], pts[0][1], h).subs[0]
  const nor = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return [-dy / l, dx / l]
  })
  const L1 = simplify(pts.map((p, i) => [p[0] + nor[i][0] * h, p[1] + nor[i][1] * h]), 0.015)
  const R1 = simplify(pts.map((p, i) => [p[0] - nor[i][0] * h, p[1] - nor[i][1] * h]).reverse(), 0.015)
  const sub = [M(...L1[0])]
  for (let i = 1; i < L1.length; i++) sub.push(L(...L1[i]))
  sub.push(A(h, 0, 0, ...R1[0]))
  for (let i = 1; i < R1.length; i++) sub.push(L(...R1[i]))
  sub.push(A(h, 0, 0, ...L1[0]), Z())
  return orient(sub, 1)
}
export function stroke(d, w = 2.5) {
  let subs
  try { subs = parsePath(d, 0.2) } catch { return shape([]) }
  const out = [], h = w / 2
  for (const q of subs) {
    let pts = q.pts.filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-6)
    if (q.closed && pts.length > 2) pts = [...pts, pts[0]]
    // split at sharp corners
    let cur = [pts[0]]
    for (let i = 1; i < pts.length; i++) {
      cur.push(pts[i])
      if (i < pts.length - 1 && turnOf(pts[i - 1], pts[i], pts[i + 1]) > 0.6) { out.push(runOutline(cur, h)); cur = [pts[i]] }
    }
    out.push(runOutline(cur, h))
  }
  return shape(out)
}
export const clip = (a, b) => shapeOfSet(intersectSets(setOfShape(a), setOfShape(b)))
export const unite = (...ss) => shapeOfSet(unionSets(ss.filter(Boolean).map(setOfShape)))
void setShape

// ---------------------------------------------------------------------------------
// sampling: nonzero winding of a shape at a point, and a shape's sample points
export const ringsOf = s => s.subs.map(flatSub).filter(r => r.length > 2)
export function windingAt(p, rings) {
  let w = 0
  const [x, y] = p
  for (const r of rings) for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (a[1] <= y) { if (b[1] > y && (b[0] - a[0]) * (y - a[1]) - (x - a[0]) * (b[1] - a[1]) > 0) w++ }
    else if (b[1] <= y && (b[0] - a[0]) * (y - a[1]) - (x - a[0]) * (b[1] - a[1]) < 0) w--
  }
  return w
}
export function samplesOf(rings, step = 0.35) {
  const out = []
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const r of rings) for (const [x, y] of r) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
  for (let y = y0 + step / 2; y < y1; y += step) for (let x = x0 + step / 2; x < x1; x += step) if (windingAt([x, y], rings)) out.push([x, y])
  return out
}

// ---------------------------------------------------------------------------------
// soften: round the sharp corners of a shape (the house rule: no hard corners).
// Works on the exact segments: every vertex where the outline turns by more than
// `min` degrees toward the subpath's own inside (a convex corner of a solid, the
// corner of a hole) is trimmed back by t along both sides (across several segments
// when the sides are flattened polylines) and closed with a circular fillet through
// both trimmed ends: exact (tangent) where the sides are straight, a hair off on arcs.
//   f      corner radius (u): t = f / tan(interior / 2), capped at tmax and at 45% of
//          the outline to the neighbouring corners. A number, or a function
//          (vertex [x, y], index) -> radius (0 keeps that corner sharp).
//   o.keep (vertex [x, y]) -> true keeps a corner sharp (compose keeps the corners
//          that sit flush against another field: split discs, chords on a bar).
// Corners next to Bézier segments (raw paths) and elliptical arcs stay as drawn.
const TAU = Math.PI * 2
function arcGeom(x0, y0, s) {
  if (Math.abs(s.rx - s.ry) > 1e-6) return null
  const x1p = (x0 - s.x) / 2, y1p = (y0 - s.y) / 2, d2 = x1p * x1p + y1p * y1p
  if (d2 < 1e-12) return null
  const r = Math.max(s.rx, Math.sqrt(d2))
  const k = (s.fa !== s.fs ? 1 : -1) * Math.sqrt(Math.max(0, (r * r - d2) / d2))
  const cx = k * y1p + (x0 + s.x) / 2, cy = -k * x1p + (y0 + s.y) / 2
  const t0 = Math.atan2(y0 - cy, x0 - cx), t1 = Math.atan2(s.y - cy, s.x - cx)
  let dt = t1 - t0
  if (s.fs && dt < 0) dt += TAU
  if (!s.fs && dt > 0) dt -= TAU
  if (Math.abs(dt) < 1e-9) dt = s.fa ? (s.fs ? TAU : -TAU) : dt
  return { cx, cy, r, t0, dt }
}
function edgesOf(sub) {
  const E = []
  let x = 0, y = 0, sx = 0, sy = 0
  for (const s of sub) {
    if (s.c === 'M') { x = sx = s.x; y = sy = s.y; continue }
    if (s.c === 'Z') break
    const p0 = [x, y], p1 = [s.x, s.y]
    if (s.c === 'L') {
      const l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
      if (l > 1e-6) { const u = [(p1[0] - p0[0]) / l, (p1[1] - p0[1]) / l]; E.push({ k: 'L', p0, p1, len: l, d0: u, d1: u }) }
    } else if (s.c === 'A' && arcGeom(x, y, s)) {
      const g = arcGeom(x, y, s), sg = Math.sign(g.dt)
      const tan = t => [-Math.sin(t) * sg, Math.cos(t) * sg]
      E.push({ k: 'A', p0, p1, len: Math.abs(g.dt) * g.r, g, d0: tan(g.t0), d1: tan(g.t0 + g.dt), seg: s })
    } else {
      // Bézier or elliptical arc: kept whole, its ends never rounded
      const c1 = s.c === 'C' ? [s.x1, s.y1] : s.c === 'Q' ? [s.x1, s.y1] : p1, c2 = s.c === 'C' ? [s.x2, s.y2] : c1
      const dir = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }
      E.push({ k: 'X', p0, p1, len: Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), d0: dir(p0, c1), d1: dir(c2, p1), seg: s })
    }
    x = s.x; y = s.y
  }
  if (E.length && Math.hypot(x - sx, y - sy) > 1e-6) {
    const p0 = [x, y], p1 = [sx, sy], l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), u = [(p1[0] - p0[0]) / l, (p1[1] - p0[1]) / l]
    E.push({ k: 'L', p0, p1, len: l, d0: u, d1: u })
  }
  return E
}
const edgeAt = (e, s) => {
  if (e.k === 'A') { const t = e.g.t0 + e.g.dt * (s / e.len); return [e.g.cx + e.g.r * Math.cos(t), e.g.cy + e.g.r * Math.sin(t)] }
  const k = e.len ? s / e.len : 0
  return [e.p0[0] + (e.p1[0] - e.p0[0]) * k, e.p0[1] + (e.p1[1] - e.p0[1]) * k]
}
// the part of edge e from local length a to b, as one segment (its start is implied)
const edgePiece = (e, a, b) => {
  const p = edgeAt(e, b)
  if (e.k === 'A') return A(e.g.r, Math.abs(e.g.dt * (b - a) / e.len) > Math.PI, e.g.dt > 0, ...p)
  if (e.k === 'X') return { ...e.seg }
  return L(...p)
}
export function soften(sh, f = 0.8, o = {}) {
  const { min = 28, tmax = 1.6, keep = null } = o
  const fr = typeof f === 'function' ? f : () => f
  const out = sh.subs.map(sub => {
    const E = edgesOf(sub), n = E.length
    if (n < 2) return sub
    const sign = signedArea(sub) >= 0 ? 1 : -1
    const pos = [], tot = E.reduce((a, e) => (pos.push(a), a + e.len), 0)
    const C = []
    for (let i = 0; i < n; i++) {
      const a = E[(i - 1 + n) % n], b = E[i]
      if (a.k === 'X' || b.k === 'X') continue
      const cr = a.d1[0] * b.d0[1] - a.d1[1] * b.d0[0], dot = a.d1[0] * b.d0[0] + a.d1[1] * b.d0[1]
      const th = Math.atan2(Math.abs(cr), dot)
      if (th < min * RAD || cr * sign <= 0) continue
      const v = b.p0, r = fr(v, i)
      if (!(r > 0) || (keep && keep(v))) continue
      C.push({ i, v, th, cr, t: Math.min(tmax, r / Math.tan((Math.PI - th) / 2)), s: pos[i] })
    }
    if (!C.length) return sub
    // never trim into a rigid edge or past the neighbouring corner
    C.forEach((c, k) => {
      const pv = C[(k - 1 + C.length) % C.length], nx = C[(k + 1) % C.length]
      const back = C.length === 1 ? tot : ((c.s - pv.s) + tot) % tot || tot, fwd = C.length === 1 ? tot : ((nx.s - c.s) + tot) % tot || tot
      let lim = 0.45 * Math.min(back, fwd)
      for (let s = 0, j = c.i; s < c.t && s < tot; s += E[j].len, j = (j + 1) % n) if (E[j].k === 'X') { lim = Math.min(lim, s); break }
      for (let s = 0, j = (c.i - 1 + n) % n; s < c.t && s < tot; s += E[j].len, j = (j - 1 + n) % n) if (E[j].k === 'X') { lim = Math.min(lim, s); break }
      c.t = Math.min(c.t, lim)
    })
    const live = C.filter(c => c.t > 0.02)
    if (!live.length) return sub
    // point at loop position s, and the segments covering loop positions a..b (b > a)
    const locate = s => { s = ((s % tot) + tot) % tot; let i = 0; while (i < n - 1 && pos[i + 1] <= s) i++; return [i, s - pos[i]] }
    const pointAt = s => { const [i, l] = locate(s); return edgeAt(E[i], l) }
    const range = (a, b) => {
      const segs = []
      for (let base = Math.floor(a / tot) * tot; base < b; base += tot) for (let i = 0; i < n; i++) {
        const s0 = base + pos[i], s1 = s0 + E[i].len
        const lo = Math.max(a, s0), hi = Math.min(b, s1)
        if (hi - lo > 1e-6) segs.push(edgePiece(E[i], lo - s0, hi - s0))
      }
      return segs
    }
    const res = [M(...pointAt(live[0].s + live[0].t))]
    live.forEach((c, k) => {
      const nx = live[(k + 1) % live.length]
      let b = nx.s - nx.t
      const a = c.s + c.t
      while (b <= a) b += tot
      res.push(...range(a, b))
      // a circular fillet through both trimmed ends (exact where the sides are straight)
      const p1 = pointAt(nx.s - nx.t), p2 = pointAt(nx.s + nx.t)
      const ch = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), R = ch / (2 * Math.sin(nx.th / 2))
      res.push(A(R, 0, nx.cr > 0 ? 1 : 0, ...p2))
    })
    res.push(Z())
    return res
  })
  return shape(out)
}
