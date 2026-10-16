// with icons — shared helpers for the festival loaders (forge/LOADERS.md, group 'festival').
// Pure and deterministic. Geometry on the 24 grid; motion keys in the loader format [[t, { x y r s sx sy o e }]].
//
//   pick(name, idx, { fills, cutouts, t })  a library icon cut down to some of its paths (by index), keeping the
//                                           icon's name so every style draws it with that icon's own tuning; fills /
//                                           cutouts are indices into the icon's lists (default: none / none)
//   twinkle(cx, cy, r, w)                   a four-point sparkle (concave sides), closed
//   sampled(fn, n, e)                       keys from a function of t (0..1) sampled n times (smooth, any physics)
//   fly(opts)                               keys for a thrown piece: launch, drag, gravity, tumble, fade
import { icon, poly, E } from './_kit.mjs'

const f = n => { const r = Math.round(n * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r) }

export function pick(name, idx, { fills = [], cutouts = [], t, extra } = {}) {
  const ic = icon(name, t)
  const out = {
    name,
    paths: idx.map(i => ic.paths[i]),
    fills: fills.map(i => typeof i === 'string' ? i : ic.fills[i]),
    cutouts: cutouts.map(i => typeof i === 'string' ? i : ic.cutouts[i]),
  }
  if (extra) { out.paths.push(...(extra.paths || [])); out.fills.push(...(extra.fills || [])); out.cutouts.push(...(extra.cutouts || [])) }
  return out
}

// a four-point sparkle: tips at r, waist w (0..1 of r) pulled in with quadratic sides
export function twinkle(cx, cy, r, w = 0.18) {
  const P = (x, y) => `${f(cx + x)} ${f(cy + y)}`
  const q = r * w
  return `M${P(0, -r)} Q${P(q, -q)} ${P(r, 0)} Q${P(q, q)} ${P(0, r)} Q${P(-q, q)} ${P(-r, 0)} Q${P(-q, -q)} ${P(0, -r)} Z`
}

export const rays = (cx, cy, r0, r1, n, a0 = 0) => Array.from({ length: n }, (_, i) => {
  const a = (a0 + i * 360 / n - 90) * Math.PI / 180
  return `M${f(cx + r0 * Math.cos(a))} ${f(cy + r0 * Math.sin(a))} L${f(cx + r1 * Math.cos(a))} ${f(cy + r1 * Math.sin(a))}`
}).join(' ')

const r3 = v => Math.round(v * 1000) / 1000
/** keys from fn(t) -> { x y r s sx sy o } sampled at n + 1 evenly spaced times (the segments ease with e) */
export function sampled(fn, n = 24, e = E.linear) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, k = fn(t), o = {}
    for (const [p, v] of Object.entries(k)) o[p] = r3(v)
    return [r3(t), { ...o, e }]
  })
}

/**
 * A thrown piece (confetti, sparks): it is invisible at the start and end of the cycle so the loop never shows a jump.
 *   t0 launch time, t1 time it is gone; v [vx, vy] launch speed (grid units per cycle), g gravity, k air drag,
 *   spin degrees over the flight, flip: paper flutter (sx swings through 0 this many times), fade: fraction at the end
 */
export function fly({ t0 = 0, t1 = 1, v = [6, -12], g = 30, k = 3, spin = 360, flip = 0, fade = 0.2, n = 18, s = 1 } = {}) {
  const T = t1 - t0
  const pos = u => {   // u in 0..1 of the flight: drag-damped launch plus gravity that reaches terminal speed
    const tt = u * T, d = (1 - Math.exp(-k * tt)) / k
    return [v[0] * d, v[1] * d + g * (tt - d) / k]
  }
  const keys = t0 > 0 ? [[0, { x: 0, y: 0, o: 0, s: 0.3 * s, r: 0, e: E.linear }]] : []
  for (let i = 0; i <= n; i++) {
    const u = i / n, [x, y] = pos(u)
    const o = u < 0.08 ? u / 0.08 : u > 1 - fade ? Math.max(0, (1 - u) / fade) : 1
    const sc = u < 0.1 ? 0.3 + 0.7 * u / 0.1 : 1
    const k0 = { x, y, o, r: spin * u, e: E.linear }
    if (flip) { const c = Math.cos(u * Math.PI * flip); k0.sx = s * sc * (0.25 + 0.75 * Math.abs(c)); k0.sy = s * sc }
    else k0.s = s * sc
    for (const p of ['x', 'y', 'o', 'r', 'sx', 'sy', 's']) if (k0[p] != null) k0[p] = r3(k0[p])
    keys.push([r3(t0 + u * T), k0])
  }
  if (t1 < 1) keys.push([1, { ...keys[keys.length - 1][1], o: 0 }])
  return keys
}
export { poly }
