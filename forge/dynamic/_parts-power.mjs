// with icons — shared parts for the Live "power & signal" family (forge/DYNAMIC.md):
// battery-level, battery-percent, battery-charging-level, battery-vertical, signal-bars, wifi-strength,
// cellular-tech, volume-level. Pure, deterministic, every coordinate on the 0.25 grid.
//
// Family language (keep it when adding siblings):
//   - LEVEL is solid ink ("slab"): a rounded bar drawn as a perimeter + serpentine rows, so it reads as a solid
//     bar in line (1.75 stroke, rows <= 1.5u apart) and as ink in solid (a hole in the cutout, like the static battery).
//   - MISSING steps are GHOSTS: a dotted trace of the bar/arc that is not lit, so "2 of 4" reads without colour.
//   - LOW is a WARNING SHAPE: the level gives way to a "!" (no colour needed).
import { snap } from './_font.mjs'
import { rr, polar, circle } from './_layout.mjs'

const f = n => String(snap(n))
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0))

// ── batteries ──────────────────────────────────────────────────────────────────────────────────────────
// One battery language for the family (redrawn 2026-10): a 17.5 x 11 body (a phone battery's 1.6 : 1, never a
// square chip), r 2.5 corners, a 4u terminal nub 2.5u off the wall, and the charge as ONE solid rounded bar inset
// 2.75u from the wall centreline (1u of white at line weight), drawn as a closed "solid:" mark so every style shows
// a solid bar (outline styles fill it; filled styles keep it as an island in the hollowed body).
export const H = {
  body: rr(2, 6.5, 19.5, 17.5, 2.5),
  terminal: 'M22 10 V14',
  inner: rr(3, 7.5, 18.5, 16.5, 1.5),         // inside edge of the wall ink (cutout base)
  bar: { x0: 4.75, x1: 16.75, y0: 9.25, y1: 14.75 }, // the full charge bar
}
// Upright: the same body turned a quarter, terminal on top
export const V = {
  body: rr(6.5, 4.5, 17.5, 22, 2.5),
  terminal: 'M10 2 H14',
  inner: rr(7.5, 5.5, 16.5, 21, 1.5),
  bar: { x0: 9.25, x1: 14.75, y0: 7.25, y1: 19.25 }, // fills from the bottom (y1) up to y0
}
// the charge bar: { d, region } = slab() over the bar's centreline box (the ink reaches 0.875u further at line
// weight): a perimeter + serpentine rows, which every style draws as solid ink (outline styles as a filled bar,
// filled styles as an island left standing in the hollowed body via `region`)
export function chargeBar(x0, y0, x1, y1) {
  return slab(x0 + 0.875, y0 + 0.875, x1 - 0.875, y1 - 0.875)
}

// A solid bar of ink made of strokes: perimeter + serpentine rows (pitch <= 1.5u so a 1.75 line leaves no slits).
// Returns { d (open path for `paths`), region (closed ink outline for cutout holes) } or null when empty.
export function slab(x0, y0, x1, y1) {
  ;[x0, y0, x1, y1] = [x0, y0, x1, y1].map(v => snap(v))
  if (x1 < x0) [x0, x1] = [x1, x0]
  if (y1 < y0) [y0, y1] = [y1, y0]
  const w = x1 - x0, h = y1 - y0
  const region = rr(x0 - 1, y0 - 1, x1 + 1, y1 + 1, 1)
  if (w < 0.5 && h < 0.5) return { d: `M${f(x0)} ${f(y0)} V${f(y0 + 0.25)}`, region }
  if (w < 0.5) return { d: `M${f(x0)} ${f(y0)} V${f(y1)}`, region }
  if (h < 0.5) return { d: `M${f(x0)} ${f(y0)} H${f(x1)}`, region }
  let d = `M${f(x0)} ${f(y0)} H${f(x1)} V${f(y1)} H${f(x0)} V${f(y0)}`
  if (w >= h) {
    const n = Math.ceil(h / 1.5)
    let atRight = false
    for (let i = 1; i < n; i++) {
      d += ` V${f(y0 + (h * i) / n)} H${f(atRight ? x0 : x1)}`
      atRight = !atRight
    }
  } else {
    const n = Math.ceil(w / 1.5)
    let atBottom = false
    for (let i = 1; i < n; i++) {
      d += ` H${f(x0 + (w * i) / n)} V${f(atBottom ? y0 : y1)}`
      atBottom = !atBottom
    }
  }
  return { d, region }
}

// the right/top edge of a level slab: 0 -> nothing, any level > 0 -> at least a stub
export const levelEdge = (a, b, level) => snap(a + (b - a) * clamp01(level), 0.25)

// "!" warning glyph as two strokes: stem (top..stemEnd) + dot. Returns [d, d].
export const bang = (x, top, stemEnd, dotY) => [`M${f(x)} ${f(top)} V${f(stemEnd)}`, dot(x, dotY)]

// ── dots / ghosts ──────────────────────────────────────────────────────────────────────────────────────
// a dot: a 0.25u stub the round cap turns into a disc (same as the font's dots)
export const dot = (x, y) => `M${f(x)} ${f(y - 0.125)} V${f(y - 0.125 + 0.25)}`

// dots evenly spaced on a segment, ends included; n chosen so neighbours are >= `pitch` apart
export function dotsOnLine(x0, y0, x1, y1, pitch = 3.5) {
  const len = Math.hypot(x1 - x0, y1 - y0)
  const n = Math.max(1, Math.floor(len / pitch + 1e-9) + 1)
  if (n === 1) return [dot(x0, y0)]
  return Array.from({ length: n }, (_, i) => dot(x0 + ((x1 - x0) * i) / (n - 1), y0 + ((y1 - y0) * i) / (n - 1)))
}
// dots evenly spaced on an arc (clock degrees, 0 = up), ends included
export function dotsOnArc(cx, cy, r, a0, a1, pitch = 3.5) {
  const len = (Math.abs(a1 - a0) * Math.PI * r) / 180
  const n = Math.max(2, Math.floor(len / pitch + 1e-9) + 1)
  return Array.from({ length: n }, (_, i) => { const [x, y] = polar(cx, cy, r, a0 + ((a1 - a0) * i) / (n - 1)); return dot(x, y) })
}

// GHOST DASHES: the inactive trace of an arc / a bar as short dashes (centreline `dash` long), ends included and
// evenly spread, so "2 of 3" reads as two lit arcs and one dashed one, never as a cloud of beads
export function dashesOnArc(cx, cy, r, a0, a1, { dash = 2.5, gap = 3.5 } = {}) {
  const len = (Math.abs(a1 - a0) * Math.PI * r) / 180
  const n = Math.max(2, Math.round((len + gap) / (dash + gap)))
  const span = a1 - a0
  const dA = (dash / len) * span
  return Array.from({ length: n }, (_, i) => {
    const m = a0 + dA / 2 + ((span - dA) * i) / (n - 1)
    return arcD(cx, cy, r, m - dA / 2, m + dA / 2)
  })
}
// the remaining track of a ring from clock angle a0 to a1 (clockwise), as ghost dashes that keep `clear` u of
// centreline arc clear of the lit arc's round caps at both ends; a full ring (a0 === a1 mod 360) is dashed evenly
export function trackDashes(cx, cy, r, a0, a1, { clear = 3.5, dash = 2.5, gap = 3.5 } = {}) {
  const deg = u => (u / (Math.PI * r)) * 180
  if (Math.abs(((a1 - a0) % 360 + 360) % 360) < 1e-6) {
    const n = Math.max(3, Math.round((2 * Math.PI * r) / (dash + gap))), dA = deg(dash)
    return Array.from({ length: n }, (_, i) => arcD(cx, cy, r, a0 + (360 * i) / n - dA / 2, a0 + (360 * i) / n + dA / 2))
  }
  const s = a0 + deg(clear), e = (a1 <= a0 ? a1 + 360 : a1) - deg(clear)
  if (e - s < deg(dash)) return []
  return dashesOnArc(cx, cy, r, s, e, { dash, gap })
}
export function dashesOnLine(x0, y0, x1, y1, { dash = 1.5, gap = 3.25 } = {}) {
  const len = Math.hypot(x1 - x0, y1 - y0)
  const n = Math.max(1, Math.round((len + gap) / (dash + gap)))
  if (n === 1 || len <= dash) return [`M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}`]
  const ux = (x1 - x0) / len, uy = (y1 - y0) / len
  return Array.from({ length: n }, (_, i) => {
    const t = ((len - dash) * i) / (n - 1)
    return `M${f(x0 + ux * t)} ${f(y0 + uy * t)} L${f(x0 + ux * (t + dash))} ${f(y0 + uy * (t + dash))}`
  })
}
function arcD(cx, cy, r, a0, a1) {
  const [ax, ay] = polar(cx, cy, r, a0), [bx, by] = polar(cx, cy, r, a1)
  return `M${ax} ${ay} A${f(r)} ${f(r)} 0 0 1 ${bx} ${by}`
}

// closed annular sector (clock degrees) for cutouts
export function sector(cx, cy, r0, r1, a0, a1) {
  const [ax, ay] = polar(cx, cy, r1, a0), [bx, by] = polar(cx, cy, r1, a1)
  const [cx2, cy2] = polar(cx, cy, r0, a1), [dx, dy] = polar(cx, cy, r0, a0)
  const big = Math.abs(a1 - a0) > 180 ? 1 : 0
  if (r0 <= 0.01) return `M${f(cx)} ${f(cy)} L${ax} ${ay} A${f(r1)} ${f(r1)} 0 ${big} 1 ${bx} ${by} Z`
  return `M${ax} ${ay} A${f(r1)} ${f(r1)} 0 ${big} 1 ${bx} ${by} L${cx2} ${cy2} A${f(r0)} ${f(r0)} 0 ${big} 0 ${dx} ${dy} Z`
}

// the static x (PARTS.md "x inside a container") centred at (cx, cy) with arm half-length a
export const cross = (cx, cy, a = 2) => [`M${f(cx - a)} ${f(cy - a)} L${f(cx + a)} ${f(cy + a)}`, `M${f(cx + a)} ${f(cy - a)} L${f(cx - a)} ${f(cy + a)}`]

// ── speaker (volume-level) ─────────────────────────────────────────────────────────────────────────────
// The static `volume` speaker, 0.85x and moved left so three waves fit at the static 3.75–4u pitch.
// Waves are concentric around (SPK.cx, 12), just right of the speaker's front wall (x 10).
export const SPK = {
  d: 'M8.25 6.75 A1 1 0 0 1 10 7.5 V16.5 A1 1 0 0 1 8.25 17.25 L6 15 H4 A1.25 1.25 0 0 1 2.75 13.75 V10.25 A1.25 1.25 0 0 1 4 9 H6 Z',
  cx: 10.5, cy: 12,
  waves: [{ r: 4.5, a: 45 }, { r: 8, a: 45 }, { r: 11.25, a: 42 }], // radius + half-span (clock degrees around 90)
}

// ── signal bars (signal-bars) ──────────────────────────────────────────────────────────────────────────
// static `signal` geometry: four 2u bars, 5u pitch, common baseline 19.5
export const BARS = [{ x: 4.5, top: 16.5 }, { x: 9.5, top: 12.5 }, { x: 14.5, top: 8.5 }, { x: 19.5, top: 4.5 }]
export const BASE = 19.5

// ── wifi (wifi-strength) ───────────────────────────────────────────────────────────────────────────────
// static `wifi` geometry: dot at (12, 18.5), arcs r 4.75 / 8.75 / 12.75 spanning ±50° around 12 o'clock
export const WIFI = { cx: 12, cy: 18.5, dotR: 0.75, radii: [4.75, 8.75, 12.75], a: 50 }

// the ink of bang() as closed regions (holes in a cutout so filled styles keep the "!" as ink)
export const bangHoles = (x, top, stemEnd, dotY) => [rr(x - 1, top - 1, x + 1, stemEnd + 1, 1), circle(x, dotY, 1)]
