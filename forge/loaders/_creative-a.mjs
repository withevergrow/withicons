// with icons — shared helpers for the creative loaders (ai-sparkle, rocket, coffee, atom, dna, newton-cradle,
// infinity, paper-plane, bubbles). Pure and deterministic.
//
//   sparkle(cx, cy, R, k, Ry)   a four-point sparkle with concave sides (k = how far the sides bow in, 0..0.5)
//   smooth(pts, closed)         a smooth path through points (Catmull-Rom as cubic Beziers)
//   keysOf(fn, steps, e)        keys sampled from fn(t) -> { x, y, r, s, o } at steps + 1 even times
//   timeByEnergy(pts, h)        cumulative times along a closed/open polyline when speed grows as the path falls
//                               (a glider that slows climbing and speeds diving)
//   unwrap(angles)              continuous angles (deg) from atan2 output
//   skelOf(sk, keep)            a skeleton with only the paths keep(p) accepts (fills and cutouts kept)
import { E } from './_kit.mjs'

const f = n => { const r = Math.round(n * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r) }
export const P = (x, y) => `${f(x)} ${f(y)}`

export function sparkle(cx, cy, R, k = 0.28, Ry = R) {
  const t = [cx, cy - Ry], r = [cx + R, cy], b = [cx, cy + Ry], l = [cx - R, cy]
  const seg = (a, c1, c2, z) => `C${P(...c1)} ${P(...c2)} ${P(...z)}`
  return `M${P(...t)} ` +
    seg(t, [cx, cy - Ry * k], [cx + R * k, cy], r) + ' ' +
    seg(r, [cx + R * k, cy], [cx, cy + Ry * k], b) + ' ' +
    seg(b, [cx, cy + Ry * k], [cx - R * k, cy], l) + ' ' +
    seg(l, [cx - R * k, cy], [cx, cy - Ry * k], t) + ' Z'
}

export function smooth(pts, closed = true) {
  const n = pts.length
  const at = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]
  let d = `M${P(...pts[0])}`
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${P(...c1)} ${P(...c2)} ${P(...p2)}`
  }
  return d + (closed ? ' Z' : '')
}

export function keysOf(fn, steps, e = E.linear) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    return [Math.round(t * 10000) / 10000, { ...fn(t), e }]
  })
}

export function unwrap(a) {
  const out = [a[0]]
  for (let i = 1; i < a.length; i++) {
    let d = a[i] - a[i - 1]
    while (d > 180) d -= 360
    while (d < -180) d += 360
    out.push(out[i - 1] + d)
  }
  return out
}

/** Times (0..1) at the points of a polyline for a body whose speed^2 = v0^2 + 2 g (y - yTop): slow high, fast low. */
export function timeByEnergy(pts, { v0 = 1, g = 1 } = {}) {
  const yTop = Math.min(...pts.map(p => p[1]))
  const ts = [0]
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]
    const ds = Math.hypot(b[0] - a[0], b[1] - a[1])
    const ym = (a[1] + b[1]) / 2
    acc += ds / Math.sqrt(v0 * v0 + 2 * g * (ym - yTop))
    ts.push(acc)
  }
  return ts.map(t => t / acc)
}

export function skelOf(sk, keep) {
  return { ...sk, paths: sk.paths.filter(keep) }
}

/** The same skeleton under another part name. Parts named after a library icon may be drawn by that icon's hand-tuned
 *  art in some styles (forge/hand, per-icon tuning), which ignores the geometry: name own-geometry parts neutrally. */
export const named = (sk, name) => ({ ...sk, name })
/**
 * Place a part through its motion instead of its geometry: every key gets a static scale s, rotation r and offset
 * (x, y) folded in. Use it for borrowed library icons, so the styles that draw an icon from hand-tuned art (which
 * ignores transformed geometry) still put it in the right place, at the right size and angle.
 */
export function placed(keys, { s = 1, r = 0, x = 0, y = 0 } = {}) {
  const src = keys && keys.length ? keys : [[0, {}], [1, {}]]
  let cur = { sx: 1, sy: 1, r: 0, x: 0, y: 0 }   // missing properties carry forward, as the compiler does
  return src.map(([t, k]) => {
    const o = { ...k }
    cur = { ...cur, ...(k.s != null ? { sx: k.s, sy: k.s } : {}), ...pick(k) }
    delete o.s
    o.sx = s * cur.sx; o.sy = s * cur.sy; o.r = r + cur.r; o.x = x + cur.x; o.y = y + cur.y
    return [t, o]
  })
}
const pick = k => Object.fromEntries(['sx', 'sy', 'r', 'x', 'y'].filter(p => k[p] != null).map(p => [p, k[p]]))
