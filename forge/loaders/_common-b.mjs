// Shared helpers for the common loaders written in batch B (clock, refresh, square-flip, grid-pulse, download,
// upload, chat-typing, search-scan, progress-bar). Pure and deterministic.
import { E } from './_kit.mjs'

const r3 = v => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? 0 : r }

/**
 * Keys sampled from a function of cycle time: fn(t) -> { x, y, r, s, sx, sy, o } for t = 0, 1/n, ... 1, joined
 * linearly. For motions that are a formula (a figure-eight, a speed-dependent stretch) rather than a few poses.
 */
export function sampled(fn, n = 24) {
  const ks = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, k = fn(t), o = { e: E.linear }
    for (const [p, v] of Object.entries(k)) o[p] = r3(v)
    ks.push([r3(t), o])
  }
  return ks
}

/** CSS-like easings as functions (for sampled motions). */
export const ease = {
  inOut: t => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2,
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
}
