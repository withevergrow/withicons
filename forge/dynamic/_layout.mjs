// with icons — layout helpers for Live icon generators (forge/DYNAMIC.md). Pure, deterministic, snapped.
//
//   snap(n, q = 0.25)                         round to the grid (0.25 for text/hands, pass 0.5 for frames)
//   rr(x0, y0, x1, y1, r = 2)                 closed rounded rectangle d (Z), clockwise from the top-left corner
//   circle(cx, cy, r)                         closed circle d as two arcs (Z)
//   arc(cx, cy, r, a0, a1)                    open arc d; angles in CLOCK degrees (0 = 12 o'clock, 90 = 3 o'clock, clockwise)
//   polar(cx, cy, r, a)                       [x, y] at clock angle a (snapped)
//   hand(cx, cy, len, a, tail = 0)            open line d from the centre (or a tail behind it) to the tip at clock angle a
//   clockAngles('HH:MM')                      { hour, minute } clock angles (hour hand advances with minutes)
//   textBox(frame, { inset = 1.5, sw = 2 })   centreline box for fitText() inside a frame's wall centrelines:
//                                             frame {x0,y0,x1,y1} -> shrunk by sw/2 (wall ink) + inset (white) + sw/2 (text ink)
//   inset(box, dx, dy = dx)                   shrink a box
//   levelWidth(x0, x1, level, minVisible = 0) a fill's right edge for a 0..1 level, snapped to 0.5
//   fmtNum(n, { decimals = 0, max = 4 })      a number as a string that fits `max` chars ("99+" style overflow is the caller's call)
import { snap } from './_font.mjs'
export { snap }

const f = n => String(snap(n))
const rad = a => (a - 90) * Math.PI / 180 // clock degrees -> radians (0 = up)

export function rr(x0, y0, x1, y1, r = 2) {
  r = Math.max(0, Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2))
  if (!r) return `M${f(x0)} ${f(y0)} H${f(x1)} V${f(y1)} H${f(x0)} Z`
  return `M${f(x0 + r)} ${f(y0)} H${f(x1 - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y0 + r)} V${f(y1 - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x1 - r)} ${f(y1)} H${f(x0 + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0)} ${f(y1 - r)} V${f(y0 + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0 + r)} ${f(y0)} Z`
}
export const circle = (cx, cy, r) => `M${f(cx + r)} ${f(cy)} A${f(r)} ${f(r)} 0 0 1 ${f(cx - r)} ${f(cy)} A${f(r)} ${f(r)} 0 0 1 ${f(cx + r)} ${f(cy)} Z`
export const polar = (cx, cy, r, a) => [snap(cx + r * Math.cos(rad(a))), snap(cy + r * Math.sin(rad(a)))]
export function arc(cx, cy, r, a0, a1) {
  const span = a1 - a0
  if (Math.abs(span) >= 360) return circle(cx, cy, r).replace(/ Z$/, '')
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1)
  return `M${x0} ${y0} A${f(r)} ${f(r)} 0 ${Math.abs(span) > 180 ? 1 : 0} ${span > 0 ? 1 : 0} ${x1} ${y1}`
}
export function hand(cx, cy, len, a, tail = 0) {
  const [x0, y0] = tail ? polar(cx, cy, -tail, a) : [snap(cx), snap(cy)], [x1, y1] = polar(cx, cy, len, a)
  return `M${x0} ${y0} L${x1} ${y1}`
}
export function clockAngles(t = '10:10') {
  const m = String(t).match(/^(\d{1,2}):(\d{2})$/) || [0, 10, 10]
  const hh = (+m[1]) % 12, mm = Math.min(59, +m[2])
  return { hour: hh * 30 + mm * 0.5, minute: mm * 6 }
}
export const inset = (b, dx, dy = dx) => ({ x0: b.x0 + dx, y0: b.y0 + dy, x1: b.x1 - dx, y1: b.y1 - dy })
export const textBox = (frame, { inset: gap = 1.5, sw = 2 } = {}) => inset(frame, sw + gap)
export const levelWidth = (x0, x1, level, minVisible = 0) => {
  const l = Math.max(0, Math.min(1, level))
  return l <= 0 ? x0 : snap(x0 + Math.max(minVisible, (x1 - x0) * l), 0.5)
}
export function fmtNum(n, { decimals = 0, max = 4 } = {}) {
  let s = Number(n).toFixed(decimals)
  if (decimals && s.length > max) s = Number(n).toFixed(0)
  return s
}
