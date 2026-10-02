// with icons — shared parts for the "misc" Live icons (avatar-initials, map-pin-number, speech-bubble-text,
// ticket-number, dice). Pure and deterministic.
//
//   fitInside(str, { outline, obstacles, cx, ys, minCap, maxCap, clearance })
//       The largest text (font cap 7 -> minCap, 0.25 steps) whose real glyph centrelines stay `clearance` u inside
//       the closed `outline` path (default 3.5u = wall ink 1 + white 1.5 + text ink 1) and keep away from each
//       obstacle { x, y, r } (r = centreline distance the glyphs must keep from the point).
//       Tries each vertical centre in `ys` (cap middles) at every size; the smallest sizes (minCap .. minCap + 0.5)
//       are also tried 0.25u and 0.5u tighter before giving up. Returns text() or null.
//   fitChain(candidates, opts)    the first candidate string that fits with fitInside (graceful fallbacks)
//   dot(cx, cy, r)                a small closed circle (pips, status dots): a stroked disc in line styles
//   ringCut(cx, cy, R, bx, by, c) the two points where a ring of radius R (centre cx,cy) meets a clearance circle
//                                 of radius c around (bx,by): [[x,y] start, [x,y] end] going clockwise on the ring
//   rotPt([x,y], deg, about)      rotate a point (clockwise degrees in screen space) and snap to 0.25
import { text, measure, snap } from './_font.mjs'
import { parsePath, distToPolyline, pointInRing } from '../kernel/geom.mjs'

export const f = n => String(snap(n))
export const dot = (cx, cy, r) => `M${f(cx + r)} ${f(cy)} A${f(r)} ${f(r)} 0 0 1 ${f(cx - r)} ${f(cy)} A${f(r)} ${f(r)} 0 0 1 ${f(cx + r)} ${f(cy)} Z`

const ringsCache = new Map()
function ringsOf(d) {
  let r = ringsCache.get(d)
  if (!r) { r = parsePath(d, 0.25).filter(s => s.closed || s.pts.length > 2).map(s => s.pts); ringsCache.set(d, r) }
  return r
}

// caps from the large drawings down to the small ones (the font switches drawings below 6)
function capList(minCap, maxCap) {
  const out = []
  for (let c = 7; c >= minCap - 1e-9; c -= 0.25) if (c <= maxCap + 1e-9) out.push(+c.toFixed(2))
  return out
}

function glyphPoints(paths) {
  const pts = []
  for (const d of paths) for (const s of parsePath(d, 0.5)) for (const p of s.pts) pts.push(p)
  return pts
}

export function fitInside(str, { outline, obstacles = [], cx = 12, ys = [12], minCap = 4, maxCap = 7, clearance = 3.5, tracking } = {}) {
  const s = String(str ?? '')
  if (!s.trim()) return null
  const rings = ringsOf(outline)
  let xs = Infinity, xe = -Infinity
  for (const r of rings) for (const p of r) { if (p[0] < xs) xs = p[0]; if (p[0] > xe) xe = p[0] }
  const maxW = xe - xs - 2 * clearance
  // the text shrinks to minCap, and the smallest sizes are tried a quarter and half a unit tighter, before the
  // caller ever shortens it
  // (only the smallest sizes are tried tighter: above them a word fits better one size down, and it keeps
  // build() well under 5 ms)
  const tracks = cap => tracking !== undefined ? [tracking] : cap <= minCap + 0.5 + 1e-9 ? [0, -0.25, -0.5] : [0]
  for (const cap of capList(minCap, maxCap)) for (const tr of tracks(cap)) {
    if (measure(s, { size: cap, tracking: tr }).width > maxW + 1e-9) continue
    for (const y of ys) {
      const t = text(s, { x: snap(cx), y: snap(y), size: cap, tracking: tr })
      if (!t.paths.length) return null
      const pts = glyphPoints(t.paths)
      let ok = true
      for (const p of pts) {
        // inside the outline (even-odd over its rings) and far enough from every wall
        let inside = false
        for (const r of rings) if (pointInRing(p, r)) inside = !inside
        if (!inside) { ok = false; break }
        for (const r of rings) if (distToPolyline(p, r, true) < clearance - 1e-6) { ok = false; break }
        if (!ok) break
        for (const o of obstacles) if (Math.hypot(p[0] - o.x, p[1] - o.y) < o.r - 1e-6) { ok = false; break }
        if (!ok) break
      }
      if (ok) return t
    }
  }
  return null
}

export function fitChain(candidates, opts) {
  for (const c of candidates) {
    if (!c || !String(c).trim()) continue
    const t = fitInside(c, opts)
    if (t) return { t, str: c }
  }
  return null
}

// where a ring (R around cx,cy) crosses a clearance circle (c around bx,by); points ordered so that the ring
// arc that AVOIDS the badge runs clockwise (SVG sweep 1) from `a` to `b` the long way round
export function ringCut(cx, cy, R, bx, by, c) {
  const dx = bx - cx, dy = by - cy, d = Math.hypot(dx, dy)
  const a = (R * R - c * c + d * d) / (2 * d), h = Math.sqrt(Math.max(0, R * R - a * a))
  const mx = cx + a * dx / d, my = cy + a * dy / d
  const p1 = [mx + h * dy / d, my - h * dx / d], p2 = [mx - h * dy / d, my + h * dx / d]
  return [p2, p1].map(p => p.map(v => snap(v)))
}

export function rotPt([x, y], deg, [ax, ay] = [12, 12]) {
  const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t)
  return [snap(ax + (x - ax) * c - (y - ay) * s), snap(ay + (x - ax) * s + (y - ay) * c)]
}
