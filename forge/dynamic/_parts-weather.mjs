// with icons — shared parts for the Live weather family (weather, thermometer-level, humidity, uv-index, wind-speed).
// Pure, deterministic, every coordinate snapped to 0.25 (forge/DYNAMIC.md).
//
//   cloud({ cx, yb, h, open })        three-lobe cloud, flat bottom at yb, height h (width = 1.45h). open: no bottom stroke
//                                     -> { d (stroke), fill (closed), x0, x1, top }
//   sun({ cx, cy, r, rIn, rOut, keep }) disc + rays at clock angles, a ray is kept when keep(x0,y0,x1,y1) is true
//                                     -> { disc, rays: [d] }
//   crescent(cx, cy, r, { a1, a2, k }) closed crescent moon (lit side on the left/bottom), k = inner/outer radius
//   drop(cx, tipY, cy, r)             closed teardrop: tip at (cx, tipY), round body centred (cx, cy) radius r
//   sparkle(cx, cy, s)                a four-point twinkle as two short crossing strokes
//   firstFit(candidates, box, opts)   the first string in candidates that fitText() can place -> text() result or null
import { fitText } from './_font.mjs'
import { snap, circle, polar } from './_layout.mjs'

const f = n => String(snap(n))
const P = ([x, y]) => `${f(x)} ${f(y)}`

// upper intersection (smaller y) of two circles
function meet(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy)
  const l = (a.r * a.r - b.r * b.r + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a.r * a.r - l * l))
  const mx = a.x + dx * l / d, my = a.y + dy * l / d
  const p1 = [mx + h * dy / d, my - h * dx / d], p2 = [mx - h * dy / d, my + h * dx / d]
  const p = p1[1] < p2[1] ? p1 : p2
  // snap to the 0.25 grid point that stays closest to BOTH circles (so the arcs never bulge)
  const err = ([x, y]) => Math.abs(Math.hypot(x - a.x, y - a.y) - a.r) + Math.abs(Math.hypot(x - b.x, y - b.y) - b.r)
  let best = null
  for (const x of [Math.floor(p[0] * 4) / 4, Math.ceil(p[0] * 4) / 4]) for (const y of [Math.floor(p[1] * 4) / 4, Math.ceil(p[1] * 4) / 4])
    if (!best || err([x, y]) < err(best)) best = [x, y]
  return best
}
// sweep-1 (clockwise on screen) arc on circle c from p to q
function cw(c, p, q) {
  const a0 = Math.atan2(p[1] - c.y, p[0] - c.x), a1 = Math.atan2(q[1] - c.y, q[0] - c.x)
  let span = a1 - a0; while (span < 0) span += 2 * Math.PI
  return `A${f(c.r)} ${f(c.r)} 0 ${span > Math.PI ? 1 : 0} 1 ${P(q)}`
}

export function cloud({ cx = 12, yb = 19, h = 13, open = false } = {}) {
  const W = 1.45 * h, x0 = cx - W / 2, x1 = cx + W / 2
  const L = { r: 0.33 * h }, R = { r: 0.3 * h }, T = { r: 0.45 * h }
  L.x = x0 + L.r; L.y = yb - L.r
  R.x = x1 - R.r; R.y = yb - R.r
  T.x = x0 + 0.52 * W; T.y = yb - h + T.r
  for (const c of [L, R, T]) { c.r = snap(c.r); c.x = snap(c.x); c.y = snap(c.y) }
  L.y = yb - L.r; R.y = yb - R.r; T.y = yb - h + T.r
  const s = [L.x, yb], e = [R.x, yb], p1 = meet(L, T), p2 = meet(T, R)
  // every lobe arc is split at its extreme point so no arc spans ~180deg (snapped endpoints would bulge it)
  const lw = [L.x - L.r, L.y], tt = [T.x, T.y - T.r], re = [R.x + R.r, R.y]
  const body = `M${P(s)} ${cw(L, s, lw)} ${cw(L, lw, p1)} ${cw(T, p1, tt)} ${cw(T, tt, p2)} ${cw(R, p2, re)} ${cw(R, re, e)}`
  return { d: open ? body : body + ' Z', fill: body + ' Z', x0: snap(x0), x1: snap(x1), top: snap(yb - h), L, R, T }
}

export function sun({ cx = 12, cy = 12, r = 4.5, rIn = 8, rOut = 10, angles = [0, 45, 90, 135, 180, 225, 270, 315], keep = () => true } = {}) {
  const rays = []
  for (const a of angles) {
    const [x0, y0] = polar(cx, cy, rIn, a), [x1, y1] = polar(cx, cy, rOut, a)
    if (keep(x0, y0, x1, y1, a)) rays.push(`M${x0} ${y0} L${x1} ${y1}`)
  }
  return { disc: circle(cx, cy, r), rays }
}

export function crescent(cx = 12, cy = 12, r = 9, { a1 = 96, a2 = 354, k = 0.79 } = {}) {
  const p = polar(cx, cy, r, a1), q = polar(cx, cy, r, a2)
  return `M${P(p)} A${f(r)} ${f(r)} 0 1 1 ${P(q)} A${f(r * k)} ${f(r * k)} 0 0 0 ${P(p)} Z`
}

export function drop(cx = 12, tipY = 2.5, cy = 14.5, r = 7) {
  const H = cy - tipY
  return `M${f(cx)} ${f(tipY)} C${f(cx + 0.357 * r)} ${f(tipY + 0.29 * H)} ${f(cx + r)} ${f(cy - 0.375 * H)} ${f(cx + r)} ${f(cy)} ` +
    `A${f(r)} ${f(r)} 0 0 1 ${f(cx - r)} ${f(cy)} C${f(cx - r)} ${f(cy - 0.375 * H)} ${f(cx - 0.357 * r)} ${f(tipY + 0.29 * H)} ${f(cx)} ${f(tipY)} Z`
}

export const sparkle = (cx, cy, s = 1.25) => `M${f(cx)} ${f(cy - s)} V${f(cy + s)} M${f(cx - s)} ${f(cy)} H${f(cx + s)}`

export function firstFit(candidates, box, opts) {
  for (const c of candidates) {
    if (!c) continue
    const t = fitText(c, box, opts)
    if (t) return t
  }
  return null
}
