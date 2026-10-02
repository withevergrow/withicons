// with icons — shared parts for the progress / rating / metric family of Live icons (forge/DYNAMIC.md):
// progress-ring, gauge-value, rating-stars, step-number, percent-badge, bar-values.
//
//   fitInCircle(str, cx, cy, R, { maxCap = 7, minCap = 4 })  text() whose centreline box fits inside a circle of
//                                                             radius R (corners included), largest cap first; null if none
//   star(cx, cy, R, ratio)                                    closed 5-point star d (point up), snapped to 0.25
//   halfStar(cx, cy, R, ratio)                                closed LEFT half of that star (cut on the vertical axis)
//   checkMark(cx, cy, s = 1)                                  open check stroke centred on (cx, cy), ~9u wide at s = 1
//   dot(x, y)                                                 a 0.25u stub the stroke rounds into a 2u disc
//   clamp01(v)
import { text, measure, snap } from './_font.mjs'

const f = n => String(snap(n))
export const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0))

// caps tried, largest first: large drawings from 7 to 6, then the small drawings from 5.75 down
const CAPS = []
for (let c = 7; c >= 6; c -= 0.25) CAPS.push(c)
for (let c = 5.75; c >= 3.5; c -= 0.25) CAPS.push(c)

export function fitInCircle(str, cx, cy, R, { maxCap = 7, minCap = 4, tracking = 0 } = {}) {
  for (const cap of CAPS) {
    if (cap > maxCap || cap < minCap) continue
    const m = measure(str, { size: cap, tracking })
    if (Math.hypot(m.width / 2, m.height / 2) <= R) return text(str, { x: cx, y: cy, size: cap, tracking })
  }
  return null
}

const pt = (cx, cy, r, a) => { const t = (a - 90) * Math.PI / 180; return [snap(cx + r * Math.cos(t)), snap(cy + r * Math.sin(t))] }

function starPts(cx, cy, R, ratio = 0.42) {
  const out = []
  for (let k = 0; k < 10; k++) out.push(pt(cx, cy, k % 2 ? R * ratio : R, k * 36))
  return out
}
export function star(cx, cy, R, ratio) {
  const p = starPts(cx, cy, R, ratio)
  return 'M' + p.map(([x, y]) => `${x} ${y}`).join(' L') + ' Z'
}
export function halfStar(cx, cy, R, ratio) {
  // top tip (0), then counter-clockwise through the left side down to the bottom inner vertex (5 = 180°)
  const p = starPts(cx, cy, R, ratio)
  const left = [p[0], p[9], p[8], p[7], p[6], p[5]]
  return 'M' + left.map(([x, y]) => `${x} ${y}`).join(' L') + ' Z'
}
export const checkMark = (cx, cy, s = 1) =>
  `M${f(cx - 4 * s)} ${f(cy + 0.25 * s)} L${f(cx - 1.25 * s)} ${f(cy + 3 * s)} L${f(cx + 4.25 * s)} ${f(cy - 3 * s)}`
export const dot = (x, y) => `M${f(x)} ${f(y)} V${f(y + 0.25)}`
