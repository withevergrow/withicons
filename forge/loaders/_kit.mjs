// with icons — the loader kit (forge/LOADERS.md). Shapes, icon borrowing and motion helpers for loader specs.
// Pure and deterministic: no Math.random (use rng(seed)), no dates. Build-time only (reads forge/icons/*.json).
//
// GEOMETRY (24 grid, live area 2..22; angles in CLOCK degrees: 0 = 12 o'clock, 90 = 3 o'clock, clockwise)
//   circle(cx, cy, r)              closed circle d            ring(cx, cy, r)  the same, as an outline part
//   arc(cx, cy, r, a0, a1)         open arc d                 polar(cx, cy, r, a) -> [x, y]
//   line(x0, y0, x1, y1)           open segment d             dot(x, y)  a stub the stroke rounds into a disc
//   rr(x0, y0, x1, y1, r)          closed rounded rectangle    poly([[x,y]...], closed = true)
//   star(cx, cy, R, ratio, n = 5)  closed star (point up)     heart(cx, cy, s = 1)  closed heart, ~16u wide at s = 1
//   drop(cx, cy, s = 1)            closed water drop (point up), ~8u tall at s = 1
//   xform(d, { s, x, y, r, about }) scale / rotate (deg, about [12,12]) / translate any path data (arcs kept exact)
//
// SKELETON PARTS (what a loader part draws; plates: K main ink, A accent / moving detail, S badge colour)
//   solid(d, plate = 'K')          closed shape drawn as a mass (fills) with its outline
//   stroke(d, plate = 'K')         open or closed outline only
//   merge(...skels)                one skeleton from several
//   icon(name, { s, x, y, r })     a library icon's skeleton (forge/icons/<name>.json), optionally transformed;
//                                  the part keeps the icon's name so every style draws it with that icon's own tuning
//
// MOTION (a part's `motion`: { origin, keys, lag, rep }; keys = [[t, { x, y, r, s, sx, sy, o, e }], ...], t in 0..1)
//   E                              named easings (E.out, E.spring, ...): the `e` of a key eases the segment AFTER it
//   spin({ dir = 1, turns = 1 })   linear full turn(s)
//   pulse(lo, hi, e)               scale lo -> hi -> lo         blink(lo, hi)  opacity lo -> hi -> lo
//   bob(dy, e)                     move up by dy and back       keysAlong(pts, { closed, e })  follow points evenly
//   show(i, n, { fade, hold, enter, exit })  a morph step: part i of n is on stage for its slot of the cycle
//   lagOf(i, n)                    stagger fraction for part i of n (use as `lag`)
//   rng(seed)                      deterministic random in [0, 1)
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ICONS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'icons')
export const snap = (n, q = 0.05) => { const r = Math.round(n / q) * q; return Math.round(r * 1000) / 1000 }
const f = n => { const r = Math.round(n * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r) }
const rad = a => (a - 90) * Math.PI / 180

// ------------------------------------------------------------------ geometry
export const polar = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))]
export const circle = (cx, cy, r) => `M${f(cx + r)} ${f(cy)} A${f(r)} ${f(r)} 0 0 1 ${f(cx - r)} ${f(cy)} A${f(r)} ${f(r)} 0 0 1 ${f(cx + r)} ${f(cy)} Z`
export function arc(cx, cy, r, a0, a1) {
  const span = a1 - a0
  if (Math.abs(span) >= 359.9) return circle(cx, cy, r).replace(/ Z$/, '')
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1)
  return `M${f(x0)} ${f(y0)} A${f(r)} ${f(r)} 0 ${Math.abs(span) > 180 ? 1 : 0} ${span > 0 ? 1 : 0} ${f(x1)} ${f(y1)}`
}
export const line = (x0, y0, x1, y1) => `M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}`
export const dot = (x, y) => `M${f(x)} ${f(y)} L${f(x)} ${f(y + 0.05)}`
export function rr(x0, y0, x1, y1, r = 2) {
  r = Math.max(0, Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2))
  if (!r) return `M${f(x0)} ${f(y0)} H${f(x1)} V${f(y1)} H${f(x0)} Z`
  return `M${f(x0 + r)} ${f(y0)} H${f(x1 - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y0 + r)} V${f(y1 - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x1 - r)} ${f(y1)} H${f(x0 + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0)} ${f(y1 - r)} V${f(y0 + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0 + r)} ${f(y0)} Z`
}
export const poly = (pts, closed = true) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + (closed ? ' Z' : '')
export function star(cx, cy, R, ratio = 0.45, n = 5) {
  const pts = []
  for (let k = 0; k < n * 2; k++) pts.push(polar(cx, cy, k % 2 ? R * ratio : R, k * 180 / n))
  return poly(pts)
}
// a heart centred on (cx, cy): two lobes and a soft point, ~16u wide and ~14u tall at s = 1
export function heart(cx, cy, s = 1) {
  const P = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`
  return `M${P(0, 7)} C${P(-4, 4)} ${P(-8, 1)} ${P(-8, -2.5)} C${P(-8, -5.5)} ${P(-5.75, -7.25)} ${P(-3.75, -7.25)} C${P(-2, -7.25)} ${P(-0.75, -6.25)} ${P(0, -5)} ` +
    `C${P(0.75, -6.25)} ${P(2, -7.25)} ${P(3.75, -7.25)} C${P(5.75, -7.25)} ${P(8, -5.5)} ${P(8, -2.5)} C${P(8, 1)} ${P(4, 4)} ${P(0, 7)} Z`
}
// a water drop, point up, ~8u tall at s = 1, centred on its round body (cx, cy)
export function drop(cx, cy, s = 1) {
  const P = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`
  return `M${P(0, -5.5)} C${P(1.25, -3.5)} ${P(3, -1.5)} ${P(3, 0.5)} A${f(3 * s)} ${f(3 * s)} 0 0 1 ${P(-3, 0.5)} C${P(-3, -1.5)} ${P(-1.25, -3.5)} ${P(0, -5.5)} Z`
}

// path data -> scaled / rotated / translated path data. Every command becomes absolute; H/V become L; arcs keep their
// radii (times s) and gain the rotation, so curves stay exact.
const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }
const TOK = /[MLHVCSQTAZmlhvcsqtaz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g
export function xform(d, { s = 1, x = 0, y = 0, r = 0, about = [12, 12] } = {}) {
  const c = Math.cos(r * Math.PI / 180), sn = Math.sin(r * Math.PI / 180)
  const P = (px, py) => {
    const ux = (px - about[0]) * s, uy = (py - about[1]) * s
    return `${f(about[0] + ux * c - uy * sn + x)} ${f(about[1] + ux * sn + uy * c + y)}`
  }
  const toks = String(d).match(TOK) || []
  const out = []
  let i = 0, cmd = '', cx = 0, cy = 0, sx = 0, sy = 0
  const num = () => Number(toks[i++])
  while (i < toks.length) {
    if (/[A-Za-z]/.test(toks[i])) { cmd = toks[i++]; if (/z/i.test(cmd)) { out.push('Z'); cx = sx; cy = sy } continue }
    const U = cmd.toUpperCase(), rel = cmd !== U, n = ARGS[U]
    if (!n) { i++; continue }
    const ox = rel ? cx : 0, oy = rel ? cy : 0
    if (U === 'M') { cx = num() + ox; cy = num() + oy; sx = cx; sy = cy; out.push('M' + P(cx, cy)); cmd = rel ? 'l' : 'L' }
    else if (U === 'L' || U === 'T') { cx = num() + ox; cy = num() + oy; out.push(U + P(cx, cy)) }
    else if (U === 'H') { cx = num() + ox; out.push('L' + P(cx, cy)) }
    else if (U === 'V') { cy = num() + oy; out.push('L' + P(cx, cy)) }
    else if (U === 'C') { const a = [num() + ox, num() + oy, num() + ox, num() + oy, num() + ox, num() + oy]; cx = a[4]; cy = a[5]; out.push('C' + P(a[0], a[1]) + ' ' + P(a[2], a[3]) + ' ' + P(a[4], a[5])) }
    else if (U === 'S' || U === 'Q') { const a = [num() + ox, num() + oy, num() + ox, num() + oy]; cx = a[2]; cy = a[3]; out.push(U + P(a[0], a[1]) + ' ' + P(a[2], a[3])) }
    else if (U === 'A') {
      const rx = num(), ry = num(), rot = num(), la = num(), sw = num(); cx = num() + ox; cy = num() + oy
      out.push(`A${f(rx * Math.abs(s))} ${f(ry * Math.abs(s))} ${f(rot + r)} ${la} ${s < 0 ? 1 - sw : sw} ${P(cx, cy)}`)
    }
  }
  return out.join(' ')
}

// ------------------------------------------------------------------ skeleton parts
export const solid = (d, plate = 'K') => ({ paths: [{ d, plate }], fills: [d], cutouts: [] })
export const stroke = (d, plate = 'K') => ({ paths: [{ d, plate }], fills: [], cutouts: [] })
export const ring = (cx, cy, r, plate = 'K') => stroke(circle(cx, cy, r), plate)
export function merge(...sk) {
  const out = { paths: [], fills: [], cutouts: [] }
  for (const s of sk.flat()) if (s) { out.paths.push(...(s.paths || [])); out.fills.push(...(s.fills || [])); out.cutouts.push(...(s.cutouts || [])); if (s.name && !out.name) out.name = s.name }
  return out
}
const iconCache = new Map()
export function icon(name, t) {
  if (!iconCache.has(name)) {
    const file = path.join(ICONS, name + '.json')
    if (!fs.existsSync(file)) throw new Error(`loader kit: no icon "${name}" in forge/icons`)
    iconCache.set(name, JSON.parse(fs.readFileSync(file, 'utf8')))
  }
  const j = iconCache.get(name)
  const X = d => t ? xform(d, t) : d
  return {
    // styles tune colours (and some draw hand art) per icon name: keep it only when the drawing is the icon as is
    name: t ? 'wl-' + name : name,
    paths: (j.paths || []).map(p => ({ d: X(p.d), plate: p.plate || 'K' })),
    fills: (j.fills || []).map(X), cutouts: (j.cutouts || []).map(X),
  }
}

// ------------------------------------------------------------------ motion
// named easings (CSS cubic-bezier); `e` on a key eases the segment from that key to the next
export const E = {
  linear: 'linear',
  ease: 'cubic-bezier(.45,0,.55,1)',          // smooth in-out (sine-like)
  in: 'cubic-bezier(.55,0,1,.45)',
  out: 'cubic-bezier(0,.55,.45,1)',
  inOut: 'cubic-bezier(.65,0,.35,1)',          // stronger in-out
  expoOut: 'cubic-bezier(.16,1,.3,1)',
  expoIn: 'cubic-bezier(.7,0,.84,0)',
  spring: 'cubic-bezier(.34,1.56,.64,1)',      // overshoots then settles
  anticipate: 'cubic-bezier(.36,0,.66,-0.56)', // pulls back before moving
  gravity: 'cubic-bezier(.33,0,.67,0)',        // falling (accelerates)
  lift: 'cubic-bezier(.33,1,.67,1)',           // rising (decelerates)
}
export const spin = ({ dir = 1, turns = 1, from = 0 } = {}) => [[0, { r: from, e: E.linear }], [1, { r: from + 360 * turns * dir }]]
export const pulse = (lo = 0.6, hi = 1, e = E.ease) => [[0, { s: lo, e }], [0.5, { s: hi, e }], [1, { s: lo }]]
export const blink = (lo = 0.25, hi = 1, e = E.ease) => [[0, { o: lo, e }], [0.5, { o: hi, e }], [1, { o: lo }]]
export const bob = (dy = 2, e = E.ease) => [[0, { y: 0, e }], [0.5, { y: -dy, e }], [1, { y: 0 }]]
export const lagOf = (i, n) => i / n
/** Keys that move a part (drawn at `pts[0]`) through the points, evenly in time (closed: back to the start). */
export function keysAlong(pts, { closed = true, e = E.linear, extra } = {}) {
  const P = closed ? [...pts, pts[0]] : pts
  const seg = []
  let L = 0
  for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(l); L += l }
  let acc = 0
  return P.map((p, i) => { if (i) acc += seg[i - 1]; return [L ? acc / L : i / (P.length - 1), { x: p[0] - pts[0][0], y: p[1] - pts[0][1], e, ...(extra ? extra(i, p) : {}) }] })
}
/**
 * A morph step: part i of n holds the stage for its slot (1/n of the cycle), entering and leaving with an effect.
 *   fade   0..0.5   fraction of the slot spent entering (and leaving)
 *   enter  { s, r, x, y, o } where the part comes from (default: from a dot, s 0.2)
 *   exit   { s, r, x, y, o } where it goes (default: back to a dot)
 *   e      easing in (out-of-dot bloom), eOut easing out
 */
export function show(i, n, { fade = 0.22, enter = { s: 0.2, o: 0 }, exit = { s: 0.2, o: 0 }, e = E.spring, eOut = E.in } = {}) {
  const w = 1 / n, a = i * w, F = fade * w
  const off = { o: 0, s: 1, r: 0, x: 0, y: 0 }
  const kk = []
  const rest = { s: 1, r: 0, x: 0, y: 0, o: 1 }
  if (a > 0) kk.push([0, { ...off, ...exit, o: 0 }])
  kk.push([a, { ...off, ...enter, e }], [a + F, { ...rest }], [a + w - F, { ...rest, e: eOut }], [a + w, { ...off, ...exit }])
  if (a + w < 1) kk.push([1, { ...off, ...exit, o: 0 }])
  return kk.map(([t, k]) => [Math.round(t * 10000) / 10000, k])
}
export function rng(seed) {
  let s = (seed >>> 0) || 1
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
