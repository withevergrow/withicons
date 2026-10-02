// with icons — shared parts for the Live TIME family (clock-time, alarm-clock-time, watch-time, stopwatch,
// timer-ring, digital-clock). Pure, deterministic, every coordinate on the 0.25 grid.
//
// Frames reuse the static siblings' coordinates (forge/icons/clock.json, alarm-clock.json, watch.json, timer.json,
// forge/PARTS.md circle + square containers) so a live icon sits beside its static twin without a weight jump.
// Angles are CLOCK degrees (0 = 12 o'clock, clockwise), as in ./_layout.mjs.
import { snap, circle, rr, polar, arc, hand, clockAngles } from './_layout.mjs'

export { clockAngles }
const f = n => String(snap(n))

// ── frames ────────────────────────────────────────────────────────────────────────────────────────────
export const CLOCK_FACE = 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z' // = PARTS circle container
export const SQUARE_FACE = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z' // = PARTS square

// alarm clock (forge/icons/alarm-clock.json): body r7 at (12,12.5), twin bells, splayed feet
export const ALARM = {
  c: [12, 12.5], r: 7,
  body: circle(12, 12.5, 7),
  // the static bells use r 2.83 (off-grid); r 3 keeps the same chord on the 0.25 grid, a hair flatter
  bells: ['M3 7 A3 3 0 0 1 7 3 Z', 'M17 3 A3 3 0 0 1 21 7 Z'],
  feet: ['M7 17.5 L4.5 20.5', 'M17 17.5 L19.5 20.5'],
}

// wristwatch (forge/icons/watch.json): face r6.5 at the centre + tapered straps; strap/face joins snapped to 6.5/17.5
export const WATCH = {
  round: {
    face: circle(12, 12, 6.5),
    straps: [
      'M8.5 6.5 L9 3.5 A1 1 0 0 1 10 2.5 H14 A1 1 0 0 1 15 3.5 L15.5 6.5',
      'M8.5 17.5 L9 20.5 A1 1 0 0 0 10 21.5 H14 A1 1 0 0 0 15 20.5 L15.5 17.5',
    ],
    fills: [
      circle(12, 12, 6.5),
      'M8.5 6.5 L9 3.5 A1 1 0 0 1 10 2.5 H14 A1 1 0 0 1 15 3.5 L15.5 6.5 A6.5 6.5 0 0 0 8.5 6.5 Z',
      'M8.5 17.5 L9 20.5 A1 1 0 0 0 10 21.5 H14 A1 1 0 0 0 15 20.5 L15.5 17.5 A6.5 6.5 0 0 1 8.5 17.5 Z',
    ],
    hands: { cx: 12, cy: 12, minute: 3.5, hour: 2.25, tail: 1.25 },
  },
  // a squircle case (smartwatch / tank watch) on the same straps
  square: {
    face: rr(5.5, 5.5, 18.5, 18.5, 3),
    straps: [
      'M8.5 5.5 L9 3.5 A1 1 0 0 1 10 2.5 H14 A1 1 0 0 1 15 3.5 L15.5 5.5',
      'M8.5 18.5 L9 20.5 A1 1 0 0 0 10 21.5 H14 A1 1 0 0 0 15 20.5 L15.5 18.5',
    ],
    fills: [
      rr(5.5, 5.5, 18.5, 18.5, 3),
      'M8.5 5.5 L9 3.5 A1 1 0 0 1 10 2.5 H14 A1 1 0 0 1 15 3.5 L15.5 5.5 Z',
      'M8.5 18.5 L9 20.5 A1 1 0 0 0 10 21.5 H14 A1 1 0 0 0 15 20.5 L15.5 18.5 Z',
    ],
    hands: { cx: 12, cy: 12, minute: 3.75, hour: 2.25, tail: 1.25 },
  },
}

// stopwatch (forge/icons/timer.json): face r8 at (12,13.5), crown button on top, two side pushers
export const STOPWATCH = {
  c: [12, 13.5], r: 8,
  face: circle(12, 13.5, 8),
  crown: 'M10 2 H14 M12 2 V5.5',
  pushers: ['M18 7.5 L20 5.5', 'M6 7.5 L4 5.5'],
}

// ── hands ─────────────────────────────────────────────────────────────────────────────────────────────
// One open polyline: minute tip -> pivot -> hour tip, a single stroke with a crisp elbow at the pivot, so every style
// treats the hands as one moving part (and solid knocks them out as one line). The hour hand advances with the minutes
// (clockAngles). `tail` adds a short counterweight behind the pivot on the minute hand: two hands that meet at a
// point otherwise read as a chevron ("v", "^", ">") at 24px; the tail makes it unmistakably a pair of clock hands.
// When the hands overlap the path simply retraces itself.
export function hands(time, { cx = 12, cy = 12, minute = 5.5, hour = 4, tail = 0 } = {}) {
  const a = clockAngles(time)
  const [mx, my] = polar(cx, cy, minute, a.minute), [hx, hy] = polar(cx, cy, hour, a.hour)
  if (!tail) return `M${mx} ${my} L${f(cx)} ${f(cy)} L${hx} ${hy}`
  const [tx, ty] = polar(cx, cy, -tail, a.minute)
  return `M${mx} ${my} L${tx} ${ty} M${f(cx)} ${f(cy)} L${hx} ${hy}`
}

// ── sectors and rings ─────────────────────────────────────────────────────────────────────────────────
// closed pie wedge from 12 o'clock clockwise to `deg` (0 < deg < 360)
export function wedge(cx, cy, r, deg) {
  const [x1, y1] = polar(cx, cy, r, deg)
  return `M${f(cx)} ${f(cy)} V${f(cy - r)} A${f(r)} ${f(r)} 0 ${deg > 180 ? 1 : 0} 1 ${x1} ${y1} Z`
}

// a dot: a 0.25u stub that the round-capped stroke turns into a disc (the font's convention)
export const dot = (x, y) => `M${f(x)} ${f(y)} L${f(x + 0.25)} ${f(y)}`

// the spent part of a ring as dots every `step` degrees strictly inside (from + clear, to - clear), clock degrees
export function spentDots(cx, cy, r, from, to, { step = 30, clear = 20 } = {}) {
  const out = []
  for (let a = 0; a < 360; a += step) {
    if (a <= from + clear - 1e-9 || a >= to - clear + 1e-9) continue
    const [x, y] = polar(cx, cy, r, a)
    out.push(dot(x, y))
  }
  return out
}

export { snap, circle, rr, polar, arc, hand }

// ── time strings ──────────────────────────────────────────────────────────────────────────────────────
// "HH:MM" -> { h, m } (lenient; the runtime already normalises time params)
export function parseTime(t) {
  const m = String(t).match(/^(\d{1,2}):(\d{2})$/)
  return m ? { h: Math.min(23, +m[1]), m: Math.min(59, +m[2]) } : { h: 10, m: 10 }
}
const pad = n => String(n).padStart(2, '0')
// display digits for a digital clock: 12-hour drops the leading zero (9:41), 24-hour keeps it (09:41)
export function clockDigits(t, format = '12h') {
  const { h, m } = parseTime(t)
  if (format === '24h') return { hh: pad(h), mm: pad(m) }
  return { hh: String(h % 12 || 12), mm: pad(m) }
}
