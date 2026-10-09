// DOCK helper: geometry and paint for the app-tile style (see dock.mjs).
//
// The glyph is Solid's plate-split mass (solidPlates: fills + strokes, cutouts knocked out,
// free-standing A parts and S badges as their own pieces), built a touch bolder and set at
// GLYPH scale on a continuous-corner squircle tile. Depth comes from gradients (one defs node):
// the tile's role colour deepening to its shadow, a top glow, a lit top rim and a darker bottom rim;
// the glyph is a raised light material with a darker bottom lip and a soft shadow on the tile.
import { solidPlates, K as SOLID } from './solid.mjs'
import * as F from './_solid-field.mjs'
import { simplify, area, pointInRing } from '../kernel/geom.mjs'
import { colourway } from './_dock-tune.mjs'
import { isPerson, personColors, personPaint } from './_dock-people.mjs'

export const D = {
  X0: 2, Y0: 2, X1: 22, Y1: 22,  // the tile
  R: 4.6, SMOOTH: 0.6,           // corner radius and corner smoothing (continuous corner)
  GLYPH: 0.65,                   // glyph scale on the tile
  CY: 11.9,                      // glyph centre (a hair above the tile centre: the shadow sits below)
  W: 2.5,                        // Solid stroke weight while building the glyph (bolder than Solid's 2.0)
  LIP: 0.34,                     // depth of the glyph's darker bottom lip (final units)
  DROP: 0.42,
  A2: true,                      // free-standing A parts in the second material (c2)                    // glyph shadow offset (final units)
}

const f = n => { const r = Math.round(n * 100) / 100; return Object.is(r, -0) ? '0' : String(r) }
// compact path data: absolute move, then relative deltas between ROUNDED points (no drift), minimal separators
const num = (v, k) => { let t = (Math.round(v * k) / k).toString(); if (t === '-0') t = '0'; return t.replace(/^(-?)0\./, '$1.') }
function join(ns) {
  let o = ''
  for (const t of ns) o += !o || t[0] === '-' || (t[0] === '.' && /\.\d*$/.test(o) && !/[a-zA-Z]$/.test(o)) ? t : ' ' + t
  return o
}
const ring = (pts, dec = 2, tol = 0) => {
  const k = 10 ** dec
  const P = (tol ? simplify(pts, tol, true) : pts).map(p => [Math.round(p[0] * k), Math.round(p[1] * k)])
  const ns = [], out = ['M' + join([num(P[0][0] / k, k), num(P[0][1] / k, k)]) + 'l']
  for (let i = 1; i < P.length; i++) {
    const dx = P[i][0] - P[i - 1][0], dy = P[i][1] - P[i - 1][1]
    if (dx || dy) ns.push(num(dx / k, k), num(dy / k, k))
  }
  return ns.length ? out[0] + join(ns).replace(/^ /, '') + 'z' : ''
}
const loopsD = (loops, dec = 2, tol = 0.02) => loops.map(l => ring(l, dec, tol)).join('')

// ---------------------------------------------------------------- tile: continuous-corner squircle
// corner smoothing after the well-known iOS/Figma construction: a short arc between two cubic easings
export function squircle(x0, y0, x1, y1, R, s) {
  const w = x1 - x0, h = y1 - y0
  R = Math.min(R, w / 2, h / 2)
  const p = Math.min((1 + s) * R, w / 2, h / 2)
  const rad = a => a * Math.PI / 180
  const arc = 90 * (1 - s)
  const L = Math.sin(rad(arc / 2)) * R * Math.SQRT2
  const al = (90 - arc) / 2
  const p34 = R * Math.tan(rad(al / 2))
  const be = 45 * s
  const c = p34 * Math.cos(rad(be)), d = c * Math.tan(rad(be))
  const b = (p - L - c - d) / 3, a = 2 * b
  const F2 = (...v) => join(v.map(x => num(x, 100)))
  return `M${F2(x1 - p, y0)}c${F2(a, 0, a + b, 0, a + b + c, d)}a${F2(R, R)} 0 0 1 ${F2(L, L)}c${F2(d, c, d, b + c, d, a + b + c)}` +
    `L${F2(x1, y1 - p)}c${F2(0, a, 0, a + b, -d, a + b + c)}a${F2(R, R)} 0 0 1 ${F2(-L, L)}c${F2(-c, d, -(b + c), d, -(a + b + c), d)}` +
    `L${F2(x0 + p, y1)}c${F2(-a, 0, -(a + b), 0, -(a + b + c), -d)}a${F2(R, R)} 0 0 1 ${F2(-L, -L)}c${F2(-d, -c, -d, -(b + c), -d, -(a + b + c))}` +
    `L${F2(x0, y0 + p)}c${F2(0, -a, 0, -(a + b), d, -(a + b + c))}a${F2(R, R)} 0 0 1 ${F2(L, -L)}c${F2(c, -d, b + c, -d, a + b + c, -d)}Z`
}

// ---------------------------------------------------------------- glyph
// Solid's plates, built at weight D.W (restored right after: renders are synchronous)
function plates(icon) {
  const w = SOLID.W
  SOLID.W = D.W
  try { return solidPlates(icon) } finally { SOLID.W = w; F.setClip(null) }
}

// outer rings of an even-odd loop set (depth 0)
function outers(loops) {
  return loops.filter((l, i) => !loops.some((o, j) => j !== i && Math.abs(area(o)) > Math.abs(area(l)) && pointInRing(l[0], o)))
}

// field of a loop set, shifted by k samples (positive = down)
function shifted(G, k) {
  const N = F.N, out = F.field(1)
  for (let j = 0; j < N; j++) {
    const sj = j - k
    if (sj < 0 || sj >= N) continue
    out.set(G.subarray(sj * N, sj * N + N), j * N)
  }
  return out
}
// the bottom band of a region: ink whose point `dy` above is paper (lit from the top, this edge turns away)
function lip(loops, dy) {
  F.setClip(null)
  const G = F.region(loops, 0.6)
  const k = Math.max(1, Math.round(dy / F.H))
  const band = F.subtract(Float32Array.from(G), shifted(G, -k))
  return F.trace(band, 0.03, 0.08)
}

// a badge is a compact round piece (a disc with its glyph knocked out); slashes and arrows are not
function isBadge(loops) {
  const o = outers(loops)
  if (o.length !== 1) return false
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [x, y] of o[0]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  const w = x1 - x0, h = y1 - y0
  return w > 3.5 && h > 3.5 && Math.max(w, h) / Math.min(w, h) < 1.35 && Math.abs(area(o[0])) / (w * h) > 0.68
}

export function build(icon) {
  if (!icon.params && isPerson(icon)) { try { const n = person(icon); if (n) return n } catch { /* the house glyph below */ } }
  const C = colourway(icon)
  const id = n => `wg-dock-${icon.name || 'icon'}-${n}`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const S = D.GLYPH, cy = D.CY
  const T = p => [12 + (p[0] - 12) * S, cy + (p[1] - 12) * S]
  const tl = loops => loops.map(l => l.map(T))

  const P = plates(icon).filter(p => p.loops.length)
  const all = P.flatMap(p => p.loops)
  if (!all.length) return null
  // glyph bounds (final units) for its material gradient
  let gy0 = Infinity, gy1 = -Infinity
  for (const l of all) for (const p of l) { gy0 = Math.min(gy0, p[1]); gy1 = Math.max(gy1, p[1]) }
  gy0 = cy + (gy0 - 12) * S; gy1 = cy + (gy1 - 12) * S

  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  const stop = (offset, role, op) => ['stop', op == null || op === 1 ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), gradientUnits: 'userSpaceOnUse' }, stops]
  const url = n => `url(#${id(n)})`

  const defs = [
    // 0 tile body: the role colour deepening toward its shadow (vector runs past the tile: the bottom is a mix)
    lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
    // 1 top glow: soft light from above
    ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
    // 2 rim: lit top edge, darker bottom edge
    lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
    // 3 glyph material: bright on top, a cool tint at the bottom
    lin(3, 12, gy0, 12, gy1, [stop(0, 'shine'), stop(1, 'tint')]),
  ]
  const out = []
  // the tile (its own part: the glyph moves on it)
  out.push(['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }])
  out.push(['path', { d: tile, fill: url(0), class: 'wm-deco' }])
  out.push(['path', { d: tile, fill: url(1), class: 'wm-deco' }])
  out.push(['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }])

  // the glyph: one soft shadow on the tile, then each plate as a raised piece
  const drop = all.map(l => l.map(p => T([p[0], p[1] + D.DROP / S])))
  out.push(['path', { d: loopsD(drop, 1, 0.06), fill: v('shadow'), 'fill-opacity': 0.4, 'fill-rule': 'evenodd', stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])

  let sheen = false
  // a part as big as the object is the object (a microphone whose cradle is the K plate): keep it in the light material
  const ink = loops => Math.abs(loops.reduce((t, l) => t + area(l), 0))
  const kInk = P.filter(p => p.plate === 'K').reduce((t, p) => t + ink(p.loops), 0)
  const second = pl => pl.plate === 'A' && D.A2 && ink(pl.loops) < 0.6 * kInk
  for (const pl of P) {
    const cls = pl.plate === 'A' ? 'wm-a' : pl.plate === 'S' ? 'wm-s' : undefined
    const body = loopsD(tl(pl.loops))
    let lips = []
    try { lips = lip(pl.loops, D.LIP / S) } catch { lips = [] }
    const badge = pl.plate === 'S' && isBadge(pl.loops)
    if (badge) {
      // a small coloured badge: a light disc under an accent piece, so the knocked-out glyph reads light
      out.push(['path', { d: loopsD(tl(outers(pl.loops))), fill: url(3), class: cls }])
      out.push(['path', { d: body, fill: v('accent'), 'fill-rule': 'evenodd', class: cls }])
    } else if (second(pl)) {
      out.push(['path', { d: body, fill: v('c2'), 'fill-rule': 'evenodd', class: cls }])
    } else {
      out.push(['path', { d: body, fill: url(3), 'fill-rule': 'evenodd', class: cls }])
    }
    if (lips.length) out.push(['path', { d: loopsD(tl(lips), 2, 0.04), fill: v('shadow'), 'fill-opacity': 0.22, 'fill-rule': 'evenodd', class: cls }])
    if (badge || second(pl)) { sheen = true; out.push(['path', { d: body, fill: url(4), 'fill-rule': 'evenodd', class: 'wm-shine' }]) }
  }
  if (sheen) defs.push(lin(4, 12, gy0, 12, gy1, [stop(0, 'shine', 0.5), stop(0.5, 'shine', 0.08), stop(1, 'shine', 0)]))
  return [['defs', {}, defs], ...out.map(n => { if (n[1].class === undefined) delete n[1].class; return n })]
}

// ---------------------------------------------------------------- people avatars (see _dock-people.mjs)
// the tile in the accent (deepening toward the ink), the person raised on it: skin c1 with its lip in shadow,
// hair c2, a light top c4, ink features with catch-lights, one soft shadow on the tile
function person(icon) {
  const C = personColors(icon, colourway(icon))
  const id = n => `wg-dock-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const S = D.GLYPH, cy = D.CY
  const T = p => [12 + (p[0] - 12) * S, cy + (p[1] - 12) * S]
  const tl = loops => loops.map(l => l.map(T))
  const all = plates(icon).flatMap(p => p.loops)
  if (!all.length) return null
  const pp = personPaint(icon, all, F)
  if (!pp.regions.length) return null
  const fig = pp.outline.length ? pp.outline : all
  let gy0 = Infinity, gy1 = -Infinity
  for (const l of fig) for (const p of l) { gy0 = Math.min(gy0, p[1]); gy1 = Math.max(gy1, p[1]) }
  gy0 = cy + (gy0 - 12) * S; gy1 = cy + (gy1 - 12) * S
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  const stop = (offset, role, op) => ['stop', op == null || op === 1 ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), gradientUnits: 'userSpaceOnUse' }, stops]
  const defs = [
    // 0 the tile deepening toward the ink
    lin(0, 12, 2, 12, 22, [stop(0, 'ink', 0), stop(1, 'ink', 0.32)]),
    ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
    lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'ink', 0), stop(1, 'ink', 0.4)]),
    // 3 the light material (headphone cups)
    lin(3, 12, gy0, 12, gy1, [stop(0, 'shine'), stop(1, 'tint')]),
    // 4 the person's soft light: lit from above
    lin(4, 12, gy0, 12, gy1, [stop(0, 'shine', 0.38), stop(0.4, 'shine', 0)]),
  ]
  const out = []
  out.push(['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('ink'), 'fill-opacity': 0.2, class: 'wm-shadow' }])
  out.push(['path', { d: tile, fill: v('accent'), class: 'wm-deco' }])
  out.push(['path', { d: tile, fill: url(0), class: 'wm-deco' }])
  out.push(['path', { d: tile, fill: url(1), class: 'wm-deco' }])
  out.push(['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }])
  const drop = fig.map(l => l.map(p => T([p[0], p[1] + D.DROP / S])))
  out.push(['path', { d: loopsD(drop, 1, 0.06), fill: v('ink'), 'fill-opacity': 0.3, 'fill-rule': 'evenodd', stroke: v('ink'), 'stroke-opacity': 0.2, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  for (const r of pp.regions) {
    out.push(['path', { d: loopsD(tl(r.loops)), fill: r.role === 'accent' ? url(3) : v(r.role), 'fill-rule': 'evenodd', class: r.role === 'c1' ? 'wm-k' : 'wm-a' }])
  }
  let lips = []
  try { lips = lip(fig, D.LIP / S) } catch { lips = [] }
  if (lips.length) out.push(['path', { d: loopsD(tl(lips), 2, 0.04), fill: v('shadow'), 'fill-opacity': 0.4, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: loopsD(tl(fig)), fill: url(4), 'fill-rule': 'evenodd', class: 'wm-shine' }])
  if (pp.features.length) out.push(['path', { d: loopsD(tl(pp.features), 2, 0.02), fill: v('ink'), 'fill-rule': 'evenodd', class: 'wm-k' }])
  const cl = pp.eyes.map(e => { const [x, y] = T([e.x + e.r * 0.3, e.y - e.r * 0.35]), r = Math.max(0.16, Math.min(0.24, e.r * 0.3)); return `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0z` }).join('')
  if (cl) out.push(['path', { d: cl, fill: v('shine'), class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
