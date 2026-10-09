// CLAY core: material pieces (_clay-model.mjs) -> lit faux-3D nodes.
//
// Every piece is a plump object of matte clay / soft vinyl seen slightly from above-front,
// one light from the upper left. Back to front:
//
//   ground    a soft contact shadow on the floor (stacked ellipses, wm-shadow)
//   per piece (Ab behind, K body, Af pressed on, S candy):
//     wall    the piece extruded straight down: its visible thickness, a linear ramp from the
//             base colour into shade (one node, under the face)
//     face    the top surface: a radial gradient (base colour, rolling into shade at the far
//             bottom-right), with a rim stroke that darkens the edges facing away from the light
//     glow    a broad soft highlight inset from the edge (shine fading out from the top-left)
//     lip     a lit crescent along every edge facing the light (inflated, rounded edge)
//     spec    a small crisp specular on each sizeable lump (wm-shine)
//   details   pits (dark glossy: eyes, keyholes), dents (recessed panels), creases
//   contact   parts pressed on the body cast a short soft shadow onto it
//
// Gradients: one defs node, ids wg-clay-<icon>-<n>, userSpaceOnUse, stop colours are role variables.
import * as F from './_clay-field.mjs'
import { model, exact } from './_clay-model.mjs'
import { ringsD } from './_clay-path.mjs'
import { simplify, area } from '../kernel/geom.mjs'
import { colorsFor } from './_clay-color.mjs'

const NN = F.N * F.N
const DIR = [0.1, 1]              // extrusion: straight down, a hair right

// ---------------------------------------------------------------------------
// field helpers
function bboxOf(P) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let j = 0; j < F.N; j++) {
    const row = j * F.N
    for (let i = 0; i < F.N; i++) if (P[row + i] < 0) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j }
  }
  return x1 < 0 ? null : { x0: x0 * F.H, y0: y0 * F.H, x1: x1 * F.H, y1: y1 * F.H, w: (x1 - x0) * F.H, h: (y1 - y0) * F.H }
}
// union of P swept along the extrusion vector by `depth`
function sweep(P, depth) {
  const n = Math.max(1, Math.round(depth / F.H)), G = F.copy(P)
  for (let k = 1; k <= n; k++) {
    const di = Math.round(k * DIR[0]), dj = k
    for (let j = F.N - 1; j >= dj; j--) {
      const row = j * F.N, src = (j - dj) * F.N - di
      for (let i = Math.max(0, di); i < F.N; i++) { const v = P[src + i]; if (v < G[row + i]) G[row + i] = v }
    }
  }
  return G
}
const mv = (P, dx, dy) => F.shift(P, Math.round(dx / F.H), Math.round(dy / F.H), 1)
const ero = (P, e) => F.offset(F.copy(P), e)
const minus = (A, B) => F.subtract(F.copy(A), B)
const loops = (P, tol = 0.035, minArea = 0.12) => F.trace(F.copy(P), Math.min(tol, 0.012), minArea)
const pathD = (P, tol = 0.035, minArea = 0.12, fit = 0.06, dp = 1) => { const L = loops(P, tol, minArea); return L.length ? ringsD(L, fit, dp) : '' }
const r2 = n => Math.round(n * 100) / 100

// ---------------------------------------------------------------------------
export function build(icon) {
  const M = model(icon)
  const C = colorsFor(icon, M.T)
  const col = C.col
  const nodes = [], grads = []
  let gid = 0
  const id = () => `wg-clay-${icon.name}-${gid++}`
  const stop = (offset, role, op) => ['stop', op === undefined || op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
  const lin = (x1, y1, x2, y2, stops) => { const k = id(); grads.push(['linearGradient', { id: k, x1: r2(x1), y1: r2(y1), x2: r2(x2), y2: r2(y2), gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${k})` }
  const rad = (cx, cy, r, stops, fx, fy) => {
    const k = id(), a = { id: k, cx: r2(cx), cy: r2(cy), r: r2(r) }
    if (fx !== undefined) { a.fx = r2(fx); a.fy = r2(fy) }
    a.gradientUnits = 'userSpaceOnUse'
    grads.push(['radialGradient', a, stops]); return `url(#${k})`
  }
  const push = (P, attrs, tol, minArea, fit, dp) => { const d = pathD(P, tol, minArea, fit, dp); if (d) nodes.push(['path', { d, ...attrs }]); return !!d }

  // shared: the rim (dark on edges facing away from the light) runs across the whole icon
  let rimPaint = null
  let shinePaint = null
  const shineG = () => shinePaint || (shinePaint = rad(6, 4.5, 19, [stop(0, 'shine'), stop(0.55, 'shine', 0.4), stop(1, 'shine', 0.12)]))
  // wall: a ramp mapped so the piece's top sits at t0 and the wall's foot at t1 (mix of base into deep)
  // one ramp per material across the icon: y=3 sits at t0, y=23 at t1 (walls lower down are deeper in shade)
  const wallPaints = {}
  const wallPaint = m => {
    const k = m.base + m.deep
    if (wallPaints[k]) return wallPaints[k]
    const L = 20 / (m.t1 - m.t0), y1 = 3 - m.t0 * L
    return (wallPaints[k] = lin(0, y1, 0, y1 + L, [stop(0, m.base), stop(1, m.deep)]))
  }
  const rim = () => rimPaint || (rimPaint = lin(5, 4, 19, 21, [stop(0, 'shine', 0.18), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.6)]))

  const pieces = [
    { P: M.Ab, mat: C.Ab, cls: 'wm-a', depth: 0.95 },
    { P: M.Ac, mat: C.Ac, cls: 'wm-a', depth: 0.95 },
    { P: M.K, mat: C.K, cls: 'wm-k', depth: 1.15, body: true },
    { P: M.Af, mat: C.Af, cls: 'wm-a', depth: 0.5, onBody: true },
    { P: M.free, mat: C.K, cls: 'wm-a', depth: 0.45, text: true },
    { P: M.print, cls: 'wm-a', print: true },
    { P: M.S, mat: C.S, cls: 'wm-s', depth: 0.65, onBody: true, candy: true },
  ].filter(p => p.P && F.any(p.P))

  // ---- ground shadow
  const sil = F.field(1)
  for (const p of pieces) if (!p.print) F.union(sil, sweep(p.P, p.depth))
  const gb = bboxOf(sil)
  if (gb) {
    // width from the lower part of the silhouette
    let lx0 = Infinity, lx1 = -Infinity
    const yCut = gb.y1 - Math.max(1.2, gb.h * 0.35)
    for (let j = Math.round(yCut / F.H); j <= Math.round(gb.y1 / F.H); j++) for (let i = 0; i < F.N; i++) if (sil[j * F.N + i] < 0) { if (i * F.H < lx0) lx0 = i * F.H; if (i * F.H > lx1) lx1 = i * F.H }
    const cx = (lx0 + lx1) / 2 + 0.35, cy = Math.min(22.6, gb.y1 + 0.15)
    const rx = Math.max(2.2, (lx1 - lx0) / 2 + 0.5), ry = Math.min(1.35, 0.7 + rx * 0.06)
    // two ellipses, each a radial fade (the outer one wide and faint, the inner one the contact)
    const sg = rad(cx, cy, rx * 1.15, [stop(0, 'shadow', 0.3), stop(0.55, 'shadow', 0.2), stop(1, 'shadow', 0)])
    nodes.push(['path', { d: ellD(cx, cy, rx * 1.15, ry * 1.35), fill: sg, class: 'wm-shadow' }])
    nodes.push(['path', { d: ellD(cx, cy, rx * 0.7, ry * 0.62), fill: col('shadow'), 'fill-opacity': 0.13, class: 'wm-shadow' }])
  }

  // ---- pieces
  for (const pc of pieces) {
    const P = pc.P, b = bboxOf(P)
    if (!b) continue
    if (pc.print) {
      // lettering printed on the face: ink, with a lit lip under each stroke (pressed in)
      push(minus(mv(P, 0.08, 0.2), P), { fill: col('shine'), 'fill-opacity': 0.45, class: 'wm-shine' }, 0.03, 0.03, 0.04, 2)
      push(P, { fill: col('ink'), class: pc.cls }, 0.03, 0.03, 0.04, 2)
      continue
    }
    const m = pc.mat, cls = pc.cls
    const wall = sweep(P, pc.depth)
    const big = Math.max(b.w, b.h)
    let thick = 0
    for (let q = 0; q < NN; q++) if (-P[q] > thick) thick = -P[q]   // half the thickest part
    // contact shadow cast onto what lies below (parts pressed on the body)
    if (pc.onBody) {
      const below = F.field(1)
      for (const q of pieces) if (q !== pc && !q.print && pieces.indexOf(q) < pieces.indexOf(pc)) F.union(below, q.P)
      if (F.any(below)) {
        const cs = F.intersect(F.offset(mv(wall, 0.25, 0.35), -0.12), below)
        F.subtract(cs, wall)
        push(cs, { fill: col('shadow'), 'fill-opacity': pc.candy ? 0.32 : 0.28, class: cls }, 0.05, 0.1)
      }
    }
    // wall
    const wb = bboxOf(wall)
    push(wall, { fill: wallPaint(m), class: cls })
    // face
    const fr = big * 1.1 + 1.2
    const fd = m.edge || m.deep
    const fstops = m.hi === m.base ? [stop(0.45, m.base), stop(1, fd)] : [stop(0, m.hi), stop(0.5, m.base), stop(1, fd)]
    push(P, { fill: rad(b.x0 + b.w * 0.3, b.y0 + b.h * 0.24, fr, fstops), stroke: rim(), 'stroke-width': pc.candy ? 0.35 : 0.42, 'stroke-linejoin': 'round', class: cls })
    // inflation: soft shade bands inside the edges facing away from the light
    const sh1 = Math.min(1.1, 0.35 + big * 0.05, thick * 0.7)
    push(minus(P, mv(ero(P, sh1 * 0.5), -sh1 * 0.3, -sh1 * 0.43)), { fill: col('shadow'), 'fill-opacity': 0.1, class: cls }, 0.06, 0.15, 0.1)
    push(minus(P, mv(ero(P, sh1), -sh1 * 0.6, -sh1 * 0.85)), { fill: col('shadow'), 'fill-opacity': 0.09, class: cls }, 0.06, 0.15, 0.1)
    // glow: broad soft highlight
    const inset = Math.min(0.6, 0.15 + big * 0.045, thick * 0.4)
    const glowF = mv(ero(P, inset), -0.1, -0.14)
    F.intersect(glowF, ero(P, inset * 0.6))
    const gx = b.x0 + b.w * 0.26, gy = b.y0 + b.h * 0.2
    push(glowF, { fill: rad(gx, gy, Math.max(2.4, big * 0.72), [stop(0, 'shine', pc.candy ? 0.75 : 0.6), stop(0.5, 'shine', 0.22), stop(1, 'shine', 0)]), class: 'wm-shine' }, 0.06, 0.2, 0.1)
    // lip: lit crescent along edges facing the light
    const e1 = Math.min(0.26, thick * 0.22), s1 = Math.min(0.4, thick * 0.35)
    const lip = minus(ero(P, e1), mv(ero(P, e1), s1 * 0.7, s1))
    push(lip, { fill: shineG(), 'fill-opacity': 0.72, class: 'wm-shine' }, 0.05, 0.1)
    // specular on each lump
    specs(P, pc.candy ? 1 : 0.85).forEach(([x, y, rx, ry]) => nodes.push(['path', { d: ellD(x, y, rx, ry, -40), fill: col('shine'), 'fill-opacity': 0.92, class: 'wm-shine' }]))

    if (pc.body) details(M, pc, nodes, col, push, lin)
    if (pc.P === M.Af && M.pitA) details({ pit: M.pitA }, pc, nodes, col, push, lin)
    if (pc.candy && M.Sg && F.any(M.Sg)) {
      const g = M.Sg
      push(F.subtract(F.offset(mv(g, 0.15, 0.3), -0.05), g), { fill: col('shadow'), 'fill-opacity': 0.35, class: cls }, 0.05, 0.05)
      push(g, { fill: col('shine'), class: cls }, 0.03, 0.05, 0.04, 2)
    }
  }
  if (!nodes.length) return null
  return grads.length ? [['defs', {}, grads], ...nodes] : nodes
}

// pits, dents and creases pressed into the body
function details(M, pc, nodes, col, push) {
  const cls = pc.cls
  if (M.dent && F.any(M.dent)) {
    const D = M.dent, b = bboxOf(D)
    push(D, { fill: col('shadow'), 'fill-opacity': 0.22, class: cls })
    push(minus(D, mv(D, 0.3, 0.42)), { fill: col('shadow'), 'fill-opacity': 0.3, class: cls }, 0.05, 0.05)
    push(minus(D, mv(D, -0.25, -0.35)), { fill: col('shine'), 'fill-opacity': 0.45, class: 'wm-shine' }, 0.05, 0.05)
    void b
  }
  if (M.crease && F.any(M.crease)) {
    const Cr = M.crease
    push(Cr, { fill: col('shadow'), 'fill-opacity': 0.45, class: cls }, 0.04, 0.05)
    push(minus(mv(Cr, 0.12, 0.3), Cr), { fill: col('shine'), 'fill-opacity': 0.5, class: 'wm-shine' }, 0.04, 0.05)
  }
  if (M.pit && F.any(M.pit)) {
    const Pt = M.pit
    push(Pt, { fill: col('ink'), class: cls }, 0.03, 0.05, 0.04, 2)
    push(minus(Pt, mv(Pt, -0.18, -0.28)), { fill: col('shine'), 'fill-opacity': 0.4, class: 'wm-shine' }, 0.04, 0.03)
    for (const c of F.components(Pt)) {
      if (c.area < 0.6) continue
      const w = c.x1 - c.x0, h = c.y1 - c.y0, r = Math.min(w, h)
      nodes.push(['path', { d: ellD(c.x0 + w * 0.36, c.y0 + Math.min(h * 0.3, r * 0.42), r * 0.2, r * 0.2), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
    }
  }
}

// specular spots: for each sizeable lump, the most upper-left point that sits deep enough inside
function specs(P, k) {
  const out = []
  const comps = F.components(P, true).filter(c => c.area > 1.2).sort((a, b) => b.area - a.area).slice(0, 5)
  for (const c of comps) {
    let best = null, bestS = Infinity, maxD = 0
    for (const q of c.cells) if (-P[q] > maxD) maxD = -P[q]
    const need = Math.min(0.95, maxD * 0.62)
    for (const q of c.cells) {
      const d = -P[q]
      if (d < need) continue
      const i = q % F.N, j = (q - i) / F.N
      const s = i * F.H + j * F.H * 1.25
      if (s < bestS) { bestS = s; best = [i * F.H, j * F.H] }
    }
    if (!best) continue
    const r = Math.min(0.62, Math.max(0.26, need * 0.62)) * k
    out.push([best[0], best[1], r, r * 0.6])
  }
  return out
}

// ellipse as compact path data (two arcs), optionally rotated (deg)
export function ellD(cx, cy, rx, ry, rot = 0) {
  const t = rot * Math.PI / 180, c = Math.cos(t), s = Math.sin(t)
  const ax = cx - rx * c, ay = cy - rx * s, bx = cx + rx * c, by = cy + rx * s
  const f = r2
  return `M${f(ax)} ${f(ay)}A${f(rx)} ${f(ry)} ${f(rot)} 1 0 ${f(bx)} ${f(by)}A${f(rx)} ${f(ry)} ${f(rot)} 1 0 ${f(ax)} ${f(ay)}Z`
}
void simplify; void area; void exact; void NN
