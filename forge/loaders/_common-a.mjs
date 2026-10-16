// Shared helpers for the common loaders written in run A (spinner, spinner-spokes, ring-dual, dots-*, bars-equalizer,
// ripple, hourglass). Pure and deterministic.
import { E } from './_kit.mjs'

const r4 = v => Math.round(v * 10000) / 10000
/** Keys sampled from fn(t) -> { x, y, r, s, sx, sy, o } at n + 1 evenly spaced times, joined linearly. */
export function sampled(n, fn) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, k = fn(t), o = {}
    for (const [p, v] of Object.entries(k)) o[p] = r4(v)
    return [r4(t), { ...o, e: E.linear }]
  })
}
/** A CSS cubic-bezier(...) string (or E.*) as a function x -> y, for sampled keys that must follow a named easing. */
export function bezier(css) {
  const m = /cubic-bezier\(([^)]+)\)/.exec(css)
  if (!m) return t => t
  const [x1, y1, x2, y2] = m[1].split(',').map(Number)
  const B = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3
  return x => {
    let lo = 0, hi = 1, t = x
    for (let i = 0; i < 50; i++) { const v = B(x1, x2, t); if (Math.abs(v - x) < 1e-7) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2 }
    return B(y1, y2, t)
  }
}
