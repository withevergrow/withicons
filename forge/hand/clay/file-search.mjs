// forge/hand/clay/file-search.mjs — a plump violet clay page with an orange folded corner and a chunky orange magnifier
// pressed onto it: an open ring (the page shows through the lens) and a fat handle stub. The generated lens was a solid
// orange disc with a thin stalk, which read as a lollipop at 16px; the open ring and heavy handle read as search.
// Lit with the house clay recipe (the same field engine and light as forge/styles/_clay-core.mjs).
import * as F from '../../styles/_clay-field.mjs'
import { ringsD } from '../../styles/_clay-path.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { BASE } from '../../styles/_clay-color.mjs'

const NAME = 'file-search'

// ---- clay kit (mirrors _clay-core.mjs build(): ground, wall, face, inflation bands, glow, lip, specular, details)
const MAT = {
  K: { base: 'c1', deep: 'shadow', hi: 'tint', t0: 0.32, t1: 0.62 },
  A: { base: 'c2', deep: 'shadow', edge: 'c3', hi: 'c2', t0: 0.12, t1: 0.34 },
  S: { base: 'c3', deep: 'shadow', hi: 'c3', t0: 0.25, t1: 0.5 },
}
const REACH = 1.6
const r2 = n => Math.round(n * 100) / 100
const rings = d => parsePath(d, 0.1).map(s => s.pts)
const reg = d => F.region(rings(d), REACH)
const tube = (d, w) => F.strokes(parsePath(d, 0.1).map(s => ({ pts: s.pts, closed: s.closed })), w, REACH)
const mv = (P, dx, dy) => F.shift(P, Math.round(dx / F.H), Math.round(dy / F.H), 1)
const ero = (P, e) => F.offset(F.copy(P), e)
const minus = (A, B) => F.subtract(F.copy(A), B)
const pathD = (P, tol = 0.035, minArea = 0.12, fit = 0.06, dp = 1) => { const L = F.trace(F.copy(P), Math.min(tol, 0.012), minArea); return L.length ? ringsD(L, fit, dp) : '' }
function bboxOf(P) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) if (P[j * F.N + i] < 0) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j }
  return x1 < 0 ? null : { x0: x0 * F.H, y0: y0 * F.H, x1: x1 * F.H, y1: y1 * F.H, w: (x1 - x0) * F.H, h: (y1 - y0) * F.H }
}
function sweep(P, depth) {
  const n = Math.max(1, Math.round(depth / F.H)), G = F.copy(P)
  for (let k = 1; k <= n; k++) {
    const di = Math.round(k * 0.1), dj = k
    for (let j = F.N - 1; j >= dj; j--) {
      const row = j * F.N, src = (j - dj) * F.N - di
      for (let i = Math.max(0, di); i < F.N; i++) { const v = P[src + i]; if (v < G[row + i]) G[row + i] = v }
    }
  }
  return G
}
function specs(P, k) {
  const out = []
  for (const c of F.components(P, true).filter(c => c.area > 1.2).sort((a, b) => b.area - a.area).slice(0, 5)) {
    let best = null, bestS = Infinity, maxD = 0
    for (const q of c.cells) if (-P[q] > maxD) maxD = -P[q]
    const need = Math.min(0.95, maxD * 0.62)
    for (const q of c.cells) {
      if (-P[q] < need) continue
      const i = q % F.N, j = (q - i) / F.N, s = i * F.H + j * F.H * 1.25
      if (s < bestS) { bestS = s; best = [i * F.H, j * F.H] }
    }
    if (best) { const r = Math.min(0.62, Math.max(0.26, need * 0.62)) * k; out.push([best[0], best[1], r, r * 0.6]) }
  }
  return out
}
function ellD(cx, cy, rx, ry, rot = 0) {
  const t = rot * Math.PI / 180, c = Math.cos(t), s = Math.sin(t)
  const ax = cx - rx * c, ay = cy - rx * s, bx = cx + rx * c, by = cy + rx * s
  return `M${r2(ax)} ${r2(ay)}A${r2(rx)} ${r2(ry)} ${r2(rot)} 1 0 ${r2(bx)} ${r2(by)}A${r2(rx)} ${r2(ry)} ${r2(rot)} 1 0 ${r2(ax)} ${r2(ay)}Z`
}
function clay(pieces) {
  F.setClip(null)
  const col = r => `var(--with-clay-${r}, ${BASE[r]})`
  const nodes = [], grads = []
  let gid = 0
  const id = () => `wg-clay-${NAME}-${gid++}`
  const stop = (offset, role, op) => ['stop', op === undefined || op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
  const lin = (x1, y1, x2, y2, s) => { const k = id(); grads.push(['linearGradient', { id: k, x1: r2(x1), y1: r2(y1), x2: r2(x2), y2: r2(y2), gradientUnits: 'userSpaceOnUse' }, s]); return `url(#${k})` }
  const rad = (cx, cy, r, s) => { const k = id(); grads.push(['radialGradient', { id: k, cx: r2(cx), cy: r2(cy), r: r2(r), gradientUnits: 'userSpaceOnUse' }, s]); return `url(#${k})` }
  const push = (P, attrs, tol, minArea, fit, dp) => { const d = pathD(P, tol, minArea, fit, dp); if (d) nodes.push(['path', { d, ...attrs }]) }
  let rimP = null, shineP = null
  const rim = () => rimP || (rimP = lin(5, 4, 19, 21, [stop(0, 'shine', 0.18), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.6)]))
  const shineG = () => shineP || (shineP = rad(6, 4.5, 19, [stop(0, 'shine'), stop(0.55, 'shine', 0.4), stop(1, 'shine', 0.12)]))
  const walls = {}
  const wallPaint = m => { const k = m.base; if (walls[k]) return walls[k]; const L = 20 / (m.t1 - m.t0), y1 = 3 - m.t0 * L; return (walls[k] = lin(0, y1, 0, y1 + L, [stop(0, m.base), stop(1, m.deep)])) }
  // ground shadow under the whole object
  const sil = F.field(1)
  for (const p of pieces) F.union(sil, sweep(p.P, p.depth))
  const gb = bboxOf(sil)
  if (gb) {
    let lx0 = Infinity, lx1 = -Infinity
    const yCut = gb.y1 - Math.max(1.2, gb.h * 0.35)
    for (let j = Math.round(yCut / F.H); j <= Math.round(gb.y1 / F.H); j++) for (let i = 0; i < F.N; i++) if (sil[j * F.N + i] < 0) { if (i * F.H < lx0) lx0 = i * F.H; if (i * F.H > lx1) lx1 = i * F.H }
    const cx = (lx0 + lx1) / 2 + 0.35, cy = Math.min(22.6, gb.y1 + 0.15)
    const rx = Math.max(2.2, (lx1 - lx0) / 2 + 0.5), ry = Math.min(1.35, 0.7 + rx * 0.06)
    nodes.push(['path', { d: ellD(cx, cy, rx * 1.15, ry * 1.35), fill: rad(cx, cy, rx * 1.15, [stop(0, 'shadow', 0.3), stop(0.55, 'shadow', 0.2), stop(1, 'shadow', 0)]), class: 'wm-shadow' }])
    nodes.push(['path', { d: ellD(cx, cy, rx * 0.7, ry * 0.62), fill: col('shadow'), 'fill-opacity': 0.13, class: 'wm-shadow' }])
  }
  pieces.forEach((pc, idx) => {
    const P = pc.P, b = bboxOf(P), m = MAT[pc.mat], cls = pc.cls
    if (!b) return
    const wall = sweep(P, pc.depth), big = Math.max(b.w, b.h)
    let thick = 0
    for (let q = 0; q < P.length; q++) if (-P[q] > thick) thick = -P[q]
    if (pc.onBody) {
      const below = F.field(1)
      for (let q = 0; q < idx; q++) F.union(below, pieces[q].P)
      const cs = F.intersect(F.offset(mv(wall, 0.25, 0.35), -0.12), below)
      F.subtract(cs, wall)
      push(cs, { fill: col('shadow'), 'fill-opacity': pc.candy ? 0.32 : 0.28, class: cls }, 0.05, 0.1)
    }
    push(wall, { fill: wallPaint(m), class: cls })
    const fd = m.edge || m.deep
    const fstops = m.hi === m.base ? [stop(0.45, m.base), stop(1, fd)] : [stop(0, m.hi), stop(0.5, m.base), stop(1, fd)]
    push(P, { fill: rad(b.x0 + b.w * 0.3, b.y0 + b.h * 0.24, big * 1.1 + 1.2, fstops), stroke: rim(), 'stroke-width': pc.candy ? 0.35 : 0.42, 'stroke-linejoin': 'round', class: cls })
    const sh1 = Math.min(1.1, 0.35 + big * 0.05, thick * 0.7)
    push(minus(P, mv(ero(P, sh1 * 0.5), -sh1 * 0.3, -sh1 * 0.43)), { fill: col('shadow'), 'fill-opacity': 0.1, class: cls }, 0.06, 0.15, 0.1)
    push(minus(P, mv(ero(P, sh1), -sh1 * 0.6, -sh1 * 0.85)), { fill: col('shadow'), 'fill-opacity': 0.09, class: cls }, 0.06, 0.15, 0.1)
    const inset = Math.min(0.6, 0.15 + big * 0.045, thick * 0.4)
    const glowF = F.intersect(mv(ero(P, inset), -0.1, -0.14), ero(P, inset * 0.6))
    push(glowF, { fill: rad(b.x0 + b.w * 0.26, b.y0 + b.h * 0.2, Math.max(2.4, big * 0.72), [stop(0, 'shine', pc.candy ? 0.75 : 0.6), stop(0.5, 'shine', 0.22), stop(1, 'shine', 0)]), class: 'wm-shine' }, 0.06, 0.2, 0.1)
    const e1 = Math.min(0.26, thick * 0.22), s1 = Math.min(0.4, thick * 0.35)
    push(minus(ero(P, e1), mv(ero(P, e1), s1 * 0.7, s1)), { fill: shineG(), 'fill-opacity': 0.72, class: 'wm-shine' }, 0.05, 0.1)
    for (const [x, y, rx, ry] of specs(P, pc.candy ? 1 : 0.85)) nodes.push(['path', { d: ellD(x, y, rx, ry, -40), fill: col('shine'), 'fill-opacity': 0.92, class: 'wm-shine' }])
    if (pc.dent) {
      const D = pc.dent
      push(D, { fill: col('shadow'), 'fill-opacity': 0.22, class: cls })
      push(minus(D, mv(D, 0.3, 0.42)), { fill: col('shadow'), 'fill-opacity': 0.3, class: cls }, 0.05, 0.05)
      push(minus(D, mv(D, -0.25, -0.35)), { fill: col('shine'), 'fill-opacity': 0.45, class: 'wm-shine' }, 0.05, 0.05)
    }
    if (pc.pit) {
      const Pt = pc.pit
      push(Pt, { fill: col('ink'), class: cls }, 0.03, 0.05, 0.04, 2)
      push(minus(Pt, mv(Pt, -0.18, -0.28)), { fill: col('shine'), 'fill-opacity': 0.4, class: 'wm-shine' }, 0.04, 0.03)
      for (const c of F.components(Pt)) {
        if (c.area < 0.6) continue
        const w = c.x1 - c.x0, h = c.y1 - c.y0, r = Math.min(w, h)
        nodes.push(['path', { d: ellD(c.x0 + w * 0.36, c.y0 + Math.min(h * 0.3, r * 0.42), r * 0.2, r * 0.2), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
      }
    }
  })
  return [['defs', {}, grads], ...nodes]
}
// ---- end clay kit

// the page: rounded rectangle with its top-right corner cut on the diagonal for the fold
const PAGE = 'M7.2 1.9H13.5Q14 1.9 14.35 2.25L18.85 6.75Q19.2 7.1 19.2 7.6V17.8Q19.2 20.2 16.8 20.2H7.2Q4.8 20.2 4.8 17.8V4.3Q4.8 1.9 7.2 1.9Z'
// the fold: the house L-shaped crease tube tucked into the cut corner
const FOLD = 'M13.9 2.9V5.2Q13.9 7.2 15.9 7.2H18.2'
// the magnifier: an open ring and a fat handle
const RING = 'M8.1 12.9A3.1 3.1 0 1 0 14.3 12.9A3.1 3.1 0 1 0 8.1 12.9Z'
const HANDLE = 'M14 15.7L16.5 18.2'

export default function render() {
  const lens = F.union(tube(RING, 1.8), tube(HANDLE, 2.4))
  return clay([
    { P: reg(PAGE), mat: 'K', cls: 'wm-k', depth: 1.15 },
    { P: tube(FOLD, 2.0), mat: 'A', cls: 'wm-a', depth: 0.5, onBody: true },
    { P: lens, mat: 'A', cls: 'wm-a', depth: 0.5, onBody: true },
  ])
}
